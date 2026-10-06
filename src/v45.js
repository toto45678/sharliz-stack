/* ===== v45: 22 new bosses (seasons 2-4) — own 3D model per stage (art/b3d_<sid>.*, made with Higgsfield GPT-Image concept → Meshy 7),
   own 2D picture (art/boss_<sid>.webp), own name. bossArt() picks the stage's model when it exists, else the art world's. ===== */
Object.assign(I18N.en,{bFarmN:'Scarecrow King',bVolcanoN:'Fire Imp',bSpaceN:'Moon Rabbit',bCityS:'Rat King',bSnowS:'Penguin General',bOceanS:'Storm Shark',bClouds:'Angry Unicorn',bDino:'Triceratops'});
Object.assign(I18N.he,{bFarmN:'מלך הדחלילים',bVolcanoN:'שד האש',bSpaceN:'ארנב הירח',bCityS:'מלך העכברושים',bSnowS:'גנרל הפינגווינים',bOceanS:'כריש הסערה',bClouds:'חד-הקרן הזועם',bDino:'טריצרטופס'});
const bossArt=zz=>{zz=zz||zone();return zz&&B3D_META[zz.sid]?zz.sid:zz.id};
// rig per new boss (regions of the normalised mesh: height 1, feet at y=0) + signature attack style (b3Draw: jump/spin/lunge/shake/flap)
Object.assign(B3D_RIG,{
  farmN:{head:{y0:.66,py:.62,amp:.07},yaw:-.32,bob:.015,atk:'shake'},
  cityN:{head:{y0:.62,py:.6,amp:.06},yaw:-.32,bob:.015,atk:'lunge'},
  desertN:{head:{y0:.5,py:.45,amp:.04},tail:{z0:.1,amp:.06,f:2.6},yaw:-.32,bob:.012,atk:'lunge'},
  candyN:{head:{y0:.62,py:.6,amp:.05},yaw:-.32,hover:.02,atk:'spin'},
  snowN:{head:{y0:.66,py:.62,amp:.06},yaw:-.32,bob:.015,atk:'lunge'},
  oceanN:{head:{y0:.55,py:.5,amp:.04},jig:{amp:.018,y0:.05},yaw:-.32,hover:.03,atk:'jump'},
  volcanoN:{head:{y0:.6,py:.56,amp:.06},yaw:-.32,hover:.025,atk:'jump'},
  spaceN:{head:{y0:.62,py:.6,amp:.05},yaw:-.32,hover:.03,atk:'spin'},
  farmS:{head:{y0:.64,py:.6,amp:.07},yaw:-.32,bob:.015,atk:'lunge'},
  cityS:{head:{y0:.6,py:.56,amp:.06},yaw:-.32,bob:.015,atk:'shake'},
  desertS:{sway:{y1:.7,amp:.08,f:2.2},yaw:-.32,bob:.01,atk:'lunge'},
  candyS:{head:{y0:.66,py:.62,amp:.05},yaw:-.32,bob:.02,atk:'jump'},
  snowS:{head:{y0:.62,py:.58,amp:.05},yaw:-.32,bob:.015,atk:'jump'},
  oceanS:{head:{y0:.64,py:.6,amp:.05},yaw:-.32,bob:.015,atk:'lunge'},
  volcanoS:{head:{y0:.64,py:.6,amp:.06},yaw:-.32,hover:.03,atk:'flap'},
  spaceS:{tent:{y1:.3,amp:.035,n:6},yaw:-.2,hover:.035,atk:'spin'},
  jungle:{head:{y0:.64,py:.6,amp:.06},yaw:-.32,bob:.02,atk:'jump'},
  castle:{head:{y0:.6,py:.56,amp:.05},yaw:-.32,hover:.035,atk:'spin'},
  clouds:{head:{y0:.62,py:.58,amp:.06},yaw:-.32,hover:.025,atk:'jump'},
  dino:{head:{y0:.6,py:.56,amp:.06},yaw:-.32,bob:.015,atk:'lunge'},
  factory:{head:{y0:.72,py:.68,amp:.04},yaw:-.32,bob:.01,atk:'shake'},
  crystal:{head:{y0:.66,py:.62,amp:.04},yaw:-.32,bob:.012,atk:'shake'}});
// preload the stage's own boss with its world
{const _pw=preloadWorld;preloadWorld=function(zid){_pw(zid);try{const z=zone();if(z&&z.id===zid&&z.sid!==zid&&B3D_META[z.sid]){hzPic('boss_'+z.sid);hzPic('boss_'+z.sid+'_hurt');b3Load(z.sid)}}catch(e){}}}
// sticker book: all 30 bosses (the 8 classic ones + the stages that have their own boss picture)
const bossAll=()=>BOSS_HATS.concat(ZONES.filter(z=>z.sid!==z.id).map(z=>z.sid));
