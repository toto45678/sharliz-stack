/* ===== v83: LINKS INTO THE STORE APP (version 1.3, Nov 4; Apple's In-App Event card needs a deep link) =====
   URL scheme sharliztower:// (CFBundleURLTypes in .github/workflows/app.yml; Android intent filter there too).
   Capacitor's App plugin (@capacitor/app) hands us the link: getLaunchUrl() on a cold start, appUrlOpen while running.
   sharliztower://event/<id>   (e.g. sharliztower://event/christmas) → opens that event's hub while the event is live,
                               otherwise (before Dec 15 for Christmas) just the lobby.
   sharliztower://             (or anything else) → the lobby, nothing more.
   Never interrupts a level: the link waits until the player is in a quiet lobby (daily gift and other cards first).
   Nothing is sent anywhere. */
let DL_PEND=null;
function dlParse(u){try{const m=String(u||'').match(/^sharliztower:\/\/+([^?#]*)/i);if(!m)return null;
  const p=m[1].split('/').filter(Boolean).map(s=>decodeURIComponent(s).toLowerCase());return {kind:p[0]||'',id:p[1]||''}}catch(e){return null}}
function dlRun(){const L=DL_PEND;if(!L)return;
  if(state!=='title'||busy||W3.on||document.getElementById('title').hidden||!document.getElementById('overlay').hidden||lobbyLayerOpen())return;
  DL_PEND=null;
  if(L.kind==='event'&&progress.tut){const N=evNow();if(N&&N.live&&N.E.id===L.id)setTimeout(()=>{if(state==='title'&&document.getElementById('overlay').hidden&&!lobbyLayerOpen())openEvent('path')},400)}}
function dlGot(u){const L=dlParse(u);if(!L)return;DL_PEND=L;dlRun()}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);dlRun();return r}}
(function(){try{const C=window.Capacitor;if(!C||!C.isNativePlatform||!C.isNativePlatform())return;
  if(C.isPluginAvailable&&!C.isPluginAvailable('App'))return;
  const A=C.registerPlugin?C.registerPlugin('App'):C.Plugins&&C.Plugins.App;if(!A)return;
  A.addListener('appUrlOpen',e=>dlGot(e&&e.url));
  Promise.resolve(A.getLaunchUrl&&A.getLaunchUrl()).then(r=>{if(r&&r.url)dlGot(r.url)}).catch(()=>{})}catch(e){}})();
// lobby layers close themselves when a card opens; poll gently for the first quiet lobby after a link (cheap: only while one waits)
setInterval(()=>{if(DL_PEND)dlRun()},1500);
