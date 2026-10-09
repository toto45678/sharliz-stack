/* ===== v58: illustrated sticker chapters (Tzach) =====
   Rare chapter = 18 STORY stickers (illustrated scenes, holo glow), earned by catching rare Sharliz on the rope.
   Boss chapter = 30 illustrated battle scenes (Sharliz vs that boss), holo glow. Worlds = illustrated postcard of each world. */
Object.assign(I18N.en,{pg_rare:'Sharliz stories',hint_rare:'Catch a rare Sharliz on the rope',stkVs:'Sharliz vs {b}',storyGot:'New story sticker!',storyProg:'Story sticker {a}/{b}',storyNext:'Next story {a}/{b}'});
Object.assign(I18N.he,{pg_rare:'סיפורי שארליז',hint_rare:'תפסו שארליז נדיר על החבל',stkVs:'שארליז נגד {b}',storyGot:'מדבקת סיפור חדשה!',storyProg:'מדבקת סיפור {a}/{b}',storyNext:'לסיפור הבא {a}/{b}'});
const STORY=[
 ['st01','Flower picnic','פיקניק בפרחים','Sandwiches taste better with friends.','כריכים טעימים יותר עם חברים.'],
 ['st02','Sandcastle tower','מגדל חול','The tallest sandcastle on the beach!','ארמון החול הכי גבוה בחוף!'],
 ['st03','To the moon','עד הירח','Stack high enough and you reach the moon.','אם בונים מספיק גבוה — מגיעים לירח.'],
 ['st04','Balloon ride','טיסה בכדור פורח','The view from up here is the best.','הנוף מכאן הכי יפה.'],
 ['st05','Birthday party','מסיבת יום הולדת','Make a wish!','תבקשו משאלה!'],
 ['st06','Snowball fight','מלחמת כדורי שלג','Nobody is safe in the snow village.','אף אחד לא מוגן בכפר השלג.'],
 ['st07','Under the sea','מתחת לים','Blub blub — hello fishies!','בלוב בלוב — שלום דגים!'],
 ['st08','Campfire night','מדורה בלילה','Stories under a million stars.','סיפורים מתחת למיליון כוכבים.'],
 ['st09','Lift-off!','המראה!','3… 2… 1… Sharliz in space!','3… 2… 1… שארליז בחלל!'],
 ['st10','Roller coaster','רכבת הרים','Hold on tight! (with what?)','תחזיקו חזק! (במה?)'],
 ['st11','Rainbow slide','מגלשת קשת','The fastest way down a rainbow.','הדרך הכי מהירה לרדת מקשת.'],
 ['st12','Sunset fishing','דייג בשקיעה','Something is pulling the line…','משהו מושך בחכה…'],
 ['st13','Jungle river','נהר בג׳ונגל','A leaf boat adventure.','הרפתקה בסירת עלה.'],
 ['st14','Rock concert','הופעת רוק','The crowd sings every word!','הקהל שר כל מילה!'],
 ['st15','Rainy day','יום גשום','Puddles are for jumping.','שלוליות זה בשביל לקפוץ.'],
 ['st16','Family photo','תמונה משפחתית','Everybody say “Sharliz!”','כולם להגיד „שארליז!”'],
 ['st17','Dragon flight','מעוף הדרקון','Over the castle and far away.','מעל הטירה והרחק משם.'],
 ['st18','Treasure cave','מערת האוצר','It glows… it\'s ours!','זה זוהר… זה שלנו!']];
/* story cards (Tzach, Oct 7: 'too fast, I got them all in a few hours'): the first comes with the first rare Sharliz you catch,
   then each next card needs more rare catches: 3, 4, 5 … up to 12 (all 18 ≈ 160 rare catches instead of 18).
   D.sc = rare catches already counted, D.sp = catches toward the next card. Cards earned under the old pace are kept. */
const storyNeed=i=>i?Math.min(2+i,12):1;
function rareCaught(){const al=progress.album||{};return Object.values(al).reduce((a,v)=>a+(+v||0),0)}
function storySync(){try{const D=sbData();D.story=D.story||[];const caught=rareCaught();let added=0;const add=()=>{const left=STORY.map(s=>s[0]).filter(id=>!D.story.includes(id));if(!left.length)return false;D.story.push(pick(left));added++;return true};
  if(D.sc==null){const target=Math.min(STORY.length,caught);while(D.story.length<target&&add());D.sc=caught;D.sp=0;saveProgress();return added} // old saves: finish the old pace once, then switch
  let ch=false;if(caught>D.sc){D.sp=(D.sp||0)+caught-D.sc;D.sc=caught;ch=true}
  while(D.story.length<STORY.length&&D.sp>=storyNeed(D.story.length)){D.sp-=storyNeed(D.story.length);add()}
  if(D.story.length>=STORY.length&&D.sp){D.sp=0;ch=true}if(ch||added)saveProgress();return added}catch(e){return 0}}
/* right after a rare Sharliz lands (build.py patch in the landing code): progress toast, or the new card */
function storyHit(){try{const D=sbData();D.story=D.story||[];if(D.story.length>=STORY.length)return;if(storySync()){toast(t('storyGot'));try{stkBadge()}catch(e){}}else toast(t('storyProg',{a:D.sp,b:storyNeed(D.story.length)}))}catch(e){}}
function storyLeft(){const D=sbData(),own=(D.story||[]).length;return own>=STORY.length?null:{a:D.sp||0,b:storyNeed(own)}}
{const P=STK_PAGES.find(p=>p.id==='rare');if(P)P.items=()=>{const D=sbData(),L=lang==='he'?1:0,own=D.story||[];return STORY.map(s=>({id:'story:'+s[0],n:own.includes(s[0])?1:0,src:'art/stk_'+s[0]+'.webp',name:L?s[2]:s[1],line:L?s[4]:s[3],rar:'h',card:1,hint:(q=>q?t('hint_rare')+' · '+t('storyNext',q):'')(storyLeft())}))}}
{const P=STK_PAGES.find(p=>p.id==='boss');if(P){const _it=P.items;P.items=()=>_it().map(it=>{const z=it.id.slice(5);return Object.assign(it,{src:'art/stk_b_'+z+'.webp',rar:'h',card:1,name:t('stkVs',{b:it.name})})})}}
/* worlds: an illustrated postcard of each world (art/stk_w_<sid>.webp) */
{const P=STK_PAGES.find(p=>p.id==='world');if(P){const _it=P.items;P.items=()=>{const it=_it();return it.map((x,i)=>{const z=ZONES[i];return Object.assign(x,{src:'art/stk_w_'+(z.sid||z.id)+'.webp',img:null,round:false,card:1})})}}}
{const _o=openAlbum;openAlbum=function(){storySync();return _o.apply(this,arguments)}}
{const _pv=sbPageView;sbPageView=function(){const r=_pv.apply(this,arguments);try{const P=sbChapters()[SB.ch],q=storyLeft();if(P.id==='rare'&&q&&(SB.sec===undefined||SB.sec==='short')){const sm=SB.el.querySelector('.sb-head small');sm.textContent=t('storyNext',q);sm.classList.add('sb-snext')}}catch(e){}return r}}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);try{if(storySync())stkBadge()}catch(e){}return r}}
/* buddies: an illustrated scene of the buddy with Sharliz (paid buddies glow) */
{const P=STK_PAGES.find(p=>p.id==='buddy');if(P){const _it=P.items;P.items=()=>_it().map(it=>{const id=it.id.slice(6);return Object.assign(it,{src:'art/stk_p_'+id+'.webp',img:null,card:1,rar:WPET[id]&&WPET[id].real?'h':'c'})})}}
/* bug hunt 4: the second tap of a double-tap landed on the card/screen that had just opened (Next → bought a booster on the
   pre-level card; Arcade → started 'Bonk' and used a coin play). Real taps on a freshly opened card are ignored for 350 ms. */
let TAPGUARD=0;
{const _so=showOverlay;showOverlay=function(){TAPGUARD=performance.now();return _so.apply(this,arguments)}}
for(const f of ['openArcade','openTour','openEvent','openPass','openNest','openTrophy']){const _f=window[f];if(typeof _f==='function')window[f]=function(){TAPGUARD=performance.now();return _f.apply(this,arguments)}}
document.addEventListener('click',e=>{if(e.isTrusted&&performance.now()-TAPGUARD<350&&e.target&&e.target.closest&&e.target.closest('#overlay,#arcade,#tour,#evhub,#passScr,#nestScr,#achScr,#houseScr')){e.stopPropagation();e.preventDefault()}},true);
/* nightly check Oct 8: Japanese/Chinese/Korean have no spaces, so a big title could break anywhere and leave one character
   alone on the 2nd line ('マイヒーロ / ー', the lobby 'プレ / イ'). In those languages a big title that wraps is shrunk step by
   step until it fits on one line (down to 60%); if it still can't, it keeps its size and wraps as before. It never stops
   wrapping, so nothing can be pushed out of its card. Runs on whatever the game adds or shows, one frame later. */
{const CJK=/^(ja|zh|ko)/,seen=new WeakSet;let q=new Set,raf=0;
 const lines=rg=>new Set([...rg.getClientRects()].map(r=>Math.round(r.top))).size;
 const fit=e=>{if(seen.has(e)||!e.isConnected)return;const cs=getComputedStyle(e),fs=parseFloat(cs.fontSize);if((fs<20&&!e.matches('.shop-tabs button'))||cs.display==='none')return;
   for(const n of e.childNodes){if(n.nodeType!==3||n.textContent.trim().length<2)continue;const rg=document.createRange();rg.selectNodeContents(n);
     if(!rg.getClientRects().length)return;// not shown yet: try again when it shows
     seen.add(e);if(lines(rg)<2)return;
     for(let f=fs*.92;f>=fs*.6;f*=.92){e.style.fontSize=f+'px';if(lines(rg)<2)return}
     e.style.fontSize='';return}};
 const run=()=>{raf=0;if(!CJK.test(document.documentElement.lang)){q.clear();return}const roots=[...q];q.clear();
   for(const r of roots){if(!(r instanceof Element))continue;fit(r);r.querySelectorAll('*').forEach(fit)}};
 new MutationObserver(ms=>{for(const m of ms)q.add(m.target);if(!raf)raf=requestAnimationFrame(run)})
   .observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
 q.add(document.body);raf=requestAnimationFrame(run)}

/* ---------- bug hunt 5 (Oct 9) ---------- */
// result card: the XP / egg / sticker-pack strips are added inside the scrolling card body after the card opens. On a phone they
// landed below its visible part (the scrollbar is hidden), so nobody saw them. The body now glides to the newest strip, and its
// bottom edge fades while there is more below.
{const card=document.getElementById('card');
 const more=b=>b.classList.toggle('more',b.scrollHeight-b.clientHeight-b.scrollTop>6);
 const hook=b=>{if(b._more)return;b._more=1;b.addEventListener('scroll',()=>more(b),{passive:true});b.addEventListener('load',()=>more(b),true)};
 const reveal=el=>setTimeout(()=>{const b=el.isConnected&&el.parentElement;if(!b||!b.classList.contains('card-body'))return;const B=b.getBoundingClientRect(),E=el.getBoundingClientRect();
   if(E.bottom>B.bottom-2)b.scrollTo({top:b.scrollTop+E.bottom-B.bottom+8,behavior:reduceMotion?'auto':'smooth'});more(b)},650);
 if(card)new MutationObserver(ms=>{const b=card.querySelector('.card-body');if(b){hook(b);more(b)}
   for(const m of ms)if(m.target===b)for(const n of m.addedNodes)if(n.nodeType===1&&/-strip\b/.test(n.className))reveal(n)}).observe(card,{childList:true,subtree:true})}
// in-game HUD on a 375 px phone: with a 3-digit level and a 4-5 digit score the pause button was pushed off the screen (the
// middle plaque had a fixed half of the row on each side). The plaque now takes what is left and shrinks its text to fit;
// if even that is too small the word 'Level' is dropped and only the number stays.
{const fitPlaque=()=>{const p=document.querySelector('.level-plaque');if(!p||!p.offsetParent)return;const w=p.querySelector('[data-i18n]');
   p.style.fontSize='';if(w)w.style.display='';if(p.scrollWidth<=p.clientWidth+1)return;
   let fs=parseFloat(getComputedStyle(p).fontSize);const min=fs*.72;while(p.scrollWidth>p.clientWidth+1&&fs>min){fs-=.5;p.style.fontSize=fs+'px'}
   if(p.scrollWidth>p.clientWidth+1&&w&&w.textContent){w.style.display='none';p.style.fontSize=''}};
 let key='';const _u=updateHud;updateHud=function(){const r=_u.apply(this,arguments);try{const p=document.querySelector('.level-plaque'),s=document.getElementById('score'),k=(p?p.textContent:'')+'|'+(s?s.textContent.length:0)+'|'+innerWidth;
   if(k!==key){key=k;fitPlaque()}}catch(e){}return r};
 addEventListener('resize',()=>{key=''})}
// hearts in the HUD: a level that starts with fewer than 3 hearts (duo = 1, ballerina / astronaut / king = 2) showed black
// 'lost' hearts from the very first second. The row now has as many hearts as the level started with (more if a booster adds one).
let HUDH=0;
{const _sl=startLevel;startLevel=function(){HUDH=0;const r=_sl.apply(this,arguments);queueMicrotask(()=>{HUDH=Math.max(1,hearts);try{updateHud()}catch(e){}});return r}}
{const _u=updateHud;updateHud=function(){const r=_u.apply(this,arguments);try{if(HUDH){if(hearts>HUDH)HUDH=hearts;const n=Math.max(hearts,HUDH),el=document.getElementById('hearts');
   if(el&&el.children.length!==n)el.innerHTML=Array.from({length:n},(_,i)=>heartSvg(i<hearts)).join('')}}catch(e){}return r}}
// the Language buttons reload the page: in the Pause menu that threw the running level away without a word. Language is
// changed from the home screen's Settings only.
{const _sr=settingsRows;settingsRows=function(card){const r=_sr.apply(this,arguments);try{if(state==='paused')card.querySelectorAll('.opt-row').forEach(rw=>{const l=rw.firstElementChild;if(l&&l.textContent===t('language')&&rw.querySelector('.toggle'))rw.remove()})}catch(e){}return r}}
// a trophy hat that makes you immune to this stage's mechanic still showed that mechanic's intro card (and marked it as
// seen, so without the hat the real intro never came). The card is skipped and stays unseen.
{const _mi=maybeIntro;maybeIntro=function(){let p=null;try{p=hzPrimary()}catch(e){}
  if(!p||typeof hatImm!=='function'||!MECH[p]||!hatImm(p)||seenKey(p))return _mi.apply(this,arguments);
  progress.seen[p]=1;let r;try{r=_mi.apply(this,arguments)}finally{delete progress.seen[p];saveProgress()}return r}}
// lobby pop-ups opened on top of each other (level-up + egg over the daily gift, starter offer under a level-up, buddy guide over a
// level-up): each one checked a different list. They now all wait for the others, and when one closes the lobby looks again.
{const POPS='.lvup,.egg-pop,.gd-rev,.bg-guide,.hs-pop';
 const _lo=lobbyLayerOpen;lobbyLayerOpen=function(){return !!document.querySelector(POPS)||_lo.apply(this,arguments)};
 const busy=()=>!document.getElementById('overlay').hidden||!!document.querySelector(POPS+',.pay-modal,#payModal');
 const _lu=lvUpLater;lvUpLater=function(){if(state==='title'&&progress.lvRew&&!document.querySelector('.lvup')&&busy()&&!lobbyScreenOpen())return;return _lu.apply(this,arguments)};
 // a full-screen layer (trophy room, album, nest...) shows its level-up right away: that is the reward for what was just tapped there
 function lobbyScreenOpen(){return ['arcade','tour','evhub','passScr','nestScr','achScr','houseScr','sbook'].some(id=>{const e=document.getElementById(id);return e&&!e.hidden})||W3.on}
 const _en=eggNotify;eggNotify=function(){if(EGGQ.length&&state==='title'&&!document.querySelector('.egg-pop')&&(busy()||document.querySelector('.lvup'))){setTimeout(eggNotify,800);return}return _en.apply(this,arguments)};
 let tm=0;new MutationObserver(ms=>{if(state!=='title')return;for(const m of ms)for(const n of m.removedNodes)if(n.nodeType===1&&n.matches&&n.matches(POPS)){clearTimeout(tm);tm=setTimeout(()=>{if(state==='title'&&!busy())updateLobby()},300);return}})
   .observe(document.body,{childList:true,subtree:true})}
// one day / one cookie: singular wording where a count can be 1
{const ONE={dlStreak:1,miniDays:1,psLeft:1};const _t=t;t=function(k,v){if(v&&ONE[k]&&+v.n===1){const k1=k+'1';if(I18N[lang]&&I18N[lang][k1]!=null)return _t.call(this,k1,v)}return _t.apply(this,arguments)}}
