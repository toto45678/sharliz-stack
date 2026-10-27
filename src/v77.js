/* ===== v77: NEW VERSION NOTICE in the store app (Tzach, Oct 27: "how do we make players go and download a new update right away?") =====
   Phones update apps by themselves by default; this catches everyone else. Store app only: build.py --store injects window.APP_VER
   (APP_VERSION from .github/workflows/app.yml). The web game has none, so nothing happens there.
   Once per launch the game asks which version is in the store:
   - iPhone/iPad: Apple's lookup API (JSONP, App ID 6819720504), automatic once Apple releases a version.
   - Android: version.json on GitHub Pages {"android":"1.3"}; bump it when Google publishes (Google has no public lookup).
   version.json also takes "min" = FORCED update (emergencies only, e.g. a save-breaking bug: below it there is no "Later")
   and "note" {en,he,…} = one line of what's new, shown when its platform's version in the file is the store version.
   A newer version → a card with the dancing hero, Update (opens the store page) and Later. Later = quiet for 3 days for that
   version (localStorage 'sharliz-upd', not in progress, so save codes don't carry it). Never over another card or lobby layer.
   DEV_OPEN: ?upd=1.3[&min=1.3][&plat=android][&note=…] fakes it on the web. */
const UPD={ios:'https://apps.apple.com/app/id6819720504',android:'https://play.google.com/store/apps/details?id=com.sharlizstack.tower',
  json:'https://toto45678.github.io/sharliz-stack/version.json',appId:'6819720504',snooze:3*864e5};
Object.assign(I18N.en,{updTitle:'New version!',updSub:'Version {n} is in the store. Update to get all the new stuff!',updMust:'Please update the game to keep playing.',updNow:'Update',updLater:'Later'});
Object.assign(I18N.he,{updTitle:'גרסה חדשה!',updSub:'גרסה {n} כבר בחנות. עדכנו כדי לקבל את כל החידושים!',updMust:'צריך לעדכן את המשחק כדי להמשיך לשחק.',updNow:'לעדכן',updLater:'אחר כך'});
const updCmp=(a,b)=>{const x=String(a).split('.').map(n=>+n||0),y=String(b).split('.').map(n=>+n||0);
  for(let i=0;i<Math.max(x.length,y.length);i++){const d=(x[i]||0)-(y[i]||0);if(d)return d>0?1:-1}return 0};
let UPDS=null,updOpen=false,updWent=false;   // UPDS = {cur,latest,min,note,plat}; updWent = tapped Update this launch
function updPlat(){try{const C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()?C.getPlatform():null}catch(e){return null}}
function updJson(){return fetch(UPD.json+'?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():{}).catch(()=>({}))}
// Apple's lookup sends no CORS header, so it is read as JSONP
function updApple(){return new Promise(res=>{const cb='__shzUpd'+Date.now(),s=document.createElement('script');let done=false;
  const end=v=>{if(done)return;done=true;try{delete window[cb]}catch(e){}s.remove();res(v)};
  window[cb]=d=>end(d&&d.results&&d.results[0]&&d.results[0].version||null);s.onerror=()=>end(null);setTimeout(()=>end(null),12000);
  s.src='https://itunes.apple.com/lookup?id='+UPD.appId+'&callback='+cb+'&t='+Date.now();document.head.appendChild(s)})}
// 0 = nothing to show, 1 = a newer version (Later allowed), 2 = this version is below "min" (must update)
function updDue(){const U=UPDS;if(!U||updCmp(U.latest,U.cur)<=0)return 0;if(updCmp(U.cur,U.min)<0&&updCmp(U.latest,U.min)>=0)return 2;
  let s={};try{s=JSON.parse(localStorage.getItem('sharliz-upd')||'{}')||{}}catch(e){}
  return s.v===U.latest&&Date.now()-(s.at||0)<UPD.snooze?0:1}
function updMaybe(){if(updOpen&&document.getElementById('overlay').hidden)updOpen=false;   // someone else closed the card
  if(updOpen||!updDue()||updWent&&updDue()<2)return;
  setTimeout(()=>{const k=updDue();if(!k||updOpen||updWent&&k<2||state!=='title'||W3.on||lobbyLayerOpen()||!document.getElementById('overlay').hidden||document.getElementById('title').hidden)return;updShow(k===2)},900)}
function updShow(must){updOpen=true;const U=UPDS;
  showOverlay(()=>({title:t('updTitle'),anim:'dance',animSize:110,sub:must?t('updMust'):t('updSub',{n:U.latest}),
    extra:U.note?b=>{const p=document.createElement('p');p.className='upd-note';p.textContent=U.note;b.appendChild(p)}:null,
    actions:[{label:t('updNow'),primary:true,fn:()=>{try{window.open(UPD[U.plat]||UPD.ios,'_blank')}catch(e){}if(!must){updWent=true;updOpen=false;hideOverlay()}}},
      ...(must?[]:[{label:t('updLater'),fn:()=>{try{localStorage.setItem('sharliz-upd',JSON.stringify({v:U.latest,at:Date.now()}))}catch(e){}updOpen=false;hideOverlay()}}])]}),true)}
function updStart(){const q=new URLSearchParams(location.search);
  if(typeof DEV_OPEN!=='undefined'&&DEV_OPEN&&q.get('upd')){UPDS={cur:'1.0',latest:q.get('upd'),min:q.get('min')||'0',note:q.get('note')||'',plat:q.get('plat')||'ios'};updMaybe();return}
  const plat=updPlat(),cur=window.APP_VER;if(!plat||!cur)return;
  Promise.all([updJson(),plat==='ios'?updApple():null]).then(([J,av])=>{J=J||{};const fv=J[plat],latest=plat==='ios'?av||fv:fv;if(!latest)return;
    const N=J.note&&fv===latest?J.note:null;UPDS={cur,latest,min:J.min||'0',note:N?N[lang]||N.en||'':'',plat};updMaybe()}).catch(()=>{})}
{const _ul=updateLobby;updateLobby=function(){_ul();updMaybe()}}
updStart();
