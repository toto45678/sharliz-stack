/* ===== v76: SPACE PATROL — the spaceship shooter that opens at level 200 (Tzach, Oct 27: "from level 200 a new part of the
   game opens: upgrade a spaceship, a shooter like the one we played as kids") =====
   Tzach, Oct 27 06:58 (changed the plan): from level 90, for everyone, the level BEFORE every boss (89, 99, 109 … = SP_LVS) is a
   SPACE LEVEL: the ship flies over that world, fights the world's mini-bosses and, at the end, the boss's BIG HELPER.
   startLevel() is wrapped: in levels mode a space level opens the shooter instead of the tower; a win writes the level's stars
   and unlocks the boss like a normal win. The HANGAR (lobby rocket, opens with the first space level) is where the ship is
   upgraded and any space level you reached can be replayed. Art the graphics department will draw (shows up by itself via SP_ART):
   sp_help_<sid> (the boss's big helper), sp_mini_<sid>_1..2 (the world's mini-bosses), sp_charlie (Charlie in the hangar).
   Until then: the helper = the boss picture in a glass helmet, mini-bosses = big minions. Enemies: arc_mon1-4 + rocks.
   The pilot is your own Sharliz under a glass dome.
   Upgrades: 4 ship parts bought with coins (fixed prices, nothing random). EARNED parts (Tzach: "things you only get when you
   finish everything completely, like life-saving upgrades for the ship"): never sold, only from fully finishing something —
   the Christmas event (progress.ship.got.xmasShield, written by the Christmas module), each season with 3★ on every level,
   and every space level with 3★. Own full-screen layer #ship (z 8) with its own rAF loop like the v51 arcade.
   progress.ship={lv:{gun,rate,hull,mag},got:{id:1},intro}; a space level's stars live in progress.stars like any level.
   Charlie (Tzach's character) shows up in the hangar once art/sp_charlie.webp exists (SP_ART, injected by build.py). */
Object.assign(I18N.en,{spName:'Space Patrol',spShort:'Space',spLvl:'Level {n}',spLockT:'Space Patrol',spLockP:'Your spaceship is waiting! It opens at level {n}.',spLockNow:'You are at level {n}',
  wpn1:'Blaster',wpn2:'Zap laser',wpn3:'Fire cannon',wpn4:'Plasma',wpn5:'Ice shards',wpn6:'Rockets',wpn7:'Thunder beam',wpn8:'Star shooter',wpn9:'Sonic waves',wpn10:'Galaxy beam',
  wps0:'one shot',wps1:'3 shots forward',wps2:'3 shots every way',wps3:'one giant shot',wpb0:'one thin laser',wpb1:'3 lasers',wpb2:'3 lasers every way',wpb3:'a giant laser pillar',spWLv:'level {n}/4',wpMax:'The strongest weapon!',
  chName:'Charlie',chMe1:'Hi, I\'m Charlie! I\'m the most chilled-out mechanic in the galaxy, and I run this garage.',chMe2:'I always wear my cap, I\'m never in a hurry, and I never leave a ship broken. And your Sharliz? It\'s my best helper!',chJob:'Every upgrade takes time to build, and my workshop builds two at once. Come back when it\'s ready!',spBusy:'Building',spSlots:'Two upgrades are already being built. Wait for one to finish!',spDone:'{u} is ready!',spJobs:'In the workshop',chNext:'Next',chGo:'Let\'s go!',chOk:'Got it!',chHi:'Hi, I\'m Charlie! I run this garage.',chG1:'This is your spaceship! Before every boss you fly it over the world and fight the boss\'s big helper.',chG2:'Spend coins on upgrades: new weapons, faster shots, armor and a coin magnet.',chG3:'Some parts can never be bought. Finish everything completely to earn them!',chG4:'Want more? Endless flight never ends, and every 5 waves a boss shows up.',chF1:'Drag anywhere to fly. Your ship shoots by itself!',chF2:'Catch coins and power stars, and dodge the shots and rocks!',chE1:'Endless flight! How far can you get? Every 5 waves a big helper attacks, then we fly on to the next world.',chW:'New weapon: {w}! Let\'s try it out!',chPart:'You earned a new part: {p}!',chLockSoon:'Your spaceship is almost ready. Come back at level {n}!',
  spEndless:'Endless flight',spEDesc:'Never ends, a boss every 5 waves',spEBest:'Best: wave {n}',spEWave:'You reached wave {n}!',spERec:'New record!',spENext:'Next world!',
  spOpenT:'Space Patrol is open!',spOpenP:'Before every boss you now fly your own spaceship: blast the monsters and beat the boss\'s big helper!',spGo:'To the garage',spOk:'OK',
  spLaunch:'Launch',spSector:'Space level {n}',spHelper:"{b}'s big helper",spSectors:'Space levels',spMap:'Map',spToBoss:'To the boss!',spMini:'Mini-boss!',spUps:'Ship upgrades',spEarn:'Earned by finishing',spEarnNote:'These can never be bought. Finish everything to earn them!',
  spMax:'MAX',spYours:'Yours!',spNew:'New ship part!',
  up_gun:'Blasters',ud_gun:'More shots at once',up_rate:'Fire rate',ud_rate:'Shoots faster',up_hull:'Armor',ud_hull:'+1 heart',up_mag:'Coin magnet',ud_mag:'Pulls coins from farther',
  er_xmasShield:'Holiday star shield',ed_xmasShield:'Blocks the first 2 hits of every flight',eh_xmasShield:'Finish all 10 Christmas stages',
  er_pod:'Rescue pod',ed_pod:'Once a flight: when your last heart is lost, you come back with 2 hearts',eh_pod:'3 stars on every level of season 1',
  er_drones:'Wing drones',ed_drones:'Two drones shoot with you',eh_drones:'3 stars on every level of season 2',
  er_laser:'Piercing laser',ed_laser:'Shots fly through 2 monsters',eh_laser:'3 stars on every level of season 3',
  er_gold:'Golden hull',ed_gold:'+1 heart',eh_gold:'3 stars on every level of season 4',
  er_rainbow:'Rainbow engine',ed_rainbow:'Start every flight with a power star',eh_rainbow:'3 stars on every space level',
  spProg:'{a}/{b}',spWave:'Wave {a}/{b}',spBossW:'BOSS!',spPower:'Power up!',spShield:'Shield!',spRescue:'Rescue pod!',
  spWin:'Space level cleared!',spLose:'Ship down!',spCollected:'Coins collected',spFirst:'First clear bonus',spHangar:'Garage',spRetry:'Try again',
  spTipUp:'Tip: upgrade your ship in the garage',spGoal:'Clear 4 waves of monsters, then beat {b}',spSt1:'Win the space level',spSt2:'Lose at most 1 heart',spSt3:'Lose no hearts',spPause:'Paused',spResume:'Resume',spLeave:'Leave flight',spHowTo:'Drag to fly. Your ship shoots by itself!',spLocked:'Opens at level {n}'});
Object.assign(I18N.he,{spName:'סיירת החלל',spShort:'חלל',spLvl:'שלב {n}',spLockT:'סיירת החלל',spLockP:'החללית שלכם מחכה! היא נפתחת בשלב {n}.',spLockNow:'אתם בשלב {n}',
  wpn1:'בלאסטר',wpn2:'לייזר חשמלי',wpn3:'תותח אש',wpn4:'פלזמה',wpn5:'רסיסי קרח',wpn6:'טילים',wpn7:'קרן רעם',wpn8:'יורה כוכבים',wpn9:'גלי קול',wpn10:'קרן גלקסיה',
  wps0:'ירייה אחת',wps1:'3 יריות קדימה',wps2:'3 יריות לכל כיוון',wps3:'ירייה אחת ענקית',wpb0:'לייזר דק אחד',wpb1:'3 לייזרים',wpb2:'3 לייזרים לכל כיוון',wpb3:'עמוד לייזר ענק',spWLv:'רמה {n}/4',wpMax:'הנשק הכי חזק!',
  chName:'צ׳ארלי',chMe1:'היי, אני צ׳ארלי! אני המכונאי הכי רגוע בגלקסיה, ואני מנהל את המוסך הזה.',chMe2:'אני תמיד עם הכובע שלי, אף פעם לא ממהר, ואף פעם לא משאיר חללית שבורה. והשארליז שלך? הוא העוזר הכי טוב שלי!',chJob:'כל שדרוג לוקח זמן לבנות, והסדנה שלי בונה שניים בבת אחת. תחזרו כשהוא מוכן!',spBusy:'בבנייה',spSlots:'כבר בונים שני שדרוגים. חכו שאחד יסתיים!',spDone:'{u} מוכן!',spJobs:'בסדנה',chNext:'הבא',chGo:'יאללה!',chOk:'הבנתי!',chHi:'היי, אני צ׳ארלי! אני מנהל את המוסך.',chG1:'זאת החללית שלך! לפני כל בוס טסים בה מעל העולם ונלחמים בעוזר הגדול של הבוס.',chG2:'עם מטבעות קונים שדרוגים: נשקים חדשים, יריות מהירות, שריון ומגנט מטבעות.',chG3:'יש חלקים שאי אפשר לקנות אף פעם. מסיימים הכל עד הסוף ומרוויחים אותם!',chG4:'רוצים עוד? הטיסה האינסופית לא נגמרת, וכל 5 גלים מגיע בוס.',chF1:'גוררים בכל מקום כדי לטוס. החללית יורה לבד!',chF2:'תופסים מטבעות וכוכבי כוח, ומתחמקים מיריות ומסלעים!',chE1:'טיסה אינסופית! עד כמה רחוק תגיעו? כל 5 גלים תוקף עוזר גדול, ואז טסים לעולם הבא.',chW:'נשק חדש: {w}! בואו ננסה אותו!',chPart:'הרווחתם חלק חדש: {p}!',chLockSoon:'החללית שלך כמעט מוכנה. תחזרו בשלב {n}!',spEndless:'טיסה אינסופית',spEDesc:'לא נגמרת, בוס כל 5 גלים',spEBest:'שיא: גל {n}',spEWave:'הגעת לגל {n}!',spERec:'שיא חדש!',spENext:'לעולם הבא!',
  spOpenT:'סיירת החלל נפתחה!',spOpenP:'לפני כל בוס טסים עכשיו בחללית משלכם: מפוצצים מפלצות ומנצחים את העוזר הגדול של הבוס!',spGo:'למוסך',spOk:'אוקיי',
  spLaunch:'המראה',spSector:'שלב חלל {n}',spHelper:'העוזר הגדול של {b}',spSectors:'שלבי חלל',spMap:'מפה',spToBoss:'לבוס!',spMini:'מיני בוס!',spUps:'שדרוגים לחללית',spEarn:'מרוויחים רק בסיום',spEarnNote:'את אלה אי אפשר לקנות. מסיימים הכל ומרוויחים!',
  spMax:'מקס',spYours:'שלכם!',spNew:'חלק חדש לחללית!',
  up_gun:'תותחים',ud_gun:'יותר יריות בבת אחת',up_rate:'קצב אש',ud_rate:'יורה מהר יותר',up_hull:'שריון',ud_hull:'עוד לב',up_mag:'מגנט מטבעות',ud_mag:'מושך מטבעות מרחוק יותר',
  er_xmasShield:'מגן כוכב החג',ed_xmasShield:'חוסם את 2 הפגיעות הראשונות בכל טיסה',eh_xmasShield:'מסיימים את כל 10 שלבי חג המולד',
  er_pod:'תא הצלה',ed_pod:'פעם בטיסה: כשהלב האחרון נגמר, חוזרים עם 2 לבבות',eh_pod:'3 כוכבים בכל שלבי עונה 1',
  er_drones:'רחפני כנף',ed_drones:'שני רחפנים יורים איתכם',eh_drones:'3 כוכבים בכל שלבי עונה 2',
  er_laser:'לייזר חודר',ed_laser:'היריות עוברות דרך 2 מפלצות',eh_laser:'3 כוכבים בכל שלבי עונה 3',
  er_gold:'שריון זהב',ed_gold:'עוד לב',eh_gold:'3 כוכבים בכל שלבי עונה 4',
  er_rainbow:'מנוע קשת',ed_rainbow:'כל טיסה מתחילה עם כוכב כוח',eh_rainbow:'3 כוכבים בכל שלבי החלל',
  spProg:'{a}/{b}',spWave:'גל {a}/{b}',spBossW:'בוס!',spPower:'כוח!',spShield:'מגן!',spRescue:'תא הצלה!',
  spWin:'שלב החלל עבר!',spLose:'החללית נפגעה!',spCollected:'מטבעות שנאספו',spFirst:'בונוס ניצחון ראשון',spHangar:'המוסך',spRetry:'שוב',
  spTipUp:'טיפ: שדרגו את החללית במוסך',spGoal:'עוברים 4 גלים של מפלצות ומנצחים את {b}',spSt1:'לעבור את שלב החלל',spSt2:'לאבד לכל היותר לב אחד',spSt3:'בלי לאבד לב',spPause:'הפסקה',spResume:'ממשיכים',spLeave:'יוצאים מהטיסה',spHowTo:'גוררים כדי לטוס. החללית יורה לבד!',spLocked:'נפתח בשלב {n}'});
const SP_ART=__SP_ART__,SP_CAP=80;
// ship sprites from the graphics department (tools/space/ship_import.py): sp_ship_g<gun 0-5>_<h0|h1|h2|gold>[_l|_r] = the whole ship for that blaster level and hull look,
// straight / banking left / banking right; its glass dome is drawn empty and SP_DOME[name]={x,y,r} (fractions of the picture width/height) says where the Sharliz sits
const SP_DOME=__SP_DOME__;
function spShipPic(o){const h=o.gold?'gold':'h'+Math.min(2,o.hull||0),b='sp_ship_g'+Math.min(5,o.gun||0)+'_'+h,tl=o.tilt||0,v=b+(tl<-.35?'_l':tl>.35?'_r':'');
  // until the per-upgrade ships exist: the hull look's ship (graphics batch 1: sp_ship / _blue / _pink / _gold)
  const base=o.gold?'sp_ship_gold':['sp_ship','sp_ship_blue','sp_ship_pink'][Math.min(2,o.hull||0)];
  const n=SP_ART.includes(v)?v:SP_ART.includes(b)?b:SP_ART.includes(base)?base:null;return n&&hzPic(n)?n:null}
// space levels: the level before every boss, from level 90 on (89, 99, … 299, and on into any later seasons)
const SP_LVS=[];for(let L=89;L<=TOTAL;L++)if((L-1)%LPZ===LPZ-2)SP_LVS.push(L);
const SP_N=SP_LVS.length,SP_OPEN=SP_LVS[0];
const spIsLv=L=>SP_LVS.includes(L),spK=L=>SP_LVS.indexOf(L),spLvOf=k=>SP_LVS[k];
const spReached=k=>(typeof DEV_OPEN!=='undefined'&&DEV_OPEN)||(progress.unlocked||1)>=SP_LVS[k];
const spSt=k=>progress.stars[SP_LVS[k]-1]||0;
// gun = 40 steps: 10 weapons x 4 levels (v76 WEAPONS at the end); prices grow slowly so the last weapon is a long-term goal
const SP_UP=[['gun',39,'ic_laser',Array.from({length:39},(_,i)=>Math.round(120*Math.pow(1.115,i)/10)*10)],['rate',5,'ic_bolt',[250,500,850,1300,1900]],['hull',2,'ic_heart',[800,1800]],['mag',3,'ic_coins',[200,450,800]]];
const SP_DRONE='<svg viewBox="0 0 40 40" aria-hidden="true"><g stroke="#120d2b" stroke-width="2.5"><circle cx="11" cy="20" r="8" fill="#e8e4f5"/><circle cx="29" cy="20" r="8" fill="#e8e4f5"/></g><circle cx="11" cy="20" r="3.5" fill="#4ee6ff"/><circle cx="29" cy="20" r="3.5" fill="#4ee6ff"/><path d="M11 10V4M29 10V4" stroke="#ffd23f" stroke-width="3" stroke-linecap="round"/></svg>';
const SP_EARN=['xmasShield','pod','drones','laser','gold','rainbow'];
const SP_EIC={xmasShield:'ic_shield',pod:'ic_revive',drones:'svg',laser:'ic_laser',gold:'ic_heart',rainbow:'ic_star'};
function spD(){const s=progress.ship=progress.ship||{};s.lv=s.lv||{};s.got=s.got||{};return s}
const spOpen=()=>(typeof DEV_OPEN!=='undefined'&&DEV_OPEN)||(progress.unlocked||1)>=SP_OPEN;
const spLv=k=>spD().lv[k]||0;
function spSid(k){const z=ZONES[Math.floor((SP_LVS[k]-1)/LPZ)];return z.sid||z.id}
const spBossName=k=>{const s=spSid(k);return t(BOSS_NAMES[s]||s)};
// a season is fully finished = 3 stars on every one of its levels
function spSeason(s){let a=0,b=0;ZONES.forEach((z,zi)=>{if((z.season||1)!==s)return;for(let i=0;i<LPZ;i++){b++;if((progress.stars[zi*LPZ+i]||0)>=3)a++}});return{a,b}}
function spEarnProg(id){const D=spD();if(id==='xmasShield')return null;if(id==='rainbow'){let a=0;for(let k=0;k<SP_N;k++)if(spSt(k)>=3)a++;return{a,b:SP_N}}
  return spSeason({pod:1,drones:2,laser:3,gold:4}[id])}
// sticky: once earned, a part stays (nothing a player has is ever taken away)
function spCheckEarn(){const D=spD(),nw=[];SP_EARN.forEach(id=>{if(D.got[id])return;const p=spEarnProg(id);if(p&&p.b&&p.a>=p.b){D.got[id]=1;nw.push(id)}});if(nw.length)saveProgress();return nw}
const spHas=id=>!!spD().got[id];

/* ---------- drawing ---------- */
// re-made once the player's baked look is ready (a flight started before the bake would keep the plain default colour)
let SPHERO=null;const spHero=()=>(!SPHERO||(SPHERO.color!=='hero'&&window.CHARS&&CHARS.hero))?(SPHERO=arcHeroSprite()):SPHERO;
function spRR(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
// the ship: s = half width. o = {gun, hull, gold, drones, shield, t, tilt, flame}
function spDrawShip(g,x,y,s,o){const T=o.t||0,K='#201c24';g.save();g.translate(x,y);g.rotate((o.tilt||0)*.25);g.lineJoin='round';g.lineCap='round';
  // engine flame
  const fl=(o.flame==null?1:o.flame)*(1+Math.sin(T*40)*.12);{const gr=g.createLinearGradient(0,s*.55,0,s*(1.1+.6*fl));gr.addColorStop(0,'#fff6c2');gr.addColorStop(.35,'#ffb23f');gr.addColorStop(1,'rgba(255,80,60,0)');g.fillStyle=gr;
    g.beginPath();g.moveTo(-s*.2,s*.55);g.quadraticCurveTo(0,s*(1.25+.7*fl),s*.2,s*.55);g.fill();if(o.rainbow){g.globalAlpha=.6;g.fillStyle=`hsl(${(T*300)%360},90%,65%)`;g.beginPath();g.moveTo(-s*.1,s*.6);g.quadraticCurveTo(0,s*(1+.5*fl),s*.1,s*.6);g.fill();g.globalAlpha=1}}
  const pn=spShipPic(o);if(pn){const im=hzPic(pn),dm=SP_DOME[pn]||{x:.5,y:.371,r:.14},w=s*.294/dm.r,h=w*im.naturalHeight/im.naturalWidth,y0=-s*.68-dm.y*h,x0=-dm.x*w;g.rotate(-(o.tilt||0)*.25+(o.tilt||0)*.08);
    spAddons(g,s,o,0);g.drawImage(im,x0,y0,w,h);const cx=0,cy=-s*.68,cr=dm.r*w;g.save();g.beginPath();g.arc(cx,cy,cr*.96,0,7);g.clip();g.fillStyle='#2a2060';g.fill();
    spPilot(g,cx,cy,cr,o);
    const gr=g.createRadialGradient(cx-cr*.35,cy-cr*.4,cr*.05,cx,cy,cr);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(.5,'rgba(200,230,255,.12)');gr.addColorStop(1,'rgba(150,200,255,.3)');g.fillStyle=gr;g.fillRect(cx-cr,cy-cr,cr*2,cr*2);g.restore();g.restore()}
  else{
  // wings
  const wc=o.gold?['#ffe98a','#e0a400']:[['#b99bff','#6b3fe0'],['#8fd3ff','#2f7fe0'],['#ff9ad5','#c2309a']][Math.min(2,o.hull||0)];
  for(const d of [-1,1]){const gr=g.createLinearGradient(0,-s*.1,d*s,s*.5);gr.addColorStop(0,wc[0]);gr.addColorStop(1,wc[1]);g.fillStyle=gr;g.strokeStyle=K;g.lineWidth=Math.max(2,s*.07);
    g.beginPath();g.moveTo(d*s*.3,-s*.15);g.quadraticCurveTo(d*s*.95,s*.15,d*s*1.0,s*.6);g.quadraticCurveTo(d*s*.6,s*.5,d*s*.3,s*.55);g.closePath();g.fill();g.stroke();
    // gun pods: one more per two blaster levels
    const n=1+Math.floor((o.gun||0)/2);for(let i=0;i<n;i++){const px=d*s*(.92-i*.2),py=s*(.38-i*.08);g.fillStyle='#e8e4f5';spRR(g,px-s*.07,py-s*.32,s*.14,s*.34,s*.06);g.fill();g.stroke();g.fillStyle='#ff5a7a';g.beginPath();g.arc(px,py-s*.3,s*.04,0,7);g.fill()}}
  // body
  {const gr=g.createLinearGradient(-s*.4,0,s*.4,0);gr.addColorStop(0,'#d9d2f2');gr.addColorStop(.45,'#ffffff');gr.addColorStop(1,'#b8acdf');g.fillStyle=gr;g.strokeStyle=K;g.lineWidth=Math.max(2,s*.08);
    g.beginPath();g.moveTo(0,-s*.95);g.bezierCurveTo(s*.42,-s*.8,s*.46,s*.3,s*.3,s*.62);g.lineTo(-s*.3,s*.62);g.bezierCurveTo(-s*.46,s*.3,-s*.42,-s*.8,0,-s*.95);g.closePath();g.fill();g.stroke();
    g.fillStyle=o.gold?'#ffd23f':'#ff5a7a';g.beginPath();g.moveTo(-s*.3,s*.5);g.lineTo(s*.3,s*.5);g.lineTo(s*.28,s*.64);g.lineTo(-s*.28,s*.64);g.closePath();g.fill();g.stroke()}
  // cockpit: your Sharliz under a glass dome with a gold ring (astronaut helmet)
  const cy=-s*.28,cr=s*.3;g.fillStyle='#2a2060';g.beginPath();g.arc(0,cy,cr,0,7);g.fill();
  g.save();g.beginPath();g.arc(0,cy,cr*.96,0,7);g.clip();spPilot(g,0,cy,cr,o);g.restore();
  {const gr=g.createRadialGradient(-cr*.35,cy-cr*.4,cr*.05,0,cy,cr);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(.5,'rgba(200,230,255,.12)');gr.addColorStop(1,'rgba(150,200,255,.3)');g.fillStyle=gr;g.beginPath();g.arc(0,cy,cr,0,7);g.fill()}
  g.strokeStyle='#ffd23f';g.lineWidth=Math.max(2,s*.08);g.beginPath();g.arc(0,cy,cr,0,7);g.stroke();g.strokeStyle=K;g.lineWidth=Math.max(1.5,s*.035);g.beginPath();g.arc(0,cy,cr+s*.05,0,7);g.stroke();
  g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=Math.max(1.5,s*.05);g.beginPath();g.arc(0,cy,cr*.72,-2.6,-1.9);g.stroke();
  g.restore()}
  if(o.drones)for(const d of [-1,1])spDrone(g,x+d*s*1.45,y+s*.15+Math.sin(T*3+d)*s*.08,s*.22);
  if(o.shield>0&&SP_ART.includes('sp_shield')&&hzPic('sp_shield')){const im=hzPic('sp_shield'),r=s*1.45*(1+.03*Math.sin(T*5));g.save();g.globalAlpha=.22+.1*o.shield;g.drawImage(im,x-r,y-s*.15-r,r*2,r*2);g.restore()}
  else if(o.shield>0){g.save();g.globalAlpha=.35+.1*Math.sin(T*6);const gr=g.createRadialGradient(x,y,s*.6,x,y,s*1.35);gr.addColorStop(0,'rgba(120,230,255,0)');gr.addColorStop(1,'rgba(150,240,255,.9)');g.fillStyle=gr;g.beginPath();g.arc(x,y,s*1.35,0,7);g.fill();
    g.globalAlpha=.9;g.fillStyle='#fff6a8';for(let i=0;i<o.shield*3;i++){const a=T*1.5+i*2.09/(o.shield>1?1:1.5);spStar(g,x+Math.cos(a)*s*1.3,y+Math.sin(a)*s*1.3,s*.13)}g.restore()}}
// the player's own Sharliz (its baked look: colour, hat, glasses...) big in the dome, eyes in the middle so the face reads even on a small ship
function spPilot(g,cx,cy,cr,o){try{const h=spHero(),S=cr*1.55;withCtx(g,S,()=>drawSharliz(h,cx+(o.tilt||0)*cr*.12,cy+S*.24,(o.tilt||0)*-.12,o.mood||'happy',{x:(o.tilt||0)*.5,y:-.3},0))}catch(e){}}
function spAnim(G,base,n,x,y,size,d){if(!SP_ART.includes(base+'1'))return;(G.anim||(G.anim=[])).push({base,n,x,y,size,d,t:0});if(G.anim.length>40)G.anim.shift()}
function spDrawAnims(G,g){if(!G.anim)return;g.save();g.globalCompositeOperation='lighter';for(const a of G.anim){const im=hzPic(a.base+Math.min(a.n,1+Math.floor(a.t/a.d*a.n)));if(im){g.globalAlpha=1-Math.max(0,a.t/a.d-.6)*2;g.drawImage(im,a.x-a.size/2,a.y-a.size/2,a.size,a.size)}}g.restore()}
// shots: the tier's picture when the graphics department's art is in, else a glowing capsule in the tier's colours (fire gets a flicker tail, 6 crackles)
function spDrawShots(G,g){const rb=spHas('rainbow');g.save();g.globalCompositeOperation='lighter';
  for(const b of G.bul){const tr=b.t||1,an=Math.atan2(b.vx,-b.vy);g.save();g.translate(b.x,b.y);g.rotate(an);
    if(b.dr){g.fillStyle='#4ee6ff';g.shadowColor='#4ee6ff';g.shadowBlur=8;spRR(g,-2,-7,4,14,2);g.fill();g.restore();continue}
    const im=SP_ART.includes('sp_shot_'+tr)&&hzPic('sp_shot_'+tr);
    if(im){const h=G.u*(.05+.012*tr),w=h*im.naturalWidth/im.naturalHeight;g.drawImage(im,-w/2,-h/2,w,h);g.restore();continue}
    const [c0,c1]=SP_TC[tr],L=G.u*(.035+.008*tr),W2=G.u*(.006+.0025*Math.min(tr,4));
    const gr=g.createLinearGradient(0,-L,0,L*(tr===5?1.6:1));gr.addColorStop(0,c0);gr.addColorStop(.35,rb&&tr<6?`hsl(${(b.y*.8)%360},95%,65%)`:c1);gr.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=gr;g.shadowColor=c1;g.shadowBlur=6+tr*2;
    if(tr===5){g.beginPath();g.arc(0,-L*.55,W2*1.5,0,7);g.fill();g.beginPath();g.moveTo(-W2*1.3,-L*.55);g.quadraticCurveTo(Math.sin(G.el*40+b.x)*W2,L*1.4,W2*1.3,-L*.55);g.fill()}
    else{spRR(g,-W2,-L,W2*2,L*2,W2);g.fill();g.fillStyle='rgba(255,255,255,.85)';spRR(g,-W2*.4,-L*.85,W2*.8,L*1.2,W2*.4);g.fill()}
    if(tr===6){g.strokeStyle=`hsl(${(G.el*400+b.x)%360},100%,75%)`;g.lineWidth=1.5;g.beginPath();g.moveTo(0,-L);for(let i=1;i<6;i++)g.lineTo((Math.random()-.5)*W2*4,-L+i*L*.4);g.stroke()}
    g.restore()}
  // muzzle flash
  if(G.flash>0){const tr=G.ftier||1,im=SP_ART.includes('sp_flash_'+tr)&&hzPic('sp_flash_'+tr),r=G.s*(.35+.06*tr),x=G.sx,y=G.sy-G.s*.95;g.globalAlpha=G.flash/.08;
    if(im)g.drawImage(im,x-r,y-r,r*2,r*2);else{const rg=g.createRadialGradient(x,y,0,x,y,r);rg.addColorStop(0,'#fff');rg.addColorStop(.4,SP_TC[tr][1]);rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.beginPath();g.arc(x,y,r,0,7);g.fill()}}
  g.restore()}
// pickups: a soft glow behind, a gentle bob, a spinning coin / pulsing star / coin bag (pictures from the graphics department when they exist)
function spDrawDrops(G,g){const T=G.el;
  for(const d of G.drops){const big=d.k!=='coin',r=G.u*(d.k==='coin'?.034:.055),y=d.y+Math.sin(T*5+d.x)*r*.15;
    g.save();g.globalCompositeOperation='lighter';const gl=SP_ART.includes('sp_pk_glow')&&hzPic('sp_pk_glow'),R=r*(2.1+.25*Math.sin(T*6+d.x));g.globalAlpha=.55;
    if(gl)g.drawImage(gl,d.x-R,y-R,R*2,R*2);else{const rg=g.createRadialGradient(d.x,y,0,d.x,y,R);rg.addColorStop(0,d.k==='star'?'rgba(255,120,220,.9)':'rgba(255,220,80,.9)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.beginPath();g.arc(d.x,y,R,0,7);g.fill()}g.restore();
    if(d.k==='coin'){const fr=1+Math.floor((T*10+d.x)%4),im=SP_ART.includes('sp_pk_coin_1')?hzPic('sp_pk_coin_'+fr):hzPic('ic_coin');if(im){const sx=SP_ART.includes('sp_pk_coin_1')?1:Math.abs(Math.cos(T*5+d.x))*.85+.15;g.drawImage(im,d.x-r*sx,y-r,r*2*sx,r*2)}}
    else if(d.k==='bag'){const im=hzPic(SP_ART.includes('sp_pk_bag')?'sp_pk_bag':'ic_coins');if(im)g.drawImage(im,d.x-r,y-r,r*2,r*2)}
    else{const im=(SP_ART.includes('sp_star')&&hzPic('sp_star'))||(SP_ART.includes('sp_pk_star')&&hzPic('sp_pk_star')),k=1+.12*Math.sin(T*8);g.save();g.translate(d.x,y);g.rotate(Math.sin(T*3)*.3);g.scale(k,k);
      if(im)g.drawImage(im,-r,-r,r*2,r*2);else{g.fillStyle='#ff8ad8';g.strokeStyle='#201c24';g.lineWidth=3;spStar(g,0,0,r);g.fill();g.stroke();g.fillStyle='#fff6a8';spStar(g,0,0,r*.45);g.fill()}g.restore()}
    // sparkles
    if(big||Math.floor(T*3+d.x)%3===0){g.fillStyle='#fff';const a=T*4+d.x,sr=r*1.25;spStar(g,d.x+Math.cos(a)*sr,y+Math.sin(a)*sr,r*.18)}}}
function spAddons(g,s,o){const T=o.t||0,mg=Math.min(3,o.mag||0);
  if(mg){const im=SP_ART.includes('sp_magnet'+mg)&&hzPic('sp_magnet'+mg);if(im){const k=s*.0034;g.save();g.translate(s*.78,s*.62);g.rotate(.35+Math.sin(T*2)*.05);g.drawImage(im,-im.naturalWidth*k/2,-im.naturalHeight*k,im.naturalWidth*k,im.naturalHeight*k);g.restore()}}
  if(o.pod){const im=SP_ART.includes('sp_pod')&&hzPic('sp_pod');if(im){const r=s*.3;g.drawImage(im,-s*.95-r,s*.55-r+Math.sin(T*2.4)*s*.05,r*2,r*2*im.naturalHeight/im.naturalWidth)}}}
function spDrone(g,x,y,r){const im=SP_ART.includes('sp_drone')&&hzPic('sp_drone');if(im){g.drawImage(im,x-r*1.3,y-r*1.3,r*2.6,r*2.6);return}g.save();g.fillStyle='#e8e4f5';g.strokeStyle='#201c24';g.lineWidth=Math.max(1.5,r*.2);g.beginPath();g.arc(x,y,r,0,7);g.fill();g.stroke();g.fillStyle='#4ee6ff';g.beginPath();g.arc(x,y,r*.45,0,7);g.fill();g.restore()}
function spStar(g,x,y,r){g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.closePath();g.fill()}
// space boss: the boss picture inside a glass helmet, on a little jet saucer
function spDrawBoss(g,B,T){if(B.own){const im=hzPic('sp_help_'+B.sid),s=B.s;if(!im)return;const w=s*1.3,h=w*im.naturalHeight/im.naturalWidth;g.save();g.translate(B.x,B.y);g.drawImage(im,-w/2,-h/2,w,h);
    if(B.hurt>0){g.globalCompositeOperation='lighter';g.globalAlpha=B.hurt*3;g.drawImage(im,-w/2,-h/2,w,h)}g.restore();return}
  const im=(B.hurt>0&&hzPic('boss_'+B.sid+'_hurt'))||hzPic('boss_'+B.sid),s=B.s;g.save();g.translate(B.x,B.y);
  // saucer + jets
  g.fillStyle='#b8acdf';g.strokeStyle='#201c24';g.lineWidth=3;g.beginPath();g.ellipse(0,s*.42,s*.62,s*.16,0,0,7);g.fill();g.stroke();
  for(let i=-2;i<=2;i++){g.fillStyle=`hsl(${(T*200+i*60)%360},90%,65%)`;g.beginPath();g.arc(i*s*.24,s*.44,s*.04,0,7);g.fill()}
  for(const d of [-1,1]){const fl=1+Math.sin(T*30+d)*.15;g.fillStyle='rgba(255,180,60,.85)';g.beginPath();g.moveTo(d*s*.38-s*.06,s*.55);g.quadraticCurveTo(d*s*.38,s*(.8+.15*fl),d*s*.38+s*.06,s*.55);g.fill()}
  if(im){const w=s*.95,h=w*im.naturalHeight/im.naturalWidth;g.drawImage(im,-w/2,s*.4-h,w,h)}else{g.fillStyle='#6b2fd6';g.beginPath();g.arc(0,0,s*.35,0,7);g.fill()}
  // the glass helmet
  const gr=g.createRadialGradient(-s*.18,-s*.2,s*.05,0,0,s*.6);gr.addColorStop(0,'rgba(255,255,255,.35)');gr.addColorStop(.6,'rgba(180,220,255,.08)');gr.addColorStop(1,'rgba(160,210,255,.35)');g.fillStyle=gr;g.beginPath();g.arc(0,-s*.02,s*.56,0,7);g.fill();
  g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=3;g.beginPath();g.arc(0,-s*.02,s*.56,0,7);g.stroke();g.lineWidth=5;g.strokeStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(0,-s*.02,s*.44,-2.5,-1.8);g.stroke();
  if(B.hurt>0){g.globalCompositeOperation='lighter';g.globalAlpha=B.hurt*3;g.fillStyle='#fff';g.beginPath();g.arc(0,-s*.02,s*.56,0,7);g.fill()}
  g.restore()}
/* enemy shots + rocks as pictures (Tzach, Oct 27: 'graphics for everything that flies at you'): sp_eb_<zap|goo|fire|star> for the monsters' shots,
   sp_eb_<sid> for that world's big helper (else the generic one), sp_rock_<sid> / sp_rock_1..3 for rocks. Code shapes until the art exists. */
const SP_EBK={'#ff5ad0':'zap','#ff8a3d':'fire','#ffd23f':'star'};
// per-world art is drawn per BASE world (graphics: farmN/farmS use sp_eb_farm / sp_rock_farm); own-sid art wins when it exists
function spWArt(pre,sid){if(!sid)return null;if(SP_ART.includes(pre+sid))return pre+sid;const b=sid.replace(/[NS]$/,'');return SP_ART.includes(pre+b)?pre+b:null}
function spEbPic(g,G,b){const k=b.goo?'goo':SP_EBK[b.c]||'zap',n=(b.bs&&spWArt('sp_eb_',G.sid))||'sp_eb_'+k;if(!SP_ART.includes(n))return false;const im=hzPic(n);if(!im)return false;
  const S=b.r*4.2,a=Math.atan2(b.vy,b.vx)-Math.PI/2;g.save();g.translate(b.x,b.y);g.rotate(k==='star'?(G.el||0)*6:a);g.drawImage(im,-S/2,-S/2*im.height/im.width,S,S*im.height/im.width);g.restore();return true}
function spRockPic(g,e){const n=spWArt('sp_rock_',SPG&&SPG.sid)||'sp_rock_'+(1+(e.pts.length%3));if(!SP_ART.includes(n))return false;const im=hzPic(n);if(!im)return false;
  const S=e.r*2.3;g.save();g.translate(e.x,e.y);g.rotate(e.rot);if(e.hit>0)g.globalAlpha=.75;g.drawImage(im,-S/2,-S/2,S,S);g.restore();return true}
function spRock(g,e){if(spRockPic(g,e))return;g.save();g.translate(e.x,e.y);g.rotate(e.rot);g.fillStyle=e.hit>0?'#d8c8b8':'#8a7a6e';g.strokeStyle='#201c24';g.lineWidth=3;g.beginPath();e.pts.forEach((p,i)=>{const a=i/e.pts.length*6.283;g.lineTo(Math.cos(a)*e.r*p,Math.sin(a)*e.r*p)});g.closePath();g.fill();g.stroke();
  g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.arc(e.r*.25,-e.r*.2,e.r*.22,0,7);g.arc(-e.r*.3,e.r*.25,e.r*.15,0,7);g.fill();g.restore()}
// starfield background (3 layers) + a slow planet
function spSky(G,g,dt){const W=G.W,H=G.H;if(!G.stars){G.stars=[];for(let i=0;i<110;i++)G.stars.push({x:Math.random()*W,y:Math.random()*H,z:1+Math.floor(Math.random()*3)})}
  const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#0b0726');gr.addColorStop(.6,'#1b0f4a');gr.addColorStop(1,'#2a1260');g.fillStyle=gr;g.fillRect(0,0,W,H);
  // the world seen from straight above (sp_bg_<sid>, a seamless vertical tile from the graphics department); until it exists, the world's side picture under a dark veil
  const top=G.sid&&SP_ART.includes('sp_bg_'+G.sid),wim=G.sid&&W>20&&hzPic((top?'sp_bg_':'w3b_')+G.sid);if(wim&&wim.naturalWidth){// flying over this world: its picture scrolls down, mirrored every other copy so the seams match
    const w=W,h=w*wim.naturalHeight/wim.naturalWidth;G.wy=((G.wy||0)+dt*W*(top?.14:.06))%(2*h);for(let y=G.wy-2*h;y<H;y+=h){const i=Math.round((y-G.wy)/h);g.save();if(i%2&&!top){g.translate(0,y+h);g.scale(1,-1);g.drawImage(wim,0,0,w,h)}else g.drawImage(wim,0,y,w,h);g.restore()}
    g.fillStyle=top?'rgba(11,7,38,.12)':'rgba(11,7,38,.5)';g.fillRect(0,0,W,H);return top?void 0:spSkyStars(G,g,dt)}
  const nb=g.createRadialGradient(W*.75,H*.3,10,W*.75,H*.3,W*.7);nb.addColorStop(0,'rgba(255,90,200,.18)');nb.addColorStop(1,'rgba(255,90,200,0)');g.fillStyle=nb;g.fillRect(0,0,W,H);
  G.plY=(G.plY==null?-W*.3:G.plY)+dt*8;if(G.plY>H+W*.4)G.plY=-W*.5;{const px=W*.18,py=G.plY,r=W*.16;const pg=g.createRadialGradient(px-r*.3,py-r*.3,r*.1,px,py,r);pg.addColorStop(0,'#ffb98a');pg.addColorStop(1,'#a04a8a');g.fillStyle=pg;g.beginPath();g.arc(px,py,r,0,7);g.fill();
    g.strokeStyle='rgba(255,220,180,.55)';g.lineWidth=4;g.beginPath();g.ellipse(px,py,r*1.6,r*.35,-.3,0,7);g.stroke()}
  spSkyStars(G,g,dt)}
function spSkyStars(G,g,dt){const W=G.W,H=G.H;for(const s of G.stars){s.y+=dt*s.z*s.z*22;if(s.y>H){s.y=-2;s.x=Math.random()*W}g.globalAlpha=.35+s.z*.2;g.fillStyle='#fff';g.fillRect(s.x,s.y,s.z*.9,s.z*.9+(s.z===3?dt*60:0))}g.globalAlpha=1}

/* ---------- the layer ---------- */
let SPEL=null,SPG=null,SPH=null;const SPV={sel:null};
function spRoot(){if(!SPEL){SPEL=document.createElement('div');SPEL.id='ship';SPEL.hidden=true;document.body.appendChild(SPEL)}return SPEL}
function openShip(){audio();try{startMusic()}catch(e){}sfx.click();if(!spOpen()){spLockPop();return}const r=spRoot();r.hidden=false;spHub()}
function closeShip(){spStop();spHubStop();if(SPEL)SPEL.hidden=true;updateWalletUI();if(state==='space')toTitle();else if(state==='title')updateLobby()}
// a space level: the tower game steps aside (state 'space') and the shooter takes the screen
function spEnter(k){audio();try{hideOverlay();showHud(false);document.getElementById('map').hidden=true;document.getElementById('title').hidden=true}catch(e){}
  mode='levels';level=spLvOf(k);state='space';SPV.sel=k;spRoot().hidden=false;spStart(k)}
function spPlay(k){spEnter(k)}
// leave a space level: back to the map (then optionally the next step, e.g. the boss's level card)
function spExit(then){spStop();spHubStop();if(SPEL)SPEL.hidden=true;updateWalletUI();openMap();if(then)setTimeout(then,60)}
{const _sl=startLevel;startLevel=function(lv){const L=lv||level;if(mode==='levels'&&spIsLv(L)){spEnter(spK(L));return}return _sl.apply(this,arguments)}}
function spLockPop(){sfx.locked();const m=document.createElement('div');m.className='sp-pop';
  m.innerHTML=`<div class="sp-pz"><canvas width="240" height="240"></canvas><h3></h3><p></p><small></small><button class="btn primary"><span></span></button></div>`;
  m.querySelector('h3').textContent=t('spLockT');m.querySelector('p').textContent=t('spLockP',{n:SP_OPEN});m.querySelector('small').textContent=t('spLockNow',{n:Math.min(progress.unlocked||1,TOTAL)});
  m.querySelector('button span').textContent=t('spOk');m.querySelector('button').onclick=()=>{sfx.click();m.remove()};m.onclick=e=>{if(e.target===m)m.remove()};
  const c=m.querySelector('canvas'),g=c.getContext('2d');g.filter&&CANVAS_FILTER_OK()&&(g.filter='grayscale(.6)');spDrawShip(g,120,130,70,{t:0,flame:.4});document.body.appendChild(m)}
function CANVAS_FILTER_OK(){return typeof CANVAS_FILTER==='undefined'||!!CANVAS_FILTER}
function spHubStop(){if(SPH){SPH.dead=true;cancelAnimationFrame(SPH.raf);if(SPH.off)SPH.off();SPH=null}}
function spSelMax(){let k=0;while(k+1<SP_N&&(progress.unlocked||1)>=SP_LVS[k+1])k++;return k}// the newest space level the player really reached (DEV_OPEN opens all, but starts here)
function spHub(){spStop();spHubStop();const r=spRoot(),D=spD();r.className='sp-hub';const nw=spCheckEarn();
  if(SPV.sel==null||SPV.sel>spSelMax())SPV.sel=spSelMax();
  r.innerHTML=`<div class="sp-top"><button class="x-btn sp-x" aria-label="close"></button><div class="sp-title"></div><div class="coin-pill">${coinImg()}<span></span></div></div>
  <div class="sp-scroll"><div class="sp-hangar"><canvas></canvas><div class="sp-charlie" hidden><img alt=""><span class="sp-say"></span></div><div class="sp-launch"><div class="sp-secname"><b></b><small></small></div><button class="btn primary sp-go"><svg viewBox="0 0 24 24"><path d="M7 4.5 L19 12 L7 19.5 Z"/></svg><span></span></button></div></div>
  <h4 class="sp-h"></h4><div class="sp-secs"></div><h4 class="sp-h"></h4><div class="sp-ups"></div><h4 class="sp-h gold"></h4><p class="sp-note"></p><div class="sp-earn"></div></div>`;
  r.querySelector('.sp-title').textContent=t('spName');r.querySelector('.coin-pill span').textContent=progress.coins;const x=r.querySelector('.sp-x');x.innerHTML=XSVG;x.onclick=()=>{sfx.click();closeShip()};
  const hs=r.querySelectorAll('.sp-h');hs[0].textContent=t('spSectors');hs[1].textContent=t('spUps');hs[2].textContent=t('spEarn');r.querySelector('.sp-note').textContent=t('spEarnNote');
  // Charlie: waits for his art (Tzach will bring his look)
  const go=r.querySelector('.sp-go');go.querySelector('span').textContent=t('spLaunch');go.onclick=()=>{sfx.click();spPlay(SPV.sel)};
  spSecInfo();
  // sectors strip
  const S=r.querySelector('.sp-secs');for(let k=0;k<SP_N;k++){const b=document.createElement('button'),open=spReached(k),st=spSt(k);b.className='sp-sec'+(open?'':' lock')+(k===SPV.sel?' on':'');
    b.innerHTML=`<span class="n">${spLvOf(k)}</span><img src="art/boss_${spSid(k)}.webp" alt="" loading="lazy"><span class="st">${[0,1,2].map(i=>`<i class="${i<st?'on':''}"></i>`).join('')}</span>`;b.setAttribute('aria-label',t('spSector',{n:spLvOf(k)}));
    b.onclick=()=>{if(!open){sfx.locked();popupToast(t('spLocked',{n:spLvOf(k)}));return}sfx.click();SPV.sel=k;S.querySelectorAll('.sp-sec').forEach((e,i)=>e.classList.toggle('on',i===k));spSecInfo()};S.appendChild(b)}
  requestAnimationFrame(()=>{const on=S.querySelector('.sp-sec.on');if(on)S.scrollLeft=on.offsetLeft-S.clientWidth/2+on.offsetWidth/2});
  spUpsRender();spEarnRender(nw);
  // hangar canvas: the ship idles
  const c=r.querySelector('.sp-hangar canvas'),g=c.getContext('2d'),H={dead:false,t:0,last:performance.now()};SPH=H;
  const fit=()=>{const d=Math.min(2,devicePixelRatio||1),b=c.getBoundingClientRect();H.W=b.width;H.H=b.height;c.width=Math.round(b.width*d);c.height=Math.round(b.height*d);H.d=d;const l=r.querySelector('.sp-launch');H.bot=l?l.offsetHeight+12:80};fit();addEventListener('resize',fit);H.off=()=>removeEventListener('resize',fit);
  const loop=now=>{if(H.dead)return;const dt=Math.min(.05,(now-H.last)/1000);H.last=now;H.t+=dt;if(!H.W)fit();g.setTransform(H.d,0,0,H.d,0,0);
    // the hangar picture (cover fit, its landing pad at 58% / 75%), else the starfield
    const hg=SP_ART.includes('sp_hangar')&&hzPic('sp_hangar');let px=H.W/2,py=H.H*.5;
    let R=null;if(hg){const k=Math.max(H.W/hg.naturalWidth,H.H/hg.naturalHeight),iw=hg.naturalWidth*k,ih=hg.naturalHeight*k,ix=(H.W-iw)/2,iy=Math.min(0,Math.max(H.H-ih,(H.H-H.bot)-ih*.8));g.drawImage(hg,ix,iy,iw,ih);R={x:ix,y:iy,w:iw,h:ih};if(ih/iw<1.2)R=null,px=ix+iw*.58,py=Math.min(H.H*.62,iy+ih*.75-H.H*.16)}else spSky(H,g,dt*.4);
    spGarage(g,H,px,py,dt,R);H.raf=requestAnimationFrame(loop)};H.raf=requestAnimationFrame(loop)}
/* GARAGE SCENE (Tzach, Oct 27 08:56): a long shot of the workshop. The ship (it shows every upgrade you bought) stands big on the pad,
   Charlie the garage boss sits small at its foot and works on it (art/sp_charlie_1..3 = work frames, else sp_charlie; Tzach's own character,
   drawn by the graphics department from his drawings in /mnt/project-files/game/space-shooter/charlie-ref/), and the player's own Sharliz
   floats around him. Buying an upgrade = sparks + a flash on the ship (H.up). */
function spGarage(g,H,px,py,dt,R){const ch=['sp_charlie_1','sp_charlie_2','sp_charlie_3'].filter(n=>SP_ART.includes(n)),one=SP_ART.includes('sp_charlie'),hasC=ch.length||one;
  // R = the garage picture's rect: the ship stands on its pad (x .65, y .69), Charlie sits left of it on the floor (feet at y .75), close enough to reach the hull
  let s,sx,sy,fx,fy;if(R){s=R.w*.2;sx=R.x+R.w*.65;sy=R.y+R.h*.69-s*.62;fx=R.x+R.w*.385;fy=R.y+R.h*.752}
  else{s=Math.min(H.W*(hasC?.24:.2),H.H*(hasC?.36:.32));sx=px+(hasC?H.W*.08:0);sy=py;fx=sx-s*1.15;fy=sy+s*.6}
  sy+=Math.sin(H.t*1.1)*2;
  spDrawShip(g,sx,sy,s,spShipLook(H.t,{tilt:Math.sin(H.t*.5)*.06,shield:spHas('xmasShield')?1:0,flame:.12}));
  if(H.up>0){H.up-=dt;const k=Math.max(0,H.up);g.save();g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(sx,sy,0,sx,sy,s*1.6);gr.addColorStop(0,`rgba(255,240,170,${.55*k})`);gr.addColorStop(1,'rgba(255,240,170,0)');g.fillStyle=gr;g.fillRect(sx-s*2,sy-s*2,s*4,s*4);
    for(let i=0;i<14;i++){const a=i*2.4+H.t*3,r=s*(.3+(1-k)*1.3);g.fillStyle=i%2?'#ffd23f':'#fff';g.globalAlpha=k;g.beginPath();g.arc(sx+Math.cos(a)*r,sy+Math.sin(a)*r*.8,s*.035,0,7);g.fill()}g.restore()}
  const cw=R?R.w*.3:s*.95;// Charlie's picture width (600x700 canvas)
  // the room comes alive only now and then (Tzach, Oct 27 09:28): a work burst every P s, calm in between. H.at = 'animation time' that runs
  // at full speed in a burst and almost stops between bursts (eased), so the Sharliz/drones slow down instead of jumping
  const nb=spQ().length,P=nb?8:13,B=nb?3.4:2.6;H.bt=(H.bt==null?P-1.2:H.bt)+dt;const burst=H.bt%P<B,bv=burst?1:.07;H.v=(H.v==null?bv:H.v)+(bv-(H.v==null?bv:H.v))*Math.min(1,dt*2.5);H.at=(H.at||0)+dt*H.v;
  // the player's Sharliz floats around the room above Charlie, a slow lazy loop
  const a=H.at*.55,depth=Math.sin(a*1.3),hx=fx-cw*.3+Math.cos(a)*cw*.45,hy=fy-cw*1.32+Math.sin(a*1.3)*cw*.14+Math.sin(H.t*2.1)*cw*.05,hs=cw*(.42+.04*depth);
  H.hx=hx;H.hy=hy;H.hs=hs;const hero=()=>{try{const h=spHero();withCtx(g,hs,()=>drawSharliz(h,hx,hy,-Math.sin(a)*.14,'happy',{x:Math.cos(a)>0?.5:-.5,y:.2},0))}catch(e){}};
  if(depth<0)hero();
  // Charlie works: wrench up / on the bolt, and every few hits he wipes his forehead; each hit = a small squash + sparks off the hull at the wrench
  // building (progress.ship.q): repair drones circle the ship and weld it, one per build; idle: Charlie rests and wipes his forehead now and then
  for(let i=0;i<nb;i++){const a2=H.at*(.9+i*.25)+i*Math.PI,dx=sx+Math.cos(a2)*s*1.05,dy=sy-s*.15+Math.sin(a2)*s*.45,front=Math.sin(a2)>0,tx=sx+Math.cos(a2)*s*.32,ty=sy-s*.1+Math.sin(a2)*s*.25;
    const wk=burst&&(H.t*2+i*.5)%1<.55;if(wk){g.save();g.globalCompositeOperation='lighter';g.strokeStyle='rgba(140,240,255,.85)';g.lineWidth=2;g.beginPath();g.moveTo(dx,dy);g.lineTo(tx,ty);g.stroke();g.restore();
      H['wt'+i]=(H['wt'+i]||0)+dt;if(H['wt'+i]>.12){H['wt'+i]=0;spGSparks(H,tx,ty,s*.35)}}
    spDrone(g,dx,dy+Math.sin(H.t*4+i)*2,s*.13)}
  const SEQ=nb?[0,1,0,1,0,1,0,1,2,2]:[0,0,2,2,2],fr=Math.floor((H.bt%P)*(nb?3.2:2)),f=!burst?0:ch.length>=3?SEQ[fr%SEQ.length]:fr%Math.max(1,ch.length),hit=nb&&f===1;
  if(fr!==H.fr){H.fr=fr;if(hit){spGSparks(H,fx+cw*.18,fy-cw*.62*(700/600)*.66,cw*.5);if(sfx.ok&&sfx.ok()&&!H.mute)tone({f:1900+Math.random()*500,f2:900,d:.05,type:'square',v:.01})}}
  if(hasC){const n=ch.length?ch[f]:'sp_charlie',im=hzPic(n);if(im){const w=cw,h=w*im.naturalHeight/im.naturalWidth,q=hit?1-.035*Math.max(0,1-((H.bt%P)*3.2-fr)*2):1;
    g.save();g.fillStyle='rgba(18,13,43,.35)';g.beginPath();g.ellipse(fx,fy,w*.3,w*.05,0,0,7);g.fill();g.translate(fx,fy);g.scale(2-q,q);g.drawImage(im,-w/2,-h,w,h);g.restore()}}
  spGSparkDraw(g,H,dt);
  if(depth>=0)hero()}
// welding sparks from the ship (fixed pattern, nothing random needed for gameplay; Math.random only for the look)
function spGSparks(H,x,y,s){H.sk=H.sk||[];for(let i=0;i<12;i++){const a=-Math.PI*(.15+Math.random()*.7),v=s*(1.2+Math.random()*1.6);H.sk.push({x,y,vx:Math.cos(a)*v*(Math.random()<.5?-1:1),vy:Math.sin(a)*v,l:.35+Math.random()*.35,t:0})}
  H.flash=.12}
function spGSparkDraw(g,H,dt){if(!H.sk||!H.sk.length&&!(H.flash>0))return;g.save();g.globalCompositeOperation='lighter';g.lineCap='round';
  for(const p of H.sk){p.t+=dt;p.vy+=900*dt*.35;const ox=p.x,oy=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;const k=1-p.t/p.l;if(k<=0)continue;
    g.strokeStyle=`rgba(255,${180+Math.round(60*k)},${Math.round(90*k)},${k})`;g.lineWidth=1.6+1.6*k;g.beginPath();g.moveTo(ox-(p.x-ox)*1.5,oy-(p.y-oy)*1.5);g.lineTo(p.x,p.y);g.stroke()}
  H.sk=H.sk.filter(p=>p.t<p.l);
  if(H.flash>0&&H.sk.length){H.flash-=dt;const p=H.sk[0],r=26;const gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,r);gr.addColorStop(0,'rgba(255,240,200,.8)');gr.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=gr;g.fillRect(p.x-r,p.y-r,r*2,r*2)}
  g.restore()}
function spShipLook(T,o){return Object.assign({t:T,gun:spShipG(spLv('gun')),hull:spLv('hull'),mag:spLv('mag'),gold:spHas('gold'),drones:spHas('drones'),rainbow:spHas('rainbow'),pod:spHas('pod')},o||{})}
function spSecInfo(){const r=SPEL;if(!r)return;const k=SPV.sel;r.querySelector('.sp-secname b').textContent=t('spSector',{n:spLvOf(k)});r.querySelector('.sp-secname small').textContent=t(ZONES[Math.floor((spLvOf(k)-1)/LPZ)].key)}
function spUpsRender(){const r=SPEL,U=r.querySelector('.sp-ups');U.innerHTML='';
  SP_UP.forEach(([id,max,ic,pr])=>{const L=spLv(id),c=document.createElement('div');c.className='sp-up';
    c.innerHTML=`<span class="ic"><img src="art/${ic}.webp" alt=""></span><span class="tx"><b></b><small></small><span class="pips">${Array.from({length:max},(_,i)=>`<i class="${i<L?'on':''}"></i>`).join('')}</span></span><button class="btn"></button>`;
    c.querySelector('b').textContent=t('up_'+id);c.querySelector('small').textContent=t('ud_'+id);const b=c.querySelector('button');
    if(L>=max){b.textContent=t('spMax');b.disabled=true;b.className='btn sp-max'}else{const p=pr[L];b.innerHTML=`${coinImg()}<em>${p.toLocaleString()}</em>`;b.className='btn primary'+((progress.coins||0)<p?' poor':'');
      b.onclick=()=>{if((progress.coins||0)<p){sfx.locked();popupToast(t('needCoins'));return}if(!spJobStart(id,L+1)){sfx.locked();noteToast(t('spSlots'));return}progress.coins-=p;if(SPH)SPH.up=1.2;saveProgress();updateWalletUI();sfx.flourish&&sfx.flourish(3);r.querySelector('.coin-pill span').textContent=progress.coins;spUpsRender();
        const n=r.querySelectorAll('.sp-up')[SP_UP.findIndex(u=>u[0]===id)];if(n){n.classList.add('pop');}}}
    U.appendChild(c)})}
function spEarnRender(nw){const r=SPEL,E=r.querySelector('.sp-earn');E.innerHTML='';
  SP_EARN.forEach(id=>{const own=spHas(id),p=spEarnProg(id),c=document.createElement('div');c.className='sp-er'+(own?' got':'')+((nw||[]).includes(id)?' new':'');
    c.innerHTML=`<span class="ic">${SP_EIC[id]==='svg'?SP_DRONE:`<img src="art/${SP_EIC[id]}.webp" alt="">`}<i class="lk">🔒</i></span><span class="tx"><b></b><small class="ef"></small><small class="hw"></small>${!own&&p?`<span class="bar"><i style="width:${Math.round(100*p.a/p.b)}%"></i><em></em></span>`:''}</span>${own?'<span class="ok">✓</span>':''}`;
    c.querySelector('b').textContent=t('er_'+id);c.querySelector('.ef').textContent=t('ed_'+id);c.querySelector('.hw').textContent=own?t('spYours'):t('eh_'+id);if(!own&&p)c.querySelector('.bar em').textContent=t('spProg',{a:p.a,b:p.b});E.appendChild(c)});
  if(nw&&nw.length){popupToast(t('spNew'));sfx.flourish&&sfx.flourish(3)}}

/* ---------- the flight ---------- */
function spStop(){if(SPG){SPG.dead=true;cancelAnimationFrame(SPG.raf);if(SPG.off)SPG.off();SPG=null}}
// difficulty grows with every space level (by its own count, so adding later seasons never makes the early ones easier): T 0 at level 89, 1 at 299, up to 1.5 later
// Oct 27 10:04 Tzach: 'now it is too hard' -> ~25% easier: fewer/slower enemy shots, less enemy HP, longer blink after a hit, smaller hit box
const spTier=k=>Math.min(1.5,k/21);
// Tzach (Oct 27): 'with the upgrades I beat it in a moment' -> the enemies grow with your ship: every bought upgrade level adds to the tier (shots, speed, aim),
// and enemy/boss hit points scale with your firepower (shots x damage x fire rate), so upgrades make it fun and fast, not trivial
const spUpT=()=>Math.min(.9,.05*(spLv('gun')/3+spLv('rate')+spLv('hull')+spLv('mag')));
const spShipG=L=>Math.min(5,Math.floor(L/7));// ship picture g0..g5 across the 40 gun steps
function spPower(){const [n,d]=spGunPat(spLv('gun')+(spHas('rainbow')?1:0));return n*d*(1+.14*spLv('rate'))*(spHas('laser')?1.3:1)}
// longer too (Tzach): 4 waves at level 89, one more every 3 space levels, up to 10 waves; then the boss's big helper
function spWaves(k){const T=spTier(k)+spUpT(),R=Math.min(5,3+Math.floor(T*2)),X=Math.min(6,Math.floor(k/3)),M=T>.5?2:1,
    EX=[{f:'swoop',n:10+Math.floor(T*8),mini:1},{f:'rocks',n:9+Math.floor(T*8),form:{rows:3,cols:5}},{f:'form',rows:R,cols:6,fire:1.5,mini:M},{f:'swoop',n:12+Math.floor(T*8),mini:M},{f:'rocks',n:12+Math.floor(T*8),form:{rows:R,cols:6}},{f:'form',rows:4,cols:6,fire:1.7,mini:2}];
  return[{f:'form',rows:Math.min(4,2+Math.floor(T*2)),cols:5},{f:'swoop',n:8+Math.floor(T*8),mini:1},{f:'rocks',n:7+Math.floor(T*8),form:{rows:2,cols:5}},...EX.slice(0,X),{f:'form',rows:R,cols:6,fire:1.4,mini:M},{f:'boss'}]}
function spStart(k){spHubStop();spStop();const r=spRoot(),D=spD();r.className='sp-game';
  r.innerHTML=`<div class="sp-bar"><button class="x-btn sp-pz-btn" aria-label="pause"><svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg></button><div class="sp-hearts"></div><div class="sp-wave"></div><div class="arc-score sp-coins">${coinImg()}<b>0</b></div></div><div class="sp-stage"><canvas></canvas><div class="sp-bhp" hidden><img alt=""><span><i></i></span></div></div>`;
  const st=r.querySelector('.sp-stage'),c=st.querySelector('canvas'),g=c.getContext('2d');
  const hearts=3+spLv('hull')+(spHas('gold')?1:0);
  const G=SPG={k,r,st,c,g,dead:false,run:false,over:false,el:0,last:performance.now(),waves:spWaves(k),wi:-1,en:[],bul:[],eb:[],drops:[],fx:[],txt:[],
    hearts,maxH:hearts,lost:0,inv:0,shield:spHas('xmasShield')?2:0,pod:spHas('pod'),pw:spHas('rainbow')?1:0,kills:0,coins:0,fireT:0,droneT:0,shake:0,boss:null,T:spTier(k)+spUpT(),pf:spPower(),L:spLvOf(k),sid:spSid(k),pause:false,banner:null};
  const fit=()=>{const d=Math.min(2,devicePixelRatio||1),b=st.getBoundingClientRect();G.W=b.width;G.H=b.height;c.width=Math.round(b.width*d);c.height=Math.round(b.height*d);c.style.width=b.width+'px';c.style.height=b.height+'px';G.d=d;G.u=Math.min(G.W,G.H*.6);G.s=G.u*.11;G.stars=null};
  fit();G.sx=G.tx=G.W/2;G.sy=G.ty=G.H*.82;G.tilt=0;
  // drag anywhere: the ship keeps its distance from the finger (so the finger never hides it)
  let grab=null;const pos=e=>{const b=c.getBoundingClientRect();return{x:e.clientX-b.left,y:e.clientY-b.top}};
  c.addEventListener('pointerdown',e=>{if(G.pause)return;const p=pos(e);grab={dx:G.tx-p.x,dy:G.ty-p.y};if(Math.hypot(grab.dx,grab.dy)>G.u*.35)grab={dx:0,dy:-G.s*2.2};G.tx=clamp(p.x+grab.dx,G.s,G.W-G.s);G.ty=clamp(p.y+grab.dy,G.H*.35,G.H-G.s*1.3);c.setPointerCapture&&c.setPointerCapture(e.pointerId);G.touched=1});
  c.addEventListener('pointermove',e=>{if(!grab||G.pause)return;const p=pos(e);G.tx=clamp(p.x+grab.dx,G.s,G.W-G.s);G.ty=clamp(p.y+grab.dy,G.H*.35,G.H-G.s*1.3)});
  const up=()=>{grab=null};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
  addEventListener('resize',fit);G.off=()=>removeEventListener('resize',fit);
  r.querySelector('.sp-pz-btn').onclick=()=>{sfx.click();spPause(G)};
  spHUD(G);spBanner(G,t('spSector',{n:spLvOf(k)}),t('spHowTo'),2.2);setTimeout(()=>{if(!G.dead&&G.wi<0){G.run=true;spNextWave(G)}},1600);
  const loop=now=>{if(G.dead)return;let raw=(now-G.last)/1000;G.last=now;if(document.hidden||G.pause)raw=0;let rem=Math.min(.25,raw);
    do{const d=Math.min(.033,rem);rem-=d;spTick(G,d)}while(rem>1e-6&&!G.over);spDraw(G);if(!G.dead)G.raf=requestAnimationFrame(loop)};G.raf=requestAnimationFrame(loop)}
function spPause(G){if(G.over)return;G.pause=true;const p=document.createElement('div');p.className='arc-end sp-pause';
  p.innerHTML=`<div class="arc-panel"><div class="ar-title"></div><div class="ar-acts"><button class="btn primary sp-res"><span></span></button><button class="btn sp-lv"><span></span></button></div></div>`;
  p.querySelector('.ar-title').textContent=t('spPause');p.querySelector('.sp-res span').textContent=t('spResume');p.querySelector('.sp-lv span').textContent=t('spLeave');
  p.querySelector('.sp-res').onclick=()=>{sfx.click();p.remove();G.pause=false;G.last=performance.now()};p.querySelector('.sp-lv').onclick=()=>{sfx.click();spExit()};G.r.appendChild(p)}
function spBanner(G,a,b,dur){const o=G.r.querySelector('.sp-ban');if(o)o.remove();const d=document.createElement('div');d.className='sp-ban';d.innerHTML='<b></b><small></small>';d.querySelector('b').textContent=a;d.querySelector('small').textContent=b||'';G.st.appendChild(d);setTimeout(()=>d.remove(),(dur||1.6)*1000)}
function spHUD(G){const r=G.r,h=r.querySelector('.sp-hearts');let s='';for(let i=0;i<G.maxH;i++)s+=`<img class="${i<G.hearts?'':'off'}" src="art/ic_heart.webp" alt="">`;if(h.dataset.k!==s){h.dataset.k=s;h.innerHTML=s}
  r.querySelector('.sp-coins b').textContent=G.coins;const w=G.waves[G.wi],wv=r.querySelector('.sp-wave'),txt=w&&w.f==='boss'?t('spBossW'):t('spWave',{a:Math.max(1,G.wi+1),b:G.endless?'∞':G.waves.length-1});if(wv.textContent!==txt)wv.textContent=txt;wv.classList.toggle('boss',!!(w&&w.f==='boss'))}
function spMon(G,k,x,y,o){const T=G.T,kind=1+(k%4),hp=Math.round((1.5+T*2+(kind===4?1:0))*Math.pow(G.pf||1,.7));return Object.assign({k:'mon',pic:(SP_ART.includes('sp_mon'+kind)?'sp_mon':'arc_mon')+kind,x,y,hp,max:hp,r:G.u*.055,t:0,hit:0},o)}
// the world's mini-boss: its own picture once the graphics department draws it (sp_mini_<sid>_n), else a big minion
function spMiniBoss(G,i){const n=1+(i%2),own=SP_ART.includes('sp_mini_'+G.sid+'_'+n),hp=Math.round((12+G.T*28)*Math.pow(G.pf||1,.85));
  return{k:'mboss',pic:own?'sp_mini_'+G.sid+'_'+n:'arc_mon'+(1+(G.k+i)%4),own,x:G.W*(i%2?.75:.25),y:-60,gy:G.H*(.14+.06*i),hp,max:hp,r:G.u*.1,t:0,hit:0,ph:i*3,fireT:1.5+i*.6}}
function spNextWave(G){G.wi++;const w=G.waves[G.wi];spHUD(G);if(!w)return spWin(G);const T=G.T,W=G.W,H=G.H;G.wt=0;G.spawnQ=[];
  if(w.f==='boss'){spBanner(G,t('spBossW'),t('spHelper',{b:spBossName(G.k)}),1.8);if(sfx.ok())sfx.roar&&sfx.roar();const sid=G.sid,hp=Math.round((70+G.T*240)*Math.pow(G.pf||1,.85)),own=SP_ART.includes('sp_help_'+sid);
    G.boss={sid,own,x:W/2,y:-G.u*.4,s:G.u*(own?.4:.32),hp,max:hp,t:0,atk:1.6,pat:0,hurt:0,in:1};const bh=G.r.querySelector('.sp-bhp');bh.hidden=false;bh.querySelector('img').src='art/'+(own?'sp_help_':'boss_')+sid+'.webp';return}
  spBanner(G,t('spWave',{a:G.wi+1,b:G.endless?'∞':G.waves.length-1}),'',1.2);
  const form=f=>{const cw=Math.min(W*.8/f.cols,G.u*.15),x0=W/2-cw*(f.cols-1)/2;G.form={ox:0,t:0,fire:(.3+T*.85)*(f.fire||1)};
    for(let rr=0;rr<f.rows;rr++)for(let cc=0;cc<f.cols;cc++){const m=spMon(G,rr+cc,x0+cc*cw,-40-rr*40,{f:1,gx:x0+cc*cw,gy:H*.1+rr*cw*.85+G.u*.05,enter:.4+cc*.06+rr*.15});G.en.push(m)}};
  if(w.mini)for(let i=0;i<w.mini;i++)G.spawnQ.push({at:1.2+i*2.5,mk:()=>{spBanner(G,t('spMini'),'',1);if(sfx.ok())tone({f:180,f2:90,d:.4,type:'sawtooth',v:.05});return spMiniBoss(G,i)}});
  if(w.f==='form')form(w);
  else if(w.f==='swoop'){for(let i=0;i<w.n;i++){const side=i%2?1:-1;G.spawnQ.push({at:.4+i*.45,mk:()=>spMon(G,i,side<0?W*.2:W*.8,-40,{sw:1,side,amp:W*(.25+.1*Math.sin(i)),cx:W/2,vy:G.u*(.28+T*.2),ph:i,fireT:1+Math.random()*2})})}}
  else if(w.f==='rocks'){for(let i=0;i<w.n;i++)G.spawnQ.push({at:.3+i*.55,mk:()=>{const r=G.u*(.05+Math.random()*.04);return{k:'rock',x:r+Math.random()*(W-2*r),y:-r*2,vy:G.u*(.25+Math.random()*.2+T*.15),vx:(Math.random()-.5)*G.u*.15,r,hp:Math.round((3+T*3)*Math.pow(G.pf||1,.6)),rot:0,vr:(Math.random()-.5)*3,pts:Array.from({length:9},()=>.78+Math.random()*.3),hit:0}}});
    if(w.form)G.spawnQ.push({at:.3+w.n*.55,fn:()=>form(w.form)})}}
function spGunPat(L){return[[1,1],[2,1],[3,1],[3,1.3],[4,1.3],[5,1.3],[5,1.6],[7,1.6]][Math.min(7,L)]}
// shot looks grow with power (Tzach: 'evolve into lasers, fire...'): 1 yellow bolt, 2 orange plasma, 3 cyan laser, 4 pink laser, 5 fireball, 6 rainbow lightning
const SP_TIER=[1,2,2,3,4,5,5,6],SP_TC=[null,['#fff6a8','#ffd23f'],['#ffe0a0','#ff8a3d'],['#e8ffff','#4ee6ff'],['#ffe6f6','#ff4fb8'],['#fff2b0','#ff5a1f'],['#ffffff','#b36bff']];
let spTierOf=L=>Math.max(SP_TIER[Math.min(7,L)],spHas('laser')?3:1);
function spShoot(G){const L=spLv('gun')+G.pw,[n,dmg]=spGunPat(L),v=G.u*1.6,x=G.sx,y=G.sy-G.s*.9,pr=spHas('laser')?2:0,tr=spTierOf(L);G.flash=.08;G.ftier=tr;
  for(let i=0;i<n;i++){const off=i-(n-1)/2,par=n===2||(n===4&&Math.abs(off)<1);const a=par?0:off*.11,dx=par?off*G.s*.55:off*G.s*.2;G.bul.push({x:x+dx,y,vx:Math.sin(a)*v,vy:-Math.cos(a)*v,dmg,pierce:pr,hit:[],t:tr})}
  if(sfx.ok()&&!(G.shotN=(G.shotN||0)+1)%3)tone({f:880,f2:1300,d:.04,type:'square',v:.012})}
function spHurt(G,x,y){if(G.inv>0||G.over)return;if(G.shield>0){G.shield--;G.inv=.8;spText(G,t('spShield'),G.sx,G.sy-G.s*2,'#7ff3ff');if(sfx.ok())tone({f:1200,f2:600,d:.2,type:'triangle',v:.06});return}
  G.hearts--;G.lost++;G.inv=2;G.shake=.35;G.pw=Math.max(0,G.pw-1);vib([50,30,50]);sfx.heart();spBurst(G,G.sx,G.sy,['#ff6b7d','#ffd23f','#fff'],16);
  if(G.hearts<=0){if(G.pod){G.pod=false;G.hearts=2;G.inv=2.5;spText(G,t('spRescue'),G.sx,G.sy-G.s*2,'#7ef05a');sfx.flourish&&sfx.flourish(2)}else spLose(G)}spHUD(G)}
function spBurst(G,x,y,cols,n){for(let i=0;i<(n||10);i++)G.fx.push({x,y,vx:(Math.random()-.5)*400,vy:(Math.random()-.5)*400,life:.5+Math.random()*.3,c:pick(cols),s:2+Math.random()*4})}
function spText(G,s,x,y,c){G.txt.push({s,x,y,c:c||'#ffe24d',life:1})}
function spKill(G,e){G.kills++;spAnim(G,'sp_boom_',4,e.x,e.y,(e.r||G.u*.05)*3,.36);spBurst(G,e.x,e.y,e.k==='rock'?['#c8b8a8','#8a7a6e','#fff']:['#ffd23f','#ff8ad8','#7ff3ff','#fff'],12);if(sfx.ok())noise({d:.08,v:.05,hp:900});
  // coins: every 2nd monster, every rock; a power star after every 14 kills (fixed, nothing random)
  if(e.k==='mboss'){G.shake=.3;sfx.boom&&sfx.boom();spBurst(G,e.x,e.y,['#ffd23f','#ff8a3d','#fff'],24);G.drops.push({k:'bag',x:e.x,y:e.y,vy:G.u*.2});G.drops.push({k:'star',x:e.x,y:e.y,vy:G.u*.18});return}
  if(e.k==='rock'||G.kills%2===0)G.drops.push({k:'coin',x:e.x,y:e.y,vy:G.u*.22});if(G.kills%14===0)G.drops.push({k:'star',x:e.x,y:e.y,vy:G.u*.2})}
function spTick(G,dt){const W=G.W,H=G.H;G.el+=dt;
  // ship follows the finger
  const ox=G.sx;G.sx+=(G.tx-G.sx)*Math.min(1,dt*16);G.sy+=(G.ty-G.sy)*Math.min(1,dt*16);G.tilt+=(clamp((G.sx-ox)/(dt*500||1),-1,1)-G.tilt)*Math.min(1,dt*10);
  if(G.inv>0)G.inv-=dt;if(G.shake>0)G.shake-=dt;
  for(const a of G.anim||[])a.t+=dt;if(G.anim)G.anim=G.anim.filter(a=>a.t<a.d);G.flash=Math.max(0,(G.flash||0)-dt);
  for(const p of G.fx){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96}G.fx=G.fx.filter(p=>p.life>0);
  for(const p of G.txt){p.life-=dt;p.y-=40*dt}G.txt=G.txt.filter(p=>p.life>0);
  if(!G.run||G.over)return;
  G.fireT-=dt;const rate=.2/(1+.14*spLv('rate'));if(G.fireT<=0){G.fireT+=rate;if(G.fireT<0)G.fireT=0;spShoot(G)}
  if(spHas('drones')){G.droneT-=dt;if(G.droneT<=0){G.droneT=.32;for(const d of [-1,1])G.bul.push({x:G.sx+d*G.s*1.45,y:G.sy,vx:0,vy:-G.u*1.5,dmg:.7,pierce:0,hit:[],dr:1})}}
  // spawns
  G.wt+=dt;if(G.spawnQ)for(const q of G.spawnQ)if(!q.done&&G.wt>=q.at){q.done=1;if(q.fn)q.fn();else G.en.push(q.mk())}
  // formation sways + drops goo
  if(G.form){const F=G.form;F.t+=dt;F.ox=Math.sin(F.t*.7)*W*.09;const fm=G.en.filter(e=>e.f);
    F.cd=(F.cd==null?1.2:F.cd)-dt;if(F.cd<=0&&fm.length){F.cd=(1/F.fire)*(.6+Math.random()*.8);const e=pick(fm.filter(e=>e.enter<=0)||fm);if(e&&e.enter<=0){const aim=Math.random()<.2+.25*Math.min(1,G.T);const v=G.u*(.38+G.T*.22);
      if(aim){const dx=G.sx-e.x,dy=G.sy-e.y,L=Math.hypot(dx,dy);G.eb.push({x:e.x,y:e.y+e.r,vx:dx/L*v,vy:dy/L*v,r:G.u*.018,c:'#ff5ad0'})}else G.eb.push({x:e.x,y:e.y+e.r,vx:0,vy:v,r:G.u*.022,c:'#7ef05a',goo:1})}}}
  if(G.form){const F=G.form;F.dv=(F.dv==null?3:F.dv)-dt;if(F.dv<=0){F.dv=Math.max(1.1,3.2-G.T*1.4);const c=G.en.filter(e=>e.f&&e.enter<=0&&!e.dive);if(c.length){const e=pick(c);e.dive=1;e.f=0;const dx=G.sx-e.x,dy=G.sy-e.y,L=Math.hypot(dx,dy),v=G.u*(.55+G.T*.25);e.vx=dx/L*v;e.vy=dy/L*v;if(sfx.ok())tone({f:500,f2:200,d:.25,type:'square',v:.03})}}}
  for(const e of G.en){e.t+=dt;if(e.hit>0)e.hit-=dt;
    if(e.dive){e.x+=e.vx*dt;e.y+=e.vy*dt;e.vx+=(G.sx-e.x)*dt*.6;if(e.y>G.H+50||e.x<-60||e.x>G.W+60)e.gone=1}
    else if(e.f){if(e.enter>0){e.enter-=dt;const k=Math.min(1,dt*3.5);e.x+=(e.gx+(G.form?G.form.ox:0)-e.x)*k;e.y+=(e.gy-e.y)*k}else{e.x=e.gx+G.form.ox;e.y=e.gy+Math.sin(G.form.t*2+e.gx*.05)*5}}
    else if(e.sw){e.y+=e.vy*dt;e.x=e.cx+e.side*Math.sin(e.t*1.4+e.ph)*e.amp*.9;e.fireT-=dt;if(e.fireT<=0&&e.y>0&&e.y<H*.6){e.fireT=Math.max(1.1,2.6-G.T*.8);const dx=G.sx-e.x,dy=G.sy-e.y,L=Math.hypot(dx,dy),v=G.u*(.34+G.T*.17);G.eb.push({x:e.x,y:e.y,vx:dx/L*v,vy:dy/L*v,r:G.u*.018,c:'#ff5ad0'})}if(e.y>H+50)e.gone=1}
    else if(e.k==='rock'){e.y+=e.vy*dt;e.x+=e.vx*dt;e.rot+=e.vr*dt;if(e.y>H+60)e.gone=1}
    if(e.k==='mboss'){if(e.y<e.gy)e.y+=(e.gy-e.y+20)*Math.min(1,dt*1.5);e.x=G.W/2+Math.sin(e.t*.8+e.ph)*G.W*.3;e.fireT-=dt;
      if(e.fireT<=0&&e.y>0){e.fireT=Math.max(1,2-G.T*.45);const a0=Math.atan2(G.sy-e.y,G.sx-e.x),v=G.u*(.32+G.T*.15);for(let i=-1;i<=1;i++){const a=a0+i*.45;G.eb.push({x:e.x,y:e.y+e.r*.5,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:G.u*.02,c:'#ff8a3d'})}}}
    if(e.k==='mini'){e.y+=e.vy*dt;e.x+=Math.sin(e.t*3)*e.vx*dt;if(e.y>H+50)e.gone=1}
    if(!e.gone&&Math.hypot(e.x-G.sx,e.y-G.sy)<e.r+G.s*.6){if(G.inv<=0){spHurt(G);e.hp=0;spKill(G,e);e.gone=1}}}
  // boss
  const B=G.boss;if(B){B.t+=dt;if(B.hurt>0)B.hurt-=dt;const ph2=B.hp<B.max/2;
    if(B.in>0){B.in-=dt*.6;B.y+=(H*.2-B.y)*Math.min(1,dt*2.5)}else{B.x=W/2+Math.sin(B.t*(ph2?.95:.65))*Math.max(0,W/2-B.s*.6);B.y=H*.2+Math.sin(B.t*1.3)*G.u*.03;
      B.atk-=dt;if(B.atk<=0){B.atk=Math.max(1,(2.1-G.T*.55)*(ph2?.75:1));const p=B.pat++%4,v=G.u*(.31+G.T*.15)*(ph2?1.12:1);
        if(p===0){const a0=Math.atan2(G.sy-B.y,G.sx-B.x),n=ph2?5:3;for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*.42;G.eb.push({x:B.x,y:B.y+B.s*.3,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:G.u*.02,c:'#ff5ad0',bs:1})}}
        else if(p===1){const n=ph2?9:7,o=B.t;for(let i=0;i<n;i++){const a=o+i/n*6.283;G.eb.push({x:B.x,y:B.y,vx:Math.cos(a)*v*.8,vy:Math.sin(a)*v*.8,r:G.u*.02,c:'#ffd23f',bs:1})}}
        else if(p===2){for(let i=0;i<6;i++)G.eb.push({x:W*(.1+i*.16)+Math.random()*20,y:-10-i*30,vx:0,vy:v*.9,r:G.u*.024,c:'#7ef05a',goo:1,bs:1})}
        else if(G.en.length<4){for(let i=0;i<3;i++)G.en.push(spMon(G,i+G.k,B.x+(i-1)*B.s*.5,B.y+B.s*.3,{k:'mini',vy:G.u*(.2+G.T*.1),vx:G.u*.6,hp:1,max:1}))}
        if(sfx.ok())tone({f:220,f2:140,d:.18,type:'sawtooth',v:.04,filter:900})}}
    if(Math.hypot(B.x-G.sx,B.y-G.sy)<B.s*.45+G.s*.5)spHurt(G);
    G.r.querySelector('.sp-bhp i').style.width=Math.max(0,100*B.hp/B.max)+'%'}
  // player bullets
  for(const b of G.bul){b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.y<-20||b.x<-20||b.x>W+20){b.gone=1;continue}
    for(const e of G.en){if(e.gone||e.hp<=0||b.hit.includes(e))continue;if((e.f&&e.enter>0&&e.y<0))continue;if(Math.hypot(b.x-e.x,b.y-e.y)<e.r+(b.rad||4)){e.hp-=b.dmg;e.hit=.08;b.hit.push(e);spAnim(G,'sp_hit_',3,b.x,b.y-4,G.u*.07,.18);if(e.hp<=0){e.gone=1;spKill(G,e)}if(b.pierce--<=0){b.gone=1;break}}}
    if(!b.gone&&B&&B.in<=0&&Math.hypot(b.x-B.x,b.y-B.y)<B.s*.48+(b.rad||0)){B.hp-=b.dmg;B.hurt=.1;b.gone=1;spAnim(G,'sp_hit_',3,b.x,b.y,G.u*.08,.18);if(sfx.ok()&&Math.random()<.2)noise({d:.04,v:.03,hp:2000});if(B.hp<=0){spBossDown(G);break}}}
  G.bul=G.bul.filter(b=>!b.gone);G.en=G.en.filter(e=>!e.gone);
  // enemy shots
  const hr=G.s*.3;for(const b of G.eb){b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.y>H+20||b.y<-80||b.x<-20||b.x>W+20)b.gone=1;else if(Math.hypot(b.x-G.sx,b.y-G.sy)<b.r+hr){b.gone=1;spHurt(G)}}G.eb=G.eb.filter(b=>!b.gone);
  // drops (coin magnet)
  const mg=G.u*(.2+.1*spLv('mag'));for(const d of G.drops){const dx=G.sx-d.x,dy=G.sy-d.y,L=Math.hypot(dx,dy);if(L<mg){d.x+=dx/L*G.u*1.2*dt;d.y+=dy/L*G.u*1.2*dt}else d.y+=d.vy*dt;
    if(L<G.s*.9){d.gone=1;if(d.k==='coin'||d.k==='bag'){G.coins+=d.k==='bag'?5:1;sfx.coin(d.k==='bag'?3:1);if(d.k==='bag')spText(G,'+5',d.x,d.y-G.s,'#ffe24d')}else{/* every power star keeps powering up the gun for this flight, power and look, up to the last weapon (Tzach, Oct 27 10:34; was max +2) */const w0=spWOf(spLv('gun')+G.pw).w;G.pw=Math.min(39-spLv('gun'),G.pw+1);const o=spWOf(spLv('gun')+G.pw);spText(G,o.w!==w0?t('wpn'+(o.w+1))+'!':t('spPower'),G.sx,G.sy-G.s*2,'#ff8ad8');sfx.perfect(3)}spHUD(G)}if(d.y>H+30)d.gone=1}G.drops=G.drops.filter(d=>!d.gone);
  // wave over?
  const w=G.waves[G.wi];if(w&&w.f!=='boss'&&!G.en.length&&(!G.spawnQ||G.spawnQ.every(q=>q.done))){G.form=null;G.next=(G.next||0)+dt;if(G.next>.8){G.next=0;spNextWave(G)}}}
function spBossDown(G){const B=G.boss;G.shake=.6;vib([80,40,80]);sfx.boom&&sfx.boom();for(let i=0;i<4;i++)setTimeout(()=>{if(G.dead)return;spBurst(G,B.x+(Math.random()-.5)*B.s,B.y+(Math.random()-.5)*B.s,['#ffd23f','#ff8a3d','#fff','#ff8ad8'],20)},i*120);
  for(let i=0;i<10;i++)G.drops.push({k:'coin',x:B.x+(Math.random()-.5)*B.s,y:B.y,vy:G.u*(.25+Math.random()*.2)});G.boss=null;G.eb=[];G.en=[];G.r.querySelector('.sp-bhp').hidden=true;
  setTimeout(()=>{if(!G.dead&&!G.over){for(const d of G.drops)if(d.k==='coin'||d.k==='bag')G.coins+=d.k==='bag'?5:1;G.drops=[];spHUD(G);spWin(G)}},1800)}
function spDraw(G){const g=G.g,W=G.W,H=G.H;g.setTransform(G.d,0,0,G.d,0,0);spSky(G,g,G.run&&!G.pause?.016:0);g.save();if(G.shake>0)g.translate((Math.random()-.5)*12*G.shake,(Math.random()-.5)*12*G.shake);
  spDrawDrops(G,g);
  for(const e of G.en){if(e.k==='rock'){spRock(g,e);continue}
    if(e.k==='mboss'){const im=hzPic(e.pic),r=e.r*1.3;g.save();g.translate(e.x,e.y);if(e.hit>0)g.globalAlpha=.6;if(im)g.drawImage(im,-r,-r,r*2,r*2);g.globalAlpha=1;
      if(!e.own){g.fillStyle='#ffd23f';g.strokeStyle='#201c24';g.lineWidth=2.5;g.beginPath();g.moveTo(-r*.45,-r*.8);g.lineTo(-r*.45,-r*1.12);g.lineTo(-r*.22,-r*.95);g.lineTo(0,-r*1.2);g.lineTo(r*.22,-r*.95);g.lineTo(r*.45,-r*1.12);g.lineTo(r*.45,-r*.8);g.closePath();g.fill();g.stroke()}
      g.fillStyle='rgba(18,13,43,.8)';spRR(g,-r*.7,r*1.05,r*1.4,7,3.5);g.fill();g.fillStyle='#ff5a7a';spRR(g,-r*.7+1,r*1.05+1,(r*1.4-2)*Math.max(0,e.hp/e.max),5,2.5);g.fill();g.restore();continue}const im=hzPic(e.pic),r=e.r*1.25;g.save();g.translate(e.x,e.y);g.rotate(Math.sin(e.t*3)*.12);if(e.hit>0){g.globalAlpha=.6}
    if(im)g.drawImage(im,-r,-r,r*2,r*2);else{g.fillStyle='#7a4af0';g.beginPath();g.arc(0,0,e.r,0,7);g.fill()}
    // tiny space helmet on every minion
    g.globalAlpha=1;if(/^sp_/.test(e.pic)){g.restore();continue}g.fillStyle='rgba(170,220,255,.13)';g.strokeStyle='rgba(220,240,255,.55)';g.lineWidth=2;g.beginPath();g.arc(0,0,r*1.02,0,7);g.fill();g.stroke();g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=3;g.beginPath();g.arc(0,0,r*.8,3.7,4.4);g.stroke();g.restore()}
  if(G.boss)spDrawBoss(g,G.boss,G.el);
  for(const b of G.eb){if(spEbPic(g,G,b))continue;g.fillStyle=b.c;g.strokeStyle='#201c24';g.lineWidth=2;g.beginPath();if(b.goo)g.ellipse(b.x,b.y,b.r*.85,b.r*1.15,0,0,7);else g.arc(b.x,b.y,b.r,0,7);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(b.x-b.r*.3,b.y-b.r*.3,b.r*.3,0,7);g.fill()}
  spDrawShots(G,g);
  if(!G.over||G.won){const blink=G.inv>0&&Math.floor(G.el*14)%2;if(!blink)spDrawShip(g,G.sx,G.sy,G.s,spShipLook(G.el,{tilt:G.tilt,shield:G.shield,mood:G.inv>0?'scared':'happy',drones:spHas('drones'),pod:G.pod,gun:spShipG(spLv('gun')+G.pw)}))}
  spDrawAnims(G,g);
  for(const p of G.fx){g.globalAlpha=Math.max(0,p.life*2);g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.s,0,7);g.fill()}g.globalAlpha=1;
  g.textAlign='center';g.font=`${Math.round(G.u*.06)}px "Lilita One","Secular One",system-ui,sans-serif`;for(const p of G.txt){g.globalAlpha=Math.min(1,p.life*2);g.lineWidth=5;g.strokeStyle='#120d2b';g.strokeText(p.s,p.x,p.y);g.fillStyle=p.c;g.fillText(p.s,p.x,p.y)}g.globalAlpha=1;
  if(G.run&&!G.touched&&G.el<8){const k=(G.el*1.2)%1;g.globalAlpha=.85;g.font=(G.u*.11)+'px system-ui';g.fillText('👆',G.sx+Math.sin(k*6.283)*G.u*.15,G.sy+G.s*2.4);g.globalAlpha=1}
  g.restore()}
function spWin(G){if(G.over)return;G.over=true;G.won=true;G.run=false;const L=G.L,was=progress.stars[L-1]||0,first=!was,stars=G.lost===0?3:G.lost<=1?2:1,got=Math.min(SP_CAP,G.coins),bonus=first?100+G.k*10:0;
  // a space level counts like any won level: its stars, and the boss after it opens
  progress.stars[L-1]=Math.max(was,stars);progress.fails=progress.fails||{};progress.fails[L]=0;if(!(typeof DEV_OPEN!=='undefined'&&DEV_OPEN)||L<=progress.unlocked)progress.unlocked=Math.min(TOTAL,Math.max(progress.unlocked||1,L+1));
  progress.coins+=got+bonus;saveProgress();updateWalletUI();try{addXP(first?40:15)}catch(e){}sfx.flourish(3);
  spEnd(G,true,stars,got,bonus)}
function spLose(G){if(G.over)return;G.over=true;G.run=false;const got=Math.min(SP_CAP,G.coins);progress.coins+=got;saveProgress();updateWalletUI();sfx.trombone?sfx.trombone():sfx.heart();spEnd(G,false,0,got,0)}
function spEnd(G,won,stars,got,bonus){const nw=spCheckEarn();setTimeout(()=>{if(G.dead)return;const p=document.createElement('div');p.className='arc-end sp-endc';
  p.innerHTML=`<div class="arc-panel"><div class="ar-title"></div>${won?`<div class="sp-stars">${[0,1,2].map(i=>`<i class="${i<stars?'on':''}" style="animation-delay:${.15+i*.2}s"></i>`).join('')}</div>`:''}<div class="sp-rows"></div><p class="sp-tip"></p><div class="ar-acts"><button class="btn primary sp-a"><span></span></button><button class="btn sp-b"><span></span></button></div></div>`;
  const tt=p.querySelector('.ar-title');tt.textContent=t(won?'spWin':'spLose');if(won)tt.classList.add('nb');
  const R=p.querySelector('.sp-rows'),row=(l,n)=>{const d=document.createElement('div');d.className='sp-row';d.innerHTML=`<span></span><span class="bn-coins">${coinImg()}<b>+${n}</b></span>`;d.querySelector('span').textContent=l;R.appendChild(d)};
  row(t('spCollected'),got);if(bonus)row(t('spFirst'),bonus);
  const tip=p.querySelector('.sp-tip');if(nw.length)tip.textContent=t('spNew')+' '+nw.map(id=>t('er_'+id)).join(', ');else if(!won)tip.textContent=t('spTipUp');else tip.remove();
  const a=p.querySelector('.sp-a'),b=p.querySelector('.sp-b'),L=G.L;
  a.querySelector('span').textContent=won?t('spToBoss'):t('spRetry');b.querySelector('span').textContent=won?t('spMap'):t('spHangar');
  a.onclick=()=>{sfx.click();if(won)spExit(()=>preLevel(L+1));else spStart(G.k)};b.onclick=()=>{sfx.click();if(won)spExit();else spHub()};
  G.r.appendChild(p);if(got+bonus)setTimeout(()=>sfx.coin(3),500)},won?600:900)}

/* ---------- lobby: rocket in the small column (locked until level 200) + Modes card row + "it's open" once ---------- */
// the graphics department's rocket (sp_icon) when it exists, else the drawn one
const SP_ICON=SP_ART.includes('sp_icon')?'<img src="art/sp_icon.webp" alt="" draggable="false">':'<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4c6 4 8 11 7 19l-7 4-7-4c-1-8 1-15 7-19z" fill="#fff" stroke="#120d2b" stroke-width="2.6" stroke-linejoin="round"/><circle cx="20" cy="15" r="4" fill="#4ee6ff" stroke="#120d2b" stroke-width="2.2"/><path d="M13 21l-5 7 6-1M27 21l5 7-6-1" fill="#ff5a7a" stroke="#120d2b" stroke-width="2.4" stroke-linejoin="round"/><path d="M17 29q3 8 6 0" fill="#ffb23f" stroke="#120d2b" stroke-width="2"/></svg>';
{const row=document.querySelector('#title .lob-mini');if(row){const b=document.createElement('button');b.className='lt-mini ship';b.id='lobShip';b.innerHTML=`<span class="lt-ic">${SP_ICON}<i class="hs-lk">🔒</i></span><b></b>`;b.onclick=openShip;row.appendChild(b)}}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);try{const b=document.getElementById('lobShip');if(b){const o=spOpen();b.hidden=!progress.tut;b.classList.toggle('lock',!o);b.querySelector('b').textContent=o?t('spShort'):t('spLvl',{n:SP_OPEN})}
  if(spOpen()&&!(typeof DEV_OPEN!=='undefined'&&DEV_OPEN)&&!spD().intro)spIntroLater(1500)}catch(e){}return r}}
let spIT=0;function spIntroLater(ms){clearTimeout(spIT);spIT=setTimeout(spIntroMaybe,ms)}
function spIntroMaybe(){const D=spD();if(D.intro||!spOpen()||state!=='title'||document.querySelector('.sp-pop,.hs-pop'))return;if(typeof gdBusy==='function'&&gdBusy()){spIntroLater(2000);return}
  D.intro=1;saveProgress();const m=document.createElement('div');m.className='sp-pop';m.innerHTML=`<div class="sp-pz open"><canvas width="240" height="240"></canvas><h3></h3><p></p><button class="btn primary"><span></span></button></div>`;
  m.querySelector('h3').textContent=t('spOpenT');m.querySelector('p').textContent=t('spOpenP');m.querySelector('button span').textContent=t('spGo');m.querySelector('button').onclick=()=>{m.remove();openShip()};m.onclick=e=>{if(e.target===m)m.remove()};
  spDrawShip(m.querySelector('canvas').getContext('2d'),120,130,70,spShipLook(0));document.body.appendChild(m);sfx.flourish&&sfx.flourish(3)}
{const _om=openModes;openModes=function(){_om.apply(this,arguments);const box=document.querySelector('#card .modes');if(!box)return;const o=spOpen(),b=document.createElement('button');b.className='mode-btn m-ship'+(o?'':' lock');
  b.innerHTML=`<span class="sp-mic">${SP_ICON}</span><span class="mt"><b></b><small></small></span>`;b.querySelector('b').textContent=t('spName');b.querySelector('small').textContent=o?t('spSector',{n:spLvOf(spSelMax())}):t('spLockP',{n:SP_OPEN});
  b.onclick=()=>{if(!o){spLockPop();return}sfx.click();hideOverlay();openShip()};const a=box.querySelector('.m-arc')||box.querySelector('.m-tour');if(a)a.after(b);else box.appendChild(b)}}
{const _d=drawTitleArt;drawTitleArt=function(){if(SPEL&&!SPEL.hidden)return;return _d.apply(this,arguments)}}
{const _lo=lobbyLayerOpen;lobbyLayerOpen=function(){return(!!SPEL&&!SPEL.hidden)||!!document.querySelector('.sp-pop')||_lo()}}
/* ---------- the map: space levels wear a rocket; their level card is a space card ---------- */
{const _bm=buildMap2D;buildMap2D=function(){const r=_bm.apply(this,arguments);try{document.querySelectorAll('#map .pin[data-lv]').forEach(b=>{if(!spIsLv(+b.dataset.lv)||b.querySelector('.sp-pin'))return;b.classList.add('space');const i=document.createElement('i');i.className='sp-pin';i.innerHTML=SP_ICON;b.appendChild(i)})}catch(e){}return r}}
{const _pl=preLevel;preLevel=function(lvN){if(!spIsLv(lvN))return _pl.apply(this,arguments);const k=spK(lvN),have=progress.stars[lvN-1]||0;
  showOverlay(()=>({title:t('spSector',{n:lvN}),extra:card=>{const info=document.createElement('div');info.className='pre sp-pre';
    info.innerHTML=`<canvas class="sp-pre-ship" width="200" height="160"></canvas><div class="pre-row"><b></b><span></span></div><div class="pre-ms"></div>`;
    const row=info.querySelector('.pre-row');row.querySelector('b').textContent=t('preGoal');row.querySelector('span').textContent=t('spGoal',{b:t('spHelper',{b:spBossName(k)})});
    const ms=info.querySelector('.pre-ms');['spSt1','spSt2','spSt3'].forEach((key,i)=>{const d=document.createElement('div');d.className='pre-m'+(i<have?' ok':'');d.innerHTML=starSvg(i<have)+'<span></span>';d.querySelector('span').textContent=t(key);ms.appendChild(d)});
    const c=info.querySelector('canvas');spDrawShip(c.getContext('2d'),100,82,46,spShipLook(0,{tilt:.2}));card.appendChild(info)},
    actions:[{label:t('spLaunch'),icon:'play',primary:true,fn:()=>go(()=>{score=0;mode='levels';modeZi=null;startLevel(lvN)})},{label:t('spHangar'),fn:()=>{hideOverlay();openShip()}},
      {label:t('close'),fn:()=>{if(state==='map'||state==='title')hideOverlay();else go(()=>openMap())}}]}),true)}}

/* ---------- WEAPONS (Tzach, Oct 27 08:40): 10 weapons x 4 levels. Level 1 = one shot, 2 = three forward, 3 = three forward + three each side,
   4 = one giant shot; the next weapon starts again at one shot but stronger. Lasers are beams: thin zap -> 3 beams -> 3 each way -> a giant pillar.
   Gun level L 0..39: weapon = floor(L/4), level = L%4. A power star adds one step for the flight. Art from the graphics department shows up by name:
   sp_w<n>_shot / sp_w<n>_big (projectiles, pointing up), sp_w<n>_beam (a vertical beam segment that tiles). ---------- */
const SP_WPN=[// [kind, core colour, glow colour]
  ['shot','#fff6a8','#ffd23f'],// 1 blaster
  ['beam','#e8ffff','#4ee6ff'],// 2 zap laser (electric)
  ['fire','#fff2b0','#ff5a1f'],// 3 fire
  ['shot','#ffe6f6','#ff4fb8'],// 4 plasma
  ['ice','#f2ffff','#7fdcff'],// 5 ice shards
  ['rocket','#ffffff','#ff8a3d'],// 6 rockets (homing)
  ['beam','#f6e8ff','#b36bff'],// 7 thunder beam
  ['star','#ffffff','#ffd23f'],// 8 rainbow stars
  ['sonic','#e8fff4','#5effc8'],// 9 sonic waves
  ['beam','#ffffff','#ff6bf0']];// 10 galaxy beam
const spWOf=L=>{L=Math.max(0,Math.min(39,L));return{w:Math.floor(L/4),l:L%4,D:1+.3*L}};
const spBeamW=w=>SP_WPN[w][0]==='beam';
spPower=function(){const o=spWOf(spLv('gun')+(spHas('rainbow')?1:0));return o.D*[1,1.65,1.8,2.2][o.l]*(spBeamW(o.w)?1.2:1)*(1+.14*spLv('rate'))*(spHas('laser')?1.2:1)};
spShoot=function(G){const o=spWOf(spLv('gun')+G.pw),k=SP_WPN[o.w][0],v=G.u*1.6,x=G.sx,y=G.sy-G.s*.9,pr=spHas('laser')?2:0;G.flash=.08;G.fw=o.w;
  if(k==='beam')return;// beams fire all the time (spBeams)
  const add=(dx,a,dmg,rad,big)=>G.bul.push({x:x+dx,y,vx:Math.sin(a)*v*(k==='rocket'?.75:1),vy:-Math.cos(a)*v*(k==='rocket'?.75:1),dmg,pierce:pr+(big?3:k==='sonic'?1:0),hit:[],w:o.w,big,rad,home:k==='rocket'});
  const D=o.D,s=G.s,r0=k==='sonic'?G.u*.03:4;
  if(o.l===0)add(0,0,D,r0);
  else if(o.l===1)for(const i of[-1,0,1])add(i*s*.32,0,D*.55,r0);
  else if(o.l===2){for(const i of[-1,0,1]){add(i*s*.3,0,D*.4,r0);add(i*s*.1,-.32-i*.1,D*.4,r0);add(i*s*.1,.32+i*.1,D*.4,r0)}}
  else add(0,0,D*2.2,G.u*.06,1);
  if(sfx.ok()&&!((G.shotN=(G.shotN||0)+1)%3))tone({f:k==='fire'?300:880,f2:k==='fire'?160:1300,d:.05,type:k==='fire'?'sawtooth':'square',v:.012})};
spTierOf=L=>1;
// beams: continuous damage along each ray from the ship's nose
function spBeamSet(G){const o=spWOf(spLv('gun')+G.pw);if(!spBeamW(o.w))return null;const s=G.s,D=o.D*(1+.14*spLv('rate'))*(spHas('laser')?1.2:1),B=[];
  if(o.l===0)B.push({dx:0,a:0,w:G.u*.012,dps:D*5});
  else if(o.l===1)for(const i of[-1,0,1])B.push({dx:i*s*.32,a:0,w:G.u*.01,dps:D*2.8});
  else if(o.l===2)for(const i of[-1,0,1]){B.push({dx:i*s*.3,a:0,w:G.u*.009,dps:D*2.1});B.push({dx:0,a:-.3-i*.12,w:G.u*.009,dps:D*1.2});B.push({dx:0,a:.3+i*.12,w:G.u*.009,dps:D*1.2})}
  else B.push({dx:0,a:0,w:G.u*.11,dps:D*11,big:1});
  return{o,B}}
// giant shots and the giant beam (weapon level 4) wipe out the enemy shots they touch (Tzach, Oct 27 10:25: 'else you can't see anything')
function spEatShots(G){const S=G.beams,gb=S&&S.B.find(b=>b.big),x0=G.sx,y0=G.sy-G.s*.9;let n=0;
  for(const e of G.eb){if(e.gone)continue;let hit=false;
    for(const b of G.bul)if(b.big&&Math.hypot(e.x-b.x,e.y-b.y)<Math.max(b.rad||0,G.u*.09)+e.r){hit=true;break}
    if(!hit&&gb&&e.y<y0&&Math.abs(e.x-(x0+gb.dx))<gb.w*1.9+e.r)hit=true;
    if(hit){e.gone=1;if(n++<4)spBurst(G,e.x,e.y,['#fff','#7ff3ff'],5)}}
  if(n)G.eb=G.eb.filter(e=>!e.gone)}
function spBeams(G,dt){if(!G.run||G.over||G.pause)return;spEatShots(G);const S=spBeamSet(G);G.beams=S;if(!S)return;const x0=G.sx,y0=G.sy-G.s*.9,Bo=G.boss;
  for(const b of S.B){const ax=x0+b.dx,dx=Math.sin(b.a),dy=-Math.cos(b.a);
    const hit=(px,py,r)=>{const vx=px-ax,vy=py-y0,along=vx*dx+vy*dy;if(along<0)return false;return Math.abs(vx*dy-vy*dx)<r+b.w/2};
    for(const e of G.en){if(e.gone||e.hp<=0||(e.f&&e.enter>0&&e.y<0))continue;if(hit(e.x,e.y,e.r)){e.hp-=b.dps*dt;e.hit=.05;if(Math.random()<dt*8)spAnim(G,'sp_hit_',3,e.x,e.y+e.r*.5,G.u*.06,.18);if(e.hp<=0){e.gone=1;spKill(G,e)}}}
    if(Bo&&Bo.in<=0&&hit(Bo.x,Bo.y,Bo.s*.4)){Bo.hp-=b.dps*dt;Bo.hurt=.06;if(Bo.hp<=0){spBossDown(G);break}}}
  G.en=G.en.filter(e=>!e.gone)}
{const _tk=spTick;spTick=function(G,dt){_tk(G,dt);spBeams(G,dt);
  // rockets home in on the nearest monster
  for(const b of G.bul)if(b.home){let best=null,bd=1e9;for(const e of G.en){if(e.gone||e.y<0)continue;const d=Math.hypot(e.x-b.x,e.y-b.y);if(d<bd&&e.y<b.y){bd=d;best=e}}if(!best&&G.boss)best=G.boss;
    if(best){const sp=Math.hypot(b.vx,b.vy),a=Math.atan2(best.y-b.y,best.x-b.x),c=Math.atan2(b.vy,b.vx);let da=a-c;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;const n=c+Math.max(-4*dt,Math.min(4*dt,da));b.vx=Math.cos(n)*sp;b.vy=Math.sin(n)*sp}}}}
// drawing: projectiles by weapon (picture when it exists), beams with electric crackle, muzzle flash in the weapon's colour
spDrawShots=function(G,g){g.save();g.globalCompositeOperation='lighter';const T=G.el;
  for(const b of G.bul){g.save();g.translate(b.x,b.y);g.rotate(Math.atan2(b.vx,-b.vy));
    if(b.dr){g.fillStyle='#4ee6ff';g.shadowColor='#4ee6ff';g.shadowBlur=8;spRR(g,-2,-7,4,14,2);g.fill();g.restore();continue}
    const w=b.w||0,[k,c0,c1]=SP_WPN[w],nm='sp_w'+(w+1)+(b.big?'_big':'_shot'),im=SP_ART.includes(nm)&&hzPic(nm);
    const L=G.u*(b.big?.09:.04),W2=b.big?G.u*.04:G.u*.009;
    if(im){const h=L*(b.big?2.8:3.2),ww=h*im.naturalWidth/im.naturalHeight;g.drawImage(im,-ww/2,-h/2,ww,h);g.restore();continue}
    g.shadowColor=c1;g.shadowBlur=b.big?20:10;const gr=g.createLinearGradient(0,-L,0,L*1.4);gr.addColorStop(0,c0);gr.addColorStop(.4,c1);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;
    if(k==='fire'){g.beginPath();g.arc(0,-L*.4,W2*1.8,0,7);g.fill();g.beginPath();g.moveTo(-W2*1.6,-L*.4);g.quadraticCurveTo(Math.sin(T*40+b.x)*W2,L*1.6,W2*1.6,-L*.4);g.fill()}
    else if(k==='ice'){g.beginPath();g.moveTo(0,-L);g.lineTo(W2*1.4,0);g.lineTo(0,L*.8);g.lineTo(-W2*1.4,0);g.closePath();g.fill()}
    else if(k==='rocket'){g.fillStyle='#f4f0ff';spRR(g,-W2,-L*.6,W2*2,L*1.1,W2);g.fill();g.fillStyle=c1;g.beginPath();g.moveTo(-W2,L*.5);g.quadraticCurveTo(0,L*(1.3+.3*Math.sin(T*50)),W2,L*.5);g.fill()}
    else if(k==='star'){g.fillStyle=`hsl(${(T*300+b.x)%360},95%,70%)`;g.rotate(T*8);spStar(g,0,0,W2*2.6);g.fill()}
    else if(k==='sonic'){g.strokeStyle=c1;g.lineWidth=W2*.8;const R0=(b.rad||G.u*.03)*1.2;g.beginPath();g.arc(0,R0*.6,R0,-2.4,-.74);g.stroke();g.strokeStyle=c0;g.lineWidth=W2*.35;g.stroke()}
    else{spRR(g,-W2,-L,W2*2,L*2,W2);g.fill();g.fillStyle='rgba(255,255,255,.85)';spRR(g,-W2*.4,-L*.85,W2*.8,L*1.2,W2*.4);g.fill()}
    g.restore()}
  // beams
  const S=G.beams;if(S&&!G.over){const [k,c0,c1]=SP_WPN[S.o.w],x0=G.sx,y0=G.sy-G.s*.9,bim=SP_ART.includes('sp_w'+(S.o.w+1)+'_beam')&&hzPic('sp_w'+(S.o.w+1)+'_beam');
    for(const b of S.B){g.save();g.translate(x0+b.dx,y0);g.rotate(b.a);const Lb=G.H*1.3,w=b.w*(1+.15*Math.sin(T*30+b.dx)),f=b.big?1.9:1;
      if(bim){const th=w*2.4*f*bim.naturalHeight/bim.naturalWidth,off=(T*G.u*2)%th;for(let yy=off;yy>-Lb;yy-=th)g.drawImage(bim,-w*1.2*f,yy-th,w*2.4*f,th)}
      else{const gr=g.createLinearGradient(-w*f,0,w*f,0);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.3,c1);gr.addColorStop(.5,c0);gr.addColorStop(.7,c1);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.shadowColor=c1;g.shadowBlur=b.big?30:12;g.fillRect(-w*f,-Lb,w*2*f,Lb)}
      // electric crackle along the beam
      g.strokeStyle=c0;g.lineWidth=b.big?2.5:1.3;g.shadowColor=c1;g.shadowBlur=8;for(let z=0;z<(b.big?3:1);z++){g.beginPath();g.moveTo(0,0);for(let yy=0;yy>-Lb;yy-=G.u*.04)g.lineTo((Math.random()-.5)*w*(b.big?2.4:3),yy);g.stroke()}
      g.restore()}}
  if(G.flash>0||S){const [k,c0,c1]=SP_WPN[G.fw||0],r=G.s*(S&&S.o.l===3?.7:.45),x=G.sx,y=G.sy-G.s*.95;g.globalAlpha=S?.8+.2*Math.sin(T*40):G.flash/.08;const rg=g.createRadialGradient(x,y,0,x,y,r);rg.addColorStop(0,'#fff');rg.addColorStop(.4,c1);rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
  g.restore()};
// garage card: the weapon's name + its level n/4 + what the next step does
{const _r=spUpsRender;spUpsRender=function(){_r();const r=SPEL;if(!r)return;const c=r.querySelectorAll('.sp-up')[SP_UP.findIndex(u=>u[0]==='gun')];if(!c)return;
  const L=spLv('gun'),o=spWOf(L),nx=spWOf(Math.min(39,L+1)),bm=w=>spBeamW(w)?'wpb':'wps';
  c.querySelector('b').textContent=t('wpn'+(o.w+1))+' · '+t('spWLv',{n:o.l+1});
  c.querySelector('small').textContent=L>=39?t('wpMax'):'→ '+(nx.w!==o.w?t('wpn'+(nx.w+1))+': ':'')+t(bm(nx.w)+nx.l);
  c.querySelector('.pips').innerHTML=Array.from({length:4},(_,i)=>`<i class="${i<=o.l?'on':''}"></i>`).join('')+`<em class="sp-wn">${o.w+1}/10</em>`;
  const ic=c.querySelector('.ic');ic.style.setProperty('--wc',SP_WPN[o.w][2]);ic.classList.add('sp-wic')}}

/* ---------- ENDLESS FLIGHT (Tzach, Oct 27 08:41): from the garage, whatever level you are at: waves never end, every 5th wave is a big helper,
   then the flight moves on to the next world (its top-down picture, its mini-bosses). Gets harder every wave. Best wave in progress.ship.best.
   Coins collected count like a space level (max SP_CAP a flight), no stars, no unlocks. ---------- */
function spEWave(i){const T=Math.min(2.6,i*.09),R=Math.min(5,2+Math.floor(i/3));if(i%5===4)return{f:'boss'};
  return[{f:'form',rows:R,cols:5+(i>6?1:0),fire:1+T*.3,mini:i>=6?1:0},{f:'swoop',n:8+i,mini:i>=3?1:0},{f:'rocks',n:7+i,form:{rows:Math.min(4,1+Math.floor(i/4)),cols:5}},{f:'form',rows:R,cols:6,fire:1.3+T*.3,mini:i>=8?2:1}][i%5]}
function spEndless(){spD();const best=(spD().best||0);spStart(0);const G=SPG;G.endless=1;G.ew=0;G.waves=[spEWave(0)];G.T=spUpT();G.L=0;
  spBanner(G,t('spEndless'),t('spEBest',{n:best}),2.2)}
{const _nw=spNextWave;spNextWave=function(G){if(G.endless){const i=G.wi+1;while(G.waves.length<=i)G.waves.push(spEWave(G.waves.length));G.T=spUpT()+Math.min(2.6,i*.09)}return _nw(G)}}
{const _w=spWin;spWin=function(G){if(!G.endless)return _w(G);if(G.over)return;// a big helper is down: fly on to the next world
  G.boss=null;G.k=(G.k+1)%SP_N;G.sid=spSid(G.k);G.wy=0;spBanner(G,t('spENext'),t(ZONES[Math.floor((SP_LVS[G.k]-1)/LPZ)].key),2);setTimeout(()=>{if(!G.dead&&!G.over)spNextWave(G)},1400)}}
{const _l=spLose;spLose=function(G){if(!G.endless)return _l(G);if(G.over)return;G.over=true;G.run=false;const got=Math.min(SP_CAP,G.coins),D=spD(),wave=G.wi+1,rec=wave>(D.best||0);if(rec)D.best=wave;
  progress.coins+=got;saveProgress();updateWalletUI();sfx.trombone?sfx.trombone():sfx.heart();
  setTimeout(()=>{if(G.dead)return;const p=document.createElement('div');p.className='arc-end sp-endc';
    p.innerHTML=`<div class="arc-panel"><div class="ar-title"></div><div class="sp-rows"></div><p class="sp-tip"></p><div class="ar-acts"><button class="btn primary sp-a"><span></span></button><button class="btn sp-b"><span></span></button></div></div>`;
    p.querySelector('.ar-title').textContent=t('spEWave',{n:wave});const R=p.querySelector('.sp-rows');
    const d=document.createElement('div');d.className='sp-row';d.innerHTML=`<span></span><span class="bn-coins">${coinImg()}<b>+${got}</b></span>`;d.querySelector('span').textContent=t('spCollected');R.appendChild(d);
    p.querySelector('.sp-tip').textContent=rec?t('spERec'):t('spEBest',{n:D.best||0});
    const a=p.querySelector('.sp-a'),b=p.querySelector('.sp-b');a.querySelector('span').textContent=t('spRetry');b.querySelector('span').textContent=t('spHangar');
    a.onclick=()=>{sfx.click();spEndless()};b.onclick=()=>{sfx.click();spHub()};G.r.appendChild(p);if(rec&&sfx.flourish)sfx.flourish(3)},900)}}
// garage button under the hangar
{const _h=spHub;spHub=function(){_h.apply(this,arguments);const r=SPEL;if(!r||r.querySelector('.sp-endless'))return;const hg=r.querySelector('.sp-hangar');if(!hg)return;
  const b=document.createElement('button');b.className='btn sp-endless';b.innerHTML=`<span class="sp-inf">∞</span><span class="tx"><b></b><small></small></span>`;
  b.querySelector('b').textContent=t('spEndless');b.querySelector('small').textContent=(spD().best?t('spEBest',{n:spD().best})+' · ':'')+t('spEDesc');
  b.onclick=()=>{sfx.click();spEndless()};hg.after(b)}}

/* ---------- CHARLIE EXPLAINS (Tzach, Oct 27 09:12: 'in the explanations Charlie appears and the text is under him in an explanation UI').
   spCharlie(pages,{done}) = Charlie (art/sp_charlie_talk, a bust; later frames sp_charlie_talk2 for the mouth) pops up, a speech panel under him
   types each page out; tap = finish typing / next page. Used for: the garage opening, the locked garage, the first garage visit (4 pages),
   the first flight, the first endless flight, every new weapon type, newly earned parts. Seen flags in progress.ship.ch. ---------- */
function spChSeen(k){const D=spD();D.ch=D.ch||{};if(D.ch[k])return true;D.ch[k]=1;saveProgress();return false}
function spCharlie(pages,o){o=o||{};document.querySelectorAll('.ch-pop').forEach(e=>e.remove());const m=document.createElement('div');m.className='ch-pop';
  // a different face per page so he looks like he is explaining (Tzach, Oct 27 09:28): the popup's pose first, then show / point / idea …;
  // while the text types, 'talk' and 'talk2' swap (mouth open / closed). The last page of a longer talk ends happy.
  const has=n=>SP_ART.includes('sp_charlie_'+n),seq=['show','point','idea','talk'].filter(n=>has(n)&&n!==o.pose),
    faceOf=i=>{const pf=typeof pages[i]==='object'&&pages[i].face;if(pf&&has(pf))return 'sp_charlie_'+pf;const f=i===0?(o.pose&&has(o.pose)?o.pose:['talk','wave','1'].find(has)):i===pages.length-1&&pages.length>2&&has('yay')?'yay':seq.length?seq[(i-1)%seq.length]:['talk','wave','1'].find(has);return f?'sp_charlie_'+f:null},
    pic=faceOf(0),flap=has('talk')&&has('talk2');
  m.innerHTML=`<div class="ch-box"><div class="ch-face">${pic?`<img src="art/${pic}.webp" alt="">`:''}</div><div class="ch-bub"><span class="ch-name"></span>${o.title?'<h3></h3>':''}<div class="ch-pics" hidden></div><p></p><div class="ch-foot"><span class="ch-dots"></span><button class="btn primary"><span></span></button></div></div></div>`;
  m.querySelector('.ch-name').textContent=t('chName');if(o.title)m.querySelector('h3').textContent=o.title;
  const P=m.querySelector('p'),PX=m.querySelector('.ch-pics'),B=m.querySelector('button'),F=m.querySelector('.ch-face'),dots=m.querySelector('.ch-dots');let i=0,tm=0,full=false;
  const txt=j=>typeof pages[j]==='string'?pages[j]:pages[j].tx;
  const show=()=>{const tx=txt(i),pc=typeof pages[i]==='object'&&pages[i].pics||[];PX.hidden=!pc.length;PX.innerHTML=pc.map(n=>/^[a-z]/.test(n)?`<img src="art/${n}.webp" alt="">`:`<span>${n}</span>`).join('');full=false;P.textContent='';clearInterval(tm);let n=0;F.classList.add('talk');
    const fc=faceOf(i),im0=F.querySelector('img');if(im0&&fc&&!im0.src.endsWith(fc+'.webp')){im0.src='art/'+fc+'.webp';F.classList.remove('swap');void F.offsetWidth;F.classList.add('swap')}
    const cur=fc,mo=cur==='sp_charlie_talk'||cur==='sp_charlie_talk2';
    dots.innerHTML=pages.length>1?pages.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join(''):'';
    B.querySelector('span').textContent=i<pages.length-1?t('chNext'):(o.btn||t('chOk'));
    const im=F.querySelector('img');tm=setInterval(()=>{n+=2;P.textContent=tx.slice(0,n);if(flap&&mo&&im&&n%6===0)im.src='art/'+(im.src.includes('talk2')?'sp_charlie_talk':'sp_charlie_talk2')+'.webp';if(n%6===0&&sfx.ok&&sfx.ok())tone({f:520+Math.random()*260,d:.035,type:'square',v:.012});if(n>=tx.length){clearInterval(tm);full=true;F.classList.remove('talk');if(mo&&im)im.src='art/'+cur+'.webp'}},28)};
  const next=e=>{e&&e.stopPropagation();if(!full){clearInterval(tm);P.textContent=txt(i);full=true;F.classList.remove('talk');const im=F.querySelector('img'),fc=faceOf(i);if(im&&fc)im.src='art/'+fc+'.webp';return}
    sfx.click();if(i<pages.length-1){i++;show();return}m.classList.add('out');setTimeout(()=>m.remove(),220);o.done&&o.done()};
  B.onclick=next;m.onclick=next;document.body.appendChild(m);show();return m}
// the garage opens (lobby popup) and the locked garage: Charlie says it
spIntroMaybe=function(){const D=spD();if(D.intro||!spOpen()||state!=='title'||document.querySelector('.sp-pop,.hs-pop,.ch-pop'))return;if(typeof gdBusy==='function'&&gdBusy()){spIntroLater(2000);return}
  D.intro=1;saveProgress();sfx.flourish&&sfx.flourish(3);spCharlie([t('chHi'),t('spOpenP')],{title:t('spOpenT'),btn:t('spGo'),done:()=>openShip()})};
spLockPop=function(){sfx.locked();spCharlie([t('chLockSoon',{n:SP_OPEN})+' '+t('spLockNow',{n:Math.min(progress.unlocked||1,TOTAL)})],{title:t('spLockT'),pose:'think'})};
// first garage visit: the tour
// the first garage visit = a short picture guide to the whole space part (Tzach, Oct 27 10:11: 'the first screen: Charlie explains the game
// in a short guide'); it covers flying too, so the first flight then starts without Charlie's flight tips
function spGuide(){const sid=spSid(SPV&&SPV.sel||0),hp=SP_ART.includes('sp_help_'+sid)?'sp_help_'+sid:'boss_'+sid,sh=SP_ART.includes('sp_ship_g0_h0')?'sp_ship_g0_h0':null,has=n=>SP_ART.includes(n);
  spCharlie([{tx:t('chMe1'),face:'show'},{tx:t('chMe2'),face:'talk'},{tx:t('chG1'),pics:(sh?[sh]:[]).concat(['⚔️',hp])},{tx:t('chF1'),pics:['👆'].concat(sh?[sh]:[])},
    {tx:t('chF2'),pics:['sp_pk_coin_1',has('sp_star')?'sp_star':'sp_pk_star','sp_eb_zap','sp_rock_1'].filter(n=>has(n))},
    {tx:t('chG2'),pics:SP_UP.map(u=>u[2])},{tx:t('chJob'),pics:['⏱','🔧']},{tx:t('chG3'),pics:['🏆']}],{pose:'point',done:()=>spChSeen('f')})}
{const _h=spHub;spHub=function(){_h.apply(this,arguments);if(!spChSeen('g'))setTimeout(()=>{if(SPEL&&!SPEL.hidden&&SPEL.className==='sp-hub')spGuide()},500)}}
// first flight / first endless flight: Charlie first, then the flight starts
{const _p=spEnter;spEnter=function(k){if(spChSeen('f'))return _p.apply(this,arguments);const a=arguments,th=this;spCharlie([t('chF1'),t('chF2')],{btn:t('chGo'),done:()=>_p.apply(th,a)})}}
{const _e=spEndless;spEndless=function(){if(spChSeen('e'))return _e.apply(this,arguments);spCharlie([t('chE1')],{btn:t('chGo'),done:()=>_e()})}}
function spChWpn(L){const o=spWOf(L);spCharlie([t('chW',{w:t('wpn'+(o.w+1))})],{btn:t('chGo'),pose:'idea'})}
// newly earned parts: Charlie announces them in the garage
{const _r=spEarnRender;spEarnRender=function(nw){_r.call(this,[]);if(nw&&nw.length){sfx.flourish&&sfx.flourish(3);setTimeout(()=>spCharlie(nw.map(id=>t('chPart',{p:t('er_'+id)})+' '+t('ed_'+id)),{pose:'yay'}),700)}}}

/* ---------- BUILD TIMES (Tzach, Oct 27 09:26: 'every ship upgrade takes a while depending on its level, a work animation around the ship,
   and only two upgrades at a time'). Coins are paid when the build starts; the level counts when the timer ends (real time, also while the
   game is closed). progress.ship.q = [{id,to,end}] (max 2). Nothing can be bought to skip it. While something builds, Charlie hammers away,
   a repair drone per build circles the ship welding, and the hangar shows the jobs with their timers. ---------- */
const SP_TIMES={rate:[30,180,900,3600,10800],hull:[600,7200],mag:[60,600,3600]};
function spBuildSec(id,to){if(id==='gun')return Math.min(28800,Math.round(15*Math.pow(1.22,to-1)));return(SP_TIMES[id]||[60])[Math.min(to-1,(SP_TIMES[id]||[60]).length-1)]}
function spQ(){const D=spD();D.q=D.q||[];return D.q}
function spJobStart(id,to){const q=spQ();if(q.length>=2||q.some(j=>j.id===id))return false;q.push({id,to,end:Date.now()+spBuildSec(id,to)*1000});saveProgress();spJobsUI();return true}
function spFmt(sec){sec=Math.max(0,Math.ceil(sec));const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),x=sec%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(x).padStart(2,'0')}`:`${m}:${String(x).padStart(2,'0')}`}
function spJobsTick(){const D=spD(),q=spQ(),now=Date.now(),done=q.filter(j=>now>=j.end);if(!done.length)return;
  D.q=q.filter(j=>now<j.end);for(const j of done)D.lv[j.id]=Math.max(D.lv[j.id]||0,j.to);saveProgress();
  if(SPEL&&!SPEL.hidden&&SPEL.className==='sp-hub'){if(SPH)SPH.up=1.4;sfx.flourish&&sfx.flourish(3);spUpsRender();
    const g=done.find(j=>j.id==='gun'&&j.to%4===0);if(g)setTimeout(()=>spChWpn(g.to),400);else noteToast(t('spDone',{u:t('up_'+done[0].id)}))}}
setInterval(spJobsTick,1000);
// the upgrade rows: a row that is building shows its timer; with two builds running the other buttons wait
{const _r=spUpsRender;spUpsRender=function(){_r.apply(this,arguments);const r=SPEL;if(!r)return;const q=spQ(),full=q.length>=2;
  SP_UP.forEach(([id,max],i)=>{const c=r.querySelectorAll('.sp-up')[i];if(!c)return;const b=c.querySelector('button'),j=q.find(x=>x.id===id);if(spLv(id)>=max)return;
    if(j){b.className='btn sp-busy';b.disabled=true;b.innerHTML=`<i class="sp-wr"></i><em data-end="${j.end}"></em>`;c.classList.add('building')}
    else{const tm=document.createElement('span');tm.className='sp-time';tm.textContent='⏱ '+spFmt(spBuildSec(id,spLv(id)+1));c.querySelector('.tx').appendChild(tm);if(full)b.classList.add('wait')}});
  spJobsUI()}}
function spJobsUI(){const r=SPEL;if(!r)return;const hg=r.querySelector('.sp-hangar');if(!hg)return;let J=hg.querySelector('.sp-jobs');const q=spQ();
  if(!q.length){if(J)J.remove();return}if(!J){J=document.createElement('div');J.className='sp-jobs';hg.appendChild(J)}
  J.innerHTML=q.map(j=>`<div class="sp-job"><img src="art/${SP_UP.find(u=>u[0]===j.id)[2]}.webp" alt=""><span><b></b><em data-end="${j.end}" data-len="${spBuildSec(j.id,j.to)}"></em><i class="bar"><i></i></i></span></div>`).join('');
  J.querySelectorAll('.sp-job b').forEach((e,i)=>e.textContent=t('up_'+q[i].id)+(document.documentElement.dir==='rtl'?' ← ':' → ')+(q[i].id==='gun'?t('wpn'+(spWOf(q[i].to).w+1))+' '+(spWOf(q[i].to).l+1):q[i].to));spTimers()}
function spTimers(){const r=SPEL;if(!r||r.hidden)return;const now=Date.now();r.querySelectorAll('em[data-end]').forEach(e=>{const left=(+e.dataset.end-now)/1000;e.textContent=spFmt(left);
  const bar=e.parentNode.querySelector('.bar i');if(bar&&e.dataset.len)bar.style.width=Math.max(0,Math.min(100,100*(1-left/+e.dataset.len)))+'%'})}
setInterval(spTimers,500);
