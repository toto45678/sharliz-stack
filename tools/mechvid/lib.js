(()=>{
window.SC={scenes:[],i:0,t:0,f:0,s:null};try{g3Warm=()=>{}}catch(e){}
const FPS=30;
function seeAll(){try{for(const k of Object.keys(MECH))markSeen(k);for(const k of HZ_ORDER)markSeen(k);for(const s of [2,3,4])markSeen('season_'+s);for(const z of ZONES){markSeen('boss_'+z.id);markSeen('boss_'+z.sid)}}catch(e){}}
window.SC_step=(n=1,ms=1000/FPS)=>{for(let i=0;i<n;i++){if(typeof hz!=='undefined'&&!SC.allowHz)hz.next=time+999;if(!SC.allowGold)sinceGold=-99;if(typeof hz!=='undefined'&&!SC.allowCoin){hz.coinNext=time+999;hz.coinB=null}__man.step(ms)}};
window.SC_aim=(tol=.02)=>{if(state!=='aim'||!swinger||swinger.entering)return false;const top=tower[tower.length-1],dist=Math.max(1,yOf(tower.length)-swingY()),tf=Math.sqrt(2*dist/(BH*30*zone().grav));
  const aim=swinger.xs+wind*tf;return Math.abs(aim-top.xs)<tol};
window.SC_tap=(x,y)=>{if(SC.direct!==false)return hzTap(x,y);const r=cv.getBoundingClientRect();cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:r.left+x,clientY:r.top+y,bubbles:true,cancelable:true,pointerType:'touch',isPrimary:true}))};
window.SC_setup=i=>{const s=SC.scenes[i];SC.i=i;SC.s=s;SC.t=0;SC.f=0;SC.allowHz=false;SC.ov=[];SC.mem={};
  __man.on();__seed(s.seed||7);seeAll();try{hideOverlay()}catch(e){}
  startLevel(s.level);
  for(let k=0;k<400;k++){SC_step();if(state==='intro'){const b=document.querySelector('#card .btn.primary,#card .btn');if(b)b.click()}if(state==='aim'&&swinger&&!swinger.entering)break}
  // build the tower fast with perfect drops (not recorded)
  for(let k=0;k<6000&&!(tower.length-1>=s.floors&&state==='aim'&&swinger&&!swinger.entering&&!dropping);k++){if(tower.length-1<s.floors&&SC_aim())drop();SC_step()}
  kaleido=[];popups=[];particles=[];notes=[];combo=0;fever=0;partyT=0;
  for(const id of (s.hide||['hud','gauge','boosterBar','hint','toast','windGizmo','wobbleGizmo','trGauge','trBadge']))try{const e=document.getElementById(id);if(e)e.style.visibility='hidden'}catch(e){}
  document.querySelectorAll('.toast,.toast-lane,#toastLane').forEach(e=>e.style.visibility='hidden');
  if(s.start)s.start();
  return {state,floors:tower.length-1,sw:swinger?{x:xOf(swinger.xs),y:sy(swingY())}:null,W,H,S,BH}};
// overlay canvas
const oc=document.createElement('canvas');oc.id='__ov';Object.assign(oc.style,{position:'fixed',left:'0',top:'0',width:'100vw',height:'100vh',pointerEvents:'none',zIndex:99999});
document.body.appendChild(oc);const og=oc.getContext('2d');
const INKC='#1a1020';
function hand(g,x,y,press){g.save();g.translate(x,y);g.rotate(-.42);const k=1-.12*press;g.scale(k,k);
  const shapes=()=>{g.beginPath();g.roundRect(-10,0,20,58,10);g.roundRect(-16,40,54,54,18);g.arc(18,45,10,0,7);g.arc(30,49,10,0,7);g.ellipse(-15,66,10,16,-.5,0,7);g.roundRect(-10,88,46,16,6)};
  g.lineJoin='round';g.lineWidth=11;g.strokeStyle=INKC;shapes();g.stroke();g.fillStyle='#fff';shapes();g.fill();
  g.lineWidth=2.5;g.strokeStyle='rgba(26,16,32,.45)';g.beginPath();g.moveTo(10,44);g.lineTo(10,54);g.moveTo(24,52);g.lineTo(24,60);g.stroke();
  g.fillStyle='#d9d3e6';g.beginPath();g.roundRect(-10,88,46,16,6);g.fill();g.restore()}
function badge(g,x,y,ok,p){const e=p<1?1-Math.pow(1-p,3)*(1-p*.0):1,sc=p<.6?(p/.6)*1.18:1.18-(Math.min(1,(p-.6)/.4))*.18;g.save();g.translate(x,y);g.scale(sc,sc);g.rotate((1-Math.min(1,p*2))*(ok?-.5:.5));
  const r=34;g.beginPath();g.arc(0,0,r,0,7);g.fillStyle=INKC;g.fill();g.beginPath();g.arc(0,0,r-5,0,7);g.fillStyle=ok?'#22c55e':'#ef4444';g.fill();
  g.beginPath();g.arc(0,-6,r-12,Math.PI*1.1,Math.PI*1.9);g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=5;g.stroke();
  g.lineCap='round';g.lineJoin='round';g.strokeStyle='#fff';g.lineWidth=9;g.beginPath();
  if(ok){g.moveTo(-14,1);g.lineTo(-4,12);g.lineTo(15,-11)}else{g.moveTo(-12,-12);g.lineTo(12,12);g.moveTo(12,-12);g.lineTo(-12,12)}g.stroke();g.restore()}
function ring(g,x,y,r,col,t){const q=(t*1.6)%1;g.save();g.lineWidth=7;g.strokeStyle=INKC;g.beginPath();g.arc(x,y,r,0,7);g.stroke();g.lineWidth=4;g.strokeStyle=col;g.beginPath();g.arc(x,y,r,0,7);g.stroke();
  g.globalAlpha=1-q;g.lineWidth=3;g.beginPath();g.arc(x,y,r*(1+q*.6),0,7);g.stroke();g.restore()}
function ripple(g,x,y,p){g.save();g.globalAlpha=Math.max(0,1-p);g.lineWidth=5;g.strokeStyle='#fff';g.beginPath();g.arc(x,y,10+p*34,0,7);g.stroke();g.globalAlpha=Math.max(0,.6-p);g.fillStyle='#fff';g.beginPath();g.arc(x,y,8+p*12,0,7);g.fill();g.restore()}
function spot(g,x,y,r,a){g.save();g.fillStyle=`rgba(10,6,24,${a})`;g.beginPath();g.rect(0,0,innerWidth,innerHeight);g.arc(x,y,r,0,7,true);g.fill('evenodd');g.restore()}
function arrow(g,x1,y1,x2,y2,col,p=1){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,ex=x1+dx*p,ey=y1+dy*p;g.save();g.lineCap='round';g.lineJoin='round';
  for(const [w,c] of [[16,INKC],[9,col]]){g.lineWidth=w;g.strokeStyle=c;g.fillStyle=c;g.beginPath();g.moveTo(x1,y1);g.lineTo(ex-ux*8,ey-uy*8);g.stroke();const hx=ex,hy=ey,s=w===16?22:16;g.beginPath();g.moveTo(hx+ux*(w===16?5:0),hy+uy*(w===16?5:0));g.lineTo(hx-ux*s-uy*s*.8,hy-uy*s+ux*s*.8);g.lineTo(hx-ux*s+uy*s*.8,hy-uy*s-ux*s*.8);g.closePath();g.fill()}g.restore()}
window.SC_draw=items=>{const d=2;oc.width=innerWidth*d;oc.height=innerHeight*d;og.setTransform(d,0,0,d,0,0);og.clearRect(0,0,innerWidth,innerHeight);const r=cv.getBoundingClientRect();og.translate(r.left,r.top);
  for(const it of items){if(it.k==='spot')spot(og,it.x,it.y,it.r,it.a??.45)}
  for(const it of items){if(it.k==='ring')ring(og,it.x,it.y,it.r,it.col,SC.t);else if(it.k==='arrow')arrow(og,it.x1,it.y1,it.x2,it.y2,it.col,it.p);else if(it.k==='ripple')ripple(og,it.x,it.y,it.p)}
  for(const it of items){if(it.k==='badge')badge(og,it.x,it.y,it.ok,it.p)}
  for(const it of items){if(it.k==='hand')hand(og,it.x,it.y,it.press||0)}
  for(const it of items){if(it.k==='fade'){og.fillStyle=`rgba(255,255,255,${it.a})`;og.fillRect(-r.left,-r.top,innerWidth,innerHeight)}}};
window.SC_frame=()=>{const s=SC.s;if(SC.t>=s.dur)return null;const sp=s.speed?s.speed(SC.t):1;
  const items=s.tick(SC.t)||[];
  if(s.fadeIn&&SC.t<.25)items.push({k:'fade',a:1-SC.t/.25});if(s.fadeOut&&SC.t>s.dur-.25)items.push({k:'fade',a:(SC.t-(s.dur-.25))/.25});
  SC_draw(items);
  const ch=488,cw=390,top=s.camTop!=null?s.camTop:(SC.mem.camTop??(SC.mem.camTop=sy(swingY())-100));
  SC_step(1,1000/FPS*sp);SC.t+=1/FPS;SC.f++;
  return {clip:{x:0,y:Math.max(0,Math.min(innerHeight-ch,top)),width:cw,height:ch}}};
})();
