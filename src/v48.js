/* ===== v48: the style screen becomes a "character sheet" (chosen by Tzach: concept C) + ~64 new items =====
   - Hero in the middle, equipment slots around it (hat, glasses, outfit, buddy, effects, look), live power bars that
     compare the item you're trying on with what you wear now (green / red), item drawer at the bottom.
   - Powers now come from hats AND outfits AND glasses (GEAR_FX) — hatK() combines them; buddies' perks show in the bars.
   - Trails / landing effects / colour filters (old shop "Style" tab) live here too, as the "Effects" slot.
   - New items: cheap skins (colours, patterns, eyes, lashes, glasses, outfits, hats, trails, landings) and pricier
     "upgrades" with powers (glasses, outfits, hats). */

/* ---------------- i18n ---------------- */
Object.assign(I18N.en,{csTitle:'My hero',csTry:'Tap an item to try it on',csWorn:'Wearing',csPowers:'My powers',csPreview:'Trying on',
  csAll:'All',csPow:'Upgrades',csSkin:'Skins',csDeals:'Deals',csLooks:'Looks',csNone:'None',
  sl_hat:'Hat',sl_glasses:'Glasses',sl_outfit:'Outfit',sl_pet:'Buddy',sl_fx:'Effects',sl_look:'Look',
  ct_trail:'Trail',ct_land:'Landing',ct_cfilt:'Tint',
  st_tol:'Landing zone',st_coins:'Coins',st_hearts:'Hearts',st_spd:'Swing',st_boss:'Boss hits',st_feverT:'Frenzy',
  ng_fall:'Falls faster',ng_wind:'Wind pushes more',ng_pts:'Fewer points',ng_perfPts:'Fewer points for PERFECT',ng_clear:'Less coins for clearing',ng_feverN:'Frenzy needs 7 PERFECTs',
  ps_astro:'Start 5 floors up',ps_ghost:'Ghost buddy',ps_combo:'Combo helper',ps_bee:'Bee buddy',
  sk_t_sparkle:'Sparkles',sk_t_notes:'Music notes',sk_t_leaves:'Leaves',sk_t_rainbow:'Rainbow',
  sk_l_confetti:'Confetti',sk_l_stars:'Star burst',sk_l_bubbles:'Bubbles',sk_l_hearts:'Hearts'});
Object.assign(I18N.he,{csTitle:'הגיבור שלי',csTry:'הקישו על פריט כדי למדוד',csWorn:'לבוש עכשיו',csPowers:'הכוחות שלי',csPreview:'מודדים',
  csAll:'הכול',csPow:'משדרגים',csSkin:'סקינים',csDeals:'מבצעים',csLooks:'לוקים',csNone:'בלי',
  sl_hat:'כובע',sl_glasses:'משקפיים',sl_outfit:'בגדים',sl_pet:'חבר',sl_fx:'אפקטים',sl_look:'מראה',
  ct_trail:'שובל',ct_land:'נחיתה',ct_cfilt:'גוון',
  st_tol:'אזור נחיתה',st_coins:'מטבעות',st_hearts:'לבבות',st_spd:'נדנוד',st_boss:'מכה לבוס',st_feverT:'טירוף',
  ng_fall:'נופל מהר יותר',ng_wind:'הרוח מזיזה יותר',ng_pts:'פחות נקודות',ng_perfPts:'פחות נקודות על "מושלם"',ng_clear:'פחות מטבעות על סיום',ng_feverN:'טירוף רק אחרי 7 "מושלם"',
  ps_astro:'מתחילים מקומה 5',ps_ghost:'חבר רוח',ps_combo:'עוזר קומבו',ps_bee:'חבר דבורה',
  sk_t_sparkle:'נצנצים',sk_t_notes:'תווים',sk_t_leaves:'עלים',sk_t_rainbow:'קשת',
  sk_l_confetti:'קונפטי',sk_l_stars:'פיצוץ כוכבים',sk_l_bubbles:'בועות',sk_l_hearts:'לבבות'});

/* ---------------- new catalogue ---------------- */
Object.assign(WCOL,{peach:{c:'#ffb38a',p:60,n:['Peach','אפרסק']},coral:{c:'#ff6f61',p:60,n:['Coral','אלמוג']},bubble:{c:'#ff9ecf',p:60,n:['Bubble','בועה']},
  ocean:{c:'#1e88e5',p:70,n:['Ocean','אוקיינוס']},navy:{c:'#2a3a8f',p:70,n:['Navy','כחול כהה']},forest:{c:'#2e9e4f',p:70,n:['Forest','יער']},
  olive:{c:'#9aa23a',p:60,n:['Olive','זית']},caramel:{c:'#c98a4b',p:70,n:['Caramel','קרמל']},choco:{c:'#6b3e26',p:80,n:['Chocolate','שוקולד']},
  lavender:{c:'#b9a3ff',p:70,n:['Lavender','לבנדר']},aqua:{c:'#3ee6d8',p:70,n:['Aqua','טורקיז']},ruby:{c:'#b0124a',p:90,n:['Ruby','אודם']},
  sunny:{c:'#ffb703',p:80,n:['Sunshine','שמש']},slate:{c:'#64748b',p:60,n:['Slate','אפור צפחה']},flamingo:{c:'#ff5fa2',p:80,n:['Flamingo','פלמינגו']}});
Object.assign(WPAT,{bigdots:{p:90,n:['Big dots','נקודות ענק']},swirl:{p:120,n:['Swirls','סלסולים']},plaid:{p:120,n:['Plaid','משבצות סקוטיות']},
  scales:{p:140,n:['Fish scales','קשקשים']},pixel:{p:100,n:['Pixels','פיקסלים']},clouds:{p:120,n:['Clouds','עננים']},
  sprinkles:{p:140,n:['Sprinkles','סוכריות']},cow:{p:120,n:['Cow','פרה']},waves:{p:110,n:['Waves','גלים']}});
Object.assign(WEYE,{peach:{c:'#ffe1cc',p:60,n:['Peach','אפרסק']},aqua:{c:'#c9fff7',p:60,n:['Aqua','טורקיז']},silver:{c:'#eef1f8',p:150,metal:.7,n:['Silver','כסף']},
  fire:{c:'#ffd7b0',p:220,glow:'#ff7a1a',n:['Fire glow','זוהר אש']},toxic:{c:'#e8ffd6',p:220,glow:'#6dff3a',n:['Toxic glow','זוהר רעיל']},ice:{c:'#e6f6ff',p:200,glow:'#7fd4ff',n:['Ice glow','זוהר קרח']}});
Object.assign(WLASH,{blue:{p:120,n:['Blue','כחולים']},gold:{p:220,n:['Gold glam','זהב']}});
Object.assign(WGLS,{aviator:{p:180,n:['Aviators','טייסים']},pinkround:{p:120,n:['Pink round','ורודים עגולים']},visor:{p:220,n:['Cyber visor','מגן סייבר']},threed:{p:150,n:['3D glasses','משקפי תלת־ממד']},
  night:{p:1100,n:['Night vision','ראיית לילה']},scope:{p:1300,n:['Sniper scope','כוונת']},lucky:{p:1500,n:['Lucky stars','כוכבי מזל']}});
Object.assign(WOUT,{necklace:{p:120,n:['Pearls','שרשרת פנינים']},medal:{p:160,n:['Gold medal','מדליה']},sash:{p:150,n:['Sash','סרט כתף']},lei:{p:180,n:['Flower lei','זר פרחים']},
  armor:{p:1800,n:['Knight armor','שריון אביר']},wings:{p:1600,n:['Fairy wings','כנפי פיה']},magnet:{p:1400,n:['Coin magnet','מגנט מטבעות']},ninja:{p:1500,n:['Ninja suit','חליפת נינג׳ה']}});
Object.assign(WHATX,{bow:{p:90,w:1,n:['Big bow','סרט ענק']},cap:{p:100,w:1,n:['Cap','כובע מצחייה']},paper:{p:80,w:1,n:['Paper crown','כתר נייר']},
  antenna:{p:120,w:1,n:['Boppers','אנטנות']},headphones:{p:160,w:1,n:['Headphones','אוזניות']},flowerpin:{p:90,w:1,n:['Flower pin','סיכת פרח']},
  hardhat:{p:1600,w:1,n:['Hard hat','קסדת בנייה']},royal:{p:2500,w:1,n:['Royal crown','כתר מלכותי']},cloudhat:{p:1400,w:1,n:['Cloud hat','כובע ענן']}});
STYLE_SKINS.push({id:'t_sparkle',cat:'t',price:120,w:1},{id:'t_notes',cat:'t',price:150,w:1},{id:'t_leaves',cat:'t',price:120,w:1},{id:'t_rainbow',cat:'t',price:200,w:1},
  {id:'l_confetti',cat:'l',price:150,w:1},{id:'l_stars',cat:'l',price:120,w:1},{id:'l_bubbles',cat:'l',price:120,w:1},{id:'l_hearts',cat:'l',price:150,w:1});

/* ---------------- powers from every slot ---------------- */
const GEAR_FX={outfit:{armor:{hearts:1},wings:{fall:.75},magnet:{coins:1.2},ninja:{tol:1.12,wind:.7}},
  glasses:{night:{light:1.5,wind:.85},scope:{aim:1,tol:1.05},lucky:{coins:1.12,perfPts:1.15}}};
Object.assign(HAT_FX,{hardhat:{hearts:1},royal:{coins:1.3},cloudhat:{fall:.7}});
const PET_FX={coins10:{coins:1.1},coins25:{coins:1.25},heart:{hearts:1},aim:{aim:1},sticky:{tol:1.12},fever:{feverT:1.5}};
const FX_ADD=new Set(['hearts','perfCoins','aim','noSlip']);
const gearOn=(c,id)=>id&&id!=='none'&&GEAR_FX[c]&&GEAR_FX[c][id]&&wOwned(c,id);
{const _hk=hatK;hatK=function(k,d=1){let v=_hk(k,d);if(mode==='duo')return v;
  for(const c of ['outfit','glasses']){const id=lookNow()[c];if(!gearOn(c,id))continue;const F=GEAR_FX[c][id];if(F[k]===undefined)continue;
    if(FX_ADD.has(k))v=(v===d?0:v)+F[k];else if(k.startsWith('imm_'))v=v||F[k];else v=v*F[k]}
  return v}}
// coins: the hat part is done in v39 — add outfit/glasses coins here
{const _tr=tallyRows;tallyRows=function(won){const rows=_tr(won);if(mode==='duo')return rows;let mul=1,pc=0;
  for(const c of ['outfit','glasses']){const id=lookNow()[c];if(!gearOn(c,id))continue;const F=GEAR_FX[c][id];if(F.coins)mul*=F.coins;if(F.perfCoins)pc+=F.perfCoins}
  if(mul===1&&!pc)return rows;const out=rows.map(r=>r.slice());
  if(pc&&lv.perfect){const s=out.find(r=>r[3]==='star');const add=Math.ceil(lv.perfect*pc*(won?1:.5));if(s)s[2]+=add;else out.push([t('cSkill'),'★×'+lv.perfect,add,'star'])}
  if(mul!==1)out.forEach(r=>r[2]=Math.max(0,Math.round(r[2]*mul)));return out}}

/* combined powers of a look (for the bars) */
function fxCombine(look,hat){const parts=[];if(hat&&HAT_FX[hat])parts.push(HAT_FX[hat]);
  for(const c of ['outfit','glasses']){const F=GEAR_FX[c]&&GEAR_FX[c][look[c]];if(F)parts.push(F)}
  const pk=typeof PERKS!=='undefined'&&PET_FX[PERKS[look.pet]];if(pk)parts.push(pk);
  const R={};for(const F of parts)for(const k in F){if(FX_ADD.has(k)||k.startsWith('imm_')||k==='imm')R[k]=k==='imm'?F[k]:(R[k]||0)+F[k];else if(k==='feverN')R[k]=F[k];else R[k]=(R[k]===undefined?1:R[k])*F[k]}
  if(look.outfit==='astro')R.astro=1;const pp=typeof PERKS!=='undefined'&&PERKS[look.pet];if(pp==='ghost'||pp==='combo'||pp==='bee')R['pet_'+pp]=1;return R}
function itemFX(c,id){if(c==='hat')return HAT_FX[id]||null;if(c==='outfit'&&id==='astro')return {astro:1};if(c==='pet')return typeof PERKS!=='undefined'&&PERKS[id]?{perk:1}:null;return GEAR_FX[c]&&GEAR_FX[c][id]||null}

/* ---------------- new 3D builds ---------------- */
{const _pt=patternTex;patternTex=function(id,base){if(!WPAT[id]||!['bigdots','swirl','plaid','scales','pixel','clouds','sprinkles','cow','waves'].includes(id))return _pt(id,base);
  return canvasTex('p_'+id+base,1024,512,(g,W,H)=>{g.fillStyle=base;g.fillRect(0,0,W,H);const R=mulberry(id.length*131+7),ink='#120d2b';
    if(id==='bigdots'){g.fillStyle='rgba(255,255,255,.9)';for(let y=0;y<3;y++)for(let x=0;x<7;x++){g.beginPath();g.arc((x+(y%2)*.5)*W/7,(y+.5)*H/3,52,0,7);g.fill()}}
    else if(id==='swirl'){g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=12;for(let i=0;i<14;i++){const cx=R()*W,cy=R()*H;g.beginPath();for(let a=0;a<12;a+=.2){const r=4+a*5;g.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}g.stroke()}}
    else if(id==='plaid'){for(let i=0;i<10;i++){g.fillStyle='rgba(18,13,43,.22)';g.fillRect(i*W/10,0,W/22,H);g.fillRect(0,i*H/5,W,H/14)}g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=4;for(let i=0;i<20;i++){g.beginPath();g.moveTo(i*W/20+W/40,0);g.lineTo(i*W/20+W/40,H);g.stroke()}}
    else if(id==='scales'){g.strokeStyle=shade(base,-.35);g.lineWidth=6;g.fillStyle=shade(base,.18);for(let y=0;y<9;y++)for(let x=0;x<18;x++){const cx=(x+(y%2)*.5)*W/18,cy=y*H/8;g.beginPath();g.arc(cx,cy,W/36,0,Math.PI);g.fill();g.stroke()}}
    else if(id==='pixel'){g.fillStyle=shade(base,.28);const n=32,m=16;for(let y=0;y<m;y++)for(let x=0;x<n;x++)if((x*7+y*3+((x*y)%5))%3===0)g.fillRect(x*W/n,y*H/m,W/n,H/m)}
    else if(id==='clouds'){g.fillStyle='rgba(255,255,255,.92)';for(let i=0;i<16;i++){const x=R()*W,y=R()*H;for(const [dx,dy,r] of [[-30,0,26],[0,-12,34],[32,0,28],[0,10,26]]){g.beginPath();g.arc(x+dx,y+dy,r,0,7);g.fill()}}}
    else if(id==='sprinkles'){for(let i=0;i<180;i++){g.save();g.translate(R()*W,R()*H);g.rotate(R()*7);g.fillStyle=['#ff3ea5','#ffd60a','#22d3ee','#a3e635','#ffffff','#8a4dff'][i%6];g.fillRect(-14,-4,28,8);g.restore()}}
    else if(id==='cow'){g.fillStyle='#ffffff';g.fillRect(0,0,W,H);g.fillStyle=base;for(let i=0;i<14;i++){g.beginPath();const x=R()*W,y=R()*H;for(let k=0;k<9;k++){const a=k/9*Math.PI*2,r=40+R()*45;g.lineTo(x+Math.cos(a)*r*1.3,y+Math.sin(a)*r)}g.closePath();g.fill()}}
    else if(id==='waves'){g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=14;for(let y=0;y<8;y++){g.beginPath();for(let x=0;x<=W;x+=16)g.lineTo(x,(y+.5)*H/8+Math.sin(x*.025+y)*16);g.stroke()}}})}}
{const _bl=buildLashes;buildLashes=function(P,style){const map={blue:['long','#2f6bff'],gold:['curly','#ffc21a']},m=map[style];_bl(P,m?m[0]:style);if(!m)return;
  for(const lid of P.lids){const g=lid.userData.lash;if(g)g.traverse(o=>{if(o.material){o.material=o.material.clone();o.material.color.set(m[1]);o.material.emissive&&o.material.emissive.set(m[1]);o.material.emissiveIntensity=.25}})}}}
{const _bg=buildGlasses;buildGlasses=function(P,kind){const T=P.T,slot=P.glassSlot;
  const recolor=(base,frame,lens,op,glow,metal)=>{_bg(P,base);slot.traverse(o=>{if(!o.material)return;o.material=o.material.clone();const m=o.material;
      if(m.transparent){if(lens)m.color.set(lens);if(op!=null)m.opacity=op;if(glow){m.emissive&&m.emissive.set(glow);m.emissiveIntensity=.8}}else if(frame){m.color.set(frame);if(metal){m.metalness=metal;m.roughness=.2}}})};
  if(kind==='aviator')return recolor('sun','#d4a017','#3a2a10',.75,null,.75);
  if(kind==='pinkround')return recolor('round','#ff6fb5');
  if(kind==='lucky')return recolor('star','#ffc21a','#ffe066',.5,'#ffb000',.7);
  if(kind==='night')return recolor('goggles','#2b3a2b','#3dff6a',.55,'#24ff55');
  if(kind==='scope')return recolor('monocle','#c0c8d8','#ff3b3b',.45,'#ff2020',.8);
  if(kind==='threed'){_bg(P,'nerd');slot.traverse(o=>{if(o.material){o.material=o.material.clone();o.material.color.set('#ffffff')}});
    P.eyes.forEach((e,i)=>{const ln=new T.Mesh(new T.CircleGeometry(1,32),new T.MeshPhysicalMaterial({color:i?'#22d3ee':'#ff3b5c',transparent:true,opacity:.55,depthWrite:false}));ln.position.copy(e.position);ln.rotation.y=e.rotation.y;
      const g=new T.Group();g.position.copy(e.position);g.rotation.y=e.rotation.y;ln.position.set(0,0,B_ERZ+.03);ln.scale.set(B_ERX*1.1,B_ERY,1);g.add(ln);slot.add(g)});return}
  if(kind==='visor'){const R=Math.hypot(B_EX,surfZ(B_EX,B_EY)+B_ERZ)+.05,h=B_ERY*2.5,geo=new T.CylinderGeometry(R,R,h,48,1,true,-1.15,2.3);const v=new T.Mesh(geo,new T.MeshPhysicalMaterial({color:'#22d3ee',transparent:true,opacity:.5,emissive:'#00b7ff',emissiveIntensity:.45,side:T.DoubleSide,depthWrite:false,clearcoat:1}));
    v.position.y=B_EY;slot.add(v);for(const dy of[-1,1]){const band=new T.Mesh(new T.TorusGeometry(R,.022,8,64,2.3),wm('#c0c8d8',{metalness:.7}));band.rotation.x=Math.PI/2;band.rotation.z=Math.PI/2-1.15;band.position.y=B_EY+dy*h/2;slot.add(band)}return}
  return _bg(P,kind)}}
{const _bo=buildOutfit;buildOutfit=function(P,kind,base){const T=P.T,s=P.outfitSlot;
  const neckY=-.06,nr=bodyR(neckY/.75);
  if(kind==='necklace'){for(let i=0;i<22;i++){const a=Math.PI*.15+i/21*Math.PI*.7,b=winked(s,new T.SphereGeometry(.03,12,10),'#fff8f0',{roughness:.15,clearcoat:1},1.12);b.position.set(Math.cos(a)*(nr+.02)*-1,neckY-Math.sin(a)*.12,Math.sin(a)*(nr+.02))}return}
  if(kind==='medal'){for(const sx of[-1,1]){const r=new T.Mesh(new T.CapsuleGeometry(.025,.22,4,8),wm(sx<0?'#e8283f':'#2f6bff'));r.position.set(sx*.07,-.14,surfZ(sx*.07,-.14)+.02);r.rotation.z=sx*.4;s.add(r)}
    const m=winked(s,new T.CylinderGeometry(.075,.075,.025,32),'#ffc93c',{metalness:.7,roughness:.2},1.1);m.rotation.x=Math.PI/2;m.position.set(0,-.28,surfZ(0,-.28)+.03);return}
  if(kind==='sash'){const t=new T.Mesh(new T.TorusGeometry(bodyR(-.25/.75)+.03,.045,10,64),wm('#e8283f',{roughness:.5}));t.rotation.set(Math.PI/2,0,.55);t.position.y=-.25;s.add(t);
    const st=winked(s,new T.OctahedronGeometry(.05,0),'#ffd23f',{metalness:.6},1.1);st.position.set(-.12,-.2,surfZ(-.12,-.2)+.05);return}
  if(kind==='lei'){for(let i=0;i<14;i++){const a=i/14*Math.PI*2,f=new T.Group();f.position.set(Math.sin(a)*(nr+.03),neckY,Math.cos(a)*(nr+.03));s.add(f);const c=['#ff3ea5','#ffd23f','#ff8a00','#ffffff'][i%4];
      for(let k=0;k<5;k++){const b=k/5*Math.PI*2,p=wmesh(new T.SphereGeometry(.04,10,8),c);p.scale.y=.55;p.position.set(Math.cos(b)*.04,0,Math.sin(b)*.04);f.add(p)}f.add(wmesh(new T.SphereGeometry(.025,8,6),'#ffd23f'))}return}
  if(kind==='armor'){const pts=[];for(let i=0;i<=20;i++){const y=-.5+i/20*.46;pts.push(new T.Vector2(bodyR(y/.75)+.03,y))}const geo=new T.LatheGeometry(pts,64,-1.2,2.4);
    winked(s,geo,wm('#c9d1de',{metalness:.85,roughness:.22,side:T.DoubleSide}),null,1.02);
    for(const sx of[-1,1]){const p=winked(s,new T.SphereGeometry(.13,20,14,0,Math.PI*2,0,Math.PI/2),'#aeb8c8',{metalness:.85,roughness:.25},1.06);p.position.set(sx*.44,-.12,0);p.rotation.z=-sx*.5}
    const cr=winked(s,new T.BoxGeometry(.05,.2,.03),'#e8283f',{},1.1);cr.position.set(0,-.27,surfZ(0,-.27)+.05);const cr2=winked(s,new T.BoxGeometry(.15,.05,.03),'#e8283f',{},1.1);cr2.position.set(0,-.24,surfZ(0,-.24)+.05);return}
  if(kind==='wings'){for(const sx of[-1,1])for(const [y,sc] of [[-.12,1],[-.36,.7]]){const w=new T.Mesh(new T.SphereGeometry(.32,24,16),new T.MeshPhysicalMaterial({color:'#bfefff',transparent:true,opacity:.55,roughness:.1,clearcoat:1,emissive:'#7fd4ff',emissiveIntensity:.25,depthWrite:false}));
      w.scale.set(.75*sc,.42*sc,.06);w.position.set(sx*.32*sc,y,-(surfZ(0,y)+.05));w.rotation.z=sx*(y<-.2?-.5:.45);s.add(w)}return}
  if(kind==='magnet'){const y=-.34,r=bodyR(y/.75);const b=new T.Mesh(new T.TorusGeometry(r+.01,.045,12,72),wm('#3a3a4a',{roughness:.5}));b.rotation.x=Math.PI/2;b.position.y=y;s.add(b);
    const g=new T.Group();g.position.set(0,y-.02,surfZ(0,y)+.06);s.add(g);const u=winked(g,new T.TorusGeometry(.085,.035,12,32,Math.PI),'#e8283f',{roughness:.3},1.1);u.rotation.z=Math.PI;
    for(const sx of[-1,1]){const tip=winked(g,new T.CylinderGeometry(.035,.035,.05,16),'#e5e7eb',{metalness:.8},1.1);tip.position.set(sx*.085,.02,0)}return}
  if(kind==='ninja'){const pts=[];for(let i=0;i<=24;i++){const y=-.72+i/24*.7;pts.push(new T.Vector2(bodyR(y/.75)+.02,y))}winked(s,new T.LatheGeometry(pts,64),wm('#1d1a2b',{roughness:.6}),null,1.015);
    const y=-.34,b=new T.Mesh(new T.TorusGeometry(bodyR(y/.75)+.03,.04,10,64),wm('#e8283f'));b.rotation.x=Math.PI/2;b.position.y=y;s.add(b);
    for(const sx of[-1,1]){const tl=new T.Mesh(new T.CapsuleGeometry(.03,.2,4,8),wm('#e8283f'));tl.position.set(sx*.08,y-.12,-(surfZ(0,y)+.03));tl.rotation.z=sx*.4;s.add(tl)}return}
  return _bo(P,kind,base)}}
{const _bh=buildHat;buildHat=function(P,id){if(!['bow','cap','paper','antenna','headphones','flowerpin','hardhat','royal','cloudhat'].includes(id))return _bh(P,id);
  const T=P.T,s=P.hatSlot,sph=(r,c,o)=>wmesh(new T.SphereGeometry(r,24,16),c,o),cyl=(rt,rb,h,c,o,seg=40)=>wmesh(new T.CylinderGeometry(rt,rb,h,seg),c,o),cone=(r,h,c,o)=>wmesh(new T.ConeGeometry(r,h,32),c,o);
  const add=(m,x=0,y=0,z=0,ink=1.06)=>{m.position.set(x,y,z);s.add(m);if(ink){const k=new T.Mesh(m.geometry,INKM());k.scale.setScalar(ink);m.add(k)}return m},gold={metalness:.65,roughness:.2};
  switch(id){
  case 'bow':{for(const sx of[-1,1]){const l=add(sph(.13,'#ff3ea5'),sx*.14,.08,.02);l.scale.set(1.2,.8,.45)}add(sph(.06,'#ff7ac1'),0,.08,.04);break}
  case 'cap':{add(wmesh(new T.SphereGeometry(.31,32,16,0,Math.PI*2,0,Math.PI/2),'#2f6bff',{roughness:.5}),0,-.05);const v=add(wmesh(new T.CylinderGeometry(.26,.26,.025,32,1,false,-.9,1.8),'#2f6bff',{roughness:.5}),0,-.03,.12,1.04);v.scale.z=1.4;add(sph(.04,'#ffd23f'),0,.26,0,0);break}
  case 'paper':{const n=6;for(let i=0;i<n;i++){const a=i/n*Math.PI*2,p=wmesh(new T.ConeGeometry(.12,.24,4),'#ffd23f',{roughness:.7});p.position.set(Math.sin(a)*.24,.12,Math.cos(a)*.24);p.rotation.y=a;p.scale.z=.12;s.add(p)}add(cyl(.26,.27,.08,'#ffd23f',{roughness:.7}),0,.0);break}
  case 'antenna':{add(wmesh(new T.TorusGeometry(.28,.02,8,40,Math.PI),'#120d2b'),0,-.02,0,0);for(const sx of[-1,1]){const st=wmesh(new T.CylinderGeometry(.012,.012,.3,6),'#120d2b');st.position.set(sx*.14,.2,0);st.rotation.z=-sx*.35;s.add(st);add(sph(.06,sx<0?'#ff3ea5':'#a3e635',{emissive:sx<0?'#ff3ea5':'#a3e635',emissiveIntensity:.3}),sx*.2,.35,0)}break}
  case 'headphones':{add(wmesh(new T.TorusGeometry(.42,.035,10,40,Math.PI),'#1d1530'),0,-.2,0,0);for(const sx of[-1,1]){const c=add(cyl(.13,.13,.09,'#ff3ea5'),sx*.45,-.26,0);c.rotation.z=Math.PI/2}break}
  case 'flowerpin':{const g=new T.Group();g.position.set(.2,.06,.14);s.add(g);for(let k=0;k<6;k++){const b=k/6*Math.PI*2,p=wmesh(new T.SphereGeometry(.06,12,10),'#ff8fc0');p.scale.y=.5;p.position.set(Math.cos(b)*.07,Math.sin(b)*.07,0);p.rotation.x=Math.PI/2;g.add(p)}g.add(wmesh(new T.SphereGeometry(.04,10,8),'#ffd23f'));break}
  case 'hardhat':{add(wmesh(new T.SphereGeometry(.31,32,16,0,Math.PI*2,0,Math.PI/2),'#ffc21a',{roughness:.3,clearcoat:.8}),0,-.04);add(cyl(.38,.38,.03,'#ffc21a',{roughness:.3}),0,-.03,0,1.03);add(wmesh(new T.BoxGeometry(.05,.05,.5),'#f59e0b'),0,.25,0,0);break}
  case 'royal':{add(cyl(.27,.28,.12,'#ffc93c',gold),0,.06);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;add(cone(.05,.18,'#ffc93c',gold),Math.sin(a)*.27,.2,Math.cos(a)*.27);add(sph(.035,['#e8283f','#2f6bff','#22c55e'][i%3],{emissive:['#e8283f','#2f6bff','#22c55e'][i%3],emissiveIntensity:.4}),Math.sin(a)*.28,.06,Math.cos(a)*.28,0)}
    add(sph(.2,'#b0124a',{roughness:.6}),0,.12,0,0).scale.y=.6;add(sph(.05,'#ffc93c',gold),0,.3,0);break}
  case 'cloudhat':{for(const [x,y,z,r] of [[-.16,.06,0,.17],[.16,.06,0,.17],[0,.14,0,.21],[0,.05,.14,.15],[0,.05,-.14,.15]])add(sph(r,'#ffffff',{roughness:.85,clearcoat:0}),x,y,z,1.04);break}
  }}}

/* ---------------- trails & landing effects ---------------- */
{const _tm=trailMark;trailMark=function(k,x,y,a){const sk=progress.tskin;if(!['t_sparkle','t_notes','t_leaves','t_rainbow'].includes(sk))return _tm(k,x,y,a);
  ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);
  if(sk==='t_sparkle'){ctx.fillStyle=['#ffffff','#fff4b0','#bfefff'][k%3];const r=S*.22;ctx.beginPath();for(let i=0;i<8;i++){const q=i*Math.PI/4,rr=i%2?r*.25:r;ctx.lineTo(Math.cos(q)*rr,Math.sin(q)*rr)}ctx.fill()}
  else if(sk==='t_notes'){ctx.fillStyle=['#8a4dff','#ff3ea5','#22d3ee'][k%3];ctx.beginPath();ctx.ellipse(0,S*.1,S*.11,S*.08,-.4,0,7);ctx.fill();ctx.fillRect(S*.08,-S*.22,S*.035,S*.32)}
  else if(sk==='t_leaves'){ctx.rotate(k*1.3);ctx.fillStyle=['#22c55e','#84cc16','#f59e0b'][k%3];ctx.beginPath();ctx.ellipse(0,0,S*.16,S*.07,0,0,7);ctx.fill()}
  else if(sk==='t_rainbow'){ctx.lineWidth=S*.06;['#ff3b5c','#ffd23f','#22c55e','#3aa8ff'].forEach((c,i)=>{ctx.strokeStyle=c;ctx.beginPath();ctx.arc(0,S*.1,S*(.32-i*.07),Math.PI,0);ctx.stroke()})}
  ctx.restore();return true}}
{const _lf=landFx;landFx=function(x,wy,big){const sk=progress.lskin,n=big?14:7;
  if(sk==='l_confetti'){for(let i=0;i<n*2;i++)particles.push({x:x+rnd(-S*.6,S*.6),y:wy-BH*.2,vx:rnd(-200,200),vy:rnd(-420,-160),life:1.2,c:pick(['#ff3ea5','#ffd60a','#22d3ee','#a3e635','#8a4dff']),sz:rnd(4,7),conf:true,rot:rnd(0,6),vr:rnd(-8,8)});return true}
  if(sk==='l_stars'){for(let i=0;i<n;i++){const a=i/n*Math.PI*2;particles.push({x,y:wy-BH*.2,vx:Math.cos(a)*260,vy:Math.sin(a)*260-60,life:.7,c:pick(['#ffd60a','#ffffff','#fff4b0']),sz:rnd(4,7)})}return true}
  if(sk==='l_bubbles'){for(let i=0;i<n;i++)particles.push({x:x+rnd(-S*.7,S*.7),y:wy,vx:rnd(-60,60),vy:rnd(-380,-200),life:.9,c:pick(['#bfefff','#e0f7ff','#ffffff']),sz:rnd(4,9)});return true}
  if(sk==='l_hearts'){for(let i=0;i<n;i++)particles.push({x:x+rnd(-S*.6,S*.6),y:wy,vx:rnd(-150,150),vy:rnd(-320,-120),life:1,c:pick(['#ff3ea5','#ff6b98','#ffd1ea']),sz:rnd(5,8),flower:true});return true}
  return _lf(x,wy,big)}}

/* ---------------- the character-sheet screen ---------------- */
const CS_SLOTS=[{k:'hat',x:14,y:16,cats:['hat']},{k:'glasses',x:86,y:16,cats:['glasses']},{k:'outfit',x:14,y:50,cats:['outfit']},
  {k:'pet',x:86,y:50,cats:['pet']},{k:'look',x:14,y:84,cats:['color','pattern','eyes','lashes']},{k:'fx',x:86,y:84,cats:['trail','land','cfilt']}];
const STYLE_CAT={trail:'t',land:'l',cfilt:'c'};
const CS={slot:'look',filter:'all',thumbQ:[],qRun:false};
function csSlotOf(cat){return (CS_SLOTS.find(s=>s.cats.includes(cat))||{}).k}
function csWornId(cat){if(cat==='hat')return progress.skin||'none';if(STYLE_CAT[cat])return progress[STYLE_CAT[cat]+'skin']||'none';return lookNow()[cat]}
function csPrevId(cat){if(cat==='hat')return W3.previewHat??progress.skin??'none';if(STYLE_CAT[cat])return (W3.sel&&W3.sel.cat===cat?W3.sel.id:null)||csWornId(cat);return (W3.preview||lookNow())[cat]}
function csList(cat){if(cat==='deal')return wDeals().map(([c,id])=>({c,id}));if(STYLE_CAT[cat])return [{c:cat,id:'none'}].concat(STYLE_SKINS.filter(q=>q.cat===STYLE_CAT[cat]).map(q=>({c:cat,id:q.id})));return wItems(cat).map(id=>({c:cat,id}))}
function csInfo(c,id){
  if(STYLE_CAT[c]){if(id==='none')return {name:t('csNone'),owned:true,worn:!progress[STYLE_CAT[c]+'skin'],price:0,rar:''};const q=STYLE_SKINS.find(q=>q.id===id);
    return {name:t('sk_'+id),owned:wallet().skins.includes(id),worn:progress[q.cat+'skin']===id,price:q.price,base:q.price,gate:q.w&&!worldOpen(q.w)?t('worldN',{n:q.w}):null,rar:q.price>=700?'epic':q.price>=300?'rare':'',power:false}}
  return {name:wName(c,id),owned:wOwned(c,id),worn:csWornId(c)===id,price:wPrice(c,id),base:wBase(c,id),deal:wIsDeal(c,id),gate:wGate(c,id),rar:wRarity(c,id),real:wIsReal(c,id),power:!!itemFX(c,id)}}
// small painted icons for trails / landings / tints (they have no 3D look)
function csStyleIcon(id){const c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d');g.translate(48,48);
  const bg=g.createRadialGradient(0,-10,6,0,0,46);bg.addColorStop(0,'#5b4bd6');bg.addColorStop(1,'#241a6b');g.fillStyle=bg;g.beginPath();g.arc(0,0,44,0,7);g.fill();
  const q=STYLE_SKINS.find(q=>q.id===id);
  if(!q){g.strokeStyle='#c7b8ff';g.lineWidth=6;g.beginPath();g.arc(0,0,24,0,7);g.moveTo(-17,17);g.lineTo(17,-17);g.stroke();return c.toDataURL()}
  if(q.cat==='c'){g.filter=q.filter;const gr=g.createLinearGradient(-30,-30,30,30);gr.addColorStop(0,'#ff6b98');gr.addColorStop(1,'#13b5c9');g.fillStyle=gr;g.beginPath();g.ellipse(0,4,24,30,0,0,7);g.fill();g.filter='none';return c.toDataURL()}
  const save=progress[q.cat+'skin'];progress[q.cat+'skin']=id;
  try{if(q.cat==='t')withCtx(g,60,()=>{for(let k=0;k<4;k++)trailMark(k,-26+k*18,22-k*16,.55+k*.15)});
    else{const cols={l_flowers:['#ff3ea5','#ffd60a','#a3e635'],l_fireworks:['#ff3ea5','#22d3ee','#ffd60a'],l_coins:['#ffd60a','#ffb000'],l_confetti:['#ff3ea5','#ffd60a','#22d3ee','#a3e635'],l_stars:['#ffd60a','#ffffff'],l_bubbles:['#bfefff','#ffffff'],l_hearts:['#ff3ea5','#ff6b98']}[id]||['#fff'];
      for(let i=0;i<12;i++){const a=i/12*Math.PI*2,r=14+(i%3)*8;g.fillStyle=cols[i%cols.length];g.beginPath();if(id==='l_bubbles'){g.strokeStyle=cols[0];g.lineWidth=3;g.arc(Math.cos(a)*r,Math.sin(a)*r,5,0,7);g.stroke()}else{g.arc(Math.cos(a)*r,Math.sin(a)*r,id==='l_coins'?7:5,0,7);g.fill()}}
      g.fillStyle='#ffffff';g.fillRect(-20,22,40,6)}}finally{progress[q.cat+'skin']=save}
  return c.toDataURL()}
function csThumb(c,id,img,sw){if(c==='color'){sw.style.setProperty('--c',WCOL[id].c);sw.hidden=false;img.hidden=true;return}
  if(STYLE_CAT[c]){img.src=csStyleIcon(id);return}
  if(id==='none'&&c!=='color'){img.src=csStyleIcon('none');return}
  const k=c+':'+id;if(W3.thumbCache&&W3.thumbCache[k]){img.src=W3.thumbCache[k];return}
  CS.thumbQ.push([c,id,img]);if(!CS.qRun){CS.qRun=true;const step=()=>{for(let n=0;n<3&&CS.thumbQ.length;n++){const [cc,ii,im]=CS.thumbQ.shift();if(im.isConnected){const u=wThumb(cc,ii);if(u)im.src=u}}
    if(CS.thumbQ.length)requestAnimationFrame(step);else CS.qRun=false};requestAnimationFrame(step)}}

/* the numbers in the bars */
const CS_ROWS=['tol','coins','hearts','spd','boss','feverT'];
function csStatVal(F,k){if(k==='hearts')return 3+(F.hearts||0);return F[k]===undefined?1:F[k]}
function csChips(F){const out=[],L=lang==='he'?'he':'en',P=typeof PW_TXT!=='undefined'?PW_TXT[L]:{};
  for(const k in F){const v=F[k];if(k.startsWith('imm_')){const m=(I18N[L]['hz_'+k.slice(4)]||k.slice(4)).replace(/!/g,'');out.push(['+',(P.imm||'No {m}').replace('{m}',m)])}
    else if(k==='astro')out.push(['+',t('ps_astro')]);else if(k.startsWith('pet_'))out.push(['+',t('ps_'+k.slice(4))]);
    else if(['aim','noSlip','light','lavaK','swayK','convK','perfCoins'].includes(k))out.push(['+',P[k]||k]);
    else if(k==='fall')out.push(v<1?['+',P.fall||'']:['-',t('ng_fall')]);else if(k==='wind')out.push(v<1?['+',P.wind||'']:['-',t('ng_wind')]);
    else if(k==='pts'&&v<1)out.push(['-',t('ng_pts')]);else if(k==='perfPts')out.push(v>1?['+',P.perfPts||'']:['-',t('ng_perfPts')]);
    else if(k==='clear'&&v<1)out.push(['-',t('ng_clear')]);else if(k==='feverN')out.push(['-',t('ng_feverN')])}
  return out}

renderWardrobe=function(){const el=document.getElementById('wardrobe');if(!el)return;el.classList.add('cs');
  const slot=CS_SLOTS.find(s=>s.k===CS.slot)||CS_SLOTS[4];if(!slot.cats.includes(W3.cat)&&W3.cat!=='deal'&&W3.cat!=='sets')W3.cat=slot.cats[0];const cat=W3.cat;
  el.innerHTML='';const mk=(tag,cls,txt)=>{const d=document.createElement(tag);if(cls)d.className=cls;if(txt!=null)d.textContent=txt;return d};
  // top bar
  const top=mk('div','cs-top');const x=mk('button','x-btn wd-close');x.setAttribute('aria-label','close');x.innerHTML=XSVG;x.onclick=closeWardrobe;
  const ti=mk('div','cs-title',t('csTitle'));const rd=mk('button','cs-rand');rd.setAttribute('aria-label','random');rd.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="4" fill="#fff" stroke="#120d2b" stroke-width="2"/><circle cx="8" cy="8" r="1.8" fill="#120d2b"/><circle cx="16" cy="16" r="1.8" fill="#120d2b"/><circle cx="12" cy="12" r="1.8" fill="#120d2b"/></svg>';rd.onclick=()=>{audio();wRandom()};
  const cp=mk('div','coin-pill');cp.innerHTML=coinImg()+'<span data-coins></span>';cp.querySelector('span').textContent=progress.coins.toLocaleString();
  top.append(x,ti,rd,cp);el.appendChild(top);
  // stage with the equipment slots (the 3D hero is drawn behind, by the lobby)
  const st=mk('div','cs-stage');
  for(const s of CS_SLOTS){const b=mk('button','cs-slot'+(s.k===CS.slot?' on':''));b.style.left=s.x+'%';b.style.top=s.y+'%';
    const c0=s.cats[0],id=s.k==='fx'?(progress.tskin||progress.lskin||progress.cskin||'none'):csPrevId(c0),th=mk('img');th.alt='';const sw=mk('i','sw');sw.hidden=true;
    const pw=s.cats.some(c=>c!=='fx'&&itemFX(c,csPrevId(c)));if(pw)b.classList.add('pow');
    if(s.k==='fx')csThumb(progress.tskin?'trail':progress.lskin?'land':'cfilt',id,th,sw);else if(id&&id!=='none')csThumb(c0,id,th,sw);else th.src=csStyleIcon('none');
    b.append(th,sw,mk('span','',t('sl_'+s.k)));b.onclick=()=>{sfx.click();CS.slot=s.k;W3.cat=s.cats[0];CS.filter='all';renderWardrobe()};st.appendChild(b)}
  el.appendChild(st);
  // power bars: what you wear vs what you are trying on
  const prevL=heroLook(),eqL=Object.assign({},lookNow(),{hat:progress.skin||'none'});const FP=fxCombine(prevL,prevL.hat),FE=fxCombine(eqL,eqL.hat);
  const sp=mk('div','cs-stats');const sh=mk('div','cs-sh');sh.append(mk('b','',t('csPowers')));const diff=JSON.stringify(FP)!==JSON.stringify(FE);if(diff)sh.append(mk('span','pv',t('csPreview')));sp.appendChild(sh);
  for(const k of CS_ROWS){const vp=csStatVal(FP,k),ve=csStatVal(FE,k),r=mk('div','cs-row');r.append(mk('span','lb',t('st_'+k)));const bar=mk('div','bar');
    if(k==='hearts'){bar.classList.add('hearts');for(let i=0;i<Math.max(vp,ve);i++){const h=mk('i','h'+(i>=vp?' lost':i>=ve?' gain':''));bar.appendChild(h)}}
    else{const f=v=>Math.max(.04,Math.min(1,v/1.6));const a=mk('i','fill');a.style.width=(f(Math.min(vp,ve))*100)+'%';bar.appendChild(a);
      if(vp!==ve){const better=k==='spd'?vp<ve:vp>ve,d=mk('i','delta '+(better?'up':'down'));d.style.width=(Math.abs(f(vp)-f(ve))*100)+'%';d.style.insetInlineStart=(f(Math.min(vp,ve))*100)+'%';bar.appendChild(d)}}
    r.appendChild(bar);const pct=k==='hearts'?String(vp):Math.round(vp*100)+'%';const v=mk('span','vl'+(vp!==ve?((k==='spd'?vp<ve:vp>ve)?' up':' down'):(vp!==1&&k!=='hearts'?(k==='spd'?(vp<1?' up':' down'):(vp>1?' up':' down')):'')),pct);r.appendChild(v);sp.appendChild(r)}
  const chips=csChips(FP);if(chips.length){const cw=mk('div','cs-chips');for(const [s,tx] of chips.slice(0,6))cw.appendChild(mk('span','ch '+(s==='+'?'up':'down'),(s==='+'?'▲ ':'▼ ')+tx));sp.appendChild(cw)}
  el.appendChild(sp);
  // drawer
  const dr=mk('div','cs-drawer');const hd=mk('div','cs-dh');
  const subs=mk('div','cs-subs');const scats=cat==='deal'||cat==='sets'?[]:slot.cats;
  if(scats.length>1)for(const c of scats){const b=mk('button','cs-sub'+(c===cat?' on':''),STYLE_CAT[c]?t('ct_'+c):(WCATS.find(w=>w[0]===c)||[0,[c,c]])[1][lang==='he'?1:0]);
    if(c!==cat&&!STYLE_CAT[c]&&wNewIn(c))b.appendChild(mk('i','dot'));b.onclick=()=>{sfx.click();W3.cat=c;renderWardrobe()};subs.appendChild(b)}
  else subs.appendChild(mk('b','cs-sl',cat==='deal'?t('csDeals'):cat==='sets'?t('csLooks'):t('sl_'+slot.k)));
  const extra=mk('div','cs-extra');for(const [c,key] of [['deal','csDeals'],['sets','csLooks']]){const b=mk('button','cs-sub small'+(cat===c?' on':''),t(key));if(c==='deal'&&wNewIn('deal'))b.appendChild(mk('i','dot'));b.onclick=()=>{sfx.click();W3.cat=cat===c?slot.cats[0]:c;renderWardrobe()};extra.appendChild(b)}
  hd.append(subs,extra);dr.appendChild(hd);
  if(cat==='sets'){const g=mk('div','cs-sets');wSets().forEach((S,i)=>{const c=mk('div','wd-set'+(S?'':' empty'));const im=mk('img');im.alt='';if(S){const u=wThumb('set',i);if(u)im.src=u}c.appendChild(im);c.appendChild(mk('b','',t('lookN',{n:i+1})));
      const w=mk('button','wear',t('wear'));w.disabled=!S;w.onclick=()=>{wWearSet(i)};const sv=mk('button','save',t('save'));sv.onclick=()=>wSaveSet(i);c.append(w,sv);g.appendChild(c)});dr.appendChild(g)}
  else{const fl=mk('div','cs-filter');const powCat=c=>c==='hat'||c==='outfit'||c==='glasses'||c==='pet';
    if(cat!=='deal'&&powCat(cat))for(const [f,key] of [['all','csAll'],['pow','csPow'],['skin','csSkin']]){const b=mk('button','cs-f'+(CS.filter===f?' on':''),t(key));b.onclick=()=>{CS.filter=f;renderWardrobe()};fl.appendChild(b)}
    if(fl.childNodes.length)dr.appendChild(fl);
    const grid=mk('div','cs-grid');let list=csList(cat);
    if(CS.filter!=='all'&&cat!=='deal')list=list.filter(({c,id})=>id==='none'||(CS.filter==='pow')===!!itemFX(c,id));
    // powers first, then cheap → expensive; owned at the front
    for(const {c,id} of list){const I=csInfo(c,id),b=mk('button','cs-it'+(I.rar?' r-'+I.rar:'')+(I.worn?' eq':'')+(W3.sel&&W3.sel.cat===c&&W3.sel.id===id?' sel':'')+(I.gate&&!I.owned?' gated':'')+(I.power?' pow':''));
      const th=mk('div','th'),img=mk('img'),sw=mk('i','sw');img.alt='';sw.hidden=true;th.append(img,sw);csThumb(c,id,img,sw);b.appendChild(th);
      if(I.power)b.appendChild(mk('i','bolt','⚡'));if(I.deal)b.appendChild(mk('span','off','-'+Math.round(DEAL_OFF*100)+'%'));
      b.appendChild(mk('b','nm',I.name));const em=mk('em','pr');
      if(I.owned)em.textContent=I.worn?'✓':'';else if(I.gate)em.textContent='🔒';else if(I.real)em.textContent=(IAP.products[I.real]||{}).price||'';else em.innerHTML=coinImg()+I.price.toLocaleString();
      if(!I.owned&&!I.gate&&!I.real&&I.price>progress.coins)em.classList.add('poor');b.appendChild(em);
      b.onclick=()=>csTap(c,id,I);grid.appendChild(b)}
    dr.appendChild(grid)}
  // action
  const act=mk('div','cs-act');const s=W3.sel;
  if(s&&cat!=='sets'){const I=csInfo(s.cat,s.id);
    if(!I.owned){const bb=mk('button','btn green cs-buy');if(I.gate){bb.disabled=true;bb.textContent=I.gate}
      else if(I.real){bb.classList.add('prem');bb.textContent=t('buyEquip')+' · '+((IAP.products[I.real]||{}).price||'')}
      else{bb.innerHTML='<span></span>'+coinImg()+I.price.toLocaleString();bb.querySelector('span').textContent=t('buyEquip')+' ';if(I.price>progress.coins)bb.classList.add('poor')}
      bb.onclick=()=>csBuy(s.cat,s.id);act.appendChild(bb)}
    else act.appendChild(mk('div','cs-hint',(I.worn?'✓ '+t('csWorn')+': ':'')+I.name))}
  else act.appendChild(mk('div','cs-hint',t('csTry')));
  dr.appendChild(act);el.appendChild(dr);
  if(cat!=='sets'&&cat!=='deal'&&!STYLE_CAT[cat])wMarkSeen(cat);saveProgress();wBadge()};
function csTap(c,id,I){if(I.gate&&!I.owned){sfx.locked();popupToast(I.gate);return}sfx.click();
  if(STYLE_CAT[c]){const key=STYLE_CAT[c]+'skin';if(I.owned){progress[key]=id==='none'?null:id;W3.sel=null}else W3.sel={cat:c,id};saveProgress();renderWardrobe();return}
  wSelect(c,id)}
function csBuy(c,id){if(STYLE_CAT[c]){const q=STYLE_SKINS.find(q=>q.id===id);if(!q||wallet().skins.includes(id))return;if(progress.coins<q.price){sfx.locked();popupToast(t('needCoins'));return}
    progress.coins-=q.price;progress.skins.push(id);progress[q.cat+'skin']=id;W3.sel=null;sfx.flourish&&sfx.flourish(2);saveProgress();updateWalletUI();renderWardrobe();return}
  wBuy()}
{const _ow=openWardrobe;openWardrobe=function(...a){const r=_ow(...a);CS.slot=csSlotOf(W3.cat)||'look';return r}}
// every pattern drawn 30% bigger (Tzach): paint at 1/1.3 size, then stretch to the full texture — periodic patterns stay seamless
const PAT_SCALE=1.3;
{const _pt=patternTex;patternTex=function(id,base){const _ct=canvasTex;
  canvasTex=function(k,w,h,draw){return _ct(k+'_x'+PAT_SCALE,w,h,(g,W,H)=>{const c=document.createElement('canvas');c.width=Math.round(W/PAT_SCALE);c.height=Math.round(H/PAT_SCALE);draw(c.getContext('2d'),c.width,c.height);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(c,0,0,W,H)})};
  try{return _pt(id,base)}finally{canvasTex=_ct}}}
