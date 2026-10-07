(()=>{
// monkey (jungle, level 241): a monkey swings in on a vine and snatches the swinging Sharliz unless you tap it first
// the shared build uses SC_aim(.02), which never fires at this world's swing speed (the swinger moves ~.09 per frame), so the
// scene builds its floors itself with a wider window (still a PERFECT landing: perfect tolerance is .09)
function build(n){for(let k=0;k<3000&&!(tower.length-1>=n&&state==='aim'&&swinger&&!swinger.entering&&!dropping);k++){if(tower.length-1<n&&SC_aim(.055))drop();SC_step()}
  kaleido=[];popups=[];particles=[];notes=[];combo=0;fever=0;partyT=0;
  // the game's last real animation frame can still fire after this (the virtual clock is far ahead of real time by now):
  // make that stray frame a normal .033 s step instead of a big negative one, and re-sync on the first recorded frame
  last=-1e12;
  if(swinger&&(swinger.kind==='sticky'||swinger.kind==='magnet'))swinger.kind=null}   // a random sticky/magnet Sharliz would only distract here
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const mk=()=>hz.m.monkey;
const mpos=m=>{const p=MECH.monkey.pos(m);return {x:p.x,y:p.y+S*.06}};
const RED='#ef4444',YEL='#facc15',GRN='#22c55e';
function begin(t0){hz.since=-99;startEvent('monkey');const m=mk();if(!m)return;
  // come in from the side the Sharliz is NOT on, so the whole swing across the screen is visible
  m.side=swinger&&swinger.xs>0?-1:1;m.t=t0}   // start where it has just swung into view
// scene A: nobody taps -> the monkey grabs the Sharliz and throws it away
const A={level:241,floors:0,dur:9,seed:7,fadeOut:true,camTop:20,   // the monkey arcs in high above the swing path
  start(){build(4);begin(.8)},
  speed(t){const m=mk(),M=SC.mem;if(M.hitT!=null)return t-M.hitT<.7?.45:1;if(!m)return 1;const e=m.t/m.dur;return e>.55&&e<.9?.42:1},
  tick(t){hz.since=-99;const m=mk(),M=SC.mem,I=[],s=sw();
    if(swinger)M.last=s;
    if(M.hitT==null&&m&&(m.grab||(!swinger&&M.seenT!=null))){M.hitT=t;M.hitP=M.last||s;this.dur=t+1.7}
    if(M.hitT==null&&m&&!m.scared){const p=mpos(m);M.seenT=M.seenT??t;const sp=t-M.seenT;
      if(sp<1.1)I.push({k:'spot',x:p.x,y:p.y,r:62,a:.55*Math.min(1,sp/.2)*Math.min(1,(1.1-sp)/.25)});
      I.push({k:'ring',x:p.x,y:p.y,r:42,col:RED});
      const dx=s.x-p.x,dy=s.y-p.y,L=Math.hypot(dx,dy);if(L>115)I.push({k:'arrow',x1:p.x+dx/L*50,y1:p.y+dy/L*50,x2:s.x-dx/L*52,y2:s.y-dy/L*52,col:RED,p:1})}
    if(M.hitT!=null){const p=Math.min(1,(t-M.hitT)/.45),h=M.hitP;I.push({k:'ring',x:h.x,y:h.y,r:52,col:RED});I.push({k:'badge',x:h.x,y:h.y,ok:false,p})}
    return I}};
// scene B: tap the monkey -> it runs away, the Sharliz stays, perfect landing
const B={level:241,floors:0,dur:12,seed:7,fadeIn:true,fadeOut:true,
  start(){build(4);begin(.5);const s=sw();SC.mem.h={x:W*.72,y:s.y+470};SC.mem.press=-9;SC.mem.taps=[]},
  speed(t){const M=SC.mem;return M.doneT==null?.6:1},
  tick(t){hz.since=-99;const m=mk(),M=SC.mem,I=[],dt=1/30,s=sw();
    if(M.cam1==null){M.cam1=s.y-100;M.cam=20}if(M.doneT!=null&&t-M.doneT>.3)M.cam+=(M.cam1-M.cam)*Math.min(1,dt*3);M.camTop=M.cam;
    if(M.doneT==null){
      if(m&&!m.scared){const p=mpos(m),e=m.t/m.dur;I.push({k:'ring',x:p.x,y:p.y,r:42,col:YEL});
        const k=Math.min(1,dt*(e>.3?11:5)),tx=Math.max(40,Math.min(W-40,p.x));M.h.x+=(tx-M.h.x)*k;M.h.y+=(p.y-M.h.y)*k;
        if(e>.56&&Math.hypot(M.h.x-p.x,M.h.y-p.y)<14&&t-M.press>.25){const q=MECH.monkey.pos(m);SC_tap(q.x,q.y);M.press=t;M.taps.push({x:p.x,y:p.y,t})}}
      if(m&&m.scared&&M.taps.length)M.doneT=t;if(!m&&M.taps.length)M.doneT=M.doneT??t}
    else{M.h.x+=(W*.76-M.h.x)*Math.min(1,dt*4);M.h.y+=(s.y+470-M.h.y)*Math.min(1,dt*4)}
    for(const q of M.taps){const p=(t-q.t)/.45;if(p<1){I.push({k:'ripple',x:q.x,y:q.y,p});I.push({k:'ring',x:q.x,y:q.y,r:42+p*10,col:GRN})}}
    if(M.doneT!=null){const p=Math.min(1,(t-M.doneT)/.45);I.push({k:'badge',x:W/2,y:s.y+150,ok:true,p});
      if(t-M.doneT>.6&&!M.dropped&&(SC_aim(.05)||t-M.doneT>2.4)){drop();M.dropped=t}
      if(M.dropped&&!M.endSet){M.endSet=1;this.dur=t+1.8}}
    const pr=Math.max(0,1-(t-M.press)/.18);I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});
    return I}};
for(const s of [A,B]){const tk=s.tick;s.tick=function(t){if(SC.f===0)last=__man.now();return tk.call(this,t)}}
SC.scenes=[A,B];
})();
