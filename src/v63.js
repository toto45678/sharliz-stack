/* ===== v63: STICKER SHOP (Tzach, Oct 7: "what do we do with all the extra stickers? sell them back to buy sticker things") =====
   Doubles of the 24 Sharliz stickers stay in the album (×n) until you SELL them here for sticker stars (common 1, rare 3, holo 8).
   Pack doubles no longer pay coins (v57) — they become stars when sold. Stars buy: a missing sticker of your choice,
   a golden pack, and two shop-only looks (sticker-bomb pattern, sticker trail). Stars come ONLY from doubles: never sold for money
   and never bought with coins, so nothing random can be bought with real money (App Store loot-box rule). */
Object.assign(I18N.en,{ssTitle:'Sticker shop',ssStars:'Sticker stars',ssDoubles:'Your doubles: {n}',ssNoDup:'No doubles yet. Open packs to get some!',ssSell:'Sell all: +{n}',ssSold:'+{n} sticker stars!',
  ssPick:'Pick a missing sticker',ssAllGot:'You have all 24 Sharliz stickers!',ssSpecial:'Special',ssBuyQ:'Buy “{x}” for {n} stars?',ssBuy:'Buy',ssCancel:'Cancel',ssNeed:'You need {n} more stars',
  ssOwned:'Owned',ssGotIt:'It’s yours!',ssOnly:'Only in the sticker shop',ssWear:'Wear it in My hero',ssHow:'Sell doubles → stars → buy what you want!',sbDouble:'Double!',sbDupHint:'Sell doubles in the sticker shop for stars',sk_t_stk:'Stickers'});
Object.assign(I18N.he,{ssTitle:'חנות המדבקות',ssStars:'כוכבי מדבקה',ssDoubles:'הכפולות שלך: {n}',ssNoDup:'עוד אין כפולות. פותחים שקיות ומקבלים!',ssSell:'מכרו הכל: +{n}',ssSold:'+{n} כוכבי מדבקה!',
  ssPick:'בחרו מדבקה שחסרה לכם',ssAllGot:'יש לכם את כל 24 מדבקות השארליז!',ssSpecial:'מיוחדים',ssBuyQ:'לקנות את „{x}” ב-{n} כוכבים?',ssBuy:'קנו',ssCancel:'ביטול',ssNeed:'חסרים לכם עוד {n} כוכבים',
  ssOwned:'שלכם',ssGotIt:'זה שלכם!',ssOnly:'רק בחנות המדבקות',ssWear:'לובשים את זה ב"הגיבור שלי"',ssHow:'מוכרים כפולות ← מקבלים כוכבים ← קונים מה שרוצים!',sbDouble:'כפולה!',sbDupHint:'את הכפולות מוכרים בחנות המדבקות תמורת כוכבים',sk_t_stk:'מדבקות'});
const SS_SELL={c:1,r:3,h:8},SS_BUY={c:6,r:15,h:40};
const SS_SPECIAL=[{k:'gold',p:25},{k:'pat',c:'pattern',id:'stkbomb',p:40},{k:'trail',c:'trail',id:'t_stk',p:30}];
/* the two shop-only looks */
WPAT.stkbomb={p:1,stk:1,n:['Sticker bomb','מדבקות בכל מקום']};
STYLE_SKINS.push({id:'t_stk',cat:'t',price:1,stk:1});
const stkItem=(c,id)=>(c==='pattern'&&id==='stkbomb')||(c==='trail'&&id==='t_stk');
const ssHas=(c,id)=>c==='trail'?wallet().skins.includes(id):wOwned(c,id); // trails live in progress.skins (wOwned has no 'trail' table)
{const _g=wGate;wGate=function(cat,id){if(stkItem(cat,id)&&!ssHas(cat,id))return t('ssOnly');return _g.apply(this,arguments)}}
{const _ci=csInfo;csInfo=function(c,id){const I=_ci.apply(this,arguments);if(stkItem(c,id)&&!I.owned){I.gate=t('ssOnly');I.rar='leg'}return I}}
const SS_COL=['#ff5fa2','#ffd23f','#4ad8ff','#7ef05a','#b48cff','#ff8a3d'];
function ssShape(g,k,r){g.beginPath();if(k===0){for(let i=0;i<10;i++){const q=i/10*Math.PI*2-Math.PI/2,rr=i%2?r*.45:r;i?g.lineTo(Math.cos(q)*rr,Math.sin(q)*rr):g.moveTo(Math.cos(q)*rr,Math.sin(q)*rr)}g.closePath()}
  else if(k===1){g.moveTo(0,r*.8);g.bezierCurveTo(-r*1.3,-r*.1,-r*.6,-r*1.05,0,-r*.4);g.bezierCurveTo(r*.6,-r*1.05,r*1.3,-r*.1,0,r*.8)}
  else if(k===2){g.arc(0,0,r*.8,0,Math.PI*2)}
  else{g.moveTo(-r*.25,-r);g.lineTo(r*.55,-r);g.lineTo(r*.05,-r*.1);g.lineTo(r*.5,-r*.1);g.lineTo(-r*.45,r);g.lineTo(-r*.05,r*.05);g.lineTo(-r*.5,r*.05);g.closePath()}}
function ssSticker(g,k,r,col){g.lineJoin='round';ssShape(g,k,r);g.lineWidth=r*.38;g.strokeStyle='#fff';g.stroke();g.lineWidth=r*.1;g.strokeStyle='rgba(18,13,43,.35)';g.stroke();g.fillStyle=col;g.fill();
  g.save();g.clip();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(-r*.3,-r*.4,r*.45,r*.22,-.5,0,7);g.fill();g.restore()}
function ssBomb(g,W,H,base){g.fillStyle=base;g.fillRect(0,0,W,H);const R=mulberry(4242);
  for(let i=0;i<36;i++){const x=R()*W,y=R()*H,r=H*(.05+R()*.04),rot=(R()-.5)*1.4,col=SS_COL[i%6],k=i%4;
    for(const dx of [-W,0,W]){g.save();g.translate(x+dx,y);g.rotate(rot);ssSticker(g,k,r,col);g.restore()}}}
{const _pt=patternTex;patternTex=function(id,base){if(id!=='stkbomb')return _pt(id,base);return canvasTex('p_'+id+base,1024,512,(g,W,H)=>ssBomb(g,W,H,base))}}
{const _tm=trailMark;trailMark=function(k,x,y,a){if(progress.tskin!=='t_stk')return _tm(k,x,y,a);ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(((k*2.3)%6.28)-3.14);
  ssSticker(ctx,k%4,S*(.09+.03*(k%3)),SS_COL[k%6]);ctx.restore();return true}}
/* ---------- data ---------- */
function ssStars(){return sbData().stars||0}
function ssExtras(){const D=sbData();return SHZ.map(s=>[s,Math.max(0,(D.got[s[0]]||0)-1)]).filter(x=>x[1])}
function ssOwnedSp(S){return S.k==='gold'?false:ssHas(S.c,S.id)}
/* ---------- the shop screen ---------- */
let SSEL=null;
function openStkShop(){audio();sfx.click();if(!SSEL){SSEL=document.createElement('div');SSEL.className='ss';document.getElementById('app').appendChild(SSEL)}SSEL.hidden=false;ssRender(true)}
function ssClose(){sfx.click();SSEL.hidden=true;if(SB.el&&!SB.el.hidden){SB.view==='cover'?sbCover():sbPageView()}}
function ssRender(top){const D=sbData(),ex=ssExtras(),nEx=ex.reduce((a,x)=>a+x[1],0),val=ex.reduce((a,[s,n])=>a+n*SS_SELL[s[1]],0),L=lang==='he'?1:0,r=SSEL,y0=top?0:(r.querySelector('.ss-body')||{}).scrollTop||0;
  const miss=SHZ.filter(s=>!D.got[s[0]]);
  r.innerHTML=`<div class="sb-top"><button class="sb-rb sb-back" aria-label="back"></button><div class="sb-ttl"></div><div class="ss-pill big"><img src="art/ic_star.webp" alt=""><span>${ssStars()}</span></div></div>
    <div class="ss-body"><p class="ss-how"></p>
      <div class="ss-sell${nEx?'':' empty'}"><div class="ss-sh"><b></b></div><div class="ss-dups">${ex.slice(0,10).map(([s,n])=>`<span class="r-${s[1]}"><img src="art/stk_${s[0]}.webp" alt=""><i>×${n}</i></span>`).join('')}${ex.length>10?`<span class="more">+${ex.length-10}</span>`:''}</div>
        <button class="btn primary ss-sellbtn"${nEx?'':' disabled'}><span></span><img src="art/ic_star.webp" alt=""></button></div>
      <h4 class="ss-h"></h4><div class="ss-grid">${miss.length?miss.map(s=>`<button class="ss-it r-${s[1]}" data-id="${s[0]}"><span class="ss-art"><img src="art/stk_${s[0]}.webp" alt=""></span><small></small><em>${SS_BUY[s[1]]}<img src="art/ic_star.webp" alt=""></em></button>`).join(''):'<p class="ss-all"></p>'}</div>
      <h4 class="ss-h sp"></h4><div class="ss-grid sp">${SS_SPECIAL.map((S,i)=>`<button class="ss-it sp k-${S.k}${ssOwnedSp(S)?' ss-own':''}" data-sp="${i}"><span class="ss-art"></span><small></small><em>${ssOwnedSp(S)?'✓':S.p+'<img src="art/ic_star.webp" alt="">'}</em></button>`).join('')}</div></div>`;
  const bk=r.querySelector('.sb-back');bk.innerHTML='<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="#120d2b" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';bk.onclick=ssClose;
  r.querySelector('.sb-ttl').textContent=t('ssTitle');r.querySelector('.ss-how').textContent=t('ssHow');
  r.querySelector('.ss-sh b').textContent=nEx?t('ssDoubles',{n:nEx}):t('ssNoDup');r.querySelector('.ss-sellbtn span').textContent=t('ssSell',{n:val});
  r.querySelector('.ss-sellbtn').onclick=()=>ssSell();
  r.querySelector('.ss-h').textContent=t('ssPick');r.querySelector('.ss-h.sp').textContent=t('ssSpecial');{const a=r.querySelector('.ss-all');if(a)a.textContent=t('ssAllGot')}
  r.querySelectorAll('.ss-it[data-id]').forEach(b=>{const s=SHZ.find(x=>x[0]===b.dataset.id);b.querySelector('small').textContent=L?s[3]:s[2];b.onclick=()=>ssAsk(L?s[3]:s[2],SS_BUY[s[1]],()=>{D.got[s[0]]=1;ssPaid(SS_BUY[s[1]]);ssWin(`art/stk_${s[0]}.webp`,L?s[3]:s[2])})});
  r.querySelectorAll('.ss-it[data-sp]').forEach(b=>{const S=SS_SPECIAL[+b.dataset.sp],art=b.querySelector('.ss-art'),nm=S.k==='gold'?t('sbGold'):S.k==='pat'?wName('pattern','stkbomb'):t('sk_t_stk');b.querySelector('small').textContent=nm;
    if(S.k==='gold')art.innerHTML='<img src="art/sb_gpack.webp" alt="">';else{const c=document.createElement('canvas');c.width=c.height=120;const g=c.getContext('2d');
      if(S.k==='pat'){g.save();g.beginPath();g.ellipse(60,64,40,52,0,0,7);g.clip();g.fillStyle='#4ad8ff';g.fillRect(0,0,120,120);const R=mulberry(77);for(let k=0;k<11;k++){g.save();g.translate(24+R()*72,18+R()*92);g.rotate((R()-.5)*1.4);ssSticker(g,k%4,9+R()*5,SS_COL[k%6]);g.restore()}g.restore();g.lineWidth=5;g.strokeStyle='#120d2b';g.beginPath();g.ellipse(60,64,40,52,0,0,7);g.stroke();
        g.fillStyle='#fff';for(const ex of [46,74]){g.beginPath();g.ellipse(ex,54,8,11,0,0,7);g.fill();g.stroke()}}
      else{for(let i=0;i<5;i++){g.save();g.translate(18+i*22,96-i*17+Math.sin(i)*6);g.rotate(i*.7);g.globalAlpha=.45+i*.13;ssSticker(g,i%4,9+i*1.6,SS_COL[i]);g.restore()}}art.appendChild(c)}
    b.onclick=()=>{if(ssOwnedSp(S)){sfx.click();noteToast(t('ssWear'));return}ssAsk(nm,S.p,()=>{ssPaid(S.p);if(S.k==='gold'){D.gpacks=(D.gpacks||0)+1;ssWin('art/sb_gpack.webp',nm)}
      else{if(S.c==='trail'){if(!wallet().skins.includes(S.id))progress.skins.push(S.id)}else{progress.owned[S.c]=progress.owned[S.c]||[];if(!progress.owned[S.c].includes(S.id))progress.owned[S.c].push(S.id)}ssWin(null,nm,art.firstChild)}})}});
  const bd=r.querySelector('.ss-body');bd.scrollTop=y0}
function ssPaid(n){const D=sbData();D.stars=Math.max(0,(D.stars||0)-n);saveProgress();try{stkBadge()}catch(e){}}
function ssSell(){const D=sbData(),ex=ssExtras();if(!ex.length)return;let v=0;ex.forEach(([s,n])=>{v+=n*SS_SELL[s[1]];D.got[s[0]]=1});D.stars=(D.stars||0)+v;saveProgress();
  const from=SSEL.querySelector('.ss-sellbtn'),to=SSEL.querySelector('.ss-pill');sfx.flourish(2);vib([20,30,20]);ssFly(from,to,()=>{ssRender();popupToast(t('ssSold',{n:v}))})}
function ssFly(from,to,done){const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();for(let k=0;k<6;k++){const im=document.createElement('img');im.src='art/ic_star.webp';im.className='fly-coin';const x0=a.left+a.width/2-13+(k-2.5)*10,y0=a.top+a.height/2-13;im.style.left=x0+'px';im.style.top=y0+'px';document.body.appendChild(im);
  setTimeout(()=>{im.style.transform=`translate(${b.left+14-x0}px,${b.top+4-y0}px) scale(.8)`;im.style.opacity='0'},30+k*70);setTimeout(()=>{im.remove();if(sfx.ok())tone({f:900+k*80,d:.06,type:'sine',v:.05});if(k===5&&done)done()},800+k*70)}}
function ssAsk(name,price,ok){sfx.click();const have=ssStars();if(have<price){sfx.locked();noteToast(t('ssNeed',{n:price-have}));return}
  const m=document.createElement('div');m.className='ss-ask';m.innerHTML=`<div class="ss-box"><p></p><div class="row"><button class="btn ss-no"><span></span></button><button class="btn primary ss-yes"><span></span><img src="art/ic_star.webp" alt=""></button></div></div>`;
  m.querySelector('p').textContent=t('ssBuyQ',{x:name,n:price});m.querySelector('.ss-no span').textContent=t('ssCancel');m.querySelector('.ss-yes span').textContent=t('ssBuy')+' '+price;
  m.querySelector('.ss-no').onclick=()=>{sfx.click();m.remove()};m.onclick=e=>{if(e.target===m){sfx.click();m.remove()}};m.querySelector('.ss-yes').onclick=()=>{m.remove();ok()};SSEL.appendChild(m)}
function ssWin(src,name,cv){sfx.flourish(3);vib([30,40,30]);const m=document.createElement('div');m.className='ss-win';m.innerHTML=`<div class="ss-wc"><div class="rays"></div><div class="art"></div><b></b><small></small><button class="btn primary"><span></span></button></div>`;
  const art=m.querySelector('.art');if(src){const im=document.createElement('img');im.src=src;im.alt='';art.appendChild(im)}else if(cv){const c=document.createElement('canvas');c.width=c.height=120;c.getContext('2d').drawImage(cv,0,0);art.appendChild(c)}
  m.querySelector('b').textContent=t('ssGotIt');m.querySelector('small').textContent=name;m.querySelector('.btn span').textContent='OK';m.querySelector('.btn').onclick=()=>{sfx.click();m.remove();ssRender()};SSEL.appendChild(m)}
/* ---------- album: a star pill next to the coins opens the shop (red dot = doubles to sell) ---------- */
{const _w=sbWireTop;sbWireTop=function(r){const x=_w.apply(this,arguments);try{const cp=r.querySelector('.sb-top .coin-pill');if(cp&&!r.querySelector('.ss-pill')){const b=document.createElement('button');b.className='ss-pill';b.setAttribute('aria-label',t('ssTitle'));
  b.innerHTML=`<img src="art/ic_star.webp" alt=""><span>${ssStars()}</span>${ssExtras().length?'<i class="dot"></i>':''}`;b.onclick=openStkShop;cp.before(b)}}catch(e){}return x}}
