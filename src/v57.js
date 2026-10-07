/* ===== v57: STICKER ALBUM 2.0 — a real collectible sticker book (design: ChatGPT, design/stickers/) =====
   Cover → chapter pages of 9 numbered slots (die-cut stickers, holo foil for rare/holo), tap a sticker → zoom with tilt + shine.
   New chapter "Sharliz": 24 illustrated stickers that only come from STICKER PACKS (3 stickers each; common/rare/holo).
   Packs: every 3 won levels, the first win over each boss, or 150 coins. Duplicates → coins. A full chapter → a big reward. */
Object.assign(I18N.en,{sbOpen:'Open',sbBack:'Back',sbPacks:'Packs: {n}',sbNext:'Next pack {n}/3',sbHow:'Packs come from wins, bosses, the daily gift, weekly missions, level-ups, the tournament, the Pass and events',psPack:'Sticker pack',dlPack:'+ pack',sbOpenPack:'Opening a pack!',sbOpenSub:'Which stickers are inside?',sbTap:'Tap to continue',sbTapPack:'Tap the pack!',sbNew:'New!',sbDup:'Double +{n}',sbMore:'Open another ({n})',sbToBook:'To the album',
  sbRar_c:'Common',sbRar_r:'Rare',sbRar_h:'Holo',sbHave:'You have {n}',sbNone:'Not found yet',sbDone:'Page complete!',sbClaim:'Collect',sbGot:'Collected',sbPackGot:'+1 sticker pack!',sbPackSub:'Open it in the sticker album',sbNoCoins:'Not enough coins',
  sbHow_shz:'Comes from sticker packs',sbCover:'Collect · Discover · Complete!',ch_shz:'Sharliz',sbPage:'Page {a}/{b}'});
Object.assign(I18N.he,{sbOpen:'פתחו',sbBack:'חזרה',sbPacks:'שקיות: {n}',sbNext:'שקית הבאה {n}/3',sbHow:'שקיות מקבלים מניצחונות, בוסים, המתנה היומית, משימות שבועיות, עליית רמה, הטורניר, ה-Pass ואירועים',psPack:'שקית מדבקות',dlPack:'+ שקית',sbOpenPack:'פותחים שקית!',sbOpenSub:'איזה מדבקות מחכות בפנים?',sbTap:'הקישו להמשיך',sbTapPack:'הקישו על השקית!',sbNew:'חדש!',sbDup:'כפולה +{n}',sbMore:'פתחו עוד ({n})',sbToBook:'חזרה לאלבום',
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
const SB_DUP={c:10,r:25,h:60},SB_REW={shz:[1500,120],rare:[500,60],boss:[2000,150],world:[1000,100],buddy:[800,80],hat:[1500,120],special:[500,60]};
function sbData(){const D=progress.stkp=progress.stkp||{};D.packs=D.packs||0;D.w=D.w||0;D.got=D.got||{};D.done=D.done||{};D.boss=D.boss||{};return D}
STK_PAGES.unshift({id:'shz',items:()=>{const D=sbData(),L=lang==='he'?1:0;return SHZ.map(s=>({id:'shz:'+s[0],n:D.got[s[0]]||0,src:'art/stk_'+s[0]+'.webp',name:L?s[3]:s[2],line:L?s[5]:s[4],rar:s[1],hint:t('sbHow_shz'),shz:1}))}});
{const sp=STK_PAGES.findIndex(P=>P.id==='special');if(sp>=0&&!SPECIALS.length)STK_PAGES.splice(sp,1)}
const SB_ICON={shz:'stk_s01',rare:'ic_star',boss:'ic_boss',world:'ic_map',buddy:'ns_nest',hat:'ic_hats',special:'ic_gift'};
const SB_COL={shz:'#ff7ab8',rare:'#ffcf3a',boss:'#ff6a5a',world:'#5fd068',buddy:'#59c6ff',hat:'#b48cff',special:'#ffa94d'};
function sbRar(P,it){if(it.rar)return it.rar;if(P.id==='boss'||it.prem)return 'r';if(P.id==='rare')return 'h';return 'c'}
/* ---------- earning packs ---------- */
let SBQ=0;
function sbGive(n){if(!n)return;const D=sbData();D.packs+=n;saveProgress();SBQ+=n;try{stkBadge()}catch(e){}setTimeout(sbNotify,0)}
{const _w=win;win=function(){const was=state;const r=_w.apply(this,arguments);if((mode==='levels'||mode==='event')&&was!=='win'&&state==='win'){try{const D=sbData();D.w++;let n=0;if(D.w%3===0)n++;
    if(mode==='levels'&&lvInZone()===LPZ-1){const k=zone().sid||zone().id;if(!D.boss[k]){D.boss[k]=1;n++}}saveProgress();if(n)sbGive(n)}catch(e){}}return r}}
function sbNotify(){if(!SBQ)return;if(document.querySelector('.lvup')){setTimeout(sbNotify,500);return}const ov=document.getElementById('overlay'),body=document.querySelector('#card .card-body');
  if(ov&&!ov.hidden&&body&&(state==='win'||state==='over')){const n=SBQ;SBQ=0;const d=document.createElement('div');d.className='sb-strip';d.innerHTML=`<img src="art/sb_pack.webp" alt=""><span><b></b><small></small></span>`;
    d.querySelector('b').textContent=n>1?t('sbPackGot').replace('+1','+'+n):t('sbPackGot');d.querySelector('small').textContent=t('sbPackSub');body.appendChild(d)}
  else if(state==='win'||state==='over'){} // the result card opens a moment later and picks the queue up (showOverlay below)
  else{const n=SBQ;SBQ=0;popupToast(n>1?t('sbPackGot').replace('+1','+'+n):t('sbPackGot'))}}
{const _s=showOverlay;showOverlay=function(){const r=_s.apply(this,arguments);if(SBQ)setTimeout(sbNotify,160);return r}}
/* more ways to EARN packs (Tzach, Oct 7). Packs are never sold, for coins or money: random stickers for purchase = a loot box (App Store). */
// player level-up: a pack for every even player level
if(typeof lvUpPop==='function'){const _l=lvUpPop;lvUpPop=function(lv){const n=progress.lvRew||0;const r=_l.apply(this,arguments);if(n){let k=0;for(let L=lv-n+1;L<=lv;L++)if(L%2===0)k++;sbGive(k)}return r}}
// trophy room: every gold trophy
if(typeof achClaim==='function'){const _a=achClaim;achClaim=function(A,g){const r=_a.apply(this,arguments);if(g===2)sbGive(1);return r}}
// holiday events: finishing stage 5 and stage 10 of the event path for the first time
if(typeof evFinish==='function'){const _e=evFinish;evFinish=function(won){let d0=0;try{d0=evData(EVP.E.id).done}catch(e){}const r=_e.apply(this,arguments);try{const d1=evData(EVP.E.id).done;sbGive((d0<5&&d1>=5?1:0)+(d0<10&&d1>=10?1:0))}catch(e){}return r}}
// Sharliz Pass, FREE track only: tiers 4/11/16/23/28 give a pack instead of 50 coins (never the paid track)
if(typeof PS_REW!=='undefined'){[3,10,15,22,27].forEach(i=>{PS_REW[i][0]={pk:1}});
  const _rh=psRewHTML;psRewHTML=function(R){if(!R.pk)return _rh.apply(this,arguments);return `<span class="rw it"><img src="art/sb_pack.webp" alt=""></span><small class="lab">${t('psPack')}</small>`};
  const _pg=psGive;psGive=function(R){if(R.pk){sbGive(R.pk);return}return _pg.apply(this,arguments)}}
{const _b=stkBadge;stkBadge=function(){const n=stkNew()+sbData().packs;document.querySelectorAll('[data-sbadge]').forEach(b=>{b.hidden=!n;b.textContent=n})}}
/* ---------- the book ---------- */
const SB={el:null,ch:0,pg:0,view:'cover'};
function sbChapters(){return STK_PAGES}
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
function sbTurn(d){const P=sbChapters()[SB.ch],np=Math.ceil(P.items().filter(x=>!x.soon).length/9)||1;let pg=SB.pg+d,ch=SB.ch;
  if(pg<0){if(ch===0){sfx.locked();return}ch--;pg=Math.ceil(sbChapters()[ch].items().filter(x=>!x.soon).length/9)-1}else if(pg>=np){if(ch===sbChapters().length-1){sfx.locked();return}ch++;pg=0}
  SB.ch=ch;SB.pg=pg;if(sfx.ok()){noise({d:.18,v:.06,hp:1800});tone({f:300,f2:520,d:.12,type:'sine',v:.03})}sbPageView(d)}
function sbPageView(dir){SB.view='page';const r=SB.el,P=sbChapters()[SB.ch],all=P.items().filter(x=>!x.soon),np=Math.ceil(all.length/9)||1,D=sbData(),seen=progress.stkSeen=progress.stkSeen||[];SB.pg=Math.min(SB.pg,np-1);
  r.className='sb-page-v';const got=all.filter(x=>x.n).length,base=sbNumBase(SB.ch),done=got===all.length&&all.length>0,claimed=!!D.done[P.id];
  r.innerHTML=sbTop(true)+`<div class="sb-chs"></div><div class="sb-paperwrap"><div class="sb-paper ${dir>0?'flip-n':dir<0?'flip-p':''}" style="--c:${SB_COL[P.id]||'#b48cff'}"><div class="sb-rings"></div>
      <div class="sb-head"><span class="sb-washi"></span><b></b><small></small></div><div class="sb-grid"></div><div class="sb-pnav"><button class="sb-pp" aria-label="prev"></button><span></span><button class="sb-pn" aria-label="next"></button></div></div></div>
    <div class="sb-foot"><div class="sb-bar${done?' full':''}"><div class="t"><i style="width:${got/all.length*100}%"></i><span>${got}/${all.length}</span></div><button class="sb-chest${done&&!claimed?' can':''}${claimed?' got':''}${!done&&all.length-got<=3?' near':''}"><img src="art/ic_chest${claimed?'_open':''}.webp" alt="">${!done&&all.length-got<=3?`<em>${all.length-got}</em>`:''}</button></div>
      <button class="sb-packbtn${D.packs?' has':''}"><img src="art/sb_pack.webp" alt=""><span></span>${D.packs?`<i class="badge">${D.packs}</i>`:''}</button></div>`;
  sbWireTop(r,true);r.querySelector('.sb-ttl').textContent=t('albumBook');
  const chs=r.querySelector('.sb-chs');sbChapters().forEach((Q,i)=>{const it=Q.items().filter(x=>!x.soon),g=it.filter(x=>x.n).length,nw=it.some(x=>x.n&&!seen.includes(x.id)),bt=document.createElement('button');
    bt.className='sb-ch'+(i===SB.ch?' on':'');bt.style.setProperty('--c',SB_COL[Q.id]||'#b48cff');bt.innerHTML=`<img src="art/${SB_ICON[Q.id]}.webp" alt=""><span><b></b><small>${g}/${it.length}</small></span>${nw?'<i class="dot"></i>':''}`;
    bt.querySelector('b').textContent=Q.id==='shz'?t('ch_shz'):t('pg_'+Q.id);bt.onclick=()=>{if(i===SB.ch)return;sfx.click();const d=i>SB.ch?1:-1;SB.ch=i;SB.pg=0;sbPageView(d)};chs.appendChild(bt)});
  const on=chs.querySelector('.on');if(on)requestAnimationFrame(()=>{const a=on.getBoundingClientRect(),c=chs.getBoundingClientRect();chs.scrollLeft+=a.left+a.width/2-(c.left+c.width/2)});
  r.querySelector('.sb-head b').textContent=P.id==='shz'?t('ch_shz'):t('pg_'+P.id);r.querySelector('.sb-head small').textContent=np>1?t('sbPage',{a:SB.pg+1,b:np}):'';
  const pn=r.querySelector('.sb-pnav');pn.querySelector('span').innerHTML=Array.from({length:np},(_,i)=>`<i class="${i===SB.pg?'on':''}"></i>`).join('');
  pn.querySelector('.sb-pp').onclick=()=>sbTurn(-1);pn.querySelector('.sb-pn').onclick=()=>sbTurn(1);
  const grid=r.querySelector('.sb-grid'),fresh=[];
  all.slice(SB.pg*9,SB.pg*9+9).forEach((it,k)=>{const idx=SB.pg*9+k,num=base+idx+1,rar=sbRar(P,it),s=document.createElement('button'),rot=((strHash(it.id)%9)-4)*.8;
    s.className='sb-slot'+(it.n?' got r-'+rar:'')+(it.round?' round':'')+(P.id==='shz'?' art':'');s.style.setProperty('--r',rot+'deg');
    s.innerHTML=`<span class="num">#${String(num).padStart(2,'0')}</span><span class="stk"><img alt=""></span>`+(it.n>1?`<i class="cnt">×${it.n}</i>`:'');
    const img=s.querySelector('img'),src=it.src||(it.img?it.img():'');if(src)img.src=src;else img.remove();
    if(it.n&&!seen.includes(it.id)){s.classList.add('new');s.style.animationDelay=(.2+fresh.length*.2)+'s';fresh.push(it.id)}
    s.onclick=()=>{if(it.n){sfx.click();sbZoom(P,all,idx)}else{sfx.locked();popupToast((it.hint||t('hint_'+P.id)))}};grid.appendChild(s)});
  const ch=r.querySelector('.sb-chest');ch.onclick=()=>{if(done&&!claimed){const [c,x]=SB_REW[P.id]||[500,60];D.done[P.id]=1;wallet().coins+=c;saveProgress();addXP(x);XPQ=null;sfx.flourish(4);vib([30,40,30]);popupToast('+'+c+' 🪙  +'+x+' XP');sbPageView()}else if(!done){sfx.locked();popupToast(t('sbDone').replace('!','')+' → '+(SB_REW[P.id]||[500])[0]+' 🪙')}};
  const pb=r.querySelector('.sb-packbtn');pb.querySelector('span').textContent=D.packs?t('sbPacks',{n:D.packs}):t('sbNext',{n:D.w%3});
  // packs are earned only (no buying with coins): random items for purchase would be a loot box (Apple odds disclosure, AU 16+)
  pb.onclick=()=>{if(D.packs){sbPack()}else{sfx.locked();popupToast(t('sbHow'))}};
  if(fresh.length){fresh.forEach((id,k)=>setTimeout(()=>{if(sfx.ok()){tone({f:900,f2:1500,d:.1,type:'sine',v:.06});noise({d:.08,v:.05,hp:3000})}vib(10)},250+k*200));seen.push(...fresh);saveProgress()}
  stkBadge()}
/* ---------- zoom ---------- */
function sbZoom(P,all,idx){const owned=all.map((it,i)=>[it,i]).filter(([it])=>it.n);let k=owned.findIndex(([,i])=>i===idx);if(k<0)k=0;const base=sbNumBase(SB.ch);
  const m=document.createElement('div');m.className='sb-zoom';document.getElementById('app').appendChild(m);
  const draw=()=>{const [it,i]=owned[k],rar=sbRar(P,it);m.className='sb-zoom z-'+rar;
    m.innerHTML=`<div class="sb-top"><button class="sb-rb sb-back" aria-label="back"></button><div class="sb-ttl"></div><span></span></div><div class="zc"><button class="za zp" aria-label="prev"></button>
      <div class="zcard${it.round?' round':''}"><div class="foil"></div><img alt=""><div class="shine"></div></div><button class="za zn" aria-label="next"></button><span class="zr"></span></div>
      <b class="zno">#${String(base+i+1).padStart(2,'0')}</b><div class="znm"></div><p class="zln"></p><div class="zhave"><img src="art/ic_album.webp" alt=""><span></span></div><button class="btn primary zbk"><span></span></button>`;
    const bk=m.querySelector('.sb-back');bk.innerHTML='<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="#120d2b" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    m.querySelector('.sb-ttl').textContent=rar==='h'?t('sbRar_h')+'!':rar==='r'?t('sbRar_r')+'!':(P.id==='shz'?t('ch_shz'):t('pg_'+P.id));
    const im=m.querySelector('.zcard img'),src=it.src||(it.img?it.img():'');if(src)im.src=src;m.querySelector('.zr').textContent=t('sbRar_'+rar);
    m.querySelector('.znm').textContent=it.name;m.querySelector('.zln').textContent=it.line||it.hint||t('hint_'+P.id);m.querySelector('.zhave span').textContent=t('sbHave',{n:it.n});m.querySelector('.zbk span').textContent=t('sbToBook');
    const close=()=>{sfx.click();m.remove()};bk.onclick=close;m.querySelector('.zbk').onclick=close;
    const zp=m.querySelector('.zp'),zn=m.querySelector('.zn');zp.disabled=owned.length<2;zn.disabled=owned.length<2;
    const rtl=I18N[lang]._dir==='rtl';zp.onclick=()=>{k=(k+(rtl?1:-1)+owned.length)%owned.length;sfx.click();draw()};zn.onclick=()=>{k=(k+(rtl?-1:1)+owned.length)%owned.length;sfx.click();draw()};
    const card=m.querySelector('.zcard');let tx=0,ty=0;const set=(x,y)=>{card.style.setProperty('--rx',(-y*16)+'deg');card.style.setProperty('--ry',(x*18)+'deg');card.style.setProperty('--mx',(50+x*60)+'%');card.style.setProperty('--my',(50+y*60)+'%')};
    card.onpointermove=e=>{const b=card.getBoundingClientRect();tx=(e.clientX-b.left)/b.width-.5;ty=(e.clientY-b.top)/b.height-.5;card.classList.add('drag');set(tx,ty)};card.onpointerleave=()=>{card.classList.remove('drag')}};
  draw();sfx.flourish(1)}
/* ---------- pack opening ---------- */
function sbRoll(){const r=Math.random(),rar=r<.06?'h':r<.30?'r':'c';const pool=SHZ.filter(s=>s[1]===rar);return pick(pool)}
function sbPack(){const D=sbData();if(!D.packs)return;D.packs--;const got=[sbRoll(),sbRoll(),sbRoll()];let coins=0;const res=got.map(s=>{const had=D.got[s[0]]||0;D.got[s[0]]=had+1;if(had){coins+=SB_DUP[s[1]]}return {s,dup:had>0}});
  if(coins){wallet().coins+=coins}saveProgress();updateWalletUI();
  const L=lang==='he'?1:0,m=document.createElement('div');m.className='sb-pk';document.getElementById('app').appendChild(m);
  m.innerHTML=`<div class="coin-pill pk-coins">${coinImg()}<span>${progress.coins-coins}</span></div><div class="flash"></div><h3></h3><p></p><div class="pk-cards"></div><div class="pk-pack"><img class="pk-body" src="art/sb_pack.webp" alt=""><img class="pk-logo" src="art/logo_${lang==='he'?'he':'en'}.webp" alt=""><img class="pk-top" src="art/sb_pack_top.webp" alt=""></div><small class="pk-tap"></small><div class="pk-btns"></div>`;
  m.querySelector('h3').textContent=t('sbOpenPack');m.querySelector('p').textContent=t('sbOpenSub');m.querySelector('.pk-tap').textContent=t('sbTapPack');
  const cards=m.querySelector('.pk-cards');res.forEach((R,i)=>{const c=document.createElement('div');c.className='pk-card r-'+R.s[1]+(R.dup?' dup':' nw');c.style.setProperty('--i',i);
    c.innerHTML=`<div class="in"><div class="bk"><img src="art/sb_pack.webp" alt=""></div><div class="fr"><div class="foil"></div><img src="art/stk_${R.s[0]}.webp" alt=""><b></b></div></div><span class="tag ${R.dup?'dup':'nw'}"></span><span class="rc">${t('sbRar_'+R.s[1])}</span>`;
    c.querySelector('.tag').textContent=R.dup?t('sbDup',{n:SB_DUP[R.s[1]]}):t('sbNew');c.querySelector('b').textContent=L?R.s[3]:R.s[2];cards.appendChild(c)});
  let stage=0;const step=()=>{if(stage===0){stage=1;m.classList.add('torn');setTimeout(()=>{const b=m.querySelector('.pk-body');if(b)b.src='art/sb_pack_open.webp'},250);sfx.flourish(2);vib([20,30,20]);if(sfx.ok())noise({d:.25,v:.08,hp:2500});
      const cs=m.querySelector('.pk-coins span');let shown=progress.coins-coins;
      res.forEach((R,i)=>{const T0=800+i*750,c=cards.children[i];setTimeout(()=>{c.classList.add('tease');if(sfx.ok()&&R.s[1]!=='c')tone({f:400,f2:R.s[1]==='h'?900:700,d:.3,type:'triangle',v:.05})},T0);
        setTimeout(()=>{c.classList.remove('tease');c.classList.add('flip');if(sfx.ok())tone({f:R.s[1]==='h'?1200:R.s[1]==='r'?900:700,f2:R.s[1]==='h'?1900:1300,d:.14,type:'sine',v:.07});vib(R.s[1]==='c'?8:[15,20,15]);
          if(R.dup)setTimeout(()=>sbFlyCoins(c,m.querySelector('.pk-coins'),()=>{shown+=SB_DUP[R.s[1]];cs.textContent=shown}),500)},T0+(R.s[1]==='c'?250:600))});
      setTimeout(()=>{stage=2;m.querySelector('.pk-tap').textContent='';const bt=m.querySelector('.pk-btns');const D2=sbData();
        if(D2.packs){const more=document.createElement('button');more.className='btn primary';more.innerHTML='<span></span>';more.querySelector('span').textContent=t('sbMore',{n:D2.packs});more.onclick=()=>{m.remove();sbPack()};bt.appendChild(more)}
        const back=document.createElement('button');back.className='btn'+(D2.packs?'':' primary');back.innerHTML='<span></span>';back.querySelector('span').textContent=t('sbToBook');back.onclick=()=>{sfx.click();m.remove();SB.ch=0;SB.pg=0;sbPageView()};bt.appendChild(back)},800+res.length*750+900)}};
  m.querySelector('.pk-pack').onclick=step;m.onclick=e=>{if(stage===0&&!e.target.closest('.pk-btns'))step()};sfx.click()}
function sbFlyCoins(from,to,done){const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();for(let k=0;k<5;k++){const im=document.createElement('img');im.src='art/ic_coin.webp';im.className='fly-coin';im.style.left=(a.left+a.width/2-13+(k-2)*8)+'px';im.style.top=(a.top+a.height/2-13)+'px';document.body.appendChild(im);
  setTimeout(()=>{im.style.transform=`translate(${b.left+14-(a.left+a.width/2-13+(k-2)*8)}px,${b.top+4-(a.top+a.height/2-13)}px) scale(.8)`;im.style.opacity='0'},30+k*70);setTimeout(()=>{im.remove();if(k===4){if(sfx.ok())sfx.coin(2);done&&done()}},800+k*70)}}
