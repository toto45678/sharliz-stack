(()=>{
// Ink Octopus (level 53): the octopus peeks up beside the tower for 1.8 s, then squirts ink over the top of the tower
const RED='#ef4444',GOOD='#22c55e',TGT='#facc15',L=SC_lib;
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const topP=()=>{const n=tower.length,s=tower[n-1];return {x:xOf(s.xs)+swayOffset(n-1,n),y:sy(yOf(n-1))}};
// While rec.py waits after SC_setup the page's real-time loop runs frame() once, so the next frame gets a big negative dt
// (shake/bump jump, timers run backwards). Every scene therefore sets itself up on its first video frame (not in start())
// and re-syncs the game's frame clock (`last`) to the virtual one.
function fresh(){last=__man.now();partyT=0;try{cv.style.filter=''}catch(e){}shake=0;bump=0;slowmoT=0;freeze=0;camY=camTarget();particles=[];popups=[];kaleido=[]}
// predicted landing offset (xs units) if the player tapped now: same fall as update() + worldTwist()
const predDx=()=>{if(state!=='aim'||!swinger||swinger.entering)return null;const top=tower[tower.length-1],z=baseId(zone()),dt=1/240,ty=yOf(tower.length);let y=swingY(),vy=0,xs=swinger.xs,tt=time;
  const g=BH*30*zone().grav*(swinger.kind==='balloon'?.42:1)*hatFall()*(hz.gravK||1),wk=wind*hatWind();
  for(let i=0;i<2000&&y<ty;i++){vy+=g*dt;if(z==='space')vy=Math.min(vy,BH*9);y+=vy*dt;xs+=wk*dt;if(z==='ocean')xs+=Math.sin(tt*.9)*.28*dt;tt+=dt}return xs-top.xs};
// drop on the first frame the predicted landing crosses one of the offsets `os` (+ a sub-frame nudge so the outcome is exact)
function dropAt(M,os){const p=predDx();if(p==null){M.lastP=null;return false}const prev=M.lastP;M.lastP=p;if(prev==null||(M.after!=null&&time<M.after))return false;
  for(const o of [].concat(os))if((prev-o)*(p-o)<=0||Math.abs(p-o)<.006){swinger.xs+=o-p;M.off=o;drop();return true}return false}
// start the swinger so that one of its passes over landing offset `o` comes T seconds of game time from now (same motion as
// update()); dropAt() then ignores earlier passes
function placeFor(T,o){const r=rangeXs(),sp=speed(),drift=predDx()-(swinger.xs-tower[tower.length-1].xs),xT=tower[tower.length-1].xs+o-drift;let best=null;
  for(let k=0;k<=160;k++){const x0=-r+2*r*k/160;for(const d0 of [1,-1]){let x=x0,d=d0,tt=0,prev=x;const dt=1/240;
    for(let i=0;i<240*4;i++){x+=d*sp*(1-.42*Math.min(1,(x/r)**2))*dt;if(x<-r){x=-r;d=1}if(x>r){x=r;d=-1}tt+=dt;
      if(tt>.15&&(prev-xT)*(x-xT)<=0&&(!best||Math.abs(tt-T)<Math.abs(best.e)))best={x0,d0,e:tt-T};prev=x}}}
  if(best){swinger.xs=best.x0;swinger.dir=best.d0;SC.mem.after=time+T+best.e-.12}return best}
// no words in the video: keep only the landing feedback (Perfect / Great), as in the bats video (other keyed popups such as
// 'Slipped!' are born dead, so they are never drawn; plain messages go to the toast lane below the crop)
const keepPop=p=>p.key==='perfect'||p.key==='wow'||p.key==='great';
if(!window.__mvPop){window.__mvPop=1;const _sp=window.stackPopup;window.stackPopup=function(p){if(p&&!keepPop(p))p.life=-1;return _sp.apply(this,arguments)}}
const onlyLanding=()=>{popups=popups.filter(keepPop)};
// tower of 3 straight floors, built the way 'continue from checkpoint' does (SC_setup's perfect-drop build can loop forever when
// the fixed-step swing never samples within 0.02 of the middle, e.g. level 53), then the same colours in both scenes
function paint(kind){while(tower.length<4)tower.push(Object.assign(makeSharliz(),{xs:0}));balance=0;swayK=0;wind=windFor(tower.length);swinger.kind=kind||null;delete swinger.sz;swinger.wt=1;swinger.gold=false;swinger.rare=null;swinger.color=COLORS[0];const cs=[COLORS[1],COLORS[3],COLORS[2],COLORS[1]];tower.forEach((s,i)=>{if(i){s.color=cs[i%cs.length]}})}
// pulsing landing target on the head of the top piece (half-width rx)
function target(g,col,t,rx,ry){const tp=topP(),y=tp.y-BH*.5,q=(t*1.6)%1;ry=ry||S*.14;g.save();g.lineWidth=8;g.strokeStyle=L.INK;g.beginPath();g.ellipse(tp.x,y,rx,ry,0,0,7);g.stroke();g.lineWidth=4.5;g.strokeStyle=col;g.stroke();
  g.globalAlpha=1-q;g.lineWidth=3;g.beginPath();g.ellipse(tp.x,y,rx*(1+q*.45),ry*(1+q*.45),0,0,7);g.stroke();
  g.globalAlpha=1;g.fillStyle=col;g.lineWidth=2.5;g.strokeStyle=L.INK;g.beginPath();g.ellipse(tp.x,y,4.5,3,0,0,7);g.fill();g.stroke();g.restore()}
const handTap=(M,t,I)=>{if(M.press>0&&t-M.press<.45)I.push({k:'ripple',x:M.h.x,y:M.h.y,p:(t-M.press)/.45});I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.2)})};
// (6.5 s: you can't see where to land). Tapping it while it peeks sends it away.
function init(){paint(null);fresh();startEvent('fog');hz.octo.side=1}
const oP=()=>{const o=hz.octo;if(!o)return null;const p=octoPos(o);return {x:p.x,y:p.y-S*.2}};
// scene A: nobody taps the octopus -> it squirts ink all over the top of the tower
const A={level:53,floors:0,dur:9,seed:5,fadeOut:true,
  speed(t){const M=SC.mem,o=hz.octo;if(M.inkT!=null)return t-M.inkT<.9?.45:1;if(M.init&&o&&o.t>1.35)return .45;return 1},
  tick(t){const M=SC.mem,I=[];if(!M.init){M.init=1;init()}onlyLanding();const o=hz.octo;
    if(M.inkT==null){
      if(o&&o.phase==='peek'){const p=oP(),a=Math.min(1,o.t/.5);M.seenT=M.seenT??t;const sp=t-M.seenT;
        if(sp<1.2)I.push({k:'spot',x:p.x,y:p.y,r:S*1.25,a:.5*Math.min(1,sp/.2)*Math.min(1,(1.2-sp)/.3)});
        I.push({k:'ring',x:p.x,y:p.y,r:S*1.05,col:RED});
        const tp=topP(),sd=o.side;if(a>=1)I.push({k:'arrow',x1:p.x-sd*S*.25,y1:p.y-BH*1.15,x2:tp.x+sd*S*.55,y2:tp.y-BH*.55,col:RED,p:Math.min(1,(o.t-.5)/.35)})}
      if(hz.ink){M.inkT=t;this.dur=t+2.3}}
    if(M.inkT!=null&&hz.ink){const k=hz.ink,y=sy(k.wy);
      if(t-M.inkT>.25)I.push({k:'ring',x:k.cx,y:y,r:S*1.55,col:RED});
      if(t-M.inkT>.35)I.push({k:'badge',x:k.cx-S*1.55,y:y-BH*1.05,ok:false,p:Math.min(1,(t-M.inkT-.35)/.45)})}
    return I}};
// scene B: tap the octopus while it peeks -> it hides, the tower stays clean, normal Perfect landing
const B={level:53,floors:0,dur:10,seed:5,fadeIn:true,fadeOut:true,
  speed(t){const M=SC.mem;if(M.landT!=null)return t-M.landT<.5?.6:1;if(M.tapT==null)return .55;return 1},
  tick(t){const M=SC.mem,I=[];if(!M.init){M.init=1;init();placeFor(1.75,0);M.press=-9;M.h={x:W*.72,y:sw().y+520}}onlyLanding();const o=hz.octo,s=sw(),dt=1/30;
    if(M.tapT==null&&o&&o.phase==='peek'){const p=oP(),f=o.t<.35?3:9;M.h.x+=(p.x-M.h.x)*Math.min(1,dt*f);M.h.y+=(p.y-M.h.y)*Math.min(1,dt*f);
      I.push({k:'ring',x:p.x,y:p.y,r:S*1.05,col:TGT});
      if(o.t>.6&&Math.hypot(M.h.x-p.x,M.h.y-p.y)<12){SC_tap(p.x,p.y);M.tapT=t;M.press=t;M.tp=p;M.bx=topP().x+S*1.3;M.bwy=yOf(tower.length-1)-BH*.75}}
    if(M.tapT!=null){const q=(t-M.tapT)/.45;if(q<1){I.push({k:'ripple',x:M.tp.x,y:M.tp.y,p:q});I.push({k:'ring',x:M.tp.x,y:M.tp.y,r:S*1.05+q*12,col:GOOD})}
      const pp=Math.min(1,(t-M.tapT-.25)/.45);if(pp>0)I.push({k:'badge',x:M.bx,y:sy(M.bwy),ok:true,p:pp});
      if(t-M.tapT>.4){M.h.x+=(W*.95-M.h.x)*.06;M.h.y+=(s.y+560-M.h.y)*.06}
      if(M.dropT==null&&t-M.tapT>.5&&dropAt(M,0))M.dropT=t;
      if(M.dropT!=null&&M.landT==null&&!dropping){M.landT=t;this.dur=t+1.5}}
    I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.2)});
    return I}};
SC.scenes=[A,B];
})();
