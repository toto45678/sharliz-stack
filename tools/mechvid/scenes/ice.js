(()=>{
// Ice Sharliz (level 43): an ice piece only sticks on a Great or Perfect landing; a wider landing slides off (heart lost).
const RED='#ef4444',GOOD='#22c55e',TGT='#facc15',L=SC_lib;
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const topP=()=>{const n=tower.length,s=tower[n-1];return {x:xOf(s.xs)+swayOffset(n-1,n),y:sy(yOf(n-1))}};
// While rec.py waits after SC_setup the page's real-time loop runs frame() once, so the next frame gets a big negative dt
// (shake/bump jump, timers run backwards). Every scene therefore sets itself up on its first video frame (not in start())
// and re-syncs the game's frame clock (`last`) to the virtual one.
function fresh(){last=__man.now();shake=0;bump=0;slowmoT=0;freeze=0;camY=camTarget();particles=[];popups=[];kaleido=[]}
// predicted landing offset (xs units) if the player tapped now: same fall as update() + worldTwist()
const predDx=()=>{if(state!=='aim'||!swinger||swinger.entering)return null;const top=tower[tower.length-1],z=baseId(zone()),dt=1/240,ty=yOf(tower.length);let y=swingY(),vy=0,xs=swinger.xs,tt=time;
  const g=BH*30*zone().grav*(swinger.kind==='balloon'?.42:1)*hatFall()*(hz.gravK||1),wk=wind*hatWind();
  for(let i=0;i<2000&&y<ty;i++){vy+=g*dt;if(z==='space')vy=Math.min(vy,BH*9);y+=vy*dt;xs+=wk*dt;if(z==='ocean')xs+=Math.sin(tt*.9)*.28*dt;tt+=dt}return xs-top.xs};
// drop on the first frame the predicted landing crosses one of the offsets `os` (+ a sub-frame nudge so the outcome is exact)
function dropAt(M,os){const p=predDx();if(p==null){M.lastP=null;return false}const prev=M.lastP;M.lastP=p;if(prev==null||(M.after!=null&&time<M.after))return false;
  for(const o of [].concat(os))if((prev-o)*(p-o)<=0||Math.abs(p-o)<.006){swinger.xs+=o-p;M.off=o;drop();return true}return false}
// start the swinger so that one of its passes over landing offset `o` comes T seconds of game time from now (same motion as
// update()); dropAt() then ignores earlier passes
function placeFor(T,o){const r=rangeXs(),sp=speed(),drift=predDx()-(swinger.xs-tower[tower.length-1].xs),xT=tower[tower.length-1].xs+o-drift;let best=null;
  for(let k=0;k<=160;k++){const x0=-r+2*r*k/160;for(const d0 of [1,-1]){let x=x0,d=d0,tt=0,prev=x;const dt=1/240;
    for(let i=0;i<240*4;i++){x+=d*sp*(1-.42*Math.min(1,(x/r)**2))*dt;if(x<-r){x=-r;d=1}if(x>r){x=r;d=-1}tt+=dt;
      if(tt>.15&&(prev-xT)*(x-xT)<=0&&(!best||Math.abs(tt-T)<Math.abs(best.e)))best={x0,d0,e:tt-T};prev=x}}}
  if(best){swinger.xs=best.x0;swinger.dir=best.d0;SC.mem.after=time+T+best.e-.12}SC.mem.pf=best&&{x0:+best.x0.toFixed(3),d0:best.d0,e:+best.e.toFixed(3),xT:+xT.toFixed(3)};return best}
SC._pd=()=>predDx();
// no words in the video: keep only the landing feedback (Perfect / Great), as in the bats video
const onlyLanding=()=>{popups=popups.filter(p=>p.key==='perfect'||p.key==='wow'||p.key==='great')};
// tower of 3 straight floors, built the way 'continue from checkpoint' does (SC_setup's perfect-drop build can loop forever when
// the fixed-step swing never samples within 0.02 of the middle, e.g. level 53), then the same colours in both scenes
function paint(kind){while(tower.length<4)tower.push(Object.assign(makeSharliz(),{xs:0}));balance=0;swayK=0;wind=windFor(tower.length);swinger.kind=kind||null;delete swinger.sz;swinger.wt=1;swinger.gold=false;swinger.rare=null;swinger.color=COLORS[0];const cs=[COLORS[1],COLORS[3],COLORS[2],COLORS[1]];tower.forEach((s,i)=>{if(i){s.color=cs[i%cs.length]}})}
// pulsing landing target on the head of the top piece (half-width rx)
function target(g,col,t,rx,ry){const tp=topP(),y=tp.y-BH*.5,q=(t*1.6)%1;ry=ry||S*.14;g.save();g.lineWidth=8;g.strokeStyle=L.INK;g.beginPath();g.ellipse(tp.x,y,rx,ry,0,0,7);g.stroke();g.lineWidth=4.5;g.strokeStyle=col;g.stroke();
  g.globalAlpha=1-q;g.lineWidth=3;g.beginPath();g.ellipse(tp.x,y,rx*(1+q*.45),ry*(1+q*.45),0,0,7);g.stroke();
  g.globalAlpha=1;g.fillStyle=col;g.lineWidth=2.5;g.strokeStyle=L.INK;g.beginPath();g.ellipse(tp.x,y,4.5,3,0,0,7);g.fill();g.stroke();g.restore()}
const handTap=(M,t,I)=>{if(M.press>0&&t-M.press<.45)I.push({k:'ripple',x:M.h.x,y:M.h.y,p:(t-M.press)/.45});I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.2)})};
const iceRx=()=>S*landTol({kind:'ice'})[1]+4;        // target half-width = the real 'ice sticks' limit (Great window)
function init(T,o){paint('ice');fresh();placeFor(T,o)}
// scene A: the ice piece lands a bit off the middle (a normal piece would stay there) -> it slides off
const A={level:43,floors:0,dur:9,seed:11,fadeOut:true,
  speed(t){const M=SC.mem;return M.dropT!=null&&M.landT==null?.5:1},
  tick(t){const M=SC.mem,I=[];if(!M.init){M.init=1;init(1.05,.34)}onlyLanding();const s=sw();
    if(M.landT==null)I.push({k:'fn',f:(g,tt)=>target(g,TGT,tt,iceRx())});
    if(M.dropT==null){
      if(swinger&&swinger.kind==='ice')I.push({k:'ring',x:s.x,y:s.y,r:S*.8,col:RED});
      if(t>.5&&dropAt(M,.34))M.dropT=t}
    else if(M.landT==null){
      if(dropping)I.push({k:'ring',x:xOf(dropping.xs),y:sy(dropping.y),r:S*.8,col:RED});
      else{M.landT=t;const b=bodies[bodies.length-1];M.dir=b&&b.vx?Math.sign(b.vx):Math.sign(M.off);M.lx=xOf(tower[tower.length-1].xs+M.off);M.lwy=yOf(tower.length);this.dur=t+2.2}}
    if(M.landT!=null){const p=Math.min(1,(t-M.landT)/.45),y=sy(M.lwy);
      I.push({k:'ring',x:M.lx,y:y,r:S*.72,col:RED});
      I.push({k:'arrow',x1:M.lx+M.dir*S*.25,y1:y+BH*.15,x2:M.lx+M.dir*S*1.75,y2:y+BH*.42,col:RED,p:Math.min(1,(t-M.landT)/.3)});
      I.push({k:'badge',x:M.lx-M.dir*S*1.0,y:y-BH*.8,ok:false,p})}
    return I}};
// scene B: same ice piece, tap when it is right above the middle -> Perfect, it sticks
const B={level:43,floors:0,dur:9,seed:11,fadeIn:true,fadeOut:true,
  speed(t){const M=SC.mem;if(M.landT!=null)return t-M.landT<.6?.5:1;return t<.5?1:.5},
  tick(t){const M=SC.mem,I=[];if(!M.init){M.init=1;init(.95,0);M.press=-9;M.h={x:W*.78,y:sw().y+295}}onlyLanding();const s=sw();
    if(M.landT==null){const p=predDx(),ok=M.dropT!=null||(p!=null&&Math.abs(p)<.06);
      I.push({k:'fn',f:(g,tt)=>target(g,ok?GOOD:TGT,tt,iceRx())});
      if(M.dropT==null&&t>.4&&dropAt(M,0)){M.dropT=t;M.press=t}
      if(M.dropT!=null&&!dropping){M.landT=t;M.bx=topP().x+S*1.3;M.bwy=yOf(tower.length-1)-BH*.8;this.dur=t+2.1}}
    else{const tp=topP(),p=Math.min(1,(t-M.landT)/.45);if(t-M.landT<1.3)I.push({k:'ring',x:tp.x,y:tp.y,r:S*.8,col:GOOD});I.push({k:'badge',x:M.bx,y:sy(M.bwy),ok:true,p})}
    if(M.landT!=null&&t-M.landT>.7){M.h.x+=(W*.95-M.h.x)*.08;M.h.y+=(s.y+560-M.h.y)*.08}
    handTap(M,t,I);
    return I}};
SC.scenes=[A,B];
})();
