/* ===== v33: bosses as real 3D models (Meshy, from Tzach's reference + generated turnaround views), animated live ===== */
const B3D_META=__B3D_META__;
// per-boss rig: regions of the normalised mesh (height 1, feet at y=0) that move procedurally
const B3D_RIG={farm:{wing:{x0:.2,y0:.32,y1:.82,px:.16,py:.6,amp:.32},head:{y0:.62,py:.6,amp:.06},yaw:-.32,bob:.018},
  city:{wing:{x0:.17,y0:.28,y1:.62,px:.14,py:.48,amp:.3},head:{y0:.58,py:.56,amp:.07},yaw:-.32,bob:.02},
  desert:{wing:{x0:.18,y0:.45,y1:.8,px:.15,py:.62,amp:.22},head:{y0:.68,py:.64,amp:.05},sway:{y1:.45,amp:.07,f:2.6},yaw:-.32,hover:.02},
  candy:{wing:{x0:.36,y0:.42,y1:.7,px:.32,py:.56,amp:.22},head:{y0:.7,py:.62,amp:.04},jig:{amp:.022,y0:.12},yaw:-.32,bob:.01},
  snow:{wing:{x0:.24,y0:.3,y1:.78,px:.21,py:.58,amp:.16},head:{y0:.62,py:.6,amp:.05},yaw:-.32,bob:.015},
  ocean:{tent:{y1:.48,amp:.035,n:5},head:{y0:.6,py:.55,amp:.05},yaw:-.32,bob:.02},
  volcano:{head:{y0:.62,py:.6,amp:.07},tail:{z0:.2,amp:.09,f:2.4},yaw:-.45,bob:.012},
  space:{head:{y0:.55,py:.5,amp:.05},yaw:-.32,hover:.035}};
const B3={r:null,cv:null,sc:null,cam:null,mods:{},load:{},t0:0,hit:0,lastHurt:0};
function b3Ok(){return typeof THREE!=='undefined'&&H3&&H3.state==='ready'}
function b3Init(){if(B3.r)return true;if(B3.bad||!b3Ok())return false;const T=THREE;
  try{const cv=document.createElement('canvas'),r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true,preserveDrawingBuffer:true});
    r.setPixelRatio(1);r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;r.setClearColor(0,0);
    const sc=new T.Scene();const prev=B3OPT;B3OPT=B3GAME;try{studioEnv(T,r,sc)}finally{B3OPT=prev}
    const key=new T.DirectionalLight('#fff4e8',1.6);key.position.set(-2,3,4);sc.add(key);sc.add(new T.AmbientLight('#ffffff',.35));
    const cam=new T.OrthographicCamera(-.85,.85,1.2,-.1,.1,20);cam.position.set(0,0,8);cam.lookAt(0,0,0);
    Object.assign(B3,{r,cv,sc,cam});return true}catch(e){console.warn('b3',e);B3.bad=true;return false}}
function b3Load(z){if(!B3D_META[z]||B3.load[z])return;B3.load[z]='loading';if(!b3Init()){B3.load[z]=null;return}const T=THREE,M=B3D_META[z];
  fetch('art/b3d_'+z+'.wasm').then(r=>r.arrayBuffer()).then(buf=>{
    const n=M.n,P=new Float32Array(buf,0,n*3),Nr=new Int8Array(buf,n*12,n*3),U=new Float32Array(buf,n*12+M.nb,n*2),io=n*12+M.nb+n*8,I=M.i32?new Uint32Array(buf,io,M.m):new Uint16Array(buf,io,M.m);
    const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(P,3));g.setAttribute('normal',new T.BufferAttribute(Nr,3,true));g.setAttribute('uv',new T.BufferAttribute(U,2));g.setIndex(new T.BufferAttribute(I,1));
    const tl=new T.TextureLoader(),tx=k=>{if(!M.tex[k])return null;const t=tl.load('art/'+M.tex[k]);t.flipY=false;if(k==='map')t.colorSpace=T.SRGBColorSpace;return t};
    const mr=tx('mr'),mat=new T.MeshStandardMaterial({map:tx('map'),normalMap:tx('nrm'),roughnessMap:mr,metalnessMap:mr,roughness:M.rf,metalness:M.mf,envMapIntensity:.8});
    const U_={uT:{value:0},uFlap:{value:0},uHead:{value:0},uSway:{value:0},uTent:{value:0},uJig:{value:0},uTail:{value:0}},R=B3D_RIG[z]||{};
    const f=v=>(+v).toFixed(3);
    mat.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U_);const w=R.wing,h=R.head,sw=R.sway,te=R.tent,jg=R.jig,tl=R.tail;
      sh.vertexShader='uniform float uT,uFlap,uHead,uSway,uTent,uJig,uTail;\n'+sh.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
        ${jg?`{float k=smoothstep(${f(jg.y0||0)},${f((jg.y0||0)+.3)},transformed.y);transformed.x*=1.+uJig*k*sin(uT*9.+transformed.y*11.);transformed.z*=1.+uJig*k*sin(uT*9.+transformed.y*11.+1.6);}`:''}
        ${te?`{float k=1.-smoothstep(${f(te.y1-.12)},${f(te.y1)},transformed.y);float ang=atan(transformed.z,transformed.x);float r=length(transformed.xz);float d=uTent*k*sin(uT*3.2+ang*${f(te.n||5)}+transformed.y*9.);transformed.xz+=normalize(transformed.xz+1e-5)*d*r*2.;transformed.y+=uTent*k*.35*sin(uT*2.6+ang*3.);}`:''}
        ${sw?`{float k=1.-smoothstep(${f(sw.y1-.15)},${f(sw.y1)},transformed.y);float kk=k*(1.-transformed.y/${f(sw.y1)});transformed.x+=uSway*kk*sin(uT*${f(sw.f||3)}+transformed.y*7.);transformed.z+=uSway*kk*.6*cos(uT*${f(sw.f||3)}*.8+transformed.y*5.);}`:''}
        ${tl?`{float k=smoothstep(${f(tl.z0)},${f(tl.z0+.5)},-transformed.z);transformed.x+=uTail*k*k*sin(uT*${f(tl.f||2.4)}+transformed.z*4.);}`:''}
        ${w?`{float s=sign(transformed.x),ax=abs(transformed.x);float k=smoothstep(${f(w.x0)},${f(w.x0+.12)},ax)*smoothstep(${f(w.y0-.06)},${f(w.y0)},transformed.y)*(1.-smoothstep(${f(w.y1)},${f(w.y1+.08)},transformed.y));
          float a=uFlap*k*s;vec2 p=vec2(transformed.x-s*${f(w.px)},transformed.y-${f(w.py)});float c=cos(a),sn=sin(a);transformed.xy=vec2(p.x*c-p.y*sn+s*${f(w.px)},p.x*sn+p.y*c+${f(w.py)});}`:''}
        ${h?`{float k=smoothstep(${f(h.y0-.05)},${f(h.y0+.05)},transformed.y);float a=uHead*k;vec2 p=vec2(transformed.x,transformed.y-${f(h.py)});float c=cos(a),sn=sin(a);transformed.xy=vec2(p.x*c-p.y*sn,p.x*sn+p.y*c+${f(h.py)});}`:''}
      `)};
    const mesh=new T.Mesh(g,mat),grp=new T.Group();grp.add(mesh);grp.visible=false;B3.sc.add(grp);
    B3.mods[z]={grp,mesh,mat,U:U_,R,z};B3.load[z]='ok'}).catch(e=>{console.warn('b3 load',e);B3.load[z]='fail'})}
function b3Ready(z){if(!B3D_META[z])return null;if(!B3.load[z])b3Load(z);return B3.load[z]==='ok'?B3.mods[z]:null}
// draws the boss into the current ctx (already translated to the boss centre); bh = on-screen height of the boss
function b3Draw(b,bh,mod){const T=THREE,R=mod.R,t=ft,r=B3.r,d=Math.min(2,DPR||1),cw=Math.round(Math.min(1100,bh*1.7*d)),ch=Math.round(cw*1.3/1.7);
  if(B3.cv.width!==cw||B3.cv.height!==ch)r.setSize(cw,ch,false);
  for(const k in B3.mods)B3.mods[k].grp.visible=B3.mods[k]===mod;
  const g=mod.grp,U=mod.U,stun=b.stun>0&&!b.dead,wind=b.wind>0,hurt=b.hurt>0;
  // idle: proud bob + lazy flaps; wind-up: crouch + fast flaps; hurt: recoil; dizzy: wobble + droop
  let flap=Math.sin(t*3.2)*.45+Math.sin(t*1.3)*.15,yaw=R.yaw||0,rz=0,rx=0,y=Math.sin(t*2.1)*(R.bob||.02),sq=1,head=Math.sin(t*1.7)*(R.head?R.head.amp:0);
  if(wind){flap=Math.sin(t*14)*1.0;y-=.02;sq=1+Math.sin(t*14)*.03;head=-.08}
  if(stun){flap=-.35+Math.sin(t*2.2)*.12;rz=Math.sin(t*3.1)*.12;yaw+=Math.sin(t*1.7)*.35;head=Math.sin(t*4.4)*.18;y=-.01}
  if(hurt){const k=Math.min(1,b.hurt*3);rx=-.18*k;rz+=Math.sin(t*40)*.06*k;flap=.9*k}
  const sw=R.sway?R.sway.amp:0,te=R.tent?R.tent.amp:0,jg=R.jig?R.jig.amp:0,tlA=R.tail?R.tail.amp:0;let swK=1,teK=1,jgK=1,sc=1,em=0;
  if(wind){swK=2;teK=2;jgK=2.2;rx-=.12*Math.min(1,(.8-b.wind)*3)}if(stun){swK=.6;teK=.4;jgK=1.6}if(hurt){jgK=3;teK=1.8}
  // signature attack move, right when the attack lands (b.atkAt)
  const at=b.atkAt?(time-b.atkAt)/.95:9;
  if(at>=0&&at<1&&!b.dead){const A=at,s=Math.sin(A*Math.PI),z=mod.z;
    if(z==='farm'){flap=Math.sin(A*30)*1.5;rx+=.28*s;sc+=.12*s;head=-.16*s}
    else if(z==='city'){y+=.09*s;flap=Math.sin(A*26)*1.3;rz+=.1*Math.sin(A*12)}
    else if(z==='desert'){yaw+=A*Math.PI*2;swK=3.2;y+=.05*s}
    else if(z==='candy'){y+=.13*Math.abs(Math.sin(A*Math.PI*2));sq=1+.16*Math.cos(A*Math.PI*4)*(1-A);jgK=4.5}
    else if(z==='snow'){flap=A<.45?-1.4*(A/.45):1.6*(1-(A-.45)/.55);rx+=A<.45?-.16*(A/.45):.22*(1-(A-.45)/.55);yaw+=A<.45?.25*(A/.45):.25*(1-(A-.45)/.55)}
    else if(z==='ocean'){teK=5.5;y+=.07*s;sc+=.08*s;rz+=.08*Math.sin(A*18)}
    else if(z==='volcano'){y+=A<.4?.16*(A/.4):.16*Math.max(0,1-(A-.4)/.12);head=-.22*s;swK=3;if(A>.52&&A<.6)sq=1.12}
    else if(z==='space'){yaw+=A*Math.PI*3;rz+=.28*Math.sin(A*Math.PI*2);y+=.06*s}}
  // phase change: a big roar pulse
  const pt=b.phAt?(time-b.phAt)/1.1:9;if(pt>=0&&pt<1&&!b.dead){const s=Math.sin(pt*Math.PI);sc+=.14*s;head-=.2*s;rz+=Math.sin(pt*50)*.04*s;flap=Math.sin(pt*28)*1.2;jgK=Math.max(jgK,4);teK=Math.max(teK,4);mod.roar=s}else mod.roar=0;
  // entrance: spins in and grows
  if(b.shown<1&&!b.dead){const e=b.shown,u=1-e;yaw+=u*u*Math.PI*1.6;sc*=.65+.35*e}
  // defeat: knocked back, then spins, shrinks and flies off
  if(b.dead){const k=time-b.dead;if(k<.35){const u=k/.35;rx=-.45*u;rz=Math.sin(k*60)*.08;em=.7*(1-u);head=-.2;flap=1.2}
    else{const u=(k-.35)/1.15;yaw+=u*u*14;rz=Math.sin(u*9)*.3;sc*=Math.max(.05,1-u*.95);y+=u*u*1.3;rx=-.45;head=Math.sin(u*30)*.2;flap=Math.sin(u*40)*1.2;
      ctx.globalAlpha=Math.max(0,Math.min(1,(1-u)*2.5))}}
  U.uT.value=t;U.uFlap.value=flap*(R.wing?R.wing.amp:0);U.uHead.value=head;U.uSway.value=sw*swK;U.uTent.value=te*teK;U.uJig.value=jg*jgK;U.uTail.value=tlA*swK;
  if(R.hover){y+=Math.sin(t*1.6)*R.hover;rz+=Math.sin(t*1.1)*.06}
  const S0=(R.sc||1)*sc;g.position.set(0,y,0);g.rotation.set(rx,yaw,rz);g.scale.set(S0/sq,S0*sq,S0/sq);
  if(hurt&&Math.floor(b.hurt*14)%2===0)em=Math.max(em,.55);const rr=mod.roar||0;mod.mat.emissive.setRGB(Math.max(em,.45*rr),em+.04*rr,em+.02*rr);
  r.render(B3.sc,B3.cam);ctx.drawImage(B3.cv,-.85*bh,bh/2-1.2*bh,1.7*bh,1.3*bh);return true}
