/* ===== v47: boss trophies with powers + the astronaut suit =====
   - Every one of the 22 new bosses drops its own 3D trophy hat (WHATX 'h_<sid>', trophy:sid, legendary). Wearing it gives
     powers with NO cost: immunity to that boss's mechanic (it never shows up again while you wear it) + one bonus.
   - Astronaut suit (outfit 'astro', real purchase 'astro'): your tower starts already 5 floors high. */
const TROPHY_NAMES={farmN:['Pumpkin Crown','כתר הדלעת'],cityN:['Alley Cat Ears','אוזני חתול רחוב'],desertN:['Stinger Crown','כתר העוקץ'],candyN:['Candy Witch Hat','כובע מכשפת הסוכר'],
  snowN:['Frost Wolf Hood','ברדס זאב הכפור'],oceanN:['Angler Lantern','פנס הדג'],volcanoN:['Imp Horns','קרני השד'],spaceN:['Moon Bunny Ears','אוזני ארנב הירח'],
  farmS:['Thunder Horns','קרני הרעם'],cityS:['Rain Hat','כובע גשם'],desertS:['Sandworm Turban','טורבן התולעת'],candyS:['Gingerbread Crown','כתר הג׳ינג׳ר'],
  snowS:['General Bicorne','כובע הגנרל'],oceanS:['Shark Fin','סנפיר הכריש'],volcanoS:['Phoenix Crest','כרבולת עוף החול'],spaceS:['Cosmic Eye','העין הקוסמית'],
  jungle:['Leaf Crown','כתר העלים'],castle:['Ghost Crown','כתר הרוחות'],clouds:['Unicorn Horn','קרן חד-הקרן'],dino:['Dino Frill','צווארון הדינו'],
  factory:['Robot Antenna','אנטנת רובוט'],crystal:['Crystal Tiara','נזר הקריסטל']};
// powers: imm = mechanic that never appears while worn; the rest use HAT_FX keys (v39) + new ones: light, lavaK, swayK, convK, noSlip
const TROPHY_FX={farmN:{imm:'bats',light:1.45},cityN:{imm:'blackout',coins:1.1},desertN:{imm:'scorpion',boss:1.25},candyN:{imm:'jelly',tol:1.1},
  snowN:{imm:'icicle',wind:.7},oceanN:{imm:'jellyfish',light:1.6},volcanoN:{lavaK:.45,feverT:1.3},spaceN:{imm:'portal',fall:.85},
  farmS:{imm:'lightning',perfPts:1.3},cityS:{imm:'newspaper',noSlip:1},desertS:{swayK:.35,coins:1.1},candyS:{imm:'hail',perfCoins:2},
  snowS:{imm:'freeze',spd:.92},oceanS:{swayK:.35,boss:1.25},volcanoS:{imm:'meteor',hearts:1},spaceS:{imm:'gravity',aim:1},
  jungle:{imm:'monkey',coins:1.15},castle:{imm:'ghost',tol:1.12},clouds:{imm:'cloud',fall:.8},dino:{imm:'egg',hearts:1},
  factory:{convK:0,coins:1.2},crystal:{imm:'mirror',feverT:1.5}};
const PW_TXT={en:{imm:'No {m}',coins:'+{p}% coins',boss:'Hits bosses harder',tol:'Wider landing zone',wind:'Wind pushes less',light:'More light at night',
    lavaK:'Lava rises slowly',feverT:'Frenzy lasts longer',fall:'Falls slowly',perfPts:'More points for PERFECT',noSlip:'Never slips in the rain',
    swayK:'Sand and waves barely move the tower',perfCoins:'+2 coins for every PERFECT',spd:'Slower swing, easier to aim',hearts:'An extra heart every level',aim:'Aiming line always on',convK:'Conveyors stop'},
  he:{imm:'בלי {m}',coins:'עוד {p}% מטבעות',boss:'פוגע חזק יותר בבוסים',tol:'אזור נחיתה רחב יותר',wind:'הרוח מזיזה פחות',light:'יותר אור בלילה',
    lavaK:'הלבה עולה לאט',feverT:'מצב טירוף ארוך יותר',fall:'נופל לאט יותר',perfPts:'יותר נקודות על "מושלם"',noSlip:'לא מחליק בגשם',
    swayK:'החול והגלים כמעט לא מזיזים',perfCoins:'עוד 2 מטבעות על כל "מושלם"',spd:'נדנוד איטי וקל לכוון',hearts:'לב נוסף בכל שלב',aim:'קו הכיוון תמיד מופיע',convK:'המסועים עוצרים'}};
for(const [sid,fx] of Object.entries(TROPHY_FX)){const id='h_'+sid;
  WHATX[id]={p:0,w:1,trophy:sid,n:TROPHY_NAMES[sid]};const F=Object.assign({},fx);if(F.imm){F['imm_'+F.imm]=1}HAT_FX[id]=F;
  for(const L of ['en','he']){const P=PW_TXT[L],parts=[];for(const k in fx){if(k==='imm'){const m=(I18N[L]['hz_'+fx.imm]||fx.imm).replace(/!/g,'');parts.push(P.imm.replace('{m}',m))}
      else parts.push((P[k]||k).replace('{p}',Math.round((fx[k]-1)*100)))}
    I18N[L]['hp_'+id]=parts.join(' · ');I18N[L]['hm_'+id]=''}}
const TROPHY_IDS=Object.keys(TROPHY_FX).map(s=>'h_'+s);
{const _wr=wRarity;wRarity=function(cat,id){return cat==='hat'&&WHATX[id]&&WHATX[id].trophy?'leg':_wr(cat,id)}}
// a trophy power box has no "cost" line
{const _hb=hatPowerBox;hatPowerBox=function(id){const d=_hb(id);if(TROPHY_IDS.includes(id)){const m=d.querySelector('.hm');if(m)m.remove();d.classList.add('trophy')}return d}}
const hatImm=k=>!!hatK('imm_'+k,0);

/* ---------- powers in the game ---------- */
{const _se=startEvent;startEvent=function(k){if(MECH[k]&&hatImm(k))return false;return _se(k)}}
{const _ml=mechList;mechList=function(){const L=_ml().filter(k=>!hatImm(k));return L.length?L:['wind']}}
{const _bm=bossMech;bossMech=function(k,b){if(hatImm(k))return false;return _bm(k,b)}}
// passives: lava / dunes / waves / conveyor scale their update time
for(const [k,key] of [['lava','lavaK'],['dunes','swayK'],['waves','swayK'],['conveyor','convK']]){const M=MECH[k],_u=M.update;M.update=function(dt,m,live){const f=hatK(key);if(f<=0)return;return _u.call(this,dt*f,m,live)}}
// storm slip: wrap hzOnLanding again — undo the slide v44 just applied
{const _ol=hzOnLanding;hzOnLanding=function(perfect,great){const d=tower[tower.length-1],x0=d&&d.xs;_ol(perfect,great);if(hatK('noSlip',0)&&d&&curSeason()===3&&!perfect&&d.slideX){d.xs=x0-(d.xs-x0)*0;d.slideX=0}}}

/* ---------- 3D trophy hats (origin = top of the head, like buildHat) ---------- */
{const _bh=buildHat;buildHat=function(P,id){if(!TROPHY_IDS.includes(id))return _bh(P,id);const T=P.T,s=P.hatSlot;
  const cone=(r,h,c,o)=>wmesh(new T.ConeGeometry(r,h,32),c,o),cyl=(rt,rb,h,c,o,seg=40)=>wmesh(new T.CylinderGeometry(rt,rb,h,seg),c,o),sph=(r,c,o)=>wmesh(new T.SphereGeometry(r,24,16),c,o);
  const add=(m,x=0,y=0,z=0,ink=1.06,par=s)=>{m.position.set(x,y,z);par.add(m);if(ink){const k=new T.Mesh(m.geometry,INKM());k.scale.setScalar(ink);m.add(k)}return m};
  const gold={metalness:.65,roughness:.2},glow=c=>({emissive:c,emissiveIntensity:.7});
  const crown=(r,h,c,n,gems)=>{add(cyl(r,r*1.04,h,c,gold),0,h/2);for(let i=0;i<n;i++){const a=i/n*Math.PI*2;add(cone(.06,.15,c,gold),Math.sin(a)*r,h+.06,Math.cos(a)*r);if(gems)add(sph(.03,gems[i%gems.length],glow(gems[i%gems.length])),Math.sin(a)*(r+.01),h*.45,Math.cos(a)*(r+.01),0)}};
  const ears=(c,inner,h,spread,tilt)=>{for(const sx of[-1,1]){const e=add(cone(.13,h,c,{roughness:.6}),sx*spread,h/2-.04,.04);e.rotation.z=-sx*tilt;e.scale.z=.55;const n=cone(.06,h*.7,inner);n.position.set(0,-h*.08,.035);n.scale.z=.5;e.add(n)}};
  const sid=id.slice(2);
  switch(sid){
  case 'farmN':{const p=add(sph(.3,'#ff8a1e',{roughness:.45}),0,.12);p.scale.set(1,.72,1);for(let i=0;i<6;i++){const a=i/6*Math.PI*2,r=wmesh(new T.TorusGeometry(.3,.012,6,40),'#d8620a');r.rotation.y=a;r.scale.set(1,.72,1);r.position.y=.12;s.add(r)}
    for(const sx of[-1,1]){const e=add(cone(.05,.07,'#ffe24d',glow('#ffb000')),sx*.1,.16,.27,0);e.rotation.x=Math.PI/2}add(cone(.035,.1,'#2e7d32'),0,.36,0);
    const cr=new T.Group();cr.position.set(0,.3,0);s.add(cr);for(let i=0;i<5;i++){const a=i/5*Math.PI*2,c=wmesh(new T.ConeGeometry(.035,.09,10),'#ffd23f',gold);c.position.set(Math.sin(a)*.1,.02,Math.cos(a)*.1);cr.add(c)}break}
  case 'cityN':{const b=add(wmesh(new T.TorusGeometry(.29,.03,8,40,Math.PI),'#222'),0,-.02,0,0);ears('#8d8f99','#ffb3c8',.36,.2,.22);
    add(wmesh(new T.TorusGeometry(.12,.012,6,24),'#ffd23f',gold),.24,.12,.05,0).rotation.y=1.2;break}
  case 'desertN':{crown(.26,.12,'#ffcf3a',6,['#8a4dff','#e8283f']);let px=0,py=.2,pz=-.24;for(let i=0;i<6;i++){const a=-.3+i*.48;px=0;py=.16+Math.sin(a)*.26+i*.04;pz=-.26+Math.cos(a)*.14-i*.02;add(sph(.07-i*.006,'#ff8a1e',{roughness:.4}),px,py,pz,1.08)}
    add(cone(.04,.12,'#a855f7',glow('#a855f7')),0,py+.08,pz+.06);break}
  case 'candyN':{add(cyl(.44,.44,.03,'#ff6fb5'),0,.0,0,1.03);const tx=canvasTex('witchstripe',64,256,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=i%2?'#ffffff':'#ff3fa0';g.fillRect(0,i*h/8,w,h/8+1)}});
    add(wmesh(new T.ConeGeometry(.24,.42,40),wm('#ffffff',{map:tx})),0,.22);const t2=wmesh(new T.ConeGeometry(.12,.3,30),wm('#ffffff',{map:tx}));t2.position.set(.08,.5,0);t2.rotation.z=-.6;s.add(t2);add(sph(.05,'#22d3ee'),.2,.6,0,1.1);break}
  case 'snowN':{const h=add(wmesh(new T.SphereGeometry(.34,32,16,0,Math.PI*2,0,Math.PI/2),'#9fb3c8',{roughness:.8}),0,-.08);ears('#9fb3c8','#e6f2ff',.3,.19,.22);
    for(let i=0;i<5;i++){const a=(i/4-.5)*2.2,c=add(wmesh(new T.OctahedronGeometry(.06,0),'#bdf2ff',{emissive:'#7fd4ff',emissiveIntensity:.5,roughness:.1}),Math.sin(a)*.3,.08+Math.cos(a)*.05,-Math.cos(a)*.18,0);c.scale.y=1.8}break}
  case 'oceanN':{add(cyl(.28,.29,.06,'#1e3a8a'),0,.0);const pts=[];for(let i=0;i<16;i++){const f=i/15;pts.push(new T.Vector3(0,.03+Math.sin(f*2.2)*.42,-.05+f*.38))}
    s.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,.02,8),'#1e3a8a'));const L=pts[15];add(sph(.08,'#fff36b',{emissive:'#ffd400',emissiveIntensity:1.1}),L.x,L.y,L.z,1.1);break}
  case 'volcanoN':{add(cyl(.27,.28,.05,'#1d1530'),0,0);for(const sx of[-1,1]){const h=add(cone(.075,.3,'#e8283f',{roughness:.35}),sx*.17,.15,0,1.06);h.rotation.z=-sx*.45;const tip=wmesh(new T.ConeGeometry(.035,.09,16),'#1d1530');tip.position.y=.11;h.add(tip)}
    for(let i=0;i<3;i++)add(cone(.045,.15-i*.03,i?'#ffd23f':'#ff5a1a',glow(i?'#ffb000':'#ff3a00')),(i-1)*.07,.09,.08,0);break}
  case 'spaceN':{const b=add(cyl(.29,.3,.07,'#c0c8d8',gold),0,0);for(const sx of[-1,1]){const e=add(wmesh(new T.CapsuleGeometry(.07,.34,6,12),'#ffffff',{roughness:.5}),sx*.12,.28,0);e.rotation.z=-sx*.18;const n=wmesh(new T.CapsuleGeometry(.04,.26,4,10),'#ffb3d1');n.position.z=.04;e.add(n)}
    add(sph(.04,'#a855f7',glow('#a855f7')),0,.06,.29,0);break}
  case 'farmS':{for(const sx of[-1,1]){const h=add(wmesh(new T.TorusGeometry(.13,.05,10,24,Math.PI*1.4),'#d9b36a',{roughness:.4}),sx*.22,.12,0,1.05);h.rotation.set(0,sx>0?0:Math.PI,-.6)}
    const bolt=new T.Shape();bolt.moveTo(.02,.2);bolt.lineTo(-.07,0);bolt.lineTo(0,0);bolt.lineTo(-.03,-.18);bolt.lineTo(.08,.04);bolt.lineTo(.01,.04);bolt.lineTo(.05,.2);
    const bg=new T.ExtrudeGeometry(bolt,{depth:.03,bevelEnabled:false});bg.center();add(wmesh(bg,'#ffe24d',glow('#ffd400')),0,.26,0,1.08);add(cyl(.27,.28,.05,'#5b6478'),0,0);break}
  case 'cityS':{add(wmesh(new T.SphereGeometry(.31,32,16,0,Math.PI*2,0,Math.PI/2),'#ffd23f',{roughness:.3,clearcoat:.8}),0,-.04);const br=add(wmesh(new T.CylinderGeometry(.46,.46,.025,40),'#ffd23f',{roughness:.3,clearcoat:.8}),0,-.03,-.06,1.03);br.scale.z=1.15;break}
  case 'desertS':{const cs=['#f4d29c','#14b8a6','#f4d29c','#d97706'];for(let i=0;i<4;i++){const t=add(wmesh(new T.TorusGeometry(.27-i*.05,.075,14,40),cs[i],{roughness:.6}),0,.03+i*.08,0,0);t.rotation.x=Math.PI/2}
    add(sph(.06,'#14b8a6',glow('#0ea5a0')),0,.13,.27,1.1);break}
  case 'candyS':{crown(.27,.14,'#b8682e',5);const ic=add(wmesh(new T.TorusGeometry(.275,.02,8,48),'#ffffff'),0,.07,0,0);ic.rotation.x=Math.PI/2;
    ['#e8283f','#22c55e','#3aa8ff','#ffd23f'].forEach((c,i)=>{const a=i/4*Math.PI*2+.4;add(sph(.045,c,{roughness:.2,clearcoat:1}),Math.sin(a)*.2,.2,Math.cos(a)*.2,1.1)});break}
  case 'snowS':{const hb=add(wmesh(new T.CylinderGeometry(.36,.36,.56,32,1,false,0,Math.PI),'#1e2a5a',{side:T.DoubleSide}),0,.08,0,0);hb.rotation.set(0,Math.PI/2,Math.PI/2);hb.scale.set(1,1,.6);
    add(cyl(.29,.31,.14,'#1e2a5a'),0,.05);const tr=add(wmesh(new T.TorusGeometry(.36,.02,8,32,Math.PI),'#ffc93c',gold),0,.08,0,0);tr.rotation.y=Math.PI/2;
    const ck=add(wmesh(new T.CylinderGeometry(.07,.07,.02,20),'#e8283f'),0,.24,.12,1.1);ck.rotation.x=Math.PI/2;add(sph(.03,'#ffffff'),0,.24,.135,0);break}
  case 'oceanS':{add(cyl(.27,.28,.06,'#2563eb'),0,0);const f=add(cone(.16,.42,'#3b82f6',{roughness:.35}),0,.22,-.02,1.05);f.scale.z=.3;f.rotation.x=-.15;const w=add(cone(.12,.2,'#e5f0ff'),0,.1,.06,0);w.scale.z=.25;break}
  case 'volcanoS':{for(let i=0;i<9;i++){const a=(i/8-.5)*2.2,h=.3+(1-Math.abs(a))*.16,c=['#ff3b1f','#ff8a00','#ffd23f'][i%3],f=wmesh(new T.ConeGeometry(.055,h,14),c,glow(c));f.scale.z=.45;f.position.set(Math.sin(a)*.14,h/2+.02,-.05-Math.cos(a)*.03);f.rotation.z=-a*.55;s.add(f)}
    add(cyl(.26,.27,.06,'#7c2d12'),0,0);break}
  case 'spaceS':{const e=add(sph(.17,'#ffffff',{roughness:.12}),0,.3,0,1.05);const ir=wmesh(new T.SphereGeometry(.1,24,16),'#7c3aed',glow('#a855f7'));ir.position.z=.1;ir.scale.z=.6;e.add(ir);const pu=wmesh(new T.SphereGeometry(.045,16,12),'#0b0620');pu.position.z=.165;e.add(pu);
    const r=add(wmesh(new T.TorusGeometry(.3,.012,6,48),'#c4b5fd'),0,.3,0,0);r.rotation.x=1.2;[['#3aa8ff',0],['#ff3fa0',2.1],['#5ee85a',4.2]].forEach(([c,a])=>add(sph(.035,c),Math.cos(a)*.3,.3+Math.sin(a)*.3*Math.cos(1.2),Math.sin(a)*.3*Math.sin(1.2),0));add(cyl(.26,.27,.05,'#4c1d95'),0,0);break}
  case 'jungle':{const rg=add(wmesh(new T.TorusGeometry(.28,.03,10,48),'#3fae55'),0,-.01,0,0);rg.rotation.x=Math.PI/2;for(let i=0;i<9;i++){const a=i/9*Math.PI*2,l=wmesh(new T.SphereGeometry(.09,14,10),i%2?'#22c55e':'#16a34a');l.scale.set(.5,1.4,.25);l.position.set(Math.sin(a)*.28,.1,Math.cos(a)*.28);l.rotation.y=a;s.add(l)}
    [['#ff4f9a',.2],['#ffd23f',2.3],['#a855f7',4.3]].forEach(([c,a])=>add(sph(.05,c),Math.sin(a)*.29,.05,Math.cos(a)*.29,1.1));break}
  case 'castle':{crown(.26,.14,'#b8b6d9',6,['#7c3aed']);for(let i=0;i<3;i++){const a=(i-1)*.5,f=add(cone(.04,.14,'#7fd4ff',glow('#3aa8ff')),Math.sin(a)*.26,.3,Math.cos(a)*.26,0)}break}
  case 'clouds':{for(let i=0;i<7;i++){const a=i/7*Math.PI*2;add(sph(.09,'#ffffff',{roughness:.8}),Math.sin(a)*.24,.03,Math.cos(a)*.24,0)}const pts=[];for(let i=0;i<=12;i++)pts.push(new T.Vector2(.07*(1-i/12),i/12*.36));
    const h=add(wmesh(new T.LatheGeometry(pts,24),'#ffd23f',gold),0,.06,.08,1.06);h.rotation.x=.25;const sp=wmesh(new T.TorusGeometry(.055,.008,6,24),'#fff4c2');sp.position.set(0,.18,.1);sp.rotation.x=Math.PI/2+.25;s.add(sp);break}
  case 'dino':{const fr=add(wmesh(new T.CircleGeometry(.44,40,0,Math.PI),'#84cc16',{roughness:.5,side:T.DoubleSide}),0,.02,-.16,1.04);fr.rotation.x=-.25;
    const ck=wmesh(new T.TorusGeometry(.4,.035,8,40,Math.PI),'#ffffff');ck.position.set(0,.02,-.15);ck.rotation.x=-.25;s.add(ck);
    [['#e8283f',-1],['#3aa8ff',0],['#ffd23f',1]].forEach(([c,k])=>{const a=Math.PI/2+k*.7,g=wmesh(new T.SphereGeometry(.04,12,10),c,{emissive:c,emissiveIntensity:.4});g.position.set(Math.cos(a)*.3,.02+Math.sin(a)*.3*Math.cos(.25),-.14+Math.sin(a)*.3*Math.sin(.25)+.02);s.add(g)});
    for(const [x,h,rz] of [[-.13,.2,.25],[.13,.2,-.25],[0,.12,0]]){const c=add(cone(.045,h,'#fff4dc'),x,.06+h/2,.14);c.rotation.z=rz;c.rotation.x=.3}add(cyl(.27,.28,.05,'#65a30d'),0,0);break}
  case 'factory':{add(wmesh(new T.SphereGeometry(.3,32,16,0,Math.PI*2,0,Math.PI/2),'#9ca3af',{metalness:.7,roughness:.3}),0,-.05);add(cyl(.012,.012,.28,'#6b7280'),0,.38,0,0);
    add(sph(.05,'#ff3b3b',{emissive:'#ff1f1f',emissiveIntensity:1.2}),0,.54,0,1.1);const g=add(wmesh(new T.TorusGeometry(.09,.025,6,10),'#ffd23f',gold),.2,.18,.1,1.06);g.rotation.y=.8;break}
  case 'crystal':{const rg=add(wmesh(new T.TorusGeometry(.27,.025,10,48),'#e5e7eb',gold),0,0,0,0);rg.rotation.x=Math.PI/2;
    [['#ff6fd8',.28,0],['#a855f7',.2,-.5],['#a855f7',.2,.5],['#22d3ee',.14,-.95],['#22d3ee',.14,.95]].forEach(([c,h,a])=>{const g=add(wmesh(new T.OctahedronGeometry(.06,0),c,{emissive:c,emissiveIntensity:.5,roughness:.05}),Math.sin(a)*.27,h/2+.03,Math.cos(a)*.27,1.08);g.scale.y=h/.07});break}
  }}}

/* ---------- winning a new boss gives its hat (base code builds 'h_'+zone().id; the stage id is what we want) ---------- */
// (build.py patches 'h_'+zone().id → 'h_'+zone().sid) ; the win card shows a live 3D thumbnail for hats without a picture
function hatThumbSrc(id){return WHATX[id]&&typeof wThumb==='function'&&wThumb('hat',id)||'art/'+hatPicId(id)+'.webp'}

/* ---------- astronaut suit ---------- */
Object.assign(I18N.en,{astroTitle:'Astronaut suit',astroDesc:'Your tower starts 5 floors high!',astroGo:'Astro boost! +5 floors',astroOnly:'Real purchase'});
Object.assign(I18N.he,{astroTitle:'חליפת אסטרונאוט',astroDesc:'המגדל מתחיל כבר מקומה 5!',astroGo:'קפיצת אסטרונאוט! 5+ קומות',astroOnly:'קנייה אמיתית'});
const ASTRO_FLOORS=5;
WOUT.astro={p:0,real:'astro',n:['Astronaut suit','חליפת אסטרונאוט']};
IAP.products.astro={price:'₪14.90',outfit:'astro',once:1};
const astroOn=()=>mode==='levels'&&lookNow().outfit==='astro'&&wOwned('outfit','astro');
{const _g=IAP.grant;IAP.grant=function(sku){_g(sku);const P=IAP.products[sku];if(!P||!P.outfit)return;const o=progress.owned||(progress.owned={});o.outfit=o.outfit||[];
  if(!o.outfit.includes(P.outfit))o.outfit.push(P.outfit);lookNow().outfit=P.outfit;saveProgress()}}
{const _br=buyReal;buyReal=function(cat,id){if(cat!=='outfit')return _br(cat,id);IAP.buy(wIsReal(cat,id),wName(cat,id)).then(ok=>{if(!ok)return;W3.preview&&(W3.preview.outfit=id);LOB.jump=time;setHero3DSkin();rebakeIfNeeded();renderWardrobe();popupToast(t('thanks'))})}}
{const _nn=wNewIn;wNewIn=function(cat){if(cat!=='outfit')return _nn(cat);const p=WOUT.astro.p;WOUT.astro.p=1e9;try{return _nn(cat)}finally{WOUT.astro.p=p}}}
{const _wr=wRarity;wRarity=function(cat,id){return cat==='outfit'&&id==='astro'?'leg':_wr(cat,id)}}
// the suit: white body suit with grey joints, a chest panel and a glass bubble helmet
{const _bo=buildOutfit;buildOutfit=function(P,kind,base){if(kind!=='astro')return _bo(P,kind,base);const T=P.T,s=P.outfitSlot;
  const pts=[];for(let i=0;i<=24;i++){const y=-.62+i/24*.62;pts.push(new T.Vector2(bodyR(y/.75)+.022,y))}
  winked(s,new T.LatheGeometry(pts,64),wm('#f4f6fb',{roughness:.45,clearcoat:.4}),null,1.015);
  for(const y of[-.5,-.12]){const r=new T.Mesh(new T.TorusGeometry(bodyR(y/.75)+.03,.03,10,64),wm('#9aa3b5',{metalness:.5,roughness:.3}));r.rotation.x=Math.PI/2;r.position.y=y;s.add(r)}
  const pz=surfZ(0,-.3)+.03,pn=winked(s,new T.BoxGeometry(.22,.16,.04),'#3a4255',{metalness:.3,roughness:.4},1.08);pn.position.set(0,-.3,pz);
  [['#ff3b5c',-.06],['#ffd23f',0],['#22d3ee',.06]].forEach(([c,x])=>{const b=wmesh(new T.SphereGeometry(.018,10,8),c,{emissive:c,emissiveIntensity:.8});b.position.set(x,-.3,pz+.025);s.add(b)});
  const fl=wmesh(new T.CircleGeometry(.035,20),'#3aa8ff');fl.position.set(.2,-.2,surfZ(.2,-.2)+.012);s.add(fl);
  const pack=winked(s,new T.BoxGeometry(.34,.36,.14),'#d9dee8',{roughness:.4},1.05);pack.position.set(0,-.28,-(surfZ(0,-.28)+.06));
  for(const sx of[-1,1]){const n=wmesh(new T.CylinderGeometry(.045,.06,.1,16),'#6b7280',{metalness:.6});n.position.set(sx*.1,-.5,-(surfZ(0,-.28)+.06));s.add(n)}
  const helm=new T.Mesh(new T.SphereGeometry(.62,40,28),new T.MeshPhysicalMaterial({color:'#dff3ff',transparent:true,opacity:.22,roughness:.03,clearcoat:1,metalness:0,depthWrite:false}));helm.position.y=.2;s.add(helm);
  const rim=new T.Mesh(new T.TorusGeometry(bodyR(-.05/.75)+.04,.04,10,64),wm('#c0c8d8',{metalness:.6,roughness:.25}));rim.rotation.x=Math.PI/2;rim.position.y=-.05;s.add(rim)}}
// start 5 floors up (not when continuing from a checkpoint — that rebuilds its own floors — and not in the level-1 tutorial)
let astroSkip=false;
{const _cc=continueCheckpoint;continueCheckpoint=function(){astroSkip=true;try{return _cc()}finally{astroSkip=false}}}
{const _sl=startLevel;startLevel=function(lv_){const r=_sl(lv_);if(astroSkip||!astroOn()||level===1)return r;
  for(let i=0;i<ASTRO_FLOORS;i++)tower.push(Object.assign(makeSharliz(),{xs:0}));balance=0;camY=camTarget();updateHud();
  setTimeout(()=>{if(tower.length>ASTRO_FLOORS){popup(t('astroGo'),W/2,yOf(tower.length-1)-BH*1.2,'#22d3ee');try{burst(xOf(0),yOf(0),['#ffffff','#22d3ee','#ffd23f','#ff8a00'],22,320);sfx.flourish&&sfx.flourish(2)}catch(e){}}},700);return r}}
// shop → coins tab: the suit offer (until bought)
const astroOwned=()=>wOwned('outfit','astro');
function astroCard(onBuy){const P=IAP.products.astro,d=document.createElement('div');d.className='st-pack astro-pack';
  const th=(typeof wThumb==='function'&&wThumb('outfit','astro'))||'art/ic_gift.webp';
  d.innerHTML=`<b class="st-t"></b><div class="st-items"><div class="st-it hat"><i class="st-th"><img src="${th}" alt=""></i><span></span><small></small></div></div><button class="st-buy"><em>${P.price}</em></button>`;
  d.querySelector('.st-t').textContent='🚀 '+t('astroTitle');d.querySelector('.hat span').textContent=t('astroTitle');d.querySelector('.hat small').textContent='▲ '+t('astroDesc');
  d.querySelector('.st-buy').onclick=()=>IAP.buy('astro',t('astroTitle')).then(ok=>{if(!ok)return;try{setHero3DSkin();rebakeIfNeeded()}catch(e){}popupToast(t('thanks'));onBuy&&onBuy()});return d}
{const _sb=shopBody;shopBody=function(card){_sb(card);if(shopTab!=='coins'||astroOwned())return;const list=card.querySelector('.shop-list.packs');if(list){const c=astroCard(()=>rerenderOverlay&&rerenderOverlay());const st=list.querySelector('.st-pack');st?st.after(c):list.prepend(c)}}}
