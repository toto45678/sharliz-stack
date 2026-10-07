(async()=>{
// wait until the game has booted and baked its sprites (rec.py gives up after 60 s on a busy machine); evaluate() awaits this promise
await new Promise(r=>{const t0=performance.now();let ok=0;const k=()=>{try{if(typeof H3!=='undefined'&&H3.state==='ready'&&H3.baked){if(!ok)ok=performance.now();if(performance.now()-ok>2500)return r()}}catch(e){}if(performance.now()-t0>400000)return r();setTimeout(k,250)};k()});
// take over the game clock now and let the one real-time frame that is already queued run before SC_setup; on a busy machine it
// otherwise lands after the fast setup with a negative dt (bump jumps ~250px down, hazard timers run backwards)
try{__man.on();const l0=last;await new Promise(r=>{const t0=performance.now();const k=()=>{let ch=false;try{ch=last!==l0}catch(e){ch=true}if(ch||performance.now()-t0>8000)return setTimeout(r,300);setTimeout(k,50)};k()});last=__man.now()}catch(e){}
// jellyfish (level 131): jellyfish float up; a Sharliz dropped through one gets zapped sideways. Tap them to pop them.
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
// predicted landing offset if we dropped now (SC_aim maths + the ocean current)
const pred=()=>{if(state!=='aim'||!swinger||swinger.entering)return null;const top=tower[tower.length-1],dist=Math.max(1,yOf(tower.length)-swingY()),tf=Math.sqrt(2*dist/(BH*30*zone().grav));let x=swinger.xs+wind*tf;try{if(baseId(zone())==='ocean')x+=Math.sin((time+tf*.5)*.9)*.28*tf}catch(e){}return x-top.xs};
const dropNow=()=>{try{busy=false;tapBuf=-9}catch(e){}drop()};
const dropAt=(M,f=p=>p)=>{const p=pred();if(p==null){M.pp=null;return false}const d=f(p),pd=M.pp;M.pp=d;if(pd==null)return false;const v=d-pd;
  if(Math.abs(d)<.01){dropNow();return state==='drop'}
  if(v&&Math.sign(d+v)!==Math.sign(d)&&Math.abs(v)<.5){const sp=SC.s.speed?SC.s.speed(SC.t):1;SC_step(1,1000/30*sp*Math.min(1,Math.abs(d/v)));dropNow();return state==='drop'}return false};
// the zap direction is a coin flip in the game (Math.random()<.5); scene A picks the flip so the push goes the way the Sharliz was already off
// (same as choosing a lucky seed; the push size stays inside the game's own .25-.4 range)
{const u=MECH.jellyfish.update;if(!u.__sc){const w=function(dt,m,live){const f=SC.s&&SC.s.zapDir;if(!f||!dropping||dropping.zapped)return u.call(this,dt,m,live);
  const R=Math.random;let k=0;Math.random=()=>{k++;return k===1?(f<0?.25:.75):k===2?.85:R()};try{return u.call(this,dt,m,live)}finally{Math.random=R}};w.__sc=1;MECH.jellyfish.update=w}}
const AIM=()=>SC.s.aim||0;
const jx=j=>xOf(j.xs);
// keep the game's frame clock on the virtual clock before every step (a stray real-time frame would give a negative dt)
const clk=()=>{try{last=__man.now()}catch(e){}};
function begin(){clk();try{cv.style.filter=''}catch(e){}const M=SC.mem,s=sw();M.camTop=s.y-100;startEvent('jellyfish');const m=hz.m.jellyfish,top=tower[tower.length-1];
  if(m){m.list[0].xs=top.xs+AIM();m.list[0].y=s.y+195;m.list[1].xs=top.xs+(AIM()>0?-1:1)*.95;m.list[1].y=s.y+262}M.n0=tower.length;M.hearts=hearts;M.piece=swinger}
// scene A: drop through a jellyfish -> ZAP, pushed sideways, it misses the tower
const A={level:131,floors:4,seed:3,aim:.17,zapDir:1,dur:9,fadeOut:true,
  start(){begin()},
  speed(t){const M=SC.mem;if(M.zapT!=null)return t-M.zapT<1.2?.35:1;if(M.dropT!=null)return .35;if(t<1.1)return .5;return 1},
  tick(t){clk();const M=SC.mem,I=[],m=hz.m.jellyfish,ts=topScreen();
    const j=m&&m.list[0];
    if(M.zapT==null&&j&&!j.pop){const x=jx(j);if(t<1.1)I.push({k:'spot',x,y:j.y,r:62,a:.5*Math.min(1,t/.2)*Math.min(1,(1.1-t)/.25)});I.push({k:'ring',x,y:j.y,r:46,col:'#ef4444'});
      if(M.dropT==null){const ty=sy(swingY())+BH*1.4;if(j.y<ty+16&&dropAt(M,p=>p-AIM()))M.dropT=t}}
    if(M.dropT!=null&&M.zapT==null&&j&&j.pop){M.zapT=t;M.zp={x:jx(j),y:j.y};M.zx=dropping?xOf(dropping.xs):M.zp.x}
    if(M.zapT!=null){const k=t-M.zapT;if(k<1.1){I.push({k:'ring',x:M.zp.x,y:M.zp.y,r:46+Math.min(1,k/.3)*8,col:'#ef4444'});const d=Math.sign(M.zx-M.zp.x)||1;I.push({k:'arrow',x1:M.zp.x-d*10,y1:M.zp.y-52,x2:M.zx+d*58,y2:M.zp.y-52,col:'#ef4444',p:Math.min(1,k/.2)})}}
    if(M.dropT!=null&&M.endT==null&&!dropping&&state!=='drop'){M.endT=t;M.miss=hearts<M.hearts;M.wy=yOf(tower.length-(M.miss?0:1));const b0=bodies.find(b=>b.s===M.piece);M.wx=b0?b0.x:xOf(M.piece.xs);this.dur=t+1.9}
    if(M.endT!=null){const p=Math.min(1,(t-M.endT)/.45),b=bodies.find(b=>b.s===M.piece),d=Math.sign(M.wx-ts.x)||1;
      if(b&&t-M.endT<1.3)I.push({k:'ring',x:b.x,y:sy(b.y),r:52,col:'#ef4444'});else if(!b&&t-M.endT<1.3)I.push({k:'ring',x:M.wx,y:sy(M.wy),r:52,col:'#ef4444'});
      I.push({k:'badge',x:Math.max(44,Math.min(W-44,ts.x+d*92)),y:sy(M.wy)-64,ok:false,p})}
    return I}};
// scene B: tap both jellyfish -> they pop, then a perfect drop
const B={level:131,floors:4,seed:3,aim:.17,dur:12,fadeIn:true,fadeOut:true,
  start(){begin();const M=SC.mem;M.h={x:W*.95,y:M.camTop+560};M.press=-9;M.i=0;M.taps=[]},
  speed(t){const M=SC.mem;return M.doneT==null?.55:1},
  tick(t){clk();const M=SC.mem,I=[],dt=1/30,m=hz.m.jellyfish,ts=topScreen();
    if(M.doneT==null){const j=m&&m.list[M.i];
      if(j&&!j.pop){const x=jx(j),y=j.y-6;M.h.x+=(x-M.h.x)*Math.min(1,dt*8);M.h.y+=(y-M.h.y)*Math.min(1,dt*8);I.push({k:'ring',x,y:j.y,r:46,col:'#facc15'});
        if(t>.6&&t-M.press>.3&&Math.hypot(M.h.x-x,M.h.y-y)<10){SC_tap(x,j.y);M.press=t;M.taps.push({x,y:j.y,t});M.i++}}
      else if(j&&j.pop)M.i++;
      if(M.i>=2||!m)M.doneT=t+.35}
    else{const k=t-M.doneT>.3;M.h.x+=((k?W+70:W*.86)-M.h.x)*Math.min(1,dt*3);M.h.y+=((k?ts.y+280:ts.y+40)-M.h.y)*Math.min(1,dt*3)}
    for(const q of M.taps){const p=(t-q.t)/.45;if(p<1){I.push({k:'ripple',x:q.x,y:q.y,p});I.push({k:'ring',x:q.x,y:q.y,r:46+p*10,col:'#22c55e'})}}
    if(M.doneT!=null&&t>=M.doneT){const q=Math.min(1,(t-M.doneT)/.45);if(!M.cw)M.cw={x:W/2,wy:scrToW(sy(swingY())+BH*1.4)};I.push({k:'badge',x:M.cw.x,y:sy(M.cw.wy),ok:true,p:q});
      if(t-M.doneT>.45&&M.dropT==null&&(dropAt(M)||t-M.doneT>2.5)){if(state==='aim')dropNow();M.dropT=t}
      if(M.dropT!=null&&!dropping&&!M.endSet){M.endSet=1;this.dur=t+1.5}}
    I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)});
    return I}};
SC.scenes=[A,B];
})();
