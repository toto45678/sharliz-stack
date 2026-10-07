(async()=>{
// wait until the game has booted and baked its sprites (rec.py gives up after 60 s on a busy machine); evaluate() awaits this promise
await new Promise(r=>{const t0=performance.now();let ok=0;const k=()=>{try{if(typeof H3!=='undefined'&&H3.state==='ready'&&H3.baked){if(!ok)ok=performance.now();if(performance.now()-ok>2500)return r()}}catch(e){}if(performance.now()-t0>400000)return r();setTimeout(k,250)};k()});
// blackout (level 91): the street lights go out; only a PERFECT landing brings the power back
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
// predicted landing offset if we dropped right now (same maths as SC_aim)
const pred=()=>{if(state!=='aim'||!swinger||swinger.entering)return null;const top=tower[tower.length-1],dist=Math.max(1,yOf(tower.length)-swingY()),tf=Math.sqrt(2*dist/(BH*30*zone().grav));return swinger.xs+wind*tf-top.xs};
// drops on the exact moment f(pred) crosses 0 (steps the game a fraction of a frame so fast swings land precisely)
const dropNow=()=>{try{busy=false;tapBuf=-9}catch(e){}drop()};
const dropAt=(M,f=p=>p)=>{const p=pred();if(p==null){M.pp=null;return false}const d=f(p),pd=M.pp;M.pp=d;if(pd==null)return false;const v=d-pd;
  if(Math.abs(d)<.01){dropNow();return state==='drop'}
  if(v&&Math.sign(d+v)!==Math.sign(d)&&Math.abs(v)<.5){const sp=SC.s.speed?SC.s.speed(SC.t):1;SC_step(1,1000/30*sp*Math.min(1,Math.abs(d/v)));dropNow();return state==='drop'}return false};
// dashed drop guide straight above the tower top: yellow = not yet, green = drop now
const guide=(ts,s,ok)=>({k:'fn',f:g=>{g.save();g.setLineDash([10,9]);g.lineCap='round';g.beginPath();g.moveTo(ts.x,ts.y-62);g.lineTo(ts.x,s.y+12);g.lineWidth=7;g.strokeStyle=SC_lib.INK;g.stroke();g.lineWidth=4;g.strokeStyle=ok?'#22c55e':'#facc15';g.stroke();g.restore()}});
const dark=()=>{const m=hz.m.blackout;return !!m&&m.t>m.warn};
// light bulb gauge: on / flickering / off, mirrors the real power state (hz.m.blackout + nightExtra)
function bulb(g,x,y,on,t,pop){g.save();g.translate(x,y);const k=.9*(1+.3*Math.max(0,pop));g.scale(k,k);
  if(on>0){g.globalAlpha=on;g.strokeStyle='#ffe24d';g.lineWidth=4;g.lineCap='round';for(let i=0;i<8;i++){const a=i/8*Math.PI*2+t*.6,r1=30,r2=40+4*Math.sin(t*8+i);g.beginPath();g.moveTo(Math.cos(a)*r1,-6+Math.sin(a)*r1);g.lineTo(Math.cos(a)*r2,-6+Math.sin(a)*r2);g.stroke()}
    const gr=g.createRadialGradient(0,-6,4,0,-6,44);gr.addColorStop(0,'rgba(255,236,120,.75)');gr.addColorStop(1,'rgba(255,236,120,0)');g.fillStyle=gr;g.beginPath();g.arc(0,-6,44,0,7);g.fill();g.globalAlpha=1}
  g.lineJoin='round';g.lineWidth=6;g.strokeStyle=SC_lib.INK;
  const glass=()=>{g.beginPath();g.arc(0,-8,20,Math.PI*.8,Math.PI*.2);g.lineTo(8,14);g.lineTo(-8,14);g.closePath()};
  glass();g.stroke();g.fillStyle=on>0?`rgb(${Math.round(110+145*on)},${Math.round(110+116*on)},${Math.round(130-50*on)})`:'#6b6f80';glass();g.fill();
  g.fillStyle='#9aa0ad';g.strokeStyle=SC_lib.INK;g.lineWidth=4;g.beginPath();g.roundRect(-9,13,18,13,3);g.fill();g.stroke();
  g.strokeStyle='rgba(26,16,32,.5)';g.lineWidth=2;g.beginPath();g.moveTo(-9,18);g.lineTo(9,18);g.moveTo(-9,22);g.lineTo(9,22);g.stroke();
  g.strokeStyle=on>.5?'#fff7c2':'rgba(255,255,255,.35)';g.lineWidth=2.5;g.beginPath();g.moveTo(-5,10);g.lineTo(-5,-4);g.lineTo(0,-10);g.lineTo(5,-4);g.lineTo(5,10);g.stroke();
  g.restore()}
const bulbOn=()=>{const m=hz.m.blackout;if(!m)return 1;return m.t<m.warn?(nightExtra>0?.05:1):0};
const BX=W=>W-44,BY=c=>c+44;
function begin(){const M=SC.mem;M.camTop=sw().y-66;startEvent('blackout');const m=hz.m.blackout;if(m)m.t=.45}
// scene A: ignore it -> an ordinary (not perfect) landing, the lights stay off
const A={level:91,floors:4,seed:11,dur:9,fadeOut:true,
  start(){begin()},
  speed(t){const M=SC.mem,m=hz.m.blackout;if(M.landT!=null)return t-M.landT<.7?.45:1;if(M.dropT!=null)return .45;return m&&m.t>m.warn+.15?.5:1},
  tick(t){const M=SC.mem,I=[],s=sw(),ts=topScreen(),bx=BX(W),by=BY(M.camTop),m=hz.m.blackout;
    if(M.dropT==null&&dark())I.push(guide(ts,s,false));
    if(M.dropT==null&&dark()&&m.t>m.warn+.3&&dropAt(M,p=>Math.abs(p)-.36))M.dropT=t;
    if(M.dropT!=null&&M.landT==null&&!dropping){M.landT=t;this.dur=t+1.9}
    const on=bulbOn();I.push({k:'fn',f:g=>bulb(g,bx,by,on,t,0)});
    if(M.landT==null&&m&&m.t<m.warn+.5)I.push({k:'ring',x:bx,y:by-4,r:38,col:'#ef4444'});
    if(M.landT!=null){const p=Math.min(1,(t-M.landT)/.45);
      I.push({k:'ring',x:ts.x,y:ts.y,r:56,col:'#ef4444'});I.push({k:'ring',x:bx,y:by-4,r:38,col:'#ef4444'});
      I.push({k:'badge',x:ts.x+(ts.x<W/2?84:-84),y:ts.y-62,ok:false,p})}
    return I}};
// scene B: wait until the Sharliz is right above the tower, tap -> PERFECT -> power back
const B={level:91,floors:4,seed:11,dur:9,fadeIn:true,fadeOut:true,
  start(){begin();const M=SC.mem;M.h={x:W*.9,y:M.camTop+560};M.press=-9},
  speed(t){const M=SC.mem;if(M.landT!=null)return t-M.landT<.8?.5:1;if(M.dropT!=null)return .5;return dark()?.55:1},
  tick(t){const M=SC.mem,I=[],s=sw(),ts=topScreen(),bx=BX(W),by=BY(M.camTop),dt=1/30,m=hz.m.blackout;
    const hx=W*.8,hy=ts.y-30,gone=M.dropT!=null&&t-M.dropT>.35,tx=gone?W+70:hx,ty=gone?ts.y+260:hy;M.h.x+=(tx-M.h.x)*Math.min(1,dt*(gone?3:5));M.h.y+=(ty-M.h.y)*Math.min(1,dt*(gone?3:5));
    if(M.dropT==null&&dark()){const al=pred();
      if(m.t>m.warn+.3&&Math.hypot(M.h.x-hx,M.h.y-hy)<12&&dropAt(M)){M.dropT=t;M.press=t;M.tap={x:M.h.x,y:M.h.y,t}}
      I.push(guide(ts,s,M.dropT!=null||(al!=null&&Math.abs(al)<.12)))}
    if(M.dropT!=null&&M.landT==null&&!dropping){M.landT=t;this.dur=t+1.8}
    const on=M.landT!=null?1:bulbOn(),pop=M.landT!=null?Math.max(0,1-(t-M.landT)/.4):0;I.push({k:'fn',f:g=>bulb(g,bx,by,on,t,pop)});
    if(M.landT==null&&m&&m.t<m.warn+.5)I.push({k:'ring',x:bx,y:by-4,r:38,col:'#ef4444'});
    if(M.landT!=null){const p=Math.min(1,(t-M.landT)/.45);I.push({k:'ring',x:ts.x,y:ts.y,r:56,col:'#22c55e'});I.push({k:'ring',x:bx,y:by-4,r:38,col:'#22c55e'});I.push({k:'badge',x:ts.x+(ts.x<W/2?84:-84),y:ts.y-62,ok:true,p})}
    if(M.tap){const p=(t-M.tap.t)/.45;if(p<1){I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p})}}
    I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.2)});
    return I}};
SC.scenes=[A,B];
})();
