(()=>{
// conveyor (factory, level 281, passive): after a Sharliz lands, the belt under it carries it sideways (.32 of a width).
// Land the next one on it fast, or it ends up hanging over the edge and the next landing topples the top.
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
const cm=()=>hz.m.conveyor;
const RED='#ef4444',YEL='#facc15',GRN='#22c55e',D=1,OFF=.22;
const fall=()=>{const dist=Math.max(1,yOf(tower.length)-swingY());return Math.sqrt(2*dist/(BH*30*zone().grav))};
// true when dropping now lands at top.xs+off (follows the belt while it still moves)
function aimAt(off,tol){if(state!=='aim'||!swinger||swinger.entering||dropping)return false;const m=cm(),top=tower[tower.length-1],tf=fall();
  const lead=m&&m.moved<.32?m.dir*Math.min(.32-m.moved,(.12)*tf):0;return Math.abs(swinger.xs+wind*tf-(top.xs+lead+off))<tol}
function begin(){hz.since=-99;for(const s of tower){s.xs=0;s.slideX=0}balance=computeBalance().maxR;swayK=0;
  const m=cm();if(m){m.n=tower.length;m.moved=.32;m.dir=-D}
  const s=sw();SC.mem.h={x:W*.8,y:s.y+470};SC.mem.press=-9;SC.mem.taps=[];SC.mem.n0=tower.length;SC.mem.h0=hearts}
function land1(M,t){M.land1=t;const n=tower.length,a=tower[n-1],b=tower[n-2];a.xs=b.xs+D*OFF;a.slideX=0}
// scene A: the last landing lines up 'perfectly' with the slid top and the tower still topples; the game's 'Perfect!' word and
// flower there would contradict the red X, so scene A mutes just those two (the topple itself is the game's own)
function mutePerfect(){if(!window.__cvPop){window.__cvPop=1;const _p=popup;popup=function(text,x,y,c,key){if(SC.mem&&SC.mem.mute&&(key==='perfect'||key==='great'||key==='wow'))return;return _p.apply(this,arguments)}}
  SC.mem.mute=1}
function cam(){if(SC.f===0)SC.mem.camTop=sy(swingY())-62}   // a bit lower than default: swinger at the top, the belt well inside
function tapDrop(M,t){drop();M.press=t;M.taps.push({x:M.h.x,y:M.h.y,t})}
const HOV=()=>{const tp=topScreen();return {x:W*.8,y:tp.y+BH*.2}};
function hand(M,I,t,dt){const h=HOV();M.h.x+=(h.x-M.h.x)*Math.min(1,dt*6);M.h.y+=(h.y-M.h.y)*Math.min(1,dt*6);
  for(const q of M.taps){const p=(t-q.t)/.45;if(p<1)I.push({k:'ripple',x:q.x,y:q.y,p})}
  I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)})}
function belt(I,col){const m=cm(),n=tower.length;if(!m||n<2)return;const tp=topScreen(),y=tp.y,left=.32-m.moved;
  I.push({k:'ring',x:tp.x,y:y,r:46,col});
  if(left>.04){const x2=tp.x+m.dir*(left*S+S*.75);I.push({k:'arrow',x1:tp.x+m.dir*S*.15,y1:y+BH*.62,x2,y2:y+BH*.62,col,p:1})}}
// scene A: wait too long -> the belt carries the top Sharliz over the edge -> the next landing topples it
const A={level:281,floors:0,dur:12,seed:7,fadeOut:true,
  start(){build(4);begin()},
  speed(t){const M=SC.mem;if(M.hitT!=null)return t-M.hitT<.8?.45:1;if(M.d2!=null)return .7;return 1},   // (the game caps a step at .033 s: speeds above 1 do nothing)
  tick(t){hz.since=-99;cam();const M=SC.mem,I=[],dt=1/30,m=cm();if(M.mute)kaleido.length=0;
    if(M.d1==null&&t>.25&&aimAt(D*OFF,.05)){tapDrop(M,t);M.d1=t}
    if(M.d1!=null&&M.land1==null&&tower.length>M.n0)land1(M,t);
    if(M.land1!=null&&M.d2==null){belt(I,RED);if(m.moved>=.25&&aimAt(0,.05)){tapDrop(M,t);M.d2=t;mutePerfect()}}   // aimAt leads the belt: it lands after the slide is over
    if(M.d2!=null&&M.hitT==null){const tp=topScreen();M.tp=tp;I.push({k:'ring',x:tp.x,y:tp.y,r:46,col:RED});if(state==='collapse'||hearts<M.h0){M.hitT=t;this.dur=t+1.5}}
    if(M.hitT!=null){const p=Math.min(1,(t-M.hitT)/.45),h=M.tp;I.push({k:'badge',x:h.x+S*.3,y:h.y-BH*.2,ok:false,p})}
    hand(M,I,t,dt);return I}};
// scene B: drop the next one fast -> it lands on the top while it is still near the middle -> safe
const B={level:281,floors:0,dur:12,seed:7,fadeIn:true,fadeOut:true,
  start(){build(4);begin()},
  speed(t){return 1},
  tick(t){hz.since=-99;cam();const M=SC.mem,I=[],dt=1/30,m=cm();
    if(M.d1==null&&t>.25&&aimAt(D*OFF,.05)){tapDrop(M,t);M.d1=t}
    if(M.d1!=null&&M.land1==null&&tower.length>M.n0)land1(M,t);
    if(M.land1!=null&&M.d2==null){belt(I,YEL);if(aimAt(0,.05)){tapDrop(M,t);M.d2=t}}
    if(M.d2!=null&&M.okT==null&&tower.length>M.n0+1){M.okT=t;M.tp=topScreen();this.dur=t+1.8}
    if(M.okT!=null){const p=Math.min(1,(t-M.okT)/.45),h=M.tp;if(t-M.okT<.5)I.push({k:'ring',x:h.x,y:h.y,r:46+(t-M.okT)*20,col:GRN});I.push({k:'badge',x:h.x+(h.x<W/2?95:-95),y:h.y-BH*.7,ok:true,p})}
    hand(M,I,t,dt);return I}};
for(const s of [A,B]){const tk=s.tick;s.tick=function(t){if(SC.f===0)last=__man.now();return tk.call(this,t)}}
SC.scenes=[A,B];
})();
