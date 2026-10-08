(()=>{
// FREEZE (level 201, snow storm): the swinging Sharliz freezes for 1.3 s, then swings 1.35x faster for 2.2 s.
// A: it freezes past the tower, the player taps anyway -> it drops straight down beside the tower -> miss.
// B: same freeze, the player waits for the ice to melt, then drops when it is right above the tower -> perfect.
const LEVEL=201,L=SC_lib,INK=L.INK,RED='#ef4444',YEL='#facc15',GRN='#22c55e',ICE='#8fd7f2';
try{const z=ZONES[Math.floor((LEVEL-1)/LPZ)];for(const p of ['w3b_','w3m_','w3f_','w3c_'])pic(p+z.id)}catch(e){}
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const topP=()=>topScreen();
// landing offset (piece xs - top xs) if the swinger is dropped after `lead` seconds of game time
function predErr(lead=0){if(!swinger)return 99;const r=rangeXs(),sp=speed(),h=1/240;let xs=swinger.xs,dir=swinger.dir,fr=swinger.frozen||0,fa=swinger.fast||0;
  for(let q=0;q<lead-1e-9;q+=h){const mul=fr>0?0:fa>0?1.35:1;xs+=dir*sp*mul*(1-.42*Math.min(1,(xs/r)**2))*h;if(xs<-r){xs=-r;dir=1}if(xs>r){xs=r;dir=-1}if(fr>0){fr-=h;if(fr<=0)fa=2.2}else if(fa>0)fa-=h}
  let y=swingY(),vy=0;const yl=yOf(tower.length),G=BH*30*zone().grav*hatFall()*(hz.gravK||1),top=tower[tower.length-1].xs;
  while(y<yl){vy+=G*h;y+=vy*h;xs+=wind*hatWind()*h}return xs-top}
const dtN=()=>Math.min(.033,(SC.s.speed?SC.s.speed(SC.t+1/30):1)/30);
const bestNow=tol=>{const e0=predErr(0),e1=predErr(dtN());return Math.abs(e0)<tol&&Math.abs(e0)<=Math.abs(e1)};
function timer(g,x,y,r,f){g.save();g.lineCap='round';g.lineWidth=12;g.strokeStyle='rgba(26,16,32,.35)';g.beginPath();g.arc(x,y,r,0,7);g.stroke();
  if(f>0){const a0=-Math.PI/2,a1=a0+f*Math.PI*2;g.lineWidth=12;g.strokeStyle=INK;g.beginPath();g.arc(x,y,r,a0,a1);g.stroke();g.lineWidth=7;g.strokeStyle=ICE;g.beginPath();g.arc(x,y,r,a0,a1);g.stroke()}g.restore()}
function speedLines(g,x,y,dir,a){g.save();g.globalAlpha=a;g.lineCap='round';for(const [dy,len] of [[-22,40],[0,60],[22,40]]){const x0=x-dir*(S*.8),x1=x0-dir*len;
  g.lineWidth=10;g.strokeStyle=INK;g.beginPath();g.moveTo(x0,y+dy);g.lineTo(x1,y+dy);g.stroke();g.lineWidth=5;g.strokeStyle='#fff';g.beginPath();g.moveTo(x0,y+dy);g.lineTo(x1,y+dy);g.stroke()}g.restore()}
function dashed(g,x1,y1,x2,y2,col,a=1){g.save();g.globalAlpha=a;g.lineCap='round';g.setLineDash([10,9]);g.lineWidth=8;g.strokeStyle=INK;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();
  g.lineWidth=4;g.strokeStyle=col;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.restore()}
const noWords=()=>{popups=popups.filter(p=>p.key==='perfect'||p.key==='wow'||p.key==='great')};
// guard: the game's own queued requestAnimationFrame can still fire once after SC_setup (real clock far behind the virtual one)
// -> one update() with dt of about -10 s (time runs backwards, camera jumps). start() sets last=-1e9 so that stray frame gets
// dt=.033, and every tick puts the frame clock back on the virtual clock before stepping.
function clockGuard(){try{const v=__man.now();if(last>v||last<v-1000)last=v}catch(e){}if(SC.f===0){bump=0;shake=0;if(Math.abs(camY-camTarget())>3)camY=camTarget()}}

function setup(){const M=SC.mem;last=-1e9;
  // SC_setup zeroes partyT, but a perfect-combo party during the setup drops may have left its hue-rotate filter on the canvas
  try{cv.style.filter=''}catch(e){}
  // same plain yellow swinger in A and B (no random rare/gold variant; yellow stands out from the pink tower and the blue ice)
  Object.assign(swinger,{rare:null,kind:null,gold:false,color:COLORS[0],mouth:MOUTHS[0],eyes:EYES[0]});for(let i=1;i<tower.length;i++)Object.assign(tower[i],{rare:null,kind:null,gold:false,color:COLORS[2],mouth:MOUTHS[0],eyes:EYES[0]});M.h={x:W*.95,y:sw().y+BH*4.6};M.press=-9;M.taps=[];
  // start at the left end of the swing, heading right: it passes over the tower, then freezes on the far side
  swinger.xs=-rangeXs()*.98;swinger.dir=1}
// shared first half: swing over the tower, freeze once it would land well past it
function freezePhase(t,I){const M=SC.mem;
  if(M.fT==null){if(swinger&&!swinger.entering&&state==='aim'&&(swinger.xs-tower[tower.length-1].xs)*swinger.dir>0&&predErr(0)*swinger.dir>.7&&startEvent('freeze')){M.fT=t}return false}
  const s=sw(),fr=swinger&&swinger.frozen>0?swinger.frozen:0,sp=t-M.fT;
  if(swinger&&fr>0){if(sp<1.1)I.push({k:'spot',x:s.x,y:s.y,r:BH*.95,a:.5*Math.min(1,sp/.15)*Math.min(1,(1.1-sp)/.3)});
    I.push({k:'fn',f:g=>timer(g,s.x,s.y,BH*.78,fr/1.3)})}
  return true}
function handTo(tx,ty,k=7){const M=SC.mem,dt=1/30;M.h.x+=(tx-M.h.x)*Math.min(1,dt*k);M.h.y+=(ty-M.h.y)*Math.min(1,dt*k)}
const thumb=()=>({x:W*.76,y:sw().y+BH*2.25});
function handAndRipples(t,I){const M=SC.mem;for(const q of M.taps){const p=(t-q.t)/.45;if(p<1)I.push({k:'ripple',x:q.x,y:q.y,p})}
  I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)})}

const A={level:LEVEL,floors:4,seed:5,dur:20,fadeOut:true,
  start(){setup()},
  speed(t){const M=SC.mem;if(M.endT!=null)return t-M.endT<.6?.5:1;return M.fT!=null?.45:1},
  tick(t){const M=SC.mem,I=[];noWords();clockGuard();
    const on=freezePhase(t,I);
    if(M.dropT==null){const th=thumb();handTo(th.x,th.y,on?6:3);
      if(on&&swinger&&swinger.frozen>0&&1.3-swinger.frozen>.5&&Math.hypot(M.h.x-th.x,M.h.y-th.y)<14){M.h0=hearts;M.n0=tower.length;M.rel=sw();drop();M.dropT=t;M.press=t;M.taps.push({x:M.h.x,y:M.h.y,t})}}
    if(M.dropT!=null&&M.endT==null){const ly=sy(yOf(tower.length));
      if(dropping){M.last={x:xOf(dropping.xs),y:sy(dropping.y)};I.push({k:'fn',f:g=>dashed(g,M.rel.x,M.rel.y+BH*.55,M.rel.x,ly+BH*.25,RED,.9)});I.push({k:'ring',x:M.last.x,y:M.last.y,r:BH*.62,col:RED})}
      else if(hearts<M.h0||tower.length===M.n0){M.endT=t;M.miss={x:M.last?M.last.x:M.rel.x,y:ly};this.dur=t+1.6}}
    if(M.endT!=null){const p=Math.min(1,(t-M.endT)/.45);I.push({k:'ring',x:M.miss.x,y:M.miss.y,r:BH*.6,col:RED});I.push({k:'badge',x:M.miss.x,y:M.miss.y-BH*.95,ok:false,p});
      handTo(W*.95,sw().y+BH*4.6,3)}
    handAndRipples(t,I);return I}};

const B={level:LEVEL,floors:4,seed:5,dur:20,fadeIn:true,fadeOut:true,
  start(){setup()},
  speed(t){const M=SC.mem;if(M.endT!=null)return t-M.endT<.5?.6:1;if(M.dropT!=null)return .6;if(M.thawT!=null)return 1;return M.fT!=null?.85:1},
  tick(t){const M=SC.mem,I=[];noWords();clockGuard();
    const on=freezePhase(t,I),s=sw(),tp=topP();
    if(M.dropT==null){const th=thumb();handTo(th.x+16,th.y+30,on?5:3);   // hovers, waiting
      if(on&&swinger&&!(swinger.frozen>0)){M.thawT=M.thawT??t;const d=swinger.dir,a=Math.min(1,(t-M.thawT)/.15);I.push({k:'fn',f:g=>speedLines(g,s.x,s.y,d,a)})}
      if(M.thawT!=null)I.push({k:'ring',x:tp.x,y:tp.y,r:BH*.62,col:YEL});
      if(M.thawT!=null&&t-M.thawT>.1&&bestNow(.065)){M.h0=hearts;M.p0=lv.perfect;M.n0=tower.length;M.rel=s;drop();M.dropT=t;M.press=t;M.taps.push({x:M.h.x,y:M.h.y,t})}}
    if(M.dropT!=null&&M.endT==null){if(dropping){const dx=xOf(dropping.xs),dy=sy(dropping.y);I.push({k:'fn',f:g=>dashed(g,M.rel.x,M.rel.y+BH*.55,tp.x,tp.y-BH*.5,GRN,.9)});I.push({k:'ring',x:dx,y:dy,r:BH*.62,col:GRN})}
      else{M.endT=t;M.ok=lv.perfect>M.p0;this.dur=t+1.6}}
    if(M.endT!=null){const p=Math.min(1,(t-M.endT)/.45);I.push({k:'ring',x:tp.x,y:tp.y,r:BH*.62,col:GRN});I.push({k:'badge',x:tp.x+(xOf(tower[tower.length-1].xs)<W/2?-1:1)*BH*1.15,y:tp.y-BH*.55,ok:true,p});/* the game puts Perfect! right of the piece when its x<W/2, else left: the check goes on the other side */handTo(W*.95,s.y+BH*4.6,3)}
    handAndRipples(t,I);return I}};
// warm-up scene with no frames: starts the level once so its own storm art is loaded (and the game's last queued
// real-time frame has fired) before scene A is set up
const W0={level:LEVEL,floors:0,dur:0,tick(){return []}};
SC.scenes=[W0,A,B];
})();
