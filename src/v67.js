/* ===== v67: THE SHARLIZ HOUSE (Tzach, Oct 8; proposal https://claude.ai/artifact/7t4WduxuWDC1aZxkGcKEMt) =====
   Opens at player level 10 (house icon in the lobby's small column). ISOMETRIC rooms that open with the player level
   (living 10, kitchen 13, bedroom 16, yard 20). 25 furniture items, bought with coins only, 5 levels each (a level also
   needs a player level, HS_GATE), each one gives a small power in the game (hsVal + the hooks at the bottom). No hearts,
   nothing random. Drag an item with a finger to move it (snaps to the floor tiles), the turn button mirrors it.
   House SKINS (6) are looks only. Art comes from the graphics department (spec /mnt/project-files/game/house/art-spec.md):
   art/hs_room_<skin>_<room>.webp + HS_CAL (floor corners), art/hs_house_<skin>.webp, art/hs_f_<id>.webp. Until a picture
   exists the room and the item are drawn by code (iso boxes + emoji).
   progress.house={lv:{id:1..5},pos:{id:{i,j,f}},skin,skins:[],cnt:{oven,fridge,bed,fb},room,intro} */
Object.assign(I18N.en,{hsTitle:'Sharliz House',hsSub:'Furniture with powers',hsLocked:'Opens at player level {n}',hsLvl:'Level {n}',hsBuy:'Buy',hsUp:'Upgrade',hsMax:'Max level!',
  hsNeedLv:'Player level {n}',hsNow:'Now',hsNext:'Next level',hsTurn:'Turn',hsDrag:'Drag it with your finger to move it',hsSkins:'House skins',hsUse:'Use',hsUsing:'In use',
  hsOpenT:'Your house is open!',hsOpenP:'Buy furniture, decorate it, and every piece makes your Sharliz stronger.',hsGo:'To the house',hsBought:'{x}: level {n}!',hsRoomLock:'This room opens at player level {n}',
  hsNoRoom:'No free spot in this room. Move something first.',hsMini:'House',hsDesign:'Design',hsNewLook:'New look: {x}!',hsBonus:'House bonus',
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
  hsNoRoom:'אין מקום פנוי בחדר. הזז משהו קודם.',hsMini:'בית',hsDesign:'עיצוב',hsNewLook:'עיצוב חדש: {x}!',hsBonus:'בונוס הבית',
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

const HS_G=6,HS_OPEN=10,HS_PRICE=[250,400,600,900,1300],HS_GATE=[0,12,15,19,24];
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
function hs(){const H=progress.house=progress.house||{};H.lv=H.lv||{};H.pos=H.pos||{};H.skins=H.skins||['cottage'];if(!H.skins.includes('cottage'))H.skins.push('cottage');
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
const HS_STY=['b','c'],HS_STY_P=300;
function hsStyOf(id){const S=progress.house&&progress.house.sty,k=S&&S[id]||'';return k&&HS_ART.has('hs_f_'+id+'_'+k)?k:''}
const hsFN=(id,k=hsStyOf(id))=>'hs_f_'+id+(k?'_'+k:'');
const hsStyles=id=>['',...HS_STY.filter(k=>HS_ART.has('hs_f_'+id+'_'+k))];
function hsPic(name){if(!HS_ART.has(name))return null;if(HS_IMG[name]!==undefined)return HS_IMG[name];HS_IMG[name]=null;const im=new Image();im.onload=()=>{HS_IMG[name]=im;HSV.dirty=true};im.onerror=()=>{HS_IMG[name]=false};im.src='art/'+name+'.webp';return null}
// floor corners of every room picture in its own px: [top, right, bottom, left] (check with tools/house_cal.py; AI art is never an
// exact 2:1 diamond, so the picture is fitted to the floor grid by least squares per axis)
// floor corners [top,right,bottom,left] in the picture's px; every room picture shares the cottage living room's floor (graphics spec)
const HS_CAL0=[[510,416],[939,629],[499,870],[90,626]],HS_CAL={};

/* ---------- isometric view ---------- */
const HSV={cam:0,camT:0,pan:null,RH:0,SP:0,rect:{},el:null,cv:null,g:null,dpr:1,TW:0,TH:0,VZ:0,WH:0,ox:0,oy:0,W:0,H:0,raf:0,last:0,sel:null,drag:null,dirty:true,hero:null,fx:[],skinOpen:false};
// the house is the 4 rooms stacked top to bottom (living, kitchen, bedroom, yard); the canvas is a window (W x H) on it and
// the camera (cam = house y at the window's top) glides to the room you pick. Room k's own coordinates start at house y k*SP.
function hsGeom(){const v=HSV;v.TW=Math.min(v.W/(HS_G+1),v.H/7.6);v.TH=v.TW/2;v.VZ=v.TW*.62;v.WH=v.TW*1.6;v.ox=v.W/2;v.oy=v.TW*2.15;v.RH=v.oy+HS_G*v.TH+v.TW*.4;v.SP=v.RH+v.TW*.5}
const hsRI=room=>Math.max(0,HS_ROOMS.findIndex(R=>R.id===room));
const hsCamFor=k=>k*HSV.SP+HSV.RH/2-HSV.H/2;
const hsCamClamp=c=>Math.max(hsCamFor(0)-HSV.H*.2,Math.min(hsCamFor(HS_ROOMS.length-1)+HSV.H*.2,c));
const hsP=(i,j,z=0)=>[HSV.ox+(i-j)*HSV.TW/2,HSV.oy+(i+j)*HSV.TH/2-z*HSV.VZ];
function hsInv(x,y){const a=(x-HSV.ox)/(HSV.TW/2),b=(y-HSV.oy)/(HSV.TH/2);return [(a+b)/2,(b-a)/2]}
const hsShade=(c,k)=>{const n=parseInt(c.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,f=x=>Math.max(0,Math.min(255,Math.round(x*k)));return `rgb(${f(r)},${f(g)},${f(b)})`};
function hsPoly(g,pts,fill,stroke){g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=Math.max(1,HSV.TW*.035);g.lineJoin='round';g.stroke()}}
function hsSkin(){return HS_SKINS.find(s=>s.id===hs().skin)||HS_SKINS[0]}
function hsDrawRoom(g,room,dim){const v=HSV,K=hsSkin(),G=HS_G,yard=room==='yard';
  const name='hs_room_'+K.id+'_'+room,im=hsPic(name);if(dim&&!im)g.globalAlpha=.4;
  if(im){const C=HS_CAL[name]||HS_CAL0,D=[hsP(0,0),hsP(G,0),hsP(G,G),hsP(0,G)],fit=a=>{const n=4,X=C.map(c=>c[a]),Y=D.map(d=>d[a]),mx=X.reduce((p,q)=>p+q)/n,my=Y.reduce((p,q)=>p+q)/n;
      let sxy=0,sxx=0;for(let k=0;k<n;k++){sxy+=(X[k]-mx)*(Y[k]-my);sxx+=(X[k]-mx)**2}const sc=sxy/sxx;return [sc,my-sc*mx]};
    const [sx,ox]=fit(0),[sy,oy]=fit(1);g.drawImage(dim?hsDim(name,im):im,ox,oy,im.width*sx,im.height*sy);return}
  if(yard){g.fillStyle='#bfe8ff';g.fillRect(0,0,v.W,v.oy+G*v.TH/2)}
  // floor tiles
  for(let i=0;i<G;i++)for(let j=0;j<G;j++){const c=yard?((i+j)%2?'#7fcf5f':'#74c455'):((i+j)%2?K.floor:K.floor2);hsPoly(g,[hsP(i,j),hsP(i+1,j),hsP(i+1,j+1),hsP(i,j+1)],c)}
  hsPoly(g,[hsP(0,0),hsP(G,0),hsP(G,G),hsP(0,G)],null,'#120d2b');
  const zW=v.WH/v.VZ;
  if(yard){// a low fence on the two back sides
    const fz=zW*.32;for(let k=0;k<=G;k+=.5){for(const [a,b] of [[0,k],[k,0]]){const [x,y]=hsP(a,b),[,y2]=hsP(a,b,fz);g.fillStyle='#fff6e3';g.fillRect(x-v.TW*.05,y2,v.TW*.1,y-y2);g.strokeStyle='#120d2b';g.lineWidth=1;g.strokeRect(x-v.TW*.05,y2,v.TW*.1,y-y2)}}
    for(const zz of [fz*.45,fz*.85]){hsPoly(g,[hsP(0,G,zz),hsP(0,0,zz),hsP(G,0,zz),hsP(G,0,zz-.05),hsP(0,0,zz-.05),hsP(0,G,zz-.05)],'#fff6e3','#120d2b')}
    return}
  // two back walls
  hsPoly(g,[hsP(0,0),hsP(0,G),hsP(0,G,zW),hsP(0,0,zW)],K.wall2,'#120d2b');
  hsPoly(g,[hsP(0,0),hsP(G,0),hsP(G,0,zW),hsP(0,0,zW)],K.wall,'#120d2b');
  // wainscot line + a window on each wall
  g.strokeStyle=K.trim;g.lineWidth=Math.max(1.5,v.TW*.05);for(const [a,b] of [[[0,G],[0,0]],[[0,0],[G,0]]]){const p=hsP(...a,zW*.32),q=hsP(...b,zW*.32);g.beginPath();g.moveTo(...p);g.lineTo(...q);g.stroke()}
  const win=(L)=>{const pts=L?[hsP(0,2.2,zW*.5),hsP(0,3.8,zW*.5),hsP(0,3.8,zW*.88),hsP(0,2.2,zW*.88)]:[hsP(2.2,0,zW*.5),hsP(3.8,0,zW*.5),hsP(3.8,0,zW*.88),hsP(2.2,0,zW*.88)];
    hsPoly(g,pts,K.id==='space'?'#0b1030':K.id==='ocean'?'#2f9fd6':'#9fdcff',K.trim)};win(1);win(0);
  // wall top rim
  hsPoly(g,[hsP(0,G,zW),hsP(0,0,zW),hsP(G,0,zW),hsP(G,0,zW+.08),hsP(0,0,zW+.08),hsP(0,G,zW+.08)],K.trim,'#120d2b')}
const HS_DIM={};function hsDim(name,im){let c=HS_DIM[name];if(c)return c;c=document.createElement('canvas');const k=Math.min(1,512/im.width);c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
  const x=c.getContext('2d');x.drawImage(im,0,0,c.width,c.height);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(36,18,80,.6)';x.fillRect(0,0,c.width,c.height);return HS_DIM[name]=c}
function hsRR(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function hsLockTag(g,R){const v=HSV,[x,y]=hsP(HS_G/2,HS_G/2),fs=Math.round(v.TW*.34),s='🔒 '+t('hsLvl',{n:R.lv}),nm=t('hsr_'+R.id);g.textAlign='center';g.textBaseline='middle';
  g.font=`900 ${Math.round(fs*1.25)}px "Lilita One",Rubik,system-ui,sans-serif`;g.lineJoin='round';g.lineWidth=fs*.4;g.strokeStyle='#120d2b';g.strokeText(nm,x,y-fs*1.55);g.fillStyle='#fff';g.fillText(nm,x,y-fs*1.55);
  g.font=`900 ${fs}px Rubik,system-ui,sans-serif`;const w=g.measureText(s).width+fs*1.6,h=fs*1.9;hsRR(g,x-w/2,y-h/2+fs*.35,w,h,h/2);g.fillStyle='#fff';g.fill();g.lineWidth=3;g.stroke();
  g.fillStyle='#120d2b';g.fillText(s,x,y+fs*.35+1)}
// footprint: f=0 → as drawn (floor items face down-left; wall items hang on the right back wall j=0), f=1 → turned (wall items on the left wall i=0)
function hsFoot(id){const p=hs().pos[id];if(!p)return null;return hsFootAt(id,p.i,p.j,p.f)}
function hsFootAt(id,i,j,fl){const f=HSF[id];fl=fl?1:0;return {i,j,f:fl,di:fl?f.fd:f.fw,dj:fl?f.fw:f.fd}}
function hsBox(g,i,j,di,dj,z0,h,col,a=1){g.globalAlpha=a;const top=[hsP(i,j,z0+h),hsP(i+di,j,z0+h),hsP(i+di,j+dj,z0+h),hsP(i,j+dj,z0+h)];
  hsPoly(g,[hsP(i,j+dj,z0),hsP(i+di,j+dj,z0),hsP(i+di,j+dj,z0+h),hsP(i,j+dj,z0+h)],hsShade(col,.78),'#120d2b');
  hsPoly(g,[hsP(i+di,j,z0),hsP(i+di,j+dj,z0),hsP(i+di,j+dj,z0+h),hsP(i+di,j,z0+h)],hsShade(col,.9),'#120d2b');
  hsPoly(g,top,col,'#120d2b');g.globalAlpha=1;return top}
function hsDrawItem(g,id,ghost){const v=HSV,f=HSF[id],F=ghost||hsFoot(id);if(!F)return;const L=hsLv(id),p=hs().pos[id]||{},sel=v.sel===id&&!ghost;
  // wall items stand against the wall: a thin box along the wall row
  let {i,j,di,dj}=F;if(f.wall){if(F.f)di=.5;else dj=.5}
  const a=ghost?(ghost.ok?.75:.45):1,[cx,cy]=hsP(i+di/2,j+dj/2,f.z0);
  // soft shadow
  if(!f.z0){g.globalAlpha=.25*a;g.fillStyle='#120d2b';g.beginPath();g.ellipse(cx,cy,(di+dj)*v.TW*.3,(di+dj)*v.TH*.3,0,0,7);g.fill();g.globalAlpha=1}
  const im=hsPic(hsFN(id));
  if(im){const w=(F.di+F.dj)*v.TW/2*1.08*Math.min(1,im.width/(f.fw+f.fd>2?512:256)),h=w*im.height/im.width,[bx,by]=hsP(i+di,j+dj,f.z0);
    if(!ghost)v.rect[id]={x:cx-w/2,y:by+v.TH*.12-h,w,h,im,fl:f.wall?!F.f:F.f};g.save();g.globalAlpha=a;g.translate(cx,by+v.TH*.12);if(f.wall?!F.f:F.f)g.scale(-1,1);g.drawImage(im,-w/2,-h,w,h);g.restore()}
  else{const top=hsBox(g,i,j,di,dj,f.z0,f.h,ghost&&!ghost.ok?'#ff6b6b':f.col,a);const [tx,ty]=hsP(i+di/2,j+dj/2,f.z0+f.h),fs=v.TW*(f.fw+f.fd>2?.62:.5);
    g.globalAlpha=a;g.font=`${fs}px "Apple Color Emoji","Noto Color Emoji",sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillText(f.em,tx,ty-fs*.15);g.globalAlpha=1}
  if(L>=5&&!ghost){const r=im&&v.rect[id];let [sx,sy]=hsP(i+di/2,j+dj/2,f.z0+f.h+.35);if(r)sy=r.y-v.TH*.15;for(let k=0;k<3;k++){const ph=HSV.last/400+k*2.1;g.fillStyle='#ffe24d';g.globalAlpha=.55+.45*Math.sin(ph);hsStar(g,sx+Math.cos(ph)*v.TW*.35,sy+Math.sin(ph*1.3)*v.TH*.3,v.TW*.07)}g.globalAlpha=1}
  if(L&&!ghost){const [lx,ly]=hsP(i+di,j+dj,f.z0);g.font=`900 ${Math.round(v.TW*.24)}px Rubik,system-ui,sans-serif`;g.textAlign='center';g.textBaseline='middle';
    const s='★'+L;g.lineWidth=3;g.strokeStyle='#120d2b';g.strokeText(s,lx,ly-v.TH*.1);g.fillStyle=L>=5?'#ffe24d':'#fff';g.fillText(s,lx,ly-v.TH*.1)}
  if(sel){g.save();g.strokeStyle='#ffe24d';g.lineWidth=3;g.setLineDash([6,5]);g.lineDashOffset=-HSV.last/40;hsPoly(g,[hsP(F.i,F.j),hsP(F.i+F.di,F.j),hsP(F.i+F.di,F.j+F.dj),hsP(F.i,F.j+F.dj)],null,null);g.stroke();g.restore()}}
function hsStar(g,x,y,r){g.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,rr=k%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.closePath();g.fill()}
function hsItemsIn(room){return HS_F.filter(f=>f.room===room&&hsLv(f.id)&&hs().pos[f.id])}
function hsCells(id,F){const c=[];for(let a=0;a<F.di;a++)for(let b=0;b<F.dj;b++)c.push((F.i+a)+','+(F.j+b));return c}
function hsFits(id,F,room){const f=HSF[id];if(F.i<0||F.j<0||F.i+F.di>HS_G||F.j+F.dj>HS_G)return false;if(f.wall&&(F.f?F.i!==0:F.j!==0))return false;
  const mine=new Set(hsCells(id,F));for(const o of hsItemsIn(room)){if(o.id===id)continue;if(hsCells(o.id,hsFoot(o.id)).some(c=>mine.has(c)))return false}return true}
// a new item goes to its own spot in a furnished room (i, j, turned) — the middle stays free for the Sharliz;
// if the player moved something there, to the free spot farthest from the other furniture
const HS_SPOT={piggy:[5,0,0],sofa:[1,3,0],clock:[0,0,0],fireplace:[2,0,0],aquarium:[0,4,1],books:[1,0,0],tv:[5,3,1],
  oven:[1,0,0],fridge:[0,0,0],candyjar:[5,0,0],table:[2,3,0],sink:[3,0,0],toaster:[2,0,0],
  bed:[1,0,0],nightlight:[0,0,0],toychest:[0,5,0],wardrobe:[0,2,1],trophies:[3,0,0],telescope:[5,0,0],
  vane:[0,0,0],mailbox:[5,3,0],birdhouse:[0,3,0],flowers:[1,0,0],trampoline:[2,2,0],balloons:[5,0,0]};
function hsAutoPlace(id){const f=HSF[id],H=hs(),S=HS_SPOT[id];
  if(S){const F=hsFootAt(id,S[0],S[1],S[2]);if(hsFits(id,F,f.room)){H.pos[id]={i:F.i,j:F.j,f:F.f};return true}}
  const others=hsItemsIn(f.room).filter(o=>o.id!==id).map(o=>{const F=hsFoot(o.id);return [F.i+F.di/2,F.j+F.dj/2]}),cand=[];
  for(const fl of [0,1])for(let i=0;i<HS_G;i++)for(let j=0;j<HS_G;j++){const F=hsFootAt(id,i,j,fl);if(f.wall&&(fl?i!==0:j!==0))continue;cand.push(F)}
  const sc=F=>{const cx=F.i+F.di/2,cy=F.j+F.dj/2,near=others.length?Math.min(...others.map(([a,b])=>Math.hypot(a-cx,b-cy))):3;
    return -Math.min(near,3)+(f.wall?0:(Math.abs(cx-3)<1.5&&Math.abs(cy-3)<1.5?1.2:0))+F.f*.05};
  cand.sort((a,b)=>sc(a)-sc(b));
  for(const F of cand)if(hsFits(id,F,f.room)){H.pos[id]={i:F.i,j:F.j,f:F.f};return true}return false}
// hero walks between free tiles
function hsHeroTick(dt){const v=HSV,room=hs().room;let h=v.hero;if(!h){h=v.hero={s:arcHeroSpriteSafe(),i:2.5,j:3.5,ti:2.5,tj:3.5,wait:1,hop:0}}
  const busy=new Set();hsItemsIn(room).forEach(o=>hsCells(o.id,hsFoot(o.id)).forEach(c=>busy.add(c)));
  const free=(i,j)=>!busy.has(Math.floor(i)+','+Math.floor(j));
  if(!free(h.i,h.j)){let best=null,bd=1e9;for(let a=0;a<HS_G;a++)for(let b=0;b<HS_G;b++)if(free(a+.5,b+.5)){const d=Math.hypot(a+.5-h.i,b+.5-h.j);if(d<bd){bd=d;best=[a+.5,b+.5]}}if(best){h.i=h.ti=best[0];h.j=h.tj=best[1]}}
  const dx=h.ti-h.i,dy=h.tj-h.j,d=Math.hypot(dx,dy);
  if(d>.02){const st=Math.min(d,dt*1.3),ni=h.i+dx/d*st,nj=h.j+dy/d*st;if(free(ni,nj)){h.i=ni;h.j=nj;h.hop+=dt*9}else{h.ti=h.i;h.tj=h.j}}
  else if((h.wait-=dt)<=0){h.wait=1.2+Math.random()*2.2;for(let k=0;k<12;k++){const a=Math.floor(Math.random()*HS_G)+.5,b=Math.floor(Math.random()*HS_G)+.5;let ok=true;
      for(let s=0;s<=10&&ok;s++){if(!free(h.i+(a-h.i)*s/10,h.j+(b-h.j)*s/10))ok=false}if(ok){h.ti=a;h.tj=b;break}}}
  if(h.s){h.s.blink=(h.s.blink||0)+dt;if(typeof jigStep==='function'){}}}
function arcHeroSpriteSafe(){try{return Object.assign(makeSharliz(),{color:CHARS.hero?'hero':'#06a2ba',mood:null})}catch(e){return null}}
function hsDrawHero(g){const v=HSV,h=v.hero;if(!h||!h.s)return;const [x,y]=hsP(h.i,h.j),sz=v.TW*.62,hop=Math.abs(Math.sin(h.hop))*v.TH*.35;
  g.globalAlpha=.25;g.fillStyle='#120d2b';g.beginPath();g.ellipse(x,y,sz*.42,sz*.16,0,0,7);g.fill();g.globalAlpha=1;
  try{withCtx(g,sz,()=>drawSharliz(h.s,x,y-sz*.72-hop,0,null,{x:(h.ti-h.i)-(h.tj-h.j)>0?.4:-.4,y:0}))}catch(e){}}
function hsDraw(dt=1/60){const v=HSV,g=v.g;if(!g)return;const cur=hs().room,d=v.dpr;g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,v.W,v.H);
  v.fx=v.fx.filter(p=>(p.t+=dt)<1);
  HS_ROOMS.forEach((R,k)=>{const y0=k*v.SP-v.cam;if(y0>v.H||y0+v.RH<0)return;g.setTransform(d,0,0,d,0,d*y0);const open=hsRoomOpen(R.id);
    hsDrawRoom(g,R.id,!open);g.globalAlpha=1;if(!open){hsLockTag(g,R);return}
    const list=hsItemsIn(R.id).map(f=>{const F=hsFoot(f.id);return {k:(F.i+F.di)+(F.j+F.dj)+(f.wall?-1.5:0),fn:()=>hsDrawItem(g,f.id)}});
    if(R.id===cur){if(v.hero&&v.hero.s)list.push({k:v.hero.i+v.hero.j+.6,fn:()=>hsDrawHero(g)});
      if(v.drag&&v.drag.moved&&v.drag.F)list.push({k:99,fn:()=>hsDrawItem(g,v.drag.id,v.drag.F)})}
    list.sort((a,b)=>a.k-b.k).forEach(o=>o.fn());
    if(R.id===cur){for(const p of v.fx){g.globalAlpha=1-p.t;g.fillStyle=p.c;hsStar(g,p.x+p.vx*p.t,p.y+p.vy*p.t+80*p.t*p.t,v.TW*.08*(1-p.t*.5))}g.globalAlpha=1}});
  g.setTransform(d,0,0,d,0,0)}
function hsBurst(id){const F=hsFoot(id);if(!F)return;const [x,y]=hsP(F.i+F.di/2,F.j+F.dj/2,HSF[id].z0+HSF[id].h);for(let k=0;k<22;k++){const a=Math.random()*7,s=40+Math.random()*90;HSV.fx.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-60,t:0,c:pick(['#ffe24d','#ff7ab8','#7ae0ff','#fff'])})}}
function hsLoop(now){const v=HSV;if(!v.el||v.el.hidden){v.raf=0;return}const dt=Math.min(.05,(now-(v.last||now))/1000);v.last=now;
  if(!v.pan){v.cam+=(v.camT-v.cam)*Math.min(1,dt*7);if(Math.abs(v.camT-v.cam)<.3)v.cam=v.camT}
  if(!document.hidden){if(hsRoomOpen(hs().room))hsHeroTick(dt);hsDraw(dt)}v.raf=requestAnimationFrame(hsLoop)}
/* ---------- touch: tap = select, drag = move ---------- */
function hsVP(e){const r=HSV.cv.getBoundingClientRect();return [(e.clientX-r.left)*HSV.W/r.width,(e.clientY-r.top)*HSV.H/r.height]}
// a point in the coordinates of the room you are in
function hsPt(e){const [x,y]=hsVP(e);return [x,y+HSV.cam-hsRI(hs().room)*HSV.SP]}
function hsRoomAt(vy){const v=HSV,k=Math.floor((vy+v.cam+(v.SP-v.RH)/2)/v.SP);return HS_ROOMS[Math.max(0,Math.min(HS_ROOMS.length-1,k))].id}
// the item's outline on screen (the six corners of its box), front-most item first
const HS_AM={};function hsAlphaAt(im,u,v){let m=HS_AM[im.src];if(!m){const w=64,h=Math.max(1,Math.round(64*im.height/im.width)),c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.drawImage(im,0,0,w,h);
  try{m={w,h,d:g.getImageData(0,0,w,h).data}}catch(_){m={w:0}}HS_AM[im.src]=m}if(!m.w)return true;const a=Math.floor(u*m.w),b=Math.floor(v*m.h);return a>=0&&b>=0&&a<m.w&&b<m.h&&m.d[(b*m.w+a)*4+3]>60}
function hsInPoly(x,y,P){let c=false;for(let a=0,b=P.length-1;a<P.length;b=a++){const [xa,ya]=P[a],[xb,yb]=P[b];if((ya>y)!==(yb>y)&&x<(xb-xa)*(y-ya)/(yb-ya)+xa)c=!c}return c}
function hsHit(x,y){const room=hs().room,list=hsItemsIn(room).map(f=>({f,F:hsFoot(f.id)})).sort((a,b)=>(b.F.i+b.F.di+b.F.j+b.F.dj+(b.f.wall?-1.5:0))-(a.F.i+a.F.di+a.F.j+a.F.dj+(a.f.wall?-1.5:0)));
  for(const {f,F} of list){const r=HSV.rect[f.id];if(r&&hsPic(hsFN(f.id))){if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h){const u=(x-r.x)/r.w;if(hsAlphaAt(r.im,r.fl?1-u:u,(y-r.y)/r.h))return f.id}continue}
    let {i,j,di,dj}=F;if(f.wall){if(F.f)di=.5;else dj=.5}const z0=f.z0,z1=f.z0+Math.max(f.h,.5);
    const P=[hsP(i,j+dj,z0),hsP(i+di,j+dj,z0),hsP(i+di,j,z0),hsP(i+di,j,z1),hsP(i,j,z1),hsP(i,j+dj,z1)];if(hsInPoly(x,y,P))return f.id}
  // a tap on a free floor tile picks nothing (so it unselects); a near miss elsewhere still picks the closest item
  const [ti,tj]=hsInv(x,y);if(ti>=0&&tj>=0&&ti<HS_G&&tj<HS_G){const busy=new Set();list.forEach(({f,F})=>hsCells(f.id,F).forEach(c=>busy.add(c)));if(!busy.has(Math.floor(ti)+','+Math.floor(tj)))return null}
  let best=null,bd=HSV.TW*.35;for(const {f,F} of list){const [cx,cy]=hsP(F.i+F.di/2,F.j+F.dj/2,f.z0+f.h/2),d=Math.hypot(cx-x,cy-y)-HSV.TW*.4*(F.di+F.dj)/2;if(d<bd){bd=d;best=f.id}}return best}
function hsDown(e){const v=HSV,[vx,vy]=hsVP(e),[x,y]=hsPt(e),cur=hs().room,id=y>=0&&y<=v.RH&&hsRoomOpen(cur)?hsHit(x,y):null;
  if(!id){v.pan={y0:vy,c0:v.cam,moved:false,v:0,ly:vy,lt:performance.now(),room:hsRoomAt(vy)};try{v.cv.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();return}
  const F=hsFoot(id),[pi,pj]=hsInv(x,y);
  v.drag={id,gi:pi-F.i,gj:pj-F.j,x0:x,y0:y,moved:false,F:null};try{v.cv.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()}
function hsMove(e){const P=HSV.pan;if(P){const [,vy]=hsVP(e);if(!P.moved&&Math.abs(vy-P.y0)<8)return;P.moved=true;const now=performance.now(),dtm=Math.max(1,now-P.lt);
    P.v=P.v*.6+(vy-P.ly)/dtm*1000*.4;P.ly=vy;P.lt=now;HSV.cam=hsCamClamp(P.c0-(vy-P.y0));e.preventDefault();return}
  const d=HSV.drag;if(!d)return;const [x,y]=hsPt(e);if(!d.moved&&Math.hypot(x-d.x0,y-d.y0)<8)return;d.moved=true;const [pi,pj]=hsInv(x,y),F0=hsFoot(d.id);
  let F;if(HSF[d.id].wall){const left=pi<pj,fl=left?1:0,F1=hsFootAt(d.id,0,0,fl);F=left?hsFootAt(d.id,0,Math.round(pj-F1.dj/2),1):hsFootAt(d.id,Math.round(pi-F1.di/2),0,0)}
  else F=hsFootAt(d.id,Math.round(pi-d.gi),Math.round(pj-d.gj),F0.f);
  F.ok=hsFits(d.id,F,hs().room);d.F=F;e.preventDefault()}
function hsUp(){const P=HSV.pan;if(P){HSV.pan=null;
    if(!P.moved){if(P.room!==hs().room)hsFocus(P.room);else if(HSV.sel){HSV.sel=null;hsPanel()}return}
    // let go: glide to the room nearest to where the flick is heading
    const aim=HSV.cam-P.v*.25;let best=0,bd=1e9;HS_ROOMS.forEach((R,k)=>{const dd=Math.abs(hsCamFor(k)-aim);if(dd<bd){bd=dd;best=k}});hsFocus(HS_ROOMS[best].id);return}
  const d=HSV.drag;HSV.drag=null;if(!d)return;if(!d.moved){sfx.click();HSV.sel=d.id;hsPanel();return}
  if(d.F&&d.F.ok){const p=hs().pos[d.id];p.i=d.F.i;p.j=d.F.j;p.f=d.F.f;saveProgress();sfx.pop();vib(10);HSV.sel=d.id;hsPanel()}else sfx.locked()}
function hsTurn(id){const f=HSF[id],p=hs().pos[id];if(!p)return;
  // a wall item moves to the other wall, a floor item turns in place
  // (if that spot is taken, the nearest free spot that way round)
  const fl=p.f?0:1,ci=f.wall?p.j:p.i,cj=f.wall?p.i:p.j,cand=[];
  for(let i=0;i<HS_G;i++)for(let j=0;j<HS_G;j++){const F=hsFootAt(id,i,j,fl);if(hsFits(id,F,f.room))cand.push([Math.hypot(i-ci,j-cj),F])}
  if(!cand.length){sfx.locked();noteToast(t('hsNoRoom'));return}cand.sort((a,b)=>a[0]-b[0]);const F=cand[0][1];p.i=F.i;p.j=F.j;p.f=F.f;saveProgress();sfx.pop()}

/* ---------- screen ---------- */
function hsFocus(room,quiet){const v=HSV,H=hs(),R=HS_ROOMS.find(x=>x.id===room),open=hsRoomOpen(room);
  if(H.room!==room){H.room=room;v.sel=null;v.hero=null;v.drag=null;if(open)saveProgress()}
  v.camT=hsCamFor(hsRI(room));if(quiet)v.cam=v.camT;else if(open)sfx.click();else{sfx.locked();noteToast(t('hsRoomLock',{n:R.lv}))}
  hsTabs();hsPanel()}
function hsTabs(){const r=HSV.el,H=hs(),rooms=r&&r.querySelector('.hs-rooms');if(!rooms)return;rooms.innerHTML='';
  HS_ROOMS.forEach(R=>{const open=hsRoomOpen(R.id),b=document.createElement('button');b.className='hs-room'+(H.room===R.id?' on':'')+(open?'':' lock');
    b.innerHTML=`<i>${open?R.ic:'🔒'}</i><b></b>${open?'':'<small></small>'}`;b.querySelector('b').textContent=t('hsr_'+R.id);if(!open)b.querySelector('small').textContent=t('hsLvl',{n:R.lv});
    b.onclick=()=>{if(H.room!==R.id)hsFocus(R.id)};rooms.appendChild(b)});hsFit(rooms.querySelectorAll('b'))}
function openHouse(){if(!hsOpen()){sfx.locked();noteToast(t('hsLocked',{n:HS_OPEN}));return}audio();sfx.click();const H=hs();H.intro=1;saveProgress();
  if(!HSV.el){const el=HSV.el=document.createElement('div');el.id='houseScr';document.body.appendChild(el)}
  HSV.el.hidden=false;if(!hsRoomOpen(H.room))H.room='living';HSV.sel=null;HSV.hero=null;HSV.pan=null;HSV.drag=null;hsRender();if(!HSV.raf){HSV.last=0;HSV.raf=requestAnimationFrame(hsLoop)}}
function closeHouse(){if(HSV.el)HSV.el.hidden=true;HSV.sel=null;updateWalletUI();if(state==='title')updateLobby()}
function hsRender(){const r=HSV.el,H=hs();
  r.innerHTML=`<div class="ps-top"><button class="x-btn hs-x" aria-label="close"></button><div class="ps-title"><b></b><small></small></div><div class="coin-pill hs-coins">${coinImg()}<span></span></div></div>
    <div class="hs-rooms"></div><div class="hs-stage"><canvas class="hs-cv"></canvas><button class="hs-skinbtn" aria-label="skins"><i>🎨</i><span></span></button></div><div class="hs-panel"></div>`;
  r.querySelector('.hs-x').innerHTML=XSVG;r.querySelector('.hs-x').onclick=()=>{sfx.click();closeHouse()};r.querySelector('.ps-title b').textContent=t('hsTitle');r.querySelector('.ps-title small').textContent=t('hsSub');
  r.querySelector('.hs-skinbtn span').textContent=t('hsSkins');r.querySelector('.hs-skinbtn').onclick=()=>{sfx.click();hsSkinSheet()};
  hsTabs();const st=r.querySelector('.hs-stage'),cv=HSV.cv=r.querySelector('.hs-cv');HSV.g=cv.getContext('2d');HSV.dpr=Math.min(2,window.devicePixelRatio||1);
  HSV.vis=0;HSV.W=Math.round(Math.min(560,st.clientWidth||window.innerWidth));HSV.H=Math.max(220,Math.round(st.clientHeight||window.innerHeight*.5));hsGeom();
  cv.width=Math.round(HSV.W*HSV.dpr);cv.height=Math.round(HSV.H*HSV.dpr);cv.style.width=HSV.W+'px';cv.style.height=HSV.H+'px';HSV.cam=HSV.camT=hsCamFor(hsRI(H.room));
  cv.addEventListener('pointerdown',hsDown);cv.addEventListener('pointermove',hsMove);cv.addEventListener('pointerup',hsUp);cv.addEventListener('pointercancel',()=>{HSV.drag=null;HSV.pan=null;HSV.camT=hsCamFor(hsRI(hs().room))});
  hsCoins();hsPanel()}
// a long single word (German 'Wohnzimmer') shrinks to fit instead of breaking in the middle
function hsFit(els,min=8){els.forEach(e=>{e.style.fontSize='';let fs=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>e.clientWidth+1&&fs>min){fs-=.5;e.style.fontSize=fs+'px'}})}
function hsCoins(){const s=HSV.el&&HSV.el.querySelector('.hs-coins span');if(s){s.textContent=(progress.coins||0).toLocaleString();hsFit(HSV.el.querySelectorAll('.ps-title b'),16)}}
// the strip under the house: the room's furniture cards side by side, or the item you picked (power, design, turn, upgrade)
function hsPanel(){const r=HSV.el;if(!r)return;const p=r.querySelector('.hs-panel'),H=hs(),room=H.room,sel=HSV.sel,old=p.querySelector('.hs-grid');
  if(old)(HSV.stripX=HSV.stripX||{})[old.dataset.room]=old.scrollLeft;p.innerHTML='';p.classList.toggle('sel',!!sel);
  if(sel){const f=HSF[sel],L=hsLv(sel),c=document.createElement('div');c.className='hs-sel';
    c.innerHTML=`<span class="hs-ic big"></span><div class="hs-st"><b></b><i class="hs-stars"></i><p class="now"></p><p class="nx"></p><small></small></div><button class="x-btn hs-unsel" aria-label="close"></button><div class="hs-acts"><button class="btn hs-turn"><span></span></button><button class="btn primary hs-upb"></button></div>`;
    hsIcon(c.querySelector('.hs-ic'),sel);c.querySelector('b').textContent=t('hsf_'+sel);c.querySelector('.hs-stars').innerHTML=[1,2,3,4,5].map(k=>`<em class="${k<=L?'on':''}">★</em>`).join('');
    c.querySelector('.now').textContent=t('hsNow')+': '+hsTxt(sel,L);if(L<5)c.querySelector('.nx').textContent=t('hsNext')+': '+hsTxt(sel,L+1);else c.querySelector('.nx').remove();
    c.querySelector('small').textContent=t('hsDrag');c.querySelector('.hs-turn span').textContent=t('hsTurn');c.querySelector('.hs-turn').onclick=()=>hsTurn(sel);
    c.querySelector('.hs-unsel').innerHTML=XSVG;c.querySelector('.hs-unsel').onclick=()=>{sfx.click();HSV.sel=null;hsPanel()};hsBuyBtn(c.querySelector('.hs-upb'),sel);
    const ks=hsStyles(sel);if(ks.length>1){const row=document.createElement('div'),own=(H.stown||{})[sel]||[],cur=hsStyOf(sel);row.className='hs-sty';row.innerHTML='<span></span>';row.querySelector('span').textContent=t('hsDesign');
      ks.forEach(k=>{const b=document.createElement('button'),has=!k||own.includes(k);b.className='hs-sb'+(k===cur?' on':'');b.setAttribute('aria-label',t('hsDesign')+' '+(HS_STY.indexOf(k)+2));
        b.innerHTML=`<img alt="" src="${hsSrc(hsFN(sel,k))}">`+(has?'':`<em>${coinImg()}${HS_STY_P}</em>`);b.onclick=()=>hsSetSty(sel,k);row.appendChild(b)});
      c.insertBefore(row,c.querySelector('.hs-acts'));c.querySelector('small').remove()}
    p.appendChild(c);hsCoins();hsFit(p.querySelectorAll('.hs-st b'));hsVis();return}
  if(!hsRoomOpen(room)){const R=HS_ROOMS.find(x=>x.id===room),b=document.createElement('div');b.className='hs-lockb';b.textContent='🔒 '+t('hsRoomLock',{n:R.lv});p.appendChild(b)}
  const grid=document.createElement('div');grid.className='hs-grid';grid.dataset.room=room;
  HS_F.filter(f=>f.room===room).forEach(f=>{const L=hsLv(f.id),c=document.createElement('div');c.className='hs-card'+(L?' hs-own':'')+(L>=5?' max':'');c.dataset.id=f.id;
    c.innerHTML=`<span class="hs-ic"></span><b></b><i class="hs-stars">${[1,2,3,4,5].map(k=>`<em class="${k<=L?'on':''}">★</em>`).join('')}</i><p></p><button class="btn hs-bb"></button>`;
    hsIcon(c.querySelector('.hs-ic'),f.id);c.querySelector('b').textContent=t('hsf_'+f.id);c.querySelector('p').textContent=hsTxt(f.id,L||1);hsBuyBtn(c.querySelector('.hs-bb'),f.id);
    if(L)c.onclick=e=>{if(e.target.closest('button'))return;sfx.click();HSV.sel=f.id;hsPanel()};grid.appendChild(c)});
  p.appendChild(grid);grid.scrollLeft=(HSV.stripX||{})[room]||0;hsCoins();hsFit(p.querySelectorAll('.hs-card b'));hsVis()}
// how much of the house shows above the strip: the camera stays on the room, and only moves up when a picked item would hide behind the strip
function hsVis(){const v=HSV,st=v.el&&v.el.querySelector('.hs-stage');if(!st||!v.H)return;v.vis=Math.min(v.H,st.clientHeight||v.H);const k=hsRI(hs().room);let c=hsCamFor(k);
  const F=v.sel&&hsFoot(v.sel);if(F&&v.vis<v.H){const [,y]=hsP(F.i+F.di,F.j+F.dj);c=Math.max(c,k*v.SP+y+v.TH*.5-v.vis+8)}v.camT=c}
// a furniture design is bought once with coins (looks only, the power stays), then free to switch
function hsSetSty(id,k){const H=hs();H.sty=H.sty||{};H.stown=H.stown||{};const own=H.stown[id]=H.stown[id]||[];if(hsStyOf(id)===k)return;
  if(k&&!own.includes(k)){if((progress.coins||0)<HS_STY_P){sfx.locked();popupToast(t('needCoins'));return}progress.coins-=HS_STY_P;own.push(k);updateWalletUI();sfx.flourish&&sfx.flourish(2);vib([20,30,20]);noteToast(t('hsNewLook',{x:t('hsf_'+id)}))}
  else sfx.pop();if(k)H.sty[id]=k;else delete H.sty[id];saveProgress();hsBurst(id);hsPanel()}
function hsIcon(el,id,k){const src=hsSrc(hsFN(id,k));if(src){const i=document.createElement('img');i.src=src;i.alt='';el.appendChild(i)}else{el.textContent=HSF[id].em;el.style.setProperty('--c',HSF[id].col)}}
function hsBuyBtn(b,id){const L=hsLv(id),plv=hsPlayerLv();if(L>=5){b.textContent=t('hsMax');b.disabled=true;b.className+=' max';return}
  const need=hsGate(id,L+1),price=HS_PRICE[L];
  if(plv<need){b.innerHTML='<span>🔒</span> ';b.appendChild(document.createTextNode(t('hsNeedLv',{n:need})));b.className+=' lock';b.onclick=e=>{e.stopPropagation();sfx.locked();noteToast(t('hsNeedLv',{n:need}))};return}
  b.innerHTML=`<span></span>${coinImg()}<em>${price.toLocaleString()}</em>`;b.querySelector('span').textContent=L?t('hsUp'):t('hsBuy');if((progress.coins||0)<price)b.className+=' poor';
  b.onclick=e=>{e.stopPropagation();hsBuy(id,b)}}
function hsBuy(id,btn){const H=hs(),L=hsLv(id),price=HS_PRICE[L];if(L>=5||hsPlayerLv()<hsGate(id,L+1))return;
  if((progress.coins||0)<price){sfx.locked();popupToast(t('needCoins'));return}
  if(!L&&!hsAutoPlace(id)){sfx.locked();noteToast(t('hsNoRoom'));return}
  progress.coins-=price;H.lv[id]=L+1;saveProgress();updateWalletUI();sfx.flourish&&sfx.flourish(L>=4?4:2);vib([20,30,20]);HSV.sel=id;hsBurst(id);
  noteToast(t('hsBought',{x:t('hsf_'+id),n:L+1}));hsPanel()}
function hsSkinSheet(){const H=hs(),m=document.createElement('div');m.className='hs-sheet';
  m.innerHTML=`<div class="hs-sh"><div class="hs-shh"><b></b><button class="x-btn" aria-label="close"></button></div><div class="hs-skins"></div></div>`;
  m.querySelector('b').textContent=t('hsSkins');const x=m.querySelector('.x-btn');x.innerHTML=XSVG;x.onclick=()=>{sfx.click();m.remove()};m.onclick=e=>{if(e.target===m)m.remove()};
  const box=m.querySelector('.hs-skins');HS_SKINS.forEach(K=>{const own=H.skins.includes(K.id),c=document.createElement('div');c.className='hs-skin'+(H.skin===K.id?' on':'');
    const pic=hsSrc('hs_house_'+K.id);
    c.innerHTML=`<span class="sw">${pic?`<img src="${pic}" alt="">`:`<i style="--w:${K.wall};--w2:${K.wall2};--f:${K.floor};--t:${K.trim}"></i>`}</span><b></b><button class="btn"></button>`;c.querySelector('b').textContent=t('hss_'+K.id);
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
{const _w=win;win=function(){const r=_w.apply(this,arguments);try{if((mode==='levels'||mode==='event')&&progress.house){const H=hs(),C=H.cnt;
    if(hsLv('oven')){C.oven=(C.oven||0)+1;if(C.oven>=hsVal('oven',hsLv('oven'))){C.oven=0;if(typeof nest==='function'){nest().treats+=1;hsNote(t('hsOven'))}}}
    if(hsLv('fridge')){C.fridge=(C.fridge||0)+1;if(C.fridge>=hsVal('fridge',hsLv('fridge'))){C.fridge=0;const b=['shield','slow','laser','heart'][(C.fb=(C.fb||0)+1)%4],inv=wallet().inv;inv[b]=(inv[b]||0)+1;hsNote(t('hsFridge'))}}
    saveProgress()}}catch(e){}return r}}
{const _sl=startLevel;startLevel=function(){const r=_sl.apply(this,arguments);try{const L=hsLv('bed');if(L&&mode!=='duo'&&mode!=='bonus'){const C=hs().cnt;C.bed=(C.bed||0)+1;
    if(C.bed>=hsVal('bed',L)){C.bed=0;boost.shield=true;try{renderBoosterBar()}catch(e){}setTimeout(()=>noteToast(t('hsBed')),1300)}saveProgress()}}catch(e){}return r}}
let hsWD=0;for(const fn of ['wBuy','csBuy'])if(typeof window[fn]==='function'){const _b=window[fn];window[fn]=function(){const c0=progress.coins||0;let r;hsWD++;try{r=_b.apply(this,arguments)}finally{hsWD--}const L=hsLv('wardrobe'),spent=c0-(progress.coins||0);
  if(L&&spent>0&&!hsWD){const back=Math.ceil(spent*hsVal('wardrobe',L)/100);progress.coins+=back;saveProgress();updateWalletUI();setTimeout(()=>noteToast(t('hsWard',{n:back})),700)}return r}}
if(typeof dlClaim==='function'){const _d=dlClaim;dlClaim=function(){const c0=progress.coins||0;const r=_d.apply(this,arguments);const L=hsLv('mailbox'),got=(progress.coins||0)-c0;
  if(L&&got>0){const a=Math.ceil(got*hsVal('mailbox',L)/100);progress.coins+=a;saveProgress();updateWalletUI();setTimeout(()=>noteToast(t('hsMail',{n:a})),900)}return r}}
if(typeof hatch==='function'){const _h=hatch;hatch=function(){const N=typeof nest==='function'&&nest(),h0=N&&N.hatched;const r=_h.apply(this,arguments);const L=hsLv('birdhouse');
  if(L&&N&&N.hatched>h0){N.treats+=hsVal('birdhouse',L);saveProgress();setTimeout(()=>noteToast(t('hsBird',{n:hsVal('birdhouse',L)})),2600)}return r}}
setTimeout(()=>{try{if(state==='title')updateLobby()}catch(e){}},0);
