/* ===== v36: cleaner play screen (toast lane instead of popups over the action) + a nicer level-end card ===== */
Object.assign(I18N.en,{cSkill:'Skill',cBonus:'Bonuses',perfect3:'PERFECT!'});
Object.assign(I18N.he,{cSkill:'מיומנות',cBonus:'בונוסים',perfect3:'מושלם!'});

/* --- popups: landing feedback stays next to the tower (small); every other message goes to a quiet toast lane under the HUD --- */
const TOASTS=[],TOAST_SEEN={};
function toast(text,c){text=String(text);const now=performance.now()/1000;if(Object.keys(TOAST_SEEN).length>60)for(const k in TOAST_SEEN)delete TOAST_SEEN[k];if(TOAST_SEEN[text]&&now-TOAST_SEEN[text]<1.4)return;TOAST_SEEN[text]=now;
  const live=TOASTS.find(q=>q.text===text&&q.t<q.life-.3);if(live){live.t=Math.min(live.t,.25);return}
  TOASTS.push({text,c:/^#[0-9a-f]{6}$/i.test(c||'')?c:'#ffffff',t:0,life:1.9});while(TOASTS.length>3)TOASTS.shift()}
{const _pp=popup;popup=function(text,x,y,c,key,sub){
  if(text===t('nice'))return;                                   // too frequent – the sound is enough
  if(key&&key!=='gust')return _pp(text,x,y,c,key,sub);           // perfect / great / wow next to the landed piece
  if(/^[-+]\d/.test(String(text)))return _pp(text,x,y,c);        // boss damage numbers stay on the boss
  toast(text,c)}}
let _sab=null;const safeB=()=>{if(_sab===null){try{const d=document.createElement('div');d.style.cssText='position:fixed;bottom:0;height:0;padding-bottom:env(safe-area-inset-bottom)';document.body.appendChild(d);_sab=parseFloat(getComputedStyle(d).paddingBottom)||0;d.remove()}catch(e){_sab=0}}return _sab};
function drawToasts(){if(!TOASTS.length)return;const dt=Math.min(.05,frameDt||.016);
  const fs=Math.round(Math.max(13,Math.min(17,S*.24)));
  ctx.save();ctx.font=`${fs}px "Rubik","Secular One",system-ui,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.direction=(typeof lang!=='undefined'&&I18N[lang]._dir==='rtl')?'rtl':'ltr';
  let row=0;for(let i=TOASTS.length-1;i>=0;i--){const q=TOASTS[i];q.t+=dt;if(q.t>q.life){TOASTS.splice(i,1);continue}}
  for(const q of TOASTS){const inA=Math.min(1,q.t/.18),outA=Math.min(1,(q.life-q.t)/.3),a=Math.min(inA,outA),w=Math.min(W*.86,ctx.measureText(q.text).width+fs*2.2),h=fs*1.9,
      y=H-safeB()-h*3.3-row*(h+6)+(1-inA)*10,x=W/2;row++;
    ctx.globalAlpha=a*.92;ctx.fillStyle='rgba(18,13,43,.78)';roundRect(x-w/2,y,w,h,h/2);ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=q.c;ctx.globalAlpha=a*.7;ctx.stroke();
    ctx.globalAlpha=a;ctx.fillStyle=q.c;ctx.beginPath();ctx.arc(x-w/2+h*.5,y+h/2,fs*.22,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.fillText(q.text,x+fs*.25,y+h/2+1)}
  ctx.restore()}

/* --- level-end card: at most 3 coin rows (clear / skill / bonuses) with icons --- */
{const _tr=tallyRows;tallyRows=function(won){const rows=_tr(won),C=[t('cClear'),t('cBoss'),t('cFirst3')],K=[t('cPerfect'),t('cGreat'),t('cCombo'),t('cTricks'),t('cFever')];
  const g={clear:[won?(isBoss()&&lv.firstBoss?t('cBoss'):t('cClear')):t('cClear'),'',0,'trophy'],skill:[t('cSkill'),'',0,'star'],bonus:[t('cBonus'),'',0,'gift']};
  for(const r of rows){const k=C.includes(r[0])?'clear':K.includes(r[0])?'skill':'bonus';g[k][2]+=r[2]}
  const pf=lv.perfect||0;if(pf)g.skill[1]='★×'+pf;
  if(won&&lv.first3)g.clear[1]='★★★';
  return Object.values(g).filter(r=>r[2]>0)}}
{const _tc=tallyCard;tallyCard=function(card,won){_tc(card,won);const box=card.querySelector('.tally');if(!box)return;box.classList.add('tally3');
  const rows=tallyRows(won);box.querySelectorAll('.tally-row').forEach((d,i)=>{const r=rows[i];if(!r||!r[3])return;const im=document.createElement('img');im.className='t-ic';im.alt='';im.src='art/ic_'+r[3]+'.webp';d.prepend(im)})}}

/* --- stars: one by one, then a special show for three --- */
const cardLive=el=>el.isConnected&&!document.getElementById('overlay').hidden;
function animStars(st){if(st.dataset.anim)return;st.dataset.anim='1';const imgs=[...st.querySelectorAll('img')],n=imgs.filter(i=>!i.classList.contains('off')).length;
  st.classList.add('seq');imgs.forEach((im,i)=>im.classList.add(i<n?'s-wait':'s-off'));
  const T0=420,GAP=430;
  imgs.slice(0,n).forEach((im,i)=>setTimeout(()=>{if(!cardLive(im))return;im.classList.remove('s-wait');im.classList.add('s-in');try{sfx.perfect(2+i*2)}catch(e){}vib(18);
    for(let k=0;k<10;k++){const sp=document.createElement('i');sp.className='star-spark';const a=k/10*Math.PI*2+Math.random()*.4,r=38+Math.random()*26;sp.style.setProperty('--dx',Math.cos(a)*r+'px');sp.style.setProperty('--dy',Math.sin(a)*r+'px');
      sp.style.left=(im.offsetLeft+im.offsetWidth/2-4)+'px';sp.style.top=(im.offsetTop+im.offsetHeight/2-4)+'px';st.appendChild(sp);setTimeout(()=>sp.remove(),700)}},T0+i*GAP));
  if(n>=3)setTimeout(()=>{if(!cardLive(st))return;st.classList.add('triple');const tag=document.createElement('div');tag.className='triple-tag';tag.textContent=t('perfect3');st.after(tag);
    try{sfx.flourish(3)}catch(e){}vib([30,40,60]);const ov=document.getElementById('overlay');
    for(let k=0;k<46;k++){const c=document.createElement('i');c.className='confetti';c.style.left=Math.random()*100+'%';c.style.background=pick(['#ffd23f','#ff3ea5','#22d3ee','#a3e635','#ffffff','#c08bff']);
      c.style.animationDelay=(Math.random()*.5)+'s';c.style.animationDuration=(1.6+Math.random()*1.2)+'s';c.style.setProperty('--sx',(Math.random()*160-80)+'px');c.style.setProperty('--rot',(Math.random()*720-360)+'deg');ov.appendChild(c);setTimeout(()=>c.remove(),3400)}},T0+n*GAP+120)}
{const _so=showOverlay;showOverlay=function(build,dim){_so(build,dim);const st=document.querySelector('#card .stars');if(st)animStars(st);
  const rr=rerenderOverlay;if(rr)rerenderOverlay=()=>{rr();const s2=document.querySelector('#card .stars');if(s2){s2.dataset.anim='1';const n=[...s2.querySelectorAll('img')].filter(i=>!i.classList.contains('off')).length;if(n>=3){s2.classList.add('triple');const tag=document.createElement('div');tag.className='triple-tag';tag.textContent=t('perfect3');s2.after(tag)}}}}}

function trimMissions(){const ms=document.querySelector('#card .win-ms');if(!ms)return;
  const miss=[...ms.children].filter(c=>!c.classList.contains('ok'));if(!miss.length)ms.remove();else ms.querySelectorAll('.ok').forEach(c=>c.remove())}
{const _so2=showOverlay;showOverlay=function(build,dim){_so2(build,dim);trimMissions()}}

/* --- v37: "burst" victory popup (Brawl-Stars-like energy, kept as a card over the game) --- */
function winBurst(){const card=document.getElementById('card');if(!card||!card.classList.contains('win')||!card.querySelector('.stars'))return;
  card.classList.add('wb');const ov=document.getElementById('overlay');ov.classList.remove('rays','top');ov.classList.add('wb-ov','dim');
  if(!card.querySelector('.wb-top')){const st=card.querySelector('.stars'),top=document.createElement('div');top.className='wb-top';
    let hc=null;if(typeof H3!=='undefined'&&H3.baked){const old=card.querySelector('.card-body .card-anim');if(old)old.remove();hc=document.createElement('canvas');hc.className='wb-hero';top.appendChild(hc)}
    const tag=card.querySelector('.card-body .triple-tag');top.appendChild(st);if(tag)top.appendChild(tag);card.prepend(top);if(hc)startCardHero(hc,'dance',innerHeight<700?130:170)}
  const tl=card.querySelector('.tally3');if(tl&&!tl.querySelector('.wb-coin')){const tot=tl.querySelector('.tally-total');if(tot)tot.classList.add('wb-coin')}}
{const _so3=showOverlay;showOverlay=function(build,dim){const ov=document.getElementById('overlay');ov.classList.remove('wb-ov');ov.querySelectorAll('.confetti').forEach(c=>c.remove());_so3(build,dim);winBurst();const rr=rerenderOverlay;if(rr)rerenderOverlay=()=>{rr();trimMissions();winBurst()}}}

/* --- v38: per-level cleanup: stale toasts; keep only this world's 3D boss in memory and start loading it early --- */
{const _sl=startLevel;startLevel=function(...a){TOASTS.length=0;const r=_sl.apply(this,a);
  try{if(typeof b3Drop==='function'&&B3.r){const z=typeof bossArt==='function'?bossArt():zone().id;b3Drop([z]);if(mode==='levels')b3Load(z)}}catch(e){}return r}}
