(()=>{
// METEOR (level 221, volcano storm): a meteor targets a spot on the swing path (pink dashed ring) and hits it after 1.6 s;
// a swinging Sharliz inside that ring is burned off the rope. Tap the meteor to smash it.
// A: the Sharliz swings into the ring as the meteor lands -> knocked off.  B: the hand taps the meteor mid-air -> smashed, then a normal perfect drop.
const LEVEL=221,L=SC_lib,INK=L.INK,RED='#ef4444',YEL='#facc15',GRN='#22c55e';
try{const z=ZONES[Math.floor((LEVEL-1)/LPZ)];for(const p of ['w3b_','w3m_','w3f_','w3c_'])pic(p+z.id)}catch(e){}
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
function simSw(xs,dir,T){const r=rangeXs(),sp=speed(),h=1/240;for(let q=0;q<T-1e-9;q+=h){xs+=dir*sp*(1-.42*Math.min(1,(xs/r)**2))*h;if(xs<-r){xs=-r;dir=1}if(xs>r){xs=r;dir=-1}}return {xs,dir}}
function predErr(){if(!swinger)return 99;const h=1/240;let xs=swinger.xs,y=swingY(),vy=0;const yl=yOf(tower.length),G=BH*30*zone().grav*hatFall()*(hz.gravK||1),top=tower[tower.length-1].xs;
  while(y<yl){vy+=G*h;y+=vy*h;xs+=wind*hatWind()*h}return xs-top}
function predErrNext(dt){if(!swinger)return 99;const s=swinger,o={xs:s.xs,dir:s.dir},p=simSw(s.xs,s.dir,dt);s.xs=p.xs;const e=predErr();s.xs=o.xs;return e}
const dtN=()=>Math.min(.033,(SC.s.speed?SC.s.speed(SC.t+1/30):1)/30);
const bestNow=tol=>{const e0=predErr(),e1=predErrNext(dtN());return Math.abs(e0)<tol&&Math.abs(e0)<=Math.abs(e1)};
const noWords=()=>{popups=popups.filter(p=>p.key==='perfect'||p.key==='wow'||p.key==='great');if(swinger&&(swinger.rare||swinger.kind||swinger.gold))Object.assign(swinger,{rare:null,kind:null,gold:false})};
// guard: the game's own queued requestAnimationFrame can still fire once after SC_setup (real clock far behind the virtual one)
// -> one update() with dt of about -10 s (time runs backwards, camera jumps). start() sets last=-1e9 so that stray frame gets
// dt=.033, and every tick puts the frame clock back on the virtual clock before stepping.
function clockGuard(){try{const v=__man.now();if(last>v||last<v-1000)last=v}catch(e){}if(SC.f===0){bump=0;shake=0;if(Math.abs(camY-camTarget())>3)camY=camTarget()}}
const T0=.3,AIM=-.45;   // meteor starts at 0.3 s; the Sharliz will be at xs -0.45 when it lands
function setup(){const M=SC.mem;last=-1e9;
  // SC_setup zeroes partyT, but a perfect-combo party during the setup drops may have left its hue-rotate filter on the canvas
  try{cv.style.filter=''}catch(e){}
  // same plain swinger in A and B (no random rare/gold variant)
  Object.assign(swinger,{rare:null,kind:null,gold:false,color:COLORS[0],mouth:MOUTHS[0],eyes:EYES[0]});for(let i=1;i<tower.length;i++)Object.assign(tower[i],{rare:null,kind:null,gold:false,color:COLORS[1],mouth:MOUTHS[0],eyes:EYES[0]});M.h={x:W*1.05,y:sw().y+BH*3.4};M.press=-9;M.taps=[];SC.mem.camTop=0;
  // choose where the swing starts so the Sharliz is at AIM when the meteor arrives (T0+1.6 s later)
  const r=rangeXs();let best=null;for(let i=0;i<=260;i++){const xs0=-r+2*r*i/260;for(const d of [-1,1]){const p=simSw(xs0,d,T0+1.6);const e=Math.abs(p.xs-AIM);if(!best||e<best.e)best={e,xs0,d}}}
  swinger.xs=best.xs0;swinger.dir=best.d}
function meteorStart(t){const M=SC.mem;if(M.mT!=null||t<T0)return;if(startEvent('meteor')){const m=hz.m.meteor;m.xs=simSw(swinger.xs,swinger.dir,m.warn).xs;M.mT=t;M.tx=xOf(m.xs)}}
// target ring + meteor position in screen coords (same formulas as MECH.meteor)
const tgt=()=>({x:SC.mem.tx,y:sy(swingY())});
const mp=()=>{const m=hz.m.meteor;return m&&MECH.meteor.mpos(m)};
const inView=p=>p&&p.y>SC.mem.camTop+12;

const A={level:LEVEL,floors:4,seed:3,dur:20,fadeOut:true,
  start(){setup()},
  speed(t){const M=SC.mem;if(M.hitT!=null)return t-M.hitT<.6?.4:1;return inView(mp())?.42:1},
  tick(t){const M=SC.mem,I=[];noWords();clockGuard();meteorStart(t);const m=hz.m.meteor;
    if(M.mT!=null&&M.hitT==null){const T=tgt(),sp=t-M.mT;
      if(sp<1)I.push({k:'spot',x:T.x,y:T.y,r:S*1.45,a:.5*Math.min(1,sp/.15)*Math.min(1,(1-sp)/.3)});
      I.push({k:'ring',x:T.x,y:T.y,r:S*1.38,col:RED});
      const p=mp();if(inView(p)){I.push({k:'ring',x:p.x,y:p.y,r:S*.72,col:RED});const dx=T.x-p.x,dy=T.y-p.y,Ln=Math.hypot(dx,dy);
        if(Ln>S*2.6)I.push({k:'arrow',x1:p.x+dx/Ln*S*.85,y1:p.y+dy/Ln*S*.85,x2:T.x-dx/Ln*S*1.5,y2:T.y-dy/Ln*S*1.5,col:RED,p:1})}
      if(m&&m.hit){M.hitT=t;M.hp=T;this.dur=t+1.7}}
    if(M.hitT!=null){const p=Math.min(1,(t-M.hitT)/.45);I.push({k:'ring',x:M.hp.x,y:M.hp.y,r:S*1.2,col:RED});I.push({k:'badge',x:M.hp.x,y:M.hp.y,ok:false,p})}
    return I}};

const B={level:LEVEL,floors:4,seed:3,dur:20,fadeIn:true,fadeOut:true,
  start(){setup()},
  speed(t){const M=SC.mem;if(M.endT!=null)return 1;if(M.dropT!=null)return .7;if(M.smT!=null)return t-M.smT<.5?.5:1;return inView(mp())?.42:1},
  tick(t){const M=SC.mem,I=[],dt=1/30;noWords();clockGuard();meteorStart(t);const m=hz.m.meteor,s=sw();
    if(M.mT!=null&&M.smT==null){const T=tgt(),sp=t-M.mT;
      if(sp<1)I.push({k:'spot',x:T.x,y:T.y,r:S*1.45,a:.5*Math.min(1,sp/.15)*Math.min(1,(1-sp)/.3)});
      I.push({k:'ring',x:T.x,y:T.y,r:S*1.38,col:RED});
      // intercept point: where the meteor will be at 78% of its flight
      if(!M.P&&m){const k=.78;M.P={x:T.x+(1-k)*W*.6,y:T.y-(1-k)*H*.6}}
      const p=mp();
      if(inView(p))I.push({k:'ring',x:p.x,y:p.y,r:S*.72,col:YEL});
      if(M.P){const tx=M.P.x+3,ty=M.P.y+3,kk=inView(p)?7:3.2;M.h.x+=(tx-M.h.x)*Math.min(1,dt*kk);M.h.y+=(ty-M.h.y)*Math.min(1,dt*kk);
        if(p&&inView(p)&&Math.hypot(p.x-M.h.x,p.y-M.h.y)<6&&t-M.press>.3){M.press=t;M.taps.push({x:M.h.x,y:M.h.y,t});if(SC_tap(M.h.x,M.h.y)){M.smT=t;M.sp={x:p.x,y:p.y}}}}}
    if(M.smT!=null){const q=t-M.smT;
      // after the check has been seen: pan down so the whole landing (and the camera step after it) stays in the picture
      if(q>.9){const ct=Math.max(0,s.y-BH*.95);SC.mem.camTop+=(ct-SC.mem.camTop)*Math.min(1,dt*3)}
      // ring + check stay where the meteor was smashed (fixed in the picture), then fade before the drop
      const ca=Math.max(0,Math.min(1,(1.4-q)/.3)),cy=M.sp.y+SC.mem.camTop;
      if(ca>0){I.push({k:'fn',f:g=>{g.save();g.globalAlpha=ca;L.ring(g,M.sp.x,cy,S*.72+Math.min(1,q/.4)*S*.35,GRN,t);L.badge(g,M.sp.x,cy,true,Math.min(1,Math.max(0,q-.12)/.45));g.restore()}})}
      M.h.x+=(W*1.05-M.h.x)*Math.min(1,dt*2.5);M.h.y+=(s.y+BH*3.8-M.h.y)*Math.min(1,dt*2.5);
      if(M.dropT==null&&q>1.25&&bestNow(.06)){M.p0=lv.perfect;drop();M.dropT=t}
      if(M.dropT!=null&&M.endT==null&&!dropping){M.endT=t;this.dur=t+1.3}}
    for(const q of M.taps){const p=(t-q.t)/.45;if(p<1)I.push({k:'ripple',x:q.x,y:q.y,p})}
    I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)});
    return I}};
// warm-up scene with no frames: starts the level once so its own storm art is loaded (and the game's last queued
// real-time frame has fired) before scene A is set up
const W0={level:LEVEL,floors:0,dur:0,tick(){return []}};
SC.scenes=[W0,A,B];
})();
