(async()=>{
// wait until the game has booted and baked its sprites (rec.py gives up after 60 s on a busy machine); evaluate() awaits this promise
await new Promise(r=>{const t0=performance.now();let ok=0;const k=()=>{try{if(typeof H3!=='undefined'&&H3.state==='ready'&&H3.baked){if(!ok)ok=performance.now();if(performance.now()-ok>2500)return r()}}catch(e){}if(performance.now()-t0>400000)return r();setTimeout(k,250)};k()});
// take over the game clock now and let the one real-time frame that is already queued run before SC_setup; on a busy machine it
// otherwise lands after the fast setup with a negative dt (bump jumps ~250px down, hazard timers run backwards)
try{__man.on();const l0=last;await new Promise(r=>{const t0=performance.now();const k=()=>{let ch=false;try{ch=last!==l0}catch(e){ch=true}if(ch||performance.now()-t0>8000)return setTimeout(r,300);setTimeout(k,50)};k()});last=__man.now()}catch(e){}
// icicle (level 121): an icicle grows above the tower and drops on the top. Tap it to shatter it first.
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const pred=()=>{if(state!=='aim'||!swinger||swinger.entering)return null;const top=tower[tower.length-1],dist=Math.max(1,yOf(tower.length)-swingY()),tf=Math.sqrt(2*dist/(BH*30*zone().grav));return swinger.xs+wind*tf-top.xs};
const dropNow=()=>{try{busy=false;tapBuf=-9}catch(e){}drop()};
const dropAt=(M,f=p=>p)=>{const p=pred();if(p==null){M.pp=null;return false}const d=f(p),pd=M.pp;M.pp=d;if(pd==null)return false;const v=d-pd;
  if(Math.abs(d)<.01){dropNow();return state==='drop'}
  if(v&&Math.sign(d+v)!==Math.sign(d)&&Math.abs(v)<.5){const sp=SC.s.speed?SC.s.speed(SC.t):1;SC_step(1,1000/30*sp*Math.min(1,Math.abs(d/v)));dropNow();return state==='drop'}return false};
const ice=()=>{const m=hz.m.icicle;return m&&!m.shard?m:null};
// keep the game's frame clock on the virtual clock before every step (a stray real-time frame would give a negative dt)
const clk=()=>{try{last=__man.now()}catch(e){}};
function begin(){clk();try{cv.style.filter=''}catch(e){}const M=SC.mem;M.camTop=sw().y-104;startEvent('icicle');const m=hz.m.icicle;if(m){m.y=M.camTop+40;m.t=1.5;m.x=topScreen().x+S*.12}M.n0=tower.length;M.top=tower[tower.length-1]}
// scene A: nobody taps it -> it falls and knocks the top Sharliz off
const A={level:121,floors:4,seed:3,dur:9,fadeOut:true,
  start(){begin()},
  speed(t){const M=SC.mem,m=ice();if(M.hitT!=null)return t-M.hitT<.7?.4:1;if(t<1.1)return .35;if(m&&m.fall)return .4;return 1},
  tick(t){clk();const M=SC.mem,I=[],m=ice(),ts=topScreen();
    if(M.hitT==null){
      if(m){const cx=m.x,cy=m.y+m.len*.5;
        if(t<1.1)I.push({k:'spot',x:cx,y:cy,r:66,a:.55*Math.min(1,t/.2)*Math.min(1,(1.1-t)/.25)});
        I.push({k:'ring',x:cx,y:cy,r:50,col:'#ef4444'});
        const y1=m.y+m.len+28,y2=ts.y-66;if(y2-y1>60)I.push({k:'arrow',x1:cx,y1,x2:cx,y2,col:'#ef4444',p:1})}
      else if(hz.m.icicle&&hz.m.icicle.shard){M.hitT=t;M.wy=yOf(M.n0-1);M.wx=xOf(M.top.xs);this.dur=t+1.9}}
    if(M.hitT!=null){const q=Math.min(1,(t-M.hitT)/.45),b=bodies.find(b=>b.s===M.top);
      if(b&&t-M.hitT<1.2)I.push({k:'ring',x:b.x,y:sy(b.y),r:52,col:'#ef4444'});
      const d=b?Math.sign(b.vx)||1:1;I.push({k:'badge',x:M.wx-d*82,y:sy(M.wy)-24,ok:false,p:q})}
    return I}};
// scene B: tap the icicle while it grows -> it shatters, then a perfect drop
const B={level:121,floors:4,seed:3,dur:12,fadeIn:true,fadeOut:true,
  start(){begin();const M=SC.mem;M.h={x:W*.95,y:M.camTop+560};M.press=-9},
  speed(t){const M=SC.mem;return M.doneT==null?.5:1},
  tick(t){clk();const M=SC.mem,I=[],dt=1/30,m=ice(),ts=topScreen();
    if(M.tapT==null&&m){const cx=m.x,cy=m.y+m.len*.5;M.h.x+=(cx-M.h.x)*Math.min(1,dt*7);M.h.y+=(cy-M.h.y)*Math.min(1,dt*7);
      I.push({k:'ring',x:cx,y:cy,r:50,col:'#facc15'});
      if(t>.7&&Math.hypot(M.h.x-cx,M.h.y-cy)<10){SC_tap(cx,cy);M.tapT=t;M.press=t;M.tap={x:cx,y:cy,t}}}
    else{const k=M.doneT!=null&&t-M.doneT>.3;M.h.x+=((k?W+70:W*.86)-M.h.x)*Math.min(1,dt*3);M.h.y+=((k?ts.y+280:ts.y+40)-M.h.y)*Math.min(1,dt*3)}
    if(M.tapT!=null&&M.doneT==null&&t-M.tapT>.5)M.doneT=t;
    if(M.tap){const q=(t-M.tap.t)/.45;if(q<1){I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p:q});I.push({k:'ring',x:M.tap.x,y:M.tap.y,r:50+q*10,col:'#22c55e'})}}
    if(M.doneT!=null){const q=Math.min(1,(t-M.doneT)/.45);if(!M.cw)M.cw={x:W/2,wy:scrToW(ts.y-150)};I.push({k:'badge',x:M.cw.x,y:sy(M.cw.wy),ok:true,p:q});
      if(t-M.doneT>.45&&M.dropT==null&&(dropAt(M)||t-M.doneT>2.5)){if(state==='aim')dropNow();M.dropT=t}
      if(M.dropT!=null&&!dropping&&!M.endSet){M.endSet=1;this.dur=t+1.5}}
    I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)});
    return I}};
SC.scenes=[A,B];
})();
