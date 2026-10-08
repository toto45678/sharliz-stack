(()=>{
// Giant & Tiny (level 73): a tiny Sharliz only stays when it lands within 0.4 of the middle (normal 0.5, giant 0.6);
const RED='#ef4444',GOOD='#22c55e',TGT='#facc15',L=SC_lib;
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const topP=()=>{const n=tower.length,s=tower[n-1];return {x:xOf(s.xs)+swayOffset(n-1,n),y:sy(yOf(n-1))}};
// While rec.py waits after SC_setup the page's real-time loop runs frame() once, so the next frame gets a big negative dt
// (shake/bump jump, timers run backwards). Every scene therefore sets itself up on its first video frame (not in start())
// and re-syncs the game's frame clock (`last`) to the virtual one.
function fresh(){last=__man.now();partyT=0;try{cv.style.filter=''}catch(e){}shake=0;bump=0;slowmoT=0;freeze=0;camY=camTarget();particles=[];popups=[];kaleido=[]}
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
  if(best){swinger.xs=best.x0;swinger.dir=best.d0;SC.mem.after=time+T+best.e-.12}return best}
// no words in the video: keep only the landing feedback (Perfect / Great), as in the bats video (other keyed popups such as
// 'Slipped!' are born dead, so they are never drawn; plain messages go to the toast lane below the crop)
const keepPop=p=>p.key==='perfect'||p.key==='wow'||p.key==='great';
if(!window.__mvPop){window.__mvPop=1;const _sp=window.stackPopup;window.stackPopup=function(p){if(p&&!keepPop(p))p.life=-1;return _sp.apply(this,arguments)}}
const onlyLanding=()=>{popups=popups.filter(keepPop)};
// tower of 3 straight floors, built the way 'continue from checkpoint' does (SC_setup's perfect-drop build can loop forever when
// the fixed-step swing never samples within 0.02 of the middle, e.g. level 53), then the same colours in both scenes
function paint(kind){while(tower.length<4)tower.push(Object.assign(makeSharliz(),{xs:0}));balance=0;swayK=0;wind=windFor(tower.length);swinger.kind=kind||null;delete swinger.sz;swinger.wt=1;swinger.gold=false;swinger.rare=null;swinger.color=COLORS[0];const cs=[COLORS[1],COLORS[3],COLORS[2],COLORS[1]];tower.forEach((s,i)=>{if(i){s.color=cs[i%cs.length]}})}
// pulsing landing target on the head of the top piece (half-width rx)
function target(g,col,t,rx,ry){const tp=topP(),y=tp.y-BH*.5,q=(t*1.6)%1;ry=ry||S*.14;g.save();g.lineWidth=8;g.strokeStyle=L.INK;g.beginPath();g.ellipse(tp.x,y,rx,ry,0,0,7);g.stroke();g.lineWidth=4.5;g.strokeStyle=col;g.stroke();
  g.globalAlpha=1-q;g.lineWidth=3;g.beginPath();g.ellipse(tp.x,y,rx*(1+q*.45),ry*(1+q*.45),0,0,7);g.stroke();
  g.globalAlpha=1;g.fillStyle=col;g.lineWidth=2.5;g.strokeStyle=L.INK;g.beginPath();g.ellipse(tp.x,y,4.5,3,0,0,7);g.fill();g.stroke();g.restore()}
const handTap=(M,t,I)=>{if(M.press>0&&t-M.press<.45)I.push({k:'ripple',x:M.h.x,y:M.h.y,p:(t-M.press)/.45});I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.2)})};
// giants are heavy (weight 2) but have the widest landing window.
// target half-width = the real 'stays on' limit (landTol m) of that kind
const winRx=k=>S*landTol({kind:k})[2];
function init(T,o){paint('tiny');swinger.sz=.74;swinger.wt=.5;tower.forEach((s,i)=>{if(i){s.kind=null;delete s.sz;s.wt=1}});fresh();placeFor(T,o)}
const ringR=()=>S*.8*((swinger&&swinger.sz)||1),cy=()=>BH*(1-((swinger&&swinger.sz)||1))*.5;
// scene A: tiny Sharliz dropped a little off the middle (a normal one would still stay) -> it falls off
const A={level:73,floors:0,dur:9,seed:9,fadeOut:true,
  speed(t){const M=SC.mem;if(M.landT!=null)return t-M.landT<.9?.45:1;if(M.dropT!=null)return .5;return 1},
  tick(t){const M=SC.mem,I=[];if(!M.init){M.init=1;init(.95,.47)}onlyLanding();const s=sw();
    if(M.landT==null)I.push({k:'fn',f:(g,tt)=>target(g,TGT,tt,winRx('tiny'))});
    if(M.dropT==null){
      if(swinger&&swinger.kind==='tiny')I.push({k:'ring',x:s.x,y:s.y+cy(),r:ringR(),col:RED});
      if(t>.5&&dropAt(M,[.47,-.47]))M.dropT=t}
    else if(M.landT==null){
      if(dropping)I.push({k:'ring',x:xOf(dropping.xs),y:sy(dropping.y)+BH*.13,r:S*.6,col:RED});
      else{M.landT=t;M.lx=xOf(tower[tower.length-1].xs+M.off);M.lwy=yOf(tower.length)+BH*.13;M.dir=Math.sign(M.off)||1;this.dur=t+2.1}}
    if(M.landT!=null){const p=Math.min(1,(t-M.landT)/.45),y=sy(M.lwy);
      I.push({k:'ring',x:M.lx,y:y,r:S*.6,col:RED});
      I.push({k:'badge',x:M.lx-M.dir*S*1.45,y:y-BH*.75,ok:false,p})}
    return I}};
// scene B: tiny Sharliz dropped right on the middle -> Perfect; then a giant comes and lands easily
const B={level:73,floors:0,dur:12,seed:9,fadeIn:true,fadeOut:true,
  speed(t){const M=SC.mem;if(M.land2!=null)return 1;if(M.landT!=null)return t-M.landT<.5?.6:1;if(M.dropT!=null)return .75;return t<.5?1:.5},
  tick(t){const M=SC.mem,I=[];if(!M.init){M.init=1;init(.95,0);M.press=-9;M.h={x:W*.8,y:sw().y+330}}onlyLanding();const s=sw();
    if(M.landT==null){const p=predDx(),ok=M.dropT!=null||(p!=null&&Math.abs(p)<.06);
      I.push({k:'fn',f:(g,tt)=>target(g,ok?GOOD:TGT,tt,winRx('tiny'))});
      if(M.dropT==null&&t>.4&&dropAt(M,0)){M.dropT=t;M.press=t}
      if(M.dropT!=null&&!dropping){M.landT=t;M.bx=topP().x+S*1.3;M.bwy=yOf(tower.length-1)-BH*.75;hz.forceKind='giant'}}
    else if(M.land2==null){const q=t-M.landT;
      if(q<1.2){const tp=topP();I.push({k:'ring',x:tp.x,y:tp.y+BH*.13,r:S*.65,col:GOOD})}
      if(q<1.5)I.push({k:'badge',x:M.bx,y:sy(M.bwy),ok:true,p:Math.min(1,q/.45)*Math.min(1,(1.5-q)/.2)});
      if(swinger&&swinger.kind==='giant'&&!M.gcol){M.gcol=1;swinger.color=COLORS[2]}   // the giant in another colour than the tiny
      const gi=swinger&&swinger.kind==='giant'&&!swinger.entering;
      if(gi||M.drop2!=null){const p=predDx(),ok=M.drop2!=null||(p!=null&&Math.abs(p)<.3);I.push({k:'fn',f:(g,tt)=>target(g,ok?GOOD:TGT,tt,winRx('giant'))})}
      if(M.drop2==null&&gi&&dropAt(M,.22)){M.drop2=t;M.press=t}
      if(M.drop2!=null&&!dropping){M.land2=t;M.bx2=xOf(tower[0].xs)+S*1.75;M.bwy2=yOf(tower.length-1)-BH*.8;this.dur=t+1.6}}
    else{const q=t-M.land2,tp=topP();if(q<1.2)I.push({k:'ring',x:tp.x,y:tp.y,r:S*1.05,col:GOOD});I.push({k:'badge',x:M.bx2,y:sy(M.bwy2),ok:true,p:Math.min(1,q/.45)})}
    if(M.land2!=null&&t-M.land2>.6){M.h.x+=(W*.95-M.h.x)*.08;M.h.y+=(s.y+560-M.h.y)*.08}
    handTap(M,t,I);
    return I}};
SC.scenes=[A,B];
})();
