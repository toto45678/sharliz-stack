(()=>{
// LOW GRAVITY (level 231, space storm): for 4.4 s gravity is x0.3 -> pieces fall slowly, so the wind pushes them much further.
// A: the player drops right above the tower (the usual straight line) -> the piece floats down, drifts with the wind -> miss.
// B: the player lets go upwind, where the long drift carries it onto the tower (curved path shown) -> perfect.
const LEVEL=231,L=SC_lib,INK=L.INK,RED='#ef4444',YEL='#facc15',GRN='#22c55e',WINDC='#e0f2fe';
try{const z=ZONES[Math.floor((LEVEL-1)/LPZ)];for(const p of ['w3b_','w3m_','w3f_','w3c_'])pic(p+z.id)}catch(e){}
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const gust=(tm,ws)=>Math.sin(tm*.33+ws)*.75+Math.sin(tm*1.1+ws*2)*.25;
function simSw(xs,dir,T){const r=rangeXs(),sp=speed(),h=1/240;for(let q=0;q<T-1e-9;q+=h){xs+=dir*sp*(1-.42*Math.min(1,(xs/r)**2))*h;if(xs<-r){xs=-r;dir=1}if(xs>r){xs=r;dir=-1}}return {xs,dir}}
// fall of a piece let go now from swinger xs (+lead s of swinging): returns the path (screen points), landing error and top
// the game's wind at game time tm (windFor reads the global clock; it is put back right after)
const windAt=tm=>{const t0=time;time=tm;try{return windFor(tower.length)+(hz.gustV||0)}finally{time=t0}};
function fall(lead=0,path=false){if(!swinger)return null;const h=1/240,base=baseId(zone()),G0=BH*30*zone().grav*hatFall(),gm=hz.m.gravity;
  let xs=simSw(swinger.xs,swinger.dir,lead).xs,y=swingY(),vy=0,gr=gm?gm.dur-gm.t-lead:-1,k=0,tm=time+lead;const yl=yOf(tower.length),top=tower[tower.length-1].xs,pts=[];
  while(y<yl){vy+=G0*(gr>0?(hz.gravK||1):1)*h;if(base==='space')vy=Math.min(vy,BH*9);y+=vy*h;xs+=windAt(tm)*hatWind()*h;tm+=h;gr-=h;if(path&&(k++%6===0))pts.push({x:xOf(xs),y:sy(Math.min(y,yl))})}
  if(path)pts.push({x:xOf(xs),y:sy(yl)});return {err:xs-top,xs,pts}}
const dtN=()=>Math.min(.033,(SC.s.speed?SC.s.speed(SC.t+1/30):1)/30);
const bestNow=tol=>{const a=fall(0),b=fall(dtN());return a&&Math.abs(a.err)<tol&&Math.abs(a.err)<=Math.abs(b.err)};
const noWords=()=>{popups=popups.filter(p=>p.key==='perfect'||p.key==='wow'||p.key==='great');if(swinger&&(swinger.rare||swinger.kind||swinger.gold))Object.assign(swinger,{rare:null,kind:null,gold:false})};
// guard: the game's own queued requestAnimationFrame can still fire once after SC_setup (real clock far behind the virtual one)
// -> one update() with dt of about -10 s (time runs backwards, camera jumps). start() sets last=-1e9 so that stray frame gets
// dt=.033, and every tick puts the frame clock back on the virtual clock before stepping.
function clockGuard(){try{const v=__man.now();if(last>v||last<v-1000)last=v}catch(e){}if(SC.f===0){bump=0;shake=0;if(Math.abs(camY-camTarget())>3)camY=camTarget()}}
function poly(g,pts,col,a=1,dash=true){if(pts.length<2)return;g.save();g.globalAlpha=a;g.lineCap='round';g.lineJoin='round';if(dash)g.setLineDash([10,9]);
  for(const [w,c] of [[8,INK],[4,col]]){g.lineWidth=w;g.strokeStyle=c;g.beginPath();g.moveTo(pts[0].x,pts[0].y);for(const p of pts.slice(1))g.lineTo(p.x,p.y);g.stroke()}g.restore()}
function dashed(g,x1,y1,x2,y2,col,a=1){poly(g,[{x:x1,y:y1},{x:x2,y:y2}],col,a)}
// the wind: a light arrow with streaks across the top of the picture
function windSign(g,y,dir,t){g.save();const cx=W/2,half=S*1.25,o=((t*1.4)%1)*S*.5*dir;g.globalAlpha=.9;
  for(const [dy,l] of [[-17,.55],[17,.55]]){g.lineCap='round';g.lineWidth=7;g.strokeStyle=INK;g.beginPath();g.moveTo(cx-half*l+o,y+dy);g.lineTo(cx+half*l+o,y+dy);g.stroke();g.lineWidth=3.5;g.strokeStyle=WINDC;g.beginPath();g.moveTo(cx-half*l+o,y+dy);g.lineTo(cx+half*l+o,y+dy);g.stroke()}
  L.arrow(g,cx-dir*half,y,cx+dir*half,y,WINDC,1);g.restore()}
const T_REL=1.05;   // the upwind release point is reached ~1.05 s in
function setup(){const M=SC.mem;last=-1e9;
  // SC_setup zeroes partyT, but a perfect-combo party during the setup drops may have left its hue-rotate filter on the canvas
  try{cv.style.filter=''}catch(e){}
  // same plain swinger in A and B (no random rare/gold variant)
  Object.assign(swinger,{rare:null,kind:null,gold:false,color:COLORS[5%COLORS.length],mouth:MOUTHS[0],eyes:EYES[0]});
  // the same tower colours in A and B (setup pieces are random); the crowns from the 5+ perfect combo stay
  for(let i=1;i<tower.length;i++)Object.assign(tower[i],{rare:null,kind:null,gold:false,color:COLORS[i%COLORS.length],mouth:MOUTHS[0],eyes:EYES[0]});M.h={x:W*.95,y:sw().y+BH*4.6};M.press=-9;M.taps=[];M.trail=[];
  // a steady, strong wind gust while the pieces fall (~1.0-2.4 s game time in); windSeed is the level's random wind phase
  let best=null;for(let i=0;i<628;i++){const ws=i/100;let mn=9;for(let q=.95;q<=2.45;q+=.05)mn=Math.min(mn,gust(time+q,ws));if(!best||mn>best.mn)best={mn,ws}}windSeed=best.ws;M.gmin=best.mn;
  // swing start: at T_REL the Sharliz is at the upwind release point, heading downwind
  const wdir=1,drift=.62;let b2=null;for(let i=0;i<=200;i++){const xs0=-rangeXs()+2*rangeXs()*i/200;for(const d of [-1,1]){const p=simSw(xs0,d,T_REL);const e=Math.abs(p.xs-(tower[tower.length-1].xs-wdir*drift))+(p.dir===wdir?0:5);if(!b2||e<b2.e)b2={e,xs0,d}}}
  swinger.xs=b2.xs0;swinger.dir=b2.d}
function gravStart(t){const M=SC.mem;if(M.gT==null&&t>=.25&&startEvent('gravity'))M.gT=t}
const thumb=()=>({x:W*.78,y:sw().y+BH*2.2});
function handTo(tx,ty,k=6){const M=SC.mem,dt=1/30;M.h.x+=(tx-M.h.x)*Math.min(1,dt*k);M.h.y+=(ty-M.h.y)*Math.min(1,dt*k)}
function handAndRipples(t,I){const M=SC.mem;for(const q of M.taps){const p=(t-q.t)/.45;if(p<1)I.push({k:'ripple',x:q.x,y:q.y,p})}
  I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)})}
const camTopOf=()=>SC.mem.camTop??(sy(swingY())-100);
// gravity switches: a purple shock ring from the swinging Sharliz (the game tints the screen purple at the same time)
function gravPulse(t,I){const M=SC.mem;if(M.gT==null)return;const q=(t-M.gT)/.7;if(q>=1)return;const s=sw();
  I.push({k:'fn',f:g=>{g.save();g.globalAlpha=1-q;for(const [w,c] of [[9,INK],[5,'#c084fc']]){g.lineWidth=w;g.strokeStyle=c;g.beginPath();g.arc(s.x,s.y,S*.7+q*S*2.2,0,7);g.stroke()}g.restore()}})}

const A={level:LEVEL,floors:11,seed:9,dur:20,fadeOut:true,
  start(){setup()},
  speed(t){const M=SC.mem;if(M.endT!=null)return t-M.endT<.6?.5:1;return M.dropT!=null?.62:1},
  tick(t){const M=SC.mem,I=[];noWords();clockGuard();gravStart(t);const s=sw(),tp=topScreen(),wd=Math.sign(windFor(tower.length))||1;
    I.push({k:'fn',f:g=>windSign(g,camTopOf()+30,wd,t)});gravPulse(t,I);
    if(M.dropT==null){const th=thumb();handTo(th.x,th.y,t>.3?6:3);
      if(M.gT!=null&&swinger&&!swinger.entering&&state==='aim'){
        I.push({k:'fn',f:g=>dashed(g,s.x,s.y+BH*.55,s.x,tp.y-BH*.55,'#ffffff',.95)});
        // the usual way: let go when it is right above the tower
        const e0=swinger.xs-tower[tower.length-1].xs,e1=simSw(swinger.xs,swinger.dir,dtN()).xs-tower[tower.length-1].xs;
        if(t-M.gT>.4&&Math.abs(e0)<.06&&Math.abs(e0)<=Math.abs(e1)&&Math.hypot(M.h.x-th.x,M.h.y-th.y)<20){M.h0=hearts;M.n0=tower.length;M.rel=s;drop();M.dropT=t;M.press=t;M.taps.push({x:M.h.x,y:M.h.y,t})}}}
    if(M.dropT!=null&&M.endT==null){const ly=sy(yOf(tower.length));
      if(dropping){M.last={x:xOf(dropping.xs),y:sy(dropping.y)};M.trail.push(M.last);I.push({k:'fn',f:g=>{dashed(g,M.rel.x,M.rel.y+BH*.55,M.rel.x,ly-BH*.5,'#ffffff',.5);poly(g,M.trail,RED,.95,false)}});I.push({k:'ring',x:M.last.x,y:M.last.y,r:BH*.62,col:RED})}
      else if(hearts<M.h0||tower.length===M.n0){M.endT=t;M.miss={x:M.last.x,y:ly};this.dur=t+1.6}}
    if(M.endT!=null){const p=Math.min(1,(t-M.endT)/.45);I.push({k:'fn',f:g=>poly(g,M.trail,RED,.6,false)});I.push({k:'ring',x:M.miss.x,y:M.miss.y,r:BH*.6,col:RED});I.push({k:'badge',x:M.miss.x,y:M.miss.y-BH*.95,ok:false,p});handTo(W*.98,s.y+BH*4.6,3)}
    handAndRipples(t,I);return I}};

const B={level:LEVEL,floors:11,seed:9,dur:20,fadeIn:true,fadeOut:true,
  start(){setup()},
  speed(t){const M=SC.mem;if(M.endT!=null)return t-M.endT<.5?.6:1;return M.dropT!=null?.62:1},
  tick(t){const M=SC.mem,I=[];noWords();clockGuard();gravStart(t);const s=sw(),tp=topScreen(),wd=Math.sign(windFor(tower.length))||1;
    I.push({k:'fn',f:g=>windSign(g,camTopOf()+30,wd,t)});gravPulse(t,I);
    if(M.dropT==null){const th=thumb();handTo(th.x+14,th.y+26,t>.3?6:3);
      if(M.gT!=null&&swinger&&!swinger.entering&&state==='aim'&&t-M.gT>.3){const F=fall(0,true),ok=Math.abs(F.err)<.06,col=ok?GRN:YEL,end=F.pts[F.pts.length-1];
        I.push({k:'fn',f:g=>poly(g,[{x:s.x,y:s.y+BH*.55}].concat(F.pts.filter(p=>p.y>s.y+BH*.55)),col,.95)});I.push({k:'ring',x:end.x,y:end.y,r:S*.3,col});
        if(bestNow(.06)){M.p0=lv.perfect;M.path=F.pts;drop();M.dropT=t;M.press=t;M.taps.push({x:M.h.x,y:M.h.y,t})}}}
    if(M.dropT!=null&&M.endT==null){I.push({k:'fn',f:g=>poly(g,M.path,GRN,.75)});if(dropping)I.push({k:'ring',x:xOf(dropping.xs),y:sy(dropping.y),r:BH*.62,col:GRN});
      if(!dropping){M.endT=t;this.dur=t+1.6}}
    if(M.endT!=null){const p=Math.min(1,(t-M.endT)/.45);I.push({k:'ring',x:tp.x,y:tp.y,r:BH*.62,col:GRN});I.push({k:'badge',x:tp.x+(tp.x<W/2?-1:1)*BH*1.15,y:tp.y-BH*.4,ok:true,p});/* opposite the game's Perfect! popup */handTo(W*.98,s.y+BH*4.6,3)}
    handAndRipples(t,I);return I}};
// warm-up scene with no frames: starts the level once so its own storm art is loaded (and the game's last queued
// real-time frame has fired) before scene A is set up
const W0={level:LEVEL,floors:0,dur:0,tick(){return []}};
SC.scenes=[W0,A,B];
})();
