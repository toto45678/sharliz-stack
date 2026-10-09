/* ===== v42: seasons — 300 levels =====
   S1 day (stages 0-7, levels 1-80) · S2 night (8-15, 81-160) · S3 storm (16-23, 161-240) · S4 new worlds (24-29, 241-300).
   ZONES is expanded in a build.py patch (z.sid unique stage id, z.id = art id, z.season). This module adds the names,
   the night/storm look in-game and on the map, and the season banners on the map. */
Object.assign(I18N.en,{seasonN:'Season {n}',season1:'Daytime',season2:'Night',season3:'Storm',season4:'New Worlds',
  zJungle:'Jungle',zCastle:'Haunted Castle',zClouds:'Cloud Kingdom',zDino:'Dino Land',zFactory:'Robot Factory',zCrystal:'Crystal Cave',
  bFarmN:'Night Owl',bCityN:'Alley Cat',bDesertN:'King Stinger',bCandyN:'Sugar Witch',bSnowN:'Frost Wolf',bOceanN:'Lantern Fish',bVolcanoN:'Lava Dragon',bSpaceN:'Mothership',
  bFarmS:'Thunder Goat',bCityS:'Mega Crane',bDesertS:'Sand Worm',bCandyS:'Gingerbread Giant',bSnowS:'Ice Dragon',bOceanS:'Ghost Ship',bVolcanoS:'Phoenix',bSpaceS:'Black Hole Eye',
  bJungle:'Gorilla King',bCastle:'Ghost King',bClouds:'Thunderbird',bDino:'T-Rex',bFactory:'Mega Robot',bCrystal:'Crystal Golem'});
Object.assign(I18N.he,{seasonN:'עונה {n}',season1:'יום',season2:'לילה',season3:'סערה',season4:'עולמות חדשים',
  zJungle:'הג׳ונגל',zCastle:'הטירה הרדופה',zClouds:'ממלכת העננים',zDino:'עולם הדינוזאורים',zFactory:'מפעל הרובוטים',zCrystal:'מערת הקריסטלים',
  bFarmN:'ינשוף הלילה',bCityN:'חתול הסמטאות',bDesertN:'המלך עוקץ',bCandyN:'מכשפת הסוכר',bSnowN:'זאב הכפור',bOceanN:'דג הפנס',bVolcanoN:'דרקון הלבה',bSpaceN:'ספינת האם',
  bFarmS:'תיש הרעם',bCityS:'מנוף הענק',bDesertS:'תולעת החול',bCandyS:'ענק הג׳ינג׳ר',bSnowS:'דרקון הקרח',bOceanS:'ספינת הרפאים',bVolcanoS:'עוף החול',bSpaceS:'עין החור השחור',
  bJungle:'מלך הגורילות',bCastle:'מלך הרוחות',bClouds:'ציפור הרעם',bDino:'טי-רקס',bFactory:'מגה-רובוט',bCrystal:'גולם הקריסטל'});
for(const L of LANG_SET()){const D=I18N[L],F=(L!=='en'&&L!=='he'&&window.LANGX&&LANGX.fmt)||{};for(const k of ['zFarm','zCity','zDesert','zCandy','zSnow','zOcean','zVolcano','zSpace']){
  D[k+'N']=L==='he'?D[k]+' בלילה':(F.night||'{w} by Night').replace('{w}',D[k]);D[k+'S']=L==='he'?D[k]+' בסערה':(F.storm||'Stormy {w}').replace('{w}',D[k])}}
for(const z of ZONES)if(z.sid&&z.sid!==z.id){const k='b'+z.sid[0].toUpperCase()+z.sid.slice(1);BOSS_NAMES[z.sid]=k}

/* map look per season (canvas filter on the world panel); season-4 worlds borrow S1 art until their own art ships */
const SEASON_MAPF={2:'brightness(.62) saturate(.8)',3:'brightness(.8) saturate(.55) contrast(1.08)'};
const SEASON_TINT={2:'rgba(16,20,88,.5)',3:'rgba(52,62,80,.28)'};
const S4_MAPF={jungle:'hue-rotate(-28deg) saturate(1.45)',castle:'hue-rotate(230deg) brightness(.72) saturate(.8)',clouds:'hue-rotate(170deg) brightness(1.12) saturate(.7)',
  dino:'hue-rotate(55deg) saturate(1.25)',factory:'hue-rotate(150deg) saturate(.6) brightness(.9)',crystal:'hue-rotate(110deg) saturate(1.35)'};
for(const z of ZONES)if(z.season===4)z.mapf=S4_MAPF[z.sid];
const seasonOf=lvN=>ZONES[Math.min(ZONES.length-1,Math.floor((lvN-1)/LPZ))].season||1;

/* ---------- in-game: night darkness with light holes, storm rain + lightning ---------- */
const SFX_S={lvl:-1,flies:[],drops:[],flash:0,nextBolt:0,bolt:null,nc:null};
function seasonState(){if(SFX_S.lvl!==level||SFX_S.mode!==mode){SFX_S.lvl=level;SFX_S.mode=mode;SFX_S.flies=[];SFX_S.drops=[];SFX_S.flash=0;SFX_S.bolt=null;SFX_S.nextBolt=time+4+Math.random()*4}return SFX_S}
const curSeason=()=>(zone()&&zone().season)||1;
function seasonBg(){const s=curSeason();if(zone()&&zone().ownArt)return;if(s===2){ctx.fillStyle='rgba(8,12,48,.42)';ctx.fillRect(0,0,W,H)}else if(s===3){ctx.fillStyle='rgba(28,34,52,.3)';ctx.fillRect(0,0,W,H)}}
function lightHole(g,x,y,r,k=1){const gr=g.createRadialGradient(x,y,r*.15,x,y,r);gr.addColorStop(0,`rgba(0,0,0,${k})`);gr.addColorStop(.55,`rgba(0,0,0,${.75*k})`);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
function seasonFx(){const s=curSeason();if(s!==2&&s!==3)return;const S_=seasonState(),dt=Math.min(.05,frameDt||.016);
  if(s===2){// night: the tower lantern and the swinging Sharliz light the way; fireflies glow
    if(S_.flies.length<6&&Math.random()<dt*1.2)S_.flies.push({x:Math.random()*W,y:H*(.25+Math.random()*.6),vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*20,t:0,ph:Math.random()*7});
    for(const f of S_.flies){f.t+=dt;f.vx+=(Math.random()-.5)*60*dt;f.vy+=(Math.random()-.5)*60*dt;f.vx*=.98;f.vy*=.98;f.x+=f.vx*dt;f.y+=f.vy*dt}
    S_.flies=S_.flies.filter(f=>f.t<14&&f.x>-30&&f.x<W+30&&f.y>-30&&f.y<H+30);
    let c=S_.nc;const dpr=DPR||1;if(!c||c.width!==Math.round(W*dpr)||c.height!==Math.round(H*dpr)){c=S_.nc=document.createElement('canvas');c.width=Math.round(W*dpr);c.height=Math.round(H*dpr)}
    const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.globalCompositeOperation='source-over';g.clearRect(0,0,W,H);
    const dark=Math.min(.95,.6+lvInZone()*.02+nightExtra),lb=(lightBoost>0?1.55:1)*(typeof hatK==='function'?hatK('light'):1);g.fillStyle=`rgba(4,6,26,${dark})`;g.fillRect(0,0,W,H);g.globalCompositeOperation='destination-out';
    const flick=1+Math.sin(time*7)*.03+Math.sin(time*13)*.02;
    if(tower.length){const tp=topScreen();lightHole(g,tp.x,tp.y,S*3.1*flick*lb)}
    if(swinger)lightHole(g,xOf(swinger.xs),sy(swingY()),S*2.4*flick*lb);
    if(dropping)lightHole(g,xOf(dropping.xs),sy(dropping.y),S*2.2*lb);
    {const gy=sy(0);if(gy<H+40)lightHole(g,W/2,gy,S*3.6,.8)}
    for(const f of S_.flies)lightHole(g,f.x,f.y,S*(1+.25*Math.sin(f.t*5+f.ph)),.85);
    if(hz.boss&&!hz.boss.dead)lightHole(g,hz.boss.x,hz.boss.y,S*3.4,.7);
    g.globalCompositeOperation='source-over';ctx.drawImage(c,0,0,W,H);
    for(const f of S_.flies){const a=.6+.4*Math.sin(f.t*6+f.ph);ctx.fillStyle=`rgba(255,240,140,${a})`;ctx.beginPath();ctx.arc(f.x,f.y,3.2,0,7);ctx.fill();ctx.fillStyle=`rgba(255,240,140,${a*.25})`;ctx.beginPath();ctx.arc(f.x,f.y,9,0,7);ctx.fill()}
    if(tower.length){const tp=topScreen();ctx.save();ctx.globalAlpha=.9;ctx.fillStyle='#ffd36b';ctx.beginPath();ctx.arc(tp.x+S*.95,tp.y-BH*.15,4.5,0,7);ctx.fill();ctx.restore()}
  } else {// storm: slanted rain and lightning flashes
    const want=Math.round(70+lvInZone()*4);while(S_.drops.length<want)S_.drops.push({x:Math.random()*W*1.2,y:Math.random()*H,v:700+Math.random()*400,l:10+Math.random()*14});
    const slant=(wind||0)*120+80;ctx.save();ctx.strokeStyle='rgba(200,215,240,.55)';ctx.lineWidth=1.4;ctx.beginPath();
    for(const d of S_.drops){d.y+=d.v*dt;d.x+=slant*dt;if(d.y>H){d.y=-20;d.x=Math.random()*W*1.2-W*.1}ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-slant*.03,d.y-d.l)}ctx.stroke();ctx.restore();
    if(time>S_.nextBolt&&state!=='paused'){S_.nextBolt=time+5+Math.random()*7;S_.flash=1;const x0=W*(.15+Math.random()*.7),pts=[[x0,0]];let x=x0;for(let y=0;y<H*.55;y+=H*.06){x+=(Math.random()-.5)*W*.12;pts.push([x,y])}S_.bolt={pts,t:0};
      try{if(sfxOn&&actx)noise({d:.9,v:.22,lp:420,delay:.15+Math.random()*.25})}catch(e){}}
    if(S_.bolt){S_.bolt.t+=dt;if(S_.bolt.t<.22){ctx.save();ctx.strokeStyle='#fffbe0';ctx.lineWidth=3;ctx.shadowColor='#bfe3ff';ctx.shadowBlur=18;ctx.beginPath();S_.bolt.pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore()}else S_.bolt=null}
    if(S_.flash>0){ctx.fillStyle=`rgba(235,242,255,${S_.flash*.45})`;ctx.fillRect(0,0,W,H);S_.flash=Math.max(0,S_.flash-dt*3.2)}
  }}

/* ---------- map: season banners at the seams + season-4 placeholder tint ---------- */
{const _b=buildMap2D;buildMap2D=function(a){const r=_b(a);try{seasonBanners()}catch(e){}return r}}
function seasonBanners(){const inner=document.getElementById('mapInner');if(!inner||!mapGeo)return;inner.querySelectorAll('.season-banner').forEach(e=>e.remove());
  for(let zi=1;zi<ZONES.length;zi++){const s=ZONES[zi].season||1;if(s===(ZONES[zi-1].season||1))continue;
    const y=mapGeo.h-MAP_MARGIN-zi*mapGeo.ph,b=document.createElement('div');b.className='season-banner s'+s;b.style.top=y+'px';
    b.innerHTML='<small></small><b></b>';b.querySelector('small').textContent=t('seasonN',{n:s});b.querySelector('b').textContent=t('season'+s);inner.appendChild(b)}
  requestAnimationFrame(mapDeclutter)}
// world ribbons stay whole on screen (long night/storm names were cut by the edge), and a season banner slides sideways
// so it doesn't cover the boss pin below the seam, the first pin above it or the world ribbon
function mapDeclutter(){const inner=document.getElementById('mapInner');if(!inner||!mapGeo)return;const W=inner.clientWidth;if(!W)return;
  inner.querySelectorAll('.map-ribbon:not(.home)').forEach(r=>{const w=r.offsetWidth;if(!w)return;const h=w/2+6,x=parseFloat(r.style.left);if(!isNaN(x))r.style.left=Math.max(h,Math.min(W-h,x))+'px'});
  const R=e=>{const x=parseFloat(e.style.left),y=parseFloat(e.style.top),p=e.classList.contains('boss')?20:4,w=e.offsetWidth/2+p,h=e.offsetHeight/2+p;return [x-w,y-h,x+w,y+h]};
  inner.querySelectorAll('.season-banner').forEach(bn=>{const y0=parseFloat(bn.dataset.y||bn.style.top);if(isNaN(y0))return;bn.dataset.y=y0;
   for(const narrow of [0,1]){bn.classList.toggle('narrow',!!narrow);const bw=bn.offsetWidth,bh=bn.offsetHeight,y=y0;if(!bw)return;
    const obs=[...inner.querySelectorAll('.pin,.map-ribbon')].map(R).filter(r=>!isNaN(r[0])&&r[3]>y-bh*1.6&&r[1]<y+bh*1.6);let best=null;
    for(const dy of [0,-24,24,-48,48])for(let x=bw/2+4;x<=W-bw/2-4;x+=6){const a=[x-bw/2,y+dy-bh/2,x+bw/2,y+dy+bh/2];let ov=0;
      for(const r of obs){const ix=Math.min(a[2],r[2])-Math.max(a[0],r[0]),iy=Math.min(a[3],r[3])-Math.max(a[1],r[1]);if(ix>0&&iy>0)ov+=ix*iy}
      const sc=ov*20+Math.abs(x-W/2)+Math.abs(dy)*4;if(!best||sc<best.sc)best={sc,x,dy}}
    if(best){bn.style.left=best.x+'px';bn.style.top=(y+best.dy)+'px'}if(!best||best.sc<20*40)return}})}// a long name (Season 4 'New worlds') wraps to 2 lines when it can't get out of the way
