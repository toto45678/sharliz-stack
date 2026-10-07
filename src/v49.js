/* ===== v49: fair powers — "different, not stronger" (Tzach) for everything that can be bought =====
   - Premium buddies get a cost too (dragon falls faster, unicorn: more wind, cyborg: faster swing).
   - The dragon's extra heart is added through hatK('hearts') — it used to set hearts=4, which erased the king's −1 heart.
   - Astronaut suit: still starts 5 floors up, but with one heart less.
   - Stacking caps: all gear + buddy together give at most +1 heart and at most ×1.5 coins.
   - Every worn item that has a power also slows the swing a little (×0.95 each, never below ×0.85) — Tzach. */
const PET_COST={heart:{fall:1.15},coins25:{wind:1.3},aim:{pts:.9}};
for(const k in PET_COST)Object.assign(PET_FX[k],PET_COST[k]);
const FAIR_MAX_HEARTS=1,FAIR_MAX_COINS=1.5;
const GEAR_SLOW=.95,GEAR_SLOW_MIN=.85;
// how many worn items have a power (hat, outfit, glasses, buddy perk, astronaut)
function poweredCount(look,hat){let n=0;if(hat&&HAT_FX[hat])n++;for(const c of ['outfit','glasses'])if(GEAR_FX[c]&&GEAR_FX[c][look[c]])n++;
  if(look.outfit==='astro')n++;if(typeof PERKS!=='undefined'&&PERKS[look.pet])n++;return n}
function gearSlow(){const L=lookNow(),h=progress.skin||'none',own=Object.assign({},L);
  for(const c of ['outfit','glasses','pet'])if(!wOwned(c,own[c]))own[c]='none';
  return Math.max(GEAR_SLOW_MIN,Math.pow(GEAR_SLOW,poweredCount(own,hatNow()?h:null)))}
const petPerk=()=>mode!=='duo'&&typeof PERKS!=='undefined'&&wOwned('pet',petNow())?PERKS[petNow()]:null;
{const _hk=hatK;hatK=function(k,d=1){let v=_hk(k,d);if(mode==='duo')return v;const pk=petPerk(),C=pk&&PET_COST[pk];
  if(k==='hearts'){if(pk==='heart')v+=1;if(astroOn()&&level>1&&!astroSkip)v-=1;return Math.min(FAIR_MAX_HEARTS,v)}
  if(C&&C[k]!==undefined)v*=C[k];
  if(k==='spd')v*=gearSlow();
  return v}}
// coins: buddy row (v28) × hat (v39) × gear (v48) multiply — scale the whole card down if they add up to more than ×1.5
{const _tr=tallyRows;tallyRows=function(won){const rows=_tr(won);if(mode==='duo')return rows;const pk=petPerk();
  const m=(pk==='coins10'?1.1:pk==='coins25'?1.25:1)*hatK('coins');if(m<=FAIR_MAX_COINS)return rows;const f=FAIR_MAX_COINS/m;
  return rows.map(r=>{const q=r.slice();q[2]=Math.round(q[2]*f);return q}).filter(r=>r[2]>0)}}
// power bars in "My hero": show the same capped numbers + the astronaut's cost
{const _fc=fxCombine;fxCombine=function(look,hat){const R=_fc(look,hat);if(look.outfit==='astro')R.hearts=(R.hearts||0)-1;
  const n=poweredCount(look,hat);if(n)R.spd=(R.spd===undefined?1:R.spd)*Math.max(GEAR_SLOW_MIN,Math.pow(GEAR_SLOW,n));if(R.hearts>FAIR_MAX_HEARTS)R.hearts=FAIR_MAX_HEARTS;if(R.coins>FAIR_MAX_COINS)R.coins=FAIR_MAX_COINS;return R}}

/* ---------- everything can be earned: real-money items can also be bought with coins ---------- */
const COIN_ALT={outfit:{astro:6000},pet:{cyborg:4000,unicorn:5000,dragon:6000}};
Object.assign(I18N.en,{orCoins:'or'});Object.assign(I18N.he,{orCoins:'או'});
const coinAlt=(c,id)=>(COIN_ALT[c]||{})[id]||0;
function buyWithCoins(c,id){const p=coinAlt(c,id);if(!p||wOwned(c,id))return;if(progress.coins<p){sfx.locked();popupToast(t('needCoins'));return}
  progress.coins-=p;progress.owned=progress.owned||{};(progress.owned[c]=progress.owned[c]||[]).push(id);lookNow()[c]=id;if(W3.preview)W3.preview[c]=id;
  saveProgress();sfx.flourish(2);vib([20,40,20]);LOB.jump=time;updateWalletUI();setHero3DSkin();rebakeIfNeeded();renderWardrobe()}
{const _rw=renderWardrobe;renderWardrobe=function(){_rw();const el=document.getElementById('wardrobe'),s=W3.sel;if(!el||!W3.on||!s)return;
  const p=coinAlt(s.cat,s.id);if(!p||wOwned(s.cat,s.id))return;const act=el.querySelector('.cs-act');if(!act)return;
  const b=document.createElement('button');b.className='btn green cs-buy cs-coinalt'+(progress.coins<p?' poor':'');
  b.innerHTML='<span></span>'+coinImg()+p.toLocaleString();b.querySelector('span').textContent=t('orCoins')+' ';b.onclick=()=>buyWithCoins(s.cat,s.id);act.appendChild(b)}}
