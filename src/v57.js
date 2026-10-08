/* ===== v57: STICKER ALBUM 2.0 — a real collectible sticker book (design: ChatGPT, design/stickers/) =====
   Cover → chapter pages of 9 numbered slots (die-cut stickers, holo foil for rare/holo), tap a sticker → zoom with tilt + shine.
   New chapter "Sharliz": 24 illustrated stickers that only come from STICKER PACKS (3 stickers each; common/rare/holo).
   Packs: every 3 won levels, the first win over each boss, or 150 coins. Duplicates → coins. A full chapter → a big reward. */
Object.assign(I18N.en,{sbOpen:'Open',sbBack:'Back',sbPacks:'Packs: {n}',sbNext:'Next pack {n}/3',sbHow:'Packs come from wins, bosses, the daily gift, weekly missions, level-ups, the tournament, the Pass and events',psPack:'Sticker pack',dlPack:'+ pack',sbOpenPack:'Opening a pack!',sbOpenSub:'Which stickers are inside?',sbTap:'Tap to continue',sbTapPack:'Tap the pack!',sbNew:'New!',sbMore:'Open another ({n})',sbToBook:'To the album',sbAll:'Open all ({n})',sbOpenMany:'Opening {n} packs!',sbNewN:'{n} new stickers!',sbGold:'Golden pack',sbGoldGot:'+1 golden sticker pack!',sbGoldOpen:'Golden pack!',sbGoldSub:'A holo sticker inside for sure!',sbHowG:'Golden packs: the gold chest in the bonus stage, a tournament gold medal and day 7 of the daily gift',
  sbRar_c:'Common',sbRar_r:'Rare',sbRar_h:'Holo',sbHave:'You have {n}',sbNone:'Not found yet',sbDone:'Page complete!',sbClaim:'Collect',sbGot:'Collected',sbPackGot:'+1 sticker pack!',sbPackSub:'Open it in the sticker album',sbNoCoins:'Not enough coins',
  sbHow_shz:'Comes from sticker packs',sbCover:'Collect · Discover · Complete!',ch_shz:'Sharliz',sbPage:'Page {a}/{b}'});
Object.assign(I18N.he,{sbOpen:'פתחו',sbBack:'חזרה',sbPacks:'שקיות: {n}',sbNext:'שקית הבאה {n}/3',sbHow:'שקיות מקבלים מניצחונות, בוסים, המתנה היומית, משימות שבועיות, עליית רמה, הטורניר, ה-Pass ואירועים',psPack:'שקית מדבקות',dlPack:'+ שקית',sbOpenPack:'פותחים שקית!',sbOpenSub:'איזה מדבקות מחכות בפנים?',sbTap:'הקישו להמשיך',sbTapPack:'הקישו על השקית!',sbNew:'חדש!',sbMore:'פתחו עוד ({n})',sbToBook:'חזרה לאלבום',sbAll:'פתחו הכל ({n})',sbOpenMany:'פותחים {n} שקיות!',sbNewN:'{n} מדבקות חדשות!',sbGold:'שקית זהב',sbGoldGot:'+1 שקית מדבקות זהב!',sbGoldOpen:'שקית זהב!',sbGoldSub:'בטוח יש בפנים מדבקת הולוגרמה!',sbHowG:'שקיות זהב: תיבת הזהב בשלב הבונוס, מדליית זהב בטורניר ויום 7 במתנה היומית',
  sbRar_c:'רגילה',sbRar_r:'נדירה',sbRar_h:'הולוגרמה',sbHave:'יש לך {n}',sbNone:'עוד לא נמצאה',sbDone:'העמוד מלא!',sbClaim:'אסוף',sbGot:'נאסף',sbPackGot:'+1 שקית מדבקות!',sbPackSub:'פותחים אותה באלבום המדבקות',sbNoCoins:'אין מספיק מטבעות',
  sbHow_shz:'מגיעה בשקיות מדבקות',sbCover:'אספו · גלו · השלימו!',ch_shz:'שארליז',sbPage:'עמוד {a}/{b}'});
/* the 24 Sharliz stickers: id, rarity, names, a fun line */
const SHZ=[
 ['s01','c','Hi there!','שלום שלום!','The classic. Every collection starts here.','הקלאסית. כל אוסף מתחיל כאן.'],
 ['s02','c','Too cool','מגניב מדי','Sunglasses on, even at night.','משקפי שמש, גם בלילה.'],
 ['s03','c','Dino onesie','פיג׳מת דינו','Roar! (a very small roar)','גרררר! (גרררר קטן)'],
 ['s04','c','DJ Sharliz','די־ג׳יי שארליז','Drops the beat, never the tower.','מוריד ביטים, לא מגדלים.'],
 ['s05','c','Space walk','הליכת חלל','One small hop for Sharliz.','קפיצה קטנה לשארליז.'],
 ['s06','c','Captain Sharliz','קפטן שארליז','Arrr, where is the treasure?','אררר, איפה האוצר?'],
 ['s07','c','Chef','השף','Today\'s special: jelly tower.','המנה של היום: מגדל ג׳לי.'],
 ['s08','c','Surf\'s up','גלישה','Rides every wave of the level.','גולשת על כל גל.'],
 ['s09','c','Sleepy','מנומנמת','Five more minutes...','עוד חמש דקות...'],
 ['s10','c','Skater','סקייטרית','Kickflip onto the tower!','קיקפליפ על המגדל!'],
 ['s11','c','Ice cream','גלידה','Three scoops, zero drops.','שלושה כדורים, אפס נפילות.'],
 ['s12','c','Header king','מלך הנגיחות','Balances the ball all day long.','מאזן את הכדור כל היום.'],
 ['s13','c','Detective','הבלשית','Who knocked the tower over?','מי הפיל את המגדל?'],
 ['s14','c','Ninja','נינג׳ה','You did not see this sticker.','לא ראיתם את המדבקה הזאת.'],
 ['s15','r','Wizard','הקוסמת','Abracadabra — perfect landing!','אברקדברה — נחיתה מושלמת!'],
 ['s16','r','Super Sharliz','סופר שארליז','Faster than a falling block.','מהירה מקוביה נופלת.'],
 ['s17','r','Mermaid','בת ים','Builds towers under the sea.','בונה מגדלים מתחת לים.'],
 ['s18','r','Robo-Sharliz','רובו־שארליז','Beep boop. Stack. Repeat.','ביפ בופ. לערום. שוב.'],
 ['s19','r','Rock star','כוכבת רוק','The crowd goes wild!','הקהל משתגע!'],
 ['s20','r','Boo!','בוו!','A friendly ghost costume.','תחפושת רוח חמודה.'],
 ['s21','h','Sharliz Queen','שארליז המלכה','Small, sweet and changing the world!','קטנה, מתוקה ומשנה את העולם!'],
 ['s22','h','Golden Sharliz','שארליז הזהב','Shines brighter than every coin.','נוצצת יותר מכל מטבע.'],
 ['s23','h','Galaxy Sharliz','שארליז הגלקסיה','Made of stars. Literally.','עשויה מכוכבים. ממש.'],
 ['s24','h','Rainbow Sharliz','שארליז הקשת','Every colour at once!','כל הצבעים ביחד!']];
const SB_REW={shz:[1500,120],rare:[500,60],boss:[2000,150],world:[1000,100],buddy:[800,80],hat:[1500,120],special:[500,60]};
function sbData(){const D=progress.stkp=progress.stkp||{};D.packs=D.packs||0;D.gpacks=D.gpacks||0;D.w=D.w||0;D.got=D.got||{};D.done=D.done||{};D.boss=D.boss||{};
  if(!D.v3){D.v3=1;if(D.done.shz){D.done['shz:classic']=1;delete D.done.shz}if(D.done.rare){D.done['rare:short']=1;delete D.done.rare}}return D}
STK_PAGES.unshift({id:'shz',items:()=>{const D=sbData(),L=lang==='he'?1:0;return SHZ.map(s=>({id:'shz:'+s[0],n:D.got[s[0]]||0,src:'art/stk_'+s[0]+'.webp',name:L?s[3]:s[2],line:L?s[5]:s[4],rar:s[1],hint:t('sbHow_shz'),shz:1,sec:s[6]||'classic'}))}});
{const sp=STK_PAGES.findIndex(P=>P.id==='special');if(sp>=0&&!SPECIALS.length)STK_PAGES.splice(sp,1)}
const SB_ICON={shz:'stk_s01',rare:'ic_star',boss:'ic_boss',world:'ic_map',buddy:'ns_nest',hat:'ic_hats',special:'ic_gift'};
const SB_COL={shz:'#ff7ab8',rare:'#ffcf3a',boss:'#ff6a5a',world:'#5fd068',buddy:'#59c6ff',hat:'#b48cff',special:'#ffa94d'};
function sbRar(P,it){if(it.rar)return it.rar;if(P.id==='boss'||it.prem)return 'r';if(P.id==='rare')return 'h';return 'c'}
/* ---------- earning packs ---------- */
let SBQ=0,SBQG=0;
function sbGive(n,g){if(!n)return;const D=sbData();if(g){D.gpacks+=n;SBQG+=n}else{D.packs+=n;SBQ+=n}saveProgress();try{stkBadge()}catch(e){}setTimeout(sbNotify,0)}
{const _w=win;win=function(){const was=state;const r=_w.apply(this,arguments);if((mode==='levels'||mode==='event')&&was!=='win'&&state==='win'){try{const D=sbData();D.w++;let n=0;if(D.w%3===0)n++;
    if(mode==='levels'&&lvInZone()===LPZ-1){const k=zone().sid||zone().id;if(!D.boss[k]){D.boss[k]=1;n++}}saveProgress();if(n)sbGive(n)}catch(e){}}return r}}
function sbNotify(){if(!SBQ&&!SBQG)return;if(document.querySelector('.lvup')){setTimeout(sbNotify,500);return}const ov=document.getElementById('overlay'),body=document.querySelector('#card .card-body');
  const items=[[SBQ,'sb_pack','sbPackGot'],[SBQG,'sb_gpack','sbGoldGot']].filter(x=>x[0]),txt=([n,,k])=>n>1?t(k).replace('+1','+'+n):t(k);
  if(ov&&!ov.hidden&&body&&(state==='win'||state==='over')){SBQ=SBQG=0;items.forEach(it=>{const d=document.createElement('div');d.className='sb-strip'+(it[1]==='sb_gpack'?' gold':'');d.innerHTML=`<img src="art/${it[1]}.webp" alt=""><span><b></b><small></small></span>`;
    d.querySelector('b').textContent=txt(it);d.querySelector('small').textContent=t('sbPackSub');body.appendChild(d)})}
  else if(state==='win'||state==='over'){} // the result card opens a moment later and picks the queue up (showOverlay below)
  else{SBQ=SBQG=0;popupToast(items.map(txt).join('  '))}}
{const _s=showOverlay;showOverlay=function(){const r=_s.apply(this,arguments);if(SBQ||SBQG)setTimeout(sbNotify,160);return r}}
/* more ways to EARN packs (Tzach, Oct 7). Packs are never sold, for coins or money: random stickers for purchase = a loot box (App Store). */
// player level-up: a pack for every even player level
if(typeof lvUpPop==='function'){const _l=lvUpPop;lvUpPop=function(lv){const n=progress.lvRew||0;const r=_l.apply(this,arguments);if(n){let k=0;for(let L=lv-n+1;L<=lv;L++)if(L%2===0)k++;sbGive(k)}return r}}
// bonus stage: the gold chest (24 floors) gives a GOLDEN pack the first time on each boss (replays: coins only)
if(typeof bnCollect==='function'){const _bc=bnCollect;bnCollect=function(){const g=BN&&!BN.paid&&BN.first&&BN.open.includes(2);const r=_bc.apply(this,arguments);if(g)sbGive(1,1);return r}
  const _br=bnResult;bnResult=function(){const r=_br.apply(this,arguments);try{if(BN&&BN.first&&BN.open.includes(2)){const rw=document.querySelector('#card .bn-rew');if(rw){let bo=rw.querySelector('.bn-bos');if(!bo){bo=document.createElement('div');bo.className='bn-bos';rw.appendChild(bo)}
    const e=document.createElement('span');e.className='bn-bo bn-gpk';e.innerHTML='<img src="art/sb_gpack.webp" alt=""><em>×1</em><small></small>';e.querySelector('small').textContent=t('sbGold');bo.appendChild(e)}}}catch(e){}return r}
  const _bi=bnIntro;bnIntro=function(){const r=_bi.apply(this,arguments);try{if(BN&&BN.first){const c=document.querySelector('#card .bn-ch.gold');if(c){const im=document.createElement('img');im.className='bn-gpk';im.src='art/sb_gpack.webp';im.alt='';c.appendChild(im)}}}catch(e){}return r}}
// trophy room: every gold trophy
if(typeof achClaim==='function'){const _a=achClaim;achClaim=function(A,g){const r=_a.apply(this,arguments);if(g===2)sbGive(1);return r}}
// holiday events: finishing stage 5 and stage 10 of the event path for the first time
if(typeof evFinish==='function'){const _e=evFinish;evFinish=function(won){let d0=0;try{d0=evData(EVP.E.id).done}catch(e){}const r=_e.apply(this,arguments);try{const d1=evData(EVP.E.id).done;sbGive((d0<5&&d1>=5?1:0)+(d0<10&&d1>=10?1:0))}catch(e){}return r}}
// Sharliz Pass, FREE track only: tiers 4/11/16/23/28 give a pack instead of 50 coins (never the paid track)
if(typeof PS_REW!=='undefined'){[3,10,15,22,27].forEach(i=>{PS_REW[i][0]={pk:1}});
  const _rh=psRewHTML;psRewHTML=function(R){if(!R.pk)return _rh.apply(this,arguments);return `<span class="rw it"><img src="art/sb_pack.webp" alt=""></span><small class="lab">${t('psPack')}</small>`};
  const _pg=psGive;psGive=function(R){if(R.pk){sbGive(R.pk);return}return _pg.apply(this,arguments)}}
{const _b=stkBadge;stkBadge=function(){const D=sbData(),n=stkNew()+D.packs+D.gpacks;document.querySelectorAll('[data-sbadge]').forEach(b=>{b.hidden=!n;b.textContent=n})}}
/* ---------- the book ---------- */
const SB={el:null,ch:0,pg:0,view:'cover'};
function sbChapters(){return STK_PAGES}
/* pages: a chapter's items split by section (it.sec, album v3); a section starts on a new page and is spread evenly over its
   pages (10 → 5+5, not 9+1). Chapters without sections are one section. */
function sbPages(P,all){all=all||P.items().filter(x=>!x.soon);const secs=[];all.forEach((it,i)=>{const L=secs[secs.length-1];if(L&&L.sec===it.sec)L.ix.push(i);else secs.push({sec:it.sec,ix:[i]})});
  const pg=[];secs.forEach(S=>{const n=Math.ceil(S.ix.length/9),per=Math.ceil(S.ix.length/n);for(let k=0;k<n;k++)pg.push({sec:S.sec,ix:S.ix.slice(k*per,k*per+per),k,n})});return pg.length?pg:[{sec:undefined,ix:[],k:0,n:1}]}
function sbSecs(P){return [...new Set(P.items().filter(x=>!x.soon).map(x=>x.sec))].filter(x=>x!==undefined)}
function sbNumBase(ci){let n=0;for(let i=0;i<ci;i++)n+=sbChapters()[i].items().filter(x=>!x.soon).length;return n}
openAlbum=function(){audio();sfx.click();if(!SB.el){const el=document.createElement('div');el.id='sbook';document.getElementById('app').appendChild(el);SB.el=el;
    let sx=null;el.addEventListener('pointerdown',e=>{if(e.target.closest('.sb-paper'))sx=e.clientX});el.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>50&&SB.view==='page')sbTurn((dx<0?1:-1)*(I18N[lang]._dir==='rtl'?-1:1))})}
  SB.el.hidden=false;const seen=progress.stkSeen||[];const ci=sbChapters().findIndex(P=>P.items().some(it=>it.n&&!seen.includes(it.id)));
  if(ci>=0){SB.ch=ci;SB.pg=0;sbPageView()}else sbCover()};
function sbClose(){sfx.click();SB.el.hidden=true;stkBadge();updateWalletUI();if(state==='title')updateLobby()}
function sbTop(back){return `<div class="sb-top"><button class="sb-rb ${back?'sb-back':'sb-x'}" aria-label="back"></button><div class="sb-ttl"></div><div class="coin-pill">${coinImg()}<span>${progress.coins}</span></div></div>`}
function sbWireTop(r,back){const b=r.querySelector('.sb-rb');b.innerHTML=back?'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="#120d2b" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>':XSVG;b.onclick=back?()=>{sfx.click();sbCover()}:sbClose}
function sbCover(){SB.view='cover';const r=SB.el,[a,b]=stkTotals();r.className='sb-cover-v';
  r.innerHTML=sbTop(false)+`<div class="sb-coverwrap"><div class="sb-cover"><div class="sb-stitch"></div><h2></h2><div class="sb-prog"><img src="art/ic_star.webp" alt=""><b>${a}/${b}</b></div>
    <img class="sb-hero" src="art/stk_s21.webp" alt=""><img class="sb-doodle d1" src="art/stk_s02.webp" alt=""><img class="sb-doodle d2" src="art/stk_s11.webp" alt=""><div class="sb-tape"></div></div><div class="sb-tabs-edge"></div></div>
    <button class="btn primary sb-openbtn"><span></span></button>`;
  sbWireTop(r,false);r.querySelector('.sb-ttl').remove();r.querySelector('h2').textContent=t('albumBook');r.querySelector('.sb-tape').textContent=t('sbCover');r.querySelector('.sb-openbtn span').textContent=t('sbOpen');
  r.querySelector('.sb-openbtn').onclick=()=>{sfx.click();r.querySelector('.sb-cover').classList.add('opening');setTimeout(()=>{SB.pg=0;sbPageView()},320)};
  const te=r.querySelector('.sb-tabs-edge');sbChapters().forEach((P,i)=>{const it=P.items(),got=it.filter(x=>x.n).length,tot=it.filter(x=>!x.soon).length,bt=document.createElement('button');bt.className='sb-etab';bt.style.setProperty('--c',SB_COL[P.id]||'#b48cff');
    bt.innerHTML=`<img src="art/${SB_ICON[P.id]}.webp" alt=""><span></span>`;bt.querySelector('span').textContent=P.id==='shz'?t('ch_shz'):t('pg_'+P.id);bt.onclick=()=>{sfx.click();SB.ch=i;SB.pg=0;sbPageView()};te.appendChild(bt)})}
function sbTurn(d){const P=sbChapters()[SB.ch],np=sbPages(P).length;let pg=SB.pg+d,ch=SB.ch;
  if(pg<0){if(ch===0){sfx.locked();return}ch--;pg=sbPages(sbChapters()[ch]).length-1}else if(pg>=np){if(ch===sbChapters().length-1){sfx.locked();return}ch++;pg=0}
  SB.ch=ch;SB.pg=pg;if(sfx.ok()){noise({d:.18,v:.06,hp:1800});tone({f:300,f2:520,d:.12,type:'sine',v:.03})}sbPageView(d)}
function sbPageView(dir){SB.view='page';const r=SB.el,P=sbChapters()[SB.ch],all=P.items().filter(x=>!x.soon),pages=sbPages(P,all),np=pages.length,D=sbData(),seen=progress.stkSeen=progress.stkSeen||[];SB.pg=Math.max(0,Math.min(SB.pg,np-1));
  const PG=pages[SB.pg],secs=sbSecs(P),sec=PG.sec;SB.sec=sec;const ck=sec!==undefined?P.id+':'+sec:P.id,inSec=sec!==undefined?all.filter(x=>x.sec===sec):all;
  r.className='sb-page-v';const got=inSec.filter(x=>x.n).length,base=sbNumBase(SB.ch),done=got===inSec.length&&inSec.length>0,claimed=!!D.done[ck];
  r.innerHTML=sbTop(true)+`<div class="sb-chs"></div><div class="sb-paperwrap"><div class="sb-paper ${dir>0?'flip-n':dir<0?'flip-p':''}" style="--c:${SB_COL[P.id]||'#b48cff'}"><div class="sb-rings"></div>
      <div class="sb-head"><span class="sb-washi"></span><b></b><small></small></div><div class="sb-grid"></div><div class="sb-pnav"><button class="sb-pp" aria-label="prev"></button><span></span><button class="sb-pn" aria-label="next"></button></div></div></div>
    <div class="sb-foot"><div class="sb-bar${done?' full':''}"><div class="t"><i style="width:${got/inSec.length*100}%"></i><span>${got}/${inSec.length}</span></div><button class="sb-chest${done&&!claimed?' can':''}${claimed?' got':''}${!done&&inSec.length-got<=3?' near':''}"><img src="art/ic_chest${claimed?'_open':''}.webp" alt="">${!done&&inSec.length-got<=3?`<em>${inSec.length-got}</em>`:''}</button></div>
      <button class="sb-packbtn${D.packs?' has':''}"><img src="art/sb_pack.webp" alt=""><span></span>${D.packs?`<i class="badge">${D.packs}</i>`:''}</button><button class="sb-gpackbtn${D.gpacks?' has':''}" aria-label="gold"><img src="art/sb_gpack.webp" alt="">${D.gpacks?`<i class="badge">${D.gpacks}</i>`:''}</button></div>`;
  sbWireTop(r,true);r.querySelector('.sb-ttl').textContent=t('albumBook');
  const chs=r.querySelector('.sb-chs');sbChapters().forEach((Q,i)=>{const it=Q.items().filter(x=>!x.soon),g=it.filter(x=>x.n).length,nw=it.some(x=>x.n&&!seen.includes(x.id)),bt=document.createElement('button');
    bt.className='sb-ch'+(i===SB.ch?' on':'');bt.style.setProperty('--c',SB_COL[Q.id]||'#b48cff');bt.innerHTML=`<img src="art/${SB_ICON[Q.id]}.webp" alt=""><span><b></b><small>${g}/${it.length}</small></span>${nw?'<i class="dot"></i>':''}`;
    bt.querySelector('b').textContent=Q.id==='shz'?t('ch_shz'):t('pg_'+Q.id);bt.onclick=()=>{if(i===SB.ch)return;sfx.click();const d=i>SB.ch?1:-1;SB.ch=i;SB.pg=0;sbPageView(d)};chs.appendChild(bt)});
  const on=chs.querySelector('.on');if(on)requestAnimationFrame(()=>{const a=on.getBoundingClientRect(),c=chs.getBoundingClientRect();chs.scrollLeft+=a.left+a.width/2-(c.left+c.width/2)});
  const chN=P.id==='shz'?t('ch_shz'):t('pg_'+P.id);r.querySelector('.sb-head b').textContent=secs.length>1?sbSecName(P.id,sec):chN;r.querySelector('.sb-head small').textContent=secs.length>1?sbSecSub(sec,PG):np>1?t('sbPage',{a:SB.pg+1,b:np}):'';
  if(secs.length>1){const tb=document.createElement('button');tb.className='sb-toc';tb.setAttribute('aria-label','contents');tb.innerHTML='<i></i><i></i><i></i>';tb.onclick=()=>{sfx.click();sbToc(P)};r.querySelector('.sb-head').appendChild(tb)}
  const pn=r.querySelector('.sb-pnav');pn.querySelector('span').innerHTML=np>7?`<b class="sb-pnum">${SB.pg+1}/${np}</b>`:Array.from({length:np},(_,i)=>`<i class="${i===SB.pg?'on':''}"></i>`).join('');
  pn.querySelector('.sb-pp').onclick=()=>sbTurn(-1);pn.querySelector('.sb-pn').onclick=()=>sbTurn(1);
  const grid=r.querySelector('.sb-grid'),fresh=[];
  PG.ix.forEach((idx,k)=>{const it=all[idx],num=base+idx+1,rar=sbRar(P,it),s=document.createElement('button'),rot=((strHash(it.id)%9)-4)*.8;
    s.className='sb-slot'+(it.n?' got r-'+rar:'')+(it.round?' round':'')+(it.card?' card':'')+(P.id==='shz'?' art':'');s.style.setProperty('--r',rot+'deg');
    s.innerHTML=`<span class="num">#${String(num).padStart(2,'0')}</span><span class="stk"><img alt=""></span>`+(it.n>1?`<i class="cnt">×${it.n}</i>`:'');
    const img=s.querySelector('img'),src=it.src||(it.img?it.img():'');if(src)img.src=src;else img.remove();
    if(it.n&&!seen.includes(it.id)){s.classList.add('new');s.style.animationDelay=(.2+fresh.length*.2)+'s';fresh.push(it.id)}
    s.onclick=()=>{if(it.n){sfx.click();sbZoom(P,all,idx)}else{sfx.locked();noteToast(it.hint||t('hint_'+P.id))}};grid.appendChild(s)});
  const ch=r.querySelector('.sb-chest'),rew=sbRew(ck);ch.onclick=()=>{if(done&&!claimed){const [c,x]=rew;D.done[ck]=1;wallet().coins+=c;saveProgress();addXP(x);XPQ=null;lvUpLater();sfx.flourish(4);vib([30,40,30]);popupToast('+'+c+' 🪙  +'+x+' XP');sbPageView()}else if(!done){sfx.locked();popupToast(t('sbDone').replace('!','')+' → '+rew[0]+' 🪙')}};
  const pb=r.querySelector('.sb-packbtn');pb.querySelector('span').textContent=D.packs?t('sbPacks',{n:D.packs}):t('sbNext',{n:D.w%3});
  // packs are earned only (no buying with coins): random items for purchase would be a loot box (Apple odds disclosure, AU 16+)
  pb.onclick=()=>{if(D.packs){sbPack()}else{sfx.locked();noteToast(t('sbHow'))}};
  r.querySelector('.sb-gpackbtn').onclick=()=>{if(D.gpacks){sbPack(1)}else{sfx.locked();noteToast(t('sbHowG'))}};
  if(fresh.length){fresh.forEach((id,k)=>setTimeout(()=>{if(sfx.ok()){tone({f:900,f2:1500,d:.1,type:'sine',v:.06});noise({d:.08,v:.05,hp:3000})}vib(10)},250+k*200));seen.push(...fresh);saveProgress()}
  stkBadge()}
/* ---------- zoom ---------- */
function sbZoom(P,all,idx){const owned=all.map((it,i)=>[it,i]).filter(([it])=>it.n);let k=owned.findIndex(([,i])=>i===idx);if(k<0)k=0;const base=sbNumBase(SB.ch);
  const m=document.createElement('div');m.className='sb-zoom';document.getElementById('app').appendChild(m);
  const draw=()=>{const [it,i]=owned[k],rar=sbRar(P,it);m.className='sb-zoom z-'+rar;
    m.innerHTML=`<div class="sb-top"><button class="sb-rb sb-back" aria-label="back"></button><div class="sb-ttl"></div><span></span></div><div class="zc"><button class="za zp" aria-label="prev"></button>
      <div class="zcard${it.round?' round':''}${it.card?' card':''}"><div class="foil"></div><img alt=""><div class="shine"></div></div><button class="za zn" aria-label="next"></button><span class="zr"></span></div>
      <b class="zno">#${String(base+i+1).padStart(2,'0')}</b><div class="znm"></div><p class="zln"></p>${it.feat?'<p class="zft"><img src="art/cup_g.webp" alt=""><span></span></p>':''}<div class="zhave"><img src="art/ic_album.webp" alt=""><span></span></div><button class="btn primary zbk"><span></span></button>`;
    const bk=m.querySelector('.sb-back');bk.innerHTML='<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="#120d2b" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    m.querySelector('.sb-ttl').textContent=rar==='h'?t('sbRar_h')+'!':rar==='r'?t('sbRar_r')+'!':(P.id==='shz'?t('ch_shz'):t('pg_'+P.id));
    const im=m.querySelector('.zcard img'),src=it.src||(it.img?it.img():'');if(src)im.src=src;m.querySelector('.zr').textContent=t('sbRar_'+rar);
    m.querySelector('.znm').textContent=it.name;m.querySelector('.zln').textContent=it.line||it.hint||t('hint_'+P.id);m.querySelector('.zhave span').textContent=t('sbHave',{n:it.n});if(it.feat)m.querySelector('.zft span').textContent=it.feat;m.querySelector('.zbk span').textContent=t('sbToBook');
    const close=()=>{sfx.click();m.remove()};bk.onclick=close;m.querySelector('.zbk').onclick=close;
    const zp=m.querySelector('.zp'),zn=m.querySelector('.zn');zp.disabled=owned.length<2;zn.disabled=owned.length<2;
    zp.onclick=()=>{k=(k-1+owned.length)%owned.length;sfx.click();draw()};zn.onclick=()=>{k=(k+1)%owned.length;sfx.click();draw()}; // RTL: the row is mirrored, so 'next' sits on the left like the page arrows
    const card=m.querySelector('.zcard');let tx=0,ty=0;const set=(x,y)=>{card.style.setProperty('--rx',(-y*16)+'deg');card.style.setProperty('--ry',(x*18)+'deg');card.style.setProperty('--mx',(50+x*60)+'%');card.style.setProperty('--my',(50+y*60)+'%')};
    card.onpointermove=e=>{const b=card.getBoundingClientRect();tx=(e.clientX-b.left)/b.width-.5;ty=(e.clientY-b.top)/b.height-.5;card.classList.add('drag');set(tx,ty)};card.onpointerleave=()=>{card.classList.remove('drag')}};
  draw();sfx.flourish(1)}
/* ---------- pack opening ---------- */
/* golden pack (earned only, never sold): the first sticker is always holo, the other two are holo 25% / rare 75% */
function sbRoll(g,i){const r=Math.random(),rar=g?(i===0||r<.25?'h':'r'):(r<.06?'h':r<.30?'r':'c');const pool=SHZ.filter(s=>s[1]===rar);return pick(pool)}
const SB_MAX=10; // most packs opened at once
/* g = golden pack, many = open all of that kind (up to SB_MAX). Nothing is spent until the pack is torn open. */
function sbPack(g,many){const D=sbData(),key=g?'gpacks':'packs';if(!D[key])return;const np=many?Math.min(SB_MAX,D[key]):1,art=g?'sb_gpack':'sb_pack';
  const got=[];for(let p=0;p<np;p++){for(let i=0;i<3;i++)got.push(sbRoll(g,i))}const seen={};
  const res=got.map(s=>{const had=(D.got[s[0]]||0)+(seen[s[0]]||0);seen[s[0]]=(seen[s[0]]||0)+1;return {s,dup:had>0}});const coins=0; // doubles no longer pay coins: they are sold for sticker stars in the sticker shop (v63)
  const L=lang==='he'?1:0,m=document.createElement('div');m.className='sb-pk'+(g?' gold':'')+(np>1?' many':'');document.getElementById('app').appendChild(m);
  m.innerHTML=`<div class="coin-pill pk-coins">${coinImg()}<span>${progress.coins}</span></div><div class="flash"></div><h3></h3><p></p><div class="pk-cards"></div><div class="pk-pack"><img class="pk-body" src="art/${art}.webp" alt=""><img class="pk-logo" src="art/logo_${lang==='he'?'he':'en'}.webp" alt=""><img class="pk-top" src="art/${art}_top.webp" alt="">${np>1?`<i class="pk-n">×${np}</i>`:''}</div><small class="pk-tap"></small><div class="pk-btns"></div>`;
  m.querySelector('h3').textContent=np>1?t('sbOpenMany',{n:np}):g?t('sbGoldOpen'):t('sbOpenPack');m.querySelector('p').textContent=g?t('sbGoldSub'):t('sbOpenSub');m.querySelector('.pk-tap').textContent=t('sbTapPack');
  const cards=m.querySelector('.pk-cards');if(np>1){const k=res.length;cards.style.setProperty('--cols',k<=9?3:k<=12?4:k<=15?5:6)}
  res.forEach((R,i)=>{const c=document.createElement('div');c.className='pk-card r-'+R.s[1]+(R.dup?' dup':' nw');c.style.setProperty('--i',i);
    c.innerHTML=`<div class="in"><div class="bk"><img src="art/${art}.webp" alt=""></div><div class="fr"><div class="foil"></div><img src="art/stk_${R.s[0]}.webp" alt=""><b></b></div></div><span class="tag ${R.dup?'dup':'nw'}"></span><span class="rc">${t('sbRar_'+R.s[1])}</span>`;
    c.querySelector('.tag').textContent=R.dup?t('sbDouble'):t('sbNew');c.querySelector('b').textContent=L?R.s[3]:R.s[2];cards.appendChild(c)});
  // before tearing: 'open all' when there is more than one pack of this kind
  if(np===1&&D[key]>1){const all=document.createElement('button');all.className='btn';all.innerHTML='<span></span>';all.querySelector('span').textContent=t('sbAll',{n:Math.min(SB_MAX,D[key])});all.onclick=e=>{e.stopPropagation();sfx.click();m.remove();sbPack(g,true)};m.querySelector('.pk-btns').appendChild(all)}
  let stage=0;const step=()=>{if(stage!==0)return;stage=1;
      // spend the packs + add the stickers now (the result was rolled when the screen opened)
      D[key]-=np;res.forEach(R=>{D.got[R.s[0]]=(D.got[R.s[0]]||0)+1});if(coins)wallet().coins+=coins;saveProgress();updateWalletUI();
      m.querySelector('.pk-btns').innerHTML='';m.classList.add('torn');setTimeout(()=>{const b=m.querySelector('.pk-body');if(b)b.src=`art/${art}_open.webp`},250);sfx.flourish(2);vib([20,30,20]);if(sfx.ok())noise({d:.25,v:.08,hp:2500});
      const cs=m.querySelector('.pk-coins span');let shown=progress.coins-coins;cs.textContent=shown;
      const fin=()=>{stage=2;m.querySelector('.pk-tap').textContent='';const bt=m.querySelector('.pk-btns');const D2=sbData(),left=D2[key];
        {const nw=res.filter(R=>!R.dup).length;if(np>1)m.querySelector('p').textContent=nw?t('sbNewN',{n:nw}):t('sbDupHint');else if(nw<res.length)m.querySelector('p').textContent=t('sbDupHint')}
        if(left){const more=document.createElement('button');more.className='btn primary';more.innerHTML='<span></span>';more.querySelector('span').textContent=t('sbMore',{n:left});more.onclick=()=>{m.remove();sbPack(g)};bt.appendChild(more);
          if(left>1){const all=document.createElement('button');all.className='btn';all.innerHTML='<span></span>';all.querySelector('span').textContent=t('sbAll',{n:Math.min(SB_MAX,left)});all.onclick=()=>{sfx.click();m.remove();sbPack(g,true)};bt.appendChild(all)}}
        const back=document.createElement('button');back.className='btn'+(left?'':' primary');back.innerHTML='<span></span>';back.querySelector('span').textContent=t('sbToBook');back.onclick=()=>{sfx.click();m.remove();SB.ch=0;SB.pg=0;sbPageView()};bt.appendChild(back)};
      if(np===1){res.forEach((R,i)=>{const T0=800+i*750,c=cards.children[i];setTimeout(()=>{c.classList.add('tease');if(sfx.ok()&&R.s[1]!=='c')tone({f:400,f2:R.s[1]==='h'?900:700,d:.3,type:'triangle',v:.05})},T0);
        setTimeout(()=>{c.classList.remove('tease');c.classList.add('flip');if(sfx.ok())tone({f:R.s[1]==='h'?1200:R.s[1]==='r'?900:700,f2:R.s[1]==='h'?1900:1300,d:.14,type:'sine',v:.07});vib(R.s[1]==='c'?8:[15,20,15]);
},T0+(R.s[1]==='c'?250:600))});
        setTimeout(fin,800+res.length*750+900)}
      else{// many packs: the cards deal into a grid and flip one after another, fast; doubles pay out at the end in one go
        const dt=Math.max(90,Math.min(160,2600/res.length));res.forEach((R,i)=>{const c=cards.children[i];setTimeout(()=>{c.classList.add('flip');if(sfx.ok())tone({f:R.s[1]==='h'?1200:R.s[1]==='r'?900:650+i*8,f2:R.s[1]==='h'?1900:1300,d:.1,type:'sine',v:R.s[1]==='c'?.04:.07});if(R.s[1]!=='c')vib([15,20,15])},700+i*dt)});
        const T=700+res.length*dt+500;if(coins)setTimeout(()=>sbFlyCoins(cards,m.querySelector('.pk-coins'),()=>{cs.textContent=progress.coins}),T);setTimeout(fin,T+(coins?900:300))}};
  m.querySelector('.pk-pack').onclick=step;m.onclick=e=>{if(stage===0&&!e.target.closest('.pk-btns'))step()};sfx.click()}
function sbFlyCoins(from,to,done){const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();for(let k=0;k<5;k++){const im=document.createElement('img');im.src='art/ic_coin.webp';im.className='fly-coin';im.style.left=(a.left+a.width/2-13+(k-2)*8)+'px';im.style.top=(a.top+a.height/2-13)+'px';document.body.appendChild(im);
  setTimeout(()=>{im.style.transform=`translate(${b.left+14-(a.left+a.width/2-13+(k-2)*8)}px,${b.top+4-(a.top+a.height/2-13)}px) scale(.8)`;im.style.opacity='0'},30+k*70);setTimeout(()=>{im.remove();if(k===4){if(sfx.ok())sfx.coin(2);done&&done()}},800+k*70)}}
