(()=>{
// mirror (crystal, level 291): crystal magic flips the whole world left<->right for a few seconds. The tower top jumps to the
// other side of the screen: a drop aimed at where it USED to be misses. Look again and drop when the Sharliz is over the tower.
// the shared build uses SC_aim(.02), which never fires at this world's swing speed (the swinger moves ~.09 per frame), so the
// scene builds its floors itself with a wider window (still a PERFECT landing: perfect tolerance is .09)
function build(n){for(let k=0;k<3000&&!(tower.length-1>=n&&state==='aim'&&swinger&&!swinger.entering&&!dropping);k++){if(tower.length-1<n&&SC_aim(.055))drop();SC_step()}
  kaleido=[];popups=[];particles=[];notes=[];combo=0;fever=0;partyT=0;
  // the game's last real animation frame can still fire after this (the virtual clock is far ahead of real time by now):
  // make that stray frame a normal .033 s step instead of a big negative one, and re-sync on the first recorded frame
  last=-1e12;
  try{cv.style.filter=''}catch(e){}   // a perfect-combo party during the build can leave its hue-rotate filter on the canvas
  if(swinger&&(swinger.kind==='sticky'||swinger.kind==='magnet'))swinger.kind=null}   // a random sticky/magnet Sharliz would only distract here
const RED='#ef4444',YEL='#facc15',GRN='#22c55e',CYA='#67e8f9',LEAN=.7;
const mi=()=>hz.m.mirror;
const flipped=()=>!!cv.style.transform;
const vx=x=>flipped()?W-x:x;                      // game x -> what the viewer sees
const fall=()=>{const dist=Math.max(1,yOf(tower.length)-swingY());return Math.sqrt(2*dist/(BH*30*zone().grav))};
function aimAt(xs,tol){if(state!=='aim'||!swinger||swinger.entering||dropping)return false;return Math.abs(swinger.xs+wind*fall()-xs)<tol}
const swV=()=>({x:vx(xOf(swinger?swinger.xs:0)),y:sy(swingY())});
const topV=()=>{const tp=topScreen();return {x:vx(tp.x),y:tp.y}};
function begin(){hz.since=-99;const n=tower.length;for(let i=0;i<n;i++){tower[i].xs=LEAN*Math.pow(i/(n-1),1.3);tower[i].slideX=0}balance=computeBalance().maxR;
  startEvent('mirror');const m=mi();if(m)m.t=.25;
  const s=swV();SC.mem.h={x:W*.82,y:s.y+470};SC.mem.press=-9;SC.mem.taps=[];SC.mem.h0=hearts;SC.mem.old=topV()}
const HOV=()=>{const tp=topScreen();return {x:W*.84,y:tp.y+BH*.35}};
function tapDrop(M,t){drop();M.press=t;M.taps.push({x:M.h.x,y:M.h.y,t})}
function hand(M,I,t,dt){const h=HOV();M.h.x+=(h.x-M.h.x)*Math.min(1,dt*6);M.h.y+=(h.y-M.h.y)*Math.min(1,dt*6);
  for(const q of M.taps){const p=(t-q.t)/.45;if(p<1)I.push({k:'ripple',x:q.x,y:q.y,p})}
  I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)})}
// the flip moment: a big double arrow across the screen
function cam(){if(SC.f===0)SC.mem.camTop=sy(swingY())-75}   // a bit lower than default so the leaning tower shows
function flipFx(M,I,t){if(M.flipT==null&&flipped())M.flipT=t;if(M.flipT==null)return;const q=t-M.flipT;if(q>1.1)return;
  const p=Math.min(1,q/.3),a=Math.min(1,(1.1-q)/.25),y=sy(swingY())+BH*1.05,c=W/2;
  I.push({k:'fn',f:g=>{g.globalAlpha=a;SC_lib.arrow(g,c-6,y,c-W*.36,y,CYA,p);SC_lib.arrow(g,c+6,y,c+W*.36,y,CYA,p)}})}
// scene A: aim where the top used to be -> miss
const A={level:291,floors:0,dur:12,seed:7,fadeOut:true,
  start(){build(4);begin()},
  speed(t){const M=SC.mem;if(M.missT!=null)return t-M.missT<.6?.45:1;if(M.dropT!=null)return .5;return 1},
  tick(t){hz.since=-99;cam();const M=SC.mem,I=[],dt=1/30;
    flipFx(M,I,t);
    const o=M.old;if(M.missT==null)I.push({k:'ring',x:o.x,y:o.y,r:44,col:M.flipT!=null&&t-M.flipT>.5?RED:YEL});
    if(M.flipT!=null&&M.dropT==null&&t-M.flipT>.9){const top=tower[tower.length-1];if(aimAt(-top.xs,.05)){tapDrop(M,t);M.dropT=t}}
    if(dropping)M.dp={x:vx(xOf(dropping.xs)),y:sy(dropping.y)};
    if(M.dropT!=null&&M.missT==null&&hearts<M.h0){M.missT=t;M.missP={x:M.dp.x,y:topScreen().y-BH*.55};this.dur=t+1.7}
    if(M.missT!=null){const p=Math.min(1,(t-M.missT)/.45),h=M.missP;I.push({k:'badge',x:h.x,y:h.y,ok:false,p})}
    hand(M,I,t,dt);return I}};
// scene B: follow the tower to its new place and drop when the Sharliz is over it -> perfect
const B={level:291,floors:0,dur:12,seed:7,fadeIn:true,fadeOut:true,
  start(){build(4);begin()},
  speed(t){return 1},
  tick(t){hz.since=-99;cam();const M=SC.mem,I=[],dt=1/30;
    flipFx(M,I,t);
    const o=M.old,nw=topV();
    if(M.flipT==null)I.push({k:'ring',x:o.x,y:o.y,r:44,col:YEL});
    else if(M.okT==null){const q=Math.min(1,(t-M.flipT)/.5),x=o.x+(nw.x-o.x)*q*q*(3-2*q);I.push({k:'ring',x,y:nw.y,r:44,col:YEL});
      if(t-M.flipT<1.2&&Math.abs(nw.x-o.x)>60){const L=Math.sign(nw.x-o.x);I.push({k:'arrow',x1:o.x-L*4,y1:o.y-BH*1.05,x2:nw.x+L*4,y2:nw.y-BH*1.05,col:YEL,p:Math.min(1,(t-M.flipT)/.4)})}}
    if(M.flipT!=null&&M.dropT==null&&t-M.flipT>.9){const top=tower[tower.length-1];if(aimAt(top.xs,.05)){tapDrop(M,t);M.dropT=t}}
    if(M.dropT!=null&&M.okT==null&&!dropping){M.okT=t;M.tp=topV();this.dur=t+1.5}
    if(M.okT!=null){const p=Math.min(1,(t-M.okT)/.45),h=M.tp;if(t-M.okT<.5)I.push({k:'ring',x:h.x,y:h.y,r:46+(t-M.okT)*20,col:GRN});I.push({k:'badge',x:h.x+(h.x<W/2?95:-95),y:h.y-BH*.7,ok:true,p})}
    hand(M,I,t,dt);return I}};
for(const s of [A,B]){const tk=s.tick;s.tick=function(t){if(SC.f===0)last=__man.now();return tk.call(this,t)}}
SC.scenes=[A,B];
})();
