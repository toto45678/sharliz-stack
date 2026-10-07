(()=>{
// Earthquake (level 63): 1.4 s rumble warning, then the tower shakes; when the quake ends the top Sharliz is knocked off.
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
// A Perfect landing after the warning stops the quake.
function init(){paint(null);fresh();startEvent('quake');hz.quake.dur=1.6}   // real quake lasts 3.4 s; shortened so the video has no dead time
const bullRx=()=>S*landTol({})[0]+9;                                       // bullseye = the Perfect window (+ a few px so it reads)
// comic shake marks on both sides of the top of the tower (jitter while the quake is on)
function shakeMarks(g,t,col,a){const q=hz.quake;if(!q)return;const tp=topP(),k=q.t<q.warn?.55:1,j=Math.sin(t*60)*3*k;g.save();g.globalAlpha=a;g.lineCap='round';
  for(const sd of [-1,1])for(let i=0;i<3;i++){const x=tp.x+sd*(S*.78+i*11)+j*sd,r=BH*(.22+i*.09);
    for(const [w,c] of [[8,L.INK],[4.5,col]]){g.lineWidth=w;g.strokeStyle=c;g.beginPath();g.arc(x-sd*r*.55,tp.y,r,sd>0?-.75:Math.PI-.75,sd>0?.75:Math.PI+.75);g.stroke()}}
  g.restore()}
// scene A: no Perfect landing -> when the quake ends the top Sharliz is shaken off
const A={level:63,floors:0,dur:9,seed:3,fadeOut:true,
  speed(t){const M=SC.mem,q=hz.quake;if(M.knockT!=null)return t-M.knockT<1?.4:1;if(M.init&&q&&q.t>q.warn+q.dur-.25)return .4;return 1},
  tick(t){const M=SC.mem,I=[];if(!M.init){M.init=1;init();M.n=tower.length}onlyLanding();const q=hz.quake;
    if(M.knockT==null){
      if(q){const tp=topP();I.push({k:'fn',f:(g,tt)=>shakeMarks(g,tt,RED,Math.min(1,q.t/.25))});if(q.t>.3)I.push({k:'ring',x:tp.x,y:tp.y,r:S*.8,col:RED});M.lx=tp.x;M.lwy=yOf(tower.length-1)}
      if(tower.length<M.n){M.knockT=t;const b=bodies[bodies.length-1];M.dir=b&&b.vx?Math.sign(b.vx):1;this.dur=t+1.9}}
    if(M.knockT!=null){const p=Math.min(1,(t-M.knockT)/.45),y=sy(M.lwy);
      I.push({k:'ring',x:M.lx,y:y,r:S*.8,col:RED});
      I.push({k:'badge',x:M.lx-M.dir*S*1.3,y:y-BH*.55,ok:false,p})}
    return I}};
// scene B: same quake; tap when the Sharliz is right above the middle -> the Perfect landing stops the shaking
const B={level:63,floors:0,dur:9,seed:3,fadeIn:true,fadeOut:true,
  speed(t){const M=SC.mem,q=hz.quake;if(M.landT!=null)return t-M.landT<.6?.5:1;if(M.init&&q&&q.t>1.8)return .5;return 1},
  tick(t){const M=SC.mem,I=[];if(!M.init){M.init=1;init();placeFor(2.0,0);M.press=-9;M.h={x:W*.8,y:sw().y+330}}onlyLanding();const s=sw(),q=hz.quake;
    if(M.landT==null){const p=predDx(),ok=M.dropT!=null||(p!=null&&Math.abs(p)<.06);
      if(q)I.push({k:'fn',f:(g,tt)=>shakeMarks(g,tt,RED,Math.min(1,q.t/.25))});
      I.push({k:'fn',f:(g,tt)=>target(g,ok?GOOD:TGT,tt,bullRx(),S*.12)});
      if(M.dropT==null&&q&&dropAt(M,0)){M.dropT=t;M.press=t}
      if(M.dropT!=null&&!dropping){M.landT=t;M.calm=!hz.quake;M.bx=topP().x+S*1.3;M.bwy=yOf(tower.length-1)-BH*.8;this.dur=t+2}}
    else{const tp=topP(),p=Math.min(1,(t-M.landT)/.45);if(t-M.landT<1.3)I.push({k:'ring',x:tp.x,y:tp.y,r:S*.8,col:GOOD});I.push({k:'badge',x:M.bx,y:sy(M.bwy),ok:true,p})}
    if(M.landT!=null&&t-M.landT>.7){M.h.x+=(W*.95-M.h.x)*.08;M.h.y+=(s.y+560-M.h.y)*.08}
    handTap(M,t,I);
    SC.dbg={t:+t.toFixed(2),qt:q?+q.t.toFixed(2):null,calm:M.calm,st:state};
    return I}};
SC.scenes=[A,B];
})();
