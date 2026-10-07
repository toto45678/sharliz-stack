(()=>{
// cloud (clouds world, level 261): a cloud drifts just under the swing path. A Sharliz dropped into it floats down slowly and is
// carried sideways with the cloud -> it misses the tower. Wait until the cloud has passed, then drop.
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
const cl=()=>hz.m.cloud;
const RED='#ef4444',YEL='#facc15',GRN='#22c55e';const DIR=1;
const DRIFT=()=>W/5.5/S*.32*.9,TF=1.14;   // sideways carry while floating (.9 s), and the slow fall time inside the cloud
const cy=()=>sy(swingY())+BH*.25;
const fall=()=>{const dist=Math.max(1,yOf(tower.length)-swingY());return Math.sqrt(2*dist/(BH*30*zone().grav))};
function aimAt(xs,tol){if(state!=='aim'||!swinger||swinger.entering||dropping)return false;return Math.abs(swinger.xs+wind*fall()-xs)<tol}
// seconds until the swinging Sharliz next passes over xs (same motion formula as the game)
function nextCross(xs0,minT){let xs=swinger.xs,dir=swinger.dir,ent=swinger.entering;const r=rangeXs(),sp=speed(),dt=1/240;
  for(let T=0;T<8;T+=dt){const px=xs;xs+=dir*sp*(ent?1.8:(1-.42*Math.min(1,(xs/r)**2)))*dt;if(ent&&Math.abs(xs)<=r)ent=false;if(!ent){if(xs<-r){xs=-r;dir=1}if(xs>r){xs=r;dir=-1}}
    if(T>minT&&(px-xs0)*(xs-xs0)<=0)return T}return 1.5}
function begin(target,minT){hz.since=-99;
  // wind phase: blowing gently the same way the cloud drifts, in both scenes (the level picks a random phase anyway)
  windSeed=Math.PI/2-time*.33;startEvent('cloud');const m=cl();if(!m)return;m.dir=DIR;m.vx=DIR*W/5.5;
  const top=tower[tower.length-1],xs=target(top,windFor(tower.length)),T=nextCross(xs,minT);
  m.x=xOf(xs)+DIR*S*.5-m.vx*T;   // when the Sharliz swings over that spot, the cloud is right under it (a bit ahead)
  const s=sw();SC.mem.h={x:W*.8,y:s.y+470};SC.mem.press=-9;SC.mem.taps=[];SC.mem.h0=hearts;SC.mem.T=T}
const HOV=()=>{const tp=topScreen();return {x:W*.8,y:tp.y-BH*.15}};
function tapDrop(M,t){drop();M.press=t;M.taps.push({x:M.h.x,y:M.h.y,t})}
function hand(M,I,t,dt){const h=HOV();M.h.x+=(h.x-M.h.x)*Math.min(1,dt*6);M.h.y+=(h.y-M.h.y)*Math.min(1,dt*6);
  for(const q of M.taps){const p=(t-q.t)/.45;if(p<1)I.push({k:'ripple',x:q.x,y:q.y,p})}
  I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)})}
// scene A: drop while the cloud is under the Sharliz -> it floats away with the cloud and misses
const A={level:261,floors:0,dur:12,seed:7,fadeOut:true,
  start(){build(4);begin((top,w)=>top.xs+DIR*(.66-DRIFT())-w*TF,.7)},
  speed(t){const M=SC.mem;if(M.missT!=null)return t-M.missT<.6?.45:1;if(M.dropT!=null)return .62;return 1},
  tick(t){hz.since=-99;const m=cl(),M=SC.mem,I=[],dt=1/30,s=sw();
    if(m&&M.missT==null){const x=m.x,y=cy();if(t<1.1)I.push({k:'spot',x,y,r:S*1.6,a:.5*Math.min(1,t/.2)*Math.min(1,(1.1-t)/.25)});I.push({k:'ring',x,y,r:S*1.45,col:RED})}
    if(M.dropT==null&&m&&swinger&&!swinger.entering&&state==='aim'){const top=tower[tower.length-1],L=swinger.xs+wind*TF+DIR*DRIFT()-top.xs;
      if(t>M.T-.3&&Math.abs(m.x-s.x)<S*1.6&&Math.abs(L-DIR*.66)<.07){tapDrop(M,t);M.dropT=t}}
    if(dropping){M.dp={x:xOf(dropping.xs),y:sy(dropping.y)};if(dropping.cloudT>0)I.push({k:'arrow',x1:M.dp.x+DIR*S*.7,y1:M.dp.y,x2:M.dp.x+DIR*S*2.1,y2:M.dp.y,col:RED,p:1})}
    if(M.dropT!=null&&M.missT==null&&hearts<M.h0){M.missT=t;M.missP={x:M.dp.x,y:topScreen().y-BH*.55};this.dur=t+1.7}
    if(M.missT!=null){const p=Math.min(1,(t-M.missT)/.45),h=M.missP;I.push({k:'badge',x:h.x,y:h.y,ok:false,p})}
    if(M.dropT!=null&&M.missT==null&&!dropping&&tower.length>5&&!M.endSet){M.endSet=1;this.dur=t+1.2}   // safety: landed after all
    hand(M,I,t,dt);return I}};
// scene B: same cloud; wait while it is under the Sharliz, drop when it has passed -> perfect
const B={level:261,floors:0,dur:12,seed:7,fadeIn:true,fadeOut:true,
  start(){build(4);begin(top=>top.xs,.7)},
  speed(t){return 1},
  tick(t){hz.since=-99;const m=cl(),M=SC.mem,I=[],dt=1/30,s=sw();
    const top=tower[tower.length-1],clear=!m||(m.x-xOf(top.xs))*DIR>S*1.8;
    if(m&&M.dropT==null){const x=m.x,y=cy();if(!clear)M.clrT=null;else M.clrT=M.clrT??t;const a=M.clrT==null?1:Math.max(0,1-(t-M.clrT)/.3);
      if(a>0)I.push({k:'fn',f:g=>{g.globalAlpha=a;SC_lib.ring(g,x,y,S*1.45,RED,t)}})}
    if(M.dropT==null){
      if(clear&&M.clrT!=null&&t-M.clrT>.25&&swinger&&!swinger.entering)I.push({k:'ring',x:s.x,y:s.y,r:44,col:GRN});   // the way is clear now
      if(clear&&t>.5&&aimAt(top.xs,.05)){tapDrop(M,t);M.dropT=t}}
    if(M.dropT!=null&&M.okT==null&&!dropping){M.okT=t;M.tp=topScreen();this.dur=t+1.5}
    if(M.okT!=null){const p=Math.min(1,(t-M.okT)/.45),h=M.tp;I.push({k:'badge',x:h.x+(h.x<W/2?95:-95),y:h.y-BH*.7,ok:true,p})}
    hand(M,I,t,dt);return I}};
for(const s of [A,B]){const tk=s.tick;s.tick=function(t){if(SC.f===0)last=__man.now();return tk.call(this,t)}}
SC.scenes=[A,B];
})();
