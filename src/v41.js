/* ===== v41: store-release helpers (restore purchases + privacy link in Settings, only inside the native app) ===== */
Object.assign(I18N.en,{restoreBuys:'Restore purchases',restoreBtn:'Restore',restored:'Purchases restored',storeOff:'The store is not available right now',privacy:'Privacy policy',open:'Open'});
Object.assign(I18N.he,{restoreBuys:'שחזור רכישות',restoreBtn:'שחזור',restored:'הרכישות שוחזרו',storeOff:'החנות לא זמינה כרגע',privacy:'מדיניות פרטיות',open:'פתיחה'});
const PRIVACY_URL='https://toto45678.github.io/sharliz-stack/privacy.html';
{const _sr=settingsRows;settingsRows=function(card){_sr(card);
  if(!(window.SharlizPay&&window.SharlizPay.native))return;
  const row=(label,btnText,fn)=>{const r=document.createElement('div');r.className='opt-row';const l=document.createElement('span');l.textContent=label;const b=document.createElement('button');b.className='buy';b.textContent=btnText;b.onclick=fn;r.appendChild(l);r.appendChild(b);card.appendChild(r)};
  row(t('restoreBuys'),t('restoreBtn'),()=>{sfx.click();Promise.resolve(window.SharlizPay.restore()).then(()=>popupToast(t('restored'))).catch(()=>popupToast(t('storeOff')))});
  row(t('privacy'),t('open'),()=>{sfx.click();window.open(PRIVACY_URL,'_blank')})}}
/* credits screen (Settings → Credits): attribution for Meshy CC BY 4.0 boss models, three.js (MIT), OFL fonts, native libs */
Object.assign(I18N.en,{credits:'Credits',creditsTitle:'Credits'});
Object.assign(I18N.he,{credits:'קרדיטים',creditsTitle:'קרדיטים'});
const CREDITS=[
  ['3D boss models (season 1)','מודלים בתלת מימד של הבוסים (עונה 1)','Created with Meshy AI (meshy.ai) · CC BY 4.0 · creativecommons.org/licenses/by/4.0'],
  ['More bosses & worlds','עוד בוסים ועולמות','Created with Higgsfield AI (higgsfield.ai)'],
  ['3D engine','מנוע תלת מימד','three.js · © 2010-2023 three.js authors · MIT License'],
  ['Fonts','פונטים','Lilita One (Juan Montoreano) · Rubik (Hubert & Fischer) · Secular One (Michal Sahar) · SIL Open Font License 1.1'],
  ['App','אפליקציה','Capacitor (Ionic) · cordova-plugin-purchase · MIT License']];
function openCredits(){sfx.click();showOverlay(()=>({title:t('creditsTitle'),extra:card=>{
  const box=document.createElement('div');box.className='credits';
  for(const [en,he,txt] of CREDITS){const h=document.createElement('b');h.textContent=lang==='he'?he:en;const p=document.createElement('p');p.textContent=txt;p.dir='ltr';box.appendChild(h);box.appendChild(p)}
  const c=document.createElement('p');c.className='credits-c';c.textContent='Sharliz Tower © 2026';box.appendChild(c);card.appendChild(box)},
  actions:[{label:t('close'),primary:true,fn:()=>{hideOverlay();openSettings()}}]}),true)}
{const _sr2=settingsRows;settingsRows=function(card){_sr2(card);if(state==='paused')return;
  const r=document.createElement('div');r.className='opt-row';const l=document.createElement('span');l.textContent=t('credits');const b=document.createElement('button');b.className='buy';b.textContent=t('open');b.onclick=openCredits;r.appendChild(l);r.appendChild(b);card.appendChild(r)}}
