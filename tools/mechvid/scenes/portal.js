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
// Portals (spaceN): while open, the swinging Sharliz does not bounce at the edge — it goes into one portal and comes out of the other.
// same colours in both scenes
const paint=()=>{if(swinger)swinger.color=COLORS[0];const cs=[COLORS[1],COLORS[3],COLORS[2],COLORS[1]];tower.forEach((s,i)=>{if(i)s.color=cs[i%cs.length]})};
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const pX=side=>side<0?xOf(-rangeXs())-S*.5:xOf(rangeXs())+S*.5;
function dash(g,x1,y1,x2,y2,col,w=4){g.save();g.setLineDash([9,8]);g.lineCap='round';g.lineWidth=w+4;g.strokeStyle=SC_lib.INK;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.lineWidth=w;g.strokeStyle=col;g.stroke();g.restore()}
// dashed jump arc from the portal it went into to the portal it came out of
function jumpArc(g,x1,x2,y,col,p){const mx=(x1+x2)/2,h=46,N=40,k=Math.max(.02,Math.min(1,p));g.save();g.lineCap='round';g.setLineDash([10,9]);
  const path=()=>{g.beginPath();for(let i=0;i<=N*k;i++){const u=i/N,x=x1+(x2-x1)*u,yy=y-64-Math.sin(u*Math.PI)*h;i?g.lineTo(x,yy):g.moveTo(x,yy)}};
  g.lineWidth=9;g.strokeStyle=SC_lib.INK;path();g.stroke();g.lineWidth=5;g.strokeStyle=col;path();g.stroke();g.setLineDash([]);
  const u=k,ex=x1+(x2-x1)*u,ey=y-64-Math.sin(u*Math.PI)*h,u2=Math.max(0,u-.03),px=x1+(x2-x1)*u2,py=y-64-Math.sin(u2*Math.PI)*h,a=Math.atan2(ey-py,ex-px);
  g.translate(ex,ey);g.rotate(a);for(const [w,c] of [[1.35,SC_lib.INK],[1,col]]){g.fillStyle=c;g.beginPath();g.moveTo(9*w,0);g.lineTo(-11*w,-10*w);g.lineTo(-11*w,10*w);g.closePath();g.fill()}g.restore()}
function track(M,t){if(!swinger||swinger.entering)return;const x=swinger.xs;if(M.px!=null&&Math.sign(x)!==Math.sign(M.px)&&Math.abs(x)>rangeXs()*.85&&Math.abs(M.px)>rangeXs()*.85&&M.tpT==null){M.tpT=t;M.from=Math.sign(M.px);M.to=Math.sign(x)}M.px=x}
const A={level:151,floors:5,dur:9,seed:11,fadeOut:true,
  start(){paint();startEvent('portal');this.camTop=sy(swingY())-130;const M=SC.mem;M.h0=hearts;M.h={x:W*.77,y:sw().y+160};M.press=-9},
  speed(t){const M=SC.mem;if(M.hitT!=null)return t-M.hitT<.5?.5:1;if(M.tpT!=null&&M.dropT==null)return .35;if(swinger&&!swinger.entering&&Math.abs(swinger.xs)>rangeXs()*.8)return .45;return 1},
  tick(t){const M=SC.mem,I=[],s=sw();track(M,t);
    if(M.hitT==null&&hearts<M.h0){M.hitT=t;M.hp=M.land||{x:s.x,y:topScreen().y};this.dur=t+1.7}
    if(dropping&&M.dropT!=null)M.land={x:xOf(dropping.xs),y:topScreen().y};
    if(M.tpT==null&&swinger&&!swinger.entering){const side=Math.sign(swinger.dir)||1,px=pX(side);
      I.push({k:'ring',x:px,y:s.y,r:50,col:'#ef4444'});if(Math.abs(px-s.x)>110)I.push({k:'arrow',x1:s.x+side*46,y1:s.y,x2:px-side*52,y2:s.y,col:'#ef4444',p:1})}
    if(M.tpT!=null&&M.hitT==null){const p=(t-M.tpT)/.5;I.push({k:'fn',f:g=>jumpArc(g,pX(M.from),pX(M.to),s.y,'#ffffff',p)});I.push({k:'ring',x:pX(M.to),y:s.y,r:50,col:'#ef4444'});
      if(t-M.tpT<.9)I.push({k:'spot',x:pX(M.to),y:s.y,r:74,a:.4*Math.min(1,(t-M.tpT)/.15)})
      // the player taps as it pops out on the far side — too early, it is nowhere near the tower
      if(M.dropT==null&&t-M.tpT>.42&&state==='aim'){drop();M.dropT=t;M.press=t;M.tap={x:M.h.x,y:M.h.y,t}}}
    if(M.tap){const p=(t-M.tap.t)/.5;if(p<1)I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p})}
    if(M.hitT!=null){const p=Math.min(1,(t-M.hitT)/.45);I.push({k:'ring',x:M.hp.x,y:M.hp.y,r:50,col:'#ef4444'});I.push({k:'badge',x:Math.max(44,Math.min(W-44,M.hp.x+(M.hp.x<W/2?-62:62))),y:M.hp.y-74,ok:false,p})}
    if(M.dropT==null||t-M.dropT<.45)I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)});
    return I}};
const B={level:151,floors:5,dur:12,seed:11,fadeIn:true,fadeOut:true,
  start(){paint();startEvent('portal');this.camTop=sy(swingY())-130;const M=SC.mem;M.h={x:W*.77,y:sw().y+160};M.press=-9;M.p0=lv.perfect},
  speed(t){const M=SC.mem;if(M.doneT!=null)return 1;if(M.tpT!=null&&t-M.tpT<.6)return .4;if(swinger&&!swinger.entering&&(Math.abs(swinger.xs)>rangeXs()*.8||M.tpT!=null&&Math.abs(swinger.xs-tower[tower.length-1].xs)<.45))return .45;return 1},
  tick(t){const M=SC.mem,I=[],s=sw(),T=topScreen();track(M,t);
    if(M.tpT==null&&swinger&&!swinger.entering){const side=Math.sign(swinger.dir)||1;I.push({k:'ring',x:pX(side),y:s.y,r:50,col:'#facc15'})}
    if(M.tpT!=null&&M.dropT==null){const p=(t-M.tpT)/.5;I.push({k:'fn',f:g=>jumpArc(g,pX(M.from),pX(M.to),s.y,'#ffffff',p)});
      if(swinger){const al=Math.abs(swinger.xs-tower[tower.length-1].xs)<.12;I.push({k:'fn',f:g=>dash(g,T.x,T.y-BH*.62,T.x,s.y+BH*.62,al?'#22c55e':'#facc15',4)});
        I.push({k:'ring',x:s.x,y:s.y,r:52,col:'#facc15'})}
      // wait until it is right above the tower, then tap
      if(state==='aim'&&swinger&&!swinger.entering&&t-M.tpT>.3&&SC_aim(.025)){drop();M.dropT=t;M.press=t;M.tap={x:M.h.x,y:M.h.y,t}}}
    if(M.tap){const p=(t-M.tap.t)/.5;if(p<1){I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p});I.push({k:'ring',x:M.tap.x,y:M.tap.y,r:26+p*8,col:'#22c55e'})}}
    if(M.doneT==null&&lv.perfect>M.p0){M.doneT=t;M.bp={x:W/2,y:s.y+105};this.dur=t+1.6}
    if(M.doneT!=null){const p=Math.min(1,(t-M.doneT)/.45),L=tower[tower.length-1];I.push({k:'ring',x:xOf(L.xs),y:sy(yOf(tower.length-1)),r:54,col:'#22c55e'});I.push({k:'badge',x:M.bp.x,y:M.bp.y,ok:true,p})}
    const pr=Math.max(0,1-(t-M.press)/.18);
    if(M.doneT==null)I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});else{M.h.x+=(W*.9-M.h.x)*.12;M.h.y+=(s.y+420-M.h.y)*.12;I.push({k:'hand',x:M.h.x,y:M.h.y,press:0})}
    return I}};
SC.scenes=[A,B];
})();
