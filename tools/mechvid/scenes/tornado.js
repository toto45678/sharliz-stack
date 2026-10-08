(()=>{
// keep unrelated random pieces out of the clip (special swinger hazards, sticky/magnet) — like SC.allowHz does for events
if(!window.__scPlain){window.__scPlain=1;
  // clock guard: on a busy machine the game's last real animation frame can fire late, after the virtual clock took over, and turn the
  // clock back (negative dt). Between recorded frames update/render are parked, and time/last are put back if anything ran meanwhile.
  const U=update,R=render,nop=()=>{},st=__man.step;let quiet=false,park=null;
  __man.step=function(ms){if(park){time=park.t;last=park.l}update=U;render=quiet?nop:R;try{return st.call(this,ms)}finally{park={t:time,l:last};update=nop;render=nop}};
  // same game clock every run (wind, swing bob); the unrecorded tower build skips drawing (else the GPU backlog stalls the first screenshot)
  const _su=window.SC_setup;window.SC_setup=i=>{park=null;time=500;last=__man.now();quiet=true;try{return _su(i)}finally{quiet=false;flyCoins.length=0;try{cv.style.filter=''}catch(e){}}};  // (a combo party during the build can leave a hue filter on the canvas)
  const _hs=hzSwinger;hzSwinger=function(){if(SC.allowHz)return _hs.apply(this,arguments)};
  const _sp=spawnSwinger;spawnSwinger=function(){const n=popups.length;const r=_sp.apply(this,arguments);if(!SC.allowHz&&swinger&&(swinger.kind==='sticky'||swinger.kind==='magnet')){swinger.kind=null;popups.length=n}return r}}
// Tornado (farmS): after a 1.4 s warning it blows everything to one side for 4.2 s (hz.gustV). A PERFECT landing anchors the tower and ends it.
// same colours in both scenes
const paint=()=>{if(swinger)swinger.color=COLORS[0];const cs=[COLORS[1],COLORS[3],COLORS[2],COLORS[1]];tower.forEach((s,i)=>{if(i)s.color=cs[i%cs.length]})};
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const fallT=()=>Math.sqrt(2*Math.max(1,yOf(tower.length)-swingY())/(BH*30*zone().grav));
const DIR=1; // funnel on the left, blows to the right
const funX=()=>DIR>0?W*.08:W*.92;
function dash(g,x1,y1,x2,y2,col,w=4){g.save();g.setLineDash([9,8]);g.lineCap='round';g.lineWidth=w+4;g.strokeStyle=SC_lib.INK;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.lineWidth=w;g.strokeStyle=col;g.stroke();g.restore()}
// predicted fall path (the wind carries it sideways while it falls)
function fallPath(g,x0xs,y0,col,w=4){const tf=fallT(),N=16;g.save();g.setLineDash([9,8]);g.lineCap='round';const pts=[];for(let i=0;i<=N;i++){const tt=tf*i/N;pts.push([xOf(x0xs+wind*tt),y0+BH*15*zone().grav*tt*tt])}
  for(const [lw,c] of [[w+4,SC_lib.INK],[w,col]]){g.lineWidth=lw;g.strokeStyle=c;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke()}g.restore()}
// how far the wind carries a Sharliz dropped now (integrates the tornado's changing push over the fall)
function drift(path){const m=hz.m.tornado,dist=Math.max(1,yOf(tower.length)-swingY()),g=BH*30*zone().grav,dt=1/240,w0=windFor(tower.length);let x=0,v=0,y=0,tt=0;
  while(y<dist&&tt<2){const mt=m?m.t+tt:0,k=m&&mt>m.warn?Math.sin(Math.PI*clamp((mt-m.warn)/m.dur,0,1)):0;x+=(w0+(m?m.dir*2.4*k:0))*dt;v+=g*dt;y+=v*dt;tt+=dt;if(path&&Math.round(tt*240)%12===0)path.push([x,y])}if(path)path.push([x,y]);return x}
function pathDraw(g,P,col,w=4){g.save();g.setLineDash([9,8]);g.lineCap='round';for(const [lw,c] of [[w+4,SC_lib.INK],[w,col]]){g.lineWidth=lw;g.strokeStyle=c;g.beginPath();P.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke()}g.restore()}
const startT=()=>{startEvent('tornado');const m=hz.m.tornado;if(m){m.dir=DIR;m.t=1.0}};
const strong=()=>{const m=hz.m.tornado;return m&&m.t-m.warn>.9};
const A={level:161,floors:5,dur:9,seed:5,fadeOut:true,
  start(){paint();startT();const M=SC.mem;M.h0=hearts;M.h={x:W*.78,y:sw().y+165};M.press=-9},
  speed(t){const M=SC.mem;if(M.hitT!=null)return t-M.hitT<.5?.5:1;if(M.dropT!=null)return .35;if(t<.9)return .6;if(strong()&&swinger&&!swinger.entering&&Math.abs(swinger.xs-tower[tower.length-1].xs)<.5)return .45;return 1},
  tick(t){const M=SC.mem,I=[],s=sw(),T=topScreen(),m=hz.m.tornado;
    if(M.hitT==null&&hearts<M.h0){M.hitT=t;M.hp=M.land||{x:s.x,y:T.y};this.dur=t+1.7}
    if(dropping)M.land={x:xOf(dropping.xs),y:T.y};
    // the funnel: spotlight first, then a red ring and the push arrow
    if(M.dropT==null&&m){const fy=s.y+70;if(t<1.1)I.push({k:'spot',x:funX(),y:fy,r:96,a:.5*Math.min(1,t/.2)*Math.min(1,(1.1-t)/.25)});
      I.push({k:'ring',x:funX(),y:fy,r:62,col:'#ef4444'});if(t>.5)I.push({k:'arrow',x1:funX()+DIR*70,y1:fy+150,x2:funX()+DIR*150,y2:fy+150,col:'#ef4444',p:Math.min(1,(t-.5)/.3)})}
    // the player drops the usual way — right above the tower
    if(M.dropT==null&&strong()&&state==='aim'&&swinger&&!swinger.entering){const al=Math.abs(swinger.xs-tower[tower.length-1].xs)<.12;
      I.push({k:'fn',f:g=>dash(g,T.x,T.y-BH*.62,T.x,s.y+BH*.62,al?'#ffffff':'rgba(255,255,255,.75)',4)});
      if(Math.abs(swinger.xs-tower[tower.length-1].xs)<.035){drop();M.dropT=t;M.press=t;M.tap={x:M.h.x,y:M.h.y,t};M.ax=T.x}}
    if(dropping&&M.dropT!=null){const x=xOf(dropping.xs),y=sy(dropping.y);I.push({k:'ring',x,y,r:52,col:'#ef4444'});I.push({k:'arrow',x1:x+DIR*50,y1:y,x2:x+DIR*130,y2:y+30,col:'#ef4444',p:1});
      I.push({k:'fn',f:g=>dash(g,M.ax,T.y-BH*.62,M.ax,s.y+BH*.62,'rgba(255,255,255,.8)',3)})}
    if(M.tap){const p=(t-M.tap.t)/.5;if(p<1)I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p})}
    if(M.hitT!=null){const p=Math.min(1,(t-M.hitT)/.45);I.push({k:'ring',x:M.hp.x,y:M.hp.y,r:52,col:'#ef4444'});I.push({k:'badge',x:Math.max(44,Math.min(W-44,M.hp.x+(M.hp.x<W/2?-62:62))),y:M.hp.y-72,ok:false,p})}
    if(M.dropT==null||t-M.dropT<.45)I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)});
    return I}};
const B={level:161,floors:5,dur:12,seed:5,fadeIn:true,fadeOut:true,
  start(){paint();startT();const M=SC.mem;M.h={x:W*.78,y:sw().y+165};M.press=-9;M.p0=lv.perfect},
  speed(t){const M=SC.mem;if(M.doneT!=null)return 1;if(M.dropT!=null)return .45;if(t<.9)return .6;if(strong()&&swinger&&!swinger.entering){const tx=tower[tower.length-1].xs-drift();if(Math.abs(swinger.xs-tx)<.5)return .4}return 1},
  tick(t){const M=SC.mem,I=[],s=sw(),T=topScreen(),m=hz.m.tornado;
    if(M.dropT==null&&m){const fy=s.y+70;I.push({k:'ring',x:funX(),y:fy,r:62,col:'#ef4444'});if(t>.5)I.push({k:'arrow',x1:funX()+DIR*70,y1:fy+150,x2:funX()+DIR*150,y2:fy+150,col:'#ef4444',p:Math.min(1,(t-.5)/.3)})}
    // aim UPWIND: drop early so the wind carries it onto the tower
    if(M.dropT==null&&strong()&&state==='aim'&&swinger&&!swinger.entering){const pts=[],dx=drift(pts),txs=tower[tower.length-1].xs-dx,tx=xOf(txs),P=pts.map(([x,y])=>[xOf(txs+x),s.y+BH*.45+y]);
      I.push({k:'fn',f:g=>pathDraw(g,P,'#facc15',4)});I.push({k:'ring',x:tx,y:s.y,r:50,col:'#facc15'});
      if(Math.abs(swinger.xs-txs)<.02){drop();M.dropT=t;M.press=t;M.tap={x:M.h.x,y:M.h.y,t};M.path=P}}
    if(M.path&&M.doneT==null){const P=M.path;I.push({k:'fn',f:g=>pathDraw(g,P,'#22c55e',4)})}
    if(M.tap){const p=(t-M.tap.t)/.5;if(p<1){I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p});I.push({k:'ring',x:M.tap.x,y:M.tap.y,r:26+p*8,col:'#22c55e'})}}
    if(M.doneT==null&&lv.perfect>M.p0){M.doneT=t;M.bp={x:W/2,y:s.y+105};this.dur=t+1.7}
    if(M.doneT!=null){const p=Math.min(1,(t-M.doneT)/.45),L=tower[tower.length-1];if(t-M.doneT<.9)I.push({k:'ring',x:xOf(L.xs),y:sy(yOf(tower.length-1)),r:54,col:'#22c55e'});I.push({k:'badge',x:M.bp.x,y:M.bp.y,ok:true,p})}
    const pr=Math.max(0,1-(t-M.press)/.18);
    if(M.doneT==null)I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});else{M.h.x+=(W*.9-M.h.x)*.12;M.h.y+=(s.y+420-M.h.y)*.12;I.push({k:'hand',x:M.h.x,y:M.h.y,press:0})}
    return I}};
SC.scenes=[A,B];
})();
