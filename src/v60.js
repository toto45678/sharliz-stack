/* ===== v60: BUDDIES MODELLED IN BLENDER (tools/pets/pets.py → art/pet_<id>.wasm + json, meta injected by build.py) =====
   Tzach: the old buddies (made of simple three.js shapes) looked bad. Each new model is a few smooth low-poly parts with flat
   colours; the shine comes from the lobby lights (MeshPhysical + clearcoat) and the dark outline from an inverted hull pushed
   along the normals. Parts keep their pivot so they can move: wings flutter, the tail wags, eyes blink (Tzach: "blink, move the
   wings a little while it hops around the hero"). Until a model has loaded, the old build is used; when it arrives the lobby
   buddy, thumbnails and the in-level buddy are refreshed (petRefresh, v56). */
const PET3D_META=__PET3D__,PET3D={};
function pet3dLoad(id){const M=PET3D_META[id];if(!M||PET3D[id])return;PET3D[id]='loading';
  fetch('art/pet_'+id+'.wasm?'+M.bytes).then(r=>{if(!r.ok)throw new Error('http '+r.status);return r.arrayBuffer()}).then(buf=>{PET3D[id]=buf;
    try{petRefresh(id);if(typeof W3!=='undefined'&&W3.on)renderWardrobe();if(typeof NEL!=='undefined'&&NEL&&NEL.isConnected)nestRender()}catch(e){}})
  .catch(e=>{console.warn('pet3d',id,e);setTimeout(()=>{PET3D[id]=null},8000)})}
function pet3dAll(){for(const id in PET3D_META)pet3dLoad(id)}
// outline: back faces pushed out along the normal (works for any shape, unlike scaling around the centre)
const INK3={};
function ink3(th){const k=th.toFixed(4);if(INK3[k])return INK3[k];const m=new THREE.MeshBasicMaterial({color:'#120d2b',side:THREE.BackSide});
  m.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed+=normalize(normal)*'+k+';')};
  m.customProgramCacheKey=()=>'ink3_'+k;return INK3[k]=m}
function pet3dBuild(T,id){const M=PET3D_META[id],buf=PET3D[id];const g=new T.Group(),u={g,id,t:Math.random()*5,p3:{},h:M.h,float:M.float||0};B3OPT=B3LOBBY;
  for(const q of M.parts){let o=q.off;const Q=new Int16Array(buf,o,q.v*3),P=new Float32Array(q.v*3);for(let i=0;i<P.length;i++){const k=i%3;P[i]=Q[i]*q.qs[k]+q.qo[k]}o+=Math.ceil(q.v*6/4)*4;const N=new Int8Array(buf,o,q.v*3);o+=Math.ceil(q.v*3/4)*4;
    const I=q.i32?new Uint32Array(buf,o,q.i):new Uint16Array(buf,o,q.i);
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(P,3));geo.setAttribute('normal',new T.BufferAttribute(N,3,true));geo.setIndex(new T.BufferAttribute(I,1));
    const opt={roughness:q.r,clearcoat:q.cc,metalness:q.m||0};if(q.e){opt.emissive=q.e;opt.emissiveIntensity=q.ei||.5}if(q.o<1){opt.transparent=true;opt.opacity=q.o;opt.depthWrite=false}
    const m=wmesh(geo,q.c,opt);m.position.set(q.p[0],q.p[1],q.p[2]);
    if(q.ink>0){const k=new T.Mesh(geo,ink3(q.ink));m.add(k)}
    g.add(m);(u.p3[q.role]=u.p3[q.role]||[]).push(m)}
  u.blinkAt=1+Math.random()*2;return u}
{const _bp=buildPet;buildPet=function(T,id){if(PET3D_META[id]){if(PET3D[id] instanceof ArrayBuffer)return evoWrap(T,id,pet3dBuild(T,id));pet3dLoad(id)}return _bp(T,id)}}
{const _ps=petStep;petStep=function(u,tt,dt){if(!u.p3)return _ps(u,tt,dt);const t=(u.t+=dt),R=u.p3;
  if(u.float){u.g.position.y=.12+Math.sin(t*2.2)*.07;u.g.rotation.y=Math.sin(t*.9)*.35}
  else{const hop=Math.abs(Math.sin(t*3.1));u.g.position.y=hop*.12}
  // wings: a soft flutter, a bigger flap every few seconds
  const A=(PET3D_META[u.id]||{}).anim||{},big=Math.max(0,Math.sin(t*.9))**8,fl=A.wing?Math.sin(t*A.wing[0])*A.wing[1]:Math.sin(t*(7+big*9))*(.16+big*.38);
  (R.wingL||[]).forEach(w=>w.rotation.z=-fl);(R.wingR||[]).forEach(w=>w.rotation.z=fl);
  (R.tail||[]).forEach(w=>w.rotation.y=Math.sin(t*4.2)*.35);
  (R.glow||[]).forEach(m=>{const d=m.userData;if(d.ei===undefined)d.ei=m.material.emissiveIntensity;m.material.emissiveIntensity=d.ei*(.7+.4*Math.sin(t*4.5))});
  // blink
  if(t>u.blinkAt){const b=(t-u.blinkAt)/.16;const k=b<1?1-Math.sin(b*Math.PI)*.9:1;(R.eye||[]).forEach(e=>e.scale.y=k);if(b>=1)u.blinkAt=t+(Math.random()<.2?.25:2+Math.random()*2.5)}}}
// the new dragon hops around you instead of flying (Tzach)
if(typeof PETFLY!=='undefined')for(const id in PET3D_META)if(!PET3D_META[id].float)delete PETFLY[id];
// start fetching right away (small files); the worn buddy is first in line
try{const w=petNow();if(w&&PET3D_META[w])pet3dLoad(w)}catch(e){}
setTimeout(pet3dAll,1500);
