/* ===== v61: 11 NEW BUDDIES (Tzach approved the roster Oct 7, plan /mnt/project-files/game/buddies-plan.md) =====
   Coins: penguin, firefly, kitten, octopus. Eggs only: cloudy (egg), monkey + crystal bunny (rare egg), baby phoenix (golden egg,
   next to the baby dino). Real money (also coins, COIN_ALT): robo puppy ₪9.90, galaxy whale ₪14.90, thunder griffin ₪19.90 —
   like every paid item they have one advantage AND one cost ("different, not stronger"). Their powers run through hatK (v39/48/49)
   with the same caps (+1 heart, ×1.5 coins). 3D models: tools/pets/pets.py → art/pet_<id> (v60). Album cards art/stk_p_<id>
   when they exist (STK_BUD_ART), otherwise the round 3D thumbnail. */
const STK_BUD_ART=__STK_BUD_ART__;
Object.assign(WPET,{penguin:{p:1200,n:['Penguin','פינגווין']},firefly:{p:1000,n:['Firefly','גחלילית']},kitten:{p:1300,n:['Kitten','חתלתול']},octopus:{p:1500,n:['Octopus','תמנונון']},
  cloudy:{p:99999,egg:'c',n:['Cloudy','ענני']},monkey:{p:99999,egg:'r',n:['Little monkey','קוף קטן']},bunny:{p:99999,egg:'r',n:['Crystal bunny','ארנבון קריסטל']},phoenix:{p:99999,egg:'g',n:['Baby phoenix','פניקס קטן']},
  robodog:{p:0,real:'buddy_robodog',n:['Robo puppy','כלבלב רובוט']},whale:{p:0,real:'buddy_whale',n:['Galaxy whale','לוויתן גלקסיה']},griffin:{p:0,real:'buddy_griffin',n:['Thunder griffin','גריפין ברק']}});
const NEW_BUD_FX={penguin:{wind:.75},firefly:{light:1.4},kitten:{fall:.8},octopus:{boss:1.25},cloudy:{noSlip:1},monkey:{coins:1.15},bunny:{perfPts:1.3},phoenix:{hearts:1},
  robodog:{aim:1,pts:.9},whale:{coins:1.3,wind:1.3},griffin:{boss:1.5,fall:1.15}};
for(const id in NEW_BUD_FX){PERKS[id]='x_'+id;PET_FX['x_'+id]=NEW_BUD_FX[id]}
Object.assign(IAP.products,{buddy_robodog:{price:'₪9.90',pet:'robodog'},buddy_whale:{price:'₪14.90',pet:'whale'},buddy_griffin:{price:'₪19.90',pet:'griffin'}});
Object.assign(COIN_ALT.pet,{robodog:4000,whale:5000,griffin:6000});
// store build: an Apple/Google reviewer who taps Buy on a product that isn't in the store yet rejects the app. Until
// buddy_robodog/whale/griffin exist in App Store Connect + Play (set NEW_PAID_LIVE=1 then), they are coin-only there.
const NEW_PAID_LIVE=0;
if(!NEW_PAID_LIVE&&window.SharlizPay&&SharlizPay.native)for(const id of ['robodog','whale','griffin']){const W=WPET[id];
  delete IAP.products[W.real];delete W.real;W.p=COIN_ALT.pet[id];delete COIN_ALT.pet[id]}
for(const id of ['firefly','cloudy','phoenix','whale','griffin'])PETFLY[id]=1;
// eggs: new buddies join the pools; a golden egg gives the baby dino or the baby phoenix first
EGG.c.pool.push('cloudy');EGG.r.pool.push('monkey','bunny');EGG.g.pool.push('phoenix');
// the power text of each new buddy (guide chip, nest), built from the shared power words in every language
for(const L of LANG_SET()){const P=PW_TXT[L]||PW_TXT.en;for(const id in NEW_BUD_FX){const F=NEW_BUD_FX[id],parts=[];
  for(const k in F){const v=F[k];if(k==='coins')parts.push(P.coins.replace('{p}',Math.round((v-1)*100)));else if(k==='hearts')parts.push(P.hearts);
    else if(k==='fall'||k==='wind'){if(v<1)parts.push(P[k]||k)}else if(k==='pts'){/* a cost (robodog pts .9), not a power */}else parts.push(P[k]||k)}
  I18N[L]['pk_x_'+id]=parts.join(' · ')}}
Object.assign(I18N.en,{eggOnlyC:'Hatches from an egg',eggOnlyR:'Rare egg only'});Object.assign(I18N.he,{eggOnlyC:'בוקע מביצה',eggOnlyR:'רק מביצה נדירה'});
function eggGateTxt(id){const e=WPET[id]&&WPET[id].egg;return t(e==='c'?'eggOnlyC':e==='r'?'eggOnlyR':'eggOnly')}
{const _g=wGate;wGate=function(cat,id){const r=_g.apply(this,arguments);return cat==='pet'&&WPET[id]&&WPET[id].egg&&!wOwned(cat,id)?eggGateTxt(id):r}}
{const _ci=csInfo;csInfo=function(c,id){const I=_ci.apply(this,arguments);if(c==='pet'&&WPET[id]&&WPET[id].egg&&!I.owned)I.gate=eggGateTxt(id);return I}}
// new perks: everything except coins goes through hatK (coins are a buddy row on the result card, v28/v49)
{const _hk=hatK;hatK=function(k,d=1){let v=_hk(k,d);if(mode==='duo'||k==='coins')return v;const pk=petPerk(),F=pk&&pk.startsWith('x_')&&PET_FX[pk];
  if(!F||F[k]===undefined)return v;if(k==='hearts')return Math.min(FAIR_MAX_HEARTS,v+F[k]);if(FX_ADD.has(k))return (v===d?0:v)+F[k];return v*F[k]}}
// album: cards for buddies that have their illustration, the round 3D picture for the rest (until ChatGPT draws them)
{const P=STK_PAGES.find(p=>p.id==='buddy');if(P){const _it=P.items;P.items=()=>_it().map(it=>{const id=it.id.slice(6);if(STK_BUD_ART.includes(id))return it;
  return Object.assign(it,{src:null,card:0,img:()=>wThumb('pet',id)})})}}
