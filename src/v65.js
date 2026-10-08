/* ===== v65: two more ARCADE games =====
   sling  = pull your Sharliz back in a slingshot and fling it at bosses floating on clouds (canvas)
   shadow = "Who's in the shadow?": a black boss silhouette + 4 colour pictures, pick the right one (DOM) */
Object.assign(I18N.en,{g_sling:'Sling Shot',gd_sling:'Fling Sharliz at the bosses',arcHowSling:'Pull back, aim, let go!',
  g_shadow:"Who's in the Shadow?",gd_shadow:'Guess the boss from its shadow',arcHowShadow:'Pick the boss that matches the shadow',
  slMiss:'Miss',shStreak:'Streak {n}',shWho:'Who is it?'});
Object.assign(I18N.he,{g_sling:'קלע',gd_sling:'שגרו שארליז על הבוסים',arcHowSling:'מושכים אחורה, מכוונים ומשחררים!',
  g_shadow:'מי בצל?',gd_shadow:'נחשו מי הבוס לפי הצל',arcHowShadow:'בחרו את הבוס שמתאים לצל',
  slMiss:'פספוס',shStreak:'רצף {n}',shWho:'מי זה?'});
ARC_IDS.push('sling','shadow');
const bossNm65=sid=>t(BOSS_NAMES[sid]||sid);

/* ---------- game 4: sling shot (canvas) ---------- */
ARCG.sling={id:'sling',dur:40,star:1,how:'arcHowSling',coins:s=>Math.round(s/6),
  init(G){const c=document.createElement('canvas');G.stage.appendChild(c);const d=Math.min(2,devicePixelRatio||1);G.cv=c;G.g=c.getContext('2d');
    const fit=()=>{const r=G.stage.getBoundingClientRect();G.W=r.width;G.H=r.height;c.width=Math.round(r.width*d);c.height=Math.round(r.height*d);c.style.width=r.width+'px';c.style.height=r.height+'px';G.d=d;
      G.u=Math.min(G.W,G.H*.62);G.px0=G.W/2;G.py0=G.H-G.u*.42;G.R=G.u*.26;G.gr=G.H*1.7;G.vmax=Math.sqrt(2*G.gr*G.H*1.02);G.pr=G.u*.085};fit();
    G.hero=arcHeroSprite();G.targets=[];G.shot=null;G.aim=null;G.reload=0;G.combo=0;G.el=0;G.fx=[];G.gold=null;G.goldT=rnd(5,8);G.shots=0;G.hits=0;
    for(let i=0;i<3;i++)G.targets.push(this.mk(G,i));
    const pos=e=>{const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
    c.addEventListener('pointerdown',e=>{if(!G.run||G.shot||G.reload>0)return;const p=pos(e);if(p.y<G.H*.45)return;G.aim={x:p.x,y:p.y,sx:p.x,sy:p.y};c.setPointerCapture&&c.setPointerCapture(e.pointerId);if(sfx.ok())tone({f:300,f2:360,d:.08,type:'triangle',v:.05})});
    c.addEventListener('pointermove',e=>{if(!G.aim)return;const p=pos(e);G.aim.x=p.x;G.aim.y=p.y});
    const up=()=>{if(!G.aim)return;const v=this.pull(G);G.aim=null;if(!G.run||v.k<.18)return;
      const L=Math.hypot(v.dx,v.dy)||1;G.shot={x:G.px0-v.dx,y:G.py0-v.dy,vx:v.dx/L*G.vmax*v.k,vy:v.dy/L*G.vmax*v.k,rot:0,hit:0,t:0};G.shots++;
      vib(15);if(sfx.ok()){tone({f:180,f2:620,d:.18,type:'sine',v:.14});noise({d:.08,v:.06,hp:1800})}};
    c.addEventListener('pointerup',up);c.addEventListener('pointercancel',()=>{G.aim=null});
    addEventListener('resize',fit);G.off=()=>removeEventListener('resize',fit)},
  mk(G,i){const sid=pick(ARC_BOSSES.filter(s=>!G.targets.some(t=>t&&t.sid===s))),lane=i%3,
      sp=(42+Math.min(70,G.el*2.2))*rnd(.8,1.25)*(Math.random()<.5?-1:1);
    return{sid,x:rnd(G.W*.18,G.W*.82),y:G.H*(.13+lane*.15)+rnd(-8,8),vx:sp,ph:rnd(0,6),s:G.u*rnd(.2,.25),dead:0,born:.35}},
  pull(G){const a=G.aim;// drag from anywhere in the lower half: the pull is how far the finger moved from where it touched
      let dx=a.sx-a.x,dy=a.sy-a.y;const L=Math.hypot(dx,dy),m=Math.min(L,G.R);if(L>0){dx=dx/L*m;dy=dy/L*m}
      return{dx,dy,k:m/G.R}},
  hitT(G,T,x,y){T.dead=.6;T.pop=.26;T.vy=-260;T.spin=rnd(-6,6);G.shake=.18;G.combo++;G.hits++;const m=Math.min(3,1+Math.floor((G.combo-1)/3)),v=10*m;
    arcAdd(G,v,T.x,T.y-T.s*.6,m>1?'gem':null);sfx.perfect(Math.min(4,m+1));vib(20);
    for(let i=0;i<14;i++)G.fx.push({x:T.x,y:T.y,vx:rnd(-220,220),vy:rnd(-300,-40),life:.6,c:pick(['#ffd23f','#fff','#ff8ad8','#7ff3ff']),s:rnd(3,6)})},
  tick(G,dt,rdt,last){const g=G.g,W=G.W,H=G.H;
    for(const T of G.targets)if(T.born>0)T.born-=rdt;
    if(dt>0){G.el+=dt;if(G.reload>0)G.reload-=dt;
      for(let i=0;i<G.targets.length;i++){const T=G.targets[i];T.ph+=dt*2.2;
        if(T.dead){if(T.pop>0){T.pop-=dt;continue}T.dead-=dt;T.y+=T.vy*dt;T.vy+=600*dt;if(T.dead<=0)G.targets[i]=this.mk(G,i);continue}
        T.x+=T.vx*dt;const m=T.s*.55;if(T.x<m){T.x=m;T.vx=Math.abs(T.vx)}if(T.x>W-m){T.x=W-m;T.vx=-Math.abs(T.vx)}}
      G.goldT-=dt;if(!G.gold&&G.goldT<=0){const l=Math.random()<.5;G.gold={x:l?-30:W+30,y:G.H*rnd(.08,.3),vx:(l?1:-1)*rnd(130,170),ph:0};G.goldT=rnd(6,9)}
      if(G.gold){G.gold.x+=G.gold.vx*dt;G.gold.ph+=dt*4;if(G.gold.x<-60||G.gold.x>W+60)G.gold=null}
      const S=G.shot;if(S){S.t+=dt;S.x+=S.vx*dt;S.y+=S.vy*dt;S.vy+=G.gr*dt;S.rot+=dt*(S.vx>0?7:-7);
        for(const T of G.targets){if(T.dead||T.born>0)continue;const yy=T.y+Math.sin(T.ph)*6;if(Math.hypot(S.x-T.x,S.y-yy)<T.s*.42+G.pr){S.hit++;this.hitT(G,T,S.x,S.y);if(S.hit===2){arcAdd(G,15,T.x,T.y-T.s,'gem big');if(sfx.ok())sfx.pop()}}}
        if(G.gold&&Math.hypot(S.x-G.gold.x,S.y-G.gold.y)<G.u*.07+G.pr){arcAdd(G,25,G.gold.x,G.gold.y,'gem big');sfx.coin(3);for(let i=0;i<18;i++)G.fx.push({x:G.gold.x,y:G.gold.y,vx:rnd(-240,240),vy:rnd(-280,-20),life:.7,c:pick(['#ffd23f','#fff4b0','#ffb800']),s:rnd(3,6)});G.gold=null;S.hit++}
        if(S.y>H+60||S.x<-60||S.x>W+60||S.t>3.2){if(!S.hit){G.combo=0;const d=document.createElement('div');d.className='arc-fx neg sl-miss';d.textContent=t('slMiss');d.style.left=clamp(S.x,40,W-40)+'px';d.style.top=(H*.55)+'px';G.stage.appendChild(d);setTimeout(()=>d.remove(),800)}G.shot=null;G.reload=.25}}}
    const m=Math.min(3,1+Math.floor(Math.max(0,G.combo)/3)),prg=m>=3?'':' '+'●'.repeat(G.combo%3)+'○'.repeat(3-G.combo%3);G.sub={ic:'🔥',txt:'×'+m+prg,on:G.combo>=3};
    if(G.shake>0)G.shake-=rdt;
    if(last===false)return;g.setTransform(G.d,0,0,G.d,0,0);g.clearRect(0,0,W,H);if(G.shake>0)g.translate(rnd(-5,5),rnd(-4,4));
    if(G.aim){g.fillStyle='rgba(18,13,43,.16)';g.fillRect(-10,-10,W+20,H+20)}
    // targets: boss on a little cloud
    for(const T of G.targets){const yy=T.y+Math.sin(T.ph)*6,im=hzPic('boss_'+T.sid+(T.dead?'_hurt':''))||hzPic('boss_'+T.sid);
      let sc=T.born>0?1-T.born/.35:1,sy=1;if(T.pop>0){const k=1-T.pop/.26;sy=k<.35?1-.12*(k/.35):k<.7?.88+.2*((k-.35)/.35):1.08-.08*((k-.7)/.3);sc*=1/Math.sqrt(sy)}g.save();g.translate(T.x,yy);if(T.dead&&!(T.pop>0)){g.rotate((.6-T.dead)*T.spin);g.globalAlpha=Math.max(0,T.dead/.6)}g.scale(sc,sc*sy);
      if(!T.dead||T.pop>0){g.fillStyle='rgba(255,255,255,.95)';g.strokeStyle='rgba(120,140,200,.55)';g.lineWidth=2;const cw=T.s*.62;g.beginPath();g.ellipse(-cw*.45,T.s*.36,cw*.5,T.s*.13,0,0,7);g.ellipse(cw*.45,T.s*.36,cw*.5,T.s*.13,0,0,7);g.ellipse(0,T.s*.3,cw*.62,T.s*.17,0,0,7);g.fill()}
      if(im){const w=T.s,h=w*im.naturalHeight/im.naturalWidth;g.drawImage(im,-w/2,T.s*.36-h,w,h)}else{g.fillStyle='#6b2fd6';g.beginPath();g.arc(0,0,T.s*.4,0,7);g.fill()}
      g.restore()}
    if(G.gold){const gx=G.gold.x,gy=G.gold.y+Math.sin(G.gold.ph)*5,r=G.u*.07;g.strokeStyle='rgba(18,13,43,.6)';g.lineWidth=1.5;g.beginPath();g.moveTo(gx,gy+r);g.quadraticCurveTo(gx+6,gy+r*1.8,gx,gy+r*2.6);g.stroke();
      const gr=g.createRadialGradient(gx-r*.3,gy-r*.4,r*.1,gx,gy,r);gr.addColorStop(0,'#fff6c2');gr.addColorStop(.5,'#ffd23f');gr.addColorStop(1,'#e09a00');g.fillStyle=gr;g.strokeStyle=INK;g.lineWidth=3;g.beginPath();g.ellipse(gx,gy,r*.9,r,0,0,7);g.fill();g.stroke();
      const ci=hzPic('ic_coin');if(ci)g.drawImage(ci,gx-r*.55,gy-r*.6,r*1.1,r*1.1)}
    // particles
    for(const p of G.fx){p.life-=rdt;p.x+=p.vx*rdt;p.y+=p.vy*rdt;p.vy+=520*rdt;g.globalAlpha=Math.max(0,p.life*1.8);g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.s,0,7);g.fill()}g.globalAlpha=1;G.fx=G.fx.filter(p=>p.life>0);
    // slingshot
    const x0=G.px0,y0=G.py0,u=G.u,fw=u*.16,armY=y0-u*.03;
    let hx=x0,hy=y0;if(G.aim){const v=this.pull(G);hx=x0-v.dx;hy=y0-v.dy}
    // aim dots (first part of the flight only)
    if(G.aim){const v=this.pull(G);if(v.k>=.18){const L=Math.hypot(v.dx,v.dy)||1;let vx=v.dx/L*G.vmax*v.k,vy=v.dy/L*G.vmax*v.k,x=hx,y=hy;g.fillStyle='#fff';g.strokeStyle=INK;g.lineWidth=2.5;for(let i=1;i<=13;i++){const tt=.06;x+=vx*tt;y+=vy*tt;vy+=G.gr*tt;g.globalAlpha=1-i*.05;if(i<13){g.beginPath();g.arc(x,y,5.5-i*.18,0,7);g.fill();g.stroke()}else{g.lineWidth=4;g.strokeStyle='rgba(255,255,255,.9)';g.beginPath();g.arc(x,y,20,0,7);g.stroke();g.strokeStyle=INK;g.lineWidth=2;g.beginPath();g.arc(x,y,24,0,7);g.stroke();g.beginPath();g.moveTo(x-8,y);g.lineTo(x+8,y);g.moveTo(x,y-8);g.lineTo(x,y+8);g.stroke()}}g.globalAlpha=1}}
    g.lineCap='round';
    const sz=G.pr*1.55,pl=hx-sz*.62,pr=hx+sz*.62,py=hy+sz*.35;
    const bw=u*(G.aim?.036:.03);g.strokeStyle='#7a3a12';g.lineWidth=bw;g.beginPath();g.moveTo(x0-fw,armY);g.lineTo(pl,py);g.stroke();
    // fork (wood)
    const wood=g.createLinearGradient(x0-fw,0,x0+fw,0);wood.addColorStop(0,'#a8642a');wood.addColorStop(.5,'#d9924a');wood.addColorStop(1,'#8a4d1c');
    g.strokeStyle=INK;g.lineWidth=u*.07;g.beginPath();g.moveTo(x0,H+10);g.lineTo(x0,y0+u*.2);g.lineTo(x0-fw,armY);g.moveTo(x0,y0+u*.2);g.lineTo(x0+fw,armY);g.stroke();
    g.strokeStyle=wood;g.lineWidth=u*.048;g.beginPath();g.moveTo(x0,H+10);g.lineTo(x0,y0+u*.2);g.lineTo(x0-fw,armY);g.moveTo(x0,y0+u*.2);g.lineTo(x0+fw,armY);g.stroke();
    // Sharliz in the pouch (or flying)
    const S=G.shot;
    if(S){G.hero.blink+=rdt;withCtx(g,sz,()=>drawSharliz(G.hero,S.x,S.y,S.rot,S.hit?'happy':'scared',{x:0,y:-.3},.1))}
    else if(G.reload<=0){G.hero.blink+=rdt;const k=G.aim?this.pull(G).k:0;withCtx(g,sz,()=>drawSharliz(G.hero,hx,hy-sz*.15,0,k>.6?'scared':'happy',{x:0,y:-.5},k*.25))}
    // pouch + front band
    if(!S&&G.reload<=0){g.strokeStyle='#5a2a0c';g.lineWidth=u*.045;g.beginPath();g.moveTo(pl,py);g.quadraticCurveTo(hx,hy+sz*1.05,pr,py);g.stroke()}
    g.strokeStyle='#9a4a18';g.lineWidth=bw;g.beginPath();g.moveTo(x0+fw,armY);g.lineTo(pr,py);g.stroke();
    g.fillStyle=INK;[x0-fw,x0+fw].forEach(x=>{g.beginPath();g.arc(x,armY,u*.035,0,7);g.fill()});
    // first-shot guide: a hand pulling down
    if(G.run&&G.shots===0&&!G.aim){const k=(G.el*1.3)%1;g.globalAlpha=.85;g.font=(u*.13)+'px system-ui';g.textAlign='center';g.fillText('👆',x0+u*.05,y0+u*.1+k*u*.22);g.globalAlpha=1}
  },
  end(G){G.aim=null}};

/* ---------- game 5: who's in the shadow? (DOM) ---------- */
ARCG.shadow={id:'shadow',dur:45,star:1,how:'arcHowShadow',coins:s=>Math.round(s/5),
  init(G){G.streak=0;G.n=0;G.lock=false;G.hist=[];
    const w=document.createElement('div');w.className='sh-wrap';w.innerHTML='<div class="sh-q"><div class="sh-spot"></div><img class="sh-img" alt=""><span class="sh-name"></span><span class="sh-ask"></span></div><div class="sh-opts"></div>';G.stage.appendChild(w);G.w=w;
    w.querySelector('.sh-ask').textContent=t('shWho');this.next(G,true)},
  next(G,first){const pool=ARC_BOSSES.filter(s=>!G.hist.includes(s)),ans=pick(pool);G.hist.push(ans);if(G.hist.length>8)G.hist.shift();
    const opts=[ans];while(opts.length<4){const s=pick(ARC_BOSSES);if(!opts.includes(s))opts.push(s)}opts.sort(()=>Math.random()-.5);G.ans=ans;G.lock=false;
    const q=G.w.querySelector('.sh-q'),im=q.querySelector('.sh-img');q.classList.remove('rev','bad');q.querySelector('.sh-name').textContent='';im.src='art/boss_'+ans+'.webp';q.classList.remove('in');void q.offsetWidth;q.classList.add('in');
    const O=G.w.querySelector('.sh-opts');O.innerHTML='';
    opts.forEach((s,i)=>{const b=document.createElement('button');b.className='sh-opt';b.style.animationDelay=(i*.05)+'s';b.innerHTML=`<img src="art/boss_${s}.webp" alt="">`;b.setAttribute('aria-label',bossNm65(s));
      b.onclick=()=>{if(!G.run||G.lock)return;G.lock=true;const r=b.getBoundingClientRect(),st=G.stage.getBoundingClientRect(),x=r.left-st.left+r.width/2,y=r.top-st.top+r.height*.2;
        q.classList.add('rev');q.querySelector('.sh-name').textContent=bossNm65(G.ans);
        if(s===G.ans){G.streak++;G.n++;const v=G.streak>=6?20:G.streak>=3?15:10;b.classList.add('ok');arcAdd(G,v,x,y,G.streak>=3?'gem':null);sfx.perfect(Math.min(5,1+Math.floor(G.streak/2)));vib(15)}
        else{G.streak=0;b.classList.add('no');q.classList.add('bad');setTimeout(()=>O.querySelectorAll('.sh-opt').forEach(o=>{if(o.querySelector('img').src.endsWith('boss_'+G.ans+'.webp'))o.classList.add('ok','show')}),220);arcAdd(G,-5,x,y);vib([40,30,40]);if(sfx.ok())tone({f:240,f2:150,d:.25,type:'sawtooth',v:.06,filter:700})}
        setTimeout(()=>{if(G.run&&!G.dead)this.next(G)},s===G.ans?700:1000)};O.appendChild(b)})},
  tick(G){G.sub={ic:'🔥',txt:t('shStreak',{n:G.streak}),on:G.streak>=3}}};

