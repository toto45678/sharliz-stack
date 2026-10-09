/* ===== v54: PLAYER LEVEL (XP) + SHARLIZ PASS (monthly season pass) =====
   XP from everything (levels, bosses, bonus stage, arcade, events, tournament) → player level (badge on the avatar)
   and the monthly Pass: 30 tiers × 100 XP, free track + premium track (test IAP 'pass' ₪19.90, bought per season).
   Pass-only items: galaxy colour, comet trail, star-crown hat. Design: ChatGPT (design/pass/). */
Object.assign(I18N.en,{psTitle:'Sharliz Pass',psLeft:'{n} days left',psTier:'Tier {n}',psFree:'Free',psPrem:'Premium',psClaim:'Collect',psBuy:'Unlock Premium · {p}',psPremOn:'Premium unlocked!',psLocked:'Reach tier {n}',
  lvShort:'Lv {n}',lvUp:'Level {n}!',lvReward:'Level reward',lvOk:'Yay!',xpGain:'+{n} XP',psItem:'Pass exclusive',psReady:'Rewards ready',psAll:'Collect all',psCoins:'Coins',psWhy:'Unlock every gold reward + 3 exclusive items',psBoost:'Boosters',lvUpTag:'Level up!',lvSub:'Great job! You reached a new level!'});
Object.assign(I18N.he,{psTitle:'כרטיס שארליז',psLeft:'נותרו {n} ימים',psTier:'שלב {n}',psFree:'חינם',psPrem:'פרימיום',psClaim:'אסוף',psBuy:'פתחו פרימיום · {p}',psPremOn:'הפרימיום נפתח!',psLocked:'הגיעו לשלב {n}',
  lvShort:'רמה {n}',lvUp:'רמה {n}!',lvReward:'פרס רמה',lvOk:'יש!',xpGain:'+{n} XP',psItem:'בלעדי לכרטיס',psReady:'פרסים מחכים',psAll:'אסוף הכל',psCoins:'מטבעות',psWhy:'כל הפרסים הזהובים + 3 פריטים בלעדיים',psBoost:'חיזוקים',lvUpTag:'עליתם רמה!',lvSub:'כל הכבוד! הגעתם לרמה חדשה!'});
// pass-only catalogue
WCOL.galaxy={c:'#5b2bd6',p:1,pass:1,n:['Galaxy','גלקסיה']};
STYLE_SKINS.push({id:'t_comet',cat:'t',price:1,pass:1});Object.assign(I18N.en,{sk_t_comet:'Comet'});Object.assign(I18N.he,{sk_t_comet:'שביט'});
WHATX.starcrown={p:1,w:1,pass:1,n:['Star crown','כתר כוכבים']};
IAP.products.pass={price:'₪19.90',pass:1};
const PS_N=30,PS_XP=100;
// rewards: [free, premium]; {c:coins} {b:booster count} {it:[cat,id]}
const PS_REW=Array.from({length:PS_N},(_,i)=>{const n=i+1;
  const free=n%10===0?{c:300}:n%3===0?{b:1}:{c:50};
  const prem=n===10?{it:['color','galaxy']}:n===20?{it:['trail','t_comet']}:n===30?{it:['hat','starcrown']}:n%5===0?{b:2}:{c:120};return [free,prem]});
/* ---------- XP + player level ---------- */
const xpNeed=l=>100+20*(l-1);
function xpLevel(x){let l=1,r=x;while(r>=xpNeed(l)){r-=xpNeed(l);l++}return {lv:l,into:r,need:xpNeed(l)}}
function psSeason(d=new Date()){return d.getFullYear()*12+d.getMonth()}
function psData(){const s=psSeason(),p=progress.pass=progress.pass||{};if(p.sea!==s){Object.assign(p,{sea:s,xp:0,f:[],p:[],prem:false})}p.f=p.f||[];p.p=p.p||[];return p}
const psTierOf=xp=>Math.min(PS_N,Math.floor(xp/PS_XP));
const psDays=()=>{const n=new Date(),e=new Date(n.getFullYear(),n.getMonth()+1,1);return Math.max(1,Math.ceil((e-n)/864e5))};
function psReady(){const P=psData(),t=psTierOf(P.xp);let n=0;for(let i=0;i<t;i++){if(!P.f.includes(i))n++;if(P.prem&&!P.p.includes(i))n++}return n}
let XPQ=null;
function addXP(n){if(!n||mode==='duo')return;const before=xpLevel(progress.xp||0);progress.xp=(progress.xp||0)+n;const P=psData();const t0=psTierOf(P.xp);P.xp+=n;const after=xpLevel(progress.xp);saveProgress();
  XPQ={n,before,after,tierUp:psTierOf(P.xp)>t0};if(after.lv>before.lv){progress.lvRew=(progress.lvRew||0)+(after.lv-before.lv);saveProgress()}lobbyXP()}
// a small XP strip at the bottom of the next result card
{const _so=showOverlay;showOverlay=function(build,dim){const r=_so.apply(this,arguments);if(XPQ){const Q=XPQ;XPQ=null;setTimeout(()=>xpStrip(Q),60)}return r}}
function xpStrip(Q){const body=document.querySelector('#card .card-body');if(!body)return;const d=document.createElement('div');d.className='xp-strip';
  d.innerHTML=`<span class="lv"><i></i></span><div class="bar"><i></i></div><b></b>`;d.querySelector('.lv i').textContent=Q.before.lv;d.querySelector('b').textContent=t('xpGain',{n:Q.n});body.appendChild(d);
  const fill=d.querySelector('.bar i'),from=Q.before.into/Q.before.need;fill.style.width=from*100+'%';
  setTimeout(()=>{if(Q.after.lv>Q.before.lv){fill.style.width='100%';setTimeout(()=>{d.querySelector('.lv i').textContent=Q.after.lv;d.classList.add('up');fill.style.transition='none';fill.style.width='0%';void fill.offsetWidth;fill.style.transition='';fill.style.width=Q.after.into/Q.after.need*100+'%';setTimeout(()=>{if(d.isConnected)lvUpPop(Q.after.lv)},380)},650)}
    else{fill.style.width=Q.after.into/Q.after.need*100+'%';if(progress.lvRew)setTimeout(()=>{if(d.isConnected)lvUpLater()},700)}},500)}
// a level-up that had no result card to show on (trophy room, album chest, bonus, arcade, or the player left the card early) pays out here
function lvUpLater(){if(progress.lvRew&&!document.querySelector('.lvup'))lvUpPop(xpLevel(progress.xp||0).lv)}
function xpDrop(){XPQ=null}
function lvUpPop(lv){if(!progress.lvRew)return;const n=progress.lvRew;progress.lvRew=0;const coins=50*n;wallet().coins+=coins;saveProgress();updateWalletUI();sfx.flourish(3);vib([30,40,30]);
  const m=document.createElement('div');m.className='lvup';m.innerHTML=`<div class="lvup-c"><div class="rays"></div><div class="badge"><img src="art/xp_star.webp" alt=""><b>${lv}</b></div><span class="tag"></span><h3></h3><p></p><div class="lv-rw"><img src="art/ps_coins.webp" alt=""><span><b>+${coins}</b><small></small></span></div><button class="btn primary"><span></span></button></div>`;
  m.querySelector('.tag').textContent=t('lvUpTag');m.querySelector('h3').textContent=t('lvUp',{n:lv});m.querySelector('p').textContent=t('lvSub');m.querySelector('.lv-rw small').textContent=t('psCoins');m.querySelector('.btn span').textContent=t('lvOk');m.querySelector('.btn').onclick=()=>{sfx.click();m.remove()};document.body.appendChild(m)}
/* ---------- XP sources ---------- */
{const _w=win;win=function(){const was=state;const r=_w.apply(this,arguments);if(mode==='levels'&&was!=='win'&&state==='win')addXP(20+5*(lv.starsNow||0)+(isBoss()?40:0));return r}}
if(typeof bnCollect==='function'){const _b=bnCollect;bnCollect=function(){if(BN&&!BN.paid){addXP(10);xpDrop()}return _b.apply(this,arguments)}}
if(typeof arcEnd==='function'){const _a=arcEnd;arcEnd=function(G){const was=G.over,paid=!was&&arcLeft(G.id)>0&&G.score>0;const r=_a.apply(this,arguments);if(paid){addXP(5);xpDrop();noteToast(t('xpGain',{n:5}))}return r}}
if(typeof evFinish==='function'){const _e=evFinish;evFinish=function(won){if(won)addXP(EVP&&EVP.i===9?40:15);return _e.apply(this,arguments)}}
if(typeof trEnd==='function'){const _t=trEnd;trEnd=function(){const D=trData(),g0=Object.keys(D.got||{}).length;const r=_t.apply(this,arguments);const g1=Object.keys(trData().got||{}).length;addXP(10+15*(g1-g0));if(TRQUIET)XPQ=null;else if(XPQ&&document.querySelector('#card .card-body')){const Q=XPQ;XPQ=null;setTimeout(()=>xpStrip(Q),60)}return r}}
/* ---------- lobby: level badge on the avatar + Pass button ---------- */
function lobbyXP(){const pr=document.querySelector('#title .profile');if(!pr)return;let b=pr.querySelector('.av-lv');if(!b){const bar=document.createElement('span');bar.className='pf-xp';bar.innerHTML='<i class="av-lv"></i><span class="tr"><i></i></span>';pr.querySelector('.pf').appendChild(bar);b=bar.querySelector('.av-lv')}
  const L=xpLevel(progress.xp||0);b.textContent=L.lv;pr.querySelector('.pf-xp .tr i').style.width=L.into/L.need*100+'%';
  const pb=document.getElementById('lobPass');if(pb){const P=psData(),n=psReady();pb.querySelector('em span').textContent=t('psLeft',{n:psDays()});pb.querySelector('.dot').hidden=!n;const ev=document.getElementById('lobEvent');pb.parentNode.classList.toggle('two',!!ev&&!ev.hidden)}}
{const sec=document.getElementById('title'),logo=sec&&sec.querySelector('.logo');if(sec){const row=document.createElement('div');row.className='lob-pills';const b=document.createElement('button');b.id='lobPass';b.className='pass-btn';b.innerHTML='<img src="art/pass_icon.webp" alt=""><span><b></b><em><i>⏱</i><span></span></em></span><i class="dot" hidden>!</i>';b.querySelector('b').textContent=t('psTitle');b.onclick=()=>openPass();
  row.appendChild(b);const ev=document.getElementById('lobEvent');if(ev)row.appendChild(ev);if(logo)logo.after(row);else sec.appendChild(row)}}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);try{lobbyXP();if(state==='title')setTimeout(()=>{if(state==='title')lvUpLater()},400);const b=document.getElementById('lobPass');if(b){b.hidden=!progress.tut;b.querySelector('b').textContent=t('psTitle')}}catch(e){}return r}}
/* ---------- Pass screen ---------- */
let PSEL=null;
function openPass(){audio();sfx.click();if(!PSEL){PSEL=document.createElement('div');PSEL.id='passScr';document.body.appendChild(PSEL)}PSEL.hidden=false;psRender(true)}
function closePass(){if(PSEL)PSEL.hidden=true;updateWalletUI();if(state==='title')updateLobby()}
const psEsc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const PS_ART={galaxy:'ps_galaxy',t_comet:'ps_comet',starcrown:'ps_crown'};
function psRewHTML(R){let img,amt='',lab;if(R.c){img='ps_coins';amt='×'+R.c;lab=t('psCoins')}else if(R.b){img='ps_boost';amt='×'+R.b;lab=t('psBoost')}
  else if(R.it){const [c,id]=R.it;img=PS_ART[id];lab=c==='trail'?t('sk_'+id):wName(c,id)}else return '';
  return `<span class="rw${R.it?' it':''}"><img src="art/${img}.webp" alt="">${amt?`<b>${amt}</b>`:''}</span><small class="lab"></small>`.replace('<small class="lab"></small>',`<small class="lab">${psEsc(lab)}</small>`)}
function psGive(R){if(R.c){wallet().coins+=R.c}if(R.b){wallet();for(let i=0;i<R.b;i++){/* in turn, never random: the premium track is sold, and a random reward on it would count as a loot box */const k=progress.psBk=(progress.psBk||0)+1,b=['heart','shield','slow','laser'][(k-1)%4];progress.inv[b]=(progress.inv[b]||0)+1}}
  if(R.it){const [c,id]=R.it;if(c==='hat'||c==='trail'){if(!wallet().skins.includes(id))progress.skins.push(id)}else{progress.owned[c]=progress.owned[c]||[];if(!progress.owned[c].includes(id))progress.owned[c].push(id)}}}
function psClaim(i,prem){const P=psData();const arr=prem?P.p:P.f;if(arr.includes(i)||i>=psTierOf(P.xp)||(prem&&!P.prem))return false;arr.push(i);psGive(PS_REW[i][prem?1:0]);return true}
function psRender(scroll){const P=psData(),T=psTierOf(P.xp),r=PSEL,ready=psReady(),L0=r.querySelector('.ps-list'),y0=!scroll&&L0?L0.scrollTop:0;
  r.innerHTML=`<div class="ps-top"><button class="x-btn ps-x" aria-label="close"></button><div class="ps-title"><b></b><small></small></div><div class="coin-pill">${coinImg()}<span></span></div></div>
    <div class="ps-head"><div class="ps-star"><b>${T}</b></div><div class="ps-bar"><i style="width:${T>=PS_N?100:(P.xp%PS_XP)/PS_XP*100}%"></i><span>${T>=PS_N?'MAX':(P.xp%PS_XP)+'/'+PS_XP+' XP'}</span></div><div class="ps-next"><b>${Math.min(PS_N,T+1)}</b></div></div>
    <div class="ps-cols"><span class="pf">${t('psFree')}</span><span></span><span class="pp">${P.prem?'':'<img src="art/ps_lock.webp" alt="">'}${t('psPrem')}</span></div><div class="ps-list"></div>
    <div class="ps-foot"></div>`;
  r.querySelector('.ps-x').innerHTML=XSVG;r.querySelector('.ps-x').onclick=()=>{sfx.click();closePass()};r.querySelector('.ps-title b').textContent=t('psTitle');r.querySelector('.ps-title small').textContent=t('psLeft',{n:psDays()});r.querySelector('.coin-pill span').textContent=progress.coins;
  const L=r.querySelector('.ps-list');let firstCan=null;
  for(let i=0;i<PS_N;i++){const row=document.createElement('div'),got=i<T;row.className='ps-row'+(got?' got':'')+(i===T?' cur':'');
    const cell=(prem)=>{const R=PS_REW[i][prem?1:0],claimed=(prem?P.p:P.f).includes(i),can=got&&!claimed&&(!prem||P.prem),c=document.createElement('button');
      const first=can&&!firstCan;if(first)firstCan=c;c.className='ps-cell '+(prem?'prem':'free')+(claimed?' done':can?' can':'')+(first?' hot':'')+(prem&&!P.prem?' lock':'')+(got?'':' far');c.innerHTML=psRewHTML(R)+(claimed?'<i class="ok">✓</i>':can?`<i class="cl">${t('psClaim')}</i>`:prem&&!P.prem?'<img class="lk" src="art/ps_lock.webp" alt="">':'');
      c.onclick=()=>{if(can&&psClaim(i,prem)){saveProgress();sfx.coin(3);vib(15);psRender(false)}else if(prem&&!P.prem)psBuy();else{sfx.locked();if(!got)noteToast(t('psLocked',{n:i+1}))}};return c};
    const mid=document.createElement('div');mid.className='ps-num';mid.innerHTML=`<b>${i+1}</b>`;row.appendChild(cell(false));row.appendChild(mid);row.appendChild(cell(true));L.appendChild(row)}
  const f=r.querySelector('.ps-foot');
  if(ready>1){const a=document.createElement('button');a.className='btn green ps-all';a.innerHTML='<span></span>';a.querySelector('span').textContent=t('psAll')+' ('+ready+')';a.onclick=()=>{for(let i=0;i<T;i++){psClaim(i,false);psClaim(i,true)}saveProgress();sfx.coin(4);psRender(false)};f.appendChild(a)}
  if(!P.prem){const h=document.createElement('p');h.className='ps-why';h.textContent=t('psWhy');f.appendChild(h);const b=document.createElement('button');b.className='btn primary ps-buy';b.innerHTML='<img src="art/pass_icon.webp" alt=""><span></span>';b.querySelector('span').textContent=t('psBuy',{p:IAP.products.pass.price});b.onclick=psBuy;f.appendChild(b)}
  if(y0)L.scrollTop=y0;
  if(scroll){const can=firstCan,cur=(can&&can.parentNode)||L.querySelector('.cur')||L.lastElementChild;requestAnimationFrame(()=>{L.scrollTop=Math.max(0,cur.offsetTop-L.offsetTop-(can?12:L.clientHeight*.4))})}}
// a plain message (no coin): hints, 'reach tier n'. Longer texts wrap and stay on screen longer
function noteToast(txt){document.querySelectorAll('.coin-toast.note').forEach(e=>e.remove());const el=document.createElement('div');el.className='coin-toast note'+(String(txt).length>22?' long':'');el.textContent=txt;toastSlot(el);document.body.appendChild(el);setTimeout(()=>el.remove(),String(txt).length>40?3200:1800)}
function psBuy(){IAP.buy('pass',t('psTitle')+' · '+t('psPrem')).then(ok=>{if(ok){popupToast(t('psPremOn'));psRender(false)}})}
{const _g=IAP.grant;IAP.grant=function(sku){if(sku==='pass'){psData().prem=true;progress.purchases=progress.purchases||[];progress.purchases.push({sku,at:Date.now(),test:!IAP.live()});saveProgress();updateWalletUI();return}return _g.apply(this,arguments)}}
// pass items: gated in My hero until earned
const psItem=(c,id)=>PS_REW.some(r=>r[1].it&&r[1].it[0]===c&&r[1].it[1]===id);
{const _g=wGate;wGate=function(cat,id){if(psItem(cat,id)&&!wOwned(cat,id))return t('psItem');return _g.apply(this,arguments)}}
{const _ci=csInfo;csInfo=function(c,id){const I=_ci.apply(this,arguments);if(psItem(c,id)&&!I.owned){I.gate=t('psItem');I.rar='leg'}return I}}
// 3D star crown + comet trail
{const _bh=buildHat;buildHat=function(P,id){if(id!=='starcrown')return _bh(P,id);const T=P.T,s=P.hatSlot,gold={metalness:.7,roughness:.2};
  const add=(m,x=0,y=0,z=0,ink=1.05)=>{m.position.set(x,y,z);s.add(m);if(ink){const k=new T.Mesh(m.geometry,INKM());k.scale.setScalar(ink);m.add(k)}return m};
  add(wmesh(new T.CylinderGeometry(.3,.32,.14,32),'#ffc93c',gold),0,.07);
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2,sh=new T.Shape();for(let k=0;k<10;k++){const r=k%2?.045:.11,q=k/10*Math.PI*2+Math.PI/2;k?sh.lineTo(Math.cos(q)*r,Math.sin(q)*r):sh.moveTo(Math.cos(q)*r,Math.sin(q)*r)}
    const g=new T.ExtrudeGeometry(sh,{depth:.03,bevelEnabled:false});g.translate(0,0,-.015);const m=add(wmesh(g,'#ffe24d',{metalness:.5,roughness:.25,emissive:'#ffb000',emissiveIntensity:.25}),Math.sin(a)*.3,.24,Math.cos(a)*.3,0);m.rotation.y=a}
  add(wmesh(new T.SphereGeometry(.07,16,12),'#7c4dff',{metalness:.3,roughness:.15,emissive:'#7c4dff',emissiveIntensity:.35}),0,.08,.31,0)}}
{const _tm=trailMark;trailMark=function(k,x,y,a){if(progress.tskin!=='t_comet')return _tm(k,x,y,a);ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);
  const r=S*(.1+.06*(k%3));const g=ctx.createRadialGradient(0,0,0,0,0,r*2.2);g.addColorStop(0,'#ffffff');g.addColorStop(.35,'#9fd8ff');g.addColorStop(1,'rgba(124,77,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r*2.2,0,7);ctx.fill();ctx.restore();return true}}
