/* ===== v56: EGGS (buddy nest) + BUDDY EVOLUTION + TROPHY ROOM — design: ChatGPT (design/eggs/) =====
   Eggs come from mid-world levels, bosses, tournament gold, every 5th player level and the Pass. One egg sits in the nest and
   hatches after N won levels → a buddy you don't own yet, otherwise cookies (treats). Cookies evolve buddies (3 stages:
   bigger, then a golden aura) and every evolved stage adds +5% coins on won levels. Golden eggs can hatch the egg-only baby dino.
   Trophy room (tap the profile pill): achievements with bronze/silver/gold cups that pay coins + XP. */
Object.assign(I18N.en,{nestFull:'Nest is full! +5 cookies instead',nestTitle:'Buddy nest',nestSub:'Hatch, collect and evolve!',nestWinsW:'wins',nestWins:'{a}/{b} wins',nestHatch:'Hatch!',nestEmpty:'No egg yet — win mid-world levels and bosses to find eggs',nestQueue:'Next eggs',nestBuddies:'My buddies',nestEvolve:'Evolve',nestMax:'Super!',nestTreats:'Cookies',
  egg_c:'Egg',egg_r:'Rare egg',egg_g:'Golden egg',eggNew:'You found an egg!',eggNewSub:'It hatches after {n} wins',hatchNew:'New buddy!',hatchDup:'Cookies!',hatchDupSub:'You already have {b} — it turned into cookies',hatchOk:'Yay!',hatchWear:'Wear it',
  evoTitle:'{b} evolved!',evoSub:'Stage {n} · +{p}% coins on wins',evoBonus:'Evolved buddy',eggOnly:'Golden egg only',miniNest:'Nest',
  achTitle:'Trophy room',achClaim:'Collect',achDone:'All gold!',achNext:'{a}/{b}',
  ach_wins:'Levels won',ach_bosses:'Bosses beaten',ach_stars:'Stars',ach_tower:'Tallest endless tower',ach_perf:'Perfect drops',ach_stk:'Stickers',ach_eggs:'Eggs hatched',ach_lv:'Player level',ach_bud:'Buddies',ach_medal:'Tournament medals'});
Object.assign(I18N.he,{nestFull:'הקן מלא! קיבלתם 5 עוגיות במקום',nestTitle:'קן החברים',nestSub:'בקעו, אספו והתפתחו!',nestWinsW:'ניצחונות',nestWins:'{a}/{b} ניצחונות',nestHatch:'לבקוע!',nestEmpty:'עוד אין ביצה — נצחו בשלב 5 של כל עולם ובבוסים כדי למצוא ביצים',nestQueue:'הביצים הבאות',nestBuddies:'החברים שלי',nestEvolve:'התפתח',nestMax:'סופר!',nestTreats:'עוגיות',
  egg_c:'ביצה',egg_r:'ביצה נדירה',egg_g:'ביצת זהב',eggNew:'מצאתם ביצה!',eggNewSub:'היא תבקע אחרי {n} ניצחונות',hatchNew:'חבר חדש!',hatchDup:'עוגיות!',hatchDupSub:'{b} כבר אצלכם — הוא הפך לעוגיות',hatchOk:'יש!',hatchWear:'לשים עליי',
  evoTitle:'{b} התפתח!',evoSub:'שלב {n} · ‎+{p}%‎ מטבעות בניצחון',evoBonus:'חבר מפותח',eggOnly:'רק מביצת זהב',miniNest:'קן',
  achTitle:'חדר הגביעים',achClaim:'אסוף',achDone:'הכל זהב!',achNext:'{a}/{b}',
  ach_wins:'שלבים שניצחתם',ach_bosses:'בוסים שניצחתם',ach_stars:'כוכבים',ach_tower:'המגדל הכי גבוה לשמיים',ach_perf:'נחיתות מושלמות',ach_stk:'מדבקות',ach_eggs:'ביצים שבקעו',ach_lv:'רמת שחקן',ach_bud:'חברים',ach_medal:'מדליות טורניר'});
/* ---------- baby dino: egg-only buddy (perk: eggs hatch faster) ---------- */
WPET.dino={p:99999,egg:1,n:['Baby dino','דינו קטן']};PERKS.dino='egg';
{const _bp=buildPet;buildPet=function(T,id){if(id!=='dino')return evoWrap(T,id,_bp(T,id));
  const g=new T.Group(),u={g,id,t:Math.random()*5};const add=(m,x=0,y=0,z=0,ink=1.07)=>{m.position.set(x,y,z);g.add(m);if(ink){const k=new T.Mesh(m.geometry,INKM());k.scale.setScalar(ink);m.add(k)}return m};
  const G='#47c654',G2='#35a443',O='#ff9d3c';
  const body=add(wmesh(new T.SphereGeometry(.19,28,20),G,{roughness:.35}),0,.19);body.scale.set(1,1,1.05);
  const belly=add(wmesh(new T.SphereGeometry(.14,24,16),'#fff1b8',{roughness:.5}),0,.16,.1,0);belly.scale.set(.85,1,.5);
  const head=add(wmesh(new T.SphereGeometry(.17,28,20),G,{roughness:.35}),0,.45,.05);head.scale.set(1.1,.95,1);
  const snout=add(wmesh(new T.SphereGeometry(.1,20,14),G,{roughness:.35}),0,.4,.17,1.06);snout.scale.set(1.15,.75,.8);
  for(const sx of[-1,1]){const e=add(wmesh(new T.SphereGeometry(.05,16,12),'#ffffff',{roughness:.1}),sx*.075,.5,.17,1.15);e.scale.set(.85,1.1,.6);const pp=wmesh(new T.SphereGeometry(.026,12,10),'#120d2b');pp.position.set(0,-.005,.03);e.add(pp);
    add(wmesh(new T.SphereGeometry(.012,8,6),'#2a6b2e'),sx*.035,.42,.25,0);
    const arm=add(wmesh(new T.SphereGeometry(.04,12,10),G2),sx*.15,.22,.1,0);arm.scale.set(.8,1.3,.8);
    const leg=add(wmesh(new T.SphereGeometry(.065,14,10),G2),sx*.11,.04,.04,0);leg.scale.set(1,.7,1.3)}
  // orange crest from the top of the head down the back (visible from the front)
  [[0,.63,.02,.06],[0,.6,-.08,.055],[0,.52,-.16,.05],[0,.38,-.2,.045],[0,.25,-.21,.04]].forEach(([x,y,z,r],i)=>{const c=add(wmesh(new T.ConeGeometry(r,r*2.1,10),O,{roughness:.4}),x,y,z,1.08);c.rotation.x=-.25-i*.3});
  const tail=add(wmesh(new T.ConeGeometry(.08,.24,14),G),0,.1,-.24);tail.rotation.x=-1.9;
  u.h=.6;return evoWrap(T,id,u)}}
/* ---------- state ---------- */
const EGG={c:{need:3,pool:['chick','slime','ghost','bee'],dup:3},r:{need:5,pool:['star','mini','bee','ghost'],dup:6},g:{need:8,pool:['dino','star','mini'],dup:12}};
const EVO_COST=[0,10,25],EGG_MAX=6;
function nest(){const N=progress.nest=progress.nest||{};N.q=N.q||[];N.treats=N.treats||0;N.hatched=N.hatched||0;N.got=N.got||{};return N}
function budSt(id){return Math.min(3,Math.max(1,((progress.bud||{})[id])||1))}
function eggGive(ty,src){const N=nest();if(src){if(N.got[src])return false;N.got[src]=1}
  if(!N.cur)N.cur={t:ty,w:0};else if(N.q.length<EGG_MAX)N.q.push(ty);else{N.treats+=5;saveProgress();noteToast(t('nestFull'));return true}
  saveProgress();EGGQ.push(ty);setTimeout(eggNotify,0);return true}
let EGGQ=[];
function eggReady(){const N=nest();return !!N.cur&&N.cur.w>=EGG[N.cur.t].need}
/* wins feed the egg (+1, +2 with the dino) and give a cookie when a buddy is worn */
function eggWin(){const N=nest();if(N.cur&&!eggReady())N.cur.w=Math.min(EGG[N.cur.t].need,N.cur.w+(perk('egg')?2:1));if(petNow()!=='none'&&wOwned('pet',petNow()))N.treats++;saveProgress()}
{const _w=win;win=function(){const was=state;const r=_w.apply(this,arguments);if((mode==='levels'||mode==='event')&&was!=='win'&&state==='win'){try{eggWin();
    if(mode==='levels'){const li=lvInZone();if(li===4)eggGive('c','L'+level);else if(li===LPZ-1)eggGive('r','B'+level)}}catch(e){}}return r}}
if(typeof trEnd==='function'){const _t=trEnd;trEnd=function(){const D=trData(),had=!!(D.got&&D.got.g),g0=Object.keys(D.got||{}).length;const r=_t.apply(this,arguments);const D2=trData();
  progress.stat=progress.stat||{};progress.stat.medals=(progress.stat.medals||0)+Math.max(0,Object.keys(D2.got||{}).length-g0);if(!had&&D2.got&&D2.got.g)eggGive('g','T'+D2.wk);saveProgress();return r}}
// every 5th player level → a rare egg
if(typeof lvUpPop==='function'){const _l=lvUpPop;lvUpPop=function(lv){const n=progress.lvRew||0;const r=_l.apply(this,arguments);for(let L=lv-n+1;L<=lv;L++)if(L%5===0)eggGive('r','P'+L);return r}}
// perfect drops counter for the trophy room
{const _s=showOverlay;showOverlay=function(){if((state==='win'||state==='over')&&lv&&!lv._pc){lv._pc=1;progress.stat=progress.stat||{};progress.stat.perf=(progress.stat.perf||0)+(lv.perfect||0)}return _s.apply(this,arguments)}}
// Pass: free tiers 5 = an egg, 15/25 = a golden egg; premium 15/25 = 12 cookies (a fixed reward: nothing random is ever
// sold, or Apple counts it as a loot box → odds disclosure + 16+ in Australia)
if(typeof PS_REW!=='undefined'){PS_REW[4][0]={egg:'c'};[14,24].forEach(i=>{PS_REW[i][0]={egg:'g'};PS_REW[i][1]={ck:12}})
  const _rh=psRewHTML;psRewHTML=function(R){if(R.ck)return `<span class="rw it"><img src="art/ns_cookie.webp" alt=""></span><small class="lab">${R.ck} ${t('nestTreats')}</small>`;
    if(!R.egg)return _rh.apply(this,arguments);return `<span class="rw it"><img src="art/egg_${R.egg}.webp" alt=""></span><small class="lab">${t('egg_'+R.egg)}</small>`};
  const _pg=psGive;psGive=function(R){if(R.ck){nest().treats+=R.ck;saveProgress();return}if(R.egg){eggGive(R.egg);return}return _pg.apply(this,arguments)}}
// "you found an egg": a strip on the open result card, or a small pop-up in the lobby
function eggNotify(){if(!EGGQ.length)return;if(document.querySelector('.lvup')){setTimeout(eggNotify,500);return}const ov=document.getElementById('overlay'),body=document.querySelector('#card .card-body');
  if(ov&&!ov.hidden&&body&&(state==='win'||state==='over')){while(EGGQ.length){const tp=EGGQ.shift(),d=document.createElement('div');d.className='egg-strip pulse';d.innerHTML=`<img src="art/egg_${tp}.webp" alt=""><span><b></b><small></small></span>`;
      d.querySelector('b').textContent=t('eggNew');d.querySelector('small').textContent=t('egg_'+tp)+' · '+t('eggNewSub',{n:EGG[tp].need});body.appendChild(d)}sfx.flourish(2)}
  else if(state==='title'&&!document.querySelector('.egg-pop'))eggPop()}
{const _s=showOverlay;showOverlay=function(){const r=_s.apply(this,arguments);if(EGGQ.length)setTimeout(eggNotify,140);return r}}
function eggPop(){if(!EGGQ.length)return;const tp=EGGQ.shift();const m=document.createElement('div');m.className='egg-pop';
  m.innerHTML=`<div class="egg-c"><div class="rays"></div><img class="egg-big" src="art/egg_${tp}.webp" alt=""><h3></h3><p></p><button class="btn primary"><span></span></button></div>`;
  m.querySelector('h3').textContent=t('eggNew');m.querySelector('p').textContent=t('egg_'+tp)+' · '+t('eggNewSub',{n:EGG[tp].need});m.querySelector('.btn span').textContent=t('hatchOk');
  m.querySelector('.btn').onclick=()=>{sfx.click();m.remove();if(EGGQ.length)setTimeout(eggPop,200);else if(state==='title')updateLobby()};document.body.appendChild(m);sfx.flourish(2);vib([20,30,20])}
/* ---------- evolution: bigger buddy, golden aura at stage 3, +5% coins per stage ---------- */
function evoWrap(T,id,u){const st=budSt(id);if(st<2)return u;const inner=u.g,outer=new T.Group();outer.add(inner);inner.scale.setScalar(st===2?1.18:1.32);u.g=outer;
  if(st===3){const ring=new T.Mesh(new T.TorusGeometry(.17,.022,10,40),new T.MeshStandardMaterial({color:'#ffd23f',emissive:'#ffb000',emissiveIntensity:.8,metalness:.6,roughness:.25}));ring.rotation.x=Math.PI/2;ring.position.y=(u.h||.5)*1.32+.08;outer.add(ring);
    const glow=new T.Mesh(new T.SphereGeometry(.38,20,14),new T.MeshBasicMaterial({color:'#ffe680',transparent:true,opacity:.16,depthWrite:false}));glow.position.y=(u.h||.5)*.62;outer.add(glow)}
  return u}
{const _tr=tallyRows;tallyRows=function(won){const rows=_tr.apply(this,arguments);if(mode==='duo'||!won)return rows;const id=petNow();if(id==='none'||!wOwned('pet',id))return rows;const st=budSt(id);if(st<2)return rows;
  const base=rows.reduce((a,r)=>a+(+r[2]||0),0);const add=Math.round(base*.05*(st-1));if(add>0)rows.push([t('evoBonus'),'★'.repeat(st),add]);return rows}}
function budEvolve(id){const st=budSt(id),N=nest();if(st>=3||N.treats<EVO_COST[st])return false;N.treats-=EVO_COST[st];progress.bud=progress.bud||{};progress.bud[id]=st+1;saveProgress();petRefresh(id);return true}
function petRefresh(id){try{if(typeof H3!=='undefined'){H3.petId='__';if(typeof setHero3DSkin==='function')setHero3DSkin()}if(typeof W3!=='undefined'&&W3.thumbCache)for(const k in W3.thumbCache)if(k.includes(id))delete W3.thumbCache[k];BUD.id=null;buddyEnsure()}catch(e){}}
// dino is only from a golden egg
{const _g=wGate;wGate=function(cat,id){if(cat==='pet'&&WPET[id]&&WPET[id].egg&&!wOwned(cat,id))return t('eggOnly');return _g.apply(this,arguments)}}
{const _ci=csInfo;csInfo=function(c,id){const I=_ci.apply(this,arguments);if(c==='pet'&&WPET[id]&&WPET[id].egg&&!I.owned){I.gate=t('eggOnly');I.rar='leg'}return I}}
/* ---------- nest screen ---------- */
let NEL=null;
function openNest(){audio();sfx.click();if(!NEL){NEL=document.createElement('div');NEL.id='nestScr';document.body.appendChild(NEL)}NEL.hidden=false;NEL.innerHTML='';nestRender()}
function closeNest(){if(NEL)NEL.hidden=true;updateWalletUI();if(state==='title')updateLobby()}
function nestRender(){const N=nest(),r=NEL,C=N.cur,E=C&&EGG[C.t],ready=eggReady();
  r.innerHTML=`<div class="ps-top"><button class="x-btn ns-x" aria-label="close"></button><div class="ps-title"><b></b><small></small></div><div class="coin-pill ns-ck"><img src="art/ns_cookie.webp" alt=""><span></span></div></div>
    <div class="ns-scroll"><div class="ns-hero"><div class="ns-stand${ready?' ready':''}">${C?`<img class="ns-egg" src="art/egg_${C.t}.webp" alt="">`:''}<img class="ns-nimg" src="art/ns_nest.webp" alt=""></div><div class="ns-sign"></div></div>
    <div class="ns-act"></div><div class="ns-q"></div><h4 class="ns-h"><span></span></h4><div class="ns-grid"></div></div>`;
  r.querySelector('.ns-x').innerHTML=XSVG;r.querySelector('.ns-x').onclick=()=>{sfx.click();closeNest()};r.querySelector('.ps-title b').textContent=t('nestTitle');r.querySelector('.ps-title small').textContent=t('nestSub');r.querySelector('.ns-ck span').textContent=N.treats;
  const sign=r.querySelector('.ns-sign'),act=r.querySelector('.ns-act');
  if(!C){sign.remove();act.innerHTML='<p class="ns-empty"></p>';act.querySelector('p').textContent=t('nestEmpty')}
  else{sign.innerHTML=`<b>${C.w}/${E.need}</b><small></small><i class="bar"><i style="width:${C.w/E.need*100}%"></i></i>`;sign.querySelector('small').textContent=t('nestWinsW');
    if(ready){const b=document.createElement('button');b.className='btn primary ns-hatch';b.innerHTML='<span></span>';b.querySelector('span').textContent=t('nestHatch');b.onclick=hatch;act.appendChild(b)}}
  const q=r.querySelector('.ns-q');if(N.q.length){q.innerHTML=`<h4><span></span></h4><div class="ns-eggs">${N.q.map(tp=>`<span class="ns-et ${tp}"><img src="art/egg_${tp}.webp" alt=""><small>${t('egg_'+tp)}</small></span>`).join('')}</div>`;q.querySelector('h4 span').textContent=t('nestQueue')}else q.remove();
  r.querySelector('.ns-h span').textContent=t('nestBuddies');const g=r.querySelector('.ns-grid');
  Object.keys(WPET).filter(k=>k!=='none').forEach(id=>{const own=wOwned('pet',id),st=budSt(id),c=document.createElement('div');c.className='ns-bud'+(own?'':' off')+(own&&st===3?' super':'');
    c.innerHTML=`<span class="th"><img alt=""></span><b></b><i class="sts">${[1,2,3].map(k=>`<em class="${own&&k<=st?'on':''}">★</em>`).join('')}</i>`;
    const im=c.querySelector('img');try{im.src=wThumb('pet',id)||''}catch(e){}c.querySelector('b').textContent=wName('pet',id);
    if(own&&st<3){const cost=EVO_COST[st],bt=document.createElement('button');bt.className='ns-evo'+(N.treats>=cost?' can':'');bt.innerHTML=`<span></span><em><img src="art/ns_cookie.webp" alt="">${cost}</em>`;bt.querySelector('span').textContent=t('nestEvolve');
      bt.onclick=()=>{if(budEvolve(id)){sfx.flourish(3);vib([30,40,30]);evoPop(id)}else{sfx.locked();bt.classList.remove('nope');void bt.offsetWidth;bt.classList.add('nope')}};c.appendChild(bt)}
    else if(own){const s=document.createElement('span');s.className='ns-max';s.textContent=t('nestMax');c.appendChild(s)}
    else{const s=document.createElement('span');s.className='ns-lock';s.textContent=WPET[id].egg?(typeof eggGateTxt==='function'?eggGateTxt(id):t('eggOnly')):'🔒';c.appendChild(s)}
    g.appendChild(c)})}
function hatch(){const N=nest(),C=N.cur;if(!C||!eggReady())return;const E=EGG[C.t];let pool=E.pool.filter(id=>!wOwned('pet',id));
  if(C.t==='g'){const eg=['dino','phoenix'].filter(id=>WPET[id]&&!wOwned('pet',id));if(eg.length)pool=eg}const got=pool.length?pick(pool):null;N.hatched++;N.treats+=2;
  if(got){progress.owned.pet=progress.owned.pet||[];if(!progress.owned.pet.includes(got))progress.owned.pet.push(got)}else N.treats+=E.dup;
  const tp=C.t;N.cur=N.q.length?{t:N.q.shift(),w:0}:null;saveProgress();hatchShow(tp,got,got?null:pick(E.pool))}
function hatchShow(tp,got,dupId){const m=document.createElement('div');m.className='egg-pop hatch';
  m.innerHTML=`<div class="hz"><div class="rays"></div><h3></h3><div class="hx"><img class="egg-big shake" src="art/egg_${tp}.webp" alt=""></div><img class="hnest" src="art/ns_nest.webp" alt=""><p></p><div class="hb"></div></div>`;document.body.appendChild(m);sfx.click();vib(20);
  setTimeout(()=>{const hx=m.querySelector('.hx');const shells=tp==='c'?`<img class="sh-b" src="art/egg_shell_b.webp" alt=""><img class="sh-t" src="art/egg_shell_t.webp" alt="">`:'';
    hx.innerHTML=`<img class="pop-bud${got?'':' ck'}" alt="">`+shells;const pb=hx.querySelector('.pop-bud');if(got){try{pb.src=wThumb('pet',got)}catch(e){}}else pb.src='art/ns_cookie.webp';
    m.classList.add('open');sfx.flourish(3);vib([30,40,30]);
    m.querySelector('h3').textContent=got?t('hatchNew'):t('hatchDup');m.querySelector('p').textContent=got?wName('pet',got):t('hatchDupSub',{b:wName('pet',dupId)});
    const hb=m.querySelector('.hb');const ok=document.createElement('button');ok.className='btn primary';ok.innerHTML='<span></span>';ok.querySelector('span').textContent=got?t('hatchWear'):t('hatchOk');
    ok.onclick=()=>{sfx.click();if(got){lookNow().pet=got;saveProgress();petRefresh(got)}m.remove();nestRender()};hb.appendChild(ok);
    if(got){const no=document.createElement('button');no.className='btn';no.innerHTML='<span></span>';no.querySelector('span').textContent=t('hatchOk');no.onclick=()=>{sfx.click();m.remove();nestRender()};hb.appendChild(no)}},1400)}
function evoPop(id){const st=budSt(id),m=document.createElement('div');m.className='egg-pop';const stars=n=>`<i class="sts">${[1,2,3].map(k=>`<em class="${k<=n?'on':''}">★</em>`).join('')}</i>`;
  m.innerHTML=`<div class="egg-c evo"><div class="rays"></div><img class="pop-bud" alt=""><div class="evo-ba">${stars(st-1)}<span class="ar">${document.documentElement.dir==='rtl'?'←':'→'}</span>${stars(st)}</div><h3></h3><p></p><button class="btn primary"><span></span></button></div>`;
  try{m.querySelector('.pop-bud').src=wThumb('pet',id)}catch(e){}m.querySelector('h3').textContent=t('evoTitle',{b:wName('pet',id)});m.querySelector('p').textContent=t('evoSub',{n:st,p:5*(st-1)});m.querySelector('.btn span').textContent=t('hatchOk');
  m.querySelector('.btn').onclick=()=>{sfx.click();m.remove();nestRender()};document.body.appendChild(m)}
/* ---------- trophy room ---------- */
const ACH=[
  {id:'wins',ic:'ic_star',v:()=>(progress.stars||[]).filter(s=>s>0).length,T:[10,50,150]},
  {id:'bosses',ic:'ic_boss',v:()=>Object.keys(progress.beat||{}).length,T:[3,10,25]},
  {id:'stars',ic:'ic_star',v:()=>(progress.stars||[]).reduce((a,s)=>a+(s||0),0),T:[30,150,450]},
  {id:'tower',ic:'ic_endless',v:()=>progress.bestEndless||0,T:[20,50,100]},
  {id:'perf',ic:'ic_bolt',v:()=>(progress.stat||{}).perf||0,T:[50,300,1000]},
  {id:'stk',ic:'ic_album',v:()=>{let n=0;try{for(const P of STK_PAGES)for(const it of P.items())if(it.n)n++}catch(e){}return n},T:[10,40,80]},
  {id:'eggs',ic:'egg_c',v:()=>nest().hatched,T:[1,10,30]},
  {id:'lv',ic:'xp_star',v:()=>xpLevel(progress.xp||0).lv,T:[5,15,30]},
  {id:'bud',ic:'ns_nest',v:()=>Object.keys(WPET).filter(k=>k!=='none'&&wOwned('pet',k)).length,T:[2,5,9]},
  {id:'medal',ic:'tr_medal_g',v:()=>(progress.stat||{}).medals||0,T:[1,10,30]}];
const ACH_PAY=[[100,20],[250,40],[600,80]],CUP=['b','s','g'];
function achGot(id){return ((progress.ach||{})[id])||0}
function achReady(){return ACH.reduce((n,A)=>{const g=achGot(A.id);return n+(g<3&&A.v()>=A.T[g]?1:0)},0)}
let ACEL=null;
function openTrophy(){audio();sfx.click();if(!ACEL){ACEL=document.createElement('div');ACEL.id='achScr';document.body.appendChild(ACEL)}ACEL.hidden=false;ACEL.innerHTML='';achRender()}
function achRender(){const r=ACEL;r.innerHTML=`<div class="ps-top"><button class="x-btn ac-x" aria-label="close"></button><div class="ps-title"><b></b><small></small></div><div class="coin-pill">${coinImg()}<span></span></div></div><div class="ac-list"></div>`;
  r.querySelector('.ac-x').innerHTML=XSVG;r.querySelector('.ac-x').onclick=()=>{sfx.click();r.hidden=true;updateWalletUI();if(state==='title')updateLobby()};
  r.querySelector('.ps-title b').textContent=t('achTitle');const tot=ACH.reduce((a,A)=>a+achGot(A.id),0);r.querySelector('.ps-title small').innerHTML=`<img src="art/cup_g.webp" alt=""> ${tot}/${ACH.length*3}`;r.querySelector('.coin-pill span').textContent=progress.coins;
  const L=r.querySelector('.ac-list');let first=true;
  ACH.forEach(A=>{const g=achGot(A.id),v=A.v(),done=g>=3,goal=done?A.T[2]:A.T[g],can=!done&&v>=goal,row=document.createElement('div');row.className='ac-row'+(can?' can':'')+(done?' done':'')+(can&&first?' hot':'');if(can)first=false;
    row.innerHTML=`<span class="ac-ic"><img src="art/${A.ic}.webp" alt=""></span><div class="ac-mid"><b></b><div class="ac-ln"><div class="ac-bar"><i style="width:${Math.min(1,v/goal)*100}%"></i><span></span></div></div></div><div class="ac-cups">${CUP.map((c,i)=>`<img class="${i<g?'on':i===g?'next':''}" src="art/cup_${c}.webp" alt="">`).join('')}</div>`;
    row.querySelector('b').textContent=t('ach_'+A.id);row.querySelector('.ac-bar span').textContent=done?t('achDone'):t('achNext',{a:Math.min(v,goal),b:goal});
    if(can){const b=document.createElement('button');b.className='ac-claim';b.innerHTML=`<img src="art/cup_${CUP[g]}.webp" alt=""><span></span>`;b.querySelector('span').textContent=t('achClaim');
      b.onclick=()=>{achClaim(A,g);saveProgress();sfx.coin(4);vib(15);achRender()};row.querySelector('.ac-ln').appendChild(b)}
    L.appendChild(row)});
  const n=achReady();if(n>1){const f=document.createElement('div');f.className='ac-foot';const b=document.createElement('button');b.className='btn green';b.innerHTML='<span></span>';b.querySelector('span').textContent=t('psAll')+' ('+n+')';
    b.onclick=()=>{let c=0,x=0;ACH.forEach(A=>{let g=achGot(A.id);while(g<3&&A.v()>=A.T[g]){const P=achClaim(A,g,true);c+=P[0];x+=P[1];g++}});addXP(x);XPQ=null;saveProgress();lvUpLater();sfx.coin(5);popupToast('+'+c+' 🪙  +'+x+' XP');achRender()};f.appendChild(b);r.appendChild(f)}}
function achClaim(A,g,quiet){progress.ach=progress.ach||{};progress.ach[A.id]=g+1;const [c,x]=ACH_PAY[g];wallet().coins+=c;if(!quiet){addXP(x);XPQ=null;lvUpLater();popupToast('+'+c+' 🪙  +'+x+' XP')}return [c,x]}
// profile pill → trophy room, with a red dot when a cup is waiting
{const pr=document.querySelector('#title .profile');if(pr){pr.style.cursor='pointer';pr.addEventListener('click',()=>openTrophy());const d=document.createElement('i');d.className='badge ac-dot';d.hidden=true;d.textContent='!';pr.appendChild(d)}}
/* ---------- lobby: nest icon in the mini column ---------- */
{const row=document.querySelector('#title .lob-mini');if(row){const b=document.createElement('button');b.className='lt-mini nest';b.id='lobNest';b.innerHTML='<span class="lt-ic"><img src="art/ns_nest.webp" alt=""><svg class="ring" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16"/><circle class="p" cx="18" cy="18" r="16"/></svg></span><b></b>';b.onclick=openNest;row.appendChild(b)}}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);try{const b=document.getElementById('lobNest');if(b){const N=nest(),C=N.cur;b.hidden=!progress.tut;
    b.querySelector('.lt-ic>img').src=C?'art/egg_'+C.t+'.webp':'art/ns_nest.webp';const f=C?Math.min(1,C.w/EGG[C.t].need):0;b.querySelector('.ring .p').style.strokeDashoffset=100.5*(1-f);
    b.querySelector('b').textContent=C?(eggReady()?t('nestHatch'):C.w+'/'+EGG[C.t].need):t('miniNest');b.classList.toggle('ready',eggReady());
    b.querySelectorAll('.lt-bd').forEach(e=>e.remove());if(eggReady()){const d=document.createElement('i');d.className='badge lt-bd';d.textContent='!';b.querySelector('.lt-ic').appendChild(d)}}
  const d=document.querySelector('#title .ac-dot');if(d)d.hidden=!achReady()}catch(e){}return r}}
setTimeout(()=>{try{if(state==='title')updateLobby()}catch(e){}},0);
// a re-render after Collect / Evolve keeps the list where the player was (it jumped back to the top)
function keepScroll(fn,root,sel){return function(){const R=root(),o=R&&R.querySelector(sel),y=o?o.scrollTop:0;const r=fn.apply(this,arguments);const n=y&&R&&R.querySelector(sel);if(n)n.scrollTop=y;return r}}
nestRender=keepScroll(nestRender,()=>NEL,'.ns-scroll');achRender=keepScroll(achRender,()=>ACEL,'.ac-list');
