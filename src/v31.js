/* ===== v31: Tzach's comic gags (throw up & melt / zapped to the bones / victory dance), rebuilt with the 3D Sharliz ===== */
const G3={px:150,L:-1.9,R:1.9,TOP:2.75,BOT:-.3,fx:[],ok:null,flash:0};
function g3Ok(){return typeof THREE!=='undefined'&&typeof H3!=='undefined'&&!!H3.baked&&H3.state==='ready'}
function g3Init(){if(G3.r)return true;if(G3.ok===false||!g3Ok())return false;const T=THREE,cw=Math.round((G3.R-G3.L)*G3.px),ch=Math.round((G3.TOP-G3.BOT)*G3.px);
  const prev=B3OPT;B3OPT=B3GAME;
  try{const cv=document.createElement('canvas'),r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true,preserveDrawingBuffer:true});
    r.setPixelRatio(1);r.setSize(cw,ch,false);r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=B3GAME.exp;r.setClearColor(0,0);
    const sc=new T.Scene();studioEnv(T,r,sc);
    const cam=new T.OrthographicCamera(G3.L,G3.R,G3.TOP,G3.BOT,.1,50);cam.position.set(0,0,10);cam.lookAt(0,0,0);
    const P=buildSharliz3D(T),P2=buildSharliz3D(T);sc.add(P.g);sc.add(P2.g);const sk=g3Skeleton(T);sc.add(sk.g);
    Object.assign(G3,{r,cv,cam,sc,P,P2,sk,cw,ch});G3.ok=true}
  catch(e){console.warn('g3',e);G3.ok=false}
  finally{B3OPT=prev}
  return !!G3.r}
function g3Warm(){if(!g3Init())return;const P=G3.P;P.g.visible=true;G3.P2.g.visible=false;G3.sk.g.visible=true;try{G3.r.render(G3.sc,G3.cam)}catch(e){}G3.sk.g.visible=false}

/* a cartoon skull + spine in Tzach's golden-bone style */
function g3Skeleton(T){const g=new T.Group(),bone=new T.MeshPhysicalMaterial({color:'#f2c64e',roughness:.42,clearcoat:.5,clearcoatRoughness:.3}),
    ink=new T.MeshBasicMaterial({color:'#120d2b',side:T.BackSide}),dark=new T.MeshBasicMaterial({color:'#1a1020'});
  const hull=(m,s=1.08)=>{const h=new T.Mesh(m.geometry,ink);h.scale.setScalar(s);m.add(h);return m};
  const skull=new T.Group(),cr=hull(new T.Mesh(new T.SphereGeometry(.3,32,24),bone));cr.scale.set(1,.93,.9);skull.add(cr);
  for(const sx of[-1,1]){const e=new T.Mesh(new T.SphereGeometry(.088,20,14),dark);e.position.set(sx*.112,.03,.228);e.scale.set(1,1.18,.45);skull.add(e)}
  const nose=new T.Mesh(new T.ConeGeometry(.032,.06,3),dark);nose.position.set(0,-.075,.262);nose.rotation.z=Math.PI;nose.scale.z=.35;skull.add(nose);
  const jaw=new T.Group();jaw.position.set(0,-.2,.02);const jm=hull(new T.Mesh(new T.CapsuleGeometry(.075,.17,6,14),bone),1.12);jm.rotation.z=Math.PI/2;jm.scale.set(1,1,.85);jaw.add(jm);
  for(let i=0;i<4;i++){const tt=new T.Mesh(new T.BoxGeometry(.012,.07,.02),dark);tt.position.set(-.06+i*.04,.0,.07);jaw.add(tt)}skull.add(jaw);
  g.add(skull);const verts=[];
  for(let i=0;i<5;i++){const v=new T.Group(),c=hull(new T.Mesh(new T.CylinderGeometry(.085,.095,.085,20),bone),1.12);v.add(c);
    for(const sx of[-1,1]){const w=hull(new T.Mesh(new T.SphereGeometry(.045,12,10),bone),1.15);w.position.set(sx*.1,0,-.01);w.scale.set(1.2,.7,.8);v.add(w)}
    g.add(v);verts.push(v)}
  g.visible=false;return {g,skull,jaw,verts,bone}}

function g3Look(P,col){const prev=B3OPT;B3OPT=B3GAME;
  try{const hat=progress.skin||'none';
    if(col==='hero'||!/^#/.test(col||'')){applyLook(P,Object.assign({},lookNow(),{hat}));persBake(P,'hero')}
    else{applyLook(P,Object.assign({},LOOK0,{colorHex:col,color:'_',hat},PERS_LOOKX[PERS[col]]||{}));persBake(P,col)}
    if(col===GOLDC){P.bodyMat.metalness=.3;P.bodyMat.roughness=.25}
    P._base=P.bodyMat.color.clone();P._baseL=P.lidMat.color.clone();P._em=P.bodyMat.emissive.clone();P._emI=P.bodyMat.emissiveIntensity}
  finally{B3OPT=prev}}
function g3Tint(P,hex,k){if(!P._base)return;const c=new P.T.Color(hex);P.bodyMat.color.copy(P._base).lerp(c,k);P.lidMat.color.copy(P._baseL).lerp(c,k)}
function g3Reset(P){P.g.visible=true;P.g.position.set(0,0,0);P.g.rotation.set(.05,0,0);P.g.scale.set(1,1,1);if(P._base){P.bodyMat.color.copy(P._base);P.lidMat.color.copy(P._baseL);P.bodyMat.emissive.copy(P._em);P.bodyMat.emissiveIntensity=P._emI}
  if(P.spirals)P.spirals.forEach(d=>d.visible=false);for(const n in P.mouths)P.mouths[n].scale.set(1,1,1);setFace3(P,0);persFace(P,0)}
function g3Face(P,f){setFace3(P,f);const prev=B3OPT;B3OPT=B3GAME;try{persFace(P,f)}finally{B3OPT=prev}}
function g3Mouth(P){P.g.updateMatrixWorld(true);const v=new P.T.Vector3();P.mouths.smile.getWorldPosition(v);return [v.x,v.y]}
const G3LEN={bleh:3.2,blehT:3.2,bones:3.9,bonesP:3.9,dance:99};
function g3Len(n){return G3LEN[n]||3}

function g3Start(gg){const {P,P2,sk}=G3;g3Look(P,gg.col);g3Reset(P);P2.g.visible=false;sk.g.visible=false;G3.fx.length=0;G3.flash=0;gg.dir=gg.x<W/2?1:-1;gg.n=0;gg.init=true;
  if(gg.name==='dance'){const cols=tower.map(s=>s.color).filter(c=>c&&c!==gg.col&&c!=='hero'&&/^#/.test(c));gg.col2=cols.length?pick(cols):pick(COLORS.filter(c=>c!==gg.col));g3Look(P2,gg.col2);g3Reset(P2)}
  if(gg.name.startsWith('bones')){sk.g.visible=false;sk.g.position.set(0,0,0);sk.g.rotation.set(.05,0,0);sk.g.scale.setScalar(1.5);gg.loose=[];gg.popped=0;
    sk.verts.forEach((v,i)=>{v.position.set(0,.05+i*.1,0);v.rotation.set(0,0,0)});sk.skull.position.set(0,.8,0);sk.skull.rotation.set(0,0,0);sk.jaw.position.y=-.2}}

function g3Fx(o){G3.fx.push(Object.assign({x:0,y:0,vx:0,vy:0,life:1,sz:.06,c:'#9be15d',grav:0,rot:rnd(0,6)},o));if(G3.fx.length>320)G3.fx.shift()}
function g3Sfx(kind){if(!sfx.ok())return;
  if(kind==='zap'){noise({d:.38,v:.16,hp:1200});tone({f:140,f2:55,d:.4,type:'sawtooth',v:.09,filter:900,vib:30});tone({f:1800,f2:600,d:.18,type:'square',v:.03,delay:.05})}
  if(kind==='clack')tone({f:rnd(700,1300),f2:rnd(400,600),d:.05,type:'square',v:.035,filter:2600});
  if(kind==='bonk')tone({f:260,f2:120,d:.16,type:'triangle',v:.09});
  if(kind==='melt')tone({f:520,f2:90,d:.9,type:'sine',v:.07,vib:9});
  if(kind==='pop')tone({f:500,f2:900,d:.1,type:'triangle',v:.06})}

function g3Pose(gg,dt){const {P,P2,sk}=G3,t=gg.t,D=gg.dir;
  if(gg.name==='bleh'||gg.name==='blehT'){const rainbow=gg.name==='blehT';
    if(t<.75){const u=t/.75;P.g.rotation.z=Math.sin(t*7)*.16;P.g.position.x=Math.sin(t*3.6)*.05;g3Face(P,7);sickEyes(P,1);g3Tint(P,'#8fd14f',.5*u);
      if(t>.5){g3Face(P,4);P.mouths.o.scale.setScalar(1+Math.sin(t*34)*.15);sickEyes(P,1)}}
    else if(t<1.95){const e=t-.75,lean=Math.min(1,e*4)*(e<1.05?1:Math.max(0,1-(e-1.05)*7));P.g.rotation.z=-D*.38*lean;P.g.rotation.y=D*.55*lean;P.g.position.x=0;
      g3Face(P,3);sickEyes(P,1);g3Tint(P,'#8fd14f',.6);const pulse=Math.max(0,Math.sin(e*Math.PI*2.4));P.mouths.scream.scale.set(1+pulse*.2,1+pulse*.4,1);
      if(gg.n===0){gg.n=1;blargh();setTimeout(blargh,520);setTimeout(blargh,1000)}
      if(e<1.1){const [mx,my]=g3Mouth(P);for(let i=0;i<4;i++)g3Fx({kind:'puke',x:mx+D*.05,y:my,vx:D*(rnd(1.3,2.4)+pulse*.8),vy:rnd(.2,1.1)+pulse*.5,grav:-9,life:1.6,sz:rnd(.05,.1),
        c:rainbow?`hsl(${(t*600+rnd(0,70))%360},90%,60%)`:pick(['#9be15d','#7cc83d','#b6f07a','#6aa832'])})}}
    else{const e=t-1.95,u=Math.min(1,e/.85),s=u*u*(3-2*u),wob=Math.sin(e*16)*.06*(1-u);
      if(gg.n===1){gg.n=2;g3Sfx('melt')}
      P.g.rotation.set(.05+s*.25,0,Math.sin(e*9)*.05*(1-u));P.g.scale.set(1+s*.7+wob,1-s*.74,1+s*.5);g3Face(P,s>.5?1:7);sickEyes(P,0);g3Tint(P,'#8fd14f',.6-s*.25);
      if(e<.9&&Math.random()<.5)g3Fx({kind:'drip',x:rnd(-.5,.5)*(1+s*.7),y:rnd(.1,.6)*(1-s),vx:0,vy:-.5,grav:-6,life:.6,sz:rnd(.04,.07),c:'#'+P.bodyMat.color.getHexString()})}}
  else if(gg.name==='bones'||gg.name==='bonesP'){
    if(t<.45){P.g.position.x=Math.sin(t*60)*.03;g3Face(P,3)}
    else if(t<.95){const e=t-.45;if(gg.n===0){gg.n=1;g3Sfx('zap');G3.flash=1;vib([40,30,60])}
      P.g.position.x=Math.sin(t*90)*.05;g3Face(P,3);const ch=Math.min(1,e/.18);g3Tint(P,'#1b1530',ch*.9);P.bodyMat.emissive.set('#6fd3ff');P.bodyMat.emissiveIntensity=(Math.sin(t*70)>0?.6:0)*(1-e/.5);
      if(Math.random()<.7)g3Fx({kind:'spark',x:rnd(-.5,.5),y:rnd(.2,1.5),vx:rnd(-1.5,1.5),vy:rnd(0,1.8),grav:-4,life:.4,sz:rnd(.03,.06),c:pick(['#fff6c0','#9fe6ff','#ffffff'])})}
    else{const e=t-.95;
      if(gg.n===1){gg.n=2;P.g.visible=false;sk.g.visible=true;g3Sfx('pop');for(let i=0;i<18;i++)g3Fx({kind:'ash',x:rnd(-.45,.45),y:rnd(.1,1.4),vx:rnd(-1.4,1.4),vy:rnd(.2,1.6),grav:-3,life:rnd(.6,1.1),sz:rnd(.05,.12),c:pick(['#2b2340','#3d3358','#1b1530','#544a6e'])});
        for(let i=0;i<5;i++)g3Fx({kind:'smoke',x:rnd(-.35,.35),y:rnd(.6,1.4),vx:rnd(-.3,.3),vy:rnd(.3,.6),life:.9,sz:rnd(.12,.2),c:'rgba(200,195,215,.4)'})}
      const nV=sk.verts.length,popAt=i=>.8+i*.24;
      while(gg.popped<nV&&e>popAt(gg.popped)){const v=sk.verts[gg.popped];gg.loose.push({o:v,x:v.position.x,y:v.position.y,vx:(gg.popped%2?1:-1)*rnd(.6,1.5),vy:rnd(.8,1.8),va:rnd(-9,9),r:.06});gg.popped++;g3Sfx('clack')}
      // what is still stacked slides down to fill the gap
      const drop=Math.min(gg.popped,nV)*.1;for(let i=gg.popped;i<nV;i++){const v=sk.verts[i],ty=.05+i*.1-drop;v.position.y+=(ty-v.position.y)*Math.min(1,dt*18);v.rotation.z=Math.sin(t*40+i)*.05}
      const sky=.8-drop;
      if(gg.popped<nV){sk.skull.position.y+=(sky-sk.skull.position.y)*Math.min(1,dt*18);sk.skull.rotation.z=Math.sin(t*22)*.08;sk.jaw.position.y=-.2-Math.abs(Math.sin(t*28))*.035}
      else{if(!gg.sk){gg.sk={y:sk.skull.position.y,vy:0,x:0,vx:D*.35,rz:0}}const S=gg.sk;S.vy-=9*dt;S.y+=S.vy*dt;
        if(S.y<.27){S.y=.27;if(S.vy<-1.2)g3Sfx('bonk');S.vy=-S.vy*.35;S.vx*=.82}S.x+=S.vx*dt;S.vx*=Math.exp(-dt*1.8);S.rz-=S.vx*dt/.28;
        sk.skull.position.set(S.x,S.y,0);sk.skull.rotation.z=S.rz;sk.jaw.position.y=-.2-Math.max(0,Math.sin(t*14))*.05}
      for(const b of gg.loose){b.vy-=9*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.o.rotation.z+=b.va*dt;if(b.y<b.r){b.y=b.r;if(b.vy<-1)g3Sfx('clack');b.vy=-b.vy*.3;b.vx*=.6;b.va*=.5;b.o.rotation.z+=(Math.round(b.o.rotation.z/Math.PI*2)*Math.PI/2-b.o.rotation.z)*.3}b.o.position.set(b.x,b.y,0)}}}
  else if(gg.name==='dance'){const bt=.5,ph=t/bt,beat=Math.floor(ph),u=ph-beat,hop=Math.sin(u*Math.PI);
    const ent=Math.min(1,t/.55),px=2.4+(.5-2.4)*(1-Math.pow(1-ent,3));
    P.g.position.set(-.45,(beat%2===0?hop:hop*.4)*.32,0);P2.g.visible=true;P2.g.position.set(px,(ent<1?Math.abs(Math.sin(t*14))*.25:(beat%2?hop:hop*.4)*.32),0);
    const spin=beat%4===3?u*Math.PI*2:0;P.g.rotation.set(.05,spin,Math.sin(ph*Math.PI)*.16);P2.g.rotation.set(.05,-spin,-Math.sin(ph*Math.PI)*.16);
    const sq=hop<.12?.12:0;P.g.scale.set(1+sq,1-sq,1+sq);P2.g.scale.set(1+sq,1-sq,1+sq);
    const blink=(t%2.6)<.12;g3Face(P,blink?1:2);g3Face(P2,((t+1.1)%2.9)<.12?1:2);
    if(beat!==gg.n){gg.n=beat;if(beat%2===0)g3Fx({kind:'heart',x:rnd(-.8,.8),y:1.7,vx:rnd(-.2,.2),vy:.7,life:1.4,sz:.22,c:pick(['#ff4f8a','#ffd23f','#7ee0ff'])});if(beat===1)g3Sfx('pop')}}}

function g3DrawFx(fx,fy,k,dt){const c=ctx;c.save();
  for(let i=G3.fx.length-1;i>=0;i--){const f=G3.fx[i];f.life-=dt;if(f.life<=0||f.y<-6){G3.fx.splice(i,1);continue}
    f.vy+=f.grav*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;const x=fx+f.x*k,y=fy-f.y*k,r=f.sz*k;c.globalAlpha=Math.min(1,f.life*2.2);
    if(f.kind==='heart'){c.fillStyle=f.c;c.strokeStyle=INK;c.lineWidth=2;heartPath(c,x,y,r*1.2);c.fill();c.stroke()}
    else if(f.kind==='spark'){c.fillStyle=f.c;c.save();c.translate(x,y);c.rotate(f.rot+=dt*8);starPath(c,0,0,r*1.6,r*.5,4);c.fill();c.restore()}
    else if(f.kind==='smoke'){c.fillStyle=f.c;c.beginPath();c.arc(x,y,r*(1.6-f.life*.5),0,7);c.fill()}
    else{c.fillStyle=f.c;c.beginPath();c.ellipse(x,y,r,r*(f.kind==='puke'?.85:1),0,0,7);c.fill();if(f.kind==='puke'&&r>3){c.globalAlpha*=.35;c.strokeStyle=INK;c.lineWidth=1.5;c.stroke()}}}
  c.restore()}
function g3Bolt(x0,y0,x1,y1,seed){const c=ctx;let s=seed;const R=()=>{s=(s*9301+49297)%233280;return s/233280-.5};
  const pts=[[x0,y0]];for(let i=1;i<9;i++){const u=i/9;pts.push([x0+(x1-x0)*u+R()*S*.9,y0+(y1-y0)*u])}pts.push([x1,y1]);
  c.save();c.lineJoin='round';c.lineCap='round';for(const [w,col] of [[S*.32,'rgba(120,200,255,.35)'],[S*.13,'#9fe6ff'],[S*.05,'#ffffff']]){c.strokeStyle=col;c.lineWidth=w;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke()}c.restore()}
function g3Draw(gg){if(!G3.r)return false;const dt=Math.min(.05,frameDt||.016),fx=gg.x,fy=sy(gg.wy)+BH/2,k=BH/1.5;
  if(!gg.init)g3Start(gg);g3Pose(gg,dt);
  try{G3.r.render(G3.sc,G3.cam)}catch(e){return false}
  ctx.drawImage(G3.cv,fx+G3.L*k,fy-G3.TOP*k,(G3.R-G3.L)*k,(G3.TOP-G3.BOT)*k);
  g3DrawFx(fx,fy,k,dt);
  if(gg.name.startsWith('bones')&&gg.t>.45&&gg.t<.82&&Math.sin(gg.t*80)>-.3)g3Bolt(fx+rnd(-1,1)*S*.2,fy-BH*4.5,fx,fy-BH*.95,Math.floor(gg.t*25));
  if(G3.flash>0){ctx.save();ctx.globalAlpha=G3.flash*.55;ctx.fillStyle='#eaf8ff';ctx.fillRect(0,0,W,H);ctx.restore();G3.flash=Math.max(0,G3.flash-dt*3.5)}
  return true}

/* warm the gag renderer shortly after each level starts, so the first fail doesn't hitch */
{const _sl=startLevel;startLevel=function(...a){const r=_sl.apply(this,a);setTimeout(()=>{try{g3Warm()}catch(e){}},1400);return r}}
