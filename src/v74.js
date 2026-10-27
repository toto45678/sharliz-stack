/* ===== v74: CHRISTMAS EVENT (Tzach, Oct 27: "Christmas is coming, its mini-game should open on the right date", then "it must be much
   harder, or open a few tries a day with an option to buy more"; on a card he chose both) =====
   Dec 15-26 on the v52 event system: the day snow world (boss Yeti Freezy, in a Santa hat on the path), candy canes, 4 items sold only here.
   HARDER: 60% of the way to the harder levels-mode DIFF (E.hard → dfMix: faster swing, narrower perfect), tiers 1.5 → 2.3 (E.et → etOf) and
   its own floor goals 10 → 14 (E.goal → lvGoal; tall towers swing much faster, so higher goals made the end unwinnable). Timing bot
   (20 runs a stage): a 9-year-old wins stage 1 ~80%, stage 5 ~55%, stage 9 ~30%, the boss ~12% (Halloween: 95/90/75/40%); adults 100/94/56/56%. TRIES (E.tries): starting a stage costs a try and a win gives it
   back, so only a loss or a quit uses one (like lives); 5 a day (back at local midnight), more for coins (EV_TRY), which never expire.
   Finishing all 10 stages = the Star Shield for the level-200 spaceship game (progress.ship.got[E.prize]; Tzach: "things you only get if you
   finish everything", never sold). DEV_OPEN: ?ev=christmas shows it early as a test. Art: the graphics department (design/christmas/). */
EVENTS.push({id:'christmas',from:[12,15],to:[12,26],sid:'snow',cur:'cane',deco:'christmas',node:'ev_node_christmas',tries:5,hard:.6,et:i=>i<9?1.5+i*.1:2,goal:[10,10,11,11,12,12,13,13,14],prize:'xmasShield',
  conf:['#e8283a','#ffffff','#2fb24a','#ffd23f'],
  items:[{c:'hat',id:'santa',p:150},{c:'hat',id:'antlers',p:120},{c:'pattern',id:'cane',p:100},{c:'trail',id:'t_snow',p:90}]});
const EV_TRY={n:3,p:150};// 3 more tries for 150 coins
Object.assign(I18N.en,{ev_christmas:'Christmas',evs_christmas:'Christmas',cur_cane:'Candy canes',sk_t_snow:'Snowflakes',evTries:'Tries today',evNoTry:'Out of tries!',
  evTryWhy:'Losing a stage uses a try. Winning keeps it.',evTryIn:'New tries in {n}',evBuyTry:'+{n} tries',evLater:'Later',evMore:'More tries',evTryLeft:'Tries left today: {n}',
  evPrize:'Finish all 10 stages: Star Shield!',evPrizeGot:'Star Shield for your spaceship!',evPrizeSub:'Your spaceship opens at level 200'});
Object.assign(I18N.he,{ev_christmas:'כריסמס',evs_christmas:'כריסמס',cur_cane:'מקלות סוכר',sk_t_snow:'פתיתי שלג',evTries:'ניסיונות היום',evNoTry:'נגמרו הניסיונות!',
  evTryWhy:'הפסד בשלב מוריד ניסיון. ניצחון לא.',evTryIn:'ניסיונות חדשים בעוד {n}',evBuyTry:'+{n} ניסיונות',evLater:'אחר כך',evMore:'עוד ניסיונות',evTryLeft:'נשארו היום {n} ניסיונות',
  evPrize:'סיימו את כל 10 השלבים: מגן כוכב!',evPrizeGot:'מגן כוכב לחללית שלך!',evPrizeSub:'החללית שלך נפתחת בשלב 200'});
WHATX.santa={p:150,w:1,ev:'christmas',n:['Santa hat','כובע סנטה']};
WHATX.antlers={p:120,w:1,ev:'christmas',n:['Reindeer antlers','קרני אייל']};
WPAT.cane={p:100,ev:'christmas',n:['Candy cane','מקל סוכר']};
STYLE_SKINS.push({id:'t_snow',cat:'t',price:90,ev:'christmas'});
// test preview on the web: ?ev=<id> shows that event (as "test" until its dates)
{const _n=evNow;evNow=function(){const q=typeof DEV_OPEN!=='undefined'&&DEV_OPEN&&new URLSearchParams(location.search).get('ev'),E=q&&EVENTS.find(e=>e.id===q);
  if(E){const now=new Date(),w=evWindow(E,now);return {E,live:now>=w.a&&now<=w.b,w}}return _n.apply(this,arguments)}}
/* ---------- difficulty (etOf / dfMix in build.py ask these) ---------- */
function evEt(){return EVP&&EVP.E.et?EVP.E.et(EVP.i):1.5}
function evHard(){return EVP&&EVP.E.hard||0}
function evGoal(k){return EVP&&EVP.E.goal&&EVP.E.goal[k]||0}
/* ---------- tries ---------- */
function evTries(E){const D=evData(E.id),d=today();let T=D.tr;if(!T||T.d!==d)T=D.tr={d,left:E.tries,extra:T?T.extra||0:0};return T}
const evTryN=E=>{const T=evTries(E);return T.left+T.extra};
function evTryTake(E){const T=evTries(E);if(T.left>0){T.left--;return 'left'}if(T.extra>0){T.extra--;return 'extra'}return ''}
function evTryBack(E,b){const T=evTries(E);if(b==='left')T.left=Math.min(E.tries,T.left+1);else if(b==='extra')T.extra++}
const evMidnight=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate()+1)-n};
const evHMS=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/3600)+':'+String(Math.floor(s/60)%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
function evBuyTries(E){if((progress.coins||0)<EV_TRY.p){sfx.locked();noteToast(t('needCoins'));return false}
  progress.coins-=EV_TRY.p;evTries(E).extra+=EV_TRY.n;saveProgress();updateWalletUI();sfx.coin(4);vib(20);return true}
// the "out of tries" / "more tries" window: on <body>, above the event screen and the game card. then() runs after a purchase, later() on "Later"
let EVO=null;
function evOutClose(){if(EVO){clearInterval(EVO.iv);EVO.el.remove();EVO=null}}
function evOut(N,then,later){evOutClose();if(!N)return;const E=N.E,out=evTryN(E)<=0,el=document.createElement('div');el.id='evOut';el.className='ev-modal ev-'+E.id;
  el.innerHTML=`<div class="evm-card"><img class="evm-ic" src="art/${E.node||'ev_node'}${out?'_off':''}.webp" alt=""><b class="evm-t"></b><p class="evm-p"></p><p class="evm-c"><i>⏱</i><span></span></p>
    <button class="btn primary evm-buy"><span></span><em>${coinImg()}${EV_TRY.p}</em></button><button class="btn evm-no"></button></div>`;
  el.querySelector('.evm-t').textContent=out?t('evNoTry'):t('evMore');el.querySelector('.evm-p').textContent=t('evTryWhy');
  el.querySelector('.evm-buy span').textContent=t('evBuyTry',{n:EV_TRY.n});el.querySelector('.evm-no').textContent=t('evLater');
  const cd=el.querySelector('.evm-c');cd.hidden=!out;const tick=()=>{cd.querySelector('span').textContent=t('evTryIn',{n:evHMS(evMidnight())});
    if(out&&evTryN(E)>0){evOutClose();if(EVEL&&!EVEL.hidden)evHub(N,'path')}};tick();
  if((progress.coins||0)<EV_TRY.p)el.querySelector('.evm-buy').classList.add('poor');
  el.querySelector('.evm-buy').onclick=()=>{if(!evBuyTries(E))return;evOutClose();if(EVEL&&!EVEL.hidden)evHub(N,'path');popupToast(t('evBuyTry',{n:EV_TRY.n}));if(then)then()};
  el.querySelector('.evm-no').onclick=()=>{sfx.click();evOutClose();if(later)later()};
  document.body.appendChild(el);EVO={el,iv:setInterval(tick,1000)}}
{const _s=evStart;evStart=function(i,direct){const N=evNow();if(!N||!N.E.tries||(!direct&&busy))return _s.apply(this,arguments);const E=N.E;
  if(evTryN(E)<=0){
    // pause → restart with no tries left: back to the event screen (already inside go(), so no second transition)
    if(direct){evDeco(false);const L=EVP?EVP.from:level;EVP=null;mode='levels';modeZi=null;level=L;toTitle();openEvent('path');evOut(evNow());return}
    const inHub=EVEL&&!EVEL.hidden;evOut(N,()=>evStart(i),inHub?null:()=>{if(mode==='event')evExit(true)});return}
  const b=evTryTake(E),was=EVP;saveProgress();_s.apply(this,arguments);if(EVP&&EVP!==was)EVP.paid=b;else evTryBack(E,b)}}
/* ---------- the Star Shield (a ship upgrade for the level-200 spaceship game, only for finishing everything) ---------- */
const EV_SHIELD='<svg class="ev-shield" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="evsb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ff0ff"/><stop offset="1" stop-color="#2a6bff"/></linearGradient><radialGradient id="evsg" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#fff8c8"/><stop offset=".55" stop-color="#ffd23f"/><stop offset="1" stop-color="#f08c00"/></radialGradient></defs>'
  +'<path d="M32 4 L56 13 V31 C56 46 45 56 32 60 C19 56 8 46 8 31 V13 Z" fill="url(#evsb)" stroke="#120d2b" stroke-width="4" stroke-linejoin="round"/>'
  +'<path d="M32 15 l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3-9.3-4.9-9.3 4.9 1.8-10.3-7.5-7.3 10.4-1.5z" fill="url(#evsg)" stroke="#120d2b" stroke-width="3" stroke-linejoin="round"/>'
  +'<path d="M15 16 L29 11" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/></svg>';
const evPrizeGot=E=>!!(progress.ship&&progress.ship.got&&progress.ship.got[E.prize]);
function evPrizeGive(E){progress.ship=progress.ship||{};progress.ship.got=progress.ship.got||{};progress.ship.got[E.prize]=1}
function evPrizeRow(E,got){const d=document.createElement('div');d.className='ev-prize'+(got?' got':'');d.innerHTML=EV_SHIELD+'<span><b></b><small></small></span>';
  d.querySelector('b').textContent=got?t('evPrizeGot'):t('evPrize');d.querySelector('small').textContent=t('evPrizeSub');return d}
/* ---------- event screen: tries + prize above the Play button ---------- */
{const _p=evPath;evPath=function(N,body){_p.apply(this,arguments);const E=N.E,foot=body.querySelector('.ev-foot');if(!foot||(!E.tries&&!E.prize))return;const pb=foot.querySelector('.ev-play');
  if(E.prize){const w=body.querySelector('.ev-path');if(w)w.appendChild(evPrizeRow(E,evPrizeGot(E)))}
  if(!E.tries)return;const T=evTries(E),row=document.createElement('div');row.className='ev-tries';
  row.innerHTML=`<span class="evt-l"></span><span class="evt-ic">${Array.from({length:E.tries},(_,k)=>`<img class="${k<T.left?'on':''}" src="art/${E.node}.webp" alt="">`).join('')}</span>${T.extra?`<em>+${T.extra}</em>`:''}<button class="evt-buy">+</button>`;
  row.querySelector('.evt-l').textContent=t('evTries');const bb=row.querySelector('.evt-buy');bb.setAttribute('aria-label',t('evMore'));bb.onclick=()=>{sfx.click();evOut(N)};
  foot.insertBefore(row,pb);
  if(evTryN(E)<=0){pb.classList.add('ev-out');pb.querySelector('span').textContent=t('evMore');pb.onclick=()=>{sfx.click();evOut(N,()=>evStart(Math.min(9,evData(E.id).done)))}}}}
// shop thumbnails: a hat whose matcap pictures are still loading would be cached black, so wait for them and draw the shop again
{const _t=evThumb;evThumb=function(c,id){const S=window.SL_H;if(c==='hat'&&S&&S.HAT_PIC[id]){let wait=0;for(const x of[].concat(S.HAT_PIC[id])){const e=S.hatTex(x,/^mat_/.test(x));if(!e.ready){wait=1;if(!e.evW){e.evW=1;e.fns.push(()=>{for(const k in W3.thumbCache)if(k.startsWith('ev|'))delete W3.thumbCache[k];const N=evNow();if(N&&EVEL&&!EVEL.hidden&&EVEL.querySelector('.ev-shop'))evHub(N,'shop')})}}}if(wait)return ''}return _t.apply(this,arguments)}}
/* ---------- result card: tries left after a loss, a won try comes back, the Star Shield on the full clear ---------- */
{const _f=evFinish;evFinish=function(won){const E=EVP&&EVP.E,d0=E?evData(E.id).done:0;if(E&&E.tries&&won&&EVP.paid){evTryBack(E,EVP.paid);EVP.paid=''}
  const first=!!(E&&E.prize&&won&&d0<10&&EVP.i===9&&!evPrizeGot(E));
  const r=_f.apply(this,arguments);
  try{const body=document.querySelector('#card .card-body.ev-res');
    if(first&&evData(E.id).done>=10){evPrizeGive(E);saveProgress();if(body){const p=evPrizeRow(E,true);p.classList.add('ev-new');const at=body.querySelector('.ev-rows');body.insertBefore(p,at);sfx.flourish&&sfx.flourish(4)}}
    if(E&&E.tries&&!won&&body){const p=document.createElement('p');p.className='ev-tryleft';p.textContent=t('evTryLeft',{n:evTryN(E)});const al=body.querySelector('.ev-almost');if(al)al.after(p);else body.prepend(p)}}catch(e){console.warn('evFinish v74',e)}
  return r}}
/* ---------- candy-cane pattern + snowflake trail ---------- */
{const _pt=patternTex;patternTex=function(id,base){if(id!=='cane')return _pt(id,base);
  return canvasTex('p_'+id+base,1024,512,(g,W,H)=>{g.fillStyle=base;g.fillRect(0,0,W,H);const P=W/8,k=.75;// 8 diagonal repeats around the body, so u wraps without a seam
    const band=(o,w,c)=>{g.fillStyle=c;for(let i=-3;i<12;i++){const x=i*P+o;g.beginPath();g.moveTo(x,0);g.lineTo(x+w,0);g.lineTo(x+w-H*k,H);g.lineTo(x-H*k,H);g.closePath();g.fill()}};
    band(0,P*.42,'#ffffff');band(P*.56,P*.12,'#e3203a');band(P*.75,P*.05,'#2fa84a')})}}
function xmFlake(g,x,y,s,r,a){g.save();g.translate(x,y);g.rotate(r);g.globalAlpha=a;g.lineCap='round';
  const arms=()=>{g.beginPath();for(let k=0;k<6;k++){const q=k*Math.PI/3,c=Math.cos(q),d=Math.sin(q),m=s*.55,b=s*.3;g.moveTo(0,0);g.lineTo(c*s,d*s);for(const sg of[-1,1]){const q2=q+sg*.75;g.moveTo(c*m,d*m);g.lineTo(c*m+Math.cos(q2)*b,d*m+Math.sin(q2)*b)}}g.stroke()};
  g.strokeStyle='rgba(70,120,190,.55)';g.lineWidth=Math.max(2.5,s*.3);arms();g.strokeStyle='#ffffff';g.lineWidth=Math.max(1.4,s*.14);arms();g.restore()}
{const _tm=trailMark;trailMark=function(k,x,y,a){if(progress.tskin!=='t_snow')return _tm(k,x,y,a);xmFlake(ctx,x,y,S*(.11+.035*(k%3)),k*.9+time*.6,a);return true}}
/* ---------- Christmas decoration on the event world: a sleigh across the sky (behind the hills), trees and presents at the foot of the tower ---------- */
{const _d=evDeco;evDeco=function(on){_d.apply(this,arguments);if(!EVD||EVD.k!=='christmas')return;
  EVD.sl={at:time+rnd(2.5,5),x:-1,y:.2};
  EVD.fl=Array.from({length:7},()=>({x:rnd(0,1),y:rnd(0,1),s:rnd(.7,1.3),r:rnd(0,6),v:rnd(.035,.07),vr:rnd(-.8,.8)}));
  EVD.tw=Array.from({length:16},(_,k)=>({j:k%2,u:rnd(-1,1),v:rnd(.25,.86),p:rnd(0,6),c:pick(['#ff3b4f','#ffd23f','#6ee8ff','#8dff6a','#ff9ad5'])}))}}
function xmSleigh(){const s=EVD.sl,im=hzPic('ev_sleigh');if(!s||!im)return;
  if(s.x<0){if(time<s.at)return;s.x=0;s.y=rnd(.14,.24)}s.x+=Math.min(.05,frameDt)/8;if(s.x>1){s.x=-1;s.at=time+rnd(14,22);return}
  const w=S*2.1,h=w*im.naturalHeight/im.naturalWidth,x=-w+s.x*(W+w*2),y=H*s.y+Math.sin(s.x*Math.PI*2)*H*.015;ctx.save();
  for(let k=1;k<12;k++){const f=1-k/12,tx=x-w*.42-k*w*.13,ty=y+h*.12+Math.sin(time*6+k)*3;ctx.globalAlpha=f*.85;ctx.fillStyle=k%3?'#ffe58a':'#ffffff';ctx.beginPath();ctx.arc(tx,ty,f*S*.07+1,0,7);ctx.fill()}
  ctx.globalAlpha=1;ctx.drawImage(im,x-w/2,y-h/2,w,h);ctx.restore()}
{const _bb=drawBossBack;drawBossBack=function(){const r=_bb.apply(this,arguments);if(EVD&&EVD.k==='christmas'&&mode==='event')try{xmSleigh()}catch(e){}return r}}
{const _r=render;render=function(){_r.apply(this,arguments);if(!EVD||EVD.k!=='christmas'||mode!=='event')return;const g=ctx;g.save();
  for(const f of EVD.fl){f.y+=f.v*Math.min(.05,frameDt);f.r+=f.vr*Math.min(.05,frameDt);if(f.y>1.05){f.y=-.05;f.x=rnd(0,1)}xmFlake(g,f.x*W+Math.sin(time*.7+f.r)*14,f.y*H,S*.15*f.s,f.r,.7)}
  const tr=hzPic('ev_xtree'),gf=hzPic('ev_gifts'),gy=sy(yOf(0))+BH*.55;
  if(tr){[[.09,1.95],[.92,1.6]].forEach(([fx,k],j)=>{const w=S*k,h=w*tr.naturalHeight/tr.naturalWidth,x=fx*W,top=gy-h;if(top>H)return;g.globalAlpha=1;g.drawImage(tr,x-w/2,top,w,h);
    g.save();g.globalCompositeOperation='lighter';for(const q of EVD.tw){if(q.j!==j)continue;const a=.5+.5*Math.sin(time*3.2+q.p);if(a<.35)continue;const px=x+q.u*w*.36*q.v,py=top+h*q.v,rr=S*.13*a,rg=g.createRadialGradient(px,py,0,px,py,rr);
      rg.addColorStop(0,q.c);rg.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=.7*a;g.fillStyle=rg;g.fillRect(px-rr,py-rr,rr*2,rr*2)}g.restore()})}
  if(gf){[[.25,1.05],[.77,.9]].forEach(([fx,k])=>{const w=S*k,h=w*gf.naturalHeight/gf.naturalWidth,top=gy-h+BH*.05;if(top>H)return;g.globalAlpha=1;g.drawImage(gf,fx*W-w/2,top,w,h)})}
  g.restore()}}
