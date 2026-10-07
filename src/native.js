/* ===== native app layer (only in the store build, see tools/build.py --store) =====
   Real purchases through the App Store / Google Play with cordova-plugin-purchase (CdvPurchase).
   The game calls window.SharlizPay.buy(sku) -> Promise<boolean>; IAP.grant() then gives the reward (src/v28.js).
   Product ids in the stores = the sku names in IAP.products (coins_s, coins_m, ..., buddy_dragon, starter). */
(function(){
  const isNative=()=>!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
  if(!isNative())return;
  const CONSUMABLE=sku=>/^(coins_|pass)/.test(sku); // the Pass is bought again every season
  const pending={};let ready=null,platform=null;
  const owned=sku=>{try{return (progress.purchases||[]).some(p=>p.sku===sku&&!p.test)}catch(e){return false}};
  function init(){
    if(ready)return ready;
    ready=new Promise(res=>{
      const go=()=>{
        const C=window.CdvPurchase;if(!C||!C.store){res(false);return}
        const {store,ProductType,Platform}=C;
        platform=window.Capacitor.getPlatform()==='ios'?Platform.APPLE_APPSTORE:Platform.GOOGLE_PLAY;
        const skus=Object.keys(IAP.products);
        store.register(skus.map(id=>({id,platform,type:CONSUMABLE(id)?ProductType.CONSUMABLE:ProductType.NON_CONSUMABLE})));
        store.when()
          .approved(tx=>{
            for(const p of tx.products){const sku=p.id;
              if(pending[sku]){const r=pending[sku];delete pending[sku];r(true)}          // IAP.buy grants it
              else if(CONSUMABLE(sku)||!owned(sku)){try{IAP.grant(sku);popupToast(t('thanks'))}catch(e){}} // restore / delayed approval
            }
            tx.finish()})
          .productUpdated(p=>{const P=IAP.products[p.id];if(P&&p.pricing&&p.pricing.price)P.price=p.pricing.price});
        store.error(e=>{for(const k in pending){pending[k](false);delete pending[k]}});
        store.initialize([platform]).then(()=>res(true)).catch(()=>res(false))};
      if(window.CdvPurchase)go();else document.addEventListener('deviceready',go,{once:true});
      setTimeout(()=>res(false),15000)});
    return ready}
  window.SharlizPay={
    native:true,
    buy(sku){return init().then(ok=>{if(!ok)return false;const {store}=window.CdvPurchase,prod=store.get(sku,platform),offer=prod&&prod.getOffer();
      if(!offer){try{popupToast(t('storeOff'))}catch(e){}return false}
      return new Promise(res=>{pending[sku]=res;store.order(offer).then(err=>{if(err&&pending[sku]){delete pending[sku];res(false)}})})})},
    restore(){return init().then(ok=>{if(!ok)return false;return Promise.resolve(window.CdvPurchase.store.restorePurchases()).then(()=>true)})}};
  addEventListener('load',()=>setTimeout(init,1500));
})();
