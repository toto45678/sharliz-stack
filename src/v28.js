/* =========================================================
   v28 — weekly missions · coin packs (test-mode store) · buddy perks + premium buddies ·
   livelier buddies (lobby + in game) · lobby carousel spin with per-personality nausea ·
   sticker-book album · a personality for every Sharliz colour
   ========================================================= */
Object.assign(I18N.en,{
  daily:'Daily',weekly:'Weekly',resetsIn:'New ones in {t}',weeklyChest:'Weekly mega chest',weeklyChestSub:'Finish all four to open',d_stars3:'Win {n} levels with 3 stars',
  coins:'Coins',testMode:'Test mode — nothing is charged. Real payments switch on when the game ships to the app stores.',payTitle:'Confirm purchase',payTest:'TEST MODE',payBtn:'Pay {p}',cancel:'Cancel',thanks:'Thank you!',bestValue:'Best value',popular:'Popular',
  perk:'Perk',pk_coins10:'+10% coins every level',pk_sticky:'Landing zones 12% wider',pk_ghost:'Saves your first lost heart each level',pk_bee:'+2 coins for every perfect',pk_fever:'Fever lasts 50% longer',pk_combo:'Combo coins ×2',pk_aim:'Aim line always on',pk_coins25:'+25% coins every level',pk_heart:'Start every level with 4 hearts',
  buddyBonus:'Buddy bonus',ghostSave:'Ghost saved you!',premium:'Premium',
  albumBook:'Sticker book',stkCount:'{a}/{b}',pg_rare:'Rare Sharliz',pg_boss:'Boss trophies',pg_world:'Worlds',pg_buddy:'Buddies',pg_hat:'Hats',pg_special:'Specials',
  hint_rare:'Spot it on the rope',hint_boss:'Beat the boss',hint_world:'Finish the world',hint_buddy:'Wardrobe → Buddy',hint_hat:'Wardrobe → Hats',hint_special:'Coming soon',newSticker:'New sticker!',
  dShort:'{d}d {h}h',hShort:'{h}h {m}m'});
Object.assign(I18N.he,{
  daily:'יומיות',weekly:'שבועיות',resetsIn:'חדשות בעוד {t}',weeklyChest:'תיבת־על שבועית',weeklyChestSub:'מסיימים את כל הארבע ופותחים',d_stars3:'לנצח ב־{n} שלבים עם 3 כוכבים',
  coins:'מטבעות',testMode:'מצב בדיקה — שום דבר לא מחויב. תשלום אמיתי יופעל כשהמשחק יעלה לחנויות.',payTitle:'אישור רכישה',payTest:'מצב בדיקה',payBtn:'לשלם {p}',cancel:'ביטול',thanks:'תודה!',bestValue:'הכי משתלם',popular:'פופולרי',
  perk:'יכולת',pk_coins10:'+10% מטבעות בכל שלב',pk_sticky:'אזורי נחיתה רחבים ב־12%',pk_ghost:'מציל את הלב הראשון שנופל בכל שלב',pk_bee:'+2 מטבעות על כל מושלם',pk_fever:'הפיבר נמשך 50% יותר',pk_combo:'מטבעות קומבו ×2',pk_aim:'קו כיוון תמיד דלוק',pk_coins25:'+25% מטבעות בכל שלב',pk_heart:'כל שלב מתחיל עם 4 לבבות',
  buddyBonus:'בונוס חבר',ghostSave:'הרוח הצילה אותך!',premium:'פרימיום',
  albumBook:'אלבום המדבקות',stkCount:'{a}/{b}',pg_rare:'שארליזים נדירים',pg_boss:'גביעי בוסים',pg_world:'עולמות',pg_buddy:'חברים',pg_hat:'כובעים',pg_special:'מיוחדים',
  hint_rare:'לגלות על החבל',hint_boss:'לנצח את הבוס',hint_world:'לסיים את העולם',hint_buddy:'ארון ← חבר',hint_hat:'ארון ← כובעים',hint_special:'בקרוב',newSticker:'מדבקה חדשה!',
  dShort:'{d} ימ׳ {h} שע׳',hShort:'{h} שע׳ {m} דק׳'});

/* ---------- store: test mode now, real billing later ----------
   To go live, set window.SharlizPay = {buy(sku) → Promise<boolean>} (Google Play Billing / App Store / Stripe)
   before the game loads. Until then IAP.buy shows a clearly-labelled test confirmation and charges nothing. */
const IAP={products:{
    coins_s:{price:'₪4.90',coins:600},coins_m:{price:'₪12.90',coins:1800,tag:'popular'},coins_l:{price:'₪24.90',coins:4200},coins_xl:{price:'₪49.90',coins:9500,tag:'bestValue'},
    buddy_cyborg:{price:'₪9.90',pet:'cyborg'},buddy_unicorn:{price:'₪14.90',pet:'unicorn'},buddy_dragon:{price:'₪19.90',pet:'dragon'}},
  live:()=>!!(window.SharlizPay&&typeof window.SharlizPay.buy==='function'),
  buy(sku,label){if(IAP.live())return Promise.resolve(window.SharlizPay.buy(sku)).then(ok=>{if(ok)IAP.grant(sku);return !!ok});
    return payModal(sku,label).then(ok=>{if(ok)IAP.grant(sku);return ok})},
  grant(sku){const P=IAP.products[sku];if(!P)return;progress.purchases=progress.purchases||[];progress.purchases.push({sku,at:Date.now(),test:!IAP.live()});
    if(P.coins){wallet().coins+=P.coins;coinShower(P.coins)}
    if(P.pet){progress.owned=progress.owned||{};progress.owned.pet=progress.owned.pet||[];if(!progress.owned.pet.includes(P.pet))progress.owned.pet.push(P.pet);lookNow().pet=P.pet}
    saveProgress();updateWalletUI()}};
function payModal(sku,label){return new Promise(res=>{const P=IAP.products[sku];sfx.click();
  const m=document.createElement('div');m.className='pay-modal';
  m.innerHTML=`<div class="pay-card"><div class="pay-tag"></div><b class="pay-t"></b><div class="pay-item"></div><div class="pay-price"></div><small class="pay-note"></small><button class="btn green pay-ok"><span></span></button><button class="btn pay-no"><span></span></button></div>`;
  m.querySelector('.pay-tag').textContent=t('payTest');m.querySelector('.pay-t').textContent=t('payTitle');m.querySelector('.pay-item').textContent=label;m.querySelector('.pay-price').textContent=P.price;
  m.querySelector('.pay-note').textContent=t('testMode');m.querySelector('.pay-ok span').textContent=t('payBtn',{p:P.price});m.querySelector('.pay-no span').textContent=t('cancel');
  const done=ok=>{m.classList.add('out');setTimeout(()=>m.remove(),220);res(ok)};
  m.querySelector('.pay-ok').onclick=()=>{sfx.flourish(2);vib([20,40,20]);done(true)};m.querySelector('.pay-no').onclick=()=>{sfx.click();done(false)};
  m.onclick=e=>{if(e.target===m)done(false)};document.getElementById('app').appendChild(m)})}
function coinShower(n){const app=document.getElementById('app'),k=Math.min(26,8+Math.round(n/400));for(let i=0;i<k;i++){const c=document.createElement('img');c.src='art/ic_coin.webp';c.className='coin-rain';
    c.style.left=(10+Math.random()*80)+'%';c.style.animationDelay=(i*.045)+'s';c.style.setProperty('--dx',(Math.random()*80-40)+'px');app.appendChild(c);setTimeout(()=>c.remove(),1800+i*45)}
  for(let i=0;i<6;i++)setTimeout(()=>sfx.coin(i),i*90);popupToast('+'+n)}
const COIN_PACKS=['coins_s','coins_m','coins_l','coins_xl'];
const _shopBody=shopBody;
shopBody=function(card){const tab=shopTab;if(tab==='coins')shopTab='boost';_shopBody(card);shopTab=tab;
  const tabs=card.querySelector('.shop-tabs');if(!tabs)return;const b=document.createElement('button');b.className='coins-tab';b.innerHTML=coinImg()+'<span></span>';b.querySelector('span').textContent=t('coins');
  b.setAttribute('aria-pressed',tab==='coins');b.onclick=()=>{shopTab='coins';sfx.click();rerenderOverlay()};tabs.prepend(b);
  if(tab!=='coins')return;tabs.querySelectorAll('button').forEach(x=>{if(x!==b)x.setAttribute('aria-pressed','false')});
  const list=card.querySelector('.shop-list');list.className='shop-list packs';list.innerHTML='';
  COIN_PACKS.forEach((sku,i)=>{const P=IAP.products[sku],r=document.createElement('button');r.className='pack t'+i+(P.tag?' tagged':'');
    r.innerHTML=(P.tag?`<i class="pk-tag"></i>`:'')+`<span class="pk-pile">${'<img src="art/ic_coin.webp" alt="">'.repeat(i+2)}</span><b>${P.coins.toLocaleString()}</b><em>${P.price}</em>`;
    if(P.tag)r.querySelector('.pk-tag').textContent=t(P.tag);
    r.onclick=()=>IAP.buy(sku,P.coins.toLocaleString()+' '+t('coins')).then(ok=>{if(ok&&rerenderOverlay)rerenderOverlay()});list.appendChild(r)});
  const n=document.createElement('p');n.className='pay-foot';n.textContent=t('testMode');list.appendChild(n)};

/* ---------- buddies: every buddy helps, three premium ones ---------- */
Object.assign(WPET,{cyborg:{p:0,real:'buddy_cyborg',n:['Cyborg Sharliz','שארליז סייבורג']},unicorn:{p:0,real:'buddy_unicorn',n:['Unicorn','חד־קרן']},dragon:{p:0,real:'buddy_dragon',n:['Baby dragon','דרקונצ׳יק']}});
const PERKS={chick:'coins10',slime:'sticky',ghost:'ghost',bee:'bee',star:'fever',mini:'combo',cyborg:'aim',unicorn:'coins25',dragon:'heart'};
function petNow(){return (progress.look&&progress.look.pet)||'none'}
function perk(k){return mode!=='duo'&&PERKS[petNow()]===k&&wOwned('pet',petNow())}
const _wOwned=wOwned;
wOwned=function(cat,id){const T0=cat!=='hat'&&WTAB[cat]&&WTAB[cat][id];if(T0&&T0.real)return ((progress.owned||{})[cat]||[]).includes(id);return _wOwned(cat,id)};
const _wNewIn=wNewIn;
wNewIn=function(cat){if(cat==='pet'){const seen=progress.wSeen||[];return wItems(cat).some(id=>!WPET[id].real&&!wOwned(cat,id)&&wPrice(cat,id)<=progress.coins&&!seen.includes(cat+':'+id))}return _wNewIn(cat)};
function wIsReal(cat,id){const T0=cat!=='hat'&&WTAB[cat]&&WTAB[cat][id];return T0&&T0.real?T0.real:null}
function buyReal(cat,id){const sku=wIsReal(cat,id);IAP.buy(sku,wName(cat,id)).then(ok=>{if(!ok)return;W3.preview&&(W3.preview.pet=id);LOB.jump=time;setHero3DSkin();rebakeIfNeeded();renderWardrobe();popupToast(t('thanks'))})}
const _tallyRows=tallyRows;
tallyRows=function(won){const rows=_tallyRows(won);if(mode==='duo')return rows;const base=rows.reduce((a,r)=>a+r[2],0);let add=0;
  if(perk('coins10'))add=Math.round(base*.1);else if(perk('coins25'))add=Math.round(base*.25);else if(perk('bee'))add=(lv.perfect||0)*2;else if(perk('combo')&&lv.best>=2)add=lv.best*2;
  if(!won)add=Math.ceil(add/2);if(add>0)rows.push([t('buddyBonus'),wName('pet',petNow()),add]);return rows};
const _startLevel=startLevel;
startLevel=function(l){_startLevel(l);lv.ghost=perk('ghost');BUD.ev=null;BUD.perf=0;BUD.x=null;buddyEnsure()};
const _loseHeart=loseHeart;
loseHeart=function(msg,x,y,silent,key){if(lv.ghost&&hearts>0){lv.ghost=false;combo=0;popup(t('ghostSave'),x,y-BH*.6,'#e9e4ff');sfx.bloop();BUD.ev='save';BUD.evT=time;vib(20);state='wait';spawnAt=time+.9;updateHud();return}
  _loseHeart(msg,x,y,silent,key)};

/* the three premium buddies, built like the others in real 3D */
const _buildPet=buildPet;
buildPet=function(T,id){if(id!=='cyborg'&&id!=='unicorn'&&id!=='dragon')return _buildPet(T,id);
  const g=new T.Group(),u={g,id,t:Math.random()*5};B3OPT=B3LOBBY;const P=buildSharliz3D(T);
  const look={pattern:'none',lashes:'none',glasses:'none',outfit:'none',hat:'none'};
  if(id==='cyborg')applyLook(P,Object.assign(look,{color:'chrome',eyes:'white'}));
  if(id==='unicorn')applyLook(P,Object.assign(look,{color:'snow',eyes:'white',lashes:'long'}));
  if(id==='dragon')applyLook(P,Object.assign(look,{color:'lime',eyes:'white'}));
  P.g.scale.setScalar(.42);g.add(P.g);u.P=P;u.h=.63;const m=P.m,ink=s=>{const k=new T.Mesh(s.geometry,INKM());k.scale.setScalar(1.08);s.add(k);return s};
  if(id==='cyborg'){
    const red=new T.MeshStandardMaterial({color:'#ff2244',emissive:'#ff0030',emissiveIntensity:1.4}),grey=wm('#8a90a6',{metalness:.8,roughness:.25});
    const visor=new T.Mesh(new T.CircleGeometry(.11,28),red);const ex=B_EX,ez=surfZ(ex,B_EY)+.07;visor.position.set(ex,B_EY,ez);visor.rotation.y=Math.atan2(ex,ez)*.8;m.add(ink(visor));
    const ant=new T.Mesh(new T.CylinderGeometry(.015,.015,.22,10),grey);ant.position.set(-.12,.82,0);ant.rotation.z=.25;m.add(ink(ant));
    const bulb=new T.Mesh(new T.SphereGeometry(.05,16,12),red);bulb.position.set(-.15,.94,0);m.add(ink(bulb));u.bulb=bulb;
    for(const sx of[-1,1]){const bolt=new T.Mesh(new T.CylinderGeometry(.07,.07,.08,18),grey);bolt.rotation.z=Math.PI/2;bolt.position.set(sx*.47,.12,0);m.add(ink(bolt))}
    const plate=new T.Mesh(new T.TorusGeometry(.2,.018,8,30,Math.PI),grey);plate.position.set(-.05,.42,surfZ(-.05,.42)+.01);plate.rotation.z=.5;m.add(plate);u.laser=true}
  if(id==='unicorn'){
    const pts=[];for(let i=0;i<=12;i++){const f=i/12;pts.push(new T.Vector2(.07*(1-f)+.003,f*.34))}
    const horn=new T.Mesh(new T.LatheGeometry(pts,24),wm('#ffd76a',{metalness:.55,roughness:.2,emissive:'#ffb000',emissiveIntensity:.25}));horn.position.set(0,.7,.06);horn.rotation.x=.25;m.add(ink(horn));
    const cols=['#ff5c8a','#ff9a2e','#ffd23f','#5ee85a','#3aa8ff','#8a4dff'];cols.forEach((c,i)=>{const b=new T.Mesh(new T.SphereGeometry(.085,16,12),wm(c));const a=-.9+i*.36;b.position.set(Math.sin(a)*.18-.02,.62-i*.07,-.18-Math.cos(a)*.08);m.add(ink(b))});
    for(const sx of[-1,1]){const ear=new T.Mesh(new T.ConeGeometry(.06,.14,14),wm('#ffffff'));ear.position.set(sx*.26,.68,0);ear.rotation.z=-sx*.35;m.add(ink(ear))}u.rainbow=true}
  if(id==='dragon'){
    const dk=wm('#2f9e44'),bel=wm('#d9f99d');
    for(const sx of[-1,1]){const h=new T.Mesh(new T.ConeGeometry(.045,.16,12),wm('#fff3c4'));h.position.set(sx*.17,.76,0);h.rotation.z=-sx*.3;m.add(ink(h))}
    const belly=new T.Mesh(new T.SphereGeometry(.3,24,16),bel);belly.scale.set(1,1.1,.35);belly.position.set(0,-.35,surfZ(0,-.35)-.06);m.add(belly);
    for(let i=0;i<4;i++){const sp=new T.Mesh(new T.ConeGeometry(.05,.12,10),dk);const y=.55-i*.28;sp.position.set(0,y,-surfZ(0,y)+.02);sp.rotation.x=-1.2;m.add(ink(sp))}
    const tail=new T.Mesh(new T.ConeGeometry(.09,.4,12),wm('#8ad63a'));tail.position.set(.25,-.62,-.35);tail.rotation.set(-1.3,0,-.8);m.add(ink(tail));
    u.wings=[];const sh=new T.Shape();sh.moveTo(0,0);sh.quadraticCurveTo(.25,.28,.5,.22);sh.quadraticCurveTo(.42,.1,.46,0);sh.quadraticCurveTo(.34,.04,.34,-.08);sh.quadraticCurveTo(.2,-.02,0,-.1);sh.closePath();
    for(const sx of[-1,1]){const w=new T.Mesh(new T.ShapeGeometry(sh),new T.MeshStandardMaterial({color:'#4ade80',side:T.DoubleSide,roughness:.5}));const pv=new T.Group();pv.position.set(sx*.18*.42,.62*.42+.25,-.12);w.scale.set(sx*.42,.42,.42);pv.add(w);g.add(pv);u.wings.push(pv)}
    u.float=1}
  return u};
const _petStep=petStep;
petStep=function(u,tt,dt){if(u.id==='dragon'){u.t+=dt;if(u.wings)u.wings.forEach((w,i)=>w.rotation.y=Math.sin(u.t*14)*.7*(i?1:-1));if(u.P){const bl=(u.t%3.1)<.14;setFace3(u.P,0,bl?1:0)}return}
  _petStep(u,tt,dt);if(u.bulb)u.bulb.material.emissiveIntensity=1+Math.sin(u.t*6)*.8};

/* buddies come alive in the lobby: they hop around you, stop to chat, flyers circle your head */
const BUDL={jump:-9};
function petLobby(u,size,baseY,hx){const dt=Math.min(.05,frameDt),ps=size*1.05;u.g.scale.setScalar(ps);u.tt=(u.tt||0)+dt;const t=u.tt;
  const R=size*.95,sick=!!SPIN.phase,fast=Math.abs(SPIN.v)>5,away=sick||fast?1.3:1;let look=0;
  // keep the per-type animation (wings, blink, bulb) running
  const keepY=u.g.position.y;petStep(u,time,dt);u.g.position.y=keepY;
  if(u.ang===undefined){u.ang=Math.PI*.85;u.rr=R}
  u.rr+=(R*away-u.rr)*Math.min(1,dt*3);
  const tj=time-BUDL.jump,tapJ=tj>.12&&tj<.82?Math.sin((tj-.12)/.7*Math.PI):0;
  if(u.float){const sp=u.id==='bee'?1.7:u.id==='ghost'?.6:u.id==='dragon'?1.05:.85;u.ang+=sp*dt*(sick?.3:1);
    let r=u.rr*(u.id==='bee'?1+.14*Math.sin(t*7.3):1),x=Math.cos(u.ang)*r,z=Math.sin(u.ang)*r*.7,y=size*(u.id==='ghost'?.95:1.3)+Math.sin(t*2.4)*size*.12+(u.id==='bee'?Math.sin(t*11)*size*.05:0);
    if(u.id==='ghost'){const pk=(t%9)/9;if(pk>.7){const e=(pk-.7)/.3;x=Math.sin(e*Math.PI*2)*size*.55;z=-R*.55;y=size*(.4+Math.sin(e*Math.PI)*1.15)}}
    if(sick)y+=Math.sin(t*9)*size*.06;
    u.g.position.set(hx+x,baseY+(y+tapJ*size*.25)*1,z);const vx=-Math.sin(u.ang),vz=Math.cos(u.ang)*.7;u.g.rotation.set(Math.sin(t*2)*.08,Math.atan2(vx,vz),Math.sin(t*1.7)*.1+(u.id==='bee'?Math.sin(t*13)*.1:0));
    if(z>0&&Math.abs(x)<R*.9)look=Math.atan2(x,z+size)*.35}
  else{const cyc=t%13,chat=cyc>6.5&&cyc<9.2,sp=sick?1.6:chat?0:cyc>9.2?1.15:.55;u.ang+=sp*dt;
    const x=Math.cos(u.ang)*u.rr,z=Math.sin(u.ang)*u.rr*.55;let hop=sp>0?Math.abs(Math.sin(t*(sick?11:7.5))):chat?Math.max(0,Math.sin(t*6))*1.3:0;
    hop=Math.max(hop,tapJ*1.8);const sq=hop<.15&&sp>0?.88:1;
    u.g.position.set(hx+x,baseY+hop*size*.16,z);u.g.scale.set(ps*(2-sq),ps*sq,ps*(2-sq));
    let head=Math.atan2(-Math.sin(u.ang),Math.cos(u.ang)*.55);if(chat||sick)head=Math.atan2(hx-(hx+x),-z)+(sick?Math.PI:0);
    head+=tapJ*Math.PI*2*(tj<.82?1:0);u.g.rotation.set(0,head,sp>0?Math.sin(t*15)*.06:0);
    if(chat&&z>-R*.2)look=Math.atan2(x,z+size*1.2)*.6;
    if(u.P&&(chat||tapJ>0))setFace3(u.P,2)}
  if(u.P&&sick)setFace3(u.P,3);
  return look}

/* buddies in a level: a little helper by the base of the tower */
const BUD={id:'',img:null,x:null,ev:null,evT:0,perf:0,hop:0};
function buddyEnsure(){const id=petNow();const want=id!=='none'&&wOwned('pet',id)?id:'none';if(want===BUD.id&&(BUD.img||want==='none'))return;BUD.id=want;BUD.img=null;
  if(want==='none'||typeof H3==='undefined'||H3.state!=='ready')return;try{const u=wThumb('pet',want);if(u){const im=new Image();im.src=u;BUD.img=im}}catch(e){}}
function drawBuddyGame(){if(!BUD.img||!BUD.img.complete||!tower.length||mode==='duo')return;const im=BUD.img;
  const base=tower[0],x0=xOf(base.xs),gy=sy(yOf(0))+BH*.5,fly=PETFLY[BUD.id],bs=S*1.05,home=x0-S*1.35;
  if(BUD.x===null)BUD.x=home;
  if(lv.perfect>BUD.perf){BUD.perf=lv.perfect;if(!BUD.ev||BUD.ev==='cheer'){BUD.ev='cheer';BUD.evT=time}}
  let tx=home,y=gy,rot=0,sx=1,sq=1,tt=time;const danger=swayK>.55||collapsing;
  if(state==='win'){const h=Math.abs(Math.sin(tt*7));y-=h*BH*.5;rot=Math.sin(tt*7)*.25;sx=Math.cos(tt*3.5)>0?1:-1}
  else if(BUD.ev==='save'&&time-BUD.evT<1.4){const e=(time-BUD.evT)/1.4,top=sy(yOf(tower.length))+BH*.2;y=gy+(top-gy)*Math.sin(e*Math.PI);tx=home+Math.sin(e*Math.PI)*S*1.2;rot=e*Math.PI*4;
    ctx.save();ctx.globalAlpha=.5*(1-e);ctx.fillStyle='#e9e4ff';ctx.beginPath();ctx.arc(tx,y-bs*.4,bs*(.8+e),0,7);ctx.fill();ctx.restore()}
  else if(BUD.ev==='cheer'&&time-BUD.evT<.8){const e=(time-BUD.evT)/.8;y-=Math.sin(e*Math.PI)*BH*.7;rot=e*Math.PI*2;if(e<.05)burst(home,scrToW(gy-BH),['#ff5c8a','#ffd23f','#ffffff'],6,120)}
  else if(collapsing){tx=home-S*.4;sq=.82+Math.sin(tt*40)*.04;}
  else if(danger){tx=home+Math.sin(tt*7)*S*.55;y-=Math.abs(Math.sin(tt*14))*BH*.12;sx=Math.cos(tt*7)>0?1:-1}
  else{if(BUD.ev&&time-BUD.evT>1.4)BUD.ev=null;const h=Math.max(0,Math.sin(tt*4.2));y-=h*h*BH*.14;sq=h<.08?.9:1;rot=Math.sin(tt*1.3)*.06}
  if(fly){y-=BH*.95+Math.sin(tt*2.6)*BH*.12}
  BUD.x+=(tx-BUD.x)*Math.min(1,frameDt*6);const x=BUD.x,ih=bs*im.naturalHeight/im.naturalWidth;
  ctx.save();ctx.globalAlpha=.25;ctx.fillStyle=LINE;ctx.beginPath();ctx.ellipse(x,gy-2,bs*.32*(fly?.6:1),bs*.08,0,0,7);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(sx*(2-sq),sq);ctx.drawImage(im,-bs/2,-ih*.86,bs,ih);ctx.restore();
  // the cyborg's red targeting beam
  if(BUD.id==='cyborg'&&swinger&&!swinger.entering&&state==='aim'){const {dxs}=predictLanding(),lx=xOf(swinger.xs)+dxs*S,ly=sy(yOf(tower.length))+BH*.42,ex=x+bs*.12,ey=y-ih*.55;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,40,70,.55)';ctx.lineWidth=2.2;ctx.setLineDash([6,5]);ctx.lineDashOffset=-time*40;ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(lx,ly);ctx.stroke();
    ctx.setLineDash([]);ctx.fillStyle='rgba(255,60,80,.9)';ctx.beginPath();ctx.arc(lx,ly,3.5+Math.sin(time*12)*1.2,0,7);ctx.fill();ctx.restore()}}
const PETFLY={ghost:1,bee:1,star:1,dragon:1};

/* ---------- weekly missions ---------- */
function weekKey(){const d=new Date(),day=(d.getDay()+6)%7,m=new Date(d.getFullYear(),d.getMonth(),d.getDate()-day);return m.getFullYear()+'-'+(m.getMonth()+1)+'-'+m.getDate()}
const WEEKLY_POOL=[{id:'perfects',n:80},{id:'wins',n:15},{id:'floors',n:300},{id:'defuse',n:12},{id:'shoo',n:12},{id:'combo5',n:10},{id:'bossHits',n:40},{id:'stars3',n:6}];
function weekly(){const wk=weekKey();if(!progress.weekly||progress.weekly.wk!==wk){const r=mulberry(strHash(wk+'|week')),pool=WEEKLY_POOL.slice(),ms=[];
    for(let i=0;i<4;i++)ms.push(Object.assign({p:0,claimed:false},pool.splice(Math.floor(r()*pool.length),1)[0]));progress.weekly={wk,ms,chest:false};saveProgress()}
  return progress.weekly}
function trackW(id,amt=1){if(mode==='duo')return;const w=weekly();let ch=false;for(const m of w.ms)if(m.id===id&&m.p<m.n){m.p=Math.min(m.n,m.p+amt);ch=true;if(m.p>=m.n)popup(t('missionDone'),W/2,scrToW(H*.42),'#c08bff')}if(ch)saveProgress()}
function untilMidnight(){const n=new Date(),m=new Date(n.getFullYear(),n.getMonth(),n.getDate()+1),mins=Math.max(1,Math.round((m-n)/6e4));return t('hShort',{h:Math.floor(mins/60),m:mins%60})}
function untilMonday(){const n=new Date(),day=(n.getDay()+6)%7,m=new Date(n.getFullYear(),n.getMonth(),n.getDate()-day+7),hrs=Math.max(1,Math.round((m-n)/36e5));return t('dShort',{d:Math.floor(hrs/24),h:hrs%24})}
function weeklyClaimable(){try{const w=weekly();return w.ms.filter(m=>m.p>=m.n&&!m.claimed).length+(!w.chest&&w.ms.every(m=>m.claimed)?1:0)}catch(e){return 0}}
let misTab='daily';
function missionRow(m,reward,txt,onClaim){const r=document.createElement('div');r.className='mission'+(m.p>=m.n?' done':'');
  r.innerHTML=`<div class="m-txt"><b></b><i style="--p:${m.p/m.n}"></i><small>${m.p}/${m.n}</small></div><button class="buy"${m.p>=m.n&&!m.claimed?'':' disabled'}>${m.claimed?'✓':coinImg()+reward}</button>`;
  r.querySelector('b').textContent=txt;r.querySelector('button').onclick=()=>{if(m.p<m.n||m.claimed)return;onClaim()};return r}
openMissions=function(){sfx.click();showOverlay(()=>({title:t('missions'),extra:card=>{
  const tabs=document.createElement('div');tabs.className='toggle mis-tabs';
  [['daily',t('daily')],['weekly',t('weekly')]].forEach(([k,l])=>{const b=document.createElement('button');b.textContent=l;b.setAttribute('aria-pressed',misTab===k);
    if(k!==misTab&&(k==='weekly'?weeklyClaimable():0)){const d=document.createElement('i');d.className='dot';b.appendChild(d)}b.onclick=()=>{misTab=k;sfx.click();rerenderOverlay()};tabs.appendChild(b)});
  card.appendChild(tabs);const rs=document.createElement('div');rs.className='mis-reset';rs.textContent=t('resetsIn',{t:misTab==='daily'?untilMidnight():untilMonday()});card.appendChild(rs);
  const box=document.createElement('div');box.className='mission-list';
  if(misTab==='daily'){const d=daily();
    d.ms.forEach(m=>box.appendChild(missionRow(m,40,t('d_'+m.id,{n:m.n}),()=>{m.claimed=true;progress.coins+=40;saveProgress();sfx.coin(3);rerenderOverlay();updateWalletUI()})));
    const c=document.createElement('div');c.className='mission chest'+(d.chest?' done':'');c.innerHTML=`<img src="art/${d.chest?'ic_chest_open':'ic_gift'}.webp" alt=""><div class="m-txt"><b></b></div><button class="buy"${d.chest?' disabled':''}>${d.chest?'✓':t('open')}</button>`;
    c.querySelector('b').textContent=t('dailyChest');c.querySelector('button').onclick=()=>{if(d.chest)return;d.chest=true;const g=30+Math.floor(Math.random()*51);progress.coins+=g;saveProgress();sfx.coin(4);popupToast('+'+g);rerenderOverlay();updateWalletUI()};box.appendChild(c)}
  else{const w=weekly();
    w.ms.forEach(m=>box.appendChild(missionRow(m,150,t('d_'+m.id,{n:m.n}),()=>{m.claimed=true;progress.coins+=150;saveProgress();sfx.coin(4);coinShower(150);rerenderOverlay();updateWalletUI()})));
    const ready=w.ms.every(m=>m.claimed),c=document.createElement('div');c.className='mission chest mega'+(w.chest?' done':ready?' ready':'');
    c.innerHTML=`<img src="art/${w.chest?'ic_chest_open':'ic_chest'}.webp" alt=""><div class="m-txt"><b></b><small class="sub"></small></div><button class="buy"${!w.chest&&ready?'':' disabled'}>${w.chest?'✓':t('open')}</button>`;
    c.querySelector('b').textContent=t('weeklyChest');c.querySelector('.sub').textContent=w.chest?'':ready?'500 + 2× '+t('boosters'):t('weeklyChestSub');
    c.querySelector('button').onclick=()=>{if(w.chest||!ready)return;w.chest=true;progress.coins+=500;const inv=wallet().inv;for(let i=0;i<2;i++){const b=pick(['slow','laser','shield','heart']);inv[b]=(inv[b]||0)+1}saveProgress();sfx.flourish(3);coinShower(500);rerenderOverlay();updateWalletUI()};box.appendChild(c)}
  card.appendChild(box)},actions:[{label:t('close'),primary:true,fn:()=>{hideOverlay();updateWalletUI()}}]}),true)};
const _missionBadge=missionBadge;
missionBadge=function(){let n=0;try{const d=daily();n=d.ms.filter(m=>m.p>=m.n&&!m.claimed).length+(d.chest?0:1)+weeklyClaimable()}catch(e){}document.querySelectorAll('[data-badge]').forEach(b=>{b.hidden=!n;b.textContent=n})};

/* ---------- a personality for every Sharliz (like Tzach's drawings) ----------
   yellow-orange: the worrier · teal: the goofball · pink: the sweet sleepy one · berry: the grump · gold: the diva */
const PERS={'#f6ba36':'nervous','#06a2ba':'goofy','#ff6b98':'sweet','#c61e72':'grumpy'};PERS[GOLDC]='diva';
const PERS_LOOK={pink:'sweet',orange:'nervous',teal:'goofy',magenta:'grumpy',lime:'goofy',sky:'nervous',grape:'grumpy',cherry:'grumpy',lemon:'diva',mint:'goofy',snow:'sweet',shadow:'grumpy',gold:'diva',chrome:'diva',neon:'goofy'};
function heroPers(){return PERS_LOOK[lookNow().color]||'goofy'}
function persOf(s){if(s.gold)return 'diva';if(s.color==='hero')return heroPers();return PERS[s.color]||null}
const BEATS={nervous:['peek','flinch'],goofy:['wiggle','bounce'],sweet:['doze','love'],grumpy:['huff','huff'],diva:['pose','pose']},BEATLEN={peek:1.6,flinch:.8,wiggle:1.4,bounce:1.2,doze:3.6,love:1.4,huff:1.2,pose:1.4};
FACE.sleep=1;MOODS.sleep=['lid','none'];
const PM={mood:null,dx:0,dy:0,rot:0,sq:0,emo:null,look:null};
function persMood(s,i,n,mood){const R=PM;R.mood=mood;R.dx=0;R.dy=0;R.rot=0;R.sq=0;R.emo=null;R.look=null;
  const p=persOf(s);if(!p||s.kind||state==='over'||state==='title')return R;
  if(s._pt===undefined){s._pt=time+rnd(2,8);s._pa=null}
  const danger=swayK>.5||!!collapsing;
  if(!s._pa&&time>s._pt&&!danger&&!mood&&state!=='win'){s._pa=pick(BEATS[p]);s._pe=time+BEATLEN[s._pa]}
  if(s._pa&&(time>s._pe||danger)){s._pa=null;s._pt=time+rnd(4,10)*(p==='goofy'?.6:1)}
  const a=s._pa,u=a?clamp(1-(s._pe-time)/BEATLEN[a],0,1):0;
  if(p==='nervous'){if(!mood&&swayK>.28&&i>0){R.mood='nervous';R.dx=Math.sin(time*55+i)*1.6;R.emo='shake'}
    if(a==='peek'){R.mood='wide';R.look={x:Math.sin(time*2.5)>0?1:-1,y:.4,forced:true};R.emo='sweat'}
    if(a==='flinch'){R.mood='nervous';R.sq=Math.sin(u*Math.PI)*.3;R.dx=Math.sin(time*60)*1.2;R.emo='sweat'}
    if(mood==='scared')R.emo='shake'}
  else if(p==='goofy'){if(a==='wiggle'){R.mood='happy';R.rot=Math.sin(u*Math.PI*6)*.13;R.sq=Math.sin(u*Math.PI*12)*.14;R.emo='note'}
    if(a==='bounce'){R.mood='happy';R.dy=-Math.abs(Math.sin(u*Math.PI*3))*BH*.1;R.sq=-Math.abs(Math.sin(u*Math.PI*3))*.12}
    if(mood==='scared')R.mood='wide'}
  else if(p==='sweet'){if(a==='doze'){R.mood='sleep';R.rot=Math.sin(time*1.3)*.05;R.emo='z'}if(a==='love'){R.mood='happy';R.emo='heart'}
    if(mood==='scared'||(danger&&i>0)){R.emo='tear';if(!mood)R.mood='strain'}}
  else if(p==='grumpy'){if(!mood&&!a&&i>0&&(Math.floor(time/2.7+i*1.7)%3===0))R.mood='annoyed';
    if(a==='huff'){R.mood='annoyed';R.emo='vein';R.dx=Math.sin(u*Math.PI*10)*1.4}
    if(mood==='scared'){R.mood='annoyed';R.emo='vein'}}
  else if(p==='diva'){R.emo='spark';if(a==='pose'){R.mood='happy';R.rot=-.12*Math.sin(u*Math.PI)}}
  return R}
const EMO=[];
function drawEmotes(){if(!EMO.length)return;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  for(const [e,x,y,s] of EMO){const hx=x+S*.36,hy=y-BH*.62,k=S/60,ph=(s.blink||0)*1.7;
    if(e==='z'){ctx.font=`${Math.round(14*k)}px "Lilita One",system-ui`;ctx.textAlign='center';for(let j=0;j<3;j++){const u=((time*.55+j/3)%1);ctx.globalAlpha=Math.sin(u*Math.PI);const sz=.7+u*.6;ctx.save();ctx.translate(hx+u*S*.35,hy-u*BH*.55);ctx.scale(sz,sz);ctx.lineWidth=4;ctx.strokeStyle=INK;ctx.strokeText('z',0,0);ctx.fillStyle='#d9ccff';ctx.fillText('z',0,0);ctx.restore()}}
    else if(e==='sweat'){const u=(time*1.2+ph)%1;ctx.globalAlpha=1-u*.6;ctx.fillStyle='#8fdcff';ctx.strokeStyle=INK;ctx.lineWidth=2;const dx=hx+S*.02,dy=y-BH*.35+u*BH*.25;ctx.beginPath();ctx.moveTo(dx,dy-8*k);ctx.quadraticCurveTo(dx+6*k,dy+2*k,dx,dy+5*k);ctx.quadraticCurveTo(dx-6*k,dy+2*k,dx,dy-8*k);ctx.fill();ctx.stroke()}
    else if(e==='shake'){ctx.globalAlpha=.8+Math.sin(time*30)*.2;ctx.strokeStyle=INK;ctx.lineWidth=2.4*k;for(const sd of[-1,1])for(let j=0;j<2;j++){const ox=x+sd*(S*.58+j*5*k),oy=y-BH*.18+j*6*k;ctx.beginPath();ctx.moveTo(ox,oy-6*k);ctx.lineTo(ox+sd*3*k,oy+6*k);ctx.stroke()}}
    else if(e==='vein'){const p=1+Math.sin(time*9)*.15;ctx.globalAlpha=1;ctx.save();ctx.translate(hx,hy+BH*.12);ctx.scale(p*k,p*k);ctx.strokeStyle='#e2233f';ctx.lineWidth=3.2;for(let q=0;q<4;q++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(2,-7);ctx.quadraticCurveTo(2,-2,7,-2);ctx.stroke()}ctx.restore()}
    else if(e==='note'){const u=(time*.8+ph)%1;ctx.globalAlpha=Math.sin(u*Math.PI);ctx.font=`${Math.round(18*k)}px system-ui`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle=INK;ctx.fillStyle='#ffe24d';const nx=hx+Math.sin(u*7)*5*k,ny=hy-u*BH*.5;ctx.strokeText('♪',nx,ny);ctx.fillText('♪',nx,ny)}
    else if(e==='heart'){const u=(time*.9+ph)%1;ctx.globalAlpha=Math.sin(u*Math.PI);ctx.fillStyle='#ff4f8a';ctx.strokeStyle=INK;ctx.lineWidth=2;heartPath(ctx,hx,hy-u*BH*.45,7*k*(1+u*.3));ctx.fill();ctx.stroke()}
    else if(e==='tear'){for(const sd of[-1,1]){const u=((time*1.6+(sd>0?.5:0))%1);ctx.globalAlpha=1-u;ctx.fillStyle='#7cc8ff';ctx.beginPath();ctx.ellipse(x+sd*S*(.3+u*.25),y-BH*.12+u*BH*.35,2.6*k,3.6*k,0,0,7);ctx.fill()}}
    else if(e==='spark'){ctx.fillStyle='#fff6c0';for(let j=0;j<3;j++){const u=(time*.7+j/3+ph)%1,a=j*2.1+time*.6;ctx.globalAlpha=Math.sin(u*Math.PI);ctx.save();ctx.translate(x+Math.cos(a)*S*.62,y-BH*.15+Math.sin(a)*BH*.45);ctx.rotate(time*2);starPath(ctx,0,0,5*k*(.6+u),1.6*k,4);ctx.fill();ctx.restore()}}}
  ctx.restore();EMO.length=0}

/* baked personality features: brows for the worrier and the grump, buck teeth for the goofball, rosy cheeks + lashes for the sweet one, glam lashes for the diva */
const PERS_LOOKX={sweet:{lashes:'short'},diva:{lashes:'curly'}};
function persBake(P,col){const T=P.T,p=col==='hero'?null:PERS[col]||null;
  if(!P.persG){P.persG=new T.Group();P.m.add(P.persG);P.blush=[];P.m.traverse(o=>{if(o.material&&o.material.transparent&&o.geometry&&o.geometry.type==='CircleGeometry'&&o.material.opacity<.5)P.blush.push(o)})}
  wclear(P.persG);P.teeth=null;P.blush.forEach(b=>b.material.opacity=p==='sweet'?.75:.38);
  const ink=new T.MeshBasicMaterial({color:'#120d2b'});
  if(p==='nervous'||p==='grumpy'){for(const sx of[-1,1]){const x=sx*(B_EX+.015),y=B_EY+B_ERY+(p==='grumpy'?.035:.08),z=surfZ(x,y)+.012,b=new T.Mesh(new T.CapsuleGeometry(.024,.15,4,10),ink);
      b.position.set(x,y,z);b.rotation.set(0,Math.atan2(x,z)*.9,Math.PI/2+(p==='nervous'?-1:1)*sx*.45);P.persG.add(b)}}
  if(p==='goofy'){const tm=new T.MeshPhysicalMaterial({color:'#ffffff',roughness:.25,clearcoat:.6});const g=new T.Group();
    for(const sx of[-1,1]){const tt=new T.Mesh(new T.BoxGeometry(.04,.048,.014),tm);tt.position.set(sx*.022,0,0);const e=new T.Mesh(new T.BoxGeometry(.05,.058,.008),ink);e.position.z=-.006;tt.add(e);g.add(tt)}
    P.persG.add(g);P.teeth=g}}
function persFace(P,f){if(!P.teeth)return;const F=FACES3[f]||FACES3[0],ms=B3OPT.mouth,mz=surfZ(0,B_MY);
  const yy={smile:-.012,open:.07*ms-.026,scream:.062*ms*.95-.03,o:.034*ms-.026,flat:-.024}[F.mouth];P.teeth.visible=yy!==undefined;P.teeth.position.set(0,B_MY+(yy||0),mz+.02)}

/* ---------- lobby: spin your Sharliz like a carousel — spin too much and it gets sick ---------- */
const SPIN={drag:null,v:0,acc:0,phase:null,t0:0,lastX:0,lastT:0,moved:0,green:0,kind:null,fx:[],tint:null,mouth:null};
function lobbyDown(e){if(W3.on){wdDrag=e.clientX;return}const G=lobbyGeo(),size=heroSize();
  if(Math.abs(e.clientX-G.stageX)<size*1.25&&e.clientY<G.stageY+size*.3&&e.clientY>G.stageY-size*2.5){audio();SPIN.drag=e.pointerId;SPIN.lastX=e.clientX;SPIN.lastT=performance.now();SPIN.moved=0}}
function lobbyMove(e){if(wdDrag&&W3.on){H3.yaw+=(e.clientX-wdDrag)*.012;wdDrag=e.clientX;return}if(SPIN.drag==null||SPIN.phase)return;
  const now=performance.now(),dx=e.clientX-SPIN.lastX,dt=Math.max(4,now-SPIN.lastT)/1000,d=dx*.017;SPIN.moved+=Math.abs(dx);H3.yaw+=d;SPIN.v=SPIN.v*.5+(d/dt)*.5;SPIN.v=clamp(SPIN.v,-40,40);SPIN.lastX=e.clientX;SPIN.lastT=now;
  if(Math.abs(SPIN.v)>9&&Math.random()<.08&&sfx.ok())tone({f:500+Math.abs(SPIN.v)*25,d:.07,type:'sine',v:.03})}
function lobbyUp(){wdDrag=null;if(SPIN.drag==null)return;SPIN.drag=null;
  if(SPIN.moved<10){SPIN.v=0;if(time-LOB.jump>.8&&!SPIN.phase){LOB.jump=time;LOB.tapN++;sfx.perfect(1+(LOB.tapN%3));vib(15);BUDL.jump=time}}
  else if(performance.now()-SPIN.lastT>140)SPIN.v*=.25}
function spinStep(dt){if(H3.state!=='ready'||W3.on){SPIN.v=0;SPIN.acc=0;SPIN.green=0;if(SPIN.phase){SPIN.phase=null;SPIN.fx.length=0;SPIN.puddle=null}return}
  if(SPIN.phase){SPIN.v*=Math.exp(-dt*4);H3.yaw+=SPIN.v*dt;const tgt=Math.round(H3.yaw/(Math.PI*2))*Math.PI*2;if(Math.abs(SPIN.v)<2)H3.yaw+=(tgt-H3.yaw)*Math.min(1,dt*2.5);return}
  if(SPIN.drag!=null){if(performance.now()-SPIN.lastT>90)SPIN.v*=Math.exp(-dt*10)}
  else{H3.yaw+=SPIN.v*dt;SPIN.v*=Math.exp(-dt*.75);if(Math.abs(SPIN.v)<.6){SPIN.v*=Math.exp(-dt*4);const tgt=Math.round(H3.yaw/(Math.PI*2))*Math.PI*2;H3.yaw+=(tgt-H3.yaw)*Math.min(1,dt*3)}}
  const sp=Math.abs(SPIN.v);if(sp>7)SPIN.acc+=sp*dt/(Math.PI*2);else SPIN.acc=Math.max(0,SPIN.acc-dt*.5);
  SPIN.green=clamp((SPIN.acc-1)/4,0,.45);if(SPIN.acc>4.6)startSick()}
function startSick(){SPIN.mouth=null;SPIN.dir=Math.random()<.5?-1:1;SPIN.phase='woozy';SPIN.t0=time;SPIN.kind=heroPers();SPIN.acc=0;SPIN.fx.length=0;SPIN.puddle=null;audio();
  if(sfx.ok()){tone({f:700,f2:180,d:1.3,type:'sine',v:.07,vib:5});tone({f:460,f2:140,d:1.2,type:'triangle',v:.04,vib:7,delay:.1})}vib([30,60,30])}
const SICK={woozy:1.3,act:2.6,recover:1.1};
function blargh(){if(!sfx.ok())return;tone({f:190,f2:85,d:.55,type:'sawtooth',v:.075,filter:520,vib:22});noise({d:.6,v:.11,lp:480})}
function sickPose(P,g,size,cw,ch,left,top){if(!SPIN.phase){sickTint(P,SPIN.green);sickEyes(P,0);return}
  const T=P.T,dt=Math.min(.05,frameDt);let e=time-SPIN.t0;const K=SPIN.kind;
  if(SPIN.phase==='woozy'&&e>SICK.woozy){SPIN.phase='act';SPIN.t0=time;e=0;SPIN.n=0}
  else if(SPIN.phase==='act'&&e>SICK.act){SPIN.phase='recover';SPIN.t0=time;e=0}
  else if(SPIN.phase==='recover'&&e>SICK.recover){SPIN.phase=null;sickTint(P,0);sickEyes(P,0);LOB.jump=time-.2;return}
  const ph=SPIN.phase;let green=ph==='woozy'?.45+.35*(e/SICK.woozy):ph==='act'?.8:.8*(1-e/SICK.recover);
  // where the mouth is on screen: measured AFTER this frame's lean/wobble (end of this function), used next frame
  const sickProj=()=>{H3.scene.updateMatrixWorld(true);const v=new T.Vector3();P.mouths.smile.getWorldPosition(v);v.project(H3.cam);
    const hv=new T.Vector3();P.hatSlot.getWorldPosition(hv);hv.project(H3.cam);SPIN.mouth=[left+(v.x+1)/2*cw,top+(1-v.y)/2*ch,left+(hv.x+1)/2*cw,top+(1-hv.y)/2*ch,size]};
  if(!SPIN.mouth)sickProj();const [mx,my,tx,ty]=SPIN.mouth;
  if(ph==='woozy'){const w=Math.sin(e*7);g.rotation.z=w*.22;g.rotation.x+=Math.sin(e*5)*.12;g.position.x+=Math.sin(e*3.5)*size*.08;setFace3(P,7);sickEyes(P,1);
    if(e>SICK.woozy-.45){setFace3(P,4);const s=1+Math.sin(e*30)*.12;P.mouths.o.scale.setScalar(s)}}
  else if(ph==='act'){
    if(K==='sweet'){// she cries, wobbles and faints
      const f=clamp((e-.9)/.5,0,1),back=clamp((e-2.1)/.4,0,1);const lay=(f-back)*(SPIN.dir||1);g.rotation.z=lay*1.3+Math.sin(e*8)*.05*(1-f);g.position.x-=lay*size*.12;g.position.y+=Math.abs(lay)*size*.46;
      setFace3(P,f>.5&&back<.5?1:6);sickEyes(P,f>.5&&back<.5?0:1);if(e<1.2&&Math.random()<.5)sickFx('tear',mx,my);if(f>.5&&back<.5&&Math.random()<.25)sickFx('star',tx,ty);green=.55;
      if(SPIN.n===0){SPIN.n=1;if(sfx.ok()){wah(392,.3,0);wah(349,.3,.3);wah(311,.6,.6)}}}
    else if(K==='nervous'){// hiccups up green bubbles
      const k=Math.floor(e/.62),u=(e%.62)/.62;if(k>SPIN.n-1&&k<4){SPIN.n=k+1;if(sfx.ok())tone({f:420,f2:980,d:.09,type:'square',v:.05,filter:1600});for(let i=0;i<6;i++)sickFx('bubble',mx,my)}
      g.position.y+=Math.sin(Math.min(1,u*2.2)*Math.PI)*size*.18*(k<4?1:0);g.rotation.z=Math.sin(e*40)*.03;setFace3(P,u<.3?4:6);sickEyes(P,1);if(u<.3)P.mouths.o.scale.setScalar(1.25)}
    else{// goofy / grumpy / diva: the big one
      const pulse=e<1.9?Math.max(0,Math.sin(e*Math.PI*2.1)):0,lean=Math.min(1,e*3)*(e<1.9?1:Math.max(0,1-(e-1.9)*2));
      g.rotation.x+=lean*.45;g.position.y-=lean*size*.05;setFace3(P,e<1.9?3:(K==='grumpy'?7:2));sickEyes(P,e<1.9?1:0);
      if(e<1.9){P.mouths.scream.scale.set(1+pulse*.2,1+pulse*.35,1);const n=K==='diva'?5:4;for(let i=0;i<n;i++)sickFx(K==='goofy'?'rainbow':K==='diva'?'glitter':'goo',mx,my,pulse)}
      if(SPIN.n===0){SPIN.n=1;blargh();setTimeout(blargh,600);setTimeout(blargh,1150)}
      if(K==='grumpy'&&e>1.9&&Math.random()<.35)sickFx('steam',tx,ty);if(K==='diva'&&e>1.9){green=.3;if(SPIN.n===1){SPIN.n=2;sfx.perfect(4)}if(Math.random()<.4)sickFx('spark',tx,ty+size*.6)}
      if(K==='goofy'&&e>1.9){g.rotation.y+=Math.sin(e*10)*.3;if(SPIN.n===1){SPIN.n=2;if(sfx.ok()){tone({f:660,f2:990,d:.12,type:'triangle',v:.06});tone({f:880,f2:1320,d:.14,type:'triangle',v:.06,delay:.14})}}}}}
  else{const u=e/SICK.recover;g.rotation.z=Math.sin(e*5)*.08*(1-u);setFace3(P,K==='grumpy'?7:2);sickEyes(P,0)}
  sickProj();sickTint(P,green)}
function sickTint(P,k){const M=P.bodyMat;if(k<=.001){if(P._tinted){P._tinted=false;P.lookKey=null;applyLook(P,heroLook())}return}
  if(!P._tinted){P._tinted=true;P._base=M.color.clone();P._baseL=P.lidMat.color.clone()}const gr=new P.T.Color('#8fd14f');M.color.copy(P._base).lerp(gr,k);P.lidMat.color.copy(P._baseL).lerp(gr,k)}
function spiralTex(){return canvasTex('spiral',256,256,(g,W,H)=>{g.clearRect(0,0,W,H);g.fillStyle='#ffffff';g.beginPath();g.arc(W/2,H/2,W/2,0,7);g.fill();g.strokeStyle='#120d2b';g.lineWidth=16;g.lineCap='round';g.beginPath();for(let a=0;a<Math.PI*7;a+=.08){const r=6+a*5.2;g.lineTo(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r)}g.stroke()})}
function sickEyes(P,on){if(!on&&!P.spirals)return;const T=P.T;
  if(!P.spirals){const tex=spiralTex();tex.wrapS=tex.wrapT=T.ClampToEdgeWrapping;tex.center.set(.5,.5);const mat=new T.MeshBasicMaterial({map:tex,transparent:true});P.spirals=P.eyes.map(e=>{const d=new T.Mesh(new T.CircleGeometry(.92,40),mat);d.position.z=1.01;e.add(d);return d});P.spiralTex=tex}
  P.spirals.forEach(d=>d.visible=!!on);if(on){P.spiralTex.rotation=-time*9;P.lids.forEach(l=>l.rotation.x=Math.PI/2)}}
function sickFx(kind,x,y,pulse=1){const f={kind,x,y,life:1,vx:0,vy:0,sz:rnd(4,9),c:'#9be15d',rot:rnd(0,6)};
  if(kind==='rainbow'||kind==='goo'||kind==='glitter'){const sz=SPIN.mouth?SPIN.mouth[4]:120;f.vx=(rnd(.9,1.6)+pulse*.5)*sz*(SPIN.dir||1);f.vy=-rnd(.2,.7)*sz-pulse*sz*.3;f.c=kind==='rainbow'?`hsl(${(time*500+rnd(0,60))%360},90%,60%)`:kind==='glitter'?pick(['#ffd23f','#fff4b0','#ffffff','#ffb000']):pick(['#9be15d','#7cc83d','#b6f07a','#6aa832']);f.grav=900;f.ground=true;f.life=1.4;f.sz=kind==='glitter'?rnd(3,6):rnd(5,10)}
  if(kind==='bubble'){f.vx=rnd(-50,50);f.vy=rnd(-140,-60);f.sz=rnd(5,12);f.life=1.3;f.c='rgba(160,230,120,.55)'}
  if(kind==='tear'){f.vx=rnd(-110,110);f.vy=rnd(-120,-40);f.grav=700;f.sz=rnd(3,5);f.c='#7cc8ff';f.x+=rnd(-1,1)*SPIN.mouth[4]*.25;f.y-=SPIN.mouth[4]*.25}
  if(kind==='star'){f.orb=rnd(0,6);f.sz=rnd(6,9);f.life=1;f.c=pick(['#ffe24d','#ffffff'])}
  if(kind==='steam'){f.vx=rnd(-20,20);f.vy=rnd(-90,-50);f.sz=rnd(8,14);f.c='rgba(255,255,255,.7)';f.life=1}
  if(kind==='spark'){f.vx=rnd(-80,80);f.vy=rnd(-80,20);f.sz=rnd(4,7);f.c='#fff6c0';f.life=.9}
  SPIN.fx.push(f);if(SPIN.fx.length>260)SPIN.fx.shift()}
let lobFx=null;
function drawLobbyFx(){if(!lobFx){lobFx=document.createElement('canvas');lobFx.id='lobFx';lobFx.setAttribute('aria-hidden','true');const h=document.getElementById('hero3d')||document.getElementById('titleArt');h.after(lobFx)}
  const d=Math.min(2,DPR);if(lobFx.width!==Math.round(W*d)||lobFx.height!==Math.round(H*d)){lobFx.width=Math.round(W*d);lobFx.height=Math.round(H*d)}
  const c=lobFx.getContext('2d');c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,W,H);if(!SPIN.fx.length&&!SPIN.puddle)return;
  const G=lobbyGeo(),floor=G.stageY-heroSize()*.02,dt=Math.min(.05,frameDt);
  if(SPIN.puddle){const p=SPIN.puddle;p.a=SPIN.phase?Math.min(1,p.a+dt*2):p.a-dt*.6;if(p.a<=0)SPIN.puddle=null;else{c.save();c.globalAlpha=p.a*.85;const gr=c.createRadialGradient(p.x,floor,2,p.x,floor,p.r);
      if(p.kind==='rainbow'){['#ff5c8a','#ffd23f','#5ee85a','#3aa8ff','#8a4dff'].forEach((col,i)=>gr.addColorStop(i/5,col))}else if(p.kind==='glitter'){gr.addColorStop(0,'#fff4b0');gr.addColorStop(1,'#ffb000')}else{gr.addColorStop(0,'#b6f07a');gr.addColorStop(1,'#5f9e2f')}
      c.fillStyle=gr;c.beginPath();c.ellipse(p.x,floor,p.r,p.r*.22,0,0,7);c.fill();c.strokeStyle='rgba(18,13,43,.6)';c.lineWidth=2;c.stroke();c.restore()}}
  for(let i=SPIN.fx.length-1;i>=0;i--){const f=SPIN.fx[i];f.life-=dt;if(f.life<=0){SPIN.fx.splice(i,1);continue}
    if(f.orb!==undefined){f.orb+=dt*6;const r=SPIN.mouth?SPIN.mouth[4]*.45:30;f.dx=Math.cos(f.orb)*r;f.dy=Math.sin(f.orb)*r*.3}
    else{f.vy+=(f.grav||0)*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;if(f.kind==='bubble'){f.vx*=.98;f.vy*=.985}
      if(f.ground&&f.y>floor){f.y=floor;f.vy=0;f.vx*=.5;f.life=Math.min(f.life,.25);if(!SPIN.puddle)SPIN.puddle={x:f.x,r:6,a:0,kind:f.kind};else{SPIN.puddle.r=Math.min(heroSize()*.5,SPIN.puddle.r+.5);SPIN.puddle.x+=(f.x-SPIN.puddle.x)*.02}}}
    c.save();c.globalAlpha=clamp(f.life*1.6,0,1);c.fillStyle=f.c;const x=f.x+(f.dx||0),y=f.y+(f.dy||0);
    if(f.kind==='bubble'){c.strokeStyle='rgba(60,120,40,.8)';c.lineWidth=1.5;c.beginPath();c.arc(x,y,f.sz,0,7);c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.8)';c.beginPath();c.arc(x-f.sz*.35,y-f.sz*.35,f.sz*.22,0,7);c.fill()}
    else if(f.kind==='star'||f.kind==='spark'||f.kind==='glitter'){c.translate(x,y);c.rotate(f.rot+time*3);starPath(c,0,0,f.sz,f.sz*.42,f.kind==='star'?5:4);c.fill();if(f.kind==='star'){c.strokeStyle=INK;c.lineWidth=1.5;c.stroke()}}
    else if(f.kind==='steam'){c.globalAlpha*=.8;c.beginPath();c.arc(x,y,f.sz*(1.6-f.life*.6),0,7);c.fill()}
    else{c.beginPath();c.arc(x,y,f.sz*(f.kind==='tear'?.8:1),0,7);c.fill();if(f.kind!=='tear'){c.strokeStyle='rgba(18,13,43,.35)';c.lineWidth=1.2;c.stroke()}}
    c.restore()}}

/* ---------- the album becomes a real sticker book ---------- */
const STK_IMG={};
function rareImg(r){const k='rare:'+r.id;if(STK_IMG[k])return STK_IMG[k];const sp=charSprite('#06a2ba');if(!sp)return '';const c=document.createElement('canvas');c.width=150;c.height=190;
  const im=tintedSheet(sp.im,r.filter,sp.C.pic+r.id),[sx,sy0,cw,ch]=sp.C.cells[2],bw=sp.C.b3d?cw*.74:cw,by=sp.C.b3d?ch*.3:0,bh=ch-by,k2=Math.min(146/bw,186/bh),g=c.getContext('2d');g.globalAlpha=r.alpha||1;g.drawImage(im,sx+(cw-bw)/2,sy0+by,bw,bh,75-bw*k2/2,188-bh*k2,bw*k2,bh*k2);return STK_IMG[k]=c.toDataURL()}
// Tzach's own illustrations and characters go here later: {id, src, name:[en,he], how:[en,he]}
const SPECIALS=[];
const STK_PAGES=[
  {id:'rare',items:()=>RARES.map(r=>({id:'rare:'+r.id,n:(progress.album||{})[r.id]||0,img:()=>rareImg(r),name:t('rr_'+r.id)}))},
  {id:'boss',items:()=>(typeof bossAll==='function'?bossAll():BOSS_HATS).map(z=>({id:'boss:'+z,n:(progress.beat||{})[z]?1:0,src:'art/boss_'+z+'.webp',name:t(BOSS_NAMES[z])}))},
  {id:'world',items:()=>ZONES.map((z,i)=>({id:'world:'+(z.sid||z.id),n:(progress.unlocked>(i+1)*LPZ||(progress.beat||{})[z.sid||z.id])?1:0,src:'art/'+(typeof artAlias==='function'?artAlias('mapn_'+z.id):'mapn_'+z.id)+'.webp',round:true,name:t(z.key)}))},
  {id:'buddy',items:()=>Object.keys(WPET).filter(k=>k!=='none').map(k=>({id:'buddy:'+k,n:wOwned('pet',k)?1:0,img:()=>wThumb('pet',k),name:wName('pet',k),prem:!!WPET[k].real}))},
  {id:'hat',items:()=>wItems('hat').filter(k=>k!=='none').map(k=>({id:'hat:'+k,n:wOwned('hat',k)?1:0,src:WHATX[k]?null:'art/'+hatPicId(k)+'.webp',img:WHATX[k]?()=>wThumb('hat',k):null,name:wName('hat',k)}))},
  {id:'special',items:()=>{const L=lang==='he'?1:0,a=SPECIALS.map(s=>({id:'sp:'+s.id,n:(progress.stk||{})[s.id]||0,src:s.src,name:s.name[L],hint:s.how&&s.how[L]}));while(a.length<6)a.push({id:'soon'+a.length,n:0,soon:true,name:'?'});return a}}];
function stkTotals(){let a=0,b=0;for(const P of STK_PAGES)for(const it of P.items()){if(it.soon)continue;b++;if(it.n)a++}return [a,b]}
function stkNew(){const seen=progress.stkSeen||[];let n=0;for(const P of STK_PAGES)for(const it of P.items())if(it.n&&!seen.includes(it.id))n++;return n}
function stkBadge(){const n=stkNew();document.querySelectorAll('[data-sbadge]').forEach(b=>{b.hidden=!n;b.textContent=n})}
let BOOK={page:0,el:null};
// iOS Safari also scrolls overflow:hidden ancestors (#app) sideways, which left a dark strip and pushed the close button away
function unShift(){for(const e of[document.getElementById('app'),BOOK.el,document.scrollingElement])if(e&&e.scrollLeft)e.scrollLeft=0}
(function(){const a=document.getElementById('app');if(a)a.addEventListener('scroll',()=>{if(a.scrollLeft||a.scrollTop){a.scrollLeft=0;a.scrollTop=0}})})();
openAlbum=function(){sfx.click();if(!BOOK.el){const el=document.createElement('div');el.id='book';el.hidden=true;
    el.innerHTML=`<div class="bk-top"><button class="x-btn bk-x" aria-label="Close">${XSVG}</button><div class="bk-title"></div><div class="bk-count"><img src="art/ic_album.webp" alt=""><span></span></div></div>
      <div class="bk-tabs"></div><div class="bk-stage"><div class="bk-book"><div class="bk-rings"></div><div class="bk-page"></div></div></div>
      <div class="bk-nav"><button class="bk-prev" aria-label="Previous"></button><div class="bk-dots"></div><button class="bk-next" aria-label="Next"></button></div>`;
    document.getElementById('app').appendChild(el);BOOK.el=el;
    el.querySelector('.bk-x').onclick=()=>{sfx.click();el.classList.add('out');setTimeout(()=>{el.hidden=true;el.classList.remove('out')},200);stkBadge()};
    el.querySelector('.bk-prev').onclick=()=>bookTurn(-1);el.querySelector('.bk-next').onclick=()=>bookTurn(1);
    let sx=null;const st=el.querySelector('.bk-stage');st.addEventListener('pointerdown',e=>{sx=e.clientX});st.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>50)bookTurn((dx<0?1:-1)*(I18N[lang]._dir==='rtl'?-1:1))})}
  // open on the first page that has something new
  const seen=progress.stkSeen||[];const pi=STK_PAGES.findIndex(P=>P.items().some(it=>it.n&&!seen.includes(it.id)));if(pi>=0)BOOK.page=pi;
  BOOK.el.hidden=false;renderBook(0)};
function bookTurn(d){const n=STK_PAGES.length,p=clamp(BOOK.page+d,0,n-1);if(p===BOOK.page){sfx.locked();return}BOOK.page=p;if(sfx.ok()){noise({d:.18,v:.06,hp:1800});tone({f:300,f2:520,d:.12,type:'sine',v:.03})}renderBook(d)}
function renderBook(dir){const el=BOOK.el,P=STK_PAGES[BOOK.page],items=P.items(),seen=progress.stkSeen=progress.stkSeen||[];
  el.querySelector('.bk-title').textContent=t('albumBook');const [a,b]=stkTotals();el.querySelector('.bk-count span').textContent=t('stkCount',{a,b});
  const tabs=el.querySelector('.bk-tabs');tabs.innerHTML='';STK_PAGES.forEach((Q,i)=>{const it=Q.items(),got=it.filter(x=>x.n).length,tot=it.filter(x=>!x.soon).length,nw=it.some(x=>x.n&&!seen.includes(x.id));
    const bt=document.createElement('button');bt.className='bk-tab t-'+Q.id+(i===BOOK.page?' on':'');bt.innerHTML=`<span></span><small>${tot?got+'/'+tot:'…'}</small>${nw?'<i class="dot"></i>':''}`;bt.querySelector('span').textContent=t('pg_'+Q.id);
    bt.onclick=()=>{if(i===BOOK.page)return;const d=i>BOOK.page?1:-1;BOOK.page=i;sfx.click();renderBook(d)};tabs.appendChild(bt)});
  const on=tabs.querySelector('.on');if(on){const a=on.getBoundingClientRect(),c=tabs.getBoundingClientRect();tabs.scrollLeft+=a.left+a.width/2-(c.left+c.width/2)}unShift();
  const page=el.querySelector('.bk-page');page.className='bk-page pg-'+P.id+(dir>0?' flip-n':dir<0?' flip-p':'');void page.offsetWidth;
  page.innerHTML=`<div class="pg-head"><b></b><span class="pg-no">${BOOK.page+1}</span></div><div class="pg-grid"></div>`;page.querySelector('.pg-head b').textContent=t('pg_'+P.id);
  const grid=page.querySelector('.pg-grid'),fresh=[];
  items.forEach((it,i)=>{const s=document.createElement('div'),rot=((strHash(it.id)%13)-6)*.9;s.className='slot'+(it.n?' got':'')+(it.round?' round':'')+(it.prem?' prem':'')+(it.soon?' soon':'');s.style.setProperty('--r',rot+'deg');
    s.innerHTML=`<div class="stk"><img alt=""></div><span class="nm"></span>`+(it.n>1?`<i class="cnt">×${it.n}</i>`:'');
    s.querySelector('.nm').textContent=it.n?it.name:(it.soon?t('hint_special'):(it.hint||t('hint_'+P.id)));
    const img=s.querySelector('img'),src=it.src||(it.img?it.img():'');if(src)img.src=src;else img.remove();
    if(it.n&&!seen.includes(it.id)){s.classList.add('new');s.style.animationDelay=(.25+fresh.length*.22)+'s';fresh.push(it.id)}
    grid.appendChild(s)});
  el.querySelector('.bk-dots').innerHTML=STK_PAGES.map((_,i)=>`<i class="${i===BOOK.page?'on':''}"></i>`).join('');
  el.querySelector('.bk-prev').disabled=BOOK.page===0;el.querySelector('.bk-next').disabled=BOOK.page===STK_PAGES.length-1;
  if(fresh.length){fresh.forEach((id,k)=>setTimeout(()=>{if(sfx.ok()){tone({f:900,f2:1500,d:.1,type:'sine',v:.06});noise({d:.08,v:.05,hp:3000})}vib(10)},250+k*220));popupToast(t('newSticker'));seen.push(...fresh);saveProgress()}
  stkBadge()}
(function(){for(const id of['lobAlbum','albumBtn']){const b=document.getElementById(id);if(b&&!b.querySelector('[data-sbadge]')){const i=document.createElement('i');i.className='badge';i.setAttribute('data-sbadge','');i.hidden=true;b.appendChild(i)}}setTimeout(stkBadge,400)})();
const _updateLobby=updateLobby;updateLobby=function(){_updateLobby();stkBadge();buddyEnsure()};
document.getElementById('lobCoins').onclick=()=>{audio();shopTab='coins';openShop()};
