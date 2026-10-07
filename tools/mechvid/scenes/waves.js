(()=>{
// WAVES (level 211, ocean storm, passive): the sea rocks the whole tower left and right (amp 0.24, period 3.3 s).
// A: the player drops when the Sharliz is above where the tower IS -> the tower slides away during the fall -> off-centre landing that slips.
// B: the player drops where the tower WILL BE (timed with the swell) -> the tower slides under it -> perfect.
const LEVEL=211,L=SC_lib,INK=L.INK,RED='#ef4444',YEL='#facc15',GRN='#22c55e';
try{const z=ZONES[Math.floor((LEVEL-1)/LPZ)];for(const p of ['w3b_','w3m_','w3f_','w3c_'])pic(p+z.id)}catch(e){}
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const amp=()=>.24+lvInZone()*.02,wo=t=>amp()*Math.sin(t*Math.PI*2/3.3);
function simSw(xs,dir,T){const r=rangeXs(),sp=speed(),h=1/240;for(let q=0;q<T-1e-9;q+=h){xs+=dir*sp*(1-.42*Math.min(1,(xs/r)**2))*h;if(xs<-r){xs=-r;dir=1}if(xs>r){xs=r;dir=-1}}return {xs,dir}}
// drop now (or after `lead` s): where does the piece land and where is the top then?
function pred(lead=0,path=false){if(!swinger)return null;const h=1/240,W_=hz.m.waves,base=baseId(zone());let xs=simSw(swinger.xs,swinger.dir,lead).xs,y=swingY(),vy=0,tm=time+lead,wt=W_?W_.t+lead:0,k=0;
  const yl=yOf(tower.length),G=BH*30*zone().grav*hatFall()*(hz.gravK||1),pts=[];let top=tower[tower.length-1].xs+(W_?wo(wt)-wo(W_.t):0),tf=0;
  while(y<yl){vy+=G*h;y+=vy*h;xs+=wind*hatWind()*h;if(base==='ocean')xs+=Math.sin(tm*.9)*.28*h;if(W_){const o=wo(wt);wt+=h;top+=wo(wt)-o}tm+=h;tf+=h;if(path&&(k++%5===0))pts.push({x:xOf(xs),y:sy(y)})}
  if(path)pts.push({x:xOf(xs),y:sy(yl)});return {err:xs-top,top,xs,tf,pts}}
function poly(g,pts,col,a=1){if(pts.length<2)return;g.save();g.globalAlpha=a;g.lineCap='round';g.lineJoin='round';g.setLineDash([10,9]);
  for(const [w,c] of [[8,INK],[4,col]]){g.lineWidth=w;g.strokeStyle=c;g.beginPath();g.moveTo(pts[0].x,pts[0].y);for(const p of pts.slice(1))g.lineTo(p.x,p.y);g.stroke()}g.restore()}
const dtN=()=>Math.min(.033,(SC.s.speed?SC.s.speed(SC.t+1/30):1)/30);
const bestNow=tol=>{const a=pred(0),b=pred(dtN());return a&&Math.abs(a.err)<tol&&Math.abs(a.err)<=Math.abs(b.err)};
const noWords=()=>{popups=popups.filter(p=>p.key==='perfect'||p.key==='wow'||p.key==='great');if(swinger&&(swinger.rare||swinger.kind||swinger.gold))Object.assign(swinger,{rare:null,kind:null,gold:false})};
// guard: the game's own queued requestAnimationFrame can still fire once after SC_setup (real clock far behind the virtual one)
// -> one update() with dt of about -10 s (time runs backwards, camera jumps). start() sets last=-1e9 so that stray frame gets
// dt=.033, and every tick puts the frame clock back on the virtual clock before stepping.
function clockGuard(){try{const v=__man.now();if(last>v||last<v-1000)last=v}catch(e){}if(SC.f===0){bump=0;shake=0;if(Math.abs(camY-camTarget())>3)camY=camTarget()}}
function dashed(g,x1,y1,x2,y2,col,a=1){g.save();g.globalAlpha=a;g.lineCap='round';g.setLineDash([10,9]);g.lineWidth=8;g.strokeStyle=INK;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();
  g.lineWidth=4;g.strokeStyle=col;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.restore()}
function ghost(g,x,y,col,a){g.save();g.globalAlpha=a;g.setLineDash([9,7]);g.lineWidth=8;g.strokeStyle=INK;g.beginPath();g.ellipse(x,y,S*.56,BH*.5,0,0,7);g.stroke();g.lineWidth=4;g.strokeStyle=col;g.beginPath();g.ellipse(x,y,S*.56,BH*.5,0,0,7);g.stroke();g.restore()}
function dblArrow(g,cx,y,half,col,a=1){g.save();g.globalAlpha=a;L.arrow(g,cx,y,cx-half,y,col,1);L.arrow(g,cx,y,cx+half,y,col,1);g.restore()}
const C0=()=>xOf(tower[0].xs-(hz.m.waves?hz.m.waves.last:0));   // screen x of the rocking centre
const T1=1.25;   // the Sharliz passes over the tower ~1.25 s in

function setup(){const M=SC.mem;last=-1e9;
  // same plain swinger in A and B (no random rare/gold variant)
  Object.assign(swinger,{rare:null,kind:null,gold:false,color:COLORS[3%COLORS.length],mouth:MOUTHS[0],eyes:EYES[0]});M.h={x:W*.95,y:sw().y+BH*4.2};M.press=-9;M.taps=[];M.trail=[];
  const m=hz.m.waves;
  // straighten the tower (setup drops were done without wave prediction); same plain yellow top piece in A and B
  for(const s of tower){s.xs=tower[0].xs;s.slideX=0}
  for(let i=1;i<tower.length;i++)Object.assign(tower[i],{rare:null,kind:null,gold:false,color:COLORS[0],mouth:MOUTHS[0],eyes:EYES[0]});
  // swing start: pass over the tower centre at T1
  const r=rangeXs();let best=null;for(let i=0;i<=200;i++){const xs0=-r+2*r*i/200;for(const d of [-1,1]){let xs=xs0,dir=d,tt=0,hit=null;const h=1/120;
      for(;tt<T1+.6;tt+=h){const p=simSw(xs,dir,h);if((xs-tower[0].xs)*(p.xs-tower[0].xs)<=0&&tt>.4){hit=tt;break}xs=p.xs;dir=p.dir}
      if(hit!=null){const e=Math.abs(hit-T1);if(!best||e<best.e)best={e,xs0,d}}}}
  if(best){swinger.xs=best.xs0;swinger.dir=best.d}
  // wave phase: the tower moves fastest while that piece falls, against the ocean current (the real worst case)
  const cur=Math.sign(Math.sin((time+T1+.2)*.9))||1,ph=cur>0?1.65:0,nt=3.3*Math.ceil((m.t+T1+.2)/3.3)+ph-(T1+.2),on=wo(nt),d=on-m.last;for(const s of tower)s.xs+=d;m.t=nt;m.last=on}
// red ring on the rocking top + red double arrow on the water: "the sea moves the tower"
function waveHint(t,I,col){const M=SC.mem,n=tower.length,tp=topScreen(),gy=sy(0),cx=C0(),half=amp()*S+S*.85;
  if(t<1.1)I.push({k:'spot',x:tp.x,y:(tp.y+gy)/2,r:Math.max(BH*1.2,(gy-tp.y)/2+BH*.7),a:.45*Math.min(1,t/.15)*Math.min(1,(1.1-t)/.3)});
  I.push({k:'fn',f:g=>dblArrow(g,cx,gy+BH*.2,half,col,1)})}

const A={level:LEVEL,floors:1,seed:4,dur:20,fadeOut:true,
  start(){setup();SC.mem.camTop=Math.round(sy(0)+BH*.42-488)},
  speed(t){const M=SC.mem;if(M.endT!=null)return t-M.endT<.7?.45:1;return M.dropT!=null?.38:1},
  tick(t){const M=SC.mem,I=[],dt=1/30;noWords();clockGuard();const s=sw(),tp=topScreen();
    if(M.dropT==null){waveHint(t,I,RED);
      M.h.x+=(W*.8-M.h.x)*Math.min(1,dt*4);M.h.y+=(s.y+BH*1.9-M.h.y)*Math.min(1,dt*4);
      // the usual way: drop when it is right above the tower top (as it is NOW)
      const e0=swinger?swinger.xs-tower[tower.length-1].xs:9,e1=swinger?simSw(swinger.xs,swinger.dir,dtN()).xs-tower[tower.length-1].xs:9;
      if(swinger&&!swinger.entering&&state==='aim'&&t>.6)I.push({k:'fn',f:g=>dashed(g,s.x,s.y+BH*.55,s.x,tp.y-BH*.55,'#ffffff',.95)});
      if(swinger&&!swinger.entering&&state==='aim'&&t>.6&&Math.abs(e0)<.06&&Math.abs(e0)<=Math.abs(e1)){M.p0=lv.perfect;M.n0=tower.length;M.rel=s;M.relTop=tp.x;drop();M.dropT=t;M.press=t;M.taps.push({x:M.h.x,y:M.h.y,t})}}
    else if(M.endT==null){I.push({k:'fn',f:g=>dblArrow(g,C0(),sy(0)+BH*.2,amp()*S+S*.85,RED,.6)});
      // the tower slides away under the falling piece: red arrow from where it was to where it is
      const ox=M.relTop,nx=tp.x;I.push({k:'ring',x:tp.x,y:tp.y,r:BH*.6,col:RED});
      if(Math.abs(nx-ox)>8)I.push({k:'arrow',x1:ox,y1:tp.y+BH*.62,x2:nx+Math.sign(nx-ox)*14,y2:tp.y+BH*.62,col:RED,p:1});
      I.push({k:'fn',f:g=>dashed(g,M.rel.x,M.rel.y+BH*.55,M.rel.x,tp.y-BH*.55,'#ffffff',.7)});
      if(!dropping){M.endT=t;this.dur=t+1.9}}
    if(M.endT!=null){const n=tower.length,top=tower[n-1],pr=tower[n-2],x=xOf(top.xs)+(top.slideX||0),y=sy(yOf(n-1)),px=xOf(pr.xs),py=sy(yOf(n-2)),p=Math.min(1,(t-M.endT)/.45);
      // centre line of the tower vs the landed piece: it sits off-centre
      I.push({k:'fn',f:g=>{dashed(g,px,py-BH*.1,px,y-BH*.75,'#ffffff',.95);if(Math.abs(x-px)>6)L.arrow(g,px,y-BH*.62,x+Math.sign(x-px)*10,y-BH*.62,RED,1)}});
      I.push({k:'ring',x,y,r:BH*.6,col:RED});I.push({k:'badge',x:x+(x>px?BH*1.15:-BH*1.15),y:y-BH*.2,ok:false,p});
      M.h.x+=(W*1.05-M.h.x)*Math.min(1,dt*3);M.h.y+=(s.y+BH*4.4-M.h.y)*Math.min(1,dt*3)}
    for(const q of M.taps){const p=(t-q.t)/.45;if(p<1)I.push({k:'ripple',x:q.x,y:q.y,p})}
    I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)});
    return I}};

const B={level:LEVEL,floors:1,seed:4,dur:20,fadeIn:true,fadeOut:true,
  start(){setup();SC.mem.camTop=Math.round(sy(0)+BH*.42-488)},
  speed(t){const M=SC.mem;if(M.endT!=null)return t-M.endT<.6?.5:1;return M.dropT!=null?.38:1},
  tick(t){const M=SC.mem,I=[],dt=1/30;noWords();clockGuard();const s=sw(),tp=topScreen();
    if(M.dropT==null){waveHint(t,I,RED);
      M.h.x+=(W*.8-M.h.x)*Math.min(1,dt*4);M.h.y+=(s.y+BH*1.9-M.h.y)*Math.min(1,dt*4);
      const P=swinger&&!swinger.entering&&state==='aim'?pred(0,true):null;
      if(P&&t>.6){const gx=xOf(P.top),gy=tp.y,ok=Math.abs(P.err)<.06,col=ok?GRN:YEL,pts=[{x:s.x,y:s.y+BH*.55}].concat(P.pts.filter(q=>q.y>s.y+BH*.55&&q.y<gy-BH*.5));
        I.push({k:'fn',f:g=>{ghost(g,gx,gy,col,1);poly(g,pts,col,.95)}});if(Math.abs(gx-tp.x)>10)I.push({k:'arrow',x1:tp.x,y1:gy+BH*.62,x2:gx+Math.sign(gx-tp.x)*16,y2:gy+BH*.62,col,p:1})}
      if(P&&t>.6&&bestNow(.06)){M.p0=lv.perfect;M.path=[{x:s.x,y:s.y+BH*.55}].concat(P.pts.filter(q=>q.y>s.y+BH*.55&&q.y<tp.y-BH*.5));M.gx=xOf(P.top);drop();M.dropT=t;M.press=t;M.taps.push({x:M.h.x,y:M.h.y,t})}}
    else if(M.endT==null){I.push({k:'fn',f:g=>dblArrow(g,C0(),sy(0)+BH*.2,amp()*S+S*.85,RED,.6)});
      I.push({k:'fn',f:g=>{ghost(g,M.gx,tp.y,GRN,.9);poly(g,M.path,GRN,.8)}});
      if(dropping)I.push({k:'ring',x:xOf(dropping.xs),y:sy(dropping.y),r:BH*.6,col:GRN});
      if(!dropping){M.endT=t;this.dur=t+1.9}}
    if(M.endT!=null){const n=tower.length,x=xOf(tower[n-1].xs),y=sy(yOf(n-1)),py=sy(yOf(n-2)),p=Math.min(1,(t-M.endT)/.45);
      I.push({k:'fn',f:g=>dashed(g,xOf(tower[n-2].xs),py-BH*.1,xOf(tower[n-2].xs),y-BH*.75,'#ffffff',.95)});
      I.push({k:'ring',x,y,r:BH*.62,col:GRN});I.push({k:'badge',x:x-BH*1.1,y:y-BH*.35,ok:true,p});   // left: the game's Perfect! popup is on the right
      M.h.x+=(W*1.05-M.h.x)*Math.min(1,dt*3);M.h.y+=(s.y+BH*4.4-M.h.y)*Math.min(1,dt*3)}
    for(const q of M.taps){const p=(t-q.t)/.45;if(p<1)I.push({k:'ripple',x:q.x,y:q.y,p})}
    I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)});
    return I}};
// warm-up scene with no frames: starts the level once so its own storm art is loaded (and the game's last queued
// real-time frame has fired) before scene A is set up
const W0={level:LEVEL,floors:0,dur:0,tick(){return []}};
SC.scenes=[W0,A,B];
})();
