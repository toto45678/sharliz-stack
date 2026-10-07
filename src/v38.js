/* ===== v38: daily login gift — 7-day streak calendar, pops up once a day in the lobby ===== */
Object.assign(I18N.en,{dlTitle:'Daily gift',dlDay:'Day {n}',dlClaim:'Collect!',dlSub:'Come back every day — day 7 is a big chest!',dlStreak:'Streak: {n} days',dlBoost:'+ booster',dlBoost2:'+ 2 boosters'});
Object.assign(I18N.he,{dlTitle:'מתנה יומית',dlDay:'יום {n}',dlClaim:'לקחת!',dlSub:'חוזרים כל יום, וביום 7 מחכה תיבה גדולה!',dlStreak:'רצף: {n} ימים',dlBoost:'+ בוסטר',dlBoost2:'+ 2 בוסטרים'});

// coins per streak day; b = boosters added on top
const DL_REWARDS=[{c:50},{c:80},{c:100,b:1,pk:1},{c:120},{c:150,b:1},{c:200},{c:400,b:2,pk:1}];  // pk = sticker packs (v57)
function dlDate(off){const d=new Date();d.setDate(d.getDate()+off);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function dlState(){const L=progress.login||{last:null,streak:0},td=dlDate(0);
  if(L.last===td)return {claimed:true,day:L.streak};
  return {claimed:false,day:L.last===dlDate(-1)?L.streak%7+1:1}}
function dlClaim(){const s=dlState();if(s.claimed)return;const R=DL_REWARDS[s.day-1];
  progress.login={last:dlDate(0),streak:s.day};progress.coins=(progress.coins||0)+R.c;
  if(R.b){const inv=wallet().inv;for(let i=0;i<R.b;i++){const b=pick(['slow','laser','shield','heart']);inv[b]=(inv[b]||0)+1}}
  saveProgress();if(R.pk&&typeof sbGive==='function')sbGive(R.pk);sfx.coin(4);if(s.day===7)sfx.flourish(3);coinShower(R.c);updateWalletUI()}
function openDailyGift(){showOverlay(()=>{const s0=dlState();return {title:t('dlTitle'),extra:card=>{
  const s=dlState(),g=document.createElement('div');g.className='dl-grid';
  DL_REWARDS.forEach((R,i)=>{const d=i+1,got=d<s.day||(s.claimed&&d===s.day),now=!s.claimed&&d===s.day,el=document.createElement('div');
    el.className='dl-day'+(d===7?' big':'')+(got?' got':'')+(now?' now':'');
    el.innerHTML=`<small></small><img src="art/${d===7?'ic_chest':R.b?'ic_gift':'ic_coin'}.webp" alt=""><b>${R.c}</b>`+(R.b?'<i></i>':'')+(R.pk?'<span class="dl-pk"><img src="art/sb_pack.webp" alt=""></span>':'')+(got?'<em>✓</em>':'');
    el.querySelector('small').textContent=t('dlDay',{n:d});if(R.b)el.querySelector('i').textContent=t(R.b>1?'dlBoost2':'dlBoost');g.appendChild(el)});
  card.appendChild(g);const p=document.createElement('p');p.className='dl-sub';p.textContent=s.day>1?t('dlStreak',{n:s.claimed?s.day:s.day-1})+' · '+t('dlSub'):t('dlSub');card.appendChild(p)},
  actions:s0.claimed?[{label:t('close'),primary:true,fn:hideOverlay}]:[{label:t('dlClaim'),primary:true,fn:()=>{dlClaim();rerenderOverlay();setTimeout(()=>{if(document.querySelector('.dl-grid'))hideOverlay()},1300)}}]}},true)}
// show it by itself once per day, the first time the lobby is idle (not on the very first launch, before any level)
let dlShownOn=null;
function dlMaybe(){const td=dlDate(0);if(dlShownOn===td||dlState().claimed||progress.unlocked<2)return;
  setTimeout(()=>{if(dlShownOn===td||state!=='title'||W3.on||!document.getElementById('overlay').hidden||document.getElementById('title').hidden)return;dlShownOn=td;openDailyGift()},700)}
{const _ul=updateLobby;updateLobby=function(){_ul();dlMaybe()}}
dlMaybe();   // modules load after the boot toTitle(), so check once now too
