/* ===== v59: BUDDY GUIDE — Tzach: kids of 9 who just started must understand buddies. When the player owns a buddy for the
   first time (bought, hatched or paid; also once for players who already own one), a 4-page picture guide explains: your buddy
   flies with you, it has a power that works only while it's with you, how to switch it (Style tab → Buddy slot), and that eggs
   hatch new buddies and cookies evolve them. Reopen from the "?" in the nest and in My hero's buddy slot. progress.budGuide=1 */
Object.assign(I18N.en,{bgT1:'Meet your buddy!',bgS1:'{b} flies next to you in every level and in the lobby.',bgT2:'Buddies have powers',bgS2:'The power works only while your buddy is with you. Every buddy has a different power!',
  bgPw:'Power of {b}',bgT3:'Switch buddies anytime',bgS3:'Tap “{a}” at the bottom, then the “{b}” slot, and pick a buddy.',bgT4:'Collect and grow',
  bgS4a:'Wins hatch the eggs in your nest. New buddies come out!',bgS4b:'Cookies grow your buddy up to 3 stars. Every star gives more coins.',bgNext:'Next',bgBack:'Back',bgGo:'Got it!',bgHelp:'What are buddies?'});
Object.assign(I18N.he,{bgT1:'זה החבר שלך!',bgS1:'{b} עף לידך בכל שלב ובלובי.',bgT2:'לכל חבר יש כוח',bgS2:'הכוח עובד רק כשהחבר איתך. לכל חבר כוח אחר!',
  bgPw:'הכוח של {b}',bgT3:'מחליפים חבר מתי שרוצים',bgS3:'לוחצים על "{a}" למטה, אחר כך על המשבצת "{b}", ובוחרים חבר.',bgT4:'אוספים ומגדלים',
  bgS4a:'ניצחונות מבקיעים את הביצים בקן, ומהן יוצאים חברים חדשים!',bgS4b:'עוגיות מגדלות את החבר עד 3 כוכבים, וכל כוכב נותן עוד מטבעות.',bgNext:'הבא',bgBack:'חזרה',bgGo:'הבנתי!',bgHelp:'מה זה חברים?'});
function budOwnedList(){return Object.keys(WPET).filter(k=>k!=='none'&&(WPET[k].p||WPET[k].real)&&wOwned('pet',k))}
function budArt(id){return ['bee','chick','cyborg','dino','dragon','ghost','mini','slime','star','unicorn'].includes(id)||(typeof STK_BUD_ART!=='undefined'&&STK_BUD_ART.includes(id))?'art/stk_p_'+id+'.webp':null}
function openBudGuide(id){if(document.querySelector('.bg-guide'))return;id=id||(lookNow().pet!=='none'&&wOwned('pet',lookNow().pet)?lookNow().pet:budOwnedList()[0]);
  progress.budGuide=1;saveProgress();const name=id?wName('pet',id):'',pk=id&&PERKS[id];let pg=0;
  const m=document.createElement('div');m.className='egg-pop bg-guide';m.innerHTML='<div class="bg-c"><div class="rays"></div><div class="bg-pic"></div><h3></h3><div class="bg-txt"></div><div class="bg-dots"></div><div class="bg-bt"></div></div>';
  document.body.appendChild(m);sfx.click();
  const pic=m.querySelector('.bg-pic'),h=m.querySelector('h3'),tx=m.querySelector('.bg-txt'),dots=m.querySelector('.bg-dots'),bt=m.querySelector('.bg-bt');
  const P=[
    ()=>{const a=id&&budArt(id);pic.innerHTML=a?`<img class="bg-card" src="${a}" alt="">`:'<img class="bg-th" alt="">';if(!a&&id)try{pic.querySelector('img').src=wThumb('pet',id)}catch(e){}
      h.textContent=t('bgT1');tx.innerHTML='<p></p>';tx.querySelector('p').textContent=t('bgS1',{b:name})},
    ()=>{pic.innerHTML='<div class="bg-pw"><img class="bg-th" alt=""><span class="bg-bolt">⚡</span></div>';try{pic.querySelector('img').src=wThumb('pet',id)}catch(e){}
      h.textContent=t('bgT2');tx.innerHTML='<div class="bg-chip"><small></small><b></b></div><p></p>';tx.querySelector('small').textContent=t('bgPw',{b:name});tx.querySelector('b').textContent=pk?t('pk_'+pk):'';tx.querySelector('p').textContent=t('bgS2')},
    ()=>{pic.innerHTML=`<div class="bg-steps"><span class="bg-tab"><img src="art/ic_hats.webp" alt=""><small></small></span><span class="bg-ar">${document.documentElement.dir==='rtl'?'←':'→'}</span><span class="bg-slot"><img alt=""><small></small></span></div>`;
      pic.querySelector('.bg-tab small').textContent=t('wardrobeShort');pic.querySelector('.bg-slot small').textContent=t('sl_pet');try{pic.querySelector('.bg-slot img').src=wThumb('pet',id)}catch(e){}
      h.textContent=t('bgT3');tx.innerHTML='<p></p>';tx.querySelector('p').textContent=t('bgS3',{a:t('wardrobeShort'),b:t('sl_pet')})},
    ()=>{pic.innerHTML='<div class="bg-grow"><span><img src="art/egg_c.webp" alt=""></span><span><img src="art/ns_cookie.webp" alt=""><i class="sts"><em class="on">★</em><em class="on">★</em><em class="on">★</em></i></span></div>';
      h.textContent=t('bgT4');tx.innerHTML='<p class="egg"></p><p class="ck"></p>';tx.querySelector('.egg').textContent=t('bgS4a');tx.querySelector('.ck').textContent=t('bgS4b')}];
  const draw=()=>{P[pg]();m.querySelector('.bg-c').classList.remove('in');void m.offsetWidth;m.querySelector('.bg-c').classList.add('in');
    dots.innerHTML=P.map((_,i)=>`<i class="${i===pg?'on':''}"></i>`).join('');bt.innerHTML='';
    if(pg>0){const b=document.createElement('button');b.className='btn';b.innerHTML='<span></span>';b.querySelector('span').textContent=t('bgBack');b.onclick=()=>{sfx.click();pg--;draw()};bt.appendChild(b)}
    const n=document.createElement('button');n.className='btn primary';n.innerHTML='<span></span>';n.querySelector('span').textContent=pg<P.length-1?t('bgNext'):t('bgGo');
    n.onclick=()=>{sfx.click();if(pg<P.length-1){pg++;draw()}else m.remove()};bt.appendChild(n)};
  draw()}
// the daily gift goes first (it pops once a day when the lobby is idle); it also never pops over the guide
const dlPending=()=>typeof dlState==='function'&&!dlState().claimed&&progress.unlocked>=2&&dlShownOn!==dlDate(0);
{const _lo=lobbyLayerOpen;lobbyLayerOpen=function(){return !!document.querySelector('.bg-guide')||_lo()}}
function budGuideMaybe(id){if(progress.budGuide||!budOwnedList().length)return;setTimeout(()=>{if(progress.budGuide||document.querySelector('.egg-pop,.bg-guide')||(!W3.on&&dlPending()))return;
  const ov=document.getElementById('overlay');if(state!=='title'||(ov&&!ov.hidden&&!W3.on))return;openBudGuide(id)},1200)}
/* triggers: back in the lobby, after buying/wearing in My hero, after a hatch (nest re-renders when the hatch popup closes) */
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);if(state==='title')budGuideMaybe();return r}}
{const _nr=nestRender;nestRender=function(){const r=_nr.apply(this,arguments);try{const h=NEL.querySelector('.ns-h');if(h&&!h.querySelector('.bg-help')){const q=document.createElement('button');q.className='bg-help';q.textContent='?';q.setAttribute('aria-label',t('bgHelp'));q.onclick=()=>openBudGuide();h.appendChild(q)}}catch(e){}
  budGuideMaybe();return r}}
{const _rw=renderWardrobe;renderWardrobe=function(){const r=_rw.apply(this,arguments);try{if(W3.cat==='pet'||(W3.sel&&W3.sel.cat==='pet'))budGuideMaybe(W3.sel&&W3.sel.cat==='pet'&&wOwned('pet',W3.sel.id)?W3.sel.id:null)}catch(e){}return r}}
