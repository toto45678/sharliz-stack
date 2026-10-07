(async()=>{
// wait until the game has booted and baked its sprites (rec.py gives up after 60 s on a busy machine); evaluate() awaits this promise
await new Promise(r=>{const t0=performance.now();let ok=0;const k=()=>{try{if(typeof H3!=='undefined'&&H3.state==='ready'&&H3.baked){if(!ok)ok=performance.now();if(performance.now()-ok>2500)return r()}}catch(e){}if(performance.now()-t0>400000)return r();setTimeout(k,250)};k()});
// take over the game clock now and let the one real-time frame that is already queued run before SC_setup; on a busy machine it
// otherwise lands after the fast setup with a negative dt (bump jumps ~250px down, hazard timers run backwards)
try{__man.on();const l0=last;await new Promise(r=>{const t0=performance.now();const k=()=>{let ch=false;try{ch=last!==l0}catch(e){ch=true}if(ch||performance.now()-t0>8000)return setTimeout(r,300);setTimeout(k,50)};k()});last=__man.now()}catch(e){}
// jelly (level 111): a bouncy Sharliz; a landing that is not perfect bounces it further off-center
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const pred=()=>{if(state!=='aim'||!swinger||swinger.entering)return null;const top=tower[tower.length-1],dist=Math.max(1,yOf(tower.length)-swingY()),tf=Math.sqrt(2*dist/(BH*30*zone().grav));return swinger.xs+wind*tf-top.xs};
const dropNow=()=>{try{busy=false;tapBuf=-9}catch(e){}drop()};
const dropAt=(M,f=p=>p)=>{const p=pred();if(p==null){M.pp=null;return false}const d=f(p),pd=M.pp;M.pp=d;if(pd==null)return false;const v=d-pd;
  if(Math.abs(d)<.01){dropNow();return state==='drop'}
  if(v&&Math.sign(d+v)!==Math.sign(d)&&Math.abs(v)<.5){const sp=SC.s.speed?SC.s.speed(SC.t):1;SC_step(1,1000/30*sp*Math.min(1,Math.abs(d/v)));M.at={p,d,v,p2:pred(),xs:swinger&&swinger.xs};dropNow();return state==='drop'}return false};
const guide=(ts,s,ok)=>({k:'fn',f:g=>{g.save();g.setLineDash([10,9]);g.lineCap='round';g.beginPath();g.moveTo(ts.x,ts.y-62);g.lineTo(ts.x,s.y+12);g.lineWidth=7;g.strokeStyle=SC_lib.INK;g.stroke();g.lineWidth=4;g.strokeStyle=ok?'#22c55e':'#facc15';g.stroke();g.restore()}});
// red "boing" hop arrow: an arc from where it landed to where it bounced
function hop(g,x1,x2,y,p){const dir=Math.sign(x2-x1)||1,a=x1,b=x2,h=46,mx=(a+b)/2;g.save();g.lineCap='round';g.lineJoin='round';
  const pt=u=>({x:a+(b-a)*u,y:y-Math.sin(u*Math.PI)*h});const e=Math.max(.05,Math.min(1,p));
  for(const [w,c] of [[14,SC_lib.INK],[8,'#ef4444']]){g.lineWidth=w;g.strokeStyle=c;g.beginPath();for(let i=0;i<=24;i++){const q=pt(i/24*e*.88);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)}g.stroke();
    if(e>=1){const q=pt(1),r=pt(.84),ux=q.x-r.x,uy=q.y-r.y,L=Math.hypot(ux,uy),nx=ux/L,ny=uy/L,s=w===14?20:15;g.fillStyle=c;g.beginPath();g.moveTo(q.x+nx*(w===14?4:0),q.y+ny*(w===14?4:0));g.lineTo(q.x-nx*s-ny*s*.75,q.y-ny*s+nx*s*.75);g.lineTo(q.x-nx*s+ny*s*.75,q.y-ny*s-nx*s*.75);g.closePath();g.fill()}}
  g.restore()}
// keep the game's frame clock on the virtual clock before every step (a stray real-time frame would give a negative dt)
const clk=()=>{try{last=__man.now()}catch(e){}};
function begin(){clk();try{cv.style.filter=''}catch(e){}const M=SC.mem;M.camTop=sw().y-62;startEvent('jelly');M.n0=tower.length;M.piece=swinger}
// scene A: dropped a bit off-center -> BOING, it bounces even further out and falls off
const A={level:111,floors:4,seed:9,dur:9,fadeOut:true,
  start(){begin()},
  speed(t){const M=SC.mem;if(M.landT!=null)return t-M.landT<1.4?.4:1;if(M.dropT!=null)return .45;if(t<1)return .4;return .55},
  tick(t){clk();const M=SC.mem,I=[],s=sw(),ts0=topScreen();
    if(M.dropT==null&&swinger){if(t<1)I.push({k:'spot',x:s.x,y:s.y+18,r:70,a:.5*Math.min(1,t/.2)*Math.min(1,(1-t)/.25)});
      I.push({k:'ring',x:s.x,y:s.y+18,r:58,col:'#ef4444'});I.push(guide(ts0,s,false));
      if(t>1&&dropAt(M,p=>Math.abs(p)-.34))M.dropT=t}
    if(M.dropT!=null&&M.landT==null&&!dropping&&state!=='drop'){M.landT=t;const d=M.piece,i=tower.indexOf(d),pv=tower[i-1];
      if(i>0){const dx=(d.xs-pv.xs)/1.7;M.from=xOf(pv.xs+dx);M.to=xOf(d.xs);M.wy=yOf(i)}else{M.from=M.to=s.x;M.wy=scrToW(ts0.y)}
      M.dir=Math.sign(M.to-M.from)||1;this.dur=t+2.5}
    if(M.landT!=null){const k=t-M.landT,y=sy(M.wy);
      if(k<1.3)I.push({k:'fn',f:g=>hop(g,M.from-M.dir*14,M.to+M.dir*40,y-58,k/.3)});
      // follow the bounced Sharliz while it tips over and falls
      let rx=null,ry=null;const i=tower.indexOf(M.piece);if(i>=0){rx=xOf(M.piece.xs)+collapseOffset(i,tower.length);ry=sy(yOf(i))}else{const b=bodies.find(b=>b.s===M.piece);if(b){rx=b.x;ry=sy(b.y)}}
      if(k>.45&&rx!=null&&ry<sy(M.wy)+150)I.push({k:'ring',x:rx,y:ry+6,r:56,col:'#ef4444'});
      if(k>.45){const p=Math.min(1,(k-.45)/.45),bx=Math.max(44,Math.min(W-44,M.to-M.dir*92));I.push({k:'badge',x:bx,y:y-40,ok:false,p})}}
    return I}};
// scene B: wait until it is right above the tower, tap -> PERFECT, the jelly sticks
const B={level:111,floors:4,seed:9,dur:9,fadeIn:true,fadeOut:true,
  start(){begin();const M=SC.mem;M.h={x:W*.95,y:M.camTop+560};M.press=-9},
  speed(t){const M=SC.mem;if(M.landT!=null)return t-M.landT<.8?.5:1;if(M.dropT!=null)return .5;return .55},
  tick(t){clk();const M=SC.mem,I=[],s=sw(),ts=topScreen(),dt=1/30;
    const hx=W*.8,hy=ts.y-30,gone=M.dropT!=null&&t-M.dropT>.35,tx=gone?W+70:hx,ty=gone?ts.y+260:hy;M.h.x+=(tx-M.h.x)*Math.min(1,dt*(gone?3:5));M.h.y+=(ty-M.h.y)*Math.min(1,dt*(gone?3:5));
    if(M.dropT==null&&swinger){const al=pred();
      if(t>.9&&Math.hypot(M.h.x-hx,M.h.y-hy)<12&&dropAt(M)){M.dropT=t;M.press=t;M.tap={x:M.h.x,y:M.h.y,t}}
      if(swinger){I.push({k:'ring',x:s.x,y:s.y+18,r:58,col:'#facc15'})}I.push(guide(ts,s,M.dropT!=null||(al!=null&&Math.abs(al)<.12)))}
    if(M.dropT!=null&&M.landT==null&&!dropping){M.landT=t;this.dur=t+1.9}
    if(M.landT!=null){const p=Math.min(1,(t-M.landT)/.45);I.push({k:'ring',x:ts.x,y:ts.y,r:56,col:'#22c55e'});I.push({k:'badge',x:ts.x+(ts.x<W/2?84:-84),y:ts.y-62,ok:true,p})}
    if(M.tap){const p=(t-M.tap.t)/.45;if(p<1)I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p})}
    I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.2)});
    return I}};
SC.scenes=[A,B];
})();
