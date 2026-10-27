/* ===== v80: 500 LEVELS — seasons 5 + 6 (Tzach, Oct 27: "500 levels with all-new bosses, areas and obstacles") =====
   S5 Adventure Worlds (stages 30-39, levels 301-400) · S6 Legend Worlds (stages 40-49, levels 401-500). ZONES gets the 20 new
   stages in a build.py patch (same shape as season 4: z.sid = the stage, z.id = the S1 world whose art it borrows until its own
   art ships, z.season 5|6). This module adds the names, map tints, the season cards and the 20 new mechanics (one per stage,
   same MECH contract as v44: event | swinger | passive, intro card + demo, tap-to-stop gives points). The 20 new bosses attack
   with their stage mechanic through the v44 BOSS_ATK loop below; their trophy hats, gold feats and album live in v81. */
Object.assign(I18N.en,{season5:'Adventure Worlds',season6:'Legend Worlds',
  zPirate:'Pirate Island',zToys:'Toy Town',zMushroom:'Mushroom Forest',zHoney:'Honey Meadow',zCircus:'The Circus',zPyramid:'The Pyramid',zMusic:'Music Land',zSwamp:'Frog Swamp',zFairy:'Fairy Garden',zWest:'Wild West',
  zNinja:'Bamboo Temple',zPixel:'Pixel World',zDream:'Dreamland',zKitchen:'Giant Kitchen',zClock:'Clock Tower',zRainbow:'Rainbow Land',zDragon:'Dragon Mountain',zGarden:'Giant Garden',zAtlantis:'Atlantis',zSky:'Top of the World',
  bPirate:'Captain Parrot',bToys:'Jack-in-the-Box',bMushroom:'Mushroom Giant',bHoney:'Queen Bee',bCircus:'Ringmaster Lion',bPyramid:'Mummy Pharaoh',bMusic:'Piano Croc',bSwamp:'Giant Frog',bFairy:'Thorn Troll',bWest:'Bandit Bull',
  bNinja:'Ninja Panda',bPixel:'Glitch King',bDream:'Pillow Monster',bKitchen:'Toaster Titan',bClock:'Cuckoo Bird',bRainbow:'Rainbow Serpent',bDragon:'Three-Headed Dragon',bGarden:'Spider Queen',bAtlantis:'King Crab',bSky:'Shadow Sharliz',
  hz_cannon:'Cannon!',hzc_cannon:'A pirate cannon fires a cannonball at the top of your tower. Tap the cannonball to stop it.',
  hz_windup:'Wind-up car!',hzc_windup:'A toy car drives over the top Sharliz and pushes it to the edge. Tap the car to flip it off.',
  hz_spores:'Spores!',hzc_spores:'Spore puffs float up. A Sharliz that touches one gets dizzy and turns around without warning. Tap the puffs to pop them.',
  hz_honey:'Honey Sharliz!',hzc_honey:'This one is covered in honey: it swings slowly on one side and fast on the other. Time it again!',
  hz_spotlight:'Spotlight!',hzc_spotlight:'The circus lights go out and only a spotlight moves around. Land a PERFECT to turn the lights back on.',
  hz_hourglass:'Hourglass!',hzc_hourglass:'An hourglass appears: drop before the sand runs out, or the Sharliz falls by itself.',
  hz_speaker:'Speakers!',hzc_speaker:'The speakers boom to the beat and every BOOM pushes a falling Sharliz. Drop between the booms, or tap a speaker to switch it off.',
  hz_tongue:'Frog tongue!',hzc_tongue:'A frog shoots its sticky tongue and pulls the swinging Sharliz to the side. Tap the frog before it shoots.',
  hz_vines:'Thorns!',hzc_vines:'Thorns grow next to the top of the tower: a landing that is not close to the middle gets popped. Tap the thorns to cut them.',
  hz_tumbleweed:'Tumbleweed!',hzc_tumbleweed:'A tumbleweed rolls across the sky and knocks a falling Sharliz sideways. Tap it to stop it.',
  hz_smoke:'Smoke bomb!',hzc_smoke:'POOF! The Sharliz vanishes in smoke and pops up somewhere else on the swing. Be quick!',
  hz_glitch:'Glitch!',hzc_glitch:'The game glitches: the swinging Sharliz jumps in steps like an old broken game.',
  hz_sleepy:'Sleepy Sharliz!',hzc_sleepy:'This one falls asleep: it swings slower and slower... then wakes up with a jump and swings fast!',
  hz_pan:'Frying pan!',hzc_pan:'A frying pan sizzles next to the top Sharliz and flips it into the air. Tap the pan before it flips.',
  hz_pendulum:'Pendulum!',hzc_pendulum:'A giant clock pendulum swings under the Sharliz and knocks a falling one aside. Drop when it is out of the way.',
  hz_paint:'Paint spill!',hzc_paint:'A paint bucket spills over the top of the tower so you cannot see it. Tap to wipe the paint off.',
  hz_firebreath:'Fire breath!',hzc_firebreath:'A dragon breathes a line of fire across the sky. A Sharliz that falls through the fire is burned. Drop between the flames, or tap the dragon.',
  hz_web:'Spider web!',hzc_web:'A spider web catches a falling Sharliz, holds it and lets it go to the side. Tap the web to cut it.',
  hz_clam:'Giant clam!',hzc_clam:'A giant clam on top of the tower opens and closes. Land on a closed clam and you bounce off — unless it is a PERFECT.',
  hz_shadow:'Shadow!',hzc_shadow:'A shadow copy swings next to the real Sharliz the other way. Do not get fooled! Tap the shadow to chase it away.',
  hzx_cannon:'The cannonball knocks your top Sharliz off',hzo_cannon:'Tap the cannonball!',hzx_windup:'The toy car pushes the top Sharliz off the edge',hzo_windup:'Tap the car!',
  hzx_spores:'A dizzy Sharliz turns around by surprise',hzo_spores:'Pop the spore puffs!',hzx_honey:'Slow on one side, fast on the other',hzo_honey:'Wait for the slow side, then drop',
  hzx_spotlight:'Only the spotlight shows the tower',hzo_spotlight:'Land a PERFECT to bring the lights back',hzx_hourglass:'When the sand runs out the Sharliz drops by itself',hzo_hourglass:'Drop before the sand runs out!',
  hzx_speaker:'Each BOOM pushes a falling Sharliz',hzo_speaker:'Drop between the booms, or tap a speaker',hzx_tongue:'The tongue pulls your Sharliz to the side',hzo_tongue:'Tap the frog before it shoots!',
  hzx_vines:'A landing far from the middle pops on the thorns',hzo_vines:'Tap the thorns to cut them',hzx_tumbleweed:'The tumbleweed knocks a falling Sharliz aside',hzo_tumbleweed:'Tap the tumbleweed!',
  hzx_smoke:'POOF, it pops up somewhere else',hzo_smoke:'Watch where it comes out, then drop',hzx_glitch:'The Sharliz jumps in steps',hzo_glitch:'Count the jumps, then drop',
  hzx_sleepy:'It slows down... then wakes up fast',hzo_sleepy:'Drop while it is sleepy and slow',hzx_pan:'The pan flips the top Sharliz in the air',hzo_pan:'Tap the pan before it flips!',
  hzx_pendulum:'The pendulum knocks a falling Sharliz aside',hzo_pendulum:'Drop when the pendulum is on the side',hzx_paint:'Paint hides the top of the tower',hzo_paint:'Tap the paint to wipe it off!',
  hzx_firebreath:'Falling through the fire burns the Sharliz',hzo_firebreath:'Drop between the flames, or tap the dragon',hzx_web:'The web holds the Sharliz and drops it to the side',hzo_web:'Tap the web to cut it!',
  hzx_clam:'A closed clam bounces the Sharliz off',hzo_clam:'Land while the clam is open',hzx_shadow:'The shadow swings the other way to fool you',hzo_shadow:'Watch the real colours, tap the shadow',
  s5_title:'Season 5: Adventure Worlds',s5_cap:'Ten new adventures: pirates, toys, a circus, a pyramid and more. Every world has its own trick!',
  s6_title:'Season 6: Legend Worlds',s6_cap:'The last ten worlds. At the very top of the world waits the Shadow Sharliz. Good luck!',
  m_plug:'Plugged!',m_boom:'Boom!',m_flip:'Flipped!',m_push:'Pushed!',m_dizzy:'Dizzy!',m_sticky:'Sticky!',m_lights:'Lights on!',m_timeup:'Time up!',m_inTime:'In time!',
  m_off:'Switched off!',m_pulled:'Pulled!',m_ouch:'Ouch!',m_cut:'Cut!',m_poof:'Poof!',m_zzz:'Zzz...',m_wake:'Awake!',m_sizzle:'Sizzle!',m_wiped:'Wiped!',
  m_snuffed:'Snuffed!',m_caught:'Caught!',m_bounce:'Bounced!',m_gone:'Gone!',m_knock:'Knocked!',m_stop:'Stopped!'});
Object.assign(I18N.he,{season5:'עולמות ההרפתקה',season6:'עולמות האגדה',
  zPirate:'אי הפיראטים',zToys:'עיר הצעצועים',zMushroom:'יער הפטריות',zHoney:'שדה הדבש',zCircus:'הקרקס',zPyramid:'הפירמידה',zMusic:'ארץ המוזיקה',zSwamp:'ביצת הצפרדעים',zFairy:'גן הפיות',zWest:'המערב הפרוע',
  zNinja:'מקדש הבמבוק',zPixel:'עולם הפיקסלים',zDream:'ארץ החלומות',zKitchen:'המטבח הענק',zClock:'מגדל השעון',zRainbow:'קשת בענן',zDragon:'הר הדרקונים',zGarden:'הגינה הענקית',zAtlantis:'אטלנטיס',zSky:'פסגת העולם',
  bPirate:'קפטן תוכי',bToys:'ג׳ק בקופסה',bMushroom:'ענק הפטריות',bHoney:'מלכת הדבורים',bCircus:'האריה מנהל הקרקס',bPyramid:'פרעה המומיה',bMusic:'תנין הפסנתר',bSwamp:'הצפרדע הענקית',bFairy:'טרול הקוצים',bWest:'השור השודד',
  bNinja:'פנדה הנינג׳ה',bPixel:'מלך הגליץ׳',bDream:'מפלצת הכריות',bKitchen:'טוסטר הענק',bClock:'ציפור הקוקייה',bRainbow:'נחש הקשת',bDragon:'הדרקון התלת-ראשי',bGarden:'מלכת העכבישים',bAtlantis:'מלך הסרטנים',bSky:'השארליז האפל',
  hz_cannon:'תותח!',hzc_cannon:'תותח פיראטים יורה כדור על ראש המגדל. הקישו על הכדור כדי לעצור אותו.',
  hz_windup:'מכונית קפיץ!',hzc_windup:'מכונית צעצוע נוסעת על השארליז העליון ודוחפת אותו לקצה. הקישו עליה כדי להעיף אותה.',
  hz_spores:'נבגים!',hzc_spores:'ענני נבגים עולים למעלה. שארליז שנוגע בהם מקבל סחרחורת ומסתובב בלי אזהרה. הקישו על העננים כדי לפוצץ אותם.',
  hz_honey:'שארליז דבש!',hzc_honey:'הוא מרוח בדבש: מתנדנד לאט בצד אחד ומהר בצד השני. צריך לתזמן מחדש!',
  hz_spotlight:'זרקור!',hzc_spotlight:'האורות בקרקס כבים ורק זרקור אחד זז. נחיתה מושלמת מדליקה את האורות.',
  hz_hourglass:'שעון חול!',hzc_hourglass:'שעון חול מופיע: שחררו לפני שהחול נגמר, אחרת השארליז נופל לבד.',
  hz_speaker:'רמקולים!',hzc_speaker:'הרמקולים מפילים בום לפי הקצב וכל בום דוחף שארליז שנופל. שחררו בין הבומים, או הקישו על רמקול כדי לכבות אותו.',
  hz_tongue:'לשון צפרדע!',hzc_tongue:'צפרדע יורה לשון דביקה ומושכת את השארליז המתנדנד הצידה. הקישו על הצפרדע לפני שהיא יורה.',
  hz_vines:'קוצים!',hzc_vines:'קוצים צומחים ליד ראש המגדל: נחיתה רחוקה מהאמצע מתפוצצת עליהם. הקישו על הקוצים כדי לגזום אותם.',
  hz_tumbleweed:'שיח מתגלגל!',hzc_tumbleweed:'שיח יבש מתגלגל באוויר ומעיף הצידה שארליז שנופל. הקישו עליו כדי לעצור אותו.',
  hz_smoke:'פצצת עשן!',hzc_smoke:'פוף! השארליז נעלם בעשן ומופיע במקום אחר בנדנוד. תהיו מהירים!',
  hz_glitch:'גליץ׳!',hzc_glitch:'המשחק נתקע: השארליז המתנדנד קופץ בקפיצות קטנות כמו משחק ישן ומקולקל.',
  hz_sleepy:'שארליז מנומנם!',hzc_sleepy:'הוא נרדם: מתנדנד לאט ולאט... ואז מתעורר בקפיצה ומתנדנד מהר!',
  hz_pan:'מחבת!',hzc_pan:'מחבת רוחשת ליד השארליז העליון ומקפיצה אותו לאוויר. הקישו על המחבת לפני ההקפצה.',
  hz_pendulum:'מטוטלת!',hzc_pendulum:'מטוטלת ענקית של שעון עוברת מתחת לשארליז ומעיפה הצידה שארליז שנופל. שחררו כשהיא בצד.',
  hz_paint:'צבע נשפך!',hzc_paint:'דלי צבע נשפך על ראש המגדל ואי אפשר לראות אותו. הקישו כדי לנגב את הצבע.',
  hz_firebreath:'נשיפת אש!',hzc_firebreath:'דרקון נושף קו אש לרוחב השמיים. שארליז שנופל דרך האש נשרף. שחררו בין הנשיפות, או הקישו על הדרקון.',
  hz_web:'קורי עכביש!',hzc_web:'קורי עכביש תופסים שארליז שנופל, מחזיקים אותו ומשחררים אותו הצידה. הקישו על הקורים כדי לחתוך אותם.',
  hz_clam:'צדפה ענקית!',hzc_clam:'צדפה ענקית על ראש המגדל נפתחת ונסגרת. נחיתה על צדפה סגורה מקפיצה את השארליז, חוץ מנחיתה מושלמת.',
  hz_shadow:'צל!',hzc_shadow:'עותק צל מתנדנד ליד השארליז האמיתי בכיוון ההפוך. אל תתבלבלו! הקישו על הצל כדי לגרש אותו.',
  hzx_cannon:'כדור התותח מפיל את השארליז העליון',hzo_cannon:'הקישו על הכדור!',hzx_windup:'המכונית דוחפת את השארליז העליון מהקצה',hzo_windup:'הקישו על המכונית!',
  hzx_spores:'שארליז מסוחרר מסתובב בהפתעה',hzo_spores:'פוצצו את ענני הנבגים!',hzx_honey:'לאט בצד אחד, מהר בצד השני',hzo_honey:'חכו לצד האיטי ואז שחררו',
  hzx_spotlight:'רק הזרקור מראה את המגדל',hzo_spotlight:'נחיתה מושלמת מחזירה את האורות',hzx_hourglass:'כשהחול נגמר השארליז נופל לבד',hzo_hourglass:'שחררו לפני שהחול נגמר!',
  hzx_speaker:'כל בום דוחף שארליז שנופל',hzo_speaker:'שחררו בין הבומים, או הקישו על רמקול',hzx_tongue:'הלשון מושכת את השארליז הצידה',hzo_tongue:'הקישו על הצפרדע לפני שהיא יורה!',
  hzx_vines:'נחיתה רחוקה מהאמצע מתפוצצת על הקוצים',hzo_vines:'הקישו על הקוצים כדי לגזום אותם',hzx_tumbleweed:'השיח מעיף הצידה שארליז שנופל',hzo_tumbleweed:'הקישו על השיח!',
  hzx_smoke:'פוף, הוא מופיע במקום אחר',hzo_smoke:'תראו איפה הוא יוצא ואז שחררו',hzx_glitch:'השארליז קופץ בקפיצות',hzo_glitch:'ספרו את הקפיצות ואז שחררו',
  hzx_sleepy:'הוא מאט... ואז מתעורר מהר',hzo_sleepy:'שחררו כשהוא מנומנם ואיטי',hzx_pan:'המחבת מקפיצה את השארליז העליון',hzo_pan:'הקישו על המחבת לפני ההקפצה!',
  hzx_pendulum:'המטוטלת מעיפה שארליז שנופל',hzo_pendulum:'שחררו כשהמטוטלת בצד',hzx_paint:'הצבע מסתיר את ראש המגדל',hzo_paint:'הקישו על הצבע כדי לנגב!',
  hzx_firebreath:'נפילה דרך האש שורפת את השארליז',hzo_firebreath:'שחררו בין הנשיפות, או הקישו על הדרקון',hzx_web:'הקורים תופסים ומפילים הצידה',hzo_web:'הקישו על הקורים כדי לחתוך!',
  hzx_clam:'צדפה סגורה מקפיצה את השארליז',hzo_clam:'נחתו כשהצדפה פתוחה',hzx_shadow:'הצל מתנדנד הפוך כדי לבלבל',hzo_shadow:'הסתכלו על הצבעים האמיתיים, הקישו על הצל',
  s5_title:'עונה 5: עולמות ההרפתקה',s5_cap:'עשר הרפתקאות חדשות: פיראטים, צעצועים, קרקס, פירמידה ועוד. לכל עולם טריק משלו!',
  s6_title:'עונה 6: עולמות האגדה',s6_cap:'עשרת העולמות האחרונים. בפסגת העולם מחכה השארליז האפל. בהצלחה!',
  m_plug:'נסתם!',m_boom:'בום!',m_flip:'התהפך!',m_push:'נדחף!',m_dizzy:'סחרחורת!',m_sticky:'דביק!',m_lights:'האור חזר!',m_timeup:'נגמר הזמן!',m_inTime:'בזמן!',
  m_off:'כבוי!',m_pulled:'נמשך!',m_ouch:'איי!',m_cut:'נחתך!',m_poof:'פוף!',m_zzz:'ז... ז... ז...',m_wake:'התעורר!',m_sizzle:'טששש!',m_wiped:'נוגב!',
  m_snuffed:'כובה!',m_caught:'נתפס!',m_bounce:'קפץ!',m_gone:'נעלם!',m_knock:'עף!',m_stop:'נעצר!'});

// the 20 new stages: [stage id, S1 art world it borrows, map tint]
const S56=[['pirate','ocean','hue-rotate(-20deg) saturate(1.3) brightness(1.05)'],['toys','candy','hue-rotate(40deg) saturate(1.2)'],['mushroom','farm','hue-rotate(-60deg) saturate(1.15) brightness(.92)'],
  ['honey','desert','hue-rotate(-12deg) saturate(1.5) brightness(1.06)'],['circus','city','hue-rotate(-35deg) saturate(1.4)'],['pyramid','desert','sepia(.35) saturate(1.2)'],['music','candy','hue-rotate(200deg) saturate(1.1)'],
  ['swamp','farm','hue-rotate(40deg) saturate(.8) brightness(.85)'],['fairy','snow','hue-rotate(280deg) saturate(1.6) brightness(1.04)'],['west','desert','hue-rotate(-25deg) saturate(1.1) contrast(1.08)'],
  ['ninja','farm','hue-rotate(15deg) saturate(.9) contrast(1.1)'],['pixel','space','hue-rotate(90deg) saturate(1.8) contrast(1.15)'],['dream','snow','hue-rotate(230deg) saturate(1.3) brightness(.95)'],
  ['kitchen','candy','hue-rotate(-40deg) saturate(.9) brightness(1.06)'],['clock','city','sepia(.5) saturate(1.1) brightness(.92)'],['rainbow','snow','hue-rotate(150deg) saturate(2) brightness(1.05)'],
  ['dragon','volcano','hue-rotate(-15deg) saturate(1.2) contrast(1.1)'],['garden','farm','hue-rotate(-20deg) saturate(1.6)'],['atlantis','ocean','hue-rotate(40deg) saturate(1.2) brightness(.9)'],['sky','space','hue-rotate(-60deg) brightness(1.15) saturate(.8)']];
for(const z of ZONES){const e=S56.find(q=>q[0]===z.sid);if(e&&!z.ownMap)z.mapf=e[2]}

/* ---------- drawings (vector, ink outlines like v44) ---------- */
const rr=(x,y,w,h,r)=>{ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()};
function drawCannon(x,y,dir,t,fuse){ctx.save();ctx.translate(x,y);ctx.scale(dir,1);const s=S*.7;
  ctx.save();ctx.rotate(-.12);rr(-s*.2,-s*.32,s*1.15,s*.62,s*.28);outlineFill('#3a3f4b');ctx.fillStyle='#22252d';ctx.beginPath();ctx.ellipse(s*.95,-.03*s,s*.1,s*.26,0,0,7);ctx.fill();ctx.restore();
  ctx.beginPath();ctx.arc(-s*.05,s*.32,s*.3,0,7);outlineFill('#8a5a33');ctx.beginPath();ctx.arc(-s*.05,s*.32,s*.08,0,7);outlineFill('#5a3a22',1.5);
  if(fuse){ctx.strokeStyle='#d9b36a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-s*.15,-s*.3);ctx.quadraticCurveTo(-s*.35,-s*.6,-s*.25,-s*.75);ctx.stroke();
    for(let i=0;i<5;i++){ctx.fillStyle=['#ffd60a','#ff8a00','#fff'][i%3];ctx.beginPath();ctx.arc(-s*.25+rnd(-6,6),-s*.75+rnd(-6,6),rnd(1.5,3.5),0,7);ctx.fill()}}
  ctx.restore()}
function drawBall(x,y){ctx.beginPath();ctx.arc(x,y,S*.26,0,7);outlineFill('#23262e');ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.arc(x-S*.08,y-S*.08,S*.07,0,7);ctx.fill()}
function drawCar(x,y,dir,t){ctx.save();ctx.translate(x,y);ctx.scale(dir,1);const s=S*.5;rr(-s*.7,-s*.45,s*1.4,s*.5,s*.15);outlineFill('#ff3b5c');rr(-s*.35,-s*.8,s*.7,s*.4,s*.12);outlineFill('#ffd23f');
  ctx.fillStyle='#bfe9ff';ctx.fillRect(-s*.2,-s*.72,s*.4,s*.24);for(const wx of[-.42,.42]){ctx.beginPath();ctx.arc(wx*s,s*.05,s*.2,0,7);outlineFill('#2b2b33',2);ctx.save();ctx.translate(wx*s,s*.05);ctx.rotate(t*12);ctx.fillStyle='#bbb';ctx.fillRect(-s*.03,-s*.15,s*.06,s*.3);ctx.restore()}
  ctx.save();ctx.translate(-s*.75,-s*.25);ctx.rotate(t*6);ctx.strokeStyle='#c9ccd6';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-s*.25,0);ctx.lineTo(s*.25,0);ctx.moveTo(0,-s*.18);ctx.lineTo(0,s*.18);ctx.stroke();ctx.restore();
  eyes(s*.35,-s*.25,s*.08,s*.12);ctx.restore()}
function drawSpore(x,y,t,a=1){ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);const r=S*.42;for(let i=0;i<6;i++){const q=i/6*Math.PI*2+t*.6;ctx.beginPath();ctx.arc(Math.cos(q)*r*.45,Math.sin(q)*r*.45,r*.5,0,7);ctx.fillStyle='rgba(200,150,255,.55)';ctx.fill()}
  ctx.beginPath();ctx.arc(0,0,r*.55,0,7);outlineFill('#c69cff',2);ctx.fillStyle='#fff3a8';for(const [dx,dy] of [[-.2,-.15],[.18,.05],[-.05,.22]]){ctx.beginPath();ctx.arc(dx*r,dy*r,r*.08,0,7);ctx.fill()}ctx.restore()}
function drawHourglass(x,y,k){ctx.save();ctx.translate(x,y);const s=S*.45;ctx.fillStyle='#8a5a33';ctx.strokeStyle=INK;ctx.lineWidth=2;for(const yy of[-s,s]){rr(-s*.7,yy-s*.12,s*1.4,s*.24,s*.08);ctx.fill();ctx.stroke()}
  ctx.beginPath();ctx.moveTo(-s*.55,-s*.88);ctx.lineTo(s*.55,-s*.88);ctx.lineTo(s*.08,0);ctx.lineTo(s*.55,s*.88);ctx.lineTo(-s*.55,s*.88);ctx.lineTo(-s*.08,0);ctx.closePath();ctx.fillStyle='rgba(220,240,255,.65)';ctx.fill();ctx.stroke();
  ctx.fillStyle='#ffc94a';const top=(1-k)*.8;ctx.beginPath();ctx.moveTo(-s*.55*top,-s*.08-top*s*.8);ctx.lineTo(s*.55*top,-s*.08-top*s*.8);ctx.lineTo(0,-s*.06);ctx.closePath();ctx.fill();
  const b=k*.8;ctx.beginPath();ctx.moveTo(-s*.55*b,s*.86);ctx.lineTo(s*.55*b,s*.86);ctx.lineTo(0,s*.86-b*s*.7);ctx.closePath();ctx.fill();if(k<1){ctx.fillRect(-1,-s*.06,2,s*.9)}ctx.restore()}
function drawSpeaker(x,y,dir,boom){ctx.save();ctx.translate(x,y);ctx.scale(dir,1);const s=S*.75,k=1+boom*.12;ctx.scale(k,k);rr(-s*.45,-s*.7,s*.9,s*1.4,s*.12);outlineFill('#2b2d3a');
  for(const [yy,r] of [[-.35,.18],[.22,.32]]){ctx.beginPath();ctx.arc(0,yy*s,r*s,0,7);outlineFill('#4a4e62',2);ctx.beginPath();ctx.arc(0,yy*s,r*s*.4,0,7);ctx.fillStyle='#ffd23f';ctx.fill()}ctx.restore()}
function drawFrog(x,y,dir,puff,t){ctx.save();ctx.translate(x,y);ctx.scale(dir,1);const s=S*.7;ctx.beginPath();ctx.ellipse(0,s*.1,s*.6,s*.42,0,0,7);outlineFill('#5cc23a');
  ctx.beginPath();ctx.ellipse(s*.15,s*.3,s*.35*(1+puff*.6),s*.22*(1+puff*.8),0,0,7);outlineFill('#f1f7a8',2);
  for(const ex of[-.25,.25]){ctx.beginPath();ctx.arc(ex*s+s*.1,-s*.3,s*.2,0,7);outlineFill('#5cc23a',2)}eyes(s*.1,-s*.3,s*.1,s*.25);ctx.restore()}
function drawThorns(x,y,h,t,side){ctx.save();ctx.translate(x,y);ctx.scale(side,1);ctx.strokeStyle='#3c7a2c';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,0);for(let i=1;i<=8;i++){const k=i/8;ctx.lineTo(Math.sin(k*9+t*2)*S*.18,-k*h)}ctx.stroke();
  ctx.fillStyle='#7a3b1d';for(let i=1;i<8;i++){const k=i/8,xx=Math.sin(k*9+t*2)*S*.18,yy=-k*h;ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx+(i%2?1:-1)*S*.2,yy-S*.05);ctx.lineTo(xx,yy-S*.12);ctx.fill()}
  ctx.fillStyle='#ff6fb5';ctx.beginPath();ctx.arc(Math.sin(9+t*2)*S*.18,-h,S*.1,0,7);ctx.fill();ctx.restore()}
function drawTumble(x,y,t){ctx.save();ctx.translate(x,y);ctx.rotate(t*5);const r=S*.55;ctx.strokeStyle='#a87a3f';ctx.lineWidth=2.5;for(let i=0;i<9;i++){ctx.beginPath();ctx.ellipse(0,0,r,r*.45,i/9*Math.PI,0,7);ctx.stroke()}
  ctx.strokeStyle='#6b4a22';ctx.lineWidth=1.5;for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(0,0,r*.7,r*.3,i/6*Math.PI+.3,0,7);ctx.stroke()}ctx.restore()}
function drawSmoke(x,y,k){ctx.save();ctx.globalAlpha=Math.max(0,1-k);for(let i=0;i<7;i++){const a=i/7*Math.PI*2,r=S*(.4+k*.9);ctx.fillStyle=i%2?'#d9d9e6':'#b9b9cc';ctx.beginPath();ctx.arc(x+Math.cos(a)*r*.5,y+Math.sin(a)*r*.5,r*.55,0,7);ctx.fill()}ctx.restore()}
function drawPan(x,y,t,hot){ctx.save();ctx.translate(x,y);const s=S*.8;ctx.fillStyle='#4b4f5c';ctx.strokeStyle=INK;ctx.lineWidth=2.5;rr(s*.55,-s*.07,s*.75,s*.14,s*.06);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.ellipse(0,0,s*.65,s*.2,0,0,7);outlineFill('#2f323b');ctx.beginPath();ctx.ellipse(0,-s*.03,s*.5,s*.12,0,0,7);ctx.fillStyle='#4b4f5c';ctx.fill();
  if(hot)for(let i=0;i<4;i++){const xx=(i-1.5)*s*.25,yy=-s*.25-((t*60+i*17)%30);ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xx,yy+12);ctx.quadraticCurveTo(xx+6,yy+6,xx,yy);ctx.stroke()}ctx.restore()}
function drawPendulum(px,py,bx,by){ctx.save();ctx.strokeStyle='#8a6a2f';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(bx,by);ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle=INK;ctx.stroke();
  const r=S*1.0;const g=ctx.createRadialGradient(bx-r*.3,by-r*.3,r*.1,bx,by,r);g.addColorStop(0,'#fff1b0');g.addColorStop(.5,'#e8b33a');g.addColorStop(1,'#a8741a');ctx.beginPath();ctx.arc(bx,by,r,0,7);outlineFill(g,3);
  ctx.strokeStyle='rgba(120,70,10,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(bx,by,r*.65,0,7);ctx.stroke();ctx.restore()}
function drawPaint(x,y,w,c,k){ctx.save();ctx.translate(x,y);ctx.fillStyle=c;ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();const n=14;for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,r=w*(.75+.25*Math.sin(i*2.3+1))*k;i?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r*.8):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r*.8)}ctx.closePath();ctx.fill();ctx.stroke();
  for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse((i-1.5)*w*.4,w*.75*k+(i%2)*w*.25,w*.08,w*.18*k,0,0,7);ctx.fill()}ctx.fillStyle='rgba(255,255,255,.45)';ctx.beginPath();ctx.ellipse(-w*.25,-w*.25,w*.18,w*.1,-.5,0,7);ctx.fill();ctx.restore()}
function drawDragonHead(x,y,dir,open){ctx.save();ctx.translate(x,y);ctx.scale(dir,1);const s=S*.8;ctx.beginPath();ctx.moveTo(-s,-s*.5);ctx.quadraticCurveTo(s*.2,-s*.75,s*.9,-s*.2);ctx.lineTo(s*.9,-s*.05+open*s*.05);ctx.lineTo(-s,s*.05);ctx.closePath();outlineFill('#7b2fbf');
  ctx.beginPath();ctx.moveTo(-s,s*.05);ctx.lineTo(s*.85,s*.05+open*s*.3);ctx.quadraticCurveTo(s*.2,s*.55,-s,s*.5);ctx.closePath();outlineFill('#6a26a8');
  for(const hx of[-.5,-.1]){ctx.beginPath();ctx.moveTo(hx*s,-s*.55);ctx.lineTo(hx*s-s*.25,-s*.95);ctx.lineTo(hx*s+s*.15,-s*.6);outlineFill('#ffd23f',2)}eyes(s*.2,-s*.38,s*.09,0);ctx.restore()}
function drawWeb(x,y,r,a=1){ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=1.6;for(let i=0;i<8;i++){const q=i/8*Math.PI*2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(q)*r,Math.sin(q)*r*.7);ctx.stroke()}
  for(let k=1;k<=4;k++){ctx.beginPath();for(let i=0;i<=8;i++){const q=i/8*Math.PI*2,rr2=r*k/4;i?ctx.lineTo(Math.cos(q)*rr2,Math.sin(q)*rr2*.7):ctx.moveTo(Math.cos(q)*rr2,Math.sin(q)*rr2*.7)}ctx.stroke()}ctx.restore()}
function drawClam(x,y,open){ctx.save();ctx.translate(x,y);const s=S*.85,a=open*.9;ctx.beginPath();ctx.ellipse(0,0,s,s*.32,0,0,Math.PI);outlineFill('#ff9ec4');
  ctx.save();ctx.rotate(-a*.25);ctx.translate(0,-a*s*.15);ctx.beginPath();ctx.ellipse(0,0,s,s*.32+a*s*.15,0,Math.PI,0);outlineFill('#ffb7d3');ctx.strokeStyle='rgba(180,60,110,.5)';ctx.lineWidth=2;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(i*s*.28,-(s*.3+a*s*.12));ctx.stroke()}ctx.restore();
  if(open>.4){ctx.fillStyle='#fffbe8';ctx.beginPath();ctx.arc(0,-s*.06,s*.14,0,7);ctx.fill()}ctx.restore()}
let SHD_CV=null;
function drawShadowOf(src,x,y){const sz=Math.round(S),c=SHD_CV||(SHD_CV=document.createElement('canvas')),w=Math.ceil(S*2.2),h=Math.ceil(BH*2);if(c.width!==w||c.height!==h){c.width=w;c.height=h}
  const g=c.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,w,h);withCtx(g,S,()=>drawSharliz(src,w/2,h/2));g.globalCompositeOperation='source-atop';g.fillStyle='#231a3a';g.fillRect(0,0,w,h);g.globalCompositeOperation='source-over';
  ctx.save();ctx.globalAlpha=.88;ctx.drawImage(c,x-w/2,y-h/2);ctx.restore();ctx.save();ctx.fillStyle='rgba(255,60,90,.9)';for(const ex of[-.18,.18]){ctx.beginPath();ctx.ellipse(x+ex*S,y-BH*.12,S*.07,S*.05,0,0,7);ctx.fill()}ctx.restore()}

/* ---------- swing-speed helper (build.py routes the swing step through swMul) ---------- */
function swMul(s){if(!s)return 1;let k=1;
  if(s.honey)k*=s.xs*s.dir<0?.55:1.5;          // honey: slow while it swings back toward the middle, fast going out
  if(s.sleepy){const q=s.sleepy;k*=q.t<q.slow?1-.78*(q.t/q.slow):1.85}
  if(s.glitch>0)k*=s.gk||0;
  return k}
const dropFail=(msg,col)=>{const d=dropping;if(!d)return;dropping=null;bodies.push({s:d,x:xOf(d.xs),y:d.y,vx:rnd(-1,1)*S*3,vy:-BH*1.2,rot:0,vr:rnd(-6,6),mood:'scared'});combo=0;state='wait';spawnAt=time+.8;popup(msg,xOf(d.xs),d.y-BH*.6,col||'#ff8a00');sfx.slide();vib(30);updateHud()};
const midWY=()=>(swingY()+yOf(tower.length-1))/2;     // world y half way between the swing and the top of the tower

/* ---------- the 20 mechanics ---------- */
Object.assign(MECH,{
  cannon:ev('event',{start(){if(tower.length<3)return false;const side=Math.random()<.5?-1:1;hz.m.cannon={t:0,warn:1.7-Math.min(.4,lvInZone()*.04),side,wy:yOf(tower.length-1)-BH*.1,ball:null,plug:0,hit:0};sfx.creak();return true},
    cx(m){return m.side<0?S*.75:W-S*.75},
    update(dt,m,live){m.t+=dt;if(m.plug||m.hit){(m.plug?m.plug+=dt:m.hit+=dt);if((m.plug||m.hit)>.6)delete hz.m.cannon;return}
      if(m.t>=m.warn&&!m.ball){m.ball={x:this.cx(m),vx:-m.side*W/1.1};sfx.boom();shake=Math.max(shake,reduceMotion?0:.12)}
      if(m.ball){m.ball.x+=m.ball.vx*dt;const tp=topScreen();if(Math.abs(m.ball.x-tp.x)<S*.55){m.hit=.01;burst(tp.x,yOf(tower.length-1),['#23262e','#ff8a00','#ffd60a'],14);if(live&&tower.length>2){knockTop(1,-m.side);popup(t('m_boom'),tp.x,yOf(tower.length-1)-BH,'#ff8a00');sfx.crash();vib(40)}}
        if(m.ball&&(m.ball.x<-60||m.ball.x>W+60))m.hit=.01}},
    draw(m){const y=sy(m.wy);if(!m.plug)drawCannon(this.cx(m),y,-m.side,time,!m.ball);if(m.ball&&!m.hit){drawBall(m.ball.x,y-S*.05);if(Math.floor(time*3)%2)tapRing(m.ball.x,y,S*.6)}else if(!m.plug&&!m.ball&&Math.floor(time*3)%2)tapRing(this.cx(m),y,S*.8)},
    tap(px,py,m){if(m.plug||m.hit)return false;const y=sy(m.wy),x=m.ball?m.ball.x:this.cx(m);if(Math.hypot(px-x,py-y)<S*1.05){m.plug=.01;m.ball=null;pts(20);popup(t(m.t<m.warn?'m_plug':'m_stop'),x,m.wy-BH*.4,'#a3e635');sfx.pop();return true}return false},
    bal(m){if(m.plug||m.hit)return null;return [()=>({x:m.ball?m.ball.x:this.cx(m),y:sy(m.wy)}),()=>{m.plug=.01;m.ball=null}]},
    demo(p,H_){const y=H_.at(1);drawCannon(30,y,1,p,p<1);if(p>1){const x=30+(p-1)*200;if(x<H_.cx)drawBall(x,y);else burstDemo(ctx,H_.cx,y,p-1.55)}if(p<1)H_.ring(30,y,20)}}),
  windup:ev('event',{start(){if(tower.length<3)return false;const dir=Math.random()<.5?-1:1;hz.m.windup={t:0,dur:2.8,dir,off:-dir*.55,flip:0};sfx.whistle();return true},
    pos(m){const tp=topScreen();return {x:tp.x+m.off*S,y:tp.y-BH*.62}},
    update(dt,m,live){m.t+=dt;if(m.flip){m.flip+=dt;if(m.flip>.8)delete hz.m.windup;return}m.off+=m.dir*1.1/m.dur*dt;
      if(live&&tower.length>1){const top=tower[tower.length-1];top.xs+=m.dir*(.09+lvInZone()*.006)*dt;if(Math.random()<dt*3)jig(top,.3)}
      if(m.t>=m.dur){popup(t('m_push'),this.pos(m).x,yOf(tower.length-1)-BH,'#ff3b5c');delete hz.m.windup}},
    draw(m){const p=this.pos(m);let x=p.x,y=p.y;if(m.flip){x+=m.dir*m.flip*300;y-=m.flip*260-m.flip*m.flip*400}drawCar(x,y,m.dir,time);if(!m.flip&&Math.floor(time*3)%2)tapRing(p.x,p.y,S*.7)},
    tap(px,py,m){if(m.flip)return false;const p=this.pos(m);if(Math.hypot(px-p.x,py-p.y)<S*1.05){m.flip=.01;pts(20);popup(t('m_flip'),p.x,scrToW(p.y)-BH*.3,'#a3e635');sfx.pop();return true}return false},
    bal(m){return m.flip?null:[()=>this.pos(m),()=>{m.flip=.01}]},
    demo(p,H_){drawSharliz(H_.a,H_.cx,H_.at(0));const o=Math.min(1,p/2)*16;drawSharliz(H_.b,H_.cx+o,H_.at(1));drawCar(H_.cx-20+p*22,H_.at(1)-26,1,p);if(p>.5&&p<1.4)H_.ring(H_.cx-20+p*22,H_.at(1)-26,16)},full:true}),
  spores:ev('event',{start(){const r=rangeXs();hz.m.spores={t:0,dur:6.5,list:[0,1,2].map(i=>({xs:(i-1)*r*.6+rnd(-.2,.2),y:H+40+i*50,pop:0}))};sfx.bloop();return true},
    update(dt,m){m.t+=dt;const ty=sy(swingY());for(const j of m.list){if(j.pop){j.pop+=dt;continue}j.y=Math.max(ty+Math.sin(m.t*2+j.xs*3)*12,j.y-80*dt);
        if(swinger&&!swinger.entering&&state==='aim'){const s=swingScr();if(Math.hypot(s.x-xOf(j.xs),s.y-j.y)<S*.95){j.pop=.01;swinger.dizzy=2.6;popup(t('m_dizzy'),s.x,swingY()-BH*.7,'#c69cff');sfx.bloop()}}}
      if(swinger&&swinger.dizzy>0&&!swinger.entering){swinger.dizzy-=dt;if(Math.random()<dt*2.4)swinger.dir*=-1}
      if(m.t>m.dur||m.list.every(j=>j.pop>.4))delete hz.m.spores},
    draw(m){for(const j of m.list){const a=j.pop?Math.max(0,1-j.pop*2.5):Math.min(1,(m.dur-m.t)*2);if(a>0)drawSpore(xOf(j.xs),j.y,time+j.xs,a);if(!j.pop&&Math.floor(time*3)%2)tapRing(xOf(j.xs),j.y,S*.75)}
      if(swinger&&swinger.dizzy>0){const s=swingScr();ctx.save();ctx.fillStyle='#ffe24d';for(let i=0;i<3;i++){const a=time*5+i*2.1;ctx.font=`${Math.round(S*.35)}px system-ui`;ctx.fillText('★',s.x+Math.cos(a)*S*.6,s.y-BH*.55+Math.sin(a)*S*.2)}ctx.restore()}},
    tap(px,py,m){for(const j of m.list)if(!j.pop&&Math.hypot(px-xOf(j.xs),py-j.y)<S){j.pop=.01;pts(15);popup(t('m_scared'),xOf(j.xs),scrToW(j.y)-BH*.3,'#a3e635');sfx.pop();return true}return false},
    bal(m){const j=m.list.find(j=>!j.pop&&j.y<H-S*.3);return j?[()=>({x:xOf(j.xs),y:j.y}),()=>{j.pop=.01}]:null},
    demo(p,H_){const y=190-Math.min(1,p/1.4)*140;drawSpore(H_.cx+40,y,p);drawSharliz(H_.m,H_.cx+Math.sin(p*(p>1.4?9:3))*40,40);if(p>.7&&p<1.3)H_.ring(H_.cx+40,y,20)}}),
  honey:ev('swinger',{start(){if(!swinger||swinger.kind||swinger.gold||state!=='aim')return false;if(shieldBlocks())return true;swinger.honey=1;popup(t('m_sticky'),W/2,swingY()-BH*.9,'#ffb800');return true},
    demo(p,H_){const ph=p*2.2,x=H_.cx+Math.sin(ph-.35*Math.cos(ph))*70;const s=H_.m;drawSharliz(s,x,40);ctx.save();ctx.fillStyle='rgba(255,184,0,.8)';ctx.beginPath();ctx.ellipse(x,28,14,6,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(x+5,40+Math.sin(p*5)*3,3,7,0,0,7);ctx.fill();ctx.restore()}}),
  spotlight:ev('event',{start(){hz.m.spotlight={t:0,warn:.9,dur:5.5,c:null};sfx.creak();return true},
    sp(m){const tp=topScreen(),y0=sy(swingY());return {x:W/2+Math.sin(m.t*1.25)*W*.34,y:(tp.y+y0)/2+Math.sin(m.t*.8)*BH*.6}},
    update(dt,m){m.t+=dt;if(m.t>m.warn+m.dur)delete hz.m.spotlight},
    landing(perfect,great,d,m){if(perfect&&m.t>m.warn){delete hz.m.spotlight;pts(25);popup(t('m_lights'),W/2,swingY()-BH*.3,'#ffe24d')}},
    draw(m){const dark=m.t<m.warn?(Math.floor(m.t*8)%2?.55:.1):.9*Math.min(1,(m.warn+m.dur-m.t)*2);if(dark<=.02)return;const dpr=DPR||1;let c=m.c;if(!c){c=m.c=document.createElement('canvas');c.width=Math.round(W*dpr);c.height=Math.round(H*dpr)}
      const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.globalCompositeOperation='source-over';g.clearRect(0,0,W,H);g.fillStyle=`rgba(10,6,22,${dark})`;g.fillRect(0,0,W,H);g.globalCompositeOperation='destination-out';
      const p=this.sp(m);lightHole(g,p.x,p.y,S*2.4,1);if(swinger)lightHole(g,xOf(swinger.xs),sy(swingY()),S*1.1,.55);g.globalCompositeOperation='source-over';ctx.drawImage(c,0,0,W,H);
      ctx.save();ctx.globalAlpha=.18*Math.min(1,dark*1.5);ctx.fillStyle='#fff6c8';ctx.beginPath();ctx.moveTo(p.x-S*.4,hudBottom);ctx.lineTo(p.x+S*.4,hudBottom);ctx.lineTo(p.x+S*2.2,p.y);ctx.lineTo(p.x-S*2.2,p.y);ctx.fill();ctx.restore()},
    demo(p,H_,g){const x=140+Math.sin(p*2)*90;drawSharliz(H_.a,H_.cx,H_.at(0));drawSharliz(H_.b,H_.cx,H_.at(1));g.save();g.fillStyle='rgba(10,6,22,.85)';g.beginPath();g.rect(0,0,280,190);g.arc(x,110,38,0,7,true);g.fill('evenodd');g.restore()},full:true}),
  hourglass:ev('event',{start(){if(!swinger||swinger.entering||state!=='aim')return false;hz.m.hourglass={t:0,dur:Math.max(1.6,2.6-lvInZone()*.06),s:swinger,done:0};sfx.creak();return true},
    update(dt,m,live){m.t+=dt;if(m.done){m.done+=dt;if(m.done>.6)delete hz.m.hourglass;return}
      if(swinger!==m.s){m.done=.01;if(dropping===m.s){pts(10);popup(t('m_inTime'),xOf(m.s.xs),m.s.y-BH*.6,'#a3e635')}return}
      if(m.t>=m.dur){m.done=.01;if(live&&state==='aim'&&swinger===m.s){popup(t('m_timeup'),xOf(swinger.xs),swingY()-BH*.8,'#ff8a00');sfx.slide();drop()}}},
    draw(m){if(m.done)return;const s=swingScr();drawHourglass(s.x,s.y-BH*1.05,Math.min(1,m.t/m.dur))},
    demo(p,H_){const k=Math.min(1,p/2.2),x=p<2.2?H_.cx+Math.sin(p*3)*60:H_.cx+Math.sin(2.2*3)*60,y=p<2.2?40:40+(p-2.2)**2*300;drawSharliz(H_.m,x,Math.min(y,H_.at(2)));if(p<2.2)drawHourglass(x,10,k);drawSharliz(H_.a,H_.cx,H_.at(0));drawSharliz(H_.b,H_.cx,H_.at(1))},full:true}),
  speaker:ev('event',{start(){if(tower.length<3)return false;hz.m.speaker={t:0,dur:5.2,beat:.85,last:-1,boom:0,off:[0,0],wy:midWY()};sfx.rumble();return true},
    sx(i){return i?W-S*.7:S*.7},
    update(dt,m){m.t+=dt;m.boom=Math.max(0,m.boom-dt*3);const b=Math.floor(m.t/m.beat);if(b!==m.last&&m.t>.5){m.last=b;if(m.off[0]&&m.off[1])return;m.boom=1;sfx.boom();
        if(dropping){let d=0;if(!m.off[0])d+=1;if(!m.off[1])d-=1;if(!d)d=b%2?1:-1;dropping.xs+=d*(.14+lvInZone()*.008);popup(t('m_push'),xOf(dropping.xs),dropping.y-BH*.5,'#ffd23f')}}
      if(m.t>m.dur||m.off[0]&&m.off[1])delete hz.m.speaker},
    draw(m){const y=sy(m.wy);for(const i of[0,1]){if(m.off[i])continue;drawSpeaker(this.sx(i),y,i?-1:1,m.boom);if(m.boom>0){ctx.save();ctx.strokeStyle=`rgba(255,210,63,${m.boom})`;ctx.lineWidth=3;for(let k=1;k<=3;k++){ctx.beginPath();ctx.arc(this.sx(i),y,S*(.8+k*.5+(1-m.boom)),i?Math.PI*.75:-Math.PI*.25,i?Math.PI*1.25:Math.PI*.25);ctx.stroke()}ctx.restore()}
      if(Math.floor(time*3)%2)tapRing(this.sx(i),y,S*.75)}},
    tap(px,py,m){const y=sy(m.wy);for(const i of[0,1])if(!m.off[i]&&Math.hypot(px-this.sx(i),py-y)<S*1.05){m.off[i]=1;pts(15);popup(t('m_off'),this.sx(i),m.wy-BH*.5,'#a3e635');sfx.pop();return true}return false},
    bal(m){const i=m.off[0]?1:0;return m.off[i]?null:[()=>({x:this.sx(i),y:sy(m.wy)}),()=>{m.off[i]=1}]},
    demo(p,H_){const b=(p*1.2)%1<.2;drawSpeaker(22,100,1,b?1:0);drawSpeaker(258,100,-1,b?1:0);const e=Math.min(1,p/2.2);drawSharliz(H_.m,H_.cx+(p>1?14:0),20+(H_.at(2)-20)*e*e);if(p<.8)H_.ring(22,100,18)}}),
  tongue:ev('event',{start(){if(!swinger)return false;const side=Math.random()<.5?-1:1;hz.m.tongue={t:0,warn:1.5-Math.min(.4,lvInZone()*.04),side,grab:0,scared:0};sfx.bloop();return true},
    fx(m){return m.side<0?S*.8:W-S*.8},
    update(dt,m,live){m.t+=dt;if(m.scared){m.scared+=dt;if(m.scared>.8)delete hz.m.tongue;return}
      if(m.t>=m.warn&&!m.grab){if(live&&swinger&&state==='aim'&&!swinger.entering){m.grab=.01;popup(t('m_pulled'),xOf(swinger.xs),swingY()-BH*.7,'#ff6f91');sfx.splat()}else{m.scared=.01;return}}
      if(m.grab){m.grab+=dt;if(swinger&&state==='aim'){const r=rangeXs(),tx=m.side*r*.95;swinger.xs+=(tx-swinger.xs)*Math.min(1,dt*5);swinger.dir=-m.side}if(m.grab>.55)m.scared=.01}},
    draw(m){const y=sy(swingY())+BH*.1;let x=this.fx(m);if(m.scared){x+=m.side*m.scared*200}drawFrog(x,y,-m.side,m.grab?1:Math.min(1,m.t/m.warn),time);
      if(m.grab&&!m.scared&&swinger){const s=swingScr();ctx.save();ctx.strokeStyle='#ff6f91';ctx.lineWidth=S*.16;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-m.side*S*.25,y+S*.05);ctx.lineTo(s.x,s.y);ctx.stroke();ctx.restore()}
      if(!m.grab&&!m.scared&&Math.floor(time*3)%2)tapRing(x,y,S*.85)},
    tap(px,py,m){if(m.grab||m.scared)return false;const y=sy(swingY())+BH*.1,x=this.fx(m);if(Math.hypot(px-x,py-y)<S*1.1){m.scared=.01;pts(20);popup(t('m_scared'),x,scrToW(y)-BH*.4,'#a3e635');sfx.pop();return true}return false},
    bal(m){return m.grab||m.scared?null:[()=>({x:this.fx(m),y:sy(swingY())+BH*.1}),()=>{m.scared=.01}]},
    demo(p,H_){drawFrog(250,40,-1,Math.min(1,p/1.4),p);let x=H_.cx+Math.sin(p*3)*40;if(p>1.4){x=x+(230-x)*Math.min(1,(p-1.4)*3);ctx.save();ctx.strokeStyle='#ff6f91';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(235,42);ctx.lineTo(x,40);ctx.stroke();ctx.restore()}drawSharliz(H_.m,x,40);if(p<1.3)H_.ring(250,40,20)}}),
  vines:ev('event',{start(){if(tower.length<3)return false;hz.m.vines={t:0,dur:6.5,cut:0};sfx.creak();return true},
    update(dt,m){m.t+=dt;if(m.cut){m.cut+=dt;if(m.cut>.5)delete hz.m.vines;return}if(m.t>m.dur)delete hz.m.vines},
    landing(perfect,great,d,m){if(m.cut||m.t<.5)return;const prev=tower[tower.length-2];if(!prev||!d)return;if(Math.abs(d.xs-prev.xs)>.2&&tower.length>2){knockTop(1,Math.sign(d.xs-prev.xs)||1);popup(t('m_ouch'),xOf(d.xs),yOf(tower.length)-BH,'#ff3b5c');sfx.splat();vib(40)}},
    draw(m){const tp=topScreen(),h=BH*1.3*Math.min(1,m.t*2)*(m.cut?Math.max(0,1-m.cut*2):1);if(h<=1)return;for(const sd of[-1,1])drawThorns(tp.x+sd*S*.95,tp.y+BH*.4,h,time,sd);if(!m.cut&&Math.floor(time*3)%2){tapRing(tp.x-S*.95,tp.y-BH*.2,S*.6);tapRing(tp.x+S*.95,tp.y-BH*.2,S*.6)}},
    tap(px,py,m){if(m.cut)return false;const tp=topScreen();for(const sd of[-1,1])if(Math.hypot(px-(tp.x+sd*S*.95),py-(tp.y-BH*.2))<S*.95){m.cut=.01;pts(20);popup(t('m_cut'),tp.x,scrToW(tp.y)-BH*.8,'#a3e635');sfx.pop();return true}return false},
    bal(m){return m.cut?null:[()=>{const tp=topScreen();return {x:tp.x+S*.95,y:tp.y-BH*.2}},()=>{m.cut=.01}]},
    demo(p,H_){drawSharliz(H_.a,H_.cx,H_.at(0));drawSharliz(H_.b,H_.cx,H_.at(1));for(const sd of[-1,1])drawThorns(H_.cx+sd*34,H_.at(1)+20,Math.min(1,p)*50,p,sd);if(p>1.2&&p<2)H_.ring(H_.cx+34,H_.at(1)-10,16)},full:true}),
  tumbleweed:ev('event',{start(){if(tower.length<3)return false;const dir=Math.random()<.5?1:-1;hz.m.tumbleweed={t:0,dir,x:dir>0?-S*1.2:W+S*1.2,wy:midWY(),stop:0,hit:0};sfx.whistle();return true},
    py(m){return sy(m.wy)+Math.abs(Math.sin(m.t*4))*-BH*.5},
    update(dt,m){m.t+=dt;if(m.stop){m.stop+=dt;if(m.stop>.6)delete hz.m.tumbleweed;return}m.x+=m.dir*W/3.4*dt;
      if(dropping&&!dropping.twHit&&Math.hypot(xOf(dropping.xs)-m.x,sy(dropping.y)-this.py(m))<S*1.05){dropping.twHit=1;dropping.xs+=m.dir*rnd(.28,.4);popup(t('m_knock'),xOf(dropping.xs),dropping.y-BH*.5,'#d9a45a');sfx.splat();vib(25)}
      if(m.x<-S*2||m.x>W+S*2)delete hz.m.tumbleweed},
    draw(m){const y=this.py(m),x=m.stop?m.x:m.x;ctx.save();if(m.stop)ctx.globalAlpha=Math.max(0,1-m.stop*2);drawTumble(x,y,time*m.dir);ctx.restore();if(!m.stop&&Math.floor(time*3)%2)tapRing(x,y,S*.8)},
    tap(px,py,m){if(m.stop)return false;if(Math.hypot(px-m.x,py-this.py(m))<S*1.1){m.stop=.01;pts(15);popup(t('m_stop'),m.x,scrToW(this.py(m))-BH*.4,'#a3e635');burst(m.x,scrToW(this.py(m)),['#a87a3f','#e8c48a'],10);sfx.pop();return true}return false},
    bal(m){return m.stop?null:[()=>({x:m.x,y:this.py(m)}),()=>{m.stop=.01}]},
    demo(p,H_){const x=-20+((p*110)%320);drawTumble(x,100-Math.abs(Math.sin(p*4))*20,p);const e=Math.min(1,p/2);drawSharliz(H_.m,H_.cx,20+(H_.at(2)-20)*e*e)}}),
  smoke:ev('event',{start(){if(!swinger||swinger.entering||state!=='aim')return false;hz.m.smoke={t:0,at:[.5,1.7],n:0,puffs:[]};return true},
    update(dt,m){m.t+=dt;for(const p of m.puffs)p.k+=dt*1.6;m.puffs=m.puffs.filter(p=>p.k<1);
      if(m.n<m.at.length&&m.t>=m.at[m.n]){m.n++;if(swinger&&state==='aim'&&!swinger.entering){const s=swingScr();m.puffs.push({x:s.x,y:s.y,k:0});const r=rangeXs();let nx;do{nx=rnd(-r,r)}while(Math.abs(nx-swinger.xs)<r*.5);
        swinger.xs=nx;swinger.dir=Math.random()<.5?1:-1;const s2=swingScr();m.puffs.push({x:s2.x,y:s2.y,k:.3});popup(t('m_poof'),s2.x,swingY()-BH*.7,'#c7c9ff');sfx.pop()}}
      if(m.t>2.6&&!m.puffs.length)delete hz.m.smoke},
    draw(m){for(const p of m.puffs)drawSmoke(p.x,p.y,p.k)},
    demo(p,H_){const x=p<1.2?H_.cx-50+Math.sin(p*3)*20:H_.cx+60+Math.sin(p*3)*20;drawSharliz(H_.m,x,40);if(Math.abs(p-1.2)<.4){drawSmoke(H_.cx-50,40,(p-.8)*1.25);drawSmoke(H_.cx+60,40,Math.max(0,p-1.2)*1.25)}}}),
  glitch:ev('swinger',{start(){if(!swinger||swinger.gold||state!=='aim')return false;if(shieldBlocks())return true;swinger.glitch=3.6;swinger.gacc=0;hz.m.glitch={t:0};sfx.zap();return true},
    update(dt,m){m.t+=dt;const s=swinger;if(s&&s.glitch>0){s.glitch-=dt;s.gacc=(s.gacc||0)+dt;s.gk=0;if(s.gacc>=.17){s.gk=s.gacc/Math.max(.008,dt);s.gacc=0}if(s.glitch<=0){s.gk=1;delete hz.m.glitch}}else delete hz.m.glitch},
    draw(m){const s=swinger;if(!s||!(s.glitch>0))return;const p=swingScr();if(Math.random()<.5)return;ctx.save();ctx.globalAlpha=.55;for(const [c,dx] of [['#ff2d6f',-4],['#22d3ee',4]]){ctx.fillStyle=c;ctx.fillRect(p.x-S*.6+dx,p.y-BH*.3+rnd(-BH*.3,BH*.3),S*1.2,rnd(2,6))}ctx.restore()},
    demo(p,H_){const q=Math.floor(p*6)/6;drawSharliz(H_.m,H_.cx+Math.sin(q*3)*70,40);if(Math.floor(p*10)%3===0){ctx.fillStyle='rgba(34,211,238,.6)';ctx.fillRect(H_.cx-60,30+((p*97)%30),120,4)}}}),
  sleepy:ev('swinger',{start(){if(!swinger||swinger.gold||swinger.sleepy||state!=='aim')return false;if(shieldBlocks())return true;swinger.sleepy={t:0,slow:2.4,end:3.4};hz.m.sleepy={t:0};popup(t('m_zzz'),xOf(swinger.xs),swingY()-BH*.8,'#c7c9ff');return true},
    update(dt,m){const s=swinger;if(!s||!s.sleepy){delete hz.m.sleepy;return}const q=s.sleepy,was=q.t<q.slow;q.t+=dt;if(was&&q.t>=q.slow){popup(t('m_wake'),xOf(s.xs),swingY()-BH*.8,'#ffd23f');sfx.whistle();jig(s,1.2)}if(q.t>q.end){delete s.sleepy;delete hz.m.sleepy}},
    draw(m){const s=swinger;if(!s||!s.sleepy||s.sleepy.t>=s.sleepy.slow)return;const p=swingScr();ctx.save();ctx.fillStyle='#e8eaff';ctx.strokeStyle=INK;ctx.lineWidth=2;for(let i=0;i<3;i++){const k=(time*.8+i/3)%1;ctx.globalAlpha=1-k;ctx.font=`${Math.round(S*(.3+k*.25))}px "Lilita One",system-ui`;ctx.strokeText('Z',p.x+S*(.4+k*.5),p.y-BH*(.5+k*.6));ctx.fillText('Z',p.x+S*(.4+k*.5),p.y-BH*(.5+k*.6))}ctx.restore()},
    demo(p,H_){const sp=p<2?1-p*.35:2.2,x=H_.cx+Math.sin(p*3*sp)*60;drawSharliz(H_.m,x,40);if(p<2){ctx.fillStyle='#e8eaff';ctx.font='18px system-ui';ctx.fillText('Z',x+18,18-(p*10)%10)}}}),
  pan:ev('event',{start(){if(tower.length<3)return false;const side=Math.random()<.5?-1:1;hz.m.pan={t:0,warn:1.9-Math.min(.5,lvInZone()*.05),side,got:0,done:0};sfx.creak();return true},
    pos(m){const tp=topScreen();return {x:tp.x+m.side*S*1.35,y:tp.y+BH*.15}},
    update(dt,m,live){m.t+=dt;if(m.got||m.done){(m.got?m.got+=dt:m.done+=dt);if((m.got||m.done)>.7)delete hz.m.pan;return}
      if(m.t>=m.warn){m.done=.01;if(live&&tower.length>1){const top=tower[tower.length-1];top.xs+=-m.side*rnd(.17,.27);jig(top,3.2);top.squash=1;popup(t('m_flip'),xOf(top.xs),yOf(tower.length-1)-BH*1.2,'#ff8a00');sfx.splat();vib(30);burst(xOf(top.xs),yOf(tower.length-1),['#ffffff','#ffd23f'],10)}}},
    draw(m){if(m.got)return;const p=this.pos(m);ctx.save();if(m.done){ctx.translate(p.x,p.y);ctx.rotate(-m.side*Math.sin(Math.min(1,m.done*3)*Math.PI)*.9);ctx.translate(-p.x,-p.y)}ctx.translate(p.x,p.y);ctx.scale(-m.side,1);drawPan(0,0,time,true);ctx.restore();
      if(!m.done&&Math.floor(time*3)%2)tapRing(p.x,p.y,S*.8)},
    tap(px,py,m){if(m.got||m.done)return false;const p=this.pos(m);if(Math.hypot(px-p.x,py-p.y)<S*1.15){m.got=.01;pts(20);popup(t('m_sizzle'),p.x,scrToW(p.y)-BH*.4,'#a3e635');sfx.pop();return true}return false},
    bal(m){return m.got||m.done?null:[()=>this.pos(m),()=>{m.got=.01}]},
    demo(p,H_){drawSharliz(H_.a,H_.cx,H_.at(0));let x=H_.cx,y=H_.at(1);if(p>1.6){const q=Math.min(1,(p-1.6)*2);x-=q*20;y-=Math.sin(q*Math.PI)*40}drawSharliz(H_.b,x,y);ctx.save();ctx.translate(H_.cx+40,H_.at(1)+8);ctx.scale(-1,1);drawPan(0,0,p,true);ctx.restore();if(p<1.4)H_.ring(H_.cx+40,H_.at(1)+8,18)},full:true}),
  pendulum:ev('event',{start(){if(tower.length<3)return false;hz.m.pendulum={t:0,dur:7,ph:Math.random()*6,wy:midWY()+BH*.2};sfx.creak();return true},
    bob(m){const a=Math.sin(m.t*2.1+m.ph)*.85,L=Math.min(H*.55,sy(m.wy)-hudBottom+S);const px=W/2,py=sy(m.wy)-L;return {px,py,x:px+Math.sin(a)*L,y:py+Math.cos(a)*L}},
    update(dt,m){m.t+=dt;const b=this.bob(m);if(dropping&&!dropping.pdHit&&Math.hypot(xOf(dropping.xs)-b.x,sy(dropping.y)-b.y)<S*1.35){dropping.pdHit=1;dropping.xs+=Math.sign(xOf(dropping.xs)-b.x||1)*rnd(.3,.42);popup(t('m_knock'),xOf(dropping.xs),dropping.y-BH*.5,'#e8b33a');sfx.crash();vib(30)}
      if(m.t>m.dur)delete hz.m.pendulum},
    draw(m){const a=Math.min(1,m.t*2,(m.dur-m.t)*2);if(a<=0)return;const b=this.bob(m);ctx.save();ctx.globalAlpha=a;drawPendulum(b.px,b.py,b.x,b.y);ctx.restore()},
    demo(p,H_){const a=Math.sin(p*2.1)*.9,bx=140+Math.sin(a)*90,by=-20+Math.cos(a)*120;drawPendulum(140,-20,bx,by);const e=Math.min(1,p/2.4);drawSharliz(H_.m,H_.cx,10+(H_.at(2)-10)*e*e)}}),
  paint:ev('event',{start(){if(tower.length<3)return false;hz.m.paint={t:0,dur:5,c:pick(['#ff3ea5','#22d3ee','#a3e635','#ffb800','#8b5cf6']),wiped:0,dx:rnd(-.3,.3)};sfx.splat();return true},
    pos(m){const tp=topScreen();return {x:tp.x+m.dx*S,y:tp.y-BH*.1}},
    update(dt,m){m.t+=dt;if(m.wiped){m.wiped+=dt;if(m.wiped>.45)delete hz.m.paint;return}if(m.t>m.dur)delete hz.m.paint},
    draw(m){const p=this.pos(m),k=m.wiped?Math.max(0,1-m.wiped*2.2):Math.min(1,m.t*4),a=Math.min(1,(m.dur-m.t)*2);if(k<=0)return;ctx.save();ctx.globalAlpha=a;drawPaint(p.x,p.y,S*1.7,m.c,k);ctx.restore();if(!m.wiped&&Math.floor(time*3)%2)tapRing(p.x,p.y,S*1.2)},
    tap(px,py,m){if(m.wiped)return false;const p=this.pos(m);if(Math.hypot(px-p.x,py-p.y)<S*1.9){m.wiped=.01;pts(15);popup(t('m_wiped'),p.x,scrToW(p.y)-BH*.6,'#a3e635');sfx.pop();return true}return false},
    bal(m){return m.wiped?null:[()=>this.pos(m),()=>{m.wiped=.01}]},
    demo(p,H_){drawSharliz(H_.a,H_.cx,H_.at(0));drawSharliz(H_.b,H_.cx,H_.at(1));if(p<2.2)drawPaint(H_.cx,H_.at(1),46,'#ff3ea5',Math.min(1,p*3));if(p>1&&p<2)H_.ring(H_.cx,H_.at(1),26)},full:true}),
  firebreath:ev('event',{start(){if(tower.length<3)return false;const side=Math.random()<.5?-1:1;hz.m.firebreath={t:0,side,wy:midWY(),cyc:[1.2,1.0,.85,1.0],shut:0};sfx.rumble();return true},
    fire(m){const c=m.cyc;return m.t>c[0]&&m.t<c[0]+c[1]||m.t>c[0]+c[1]+c[2]&&m.t<c[0]+c[1]+c[2]+c[3]},
    hx(m){return m.side<0?S*.6:W-S*.6},
    update(dt,m){m.t+=dt;if(m.shut){m.shut+=dt;if(m.shut>.6)delete hz.m.firebreath;return}const c=m.cyc;if(m.t>c[0]+c[1]+c[2]+c[3]+.3){delete hz.m.firebreath;return}
      if(this.fire(m)){if(dropping&&Math.abs(sy(dropping.y)-sy(m.wy))<BH*.6){burst(xOf(dropping.xs),dropping.y,['#ff8a00','#ffd60a','#ff3b1f'],12);dropFail(t('m_burned'),'#ff3b1f')}}},
    draw(m){const y=sy(m.wy),x=this.hx(m),on=!m.shut&&this.fire(m);drawDragonHead(x+(m.shut?m.side*m.shut*200:0),y,-m.side,on?1:0);
      if(on){ctx.save();const x0=x-m.side*S*.7,x1=m.side<0?W+20:-20,g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'rgba(255,240,140,.95)');g.addColorStop(.4,'rgba(255,140,30,.9)');g.addColorStop(1,'rgba(255,60,20,.5)');ctx.fillStyle=g;ctx.beginPath();
        ctx.moveTo(x0,y-BH*.15);for(let k=0;k<=12;k++){const xx=x0+(x1-x0)*k/12;ctx.lineTo(xx,y-BH*(.2+.25*k/12)+Math.sin(time*30+k)*4)}for(let k=12;k>=0;k--){const xx=x0+(x1-x0)*k/12;ctx.lineTo(xx,y+BH*(.2+.25*k/12)+Math.sin(time*27+k)*4)}ctx.closePath();ctx.fill();ctx.restore()}
      else if(!m.shut&&m.t<m.cyc[0]){ctx.save();ctx.strokeStyle='rgba(255,90,30,.6)';ctx.setLineDash([8,8]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();ctx.restore()}
      if(!m.shut&&Math.floor(time*3)%2)tapRing(x,y,S*.85)},
    tap(px,py,m){if(m.shut)return false;const y=sy(m.wy),x=this.hx(m);if(Math.hypot(px-x,py-y)<S*1.1){m.shut=.01;pts(25);popup(t('m_snuffed'),x,m.wy-BH*.4,'#a3e635');sfx.pop();return true}return false},
    bal(m){return m.shut?null:[()=>({x:this.hx(m),y:sy(m.wy)}),()=>{m.shut=.01}]},
    demo(p,H_,g){const on=p%1.5>.6;drawDragonHead(262,100,-1,on?1:0);if(on){g.fillStyle='rgba(255,140,30,.85)';g.fillRect(0,88,240,24)}const e=Math.min(1,p/2.6);drawSharliz(H_.m,H_.cx,10+(H_.at(2)-10)*e*e)}}),
  web:ev('event',{start(){if(tower.length<3)return false;const r=rangeXs();hz.m.web={t:0,dur:6.5,xs:rnd(-r*.5,r*.5),wy:midWY(),cut:0,held:null,ht:0};sfx.creak();return true},
    update(dt,m){m.t+=dt;if(m.cut){m.cut+=dt;if(m.held){m.held=null}if(m.cut>.5)delete hz.m.web;return}
      const wx=xOf(m.xs),wy=sy(m.wy);
      if(dropping&&!m.held&&!dropping.webDone&&Math.abs(xOf(dropping.xs)-wx)<S*1.6&&Math.abs(sy(dropping.y)-wy)<BH*.35){m.held=dropping;m.ht=0;dropping.webDone=1;popup(t('m_caught'),xOf(dropping.xs),dropping.y-BH*.5,'#ffffff');sfx.bloop()}
      if(m.held){if(dropping!==m.held){m.held=null}else{m.ht+=dt;dropping.vy=0;dropping.y=m.wy;if(m.ht>.8){dropping.xs+=(dropping.xs>=m.xs?1:-1)*rnd(.22,.32);m.held=null}}}
      if(m.t>m.dur&&!m.held)delete hz.m.web},
    draw(m){const a=m.cut?Math.max(0,1-m.cut*2):Math.min(1,m.t*3,(m.dur-m.t)*2+.3);drawWeb(xOf(m.xs),sy(m.wy),S*1.7,a);if(!m.cut&&Math.floor(time*3)%2)tapRing(xOf(m.xs),sy(m.wy),S*1.1)},
    tap(px,py,m){if(m.cut)return false;if(Math.hypot(px-xOf(m.xs),py-sy(m.wy))<S*1.7){m.cut=.01;pts(20);popup(t('m_cut'),xOf(m.xs),m.wy-BH*.4,'#a3e635');sfx.pop();return true}return false},
    bal(m){return m.cut?null:[()=>({x:xOf(m.xs),y:sy(m.wy)}),()=>{m.cut=.01}]},
    demo(p,H_){drawWeb(H_.cx+10,90,50);let y,x=H_.cx;if(p<.8)y=10+p*100;else if(p<1.6)y=90;else{y=90+(p-1.6)**2*200;x+=Math.min(1,p-1.6)*30}drawSharliz(H_.m,x,Math.min(y,H_.at(2)));if(p>.8&&p<1.6)H_.ring(H_.cx+10,90,26)}}),
  clam:ev('passive',{init(){return {t:0}},
    open(m){const c=(m.t%2.6)/2.6;return c<.55?1:c<.65?1-(c-.55)/.1:c<.92?0:(c-.92)/.08},
    update(dt,m,live){if(live)m.t+=dt},
    landing(perfect,great,d,m){if(perfect||tower.length<3)return;if(this.open(m)<.5){knockTop(1);popup(t('m_bounce'),W/2,yOf(tower.length)-BH,'#ff9ec4');sfx.splat();vib(30)}},
    back(m){},
    draw(m){if(tower.length<2)return;const tp=topScreen(),o=this.open(m);ctx.save();ctx.globalAlpha=.95;drawClam(tp.x,tp.y-BH*.55,o);ctx.restore()},
    demo(p,H_){const c=(p%2.6)/2.6,o=c<.55?1:c<.92?0:1;drawSharliz(H_.a,H_.cx,H_.at(0));drawSharliz(H_.b,H_.cx,H_.at(1));drawClam(H_.cx,H_.at(1)-26,o)},full:true}),
  shadow:ev('event',{start(){if(!swinger||swinger.entering||state!=='aim')return false;hz.m.shadow={t:0,dur:5,s:swinger,gone:0};sfx.whistle();return true},
    pos(m){return {x:xOf(-m.s.xs),y:sy(swingY())}},
    update(dt,m){m.t+=dt;if(m.gone){m.gone+=dt;if(m.gone>.5)delete hz.m.shadow;return}if(swinger!==m.s||m.t>m.dur)delete hz.m.shadow},
    draw(m){if(m.gone)return;const p=this.pos(m);ctx.save();ctx.globalAlpha=Math.min(1,m.t*3,(m.dur-m.t)*2);ctx.strokeStyle='rgba(60,40,90,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W/2,sy(swingY())-BH*2.2);ctx.lineTo(p.x,p.y-BH*.4);ctx.stroke();drawShadowOf(m.s,p.x,p.y);ctx.restore()},
    tap(px,py,m){if(m.gone)return false;const p=this.pos(m);if(Math.hypot(px-p.x,py-p.y)<S*.95&&Math.abs(xOf(m.s.xs)-p.x)>S*1.2){m.gone=.01;pts(20);popup(t('m_gone'),p.x,scrToW(p.y)-BH*.4,'#a3e635');sfx.pop();return true}return false},
    bal(m){return m.gone?null:[()=>this.pos(m),()=>{m.gone=.01}]},
    demo(p,H_){const x=Math.sin(p*3)*70;drawSharliz(H_.m,H_.cx+x,40);drawShadowOf(H_.m,H_.cx-x,40)}})
});
for(const k of ['cannon','windup','spores','honey','spotlight','hourglass','speaker','tongue','vines','tumbleweed','smoke','glitch','sleepy','pan','pendulum','paint','firebreath','web','clam','shadow'])if(MECH[k].type!=='passive')HZ_EVENT[k]=1;
Object.assign(MECH_OF,{pirate:'cannon',toys:'windup',mushroom:'spores',honey:'honey',circus:'spotlight',pyramid:'hourglass',music:'speaker',swamp:'tongue',fairy:'vines',west:'tumbleweed',
  ninja:'smoke',pixel:'glitch',dream:'sleepy',kitchen:'pan',clock:'pendulum',rainbow:'paint',dragon:'firebreath',garden:'web',atlantis:'clam',sky:'shadow'});
// a swinger's honey/glitch/sleepy marks end with it; the honey look (drips) is drawn on top of the Sharliz
{const _ds=drawSharliz;drawSharliz=function(s,...a){const r=_ds(s,...a);if(s&&s.honey&&(s===swinger||s===dropping)){const [x,y]=a;ctx.save();ctx.fillStyle='rgba(255,184,0,.85)';ctx.beginPath();ctx.ellipse(x,y-BH*.38,S*.42,S*.16,0,0,7);ctx.fill();
    for(const dx of[-.25,.1,.3]){ctx.beginPath();ctx.ellipse(x+dx*S,y-BH*.25+Math.sin(time*3+dx*9)*3,S*.07,S*.16,0,0,7);ctx.fill()}ctx.restore()}return r}}
// the new bosses attack with their stage mechanic (same rule as v44: phase 3 adds the classic attack of the art world)
for(const sid of S56.map(q=>q[0])){const k=MECH_OF[sid];BOSS_ATK[sid]=b=>{const art=(ZONES.find(z=>z.sid===sid)||{}).base||S56.find(q=>q[0]===sid)[1];const ok=bossMech(k,b);if(!ok||b.phase>=3)(BOSS_ATK[art]||BOSS_ATK.farm)(b)}}
// ballerina (v66) knocks out the new attackers too
if(typeof balTargets==='function'){const _bt=balTargets;balTargets=function(){const L=_bt(),M=hz.m||{};for(const k in M){const D=MECH[k];if(!D||!D.bal||!M[k]||!S56.some(q=>MECH_OF[q[0]]===k))continue;const q=M[k],r=D.bal(q);if(!r)continue;
    L.push({o:q,tag:k,pos:r[0],kill:r[1],alive:()=>hz.m[k]===q&&!!D.bal(q)})}return L}}
// trophy immunity also turns off the passive clam (v47 only blocks started events)
{const _rh=resetHazards;resetHazards=function(){_rh();try{if(hz.m&&hz.m.clam&&typeof hatImm==='function'&&hatImm('clam'))delete hz.m.clam}catch(e){}}}
// the season cards for 5 and 6 come from v44's maybeIntro (s5_title/s6_title); stage cards from mechPrimary
