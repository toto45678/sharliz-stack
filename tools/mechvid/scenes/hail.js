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
// Candy hail (candyS): every .42 s a candy hits the top Sharliz and knocks it a little off-center. A PERFECT landing stops the hail.
// same colours in both scenes
const paint=()=>{if(swinger)swinger.color=COLORS[0];const cs=[COLORS[1],COLORS[3],COLORS[2],COLORS[1]];tower.forEach((s,i)=>{if(i)s.color=cs[i%cs.length]})};
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const hail=()=>hz.m.hail;
function dash(g,x1,y1,x2,y2,col,w=4){g.save();g.setLineDash([9,8]);g.lineCap='round';g.lineWidth=w+4;g.strokeStyle=SC_lib.INK;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.lineWidth=w;g.strokeStyle=col;g.stroke();g.restore()}
// gap marker: from the center of the Sharliz below to the knocked top Sharliz
function gap(g,x0,x1,y,col){g.save();g.lineCap='round';for(const [w,c] of [[9,SC_lib.INK],[5,col]]){g.lineWidth=w;g.strokeStyle=c;g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.moveTo(x0,y-11);g.lineTo(x0,y+11);g.moveTo(x1,y-11);g.lineTo(x1,y+11);g.stroke()}g.restore()}
// watch candy hits (each one shoves the top Sharliz)
function hits(M,t){const top=tower[tower.length-1];if(M.tx!=null&&M.topRef===top&&Math.abs(top.xs-M.tx)>.01)M.hits.push({t,dir:Math.sign(top.xs-M.tx),x:xOf(top.xs),y:sy(yOf(tower.length-1))});M.tx=top.xs;M.topRef=top}
const A={level:191,floors:5,dur:9,seed:4,fadeOut:true,
  start(){paint();startEvent('hail');const m=hail(),M=SC.mem;if(m){m.next=0}M.hits=[];M.base=tower[tower.length-2].xs},
  speed(t){const H=SC.mem.hits||[];return H.length&&H.length<=2&&t-H[H.length-1].t<.45?.5:1},
  tick(t){const M=SC.mem,I=[],m=hail(),T=topScreen();hits(M,t);
    if(M.endT==null){if(m)for(const c of m.c)if(!c.hit&&c.y>T.y-330){I.push({k:'ring',x:c.x,y:c.y,r:24,col:'#ef4444'})}
      I.push({k:'ring',x:T.x,y:T.y,r:56,col:'#ef4444'})}
    for(const h of M.hits){const p=(t-h.t)/.5;if(p<1)I.push({k:'arrow',x1:h.x+h.dir*24,y1:h.y-6,x2:h.x+h.dir*96,y2:h.y-6,col:'#ef4444',p:Math.min(1,p*3)})}
    const top=tower[tower.length-1],off=top.xs-M.base;
    if(Math.abs(off)>.05)I.push({k:'fn',f:g=>gap(g,xOf(M.base),xOf(top.xs),T.y+BH*.62,'#ef4444')});
    if(M.endT==null&&M.hits.length&&(M.hits.length>=4&&Math.abs(off)>.22||M.hits.length>=8)&&t-M.hits[M.hits.length-1].t>.2){M.endT=t;this.dur=t+1.8}
    if(M.endT!=null){const p=Math.min(1,(t-M.endT)/.45);I.push({k:'badge',x:T.x+(off>0?-70:70),y:T.y-74,ok:false,p})}
    return I}};
const B={level:191,floors:5,dur:12,seed:2,fadeIn:true,fadeOut:true,
  start(){paint();startEvent('hail');const m=hail(),M=SC.mem;if(m){m.next=0}M.hits=[];M.h={x:W*.8,y:sw().y+150};M.press=-9;M.p0=lv.perfect},
  speed(t){const M=SC.mem;if(M.doneT!=null)return 1;if(M.dropT!=null)return .45;if(M.hits.length>=2&&swinger&&!swinger.entering){const d=Math.abs(swinger.xs-tower[tower.length-1].xs);if(d<.15)return .22;if(d<.45)return .45}return 1},
  tick(t){const M=SC.mem,I=[],m=hail(),T=topScreen(),s=sw();hits(M,t);
    if(M.dropT==null){if(m)for(const c of m.c)if(!c.hit&&c.y>T.y-330)I.push({k:'ring',x:c.x,y:c.y,r:24,col:'#ef4444'});
      for(const h of M.hits){const p=(t-h.t)/.5;if(p<1)I.push({k:'arrow',x1:h.x+h.dir*24,y1:h.y-6,x2:h.x+h.dir*96,y2:h.y-6,col:'#ef4444',p:Math.min(1,p*3)})}}
    // land a PERFECT on top of the shaking Sharliz
    if(M.dropT==null&&M.hits.length>=2&&state==='aim'&&swinger&&!swinger.entering){const al=Math.abs(swinger.xs-tower[tower.length-1].xs)<.12;I.push({k:'fn',f:g=>dash(g,T.x,T.y-BH*.62,T.x,s.y+BH*.62,al?'#22c55e':'#facc15',4)});
      if(SC_aim(.009)){drop();M.dropT=t;M.press=t;M.tap={x:M.h.x,y:M.h.y,t}}}
    if(M.tap){const p=(t-M.tap.t)/.5;if(p<1){I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p});I.push({k:'ring',x:M.tap.x,y:M.tap.y,r:26+p*8,col:'#22c55e'})}}
    if(M.doneT==null&&lv.perfect>M.p0){M.doneT=t;M.bp={x:W/2,y:s.y+105}}
    // the check comes once the hail has stopped (the candies already in the air still land)
    if(M.doneT!=null&&M.okT==null&&(!hail()||t-M.doneT>1.1)){M.okT=t;this.dur=t+1.5}
    if(M.doneT!=null){const L=tower[tower.length-1];if(t-M.doneT<.9)I.push({k:'ring',x:xOf(L.xs),y:sy(yOf(tower.length-1)),r:54,col:'#22c55e'});if(M.okT!=null)I.push({k:'badge',x:M.bp.x,y:M.bp.y,ok:true,p:Math.min(1,(t-M.okT)/.45)})}
    const pr=Math.max(0,1-(t-M.press)/.18);
    if(M.doneT==null)I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});else{M.h.x+=(W*.92-M.h.x)*.12;M.h.y+=(s.y+420-M.h.y)*.12;I.push({k:'hand',x:M.h.x,y:M.h.y,press:0})}
    return I}};
SC.scenes=[A,B];
})();
