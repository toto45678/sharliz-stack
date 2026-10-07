/* ===== v50: bonus stage "Treasure in the Clouds" (after a boss win) =====
   Design: ChatGPT mockup (design/bonus/mock_chatgpt.png) + ChatGPT chest/stopwatch sprites (art/bn_*.webp).
   30 s on the clouds world, no hearts: a miss costs 3 s, a perfect landing gives +1 s.
   Chests hang on the floor track at 8 / 16 / 24 floors. Rewards are collected on the result card. */
Object.assign(I18N.en,{bnBtn:'Bonus stage!',bnNew:'NEW',bnTitle:'Treasure in the Clouds',bnIntro1:'30 seconds to build high',bnIntro2a:'Miss = 3 seconds less',bnIntro2b:'Perfect = 1 bonus second',bnIntro3:'Chests at 8, 16 and 24 floors',bnGo:"Let's go!",bnFloors:'{n} floors',bnReached:'You reached {n} floors!',bnCollect:'Collect & continue',bnMiss:'−3 s',bnPerf:'+1 s',bnChest:'Chest!',bnTime:"Time's up!",bnEnd:'End bonus',bnHalf:'Replay: half coins',bnLocked:'Locked',bnBonus:'Bonus stage',bnMore:'{n} more floors!',bnLeft:'{n} to go',bnOne:'Just 1 more floor!'});
Object.assign(I18N.he,{bnBtn:'שלב בונוס!',bnNew:'חדש',bnTitle:'אוצר בעננים',bnIntro1:'30 שניות לבנות גבוה',bnIntro2a:'נפילה = 3 שניות פחות',bnIntro2b:'מושלם = שנייה בונוס',bnIntro3:'תיבות אוצר בקומות 8, 16 ו-24',bnGo:'יאללה!',bnFloors:'{n} קומות',bnReached:'הגעתם ל-{n} קומות!',bnCollect:'אוספים וממשיכים',bnMiss:'−3 שניות',bnPerf:'+1 שנייה',bnChest:'תיבה!',bnTime:'נגמר הזמן!',bnEnd:'סיום הבונוס',bnHalf:'שוב בונוס: חצי מטבעות',bnLocked:'נעול',bnBonus:'שלב בונוס',bnMore:'עוד {n} קומות!',bnLeft:'עוד {n}',bnOne:'עוד קומה אחת!'});
ICONS.chest=IMGTAG('bn_chest_gold','ico');
const BN_TIME=30,BN_CH=[{f:8,k:'bronze',c:50,b:0},{f:16,k:'silver',c:100,b:1},{f:24,k:'gold',c:200,b:2}];
let BN=null;
const bnZi=()=>Math.max(0,ZONES.findIndex(z=>z.sid==='clouds'));
const bnSpeed=()=>(1.5+Math.min(tower.length-1,24)*.03)*(boost.slow>0?.6:1)*(fever>0?.8:1)*easyK()*hatSpd();
// the golden button on the boss win card
function bnAct(){if(mode!=='levels'||!isBoss()||level>=TOTAL)return[];const from=level;document.documentElement.style.setProperty('--bn-new',JSON.stringify(t('bnNew')));
  return[{label:t('bnBtn'),icon:'chest',primary:true,color:'bonus',fn:()=>go(()=>startBonus(from))}]}
function startBonus(from){
  const zi=bnZi(),sid=(ZONES[zoneIdx(from)]||{}).sid||'x';progress.bonus=progress.bonus||{};
  BN={from,sid,t:BN_TIME,floors:0,coins:0,open:[],boost:[],first:!progress.bonus[sid],run:false,perf:0,shown:-1,ended:false};
  mode='bonus';modeZi=zi;level=zi*LPZ+3;score=0;endless={floors:0,zoneAt:1e9,goal:0};duo=null;
  startLevel(level);hearts=3;updateHud();document.getElementById('gauge').hidden=true;
  const tb=document.getElementById('toast');tb.querySelector('small').textContent=t('bnBonus');tb.querySelector('strong').textContent=t('bnTitle');
  bnHud(true);bnIntro()}
function bnIntro(){state='intro';
  showOverlay(()=>({title:t('bnTitle'),actions:[{label:t('bnGo'),icon:'play',primary:true,fn:()=>{hideOverlay();state='wait';spawnAt=time+.5;BN.run=true;sfx.flourish(1)}}],
    extra:card=>{card.classList.add('bn-card');const row=document.createElement('div');row.className='bn-chests';
      BN_CH.forEach(c=>{const d=document.createElement('div');d.className='bn-ch '+c.k;d.innerHTML=`<img src="art/bn_chest_${c.k}.webp" alt=""><b></b>`;d.querySelector('b').textContent=t('bnFloors',{n:c.f});row.appendChild(d)});card.appendChild(row);
      const ul=document.createElement('ul');ul.className='bn-rules';[['<img src="art/bn_stopwatch.webp" alt="">','bnIntro1'],['<em class="neg">−3</em>','bnIntro2a'],['<em class="pos">+1</em>','bnIntro2b']].forEach(([ic,k])=>{const li=document.createElement('li');li.innerHTML=ic+'<span></span>';li.querySelector('span').textContent=t(k);ul.appendChild(li)});card.appendChild(ul);
      if(!BN.first){const p=document.createElement('p');p.className='bn-half';p.textContent=t('bnHalf');card.appendChild(p)}}}),true)}
// HUD: stopwatch pill (where the hearts are) + chest track (where the goal gauge is)
let bnEl=null;
function bnHud(on){
  if(!bnEl){bnEl=document.createElement('div');bnEl.id='bnHud';bnEl.innerHTML=`<div class="bn-track"><div class="tube"><i class="fill"></i></div>${BN_CH.map((c,i)=>`<div class="bn-stop s${i}" style="bottom:${c.f/24*100}%"><img src="art/bn_chest_${c.k}.webp" alt=""><small>${c.f}</small></div>`).join('')}<b class="bn-fl">0</b></div>`;
    document.getElementById('hud').appendChild(bnEl);
    const tm=document.createElement('div');tm.className='bn-timer';tm.innerHTML='<img src="art/bn_stopwatch.webp" alt=""><b>0:30</b>';const hs=document.getElementById('hearts');hs.parentNode.insertBefore(tm,hs);bnEl.tm=tm}
  bnEl.hidden=!on;bnEl.tm.hidden=!on;document.getElementById('hud').classList.toggle('bonus',!!on)}
function bnHudTick(){if(!BN||!bnEl)return;const s=Math.max(0,Math.ceil(BN.t));
  if(s!==BN.shown){BN.shown=s;bnEl.tm.querySelector('b').textContent='0:'+String(s).padStart(2,'0');bnEl.tm.classList.toggle('low',s<=5);if(s<=5&&s>0&&BN.run&&sfx.ok())tone({f:880,d:.06,type:'square',v:.04})}
  bnEl.tm.style.setProperty('--p',clamp(BN.t/BN_TIME,0,1));
  const fl=Math.max(0,tower.length-1);bnEl.querySelector('.bn-track .fill').style.height=Math.min(1,fl/24)*100+'%';bnEl.querySelector('.bn-fl').textContent=fl;
  const nx=BN_CH.findIndex((c,i)=>!BN.open.includes(i));BN_CH.forEach((c,i)=>{const st=bnEl.querySelector('.bn-stop.s'+i),o=BN.open.includes(i);st.classList.toggle('next',i===nx);{const lb=i===nx?t('bnLeft',{n:c.f-fl}):String(c.f),sm=st.querySelector('small');if(sm.textContent!==lb)sm.textContent=lb}if(st.classList.contains('open')!==o){st.classList.toggle('open',o);st.querySelector('img').src=`art/bn_chest_${c.k}${o?'_open':''}.webp`}})}
function bnChip(txt,cls){if(!bnEl||!bnEl.tm)return;const r=bnEl.tm.getBoundingClientRect(),d=document.createElement('div');d.className='bn-chip '+cls;d.textContent=txt;d.style.left=(r.left+r.width/2)+'px';d.style.top=(r.bottom+4)+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),900);
  bnEl.tm.classList.remove(cls==='pos'?'bn-plus':'bn-hit');void bnEl.tm.offsetWidth;bnEl.tm.classList.add(cls==='pos'?'bn-plus':'bn-hit')}
function bnCelebrate(c){const d=document.createElement('div');d.className='bn-pop';d.innerHTML=`<img src="art/bn_chest_${c.k}_open.webp" alt=""><b>+${c.c}</b>`;document.body.appendChild(d);setTimeout(()=>d.remove(),950)}
function bnLanded(){if(BN.ended)return true;
  const fl=tower.length-1;BN.floors=Math.max(BN.floors,fl);BN.coins+=2;
  if(combo>BN.perf){BN.t=Math.min(BN_TIME+15,BN.t+1);bnChip('+1','pos')}
  BN.perf=combo;
  BN_CH.forEach((c,i)=>{if(fl>=c.f&&!BN.open.includes(i)){BN.open.push(i);BN.coins+=c.c;for(let k=0;k<c.b;k++)BN.boost.push(pick(['slow','laser','shield','heart']));
    sfx.flourish(i+1);vib([20,40,20]);bnCelebrate(c);const st=bnEl&&bnEl.querySelector('.bn-stop.s'+i);if(st){st.classList.remove('pop');void st.offsetWidth;st.classList.add('pop')}
    const s=tower[tower.length-1];for(let q=0;q<26;q++)particles.push({x:xOf(s.xs)+rnd(-S,S),y:yOf(fl)+rnd(-BH,BH),vx:rnd(-220,220),vy:rnd(-420,-120),life:1.3,c:pick(['#ffd23f','#fff4b0','#ffb000','#ffffff']),sz:rnd(4,8)})}});
  updateHud();bnHudTick();return false}
function bnEnd(){if(!BN||BN.ended)return;BN.ended=true;BN.run=false;state='win';swinger=null;sfx.flourish(2);{const d=document.createElement('div');d.className='bn-banner';d.textContent=t('bnTime');document.body.appendChild(d);setTimeout(()=>d.remove(),1300)}
  setTimeout(bnResult,1100)}
function bnReward(){const k=BN.first?1:.5;return{coins:Math.round(BN.coins*k),boost:BN.first?BN.boost.slice():[]}}
function bnResult(){const R=bnReward();
  showOverlay(()=>({title:t('bnTitle'),big:true,actions:[{label:t('bnCollect'),icon:'play',primary:true,color:'green',fn:bnCollect}],
    extra:card=>{card.classList.add('bn-card','bn-res');const nxI=BN_CH.findIndex((c,i)=>!BN.open.includes(i));const row=document.createElement('div');row.className='bn-chests';
      BN_CH.forEach((c,i)=>{const o=BN.open.includes(i),d=document.createElement('div');d.className='bn-ch '+c.k+(o?' open':' locked');d.style.animationDelay=(.1+i*.15)+'s';
        d.innerHTML=`<img src="art/bn_chest_${c.k}${o?'_open':''}.webp" alt=""><b></b>`;d.querySelector('b').textContent=o?'+'+c.c:t('bnFloors',{n:c.f});if(!o&&nxI===i&&c.f-BN.floors<=3){d.classList.add('near');const tg=document.createElement('i');tg.textContent=c.f-BN.floors===1?t('bnOne'):t('bnMore',{n:c.f-BN.floors});d.appendChild(tg)}row.appendChild(d)});card.appendChild(row);
      const fl=document.createElement('div');fl.className='bn-reach';fl.textContent=t('bnReached',{n:BN.floors});card.appendChild(fl);
      const rw=document.createElement('div');rw.className='bn-rew';rw.innerHTML=`<span class="bn-coins">${coinImg()}<b>+0</b></span>`+(R.boost.length?'<div class="bn-bos">':'')+Object.entries(R.boost.reduce((a,b)=>(a[b]=(a[b]||0)+1,a),{})).map(([b,n])=>`<span class="bn-bo"><img src="art/ic_${b}.webp" alt=""><em>×${n}</em><small>${t('b_'+b)}</small></span>`).join('')+(R.boost.length?'</div>':'');card.appendChild(rw);
      if(!BN.first){const p=document.createElement('p');p.className='bn-half';p.textContent=t('bnHalf');card.appendChild(p)}}}));
  BN.open.forEach((i,n)=>setTimeout(()=>sfx.coin(2),350+n*220));
  {const btn=document.querySelector('#card .btn.primary');if(btn){btn.disabled=true;btn.classList.add('bn-wait')}const el=document.querySelector('#card .bn-coins b'),t0=performance.now(),D=900+Math.min(900,R.coins*3);
   const step=now=>{if(!el.isConnected)return;const k=Math.min(1,(now-t0-500)/D);el.textContent='+'+Math.round(R.coins*Math.max(0,k)*(2-Math.max(0,k)));if(k<1)requestAnimationFrame(step);else{if(btn){btn.disabled=false;btn.classList.remove('bn-wait')}if(sfx.ok())tone({f:880,f2:1320,d:.12,type:'triangle',v:.05})}};requestAnimationFrame(step)}}
function bnCollect(){if(!BN||BN.paid)return;BN.paid=true;const R=bnReward();wallet();progress.coins+=R.coins;R.boost.forEach(b=>progress.inv[b]=(progress.inv[b]||0)+1);progress.bonus[BN.sid]=1;saveProgress();sfx.coin(4);popupToast('+'+R.coins);
  const L=BN.from;BN=null;bnHud(false);mode='levels';modeZi=null;level=L;
  hideOverlay();iris.r=-1;drawIris();worldTransition(zoneIdx(L)+1,()=>{preloadWorld(ZONES[zoneIdx(L)+1].id);preLevel(L+1)})}
// wiring
{const _u=update;update=function(dt){_u(dt);if(mode!=='bonus'||!BN){if(bnEl&&!bnEl.hidden)bnHud(false);return}
  if(BN.run&&['aim','drop','wait','collapse'].includes(state)){BN.t-=dt;if(BN.t<=0){BN.t=0;bnHudTick();bnEnd();return}}bnHudTick()}}
{const _l=loseHeart;loseHeart=function(msg,x,y,silent,key){if(mode!=='bonus'||!BN)return _l.apply(this,arguments);
  if(BN.ended)return;combo=0;BN.perf=0;BN.t=Math.max(0,BN.t-3);vib([40,30,40]);popup(msg,x,y-BH*.6,'#e8806e',key);bnChip('−3','neg');setTimeout(()=>sfx.heart(),200);
  bnHudTick();if(BN.t<=0){bnEnd();return}state='wait';spawnAt=time+.6}}
{const _m=modeLanded;modeLanded=function(){if(mode==='bonus'&&BN)return bnLanded();return _m.apply(this,arguments)}}
{const _i=maybeIntro;maybeIntro=function(){if(mode==='bonus')return false;return _i.apply(this,arguments)}}
{const _w=windFor;windFor=function(n){return mode==='bonus'?0:_w.apply(this,arguments)}}
{const _h=updateHazards;updateHazards=function(dt){if(mode==='bonus')return;return _h.apply(this,arguments)}}
{const _r=renderBoosterBar;renderBoosterBar=function(){const r=_r.apply(this,arguments);if(mode==='bonus'){const bb=document.getElementById('boosterBar');if(bb)bb.hidden=true}return r}}
{const _p=pause;pause=function(){if(mode!=='bonus'||!BN)return _p.apply(this,arguments);if(!['aim','wait','drop'].includes(state)||busy)return;
  stateBeforePause=state;state='paused';showOverlay(()=>({title:t('paused'),extra:settingsRows,actions:[{label:t('resume'),icon:'play',primary:true,fn:()=>{hideOverlay();state=stateBeforePause}},{label:t('bnEnd'),icon:'chest',fn:()=>{hideOverlay();state=stateBeforePause;BN.t=0;bnEnd()}}]}),true)}}
{const _t=toTitle;toTitle=function(){if(mode==='bonus'){mode='levels';modeZi=null;BN=null}bnHud(false);return _t.apply(this,arguments)}}
{const _o=openMap;openMap=function(){if(mode==='bonus'){mode='levels';modeZi=null;if(BN)level=BN.from;BN=null}bnHud(false);return _o.apply(this,arguments)}}
{const _h=updateHud;updateHud=function(){_h.apply(this,arguments);if(mode==='bonus'&&BN)document.getElementById('score').innerHTML=coinImg()+'<b>'+BN.coins+'</b>'}}
