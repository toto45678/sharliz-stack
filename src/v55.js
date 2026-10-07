/* ===== v55: calm lobby — bottom TAB BAR + one row of small time-limited icons (Tzach chose concept C, design/lobby/) =====
   The old side columns stay in the DOM (hidden) so every module that updates their badges keeps working;
   the new buttons are proxies that click the originals and copy their badges/visibility on every updateLobby. */
Object.assign(I18N.en,{tabHome:'Home',tabModes:'Modes',miniDays:'{n}d',miniMis:'Missions',miniOffer:'Offer',arcSubModes:'{n} coin plays today',md_duo:'Two players, one phone'});
Object.assign(I18N.he,{tabHome:'בית',tabModes:'מצבים',miniDays:'{n} ימים',miniMis:'משימות',miniOffer:'מבצע',arcSubModes:'{n} משחקים היום',md_duo:'שניים על טלפון אחד'});
const LT={tabs:[],mini:[]};
function ltVisible(el,root){for(let e=el;e&&e!==root;e=e.parentElement)if(e.hidden)return false;return true}
function ltCloneBadges(orig,proxy){proxy.querySelectorAll('.lt-bd').forEach(e=>e.remove());if(!orig||orig.hidden)return;
  const host=proxy.querySelector('.lt-ic')||proxy;
  orig.querySelectorAll('.badge,.dot').forEach(b=>{if(!ltVisible(b,orig))return;const c=b.cloneNode(true);['data-badge','data-wbadge','data-sbadge','data-abadge','id'].forEach(k=>c.removeAttribute(k));c.classList.add('lt-bd');host.appendChild(c)})}
{const sec=document.getElementById('title');if(sec){
  // bottom tab bar
  const bar=document.createElement('nav');bar.className='lob-tabs';
  const tab=(id,icon,key,orig,cls='')=>{const b=document.createElement('button');b.className='lt-tab '+cls;b.innerHTML=`<span class="lt-ic"><img src="art/${icon}.webp" alt=""></span><b></b>`;b.dataset.k=key;
    b.onclick=()=>{if(orig){const o=document.getElementById(orig);if(o)o.click()}else{audio();sfx.click();LOB.jump=time}};bar.appendChild(b);LT.tabs.push({b,orig,key})};
  tab('shop','ic_shop','shop','lobShop');tab('style','ic_hats','wardrobeShort','lobHats');tab('home','ic_home','tabHome',null,'home on');tab('modes','ic_modes','tabModes','modesTitleBtn');tab('album','ic_album','album','lobAlbum');
  sec.appendChild(bar);
  // small time-limited icons under the logo
  const row=document.createElement('div');row.className='lob-mini';
  const mini=(id,icon,orig,label,cls='')=>{const b=document.createElement('button');b.className='lt-mini '+cls;b.innerHTML=`<span class="lt-ic"><img src="art/${icon}.webp" alt=""></span><b></b>`;
    b.onclick=()=>{const o=document.getElementById(orig);if(o)o.click()};row.appendChild(b);LT.mini.push({b,orig,label})};
  mini('pass','pass_icon','lobPass',()=>t('miniDays',{n:psDays()}),'gold');
  mini('event','ev_icon_halloween','lobEvent',()=>{const N=typeof evNow==='function'&&evNow();if(!N)return '';return t('miniDays',{n:N.live?Math.max(1,evDays(N.w.b-new Date())):evDays(N.w.a-new Date())})},'ev');
  mini('missions','ic_missions','lobMissions',()=>t('miniMis'),'green');
  mini('offer','ic_gift','lobStarter',()=>t('miniOffer'),'offer');
  const logo=sec.querySelector('.logo');if(logo)logo.after(row);else sec.appendChild(row);
  sec.classList.add('lt-on')}}
function ltSync(){
  LT.tabs.forEach(({b,orig,key})=>{b.querySelector('b').textContent=t(key);if(orig)ltCloneBadges(document.getElementById(orig),b)});
  LT.mini.forEach(({b,orig,label})=>{const o=document.getElementById(orig);const show=!!o&&!o.hidden&&!!progress.tut;b.hidden=!show;if(!show)return;
    if(orig==='lobEvent'){const im=o.querySelector('img');if(im)b.querySelector('img').src=im.src;b.className='lt-mini ev '+(o.className.match(/ev-\w+$/)||[''])[0]}
    b.querySelector('b').textContent=label();ltCloneBadges(o,b)})}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);try{ltSync()}catch(e){}return r}}
// arcade now lives inside the Modes card (right under the tournament)
{const _om=openModes;openModes=function(){_om.apply(this,arguments);const box=document.querySelector('#card .modes');if(!box||typeof openArcade!=='function')return;
  const n=['rain','mem','whack'].reduce((s,id)=>s+arcLeft(id),0);const b=document.createElement('button');b.className='mode-btn m-arc';
  b.innerHTML='<img src="art/ic_arcade.webp" alt=""><span class="mt"><b></b><small></small></span>'+(n?`<i class="badge lt-arcbd">${n}</i>`:'');b.querySelector('b').textContent=t('arcTitle');b.querySelector('small').textContent=t('arcSubModes',{n});
  b.onclick=()=>{sfx.click();hideOverlay();openArcade()};const tr=box.querySelector('.m-tour');if(tr)tr.after(b);else box.prepend(b)}}
