/* ===== v58: illustrated sticker chapters (Tzach) =====
   Rare chapter = 18 STORY stickers (illustrated scenes, holo glow), earned by catching rare Sharliz on the rope.
   Boss chapter = 30 illustrated battle scenes (Sharliz vs that boss), holo glow. Worlds = illustrated postcard of each world. */
Object.assign(I18N.en,{pg_rare:'Sharliz stories',hint_rare:'Catch a rare Sharliz on the rope',stkVs:'Sharliz vs {b}',storyGot:'New story sticker!'});
Object.assign(I18N.he,{pg_rare:'סיפורי שארליז',hint_rare:'תפסו שארליז נדיר על החבל',stkVs:'שארליז נגד {b}',storyGot:'מדבקת סיפור חדשה!'});
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
function storySync(){try{const D=sbData();D.story=D.story||[];const al=progress.album||{};const caught=Object.values(al).reduce((a,v)=>a+(+v||0),0);const target=Math.min(STORY.length,caught);let added=0;
  while(D.story.length<target){const left=STORY.map(s=>s[0]).filter(id=>!D.story.includes(id));if(!left.length)break;D.story.push(pick(left));added++}if(added)saveProgress();return added}catch(e){return 0}}
{const P=STK_PAGES.find(p=>p.id==='rare');if(P)P.items=()=>{const D=sbData(),L=lang==='he'?1:0,own=D.story||[];return STORY.map(s=>({id:'story:'+s[0],n:own.includes(s[0])?1:0,src:'art/stk_'+s[0]+'.webp',name:L?s[2]:s[1],line:L?s[4]:s[3],rar:'h',card:1}))}}
{const P=STK_PAGES.find(p=>p.id==='boss');if(P){const _it=P.items;P.items=()=>_it().map(it=>{const z=it.id.slice(5);return Object.assign(it,{src:'art/stk_b_'+z+'.webp',rar:'h',card:1,name:t('stkVs',{b:it.name})})})}}
/* worlds: an illustrated postcard of each world (art/stk_w_<sid>.webp) */
{const P=STK_PAGES.find(p=>p.id==='world');if(P){const _it=P.items;P.items=()=>{const it=_it();return it.map((x,i)=>{const z=ZONES[i];return Object.assign(x,{src:'art/stk_w_'+(z.sid||z.id)+'.webp',img:null,round:false,card:1})})}}}
{const _o=openAlbum;openAlbum=function(){storySync();return _o.apply(this,arguments)}}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);try{if(storySync())stkBadge()}catch(e){}return r}}
/* buddies: an illustrated scene of the buddy with Sharliz (paid buddies glow) */
{const P=STK_PAGES.find(p=>p.id==='buddy');if(P){const _it=P.items;P.items=()=>_it().map(it=>{const id=it.id.slice(6);return Object.assign(it,{src:'art/stk_p_'+id+'.webp',img:null,card:1,rar:WPET[id]&&WPET[id].real?'h':'c'})})}}
/* bug hunt 4: the second tap of a double-tap landed on the card/screen that had just opened (Next → bought a booster on the
   pre-level card; Arcade → started 'Bonk' and used a coin play). Real taps on a freshly opened card are ignored for 350 ms. */
let TAPGUARD=0;
{const _so=showOverlay;showOverlay=function(){TAPGUARD=performance.now();return _so.apply(this,arguments)}}
for(const f of ['openArcade','openTour','openEvent','openPass','openNest','openTrophy']){const _f=window[f];if(typeof _f==='function')window[f]=function(){TAPGUARD=performance.now();return _f.apply(this,arguments)}}
document.addEventListener('click',e=>{if(e.isTrusted&&performance.now()-TAPGUARD<350&&e.target&&e.target.closest&&e.target.closest('#overlay,#arcade,#tour,#evhub,#passScr,#nestScr,#achScr')){e.stopPropagation();e.preventDefault()}},true);
/* nightly check Oct 8: Japanese/Chinese/Korean have no spaces, so a big title could break anywhere and leave one character
   alone on the 2nd line ('マイヒーロ / ー', the lobby 'プレ / イ'). In those languages a big title that wraps is shrunk step by
   step until it fits on one line (down to 60%); if it still can't, it keeps its size and wraps as before. It never stops
   wrapping, so nothing can be pushed out of its card. Runs on whatever the game adds or shows, one frame later. */
{const CJK=/^(ja|zh|ko)/,seen=new WeakSet;let q=new Set,raf=0;
 const lines=rg=>new Set([...rg.getClientRects()].map(r=>Math.round(r.top))).size;
 const fit=e=>{if(seen.has(e)||!e.isConnected)return;const cs=getComputedStyle(e),fs=parseFloat(cs.fontSize);if(fs<20||cs.display==='none')return;
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
