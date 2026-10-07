(()=>{
// keep unrelated random pieces out of the clip (special swinger hazards, sticky/magnet) — like SC.allowHz does for events
if(!window.__scPlain){window.__scPlain=1;
  // clock guard: on a busy machine the game's last real animation frame can fire late, after the virtual clock took over, and turn the
  // clock back (negative dt). Between recorded frames update/render are parked, and time/last are put back if anything ran meanwhile.
  const U=update,R=render,nop=()=>{},st=__man.step;let quiet=false,park=null;
  __man.step=function(ms){if(park){time=park.t;last=park.l}update=U;render=quiet?nop:R;try{return st.call(this,ms)}finally{park={t:time,l:last};update=nop;render=nop}};
  // same game clock every run (wind, swing bob); the unrecorded tower build skips drawing (else the GPU backlog stalls the first screenshot)
  const _su=window.SC_setup;window.SC_setup=i=>{park=null;time=500;last=__man.now();quiet=true;try{return _su(i)}finally{quiet=false;flyCoins.length=0}};
  const _hs=hzSwinger;hzSwinger=function(){if(SC.allowHz)return _hs.apply(this,arguments)};
  const _sp=spawnSwinger;spawnSwinger=function(){const n=popups.length;const r=_sp.apply(this,arguments);if(!SC.allowHz&&swinger&&(swinger.kind==='sticky'||swinger.kind==='magnet')){swinger.kind=null;popups.length=n}return r}}
// Flying newspaper (cityS): a newspaper covers the view for 5 s. Tap it to tear it off.
// same colours in both scenes
const paint=()=>{if(swinger)swinger.color=COLORS[0];const cs=[COLORS[1],COLORS[3],COLORS[2],COLORS[1]];tower.forEach((s,i)=>{if(i)s.color=cs[i%cs.length]})};
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const paper=()=>hz.m.newspaper;
// red/green frame hugging the newspaper
function frame(g,m,col,t){const w=S*3.4+18,h=S*2.5+18,q=(t*1.6)%1;g.save();g.translate(m.x,m.y);g.rotate(m.rot);
  g.lineJoin='round';g.lineWidth=8;g.strokeStyle=SC_lib.INK;g.beginPath();g.roundRect(-w/2,-h/2,w,h,14);g.stroke();g.lineWidth=4.5;g.strokeStyle=col;g.stroke();
  g.globalAlpha=1-q;g.lineWidth=3;const e=q*16;g.beginPath();g.roundRect(-w/2-e,-h/2-e,w+e*2,h+e*2,14+e);g.stroke();g.restore()}
const startP=()=>{startEvent('newspaper');const m=paper();if(m){m.x=topScreen().x;m.rot=-.09}};
const A={level:171,floors:5,dur:9,seed:3,fadeOut:true,
  start(){paint();startP();const M=SC.mem;M.h0=hearts;M.h={x:W*.82,y:topScreen().y-40};M.press=-9},
  speed(t){const M=SC.mem;if(M.hitT!=null)return t-M.hitT<.5?.5:1;if(M.dropT!=null)return .4;if(t<.8)return .55;return 1},
  tick(t){const M=SC.mem,I=[],s=sw(),T=topScreen(),m=paper();
    if(M.hitT==null&&hearts<M.h0){M.hitT=t;M.hp=M.land||{x:s.x,y:T.y};this.dur=t+1.7}
    if(dropping)M.land={x:xOf(dropping.xs),y:T.y};
    if(m&&!m.torn&&M.hitT==null){if(t<1.2)I.push({k:'spot',x:m.x,y:m.y,r:S*2.1,a:.5*Math.min(1,t/.2)*Math.min(1,(1.2-t)/.3)});I.push({k:'fn',f:g=>frame(g,m,'#ef4444',t)})}
    // can't see the tower: the player taps blind, while the Sharliz is off to the side behind the paper
    if(M.dropT==null&&t>1.5&&state==='aim'&&swinger&&!swinger.entering&&swinger.xs>.62&&swinger.xs<.9){drop();M.dropT=t;M.press=t;M.tap={x:M.h.x,y:M.h.y,t}}
    if(M.tap){const p=(t-M.tap.t)/.5;if(p<1)I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p})}
    if(M.hitT!=null){const p=Math.min(1,(t-M.hitT)/.45);I.push({k:'ring',x:M.hp.x,y:M.hp.y,r:50,col:'#ef4444'});I.push({k:'badge',x:Math.max(44,Math.min(W-44,M.hp.x+(M.hp.x<W/2?-62:62))),y:M.hp.y-74,ok:false,p})}
    if(M.dropT==null||t-M.dropT<.45)I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)});
    return I}};
const B={level:171,floors:5,dur:12,seed:3,fadeIn:true,fadeOut:true,
  start(){paint();startP();const M=SC.mem;M.h={x:W*.82,y:topScreen().y-40};M.press=-9;M.p0=lv.perfect},
  speed(t){const M=SC.mem;return M.tornT==null?(t<.8?.55:.7):1},
  tick(t){const M=SC.mem,I=[],dt=1/30,s=sw(),m=paper();
    if(M.tornT==null&&m){I.push({k:'fn',f:g=>frame(g,m,'#facc15',t)});
      if(t>.7){const tx=m.x+S*.25,ty=m.y+S*.35;M.h.x+=(tx-M.h.x)*Math.min(1,dt*7);M.h.y+=(ty-M.h.y)*Math.min(1,dt*7);
        if(Math.hypot(M.h.x-tx,M.h.y-ty)<10&&SC_tap(M.h.x,M.h.y)){M.tornT=t;M.press=t;M.tap={x:M.h.x,y:M.h.y,t}}}}
    if(M.tap){const p=(t-M.tap.t)/.5;if(p<1){I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p});I.push({k:'ring',x:M.tap.x,y:M.tap.y,r:40+p*10,col:'#22c55e'})}}
    if(M.tornT!=null){if(!M.bp)M.bp={x:W/2,y:s.y+110};const p=Math.min(1,(t-M.tornT-.35)/.45);if(p>0)I.push({k:'badge',x:M.bp.x,y:M.bp.y,ok:true,p});
      if(t-M.tornT>.8&&!M.dropped&&(SC_aim(.035)||t-M.tornT>3)){drop();M.dropped=t}
      if(M.dropped&&!M.endSet){M.endSet=1;this.dur=t+1.6}
      M.h.x+=(W*.9-M.h.x)*Math.min(1,dt*4);M.h.y+=(s.y+440-M.h.y)*Math.min(1,dt*4)}
    I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)});
    return I}};
SC.scenes=[A,B];
})();
