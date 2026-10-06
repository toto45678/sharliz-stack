/* ===== v43: tester report (anonymous beta stats, kept on the device) =====
   Per level: attempts, wins, losses, quits (= attempts - wins - losses), seconds played, best floor, boosters used.
   Plus days played, launches, total play time, easy mode, coarse platform and the last JS errors.
   Nothing leaves the device: the parent opens Settings, taps the "Language" label 5 times, and copies the report.
   State: localStorage 'sharliz-tester' (separate from progress, so save codes and resets don't touch it). */
Object.assign(I18N.en,{trTitle:'Tester report',trRow:'Tester report',trOpen:'Open',trOn:'Tester mode on',trCopy:'Copy report',trReset:'Reset',trResetQ:'Tap again to erase the report',trEmpty:'No levels played yet',
  trHead:'Sharliz Tower · tester report',trDays:'Days played',trLaunch:'Launches',trTime:'Play time',trMin:'min',trLast:'Last level played',trFar:'Furthest level',trYes:'on',trNo:'off',
  trCols:'Level: tries / wins / losses / quit · time · best floor · boosters',trStuck:'stuck here',trErr:'Errors',trHelp:'Send this to the developer (nothing personal is included).'});
Object.assign(I18N.he,{trTitle:'דוח בודק',trRow:'דוח בודק',trOpen:'פתיחה',trOn:'מצב בודק פעיל',trCopy:'העתקת הדוח',trReset:'איפוס',trResetQ:'לחצו שוב כדי למחוק את הדוח',trEmpty:'עוד לא שוחקו שלבים',
  trHead:'Sharliz Tower · דוח בודק',trDays:'ימים ששוחקו',trLaunch:'פתיחות',trTime:'זמן משחק',trMin:'דק׳',trLast:'שלב אחרון ששוחק',trFar:'השלב הכי רחוק',trYes:'פועל',trNo:'כבוי',
  trCols:'שלב: ניסיונות / ניצחונות / הפסדים / יצאו באמצע · זמן · קומה הכי גבוהה · בוסטרים',trStuck:'נתקעו כאן',trErr:'שגיאות',trHelp:'שלחו את זה למפתח (אין כאן שום פרט אישי).'});
const TR_KEY='sharliz-tester';
let tr=(()=>{try{const o=JSON.parse(store(TR_KEY)||'null');if(o&&o.lv)return o}catch(e){}return {v:1,on:false,lv:{},days:[],launch:0,secs:0,last:0,err:[]}})();
const trSave=()=>store(TR_KEY,JSON.stringify(tr));
const trDay=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const trL=n=>tr.lv[n]||(tr.lv[n]={a:0,w:0,l:0,s:0,f:0,b:0});
tr.launch++;if(!tr.days.includes(trDay()))tr.days.push(trDay());if(tr.days.length>60)tr.days=tr.days.slice(-60);trSave();
let trCur=0;   // level being played right now (0 = none)
{const _sl=startLevel;startLevel=function(lv){_sl(lv);trCur=0;if(mode==='levels'){trCur=level;trL(level).a++;tr.last=level;trSave()}}}
{const _w=win;win=function(){if(mode==='levels'&&trCur===level){const r=trL(level);r.w++;r.f=Math.max(r.f,tower.length-1);trCur=0;trSave()}_w()}}
{const _fg=failGag;failGag=async function(){if(state==='over'&&mode==='levels'&&trCur===level){const r=trL(level);r.l++;r.f=Math.max(r.f,tower.length-1);trCur=0;trSave()}return _fg()}}
{const _ub=useBooster;useBooster=function(id){const inv=wallet().inv,before=inv[id];_ub(id);if(mode==='levels'&&trCur&&inv[id]<before){trL(trCur).b++;trSave()}}}
// play time: one tick per second while the game is visible; level time only while actually playing
setInterval(()=>{if(document.visibilityState!=='visible')return;tr.secs++;
  if(trCur&&mode==='levels'&&['aim','wait','drop','collapse'].includes(state)){const r=trL(trCur);r.s++;r.f=Math.max(r.f,tower.length-1)}
  if(tr.secs%10===0)trSave()},1000);
addEventListener('pagehide',trSave);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')trSave()});
addEventListener('error',e=>{const m=String(e.message||'error').slice(0,120)+(e.lineno?' @'+e.lineno:'');tr.err=(tr.err||[]).filter(x=>x!==m);tr.err.push(m);if(tr.err.length>5)tr.err.shift();trSave()});
function trText(){
  const mm=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
  const ua=navigator.userAgent,plat=/iPad/.test(ua)?'iPad':/iPhone/.test(ua)?'iPhone':/Android/.test(ua)?'Android':'Other';
  const ids=Object.keys(tr.lv).map(Number).sort((a,b)=>a-b);
  const L=[t('trHead'),
    `${t('trDays')}: ${tr.days.length} · ${t('trLaunch')}: ${tr.launch} · ${t('trTime')}: ${Math.round(tr.secs/60)} ${t('trMin')}`,
    `${t('trLast')}: ${tr.last||'-'} · ${t('trFar')}: ${progress.unlocked} · ${t('easy')}: ${settings.easy?t('trYes'):t('trNo')}`,
    `${plat} ${screen.width}×${screen.height} · ${lang}`,''];
  if(!ids.length)L.push(t('trEmpty'));else{L.push(t('trCols'));
    for(const n of ids){const r=tr.lv[n],q=Math.max(0,r.a-r.w-r.l),stuck=r.l+q>=4&&r.w===0;
      L.push(`${t('level')} ${n}: ${r.a}/${r.w}/${r.l}/${q} · ${mm(r.s)} · ${r.f} · ${r.b}${stuck?' ⚠️ '+t('trStuck'):''}`)}}
  if(tr.err&&tr.err.length){L.push('',t('trErr')+':');tr.err.forEach(e=>L.push('- '+e))}
  return L.join('\n');
}
function openTesterReport(){let armed=false;
  showOverlay(()=>({title:t('trTitle'),extra:card=>{const h=document.createElement('p');h.className='tr-help';h.textContent=t('trHelp');card.appendChild(h);
      const box=document.createElement('div');box.className='tr-text';trText().split('\n').forEach(x=>{const d=document.createElement('div');d.dir=lang==='he'?'rtl':'ltr';d.textContent=x||'\u00a0';if(x.includes('⚠️'))d.className='tr-stuck';box.appendChild(d)});card.appendChild(box)},
    actions:[{label:t('trCopy'),icon:'camera',primary:true,fn:async()=>{const txt=trText();try{await navigator.clipboard.writeText(txt);popupToast(t('copied'))}catch(e){const ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;opacity:0;top:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');popupToast(t('copied'))}catch(_){}ta.remove()}}},
      {label:t('trReset'),icon:'restart',fn:()=>{if(!armed){armed=true;popupToast(t('trResetQ'));return}const on=tr.on;tr={v:1,on,lv:{},days:[trDay()],launch:1,secs:0,last:0,err:[]};trCur=0;trSave();rerenderOverlay()}},
      {label:'OK',fn:openSettings}]}),true)}
// hidden entry: tap the "Language" label in Settings 5 times; then a "Tester report" row stays in Settings
{const _sr=settingsRows;settingsRows=function(card){_sr(card);if(state==='paused')return;
  const lab=card.querySelector('.opt-row span');let taps=0,tt=0;
  if(lab)lab.addEventListener('click',()=>{const now=Date.now();taps=now-tt<1500?taps+1:1;tt=now;if(taps>=5&&!tr.on){tr.on=true;trSave();popupToast(t('trOn'));rerenderOverlay()}});
  if(!tr.on)return;
  const r=document.createElement('div');r.className='opt-row';const l=document.createElement('span');l.textContent=t('trRow');const b=document.createElement('button');b.className='buy';b.textContent=t('trOpen');
  b.onclick=()=>{sfx.click();openTesterReport()};r.appendChild(l);r.appendChild(b);card.appendChild(r)}}
