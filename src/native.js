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
  // A save code from the free web version carries TEST purchases (nothing was paid). In the store app they and what
  // they gave are removed, so a code can't unlock paid items for free (Tzach, Oct 7). Real purchases are never test:true here.
  function stripTest(){try{const L=progress&&progress.purchases;if(!L||!L.some(p=>p&&p.test))return;
    const del=(a,id)=>{if(a){const i=a.indexOf(id);if(i>=0)a.splice(i,1)}},look=lookNow(),o=progress.owned,w=wallet(),realPass=L.some(p=>p&&p.sku==='pass'&&!p.test);
    for(const p of L.filter(p=>p&&p.test)){const P=IAP.products[p.sku]||{};
      if(P.coins)w.coins=Math.max(0,w.coins-P.coins);
      if(P.boost)ST_BOOST.forEach(b=>w.inv[b]=Math.max(0,(w.inv[b]||0)-P.boost));
      if(P.hat){del(w.skins,P.hat);if(w.skin===P.hat)w.skin='none'}
      if(P.pet){del(o.pet,P.pet);if(look.pet===P.pet)look.pet='none'}
      if(P.outfit){del(o.outfit,P.outfit);if(look.outfit===P.outfit)look.outfit='none'}
      if(P.pass&&!realPass&&progress.pass){progress.pass.prem=false;progress.pass.p=[];del(o.color,'galaxy');if(look.color==='galaxy')look.color='pink';
        ['t_comet','starcrown'].forEach(id=>del(w.skins,id));if(w.skin==='starcrown')w.skin='none';if(progress.tskin==='t_comet')delete progress.tskin}}
    progress.purchases=L.filter(p=>p&&!p.test)}catch(e){}}
  addEventListener('load',()=>{const _s=window.saveProgress;if(typeof _s==='function'){window.saveProgress=function(){stripTest();return _s.apply(this,arguments)};
    if((progress.purchases||[]).some(p=>p&&p.test)){window.saveProgress();try{updateWalletUI();if(state==='title')updateLobby()}catch(e){}}}
    setTimeout(init,1500)});
})();
