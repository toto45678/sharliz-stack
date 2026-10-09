/* ===== v53: WEEKLY TOURNAMENT =====
   Same challenge for everyone each week (seeded by the week number): one world + one twist (wind / fast / night / gold rush).
   3 hearts, build as high as you can, unlimited tries, best of the week counts. Medals at 10 / 20 / 35 floors pay coins + boosters
   once per week. No server yet → "challenge a friend" shares your best to WhatsApp. Design: ChatGPT (design/tournament/). */
Object.assign(I18N.en,{trInvite:'Come play the Sharliz weekly tournament with me! 🏆',tourTitle:'Weekly Tournament',trLeft:'{n} days left',trLeft1:'Last day!',trBest:'My best this week',trFloorsN:'{n} floors',trPlay:'Play',trChallenge:'Challenge a friend',trBack:'Tournament',trAgain:'Again',
  trNew:'New record!',trMedal:'Medal unlocked!',trNext:'{n} more to {m}',trAllMedals:'All medals this week!',trTwist:'This week',
  tw_wind:'Strong wind',twd_wind:'The wind pushes twice as hard',tw_fast:'Speed week',twd_fast:'Everything swings faster',tw_night:'Night tower',twd_night:'Build in the dark',tw_gold:'Golden rush',twd_gold:'Lots of golden Sharliz',
  md_b:'Bronze',md_s:'Silver',md_g:'Gold',trShare:'I built {n} floors in the Sharliz weekly tournament! Can you beat me? 🏆',trModes:'Weekly',trGot:'Collected',trClose:'So close to your record!',trNice:'Nice run!',trPrizes:'Tournament prizes',trReached:'You reached the {m} prize!',trHow:'3 hearts · as high as you can'});
Object.assign(I18N.he,{trInvite:'בואו לשחק איתי בטורניר השבועי של שארליז! 🏆',tourTitle:'טורניר שבועי',trLeft:'נותרו {n} ימים',trLeft1:'יום אחרון!',trBest:'השיא שלי השבוע',trFloorsN:'{n} קומות',trPlay:'שחקו',trChallenge:'אתגרו חבר',trBack:'לטורניר',trAgain:'שוב',
  trNew:'שיא חדש!',trMedal:'מדליה חדשה!',trNext:'עוד {n} קומות ל{m}',trAllMedals:'כל המדליות השבוע!',trTwist:'השבוע',
  tw_wind:'רוח חזקה',twd_wind:'הרוח דוחפת פי שניים',tw_fast:'שבוע מהיר',twd_fast:'הכל מתנדנד מהר יותר',tw_night:'מגדל לילה',twd_night:'בונים בחושך',tw_gold:'בהלת זהב',twd_gold:'הרבה שארליז מוזהבות',
  md_b:'ארד',md_s:'כסף',md_g:'זהב',trShare:'בניתי מגדל של {n} קומות בטורניר השבועי של שארליז! תצליחו לעבור אותי? 🏆',trModes:'שבועי',trGot:'נאסף',trClose:'כמעט שיא!',trNice:'סיבוב יפה!',trPrizes:'פרסי הטורניר',trReached:'הגעתם לפרס ה{m}!',trHow:'3 לבבות · כמה שיותר גבוה'});
const TR_TWISTS=['wind','fast','night','gold'],TR_MEDALS=[{k:'b',f:10,c:100,bo:0},{k:'s',f:20,c:200,bo:1,pk:1},{k:'g',f:35,c:400,bo:2,gpk:1}];  // pk = sticker packs, gpk = golden sticker pack (v57)
function trWeek(d=new Date()){const m=new Date(d);m.setHours(0,0,0,0);const dow=(m.getDay()+6)%7;m.setDate(m.getDate()-dow);return {id:Math.round(m/864e5/7),start:m,end:new Date(+m+7*864e5)}}
function trNow(){const W=trWeek();let h=(W.id*2654435761)>>>0;const tw=TR_TWISTS[W.id%TR_TWISTS.length];h=(h^(h>>>13))>>>0;
  const pool=tw==='night'?ZONES.map((z,i)=>i).filter(i=>ZONES[i].season===2):ZONES.map((z,i)=>i).filter(i=>(ZONES[i].season||1)===1);const zi=pool[h%pool.length];return {W,tw,zi}}
function trData(){const N=trNow(),d=progress.tour=progress.tour||{};if(d.wk!==N.W.id){d.wk=N.W.id;d.best=0;d.got={};d.tries=0}d.got=d.got||{};return d}
const trDays=()=>Math.max(1,Math.ceil((trNow().W.end-new Date())/864e5));
let TREL=null,TR=null;
function trRoot(){if(!TREL){TREL=document.createElement('div');TREL.id='tour';TREL.hidden=true;document.body.appendChild(TREL)}return TREL}
function openTour(){audio();sfx.click();hideOverlay();const r=trRoot();r.hidden=false;trScreen()}
function closeTour(){if(TREL)TREL.hidden=true;updateWalletUI();if(state==='title')updateLobby()}
function trMedalRow(best){const nxk=(TR_MEDALS.find(m=>best<m.f)||{}).k;return `<div class="tr-prz"><div class="tr-meds">${TR_MEDALS.map(m=>`<div class="tr-md ${best>=m.f?'on':m.k===nxk?'nx':'far'} m-${m.k}" style="--x:${m.f/35*100}%"><b>${m.f}</b><img src="art/tr_medal_${m.k}.webp" alt=""></div>`).join('')}</div>
  <div class="bar"><i style="width:${Math.min(100,best/35*100)}%"></i>${best>0&&best<35?`<span class="pin" style="--x:${best/35*100}%"><em>${best}</em></span>`:''}</div>
  <div class="tr-rws">${TR_MEDALS.map(m=>`<div class="tr-rw ${best>=m.f?'on':m.k===nxk?'nx':'far'}"><span>${coinImg()}<b>×${m.c}</b></span>${m.bo?`<span><img src="art/ic_gift.webp" alt=""><b>×${m.bo}</b></span>`:''}${m.pk?`<span><img src="art/sb_pack.webp" alt=""><b>×${m.pk}</b></span>`:''}${m.gpk?`<span><img src="art/sb_gpack.webp" alt=""><b>×${m.gpk}</b></span>`:''}</div>`).join('')}</div></div>`}
function trScreen(){const N=trNow(),D=trData(),r=trRoot(),z=ZONES[N.zi],nx=TR_MEDALS.find(m=>D.best<m.f);
  r.className='tr-screen';
  r.innerHTML=`<div class="tr-top"><button class="x-btn tr-x" aria-label="close"></button><div class="tr-title"><img src="art/tr_trophy.webp" alt=""><b></b><small></small></div><div class="coin-pill">${coinImg()}<span></span></div></div>
    <div class="tr-body"><div class="tr-twist"><img class="w" alt=""><div class="tw"><img src="art/tr_tw_${N.tw}.webp" alt=""><div><small></small><b></b><p></p></div></div></div>
    <div class="tr-best"><span></span><b></b></div><div class="tr-prizes"><h4></h4>${trMedalRow(D.best)}<p class="tr-nx"></p></div></div>
    <div class="tr-acts"><button class="btn primary tr-play"><svg viewBox="0 0 24 24"><path d="M7 4.5 L19 12 L7 19.5 Z"/></svg><span></span></button><button class="btn green tr-share"><span></span></button></div>`;
  r.querySelector('.tr-x').innerHTML=XSVG;r.querySelector('.tr-x').onclick=()=>{sfx.click();closeTour()};
  r.querySelector('.tr-title b').textContent=t('tourTitle');r.querySelector('.tr-title small').textContent=trDays()<=1?t('trLeft1'):t('trLeft',{n:trDays()});r.querySelector('.coin-pill span').textContent=progress.coins;
  const th=r.querySelector('.tr-twist .w');th.src='art/'+(typeof artAlias==='function'?artAlias('w3b_'+z.id):'w3b_'+z.id)+'.webp';th.onerror=()=>{th.src='art/w3b_'+(z.base||z.id)+'.webp'};
  r.querySelector('.tr-twist small').textContent=t('trTwist')+' · '+t(z.key);r.querySelector('.tr-twist b').textContent=t('tw_'+N.tw);r.querySelector('.tr-twist p').textContent=t('twd_'+N.tw)+' · '+t('trHow');
  r.querySelector('.tr-best span').textContent=t('trBest');r.querySelector('.tr-best b').textContent=t('trFloorsN',{n:D.best});
  r.querySelector('.tr-prizes h4').textContent=t('trPrizes');
  r.querySelector('.tr-nx').textContent=nx?t('trNext',{n:nx.f-D.best,m:t('md_'+nx.k)}):t('trAllMedals');
  r.querySelector('.tr-play span').textContent=t('trPlay');r.querySelector('.tr-play').onclick=()=>{sfx.click();trStart()};
  r.querySelector('.tr-share span').textContent=D.best?t('trChallenge')+' · '+t('trFloorsN',{n:D.best}):t('trChallenge');r.querySelector('.tr-share').onclick=()=>{sfx.click();trShare(D.best)}}
function trShare(n){const url='https://sharliztower.com',txt=n?t('trShare',{n}):t('trInvite'); // the store app runs on localhost, and the Pages copy has every level open
  if(navigator.share){navigator.share({text:txt,url}).catch(()=>{});return}
  try{window.open('https://wa.me/?text='+encodeURIComponent(txt+' '+url),'_blank')}catch(e){}}
/* ---------- playing (mode 'tour') ---------- */
function trStart(direct){if(!direct&&busy)return;const N=trNow(),D=trData();D.tries++;saveProgress();if(TREL)TREL.hidden=true;
  TR={N,from:TR?TR.from:level,floors:0,newMd:[]};mode='tour';modeZi=N.zi;level=N.zi*LPZ+4;score=0;endless={floors:0,zoneAt:1e9,goal:0};duo=null;
  const run=()=>{startLevel(level);hearts=3;trHud(true);updateHud();
    const tb=document.getElementById('toast');tb.querySelector('small').textContent=t('tourTitle');tb.querySelector('strong').textContent=t('tw_'+N.tw);setTimeout(()=>{if(mode==='tour'&&typeof toast==='function')toast(t('twd_'+N.tw))},900)};if(direct)run();else go(run)}
let trBadge=null;
function trHud(on){if(!on&&trG)trG.hidden=true;if(!trBadge){trBadge=document.createElement('div');trBadge.id='trBadge';trBadge.innerHTML='<img alt=""><b></b>';(document.getElementById('hud')||document.body).appendChild(trBadge)}trBadge.hidden=!on;if(on&&TR){trBadge.querySelector('img').src='art/tr_tw_'+TR.N.tw+'.webp';trBadge.querySelector('b').textContent=t('tw_'+TR.N.tw)}}
let trG=null;
function trGauge(on){if(!trG){trG=document.createElement('div');trG.id='trGauge';trG.innerHTML=`<img class="top" src="art/tr_trophy.webp" alt=""><div class="tube"><i></i></div>${TR_MEDALS.map(m=>`<div class="mk m-${m.k}" style="bottom:${m.f/35*100}%"><img src="art/tr_medal_${m.k}.webp" alt=""><b>${m.f}</b></div>`).join('')}<em></em>`;(document.getElementById('hud')||document.body).appendChild(trG)}trG.hidden=!on}
{const _u=updateHud;updateHud=function(){_u.apply(this,arguments);if(mode!=='tour'||!TR){if(trG&&!trG.hidden)trG.hidden=true;return}trGauge(true);document.getElementById('gauge').hidden=true;const fl=Math.max(0,tower.length-1);
  trG.querySelector('.tube i').style.height=Math.min(1,fl/35)*100+'%';trG.querySelector('em').textContent=fl+'/35';{const nk=(TR_MEDALS.find(m=>fl<m.f)||{}).k;TR_MEDALS.forEach(m=>{const e=trG.querySelector('.m-'+m.k);e.classList.toggle('on',fl>=m.f);e.classList.toggle('nx',m.k===nk)})}}}
{const _ml=modeLanded;modeLanded=function(){if(mode!=='tour'||!TR)return _ml.apply(this,arguments);const fl=tower.length-1;TR.floors=Math.max(TR.floors,fl);endless.floors=TR.floors;
  const m=TR_MEDALS.find(m=>m.f===fl);if(m&&!TR.newMd.includes(m.k)&&!trData().got[m.k]){TR.newMd.push(m.k);const d=document.createElement('div');d.className='tr-pop';d.innerHTML=`<img src="art/tr_medal_${m.k}.webp" alt=""><b>${t('md_'+m.k)}!</b>`;document.body.appendChild(d);setTimeout(()=>d.remove(),1400);sfx.flourish(2);vib([20,40,20])}
  updateHud();return false}}
// twists
{const _hk=hatK;hatK=function(k,d=1){const v=_hk.apply(this,arguments);if(mode!=='tour'||!TR)return v;if(TR.N.tw==='fast'&&k==='spd')return v*1.25;if(TR.N.tw==='wind'&&k==='wind')return v*2;return v}}
{const _ss=spawnSwinger;spawnSwinger=function(){_ss.apply(this,arguments);if(mode==='tour'&&TR&&TR.N.tw==='gold'&&swinger&&!swinger.gold&&!swinger.kind&&tower.length>=2&&Math.random()<.22){swinger.color=GOLDC;swinger.gold=true}}}
{const _mo=modeOver;modeOver=function(won){if(mode!=='tour'||!TR)return _mo.apply(this,arguments);trEnd()}}
{const _sm=startMode;startMode=function(m){if(m==='tour'){trStart(true);return}return _sm.apply(this,arguments)}}
function trEnd(){TR.banked=1;const D=trData(),fl=TR.floors,nb=fl>D.best;if(nb)D.best=fl;const won=[];
  for(const m of TR_MEDALS){if(D.best>=m.f&&!D.got[m.k]){D.got[m.k]=1;wallet();progress.coins+=m.c;for(let i=0;i<m.bo;i++){const b=pick(['slow','laser','shield','heart']);progress.inv[b]=(progress.inv[b]||0)+1}if(m.pk&&typeof sbGive==='function')sbGive(m.pk);if(m.gpk&&typeof sbGive==='function')sbGive(m.gpk,1);won.push(m)}}
  saveProgress();trHud(false);const nx=TR_MEDALS.find(m=>D.best<m.f);
  if(TRQUIET){if(won.length){popupToast('+'+won.reduce((a,m)=>a+m.c,0));setTimeout(()=>sfx.coin(4),300)}return}
  showOverlay(()=>({title:nb?t('trNew'):fl>=D.best-3?t('trClose'):t('trNice'),big:true,
    extra:card=>{card.classList.add('tr-res');const big=document.createElement('div');big.className='tr-big';big.innerHTML=`<b>${fl}</b><span></span>`;big.querySelector('span').textContent=t('trFloorsN',{n:''}).trim();card.appendChild(big);
      const bs=document.createElement('div');bs.className='tr-best';bs.innerHTML='<span></span><b></b>';bs.querySelector('span').textContent=t('trBest');bs.querySelector('b').textContent=t('trFloorsN',{n:D.best});card.appendChild(bs);
      if(won.length){const m=won[won.length-1],w=document.createElement('div');w.className='tr-won';w.innerHTML=`<img src="art/tr_medal_${m.k}.webp" alt=""><p></p><div class="tr-rew"></div>`;w.querySelector('p').textContent=t('trReached',{m:t('md_'+m.k)});
        const rw=w.querySelector('.tr-rew');const c=won.reduce((a,m)=>a+m.c,0),bo=won.reduce((a,m)=>a+m.bo,0);rw.innerHTML=`<span class="bn-coins">${coinImg()}<b>+${c}</b></span>`+`<i class="tr-ok">✓ ${t('trGot')}</i>`+(bo?`<span class="bn-bo"><img src="art/ic_gift.webp" alt=""><em>×${bo}</em></span>`:'');card.appendChild(w)}
      const tk=document.createElement('div');tk.className='tr-res-bar';tk.innerHTML=`<div class="bar"><i style="width:${Math.min(100,D.best/35*100)}%"></i></div><img src="art/tr_medal_${(nx||TR_MEDALS[2]).k}.webp" alt=""><b>${D.best}/${(nx||TR_MEDALS[2]).f}</b>`;card.appendChild(tk);
      const p=document.createElement('p');p.className='tr-nx';p.textContent=nx?t('trNext',{n:nx.f-D.best,m:t('md_'+nx.k)}):t('trAllMedals');card.appendChild(p)},
    actions:[{label:t('trAgain'),icon:'restart',primary:true,fn:()=>{hideOverlay();trStart()}},{label:t('trChallenge'),color:'green',fn:()=>trShare(D.best)},{label:t('trBack'),icon:'map',fn:()=>{hideOverlay();trExit()}}]}));
  if(won.length)setTimeout(()=>sfx.coin(4),500)}
function trExit(){const L=TR?TR.from:level;TR=null;mode='levels';modeZi=null;level=L;trHud(false);go(()=>{toTitle();openTour()})}
{const _t=toTitle;toTitle=function(){if(mode==='tour'){mode='levels';modeZi=null;if(TR)level=TR.from;TR=null;trHud(false)}return _t.apply(this,arguments)}}
{const _o=openMap;openMap=function(){if(mode==='tour'){mode='levels';modeZi=null;if(TR)level=TR.from;TR=null;trHud(false)}return _o.apply(this,arguments)}}
{const _hu=showHud;showHud=function(on){const r=_hu.apply(this,arguments);if(!on)trHud(false);return r}}
/* entry points: top of the Modes card + a badge on the Modes button */
{const _om=openModes;openModes=function(){_om.apply(this,arguments);const box=document.querySelector('#card .modes');if(!box)return;const D=trData(),N=trNow();
  const b=document.createElement('button');b.className='mode-btn m-tour';b.innerHTML=`<img src="art/tr_trophy.webp" alt=""><span class="mt"><b></b><small></small></span>`;b.querySelector('b').textContent=t('tourTitle');
  b.querySelector('small').textContent=t('tw_'+N.tw)+' · '+t('trBest')+' '+D.best;b.onclick=openTour;box.prepend(b)}}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);const mb=document.getElementById('modesTitleBtn');if(mb){let bd=mb.querySelector('.tr-bd');if(!bd){bd=document.createElement('i');bd.className='badge tr-bd';bd.innerHTML='<img src="art/tr_trophy.webp" alt="">';mb.appendChild(bd)}const D=trData();bd.hidden=!progress.tut;bd.classList.toggle('done',!!D.got.g);bd.innerHTML=D.got.g?'✓':'<img src="art/tr_trophy.webp" alt="">'}return r}}
// bug hunt 4: Pause → Map / Restart threw the run away (the medal popup had already said 'Bronze!'). Bank the best + medals
// quietly first (no result card); Sky Tower keeps its best (no coins, those stay for finishing a run).
let TRQUIET=false;
function runBank(){try{
  if(mode==='tour'&&TR&&!TR.banked&&TR.floors>0&&state!=='over'){TRQUIET=true;try{trEnd()}finally{TRQUIET=false}}
  else if(mode==='endless'&&endless&&state!=='over'&&(endless.floors||0)>(progress.bestEndless||0)){progress.bestEndless=endless.floors;saveProgress()}}catch(e){}}
{const _o=openMap;openMap=function(){runBank();return _o.apply(this,arguments)}}
{const _t=toTitle;toTitle=function(){runBank();return _t.apply(this,arguments)}}
{const _s=startMode;startMode=function(m){if(m===mode)runBank();return _s.apply(this,arguments)}}
