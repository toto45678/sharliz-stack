(()=>{
// egg (dino, level 271): an egg sits on top of the tower and hatches; the baby dino stomps the top Sharliz off. Tap the egg first.
// the shared build uses SC_aim(.02), which never fires at this world's swing speed (the swinger moves ~.09 per frame), so the
// scene builds its floors itself with a wider window (still a PERFECT landing: perfect tolerance is .09)
function build(n){for(let k=0;k<3000&&!(tower.length-1>=n&&state==='aim'&&swinger&&!swinger.entering&&!dropping);k++){if(tower.length-1<n&&SC_aim(.055))drop();SC_step()}
  kaleido=[];popups=[];particles=[];notes=[];combo=0;fever=0;partyT=0;
  // the game's last real animation frame can still fire after this (the virtual clock is far ahead of real time by now):
  // make that stray frame a normal .033 s step instead of a big negative one, and re-sync on the first recorded frame
  last=-1e12;
  if(swinger&&(swinger.kind==='sticky'||swinger.kind==='magnet'))swinger.kind=null}   // a random sticky/magnet Sharliz would only distract here
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const eg=()=>hz.m.egg;
const epos=()=>{const tp=topScreen();return {x:tp.x+S*.15,y:tp.y-BH*.5-S*.275}};   // centre of the drawn egg
const RED='#ef4444',YEL='#facc15',GRN='#22c55e';
function begin(t0){hz.since=-99;startEvent('egg');const m=eg();if(m)m.t=t0}
// scene A: nobody taps -> it hatches and the top Sharliz is stomped off
const A={level:271,floors:0,dur:9,seed:7,fadeOut:true,
  start(){build(4);begin(2.5)},
  speed(t){const m=eg(),M=SC.mem;if(M.hitT!=null)return t-M.hitT<.7?.45:1;if(!m)return 1;return m.t>4.25?.35:1},
  tick(t){hz.since=-99;const m=eg(),M=SC.mem,I=[];
    if(M.hitT==null&&m&&m.hatched){M.hitT=t;this.dur=t+1.7}
    if(M.hitT==null&&m){const p=epos();M.tp=topScreen();const sp=t;
      if(sp<1.1)I.push({k:'spot',x:p.x,y:p.y,r:56,a:.55*Math.min(1,sp/.2)*Math.min(1,(1.1-sp)/.25)});
      I.push({k:'ring',x:p.x,y:p.y,r:40,col:RED})}
    if(M.hitT!=null){const p=Math.min(1,(t-M.hitT)/.45),h=M.tp;I.push({k:'ring',x:h.x,y:h.y-BH*.15,r:50,col:RED});I.push({k:'badge',x:h.x,y:h.y-BH*.15,ok:false,p})}
    return I}};
// scene B: tap the egg -> it is collected (coins), then a normal perfect landing
const B={level:271,floors:0,dur:12,seed:7,fadeIn:true,fadeOut:true,
  start(){build(4);begin(2.5);const s=sw();SC.mem.h={x:W*.74,y:s.y+470};SC.mem.press=-9;SC.mem.taps=[]},
  speed(t){const M=SC.mem;return M.doneT==null?.6:1},
  tick(t){hz.since=-99;const m=eg(),M=SC.mem,I=[],dt=1/30,s=sw();
    if(M.doneT==null){
      if(m&&!m.got&&!m.hatched){const p=epos();M.tp=topScreen();I.push({k:'ring',x:p.x,y:p.y,r:40,col:YEL});
        const k=Math.min(1,dt*(t>.6?6:2.5));M.h.x+=(p.x-M.h.x)*k;M.h.y+=(p.y-M.h.y)*k;
        if(t>1.0&&Math.hypot(M.h.x-p.x,M.h.y-p.y)<10&&t-M.press>.25){SC_tap(p.x,p.y);M.press=t;M.taps.push({x:p.x,y:p.y,t})}}
      if(m&&m.got)M.doneT=t;if(!m&&M.taps.length)M.doneT=M.doneT??t}
    else{M.h.x+=(W*.8-M.h.x)*Math.min(1,dt*4);M.h.y+=(s.y+470-M.h.y)*Math.min(1,dt*4)}
    for(const q of M.taps){const p=(t-q.t)/.45;if(p<1){I.push({k:'ripple',x:q.x,y:q.y,p});I.push({k:'ring',x:q.x,y:q.y,r:40+p*10,col:GRN})}}
    if(M.doneT!=null){const p=Math.min(1,(t-M.doneT)/.45),h=M.tp;I.push({k:'badge',x:h.x+(h.x<W/2?92:-92),y:h.y-BH*.55,ok:true,p});
      if(t-M.doneT>.7&&!M.dropped&&(SC_aim(.05)||t-M.doneT>2.4)){drop();M.dropped=t}
      if(M.dropped&&!M.endSet){M.endSet=1;this.dur=t+1.6}}
    const pr=Math.max(0,1-(t-M.press)/.18);I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});
    return I}};
for(const s of [A,B]){const tk=s.tick;s.tick=function(t){if(SC.f===0)last=__man.now();return tk.call(this,t)}}
SC.scenes=[A,B];
})();
