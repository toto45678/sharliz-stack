/* ===== v44: 22 new mechanics & enemies for seasons 2-4 (+ storm lightning) =====
   Each mechanic belongs to one stage (MECH[k].sid) and becomes that stage's "primary" hazard (intro card, shows up often);
   later stages of the same season mix in the earlier ones. Types:
     event   – started by the hazard timer (startEvent), one at a time, ends by itself
     swinger – changes the next swinging Sharliz (started like an event)
     passive – always running in its stage (lava, dunes, waves, conveyor)
   Hooks (wrappers below): startEvent, updateHazards, drawHazardsBack/Front, hzTap, hzOnLanding, resetHazards,
   demoLoop, maybeIntro, drawSharliz, drawKindFront. hzList/hzPrimary are routed here by build.py patches. */
Object.assign(I18N.en,{
  hz_bats:'Bats!',hzc_bats:'Bats swoop through and bump the swinging Sharliz off its rhythm. Tap a bat to scare it away.',
  hz_blackout:'Blackout!',hzc_blackout:'The street lights go out! Land a PERFECT to bring the power back.',
  hz_scorpion:'Scorpion!',hzc_scorpion:'A scorpion climbs the tower. If it reaches the top it stings a Sharliz off. Tap it to flick it away.',
  hz_jelly:'Jelly Sharliz!',hzc_jelly:'This one is bouncy: if the landing is not perfect it bounces further off-center.',
  hz_icicle:'Icicles!',hzc_icicle:'An icicle grows above the tower and drops on the top. Tap it to shatter it first.',
  hz_jellyfish:'Glow jellyfish!',hzc_jellyfish:'Jellyfish float up. Drop a Sharliz through one and it gets zapped sideways. Tap them to pop them.',
  hz_lava:'Rising lava!',hzc_lava:'Lava rises from below. Keep building faster than it climbs — perfect landings cool it down.',
  hz_portal:'Portals!',hzc_portal:'Portals on both sides: the swinging Sharliz goes in one side and comes out the other.',
  hz_tornado:'Tornado!',hzc_tornado:'A tornado pulls everything to one side. A PERFECT landing anchors the tower.',
  hz_newspaper:'Flying newspaper!',hzc_newspaper:'The storm slaps a newspaper over your view. Tap to tear it off.',
  hz_dunes:'Shifting dunes!',hzc_dunes:'The sand slides the whole tower slowly left and right. Aim for where it will be!',
  hz_hail:'Candy hail!',hzc_hail:'Candy hail knocks the top Sharliz a little off-center. A PERFECT landing stops it.',
  hz_freeze:'Freeze!',hzc_freeze:'The swinging Sharliz freezes for a moment — then swings faster when it thaws.',
  hz_waves:'Big waves!',hzc_waves:'Waves rock the tower back and forth. Time your drop with the swell.',
  hz_meteor:'Meteor!',hzc_meteor:'A meteor targets the swing path. Drop before it hits — or tap the meteor to smash it.',
  hz_gravity:'Low gravity!',hzc_gravity:'Gravity drops: Sharliz fall slowly and the wind pushes them longer.',
  hz_lightning:'Lightning!',hzc_lightning:'A storm cloud charges over the tower and strikes the top. Tap the cloud to break it up.',
  hz_monkey:'Monkey!',hzc_monkey:'A monkey swings in on a vine to snatch the swinging Sharliz. Tap it to scare it off.',
  hz_ghost:'Ghost!',hzc_ghost:'A ghost makes the swinging Sharliz invisible for a while. Tap the ghost to banish it.',
  hz_cloud:'Drifting cloud!',hzc_cloud:'Drop a Sharliz into a cloud and it floats down slowly, drifting with the cloud.',
  hz_egg:'Dino egg!',hzc_egg:'An egg lands on top of the tower. Tap it before it hatches — the baby dino stomps!',
  hz_conveyor:'Conveyor!',hzc_conveyor:'The top Sharliz rides a conveyor and slides after it lands. Catch it fast!',
  hz_mirror:'Mirror!',hzc_mirror:'Crystal magic flips the whole world left to right for a few seconds.',
  s2_title:'Season 2: Night',s2_cap:'It is dark! You only see what the tower lantern and the swinging Sharliz light up. Tap fireflies for extra light.',
  s3_title:'Season 3: Storm',s3_cap:'Rain makes every landing slippery: anything less than PERFECT slides a little. Watch out for lightning!',
  s4_title:'Season 4: New Worlds',s4_cap:'Six brand new worlds, each with its own surprise. Good luck!',
  m_bump:'Bump!',m_scared:'Shoo!',m_power:'Power back!',m_stung:'Stung!',m_flick:'Flicked!',m_boing:'Boing!',m_gummy:'Gummy!',m_crash:'Crash!',m_shatter:'Shattered!',
  m_zap:'Zap!',m_cooled:'Cooled!',m_burn:'Too hot!',m_anchor:'Anchored!',m_torn:'Torn!',m_frozen:'Frozen!',m_burned:'Burned!',m_smash:'Smash!',m_grab:'Grabbed!',
  m_boo:'Boo!',m_banish:'Banished!',m_float:'Floaty!',m_hatch:'Stomp!',m_gotEgg:'Got it!',m_slide:'Slip!',m_light:'More light!',m_struck:'Struck!',m_clear:'Cleared!',m_calm:'Calm!'});
Object.assign(I18N.he,{
  hz_bats:'עטלפים!',hzc_bats:'עטלפים חולפים ודוחפים את השארליז שמתנדנד. הקישו על עטלף כדי להבריח אותו.',
  hz_blackout:'הפסקת חשמל!',hzc_blackout:'האורות כבים! נחיתה מושלמת מחזירה את החשמל.',
  hz_scorpion:'עקרב!',hzc_scorpion:'עקרב מטפס על המגדל. אם יגיע למעלה הוא עוקץ שארליז ומפיל אותו. הקישו עליו כדי לעוף אותו.',
  hz_jelly:'שארליז ג׳לי!',hzc_jelly:'הוא קופצני: אם הנחיתה לא מושלמת, הוא קופץ עוד יותר הצידה.',
  hz_icicle:'נטיפי קרח!',hzc_icicle:'נטיף גדל מעל המגדל ונופל על הראש. הקישו עליו כדי לנפץ אותו קודם.',
  hz_jellyfish:'מדוזות זוהרות!',hzc_jellyfish:'מדוזות עולות למעלה. שארליז שנופל דרכן מקבל זרם ונזרק הצידה. הקישו כדי לפוצץ אותן.',
  hz_lava:'לבה עולה!',hzc_lava:'לבה עולה מלמטה. תבנו מהר יותר ממנה – נחיתה מושלמת מקררת אותה.',
  hz_portal:'פורטלים!',hzc_portal:'פורטלים משני הצדדים: השארליז נכנס בצד אחד ויוצא מהשני.',
  hz_tornado:'טורנדו!',hzc_tornado:'טורנדו מושך הכל לצד אחד. נחיתה מושלמת מעגנת את המגדל.',
  hz_newspaper:'עיתון עף!',hzc_newspaper:'הסערה מדביקה עיתון על המסך. הקישו כדי לקרוע אותו.',
  hz_dunes:'דיונות זזות!',hzc_dunes:'החול מזיז את כל המגדל לאט ימינה ושמאלה. כוונו לאן שהוא יהיה!',
  hz_hail:'ברד סוכריות!',hzc_hail:'ברד של סוכריות מזיז את השארליז העליון קצת הצידה. נחיתה מושלמת עוצרת אותו.',
  hz_freeze:'הקפאה!',hzc_freeze:'השארליז שמתנדנד קופא לרגע – ואחרי שהוא מפשיר הוא מתנדנד מהר יותר.',
  hz_waves:'גלים גדולים!',hzc_waves:'גלים מנדנדים את המגדל הלוך ושוב. תתזמנו את הנפילה עם הגל.',
  hz_meteor:'מטאור!',hzc_meteor:'מטאור מכוון למסלול הנדנוד. שחררו לפני שהוא פוגע – או הקישו על המטאור כדי לנפץ אותו.',
  hz_gravity:'כוח משיכה נמוך!',hzc_gravity:'כוח המשיכה יורד: השארליזים נופלים לאט והרוח דוחפת אותם יותר.',
  hz_lightning:'ברק!',hzc_lightning:'ענן סערה נטען מעל המגדל ומכה בראש. הקישו על הענן כדי לפזר אותו.',
  hz_monkey:'קוף!',hzc_monkey:'קוף מגיע על ליאנה כדי לחטוף את השארליז שמתנדנד. הקישו עליו כדי להבריח אותו.',
  hz_ghost:'רוח רפאים!',hzc_ghost:'רוח רפאים הופכת את השארליז שמתנדנד לשקוף לזמן מה. הקישו על הרוח כדי לגרש אותה.',
  hz_cloud:'ענן נודד!',hzc_cloud:'שארליז שנופל לתוך ענן יורד לאט ונסחף עם הענן.',
  hz_egg:'ביצת דינוזאור!',hzc_egg:'ביצה נוחתת על ראש המגדל. הקישו עליה לפני שהיא בוקעת – הדינו הקטן רוקע!',
  hz_conveyor:'מסוע!',hzc_conveyor:'השארליז העליון יושב על מסוע ומחליק אחרי שהוא נוחת. תתפסו אותו מהר!',
  hz_mirror:'מראה!',hzc_mirror:'קסם הקריסטלים הופך את כל העולם מימין לשמאל לכמה שניות.',
  s2_title:'עונה 2: לילה',s2_cap:'חושך! רואים רק מה שהפנס על המגדל והשארליז המתנדנד מאירים. הקישו על גחליליות בשביל עוד אור.',
  s3_title:'עונה 3: סערה',s3_cap:'הגשם הופך כל נחיתה לחלקלקה: כל מה שפחות ממושלם מחליק קצת. היזהרו מברקים!',
  s4_title:'עונה 4: עולמות חדשים',s4_cap:'שישה עולמות חדשים לגמרי, ולכל אחד הפתעה משלו. בהצלחה!',
  m_bump:'בום!',m_scared:'קישטה!',m_power:'החשמל חזר!',m_stung:'עקיצה!',m_flick:'עף!',m_boing:'בוינג!',m_gummy:'גומי!',m_crash:'טראח!',m_shatter:'התנפץ!',
  m_zap:'זאפ!',m_cooled:'התקרר!',m_burn:'חם מדי!',m_anchor:'מעוגן!',m_torn:'נקרע!',m_frozen:'קפוא!',m_burned:'נשרף!',m_smash:'ריסוק!',m_grab:'נחטף!',
  m_boo:'בו!',m_banish:'גורש!',m_float:'מרחף!',m_hatch:'רקיעה!',m_gotEgg:'תפסת!',m_slide:'החליק!',m_light:'עוד אור!',m_struck:'נפגע!',m_clear:'התפזר!',m_calm:'נרגע!'});

const MECH_OF={farmN:'bats',cityN:'blackout',desertN:'scorpion',candyN:'jelly',snowN:'icicle',oceanN:'jellyfish',volcanoN:'lava',spaceN:'portal',
  farmS:'tornado',cityS:'newspaper',desertS:'dunes',candyS:'hail',snowS:'freeze',oceanS:'waves',volcanoS:'meteor',spaceS:'gravity',
  jungle:'monkey',castle:'ghost',clouds:'cloud',dino:'egg',factory:'conveyor',crystal:'mirror'};
const MECH={};   // filled below
let nightExtra=0,lightBoost=0;
const mOn=k=>hz.m&&hz.m[k];
const mBusy=()=>!!(hz.crow||hz.octo||hz.quake||hz.gust||hz.ink||(hz.m&&Object.keys(hz.m).some(k=>MECH[k]&&MECH[k].type!=='passive'&&hz.m[k])));
const pts=(n)=>{score+=n;trick();updateHud()};
const outlineFill=(fill,lw=2.5)=>{ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=lw;ctx.strokeStyle=INK;ctx.stroke()};
function eyes(x,y,r,gap){ctx.fillStyle=EYE;ctx.strokeStyle=INK;ctx.lineWidth=1.5;for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(x+s*gap,y,r*.8,r,0,0,7);ctx.fill();ctx.stroke()}}

/* ---------- little enemy drawings (vector, Lilita-style ink outlines) ---------- */
function drawBat(x,y,t,flip){ctx.save();ctx.translate(x,y);ctx.scale(flip?-1:1,1);const f=Math.sin(t*22)*.6,w=S*.8;
  for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*w*.15,0);ctx.quadraticCurveTo(s*w*.6,-w*(.55+f*.3),s*w,-w*.1*f);ctx.lineTo(s*w*.75,w*.12);ctx.lineTo(s*w*.55,0);ctx.lineTo(s*w*.35,w*.12);ctx.closePath();outlineFill('#4b2a6e',2)}
  ctx.beginPath();ctx.ellipse(0,0,w*.24,w*.28,0,0,7);outlineFill('#2e1a48',2);
  ctx.beginPath();ctx.moveTo(-w*.17,-w*.18);ctx.lineTo(-w*.12,-w*.4);ctx.lineTo(-w*.04,-w*.22);ctx.moveTo(w*.17,-w*.18);ctx.lineTo(w*.12,-w*.4);ctx.lineTo(w*.04,-w*.22);outlineFill('#2e1a48',2);
  eyes(0,-w*.04,w*.07,w*.09);ctx.restore()}
function drawScorpion(x,y,t,dir){ctx.save();ctx.translate(x,y);ctx.scale(dir,1);const s=S*.55;
  ctx.lineWidth=2.5;ctx.strokeStyle=INK;for(let i=0;i<3;i++){const k=Math.sin(t*16+i)*3;ctx.beginPath();ctx.moveTo(-s*.2+i*s*.22,s*.12);ctx.lineTo(-s*.35+i*s*.22,s*.42+k);ctx.stroke()}
  ctx.beginPath();ctx.ellipse(0,0,s*.55,s*.3,0,0,7);outlineFill('#d97a2b');
  let px=-s*.5,py=-s*.05;for(let i=0;i<4;i++){const a=-1.9-i*.42+Math.sin(t*4)*.1,nx=px+Math.cos(a)*s*.32,ny=py+Math.sin(a)*s*.32;ctx.beginPath();ctx.arc(nx,ny,s*(.17-i*.02),0,7);outlineFill('#c4651f',2);px=nx;py=ny}
  ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+s*.25,py+s*.05);ctx.lineTo(px+s*.05,py+s*.22);ctx.closePath();outlineFill('#ffd23f',2);
  for(const sy2 of[-1,1]){ctx.beginPath();ctx.ellipse(s*.62,sy2*s*.22,s*.17,s*.1,sy2*.4,0,7);outlineFill('#c4651f',2)}
  eyes(s*.32,-s*.08,s*.07,s*.09);ctx.restore()}
function drawIcicle(x,y,len,a=1){ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);const w=S*.42;ctx.beginPath();ctx.moveTo(-w/2,0);ctx.lineTo(w/2,0);ctx.lineTo(0,len);ctx.closePath();
  const g=ctx.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,'#e8fbff');g.addColorStop(1,'#8fd7f2');outlineFill(g,2.5);
  ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-w*.22,len*.08);ctx.lineTo(-w*.04,len*.6);ctx.stroke();ctx.restore()}
function drawJellyfish(x,y,t,a=1){ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);const r=S*.5;
  ctx.strokeStyle='rgba(186,140,255,.8)';ctx.lineWidth=3;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*r*.3,r*.1);for(let k=1;k<6;k++)ctx.lineTo(i*r*.3+Math.sin(t*5+k+i)*r*.12,r*.1+k*r*.22);ctx.stroke()}
  const g=ctx.createRadialGradient(0,-r*.2,r*.1,0,0,r*1.6);g.addColorStop(0,'rgba(255,220,255,.95)');g.addColorStop(.5,'rgba(196,140,255,.85)');g.addColorStop(1,'rgba(196,140,255,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r*1.6,0,7);ctx.fill();
  ctx.beginPath();ctx.ellipse(0,0,r,r*.75,0,Math.PI,0);ctx.closePath();outlineFill('rgba(214,170,255,.95)',2.5);eyes(0,-r*.32,r*.12,r*.2);ctx.restore()}
function drawPortal(x,y,t,a=1){ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);const r=S*.85;
  for(let i=0;i<4;i++){ctx.save();ctx.rotate(t*(2+i*.6)*(i%2?-1:1));ctx.strokeStyle=['#22d3ee','#c084fc','#ff3ea5','#ffffff'][i];ctx.lineWidth=4-i*.6;ctx.beginPath();ctx.ellipse(0,0,r*(.45+i*.15),r*(.9+i*.1),0,0,Math.PI*1.4);ctx.stroke();ctx.restore()}
  const g=ctx.createRadialGradient(0,0,2,0,0,r);g.addColorStop(0,'rgba(20,10,60,.9)');g.addColorStop(1,'rgba(20,10,60,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,r*.45,r*.9,0,0,7);ctx.fill();ctx.restore()}
function drawFunnel(x,y0,y1,t){ctx.save();const h=y1-y0;for(let i=0;i<12;i++){const k=i/11,yy=y0+k*h,w=S*(.25+ (1-k)*1.6),wob=Math.sin(t*6+i)*S*.25*(1-k);
  ctx.strokeStyle=`rgba(${190-i*4},${195-i*4},${210-i*4},${.75-k*.3})`;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(x+wob,yy,w,w*.22,0,0,7);ctx.stroke()}ctx.restore()}
function drawNewspaper(x,y,w,h,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.beginPath();ctx.rect(-w/2,-h/2,w,h);outlineFill('#f4efe2',3);
  ctx.fillStyle='#1d1b22';ctx.font=`${Math.round(h*.16)}px "Lilita One","Secular One",system-ui,sans-serif`;ctx.textAlign='center';ctx.fillText(lang==='he'?'חדשות הסערה':'STORM NEWS',0,-h*.28);
  ctx.fillStyle='#b9b2a3';for(let i=0;i<6;i++){ctx.fillRect(-w*.42,-h*.12+i*h*.1,w*(i%3===2?.5:.84),h*.035)}ctx.fillStyle='#9ec5e8';ctx.fillRect(w*.12,-h*.12,w*.3,h*.3);ctx.restore()}
function drawCandy(x,y,c,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);const r=S*.17;ctx.beginPath();ctx.arc(0,0,r,0,7);outlineFill(c,2);
  ctx.beginPath();ctx.moveTo(r,0);ctx.lineTo(r*1.8,-r*.6);ctx.lineTo(r*1.8,r*.6);ctx.closePath();outlineFill(c,2);ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(-r*1.8,-r*.6);ctx.lineTo(-r*1.8,r*.6);ctx.closePath();outlineFill(c,2);ctx.restore()}
function drawMeteor(x,y,t){ctx.save();ctx.translate(x,y);for(let i=0;i<6;i++){ctx.fillStyle=`rgba(255,${120+i*20},40,${.5-i*.07})`;ctx.beginPath();ctx.arc(-i*S*.18,-i*S*.22,S*(.42-i*.04),0,7);ctx.fill()}
  ctx.rotate(t*3);ctx.beginPath();for(let i=0;i<9;i++){const a=i/9*Math.PI*2,r=S*.38*(i%2?.85:1);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();outlineFill('#5a3a2e',2.5);
  ctx.fillStyle='#3b241c';ctx.beginPath();ctx.arc(S*.1,-S*.08,S*.09,0,7);ctx.arc(-S*.12,S*.1,S*.06,0,7);ctx.fill();ctx.restore()}
function drawStormCloud(x,y,w,charge){ctx.save();ctx.translate(x,y);ctx.fillStyle=mix('#5b6478','#2b3142',charge);ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();
  for(const [dx,dy,r] of [[-.35,.05,.3],[-.1,-.12,.36],[.2,-.05,.32],[.4,.08,.24],[0,.12,.3]]){ctx.moveTo(dx*w+r*w,dy*w);ctx.arc(dx*w,dy*w,r*w,0,7)}ctx.fill();ctx.stroke();
  if(charge>.5&&Math.floor(time*10)%2){ctx.strokeStyle='#fff6a8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-w*.1,w*.25);ctx.lineTo(w*.02,w*.38);ctx.lineTo(-w*.05,w*.4);ctx.lineTo(w*.08,w*.55);ctx.stroke()}ctx.restore()}
function drawMonkey(x,y,t,flip){ctx.save();ctx.translate(x,y);ctx.scale(flip?-1:1,1);const s=S*.6;
  ctx.beginPath();ctx.ellipse(0,s*.35,s*.38,s*.42,0,0,7);outlineFill('#8a5a33');ctx.beginPath();ctx.arc(0,-s*.15,s*.42,0,7);outlineFill('#8a5a33');
  for(const e of[-1,1]){ctx.beginPath();ctx.arc(e*s*.42,-s*.2,s*.15,0,7);outlineFill('#d9a774',2)}
  ctx.beginPath();ctx.ellipse(0,-s*.05,s*.28,s*.24,0,0,7);outlineFill('#e8c29a',2);eyes(0,-s*.24,s*.08,s*.12);
  ctx.lineWidth=5;ctx.strokeStyle='#8a5a33';ctx.beginPath();ctx.moveTo(s*.2,s*.1);ctx.quadraticCurveTo(s*.5,-s*.5,s*.15,-s*1.05);ctx.stroke();ctx.restore()}
function drawGhostE(x,y,t,a=1){ctx.save();ctx.globalAlpha=.85*a;ctx.translate(x,y+Math.sin(t*3)*4);const s=S*.6;ctx.beginPath();ctx.moveTo(-s*.5,s*.5);ctx.lineTo(-s*.5,-s*.1);ctx.arc(0,-s*.1,s*.5,Math.PI,0);ctx.lineTo(s*.5,s*.5);
  for(let i=0;i<4;i++){const xx=s*.5-(i+.5)*s*.25;ctx.quadraticCurveTo(xx+s*.06,s*(.62+.08*Math.sin(t*8+i)),xx-s*.12,s*.5)}ctx.closePath();outlineFill('#f2f4ff');
  ctx.fillStyle=INK;for(const e of[-1,1]){ctx.beginPath();ctx.ellipse(e*s*.17,-s*.12,s*.07,s*.11,0,0,7);ctx.fill()}ctx.beginPath();ctx.ellipse(0,s*.12,s*.08,s*.1,0,0,7);ctx.fill();ctx.restore()}
function drawCloudE(x,y,w,a=1){ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.fillStyle='#ffffff';ctx.strokeStyle='rgba(32,28,36,.55)';ctx.lineWidth=2.5;ctx.beginPath();
  for(const [dx,dy,r] of [[-.35,.05,.26],[-.12,-.1,.32],[.15,-.08,.3],[.38,.06,.22],[0,.1,.28]]){ctx.moveTo(dx*w+r*w,dy*w);ctx.arc(dx*w,dy*w,r*w,0,7)}ctx.fill();ctx.stroke();ctx.restore()}
function drawEgg(x,y,crack,t){ctx.save();ctx.translate(x,y);const w=S*.42,h=S*.55,wob=crack>.6?Math.sin(t*30)*.08:0;ctx.rotate(wob);ctx.beginPath();ctx.ellipse(0,-h*.5,w,h,0,0,7);outlineFill('#f6efd2');
  ctx.fillStyle='#8bc34a';for(const [dx,dy,r] of [[-.4,-.7,.16],[.3,-.45,.12],[-.1,-.25,.1],[.35,-.95,.1]]){ctx.beginPath();ctx.arc(dx*w,dy*h,r*w*2,0,7);ctx.fill()}
  if(crack>.15){ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-w*.8,-h*.55);let xx=-w*.8;for(let i=0;i<6;i++){xx+=w*.27;ctx.lineTo(xx,-h*.55+(i%2?-1:1)*h*.12*Math.min(1,crack*1.5))}ctx.stroke()}ctx.restore()}

/* ---------- the mechanics ---------- */
const swingScr=()=>({x:swinger?xOf(swinger.xs):W/2,y:sy(swingY())});
function loseSwinger(msg,col){if(!swinger)return;const s=swinger,x=xOf(s.xs),y=swingY();swinger=null;bodies.push({s,x,y,vx:rnd(-1,1)*S*3,vy:-BH*1.6,rot:0,vr:rnd(-6,6),mood:'scared'});combo=0;state='wait';spawnAt=time+.8;popup(msg,x,y-BH*.6,col||'#ff8a00');sfx.slide();vib(30);updateHud()}
const ev=(type,o)=>Object.assign({type},o);
Object.assign(MECH,{
  bats:ev('event',{start(){const side=Math.random()<.5?-1:1,y=sy(swingY());hz.m.bats={t:0,list:[0,1,2].map(i=>({x:side<0?-60:W+60,y:y+rnd(-BH*.35,BH*.35),vx:-side*W/2.4*rnd(.9,1.15),d:i*.55,hit:false,gone:false,vy:0}))};sfx.caw();return true},
    update(dt,m){m.t+=dt;let alive=0;for(const b of m.list){if(m.t<b.d){alive++;continue}if(b.gone)continue;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.vy<0)b.vy-=600*dt;
        if(!b.hit&&!b.vy&&swinger&&!swinger.entering&&state==='aim'){const s=swingScr();if(Math.hypot(b.x-s.x,b.y-s.y)<S*.95){b.hit=true;swinger.dir*=-1;swinger.xs+=Math.sign(b.vx)*.22;jig(swinger,1.2);popup(t('m_bump'),s.x,swingY()-BH*.6,'#c084fc');sfx.caw()}}
        if(b.x<-90||b.x>W+90||b.y<-80)b.gone=true;else alive++}if(!alive)delete hz.m.bats},
    draw(m){for(const b of m.list)if(m.t>=b.d&&!b.gone){drawBat(b.x,b.y,time+b.d,b.vx>0);if(!b.vy&&Math.floor(time*3)%2)tapRing(b.x,b.y,S*.9)}},
    tap(px,py,m){for(const b of m.list)if(m.t>=b.d&&!b.gone&&!b.vy&&Math.hypot(px-b.x,py-b.y)<S){b.vy=-260;pts(15);popup(t('m_scared'),b.x,scrToW(b.y)-BH*.4,'#a3e635');sfx.pop();return true}return false},
    demo(p,H_){const x=280-p*170,y=H_.at(2)-10;drawBat(x,y,p*3,false);if(p>.6&&p<1.2)H_.ring(x,y,22)}}),
  blackout:ev('event',{start(){if(curSeason()!==2)return false;hz.m.blackout={t:0,warn:1.3,dur:3.4};sfx.creak();return true},
    update(dt,m){m.t+=dt;nightExtra=m.t<m.warn?(Math.random()<.35?.32:0):.34;if(m.t>m.warn+m.dur){nightExtra=0;delete hz.m.blackout}},
    landing(perfect,great,d,m){if(perfect&&m.t>m.warn){nightExtra=0;delete hz.m.blackout;pts(25);popup(t('m_power'),W/2,swingY()-BH*.3,'#ffe24d')}},
    demo(p,H_,g){g.fillStyle=`rgba(4,6,26,${p<1?(Math.floor(p*8)%2?.5:.1):p<2.2?.85:.1})`;g.fillRect(0,0,280,190)}}),
  scorpion:ev('event',{start(){if(tower.length<4)return false;hz.m.scorpion={t:0,c:0,side:Math.random()<.5?-1:1,fly:null};return true},
    update(dt,m,live){m.t+=dt;if(m.fly){m.fly.x+=m.fly.vx*dt;m.fly.y+=m.fly.vy*dt;m.fly.vy+=900*dt;m.fly.r+=dt*12;if(m.fly.y>H+60)delete hz.m.scorpion;return}
      m.c+=dt/(.62-lvInZone()*.015);if(m.c>=tower.length-1){if(live&&tower.length>2){knockTop(1,m.side);popup(t('m_stung'),W/2,swingY()-BH*.3,'#ff8a00');sfx.splat();vib(40)}delete hz.m.scorpion}},
    pos(m){const i=Math.min(tower.length-1,Math.floor(m.c)),f=m.c-i,s0=tower[i],s1=tower[Math.min(tower.length-1,i+1)],xs=s0.xs+(s1.xs-s0.xs)*f;return {x:xOf(xs)+m.side*S*.55,y:sy(yOf(i)-(yOf(i)-yOf(i+1))*f)}},
    draw(m){if(m.fly){drawScorpion(m.fly.x,m.fly.y,time,m.side);return}const p=this.pos(m);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-m.side*Math.PI/2);drawScorpion(0,0,time,1);ctx.restore();if(Math.floor(time*3)%2)tapRing(p.x,p.y,S*.8)},
    tap(px,py,m){if(m.fly)return false;const p=this.pos(m);if(Math.hypot(px-p.x,py-p.y)<S*1.05){m.fly={x:p.x,y:p.y,vx:m.side*420,vy:-360,r:0};pts(20);popup(t('m_flick'),p.x,scrToW(p.y)-BH*.4,'#a3e635');sfx.pop();return true}return false},
    demo(p,H_){const y=H_.at(0)+20-Math.min(1,p/2)*70;drawScorpion(H_.cx+30,y,p*4,1);if(p>.8&&p<1.6)H_.ring(H_.cx+30,y,20)}}),
  jelly:ev('swinger',{start(){if(!swinger||swinger.kind||swinger.gold||state!=='aim')return false;if(shieldBlocks())return true;swinger.kind='jelly';return true},
    landing(perfect,great,d){if(d.kind!=='jelly')return;d.kind=null;if(perfect){pts(20);popup(t('m_gummy'),xOf(d.xs),yOf(tower.length-1)-BH*1.1,'#ff9ecf');return}
      const prev=tower[tower.length-2];if(!prev)return;const dx=d.xs-prev.xs;d.xs+=dx*.7;jig(d,2.6);d.squash=1;popup(t('m_boing'),xOf(d.xs),yOf(tower.length-1)-BH*1.1,'#ff9ecf');sfx.pop()},
    demo(p,H_){const e=Math.min(1,p/1.1);let y=20+(H_.at(1)-20)*e*e,x=H_.cx+16;if(p>1.1){const q=p-1.1;x+=Math.min(q,.4)*45;y-=Math.sin(Math.min(1,q/.4)*Math.PI)*24}drawSharliz(H_.m,x,y);jellyGlow(x,y)}}),
  icicle:ev('event',{start(){const tp=topScreen();hz.m.icicle={t:0,warn:1.9+Math.max(0,.6-lvInZone()*.05),x:tp.x+rnd(-S*.35,S*.35),y:hudBottom+28,len:0,vy:0,fall:false,shard:0};sfx.creak();return true},
    update(dt,m,live){m.t+=dt;if(m.shard){m.shard+=dt;if(m.shard>.5)delete hz.m.icicle;return}
      if(!m.fall){m.len=S*1.4*Math.min(1,m.t/m.warn);if(m.t>=m.warn){m.fall=true}}
      else{m.vy+=1800*dt;m.y+=m.vy*dt;const tp=topScreen();if(m.y+m.len>=tp.y-BH*.4){if(live&&Math.abs(tp.x-m.x)<S*.85&&tower.length>2){knockTop(1);popup(t('m_crash'),tp.x,scrToW(tp.y)-BH*.6,'#8fd7f2');sfx.crash();vib(40)}m.shard=.01;burst(m.x,scrToW(m.y+m.len),['#e8fbff','#8fd7f2','#ffffff'],12)}}},
    draw(m){if(m.shard)return;drawIcicle(m.x,m.y,m.len);if(Math.floor(time*3)%2)tapRing(m.x,m.y+m.len*.5,S*.75)},
    tap(px,py,m){if(m.shard)return false;if(Math.hypot(px-m.x,py-(m.y+m.len*.5))<S*1.1){m.shard=.01;burst(m.x,scrToW(m.y+m.len*.5),['#e8fbff','#8fd7f2','#ffffff'],14);pts(20);popup(t('m_shatter'),m.x,scrToW(m.y)+BH*.3,'#a3e635');sfx.pop();return true}return false},
    demo(p,H_){const len=Math.min(1,p/1.2)*40,y=p<1.4?8:8+(p-1.4)**2*500;if(y<H_.at(1)-30)drawIcicle(H_.cx,y,len);if(p>.6&&p<1.3)H_.ring(H_.cx,y+len/2,20)}}),
  jellyfish:ev('event',{start(){const r=rangeXs();hz.m.jellyfish={t:0,dur:6.5,list:[0,1].map(i=>({xs:(i?1:-1)*r*rnd(.25,.75),y:H+40+i*60,pop:0}))};sfx.bloop();return true},
    update(dt,m){m.t+=dt;const ty=sy(swingY())+BH*1.4;for(const j of m.list){if(j.pop){j.pop+=dt;continue}j.y=Math.max(ty+Math.sin(m.t*2+j.xs)*10,j.y-90*dt);
        if(dropping&&!dropping.zapped&&Math.hypot(xOf(dropping.xs)-xOf(j.xs),sy(dropping.y)-j.y)<S*.95){dropping.zapped=1;dropping.xs+=(Math.random()<.5?-1:1)*rnd(.25,.4);j.pop=.01;popup(t('m_zap'),xOf(j.xs),scrToW(j.y)-BH*.3,'#c084fc');sfx.zap();vib(25)}}
      if(m.t>m.dur||m.list.every(j=>j.pop>.4))delete hz.m.jellyfish},
    draw(m){for(const j of m.list){const a=j.pop?Math.max(0,1-j.pop*2.5):Math.min(1,(m.dur-m.t)*2);if(a>0)drawJellyfish(xOf(j.xs),j.y,time+j.xs,a);if(!j.pop&&Math.floor(time*3)%2)tapRing(xOf(j.xs),j.y,S*.8)}},
    tap(px,py,m){for(const j of m.list)if(!j.pop&&Math.hypot(px-xOf(j.xs),py-j.y)<S){j.pop=.01;pts(15);popup(t('m_scared'),xOf(j.xs),scrToW(j.y)-BH*.3,'#a3e635');sfx.pop();return true}return false},
    demo(p,H_){const y=190-Math.min(1,p/1.4)*110;drawJellyfish(H_.cx+40,y,p*3);if(p>1&&p<1.8)H_.ring(H_.cx+40,y,22)}}),
  lava:ev('passive',{init(){return {lvl:-2.2}},
    update(dt,m,live){if(!live||state==='aim'&&swinger&&swinger.entering)return;const top=tower.length-1;m.lvl+=((.3+lvInZone()*.012)*(isBoss()?.7:1)+Math.max(0,top-4.5-m.lvl)*.6)*dt;
      if(m.lvl>=top-.25&&top>0){m.lvl=Math.max(-2,top-3.2);loseHeart(t('m_burn'),W/2,yOf(top),false,'whoops');sfx.boom()}},
    landing(perfect,great,d,m){if(perfect){m.lvl=Math.max(-2.2,m.lvl-.8);popup(t('m_cooled'),W/2,swingY()-BH*.3,'#22d3ee')}},
    back(m){const wy=-.2*BH-(m.lvl+.5)*STEP,y=sy(wy);if(y>H+20)return;ctx.save();const g=ctx.createLinearGradient(0,y,0,H);g.addColorStop(0,'rgba(255,170,40,.95)');g.addColorStop(.15,'rgba(255,90,30,.9)');g.addColorStop(1,'rgba(140,20,20,.95)');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,H+10);for(let x=0;x<=W+20;x+=20)ctx.lineTo(x,y+Math.sin(x*.05+time*3)*5);ctx.lineTo(W,H+10);ctx.closePath();ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#ffe24d';ctx.stroke();
      ctx.fillStyle='rgba(255,230,120,.8)';for(let i=0;i<8;i++){const bx=(i*97+time*20)%W,by=y+12+((time*40+i*31)%60);ctx.beginPath();ctx.arc(bx,by,3+(i%3),0,7);ctx.fill()}ctx.restore()},
    demo(p,H_,g){const y=185-p*30;g.fillStyle='rgba(255,90,30,.9)';g.fillRect(0,y,280,190-y);g.strokeStyle='#ffe24d';g.lineWidth=3;g.beginPath();g.moveTo(0,y);g.lineTo(280,y);g.stroke()}}),
  portal:ev('event',{start(){hz.portal={t:0};hz.m.portal={t:0,dur:6.5};sfx.zap();return true},
    update(dt,m){m.t+=dt;if(m.t>m.dur){hz.portal=null;delete hz.m.portal}},
    draw(m){const a=Math.min(1,m.t*3,(m.dur-m.t)*3),y=sy(swingY()),r=rangeXs();drawPortal(xOf(-r)-S*.5,y,time,a);drawPortal(xOf(r)+S*.5,y,time,a)},
    demo(p,H_){drawPortal(30,40,p*2);drawPortal(250,40,p*2);const x=((p*120)%240)+20;drawSharliz(H_.m,x,40)}}),
  tornado:ev('event',{start(){const dir=Math.random()<.5?-1:1;hz.m.tornado={t:0,warn:1.4,dur:4.2,dir};sfx.rumble();return true},
    update(dt,m){m.t+=dt;if(m.t>m.warn){const k=Math.sin(Math.PI*clamp((m.t-m.warn)/m.dur,0,1));hz.gustV=(hz.gustV||0)+m.dir*2.4*k;if(Math.random()<dt*30)windStreaks.push({x:m.dir>0?-80:W+80,y:rnd(H*.05,H*.9),len:rnd(60,140),life:1.4})}if(m.t>m.warn+m.dur)delete hz.m.tornado},
    landing(perfect,great,d,m){if(perfect&&m.t>m.warn){delete hz.m.tornado;pts(30);popup(t('m_anchor'),W/2,swingY()-BH*.3,'#22d3ee')}},
    draw(m){const a=Math.min(1,m.t/m.warn);ctx.save();ctx.globalAlpha=a*.85;drawFunnel(m.dir>0?W*.08:W*.92,hudBottom+30,H*.85,time);ctx.restore()},
    demo(p,H_){drawFunnel(250,10,180,p*2);const e=Math.min(1,p/1.6);drawSharliz(H_.m,H_.cx+60*e,30+(H_.at(2)-30)*e)}}),
  newspaper:ev('event',{start(){const tp=topScreen();hz.m.newspaper={t:0,dur:5,x:clamp(tp.x+rnd(-S,S),W*.3,W*.7),y:clamp((tp.y+sy(swingY()))/2,H*.25,H*.7),rot:rnd(-.25,.25),torn:0};sfx.splat();return true},
    update(dt,m){m.t+=dt;if(m.torn){m.torn+=dt;if(m.torn>.45)delete hz.m.newspaper;return}if(m.t>m.dur)delete hz.m.newspaper},
    draw(m){const a=m.torn?1-m.torn*2.2:Math.min(1,m.t*5,(m.dur-m.t)*3),sc=Math.min(1,m.t*4);if(a<=0)return;ctx.save();ctx.globalAlpha=a;drawNewspaper(m.x+(m.torn?m.torn*300:0),m.y,S*3.4*sc,S*2.5*sc,m.rot+(m.torn?m.torn*3:0));ctx.restore();if(!m.torn&&Math.floor(time*3)%2)tapRing(m.x,m.y,S*1.3)},
    tap(px,py,m){if(m.torn)return false;if(Math.abs(px-m.x)<S*1.8&&Math.abs(py-m.y)<S*1.4){m.torn=.01;pts(15);popup(t('m_torn'),m.x,scrToW(m.y),'#a3e635');sfx.pop();return true}return false},
    demo(p,H_){if(p<2){drawNewspaper(H_.cx,70,110,80,-.1);if(p>1)H_.ring(H_.cx,70,30)}}}),
  dunes:ev('passive',{init(){return {t:0,last:0}},
    update(dt,m,live){if(!live)return;m.t+=dt;const amp=.38+lvInZone()*.03,o=amp*Math.sin(m.t*Math.PI*2/7);const d=o-m.last;m.last=o;for(const s of tower)s.xs+=d;
      if(Math.random()<dt*6)particles.push({x:xOf(tower[0].xs)+rnd(-S,S),y:yOf(0)+BH*.4,vx:-Math.sign(d||1)*rnd(40,90),vy:rnd(-60,-20),life:.6,c:'#e8be80',sz:rnd(2,4)})},
    demo(p,H_){const o=Math.sin(p*2.1)*26;drawSharliz(H_.a,H_.cx+o,H_.at(0));drawSharliz(H_.b,H_.cx+o,H_.at(1))},full:true}),
  hail:ev('event',{start(){hz.m.hail={t:0,dur:3.6,next:.3,c:[]};return true},
    update(dt,m,live){m.t+=dt;if(m.t>m.next&&m.t<m.dur){m.next+=.42;const tp=topScreen();m.c.push({x:tp.x+rnd(-S*.3,S*.3),y:-20,vy:500,col:pick(['#ff3ea5','#ffd60a','#22d3ee','#a3e635']),r:rnd(0,6)})}
      for(const c of m.c){if(c.hit)continue;c.y+=c.vy*dt;const tp=topScreen();if(c.y>=tp.y-BH*.5){c.hit=1;if(live&&tower.length>1){const top=tower[tower.length-1];top.xs+=(Math.random()<.5?-1:1)*rnd(.05,.09);jig(top,.9)}burst(c.x,scrToW(c.y),[c.col,'#ffffff'],6,140)}}
      if(m.t>m.dur+1)delete hz.m.hail},
    landing(perfect,great,d,m){if(perfect){m.t=Math.max(m.t,m.dur);pts(20);popup(t('m_calm'),W/2,swingY()-BH*.3,'#ff9ecf')}},
    draw(m){for(const c of m.c)if(!c.hit)drawCandy(c.x,c.y,c.col,c.r+time*6)},
    demo(p,H_){for(let i=0;i<3;i++){const y=((p*200)+i*60)%170;drawCandy(H_.cx-20+i*20,y,['#ff3ea5','#ffd60a','#22d3ee'][i],p*6)}}}),
  freeze:ev('event',{start(){if(!swinger||swinger.entering||state!=='aim')return false;swinger.frozen=1.3;hz.m.freeze={t:0};popup(t('m_frozen'),xOf(swinger.xs),swingY()-BH*.7,'#8fd7f2');sfx.creak();return true},
    update(dt,m){m.t+=dt;if(swinger){if(swinger.frozen>0){swinger.frozen-=dt;if(swinger.frozen<=0){swinger.fast=2.2;burst(xOf(swinger.xs),swingY(),['#e8fbff','#8fd7f2'],10)}}else if(swinger.fast>0)swinger.fast-=dt}if(m.t>4)delete hz.m.freeze},
    demo(p,H_){const fr=p>.5&&p<1.8,x=fr?H_.cx+30:H_.cx+Math.sin(p*(p>1.8?6:3))*60;drawSharliz(H_.m,x,40);if(fr){ctx.save();ctx.globalAlpha=.45;ctx.fillStyle='#bff3ff';ctx.fillRect(x-22,15,44,52);ctx.restore()}}}),
  waves:ev('passive',{init(){return {t:0,last:0}},
    update(dt,m,live){if(!live)return;m.t+=dt;const o=(.24+lvInZone()*.02)*Math.sin(m.t*Math.PI*2/3.3);const d=o-m.last;m.last=o;for(const s of tower)s.xs+=d;
      if(Math.random()<dt*8)particles.push({x:rnd(0,W),y:yOf(0)+BH*.3,vx:rnd(-40,40),vy:rnd(-220,-120),life:.7,c:'#bfe9ff',sz:rnd(2,4)})},
    back(m){const gy=sy(0);if(gy>H+10)return;ctx.save();ctx.fillStyle='rgba(30,120,170,.55)';ctx.beginPath();ctx.moveTo(0,H+10);for(let x=0;x<=W+20;x+=16)ctx.lineTo(x,gy-6+Math.sin(x*.04+time*3)*7);ctx.lineTo(W,H+10);ctx.closePath();ctx.fill();ctx.strokeStyle='#e8fbff';ctx.lineWidth=3;ctx.stroke();ctx.restore()},
    demo(p,H_){const o=Math.sin(p*3.4)*16;drawSharliz(H_.a,H_.cx+o,H_.at(0));drawSharliz(H_.b,H_.cx+o,H_.at(1))},full:true}),
  meteor:ev('event',{start(){if(!swinger)return false;const r=rangeXs();hz.m.meteor={t:0,warn:1.6,xs:rnd(-r*.8,r*.8),hit:0,smash:0};sfx.rumble();return true},
    update(dt,m,live){m.t+=dt;if(m.smash){m.smash+=dt;if(m.smash>.5)delete hz.m.meteor;return}if(m.hit){m.hit+=dt;if(m.hit>.5)delete hz.m.meteor;return}
      if(m.t>=m.warn){m.hit=.01;const x=xOf(m.xs),y=swingY();burst(x,y,['#ff8a00','#ffd60a','#5a3a2e'],18,260);shake=Math.max(shake,reduceMotion?0:.25);sfx.boom();
        if(live&&swinger&&state==='aim'&&Math.abs(xOf(swinger.xs)-x)<S*1.15)loseSwinger(t('m_burned'),'#ff8a00')}},
    mpos(m){const k=Math.min(1,m.t/m.warn),tx=xOf(m.xs),ty=sy(swingY());return {x:tx+(1-k)*W*.6,y:ty-(1-k)*H*.6}},
    draw(m){if(m.smash||m.hit)return;const tx=xOf(m.xs),ty=sy(swingY());ctx.save();ctx.strokeStyle='#ff3ea5';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();ctx.arc(tx,ty,S*(1.15+.15*Math.sin(time*12)),0,7);ctx.stroke();ctx.restore();
      const p=this.mpos(m);drawMeteor(p.x,p.y,time);if(Math.floor(time*3)%2)tapRing(p.x,p.y,S*.8)},
    tap(px,py,m){if(m.smash||m.hit)return false;const p=this.mpos(m);if(Math.hypot(px-p.x,py-p.y)<S*1.05){m.smash=.01;burst(p.x,scrToW(p.y),['#5a3a2e','#ff8a00','#ffd60a'],16);pts(25);popup(t('m_smash'),p.x,scrToW(p.y),'#a3e635');sfx.pop();return true}return false},
    demo(p,H_){const k=Math.min(1,p/1.6),x=H_.cx+40+(1-k)*150,y=40-(1-k)*120;g_ring(H_.cx+40,40);if(p<1.6)drawMeteor(x,y,p*3)}}),
  gravity:ev('event',{start(){hz.m.gravity={t:0,dur:4.4};hz.gravK=.3;sfx.zap();return true},
    update(dt,m){m.t+=dt;if(Math.random()<dt*10)particles.push({x:rnd(0,W),y:scrToW(H+10),vx:rnd(-10,10),vy:rnd(-160,-80),life:2,c:'#c084fc',sz:rnd(2,4)});if(m.t>m.dur){hz.gravK=1;delete hz.m.gravity}},
    draw(m){const a=Math.min(1,m.t*3,(m.dur-m.t)*3)*.18;ctx.fillStyle=`rgba(150,90,255,${a})`;ctx.fillRect(0,0,W,H)},
    demo(p,H_){const e=Math.min(1,p/2.4);drawSharliz(H_.m,H_.cx+Math.sin(p*2)*8,30+(H_.at(2)-30)*e)}}),
  lightning:ev('event',{start(){if(curSeason()!==3||tower.length<3)return false;hz.m.lightning={t:0,warn:1.8,x:topScreen().x,done:0,gone:0};return true},
    update(dt,m,live){m.t+=dt;if(m.gone){m.gone+=dt;if(m.gone>.5)delete hz.m.lightning;return}if(m.done){m.done+=dt;if(m.done>.35)delete hz.m.lightning;return}
      if(m.t>=m.warn){m.done=.01;const tp=topScreen();if(typeof SFX_S!=='undefined'){SFX_S.flash=1}sfx.boom();shake=Math.max(shake,reduceMotion?0:.2);
        if(live&&tower.length>2&&Math.abs(tp.x-m.x)<S*.95){knockTop(1);popup(t('m_struck'),tp.x,scrToW(tp.y)-BH*.5,'#fff6a8');vib(50)}}},
    draw(m){const y=hudBottom+40;if(m.gone){ctx.save();ctx.globalAlpha=1-m.gone*2;drawStormCloud(m.x,y,S*1.6,0);ctx.restore();return}drawStormCloud(m.x,y,S*1.6,Math.min(1,m.t/m.warn));
      if(!m.done){ctx.save();ctx.strokeStyle=`rgba(255,246,168,${.25+.25*Math.sin(time*20)})`;ctx.lineWidth=S*.7;ctx.beginPath();ctx.moveTo(m.x,y+S*.5);ctx.lineTo(m.x,topScreen().y);ctx.stroke();ctx.restore();if(Math.floor(time*3)%2)tapRing(m.x,y,S*1.1)}
      else{ctx.save();ctx.strokeStyle='#fffbe0';ctx.lineWidth=4;ctx.shadowColor='#bfe3ff';ctx.shadowBlur=16;ctx.beginPath();let x=m.x;ctx.moveTo(x,y);const ty=topScreen().y;for(let yy=y;yy<ty;yy+=24){x+=rnd(-12,12);ctx.lineTo(x,yy)}ctx.lineTo(m.x,ty);ctx.stroke();ctx.restore()}},
    tap(px,py,m){if(m.done||m.gone)return false;if(Math.hypot(px-m.x,py-(hudBottom+40))<S*1.6){m.gone=.01;pts(20);popup(t('m_clear'),m.x,scrToW(hudBottom+60),'#a3e635');sfx.pop();return true}return false},
    demo(p,H_){drawStormCloud(H_.cx,24,40,Math.min(1,p/1.8));if(p>1.8&&p<2.1){ctx.strokeStyle='#fff6a8';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(H_.cx,40);ctx.lineTo(H_.cx-8,90);ctx.lineTo(H_.cx+6,95);ctx.lineTo(H_.cx,H_.at(1)-20);ctx.stroke()}}}),
  monkey:ev('event',{start(){if(!swinger)return false;const side=Math.random()<.5?-1:1;hz.m.monkey={t:0,dur:2.4,side,scared:0};sfx.whistle();return true},
    pos(m){const e=clamp(m.t/m.dur,0,1),ee=e*e*(3-2*e),s=swingScr(),x0=m.side<0?-70:W+70,y0=hudBottom+20;return {x:x0+(s.x-x0)*ee,y:y0+(s.y-BH*.3-y0)*ee-Math.sin(ee*Math.PI)*BH*.8,ax:m.side<0?W*.18:W*.82,ay:-20}},
    update(dt,m,live){m.t+=dt;if(m.scared){m.scared+=dt;if(m.scared>.9)delete hz.m.monkey;return}if(m.t>=m.dur){if(live&&swinger&&state==='aim'){m.grab=1;loseSwinger(t('m_grab'),'#8a5a33')}m.scared=.01}},
    draw(m){const p=this.pos(m);let x=p.x,y=p.y;if(m.scared){x+=(m.side)*m.scared*400;y-=m.scared*300}ctx.save();ctx.strokeStyle='#4f7a2a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p.ax,p.ay);ctx.quadraticCurveTo((p.ax+x)/2,(p.ay+y)/2+40,x,y-S*.5);ctx.stroke();ctx.restore();
      drawMonkey(x,y,time,m.side>0);if(!m.scared&&Math.floor(time*3)%2)tapRing(x,y,S*.9)},
    tap(px,py,m){if(m.scared)return false;const p=this.pos(m);if(Math.hypot(px-p.x,py-p.y)<S*1.1){m.scared=.01;pts(20);popup(t('m_scared'),p.x,scrToW(p.y)-BH*.3,'#a3e635');sfx.pop();return true}return false},
    demo(p,H_){const e=Math.min(1,p/1.6),x=270-120*e,y=10+30*e;ctx.strokeStyle='#4f7a2a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(250,0);ctx.lineTo(x,y-14);ctx.stroke();drawMonkey(x,y,p,true);drawSharliz(H_.m,H_.cx,40);if(p>.8&&p<1.5)H_.ring(x,y,20)}}),
  ghost:ev('event',{start(){if(!swinger)return false;hz.m.ghost={t:0,dur:1.8,side:Math.random()<.5?-1:1,done:0};sfx.bloop();return true},
    pos(m){const e=clamp(m.t/m.dur,0,1),s=swingScr(),x0=m.side<0?-60:W+60;return {x:x0+(s.x-x0)*e,y:s.y-BH*.2+Math.sin(m.t*4)*10}},
    update(dt,m,live){m.t+=dt;if(m.done){m.done+=dt;if(m.done>.6)delete hz.m.ghost;return}if(m.t>=m.dur){if(live&&swinger&&state==='aim'){swinger.ghost=3.4;popup(t('m_boo'),xOf(swinger.xs),swingY()-BH*.7,'#c7c9ff');sfx.whistle()}m.done=.01}},
    draw(m){const p=this.pos(m);drawGhostE(p.x,p.y,time,m.done?Math.max(0,1-m.done*2):1);if(!m.done&&Math.floor(time*3)%2)tapRing(p.x,p.y,S*.9)},
    tap(px,py,m){if(m.done)return false;const p=this.pos(m);if(Math.hypot(px-p.x,py-p.y)<S*1.1){m.done=.01;pts(20);popup(t('m_banish'),p.x,scrToW(p.y)-BH*.3,'#a3e635');sfx.pop();return true}return false},
    demo(p,H_){const e=Math.min(1,p/1.4);drawGhostE(270-140*e,40,p);ctx.save();ctx.globalAlpha=p>1.4&&p<2.6?.15:1;drawSharliz(H_.m,H_.cx,40);ctx.restore()}}),
  cloud:ev('event',{start(){const dir=Math.random()<.5?1:-1;hz.m.cloud={t:0,dir,x:dir>0?-S*2:W+S*2,vx:dir*W/5.5};return true},
    update(dt,m){m.t+=dt;m.x+=m.vx*dt;const y=sy(swingY())+BH*.2;if(dropping&&!dropping.cloudChk){dropping.cloudChk=1;if(Math.abs(xOf(dropping.xs)-m.x)<S*1.7&&Math.abs(sy(dropping.y)-y)<BH){dropping.cloudT=.9;popup(t('m_float'),xOf(dropping.xs),dropping.y-BH*.6,'#ffffff')}}
      if(dropping&&dropping.cloudT>0){dropping.cloudT-=dt;dropping.vy=Math.min(dropping.vy,BH*1.1);dropping.xs+=m.vx/S*dt*.32}if(m.x<-S*3||m.x>W+S*3)delete hz.m.cloud},
    draw(m){drawCloudE(m.x,sy(swingY())+BH*.25,S*2.2,.9)},
    demo(p,H_){const x=((p*90)%330)-30;drawCloudE(x,60,70);drawSharliz(H_.m,x,55)}}),
  egg:ev('event',{start(){if(tower.length<3)return false;hz.m.egg={t:0,dur:4.6,got:0,hatched:0};sfx.pop();return true},
    update(dt,m,live){m.t+=dt;if(m.got||m.hatched){(m.got?m.got+=dt:m.hatched+=dt);if((m.got||m.hatched)>.8)delete hz.m.egg;return}
      if(m.t>=m.dur){m.hatched=.01;shake=Math.max(shake,reduceMotion?0:.3);if(live&&tower.length>2){knockTop(1);popup(t('m_hatch'),W/2,swingY()-BH*.3,'#8bc34a');sfx.rumble();vib(50)}}},
    draw(m){const tp=topScreen();if(m.hatched){ctx.save();ctx.globalAlpha=Math.max(0,1-m.hatched*1.5);drawEgg(tp.x,tp.y-BH*.5,1,time);ctx.restore();return}if(m.got)return;drawEgg(tp.x+S*.15,tp.y-BH*.5,m.t/m.dur,time);if(Math.floor(time*3)%2)tapRing(tp.x+S*.15,tp.y-BH*.75,S*.75)},
    tap(px,py,m){if(m.got||m.hatched)return false;const tp=topScreen();if(Math.hypot(px-tp.x,py-(tp.y-BH*.75))<S){m.got=.01;pts(25);coinFly(tp.x,scrToW(tp.y)-BH,2);popup(t('m_gotEgg'),tp.x,scrToW(tp.y)-BH,'#a3e635');sfx.coin&&sfx.coin();return true}return false},
    demo(p,H_){drawSharliz(H_.a,H_.cx,H_.at(0));drawSharliz(H_.b,H_.cx,H_.at(1));drawEgg(H_.cx,H_.at(1)-26,Math.min(1,p/2.6),p);if(p>1&&p<2)H_.ring(H_.cx,H_.at(1)-36,18)},full:true}),
  conveyor:ev('passive',{init(){return {dir:1,moved:0,n:0}},
    update(dt,m,live){const n=tower.length;if(n!==m.n){m.n=n;m.moved=0;m.dir=-m.dir}if(!live||n<2)return;if(m.moved<.32){const v=(.12+lvInZone()*.01)*dt;tower[n-1].xs+=m.dir*v;m.moved+=v}},
    back(m){if(tower.length<2)return;const tp=topScreen(),w=S*1.4,y=tp.y+BH*.48;ctx.save();ctx.fillStyle='#3d4250';ctx.strokeStyle=INK;ctx.lineWidth=2;roundRect(tp.x-w,y-5,w*2,10,5);ctx.fill();ctx.stroke();
      ctx.strokeStyle='#ffd23f';ctx.lineWidth=2;const off=(time*40*m.dir)%14;for(let x=-w+off;x<w;x+=14){ctx.beginPath();ctx.moveTo(tp.x+x,y-3);ctx.lineTo(tp.x+x+m.dir*5,y);ctx.lineTo(tp.x+x,y+3);ctx.stroke()}ctx.restore()},
    demo(p,H_){drawSharliz(H_.a,H_.cx,H_.at(0));drawSharliz(H_.b,H_.cx+Math.min(1,p/2)*24,H_.at(1))},full:true}),
  mirror:ev('event',{start(){hz.m.mirror={t:0,warn:.9,dur:4.6};sfx.zap();return true},
    update(dt,m){m.t+=dt;const on=m.t>m.warn&&m.t<m.warn+m.dur;cv.style.transform=on?'scaleX(-1)':'';if(m.t>m.warn+m.dur){cv.style.transform='';delete hz.m.mirror}},
    draw(m){if(m.t<m.warn){ctx.fillStyle=`rgba(190,250,255,${.25*Math.sin(m.t*20)**2})`;ctx.fillRect(0,0,W,H)}},
    demo(p,H_,g){if(p>.8&&p<2.4){g.translate(280,0);g.scale(-1,1)}drawSharliz(H_.m,60+((p*90)%160),40)}})
});
function g_ring(x,y){ctx.save();ctx.strokeStyle='#ff3ea5';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(x,y,22,0,7);ctx.stroke();ctx.restore()}
function jellyGlow(x,y){ctx.save();ctx.translate(x,y);bean(S*1.18,BH*1.1,0);ctx.globalAlpha=.16;ctx.fillStyle='#ff9ecf';ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle='rgba(255,120,190,.95)';ctx.lineWidth=3;ctx.setLineDash([5,4]);ctx.lineDashOffset=-time*20;ctx.stroke();ctx.restore()}
const MECH_KEYS=Object.keys(MECH);
for(const k of MECH_KEYS)if(MECH[k].type!=='passive')HZ_EVENT[k]=1;

/* which hazards a stage uses: its own mechanic + earlier new ones of the season + a few classic ones */
function mechPrimary(){return MECH_OF[zone().sid]||HZ_ORDER[zoneIdx(level)%8]}
function mechList(){const z=zone(),zi=zoneIdx(level),s=z.season||1,own=MECH_OF[z.sid];const L=[];
  if(own&&MECH[own].type!=='passive')L.push(own);
  for(let j=zi-1;j>=0&&L.length<3;j--){const k=MECH_OF[ZONES[j].sid];if(k&&ZONES[j].season===s&&MECH[k].type!=='passive'&&!L.includes(k))L.push(k)}
  if(s===3&&!L.includes('lightning'))L.push('lightning');
  const classic=['thief','bomb','wind','balloon','ice','fog','quake','size'];const r=mulberry(zi*13+7);while(L.length<5){const k=classic[Math.floor(r()*classic.length)];if(!L.includes(k))L.push(k)}
  return L}
const passiveNow=()=>{const k=MECH_OF[zone().sid];return k&&MECH[k].type==='passive'?k:null};

/* ---------- hooks ---------- */
{const _rh=resetHazards;resetHazards=function(){_rh();hz.m={};hz.gravK=1;hz.portal=null;nightExtra=0;lightBoost=0;try{cv.style.transform=''}catch(e){}
  if(mode==='levels'||mode==='daily'){const pk=passiveNow();if(pk)hz.m[pk]=MECH[pk].init()}}}
{const _se=startEvent;startEvent=function(k){if(MECH[k]){if(mBusy()&&MECH[k].type!=='swinger')return false;if(MECH[k].type!=='swinger'&&(tower.length<3&&!hz.boss))return false;let ok=false;try{ok=!!MECH[k].start()}catch(e){}if(!ok)hz.mRetry=1;return ok}return _se(k)}}
{const _uh=updateHazards;updateHazards=function(dt){_uh(dt);if(hz.mRetry){hz.mRetry=0;hz.next=Math.min(hz.next,time+1.2)}const live=['aim','wait','drop'].includes(state);if(lightBoost>0)lightBoost-=dt;
  if(hz.m)for(const k in hz.m){const M=MECH[k];if(M&&M.update&&hz.m[k])M.update(dt,hz.m[k],live)}
  if(swinger&&swinger.ghost>0)swinger.ghost-=dt}}
{const _db=drawHazardsBack;drawHazardsBack=function(){_db();if(hz.m)for(const k in hz.m){const M=MECH[k];if(M&&M.back&&hz.m[k])M.back(hz.m[k])}}}
{const _df=drawHazardsFront;drawHazardsFront=function(){if(hz.m)for(const k in hz.m){const M=MECH[k];if(M&&M.draw&&hz.m[k])M.draw(hz.m[k])}_df()}}
{const _ht=hzTap;hzTap=function(px,py){if(cv.style.transform)px=W-px;if(hz.m)for(const k in hz.m){const M=MECH[k];if(M&&M.tap&&hz.m[k]&&M.tap(px,py,hz.m[k]))return true}
  if(curSeason()===2&&typeof SFX_S!=='undefined'){for(const f of SFX_S.flies)if(Math.hypot(px-f.x,py-f.y)<S*.8){f.t=99;lightBoost=7;pts(10);popup(t('m_light'),f.x,scrToW(f.y),'#ffe24d');sfx.pop();return true}}
  return _ht(px,py)}}
{const _ol=hzOnLanding;hzOnLanding=function(perfect,great){const d=tower[tower.length-1];
  if(d&&d.kind==='jelly')MECH.jelly.landing(perfect,great,d);
  if(curSeason()===3&&!perfect&&d&&tower.length>1){const prev=tower[tower.length-2],dx=d.xs-prev.xs;if(Math.abs(dx)>.04){d.xs+=dx*.22;d.slideX=-dx*.22*S;if(Math.abs(dx)>.18)popup(t('m_slide'),xOf(d.xs),yOf(tower.length-1)-BH*1.1,'#bfe3ff')}}
  if(hz.m)for(const k in hz.m){const M=MECH[k];if(M&&M.landing&&k!=='jelly'&&hz.m[k])M.landing(perfect,great,d,hz.m[k])}
  _ol(perfect,great)}}
{const _ds=drawSharliz;drawSharliz=function(s,...a){if(s&&s.ghost>0&&s===swinger){ctx.save();ctx.globalAlpha=.1+.06*Math.sin(time*9);const r=_ds(s,...a);ctx.restore();return r}
  const r=_ds(s,...a);if(s&&s.kind==='jelly'&&(s===swinger||s===dropping))jellyGlow(a[0],a[1]);if(s&&s.frozen>0){ctx.save();ctx.globalAlpha=.45;ctx.fillStyle='#bff3ff';ctx.fillRect(a[0]-S*.6,a[1]-BH*.55,S*1.2,BH*1.1);ctx.globalAlpha=1;ctx.strokeStyle='#e8fbff';ctx.lineWidth=3;ctx.strokeRect(a[0]-S*.6,a[1]-BH*.55,S*1.2,BH*1.1);ctx.restore()}return r}}

/* intro cards: a season card the first time a season starts, then the mechanic card */
{const _mi=maybeIntro;maybeIntro=function(){if(mode==='levels'){const s=curSeason();if(s>=2&&!seenKey('season_'+s)){markSeen('season_'+s);state='intro';
  showOverlay(()=>({title:t('s'+s+'_title'),sub:t('s'+s+'_cap'),actions:[{label:t('gotIt'),icon:'play',primary:true,fn:()=>{hideOverlay();state='wait';spawnAt=time+.6;maybeIntro()}}]}),true);return true}}
  return _mi()}}
{const _dl=demoLoop;demoLoop=function(c,k){if(!MECH[k]||!MECH[k].demo)return _dl(c,k);
  const cw=280,ch=190,d=Math.min(3,devicePixelRatio||1);c.width=cw*d;c.height=ch*d;c.style.width=cw+'px';c.style.height=ch+'px';
  const g=c.getContext('2d'),sz=34,a=Object.assign(makeSharliz(),{color:'#06a2ba'}),b=Object.assign(makeSharliz(),{color:'#ff6b98'}),m=Object.assign(makeSharliz(),{color:'#f6ba36'}),t0=performance.now();
  if(k==='jelly')m.kind='jelly';
  const step=()=>{if(!c.isConnected)return;const tt=(performance.now()-t0)/1000;g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,cw,ch);
    withCtx(g,sz,()=>{const gy=170,cx=140,bh=sz*1.5,at=i=>gy-bh/2-i*bh*.92,p=tt%3;
      const H_={cx,at,a,b,m,ring:(x,y,r)=>{g.save();g.strokeStyle='#ff3ea5';g.lineWidth=3;g.beginPath();g.arc(x,y,r*(1+((tt*2)%1)*.4),0,7);g.stroke();g.font='26px system-ui';g.textAlign='center';g.fillText('👆',x+r*.6,y+r*1.1);g.restore()}};
      g.fillStyle='rgba(26,16,32,.12)';g.fillRect(0,gy,cw,ch-gy);g.strokeStyle=INK;g.lineWidth=3;g.beginPath();g.moveTo(0,gy);g.lineTo(cw,gy);g.stroke();
      g.save();if(!MECH[k].full){drawSharliz(a,cx,at(0));drawSharliz(b,cx,at(1))}MECH[k].demo(p,H_,g);g.restore()});
    requestAnimationFrame(step)};requestAnimationFrame(step)}}

/* ---------- the 22 new bosses: each attacks with its stage's mechanic (phase 3 adds the classic attack of its art world) ---------- */
function bossMech(k,b){const M=MECH[k];if(!M)return false;
  if(M.type==='passive'){const m=hz.m[k]||(hz.m[k]=M.init());
    if(k==='lava')m.lvl=Math.max(m.lvl,tower.length-1-2.2);else if(k==='conveyor'){m.moved=0;m.dir=-m.dir}else if(m.t!==undefined)m.t+=.6;
    return false}            // passive bosses also use their classic attack
  if(hz.m[k])return true;let ok=false;try{ok=!!M.start()}catch(e){}return ok}
for(const [sid,k] of Object.entries(MECH_OF))BOSS_ATK[sid]=b=>{const art=BOSS_ATK[b.z]&&b.z!==sid?b.z:(ZONES.find(z=>z.sid===sid)||{}).base||'farm';const ok=bossMech(k,b);if(!ok||b.phase>=3)BOSS_ATK[art](b)};
