/* ===== v67: THE SHARLIZ HOUSE (Tzach, Oct 8; proposal https://claude.ai/artifact/7t4WduxuWDC1aZxkGcKEMt) =====
   Opens at player level 10 (house icon in the lobby's small column). FLAT front-view rooms (Toca Boca style, Tzach Oct 9) that open
   with the player level (living 10, kitchen 13, bedroom 16, yard 20). 25 furniture items, bought with coins only, 5 levels each (a level also
   needs a player level, HS_GATE), each one gives a small power in the game (hsVal + the hooks at the bottom). No hearts,
   nothing random. Drag an item with a finger to move it anywhere on the floor (wall items on the wall), the turn button mirrors it.
   House SKINS (6) are looks only. Art comes from the graphics department (spec /mnt/project-files/game/house/art-spec.md,
   flat look: flat-spec.md):
   art/hf_room_<skin>_<room>.webp (4:3, HF_CAL = floor line), art/hs_house_<skin>.webp, art/hf_<id>.webp (front view). Until a picture
   exists the room is drawn by code and the item uses its old isometric picture (art/hs_f_<id>) or a drawn box + emoji.
   art/hf_<id>_d2..d10.webp = designs 2..10 of an item (each upgrade level opens 2).
   Screen (Tzach approved the ChatGPT design, Oct 9): room tab bar, one big furniture card in a carousel under the house, the picked item's sheet
   (now → next, 10 designs, turn, upgrade); gold buttons spend coins.
   progress.house={lv:{id:1..5},fpos:{id:{x,y,m}},sty:{id:design 1..10, absent = newest open},skin,skins:[],cnt:{oven,fridge,bed,fb},room,intro} */
Object.assign(I18N.en,{hsTitle:'Sharliz House',hsSub:'Furniture with powers',hsLocked:'Opens at player level {n}',hsLvl:'Level {n}',hsBuy:'Buy',hsUp:'Upgrade',hsMax:'Max level!',
  hsNeedLv:'Player level {n}',hsNow:'Now',hsNext:'Next level',hsTurn:'Turn',hsDrag:'Drag it with your finger to move it',hsSkins:'House skins',hsUse:'Use',hsUsing:'In use',
  hsOpenT:'Your house is open!',hsOpenP:'Buy furniture, decorate it, and every piece makes your Sharliz stronger.',hsGo:'To the house',hsBought:'{x}: level {n}!',hsRoomLock:'This room opens at player level {n}',
  hsNoRoom:'No free spot in this room. Move something first.',hsMini:'House',hsDesign:'Design',hsNewLook:'New look: {x}!',hsDesLock:'Upgrade to ★{n} to open this design',hsBonus:'House bonus',
  hsOven:'Cookie oven: +1 buddy cookie!',hsFridge:'Fridge: a free booster!',hsBed:'Comfy bed: a free shield!',hsWard:'Coins back from the wardrobe: +{n}!',hsMail:'Mailbox: +{n} coins!',hsBird:'Cookies from the bird house: +{n}!',
  hsr_living:'Living room',hsr_kitchen:'Kitchen',hsr_bedroom:'Bedroom',hsr_yard:'Yard',
  hss_cottage:'Wood cottage',hss_candy:'Candy house',hss_space:'Space station',hss_ocean:'Undersea bubble',hss_castle:'Royal castle',hss_jungle:'Jungle treehouse',
  hsf_piggy:'Piggy bank',hsf_sofa:'Cozy sofa',hsf_clock:'Grandfather clock',hsf_fireplace:'Fireplace',hsf_aquarium:'Fish tank',hsf_books:'Bookshelf',hsf_tv:'TV',
  hsf_oven:'Cookie oven',hsf_fridge:'Fridge',hsf_candyjar:'Candy jar',hsf_table:'Dining table',hsf_sink:'Sink',hsf_toaster:'Toaster',
  hsf_bed:'Comfy bed',hsf_nightlight:'Night light',hsf_toychest:'Toy chest',hsf_wardrobe:'Wardrobe',hsf_trophies:'Trophy shelf',hsf_telescope:'Telescope',
  hsf_vane:'Weather vane',hsf_mailbox:'Mailbox',hsf_birdhouse:'Bird house',hsf_flowers:'Flower bed',hsf_trampoline:'Trampoline',hsf_balloons:'Balloon post',
  hsp_piggy:'+{n}% coins every level you win',hsp_sofa:'+{n}% wider landing window',hsp_clock:'Swing {n}% slower',hsp_fireplace:'+{n}% light in night worlds',hsp_aquarium:'Waves, currents and dunes {n}% weaker',
  hsp_books:'+{n}% XP',hsp_tv:'Frenzy lasts {n}% longer',hsp_oven:'A buddy cookie every {n} wins',hsp_fridge:'A free booster every {n} wins',hsp_candyjar:'+{n}% candy in holiday events',
  hsp_table:'Coins for every heart left: +{n}',hsp_sink:'Storm landings slide {n}% less',hsp_toaster:'+{n} s in the bonus stage',hsp_bed:'A free shield every {n} levels',
  hsp_nightlight:'Aim line for the first {n} floors',hsp_toychest:'+{n}% coins in the arcade',hsp_wardrobe:'{n}% coins back on My hero buys',hsp_trophies:'+{n}% boss damage',
  hsp_telescope:'Fall {n}% slower in space worlds',hsp_vane:'Wind {n}% weaker',hsp_mailbox:'+{n}% coins in the daily gift',hsp_birdhouse:'Cookies when an egg hatches: +{n}',
  hsp_flowers:'+{n}% points for a perfect',hsp_trampoline:'Coins for every frenzy landing: +{n}',hsp_balloons:'Coin balloon comes {n}% more often'});
Object.assign(I18N.he,{hsTitle:'בית השארליזים',hsSub:'רהיטים עם כוחות',hsLocked:'נפתח ברמת שחקן {n}',hsLvl:'רמה {n}',hsBuy:'קנה',hsUp:'שדרג',hsMax:'רמה מקסימלית!',
  hsNeedLv:'רמת שחקן {n}',hsNow:'עכשיו',hsNext:'ברמה הבאה',hsTurn:'סובב',hsDrag:'גרור באצבע כדי להזיז',hsSkins:'סקינים לבית',hsUse:'בחר',hsUsing:'בשימוש',
  hsOpenT:'הבית שלך נפתח!',hsOpenP:'קנה רהיטים, קשט את הבית, וכל רהיט מחזק את השארליז שלך.',hsGo:'לבית',hsBought:'{x}: רמה {n}!',hsRoomLock:'החדר הזה נפתח ברמת שחקן {n}',
  hsNoRoom:'אין מקום פנוי בחדר. הזז משהו קודם.',hsMini:'בית',hsDesign:'עיצוב',hsNewLook:'עיצוב חדש: {x}!',hsDesLock:'שדרגו לרמה {n} כדי לפתוח את העיצוב הזה',hsBonus:'בונוס הבית',
  hsOven:'תנור עוגיות: עוד עוגייה לבאדי!',hsFridge:'מקרר: בוסטר חינם!',hsBed:'מיטה מפנקת: מגן חינם!',hsWard:'מטבעות שחזרו מארון הבגדים: {n}!',hsMail:'תיבת דואר: עוד {n} מטבעות!',hsBird:'עוגיות מבית הציפורים: {n}!',
  hsr_living:'סלון',hsr_kitchen:'מטבח',hsr_bedroom:'חדר שינה',hsr_yard:'חצר',
  hss_cottage:'בקתת עץ',hss_candy:'בית ממתקים',hss_space:'תחנת חלל',hss_ocean:'בועה מתחת לים',hss_castle:'ארמון מלכותי',hss_jungle:'בית עץ בג׳ונגל',
  hsf_piggy:'קופת חזיר',hsf_sofa:'ספה רכה',hsf_clock:'שעון סבא',hsf_fireplace:'אח בוערת',hsf_aquarium:'אקווריום',hsf_books:'מדף ספרים',hsf_tv:'טלוויזיה',
  hsf_oven:'תנור עוגיות',hsf_fridge:'מקרר',hsf_candyjar:'צנצנת ממתקים',hsf_table:'שולחן אוכל',hsf_sink:'כיור',hsf_toaster:'טוסטר',
  hsf_bed:'מיטה מפנקת',hsf_nightlight:'מנורת לילה',hsf_toychest:'ארגז צעצועים',hsf_wardrobe:'ארון בגדים',hsf_trophies:'מדף גביעים',hsf_telescope:'טלסקופ',
  hsf_vane:'שבשבת',hsf_mailbox:'תיבת דואר',hsf_birdhouse:'בית ציפורים',hsf_flowers:'ערוגת פרחים',hsf_trampoline:'טרמפולינה',hsf_balloons:'עמוד בלונים',
  hsp_piggy:'עוד {n}% מטבעות מכל שלב שעוברים',hsp_sofa:'חלון נחיתה רחב יותר ב-{n}%',hsp_clock:'התנודה איטית יותר ב-{n}%',hsp_fireplace:'עוד {n}% אור בעולמות לילה',hsp_aquarium:'גלים, זרמים ודיונות חלשים יותר ב-{n}%',
  hsp_books:'עוד {n}% XP',hsp_tv:'הפרנזי ארוך יותר ב-{n}%',hsp_oven:'עוגייה לבאדי כל {n} ניצחונות',hsp_fridge:'בוסטר חינם כל {n} ניצחונות',hsp_candyjar:'עוד {n}% ממתקים באירועי חג',
  hsp_table:'מטבעות נוספים על כל לב שנשאר: {n}',hsp_sink:'נחיתה בסערה מחליקה פחות ב-{n}%',hsp_toaster:'שניות נוספות בשלב הבונוס: {n}',hsp_bed:'מגן חינם כל {n} שלבים',
  hsp_nightlight:'קו כיוון ב-{n} הקומות הראשונות',hsp_toychest:'עוד {n}% מטבעות בארקייד',hsp_wardrobe:'{n}% מהמחיר חוזר על קנייה ב"הגיבור שלי"',hsp_trophies:'עוד {n}% נזק לבוסים',
  hsp_telescope:'נפילה איטית יותר ב-{n}% בעולמות חלל',hsp_vane:'רוח חלשה יותר ב-{n}%',hsp_mailbox:'עוד {n}% מטבעות במתנה היומית',hsp_birdhouse:'עוגיות נוספות כשביצה בוקעת: {n}',
  hsp_flowers:'עוד {n}% נקודות על פרפקט',hsp_trampoline:'מטבעות נוספים על כל נחיתה בפרנזי: {n}',hsp_balloons:'בלון המטבעות מגיע יותר ב-{n}%'});

const HS_OPEN=10,HS_PRICE=[250,400,600,900,1300],HS_GATE=[0,12,15,19,24];
const HS_ROOMS=[{id:'living',lv:10,ic:'🛋️'},{id:'kitchen',lv:13,ic:'🍳'},{id:'bedroom',lv:16,ic:'🛏️'},{id:'yard',lv:20,ic:'🌳'}];
// [id, room, footprint [along i, along j], wall item, height in tiles (drawn box), colour, emoji (until the picture arrives), z0 (mounted on the wall)]
const HS_F=[['piggy','living',[1,1],0,.7,'#ff9ec7','🐷'],['sofa','living',[2,1],0,.6,'#8f6be8','🛋️'],['clock','living',[1,1],0,1.9,'#b8743a','🕰️'],
 ['fireplace','living',[2,1],1,1.15,'#d9584f','🔥'],['aquarium','living',[2,1],0,1.1,'#4fb6e8','🐠'],['books','living',[1,1],1,1.6,'#a0663a','📚'],['tv','living',[2,1],0,.95,'#55607a','📺'],
 ['oven','kitchen',[1,1],0,1,'#e8a04f','🍪'],['fridge','kitchen',[1,1],0,1.9,'#dfe8f0','🧊'],['candyjar','kitchen',[1,1],0,.6,'#ff6fa8','🍬'],['table','kitchen',[2,2],0,.7,'#c98b55','🍽️'],
 ['sink','kitchen',[1,1],1,.9,'#9fd4e8','🚰'],['toaster','kitchen',[1,1],0,.8,'#e0c27a','🍞'],
 ['bed','bedroom',[2,2],0,.6,'#7aa7ff','🛏️'],['nightlight','bedroom',[1,1],0,.6,'#ffe27a','💡'],['toychest','bedroom',[1,1],0,.7,'#e8734f','🧸'],
 ['wardrobe','bedroom',[2,1],1,1.9,'#b07ad9','👗'],['trophies','bedroom',[2,1],1,1.3,'#e0a400','🏆'],['telescope','bedroom',[1,1],0,1.4,'#5a6bd1','🔭'],
 ['vane','yard',[1,1],0,2,'#8fa0b5','🌬️'],['mailbox','yard',[1,1],0,1.1,'#e85a5a','📮'],['birdhouse','yard',[1,1],0,1.6,'#c98b55','🪺'],
 ['flowers','yard',[2,1],0,.45,'#ff8fc0','🌻'],['trampoline','yard',[2,2],0,.5,'#3fbf7f','🤸'],['balloons','yard',[1,1],0,2,'#ff5f8f','🎈']
].map(([id,room,ft,wall,h,col,em,z0])=>({id,room,fw:ft[0],fd:ft[1],wall:!!wall,h,col,em,z0:z0||0}));
const HSF=Object.fromEntries(HS_F.map(f=>[f.id,f]));
const HS_SKINS=[{id:'cottage',p:0,wall:'#f6dcb4',wall2:'#e8c393',floor:'#c98b55',floor2:'#b97a46',trim:'#7a4a24'},
 {id:'candy',p:1500,wall:'#ffd6ea',wall2:'#ffb3d6',floor:'#ffe7a3',floor2:'#ffd27a',trim:'#e0559c'},
 {id:'ocean',p:2000,wall:'#c4ecff',wall2:'#93d6f5',floor:'#f2e2b8',floor2:'#e3cd96',trim:'#2f7fb0'},
 {id:'jungle',p:2000,wall:'#d4ebb3',wall2:'#b2d68a',floor:'#a4794f',floor2:'#8f6640',trim:'#4f7a2f'},
 {id:'space',p:2500,wall:'#3a4680',wall2:'#2c3668',floor:'#8590b8',floor2:'#6f7aa3',trim:'#ffd84a'},
 {id:'castle',p:3000,wall:'#ece3cf',wall2:'#d8ccb0',floor:'#a8324a',floor2:'#932a3f',trim:'#c99a2e'}];
const HS_N={oven:[10,9,8,7,5],fridge:[15,13,11,9,7],bed:[8,7,6,5,4]};
function hsVal(id,L){if(HS_N[id])return HS_N[id][L-1];
  const per={piggy:1.5,sofa:1,clock:1,fireplace:5,aquarium:6,books:3,tv:4,candyjar:5,table:1,sink:8,toaster:1,toychest:10,wardrobe:2,trophies:3,telescope:4,vane:4,mailbox:10,birdhouse:1,flowers:4,trampoline:1,balloons:10}[id];
  return id==='nightlight'?L+1:per*L}
const hsTxt=(id,L)=>t('hsp_'+id,{n:+hsVal(id,Math.max(1,L)).toFixed(1)});
function hs(){const H=progress.house=progress.house||{};H.lv=H.lv||{};H.fpos=H.fpos||{};H.skins=H.skins||['cottage'];if(!H.skins.includes('cottage'))H.skins.push('cottage');
  H.skin=H.skin||'cottage';H.cnt=H.cnt||{};H.room=H.room||'living';return H}
const hsLv=id=>{const H=progress.house;return H&&H.lv&&H.lv[id]||0};
const hsPlayerLv=()=>typeof xpLevel==='function'?xpLevel(progress.xp||0).lv:1;
const hsOpen=()=>hsPlayerLv()>=HS_OPEN;
const hsRoomOpen=r=>hsPlayerLv()>=HS_ROOMS.find(x=>x.id===r).lv;
function hsGate(id,k){const R=HS_ROOMS.find(x=>x.id===HSF[id].room);return Math.max(R.lv,HS_GATE[k-1]||0)} // player level needed for furniture level k
function hsK(k){if(typeof mode!=='undefined'&&mode==='duo')return 1;
  if(k==='ocean')return 1-.06*hsLv('aquarium');if(k==='balloon')return 1+.1*hsLv('balloons');if(k==='arcade')return 1+.1*hsLv('toychest');return 1}

/* ---------- art (pictures from the graphics department when they exist) ---------- */
const HS_IMG={},HS_ART=new Set(__HS_ART__);
const hsSrc=name=>HS_ART.has(name)?'art/'+name+'.webp':'';
// 10 designs per item, each fancier than the one before (design 1 = hf_<id>, 2..10 = hf_<id>_d<n>); every upgrade level opens 2 more
// (level L: designs 1..2L). Upgrading switches to the newest design by itself; the player can pick any open one for free. Looks only.
// An item uses its flat pictures (hf_) once its flat design 1 exists; until then the old isometric ones (hs_f_) stand in.
const HS_DN=10,hsDN=(id,k)=>(HS_ART.has('hf_'+id)?'hf_':'hs_f_')+id+(k>1?'_d'+k:''),hsDHas=(id,k)=>k===1||HS_ART.has(hsDN(id,k)),hsDOpen=(id,k)=>k<=2*Math.max(1,hsLv(id));
function hsStyOf(id){const S=progress.house&&progress.house.sty,k=S&&S[id];if(k>1&&hsDHas(id,k)&&hsDOpen(id,k))return k;
  if(k===1)return 1;for(let n=Math.min(HS_DN,2*hsLv(id));n>1;n--)if(hsDHas(id,n))return n;return 1}
const hsFN=(id,k=hsStyOf(id))=>hsDN(id,k);
const hsPeek=id=>{const P=HSV.peek;return P&&P.id===id&&performance.now()<P.t?P.k:0};
const hsStyles=id=>[...Array(HS_DN)].map((_,n)=>n+1).filter(k=>hsDHas(id,k));
function hsPic(name){if(!HS_ART.has(name))return null;if(HS_IMG[name]!==undefined)return HS_IMG[name];HS_IMG[name]=null;const im=new Image();im.onload=()=>{HS_IMG[name]=im;HSV.dirty=true};im.onerror=()=>{HS_IMG[name]=false};im.src='art/'+name+'.webp';return null}
/* ---------- flat view (Tzach, Oct 9: "flat like Toca Boca", one sample room first; spec /mnt/project-files/game/house/flat-spec.md) ----------
   Every room is a dollhouse room seen straight from the front: a back wall and a floor band at the bottom. A floor item stands anywhere on
   the band (the one further forward covers the one behind), a wall item hangs anywhere on the wall; things may overlap, nothing snaps.
   progress.house.fpos[id]={x: centre, y: bottom edge (both fractions of the room), m: mirrored}. A room picture fills the room
   (4:3, HF_CAL = where its floor starts); an item is HF_SZ wide, its height follows its picture. */
// [width, height] as fractions of the room's width / height (the height is only used until the item has a picture)
// widths = the item's width on the graphics sheet (all 4 sheets share one scale) × .000615 (measured on the approved living-room mock:
// wall height 783 px = .67 of the room); the height (2nd number) is only used until the item has a picture
const HF_SZ={piggy:[.105,.22],sofa:[.44,.26],clock:[.108,.41],fireplace:[.214,.28],aquarium:[.165,.28],books:[.187,.17],tv:[.154,.28],
  oven:[.212,.26],fridge:[.177,.44],candyjar:[.136,.22],table:[.461,.27],sink:[.171,.3],toaster:[.14,.28],
  bed:[.346,.36],nightlight:[.132,.29],toychest:[.22,.23],wardrobe:[.2,.45],trophies:[.29,.17],telescope:[.177,.32],
  vane:[.151,.46],mailbox:[.124,.3],birdhouse:[.121,.45],flowers:[.293,.16],trampoline:[.351,.2],balloons:[.141,.46]};
const HF_WALL=new Set(['books','trophies']); // hang on the wall; everything else stands on the floor
// where a new item goes the first time: [x, y] (the middle front stays free for the Sharliz)
const HF_SPOT={aquarium:[.13,.73],fireplace:[.42,.7],clock:[.66,.71],piggy:[.84,.75],books:[.17,.42],sofa:[.43,.9],tv:[.8,.93],
  fridge:[.09,.71],oven:[.27,.71],sink:[.45,.71],toaster:[.6,.72],candyjar:[.76,.74],table:[.5,.93],
  wardrobe:[.12,.7],trophies:[.3,.4],bed:[.47,.85],nightlight:[.74,.72],telescope:[.88,.89],toychest:[.2,.95],
  vane:[.1,.7],mailbox:[.3,.72],birdhouse:[.5,.7],balloons:[.9,.71],flowers:[.68,.78],trampoline:[.42,.93]};
const HF_FT=.67,HF_FF=.975,HF_CAL={hf_room_cottage_bedroom:.652,hf_room_cottage_yard:.635,hf_room_candy_yard:.65,
  hf_room_castle_living:.635,hf_room_castle_kitchen:.645,hf_room_castle_bedroom:.635,hf_room_castle_yard:.69,
  hf_room_jungle_living:.61,hf_room_jungle_kitchen:.61,hf_room_jungle_bedroom:.61,hf_room_jungle_yard:.655}; // floor band: from the wall's foot (HF_FT, or HF_CAL[picture]) to the front edge
const hfFT=(room=hs().room)=>HF_CAL['hf_room_'+hsSkin().id+'_'+room]||HF_FT;
const HSV={ord:{},focus:{},peek:null,pop:null,up:null,lockB:null,cam:0,camT:0,pan:null,RW:0,RH:0,RX:0,SP:0,TW:0,el:null,cv:null,g:null,dpr:1,W:0,H:0,raf:0,last:0,sel:null,drag:null,dirty:true,hero:null,fx:[],skinOpen:false};
// the house is the 4 rooms stacked top to bottom (living, kitchen, bedroom, yard); the canvas is a window (W x H) on it and the camera
// (cam = house y at the window's top) glides to the room you pick. Room k's own coordinates: x from the canvas' left, y from its top (house y k*SP).
function hsGeom(){const v=HSV;v.RW=Math.min(v.W-16,v.H*.86/.75);v.RH=v.RW*.75;v.RX=(v.W-v.RW)/2;v.SP=v.RH+v.RW*.075;v.TW=v.RW/7}
const hsRI=room=>Math.max(0,HS_ROOMS.findIndex(R=>R.id===room));
// the room you are in sits near the top of the stage (under the skins button) and the next room peeks out below it
const hsTop=()=>Math.min(Math.max(0,(HSV.H-HSV.RH)/2),40),hsCamFor=k=>k*HSV.SP-hsTop();
const hsCamClamp=c=>Math.max(hsCamFor(0)-HSV.H*.2,Math.min(hsCamFor(HS_ROOMS.length-1)+HSV.H*.2,c));
const hsShade=(c,k)=>{const n=parseInt(c.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,f=x=>Math.max(0,Math.min(255,Math.round(x*k)));return `rgb(${f(r)},${f(g)},${f(b)})`};
function hsSkin(){return HS_SKINS.find(s=>s.id===hs().skin)||HS_SKINS[0]}
function hsRR(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
const hsRoomPath=g=>hsRR(g,HSV.RX,0,HSV.RW,HSV.RH,HSV.RW*.035);
// the room: its picture, or (until it exists) a wall with a window, a wainscot and a plank floor drawn by code; the yard = sky, fence, grass
function hsDrawRoom(g,room,dim){const v=HSV,K=hsSkin(),X=v.RX,RW=v.RW,RH=v.RH,yard=room==='yard',name='hf_room_'+K.id+'_'+room,im=hsPic(name),ft=(HF_CAL[name]||HF_FT)*RH;
  g.save();hsRoomPath(g);g.clip();
  if(im)g.drawImage(im,X,0,RW,RH);
  else if(yard){const sk=g.createLinearGradient(0,0,0,ft);sk.addColorStop(0,'#8fd3ff');sk.addColorStop(1,'#d8f2ff');g.fillStyle=sk;g.fillRect(X,0,RW,ft);
    g.fillStyle='#fff';for(const [cx,cy,s] of [[.2,.17,1],[.68,.1,.8],[.88,.3,.6]]){const r=RW*.05*s;g.beginPath();g.arc(X+cx*RW,cy*RH,r,0,7);g.arc(X+cx*RW+r,cy*RH-r*.4,r*1.1,0,7);g.arc(X+cx*RW+r*2.1,cy*RH,r*.85,0,7);g.fill()}
    const fh=RH*.2,pw=RW*.045;g.lineWidth=2;g.strokeStyle='#120d2b';for(const yy of [ft-fh*.7,ft-fh*.32]){g.fillStyle='#fff6e3';g.fillRect(X,yy,RW,fh*.12);g.strokeRect(X,yy,RW,fh*.12)}
    for(let x=X+pw*.4;x<X+RW;x+=pw*1.7){g.beginPath();g.moveTo(x,ft);g.lineTo(x,ft-fh+pw*.5);g.lineTo(x+pw/2,ft-fh);g.lineTo(x+pw,ft-fh+pw*.5);g.lineTo(x+pw,ft);g.closePath();g.fillStyle='#fff6e3';g.fill();g.stroke()}
    g.fillStyle='#7fcf5f';g.fillRect(X,ft,RW,RH-ft);g.fillStyle='#74c455';for(let k=0;k<6;k++)g.fillRect(X,ft+(RH-ft)*(k/6),RW,(RH-ft)/12);
    g.strokeStyle='#120d2b';g.lineWidth=2.5;g.beginPath();g.moveTo(X,ft);g.lineTo(X+RW,ft);g.stroke()}
  else{g.fillStyle=K.wall;g.fillRect(X,0,RW,ft);g.fillStyle=K.wall2;g.globalAlpha=.35;for(let x=X;x<X+RW;x+=RW/9)g.fillRect(x,0,RW/18,ft);g.globalAlpha=1;
    const wy=ft*.66;g.fillStyle=K.wall2;g.fillRect(X,wy,RW,ft-wy);g.fillStyle=K.trim;g.fillRect(X,wy-RH*.012,RW,RH*.024);
    // window
    const wx=X+RW*.38,ww=RW*.24,wt=RH*.1,wh=ft*.42;hsRR(g,wx,wt,ww,wh,ww*.08);g.fillStyle=K.id==='space'?'#0b1030':K.id==='ocean'?'#2f9fd6':'#9fdcff';g.fill();g.lineWidth=RW*.016;g.strokeStyle=K.trim;g.stroke();
    g.beginPath();g.moveTo(wx+ww/2,wt);g.lineTo(wx+ww/2,wt+wh);g.moveTo(wx,wt+wh/2);g.lineTo(wx+ww,wt+wh/2);g.lineWidth=RW*.012;g.stroke();
    // floor planks + baseboard
    g.fillStyle=K.floor;g.fillRect(X,ft,RW,RH-ft);const n=5,ph=(RH-ft)/n;g.strokeStyle=K.floor2;g.lineWidth=2;
    for(let k=1;k<n;k++){g.beginPath();g.moveTo(X,ft+k*ph);g.lineTo(X+RW,ft+k*ph);g.stroke()}
    for(let k=0;k<n;k++)for(let x=X+((k*37)%60)/60*RW*.22;x<X+RW;x+=RW*.22){g.beginPath();g.moveTo(x,ft+k*ph);g.lineTo(x,ft+(k+1)*ph);g.stroke()}
    g.fillStyle=K.trim;g.fillRect(X,ft-RH*.03,RW,RH*.03);g.strokeStyle='#120d2b';g.lineWidth=2;g.beginPath();g.moveTo(X,ft);g.lineTo(X+RW,ft);g.stroke()}
  if(dim){g.fillStyle='rgba(36,18,80,.6)';g.fillRect(X,0,RW,RH)}
  g.restore();hsRoomPath(g);g.lineWidth=Math.max(3,RW*.012);g.strokeStyle='#120d2b';g.stroke()}
// a locked room: a lock badge and the player level it opens at, high on the wall so it shows while the room only peeks out
// below the one you are in; it wobbles when you tap the locked room
function hsLockTag(g,R){const v=HSV,s=v.TW*.95,B=v.lockB,p=B&&B.room===R.id?(performance.now()-B.t0)/650:1,k=p<1?Math.sin(p*Math.PI*4)*(1-p):0;
  g.save();g.translate(v.W/2,v.RH*.26);g.rotate(k*.22);g.scale(1+Math.abs(k)*.18,1+Math.abs(k)*.18);
  hsRR(g,-s*.5,-s*.62,s,s*.98,s*.3);g.fillStyle='rgba(36,18,80,.9)';g.fill();g.lineWidth=3;g.strokeStyle='#ffe9a8';g.stroke();
  g.textAlign='center';g.textBaseline='middle';g.font=`${Math.round(s*.6)}px "Apple Color Emoji","Noto Color Emoji",sans-serif`;g.fillStyle='#fff';g.fillText('🔒',0,-s*.12);
  const txt=t('hsLvl',{n:R.lv});g.font=`900 ${Math.round(s*.3)}px Rubik,system-ui,sans-serif`;const w=g.measureText(txt).width+s*.5,h=s*.46;
  hsRR(g,-w/2,s*.3,w,h,h/2);g.fillStyle='#241250';g.fill();g.lineWidth=2.5;g.strokeStyle='#ffe9a8';g.stroke();g.fillStyle='#fff';g.fillText(txt,0,s*.3+h/2+1);g.restore()}
// where an item is (while you drag it: where your finger has it)
function hsPos(id){const d=HSV.drag;if(d&&d.id===id&&d.p)return d.p;const P=hs().fpos[id];if(P){const c=hsClamp(id,P.x,P.y);return {x:c.x,y:c.y,m:P.m}}const S=HF_SPOT[id]||[.5,.9],c=hsClamp(id,S[0],S[1]);return {x:c.x,y:c.y,m:0}}
function hsItemPic(id){const pk=hsPeek(id);return pk&&hsPic(hsDN(id,pk))||hsPic(hsFN(id))}
// the item's box on screen in the room's coordinates (its picture fills it; mirrored when turned)
function hsRect(id,p=hsPos(id)){const v=HSV,[w0,h0]=HF_SZ[id],im=hsItemPic(id),w=w0*v.RW,h=im?w*im.height/im.width:h0*v.RH;
  return {x:v.RX+p.x*v.RW-w/2,y:p.y*v.RH-h,w,h,im,m:!!p.m}}
// keep an item inside the room: a floor item on the floor band, a wall item on the wall
function hsClamp(id,x,y){const v=HSV;if(!v.RW)return {x,y};const r=hsRect(id,{x,y}),wf=r.w/v.RW/2,hf=r.h/v.RH,ft=hfFT(HSF[id].room);x=Math.max(wf+.005,Math.min(1-wf-.005,x));
  y=HF_WALL.has(id)?Math.min(ft-.03,Math.max(hf+.09,y)):Math.max(ft+.03,Math.min(HF_FF,y));return {x,y}}
function hsDrawItem(g,id){const v=HSV,L=hsLv(id),r=hsRect(id),sel=v.sel===id,drag=v.drag&&v.drag.id===id&&v.drag.moved,f=HSF[id],wall=HF_WALL.has(id);
  const pop=v.pop&&v.pop.id===id?(performance.now()-v.pop.t0)/480:1,pk=hsPeek(id),bx=r.x+r.w/2,by=r.y+r.h;
  // a soft shadow under a floor item (bigger while you lift it)
  if(!wall){g.globalAlpha=drag?.3:.22;g.fillStyle='#120d2b';g.beginPath();g.ellipse(bx,by-v.RH*.004,r.w*(drag?.5:.44),v.RH*(drag?.04:.028),0,0,7);g.fill();g.globalAlpha=1}
  g.save();g.translate(bx,by-(drag?v.RH*.025:0));if(drag)g.scale(1.05,1.05);
  if(pop<1){const k=Math.sin(pop*Math.PI*2)*(1-pop);g.scale(1+.13*k,1-.16*k)} // squash and pop after an upgrade, a new design or a turn
  if(r.m)g.scale(-1,1);if(pk)g.globalAlpha=.72+.28*Math.sin(performance.now()/90);
  if(r.im)g.drawImage(r.im,-r.w/2,-r.h,r.w,r.h);
  else{// no picture yet: a front-view cabinet in the item's colour with its emoji
    const w=r.w,h=r.h;hsRR(g,-w/2,-h,w,h,Math.min(w,h)*.16);g.fillStyle=f.col;g.fill();g.lineWidth=Math.max(2,v.RW*.008);g.strokeStyle='#120d2b';g.stroke();
    hsRR(g,-w/2+w*.08,-h+h*.06,w*.84,h*.16,h*.06);g.fillStyle=hsShade(f.col,1.12);g.fill();
    const fs=Math.min(w*.62,h*.62);g.font=`${Math.round(fs)}px "Apple Color Emoji","Noto Color Emoji",sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillText(f.em,0,-h*.48)}
  g.restore();
  if(L>=5){for(let k=0;k<3;k++){const ph=HSV.last/400+k*2.1;g.fillStyle='#ffe24d';g.globalAlpha=.55+.45*Math.sin(ph);hsStar(g,bx+Math.cos(ph)*r.w*.4,r.y+r.h*.15+Math.sin(ph*1.3)*v.RH*.04,v.TW*.07)}g.globalAlpha=1}
  if(L&&sel){const s='★'+L,lx=r.x+r.w-v.TW*.05,ly=by-v.TW*.12; // the level only on the picked item (the room stays clean, the cards show the stars)g.font=`900 ${Math.round(v.TW*.24)}px Rubik,system-ui,sans-serif`;g.textAlign='center';g.textBaseline='middle';
    g.lineWidth=3;g.strokeStyle='#120d2b';g.strokeText(s,lx,ly);g.fillStyle=L>=5?'#ffe24d':'#fff';g.fillText(s,lx,ly)}
  if(sel){g.save();g.strokeStyle='#ffe24d';g.lineWidth=3;g.setLineDash([6,5]);g.lineDashOffset=-HSV.last/40;hsRR(g,r.x-4,r.y-4-(drag?v.RH*.025:0),r.w+8,r.h+8,10);g.stroke();g.restore()}}
function hsStar(g,x,y,r){g.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,rr=k%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.closePath();g.fill()}
function hsItemsIn(room){return HS_F.filter(f=>f.room===room&&hsLv(f.id))}
// drawing order: wall items first, then the floor items from the back to the front (the Sharliz walks among them)
const hsDepth=id=>HF_WALL.has(id)?-1:hsPos(id).y;
// a new item goes to its own spot (overlapping is fine, so there is always room)
function hsAutoPlace(id){const H=hs();if(!H.fpos[id]){const S=HF_SPOT[id]||[.5,.9],c=hsClamp(id,S[0],S[1]);H.fpos[id]={x:c.x,y:c.y,m:0}}return true}
// the Sharliz walks around the floor band
function hsHeroTick(dt){const v=HSV,ft=hfFT();let h=v.hero;if(!h)h=v.hero={s:arcHeroSpriteSafe(),x:.15,y:.93,tx:.15,ty:.93,wait:1,hop:0,dir:1};
  const ax=(h.tx-h.x)*v.RW,ay=(h.ty-h.y)*v.RH,d=Math.hypot(ax,ay);
  if(d>1){const st=Math.min(d,dt*v.RW*.16);h.x+=ax/d*st/v.RW;h.y+=ay/d*st/v.RH;h.hop+=dt*9;h.dir=ax>0?1:-1}
  else if((h.wait-=dt)<=0){h.wait=1.2+Math.random()*2.2;h.tx=.12+Math.random()*.76;h.ty=ft+.1+Math.random()*(HF_FF-ft-.1)}
  if(h.s)h.s.blink=(h.s.blink||0)+dt}
function arcHeroSpriteSafe(){try{return Object.assign(makeSharliz(),{color:CHARS.hero?'hero':'#06a2ba',mood:null})}catch(e){return null}}
function hsDrawHero(g){const v=HSV,h=v.hero;if(!h||!h.s)return;const x=v.RX+h.x*v.RW,y=h.y*v.RH,sz=v.RH*.15,hop=Math.abs(Math.sin(h.hop))*v.RH*.03;
  g.globalAlpha=.22;g.fillStyle='#120d2b';g.beginPath();g.ellipse(x,y,sz*.42,sz*.14,0,0,7);g.fill();g.globalAlpha=1;
  try{withCtx(g,sz,()=>drawSharliz(h.s,x,y-sz*.72-hop,0,null,{x:h.dir*.4,y:0}))}catch(e){}}
function hsDraw(dt=1/60){const v=HSV,g=v.g;if(!g)return;const cur=hs().room,d=v.dpr;g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,v.W,v.H);
  v.fx=v.fx.filter(p=>(p.t+=dt)<1);
  HS_ROOMS.forEach((R,k)=>{const y0=k*v.SP-v.cam;if(y0>v.H||y0+v.RH<0)return;g.setTransform(d,0,0,d,0,d*y0);const open=hsRoomOpen(R.id);
    if(R.id===cur){const gr=g.createRadialGradient(v.W/2,v.RH*.45,v.TW,v.W/2,v.RH*.45,v.W*.62);gr.addColorStop(0,'rgba(255,226,160,.32)');gr.addColorStop(1,'rgba(255,226,160,0)');
      g.fillStyle=gr;g.fillRect(0,-v.TW,v.W,v.RH+v.TW*2)}
    hsDrawRoom(g,R.id,!open);if(!open){hsLockTag(g,R);return}
    g.save();hsRoomPath(g);g.clip();
    const list=hsItemsIn(R.id).map(f=>({id:f.id,k:hsDepth(f.id),fn:()=>hsDrawItem(g,f.id)}));
    if(R.id===cur){if(v.hero&&v.hero.s)list.push({k:v.hero.y,fn:()=>hsDrawHero(g)});if(v.drag&&v.drag.moved)list.forEach(o=>{if(o.id===v.drag.id)o.k=99})}
    list.sort((a,b)=>a.k-b.k).forEach(o=>o.fn());
    if(R.id===cur){for(const p of v.fx){g.globalAlpha=1-p.t;g.fillStyle=p.c;hsStar(g,p.x+p.vx*p.t,p.y+p.vy*p.t+80*p.t*p.t,v.TW*.08*(1-p.t*.5))}g.globalAlpha=1}
    else{g.fillStyle='rgba(36,18,80,.36)';g.fillRect(v.RX,0,v.RW,v.RH)}
    g.restore();hsRoomPath(g);g.lineWidth=Math.max(3,v.RW*.012);g.strokeStyle='#120d2b';g.stroke()});
  g.setTransform(d,0,0,d,0,0)}
function hsBurst(id){const r=hsRect(id),x=r.x+r.w/2,y=r.y+r.h*.3;for(let k=0;k<22;k++){const a=Math.random()*7,s=40+Math.random()*90;HSV.fx.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-60,t:0,c:pick(['#ffe24d','#ff7ab8','#7ae0ff','#fff'])})}}
function hsLoop(now){const v=HSV;if(!v.el||v.el.hidden){v.raf=0;return}const dt=Math.min(.05,(now-(v.last||now))/1000);v.last=now;
  if(!v.pan){v.cam+=(v.camT-v.cam)*Math.min(1,dt*7);if(Math.abs(v.camT-v.cam)<.3)v.cam=v.camT}
  if(!document.hidden){if(hsRoomOpen(hs().room))hsHeroTick(dt);hsDraw(dt)}v.raf=requestAnimationFrame(hsLoop)}
/* ---------- touch: tap = select, drag = move anywhere (a floor item on the floor, a wall item on the wall) ---------- */
function hsVP(e){const r=HSV.cv.getBoundingClientRect();return [(e.clientX-r.left)*HSV.W/r.width,(e.clientY-r.top)*HSV.H/r.height]}
// a point in the coordinates of the room you are in
function hsPt(e){const [x,y]=hsVP(e);return [x,y+HSV.cam-hsRI(hs().room)*HSV.SP]}
function hsRoomAt(vy){const v=HSV,k=Math.floor((vy+v.cam+(v.SP-v.RH)/2)/v.SP);return HS_ROOMS[Math.max(0,Math.min(HS_ROOMS.length-1,k))].id}
const HS_AM={};function hsAlphaAt(im,u,v){let m=HS_AM[im.src];if(!m){const w=64,h=Math.max(1,Math.round(64*im.height/im.width)),c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.drawImage(im,0,0,w,h);
  try{m={w,h,d:g.getImageData(0,0,w,h).data}}catch(_){m={w:0}}HS_AM[im.src]=m}if(!m.w)return true;const a=Math.floor(u*m.w),b=Math.floor(v*m.h);return a>=0&&b>=0&&a<m.w&&b<m.h&&m.d[(b*m.w+a)*4+3]>60}
// the front-most item under the finger (its picture's painted pixels); a near miss still picks a small item close by
function hsHit(x,y){const list=hsItemsIn(hs().room).map(f=>f.id).sort((a,b)=>hsDepth(b)-hsDepth(a)),pad=HSV.TW*.25;
  for(const id of list){const r=hsRect(id);if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h){if(!r.im)return id;const u=(x-r.x)/r.w;if(hsAlphaAt(r.im,r.m?1-u:u,(y-r.y)/r.h))return id}}
  let best=null,bd=pad;for(const id of list){const r=hsRect(id),dx=Math.max(r.x-x,0,x-r.x-r.w),dy=Math.max(r.y-y,0,y-r.y-r.h),d=Math.hypot(dx,dy);if(d<bd){bd=d;best=id}}return best}
function hsDown(e){const v=HSV,[vx,vy]=hsVP(e),[x,y]=hsPt(e),cur=hs().room,id=y>=0&&y<=v.RH&&x>=v.RX&&x<=v.RX+v.RW&&hsRoomOpen(cur)?hsHit(x,y):null;
  if(!id){v.pan={x0:vx,y0:vy,c0:v.cam,moved:false,v:0,ly:vy,lt:performance.now(),room:hsRoomAt(vy)};try{v.cv.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();return}
  const p=hsPos(id);v.drag={id,gx:x/v.RW-p.x,gy:y/v.RH-p.y,x0:x,y0:y,moved:false,p:null};try{v.cv.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()}
function hsMove(e){const P=HSV.pan;if(P){const [vx,vy]=hsVP(e);if(P.side||!P.moved&&Math.abs(vx-P.x0)>14&&Math.abs(vx-P.x0)>Math.abs(vy-P.y0)*1.4){P.side=vx-P.x0;e.preventDefault();return}
    if(!P.moved&&Math.abs(vy-P.y0)<8)return;P.moved=true;const now=performance.now(),dtm=Math.max(1,now-P.lt);
    P.v=P.v*.6+(vy-P.ly)/dtm*1000*.4;P.ly=vy;P.lt=now;HSV.cam=hsCamClamp(P.c0-(vy-P.y0));e.preventDefault();return}
  const d=HSV.drag;if(!d)return;const [x,y]=hsPt(e);if(!d.moved&&Math.hypot(x-d.x0,y-d.y0)<8)return;d.moved=true;
  const c=hsClamp(d.id,x/HSV.RW-d.gx,y/HSV.RH-d.gy);d.p={x:c.x,y:c.y,m:hsPos(d.id).m};e.preventDefault()}
function hsUp(){const P=HSV.pan;if(P){HSV.pan=null;if(P.side){if(Math.abs(P.side)>40)hsStep((P.side<0?1:-1)*(I18N[lang]._dir==='rtl'?-1:1));return}
    if(!P.moved){if(P.room!==hs().room)hsFocus(P.room);else if(HSV.sel){HSV.sel=null;hsPanel()}return}
    // let go: glide to the room nearest to where the flick is heading
    const aim=HSV.cam-P.v*.25;let best=0,bd=1e9;HS_ROOMS.forEach((R,k)=>{const dd=Math.abs(hsCamFor(k)-aim);if(dd<bd){bd=dd;best=k}});hsFocus(HS_ROOMS[best].id);return}
  const d=HSV.drag;if(!d)return;if(!d.moved||!d.p){HSV.drag=null;sfx.click();HSV.sel=d.id;hsPanel();return}
  hs().fpos[d.id]={x:d.p.x,y:d.p.y,m:d.p.m?1:0};HSV.drag=null;saveProgress();sfx.pop();vib(10);HSV.sel=d.id;hsPanel()}
// turn = mirror it where it stands
function hsTurn(id){const H=hs(),p=hsPos(id);H.fpos[id]={x:p.x,y:p.y,m:p.m?0:1};HSV.pop={id,t0:performance.now()};saveProgress();sfx.pop()}

/* ---------- screen ---------- */
function hsFocus(room,quiet){const v=HSV,H=hs(),R=HS_ROOMS.find(x=>x.id===room),open=hsRoomOpen(room);
  if(H.room!==room){H.room=room;v.sel=null;v.hero=null;v.drag=null;v.peek=null;delete v.ord[room];if(open)saveProgress()}
  v.camT=hsCamFor(hsRI(room));if(quiet)v.cam=v.camT;else if(open)sfx.click();else{sfx.locked();noteToast(t('hsRoomLock',{n:R.lv}));v.lockB={room,t0:performance.now()}}
  hsTabs();hsPanel();hsArrows();if(!open&&!quiet){const b=v.el.querySelector(`.hs-room[data-room="${room}"]`);if(b)b.classList.add('shake')}}
// the arrows beside the room and a sideways swipe: the next / previous room (d=1 = towards the yard)
function hsStep(d){const k=hsRI(hs().room)+d;if(k>=0&&k<HS_ROOMS.length)hsFocus(HS_ROOMS[k].id)}
function hsArrows(){const r=HSV.el;if(!r)return;const k=hsRI(hs().room),rtl=I18N[lang]._dir==='rtl',top=Math.round(hsTop()+HSV.RH*.2-23);
  const st=r.querySelector('.hs-stage'),off=Math.max(0,((st&&st.clientWidth)-HSV.W)/2)+Math.max(0,HSV.RX-17)+'px'; // on the room's edge, high on the wall where it's emptiest (also on a wide iPad)
  r.querySelectorAll('.hs-arr').forEach(b=>{const l=b.classList.contains('l'),d=(l?-1:1)*(rtl?-1:1),n=k+d;b.dataset.d=d;b.style.top=top+'px';b.style[l?'left':'right']=off;b.hidden=n<0||n>=HS_ROOMS.length})}
// the room tabs: one bar; the room you are in is gold, a locked room shows a lock and the level it opens at, an open one its stars (3/35★)
function hsTabs(){const r=HSV.el,H=hs(),rooms=r&&r.querySelector('.hs-rooms');if(!rooms)return;rooms.innerHTML='';
  HS_ROOMS.forEach(R=>{const open=hsRoomOpen(R.id),b=document.createElement('button');b.className='hs-room'+(H.room===R.id?' on':'')+(open?'':' lock');b.dataset.room=R.id;
    b.innerHTML=`<i>${R.ic}</i><b></b><small></small>${open?'':'<em class="hs-lk">🔒</em>'}`;b.querySelector('b').textContent=t('hsr_'+R.id);const sm=b.querySelector('small');
    if(open){const it=HS_F.filter(f=>f.room===R.id);sm.textContent=it.reduce((a,f)=>a+hsLv(f.id),0)+'/'+it.length*5+'★';sm.dir='ltr'}else sm.textContent=t('hsLvl',{n:R.lv});
    b.onclick=()=>{if(H.room!==R.id||!open)hsFocus(R.id)};rooms.appendChild(b)});hsFit(rooms.querySelectorAll('b'))}
function openHouse(){if(!hsOpen()){sfx.locked();noteToast(t('hsLocked',{n:HS_OPEN}));return}audio();sfx.click();const H=hs();H.intro=1;saveProgress();
  if(!HSV.el){const el=HSV.el=document.createElement('div');el.id='houseScr';document.body.appendChild(el)}
  HSV.el.hidden=false;if(!hsRoomOpen(H.room))H.room='living';HSV.sel=null;HSV.hero=null;HSV.pan=null;HSV.drag=null;HSV.peek=null;HSV.ord={};HSV.focus={};hsRender();if(!HSV.raf){HSV.last=0;HSV.raf=requestAnimationFrame(hsLoop)}}
function closeHouse(){if(HSV.el)HSV.el.hidden=true;HSV.sel=null;updateWalletUI();if(state==='title')updateLobby()}
function hsRender(){const r=HSV.el,H=hs();
  r.innerHTML=`<div class="ps-top"><button class="x-btn hs-x" aria-label="close"></button><div class="ps-title"><b></b><small></small></div><div class="coin-pill hs-coins">${coinImg()}<span></span></div></div>
    <div class="hs-rooms"></div><div class="hs-stage"><canvas class="hs-cv"></canvas><button class="hs-skinbtn" aria-label="skins"><i>🎨</i><span></span><b class="chev"></b></button>
    <button class="hs-arr l" aria-label="previous room"></button><button class="hs-arr r" aria-label="next room"></button></div><div class="hs-panel"></div>`;
  r.querySelector('.hs-x').innerHTML=XSVG;r.querySelector('.hs-x').onclick=()=>{sfx.click();closeHouse()};r.querySelector('.ps-title b').textContent=t('hsTitle');r.querySelector('.ps-title small').textContent=t('hsSub');
  r.querySelector('.hs-skinbtn span').textContent=t('hsSkins');r.querySelector('.hs-skinbtn').onclick=()=>{sfx.click();hsSkinSheet()};
  r.querySelectorAll('.hs-arr').forEach(b=>{b.innerHTML='<svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" fill="none" stroke="#120d2b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 4 7 12l8 8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    b.onclick=()=>{if(performance.now()-TAPGUARD<350)return;hsStep(+b.dataset.d)}});
  hsTabs();const st=r.querySelector('.hs-stage'),cv=HSV.cv=r.querySelector('.hs-cv');HSV.g=cv.getContext('2d');HSV.dpr=Math.min(2,window.devicePixelRatio||1);
  HSV.vis=0;HSV.W=Math.round(Math.min(560,st.clientWidth||window.innerWidth));HSV.H=Math.max(220,Math.round(st.clientHeight||window.innerHeight*.5));hsGeom();
  cv.width=Math.round(HSV.W*HSV.dpr);cv.height=Math.round(HSV.H*HSV.dpr);cv.style.width=HSV.W+'px';cv.style.height=HSV.H+'px';HSV.cam=HSV.camT=hsCamFor(hsRI(H.room));
  cv.addEventListener('pointerdown',hsDown);cv.addEventListener('pointermove',hsMove);cv.addEventListener('pointerup',hsUp);cv.addEventListener('pointercancel',()=>{HSV.drag=null;HSV.pan=null;HSV.camT=hsCamFor(hsRI(hs().room))});
  hsCoins();hsPanel();hsArrows()}
// a long single word (German 'Wohnzimmer') shrinks to fit instead of breaking in the middle
function hsFit(els,min=8){els.forEach(e=>{e.style.fontSize='';let fs=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>e.clientWidth+1&&fs>min){fs-=.5;e.style.fontSize=fs+'px'}})}
function hsCoins(){const s=HSV.el&&HSV.el.querySelector('.hs-coins span');if(s){s.textContent=(progress.coins||0).toLocaleString();hsFit(HSV.el.querySelectorAll('.ps-title b'),16)}}
// the strip under the house: the room's furniture cards side by side, or the item you picked (power, design, turn, upgrade)
// the furniture power as a sentence with its number in green, plus a chip with the next level's number ("3% → 4%") while it can be upgraded
function hsNumSplit(id,L){const n=+hsVal(id,Math.max(1,L)).toFixed(1),s=t('hsp_'+id,{n:'\u0001'}),i=s.indexOf('\u0001');if(i<0)return {a:s,n:'',b:''};
  let a=s.slice(0,i),b=s.slice(i+1),num=String(n);const pre=a.match(/[%٪]$/),post=b.match(/^[\s  ]?[%٪]/);
  if(pre){num=pre[0]+num;a=a.slice(0,-1)}else if(post){num+=post[0];b=b.slice(post[0].length)}return {a,n:num,b}}
function hsPw(el,id,L,nx){const S=hsNumSplit(id,L),e=document.createElement('em');el.textContent='';e.className='n';e.dir='ltr';e.textContent=S.n;el.append(S.a,e,S.b);
  if(nx&&L>0&&L<5){const d=document.createElement('span'),n=hsNumSplit(id,L+1).n;d.className='hs-dl';d.dir='ltr';d.textContent=I18N[lang]._dir==='rtl'?n+' ←':'→ '+n;el.append(' ',d)}}
const hsStarsH=(id,L)=>[1,2,3,4,5].map(k=>`<em class="${k<=L?'on':''}${HSV.up&&HSV.up.id===id&&HSV.up.L===k&&performance.now()-HSV.up.t<1500?' pop':''}">★</em>`).join('');
// the room's cards: the ones you can upgrade now first, then the ones you can't afford yet, then the ones that wait for a player level, then the
// finished ones. The order is fixed while you stay in the room (a card doesn't jump away after you upgrade it)
function hsOrder(room){const rank=f=>{const L=hsLv(f.id);if(L>=5)return 3;if(hsPlayerLv()<hsGate(f.id,L+1))return 2;return (progress.coins||0)>=HS_PRICE[L]?0:1};
  return HS_F.filter(f=>f.room===room).map((f,i)=>[rank(f),i,f.id]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(x=>x[2])}
function hsCard(id,locked){const L=hsLv(id),c=document.createElement('div');c.className='hs-card'+(L?' hs-own':'')+(L>=5?' max':'');c.dataset.id=id;
  c.innerHTML=`<span class="hs-ic"></span><div class="hs-cn"><b></b><i class="hs-stars">${hsStarsH(id,L)}</i></div><p class="hs-pw"></p><div class="hs-ca"></div>`;
  hsIcon(c.querySelector('.hs-ic'),id);c.querySelector('b').textContent=t('hsf_'+id);hsPw(c.querySelector('p'),id,L||1,L>0);const ca=c.querySelector('.hs-ca');
  if(!locked){if(L&&hsStyles(id).length>1){const d=document.createElement('button');d.className='btn hs-des';d.innerHTML='<i>🖌️</i><span></span>';d.querySelector('span').textContent=t('hsDesign');
      d.onclick=e=>{e.stopPropagation();if(performance.now()-TAPGUARD<350)return;sfx.click();HSV.sel=id;hsPanel()};ca.appendChild(d)}
    if(L>=5){const m=document.createElement('div');m.className='hs-maxp';m.textContent=t('hsMax');ca.appendChild(m)}else{const b=document.createElement('button');b.className='btn hs-bb';hsBuyBtn(b,id);ca.appendChild(b)}}
  // a card at the side slides to the middle; the middle one opens the item
  c.onclick=e=>{if(e.target.closest('button'))return;if(!c.classList.contains('focus')){sfx.click();hsStripTo(c,true);return}if(L){sfx.click();HSV.sel=id;hsPanel()}};return c}
function hsStripTo(c,smooth){if(!c)return;const g=c.parentNode,A=c.getBoundingClientRect(),B=g.getBoundingClientRect(),dx=A.left+A.width/2-B.left-B.width/2;
  if(smooth)g.scrollBy({left:dx,behavior:'smooth'});else{g.scrollLeft+=dx;hsStripSync(g)}}
function hsStripSync(g){const B=g.getBoundingClientRect(),cx=B.left+B.width/2;let best=null,bd=1e9;g.querySelectorAll('.hs-card').forEach(c=>{const A=c.getBoundingClientRect(),d=Math.abs(A.left+A.width/2-cx);if(d<bd){bd=d;best=c}});
  if(!best)return;g.querySelectorAll('.hs-card').forEach(c=>c.classList.toggle('focus',c===best));HSV.focus[g.dataset.room]=best.dataset.id;
  const dots=g.nextElementSibling;if(dots)dots.querySelectorAll('i').forEach(d=>d.classList.toggle('on',d.dataset.id===best.dataset.id))}
// the strip under the house: one big card in the middle (the others peek out at the sides, dots below), or the item you picked
// (now / next level, its 10 designs, turn, upgrade)
function hsPanel(){const r=HSV.el;if(!r)return;const p=r.querySelector('.hs-panel'),H=hs(),room=H.room,sel=HSV.sel;
  p.innerHTML='';p.classList.toggle('sel',!!sel);r.classList.toggle('hs-hassel',!!sel);
  if(sel){const L=hsLv(sel),c=document.createElement('div');c.className='hs-sel';
    c.innerHTML=`<span class="hs-ic big"></span><div class="hs-st"><b></b><i class="hs-stars big">${hsStarsH(sel,L)}</i><small class="hs-hint"></small></div><button class="x-btn hs-unsel" aria-label="close"></button>
      <div class="hs-cmp"><div class="hs-now"><small></small><p></p></div><i class="hs-arw"><svg viewBox="0 0 24 24"><path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></i><div class="hs-nx"><small></small><b></b></div></div>
      <div class="hs-acts"><button class="btn hs-turn"><svg viewBox="0 0 24 24"><path d="M19 13A7 7 0 1 1 12 6" fill="none" stroke="#120d2b" stroke-width="5.2" stroke-linecap="round"/><path d="M16.6 6 11.4 1.9v8.2z" fill="#fff" stroke="#120d2b" stroke-width="2.4" stroke-linejoin="round"/><path d="M19 13A7 7 0 1 1 12 6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M15.6 6 11.9 3.1v5.8z" fill="#fff"/></svg><span></span></button></div>`;
    hsIcon(c.querySelector('.hs-ic'),sel);c.querySelector('.hs-st b').textContent=t('hsf_'+sel);
    c.querySelector('.hs-now small').textContent=t('hsNow')+':';hsPw(c.querySelector('.hs-now p'),sel,L);const nx=c.querySelector('.hs-nx');
    if(L<5){nx.querySelector('small').textContent=t('hsNext')+':';const b=nx.querySelector('b');b.dir='ltr';b.textContent=hsNumSplit(sel,L+1).n}else{nx.className+=' max';nx.querySelector('small').remove();nx.querySelector('b').textContent=t('hsMax')}
    c.querySelector('.hs-hint').textContent=t('hsDrag');c.querySelector('.hs-turn span').textContent=t('hsTurn');c.querySelector('.hs-turn').onclick=()=>hsTurn(sel);
    c.querySelector('.hs-unsel').innerHTML=XSVG;c.querySelector('.hs-unsel').onclick=()=>{sfx.click();HSV.sel=null;HSV.peek=null;hsPanel()};
    const acts=c.querySelector('.hs-acts');if(L>=5){const m=document.createElement('div');m.className='hs-maxp';m.textContent=t('hsMax');acts.appendChild(m)}else{const b=document.createElement('button');b.className='btn hs-upb';hsBuyBtn(b,sel);acts.appendChild(b)}
    const ks=hsStyles(sel);let row=null;if(ks.length>1){const cur=hsStyOf(sel),pk=hsPeek(sel);row=document.createElement('div');row.className='hs-sty';row.innerHTML='<span></span><div class="hs-sbs"></div>';row.querySelector('span').textContent=t('hsDesign');
      ks.forEach(k=>{const b=document.createElement('button'),open=hsDOpen(sel,k);b.className='hs-sb'+(k===cur?' on':'')+(open?'':' lock')+(k===pk?' peek':'');b.setAttribute('aria-label',t('hsDesign')+' '+k);
        b.innerHTML=`<img alt="" src="${hsSrc(hsFN(sel,k))}">`+(open?'':`<u>🔒</u><em dir="ltr">${Math.ceil(k/2)}★</em>`);b.onclick=()=>hsSetSty(sel,k);row.lastChild.appendChild(b)});
      c.insertBefore(row,c.querySelector('.hs-acts'))}
    p.appendChild(c);if(row){const sb=row.lastChild,on=sb.querySelector('.on');if(HSV.styX&&HSV.styX[0]===sel)sb.scrollLeft=HSV.styX[1];else if(on){const A=on.getBoundingClientRect(),B=sb.getBoundingClientRect();sb.scrollLeft+=A.left+A.width/2-B.left-B.width/2}sb.onscroll=()=>HSV.styX=[sel,sb.scrollLeft]}
    hsCoins();hsFit(p.querySelectorAll('.hs-st b'));hsFit(p.querySelectorAll('.hs-acts .btn span'),10);hsVis();return}
  const open=hsRoomOpen(room);
  if(!open){const R=HS_ROOMS.find(x=>x.id===room),b=document.createElement('div');b.className='hs-lockb';b.textContent='🔒 '+t('hsRoomLock',{n:R.lv});p.appendChild(b)}
  const ord=HSV.ord[room]||(HSV.ord[room]=hsOrder(room)),grid=document.createElement('div'),dots=document.createElement('div');grid.className='hs-grid';grid.dataset.room=room;dots.className='hs-dots';
  ord.forEach(id=>{grid.appendChild(hsCard(id,!open));const d=document.createElement('i');d.dataset.id=id;d.onclick=()=>hsStripTo(grid.querySelector(`[data-id="${id}"]`),true);dots.appendChild(d)});
  p.append(grid,dots);hsStripTo(grid.querySelector(`[data-id="${ord.includes(HSV.focus[room])?HSV.focus[room]:ord[0]}"]`),false);
  let raf=0;grid.onscroll=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;hsStripSync(grid)})};hsCoins();hsFit(p.querySelectorAll('.hs-card b'));hsFit(p.querySelectorAll('.hs-card .btn span'),10);hsVis()}
// how much of the house shows above the strip: the camera stays on the room, and only moves up when a picked item would hide behind the strip
function hsVis(){const v=HSV,st=v.el&&v.el.querySelector('.hs-stage');if(!st||!v.H)return;v.vis=Math.min(v.H,st.clientHeight||v.H);const k=hsRI(hs().room);let c=hsCamFor(k);
  if(v.sel&&v.vis<v.H){const r=hsRect(v.sel);c=Math.max(c,k*v.SP+r.y+r.h+v.RH*.03-v.vis+8)}v.camT=c}
// pick one of the open designs (free, looks only); a locked one says which upgrade opens it
function hsSetSty(id,k){const H=hs();H.sty=H.sty||{};if(!hsDOpen(id,k)){sfx.locked();noteToast(t('hsDesLock',{n:Math.ceil(k/2)}));HSV.peek={id,k,t:performance.now()+1800};hsPanel();
    setTimeout(()=>{if(HSV.peek&&HSV.peek.k===k&&HSV.sel===id){HSV.peek=null;hsPanel()}},1850);return}if(hsStyOf(id)===k)return;
  sfx.pop();H.sty[id]=k;HSV.peek=null;HSV.pop={id,t0:performance.now()};saveProgress();hsBurst(id);hsPanel()}
function hsIcon(el,id,k){const src=hsSrc(hsFN(id,k));if(src){const i=document.createElement('img');i.src=src;i.alt='';el.appendChild(i)}else{el.textContent=HSF[id].em;el.style.setProperty('--c',HSF[id].col)}}
function hsBuyBtn(b,id){const L=hsLv(id),plv=hsPlayerLv();if(L>=5){b.textContent=t('hsMax');b.disabled=true;b.className+=' max';return}
  const need=hsGate(id,L+1),price=HS_PRICE[L];
  if(plv<need){b.innerHTML='<span>🔒</span> ';b.appendChild(document.createTextNode(t('hsNeedLv',{n:need})));b.className+=' lock';b.onclick=e=>{e.stopPropagation();sfx.locked();noteToast(t('hsNeedLv',{n:need}))};return}
  b.innerHTML=`<span></span>${coinImg()}<em>${price.toLocaleString()}</em>`;b.querySelector('span').textContent=L?t('hsUp'):t('hsBuy');b.className+=' gold';if((progress.coins||0)<price)b.className+=' poor';
  b.onclick=e=>{e.stopPropagation();if(performance.now()-TAPGUARD<350)return;hsBuy(id,b);TAPGUARD=performance.now()}}
function hsBuy(id,btn){const H=hs(),L=hsLv(id),price=HS_PRICE[L];if(L>=5||hsPlayerLv()<hsGate(id,L+1))return;
  if((progress.coins||0)<price){sfx.locked();popupToast(t('needCoins'));return}
  if(!L&&!hsAutoPlace(id)){sfx.locked();noteToast(t('hsNoRoom'));return}
  const d0=hsStyOf(id);progress.coins-=price;H.lv[id]=L+1;if(H.sty)delete H.sty[id];saveProgress();updateWalletUI();sfx.flourish&&sfx.flourish(L>=4?4:2);vib([20,30,20]);if(!L||HSV.sel)HSV.sel=id;HSV.styX=null;HSV.peek=null;
  HSV.up={id,L:L+1,t:performance.now()};HSV.pop={id,t0:performance.now()};hsBurst(id);hsTabs();
  noteToast(t('hsBought',{x:t('hsf_'+id),n:L+1}));if(L&&hsStyOf(id)!==d0)noteToast(t('hsNewLook',{x:t('hsf_'+id)}));hsPanel()}
function hsSkinSheet(){const H=hs(),m=document.createElement('div');m.className='hs-sheet';
  m.innerHTML=`<div class="hs-sh"><div class="hs-shh"><b></b><button class="x-btn" aria-label="close"></button></div><div class="hs-skins"></div></div>`;
  m.querySelector('b').textContent=t('hsSkins');const x=m.querySelector('.x-btn');x.innerHTML=XSVG;x.onclick=()=>{sfx.click();m.remove()};m.onclick=e=>{if(e.target===m)m.remove()};
  const box=m.querySelector('.hs-skins');HS_SKINS.forEach(K=>{const own=H.skins.includes(K.id),c=document.createElement('div');c.className='hs-skin'+(H.skin===K.id?' on':'');
    const fl=hsSrc('hf_room_'+K.id+'_living'),pic=fl||hsSrc('hs_house_'+K.id);
    c.innerHTML=`<span class="sw${fl?' flat':''}">${pic?`<img src="${pic}" alt="">`:`<i style="--w:${K.wall};--w2:${K.wall2};--f:${K.floor};--t:${K.trim}"></i>`}</span><b></b><button class="btn"></button>`;c.querySelector('b').textContent=t('hss_'+K.id);
    const b=c.querySelector('button');if(H.skin===K.id){b.textContent=t('hsUsing');b.disabled=true}else if(own){b.textContent=t('hsUse');b.className+=' primary'}
    else{b.innerHTML=`${coinImg()}<em>${K.p.toLocaleString()}</em>`;if((progress.coins||0)<K.p)b.className+=' poor'}
    b.onclick=()=>{if(H.skin===K.id)return;if(!own){if((progress.coins||0)<K.p){sfx.locked();popupToast(t('needCoins'));return}progress.coins-=K.p;H.skins.push(K.id);sfx.flourish&&sfx.flourish(3);updateWalletUI()}else sfx.click();
      H.skin=K.id;saveProgress();m.remove();hsCoins();hsPanel();hsSkinSheet()};box.appendChild(c)});
  HSV.el.appendChild(m);hsFit(m.querySelectorAll('.hs-skin b'))}

/* ---------- lobby: house icon in the small column + "your house is open" once ---------- */
{const row=document.querySelector('#title .lob-mini');if(row){const b=document.createElement('button');b.className='lt-mini house';b.id='lobHouse';
  b.innerHTML='<span class="lt-ic"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 19 20 7l14 12" fill="#ff6b7a" stroke="#120d2b" stroke-width="3" stroke-linejoin="round"/><path d="M10 18v15h20V18" fill="#ffe2b0" stroke="#120d2b" stroke-width="3" stroke-linejoin="round"/><rect x="17" y="24" width="7" height="9" rx="1.5" fill="#b8743a" stroke="#120d2b" stroke-width="2.5"/><rect x="25.5" y="10" width="4" height="7" fill="#b8743a" stroke="#120d2b" stroke-width="2.5"/></svg><i class="hs-lk">🔒</i></span><b></b>';
  b.onclick=openHouse;row.appendChild(b)}}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);try{const b=document.getElementById('lobHouse');if(b){const open=hsOpen();b.hidden=!progress.tut;b.classList.toggle('lock',!open);
    b.querySelector('b').textContent=open?t('hsMini'):t('hsLvl',{n:HS_OPEN});const pic=hsSrc('hs_house_'+hs().skin),ic=b.querySelector('.lt-ic');if(pic){const im=ic.querySelector('img')||ic.insertBefore(Object.assign(document.createElement('img'),{alt:''}),ic.firstChild);if(!im.src.endsWith(pic))im.src=pic;const sv=ic.querySelector('svg');if(sv)sv.remove()}}
    if(hsOpen()&&!hs().intro)hsIntroLater(1200)}catch(e){}return r}}
let hsIT=0;function hsIntroLater(ms){clearTimeout(hsIT);hsIT=setTimeout(hsIntroMaybe,ms)}
function hsIntroMaybe(){const H=hs();if(H.intro||!hsOpen()||state!=='title'||document.querySelector('.hs-pop'))return;
  if(typeof gdBusy==='function'&&gdBusy()){if(state==='title')hsIntroLater(2000);return}H.intro=1;saveProgress();const m=document.createElement('div');m.className='hs-pop';
  m.innerHTML=`<div class="hz"><div class="rays"></div><div class="hs-house">🏠</div><h3></h3><p></p><button class="btn primary"><span></span></button></div>`;m.querySelector('h3').textContent=t('hsOpenT');m.querySelector('p').textContent=t('hsOpenP');
  m.querySelector('button span').textContent=t('hsGo');m.querySelector('button').onclick=()=>{m.remove();openHouse()};m.onclick=e=>{if(e.target===m)m.remove()};document.body.appendChild(m);sfx.flourish&&sfx.flourish(3)}
{const _d=drawTitleArt;drawTitleArt=function(){if(HSV.el&&!HSV.el.hidden)return;return _d.apply(this,arguments)}}
{const _lo=lobbyLayerOpen;lobbyLayerOpen=function(){const e=document.getElementById('houseScr');return (!!e&&!e.hidden)||!!document.querySelector('.hs-pop')||_lo()}}

/* ---------- the powers in the game ---------- */
{const _hk=hatK;hatK=function(k,d=1){let v=_hk.apply(this,arguments);if(mode==='duo'||!progress.house)return v;const L=hsLv;
  if(k==='tol'&&L('sofa'))v*=1+.01*L('sofa');
  else if(k==='spd'&&L('clock'))v*=1-.01*L('clock');
  else if(k==='light'&&L('fireplace'))v*=1+.05*L('fireplace');
  else if(k==='swayK'&&L('aquarium'))v*=1-.06*L('aquarium');
  else if(k==='feverT'&&L('tv'))v*=1+.04*L('tv');
  else if(k==='boss'&&L('trophies'))v*=1+.03*L('trophies');
  else if(k==='fall'&&L('telescope')&&state!=='title'&&(typeof baseId==='function'?baseId(zone()):zone().id)==='space')v*=1-.04*L('telescope');
  else if(k==='wind'&&L('vane'))v*=1-.04*L('vane');
  else if(k==='perfPts'&&L('flowers'))v*=1+.04*L('flowers');
  else if(k==='aim'&&!v&&L('nightlight')&&state!=='title'&&tower.length-1<hsVal('nightlight',L('nightlight')))v=1;
  return v}}
// piggy bank, dining table, trampoline: one coin row on the result card
{const _tr=tallyRows;tallyRows=function(won){const rows=_tr.apply(this,arguments);if(mode==='duo'||!won||!progress.house)return rows;
  const src=[];const base=rows.reduce((a,r)=>a+(+r[2]||0),0);
  if(hsLv('table')&&hearts>0)src.push(['table',hearts*hsVal('table',hsLv('table'))]);
  if(hsLv('trampoline')&&lv.feverC)src.push(['trampoline',lv.feverC*hsVal('trampoline',hsLv('trampoline'))]);
  if(hsLv('piggy'))src.push(['piggy',Math.ceil(base*hsVal('piggy',hsLv('piggy'))/100)]);
  const add=src.reduce((a,s)=>a+s[1],0);if(add>0)rows.push([src.length===1?t('hsf_'+src[0][0]):t('hsBonus'),'',add,'home']);return rows}}
{const _ax=addXP;addXP=function(n){const L=hsLv('books');if(L&&n>0&&mode!=='duo')n=Math.ceil(n*(1+hsVal('books',L)/100));return _ax.call(this,n)}}
if(typeof evStageCandy==='function'){const _ec=evStageCandy;evStageCandy=function(won){const R=_ec.apply(this,arguments);const L=hsLv('candyjar');if(L&&R){const a=Math.ceil(R.total*hsVal('candyjar',L)/100);R.jar=a;R.total+=a}return R}}
if(typeof startBonus==='function'){const _sb=startBonus;startBonus=function(){const r=_sb.apply(this,arguments);const L=hsLv('toaster');if(L&&typeof BN!=='undefined'&&BN)BN.t+=hsVal('toaster',L);return r}}
{const _ol=hzOnLanding;hzOnLanding=function(perfect,great){const d=tower[tower.length-1],x0=d&&d.xs;const r=_ol.apply(this,arguments);const L=hsLv('sink');
  if(L&&mode!=='duo'&&d&&d.slideX&&curSeason()===3){const f=1-hsVal('sink',L)/100;d.xs=x0+(d.xs-x0)*f;d.slideX*=f}return r}}
const HSQ=[];function hsNote(s){HSQ.push(s);setTimeout(()=>{const m=HSQ.shift();if(m)noteToast(m)},1600+HSQ.length*1400)}
{const _w=win;win=function(){const was=state,r=_w.apply(this,arguments);try{if(was!=='win'&&state==='win'&&(mode==='levels'||mode==='event')&&progress.house){const H=hs(),C=H.cnt;
    if(hsLv('oven')){C.oven=(C.oven||0)+1;if(C.oven>=hsVal('oven',hsLv('oven'))){C.oven=0;if(typeof nest==='function'){nest().treats+=1;hsNote(t('hsOven'))}}}
    if(hsLv('fridge')){C.fridge=(C.fridge||0)+1;if(C.fridge>=hsVal('fridge',hsLv('fridge'))){C.fridge=0;const b=['shield','slow','laser','heart'][(C.fb=(C.fb||0)+1)%4],inv=wallet().inv;inv[b]=(inv[b]||0)+1;hsNote(t('hsFridge'))}}
    saveProgress()}}catch(e){}return r}}
{const _w=win;win=function(){const was=state,r=_w.apply(this,arguments);try{const L=hsLv('bed');if(L&&was!=='win'&&state==='win'&&(mode==='levels'||mode==='event')){const C=hs().cnt;C.bed=(C.bed||0)+1;
    if(C.bed>=hsVal('bed',L)){C.bed=0;C.bedOn=1}saveProgress()}}catch(e){}return r}}
{const _sl=startLevel;startLevel=function(){const r=_sl.apply(this,arguments);try{const C=progress.house&&hs().cnt;if(C&&C.bedOn&&hsLv('bed')&&mode!=='duo'&&mode!=='bonus'){C.bedOn=0;
    boost.shield=true;try{renderBoosterBar()}catch(e){}setTimeout(()=>noteToast(t('hsBed')),1300);saveProgress()}}catch(e){}return r}}
let hsWD=0;for(const fn of ['wBuy','csBuy','buyWithCoins'])if(typeof window[fn]==='function'){const _b=window[fn];window[fn]=function(){const c0=progress.coins||0;let r;hsWD++;try{r=_b.apply(this,arguments)}finally{hsWD--}const L=hsLv('wardrobe'),spent=c0-(progress.coins||0);
  if(L&&spent>0&&!hsWD){const back=Math.ceil(spent*hsVal('wardrobe',L)/100);progress.coins+=back;saveProgress();updateWalletUI();setTimeout(()=>noteToast(t('hsWard',{n:back})),700)}return r}}
if(typeof dlClaim==='function'){const _d=dlClaim;dlClaim=function(){const c0=progress.coins||0;const r=_d.apply(this,arguments);const L=hsLv('mailbox'),got=(progress.coins||0)-c0;
  if(L&&got>0){const a=Math.ceil(got*hsVal('mailbox',L)/100);progress.coins+=a;saveProgress();updateWalletUI();setTimeout(()=>noteToast(t('hsMail',{n:a})),900)}return r}}
if(typeof hatch==='function'){const _h=hatch;hatch=function(){const N=typeof nest==='function'&&nest(),h0=N&&N.hatched;const r=_h.apply(this,arguments);const L=hsLv('birdhouse');
  if(L&&N&&N.hatched>h0){N.treats+=hsVal('birdhouse',L);saveProgress();setTimeout(()=>noteToast(t('hsBird',{n:hsVal('birdhouse',L)})),2600)}return r}}
setTimeout(()=>{try{if(state==='title')updateLobby()}catch(e){}},0);
