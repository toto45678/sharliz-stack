/* ===== v72: HOME BACKGROUNDS (Tzach, Oct 25: "different backgrounds behind the Sharliz on the home screen, one for every boss you beat
   and special ones you can buy") =====
   Pictures: art/bg_<id>.webp (1024x1536, same podium place as art/lobby.webp) + thumbnails art/bgt_<id>.webp, made by
   tools/backgrounds/make.py from the ChatGPT originals. BG_ART (injected by build.py) = the ids that have a picture, so a background
   only shows up once its art is in. Boss backgrounds use the stage id (bg_farm, bg_farmN, bg_jungle...); specials are 'sp_<name>'.
   progress.bgs={own:[ids],on:id|null,seen:[ids]}. Boss ones come with the first win over that boss (also for bosses beaten before
   this update); specials are bought with coins (nothing random, no power: looks only). Shop tab 'bg' with a live preview on the
   home screen; a 'New background' strip with a Use button on the boss win card. */
const BG_ART=__BG_ART__;
const BG_SP={sp_treasure:2000,sp_galaxy:1800,sp_coral:1500,sp_disco:1500,sp_fairy:1500,sp_aurora:1500,sp_pirate:1200,sp_sakura:1200};
Object.assign(I18N.en,{bgTab:'Backgrounds',bgUse:'Use',bgOn:'In use',bgNew:'New background!',bgBeatBoss:'Beat the boss',bgBack:'Back',bgClassic:'Classic',
  bgBoss:'Boss backgrounds',bgSpecial:'Special backgrounds',bgHint:'Tap a background to try it on your home screen',bgNewSub:'{n} · for your home screen',
  sp_treasure:'Treasure Vault',sp_galaxy:'Galaxy',sp_coral:'Coral Palace',sp_disco:'Disco Stage',sp_fairy:'Fairy Forest',sp_aurora:'Aurora Palace',
  sp_pirate:'Pirate Ship',sp_sakura:'Cherry Garden'});
Object.assign(I18N.he,{bgTab:'רקעים',bgUse:'לשים',bgOn:'בשימוש',bgNew:'רקע חדש!',bgBeatBoss:'נצחו את הבוס',bgBack:'חזרה',bgClassic:'קלאסי',
  bgBoss:'רקעים של בוסים',bgSpecial:'רקעים מיוחדים',bgHint:'הקישו על רקע כדי לנסות אותו במסך הבית',bgNewSub:'{n} · למסך הבית',
  sp_treasure:'כספת האוצר',sp_galaxy:'גלקסיה',sp_coral:'ארמון האלמוגים',sp_disco:'במת דיסקו',sp_fairy:'יער הפיות',sp_aurora:'ארמון הזוהר',
  sp_pirate:'ספינת פיראטים',sp_sakura:'גן הדובדבן'});
const bgS=()=>progress.bgs||(progress.bgs={own:[],on:null,seen:[]});
const bgHas=id=>BG_ART.includes(id);
const bgOwned=id=>!id||bgS().own.includes(id);
const bgZone=id=>ZONES.find(z=>(z.sid||z.id)===id);
const bgBossName=id=>{const z=bgZone(id);return z?t(BOSS_NAMES[z.sid]||BOSS_NAMES[z.id]):id};
const bgName=id=>!id?t('bgClassic'):BG_SP[id]?t(id):bgBossName(id);
const bgBossIds=()=>ZONES.map(z=>z.sid||z.id).filter(bgHas);
const bgSpIds=()=>Object.keys(BG_SP).filter(bgHas);
const bgSrc=id=>id&&bgHas(id)?'art/bg_'+id+'.webp':'art/lobby.webp';
// the home picture: LOBIMG (base.html) is what drawTitleArt paints; only swap when the source really changes
function bgShow(id){const src=bgSrc(id);if(LOBIMG.getAttribute('src')!==src)LOBIMG.src=src;else if(state==='title')drawTitleArt()}
const bgApply=()=>bgShow(bgOwned(bgS().on)?bgS().on:null);
function bgGive(id){if(!bgHas(id)||bgOwned(id))return false;bgS().own.push(id);saveProgress();return true}
// bosses beaten before this update still earn their background (quietly, they show as new in the shop)
{for(const sid of Object.keys(progress.beat||{}))if(progress.beat[sid])bgGive(sid);bgApply()}

/* ---------- boss win: grant + a strip on the win card ---------- */
let BGQ=[];
{const _w=win;win=function(){if(mode==='levels'&&isBoss()){const sid=zone().sid||zone().id;if(bgGive(sid))BGQ.push(sid)}return _w.apply(this,arguments)}}
function bgNotify(){if(!BGQ.length)return;if(document.querySelector('.lvup')){setTimeout(bgNotify,500);return}
  const ov=document.getElementById('overlay'),body=document.querySelector('#card .card-body');
  if(!(ov&&!ov.hidden&&body&&state==='win'))return;
  while(BGQ.length){const id=BGQ.shift(),d=document.createElement('div');d.className='bg-strip';
    d.innerHTML=`<img src="art/bgt_${id}.webp" alt=""><span><b></b><small></small></span><button class="buy"></button>`;
    d.querySelector('b').textContent=t('bgNew');d.querySelector('small').textContent=t('bgNewSub',{n:bgName(id)});
    const u=d.querySelector('button');const sync=()=>{const on=bgS().on===id;u.textContent=on?t('bgOn'):t('bgUse');u.disabled=on};sync();
    u.onclick=e=>{e.stopPropagation();bgS().on=id;if(!bgS().seen.includes(id))bgS().seen.push(id);saveProgress();bgApply();sfx.coin(3);sync()};
    body.appendChild(d)}
  sfx.flourish(2)}
{const _s=showOverlay;showOverlay=function(){const r=_s.apply(this,arguments);if(BGQ.length)setTimeout(bgNotify,160);return r}}

/* ---------- shop tab ---------- */
const bgUnseen=()=>bgS().own.filter(id=>bgHas(id)&&!bgS().seen.includes(id)).length;
{const _sb=shopBody;shopBody=function(card){const tab=shopTab;if(tab==='bg')shopTab='boost';_sb(card);shopTab=tab;
  const tabs=card.querySelector('.shop-tabs');if(!tabs||!BG_ART.length)return;
  const b=document.createElement('button');b.className='bg-tab';b.setAttribute('aria-pressed',tab==='bg');b.textContent=t('bgTab');
  const n=bgUnseen();if(n){const i=document.createElement('i');i.className='badge';i.textContent=n;b.appendChild(i)}
  b.onclick=()=>{shopTab='bg';sfx.click();rerenderOverlay()};tabs.appendChild(b);tabs.classList.add('t5');requestAnimationFrame(()=>bgFitTabs(tabs));
  if(tab!=='bg')return;tabs.querySelectorAll('button').forEach(x=>{if(x!==b)x.setAttribute('aria-pressed','false')});
  const list=card.querySelector('.shop-list');list.className='shop-list bg-list';list.innerHTML='';
  list.style.setProperty('--bg-new',JSON.stringify(t('bnNew')));   // the NEW tag on a tile is CSS content: give it the word in this language
  const hint=document.createElement('p');hint.className='bg-hint';hint.textContent=t('bgHint');list.appendChild(hint);
  const head=k=>{const h=document.createElement('div');h.className='shop-head';h.textContent=t(k);list.appendChild(h)};
  const tile=id=>{const own=bgOwned(id),on=(bgS().on||null)===(id||null)&&own,sp=!!BG_SP[id],price=BG_SP[id]||0;
    const r=document.createElement('button');r.className='bg-it'+(on?' on':'')+(own?' owned':' locked')+(sp?' sp':'')+(own&&id&&!bgS().seen.includes(id)?' new':'');
    r.innerHTML=`<img src="art/${id?'bgt_'+id:'bgt_lobby'}.webp" alt="" loading="lazy"><span></span><em></em>`;
    r.querySelector('span').textContent=bgName(id);
    const em=r.querySelector('em');if(on)em.textContent=t('bgOn');else if(own)em.textContent=t('bgUse');else if(sp)em.innerHTML=coinImg()+price;else{em.textContent=t('bgBeatBoss');em.className='lk'}
    r.onclick=()=>{sfx.click();bgPreview(id)};return r};
  const g1=document.createElement('div');g1.className='bg-grid';g1.appendChild(tile(null));bgSpIds().forEach(id=>g1.appendChild(tile(id)));
  head('bgSpecial');list.appendChild(g1);
  const ids=bgBossIds();if(ids.length){head('bgBoss');const g2=document.createElement('div');g2.className='bg-grid';ids.forEach(id=>g2.appendChild(tile(id)));list.appendChild(g2)}
  requestAnimationFrame(()=>bgFit(list.querySelectorAll('.bg-it span,.bg-it em')));   // a long one-word name (German...) gets smaller instead of breaking
  // opening the tab marks the owned ones as seen (the NEW tag stays until the next visit)
  const S=bgS();let ch=false;S.own.forEach(id=>{if(!S.seen.includes(id)){S.seen.push(id);ch=true}});if(ch)saveProgress()}}

// a label that is still too wide for its tab (long words in some languages) shrinks step by step, badge left out of the measure
function bgFit(els){els.forEach(b=>{if(!b.isConnected)return;const bd=[...b.querySelectorAll('.badge')];bd.forEach(i=>i.style.display='none');
  let fs=parseFloat(getComputedStyle(b).fontSize);while(b.scrollWidth>b.clientWidth+1&&fs>9){fs-=.5;b.style.fontSize=fs+'px'}bd.forEach(i=>i.style.display='')})}
const bgFitTabs=tabs=>bgFit(tabs.querySelectorAll('button'));

/* ---------- preview: on the home screen the real home screen with that picture, elsewhere a picture card ---------- */
function bgBuy(id){const p=BG_SP[id];if(!p||bgOwned(id))return true;if(progress.coins<p){sfx.locked();noteToast(t('needCoins'));return false}
  progress.coins-=p;bgS().own.push(id);bgS().seen.push(id);saveProgress();sfx.coin(4);updateWalletUI();return true}
function bgPreview(id){
  const live=state==='title';const prev=bgS().on;
  const m=document.createElement('div');m.className='bg-pv'+(live?' live':'');
  m.innerHTML=(live?'':`<img class="bg-pv-img" src="${bgSrc(id)}" alt="">`)+`<div class="bg-pv-bar"><b></b><div class="bg-pv-btns"><button class="btn bg-pv-back"><span></span></button><button class="btn primary bg-pv-go"><span></span></button></div></div>`;
  m.querySelector('b').textContent=bgName(id);m.querySelector('.bg-pv-back span').textContent=t('bgBack');
  const own=bgOwned(id),on=own&&(prev||null)===(id||null),sp=!!BG_SP[id],go=m.querySelector('.bg-pv-go');
  const lab=go.querySelector('span');
  if(on){lab.textContent=t('bgOn');go.disabled=true}else if(own)lab.textContent=t('bgUse');else if(sp)lab.innerHTML=coinImg()+BG_SP[id];
  else{lab.textContent=t('bgBeatBoss');go.disabled=true;go.classList.add('lk')}
  const close=back=>{m.remove();document.body.classList.remove('bg-pv-on');if(live){bgApply();if(back){shopTab='bg';openShop()}}};
  m.querySelector('.bg-pv-back').onclick=()=>{sfx.click();close(true)};
  go.onclick=()=>{if(!own&&!bgBuy(id))return;bgS().on=id;saveProgress();sfx.click();close(true)};
  if(live){hideOverlay();bgShow(id);document.body.classList.add('bg-pv-on')}
  document.body.appendChild(m)}

/* ---------- lobby badge: new backgrounds show on the shop button (set before v55 copies the badges to the tab bar) ---------- */
{const _ul=updateLobby;updateLobby=function(){const b=document.getElementById('lobShop');if(b){let d=b.querySelector('.bg-dot');const n=bgUnseen();
  if(n&&!d){d=document.createElement('i');d.className='badge bg-dot';b.appendChild(d)}if(d){if(n)d.textContent=n;else d.remove()}}return _ul.apply(this,arguments)}}
