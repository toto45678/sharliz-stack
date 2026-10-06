/* ===== v41: store-release helpers (restore purchases + privacy link in Settings, only inside the native app) ===== */
Object.assign(I18N.en,{restoreBuys:'Restore purchases',restoreBtn:'Restore',restored:'Purchases restored',storeOff:'The store is not available right now',privacy:'Privacy policy',open:'Open'});
Object.assign(I18N.he,{restoreBuys:'שחזור רכישות',restoreBtn:'שחזור',restored:'הרכישות שוחזרו',storeOff:'החנות לא זמינה כרגע',privacy:'מדיניות פרטיות',open:'פתיחה'});
const PRIVACY_URL='https://toto45678.github.io/sharliz-stack/privacy.html';
{const _sr=settingsRows;settingsRows=function(card){_sr(card);
  if(!(window.SharlizPay&&window.SharlizPay.native))return;
  const row=(label,btnText,fn)=>{const r=document.createElement('div');r.className='opt-row';const l=document.createElement('span');l.textContent=label;const b=document.createElement('button');b.className='buy';b.textContent=btnText;b.onclick=fn;r.appendChild(l);r.appendChild(b);card.appendChild(r)};
  row(t('restoreBuys'),t('restoreBtn'),()=>{sfx.click();Promise.resolve(window.SharlizPay.restore()).then(()=>popupToast(t('restored'))).catch(()=>popupToast(t('storeOff')))});
  row(t('privacy'),t('open'),()=>{sfx.click();window.open(PRIVACY_URL,'_blank')})}}
