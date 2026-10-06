/* ===== v39: hats change the game — every shop hat has one advantage and one cost (trophy hats stay a badge of honour) ===== */
Object.assign(I18N.en,{
  hp_party:'+15% coins',hm_party:'Swings a little faster',
  hp_cowboy:'Slower swing, easier to aim',hm_cowboy:'Fewer points for PERFECT',
  hp_viking:'An extra heart every level',hm_viking:'Landing zone a bit narrower',
  hp_propeller:'Falls slowly — more time to correct',hm_propeller:'Wind pushes it more',
  hp_chef:'+2 coins for every PERFECT',hm_chef:'Fewer coins for clearing a level',
  hp_flowers:'Wider landing zone',hm_flowers:'Fewer points',
  hp_wizard:'Aiming line always on',hm_wizard:'-10% coins',
  hp_pirate:'Hits bosses harder',hm_pirate:'Swings faster',
  hp_king:'+25% coins',hm_king:'Start with one heart less',
  hp_tophat:'Frenzy lasts longer',hm_tophat:'Needs 7 PERFECTs in a row for frenzy',
  hp_beanie:'Wind barely moves it',hm_beanie:'Falls faster',
  hatPower:'Hat power',cHat:'Hat'});
Object.assign(I18N.he,{
  hp_party:'עוד 15% מטבעות',hm_party:'הנדנוד קצת מהיר יותר',
  hp_cowboy:'נדנוד איטי וקל לכוון',hm_cowboy:'פחות נקודות על "מושלם"',
  hp_viking:'לב נוסף בכל שלב',hm_viking:'אזור הנחיתה קצת צר יותר',
  hp_propeller:'נופל לאט, יותר זמן לתקן',hm_propeller:'הרוח מזיזה אותו יותר',
  hp_chef:'עוד 2 מטבעות על כל "מושלם"',hm_chef:'פחות מטבעות על סיום שלב',
  hp_flowers:'אזור נחיתה רחב יותר',hm_flowers:'פחות נקודות',
  hp_wizard:'קו הכיוון תמיד מופיע',hm_wizard:'10% פחות מטבעות',
  hp_pirate:'פוגע חזק יותר בבוסים',hm_pirate:'הנדנוד מהיר יותר',
  hp_king:'עוד 25% מטבעות',hm_king:'מתחילים עם לב אחד פחות',
  hp_tophat:'מצב טירוף ארוך יותר',hm_tophat:'צריך 7 "מושלם" ברצף לטירוף',
  hp_beanie:'הרוח כמעט לא מזיזה אותו',hm_beanie:'נופל מהר יותר',
  hatPower:'כוח הכובע',cHat:'כובע'});

// every number a hat changes; anything missing = 1 (or 0 for hearts)
const HAT_FX={
  party:{coins:1.15,spd:1.1},
  cowboy:{spd:.85,perfPts:.6},
  viking:{hearts:1,tol:.88},
  propeller:{fall:.7,wind:1.6},
  chef:{perfCoins:2,clear:.5},
  flowers:{tol:1.2,pts:.7},
  wizard:{aim:1,coins:.9},
  pirate:{boss:1.5,spd:1.12},
  king:{coins:1.25,hearts:-1},
  tophat:{feverT:1.5,feverN:7},
  beanie:{wind:.25,fall:1.3}};
function hatNow(){const h=progress.skin||'none';return mode!=='duo'&&HAT_FX[h]&&(wallet().skins||[]).includes(h)?h:null}
function hatK(k,d=1){const h=hatNow();return h&&HAT_FX[h][k]!==undefined?HAT_FX[h][k]:d}
const hatSpd=()=>hatK('spd'),hatTol=()=>hatK('tol'),hatHearts=()=>hatK('hearts',0),hatFall=()=>hatK('fall'),hatWind=()=>hatK('wind'),hatPts=()=>hatK('pts'),hatBoss=()=>hatK('boss'),hatFevN=()=>hatK('feverN',5);

// coins: overall multiplier, chef's +2 per perfect and smaller clear reward (works on the grouped clear/skill/bonus rows)
{const _tr=tallyRows;tallyRows=function(won){const rows=_tr(won),h=hatNow();if(!h)return rows;const F=HAT_FX[h];
  const out=rows.map(r=>r.slice());
  if(F.clear){const c=out.find(r=>r[3]==='trophy');if(c)c[2]=Math.round(c[2]*F.clear)}
  if(F.perfCoins&&lv.perfect){const s=out.find(r=>r[3]==='star');const add=lv.perfect*F.perfCoins*(won?1:.5);if(s)s[2]+=Math.ceil(add);else out.push([t('cSkill'),'★×'+lv.perfect,Math.ceil(add),'star'])}
  if(F.coins)out.forEach(r=>r[2]=Math.max(0,Math.round(r[2]*F.coins)));
  return out.filter(r=>r[2]>0)}}

// wardrobe: show the hat's advantage and cost under the grid
function hatPowerBox(id){const d=document.createElement('div');d.className='wd-perk hatfx';
  d.innerHTML='<b></b><span class="hp"></span><span class="hm"></span>';d.querySelector('b').textContent=t('hatPower');
  d.querySelector('.hp').textContent=t('hp_'+id);d.querySelector('.hm').textContent=t('hm_'+id);return d}
{const _rw=renderWardrobe;renderWardrobe=function(){_rw();const el=document.getElementById('wardrobe');if(!el||!W3.on)return;
  const s=W3.sel,id=s&&s.cat==='hat'?s.id:W3.cat==='hat'?(progress.skin||'none'):null;if(!id||!HAT_FX[id])return;
  const ft=el.querySelector('.wd-foot');if(!ft)return;const hint=ft.querySelector('.wd-hint');if(hint)hint.remove();ft.prepend(hatPowerBox(id))}}
