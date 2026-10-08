(()=>{
// Sandstorm gust (classic event hazard, world 3). A big gust blows the falling Sharliz sideways.
// Aim into the wind (drop upwind so it drifts onto the tower); a Perfect landing anchors the tower (ends the gust).
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
if(!window.__pp0)window.__pp0=popup;window.popup=function(text,x,y,c,key){if(!['perfect','wow','great'].includes(key))return;return window.__pp0.apply(this,arguments)};
// harness race: the game's own rAF frame (queued before __man.on) can fire late with the REAL clock and set `last`,
// so the next virtual step gets a big negative dt (time jumps back). Keep `last` on the virtual clock.
const clk=()=>{try{if(last!==__man.now())last=__man.now()}catch(e){}};
// end of start(): if that late frame fires during rec.py's wait, it then takes one normal .033 step instead of a negative one
const arm=()=>{try{last=-1e12}catch(e){}};
const calm=()=>{try{hz.firstDone=true;hz.since=-9}catch(e){}};
// skip drawing while SC_setup builds the tower (those frames are not recorded; headless canvas drawing is the slow part)
if(!window.__render0)window.__render0=render;
const fast=on=>{window.render=on?function(){}:window.__render0;if(!on)try{flyCoins=[]}catch(e){}};
// SC_setup drops only when SC_aim(.02); with a fixed 1/30 s step the swing can hit the same positions every pass and
// never fall inside that window (seen on level 23), so the floors getter also drops on a slightly wider window
const build=n=>{try{if(tower.length-1<n&&SC_aim(.045))drop()}catch(e){}};
const DIR=-1;   // the gust blows to the left (keeps the hand clear of the fall path in scene B)
const PH=1.1;   // scene A drop moment: 1.1 s into the gust (gust strength ~1.7 of its 2.1 peak)
const fallT=()=>{const dist=Math.max(1,yOf(tower.length)-swingY());return Math.sqrt(2*dist/(BH*30*zone().grav))};
// game seconds until the swinger next passes xs=tx (pure swing kinematics, same formula as update())
function passT(tx,minT){let xs=swinger.xs,dir=swinger.dir;const r=rangeXs(),sp=speed();
  for(let i=1;i<400;i++){const px=xs;xs+=dir*sp*(1-.42*Math.min(1,(xs/r)**2))/30;if(xs<-r){xs=-r;dir=1}if(xs>r){xs=r;dir=-1}if(i/30>=minT&&(px-tx)*(xs-tx)<=0)return i/30}return 2.5}
// sideways drift of a Sharliz dropped now, integrating the gust's real profile over the fall (SC_aim uses only today's wind,
// but the gust is still growing while it falls, which turned a Perfect into a Great)
function drift(gt0,base){const g=hz.gust,ty=yOf(tower.length),G=BH*30*zone().grav*hatFall()*(hz.gravK||1);if(base==null)base=wind-(hz.gustV||0);let y=swingY(),vy=0,dx=0,gt=gt0;const h=1/240;
  for(let i=0;i<2000&&y<ty;i++){vy+=G*h;y+=vy*h;gt+=h;const gv=g&&gt>g.warn?g.dir*2.1*Math.sin(Math.PI*Math.min(1,Math.max(0,(gt-g.warn)/g.dur)))*(hz.gustK||1):0;dx+=(base+gv)*hatWind()*h}return dx}
// the level's own breeze at a later game time (it drifts slowly with time)
function baseAt(tm){const tt=time;try{time=tm;return windFor(tower.length)}finally{time=tt}}
// start the gust (the game's sandstorm event) and time its warning so it is strong when the swinger reaches the drop point
const setup=tx=>{startEvent('wind');const g=hz.gust;g.dir=DIR;const T=passT(tx,1.5);g.t=Math.max(0,Math.min(g.warn-.4,g.warn+PH-T));return T};
// red wind arrow across the sky while the gust blows
function windArrow(I,t,s){const g=hz.gust;if(!g)return;const D=g.dir,p=Math.min(1,.4+g.t/.6),ph=(t*.8)%1,x0=W/2-D*140,x1=W/2+D*140,sh=(ph-.5)*36*D,y=s.y-74;
  I.push({k:'fn',f:(g2)=>{g2.globalAlpha=Math.min(1,Math.sin(ph*Math.PI)*1.8);SC_lib.arrow(g2,x0+sh,y,x1+sh,y,'#ef4444',p)}})}
// scene A: dropped straight above the tower -> the gust blows it off
const A={level:23,get floors(){calm();fast(true);build(4);return 4},dur:9,seed:3,fadeOut:true,
  start(){try{cv.style.filter=''}catch(e){}   // a party (3 Perfects in the setup) can leave the canvas hue-rotated
    fast(false);setup(tower[tower.length-1].xs);arm()},
  speed(t){const M=SC.mem;if(M.missT!=null)return t-M.missT<.6?.45:1;if(M.dropT!=null)return .4;return 1},
  tick(t){clk();calm();const M=SC.mem,I=[],s=sw(),g=hz.gust;
    if(M.dropT==null){windArrow(I,t,s);
      if(g&&g.t>g.warn+.5&&swinger&&!swinger.entering&&state==='aim'&&Math.abs(swinger.xs-tower[tower.length-1].xs)<.035){M.n0=tower.length;M.ty=sy(yOf(tower.length));drop();M.d=dropping;M.dropT=t}}
    if(M.dropT!=null&&M.missT==null){const d=M.d;
      if(dropping===d){const x=xOf(d.xs),y=sy(d.y);I.push({k:'ring',x,y,r:46,col:'#ef4444'});const x0=xOf(M.d0??(M.d0=d.xs));
        I.push({k:'fn',f:(g2)=>{g2.setLineDash([8,8]);g2.lineWidth=4;g2.strokeStyle='rgba(255,255,255,.85)';g2.beginPath();g2.moveTo(x0,sy(swingY())+60);g2.lineTo(x0,M.ty+20);g2.stroke()}});
        if(Math.abs(x-x0)>10)I.push({k:'arrow',x1:x-DIR*124,y1:y,x2:x-DIR*54,y2:y,col:'#ef4444',p:Math.min(1,Math.abs(x-x0)/26)})}
      else{M.missT=t;M.mp={x:xOf(d.xs),y:M.ty};M.ok=tower.length>M.n0;this.dur=t+1.7}}
    if(M.missT!=null){const p=Math.min(1,(t-M.missT)/.45),q=M.mp,bd=bodies.find(o=>o.s===M.d);if(bd&&t-M.missT<.9)I.push({k:'ring',x:bd.x,y:sy(bd.y),r:46,col:'#ef4444'});I.push({k:'badge',x:q.x+DIR*6,y:q.y-58,ok:false,p})}
    return I}};
// scene B: drop upwind (yellow ring) -> the gust carries it onto the tower -> Perfect, anchored (the gust stops)
const SPB=.75,hB=Math.min(.033,SPB/30);   // B runs at .75 until the drop: one frame = hB game seconds
// frame-by-frame look ahead from the current swing with the gust clock at g0: the first frame (>= kmin) where
// "drop here + gust drift" crosses the tower top. Same kinematics as update(); the drift integrates the gust over the fall.
function plan(g0,kmin){const g=hz.gust,r=rangeXs(),sp=speed(),top=tower[tower.length-1].xs;let xs=swinger.xs,dir=swinger.dir,gt=g0,prev=null;
  for(let k=0;k<130;k++){if(k>=kmin&&gt>g.warn+.35){const d=drift(gt,baseAt(time+k*hB)),e=top-(xs+d);if(prev&&Math.sign(e)!==Math.sign(prev.e))return Math.abs(e)<Math.abs(prev.e)?{e,k,xs,d}:prev;prev={e,k,xs,d}}
    xs+=dir*sp*(1-.42*Math.min(1,(xs/r)**2))*hB;if(xs<-r){xs=-r;dir=1}if(xs>r){xs=r;dir=-1}gt+=hB}return null}
// pick the gust start time: the drop comes ~1.4 game s in, the drift is big (~1 Sharliz width+) and the drop point is not at
// the swing's turning point. Same gust direction as scene A (the other one only if no timing works)
function choose(){const g=hz.gust,r=rangeXs();let best=null;
  for(const dir of [DIR,-DIR]){g.dir=dir;for(let g0=0;g0<=g.warn+1.4;g0+=.05){const p=plan(g0,Math.round(1.13/hB));if(!p||Math.abs(p.xs)>r-.12)continue;
    const sc=Math.abs(Math.abs(p.d)-.95)*2+Math.abs(p.k*hB-1.4)*.6;if(!best||sc<best.sc)best={...p,g0,dir,sc}}if(best)break}
  return best}
const B={level:23,get floors(){calm();fast(true);build(4);return 4},dur:12,seed:3,fadeIn:true,fadeOut:true,
  start(){try{cv.style.filter=''}catch(e){}
    fast(false);const M=SC.mem;
    // the setup leaves the swing on either side (run to run); start it on the left, swinging right (mirror image, same speed),
    // so the drop comes ~1.4 s in instead of a full extra swing later
    if(swinger.xs>0){swinger.xs=-swinger.xs;swinger.dir=-swinger.dir}
    startEvent('wind');const g=hz.gust,p=choose();
    if(p){g.dir=p.dir;g.t=p.g0;M.p=p;M.ax=xOf(p.xs)}else{g.dir=DIR;g.t=g.warn;M.ax=xOf(tower[tower.length-1].xs-drift(g.warn+.8))}
    const s=sw();M.h={x:W*.86,y:s.y+470};M.press=-9;M.taps=[];arm()},
  speed(t){const M=SC.mem;if(M.dropT!=null&&M.landT==null)return .45;if(M.landT!=null)return 1;return SPB},
  tick(t){clk();calm();const M=SC.mem,I=[],dt=1/30,s=sw(),g=hz.gust,f=Math.round(t*30),K=M.p?M.p.k:45;
    if(M.dropT==null){windArrow(I,t,s);
      if(f>=Math.max(6,K-27)){M.showT=M.showT??t;I.push({k:'ring',x:M.ax,y:s.y,r:46,col:'#facc15'});
        M.h.x+=(M.ax+4-M.h.x)*Math.min(1,dt*7);M.h.y+=(s.y+14-M.h.y)*Math.min(1,dt*7);
        // drop on the frame closest to the crossing (checked live: now vs. the next frame)
        if(g&&f>=K-2&&g.t>g.warn+.35&&state==='aim'&&swinger&&!swinger.entering){const top=tower[tower.length-1].xs,r=rangeXs(),e=top-(swinger.xs+drift(g.t)),
            xn=swinger.xs+swinger.dir*speed()*(1-.42*Math.min(1,(swinger.xs/r)**2))*hB,eN=top-(xn+drift(g.t+hB));
          if((M.pe!=null&&Math.sign(M.pe)!==Math.sign(e))||(Math.sign(e)!==Math.sign(eN)&&Math.abs(e)<=Math.abs(eN))||(f>K+60&&Math.abs(e)<.05)){M.press=t;M.taps.push({x:s.x,y:s.y,t});M.e=e;drop();M.d=dropping;M.dropT=t;M.n0=tower.length}
          M.pe=e}}
      else{M.h.x+=(W*.86-M.h.x)*Math.min(1,dt*4);M.h.y+=(s.y+330-M.h.y)*Math.min(1,dt*4)}}
    else{M.h.x+=(W*.9-M.h.x)*Math.min(1,dt*3);M.h.y+=(s.y+480-M.h.y)*Math.min(1,dt*3)}
    if(M.dropT!=null&&M.landT==null){const d=M.d;if(dropping===d){I.push({k:'ring',x:xOf(d.xs),y:sy(d.y),r:46,col:'#22c55e'})}else{M.landT=t;M.ok=tower.length>M.n0;this.dur=t+1.5}}
    for(const q of M.taps){const p=(t-q.t)/.5;if(p<1){I.push({k:'ripple',x:q.x,y:q.y,p})}}
    if(M.landT!=null&&M.ok){const p=Math.min(1,(t-M.landT)/.45),tp=topScreen();if(t-M.landT<.8)I.push({k:'ring',x:tp.x,y:tp.y,r:52,col:'#22c55e'});I.push({k:'badge',x:W/2,y:s.y+110,ok:true,p})}
    const pr=Math.max(0,1-(t-M.press)/.18);I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});
    return I}};
SC.scenes=[A,B];
})();
