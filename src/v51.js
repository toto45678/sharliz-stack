/* ===== v51: mini-games ARCADE (lobby button) =====
   Design: ChatGPT mockup (design/arcade/). 3 games for now: coin rain, boss memory, whack-a-monster.
   Each game gives coins for its first 3 plays of the day (tickets); after that you play for the high score. */
Object.assign(I18N.en,{arcShort:'Arcade',arcTitle:'Arcade',arcNote:'3 coin plays per game every day',arcBest:'Best',arcPlay:'Play',arcFree:'No tickets left today: play for the high score!',arcNewBest:'New record!',arcScore:'Score',arcAgain:'Again',arcBack:'Arcade',arcGo:'GO!',arcTix:'Coin plays today',
  g_rain:'Coin Rain',gd_rain:'Catch coins, dodge bombs',g_mem:'Boss Memory',gd_mem:'Find the boss pairs',g_whack:'Bonk the Monster',gd_whack:"Tap monsters, not Sharliz!",
  arcMoves:'Moves {n}',arcCombo:'Combo ×{n}',arcHowRain:'Drag your Sharliz left and right',arcHowMem:'Flip two cards to find a pair',arcHowWhack:'Tap the monsters, never a Sharliz',arcOops:'Oops!',arcPrize:'Prize',arcLeftN:'{n} coin plays today'});
Object.assign(I18N.he,{arcShort:'ארקייד',arcTitle:'ארקייד',arcNote:'3 משחקים עם מטבעות בכל יום לכל משחק',arcBest:'שיא',arcPlay:'שחקו',arcFree:'נגמרו הכרטיסים להיום: משחקים בשביל השיא!',arcNewBest:'שיא חדש!',arcScore:'ניקוד',arcAgain:'שוב',arcBack:'לארקייד',arcGo:'צאו!',arcTix:'משחקים עם מטבעות היום',
  g_rain:'גשם מטבעות',gd_rain:'תפסו מטבעות, התחמקו מפצצות',g_mem:'זיכרון בוסים',gd_mem:'מצאו את הזוגות',g_whack:'הכו במפלצת',gd_whack:'רק מפלצות, לא שארליז!',
  arcMoves:'מהלכים {n}',arcCombo:'קומבו ×{n}',arcHowRain:'גררו את השארליז ימינה ושמאלה',arcHowMem:'הפכו שני קלפים ומצאו זוג',arcHowWhack:'הכו במפלצות, אף פעם לא בשארליז',arcOops:'אופס!',arcPrize:'פרס',arcLeftN:'{n} משחקים עם מטבעות היום'});
const ARC_TIX=3,ARC_MAX=40;
const ARC_BOSSES='candy candyN candyS castle city cityN cityS clouds crystal desert desertN desertS dino factory farm farmN farmS jungle ocean oceanN oceanS snow snowN snowS space spaceN spaceS volcano volcanoN volcanoS'.split(' ');
function arcData(){const a=progress.arcade=progress.arcade||{best:{},day:'',plays:{}};a.best=a.best||{};a.plays=a.plays||{};if(a.day!==today()){a.day=today();a.plays={}}return a}
const arcLeft=id=>Math.max(0,ARC_TIX-(arcData().plays[id]||0));
let ARCEL=null,AG=null;
function arcRoot(){if(!ARCEL){ARCEL=document.createElement('div');ARCEL.id='arcade';ARCEL.hidden=true;document.body.appendChild(ARCEL)}return ARCEL}
function arcHeroSprite(){const s=Object.assign(makeSharliz(),{color:CHARS.hero?'hero':'#06a2ba'});return s}
function openArcade(){audio();try{startMusic()}catch(e){}sfx.click();const r=arcRoot();r.hidden=false;arcHub()}
function closeArcade(){arcStop();if(ARCEL)ARCEL.hidden=true;updateWalletUI();if(state==='title')updateLobby()}
function arcTix(id){const n=arcLeft(id);return Array.from({length:ARC_TIX},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}
function arcHub(){const r=arcRoot(),a=arcData();r.className='arc-hub';
  r.innerHTML=`<div class="arc-top"><button class="x-btn arc-x" aria-label="close"></button><div class="arc-title"></div><div class="coin-pill">${coinImg()}<span></span></div></div><div class="arc-list"></div><p class="arc-note"></p>`;
  r.querySelector('.arc-title').textContent=t('arcTitle');r.querySelector('.coin-pill span').textContent=progress.coins;r.querySelector('.arc-note').textContent=t('arcNote');r.querySelector('.arc-x').innerHTML=XSVG;r.querySelector('.arc-x').onclick=()=>{sfx.click();closeArcade()};
  const L=r.querySelector('.arc-list');
  ['rain','mem','whack'].forEach((id,i)=>{const b=document.createElement('button');b.className='arc-card c-'+id;b.style.animationDelay=(i*.08)+'s';
    b.innerHTML=`<span class="th"><img src="art/arc_${id}.webp" alt=""></span><span class="tx"><b></b><small></small><span class="meta"><span class="best"><img src="art/ic_trophy.webp" alt=""><em></em></span><span class="tix" aria-label=""></span></span></span><span class="go"><svg viewBox="0 0 24 24"><path d="M7 4.5 L19 12 L7 19.5 Z"/></svg></span>`;
    b.querySelector('b').textContent=t('g_'+id);b.querySelector('small').textContent=t('gd_'+id);b.querySelector('.best em').textContent=a.best[id]||0;const tx=b.querySelector('.tix');tx.innerHTML=arcTix(id)+`<em>${arcLeft(id)}/${ARC_TIX}</em>`;tx.setAttribute('aria-label',t('arcTix')+': '+arcLeft(id));
    b.onclick=()=>{sfx.click();arcStart(id)};L.appendChild(b)})}
function arcStop(){if(AG){AG.dead=true;cancelAnimationFrame(AG.raf);if(AG.off)AG.off();AG=null}}
const ARCG={};
function arcStart(id){arcStop();const r=arcRoot(),D=ARCG[id];r.className='arc-game g-'+id;
  r.innerHTML=`<div class="arc-bar"><button class="x-btn arc-x" aria-label="close"></button><div class="arc-score">${D.star?'<img class="coin-i" src="art/ic_star.webp" alt="">':coinImg()}<b>0</b></div><div class="arc-sub"><span class="ic"></span><b></b></div><div class="bn-timer arc-time"><img src="art/bn_stopwatch.webp" alt=""><b></b></div></div><div class="arc-stage"></div><div class="arc-cd" hidden></div>`;
  r.querySelector('.arc-x').innerHTML=XSVG;r.querySelector('.arc-x').onclick=()=>{sfx.click();arcStop();arcHub()};
  const G=AG={id,D,r,stage:r.querySelector('.arc-stage'),score:0,t:D.dur,dur:D.dur,run:false,dead:false,last:performance.now(),shown:-1,sub:''};
  D.init(G);arcBar(G);if(D.hint){const h=document.createElement('div');h.className='arc-hint';h.textContent=t(D.hint);G.stage.appendChild(h)}
  // 3-2-1 with a one-line "how to play"
  const cd=r.querySelector('.arc-cd');cd.hidden=false;let n=3;
  const how=document.createElement('p');how.textContent=t(D.how);
  const hand=D.id==='rain'?Object.assign(document.createElement('i'),{className:'arc-hand',textContent:'👆'}):null;
  const tick=()=>{if(G.dead)return;cd.innerHTML='';const b=document.createElement('b');b.textContent=n>0?n:t('arcGo');cd.appendChild(b);cd.appendChild(how);if(hand)cd.appendChild(hand);
    if(sfx.ok())tone({f:n>0?520:880,d:.12,type:'triangle',v:.06});if(n<=0){setTimeout(()=>{if(G.dead)return;cd.hidden=true;G.run=true;G.last=performance.now()},450);return}n--;setTimeout(tick,700)};tick();
  const loop=now=>{if(G.dead)return;const raw=(now-G.last)/1000,dt=Math.min(.05,raw);G.last=now;
    {let rem=Math.min(.25,raw);if(document.hidden)rem=0;do{const d=Math.min(.05,rem);rem-=d;if(G.run){G.t-=d;if(G.t<=0){G.t=0;arcEnd(G)}}D.tick(G,G.run?d:0,d,rem<=1e-6)}while(rem>1e-6&&!G.over)}arcBar(G);if(!G.dead&&!G.over)G.raf=requestAnimationFrame(loop)};
  G.raf=requestAnimationFrame(loop)}
function arcBar(G){const r=G.r,s=Math.ceil(G.t);r.querySelector('.arc-score b').textContent=G.score;{const sb=r.querySelector('.arc-sub'),k=G.sub?G.sub.ic+'|'+G.sub.txt+'|'+G.sub.on:'';if(sb.dataset.k!==k){const was=sb.dataset.k;sb.dataset.k=k;sb.hidden=!G.sub;if(G.sub){sb.querySelector('.ic').textContent=G.sub.ic;sb.querySelector('b').textContent=G.sub.txt;sb.classList.toggle('on',!!G.sub.on);if(was&&G.sub.on){sb.classList.remove('pop');void sb.offsetWidth;sb.classList.add('pop')}}}}
  const tm=r.querySelector('.arc-time');tm.style.setProperty('--p',clamp(G.t/G.dur,0,1));if(s!==G.shown){G.shown=s;tm.querySelector('b').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');tm.classList.toggle('low',s<=5&&G.run);if(s<=5&&s>0&&G.run&&sfx.ok())tone({f:880,d:.05,type:'square',v:.035})}}
function arcAdd(G,n,x,y,cls){G.score=Math.max(0,G.score+n);if(x!==undefined){const d=document.createElement('div');d.className='arc-fx '+(cls||(n>=0?'pos':'neg'));d.textContent=(n>0?'+':'')+n;d.style.left=x+'px';d.style.top=y+'px';G.stage.appendChild(d);setTimeout(()=>d.remove(),800)}
  if(n>0){const sc=G.r.querySelector('.arc-score');sc.classList.remove('bump');void sc.offsetWidth;sc.classList.add('bump')}}
function arcEnd(G){if(G.over)return;G.over=true;G.run=false;if(G.D.end)G.D.end(G);
  const a=arcData(),id=G.id,paid=arcLeft(id)>0&&G.score>0,coins=paid?Math.min(ARC_MAX,G.D.coins(G.score)):0,nb=G.score>(a.best[id]||0)&&G.score>0;
  if(paid)a.plays[id]=(a.plays[id]||0)+1;if(nb)a.best[id]=G.score;progress.coins+=coins;saveProgress();updateWalletUI();
  sfx.flourish(nb?3:1);
  setTimeout(()=>{if(G.dead)return;const p=document.createElement('div');p.className='arc-end';
    p.innerHTML=`<div class="arc-panel"><div class="ar-title"></div><div class="ar-score"><small></small><b>0</b></div><div class="ar-best"><img src="art/ic_trophy.webp" alt=""><span></span></div><div class="ar-rew"></div><div class="ar-acts"><button class="btn primary ar-again"><svg viewBox="0 0 24 24"><path d="M7 4.5 L19 12 L7 19.5 Z"/></svg><span></span></button><button class="btn ar-back"><span></span></button></div></div>`;
    p.querySelector('.ar-title').textContent=nb?t('arcNewBest'):t('g_'+id);if(nb)p.querySelector('.ar-title').classList.add('nb');
    p.querySelector('.ar-score small').textContent=t('arcScore');p.querySelector('.ar-best span').textContent=t('arcBest')+' '+Math.max(G.score,a.best[id]||0);
    const rw=p.querySelector('.ar-rew');if(paid){rw.innerHTML=`<span class="ar-lbl"></span><span class="bn-coins">${coinImg()}<b>+${coins}</b></span><span class="tix">${arcTix(id)}</span>`;rw.querySelector('.ar-lbl').textContent=t('arcPrize')}else{rw.className='ar-rew free';rw.textContent=t('arcFree')}
    if(!arcLeft(id)){p.querySelector('.ar-again').classList.remove('primary');p.querySelector('.ar-back').classList.add('primary');p.querySelector('.ar-acts').prepend(p.querySelector('.ar-back'))}
    p.querySelector('.ar-again span').textContent=t('arcAgain');p.querySelector('.ar-back span').textContent=t('arcBack');
    p.querySelector('.ar-again').onclick=()=>{sfx.click();arcStart(id)};p.querySelector('.ar-back').onclick=()=>{sfx.click();arcStop();arcHub()};
    G.r.appendChild(p);
    const el=p.querySelector('.ar-score b'),t0=performance.now(),D=700;const st=now=>{if(!el.isConnected)return;const k=Math.min(1,(now-t0)/D);el.textContent=Math.round(G.score*k*(2-k));if(k<1)requestAnimationFrame(st)};requestAnimationFrame(st);
    if(paid&&coins)setTimeout(()=>sfx.coin(3),500)},700)}
/* ---------- game 1: coin rain (canvas) ---------- */
ARCG.rain={id:'rain',dur:30,how:'arcHowRain',coins:s=>Math.round(s*.8),
  init(G){const c=document.createElement('canvas');G.stage.appendChild(c);const d=Math.min(2,devicePixelRatio||1);G.cv=c;G.g=c.getContext('2d');
    const fit=()=>{const r=G.stage.getBoundingClientRect();G.W=r.width;G.H=r.height;c.width=Math.round(r.width*d);c.height=Math.round(r.height*d);c.style.width=r.width+'px';c.style.height=r.height+'px';G.d=d};fit();
    G.size=Math.min(56,G.W*.13);G.px=G.tx=G.W/2;G.hero=arcHeroSprite();G.items=[];G.spawn=.6;G.el=0;G.shake=0;G.tilt=0;G.mood=null;G.moodT=0;G.streak=0;
    const mv=e=>{const r=c.getBoundingClientRect();G.tx=clamp(e.clientX-r.left,G.size*.7,G.W-G.size*.7)};c.addEventListener('pointerdown',e=>{mv(e);c.setPointerCapture&&c.setPointerCapture(e.pointerId)});c.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType==='touch')mv(e)});
    G.hold=0;const ar=document.createElement('div');ar.className='arc-arrows';ar.innerHTML='<button data-d="-1"><svg viewBox="0 0 24 24"><path d="M15 4 L7 12 L15 20Z"/></svg></button><button data-d="1"><svg viewBox="0 0 24 24"><path d="M9 4 L17 12 L9 20Z"/></svg></button>';
    ar.querySelectorAll('button').forEach(b=>{const d=+b.dataset.d;b.addEventListener('pointerdown',e=>{e.preventDefault();G.hold=d});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{if(G.hold===d)G.hold=0}))});G.stage.appendChild(ar);
    addEventListener('resize',fit);G.off=()=>removeEventListener('resize',fit)},
  tick(G,dt,rdt,last){const g=G.g,W=G.W,H=G.H,sz=G.size,gy=H-sz*3.1;
    if(dt>0){G.el+=dt;G.spawn-=dt;if(G.spawn<=0){G.spawn=Math.max(.2,.55-G.el*.012)*rnd(.7,1.2);const r=Math.random(),k=r<.07?'gem':r<.25+Math.min(.12,G.el*.004)?'bomb':'coin';G.items.push({k,x:rnd(sz*.6,W-sz*.6),y:-30,vy:rnd(150,210)+G.el*7,r:k==='gem'?22:k==='bomb'?27:20,rot:rnd(0,6)})}
      if(G.hold)G.tx=clamp(G.tx+G.hold*G.W*1.1*dt,G.size*.7,G.W-G.size*.7);const ox=G.px;G.px+=(G.tx-G.px)*Math.min(1,dt*14);G.tilt+=(clamp((G.px-ox)/(dt*600),-.35,.35)-G.tilt)*Math.min(1,dt*10);
      for(const it of G.items){it.y+=it.vy*dt;it.rot+=dt*3;if(!it.hit&&it.y>gy-sz*1.2&&it.y<gy+sz*.1&&Math.abs(it.x-G.px)<sz*1.05){it.hit=1;
        if(it.k==='bomb'){arcAdd(G,-5,it.x,gy-sz*1.6);G.streak=0;G.shake=.35;G.mood='scared';G.moodT=.8;vib([40,30,40]);sfx.heart();burstFx(G,it.x,it.y,['#ff8a3d','#ffd23f','#555'])}
        else{G.streak++;const v=it.k==='gem'?5:(G.streak>=10?2:1);arcAdd(G,v,it.x,gy-sz*1.6,it.k==='gem'?'gem':null);G.mood='happy';G.moodT=.4;if(it.k==='gem')sfx.perfect(3);else sfx.coin(1);burstFx(G,it.x,it.y,it.k==='gem'?['#ff6fc0','#fff','#c084fc']:['#ffd23f','#fff4b0'])}}}
      G.items=G.items.filter(it=>!it.hit&&it.y<H+40);if(G.moodT>0){G.moodT-=dt;if(G.moodT<=0)G.mood=null}G.shake=Math.max(0,G.shake-dt)}
    G.sub={ic:'🔥',txt:'×'+(G.streak>=10?2:1),on:G.streak>=10};
    if(last===false)return;g.setTransform(G.d,0,0,G.d,0,0);g.clearRect(0,0,W,H);
    const sx=G.shake>0?rnd(-6,6)*G.shake*3:0;g.save();g.translate(sx,0);
    for(const it of G.items){const im=it.k==='coin'?hzPic('ic_coin'):it.k==='bomb'?hzPic('hz_bomb'):hzPic('arc_gem');g.save();g.translate(it.x,it.y);if(it.k!=='bomb')g.rotate(Math.sin(it.rot)*.3);
      if(im&&im.complete&&im.naturalWidth)g.drawImage(im,-it.r*1.2,-it.r*1.2,it.r*2.4,it.r*2.4);else{g.fillStyle=it.k==='bomb'?'#333':it.k==='gem'?'#ff6fc0':'#ffd23f';g.strokeStyle=INK;g.lineWidth=3;g.beginPath();g.arc(0,0,it.r,0,7);g.fill();g.stroke()}g.restore()}
    for(const p of (G.fx||[])){p.life-=rdt;p.x+=p.vx*rdt;p.y+=p.vy*rdt;p.vy+=500*rdt;g.globalAlpha=Math.max(0,p.life*2);g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.s,0,7);g.fill()}g.globalAlpha=1;G.fx=(G.fx||[]).filter(p=>p.life>0);
    g.fillStyle='rgba(18,13,43,.18)';g.beginPath();g.ellipse(G.px,gy+sz*.72,sz*.75,sz*.18,0,0,7);g.fill();
    G.hero.blink+=rdt;withCtx(g,sz,()=>drawSharliz(G.hero,G.px,gy-sz*.45,G.tilt,G.mood||'happy',{x:G.tilt*.6,y:-.4},G.mood==='happy'?.15:0));{const bw=hzPic('arc_bowl');if(bw){const w=sz*2.3,h=w*bw.naturalHeight/bw.naturalWidth;g.save();g.translate(G.px,gy+sz*.55);g.rotate(G.tilt*.5);g.drawImage(bw,-w/2,-h*.45,w,h);g.restore()}}g.restore()}};
function burstFx(G,x,y,cols){G.fx=G.fx||[];for(let i=0;i<10;i++)G.fx.push({x,y,vx:rnd(-160,160),vy:rnd(-260,-60),life:.5,c:pick(cols),s:rnd(2.5,5)})}
/* ---------- game 2: boss memory (DOM) ---------- */
ARCG.mem={dur:60,star:1,how:'arcHowMem',hint:'gd_mem',coins:s=>Math.round(s*.5),
  init(G){const ks=ARC_BOSSES.slice().sort(()=>Math.random()-.5).slice(0,8),deck=ks.concat(ks).sort(()=>Math.random()-.5);G.moves=0;G.pairs=0;G.open=[];G.lock=false;
    const grid=document.createElement('div');grid.className='mem-grid';G.stage.appendChild(grid);
    deck.forEach((k,i)=>{const b=document.createElement('button');b.className='mem-card';b.style.animationDelay=(i*.03)+'s';b.innerHTML=`<span class="bk"><img src="art/arc_cardback.webp" alt=""></span><span class="fr"><img src="art/boss_${k}.webp" alt=""></span>`;b.dataset.k=k;
      b.onclick=()=>{if(!G.run||G.lock||b.classList.contains('up'))return;b.classList.add('up');if(sfx.ok())tone({f:640,d:.05,type:'triangle',v:.04});G.open.push(b);
        if(G.open.length===2){G.moves++;const [x,y]=G.open;G.open=[];
          if(x.dataset.k===y.dataset.k){x.classList.add('ok');y.classList.add('ok');G.pairs++;const r=y.getBoundingClientRect(),s=G.stage.getBoundingClientRect();arcAdd(G,10,r.left-s.left+r.width/2,r.top-s.top);sfx.perfect(Math.min(4,1+G.pairs%4));
            if(G.pairs===8){const bonus=Math.ceil(G.t)*2;G.run=false;setTimeout(()=>{arcAdd(G,bonus,s.width/2,s.height*.4,'gem');arcEnd(G)},500)}}
          else{G.lock=true;x.classList.add('no');y.classList.add('no');setTimeout(()=>{x.classList.remove('up','no');y.classList.remove('up','no');G.lock=false},750)}}};grid.appendChild(b)})},
  tick(G){G.sub={ic:'👆',txt:t('arcMoves',{n:G.moves}),on:true}}};
/* ---------- game 3: bonk the monster (DOM) ---------- */
ARCG.whack={dur:30,star:1,how:'arcHowWhack',hint:'gd_whack',coins:s=>Math.round(s/8),
  init(G){const grid=document.createElement('div');grid.className='wh-grid';G.stage.appendChild(grid);G.holes=[];G.spawn=.5;G.el=0;G.combo=0;
    // a little canvas portrait of your Sharliz for the "friend" pop-ups
    const fc=document.createElement('canvas');fc.width=fc.height=160;withCtx(fc.getContext('2d'),74,()=>drawSharliz(arcHeroSprite(),80,102,0,'happy'));G.friend=fc.toDataURL();
    for(let i=0;i<9;i++){const h=document.createElement('div');h.className='wh-hole';h.innerHTML='<span class="wh-ring"></span><div class="wh-in"><button class="wh-pop"><img alt=""></button></div><span class="wh-ring front"></span>';grid.appendChild(h);
      const H={el:h,b:h.querySelector('.wh-pop'),img:h.querySelector('img'),up:0,k:null};G.holes.push(H);
      H.b.addEventListener('pointerdown',e=>{e.preventDefault();if(!G.run||!H.k||H.hit)return;H.hit=1;const r=h.getBoundingClientRect(),s=G.stage.getBoundingClientRect(),x=r.left-s.left+r.width/2,y=r.top-s.top+r.height*.2;
        if(H.k==='friend'){G.combo=0;arcAdd(G,-15,x,y,'neg big');h.classList.add('sad');vib([60,40,60]);if(sfx.ok()){tone({f:220,f2:110,d:.35,type:'sawtooth',v:.07,filter:600})}setTimeout(()=>h.classList.remove('sad'),500)}
        else{G.combo++;const m=1+Math.floor(G.combo/5);arcAdd(G,10*m);h.classList.add('bonk');{const hm=document.createElement('i');hm.className='wh-ham';hm.style.left=(r.left-s.left+r.width*.42)+'px';hm.style.top=(r.top-s.top+r.height*.22)+'px';G.stage.appendChild(hm);setTimeout(()=>hm.remove(),300)}sfx.perfect(Math.min(4,m));vib(12);const pw=document.createElement('i');pw.className='wh-pow';pw.textContent='+'+10*m;h.appendChild(pw);setTimeout(()=>pw.remove(),450)}
        H.up=Math.min(H.up,.25)})}},
  tick(G,dt){if(dt>0){G.el+=dt;G.spawn-=dt;
      if(G.spawn<=0){G.spawn=Math.max(.32,.62-G.el*.012)*rnd(.75,1.2);const free=G.holes.filter(h=>!h.k);if(free.length){const H=pick(free),fr=Math.random()<.22;H.k=fr?'friend':'arc_mon'+(1+Math.floor(Math.random()*4));H.hit=0;H.img.src=fr?G.friend:'art/'+H.k+'.webp';H.up=Math.max(.65,1.25-G.el*.02);H.el.classList.remove('bonk','sad');H.el.classList.add('up',fr?'fr':'mo');H.el.classList.toggle('fr',fr);H.el.classList.toggle('mo',!fr)}}
      for(const H of G.holes)if(H.k){H.up-=dt;if(H.up<=0){if(H.k!=='friend'&&!H.hit)G.combo=0;H.k=null;H.el.classList.remove('up')}}}
    G.sub={ic:'🔥',txt:'×'+(1+Math.floor(G.combo/5)),on:G.combo>=5}},
  end(G){for(const H of G.holes){H.k=null;H.el.classList.remove('up')}}};
/* lobby button (right column, first) */
{const col=document.querySelector('.lob-side.r');if(col){const b=document.createElement('button');b.className='side-btn arcade';b.id='lobArcade';b.innerHTML='<span class="sq"><img src="art/ic_arcade.webp" alt=""></span><b data-i18n="arcShort"></b><i class="badge arc-badge" data-abadge hidden></i>';b.querySelector('b').textContent=t('arcShort');b.onclick=openArcade;col.insertBefore(b,col.children[1]||null)}}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);const b=document.getElementById('lobArcade');if(b){b.querySelector('b').textContent=t('arcShort');const bd=b.querySelector('[data-abadge]');const n=['rain','mem','whack'].reduce((s,id)=>s+arcLeft(id),0);bd.hidden=!n||!progress.tut;bd.innerHTML='<img src="art/arc_ticket.webp" alt="">'+n;b.setAttribute('aria-label',t('arcShort')+' · '+t('arcLeftN',{n}))}return r}}
{const _d=drawTitleArt;drawTitleArt=function(){if(ARCEL&&!ARCEL.hidden)return;return _d.apply(this,arguments)}}
