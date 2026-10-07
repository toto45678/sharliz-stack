(async()=>{
// wait until the game has booted and baked its sprites (rec.py gives up after 60 s on a busy machine); evaluate() awaits this promise
await new Promise(r=>{const t0=performance.now();let ok=0;const k=()=>{try{if(typeof H3!=='undefined'&&H3.state==='ready'&&H3.baked){if(!ok)ok=performance.now();if(performance.now()-ok>2500)return r()}}catch(e){}if(performance.now()-t0>400000)return r();setTimeout(k,250)};k()});
// scorpion (level 101): climbs the tower; at the top it stings a Sharliz off. Tap it to flick it away.
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const pred=()=>{if(state!=='aim'||!swinger||swinger.entering)return null;const top=tower[tower.length-1],dist=Math.max(1,yOf(tower.length)-swingY()),tf=Math.sqrt(2*dist/(BH*30*zone().grav));return swinger.xs+wind*tf-top.xs};
const dropNow=()=>{try{busy=false;tapBuf=-9}catch(e){}drop()};
const dropAt=(M,f=p=>p)=>{const p=pred();if(p==null){M.pp=null;return false}const d=f(p),pd=M.pp;M.pp=d;if(pd==null)return false;const v=d-pd;
  if(Math.abs(d)<.01){dropNow();return state==='drop'}
  if(v&&Math.sign(d+v)!==Math.sign(d)&&Math.abs(v)<.5){const sp=SC.s.speed?SC.s.speed(SC.t):1;SC_step(1,1000/30*sp*Math.min(1,Math.abs(d/v)));dropNow();return state==='drop'}return false};
const pos=()=>{const m=hz.m.scorpion;return m&&!m.fly?MECH.scorpion.pos(m):null};
const SIDE=1;
function begin(){const M=SC.mem;M.camTop=sw().y-40;startEvent('scorpion');const m=hz.m.scorpion;if(m){m.side=SIDE;m.c=tower.length-1-1.3}M.n0=tower.length;M.top=tower[tower.length-1]}
// scene A: nobody taps it -> it reaches the top and stings the top Sharliz off
const A={level:101,floors:5,seed:5,dur:9,fadeOut:true,
  start(){begin()},
  speed(t){const M=SC.mem,m=hz.m.scorpion;if(M.hitT!=null)return t-M.hitT<.7?.4:1;if(t<1.1)return .35;if(m&&!m.fly&&m.c>tower.length-1-.45)return .35;return 1},
  tick(t){const M=SC.mem,I=[];const p=pos();
    if(M.hitT==null){
      if(p){const ts=topScreen();
        if(t<1.1)I.push({k:'spot',x:p.x,y:p.y,r:60,a:.55*Math.min(1,t/.2)*Math.min(1,(1.1-t)/.25)});
        I.push({k:'ring',x:p.x,y:p.y,r:42,col:'#ef4444'});
        const tx=ts.x+SIDE*S*.55,ty=ts.y+8,L=p.y-ty;if(L>70)I.push({k:'arrow',x1:p.x+SIDE*42,y1:p.y-26,x2:tx+SIDE*42,y2:ty+6,col:'#ef4444',p:1})}
      else if(tower.length<M.n0){M.hitT=t;M.wy=yOf(M.n0-1);M.wx=xOf(tower[tower.length-1].xs);this.dur=t+1.9}}
    if(M.hitT!=null){const q=Math.min(1,(t-M.hitT)/.45),b=bodies.find(b=>b.s===M.top);
      if(b&&t-M.hitT<1.2)I.push({k:'ring',x:b.x,y:sy(b.y),r:52,col:'#ef4444'});
      I.push({k:'badge',x:M.wx-SIDE*80,y:sy(M.wy)-20,ok:false,p:q})}
    return I}};
// scene B: tap the scorpion while it climbs -> it flies off, the tower stays, then a perfect drop
const B={level:101,floors:5,seed:5,dur:12,fadeIn:true,fadeOut:true,
  start(){begin();const M=SC.mem;M.h={x:W*.95,y:M.camTop+560};M.press=-9},
  speed(t){const M=SC.mem;return M.doneT==null?.5:1},
  tick(t){const M=SC.mem,I=[],dt=1/30,p=pos(),ts=topScreen();
    if(M.tapT==null&&p){const tx=p.x,ty=p.y-4;M.h.x+=(tx-M.h.x)*Math.min(1,dt*7);M.h.y+=(ty-M.h.y)*Math.min(1,dt*7);
      I.push({k:'ring',x:p.x,y:p.y,r:42,col:'#facc15'});
      if(t>.7&&Math.hypot(M.h.x-tx,M.h.y-ty)<10){SC_tap(p.x,p.y);M.tapT=t;M.press=t;M.tap={x:p.x,y:p.y,t}}}
    else{const k=M.doneT!=null&&t-M.doneT>.3;M.h.x+=((k?W+70:W*.86)-M.h.x)*Math.min(1,dt*3);M.h.y+=((k?ts.y+280:ts.y+120)-M.h.y)*Math.min(1,dt*3)}
    if(M.tapT!=null&&M.doneT==null&&t-M.tapT>.5)M.doneT=t;
    if(M.tap){const q=(t-M.tap.t)/.45;if(q<1){I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p:q});I.push({k:'ring',x:M.tap.x,y:M.tap.y,r:42+q*10,col:'#22c55e'})}}
    if(M.doneT!=null){const q=Math.min(1,(t-M.doneT)/.45);if(!M.cw)M.cw={x:ts.x-SIDE*96,wy:scrToW(ts.y-40)};
      I.push({k:'badge',x:M.cw.x,y:sy(M.cw.wy),ok:true,p:q});
      if(t-M.doneT>.45&&M.dropT==null&&(dropAt(M)||t-M.doneT>2.5)){if(state==='aim')dropNow();M.dropT=t}
      if(M.dropT!=null&&!dropping&&!M.endSet){M.endSet=1;this.dur=t+1.5}}
    I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)});
    return I}};
SC.scenes=[A,B];
})();
