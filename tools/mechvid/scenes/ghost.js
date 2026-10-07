(()=>{
// ghost (castle, level 251): a ghost turns the swinging Sharliz invisible; tap the ghost before it reaches the Sharliz
// the shared build uses SC_aim(.02), which never fires at this world's swing speed (the swinger moves ~.09 per frame), so the
// scene builds its floors itself with a wider window (still a PERFECT landing: perfect tolerance is .09)
function build(n){for(let k=0;k<3000&&!(tower.length-1>=n&&state==='aim'&&swinger&&!swinger.entering&&!dropping);k++){if(tower.length-1<n&&SC_aim(.055))drop();SC_step()}
  kaleido=[];popups=[];particles=[];notes=[];combo=0;fever=0;partyT=0;
  // the game's last real animation frame can still fire after this (the virtual clock is far ahead of real time by now):
  // make that stray frame a normal .033 s step instead of a big negative one, and re-sync on the first recorded frame
  last=-1e12;
  try{cv.style.filter=''}catch(e){}   // a perfect-combo party during the build can leave its hue-rotate filter on the canvas
  if(swinger&&(swinger.kind==='sticky'||swinger.kind==='magnet'))swinger.kind=null}   // a random sticky/magnet Sharliz would only distract here
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const gh=()=>hz.m.ghost;
const gpos=m=>MECH.ghost.pos(m);
const RED='#ef4444',YEL='#facc15',GRN='#22c55e';
// GAME BUG (reported): v44 fades the ghosted swinger by setting ctx.globalAlpha before drawSharliz, but drawSharliz0's sprite path
// then sets ctx.globalAlpha=sim.alpha (=1), so in the game the Sharliz never actually turns invisible. The fix is
// 'ctx.globalAlpha*=sim.alpha' in drawSharliz0; until it ships, this applies the same effect so the video shows the intended mechanic.
function ghostFix(){if(window.__ghostFix)return;window.__ghostFix=1;const _sf=spriteFor;
  spriteFor=function(s,spr){const r=_sf(s,spr);return s&&s===swinger&&s.ghost>0?{im:r.im,alpha:r.alpha*(.1+.06*Math.sin(time*9))}:r}}
function begin(){ghostFix();hz.since=-99;startEvent('ghost');const m=gh();if(!m)return;m.side=swinger&&swinger.xs>0?1:-1;m.t=.3}   // the ghost comes from behind and chases the Sharliz
function dashRing(g,x,y,r,col,t){g.save();g.setLineDash([9,7]);g.lineDashOffset=-t*40;g.lineWidth=7;g.strokeStyle=SC_lib.INK;g.beginPath();g.arc(x,y,r,0,7);g.stroke();g.lineWidth=4;g.strokeStyle=col;g.beginPath();g.arc(x,y,r,0,7);g.stroke();g.restore()}
// scene A: nobody taps -> the Sharliz turns invisible, the blind drop misses the tower
const A={level:251,floors:0,dur:10,seed:7,fadeOut:true,
  start(){build(4);begin();SC.mem.h0=hearts},
  speed(t){const m=gh(),M=SC.mem;
    if(M.missT!=null)return t-M.missT<.6?.45:1;
    if(M.dropT!=null)return .55;
    if(M.booT!=null)return t-M.booT<.5?.45:1;
    if(!m)return 1;return m.t/m.dur>.8?.4:1},
  tick(t){hz.since=-99;const m=gh(),M=SC.mem,I=[],s=sw();
    if(M.booT==null&&swinger&&swinger.ghost>0)M.booT=t;
    if(M.booT==null&&m&&!m.done){const p=gpos(m);if(M.seenT==null&&p.x>25&&p.x<W-25)M.seenT=t;const sp=M.seenT==null?9:t-M.seenT;
      if(sp<1.1)I.push({k:'spot',x:p.x,y:p.y,r:62,a:.55*Math.min(1,sp/.2)*Math.min(1,(1.1-sp)/.25)});
      I.push({k:'ring',x:p.x,y:p.y,r:42,col:RED});
      const dx=s.x-p.x,dy=s.y-p.y,L=Math.hypot(dx,dy);if(L>115)I.push({k:'arrow',x1:p.x+dx/L*50,y1:p.y+dy/L*50,x2:s.x-dx/L*52,y2:s.y-dy/L*52,col:RED,p:1})}
    // invisible: a dashed red ring shows where the (now invisible) Sharliz is
    if(M.booT!=null&&M.dropT==null&&swinger){I.push({k:'fn',f:(g,tt)=>dashRing(g,s.x,s.y,46,RED,tt)});
      const top=tower[tower.length-1];if(t-M.booT>.8&&Math.abs(swinger.xs-top.xs)>.8&&state==='aim'){drop();M.dropT=t}}
    if(dropping)M.dp={x:xOf(dropping.xs),y:sy(dropping.y)};
    if(M.dropT!=null&&M.missT==null&&hearts<M.h0){M.missT=t;M.missP={x:M.dp.x,y:topScreen().y-BH*.5};this.dur=t+1.5}
    if(M.missT!=null){const p=Math.min(1,(t-M.missT)/.45),h=M.missP;I.push({k:'badge',x:h.x,y:h.y-10,ok:false,p})}
    return I}};
// scene B: tap the ghost -> it vanishes, the Sharliz stays visible, perfect landing
const B={level:251,floors:0,dur:12,seed:7,fadeIn:true,fadeOut:true,
  start(){build(4);begin();const s=sw();SC.mem.h={x:W*.72,y:s.y+470};SC.mem.press=-9;SC.mem.taps=[]},
  speed(t){const M=SC.mem;return M.doneT==null?.55:1},
  tick(t){hz.since=-99;const m=gh(),M=SC.mem,I=[],dt=1/30,s=sw();
    if(M.doneT==null){
      if(m&&!m.done){const p=gpos(m),e=m.t/m.dur;I.push({k:'ring',x:p.x,y:p.y,r:42,col:YEL});
        const k=Math.min(1,dt*(e>.25?11:5)),tx=Math.max(40,Math.min(W-40,p.x));M.h.x+=(tx-M.h.x)*k;M.h.y+=(p.y-M.h.y)*k;
        if(e>.74&&(Math.hypot(M.h.x-p.x,M.h.y-p.y)<14||e>.84)&&t-M.press>.25){M.h.x=p.x;M.h.y=p.y;SC_tap(p.x,p.y);M.press=t;M.taps.push({x:p.x,y:p.y,t})}}
      if(m&&m.done&&M.taps.length)M.doneT=t;if(!m&&M.taps.length)M.doneT=M.doneT??t}
    else{M.h.x+=(W*.76-M.h.x)*Math.min(1,dt*4);M.h.y+=(s.y+470-M.h.y)*Math.min(1,dt*4)}
    for(const q of M.taps){const p=(t-q.t)/.45;if(p<1){I.push({k:'ripple',x:q.x,y:q.y,p});I.push({k:'ring',x:q.x,y:q.y,r:42+p*10,col:GRN})}}
    if(M.doneT!=null){const p=Math.min(1,(t-M.doneT)/.45);I.push({k:'badge',x:W/2,y:s.y+150,ok:true,p});
      if(t-M.doneT>.6&&!M.dropped&&(SC_aim(.05)||t-M.doneT>2.4)){drop();M.dropped=t}
      if(M.dropped&&!M.endSet){M.endSet=1;this.dur=t+1.6}}
    const pr=Math.max(0,1-(t-M.press)/.18);I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});
    return I}};
for(const s of [A,B]){const tk=s.tick;s.tick=function(t){if(SC.f===0)last=__man.now();return tk.call(this,t)}}
SC.scenes=[A,B];
})();
