/* ===== v81: 500 levels, rewards — the 20 new bosses' trophy hats, new gold feats, sticker book 2, art fallbacks =====
   - Trophy hats (like v47): beating a season 5/6 boss gives 'h_<sid>' = immunity to its stage mechanic + one bonus, no cost.
     3D in code with the series-look shared matcaps (window.SL_H from v69); a first version the 3D team can refine.
   - Gold feats g31-g38 (season 5, book 1) and g41-g48 (season 6, book 2): show up once their art/stk_gNN.webp is in (v64 has3).
   - STICKER BOOK 2 (Tzach, Oct 27: "every 5 seasons a different sticker book, about the same number of stickers per season"):
     book 1 = seasons 1-5, book 2 = season 6 on (its bosses, worlds and gold feats). The cover has a book switch; book 2 opens
     at level 401. sbChapters() returns the chapters of the open book (SB.book), so numbering and pages are per book.
   - Until a new stage's own pictures ship, its sticker cards / boss picture fall back to the borrowed world's (V81_ART). */
const V81_ART=new Set(__V81_ART__);
// own map roads for S5/S6 worlds whose map panel arrived (tools/worlds/road.py traces the white road)
if(typeof MAPROAD!=='undefined')Object.assign(MAPROAD,__V81_ROADS__);
// tower base line in each world's own foreground picture (tools/worlds/k3y.py)
Object.assign(K3Y,__V81_K3Y__);
// own S5/S6 side columns close by themselves: never borrow the base world's column cap (farm beanstalk on mushroom)
{const _p=pic;pic=function(n){if(n.startsWith('w3c_')&&S56_IDS.includes(n.slice(4))&&!PIC_SET.has(n))return null;return _p(n)}}
const S56_IDS=S56.map(q=>q[0]),S6_IDS=S56_IDS.slice(10),zSeason=sid=>{const z=ZONES.find(z=>(z.sid||z.id)===sid);return z?z.season||1:1};

/* ---------- trophy hats ---------- */
Object.assign(TROPHY_NAMES,{pirate:['Pirate Tricorn','כובע הפיראט'],toys:['Wind-up Key','מפתח הקפיץ'],mushroom:['Mushroom Cap','כובע הפטרייה'],honey:['Bee Antennae','מחושי הדבורה'],
  circus:['Ringmaster Hat','כובע מנהל הקרקס'],pyramid:['Golden Pyramid','פירמידת הזהב'],music:['Golden Note','התו המוזהב'],swamp:['Frog Crown','כתר הצפרדע'],fairy:['Fairy Wreath','זר הפיות'],
  west:['Sheriff Hat','כובע השריף'],ninja:['Ninja Band','סרט הנינג׳ה'],pixel:['Pixel Crown','כתר הפיקסלים'],dream:['Dream Nightcap','כובע החלומות'],kitchen:['Toast Topper','כובע הטוסט'],
  clock:['Cuckoo Clock','שעון הקוקייה'],rainbow:['Rainbow Arc','קשת בענן'],dragon:['Dragon Horns','קרני הדרקון'],garden:['Ladybug Leaf','עלה החיפושית'],atlantis:['Trident Crown','כתר הקלשון'],sky:['Shadow Crown','כתר הצל']});
const TFX81={pirate:{imm:'cannon',coins:1.15},toys:{imm:'windup',tol:1.1},mushroom:{imm:'spores',perfPts:1.3},honey:{imm:'honey',coins:1.1},circus:{imm:'spotlight',boss:1.25},
  pyramid:{imm:'hourglass',feverT:1.3},music:{imm:'speaker',perfCoins:2},swamp:{imm:'tongue',wind:.7},fairy:{imm:'vines',fall:.85},west:{imm:'tumbleweed',boss:1.25},
  ninja:{imm:'smoke',spd:.92},pixel:{imm:'glitch',aim:1},dream:{imm:'sleepy',feverT:1.4},kitchen:{imm:'pan',coins:1.15},clock:{imm:'pendulum',tol:1.1},
  rainbow:{imm:'paint',perfPts:1.3},dragon:{imm:'firebreath',hearts:1},garden:{imm:'web',fall:.8},atlantis:{imm:'clam',coins:1.2},sky:{imm:'shadow',hearts:1}};
Object.assign(TROPHY_FX,TFX81);
for(const [sid,fx] of Object.entries(TFX81)){const id='h_'+sid;
  WHATX[id]={p:0,w:1,trophy:sid,n:TROPHY_NAMES[sid]};const F=Object.assign({},fx);if(F.imm)F['imm_'+F.imm]=1;HAT_FX[id]=F;if(!TROPHY_IDS.includes(id))TROPHY_IDS.push(id);
  for(const L of LANG_SET()){const P=PW_TXT[L]||PW_TXT.en,parts=[];for(const k in fx){if(k==='imm'){const m=(I18N[L]['hz_'+fx.imm]||I18N.en['hz_'+fx.imm]||fx.imm).replace(/[!¡！]/g,'');parts.push(P.imm.replace('{m}',m))}
      else parts.push((P[k]||PW_TXT.en[k]||k).replace('{p}',Math.round((fx[k]-1)*100)))}
    I18N[L]['hp_'+id]=parts.join(' · ');I18N[L]['hm_'+id]=''}}
{const _bh=buildHat;buildHat=function(P,id){const sid=id&&id.startsWith('h_')?id.slice(2):'';if(!TFX81[sid])return _bh.apply(this,arguments);
  const T=P.T,g=new T.Group(),SL=window.SL_H;
  const M=(hex,kind)=>SL?SL.mcT(kind||'plastic_gloss',hex):wm(hex,{roughness:.35}),G=()=>SL?SL.goldMC():wm('#ffc93c',{metalness:.65,roughness:.2}),GEM=hex=>SL?SL.mcGem(hex):wm(hex,{emissive:hex,emissiveIntensity:.5,roughness:.05});
  const add=(geo,mat,x=0,y=0,z=0)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);g.add(m);return m};
  const sph=r=>new T.SphereGeometry(r,24,16),cyl=(a,b,h,n=40)=>new T.CylinderGeometry(a,b,h,n),cone=(r,h,n=24)=>new T.ConeGeometry(r,h,n),tor=(r,t,arc)=>new T.TorusGeometry(r,t,10,48,arc||Math.PI*2);
  const band=(hex,r=.28,h=.06)=>add(cyl(r,r*1.02,h),hex==='gold'?G():M(hex),0,h/2);
  switch(sid){
  case 'pirate':{band('#1d1b26',.29,.12);const cr=add(sph(.3),M('#1d1b26','felt_matte'),0,.12);cr.scale.set(1,.55,1);
    for(let i=0;i<3;i++){const a=i/3*Math.PI*2,b=add(tor(.3,.06,Math.PI*.9),M('#1d1b26','felt_matte'),Math.sin(a)*.09,.18,Math.cos(a)*.09);b.rotation.set(-.6,a+Math.PI*1.05,0);b.scale.y=.9}
    const tr=add(tor(.305,.012),G(),0,.12,0);tr.rotation.x=Math.PI/2;const sk=add(sph(.06),M('#f4f1e8'),0,.2,.27);sk.scale.set(1,1,.5);break}
  case 'toys':{band('#ff3b5c',.27,.1);const d=add(sph(.27),M('#ff3b5c'),0,.08);d.scale.set(1,.5,1);add(cyl(.02,.02,.16),G(),0,.28);
    for(const sx of[-1,1]){const l=add(tor(.065,.022),G(),sx*.07,.38,0);l.rotation.y=Math.PI/2}add(sph(.035),M('#ffd23f'),0,.2,.26);break}
  case 'mushroom':{const c=add(sph(.36),M('#e8283f'),0,.02);c.scale.set(1,.62,1);add(cyl(.2,.24,.08),M('#fff4dc'),0,-.0);
    for(const [a,e,r] of [[0,.9,.06],[1.3,.6,.05],[2.6,.8,.055],[3.9,.55,.05],[5.1,.85,.045],[.7,.3,.04],[3.2,.25,.045]]){const d=add(sph(r),M('#ffffff'),Math.sin(a)*.34*Math.cos(e*.6),.02+Math.sin(e)*.22,Math.cos(a)*.34*Math.cos(e*.6));d.scale.y=.45;d.lookAt(0,-.2,0)}break}
  case 'honey':{const hb=add(tor(.29,.025,Math.PI),M('#2b2b33'),0,0,0);hb.rotation.y=Math.PI/2;
    for(const sx of[-1,1]){const st=add(cyl(.012,.012,.32,8),M('#2b2b33'),sx*.12,.16,0);st.rotation.z=-sx*.35;const k=add(sph(.06),M('#ffc21a'),sx*.18,.32,0);const s2=add(tor(.06,.012),M('#2b2b33'),sx*.18,.32,0);s2.rotation.y=Math.PI/2}
    add(cone(.05,.1,6),G(),0,.06,.24);break}
  case 'circus':{const tb=add(cyl(.22,.24,.4),M('#c81e3a','velvet'),0,.2);add(cyl(.42,.42,.025),M('#c81e3a','velvet'),0,0);const gb=add(cyl(.245,.245,.06),G(),0,.06);
    add(sph(.04),GEM('#ffd23f'),0,.06,.25);break}
  case 'pyramid':{band('gold',.27,.05);const p=add(cone(.24,.36,4),G(),0,.23);p.rotation.y=Math.PI/4;add(sph(.05),GEM('#2a6cff'),0,.18,.13);
    for(let i=0;i<4;i++){const a=i/4*Math.PI*2+Math.PI/4;add(sph(.03),GEM('#22d3ee'),Math.sin(a)*.27,.03,Math.cos(a)*.27)}break}
  case 'music':{const b=add(sph(.3),M('#1d1b26','velvet'),0,.04);b.scale.set(1.05,.35,1.05);add(sph(.035),M('#1d1b26','velvet'),0,.14);
    const h=add(sph(.07),G(),.04,.2,.02);h.scale.set(1.25,.9,.8);add(cyl(.016,.016,.3,10),G(),.12,.34,.02);const f=add(tor(.07,.016,Math.PI*.7),G(),.17,.45,.02);f.rotation.z=-1.2;break}
  case 'swamp':{const d=add(sph(.3),M('#5cc23a'),0,.0);d.scale.set(1,.55,1);for(const sx of[-1,1]){add(sph(.09),M('#5cc23a'),sx*.13,.17,.1);const e=add(sph(.07),M('#fbfff0'),sx*.13,.19,.15);e.scale.z=.6}
    for(let i=0;i<5;i++){const a=(i/4-.5)*2.4;add(cone(.04,.12),G(),Math.sin(a)*.27,.2,-Math.cos(a)*.1-.12)}break}
  case 'fairy':{const w=add(tor(.28,.04),M('#6fbf4a'),0,.02);w.rotation.x=Math.PI/2;
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2,c=['#ff8ad8','#ffd23f','#b48cff','#ffffff'][i%4];for(let k=0;k<5;k++){const q=k/5*Math.PI*2,pe=add(sph(.035),M(c),Math.sin(a)*.28+Math.cos(q)*.035*Math.cos(a),.05+Math.sin(q)*.035,Math.cos(a)*.28-Math.cos(q)*.035*Math.sin(a));pe.scale.set(1,1,.4)}add(sph(.02),M('#ffb800'),Math.sin(a)*.29,.05,Math.cos(a)*.29)}break}
  case 'west':{const cr=add(cyl(.23,.27,.24),M('#8a5a33','leather_soft'),0,.12);const br=add(cyl(.46,.46,.025),M('#8a5a33','leather_soft'),0,.0);br.scale.z=1.1;add(cyl(.272,.272,.05),M('#3b2414','leather_soft'),0,.04);
    const st=new T.Shape();for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r=i%2?.03:.07;i?st.lineTo(Math.sin(a)*r,Math.cos(a)*r):st.moveTo(Math.sin(a)*r,Math.cos(a)*r)}const sg=new T.ExtrudeGeometry(st,{depth:.015,bevelEnabled:false});add(sg,G(),0,.13,.25);break}
  case 'ninja':{const b=add(tor(.285,.04),M('#d81e2c','satin'),0,.05);b.rotation.x=Math.PI/2;b.scale.z=1.6;
    for(const [r,l] of [[.25,.22],[-.2,.18]]){const tl=add(new T.BoxGeometry(.05,l,.012),M('#d81e2c','satin'),.05*Math.sign(r),.0-l/2+.04,-.29);tl.rotation.z=r}add(new T.BoxGeometry(.12,.06,.01),G(),0,.05,.3);break}
  case 'pixel':{const C=new T.BoxGeometry(.075,.075,.075),cols=['#22d3ee','#ff2d6f','#ffd23f','#a3e635'];for(let i=0;i<16;i++){const a=i/16*Math.PI*2;add(C,M(cols[i%4]),Math.sin(a)*.27,.04,Math.cos(a)*.27).rotation.y=a}
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2;for(let k=1;k<=2;k++)add(C,M(k===2?'#ffd23f':'#22d3ee'),Math.sin(a)*.27,.04+k*.075,Math.cos(a)*.27).rotation.y=a}break}
  case 'dream':{band('#ffffff',.28,.08);const tc=add(cone(.27,.5,32),M('#6a4cc8','velvet'),0,.3);tc.rotation.z=-.35;tc.position.x=.06;add(sph(.07),M('#ffffff','felt_matte'),.2,.52,0);
    for(let i=0;i<4;i++){add(sph(.022),GEM('#ffe24d'),-.08+i*.06,.2+i*.07,.17-i*.02)}break}
  case 'kitchen':{const bx=add(new T.BoxGeometry(.36,.16,.22),SL?SL.mcT('silver','#d9dee8'):wm('#d9dee8',{metalness:.7}),0,.08);
    for(const x of[-.07,.07]){const ts=add(new T.BoxGeometry(.11,.2,.03),M('#e8b46a'),x,.24,0);const cr=add(new T.BoxGeometry(.12,.025,.035),M('#b47a3a'),x,.34,0)}
    add(cyl(.015,.015,.06,8),M('#2b2b33'),.2,.12,0).rotation.z=Math.PI/2;break}
  case 'clock':{band('gold',.27,.05);const f=add(cyl(.16,.16,.05,40),M('#fffbe8'),0,.24);f.rotation.x=Math.PI/2;const rm=add(tor(.16,.02),G(),0,.24,0);
    for(const [a,l] of [[0,.11],[2.1,.08]]){const h=add(new T.BoxGeometry(.015,l,.01),M('#1d1b26'),Math.sin(a)*l/2,.24+Math.cos(a)*l/2,.03);h.rotation.z=-a}
    add(new T.BoxGeometry(.05,.12,.04),G(),0,.1,0);const bd=add(sph(.04),M('#ffb800'),0,.42,.04);break}
  case 'rainbow':{const C=['#ff3b5c','#ff8a00','#ffd23f','#5cc23a','#22a8ff','#8b5cf6'];C.forEach((c,i)=>{const a=add(tor(.32-i*.035,.02,Math.PI),M(c),0,.02,0);a.rotation.y=Math.PI/2});
    for(const sx of[-1,1])for(let k=0;k<3;k++)add(sph(.05),M('#ffffff','felt_matte'),sx*(.24+k*.04),.02+k*.02,0);break}
  case 'dragon':{band('#6a26a8',.28,.06);for(const [x,h,rz] of [[-.17,.3,.45],[0,.36,0],[.17,.3,-.45]]){const c=add(cone(.05,h),G(),x,.06+h/2,0);c.rotation.z=rz}
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const s=add(cone(.035,.06,4),M('#8b3fd8'),Math.sin(a)*.28,.08,Math.cos(a)*.28)}add(sph(.035),GEM('#ff3b1f'),0,.04,.29);break}
  case 'garden':{const lf=add(sph(.32),M('#4caf3a'),0,.0);lf.scale.set(1,.12,.75);const lb=add(sph(.13),M('#e8283f'),0,.07);lb.scale.y=.7;add(sph(.06),M('#1d1b26'),0,.08,.11);
    for(const [x,z] of [[-.06,-.03],[.07,.02],[0,-.08]]){const d=add(sph(.025),M('#1d1b26'),x,.15,z);d.scale.y=.4}break}
  case 'atlantis':{band('gold',.27,.06);add(cyl(.012,.012,.36,8),G(),0,.24);for(const x of[-.06,0,.06]){add(cone(.018,.09,8),G(),x,.44,0)}const cb=add(new T.BoxGeometry(.14,.02,.02),G(),0,.39,0);
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2;add(sph(.025),M('#fffbe8'),Math.sin(a)*.275,.06,Math.cos(a)*.275)}add(sph(.04),GEM('#22d3ee'),0,.03,.28);break}
  case 'sky':{band('#2a1f45',.27,.14);for(let i=0;i<6;i++){const a=i/6*Math.PI*2,c=add(cone(.06,.18),M('#2a1f45'),Math.sin(a)*.26,.22,Math.cos(a)*.26);add(sph(.028),GEM('#b04dff'),Math.sin(a)*.27,.32,Math.cos(a)*.27)}
    add(sph(.05),GEM('#ff3c78'),0,.07,.28);break}}
  try{if(SL&&SL.hatEnvOn)SL.hatEnvOn(g)}catch(e){}P.hatSlot.add(g)}}

/* ---------- gold feats (art arrives from the graphics department; a card exists once its picture does) ---------- */
Object.assign(I18N.en,{gf_beat5:'Beat all {n} bosses of the Adventure Worlds',gf_beat6:'Beat all {n} bosses of the Legend Worlds',gf_s5:'3 stars on all {n} Adventure World levels',gf_s6:'3 stars on all {n} Legend World levels',
  gf_reach:'Reach level {n}',gf_all2:'Collect all the other gold stickers of book 2',gf_beatS4:'Beat {b}, the last boss of the New Worlds',
  sbBook1:'Book 1',sbBook2:'Book 2',sbB2Lock:'Opens at level {n}',albumBook2:'Sticker book 2',sbCover2:'Legends · Shadows · Glory!'});
Object.assign(I18N.he,{gf_beat5:'לנצח את כל {n} הבוסים של עולמות ההרפתקה',gf_beat6:'לנצח את כל {n} הבוסים של עולמות האגדה',gf_s5:'3 כוכבים בכל {n} השלבים של עולמות ההרפתקה',gf_s6:'3 כוכבים בכל {n} השלבים של עולמות האגדה',
  gf_reach:'להגיע לשלב {n}',gf_all2:'לאסוף את כל שאר מדבקות הזהב של אלבום 2',gf_beatS4:'לנצח את {b}, הבוס האחרון של העולמות החדשים',
  sbBook1:'אלבום 1',sbBook2:'אלבום 2',sbB2Lock:'נפתח בשלב {n}',albumBook2:'אלבום מדבקות 2',sbCover2:'אגדות · צללים · תהילה!'});
const GOLDS81=[
 ['g31','Pirate Treasure','אוצר הפיראטים','Ten adventures, ten bosses, one big chest.','עשר הרפתקאות, עשרה בוסים, תיבה אחת גדולה.',1],
 ['g32','Golden Compass','מצפן הזהב','Every adventure, three stars each.','כל הרפתקה, שלושה כוכבים.',1],
 ['g33','Parrot Feather','נוצת התוכי','Not a single heart for the Captain!','אף לב אחד לקפטן!',1],
 ['g34','Pharaoh Mask','מסכת הפרעה','The mummy never touched you.','המומיה לא נגעה בך.',1],
 ['g35','Perfect Machine','מכונת המושלם','Five thousand perfect landings.','חמשת אלפים נחיתות מושלמות.',1],
 ['g36','Level 400','שלב 400','Four hundred floors of fun.','ארבע מאות קומות של כיף.',1],
 ['g37','Sheriff Star','כוכב השריף','The Bandit Bull is behind bars.','השור השודד מאחורי סורג ובריח.',1],
 ['g38','Circus Star','כוכב הקרקס','The whole circus applauds you.','כל הקרקס מוחא לך כפיים.',1],
 ['g41','Legend Crown','כתר האגדה','Ten legends, all beaten.','עשר אגדות, כולן ניצחו.',2],
 ['g42','Starry Scroll','מגילת הכוכבים','Every legend, three stars each.','כל אגדה, שלושה כוכבים.',2],
 ['g43','Dragon Scale','קשקש הדרקון','Three heads, zero hearts lost.','שלושה ראשים, אפס לבבות.',2],
 ['g44','Golden Cuckoo','קוקייה מוזהבת','Right on time, every time.','בדיוק בזמן, כל פעם.',2],
 ['g45','Pixel Trophy','גביע הפיקסלים','High score! Press start to continue.','שיא חדש! לחצו כדי להמשיך.',2],
 ['g46','Top of the World','פסגת העולם','Level 500. You made it to the top!','שלב 500. הגעת לפסגה!',2],
 ['g47','Light in the Dark','אור בחושך','The Shadow could not touch you.','הצל לא הצליח לגעת בך.',2],
 ['g48','Book of Legends','ספר האגדות','Every gold sticker of book 2.','כל מדבקות הזהב של אלבום 2.',2]];
const S5_IDS=S56_IDS.slice(0,10);
Object.assign(GFEAT,{g31:{k:'beat5',T:10,v:()=>beatN(S5_IDS)},g32:{k:'s5',T:100,v:()=>st3(S5_IDS)},g33:{k:'nh',b:'pirate',T:1,v:()=>nh('pirate')},g34:{k:'nh',b:'pyramid',T:1,v:()=>nh('pyramid')},
  g35:{k:'perf',T:5000,v:()=>ST().perf||0},g36:{k:'reach',T:400,v:()=>Math.min(400,(progress.unlocked||1)-1)},g37:{k:'nh',b:'west',T:1,v:()=>nh('west')},g38:{k:'w1',w:'circus',T:10,v:()=>st3(['circus'])},
  g41:{k:'beat6',T:10,v:()=>beatN(S6_IDS)},g42:{k:'s6',T:100,v:()=>st3(S6_IDS)},g43:{k:'nh',b:'dragon',T:1,v:()=>nh('dragon')},g44:{k:'nh',b:'clock',T:1,v:()=>nh('clock')},
  g45:{k:'w1',w:'pixel',T:10,v:()=>st3(['pixel'])},g46:{k:'last',b:'sky',T:1,v:()=>beatN(['sky'])},g47:{k:'nh',b:'sky',T:1,v:()=>nh('sky')},
  g48:{k:'all2',T:7,v:()=>{const D=sbData();return GOLDS81.filter(g=>g[5]===2&&g[0]!=='g48'&&D.got[g[0]]).length}}});
// Crystal Golem is no longer the very last boss
if(GFEAT.g20&&GFEAT.g20.k==='last')GFEAT.g20.k='beatS4';
// the gold chapter of book 1 keeps its 30 + season 5's; book 2 gets its own gold chapter (built below)
GOLDS.push(...GOLDS81.filter(g=>g[5]===1));
const GOLDS2=GOLDS81.filter(g=>g[5]===2);
// 'collect all the other gold stickers' (g30) stays about book 1's first 29
if(GFEAT.g30){GFEAT.g30.v=()=>{const D=sbData();return GOLDS.filter(g=>g[0]!=='g30'&&!GOLDS81.some(x=>x[0]===g[0])&&D.got[g[0]]).length}}
{const _gc=goldCheck;goldCheck=function(){const D=sbData();let n=0;for(const g of GOLDS2){const id=g[0],F=GFEAT[id];if(!has3(id)||D.got[id]||!F)continue;let v=0;try{v=F.v()}catch(e){}if(v>=F.T){D.got[id]=1;GDQ.push(id);n++}}
  if(n){saveProgress();try{stkBadge()}catch(e){}}return _gc.apply(this,arguments)+n}}
{const _gr=goldReveal;goldReveal=function(id){if(GOLDS2.some(g=>g[0]===id)&&!GOLDS.some(g=>g[0]===id)){GOLDS.push(GOLDS2.find(g=>g[0]===id));try{return _gr(id)}finally{GOLDS.pop()}}return _gr(id)}}

/* ---------- album stickers for the new seasons (art from the graphics department: art/stk_s285.webp, stk_s286.webp) ---------- */
for(const s of [['s285','r','New adventures!','הרפתקאות חדשות!','Pirates, toys and a circus? Let\'s go!','פיראטים, צעצועים וקרקס? יוצאים לדרך!','game'],
  ['s286','h','Top of the world','בפסגת העולם','Five hundred floors. Hello, clouds!','חמש מאות קומות. שלום, עננים!','game']])if(has3(s[0])&&!SHZ.some(x=>x[0]===s[0]))SHZ.push(s);

/* ---------- sticker book 2 ---------- */
const B2_LV=401;
SB.book=1;
const b2Open=()=>(progress.unlocked||1)>=B2_LV||(typeof DEV_OPEN!=='undefined'&&DEV_OPEN);
{const B=STK_PAGES.find(p=>p.id==='boss'),Wd=STK_PAGES.find(p=>p.id==='world');
  if(B){const _i=B.items;B.items=()=>_i().filter(it=>zSeason(it.id.slice(5))<6);STK_PAGES.push({id:'boss2',book:2,items:()=>_i().filter(it=>zSeason(it.id.slice(5))>=6)})}
  if(Wd){const _i=Wd.items;Wd.items=()=>_i().filter(it=>zSeason(it.id.slice(6))<6);STK_PAGES.push({id:'world2',book:2,items:()=>_i().filter(it=>zSeason(it.id.slice(6))>=6)})}
  if(GOLDS2.some(g=>has3(g[0])))STK_PAGES.push({id:'gold2',book:2,items:()=>{const D=sbData(),L=lang==='he'?1:0;
    return GOLDS2.filter(g=>has3(g[0])).map(g=>{const p=gfProg(g[0]);return {id:'gold:'+g[0],n:D.got[g[0]]?1:0,src:'art/stk_'+g[0]+'.webp',name:L?g[2]:g[1],line:L?g[4]:g[3],rar:'g',card:1,gold:1,feat:t('gdFeat')+': '+gfText(g[0]),
      hint:gfText(g[0])+(p?' ('+p[0].toLocaleString()+'/'+p[1].toLocaleString()+')':''),prog:p}})}})}
Object.assign(SB_ICON,{boss2:'ic_boss',world2:'ic_map',gold2:'cup_g'});Object.assign(SB_COL,{boss2:'#9b5cff',world2:'#2fb8a8',gold2:'#ffcf3a'});
Object.assign(I18N.en,{pg_boss2:'Legend bosses',pg_world2:'Legend worlds',pg_gold2:'Legend gold'});Object.assign(I18N.he,{pg_boss2:'בוסי האגדה',pg_world2:'עולמות האגדה',pg_gold2:'זהב האגדה'});
if(!I18N.en.pg_gold)Object.assign(I18N.en,{pg_gold:'Gold'});
// book 2 chapters reuse book 1's 'how to get it' line (the zoom and a locked slot showed the raw key hint_boss2), in every language
for(const L of Object.keys(I18N)){const D=I18N[L];if(D)for(const k of['boss','world','gold'])if(D['hint_'+k]!==undefined&&D['hint_'+k+'2']===undefined)D['hint_'+k+'2']=D['hint_'+k]}
sbChapters=function(){return STK_PAGES.filter(P=>(P.book||1)===SB.book)};
// the gold chapter of book 2 uses the same page dressing as book 1's (v64 checks P.id==='gold')
{const _pv=sbPageView;sbPageView=function(){const P=sbChapters()[SB.ch];if(P&&P.id==='gold2'){P.id='gold';try{return _pv.apply(this,arguments)}finally{P.id='gold2';try{const b=SB.el.querySelector('.sb-head b');if(b&&b.textContent===t('pg_gold'))b.textContent=t('pg_gold2')}catch(e){}}}return _pv.apply(this,arguments)}}
// open the album at the first new sticker, in whichever book it is
{const _oa=openAlbum;openAlbum=function(){const seen=progress.stkSeen||[];const nw=P=>P.items().some(it=>it.n&&!seen.includes(it.id));
  if(b2Open()&&!STK_PAGES.filter(P=>(P.book||1)===1).some(nw)&&STK_PAGES.filter(P=>P.book===2).some(nw))SB.book=2;else SB.book=1;const r=_oa.apply(this,arguments);try{sbBookTitle()}catch(e){}return r}}
function sbBookTitle(){if(!SB.el)return;const tt=SB.el.querySelector('.sb-ttl');if(tt&&SB.book===2)tt.textContent=t('albumBook2')}
{const _pv=sbPageView;sbPageView=function(){const r=_pv.apply(this,arguments);try{sbBookTitle()}catch(e){}return r}}
// cover: Book 1 | Book 2 switch above the cover (book 2 locked before level 401), a purple cover for book 2
{const _c=sbCover;sbCover=function(){const r=_c.apply(this,arguments);try{const el=SB.el,cv=el.querySelector('.sb-cover');el.classList.toggle('sb-b2',SB.book===2);
  if(SB.book===2){el.querySelector('h2').textContent=t('albumBook2');el.querySelector('.sb-tape').textContent=t('sbCover2')}
  {let a=0,b=0;for(const P of sbChapters())for(const it of P.items()){if(it.soon)continue;b++;if(it.n)a++}el.querySelector('.sb-prog b').textContent=a+'/'+b}
  const sw=document.createElement('div');sw.className='sb-books';for(const k of[1,2]){const bt=document.createElement('button');bt.className='sb-bk'+(SB.book===k?' on':'')+(k===2&&!b2Open()?' lock':'');
    bt.innerHTML='<b></b><small></small>';bt.querySelector('b').textContent=t('sbBook'+k);bt.querySelector('small').textContent=k===2&&!b2Open()?t('sbB2Lock',{n:B2_LV}):'';
    bt.onclick=()=>{if(SB.book===k)return;if(k===2&&!b2Open()){sfx.locked();noteToast(t('sbB2Lock',{n:B2_LV}));return}sfx.click();SB.book=k;SB.ch=0;SB.pg=0;sbCover()};sw.appendChild(bt)}
  const wrap=el.querySelector('.sb-coverwrap');wrap.parentNode.insertBefore(sw,wrap)}catch(e){console.warn('sb book',e)}return r}}

/* ---------- pictures a new stage doesn't have yet: borrow the art world's (boss picture, album cards, home background) ---------- */
window.BOSS_OWN2D=new Set(S56_IDS.filter(s=>V81_ART.has('boss_'+s)));
const v81base=sid=>{const e=S56.find(q=>q[0]===sid);return e?e[1]:sid};
{const B=STK_PAGES.find(p=>p.id==='boss'),B2=STK_PAGES.find(p=>p.id==='boss2'),Wd=STK_PAGES.find(p=>p.id==='world'),W2=STK_PAGES.find(p=>p.id==='world2');
  const fixB=P=>{if(!P)return;const _i=P.items;P.items=()=>_i().map(it=>{const sid=it.id.slice(5);if(S56_IDS.includes(sid)&&!V81_ART.has('stk_b_'+sid))it.src=V81_ART.has('boss_'+sid)?'art/boss_'+sid+'.webp':'art/stk_b_'+v81base(sid)+'.webp';return it})};
  const fixW=P=>{if(!P)return;const _i=P.items;P.items=()=>_i().map(it=>{const sid=it.id.slice(6);if(S56_IDS.includes(sid)&&!V81_ART.has('stk_w_'+sid))it.src='art/stk_w_'+v81base(sid)+'.webp';return it})};
  fixB(B);fixB(B2);fixW(Wd);fixW(W2)}
// 2D boss picture (pre-boss card, stickers, arcade): a new stage without its own picture shows its art world's boss
{const _hp=hzPic;hzPic=function(n){const m=/^boss_([a-z]+)(_hurt)?$/.exec(n||'');if(m&&S56_IDS.includes(m[1])&&!V81_ART.has('boss_'+m[1]))n='boss_'+v81base(m[1])+(m[2]||'');return _hp(n)}}
// season 5 3D bosses (Meshy Image to 3D from the graphics department's pictures, art/b3d_<sid>.*): rig + attack style, as in v45
Object.assign(B3D_RIG,{
  pirate:{head:{y0:.66,py:.62,amp:.07},yaw:-.32,bob:.015,atk:'flap'},
  toys:{head:{y0:.58,py:.55,amp:.08},jig:{amp:.025,y0:.3},yaw:-.32,bob:.02,atk:'jump'},
  mushroom:{head:{y0:.62,py:.58,amp:.04},yaw:-.32,bob:.015,atk:'shake'},
  honey:{head:{y0:.66,py:.62,amp:.05},yaw:-.32,hover:.03,atk:'spin'},
  circus:{head:{y0:.64,py:.6,amp:.06},yaw:-.32,bob:.015,atk:'lunge'},
  pyramid:{head:{y0:.66,py:.62,amp:.05},yaw:-.32,bob:.012,atk:'shake'},
  music:{head:{y0:.62,py:.58,amp:.06},yaw:-.32,bob:.018,atk:'spin'},
  swamp:{head:{y0:.6,py:.56,amp:.05},jig:{amp:.02,y0:.1},yaw:-.32,bob:.015,atk:'jump'},
  fairy:{head:{y0:.66,py:.62,amp:.05},yaw:-.32,bob:.015,atk:'shake'},
  west:{head:{y0:.66,py:.62,amp:.06},yaw:-.32,bob:.015,atk:'lunge'}});
// season 6 3D bosses (same pipeline)
Object.assign(B3D_RIG,{
  ninja:{head:{y0:.66,py:.62,amp:.06},yaw:-.32,bob:.015,atk:'lunge'},
  pixel:{head:{y0:.64,py:.6,amp:.05},yaw:-.32,hover:.02,atk:'shake'},
  dream:{head:{y0:.62,py:.58,amp:.05},yaw:-.32,hover:.03,atk:'spin'},
  kitchen:{head:{y0:.66,py:.62,amp:.04},yaw:-.32,bob:.015,atk:'jump'},
  clock:{head:{y0:.7,py:.66,amp:.04},yaw:-.32,bob:.012,atk:'shake'},
  rainbow:{head:{y0:.66,py:.62,amp:.07},sway:{y1:.5,amp:.06,f:2.2},yaw:-.32,bob:.01,atk:'lunge'},
  dragon:{head:{y0:.7,py:.66,amp:.06},yaw:-.32,hover:.025,atk:'flap'},
  garden:{head:{y0:.6,py:.56,amp:.05},jig:{amp:.02,y0:.1},yaw:-.32,bob:.015,atk:'jump'},
  atlantis:{head:{y0:.5,py:.45,amp:.05},yaw:-.32,bob:.015,atk:'lunge'},
  sky:{jig:{amp:.025,y0:.05},yaw:-.2,hover:.035,atk:'spin'}});
