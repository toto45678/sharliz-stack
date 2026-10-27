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
  const n=SP_ART.includes(v)?v:SP_ART.includes(b)?b:null;return n&&hzPic(n)?n:null}
// space levels: the level before every boss, from level 90 on (89, 99, … 299, and on into any later seasons)
const SP_LVS=[];for(let L=89;L<=TOTAL;L++)if((L-1)%LPZ===LPZ-2)SP_LVS.push(L);
const SP_N=SP_LVS.length,SP_OPEN=SP_LVS[0];
const spIsLv=L=>SP_LVS.includes(L),spK=L=>SP_LVS.indexOf(L),spLvOf=k=>SP_LVS[k];
const spReached=k=>(typeof DEV_OPEN!=='undefined'&&DEV_OPEN)||(progress.unlocked||1)>=SP_LVS[k];
const spSt=k=>progress.stars[SP_LVS[k]-1]||0;
const SP_UP=[['gun',5,'ic_laser',[300,600,1000,1500,2200]],['rate',5,'ic_bolt',[250,500,850,1300,1900]],['hull',2,'ic_heart',[800,1800]],['mag',3,'ic_coins',[200,450,800]]];
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
let SPHERO=null;const spHero=()=>SPHERO||(SPHERO=arcHeroSprite());
function spRR(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
// the ship: s = half width. o = {gun, hull, gold, drones, shield, t, tilt, flame}
function spDrawShip(g,x,y,s,o){const T=o.t||0,K='#201c24';g.save();g.translate(x,y);g.rotate((o.tilt||0)*.25);g.lineJoin='round';g.lineCap='round';
  // engine flame
  const fl=(o.flame==null?1:o.flame)*(1+Math.sin(T*40)*.12);{const gr=g.createLinearGradient(0,s*.55,0,s*(1.1+.6*fl));gr.addColorStop(0,'#fff6c2');gr.addColorStop(.35,'#ffb23f');gr.addColorStop(1,'rgba(255,80,60,0)');g.fillStyle=gr;
    g.beginPath();g.moveTo(-s*.2,s*.55);g.quadraticCurveTo(0,s*(1.25+.7*fl),s*.2,s*.55);g.fill();if(o.rainbow){g.globalAlpha=.6;g.fillStyle=`hsl(${(T*300)%360},90%,65%)`;g.beginPath();g.moveTo(-s*.1,s*.6);g.quadraticCurveTo(0,s*(1+.5*fl),s*.1,s*.6);g.fill();g.globalAlpha=1}}
  const pn=spShipPic(o);if(pn){const im=hzPic(pn),w=s*2.1,h=w*im.naturalHeight/im.naturalWidth,y0=s*.64-h,dm=SP_DOME[pn]||{x:.5,y:.36,r:.13};g.rotate(-(o.tilt||0)*.25+(o.tilt||0)*.08);
    g.drawImage(im,-w/2,y0,w,h);const cx=(dm.x-.5)*w,cy=y0+dm.y*h,cr=dm.r*w;g.save();g.beginPath();g.arc(cx,cy,cr*.96,0,7);g.clip();g.fillStyle='#2a2060';g.fill();
    try{const hh=spHero();withCtx(g,cr*.95,()=>drawSharliz(hh,cx,cy+cr*.38,(o.tilt||0)*-.15,o.mood||'happy',{x:(o.tilt||0)*.5,y:-.5},0))}catch(e){}
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
  g.save();g.beginPath();g.arc(0,cy,cr*.96,0,7);g.clip();try{const h=spHero();withCtx(g,cr*.95,()=>drawSharliz(h,0,cy+cr*.38,(o.tilt||0)*-.15,o.mood||'happy',{x:(o.tilt||0)*.5,y:-.5},0))}catch(e){}g.restore();
  {const gr=g.createRadialGradient(-cr*.35,cy-cr*.4,cr*.05,0,cy,cr);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(.5,'rgba(200,230,255,.12)');gr.addColorStop(1,'rgba(150,200,255,.3)');g.fillStyle=gr;g.beginPath();g.arc(0,cy,cr,0,7);g.fill()}
  g.strokeStyle='#ffd23f';g.lineWidth=Math.max(2,s*.08);g.beginPath();g.arc(0,cy,cr,0,7);g.stroke();g.strokeStyle=K;g.lineWidth=Math.max(1.5,s*.035);g.beginPath();g.arc(0,cy,cr+s*.05,0,7);g.stroke();
  g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=Math.max(1.5,s*.05);g.beginPath();g.arc(0,cy,cr*.72,-2.6,-1.9);g.stroke();
  g.restore()}
  if(o.drones)for(const d of [-1,1])spDrone(g,x+d*s*1.45,y+s*.15+Math.sin(T*3+d)*s*.08,s*.22);
  if(o.shield>0){g.save();g.globalAlpha=.35+.1*Math.sin(T*6);const gr=g.createRadialGradient(x,y,s*.6,x,y,s*1.35);gr.addColorStop(0,'rgba(120,230,255,0)');gr.addColorStop(1,'rgba(150,240,255,.9)');g.fillStyle=gr;g.beginPath();g.arc(x,y,s*1.35,0,7);g.fill();
    g.globalAlpha=.9;g.fillStyle='#fff6a8';for(let i=0;i<o.shield*3;i++){const a=T*1.5+i*2.09/(o.shield>1?1:1.5);spStar(g,x+Math.cos(a)*s*1.3,y+Math.sin(a)*s*1.3,s*.13)}g.restore()}}
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
function spRock(g,e){g.save();g.translate(e.x,e.y);g.rotate(e.rot);g.fillStyle=e.hit>0?'#d8c8b8':'#8a7a6e';g.strokeStyle='#201c24';g.lineWidth=3;g.beginPath();e.pts.forEach((p,i)=>{const a=i/e.pts.length*6.283;g.lineTo(Math.cos(a)*e.r*p,Math.sin(a)*e.r*p)});g.closePath();g.fill();g.stroke();
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
  if(SP_ART.includes('sp_charlie')){const ch=r.querySelector('.sp-charlie');ch.hidden=false;ch.querySelector('img').src='art/sp_charlie.webp'}
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
  const fit=()=>{const d=Math.min(2,devicePixelRatio||1),b=c.getBoundingClientRect();H.W=b.width;H.H=b.height;c.width=Math.round(b.width*d);c.height=Math.round(b.height*d);H.d=d};fit();addEventListener('resize',fit);H.off=()=>removeEventListener('resize',fit);
  const loop=now=>{if(H.dead)return;const dt=Math.min(.05,(now-H.last)/1000);H.last=now;H.t+=dt;if(!H.W)fit();g.setTransform(H.d,0,0,H.d,0,0);spSky(H,g,dt*.4);
    const s=Math.min(H.W*.2,H.H*.32);spDrawShip(g,H.W/2,H.H*.5+Math.sin(H.t*1.6)*6,s,spShipLook(H.t,{tilt:Math.sin(H.t*.8)*.25,shield:spHas('xmasShield')?1:0}));H.raf=requestAnimationFrame(loop)};H.raf=requestAnimationFrame(loop)}
function spShipLook(T,o){return Object.assign({t:T,gun:spLv('gun'),hull:spLv('hull'),gold:spHas('gold'),drones:spHas('drones'),rainbow:spHas('rainbow')},o||{})}
function spSecInfo(){const r=SPEL;if(!r)return;const k=SPV.sel;r.querySelector('.sp-secname b').textContent=t('spSector',{n:spLvOf(k)});r.querySelector('.sp-secname small').textContent=t(ZONES[Math.floor((spLvOf(k)-1)/LPZ)].key)}
function spUpsRender(){const r=SPEL,U=r.querySelector('.sp-ups');U.innerHTML='';
  SP_UP.forEach(([id,max,ic,pr])=>{const L=spLv(id),c=document.createElement('div');c.className='sp-up';
    c.innerHTML=`<span class="ic"><img src="art/${ic}.webp" alt=""></span><span class="tx"><b></b><small></small><span class="pips">${Array.from({length:max},(_,i)=>`<i class="${i<L?'on':''}"></i>`).join('')}</span></span><button class="btn"></button>`;
    c.querySelector('b').textContent=t('up_'+id);c.querySelector('small').textContent=t('ud_'+id);const b=c.querySelector('button');
    if(L>=max){b.textContent=t('spMax');b.disabled=true;b.className='btn sp-max'}else{const p=pr[L];b.innerHTML=`${coinImg()}<em>${p.toLocaleString()}</em>`;b.className='btn primary'+((progress.coins||0)<p?' poor':'');
      b.onclick=()=>{if((progress.coins||0)<p){sfx.locked();popupToast(t('needCoins'));return}progress.coins-=p;spD().lv[id]=L+1;saveProgress();updateWalletUI();sfx.flourish&&sfx.flourish(3);r.querySelector('.coin-pill span').textContent=progress.coins;spUpsRender();
        const n=r.querySelectorAll('.sp-up')[SP_UP.findIndex(u=>u[0]===id)];if(n){n.classList.add('pop');}}}
    U.appendChild(c)})}
function spEarnRender(nw){const r=SPEL,E=r.querySelector('.sp-earn');E.innerHTML='';
  SP_EARN.forEach(id=>{const own=spHas(id),p=spEarnProg(id),c=document.createElement('div');c.className='sp-er'+(own?' own':'')+((nw||[]).includes(id)?' new':'');
    c.innerHTML=`<span class="ic">${SP_EIC[id]==='svg'?SP_DRONE:`<img src="art/${SP_EIC[id]}.webp" alt="">`}<i class="lk">🔒</i></span><span class="tx"><b></b><small class="ef"></small><small class="hw"></small>${!own&&p?`<span class="bar"><i style="width:${Math.round(100*p.a/p.b)}%"></i><em></em></span>`:''}</span>${own?'<span class="ok">✓</span>':''}`;
    c.querySelector('b').textContent=t('er_'+id);c.querySelector('.ef').textContent=t('ed_'+id);c.querySelector('.hw').textContent=own?t('spYours'):t('eh_'+id);if(!own&&p)c.querySelector('.bar em').textContent=t('spProg',{a:p.a,b:p.b});E.appendChild(c)});
  if(nw&&nw.length){popupToast(t('spNew'));sfx.flourish&&sfx.flourish(3)}}

/* ---------- the flight ---------- */
function spStop(){if(SPG){SPG.dead=true;cancelAnimationFrame(SPG.raf);if(SPG.off)SPG.off();SPG=null}}
// difficulty grows with every space level (by its own count, so adding later seasons never makes the early ones easier): T 0 at level 89, 1 at 299, up to 1.5 later
const spTier=k=>Math.min(1.5,k/21);
// longer too (Tzach): 4 waves at level 89, one more every 3 space levels, up to 10 waves; then the boss's big helper
function spWaves(k){const T=spTier(k),R=Math.min(4,3+Math.floor(T*2)),X=Math.min(6,Math.floor(k/3)),M=T>.5?2:1,
    EX=[{f:'swoop',n:10+Math.floor(T*8),mini:1},{f:'rocks',n:9+Math.floor(T*8),form:{rows:3,cols:5}},{f:'form',rows:R,cols:6,fire:1.5,mini:M},{f:'swoop',n:12+Math.floor(T*8),mini:M},{f:'rocks',n:12+Math.floor(T*8),form:{rows:R,cols:6}},{f:'form',rows:4,cols:6,fire:1.7,mini:2}];
  return[{f:'form',rows:Math.min(4,2+Math.floor(T*2)),cols:5},{f:'swoop',n:8+Math.floor(T*8),mini:1},{f:'rocks',n:7+Math.floor(T*8),form:{rows:2,cols:5}},...EX.slice(0,X),{f:'form',rows:R,cols:6,fire:1.4,mini:M},{f:'boss'}]}
function spStart(k){spHubStop();spStop();const r=spRoot(),D=spD();r.className='sp-game';
  r.innerHTML=`<div class="sp-bar"><button class="x-btn sp-pz-btn" aria-label="pause"><svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg></button><div class="sp-hearts"></div><div class="sp-wave"></div><div class="arc-score sp-coins">${coinImg()}<b>0</b></div></div><div class="sp-stage"><canvas></canvas><div class="sp-bhp" hidden><img alt=""><span><i></i></span></div></div>`;
  const st=r.querySelector('.sp-stage'),c=st.querySelector('canvas'),g=c.getContext('2d');
  const hearts=3+spLv('hull')+(spHas('gold')?1:0);
  const G=SPG={k,r,st,c,g,dead:false,run:false,over:false,el:0,last:performance.now(),waves:spWaves(k),wi:-1,en:[],bul:[],eb:[],drops:[],fx:[],txt:[],
    hearts,maxH:hearts,lost:0,inv:0,shield:spHas('xmasShield')?2:0,pod:spHas('pod'),pw:spHas('rainbow')?1:0,kills:0,coins:0,fireT:0,droneT:0,shake:0,boss:null,T:spTier(k),L:spLvOf(k),sid:spSid(k),pause:false,banner:null};
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
  r.querySelector('.sp-coins b').textContent=G.coins;const w=G.waves[G.wi],wv=r.querySelector('.sp-wave'),txt=w&&w.f==='boss'?t('spBossW'):t('spWave',{a:Math.max(1,G.wi+1),b:G.waves.length-1});if(wv.textContent!==txt)wv.textContent=txt;wv.classList.toggle('boss',!!(w&&w.f==='boss'))}
function spMon(G,k,x,y,o){const T=G.T,kind=1+(k%4),hp=1+Math.floor(T*2.5)+(kind===4?1:0);return Object.assign({k:'mon',pic:'arc_mon'+kind,x,y,hp,max:hp,r:G.u*.055,t:0,hit:0},o)}
// the world's mini-boss: its own picture once the graphics department draws it (sp_mini_<sid>_n), else a big minion
function spMiniBoss(G,i){const n=1+(i%2),own=SP_ART.includes('sp_mini_'+G.sid+'_'+n),hp=Math.round(10+G.T*28);
  return{k:'mboss',pic:own?'sp_mini_'+G.sid+'_'+n:'arc_mon'+(1+(G.k+i)%4),own,x:G.W*(i%2?.75:.25),y:-60,gy:G.H*(.14+.06*i),hp,max:hp,r:G.u*.1,t:0,hit:0,ph:i*3,fireT:1.5+i*.6}}
function spNextWave(G){G.wi++;const w=G.waves[G.wi];spHUD(G);if(!w)return spWin(G);const T=G.T,W=G.W,H=G.H;G.wt=0;G.spawnQ=[];
  if(w.f==='boss'){spBanner(G,t('spBossW'),t('spHelper',{b:spBossName(G.k)}),1.8);if(sfx.ok())sfx.roar&&sfx.roar();const sid=G.sid,hp=Math.round(60+G.T*300),own=SP_ART.includes('sp_help_'+sid);
    G.boss={sid,own,x:W/2,y:-G.u*.4,s:G.u*(own?.4:.32),hp,max:hp,t:0,atk:1.6,pat:0,hurt:0,in:1};const bh=G.r.querySelector('.sp-bhp');bh.hidden=false;bh.querySelector('img').src='art/'+(own?'sp_help_':'boss_')+sid+'.webp';return}
  spBanner(G,t('spWave',{a:G.wi+1,b:G.waves.length-1}),'',1.2);
  const form=f=>{const cw=Math.min(W*.8/f.cols,G.u*.15),x0=W/2-cw*(f.cols-1)/2;G.form={ox:0,t:0,fire:(.4+T*1.2)*(f.fire||1)};
    for(let rr=0;rr<f.rows;rr++)for(let cc=0;cc<f.cols;cc++){const m=spMon(G,rr+cc,x0+cc*cw,-40-rr*40,{f:1,gx:x0+cc*cw,gy:H*.1+rr*cw*.85+G.u*.05,enter:.4+cc*.06+rr*.15});G.en.push(m)}};
  if(w.mini)for(let i=0;i<w.mini;i++)G.spawnQ.push({at:1.2+i*2.5,mk:()=>{spBanner(G,t('spMini'),'',1);if(sfx.ok())tone({f:180,f2:90,d:.4,type:'sawtooth',v:.05});return spMiniBoss(G,i)}});
  if(w.f==='form')form(w);
  else if(w.f==='swoop'){for(let i=0;i<w.n;i++){const side=i%2?1:-1;G.spawnQ.push({at:.4+i*.45,mk:()=>spMon(G,i,side<0?W*.2:W*.8,-40,{sw:1,side,amp:W*(.25+.1*Math.sin(i)),cx:W/2,vy:G.u*(.28+T*.2),ph:i,fireT:1+Math.random()*2})})}}
  else if(w.f==='rocks'){for(let i=0;i<w.n;i++)G.spawnQ.push({at:.3+i*.55,mk:()=>{const r=G.u*(.05+Math.random()*.04);return{k:'rock',x:r+Math.random()*(W-2*r),y:-r*2,vy:G.u*(.25+Math.random()*.2+T*.15),vx:(Math.random()-.5)*G.u*.15,r,hp:2+Math.floor(T*3),rot:0,vr:(Math.random()-.5)*3,pts:Array.from({length:9},()=>.78+Math.random()*.3),hit:0}}});
    if(w.form)G.spawnQ.push({at:.3+w.n*.55,fn:()=>form(w.form)})}}
function spGunPat(L){return[[1,1],[2,1],[3,1],[3,1.3],[4,1.3],[5,1.3],[5,1.6],[7,1.6]][Math.min(7,L)]}
function spShoot(G){const L=spLv('gun')+G.pw,[n,dmg]=spGunPat(L),v=G.u*1.6,x=G.sx,y=G.sy-G.s*.9,pr=spHas('laser')?2:0;
  for(let i=0;i<n;i++){const off=i-(n-1)/2,par=n===2||(n===4&&Math.abs(off)<1);const a=par?0:off*.11,dx=par?off*G.s*.55:off*G.s*.2;G.bul.push({x:x+dx,y,vx:Math.sin(a)*v,vy:-Math.cos(a)*v,dmg,pierce:pr,hit:[]})}
  if(sfx.ok()&&!(G.shotN=(G.shotN||0)+1)%3)tone({f:880,f2:1300,d:.04,type:'square',v:.012})}
function spHurt(G,x,y){if(G.inv>0||G.over)return;if(G.shield>0){G.shield--;G.inv=.8;spText(G,t('spShield'),G.sx,G.sy-G.s*2,'#7ff3ff');if(sfx.ok())tone({f:1200,f2:600,d:.2,type:'triangle',v:.06});return}
  G.hearts--;G.lost++;G.inv=1.6;G.shake=.35;G.pw=Math.max(0,G.pw-1);vib([50,30,50]);sfx.heart();spBurst(G,G.sx,G.sy,['#ff6b7d','#ffd23f','#fff'],16);
  if(G.hearts<=0){if(G.pod){G.pod=false;G.hearts=2;G.inv=2.5;spText(G,t('spRescue'),G.sx,G.sy-G.s*2,'#7ef05a');sfx.flourish&&sfx.flourish(2)}else spLose(G)}spHUD(G)}
function spBurst(G,x,y,cols,n){for(let i=0;i<(n||10);i++)G.fx.push({x,y,vx:(Math.random()-.5)*400,vy:(Math.random()-.5)*400,life:.5+Math.random()*.3,c:pick(cols),s:2+Math.random()*4})}
function spText(G,s,x,y,c){G.txt.push({s,x,y,c:c||'#ffe24d',life:1})}
function spKill(G,e){G.kills++;spBurst(G,e.x,e.y,e.k==='rock'?['#c8b8a8','#8a7a6e','#fff']:['#ffd23f','#ff8ad8','#7ff3ff','#fff'],12);if(sfx.ok())noise({d:.08,v:.05,hp:900});
  // coins: every 2nd monster, every rock; a power star after every 14 kills (fixed, nothing random)
  if(e.k==='mboss'){G.shake=.3;sfx.boom&&sfx.boom();spBurst(G,e.x,e.y,['#ffd23f','#ff8a3d','#fff'],24);for(let i=0;i<5;i++)G.drops.push({k:'coin',x:e.x+(i-2)*14,y:e.y,vy:G.u*(.22+i*.02)});G.drops.push({k:'star',x:e.x,y:e.y,vy:G.u*.18});return}
  if(e.k==='rock'||G.kills%2===0)G.drops.push({k:'coin',x:e.x,y:e.y,vy:G.u*.22});if(G.kills%14===0)G.drops.push({k:'star',x:e.x,y:e.y,vy:G.u*.2})}
function spTick(G,dt){const W=G.W,H=G.H;G.el+=dt;
  // ship follows the finger
  const ox=G.sx;G.sx+=(G.tx-G.sx)*Math.min(1,dt*16);G.sy+=(G.ty-G.sy)*Math.min(1,dt*16);G.tilt+=(clamp((G.sx-ox)/(dt*500||1),-1,1)-G.tilt)*Math.min(1,dt*10);
  if(G.inv>0)G.inv-=dt;if(G.shake>0)G.shake-=dt;
  for(const p of G.fx){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96}G.fx=G.fx.filter(p=>p.life>0);
  for(const p of G.txt){p.life-=dt;p.y-=40*dt}G.txt=G.txt.filter(p=>p.life>0);
  if(!G.run||G.over)return;
  G.fireT-=dt;const rate=.2/(1+.14*spLv('rate'));if(G.fireT<=0){G.fireT+=rate;if(G.fireT<0)G.fireT=0;spShoot(G)}
  if(spHas('drones')){G.droneT-=dt;if(G.droneT<=0){G.droneT=.32;for(const d of [-1,1])G.bul.push({x:G.sx+d*G.s*1.45,y:G.sy,vx:0,vy:-G.u*1.5,dmg:.7,pierce:0,hit:[],dr:1})}}
  // spawns
  G.wt+=dt;if(G.spawnQ)for(const q of G.spawnQ)if(!q.done&&G.wt>=q.at){q.done=1;if(q.fn)q.fn();else G.en.push(q.mk())}
  // formation sways + drops goo
  if(G.form){const F=G.form;F.t+=dt;F.ox=Math.sin(F.t*.7)*W*.09;const fm=G.en.filter(e=>e.f);
    F.cd=(F.cd==null?1.2:F.cd)-dt;if(F.cd<=0&&fm.length){F.cd=(1/F.fire)*(.6+Math.random()*.8);const e=pick(fm.filter(e=>e.enter<=0)||fm);if(e&&e.enter<=0){const aim=G.T>.35&&Math.random()<.4;const v=G.u*(.38+G.T*.25);
      if(aim){const dx=G.sx-e.x,dy=G.sy-e.y,L=Math.hypot(dx,dy);G.eb.push({x:e.x,y:e.y+e.r,vx:dx/L*v,vy:dy/L*v,r:G.u*.018,c:'#ff5ad0'})}else G.eb.push({x:e.x,y:e.y+e.r,vx:0,vy:v,r:G.u*.022,c:'#7ef05a',goo:1})}}}
  for(const e of G.en){e.t+=dt;if(e.hit>0)e.hit-=dt;
    if(e.f){if(e.enter>0){e.enter-=dt;const k=Math.min(1,dt*3.5);e.x+=(e.gx+(G.form?G.form.ox:0)-e.x)*k;e.y+=(e.gy-e.y)*k}else{e.x=e.gx+G.form.ox;e.y=e.gy+Math.sin(G.form.t*2+e.gx*.05)*5}}
    else if(e.sw){e.y+=e.vy*dt;e.x=e.cx+e.side*Math.sin(e.t*1.4+e.ph)*e.amp*.9;e.fireT-=dt;if(e.fireT<=0&&e.y>0&&e.y<H*.6){e.fireT=2.5-G.T;const dx=G.sx-e.x,dy=G.sy-e.y,L=Math.hypot(dx,dy),v=G.u*(.4+G.T*.2);G.eb.push({x:e.x,y:e.y,vx:dx/L*v,vy:dy/L*v,r:G.u*.018,c:'#ff5ad0'})}if(e.y>H+50)e.gone=1}
    else if(e.k==='rock'){e.y+=e.vy*dt;e.x+=e.vx*dt;e.rot+=e.vr*dt;if(e.y>H+60)e.gone=1}
    if(e.k==='mboss'){if(e.y<e.gy)e.y+=(e.gy-e.y+20)*Math.min(1,dt*1.5);e.x=G.W/2+Math.sin(e.t*.8+e.ph)*G.W*.3;e.fireT-=dt;
      if(e.fireT<=0&&e.y>0){e.fireT=1.7-G.T*.5;const a0=Math.atan2(G.sy-e.y,G.sx-e.x),v=G.u*(.38+G.T*.18);for(let i=-1;i<=1;i++){const a=a0+i*.22;G.eb.push({x:e.x,y:e.y+e.r*.5,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:G.u*.02,c:'#ff8a3d'})}}}
    if(e.k==='mini'){e.y+=e.vy*dt;e.x+=Math.sin(e.t*3)*e.vx*dt;if(e.y>H+50)e.gone=1}
    if(!e.gone&&Math.hypot(e.x-G.sx,e.y-G.sy)<e.r+G.s*.6){if(G.inv<=0){spHurt(G);e.hp=0;spKill(G,e);e.gone=1}}}
  // boss
  const B=G.boss;if(B){B.t+=dt;if(B.hurt>0)B.hurt-=dt;const ph2=B.hp<B.max/2;
    if(B.in>0){B.in-=dt*.6;B.y+=(H*.2-B.y)*Math.min(1,dt*2.5)}else{B.x=W/2+Math.sin(B.t*(ph2?.95:.65))*Math.max(0,W/2-B.s*.6);B.y=H*.2+Math.sin(B.t*1.3)*G.u*.03;
      B.atk-=dt;if(B.atk<=0){B.atk=(1.9-G.T*.6)*(ph2?.7:1);const p=B.pat++%4,v=G.u*(.36+G.T*.18)*(ph2?1.15:1);
        if(p===0){const a0=Math.atan2(G.sy-B.y,G.sx-B.x),n=ph2?7:5;for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*.16;G.eb.push({x:B.x,y:B.y+B.s*.3,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:G.u*.02,c:'#ff5ad0'})}}
        else if(p===1){const n=ph2?16:12,o=B.t;for(let i=0;i<n;i++){const a=o+i/n*6.283;G.eb.push({x:B.x,y:B.y,vx:Math.cos(a)*v*.8,vy:Math.sin(a)*v*.8,r:G.u*.02,c:'#ffd23f'})}}
        else if(p===2){for(let i=0;i<6;i++)G.eb.push({x:W*(.1+i*.16)+Math.random()*20,y:-10-i*30,vx:0,vy:v*.9,r:G.u*.024,c:'#7ef05a',goo:1})}
        else if(G.en.length<4){for(let i=0;i<3;i++)G.en.push(spMon(G,i+G.k,B.x+(i-1)*B.s*.5,B.y+B.s*.3,{k:'mini',vy:G.u*(.2+G.T*.1),vx:G.u*.6,hp:1,max:1}))}
        if(sfx.ok())tone({f:220,f2:140,d:.18,type:'sawtooth',v:.04,filter:900})}}
    if(Math.hypot(B.x-G.sx,B.y-G.sy)<B.s*.45+G.s*.5)spHurt(G);
    G.r.querySelector('.sp-bhp i').style.width=Math.max(0,100*B.hp/B.max)+'%'}
  // player bullets
  for(const b of G.bul){b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.y<-20||b.x<-20||b.x>W+20){b.gone=1;continue}
    for(const e of G.en){if(e.gone||e.hp<=0||b.hit.includes(e))continue;if((e.f&&e.enter>0&&e.y<0))continue;if(Math.hypot(b.x-e.x,b.y-e.y)<e.r+4){e.hp-=b.dmg;e.hit=.08;b.hit.push(e);if(e.hp<=0){e.gone=1;spKill(G,e)}if(b.pierce--<=0){b.gone=1;break}}}
    if(!b.gone&&B&&B.in<=0&&Math.hypot(b.x-B.x,b.y-B.y)<B.s*.48){B.hp-=b.dmg;B.hurt=.1;b.gone=1;if(sfx.ok()&&Math.random()<.2)noise({d:.04,v:.03,hp:2000});if(B.hp<=0){spBossDown(G);break}}}
  G.bul=G.bul.filter(b=>!b.gone);G.en=G.en.filter(e=>!e.gone);
  // enemy shots
  const hr=G.s*.35;for(const b of G.eb){b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.y>H+20||b.y<-80||b.x<-20||b.x>W+20)b.gone=1;else if(Math.hypot(b.x-G.sx,b.y-G.sy)<b.r+hr){b.gone=1;spHurt(G)}}G.eb=G.eb.filter(b=>!b.gone);
  // drops (coin magnet)
  const mg=G.u*(.2+.1*spLv('mag'));for(const d of G.drops){const dx=G.sx-d.x,dy=G.sy-d.y,L=Math.hypot(dx,dy);if(L<mg){d.x+=dx/L*G.u*1.2*dt;d.y+=dy/L*G.u*1.2*dt}else d.y+=d.vy*dt;
    if(L<G.s*.9){d.gone=1;if(d.k==='coin'){G.coins++;sfx.coin(1)}else{G.pw=Math.min(2,G.pw+1);spText(G,t('spPower'),G.sx,G.sy-G.s*2,'#ff8ad8');sfx.perfect(3)}spHUD(G)}if(d.y>H+30)d.gone=1}G.drops=G.drops.filter(d=>!d.gone);
  // wave over?
  const w=G.waves[G.wi];if(w&&w.f!=='boss'&&!G.en.length&&(!G.spawnQ||G.spawnQ.every(q=>q.done))){G.form=null;G.next=(G.next||0)+dt;if(G.next>.8){G.next=0;spNextWave(G)}}}
function spBossDown(G){const B=G.boss;G.shake=.6;vib([80,40,80]);sfx.boom&&sfx.boom();for(let i=0;i<4;i++)setTimeout(()=>{if(G.dead)return;spBurst(G,B.x+(Math.random()-.5)*B.s,B.y+(Math.random()-.5)*B.s,['#ffd23f','#ff8a3d','#fff','#ff8ad8'],20)},i*120);
  for(let i=0;i<10;i++)G.drops.push({k:'coin',x:B.x+(Math.random()-.5)*B.s,y:B.y,vy:G.u*(.25+Math.random()*.2)});G.boss=null;G.eb=[];G.en=[];G.r.querySelector('.sp-bhp').hidden=true;
  setTimeout(()=>{if(!G.dead&&!G.over){for(const d of G.drops)if(d.k==='coin')G.coins++;G.drops=[];spHUD(G);spWin(G)}},1800)}
function spDraw(G){const g=G.g,W=G.W,H=G.H;g.setTransform(G.d,0,0,G.d,0,0);spSky(G,g,G.run&&!G.pause?.016:0);g.save();if(G.shake>0)g.translate((Math.random()-.5)*12*G.shake,(Math.random()-.5)*12*G.shake);
  for(const d of G.drops){if(d.k==='coin'){const im=hzPic('ic_coin'),r=G.u*.03;if(im)g.drawImage(im,d.x-r,d.y-r,r*2,r*2)}else{g.fillStyle='#ff8ad8';g.strokeStyle='#201c24';g.lineWidth=3;const r=G.u*.045;g.save();g.translate(d.x,d.y);g.rotate(G.el*2);spStar(g,0,0,r);g.stroke();g.fillStyle='#fff';spStar(g,0,0,r*.4);g.restore()}}
  for(const e of G.en){if(e.k==='rock'){spRock(g,e);continue}
    if(e.k==='mboss'){const im=hzPic(e.pic),r=e.r*1.3;g.save();g.translate(e.x,e.y);if(e.hit>0)g.globalAlpha=.6;if(im)g.drawImage(im,-r,-r,r*2,r*2);g.globalAlpha=1;
      if(!e.own){g.fillStyle='#ffd23f';g.strokeStyle='#201c24';g.lineWidth=2.5;g.beginPath();g.moveTo(-r*.45,-r*.8);g.lineTo(-r*.45,-r*1.12);g.lineTo(-r*.22,-r*.95);g.lineTo(0,-r*1.2);g.lineTo(r*.22,-r*.95);g.lineTo(r*.45,-r*1.12);g.lineTo(r*.45,-r*.8);g.closePath();g.fill();g.stroke()}
      g.fillStyle='rgba(18,13,43,.8)';spRR(g,-r*.7,r*1.05,r*1.4,7,3.5);g.fill();g.fillStyle='#ff5a7a';spRR(g,-r*.7+1,r*1.05+1,(r*1.4-2)*Math.max(0,e.hp/e.max),5,2.5);g.fill();g.restore();continue}const im=hzPic(e.pic),r=e.r*1.25;g.save();g.translate(e.x,e.y);g.rotate(Math.sin(e.t*3)*.12);if(e.hit>0){g.globalAlpha=.6}
    if(im)g.drawImage(im,-r,-r,r*2,r*2);else{g.fillStyle='#7a4af0';g.beginPath();g.arc(0,0,e.r,0,7);g.fill()}
    // tiny space helmet on every minion
    g.globalAlpha=1;g.fillStyle='rgba(170,220,255,.13)';g.strokeStyle='rgba(220,240,255,.55)';g.lineWidth=2;g.beginPath();g.arc(0,0,r*1.02,0,7);g.fill();g.stroke();g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=3;g.beginPath();g.arc(0,0,r*.8,3.7,4.4);g.stroke();g.restore()}
  if(G.boss)spDrawBoss(g,G.boss,G.el);
  for(const b of G.eb){g.fillStyle=b.c;g.strokeStyle='#201c24';g.lineWidth=2;g.beginPath();if(b.goo)g.ellipse(b.x,b.y,b.r*.85,b.r*1.15,0,0,7);else g.arc(b.x,b.y,b.r,0,7);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(b.x-b.r*.3,b.y-b.r*.3,b.r*.3,0,7);g.fill()}
  for(const b of G.bul){const rb=spHas('rainbow');g.fillStyle=b.dr?'#4ee6ff':rb?`hsl(${(b.y*.8)%360},95%,70%)`:'#fff6a8';g.shadowColor=b.dr?'#4ee6ff':'#ffd23f';g.shadowBlur=8;spRR(g,b.x-2.5,b.y-9,5,18,2.5);g.fill()}g.shadowBlur=0;
  if(!G.over||G.won){const blink=G.inv>0&&Math.floor(G.el*14)%2;if(!blink)spDrawShip(g,G.sx,G.sy,G.s,spShipLook(G.el,{tilt:G.tilt,shield:G.shield,mood:G.inv>0?'scared':'happy',drones:spHas('drones'),gun:Math.min(5,spLv('gun')+G.pw)}))}
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
const SP_ICON='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4c6 4 8 11 7 19l-7 4-7-4c-1-8 1-15 7-19z" fill="#fff" stroke="#120d2b" stroke-width="2.6" stroke-linejoin="round"/><circle cx="20" cy="15" r="4" fill="#4ee6ff" stroke="#120d2b" stroke-width="2.2"/><path d="M13 21l-5 7 6-1M27 21l5 7-6-1" fill="#ff5a7a" stroke="#120d2b" stroke-width="2.4" stroke-linejoin="round"/><path d="M17 29q3 8 6 0" fill="#ffb23f" stroke="#120d2b" stroke-width="2"/></svg>';
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
