/* ===== v82: APPLE'S RATING PROMPT in the store app (version 1.3; Tzach approved the roundtable plan, Nov 4) =====
   Apple's own "Enjoying Sharliz Tower?" stars card (SKStoreReviewController), through the tiny native plugin in
   app/plugins/sharliz-review. No network call from us, nothing collected, so the App Store "Data Not Collected" label stays.
   Asked ONCE per player (progress.rv.done), and only when all of this is true:
   - the player just WON A BOSS in the levels (never after a loss, never in events/arcade/daily/bonus),
   - the player also played on an EARLIER DAY (progress.rv.d0 = first day we saw them; older saves seed it from the daily gift),
   - the boss win card is on screen and the player is still looking at it (1.8 s after it appeared; tapped Next before that =
     we wait for the next boss win). The win card is the happy moment, and the lobby cards (daily gift, update notice,
     the one-time starter offer) never meet it.
   iPhone/iPad only. The web game and Android do nothing. Apple decides whether the card really shows (at most 3 times a year,
   never in TestFlight), so we mark it done as soon as we asked. */
const RV={plugin:'SharlizReview',delay:1800,wait:15000};
let rvAsking=false;
function rvPlug(){try{const C=window.Capacitor;if(!C||!C.isNativePlatform||!C.isNativePlatform()||C.getPlatform()!=='ios')return null;
  if(C.isPluginAvailable&&!C.isPluginAvailable(RV.plugin))return null;
  return C.registerPlugin?C.registerPlugin(RV.plugin):(C.Plugins&&C.Plugins[RV.plugin])||null}catch(e){return null}}
// first day we know the player played. Saves from before 1.3: yesterday's daily gift (or an older one) already proves an earlier day
function rvSeed(){const r=progress.rv=progress.rv||{};if(r.d0)return r;const td=today(),L=progress.login;
  r.d0=L&&L.last&&L.last!==td?L.last:L&&L.last===td&&(L.streak||0)>1?dlDate(-1):td;saveProgress();return r}
function rvOk(){const r=rvSeed();return !r.done&&r.d0!==today()}
function rvCard(){return state==='win'&&!document.getElementById('overlay').hidden}
function rvBossWon(){if(rvAsking||!rvOk()||!rvPlug())return;const t0=Date.now();rvAsking=true;
  const ask=()=>{const P=rvPlug();if(!P||!rvOk()||!rvCard()){rvAsking=false;return}
    progress.rv.done=Date.now();saveProgress();
    try{Promise.resolve(P.requestReview()).catch(()=>{}).finally(()=>{rvAsking=false})}catch(e){rvAsking=false}};
  const look=()=>{if(state!=='win'){rvAsking=false;return}                     // left the card (Next / Map) before it showed
    if(rvCard())return setTimeout(()=>rvCard()?ask():(rvAsking=false),RV.delay);
    if(Date.now()-t0>RV.wait){rvAsking=false;return}setTimeout(look,300)};
  setTimeout(look,300)}
{const _w=win;win=function(){const b=mode==='levels'&&isBoss(),r=_w.apply(this,arguments);if(b)rvBossWon();return r}}
rvSeed();
