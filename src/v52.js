/* ===== v52: limited-time HOLIDAY EVENTS (US holidays, Tzach) — first one: HALLOWEEN =====
   EVENTS = calendar; evNow() = the running event (DEV_OPEN shows the next one early, marked "test").
   An event = 10 stages played in mode 'event' on one world (Halloween: the night farm, boss = Scarecrow King),
   an event currency (candy) and an event shop with items you can only get during the event.
   Design: ChatGPT mockup (design/halloween/). */
const EVENTS=[
  {id:'halloween',from:[10,15],to:[11,1],sid:'farmN',cur:'candy',deco:'halloween',
   items:[{c:'hat',id:'pumpkin',p:120},{c:'hat',id:'witch',p:150},{c:'color',id:'pumpkin',p:60},{c:'trail',id:'t_bats',p:90}]}];
Object.assign(I18N.en,{evWinFirst:'Win stage {n} first',ev_halloween:'Halloween',evLeft:'{n} days left',evOn:'Wearing',evOwned:'Owned',evAlmost:'So close! Try again',evDoneAll:'Event complete!',evBossDown:'Boss defeated!',evLeft1:'Last day!',evSoon:'Starts in {n} days',evTest:'Test mode',evPath:'Path',evShop:'Shop',evPlay:'Play',
  evStage:'Stage {n}',evBossStage:'Boss',evFinal:'Final boss',evOnly:'Only during {n}',evGot:'Yours!',evNeed:'Need more {n}',cur_candy:'Candy',evClear:'Stage clear!',evBossClear:'Boss beaten!',
  evAgain:'Again',evBack:'Event',evDone:'All stages done! Replay for more candy',evFirst:'First clear bonus',evs_halloween:'Halloween',evExcl:'Exclusive items for a limited time!',evEnded:'This event has ended'});
Object.assign(I18N.he,{evWinFirst:'קודם מנצחים בשלב {n}',ev_halloween:'ליל כל הקדושים',evLeft:'נותרו {n} ימים',evOn:'בשימוש',evOwned:'נרכש',evAlmost:'כמעט! נסו שוב',evDoneAll:'האירוע הושלם!',evBossDown:'הבוס הובס!',evLeft1:'יום אחרון!',evSoon:'מתחיל בעוד {n} ימים',evTest:'מצב בדיקה',evPath:'מסלול',evShop:'חנות',evPlay:'שחקו',
  evStage:'שלב {n}',evBossStage:'בוס',evFinal:'בוס סופי',evOnly:'רק ב{n}',evGot:'שלך!',evNeed:'צריך עוד {n}',cur_candy:'ממתקים',evClear:'השלב עבר!',evBossClear:'ניצחתם את הבוס!',
  evAgain:'שוב',evBack:'לאירוע',evDone:'סיימתם את כל השלבים! שחקו שוב בשביל עוד ממתקים',evFirst:'בונוס פעם ראשונה',evs_halloween:'האלווין',evExcl:'פריטים בלעדיים לזמן מוגבל!',evEnded:'האירוע נגמר'});
// event-only catalogue (not buyable with coins; wGate/csInfo show "only during …")
WHATX.pumpkin={p:120,w:1,ev:'halloween',n:['Pumpkin hat','כובע דלעת']};
WHATX.witch={p:150,w:1,ev:'halloween',n:['Witch hat','כובע מכשפה']};
WCOL.pumpkin={c:'#ff6200',p:60,ev:'halloween',n:['Pumpkin','דלעת']};
STYLE_SKINS.push({id:'t_bats',cat:'t',price:90,ev:'halloween'});
Object.assign(I18N.en,{sk_t_bats:'Bats'});Object.assign(I18N.he,{sk_t_bats:'עטלפים'});
const evItem=(c,id)=>{for(const E of EVENTS)for(const it of E.items)if(it.c===c&&it.id===id)return [E,it];return null};
// dates
function evDate(md,yr){return new Date(yr,md[0]-1,md[1])}
// the first window (starting last year, this year or next) that has not ended yet, so Dec 27 – Jan 2 is live on Jan 1 too
function evWindow(E,now=new Date()){const y0=now.getFullYear();for(const y of[y0-1,y0,y0+1]){const a=evDate(E.from,y),b=evDate(E.to,y);b.setHours(23,59,59);if(b<a)b.setFullYear(y+1);if(now<=b)return {a,b}}
  const a=evDate(E.from,y0+1),b=evDate(E.to,y0+1);b.setHours(23,59,59);if(b<a)b.setFullYear(y0+2);return {a,b}}
function evNow(){const now=new Date();let best=null;for(const E of EVENTS){const w=evWindow(E,now);if(now>=w.a&&now<=w.b)return {E,live:true,w};if(!best||w.a<best.w.a)best={E,live:false,w}}
  return typeof DEV_OPEN!=='undefined'&&DEV_OPEN&&best?best:null}
const evDays=ms=>Math.max(0,Math.ceil(ms/864e5));
function evData(id){progress.events=progress.events||{};const d=progress.events[id]=progress.events[id]||{cur:0,done:0,got:[]};return d}
const evZi=E=>Math.max(0,ZONES.findIndex(z=>z.sid===E.sid));
/* ---------- hub (path + shop) ---------- */
let EVEL=null,EVS=null;
function evRoot(){if(!EVEL){EVEL=document.createElement('div');EVEL.id='evhub';EVEL.hidden=true;document.body.appendChild(EVEL)}return EVEL}
function openEvent(tab){const N=evNow();if(!N)return;audio();sfx.click();const r=evRoot();r.hidden=false;r.dataset.ev=N.E.id;evHub(N,tab||'path')}
function closeEvent(){if(EVEL)EVEL.hidden=true;updateWalletUI();if(state==='title')updateLobby()}
function evCountTxt(N){const now=new Date();if(!N.live)return t('evSoon',{n:evDays(N.w.a-now)})+' · '+t('evTest');const d=evDays(N.w.b-now);return d<=1?t('evLeft1'):t('evLeft',{n:d})}
function evHub(N,tab){const E=N.E,D=evData(E.id),r=evRoot();r.className='ev-hub ev-'+E.id;
  r.innerHTML=`<div class="ev-top"><button class="x-btn ev-x" aria-label="close"></button><div class="ev-title"><b></b><small></small></div><div class="ev-cur"><img src="art/ev_${E.cur}.webp" alt=""><span></span></div></div>
    <div class="ev-tabs"><button data-t="path"></button><button data-t="shop"></button></div><div class="ev-body"></div>`;
  r.querySelector('.ev-x').innerHTML=XSVG;r.querySelector('.ev-x').onclick=()=>{sfx.click();closeEvent()};
  r.querySelector('.ev-title b').textContent=t('ev_'+E.id);r.querySelector('.ev-title small').textContent=evCountTxt(N);r.querySelector('.ev-cur span').textContent=D.cur;
  r.querySelectorAll('.ev-tabs button').forEach(b=>{b.textContent=t(b.dataset.t==='path'?'evPath':'evShop');b.classList.toggle('on',b.dataset.t===tab);b.onclick=()=>{sfx.click();evHub(N,b.dataset.t)}});
  const body=r.querySelector('.ev-body');if(tab==='shop')evShop(N,body);else evPath(N,body)}
function evPath(N,body){const E=N.E,D=evData(E.id),nx=Math.min(9,D.done);
  const wrap=document.createElement('div');wrap.className='ev-path';body.appendChild(wrap);
  // winding path: 10 nodes, bottom (stage 1) to top (boss)
  const pts=[];for(let i=0;i<10;i++){const y=i<9?5+i*8.3:88,x=50+Math.sin(i*1.25+.6)*28;pts.push([x,y])}// the boss gets more room: stage 9 hid behind it on small phones
  const svg=`<svg class="ev-road" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${pts.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' ')}"/></svg>`;wrap.innerHTML=svg;
  pts.forEach(([x,y],i)=>{const b=document.createElement('button'),boss=i===9,st=i<D.done?'done':i===nx?'next':'lock';b.className='ev-node '+st+(boss?' boss':'');b.style.left=x+'%';b.style.top=y+'%';
    b.innerHTML=boss?`<img src="art/ev_boss_${E.id}.webp" alt=""><i>${t('evFinal')}</i>`:`<img src="art/ev_node${st==='lock'?'_off':''}.webp" alt=""><i>${i+1}</i>`;
    b.setAttribute('aria-label',boss?t('evBossStage'):t('evStage',{n:i+1}));
    b.onclick=()=>{if(st==='lock'){sfx.locked();noteToast(t('evWinFirst',{n:nx+1}));return}sfx.click();evStart(i)};wrap.appendChild(b)});
  requestAnimationFrame(()=>{const h=wrap.clientHeight;if(h)wrap.style.setProperty('--evs',Math.max(.68,Math.min(1,h/540)).toFixed(3))});
  const foot=document.createElement('div');foot.className='ev-foot';
  if(D.done>=10){const p=document.createElement('p');p.textContent=t('evDone');foot.appendChild(p)}
  const pb=document.createElement('button');pb.className='btn primary ev-play';pb.innerHTML='<svg viewBox="0 0 24 24"><path d="M7 4.5 L19 12 L7 19.5 Z"/></svg><span></span>';pb.querySelector('span').textContent=t('evPlay')+' · '+(nx===9?t('evBossStage'):t('evStage',{n:nx+1}));
  pb.onclick=()=>{sfx.click();evStart(nx)};foot.appendChild(pb);body.appendChild(foot)}
function evThumb(c,id){if(c==='trail')return csStyleIcon(id);if(H3.state!=='ready'||typeof wThumb!=='function')return '';wThumb('hat','none');
  const L=Object.assign({},LOOK0,lookNow(),{hat:progress.skin||'none',glasses:'none'});if(c==='hat')L.hat=id;else L[c]=id;const key='ev|'+JSON.stringify(L);if(W3.thumbCache[key])return W3.thumbCache[key];
  const r=W3.thumbR,cam=W3.thumbCam,P=W3.thumbP;P.g.visible=true;applyLook(P,L);setFace3(P,2);cam.left=-1.05;cam.right=1.05;cam.top=c==='hat'?2.55:2.1;cam.bottom=c==='hat'?.35:-.05;cam.updateProjectionMatrix();r.render(W3.thumbS,cam);
  const url=r.domElement.toDataURL('image/png');W3.thumbCache[key]=url;return url}
function evShop(N,body){const E=N.E,D=evData(E.id);const g=document.createElement('div');g.className='ev-shop';body.appendChild(g);{const f=document.createElement('div');f.className='ev-shopnote';f.textContent=t('evExcl');body.appendChild(f)}
  E.items.forEach(it=>{const own=evOwned(it),b=document.createElement('button');b.className='ev-item'+(own?' ev-own':'');
    b.innerHTML=`<span class="th"><img alt=""></span><b></b><small></small><span class="pr"></span>`;const src=evThumb(it.c,it.id);if(src)b.querySelector('.th img').src=src;else b.querySelector('.th').classList.add('sw');
    if(it.c==='color')b.querySelector('.th').style.setProperty('--c',WCOL[it.id].c);
    b.querySelector('b').textContent=it.c==='trail'?t('sk_'+it.id):wName(it.c,it.id);b.querySelector('small').textContent=t('evOnly',{n:t('evs_'+E.id)});
    const pr=b.querySelector('.pr');if(own){const on=evWorn(it);pr.textContent=on?t('evOn'):'✓ '+t('evOwned');pr.classList.add('got');if(on)b.classList.add('worn')}else{pr.innerHTML=`<img src="art/ev_${E.cur}.webp" alt="">${it.p}`;if(D.cur<it.p)pr.classList.add('poor')}
    b.onclick=()=>{if(own){sfx.click();evWear(it);evHub(N,'shop');return}if(D.cur<it.p){sfx.locked();noteToast(t('evNeed',{n:t('cur_'+E.cur)}));return}
      D.cur-=it.p;evGive(it);saveProgress();sfx.coin(4);vib(20);evWear(it);evHub(N,'shop');popupToast(t('evGot'))};g.appendChild(b)})}
function evWorn(it){if(it.c==='hat')return progress.skin===it.id;if(it.c==='trail')return progress.tskin===it.id;return lookNow()[it.c]===it.id}
function evOwned(it){if(it.c==='hat')return wallet().skins.includes(it.id);if(it.c==='trail')return wallet().skins.includes(it.id);return (progress.owned[it.c]||[]).includes(it.id)}
function evGive(it){if(it.c==='hat'||it.c==='trail'){if(!wallet().skins.includes(it.id))progress.skins.push(it.id)}else{progress.owned[it.c]=progress.owned[it.c]||[];if(!progress.owned[it.c].includes(it.id))progress.owned[it.c].push(it.id)}}
function evWear(it){try{if(it.c==='trail')progress.tskin=it.id;else if(it.c==='hat')progress.skin=it.id;else lookNow()[it.c]=it.id;saveProgress();setHero3DSkin();rebakeIfNeeded()}catch(e){}}
// event items: never sold for coins in "My hero"
{const _g=wGate;wGate=function(cat,id){const e=evItem(cat==='hat'?'hat':cat,id);if(e&&!evOwned(e[1]))return t('evOnly',{n:t('ev_'+e[0].id)});return _g.apply(this,arguments)}}
{const _ci=csInfo;csInfo=function(c,id){const I=_ci.apply(this,arguments);const e=evItem(c==='trail'?'trail':c,id);if(e&&!evOwned(e[1])){I.gate=t('evOnly',{n:t('ev_'+e[0].id)});I.rar='leg'}return I}}
/* ---------- playing an event stage (mode 'event') ---------- */
let EVP=null;
// direct=true when already inside go() (pause → restart): go() ignores nested calls while busy
function evStart(i,direct){if(!direct&&busy)return;const N=evNow();if(!N){if(EVP)evExit(false);return}if(EVEL)EVEL.hidden=true;const E=N.E,zi=evZi(E);
  EVP={E,i,from:EVP?EVP.from:level,perf:0};mode='event';modeZi=zi;score=0;const run=()=>{startLevel(zi*LPZ+1+i);evDeco(true)};if(direct)run();else go(run)}
function evStageCandy(won){const boss=EVP.i===9,D=evData(EVP.E.id),first=won&&EVP.i>=D.done;const base=won?(boss?25:8):2,perf=Math.min(12,lv.perfect||0);return {base,perf,first:first?10:0,total:base+perf+(first?10:0)}}
function evFinish(won){if(evCnt)evCnt.hidden=true;const E=EVP.E,D=evData(E.id),R=evStageCandy(won);D.cur+=R.total;if(won&&EVP.i>=D.done)D.done=Math.min(10,EVP.i+1);saveProgress();
  const boss=EVP.i===9;
  showOverlay(()=>({title:won?(boss?t('evBossClear'):t('evClear')):t('whoops'),big:true,
    extra:card=>{card.classList.add('ev-res');{const hi=document.createElement('img');hi.className='ev-hero';hi.src=won?(boss?'art/ev_boss_'+E.id+'.webp':'art/ev_icon_'+E.id+'.webp'):'art/ev_node_off.webp';hi.alt='';card.appendChild(hi)}const rows=document.createElement('div');rows.className='ev-rows';
      const row=(lbl,n)=>{const d=document.createElement('div');d.className='ev-row';d.innerHTML=`<span></span><b><img src="art/ev_${E.cur}.webp" alt="">+${n}</b>`;d.querySelector('span').textContent=lbl;rows.appendChild(d)};
      row(boss?t('evBossStage'):t('evStage',{n:EVP.i+1}),R.base);if(R.perf)row(t('perfect')||'PERFECT',R.perf);if(R.first)row(t('evFirst'),R.first);if(R.jar)row(t('hsf_candyjar'),R.jar);card.appendChild(rows);if(!won){const al=document.createElement('p');al.className='ev-almost';al.textContent=t('evAlmost');card.insertBefore(al,rows)}
      if(won&&boss){card.classList.add('ev-boss');const bl=document.createElement('p');bl.className='ev-climax';bl.textContent=R.first?t('evDoneAll'):t('evBossDown');card.insertBefore(bl,rows)}
      const tot=document.createElement('div');tot.className='bn-coins ev-tot';tot.innerHTML=`<img src="art/ev_${E.cur}.webp" alt=""><b>+${R.total}</b>`;card.appendChild(tot)},
    actions:[...(won&&EVP.i<9?[{label:t('evPlay')+' · '+(EVP.i+1===9?t('evBossStage'):t('evStage',{n:EVP.i+2})),icon:'play',primary:true,fn:()=>{const n=EVP.i+1;hideOverlay();evStart(n)}}]:[]),
      {label:won?t('evBack'):t('evAgain'),icon:won?'map':'restart',primary:!won||EVP.i>=9,fn:()=>{hideOverlay();if(won)evExit(true);else evStart(EVP.i)}},
      ...(won?[]:[{label:t('evBack'),icon:'map',fn:()=>{hideOverlay();evExit(true)}}])]}));
  sfx.coin(3)}
function evExit(toHub){evDeco(false);const L=EVP?EVP.from:level;EVP=null;mode='levels';modeZi=null;level=L;go(()=>{toTitle();if(toHub)openEvent('path')})}
// wiring: goals/passives/countdown behave like a normal level; win/lose go to the event card
{const _ml=modeLanded;modeLanded=function(){if(mode==='event')return false;return _ml.apply(this,arguments)}}
{const _w=win;win=function(){if(mode!=='event'||!EVP)return _w.apply(this,arguments);if(state==='win')return;state='win';balance=computeBalance().maxR;updateHud();freeze=.15;
  sfx.flourish(3);for(let i=0;i<50;i++)particles.push({x:rnd(0,W),y:camY+rnd(-40,H*.25),vx:rnd(-60,60),vy:rnd(40,200),life:2,c:pick(['#ff7a1a','#8a4dff','#ffd23f','#2a2a2a']),sz:rnd(5,9),rot:rnd(0,6),vr:rnd(-8,8),conf:true});
  setTimeout(()=>{if(mode==='event'&&EVP)evFinish(true)},1300)}}
{const _mo=modeOver;modeOver=function(won){if(mode!=='event'||!EVP)return _mo.apply(this,arguments);evFinish(false)}}
{const _sm=startMode;startMode=function(m){if(m==='event'&&EVP){evStart(EVP.i,true);return}return _sm.apply(this,arguments)}}
{const _t=toTitle;toTitle=function(){if(mode==='event'&&!EVEL_KEEP){mode='levels';modeZi=null;if(EVP)level=EVP.from;EVP=null;evDeco(false)}return _t.apply(this,arguments)}}
let EVEL_KEEP=false;
{const _o=openMap;openMap=function(){if(mode==='event'){mode='levels';modeZi=null;if(EVP)level=EVP.from;EVP=null;evDeco(false)}return _o.apply(this,arguments)}}
// candy pops on PERFECT landings
let evCnt=null;
function evCounter(on){if(!evCnt){evCnt=document.createElement('div');evCnt.id='evCnt';evCnt.innerHTML='<img alt=""><b>0</b>';(document.getElementById('hud')||document.body).appendChild(evCnt)}evCnt.hidden=!on;if(on&&EVP){evCnt.querySelector('img').src='art/ev_'+EVP.E.cur+'.webp';evCnt.querySelector('b').textContent=Math.min(12,lv.perfect||0)}}
{const _p=popup;popup=function(txt,x,y,c,key,sub){const r=_p.apply(this,arguments);if(mode==='event'&&EVP&&(key==='perfect'||key==='wow')){evCounter(true);const d=document.createElement('div');d.className='ev-pop';d.innerHTML=`<img src="art/ev_${EVP.E.cur}.webp" alt="">+1`;const x0=Math.round(clamp(x+S*1.2,30,W-30)),y0=Math.round(sy(y));d.style.left=x0+'px';d.style.top=y0+'px';document.body.appendChild(d);
  const tr=evCnt.getBoundingClientRect(),dx=tr.left+tr.width*.3-x0,dy=tr.top+tr.height/2-y0;
  try{d.animate([{transform:'translate(-50%,-50%) scale(.6)',opacity:0},{transform:'translate(-50%,-80%) scale(1.15)',opacity:1,offset:.25},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.55)`,opacity:.9}],{duration:750,easing:'cubic-bezier(.5,0,.7,1)'}).onfinish=()=>{d.remove();evCounter(true);evCnt.classList.remove('pulse');void evCnt.offsetWidth;evCnt.classList.add('pulse')}}catch(e){setTimeout(()=>d.remove(),800)}}return r}}
{const _sl=startLevel;startLevel=function(){const r=_sl.apply(this,arguments);evCounter(mode==='event');return r}}
{const _hu=showHud;showHud=function(on){const r=_hu.apply(this,arguments);if(!on&&evCnt)evCnt.hidden=true;return r}}
/* ---------- Halloween decoration on the event world ---------- */
let EVD=null;
function evDeco(on){EVD=on&&EVP?{k:EVP.E.deco,bats:Array.from({length:5},()=>({x:rnd(0,1),y:rnd(.08,.4),s:rnd(.6,1.1),p:rnd(0,6),v:rnd(.03,.07)*(Math.random()<.5?-1:1)}))}:null}
{const _r=render;render=function(){_r.apply(this,arguments);if(!EVD||mode!=='event')return;const g=ctx;g.save();
  const mo=hzPic('ev_moon');if(mo){const s=W*.34;g.globalAlpha=.95;g.drawImage(mo,W*.66-s/2,H*.12-s/2+(camY-camTarget())*.05,s,s)}g.globalAlpha=1;
  const bat=hzPic('ev_bat');for(const b of EVD.bats){b.x+=b.v*frameDt;if(b.x<-.1)b.x=1.1;if(b.x>1.1)b.x=-.1;const fl=Math.sin(time*12+b.p);const s=S*.9*b.s,x=b.x*W,y=b.y*H+Math.sin(time*2+b.p)*10;
    if(bat){g.save();g.translate(x,y);g.scale(b.v<0?-1:1,.75+.25*Math.abs(fl));g.drawImage(bat,-s/2,-s/2,s,s);g.restore()}}
  const pk=hzPic('ev_pumpkin');if(pk){const gy=sy(yOf(0))+BH*.55,s=S*1.15;[[.08,1],[.92,.9],[.2,.75],[.8,.7]].forEach(([fx,k],j)=>{const yy=gy-(j>1?BH*.15:0);if(yy>H+s)return;g.save();g.globalAlpha=1;g.drawImage(pk,fx*W-s*k/2,yy-s*k,s*k,s*k);
    g.globalCompositeOperation='lighter';g.globalAlpha=.25+.12*Math.sin(time*7+j);const rg=g.createRadialGradient(fx*W,yy-s*k*.45,2,fx*W,yy-s*k*.45,s*k*.9);rg.addColorStop(0,'#ffb347');rg.addColorStop(1,'rgba(255,120,0,0)');g.fillStyle=rg;g.fillRect(fx*W-s*k,yy-s*k*1.4,s*k*2,s*k*2);g.restore()})}
  g.restore()}}
/* ---------- 3D hats + bats trail ---------- */
{const _bh=buildHat;buildHat=function(P,id){if(id!=='pumpkin'&&id!=='witch')return _bh(P,id);const T=P.T,s=P.hatSlot;
  const add=(m,x=0,y=0,z=0,ink=1.05)=>{m.position.set(x,y,z);s.add(m);if(ink){const k=new T.Mesh(m.geometry,INKM());k.scale.setScalar(ink);m.add(k)}return m};
  if(id==='pumpkin'){for(let i=0;i<8;i++){const a=i/8*Math.PI*2,l=add(wmesh(new T.SphereGeometry(.25,22,16),'#ff7a1a',{roughness:.45,clearcoat:.4}),Math.sin(a)*.2,.16,Math.cos(a)*.2);l.scale.set(.7,.95,.7)}
    add(wmesh(new T.SphereGeometry(.3,22,16),'#ff8a2a',{roughness:.45}),0,.16,0,0);const st=add(wmesh(new T.CylinderGeometry(.045,.07,.2,10),'#3f7a2a',{roughness:.7}),0,.44,0);st.rotation.z=.25;
    const lf=add(wmesh(new T.SphereGeometry(.1,12,8),'#4caf50',{roughness:.6}),.13,.42,0,0);lf.scale.set(1.3,.25,.7)}
  else{add(wmesh(new T.CylinderGeometry(.6,.6,.04,40),'#3b2470',{roughness:.6}),0,-.01,0,1.03);const c=add(wmesh(new T.ConeGeometry(.33,.85,32),'#3b2470',{roughness:.6}),.06,.42,0);c.rotation.z=-.25;
    add(wmesh(new T.CylinderGeometry(.335,.34,.09,32),'#ff7a1a',{roughness:.4}),0,.05,0,0);add(wmesh(new T.BoxGeometry(.12,.1,.04),'#ffd23f',{metalness:.6,roughness:.25}),0,.05,.33,0)}}}
{const _tm=trailMark;trailMark=function(k,x,y,a){if(progress.tskin!=='t_bats')return _tm(k,x,y,a);ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(Math.sin(k*1.7)*.3);
  const w=S*.32,f=Math.sin(time*18+k)*.5+.5;ctx.fillStyle='#2a1640';ctx.beginPath();ctx.ellipse(0,0,w*.28,w*.22,0,0,7);ctx.fill();
  for(const sx of[-1,1]){ctx.beginPath();ctx.moveTo(sx*w*.2,0);ctx.quadraticCurveTo(sx*w*.7,-w*(.35+.35*f),sx*w,-w*.05);ctx.quadraticCurveTo(sx*w*.75,w*.05,sx*w*.6,w*.18);ctx.quadraticCurveTo(sx*w*.45,w*.05,sx*w*.2,w*.1);ctx.fill()}
  ctx.fillStyle='#ffb347';ctx.fillRect(-w*.12,-w*.06,w*.07,w*.05);ctx.fillRect(w*.05,-w*.06,w*.07,w*.05);ctx.restore();return true}}
/* ---------- lobby banner ---------- */
{const lb=document.createElement('button');lb.id='lobEvent';lb.className='ev-banner';lb.hidden=true;lb.innerHTML='<img src="art/ev_icon_halloween.webp" alt=""><span><b></b><small><i>⏱</i><em></em></small></span>';lb.onclick=()=>openEvent('path');
  const sec=document.getElementById('title');const logo=sec&&sec.querySelector('.logo');if(logo)logo.after(lb);else if(sec)sec.appendChild(lb)}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);const b=document.getElementById('lobEvent');if(b){const N=evNow();b.hidden=!N||!progress.tut;if(N){b.className='ev-banner ev-'+N.E.id;b.querySelector('img').src='art/ev_icon_'+N.E.id+'.webp';b.querySelector('b').textContent=t('ev_'+N.E.id);b.querySelector('small em').textContent=N.live?evCountTxt(N):t('evSoon',{n:evDays(N.w.a-new Date())})}}return r}}
