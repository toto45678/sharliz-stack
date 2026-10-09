/* ===== v40: starter pack — one-time offer: coins + boosters + the Star halo hat (only from this pack) ===== */
Object.assign(I18N.en,{
  stTitle:'Starter pack',stBtn:'Offer',stOnce:'One time only!',stBoost:'×2 of every booster',stBuy:'Buy',stLater:'Not now',stGot:'Starter pack — thank you!',
  hp_halo:'+20% coins',hm_halo:'Falls a little faster',stOnlyPack:'Only in the starter pack'});
Object.assign(I18N.he,{
  stTitle:'חבילת פתיחה',stBtn:'מבצע',stOnce:'פעם אחת בלבד!',stBoost:'2 מכל בוסטר',stBuy:'לקנות',stLater:'לא עכשיו',stGot:'חבילת הפתיחה אצלך, תודה!',
  hp_halo:'עוד 20% מטבעות',hm_halo:'נופל קצת מהר יותר',stOnlyPack:'רק בחבילת הפתיחה'});

// the hat: lives in the wardrobe like the others, but can only be bought through the pack
WHATX.halo={p:0,w:1,pack:1,n:['Star halo','הילת כוכבים']};
HAT_FX.halo={coins:1.2,fall:1.15};
const ST_BOOST=['heart','shield','slow','laser'];
IAP.products.starter={price:'₪9.90',coins:2000,hat:'halo',boost:2,once:1};
const starterOwned=()=>(progress.purchases||[]).some(p=>p.sku==='starter')||wallet().skins.includes('halo');

{const _bh=buildHat;buildHat=function(P,id){if(id!=='halo')return _bh(P,id);const T=P.T,s=P.hatSlot;
  const gold={metalness:.55,roughness:.18,emissive:'#ffb000',emissiveIntensity:.35};
  const ring=wmesh(new T.TorusGeometry(.32,.05,14,64),'#ffd23f',gold);ring.rotation.x=Math.PI/2-.12;ring.position.y=.28;s.add(ring);
  const ink=new T.Mesh(ring.geometry,INKM());ink.scale.setScalar(1.06);ring.add(ink);
  const star=new T.Shape();for(let k=0;k<10;k++){const a=Math.PI/2+k*Math.PI/5,rr=k%2?.04:.095;k?star.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):star.moveTo(Math.cos(a)*rr,Math.sin(a)*rr)}
  const geo=new T.ExtrudeGeometry(star,{depth:.02,bevelEnabled:true,bevelSize:.008,bevelThickness:.008});geo.center();
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2+.3,st=wmesh(geo,'#fff6c2',{emissive:'#ffe066',emissiveIntensity:.6});
    st.position.set(Math.sin(a)*.32,.33+(i%2)*.04-Math.cos(a)*.04,Math.cos(a)*.32);st.rotation.y=a;st.rotation.z=i*.4;s.add(st)}}}
{const _wr=wRarity;wRarity=function(cat,id){return cat==='hat'&&id==='halo'?'leg':_wr(cat,id)}}
{const _ir=wIsReal;wIsReal=function(cat,id){return cat==='hat'&&WHATX[id]&&WHATX[id].pack?'starter':_ir(cat,id)}}
{const _br=buyReal;buyReal=function(cat,id){if(cat==='hat'){openStarter();return}_br(cat,id)}}
// pack-only hat never counts as "new and affordable" (it costs 0 coins)
{const _nn=wNewIn;wNewIn=function(cat){if(cat!=='hat')return _nn(cat);const p=WHATX.halo.p;WHATX.halo.p=1e9;try{return _nn(cat)}finally{WHATX.halo.p=p}}}

{const _g=IAP.grant;IAP.grant=function(sku){if(sku==='starter'&&starterOwned())return;_g(sku);const P=IAP.products[sku];if(!P)return;
  if(P.hat&&!wallet().skins.includes(P.hat)){progress.skins.push(P.hat);progress.skin=P.hat}
  if(P.boost){const inv=wallet().inv;ST_BOOST.forEach(b=>inv[b]=(inv[b]||0)+P.boost)}
  saveProgress();updateWalletUI()}}

function starterCard(onBuy){const P=IAP.products.starter,d=document.createElement('div');d.className='st-pack';
  const th=(typeof wThumb==='function'&&wThumb('hat','halo'))||'art/ic_hats.webp';
  d.innerHTML=`<i class="pk-tag"></i><b class="st-t"></b>
    <div class="st-items"><div class="st-it hat"><i class="st-th"><img src="${th}" alt=""></i><span></span><small></small></div>
      <div class="st-col"><div class="st-it"><img src="art/ic_coin.webp" alt=""><span>${P.coins.toLocaleString()}</span></div>
      <div class="st-it bo">${ST_BOOST.map(b=>`<img src="art/ic_${b}.webp" alt="">`).join('')}<span></span></div></div></div>
    <button class="st-buy"><em>${P.price}</em></button>`;
  d.querySelector('.pk-tag').textContent=t('stOnce');d.querySelector('.st-t').textContent=t('stTitle');
  d.querySelector('.hat span').textContent=wName('hat','halo');d.querySelector('.hat small').textContent='▲ '+t('hp_halo');{const c=document.createElement('small');c.className='cost';c.textContent='▼ '+t('hm_halo');d.querySelector('.hat small').after(c)}
  d.querySelector('.bo span').textContent=t('stBoost');
  d.querySelector('.st-buy').onclick=()=>IAP.buy('starter',t('stTitle')).then(ok=>{if(!ok)return;try{setHero3DSkin();rebakeIfNeeded()}catch(e){}popupToast(t('stGot'));onBuy&&onBuy()});
  return d}

// shop → coins tab: the pack sits on top until it's bought
{const _sb=shopBody;shopBody=function(card){_sb(card);if(shopTab!=='coins'||starterOwned())return;const list=card.querySelector('.shop-list.packs');if(list)list.prepend(starterCard(()=>rerenderOverlay&&rerenderOverlay()))}}

function openStarter(){sfx.click();showOverlay(()=>({title:t('stTitle'),extra:card=>{(card.closest('.card')||card).classList.add('st-card');
    if(starterOwned())return;card.appendChild(starterCard(()=>{hideOverlay();if(W3.on)renderWardrobe()}));const n=document.createElement('p');n.className='pay-foot';n.textContent=t('testMode');if(!IAP.live())card.appendChild(n)},
  actions:[{label:t(starterOwned()?'close':'stLater'),fn:hideOverlay}]}),true)}

// lobby: a glowing "offer" button under Missions, there until the pack is bought
const stBtn=document.createElement('button');stBtn.className='side-btn st-side';stBtn.id='lobStarter';stBtn.hidden=true;
stBtn.innerHTML='<span class="sq"><img src="art/ic_gift.webp" alt=""></span><b></b><i class="st-shine">✨</i>';
stBtn.onclick=()=>{audio();openStarter()};document.querySelector('#title .lob-side.l').appendChild(stBtn);
function stBtnSync(){stBtn.hidden=starterOwned()||progress.unlocked<2;stBtn.querySelector('b').textContent=t('stBtn')}
// offered by itself once: back in the lobby right after a won level, once the player has finished 5+ levels (never on top of the daily gift)
let stWon=false;
{const _w=win;win=function(){stWon=true;return _w.apply(this,arguments)}}
function stMaybe(){if(!stWon||progress.stOffer||starterOwned()||progress.unlocked<6||(typeof dlState==='function'&&!dlState().claimed))return;
  setTimeout(()=>{if(progress.stOffer||state!=='title'||W3.on||lobbyLayerOpen()||!document.getElementById('overlay').hidden||document.getElementById('title').hidden)return;
    progress.stOffer=Date.now();saveProgress();openStarter()},1200)}
{const _ul=updateLobby;updateLobby=function(){_ul();stBtnSync();stMaybe()}}
{const _g2=IAP.grant;IAP.grant=function(sku){_g2(sku);stBtnSync()}}
stBtnSync();
