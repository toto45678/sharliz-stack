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
// Rising lava (volcanoN, passive): lava climbs the tower; if it reaches the top Sharliz you lose a heart. A PERFECT landing cools it (-0.8 floor).
// same colours in both scenes
const paint=()=>{if(swinger)swinger.color=COLORS[0];const cs=[COLORS[1],COLORS[3],COLORS[2],COLORS[1]];tower.forEach((s,i)=>{if(i)s.color=cs[i%cs.length]})};
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const lavaY=m=>sy(-.2*BH-(m.lvl+.5)*STEP);
const topI=()=>tower.length-1;
function dash(g,x1,y1,x2,y2,col,w=4){g.save();g.setLineDash([9,8]);g.lineCap='round';g.lineWidth=w+4;g.strokeStyle=SC_lib.INK;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.lineWidth=w;g.strokeStyle=col;g.stroke();g.restore()}
// red "rising" arrows standing on the lava surface (both sides of the tower)
function upArrows(I,ly,t,col,a=1){if(a<=0)return;const b=Math.sin(t*6)*5;for(const x of [W*.15,W*.85])I.push({k:'arrow',x1:x,y1:ly-8+b,x2:x,y2:ly-78+b,col,p:a})}
const A={level:141,floors:5,dur:9,seed:7,fadeOut:true,
  start(){paint();const m=hz.m.lava;m.lvl=topI()-1.15;SC.mem.h0=hearts;this.camTop=sy(swingY())-62},
  speed(t){const m=hz.m.lava,M=SC.mem;if(M.hitT!=null)return t-M.hitT<.6?.45:1;if(!m)return 1;return (topI()-.25)-m.lvl<.1?.5:1},
  tick(t){const m=hz.m.lava,M=SC.mem,I=[],T=topScreen();
    if(M.hitT==null&&hearts<M.h0){M.hitT=t;M.hp={x:T.x,y:T.y};this.dur=t+1.8}
    if(M.hitT==null&&m){const ly=lavaY(m),gap=(topI()-.25)-m.lvl;
      upArrows(I,ly,t,'#ef4444',Math.min(1,t/.35));
      I.push({k:'ring',x:T.x,y:T.y,r:56,col:'#ef4444'});
      if(gap<.35){const a=Math.min(1,(.35-gap)/.12)*.5;I.push({k:'spot',x:T.x,y:T.y+10,r:80,a})}}
    if(M.hitT!=null){const p=Math.min(1,(t-M.hitT)/.45);I.push({k:'ring',x:M.hp.x,y:M.hp.y,r:56,col:'#ef4444'});I.push({k:'badge',x:M.hp.x+66,y:M.hp.y-62,ok:false,p})}
    return I}};
const B={level:141,floors:5,dur:12,seed:7,fadeIn:true,fadeOut:true,
  start(){paint();const m=hz.m.lava,M=SC.mem;m.lvl=topI()-1.2;this.camTop=sy(swingY())-62;M.h={x:W*.77,y:sw().y+165};M.press=-9;M.taps=[];M.cool=[];M.n=0;M.p0=lv.perfect},
  speed(t){const M=SC.mem;if(M.doneT!=null||!swinger||swinger.entering)return 1;return Math.abs(swinger.xs-tower[topI()].xs)<.45?.45:1},
  tick(t){const m=hz.m.lava,M=SC.mem,I=[],T=topScreen(),s=sw();
    // tap exactly when the swinging Sharliz is above the tower
    if(M.doneT==null&&M.n<2&&state==='aim'&&swinger&&!swinger.entering&&t-M.press>.5&&SC_aim(.025)){drop();M.press=t;M.taps.push({x:M.h.x,y:M.h.y,t,ax:s.x,ay:s.y,by:T.y});M.n++}
    if(lv.perfect>M.p0){M.p0=lv.perfect;M.cool.push({t});if(M.cool.length>=2)M.doneT=t+.15}
    if(m){const ly=lavaY(m);
      const last=M.cool[M.cool.length-1];
      if(last&&t-last.t<.9){const p=Math.min(1,(t-last.t)/.3),b=Math.sin(t*6)*4,yb=Math.min(ly,this.camTop+478);for(const x of [W*.15,W*.85])I.push({k:'arrow',x1:x,y1:yb-92+b,x2:x,y2:yb-14+b,col:'#22c55e',p})}
      else if(M.doneT==null)upArrows(I,ly,t,'#ef4444',Math.min(1,t/.35)*.9)}
    // aim guide: dashed line from the swinger down to the top of the tower
    if(M.doneT==null&&swinger&&!swinger.entering&&state==='aim'){const al=Math.abs(swinger.xs-tower[topI()].xs)<.12;I.push({k:'fn',f:g=>dash(g,T.x,T.y-BH*.62,T.x,s.y+BH*.62,al?'#22c55e':'#facc15',4)})}
    for(const q of M.taps){const p=(t-q.t)/.5;if(p<1){I.push({k:'ripple',x:q.x,y:q.y,p});I.push({k:'ring',x:q.x,y:q.y,r:26+p*8,col:'#22c55e'})}}
    for(const c of M.cool){const p=(t-c.t)/.7;if(p<1){const L=tower[topI()];I.push({k:'ring',x:xOf(L.xs),y:sy(yOf(topI())),r:54+p*8,col:'#22c55e'})}}
    if(M.doneT!=null&&t>=M.doneT){if(!M.bp)M.bp={x:W/2,y:s.y+110};const p=Math.min(1,(t-M.doneT)/.45);I.push({k:'badge',x:M.bp.x,y:M.bp.y,ok:true,p});if(!M.endSet){M.endSet=1;this.dur=t+1.5}}
    const pr=Math.max(0,1-(t-M.press)/.18);
    if(M.doneT==null||t-M.doneT<.2)I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});
    else{M.h.x+=(W*.9-M.h.x)*.12;M.h.y+=(s.y+420-M.h.y)*.12;I.push({k:'hand',x:M.h.x,y:M.h.y,press:0})}
    return I}};
SC.scenes=[A,B];
})();
