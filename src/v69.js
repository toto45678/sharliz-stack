/* v69: SERIES LOOK (Tzach, Oct 24: 'same shape as now, only the render like the Sharlizes in the series'). Every 3D Sharliz
   (lobby hero, My hero, thumbnails, mini buddy, gags and the baked in-game sprites) keeps its exact shape but loses the black
   ink hulls (body, eyes, hats, glasses, outfits), the eyes sit in a socket of darker body colour, the body darkens towards the
   bottom like Bobby in the series, the eyes are soft porcelain, the blush is faint, and the brows of the worrier and the grump
   are gone (no eyebrows on Sharliz, Tzach Oct 16). Sample approved Oct 24: /mnt/project-files/game/series-look/sample_v1.jpg. Plus a Brawl-Stars-like rim light on the right edge of the body (Tzach chose the strong one, rim_sample.jpg #3). Also a new top hat (below).
   Shape, faces and looks stay in base.html; this only re-dresses the materials after buildSharliz3D / applyLook / persBake. */
(()=>{const INKHEX=0x120d2b;
  function isInk(m,T){return m&&m.isMeshBasicMaterial&&m.color&&m.color.getHex()===INKHEX}
  function slSockets(P,base){const T=P.T;if(!P.slSock){P.slSock=[];
      for(const e of P.eyes)for(const o of e.children)if(o.isMesh&&isInk(o.material,T)&&o.material.side===T.BackSide){
        o.material=new T.MeshPhysicalMaterial({color:'#000000',roughness:.55});o.scale.set(1.07,1.055,.55);P.slSock.push(o)}}
    const c=new T.Color(base||'#ff6b98').multiplyScalar(.6);for(const o of P.slSock)o.material.color.copy(c)}
  function slBody(P){if(P.slBody)return;P.slBody=1;const M=P.bodyMat;
    M.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying float vSY;').replace('#include <begin_vertex>','#include <begin_vertex>\nvSY=position.y;');
      s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying float vSY;').replace('#include <color_fragment>','#include <color_fragment>\n{float k=smoothstep(-.75,.6,vSY);diffuseColor.rgb*=mix(vec3(.6,.64,.8),vec3(.98),k);}').replace('#include <opaque_fragment>','{vec3 n=normalize(normal);float f=1.-abs(dot(n,normalize(vViewPosition)));f=smoothstep(.62,.92,f)*smoothstep(-.1,.7,dot(n,normalize(vec3(.85,.45,0.))));outgoingLight+=vec3(1.,.95,.85)*f*1.3;}\n#include <opaque_fragment>')};
    M.customProgramCacheKey=()=>'slbody2';M.needsUpdate=true}
  function slTune(P){const T=P.T,M=P.bodyMat;if(!M.metalness){M.roughness=.3;M.clearcoat=.6;M.clearcoatRoughness=.18;M.sheen=0;M.envMapIntensity=1.1*B3OPT.env/.9}
    const E=P.eyeMat;if(!E.map&&E.emissiveIntensity<.5){E.emissiveIntensity=.06;E.roughness=.18;E.clearcoat=.9;E.clearcoatRoughness=.08;if(E.color.getHex()===0xffffff)E.color.set('#f4f3fa')}
    E.needsUpdate=true;M.needsUpdate=true;
    // every other ink hull (body, hats, glasses, outfits, lashes' backs) goes away
    P.g.traverse(o=>{if(o.isMesh&&isInk(o.material,T)&&o.material.side===T.BackSide)o.visible=false})}
  function slBlush(P){P.m.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='CircleGeometry'&&o.material&&o.material.transparent&&(o.material.opacity===.38||o.material.opacity===.75))o.material.opacity*=.35})}
  window.seriesLook=function(P,base){try{slSockets(P,base);slBody(P);slTune(P);slBlush(P)}catch(e){console.warn('seriesLook',e)}};
  const b0=buildSharliz3D;buildSharliz3D=function(T){const P=b0.apply(this,arguments);seriesLook(P,'#ff6b98');return P};
  const a0=applyLook;applyLook=function(P,L){const r=a0.apply(this,arguments);const C=WCOL[L&&L.color]||{};seriesLook(P,(L&&L.colorHex)||C.c||'#ff6b98');return r};
  if(typeof persBake==='function'){const p0=persBake;persBake=function(P,col){const r=p0.apply(this,arguments);
    if(P.persG)P.persG.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='CapsuleGeometry'&&isInk(o.material,P.T))o.visible=false});slBlush(P);return r}}
  /* TOP HAT from the ChatGPT drawing (Tzach picked the code-built version over the Higgsfield 3D model, Oct 24,
     /mnt/project-files/game/series-look/tophat_test.jpg): crown flares out to the top, brim curls up at the edge, satin band */
  const h0=buildHat;buildHat=function(P,id){if(id!=='tophat'&&id!=='h_gold')return h0.apply(this,arguments);
    const T=P.T,gold=id==='h_gold',o=gold?{metalness:.7,roughness:.2}:{roughness:.38,clearcoat:.6,clearcoatRoughness:.2,sheen:.5,sheenColor:new T.Color('#6a5a8a')},c=gold?'#ffc93c':'#1d1530',g=new T.Group();
    const cr=[];for(let k=0;k<=24;k++){const t=k/24;cr.push(new T.Vector2(.215+.05*Math.pow(t,2.2)-.012*Math.sin(t*Math.PI),.03+t*.47))}cr.push(new T.Vector2(.18,.505),new T.Vector2(0,.51));
    g.add(wmesh(new T.LatheGeometry(cr,64),c,o));
    const br=[];for(let k=0;k<=16;k++){const t=k/16;br.push(new T.Vector2(.2+t*.24,.03*t*t))}for(let k=16;k>=0;k--){const t=k/16;br.push(new T.Vector2(.2+t*.24,.03*t*t+.022))}
    g.add(wmesh(new T.LatheGeometry(br,72),c,o));
    const bd=[];for(let k=0;k<=8;k++){const t=k/8;bd.push(new T.Vector2(.222+.006*Math.sin(t*Math.PI)+.004*t,.035+t*.1))}g.add(wmesh(new T.LatheGeometry(bd,64),'#e8283f',{roughness:.3,clearcoat:.5,sheen:.6,sheenColor:new T.Color('#ff9aa8')}));
    g.rotation.z=-.06;P.hatSlot.add(g)};
})();
/* HATS batch 1 rebuilt in code from the graphics department's ChatGPT sheet (/mnt/project-files/game/series-look/acc/hats1.png, Oct 24):
   party, cowboy, viking, propeller, chef, flowers, wizard, pirate (bicorne), king, beanie. Same slot and size as before, series look (no ink). */
(()=>{
  const V2=(x,y)=>new THREE.Vector2(x,y);
  // parametric surface: fn(u,v) -> [x,y,z]; u wraps around when wrap (normals averaged at the seam)
  function surf(nu,nv,fn,wrap){const T=THREE,p=[],uv=[],ix=[];for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){const q=fn(i/nu,j/nv);p.push(q[0],q[1],q[2]);uv.push(i/nu,j/nv)}
    for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+1,c=a+nu+1,d=c+1;ix.push(a,b,c,b,d,c)}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();
    if(wrap){const n=g.attributes.normal;for(let j=0;j<=nv;j++){const a=j*(nu+1),b=a+nu;const x=n.getX(a)+n.getX(b),y=n.getY(a)+n.getY(b),z=n.getZ(a)+n.getZ(b),l=Math.hypot(x,y,z)||1;n.setXYZ(a,x/l,y/l,z/l);n.setXYZ(b,x/l,y/l,z/l)}}
    return g}
  // thin shell: same surface pushed out by th along its normal and the rim closed (gives brims thickness)
  function shell(nu,nv,fn,th){const T=THREE,A=surf(nu,nv,fn,1),pa=A.attributes.position,na=A.attributes.normal,N=pa.count,p=new Float32Array(N*6),ix=[];
    for(let i=0;i<N;i++){for(let k=0;k<3;k++){p[i*3+k]=pa.array[i*3+k];p[(N+i)*3+k]=pa.array[i*3+k]+na.array[i*3+k]*th}}
    const I=A.index.array;for(let i=0;i<I.length;i+=3){ix.push(I[i],I[i+1],I[i+2]);ix.push(N+I[i],N+I[i+2],N+I[i+1])}
    for(const j of[0,nv])for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+1;j?ix.push(a,b,N+a,b,N+b,N+a):ix.push(a,N+a,b,b,N+a,N+b)}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();return g}
  function taper(T,pts,r0,r1,n=40,rad=14){const cu=new T.CatmullRomCurve3(pts),g=new T.TubeGeometry(cu,n,1,rad,false),p=g.attributes.position;
    for(let i=0;i<=n;i++){const t=i/n,c=cu.getPointAt(t),r=r0+(r1-r0)*Math.pow(t,.9);for(let j=0;j<=rad;j++){const k=i*(rad+1)+j;p.setXYZ(k,c.x+(p.getX(k)-c.x)*r,c.y+(p.getY(k)-c.y)*r,c.z+(p.getZ(k)-c.z)*r)}}
    g.computeVertexNormals();return {g,end:cu.getPointAt(1),start:cu.getPointAt(0)}}
  function fluff(T,r,seed=1){const g=new T.SphereGeometry(r,56,40),p=g.attributes.position,v=new T.Vector3();
    for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).normalize();const n=Math.sin(v.x*23+seed)*Math.sin(v.y*21+seed*2)*Math.sin(v.z*25+seed*3)+.5*Math.sin(v.x*41-v.z*37+seed)*Math.sin(v.y*43);v.multiplyScalar(r*(1+.07*n));p.setXYZ(i,v.x,v.y,v.z)}
    g.computeVertexNormals();return g}
  function starGeo(T,R,r,d,n=5){const sh=new T.Shape();for(let k=0;k<n*2;k++){const a=Math.PI/2+k*Math.PI/n,rr=k%2?r:R;k?sh.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):sh.moveTo(Math.cos(a)*rr,Math.sin(a)*rr)}
    const g=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelSize:d*.8,bevelThickness:d*.8,bevelSegments:3});g.translate(0,0,-d/2);return g}
  function moonGeo(T,R,d){const sh=new T.Shape();sh.absarc(0,0,R,Math.PI*.35,Math.PI*1.65,false);sh.absarc(R*.45,0,R*.78,Math.PI*1.55,Math.PI*.45,true);
    const g=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelSize:d*.7,bevelThickness:d*.7,bevelSegments:3,curveSegments:24});g.translate(0,0,-d/2);return g}
  const dmesh=(geo,c,o)=>wmesh(geo,c,Object.assign({side:THREE.DoubleSide},o));
  const GOLD={metalness:.75,roughness:.22,clearcoat:.4};
  // put an object on a point facing outward from the hat axis
  const face=(o,x,y,z,tilt=0)=>{o.position.set(x,y,z);o.lookAt(x*3,y+tilt,z*3)};
  // band over the head along its outline (s=-1..1 = left ear .. top .. right ear); w = how far down the sides
  function hband(T,c,o,rad=.024,off=.02,w=1){const y0=-.17*w-.0,pts=[];for(let k=0;k<=48;k++){const s=k/24-1,y=y0+(.09-y0)*(1-s*s),r=bodyR(Math.min(.999,(.66+y)/.75));pts.push(new T.Vector3(Math.sign(s)*(r+off*Math.sqrt(Math.abs(s))),y+off*(1-Math.abs(s)),0))}
    const m=wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),96,rad,12),c,o);m.scale.z=1.5;return m}
  function gemAt(g,a,y,R,c,s=1,at){const T=THREE,m=wmesh(new T.OctahedronGeometry(.05*s,0),c,{roughness:.05,clearcoat:1,emissive:c,emissiveIntensity:.18});m.scale.set(.8,1.1,.45);const set=wmesh(new T.TorusGeometry(.05*s,.01*Math.max(.7,s),8,6),'#ffd66a',GOLD);set.scale.set(.85,1.15,1);
    const p=at||new T.Vector3(Math.sin(a)*R,y,Math.cos(a)*R);face(m,p.x,p.y,p.z);face(set,p.x*.995,p.y,p.z*.995);set.rotateZ(Math.PI/6);g.add(m);g.add(set)}
  function crownBand(g,R,hf,c,o=GOLD,ball){const T=THREE;g.add(dmesh(shell(150,10,(u,v)=>{const a=u*Math.PI*2,y=v*hf(a),r=R+.03*y/.2;return [Math.sin(a)*r,y,Math.cos(a)*r]},.018),c,o));
    const t=wmesh(new T.TorusGeometry(R+.02,.015,10,72),ball?'#f1b630':c,GOLD);t.rotation.x=Math.PI/2;t.position.y=.008;g.add(t)}
  // a gold tube along a crown's top edge (height function hf(angle), radius R)
  function furGeo(geo,amp=.05,f=80){const p=geo.attributes.position,v=new THREE.Vector3();geo.computeVertexNormals();const nr=geo.attributes.normal,nv=new THREE.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);nv.fromBufferAttribute(nr,i);const n=Math.sin(v.x*f+v.y*f*.43)*Math.sin(v.y*f*.77)*Math.sin(v.z*f*1.05+v.x*7);v.addScaledVector(nv,amp*n);p.setXYZ(i,v.x,v.y,v.z)}geo.computeVertexNormals();return geo}
  // shell fur: real hair strands as stacked alpha-tested layers along the normal (cat/bunny/wolf/unicorn ears, fur bands)
  function hairTex(rep,o={}){const D=o.key==='hairD'?{n:16000,r:[1.4,1.4],a:[.7,.3],mid:.6}:{n:7500,r:[2.5,3.5],a:[.55,.45]};const t=canvasTex(o.key||'hairC',512,512,(c,w,h)=>{c.fillStyle='#000';c.fillRect(0,0,w,h);let s=7;const R=()=>(s=(s*16807)%2147483647)/2147483647;
      for(let i=0;i<D.n;i++){const x=R()*w,y=R()*h,r=D.r[0]+R()*D.r[1],v=D.a[0]+R()*D.a[1],gr=c.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(255,255,255,${v})`);if(D.mid)gr.addColorStop(D.mid,`rgba(255,255,255,${v*.6})`);gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(x-r,y-r,2*r,2*r)}}).clone();
    t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);t.needsUpdate=true;return t}
  // painted fur colour map with baked fake light: darker roots at the bottom, lit top-left side, combed strands (Tzach: 'paint fake lighting on the maps')
  function furPaint(key,col,stripe){return canvasTex('fp2_'+key,256,256,(c,w,h)=>{const C=new THREE.Color(col);c.fillStyle=col;c.fillRect(0,0,w,h);let s=11;const R=()=>(s=(s*16807)%2147483647)/2147483647;
      if(stripe){c.fillStyle=stripe;for(let i=0;i<6;i++){c.beginPath();c.ellipse(w/2,i*h/6+20,w*.6,10+R()*4,0,0,7);c.fill()}}
      for(let i=0;i<2600;i++){const x=R()*w,y=R()*h,l=6+R()*14,d=R()<.5;c.strokeStyle=d?'rgba(0,0,0,.16)':'rgba(255,255,255,.22)';c.lineWidth=1+R();c.beginPath();c.moveTo(x,y);c.lineTo(x+(R()-.5)*3,y-l);c.stroke()}
      const gv=c.createLinearGradient(0,h,0,0);gv.addColorStop(0,'rgba(20,10,30,.62)');gv.addColorStop(.5,'rgba(0,0,0,0)');gv.addColorStop(1,'rgba(255,255,255,.38)');c.fillStyle=gv;c.fillRect(0,0,w,h);
      const gu=c.createLinearGradient(0,0,w,0);gu.addColorStop(0,'rgba(255,255,255,.0)');gu.addColorStop(.2,'rgba(255,255,255,.28)');gu.addColorStop(.42,'rgba(255,255,255,0)');gu.addColorStop(.7,'rgba(0,0,0,.18)');gu.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gu;c.fillRect(0,0,w,h)})}
  // furPaint v2 (cat ears; 'bun'/'uni' keep furPaint): lathe UV u=0 front(+z), .25 +x, .5 back, .75 -x; v roots->tip. Combed strokes (o.stroke alphas) first, then 3-4 broad DIAGONAL stripes (o.angle deg, o.ry px, o.rx*w wide,
  // soft edge alphas o.sa) spanning the back and the outer front lobes; the pink footprint (u +-.11, below v o.frontV) restored in o.front (pinkish, so hairs over the pink read as pink fur) with an AO band o.ao at its edge; baked light: o.gv root->tip stops, o.keyStops key light over u (lit at u~.85 = screen top-left)
  function furPaint2(key,col,stripe,o={}){return canvasTex('fp3_'+key,256,256,(c,w,h)=>{c.fillStyle=col;c.fillRect(0,0,w,h);let s=11;const R=()=>(s=(s*16807)%2147483647)/2147483647;const rgba=(C,a)=>`rgba(${C.r*255|0},${C.g*255|0},${C.b*255|0},${a})`;
      const sk=o.stroke||[.16,.22];for(let i=0;i<2600;i++){const x=R()*w,y=R()*h,l=8+R()*14,d=R()<.5;c.strokeStyle=d?`rgba(0,0,0,${sk[0]})`:`rgba(255,255,255,${sk[1]})`;c.lineWidth=1+R();c.beginPath();c.moveTo(x,y);c.lineTo(x+l*.21+(R()-.5)*3,y-l*.98);c.stroke()}
      if(stripe){const S=new THREE.Color(stripe),ang=(o.angle===undefined?-28:o.angle)*Math.PI/180;for(const v of(o.at||[.2,.45,.7,.92])){const y=(1-v)*h,ry=(o.ry||22)+R()*5,sa=o.sa||[.3,.5,1];for(const[k,a]of[[11,sa[0]],[5,sa[1]],[0,sa[2]]]){c.fillStyle=rgba(S,a);c.beginPath();c.ellipse(w/2,y,w*(o.rx||.72),ry+k,ang,0,7);c.fill()}}
        const F=new THREE.Color(o.front||col),m=c.createLinearGradient(0,0,w,0);const hm=(C,A,y0,y1)=>{const g=c.createLinearGradient(0,0,w,0);for(const[p,q]of[[0,1],[.07,1],[.11,0],[.89,0],[.93,1],[1,1]])g.addColorStop(p,rgba(C,q*A));c.fillStyle=g;c.fillRect(0,y0,w,y1-y0)};hm(F,1,0,h);const G=new THREE.Color(col),fv=o.frontV||.72;hm(G,1,0,(1-fv-.05)*h);hm(G,.5,(1-fv-.05)*h,(1-fv+.03)*h)}
      // item 4: AO on the grey side of the seam -- a dark band around the pink footprint (u +-.105), full height; not for the tuft map
      if(o.key!==false){const ao=c.createLinearGradient(0,0,w,0);for(const[p,q]of[[0,0],[.07,0],[.11,.35],[.15,0],[.85,0],[.89,.35],[.93,0],[1,0]])ao.addColorStop(p,`rgba(0,0,0,${q*(o.ao===undefined?1:o.ao/.35)})`);c.fillStyle=ao;c.fillRect(0,0,w,h)}
      const gv=c.createLinearGradient(0,h,0,0);for(const[p,q]of(o.gv||[[0,'rgba(20,10,30,.62)'],[.5,'rgba(20,10,30,0)'],[1,'rgba(255,255,255,.45)']]))gv.addColorStop(p,q);c.fillStyle=gv;c.fillRect(0,0,w,h);
      if(o.key!==false){const gu=c.createLinearGradient(0,0,w,0);for(const[p,q]of(o.keyStops||[[0,'rgba(255,255,255,.14)'],[.15,'rgba(255,255,255,0)'],[.4,'rgba(0,0,0,.32)'],[.6,'rgba(0,0,0,.1)'],[.85,'rgba(255,255,255,.3)'],[1,'rgba(255,255,255,.14)']]))gu.addColorStop(p,q);c.fillStyle=gu;c.fillRect(0,0,w,h)}})}
  function furShells(geo,c,o={}){const T=THREE,L=o.layers||12,len=o.len||.03,g=new T.Group(),am=hairTex(o.rep||[6,6],{key:o.hair}),up=new T.Vector3(...(o.up||[0,1,0])),ramp=o.ramp||[.55,.6],at=o.at||[.06,.8],shI=o.sheenI===undefined?1:o.sheenI;
    geo=geo.index?geo.toNonIndexed():geo.clone();geo.computeVertexNormals();const P0=geo.attributes.position,N0=geo.attributes.normal;
    const base=wmesh(geo,typeof c==='string'?new THREE.Color(c).multiplyScalar(o.baseMul||.5).getStyle():c,Object.assign({roughness:.9,clearcoat:0,sheen:shI,sheenRoughness:.4,sheenColor:new T.Color(o.sheen||'#ffffff')},o.mat||{}));g.add(base);
    for(let i=1;i<=L;i++){const t=i/L,ge=geo.clone(),p=ge.attributes.position;for(let k=0;k<p.count;k++){const d=len*t;p.setXYZ(k,P0.getX(k)+N0.getX(k)*d+up.x*len*t*t*.5,P0.getY(k)+N0.getY(k)*d+up.y*len*t*t*.5,P0.getZ(k)+N0.getZ(k)*d+up.z*len*t*t*.5)}
      const m=wm(typeof c==='string'?c:'#ffffff',Object.assign({roughness:.9,clearcoat:0,sheen:shI,sheenRoughness:.45,sheenColor:new T.Color(o.sheen||'#ffffff'),alphaMap:am,alphaTest:at[0]+t*at[1],side:T.DoubleSide},o.mat||{}));
      if(typeof c!=='string'&&c.map){m.map=c.map}m.color.multiplyScalar(ramp[0]+ramp[1]*t);g.add(new T.Mesh(ge,m))}
    return g}
  function edgeTrim(g,hf,R,c,rad){const T=THREE,pts=[];for(let i=0;i<220;i++){const a=i/220*Math.PI*2,y=hf(a);pts.push(new T.Vector3(Math.sin(a)*(R+.03*y/.2+.01),y,Math.cos(a)*(R+.03*y/.2+.01)))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts,true),440,rad,8,true),c,GOLD))}
  function miniPumpkin(T,r){const p=new T.Group(),b=surf(40,16,(u,v)=>{const a=u*Math.PI*2,q=2*v-1,rr=r*Math.sqrt(Math.max(0,1-q*q))*(1-.09*Math.pow(Math.abs(Math.sin(a*4)),.7));return [Math.sin(a)*rr,q*r*.8,Math.cos(a)*rr]},1);p.add(wmesh(b,'#ff7a1a',{roughness:.35,clearcoat:.6}));
    const s=wmesh(new T.CylinderGeometry(r*.12,r*.18,r*.5,10),'#3c9a3a',{roughness:.4});s.position.y=r*.95;p.add(s);return p}
  function featherGeo(T){const sh=new T.Shape();sh.moveTo(0,0);sh.bezierCurveTo(.06,.08,.055,.24,0,.32);sh.bezierCurveTo(-.055,.24,-.06,.08,0,0);const ge=new T.ExtrudeGeometry(sh,{depth:.006,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:2,curveSegments:16});const p=ge.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,p.getZ(i)-Math.abs(x)*.35+(y*y)*.2)}ge.computeVertexNormals();return ge}
  function leafGeo(T){const sh=new T.Shape();sh.moveTo(0,0);sh.bezierCurveTo(.09,.06,.08,.2,0,.27);sh.bezierCurveTo(-.08,.2,-.09,.06,0,0);const ge=new T.ExtrudeGeometry(sh,{depth:.003,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:1,curveSegments:14});const p=ge.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,p.getZ(i)-x*x*2.5+y*y*.4)}ge.computeVertexNormals();return ge}
  function ghostMesh(T,mo,k){const pts=[];for(let i=0;i<=20;i++){const f=i/20;pts.push(V2(Math.max(.001,Math.sin(Math.min(1,f*1.5)*Math.PI/2)*.055),.13-f*.13))}pts.reverse();const ge=new T.LatheGeometry(pts,32),p=ge.attributes.position;for(let i=0;i<p.count;i++){if(p.getY(i)<.02){const a=Math.atan2(p.getZ(i),p.getX(i));p.setY(i,p.getY(i)+Math.sin(a*5)*.012)}}ge.computeVertexNormals();
    const gr=new T.Group(),m=new T.Mesh(ge,wm(mo.color,mo));gr.add(m);for(const sx of[-1,1]){const e=wmesh(new T.SphereGeometry(.009,8,6),'#2a2a4a');e.position.set(sx*.018,.085,.05);gr.add(e)}gr.scale.setScalar(k*1.3);return gr}
  // cat-ear teardrop lathe profile: r(t)=R*(1-t)^e*(1+k*sin(t*pi)) -> round shoulders, pointed tip (body: e .55 k .35, pink inner: e .6 k .5)
  const catLp=(R,H,e,k,n=24)=>{const p=[];for(let i=0;i<=n;i++){const t=i/n;p.push(V2(Math.max(.002,R*Math.pow(1-t,e)*(1+k*Math.sin(t*Math.PI))),t*H-H/2))}return p};
  // hanging loop + stem that ties an earring to the band (x,y = loop centre)
  const earHang=(T,g,x,y,z)=>{const lp=wmesh(new T.TorusGeometry(.016,.005,8,20),'#f1b630',GOLD);lp.position.set(x,y,z);g.add(lp);const st=wmesh(new T.CylinderGeometry(.006,.006,.06,10),'#f1b630',GOLD);st.position.set(x,y+.02,z-.025);st.rotation.x=-.8;g.add(st)};
  // headband arc (same curve as hband: off .022): bandPt(s) -> [x,y] of the tube centre, bandY(x) -> y of the tube centre at hat x
  const bandPt=(s,off=.022)=>{const y0=-.17,y=y0+(.09-y0)*(1-s*s),r=bodyR(Math.min(.999,(.66+y)/.75));return [Math.sign(s)*(r+off*Math.sqrt(Math.abs(s))),y+off*(1-Math.abs(s))]};
  const bandTab=[];for(let i=0;i<=400;i++)bandTab.push(bandPt(i/200-1));const bandY=x=>{let b=0,bd=9;for(const q of bandTab){const d=Math.abs(q[0]-x);if(d<bd){bd=d;b=q[1]}}return b};
  // bend the bottom part of an ear lathe (local y -H/2..H/2) so its base follows the band arc: M = lathe-local -> hat space; base lands at band centre + yOff
  const earBend=(geo,H,M,yOff=.01)=>{const Mi=M.clone().invert(),v=new THREE.Vector3(),p=geo.attributes.position;for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const t=(v.y+H/2)/H;if(t<.4){v.applyMatrix4(M);const w=Math.pow(1-t/.4,1.5);v.y+=(bandY(v.x)+yOff-v.y)*w;v.applyMatrix4(Mi);p.setXYZ(i,v.x,v.y,v.z)}}geo.computeVertexNormals();return geo};
  const H={
  party(P,g){const T=P.T,tx=canvasTex('partyhat2',512,512,(c,w,h)=>{const cs=['#e8283f','#ffcf2e','#2f7de1','#3cbf4a'];c.save();c.translate(w/2,h/2);c.rotate(-.55);for(let i=-12;i<12;i++){c.fillStyle=cs[(i+48)%4];c.fillRect(-w,i*h/9,2*w,h/9+1)}c.restore()});
    const pts=[];for(let k=0;k<=30;k++){const t=k/30;pts.push(V2(Math.max(.004,.25*(1-t)+.012*Math.sin(t*Math.PI)),t*.56))}pts.unshift(V2(.235,-.005),V2(.25,0));
    const c=new THREE.LatheGeometry(pts,64);g.add(wmesh(c,wm('#ffffff',{map:tx,roughness:.28,clearcoat:.8,clearcoatRoughness:.12})));
    const pm=wmesh(fluff(T,.085,2),'#e3242f',{roughness:.85,clearcoat:0,sheen:1,sheenRoughness:.5,sheenColor:new T.Color('#ff8a8a')});pm.position.y=.6;g.add(pm);g.rotation.z=-.1},
  cowboy(P,g){const T=P.T,C='#7b4a2c',o={roughness:.5,clearcoat:.35,clearcoatRoughness:.35,sheen:.4,sheenColor:new T.Color('#c8946a')};
    const brim=shell(72,10,(u,v)=>{const a=u*Math.PI*2,r=.2+v*.28,sx=Math.sin(a),cz=Math.cos(a),side=Math.pow(Math.abs(sx),2.2),e=Math.pow(v,2.2);
      return [r*sx,e*(.2*side-.035*(1-side)),r*cz*.88]},.022);g.add(wmesh(brim,C,o));
    const cr=surf(64,24,(u,v)=>{const a=u*Math.PI*2,sx=Math.sin(a),cz=Math.cos(a);let r=.215-.03*v*v,y=-.07+v*.39;
      if(v>.97){const t=(v-.97)/.03;r*=1-t;}
      const crease=.065*Math.exp(-Math.pow(sx*r/.07,2))*Math.pow(v,4),pinch=1-.22*Math.pow(v,3)*Math.max(0,cz)*Math.pow(Math.abs(sx)+.2,1);
      return [r*sx*pinch,y-crease,r*cz*.92*(1-.08*v)]},1);g.add(wmesh(cr,C,o));
    const bd=[];for(let k=0;k<=8;k++){const t=k/8;bd.push(V2(.218-.004*t+.006*Math.sin(t*Math.PI),.0+t*.075))}const band=wmesh(new T.LatheGeometry(bd,64),'#4a2716',{roughness:.35,clearcoat:.6});band.scale.z=.92;g.add(band);
    const st=wmesh(starGeo(T,.05,.022,.012),'#f0b93a',GOLD);face(st,0,.06,.215);g.add(st);const dot=wmesh(new T.SphereGeometry(.014,12,8),'#ffd86a',GOLD);dot.position.set(0,.06,.232);g.add(dot);g.position.y=.07},
  viking(P,g){const T=P.T,S={metalness:.8,roughness:.3,clearcoat:.3};
    const dome=wmesh(new T.SphereGeometry(.31,48,24,0,Math.PI*2,0,Math.PI/2),'#aeb4bf',S);dome.scale.y=1.02;dome.position.y=.02;g.add(dome);
    const bd=[];for(let k=0;k<=10;k++){const t=k/10,a=t*Math.PI;bd.push(V2(.315+.02*Math.sin(a),-.03+t*.09))}g.add(wmesh(new T.LatheGeometry(bd,64),'#e0a93a',GOLD));
    for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=wmesh(new T.SphereGeometry(.016,12,8),'#f2c15a',GOLD);r.position.set(Math.sin(a)*.337,.015,Math.cos(a)*.337);g.add(r)}
    const strap=wmesh(new T.TorusGeometry(.318,.03,10,48,Math.PI),'#e0a93a',GOLD);strap.rotation.y=Math.PI/2;strap.scale.set(1,1.02,1.25);strap.position.y=.02;g.add(strap);
    for(let i=1;i<6;i++){const a=i/6*Math.PI,r=wmesh(new T.SphereGeometry(.014,10,8),'#f2c15a',GOLD);r.position.set(0,.02+Math.sin(a)*.33,Math.cos(a)*.33);g.add(r)}
    for(const sx of[-1,1]){const h=taper(T,[new T.Vector3(sx*.27,.12,0),new T.Vector3(sx*.4,.17,0),new T.Vector3(sx*.48,.32,0),new T.Vector3(sx*.45,.5,-.02),new T.Vector3(sx*.38,.58,-.03)],.072,.006);
      g.add(wmesh(h.g,'#f1e6cc',{roughness:.3,clearcoat:.7,clearcoatRoughness:.15}));
      const rg=wmesh(new T.TorusGeometry(.07,.022,10,28),'#e0a93a',GOLD);rg.position.set(sx*.3,.13,0);rg.rotation.y=Math.PI/2;rg.rotation.x=sx*.35;g.add(rg)}},
  propeller(P,g){const T=P.T,cols=['#e8283f','#2f7de1','#ffcf2e','#3cbf4a'];
    for(let i=0;i<4;i++){const q=wmesh(new T.SphereGeometry(.31,24,16,i*Math.PI/2-Math.PI/4,Math.PI/2,0,Math.PI/2),cols[i],{roughness:.3,clearcoat:.7});q.position.y=-.04;q.scale.y=.95;g.add(q)}
    const vis=shell(36,8,(u,v)=>{const a=(u-.5)*1.9,r=.29+v*.2*(1-Math.pow(Math.abs(u-.5)*2,2.5)*.85);return [Math.sin(a)*r,-.045-.06*v*v+.01*Math.cos(a),Math.cos(a)*r]},.018);
    g.add(wmesh(vis,'#2f7de1',{roughness:.3,clearcoat:.7}));
    const ax=wmesh(new T.CylinderGeometry(.018,.022,.08,16),'#f2c15a',GOLD);ax.position.y=.31;g.add(ax);
    const pr=new T.Group();pr.position.y=.36;g.add(pr);for(const sx of[-1,1]){const b=wmesh(new T.SphereGeometry(.05,20,12),'#e8283f',{roughness:.3,clearcoat:.8});b.scale.set(2.6,.22,.75);b.position.x=sx*.13;b.rotation.x=sx*.35;pr.add(b)}
    const kn=wmesh(new T.SphereGeometry(.032,16,12),'#f2c15a',GOLD);kn.position.y=.37;g.add(kn);P.spin.push(pr)},
  chef(P,g){const T=P.T,o={roughness:.6,clearcoat:.15,emissive:'#fff6ee',emissiveIntensity:.12};
    const band=[];for(let k=0;k<=12;k++){const t=k/12;band.push(V2(.215+.018*t,-.02+t*.22))}g.add(wmesh(new T.LatheGeometry(band,64),'#f7f6f2',o));
    const top=surf(80,30,(u,v)=>{const a=u*Math.PI*2;const y=.17+v*.4,prof=v<.55?.23+.12*Math.sin(v/.55*Math.PI/2):(.35*Math.cos((v-.55)/.45*Math.PI/2));const pl=1+.11*Math.pow(Math.abs(Math.cos(a*3.5)),.6)*Math.sin(Math.min(1,v*1.3)*Math.PI);
      return [Math.sin(a)*prof*pl,y+(v>.55?.03*Math.cos(a*7):0)*Math.sin((v-.55)/.45*Math.PI),Math.cos(a)*prof*pl]},1);g.add(wmesh(top,'#ffffff',o));
    const rim=wmesh(new T.TorusGeometry(.236,.012,8,64),'#ecebe6',o);rim.rotation.x=Math.PI/2;rim.position.y=.2;g.add(rim)},
  flowers(P,g){const T=P.T,R=.28;const vine=wmesh(new T.TorusGeometry(R,.024,10,64),'#3f9a3a',{roughness:.45});vine.rotation.x=Math.PI/2;g.add(vine);
    const cs=['#8b5cf6','#ffffff','#e8283f','#ff6fae','#ffcf2e','#ff6fae','#ffffff','#8b5cf6','#e8283f'];
    for(let i=0;i<14;i++){const a=i/14*Math.PI*2+.2,lf=wmesh(new T.SphereGeometry(.045,14,10),'#4caf3d',{roughness:.4});lf.scale.set(1,.25,.5);lf.position.set(Math.sin(a)*(R+.015),.01,Math.cos(a)*(R+.015));lf.rotation.y=a+.8;lf.rotation.z=.4;g.add(lf)}
    cs.forEach((c,i)=>{const a=i/cs.length*Math.PI*2,f=new T.Group(),big=i%3===1?1.45:1.15;face(f,Math.sin(a)*(R+.03),.03,Math.cos(a)*(R+.03),.6);f.scale.setScalar(big);g.add(f);
      for(let k=0;k<5;k++){const b=k/5*Math.PI*2,p=wmesh(new T.SphereGeometry(.035,16,10),c,{roughness:.35,clearcoat:.5});p.scale.set(1,.68,.38);p.position.set(Math.cos(b)*.038,Math.sin(b)*.038,0);p.rotation.z=b;f.add(p)}
      const ce=wmesh(new T.SphereGeometry(.022,14,10),'#ffc21a',{roughness:.4});ce.position.z=.012;ce.scale.z=.7;f.add(ce)})},
  wizard(P,g){const T=P.T,o={roughness:.35,clearcoat:.6,sheen:.4,sheenColor:new T.Color('#8a7cff')};
    const brim=shell(72,8,(u,v)=>{const a=u*Math.PI*2,r=.2+v*.27;return [Math.sin(a)*r,-.04*v*v-.012*Math.cos(a*2)*v,Math.cos(a)*r]},.022);g.add(wmesh(brim,'#2f3ad0',o));
    const H0=.66,cone=surf(64,40,(u,v)=>{const a=u*Math.PI*2,r=Math.max(.004,.235*(1-v)*(1+.06*Math.sin(v*Math.PI)));const bx=.26*Math.pow(v,2.6),by=-.07*Math.pow(v,5);return [Math.sin(a)*r+bx,v<.02?-.07+v/.02*.07+0*by:v*H0+by,Math.cos(a)*r]},1);
    g.add(wmesh(cone,'#3b2fc4',o));
    const bd=[];for(let k=0;k<=8;k++){const t=k/8;bd.push(V2(.238-.022*t+.006*Math.sin(t*Math.PI),.0+t*.085))}g.add(wmesh(new T.LatheGeometry(bd,64),'#7a2fd6',{roughness:.25,clearcoat:.7,sheen:.8,sheenColor:new T.Color('#d3a8ff')}));
    const G={metalness:.6,roughness:.25,emissive:'#7a5200',emissiveIntensity:.15};
    [[-.5,.2,1],[.55,.26,1],[0,.36,.8],[-.25,.48,.7]].forEach(([a,y,s])=>{const v=y/H0,r=.235*(1-v)+.012,st=wmesh(starGeo(T,.045*s,.02*s,.01),'#ffcb3c',G);face(st,Math.sin(a)*r+.26*Math.pow(v,2.6),y,Math.cos(a)*r,.0);g.add(st)});
    {const a=.32,y=.15,v=y/H0,r=.235*(1-v)+.012,m=wmesh(moonGeo(T,.05,.01),'#ffcb3c',G);face(m,Math.sin(a)*r,y,Math.cos(a)*r);g.add(m)}g.position.y=.07},
  pirate(P,g){const T=P.T,o={roughness:.42,clearcoat:.5,sheen:.3,sheenColor:new T.Color('#5a5070')};
    const dome=wmesh(new T.SphereGeometry(.25,40,20,0,Math.PI*2,0,Math.PI/2),'#1c1824',o);dome.scale.set(1,1.05,.92);dome.position.y=.02;g.add(dome);
    // bicorne walls: two upturned walls (front, back) meeting in points at the sides; front edge dips in the middle
    const R0=a=>.24+.13*Math.pow(Math.abs(Math.sin(a)),6),Hh=a=>{const s=Math.abs(Math.sin(a)),c=Math.cos(a);return .17+.14*Math.pow(s,2.5)-.03*Math.pow(Math.max(0,c),8)+.03*Math.pow(Math.max(0,-c),2)},
      pt=(a,v)=>{const r=R0(a)*(1+.16*v),y=Hh(a)*v;return [Math.sin(a)*r,y,Math.cos(a)*r*.92]};
    g.add(dmesh(shell(120,10,(u,v)=>pt(u*Math.PI*2,v),.018),'#1c1824',o));
    g.add(wmesh(surf(120,10,(u,v)=>{const q=pt(u*Math.PI*2,v);return [q[0]*.97,q[1],q[2]*.97]},1),'#b51f2d',{roughness:.55,side:T.BackSide}));
    const ed=[];for(let i=0;i<120;i++){const q=pt(i/120*Math.PI*2,1);ed.push(new T.Vector3(q[0],q[1]+.006,q[2]))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(ed,true),240,.017,8,true),'#e8b23c',GOLD));
    const sk=new T.Group(),q=pt(0,.5);sk.position.set(q[0],q[1]+.01,q[2]+.03);sk.scale.setScalar(1.45);g.add(sk);const W={roughness:.35,clearcoat:.6};
    const hd=wmesh(new T.SphereGeometry(.042,20,14),'#f4f0e6',W);hd.scale.set(1,.95,.5);hd.position.y=.012;sk.add(hd);const jw=wmesh(new T.SphereGeometry(.026,16,10),'#f4f0e6',W);jw.scale.set(1,.7,.5);jw.position.y=-.026;sk.add(jw);
    for(const sx of[-1,1]){const e=wmesh(new T.SphereGeometry(.011,10,8),'#1c1824');e.position.set(sx*.016,.012,.02);e.scale.z=.5;sk.add(e);
      const ang=sx*.85,bn=wmesh(new T.CapsuleGeometry(.008,.12,4,8),'#f4f0e6',W);bn.rotation.z=ang;bn.position.set(0,-.02,-.01);sk.add(bn);
      for(const e2 of[-1,1]){const kn=wmesh(new T.SphereGeometry(.012,10,8),'#f4f0e6',W);kn.position.set(-Math.sin(ang)*.066*e2,-.02+Math.cos(ang)*.066*e2,-.01);sk.add(kn)}}g.position.y=.03},
  king(P,g){const T=P.T,R=.25,pk=a=>Math.pow((Math.cos(5*a)+1)/2,3.2),hgt=a=>.12+.2*pk(a);
    const wall=shell(150,14,(u,v)=>{const a=u*Math.PI*2,y=v*hgt(a),r=R+.035*y/.32;return [Math.sin(a)*r,y,Math.cos(a)*r]},.018);g.add(wmesh(wall,'#f1b630',GOLD));
    for(const y of[.0,.11]){const t=wmesh(new T.TorusGeometry(R+.022+y*.11,.016,10,72),'#ffc94a',GOLD);t.rotation.x=Math.PI/2;t.position.y=y+.008;g.add(t)}
    for(let i=0;i<18;i++){const a=i/18*Math.PI*2,b=wmesh(new T.SphereGeometry(.011,10,8),'#ffd66a',GOLD);b.position.set(Math.sin(a)*(R+.036),.008,Math.cos(a)*(R+.036));g.add(b)}
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2,r=R+.035+.02;const b=wmesh(new T.SphereGeometry(.035,18,12),'#ffc94a',GOLD);b.position.set(Math.sin(a)*r,.345,Math.cos(a)*r);g.add(b);
      const a2=a+Math.PI/5,b2=wmesh(new T.SphereGeometry(.024,14,10),'#ffc94a',GOLD);b2.position.set(Math.sin(a2)*(R+.03),.15,Math.cos(a2)*(R+.03));g.add(b2)}
    const gem=(a,c,s)=>{const m=wmesh(new T.OctahedronGeometry(.05*s,0),c,{roughness:.05,metalness:.1,clearcoat:1,transmission:0,emissive:c,emissiveIntensity:.15});const y=.065;m.scale.set(.85,1.1,.45);face(m,Math.sin(a)*(R+.04),y,Math.cos(a)*(R+.04));g.add(m);
      const set=wmesh(new T.TorusGeometry(.05*s,.01,8,6),'#ffd66a',GOLD);set.scale.set(.9,1.1,1);face(set,Math.sin(a)*(R+.038),y,Math.cos(a)*(R+.038));set.rotateZ(Math.PI/6);g.add(set)};
    gem(0,'#d11a2a',1);gem(-.85,'#1f4fd8',.75);gem(.85,'#1f4fd8',.75);gem(Math.PI,'#1fae5a',.8)},
  beanie(P,g){const T=P.T,tx=canvasTex('knit2',256,256,(c,w,h)=>{c.fillStyle='#808080';c.fillRect(0,0,w,h);for(let i=0;i<24;i++)for(let j=0;j<16;j++){const x=i*w/24,y=j*h/16;const gr=c.createLinearGradient(x,0,x+w/24,0);gr.addColorStop(0,'#3a3a3a');gr.addColorStop(.5,'#e0e0e0');gr.addColorStop(1,'#3a3a3a');c.fillStyle=gr;c.beginPath();c.ellipse(x+w/48,y+h/32,w/56,h/30,0,0,7);c.fill()}});
    const tb=tx.clone();tb.needsUpdate=true;tb.repeat.set(2,1);const o={color:'#d3212b',roughness:.9,clearcoat:0,sheen:1,sheenRoughness:.6,sheenColor:new T.Color('#ff7a7a'),bumpMap:tb,bumpScale:2.2};
    const dome=new T.Mesh(new T.SphereGeometry(.31,56,28,0,Math.PI*2,0,Math.PI/2),wm('#d3212b',o));dome.scale.y=1.12;dome.position.y=.03;g.add(dome);
    const cf=surf(96,14,(u,v)=>{const a=u*Math.PI*2,t=v*Math.PI;const rib=1+.018*Math.cos(a*56);const r=(.318+.032*Math.sin(t))*rib;return [Math.sin(a)*r,-.045+v*.13,Math.cos(a)*r]},1);
    g.add(wmesh(cf,'#c81e28',{roughness:.88,clearcoat:0,sheen:1,sheenRoughness:.6,sheenColor:new T.Color('#ff7a7a')}));
    const pm=wmesh(fluff(T,.11,5),'#d3212b',{roughness:.9,clearcoat:0,sheen:1,sheenRoughness:.5,sheenColor:new T.Color('#ff8a8a')});pm.position.y=.39;g.add(pm)}  ,
  /* batch 2 (graphics sheet acc/hats2.png) */
  bow(P,g){const T=P.T,o={roughness:.22,clearcoat:1,clearcoatRoughness:.08,sheen:.8,sheenRoughness:.3,sheenColor:new T.Color('#ffd0e6')},C='#ff6fae';
    for(const sx of[-1,1]){const l=wmesh(new T.SphereGeometry(.1,28,18),C,o);l.scale.set(1.2,.85,.5);l.position.set(sx*.115,.0,0);l.rotation.z=sx*.28;g.add(l);const fd=wmesh(new T.SphereGeometry(.04,16,10),'#e8478d',o);fd.scale.set(1.4,.5,.3);fd.position.set(sx*.08,0,.045);fd.rotation.z=sx*.28;g.add(fd);
      const t=taper(T,[new T.Vector3(sx*.02,-.02,.03),new T.Vector3(sx*.06,-.08,.05),new T.Vector3(sx*.1,-.14,.06)],.032,.022,20,12);const tm=wmesh(t.g,C,o);tm.scale.z=.45;g.add(tm)}
    const k=wmesh(new T.SphereGeometry(.045,20,14),'#ff4f98',o);k.scale.set(1,1.15,.75);g.add(k);g.position.set(0,.12,.06);g.rotation.x=-.25;g.scale.setScalar(1.25)},
  cap(P,g){const T=P.T,o={roughness:.42,clearcoat:.4};
    // SphereGeometry: front (+z) is phi = pi/2; the two front panels are white
    const red=wmesh(new T.SphereGeometry(.31,40,20,Math.PI/2+Math.PI/3,Math.PI*4/3,0,Math.PI/2),'#e3242f',o),wh=wmesh(new T.SphereGeometry(.31,24,20,Math.PI/2-Math.PI/3,Math.PI*2/3,0,Math.PI/2),'#f6f4ef',o);
    for(const m of[red,wh]){m.position.y=-.02;m.scale.y=.92;g.add(m)}
    const vis=shell(40,8,(u,v)=>{const a=(u-.5)*2,r=.29+v*.24*(1-Math.pow(Math.abs(u-.5)*2,2.5)*.8);return [Math.sin(a)*r,-.03-.07*v*v+.012*Math.cos(a),Math.cos(a)*r]},.02);
    g.add(dmesh(vis,'#e3242f',o));const bt=wmesh(new T.SphereGeometry(.03,16,10),'#e3242f',o);bt.position.y=.265;bt.scale.y=.6;g.add(bt)},
  paper(P,g){const T=P.T,tx=canvasTex('news',512,256,(c,w,h)=>{c.fillStyle='#f1f0ec';c.fillRect(0,0,w,h);c.fillStyle='#8d8c88';
      for(let col=0;col<6;col++)for(let r=0;r<22;r++){if(col===3&&r>4&&r<14)continue;const x=8+col*84,y=10+r*11;c.fillRect(x,y,60+((r*7+col*3)%14),4)}
      c.fillStyle='#5c5b58';c.fillRect(8,2,200,7);c.fillStyle='#9a9995';c.fillRect(260,58,64,96);c.fillStyle='#6a6966';c.beginPath();c.arc(292,92,16,0,7);c.fill();c.fillRect(272,112,40,40)});
    const m=wm('#ffffff',{map:tx,roughness:.85,clearcoat:0,side:T.DoubleSide,flatShading:true}),pos=[],uv=[],tri=(a,b,c)=>{for(const q of[a,b,c]){pos.push(q[0],q[1],q[2]);uv.push(.5+q[0]*1.4,.15+q[1]*1.6+q[2]*.3)}};
    const X=.33,Z=.22,B=-.03,Y=.08,AY=.33;
    for(const sz of[-1,1]){tri([-X,Y,sz*Z],[X,Y,sz*Z],[0,AY,sz*.015]);tri([-X,B,sz*Z*1.05],[X,B,sz*Z*1.05],[X,Y,sz*Z]);tri([-X,B,sz*Z*1.05],[X,Y,sz*Z],[-X,Y,sz*Z])}
    for(const sx of[-1,1]){tri([sx*X,B,-Z*1.05],[sx*X,B,Z*1.05],[sx*X*1.06,Y+.02,0]);tri([sx*X,Y,-Z],[sx*X,Y,Z],[0,AY,0])}
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.computeVertexNormals();
    g.add(new T.Mesh(geo,m));g.position.y=.04},
  antenna(P,g){const T=P.T,o={roughness:.25,clearcoat:.8},pts=[];for(let k=0;k<=24;k++){const t=k/24,a=(t-.5)*Math.PI*.92,y=Math.cos(a)*.1-.12,r=bodyR((.66+y)/.75)+.018;pts.push(new T.Vector3(Math.sign(a)*Math.max(.001,r*Math.abs(Math.sin(a))/Math.max(.001,Math.abs(Math.sin(a)))),y,0))}
    const band=[];for(let k=0;k<=30;k++){const t=k/30,a=(t-.5)*2.4,y=-.16+.26*Math.cos(a*1.25)/1;const yy=Math.min(.095,y),x=Math.sign(a)*(bodyR(Math.min(.999,(.66+yy)/.75))+.022);band.push(new T.Vector3(Math.abs(a)<.05?0:x,yy+.0,0))}
    const cu=[];for(let k=0;k<=28;k++){const t=k/28,ang=(t-.5)*Math.PI*.95,y0=-.17;const yy=y0+(.095-y0)*Math.cos(ang)**1.3;const r=bodyR(Math.min(.997,(.66+yy)/.75))+.02;cu.push(new T.Vector3(Math.sin(ang)>=0?r*Math.min(1,Math.abs(Math.sin(ang))*4):-r*Math.min(1,Math.abs(Math.sin(ang))*4),yy+.01,0))}
    g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(cu),64,.022,10),'#4cc233',o));
    for(const sx of[-1,1]){const x0=sx*.13,y0=.06,hp=[];for(let k=0;k<=80;k++){const t=k/80,a=t*Math.PI*2*7;hp.push(new T.Vector3(x0+sx*t*.07+Math.cos(a)*.016,y0+t*.2,Math.sin(a)*.016))}
      g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(hp),240,.0045,6),'#9aa0aa',{metalness:.85,roughness:.25}));
      const st=wmesh(new T.CylinderGeometry(.009,.009,.06,8),'#4cc233',o);st.position.set(x0,y0-.02,0);g.add(st);
      const b=wmesh(new T.SphereGeometry(.058,24,16),'#9cff4a',{roughness:.1,clearcoat:1,emissive:'#6aff2a',emissiveIntensity:.55});b.position.set(x0+sx*.075,y0+.26,0);g.add(b)}},
  headphones(P,g){const T=P.T,o={roughness:.3,clearcoat:.7},yc=-.22,rc=bodyR((.66+yc)/.75);
    const Rx=rc+.07,cu=[];for(let k=0;k<=40;k++){const ang=(k/40-.5)*Math.PI;cu.push(new T.Vector3(Math.sin(ang)*Rx,yc+.07+(.17-yc-.07)*Math.cos(ang),0))}
    const bd=wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(cu),64,.032,12),'#1f4ccf',o);bd.scale.z=1.6;g.add(bd);
    for(const sx of[-1,1]){const cg=new T.Group();cg.position.set(sx*(rc+.06),yc,0);cg.rotation.z=sx*Math.PI/2;g.add(cg);
      const shell_=wmesh(new T.CylinderGeometry(.115,.13,.08,40),'#1f4ccf',o);cg.add(shell_);
      const ring=wmesh(new T.TorusGeometry(.105,.018,10,40),'#ffc81e',o);ring.rotation.x=Math.PI/2;ring.position.y=sx*.0+.04*-1*-1;ring.position.y=.042;cg.add(ring);
      const cap=wmesh(new T.CylinderGeometry(.075,.08,.02,32),'#ffc81e',o);cap.position.y=.05;cg.add(cap);
      const cush=wmesh(new T.TorusGeometry(.09,.035,12,40),'#1a2f8a',{roughness:.7,clearcoat:.1});cush.rotation.x=Math.PI/2;cush.position.y=-.05;cg.add(cush);
      const sl=wmesh(new T.BoxGeometry(.05,.07,.06),'#ffc81e',o);sl.position.set(sx*(rc+.05),yc+.15,0);g.add(sl)}},
  flowerpin(P,g){const T=P.T,f=new T.Group(),x=.2,y=.0,z=.17;face(f,x,y,z,.3);f.scale.setScalar(1.6);g.add(f);
    for(let k=0;k<10;k++){const b=k/10*Math.PI*2,p=wmesh(new T.SphereGeometry(.04,18,12),'#ffffff',{roughness:.3,clearcoat:.6});p.scale.set(1.45,.62,.42);p.position.set(Math.cos(b)*.06,Math.sin(b)*.06,0);p.rotation.z=b;f.add(p)}
    const c=wmesh(new T.SphereGeometry(.04,20,14),'#ffc21a',{roughness:.25,clearcoat:.8});c.scale.z=.6;c.position.z=.015;f.add(c);
    const cl=wmesh(new T.CapsuleGeometry(.016,.13,6,10),'#ff7ac1',{roughness:.3,clearcoat:.8});cl.rotation.z=Math.PI/2+.5;cl.position.set(-.07,-.03,-.025);cl.scale.z=.5;f.add(cl)},
  hardhat(P,g){const T=P.T,C='#ffc21a',o={roughness:.25,clearcoat:.9,clearcoatRoughness:.1};
    const d=wmesh(new T.SphereGeometry(.31,48,24,0,Math.PI*2,0,Math.PI/2),C,o);d.scale.set(1,1.02,1.06);d.position.y=-.01;g.add(d);const sk=wmesh(new T.CylinderGeometry(.31,.312,.05,48,1,true),C,o);sk.scale.z=1.06;sk.position.y=-.035;g.add(sk);
    for(const [ry,sc] of[[0,1],[.32,.96],[-.32,.96]]){const r=wmesh(new T.TorusGeometry(.316,.022,10,48,Math.PI),C,o);r.rotation.y=Math.PI/2+ry;r.scale.set(1.06,1.02*sc,1);r.position.y=-.01;g.add(r)}
    const brim=shell(80,8,(u,v)=>{const a=u*Math.PI*2,fr=Math.pow(Math.max(0,Math.cos(a)),2),r=.3+v*(.045+.12*fr);return [Math.sin(a)*r,-.03-.04*v*v*fr+.012*v*(1-fr),Math.cos(a)*r*1.06]},.02);g.add(dmesh(brim,C,o));g.position.y=.02},
  royal(P,g){const T=P.T,Gd={metalness:.75,roughness:.2,clearcoat:.4},R=.255;
    const fur=wmesh(fluff(T,1,7),'#fbfaf6',{roughness:.95,clearcoat:0,sheen:1,sheenColor:new T.Color('#ffffff')});fur.scale.set(R+.05,.06,R+.05);fur.position.y=.0;
    const ft=new T.TorusGeometry(R+.01,.05,20,72);{const p=ft.attributes.position,v=new T.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const n=Math.sin(v.x*60)*Math.sin(v.y*55)*Math.sin(v.z*60);v.multiplyScalar(1+.012*n);p.setXYZ(i,v.x,v.y,v.z)}ft.computeVertexNormals()}
    const fm=wmesh(ft,'#fbfaf6',{roughness:.95,clearcoat:0,sheen:1,sheenColor:new T.Color('#ffffff')});fm.rotation.x=Math.PI/2;g.add(fm);
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2+(i%2)*.1,s=wmesh(new T.SphereGeometry(.012,8,6),'#1c1824');s.scale.set(1,1.6,.5);face(s,Math.sin(a)*(R+.058),.012*((i%3)-1),Math.cos(a)*(R+.058));g.add(s)}
    const rim=wmesh(new T.CylinderGeometry(R+.005,R+.012,.06,64,1,true),'#f1b630',Object.assign({side:T.DoubleSide},Gd));rim.position.y=.07;g.add(rim);
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2,c=['#d11a2a','#1f4fd8','#1fae5a'][i%3],gm=wmesh(new T.SphereGeometry(.019,12,10),c,{roughness:.05,clearcoat:1,emissive:c,emissiveIntensity:.2});gm.scale.z=.6;face(gm,Math.sin(a)*(R+.016),.07,Math.cos(a)*(R+.016));g.add(gm)}
    const cap=wmesh(new T.SphereGeometry(R-.01,40,20,0,Math.PI*2,0,Math.PI/2),'#b3122f',{roughness:.75,clearcoat:.05,sheen:1,sheenRoughness:.4,sheenColor:new T.Color('#ff6a7c')});cap.scale.y=.95;cap.position.y=.09;g.add(cap);
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2,big=i%2===0;const o=wmesh(big?(()=>{const sh=new T.Shape();sh.moveTo(-.022,0);sh.lineTo(-.022,.04);sh.lineTo(-.045,.05);sh.lineTo(-.045,.085);sh.lineTo(-.012,.075);sh.lineTo(-.012,.11);sh.lineTo(.012,.11);sh.lineTo(.012,.075);sh.lineTo(.045,.085);sh.lineTo(.045,.05);sh.lineTo(.022,.04);sh.lineTo(.022,0);return new T.ExtrudeGeometry(sh,{depth:.012,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:2})})():new T.SphereGeometry(.022,14,10),'#f1b630',Gd);
      face(o,Math.sin(a)*(R+.01),big?.1:.12,Math.cos(a)*(R+.01));g.add(o);if(big){const gm=wmesh(new T.SphereGeometry(.013,10,8),'#d11a2a',{roughness:.05,clearcoat:1});gm.position.set(0,.06,.02);o.add(gm)}}
    for(const ry of[0,Math.PI/2]){const ar=wmesh(new T.TorusGeometry(R+.005,.016,10,48,Math.PI),'#f1b630',Gd);ar.rotation.y=ry;ar.scale.y=1.15;ar.position.y=.1;g.add(ar);
      for(let k=1;k<10;k++){const t=k/10*Math.PI,pe=wmesh(new T.SphereGeometry(.012,10,8),'#fff8ee',{roughness:.15,clearcoat:1});pe.position.set(Math.cos(t)*(R+.022)*Math.cos(ry),.1+Math.sin(t)*(R+.022)*1.15,-Math.cos(t)*(R+.022)*Math.sin(ry));g.add(pe)}}
    const orb=wmesh(new T.SphereGeometry(.04,20,14),'#f1b630',Gd);orb.position.y=.1+R*1.15+.04;g.add(orb);
    const cx=new T.Group();cx.position.y=orb.position.y+.07;g.add(cx);for(const [w,h] of[[.022,.1],[.075,.022]]){const b=wmesh(new T.BoxGeometry(w,h,.02),'#f1b630',Gd);cx.add(b)}
    const cg=wmesh(new T.SphereGeometry(.014,10,8),'#d11a2a',{roughness:.05,clearcoat:1});cg.position.z=.012;cx.add(cg)},
  cloudhat(P,g){const T=P.T,o={roughness:.92,clearcoat:0,sheen:1,sheenRoughness:.5,sheenColor:new T.Color('#ffffff'),emissive:'#ffffff',emissiveIntensity:.06};
    [[-.17,.05,.02,.15],[.16,.05,.03,.15],[0,.12,.03,.19],[-.07,.04,.15,.13],[.09,.04,.14,.13],[0,.05,-.12,.16],[.22,.02,-.06,.11],[-.22,.02,-.06,.11]].forEach(([x,y,z,r],i)=>{const m=wmesh(fluff(T,r,i+3),'#ffffff',o);m.position.set(x,y,z);g.add(m)});
    const cols=['#e8283f','#ff8a1f','#ffd21f','#3cbf4a','#2f7de1','#8b4fd8'],rb=new T.Group();rb.position.set(.13,.1,-.08);rb.rotation.y=-.5;g.add(rb);
    cols.forEach((c,i)=>{const t=wmesh(new T.TorusGeometry(.2-i*.022,.012,10,40,Math.PI),c,{roughness:.25,clearcoat:.8});t.scale.z=1.6;rb.add(t)})},
  halo(P,g){const T=P.T,G={metalness:.6,roughness:.18,emissive:'#ffb000',emissiveIntensity:.35},R=.3,y=.3;
    const ring=wmesh(new T.TorusGeometry(R,.01,8,72),'#ffd23f',G);ring.rotation.x=Math.PI/2;ring.position.y=y;g.add(ring);
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2,s=i%2?.75:1,st=wmesh(starGeo(T,.05*s,.022*s,.012),'#ffd23f',G);st.position.set(Math.sin(a)*R,y,Math.cos(a)*R);st.rotation.y=a;st.rotation.z=i*.5;g.add(st)}
    g.rotation.x=.12}  ,
  /* batch 3 (graphics sheet acc/hats3.png) */
  pumpkin(P,g){const T=P.T,O='#ff7a1a',o={roughness:.38,clearcoat:.6,clearcoatRoughness:.2};
    const brim=shell(72,6,(u,v)=>{const a=u*Math.PI*2,r=.26+v*.12;return [Math.sin(a)*r,-.02*v*v,Math.cos(a)*r]},.022);g.add(dmesh(brim,'#f26a12',o));
    const body=surf(96,32,(u,v)=>{const a=u*Math.PI*2,rib=1-.08*Math.pow(Math.abs(Math.sin(a*4)),.7),q=2*v-1,r=(q<0?.31*(1-.13*q*q):.31*Math.sqrt(Math.max(0,1-q*q))*(1-.12*q*q))*rib;return [Math.sin(a)*Math.max(.001,r),.13+q*.17-.03*Math.pow(Math.max(0,q),4),Math.cos(a)*Math.max(.001,r)]},1);const bt=wmesh(new T.CircleGeometry(.27,48),O,o);bt.rotation.x=Math.PI/2;bt.position.y=-.04;g.add(bt);g.add(wmesh(body,O,o));
    const Y={color:'#ffd23a',emissive:'#ffb000',emissiveIntensity:.7,roughness:.4};const ext=(sh,d=.01)=>new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:2,curveSegments:16});
    for(const sx of[-1,1]){const sh=new T.Shape();sh.moveTo(-.035,0);sh.quadraticCurveTo(0,.06,.035,0);sh.quadraticCurveTo(0,.025,-.035,0);const e=new T.Mesh(ext(sh),wm(Y.color,Y));face(e,sx*.095,.17,.27,.0);e.rotateY(sx*-.02);g.add(e)}
    {const sh=new T.Shape();sh.moveTo(-.1,.02);sh.quadraticCurveTo(0,-.09,.1,.02);sh.quadraticCurveTo(0,-.035,-.1,.02);const m=new T.Mesh(ext(sh),wm(Y.color,Y));face(m,0,.085,.29,-.1);g.add(m)}
    {const sh=new T.Shape();sh.moveTo(-.015,0);sh.lineTo(0,.025);sh.lineTo(.015,0);sh.closePath();const n=new T.Mesh(ext(sh),wm(Y.color,Y));face(n,0,.13,.305);g.add(n)}
    const st=taper(T,[new T.Vector3(0,.27,0),new T.Vector3(.01,.33,0),new T.Vector3(.04,.37,0),new T.Vector3(.08,.38,0)],.035,.022,20,10);g.add(wmesh(st.g,'#3c9a3a',{roughness:.4,clearcoat:.4}));
    const vp=[];for(let k=0;k<=40;k++){const t=k/40,a=t*Math.PI*3.2;vp.push(new T.Vector3(.08+t*.1+Math.cos(a)*.03*(1-t*.5),.36+Math.sin(a)*.03*(1-t*.5)-t*.03,.01))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(vp),80,.007,6),'#4caf3d',{roughness:.4}));
    const lf=wmesh(new T.SphereGeometry(.05,16,10),'#4caf3d',{roughness:.4,clearcoat:.4});lf.scale.set(1,.25,.75);lf.position.set(.17,.31,.04);lf.rotation.z=-.6;g.add(lf);g.position.y=.03},
  witch(P,g){const T=P.T,C='#2a2433',o={roughness:.4,clearcoat:.5,sheen:.4,sheenColor:new T.Color('#6a5a8a')};
    g.add(dmesh(shell(72,8,(u,v)=>{const a=u*Math.PI*2,r=.2+v*.28;return [Math.sin(a)*r,-.03*v*v+.015*v*Math.cos(a*2),Math.cos(a)*r]},.02),C,o));
    const H0=.62;g.add(wmesh(surf(64,40,(u,v)=>{const a=u*Math.PI*2,r=Math.max(.004,.23*(1-v)*(1+.05*Math.sin(v*Math.PI)));const bx=.3*Math.pow(v,3)-.05*Math.pow(v,1.5),by=-.12*Math.pow(v,6);return [Math.sin(a)*r+bx,v<.02?-.07+v/.02*.07:v*H0+by,Math.cos(a)*r]},1),C,o));
    const band=(y0,h,c,dr)=>{const b=[];for(let k=0;k<=8;k++){const t=k/8;b.push(V2(.232+dr-.02*(y0+t*h)/.1+.005*Math.sin(t*Math.PI),y0+t*h))}g.add(wmesh(new T.LatheGeometry(b,64),c,{roughness:.3,clearcoat:.6}))};
    band(0,.06,'#ff7a1a',.004);band(.06,.04,'#8b3fd8',.0);
    const bk=new T.Group();face(bk,0,.03,.24);g.add(bk);const G2={metalness:.7,roughness:.22};for(const [w,h,x,y] of[[.09,.016,0,.03],[.09,.016,0,-.03],[.016,.076,-.037,0],[.016,.076,.037,0]]){const b=wmesh(new T.BoxGeometry(w,h,.016),'#ffcb3c',G2);b.position.set(x,y,0);bk.add(b)}
    g.position.y=.06},
  starcrown(P,g){const T=P.T,R=.25,sc=a=>.1+.035*Math.pow(Math.abs(Math.cos(a*6)),3);
    g.add(dmesh(shell(120,10,(u,v)=>{const a=u*Math.PI*2,y=v*sc(a),r=R+.03*y/.14;return [Math.sin(a)*r,y,Math.cos(a)*r]},.018),'#f1b630',GOLD));
    const gs=wmesh(new T.TorusGeometry(R+.02,.014,10,72),'#ffc94a',GOLD);gs.rotation.x=Math.PI/2;gs.position.y=.008;g.add(gs);
    const SG={metalness:.55,roughness:.22,emissive:'#ffb000',emissiveIntensity:.2};
    [[0,.11,1],[.75,.08,.72],[-.75,.08,.72],[1.45,.06,.5],[-1.45,.06,.5],[Math.PI,.08,.7]].forEach(([a,s,k])=>{const st=wmesh(starGeo(T,s,s*.45,.025*k+.01),'#ffd23f',SG);st.position.set(Math.sin(a)*(R+.02),.13+s*.75,Math.cos(a)*(R+.02));st.rotation.y=a;g.add(st)});
    for(let i=0;i<12;i++){const a=(i+.5)/12*Math.PI*2,b=wmesh(new T.SphereGeometry(.016,10,8),'#ffd66a',GOLD);b.position.set(Math.sin(a)*(R+.025),.135,Math.cos(a)*(R+.025));g.add(b)}
    const gm=wmesh(new T.OctahedronGeometry(.045,0),'#7c3aed',{roughness:.05,clearcoat:1,emissive:'#7c3aed',emissiveIntensity:.25});gm.scale.set(.75,1.15,.45);face(gm,0,.06,R+.045);g.add(gm);
    const set=wmesh(new T.TorusGeometry(.045,.009,8,6),'#ffd66a',GOLD);set.scale.set(.8,1.2,1);face(set,0,.06,R+.04);set.rotateZ(Math.PI/6);g.add(set)},
  stkhat(P,g){const T=P.T,o={roughness:.4,clearcoat:.5},tx=canvasTex('stkhat2',1024,512,(c,W,H)=>ssBomb(c,W,H,'#f6f1e7'));tx.repeat.set(2,1);
    const d=wmesh(new T.SphereGeometry(.31,48,24,0,Math.PI*2,0,Math.PI/2),wm('#ffffff',Object.assign({map:tx},o)));d.position.y=-.02;d.scale.y=.95;g.add(d);
    const vis=(c,s0,s1)=>g.add(dmesh(shell(24,8,(u,v)=>{const a=(s0+(s1-s0)*u-.5)*2,uu=s0+(s1-s0)*u,r=.29+v*.24*(1-Math.pow(Math.abs(uu-.5)*2,2.5)*.8);return [Math.sin(a)*r,-.03-.07*v*v+.012*Math.cos(a),Math.cos(a)*r]},.02),c,o));
    vis('#e3242f',0,.5);vis('#2f7de1',.5,1);
    const st=wmesh(starGeo(T,.075,.035,.014),'#ffd23f',{roughness:.3,clearcoat:.8});face(st,0,.13,.27,-.15);g.add(st);
    const pm=wmesh(fluff(T,.085,9),'#ffb21e',{roughness:.9,clearcoat:0,sheen:1,sheenColor:new T.Color('#ffe08a')});pm.position.y=.33;g.add(pm)},
  h_farm(P,g){const T=P.T,R=.26;
    const rope=[];for(let s=0;s<2;s++){const p=[];for(let k=0;k<=160;k++){const a=k/160*Math.PI*2,w=a*14+s*Math.PI;p.push(new T.Vector3(Math.sin(a)*(R+.012*Math.cos(w)),.02+.012*Math.sin(w),Math.cos(a)*(R+.012*Math.cos(w))))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(p,true),320,.02,8,true),s?'#8a5a30':'#a8743f',{roughness:.6}))}
    for(let i=0;i<10;i++){const a=(i+.5)/10*Math.PI*2,b=wmesh(new T.SphereGeometry(.014,10,8),'#e0a93a',GOLD);b.position.set(Math.sin(a)*(R+.03),.02,Math.cos(a)*(R+.03));g.add(b)}
    const fg=(()=>{const sh=new T.Shape();sh.moveTo(0,0);sh.bezierCurveTo(.05,.08,.045,.24,0,.32);sh.bezierCurveTo(-.045,.24,-.05,.08,0,0);const ge=new T.ExtrudeGeometry(sh,{depth:.006,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:2,curveSegments:16});const p=ge.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,p.getZ(i)-Math.abs(x)*.35+(y*y)*.15)}ge.computeVertexNormals();return ge})();
    for(let i=0;i<11;i++){const t=(i/10-.5),a=t*2.6,f=wmesh(fg,'#2a2530',{roughness:.35,clearcoat:.6,sheen:.6,sheenColor:new T.Color('#6a7ab0')});const k=1-Math.abs(t)*.55;f.scale.set(k,k,k);f.position.set(Math.sin(a)*R,.03,Math.cos(a)*R);f.rotation.y=a;f.rotation.x=-.18;f.rotation.z=-t*.6;g.add(f);
      const rb=wmesh(new T.CylinderGeometry(.003,.005,.3*k,6),'#4a4458');rb.position.set(0,.15*k,.012);f.add(rb)}
    for(let i=0;i<6;i++){const t=i/5,a=Math.PI+(t-.5)*2.2,f=wmesh(fg,'#1f1b26',{roughness:.4});f.scale.setScalar(.7);f.position.set(Math.sin(a)*R,.03,Math.cos(a)*R);f.rotation.y=a;g.add(f)}
    const gm=wmesh(new T.OctahedronGeometry(.045,0),'#7c3aed',{roughness:.05,clearcoat:1,emissive:'#7c3aed',emissiveIntensity:.3});gm.scale.set(.75,1.2,.45);face(gm,0,.05,R+.04);g.add(gm);
    const set=wmesh(new T.TorusGeometry(.046,.009,8,6),'#ffd66a',GOLD);set.scale.set(.8,1.2,1);face(set,0,.05,R+.035);set.rotateZ(Math.PI/6);g.add(set)},
  h_city(P,g){const T=P.T,L={roughness:.55,clearcoat:.35,clearcoatRoughness:.4,sheen:.5,sheenColor:new T.Color('#c8946a')},C='#7a4a2a';
    const hm=wmesh(new T.SphereGeometry(.315,48,28,0,Math.PI*2,0,Math.PI*.6),C,L);hm.position.y=-.03;g.add(hm);
    for(const ry of[0,Math.PI/2]){const sm=wmesh(new T.TorusGeometry(.317,.006,6,48,Math.PI),'#5a3420',{roughness:.6});sm.rotation.y=ry;sm.position.y=-.03;g.add(sm)}
    for(const sx of[-1,1]){const fl=wmesh(new T.SphereGeometry(.1,20,14),C,L);fl.scale.set(.35,1.25,.9);fl.position.set(sx*.3,-.17,-.02);g.add(fl);const bt=wmesh(new T.CylinderGeometry(.02,.02,.012,16),'#e0a93a',GOLD);bt.rotation.z=Math.PI/2;bt.position.set(sx*.336,-.2,-.02);g.add(bt)}
    const st=wmesh(new T.TorusGeometry(.322,.02,8,64),'#5a3420',{roughness:.5});st.rotation.x=Math.PI/2-.35;st.position.set(0,.02,0);st.scale.set(1,1.04,1);g.add(st);
    for(const sx of[-1,1]){const gg=new T.Group();face(gg,sx*.095,.12,.28,.0);gg.rotateX(-.35);g.add(gg);const rm=wmesh(new T.TorusGeometry(.065,.018,12,40),'#e8b23c',GOLD);gg.add(rm);
      const ln=wmesh(new T.SphereGeometry(.062,24,16),'#1b1a22',{roughness:.05,clearcoat:1,metalness:.2});ln.scale.z=.45;gg.add(ln)}
    const br=wmesh(new T.CapsuleGeometry(.012,.04,4,8),'#e8b23c',GOLD);br.rotation.z=Math.PI/2;br.position.set(0,.14,.29);g.add(br)},
  h_desert(P,g){const T=P.T,cs=['#2f7de1','#3cbf4a','#ffcf2e','#e3242f','#e3242f'],o={roughness:.42,clearcoat:.4,sheen:.5,sheenColor:new T.Color('#ffffff')};
    const core=wmesh(new T.SphereGeometry(.27,32,16,0,Math.PI*2,0,Math.PI/2),'#e3242f',o);core.position.y=.06;g.add(core);
    cs.forEach((c,i)=>{const t=wmesh(new T.TorusGeometry(.28-i*.03,.07-i*.006,16,64),c,o);t.rotation.x=Math.PI/2+(i%2?.18:-.18);t.rotation.z=(i%2?.12:-.1);t.position.y=.0+i*.065;g.add(t)});
    const gm=wmesh(new T.OctahedronGeometry(.05,0),'#d11a2a',{roughness:.05,clearcoat:1,emissive:'#d11a2a',emissiveIntensity:.2});gm.scale.set(.85,1,.45);face(gm,0,.12,.3);g.add(gm);
    const set=wmesh(new T.TorusGeometry(.055,.012,10,24),'#ffcb3c',GOLD);face(set,0,.12,.295);g.add(set);
    const fp=taper(T,[new T.Vector3(0,.15,.27),new T.Vector3(.02,.28,.25),new T.Vector3(.06,.4,.2),new T.Vector3(.11,.47,.14)],.035,.006,24,10);const fe=wmesh(fp.g,'#fbf7ee',{roughness:.6,sheen:1,sheenColor:new T.Color('#ffffff')});fe.scale.z=.9;g.add(fe)},
  h_candy(P,g){const T=P.T,R=.25,pk=a=>Math.pow((Math.cos(5*a)+1)/2,2),hh=a=>.11+.09*pk(a),F={roughness:.3,clearcoat:.8,clearcoatRoughness:.1};
    g.add(dmesh(shell(150,10,(u,v)=>{const a=u*Math.PI*2,y=v*hh(a),r=R+.02*y/.2+.008*Math.sin(a*30)*v;return [Math.sin(a)*r,y,Math.cos(a)*r]},.022),'#ffb3d4',F));
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2,d=wmesh(new T.CapsuleGeometry(.013,.03+(i%3)*.012,4,8),'#ffd6e8',F);d.position.set(Math.sin(a)*(R+.022),.035-(i%3)*.006,Math.cos(a)*(R+.022));g.add(d)}
    const bc=['#e3242f','#3cbf4a','#ffcf2e','#8b4fd8','#ff8a1f','#2f7de1'];for(let i=0;i<14;i++){const a=i/14*Math.PI*2+.1,b=wmesh(new T.CapsuleGeometry(.018,.022,6,10),bc[i%6],{roughness:.15,clearcoat:1});face(b,Math.sin(a)*(R+.03),.07+(i%2)*.03,Math.cos(a)*(R+.03));b.rotateZ(i*.9);b.rotateX(Math.PI/2);g.add(b)}
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2,b=wmesh(new T.SphereGeometry(.026,14,10),bc[(i+2)%6],{roughness:.15,clearcoat:1});b.position.set(Math.sin(a)*(R+.03),.215,Math.cos(a)*(R+.03));g.add(b)}
    const sw=(n,c1,c2)=>canvasTex(n,128,128,(c,w,h)=>{c.fillStyle=c1;c.fillRect(0,0,w,h);c.strokeStyle=c2;c.lineWidth=11;c.beginPath();for(let k=0;k<160;k++){const t=k/160*Math.PI*7,r=t/(Math.PI*7)*w*.5;c.lineTo(w/2+Math.cos(t)*r,h/2+Math.sin(t)*r)}c.stroke()});
    [[-.13,.0,'lolR','#ffffff','#e3242f'],[.15,.02,'lolB','#ffffff','#2f9ae1']].forEach(([x,z,n,c1,c2])=>{const s=wmesh(new T.CylinderGeometry(.008,.008,.24,8),'#ffffff',{roughness:.4});s.position.set(x,.2,z);g.add(s);
      const dk=new T.Mesh(new T.CylinderGeometry(.075,.075,.025,32),[wm('#ffffff',{roughness:.2,clearcoat:1}),wm('#ffffff',{map:sw(n,c1,c2),roughness:.2,clearcoat:1}),wm('#ffffff',{map:sw(n,c1,c2),roughness:.2,clearcoat:1})]);dk.rotation.x=Math.PI/2;dk.position.set(x,.36,z);g.add(dk)})},
  h_snow(P,g){const T=P.T,o={roughness:.95,clearcoat:0,sheen:1,sheenRoughness:.4,sheenColor:new T.Color('#ffffff'),emissive:'#ffffff',emissiveIntensity:.05};
    const fg=new T.SphereGeometry(.36,72,40,0,Math.PI*2,0,Math.PI*.62),p=fg.attributes.position,v=new T.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const d=v.clone().normalize(),n=Math.sin(d.x*61)*Math.sin(d.y*57)*Math.sin(d.z*63)+.6*Math.sin(d.x*23+d.z*29)*Math.sin(d.y*31);v.multiplyScalar(1+.03*n);p.setXYZ(i,v.x,v.y,v.z)}fg.computeVertexNormals();
    const f=wmesh(fg,'#f7f8fc',Object.assign({side:T.DoubleSide},o));f.scale.y=.8;f.position.y=-.1;g.add(f);
    for(const sx of[-1,1]){const h=taper(T,[new T.Vector3(sx*.26,.1,0),new T.Vector3(sx*.34,.2,0),new T.Vector3(sx*.36,.33,0),new T.Vector3(sx*.32,.43,0)],.065,.004,12,6);
      const m=wmesh(h.g,new T.MeshPhysicalMaterial({color:'#9fdcff',roughness:.05,metalness:0,clearcoat:1,transmission:0,transparent:true,opacity:.85,emissive:'#5cc8ff',emissiveIntensity:.25,flatShading:true,envMapIntensity:B3OPT.env*1.3}));g.add(m)}},
  h_volcano(P,g){const T=P.T,R=.25;
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2,r=wmesh(new T.DodecahedronGeometry(.06+(i%3)*.012,0),'#3a2a2c',{roughness:.85,clearcoat:0,flatShading:true});r.scale.set(1,1.3+(i%2)*.4,.8);face(r,Math.sin(a)*R,.04+(i%2)*.02,Math.cos(a)*R);r.rotateZ(i);g.add(r)}
    const lv=wmesh(new T.TorusGeometry(R,.035,8,48),'#ff5a10',{emissive:'#ff4a00',emissiveIntensity:1.2,roughness:.6});lv.rotation.x=Math.PI/2;lv.position.y=.02;g.add(lv);
    const fl=(h,r)=>{const pts=[];for(let k=0;k<=20;k++){const t=k/20;pts.push(V2(Math.max(.001,r*Math.sin(Math.min(1,t*2.2)*Math.PI/2)*(1-Math.pow(t,1.6))),t*h))}const ge=new T.LatheGeometry(pts,16),p=ge.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i)/h;p.setX(i,p.getX(i)+Math.sin(y*3)*.02*y)}ge.computeVertexNormals();return ge};
    for(let i=0;i<11;i++){const a=i/11*Math.PI*2,h=.3+.14*((i*7)%3)/2,f=wmesh(fl(h,.085),'#ff7a1a',{emissive:'#ff5a00',emissiveIntensity:.9,roughness:.4});f.position.set(Math.sin(a)*(R-.02),.05,Math.cos(a)*(R-.02));f.rotation.y=a;f.rotation.z=.12;g.add(f);
      const y=wmesh(fl(h*.7,.055),'#ffd23f',{emissive:'#ffb000',emissiveIntensity:1,roughness:.4});y.position.set(Math.sin(a)*(R-.0),.05,Math.cos(a)*(R-.0)+.0);y.rotation.y=a;g.add(y)}}  ,
  /* batch 4: the 22 newer boss trophy hats (graphics sheets acc/hats4a.png + hats4b.png) */
  h_farmN(P,g){const T=P.T,R=.25,hf=a=>{const c=Math.cos(a);return .08+.14*Math.pow(Math.max(0,c),10)+.06*Math.pow((Math.cos(4*a)+1)/2,6)};
    g.add(dmesh(shell(160,10,(u,v)=>{const a=u*Math.PI*2,y=v*hf(a),r=R+.03*y/.2;return [Math.sin(a)*r,y,Math.cos(a)*r]},.02),'#f1b630',GOLD));
    edgeTrim(g,a=>hf(a),R,'#ffcf5a',.011);const bt=wmesh(new T.TorusGeometry(R+.022,.02,10,72),'#ffcf5a',GOLD);bt.rotation.x=Math.PI/2;bt.position.y=.012;g.add(bt);
    [[0,.15,.24],[.68,.11,.17],[-.68,.11,.17]].forEach(([a,k,y])=>{const p=miniPumpkin(T,k);p.position.set(Math.sin(a)*(R-.02),y,Math.cos(a)*(R-.02)-.02);g.add(p);
      if(a){for(const sx of[-1,1]){const l=wmesh(leafGeo(T),'#f1b630',GOLD);l.scale.setScalar(.28);l.position.set(p.position.x+sx*.02,y+k*.9,p.position.z);l.rotation.z=sx*.7;l.rotation.y=a;g.add(l)}}});
    {const p=g.children[g.children.length-3];const vp=[];for(let k=0;k<=30;k++){const t=k/30,an=t*Math.PI*2.4;vp.push(new T.Vector3(.04+Math.cos(an)*.025*(1-t*.5),.36+Math.sin(an)*.025,.18))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(vp),60,.006,6),'#3c9a3a',{roughness:.4}));
      const lf=wmesh(leafGeo(T),'#4caf3d',{roughness:.4,clearcoat:.4});lf.scale.setScalar(.3);lf.position.set(.05,.36,.2);lf.rotation.z=-1.1;g.add(lf)}
    gemAt(g,0,.085,R+.035,'#e8401a',1.15);for(const a of[.45,-.45,.95,-.95])gemAt(g,a,.04,R+.03,'#d11a2a',.5);
    for(const sx of[-1,1]){const sw=wmesh(new T.TorusGeometry(.05,.009,8,24,Math.PI),'#ffcf5a',GOLD);face(sw,sx*.075,.07,R+.035);sw.rotateZ(sx>0?0:Math.PI);g.add(sw)}},
  h_cityN(P,g){const T=P.T;g.add(hband(T,'#3a3440',{roughness:.35,clearcoat:.6},.03,.022,.6));
    // fur map per side (light grey, bold diagonal stripes mirrored -28deg left / +28deg right, roots only in the bottom quarter, white key light top-left, no black over the stripes)
    const W=a=>`rgba(255,255,255,${a})`,furM=(sx)=>wm('#ffffff',{map:furPaint2('cat4'+(sx<0?'L':'R'),'#cdcdd6','#50505a',{angle:-28*-sx,ry:19,rx:.86,sa:[.25,.5,.95],at:[.22,.5,.78],stroke:[.10,.14],front:'#e8c4d0',ao:.25,gv:[[0,'rgba(20,10,30,.30)'],[.25,'rgba(20,10,30,0)'],[1,W(.45)]],keyStops:[[0,W(.18)],[.15,W(0)],[.4,W(0)],[.6,W(0)],[.85,W(.32)],[1,W(.18)]]}),roughness:.95,clearcoat:0,sheen:.3,sheenRoughness:.5,sheenColor:new T.Color('#e8e8f0')});
    const SH={ramp:[.88,.2],at:[.05,.55],hair:'hairD',sheenI:.3};
    // pink inner map per side: flat matte #ff98b6, slightly darker base, ONE thin crease line at the lathe's sides (where pink meets fur), soft contact shadow under the tuft; no hot spot (the rim light is the only highlight)
    const pinkM=(sx)=>wm('#ffffff',{map:canvasTex('earpink4'+(sx<0?'L':'R'),128,256,(c,w,h)=>{const gr=c.createLinearGradient(0,h,0,0);gr.addColorStop(0,'#e06a8c');gr.addColorStop(.25,'#ff98b6');gr.addColorStop(1,'#ffb0c6');c.fillStyle=gr;c.fillRect(0,0,w,h);
      for(let x=0;x<w;x++){const e=Math.abs(Math.sin(x/w*Math.PI*2)),d=Math.max(0,(e-.78)/.22);c.fillStyle=`rgba(90,20,45,${(d*d*.8).toFixed(3)})`;c.fillRect(x,0,1,h)}
      const ux=(sx<0?.12:.88)*w;for(const X of[ux-w,ux,ux+w]){const g4=c.createRadialGradient(X,h*.78,2,X,h*.78,w*.30);g4.addColorStop(0,'rgba(70,15,35,.4)');g4.addColorStop(1,'rgba(70,15,35,0)');c.fillStyle=g4;c.fillRect(0,0,w,h)}}),roughness:.9,clearcoat:0,sheen:0,emissive:'#ff98b6',emissiveIntensity:.10});
    // white tuft: white with a faint root tint only, no stripes/key light, slight white emissive so the shadow side stays white
    const tuftM=wm('#ffffff',{map:furPaint2('tuft3','#ffffff',null,{gv:[[0,'rgba(200,200,210,.25)'],[.3,'rgba(0,0,0,0)'],[1,'rgba(255,255,255,.3)']],key:false}),emissive:'#ffffff',emissiveIntensity:.15,roughness:.85,sheen:0});
    const ear=(sx)=>{const e=new T.Group(),y=.03,x=sx*(bodyR((.66+y)/.75)-.04),by=bandY(x),sl=(bandY(x+.02)-bandY(x-.02))/.04;e.position.set(x,by+.03,-.01);e.rotation.z=Math.atan(sl);e.rotation.y=-sx*.3;g.add(e);e.updateMatrix();
      const mk=(R,H,zs,seg)=>earBend(new T.LatheGeometry(catLp(R,H,.55,.35),seg),H,e.matrix.clone().multiply(new T.Matrix4().compose(new T.Vector3(0,.15,0),new T.Quaternion(),new T.Vector3(1,1,zs))));
      const o=furShells(mk(.21,.34,.45,56),furM(sx),Object.assign({len:.04,rep:[3,2.5],layers:14},SH));o.scale.z=.45;o.position.y=.15;e.add(o);
      const rim=furShells(mk(.21*1.05,.34*1.04,.1,48),furM(sx),Object.assign({len:.045,rep:[2.5,2.5],layers:4,up:[sx*.3,1,0]},SH,{ramp:[.95,.15]}));rim.scale.z=.1;rim.position.y=.15;e.add(rim);
      const i=wmesh(new T.LatheGeometry(catLp(.105,.23,.6,.5),40),pinkM(sx));i.scale.z=.18;i.position.set(0,.13,.102);i.rotation.x=-.08;e.add(i);
      const tuft=furShells(furGeo(new T.ConeGeometry(.045,.16,20,8),.008,140),tuftM,{len:.07,rep:[1.2,1.2],layers:7,up:[-sx*.5,1,.2],ramp:[.95,.15],at:[.05,.5],hair:'hairD',sheenI:0});tuft.scale.z=.25;tuft.position.set(-sx*.045,.05,.125);tuft.rotation.z=sx*.6;tuft.rotation.x=.2;e.add(tuft);return e};
    ear(-1);ear(1);const jx=bodyR((.66+.03)/.75)+.03,jy=bandY(jx)-.045,ly=bandY(jx)+.004;// earrings under the ears' lower corners, hanging from the band
    // left: gold bell (seam + slit, matte dark) hanging in front of the band below the ear
    const bl=wmesh(new T.SphereGeometry(.055,24,16),wm('#ffffff',Object.assign({map:canvasTex('bell2',64,64,(c,w,h)=>{c.fillStyle='#f1b630';c.fillRect(0,0,w,h);c.fillStyle='#a07a18';c.fillRect(0,h*.45-3,w,6);c.fillStyle='#4a3208';c.fillRect(w*.25-2,h*.45,4,h*.22)})},GOLD)));bl.position.set(-jx,jy,.20);g.add(bl);const sm=wmesh(new T.TorusGeometry(.055,.004,6,32),'#8a6a1a',{roughness:.6,metalness:.3});sm.position.copy(bl.position);sm.rotation.x=Math.PI/2.4;g.add(sm);
    const sl=wmesh(new T.BoxGeometry(.004,.03,.03),'#2a1c08',{roughness:.8});sl.position.set(-jx,jy-.005,.252);g.add(sl);earHang(T,g,-jx,ly,.19);
    // right: gold ring with an oval purple gem in a bezel
    const rg=wmesh(new T.TorusGeometry(.048,.011,10,36),'#f1b630',GOLD);rg.position.set(jx,jy,.20);rg.rotation.y=.35;g.add(rg);
    const gm=wmesh(new T.IcosahedronGeometry(.036,0),'#9a1fd0',{roughness:.08,clearcoat:1,clearcoatRoughness:.05,flatShading:true,emissive:'#c040ff',emissiveIntensity:.3});gm.scale.set(1,1.3,.55);gm.position.set(jx,jy,.212);gm.rotation.set(0,.35,.4);g.add(gm);
    const bz=wmesh(new T.TorusGeometry(.038,.007,6,28),'#ffd66a',GOLD);bz.scale.set(1,1.35,1);bz.position.set(jx,jy,.212);bz.rotation.y=.35;g.add(bz);earHang(T,g,jx,ly,.19)},
  h_desertN(P,g){const T=P.T,R=.25,hf=a=>.08+.11*Math.pow((Math.cos(5*a)+1)/2,4);
    g.add(dmesh(shell(150,10,(u,v)=>{const a=u*Math.PI*2,y=v*hf(a),r=R+.03*y/.2;return [Math.sin(a)*r,y,Math.cos(a)*r]},.02),'#1f1a24',{roughness:.25,clearcoat:.9}));
    edgeTrim(g,hf,R,'#f1b630',.012);const bt=wmesh(new T.TorusGeometry(R+.022,.018,10,72),'#f1b630',GOLD);bt.rotation.x=Math.PI/2;bt.position.y=.012;g.add(bt);
    gemAt(g,0,.075,R+.035,'#d11a2a',1.25);for(const a of[.85,-.85])gemAt(g,a,.06,R+.03,'#d11a2a',.6);
    const cu=new T.CatmullRomCurve3([new T.Vector3(0,.07,-.17),new T.Vector3(0,.26,-.2),new T.Vector3(0,.45,-.13),new T.Vector3(.0,.55,.02),new T.Vector3(0,.5,.16),new T.Vector3(0,.4,.2)]);
    const n=9;for(let i=0;i<n;i++){const t=i/(n-1)*.92,p=cu.getPointAt(t),r=.105-.055*t,s=wmesh(new T.SphereGeometry(r,28,18),'#221c2a',{roughness:.2,clearcoat:1});s.position.copy(p);s.lookAt(p.clone().add(cu.getTangentAt(t)));s.scale.set(1,1,.82);g.add(s);
      if(i&&i<n){const q=cu.getPointAt(t-.05),rg=wmesh(new T.TorusGeometry(r*.95,.011,8,32),'#f1b630',GOLD);rg.position.copy(q);rg.lookAt(q.clone().add(cu.getTangentAt(t-.05)));g.add(rg)}}
    const e=cu.getPointAt(.97),st=taper(T,[e,new T.Vector3(0,e.y-.02,e.z+.08),new T.Vector3(0,e.y-.1,e.z+.1),new T.Vector3(0,e.y-.16,e.z+.06)],.045,.003,20,14);g.add(wmesh(st.g,'#f1b630',GOLD))},
  h_candyN(P,g){const T=P.T,tx=canvasTex('candywitch2',512,512,(c,w,h)=>{c.save();c.translate(w/2,h/2);c.rotate(-.45);for(let i=-12;i<12;i++){c.fillStyle=i%2?'#ff6fae':'#5ee0b8';c.fillRect(-w,i*h/7,2*w,h/7+1)}c.restore()}),o={roughness:.28,clearcoat:.8};
    const bf=(u,v)=>{const a=u*Math.PI*2,r=.2+v*.25,up=.06*Math.pow(Math.max(0,-Math.cos(a)),1.5)*v;return [Math.sin(a)*r,-.03*v*v+up+.015*v*Math.cos(a*2),Math.cos(a)*r]};
    g.add(wmesh(surf(80,8,bf,1),'#5ee0b8',o));g.add(wmesh(surf(80,8,(u,v)=>{const q=bf(u,v);return [q[0],q[1]-.016,q[2]]},1),'#ff6fae',Object.assign({side:T.BackSide},o)));
    const ed=[];for(let i=0;i<96;i++){const q=bf(i/96,1);ed.push(new T.Vector3(q[0],q[1]-.008,q[2]))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(ed,true),192,.012,8,true),'#f1b630',GOLD));
    const H0=.56;g.add(wmesh(surf(64,40,(u,v)=>{const a=u*Math.PI*2,r=Math.max(.004,.26*Math.pow(1-v,.85)*(1+.15*Math.sin(v*Math.PI)));return [Math.sin(a)*r+.26*Math.pow(v,2.4),v<.02?-.07+v/.02*.07:v*H0-.1*Math.pow(v,4),Math.cos(a)*r]},1),wm('#ffffff',Object.assign({map:tx},o))));
    const tp=wmesh(new T.ConeGeometry(.018,.06,12),'#f1b630',GOLD);tp.position.set(.28,.46,0);tp.rotation.z=-2.1;g.add(tp);
    const sw=n=>canvasTex(n,128,128,(c,w,h)=>{c.fillStyle='#ffffff';c.fillRect(0,0,w,h);c.strokeStyle='#ff3f7a';c.lineWidth=13;c.beginPath();for(let k=0;k<160;k++){const t=k/160*Math.PI*6,r=t/(Math.PI*6)*w*.5;c.lineTo(w/2+Math.cos(t)*r,h/2+Math.sin(t)*r)}c.stroke()});
    const lol=(x,y,z,r)=>{const m=new T.Mesh(new T.CylinderGeometry(r,r,.022,32),[wm('#ffffff',o),wm('#ffffff',Object.assign({map:sw('lolCW2')},o)),wm('#ffffff',o)]);face(m,x,y,z);m.rotateX(Math.PI/2);g.add(m);return m};
    lol(-.15,.12,.21,.095);
    const bw=new T.Group();face(bw,.12,.08,.23);bw.scale.setScalar(1.45);g.add(bw);for(const sx of[-1,1]){const b=wmesh(new T.SphereGeometry(.06,20,14),'#ff4f98',o);b.scale.set(1.2,.8,.45);b.position.x=sx*.065;b.rotation.z=sx*.3;bw.add(b);const tl=wmesh(new T.CapsuleGeometry(.022,.07,4,8),'#ff4f98',o);tl.scale.z=.4;tl.position.set(sx*.035,-.06,0);tl.rotation.z=sx*.5;bw.add(tl)}
    {const m=new T.Mesh(new T.CylinderGeometry(.035,.035,.02,24),[wm('#ffffff',o),wm('#ffffff',Object.assign({map:sw('lolCW2')},o)),wm('#ffffff',o)]);m.rotation.x=Math.PI/2;m.position.z=.02;bw.add(m)}
    [['#5ee85a',-.03,.08,.25,.03],['#ffd23f',.0,.16,.21,.022],['#ff8fc0',-.22,.05,.13,.025],['#c08aff',-.08,.03,.25,.02]].forEach(([c,x,y,z,r])=>{const b=wmesh(new T.SphereGeometry(r,16,12),c,{roughness:.12,clearcoat:1});b.position.set(x,y,z);g.add(b)});
    const ht=wmesh(new T.SphereGeometry(.025,14,10),'#ff4f98',o);ht.scale.set(1,.9,.4);face(ht,.04,.24,.17);g.add(ht);g.position.y=.06},
  h_snowN(P,g){const T=P.T,F={roughness:.95,clearcoat:0,sheen:1,sheenRoughness:.35,sheenColor:new T.Color('#ffffff')},W='#f6f8fd',B='#3f86e8';
    const DR=.37,DY=-.13,rr=y=>Math.sqrt(Math.max(0,DR*DR-(y-DY)*(y-DY)))*1.02+.004;
    const dm=new T.SphereGeometry(DR,96,48,0,Math.PI*2,0,Math.PI*.5);dm.scale(1.02,.98,1.02);const hm=furShells(dm,W,{len:.06,rep:[9,4],layers:16,mat:{side:T.DoubleSide}});hm.position.y=DY;g.add(hm);
    const rim=furShells(new T.TorusGeometry(DR*1.02,.05,20,120),'#ffffff',{len:.06,rep:[16,2],layers:16});rim.rotation.x=Math.PI/2;rim.position.y=DY+.01;g.add(rim);
    for(const sx of[-1,1]){const fl=furShells(new T.CapsuleGeometry(.055,.11,8,20),'#ffffff',{len:.035,rep:[2,2],layers:14,up:[0,-1,0]});fl.scale.z=.7;fl.position.set(sx*.36,DY-.1,.03);fl.rotation.z=sx*.12;g.add(fl)}
    for(const sx of[-1,1]){const e=new T.Group();e.position.set(sx*.16,.13,-.03);e.rotation.z=-sx*.42;g.add(e);
      const eg=furGeo(new T.ConeGeometry(.13,.27,40,14),.009,120),ep=eg.attributes.position,cl=[],c0=new T.Color(W),c1=new T.Color(B);for(let k=0;k<ep.count;k++){const t=Math.min(1,Math.max(0,(ep.getY(k)+.03)/.1));const cc=c0.clone().lerp(c1,t);cl.push(cc.r,cc.g,cc.b)}eg.setAttribute('color',new T.Float32BufferAttribute(cl,3));const o=furShells(eg,wm('#ffffff',Object.assign({vertexColors:true},F)),{len:.05,rep:[3,2],layers:16,mat:{vertexColors:true}});o.scale.z=.55;o.position.y=.12;e.add(o);
      
      const i=wmesh(new T.ConeGeometry(.08,.19,32),'#5b9cf0',{roughness:.6,sheen:.6,sheenColor:new T.Color('#bfe0ff')});i.scale.z=.3;i.position.set(0,.1,.035);e.add(i);
      const tf=furShells(new T.ConeGeometry(.04,.13,20,6),'#ffffff',{len:.03,rep:[1.5,1.5],layers:12});tf.scale.z=.35;tf.position.set(-sx*.02,.05,.05);e.add(tf);
      const ey=new T.Group();face(ey,sx*.1,.06,rr(.06)+.006);g.add(ey);const sc=wmesh(new T.SphereGeometry(.05,24,16),'#ffffff',{roughness:.2,clearcoat:1});sc.scale.set(1.15,.85,.3);ey.add(sc);
      const ir=wmesh(new T.SphereGeometry(.042,24,16),'#2f9bff',{roughness:.1,clearcoat:1,emissive:'#1a7aff',emissiveIntensity:.35});ir.scale.set(1,1,.3);ir.position.z=.006;ey.add(ir);
      const hl=wmesh(new T.SphereGeometry(.008,10,8),'#ffffff',{emissive:'#ffffff',emissiveIntensity:1});hl.position.set(sx*.008,.01,.016);ey.add(hl);
      const ch=[],ax=sx*.37;for(let k=0;k<5;k++){const l=wmesh(new T.TorusGeometry(.009,.003,6,12),'#f1b630',GOLD);l.position.set(ax,-.31-k*.017,.06);l.rotation.y=k%2?Math.PI/2:0;g.add(l)}
      const pm=furShells(new T.SphereGeometry(.045,24,16),'#ffffff',{len:.03,rep:[1.5,1.5],layers:14});pm.position.set(ax,-.44,.06);g.add(pm);gemAt(g,0,0,0,'#2f9bff',.5,new T.Vector3(ax,-.39,.1))}
    const dg=new T.Group();face(dg,0,.1,rr(.1)+.012);g.add(dg);for(const sx of[-1,1]){const b=wmesh(new T.CapsuleGeometry(.009,.07,4,8),'#f1b630',GOLD);b.position.set(sx*.035,-.018,0);b.rotation.z=sx*1.05;dg.add(b);const s2=wmesh(new T.OctahedronGeometry(.012,0),'#ffd66a',GOLD);s2.position.set(sx*.075,-.035,0);dg.add(s2)}
    const cr=wmesh(new T.OctahedronGeometry(.05,0),'#9be4ff',{roughness:.03,clearcoat:1,emissive:'#5cc8ff',emissiveIntensity:.45,flatShading:true,transmission:0});cr.scale.set(.62,1.5,.45);cr.position.set(0,.04,.012);dg.add(cr);
    const cs=wmesh(new T.TorusGeometry(.03,.007,8,6),'#ffd66a',GOLD);cs.scale.set(.75,1.6,1);cs.position.set(0,.04,0);dg.add(cs);g.position.y=.01},
  h_oceanN(P,g){const T=P.T,o={roughness:.28,clearcoat:.8},N='#363489';g.add(hband(T,N,o,.032,.028));
    for(let k=-3;k<=3;k++){if(!k)continue;const s=k/4,y=-.17+(.26)*(1-s*s),r=bodyR(Math.min(.999,(.66+y)/.75))+.028*Math.sqrt(Math.abs(s))+.03;const st=wmesh(new T.SphereGeometry(.011,10,8),'#f1b630',GOLD);st.position.set(Math.sign(s)*r,y+.028*(1-Math.abs(s)),.022);g.add(st)}
    const fin=(sx)=>{const f=new T.Group();f.position.set(sx*.29,-.07,.1);f.rotation.y=sx*.95;f.scale.setScalar(1.6);g.add(f);
      const lobe=(rot,c1,c2,len)=>{const sh=new T.Shape();sh.moveTo(0,0);sh.bezierCurveTo(.03,len*.4,.09,len*.9,.03,len);sh.bezierCurveTo(-.02,len*1.02,-.05,len*.5,0,0);
        const geo=new T.ExtrudeGeometry(sh,{depth:.006,bevelEnabled:true,bevelThickness:.004,bevelSize:.004,bevelSegments:2,curveSegments:24});geo.translate(0,0,-.003);
        const tx=canvasTex('fin_'+c1+c2,64,128,(c,w,h)=>{const gr=c.createLinearGradient(0,h,0,0);gr.addColorStop(0,c1);gr.addColorStop(1,c2);c.fillStyle=gr;c.fillRect(0,0,w,h);c.strokeStyle='rgba(30,20,90,.55)';c.lineWidth=2;for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(w/2,h);c.quadraticCurveTo(w/2+k*10,h/2,w/2+k*18,0);c.stroke()}});
        const uv=geo.attributes.uv,pp=geo.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(pp.getX(i)+.06)/.16,pp.getY(i)/len);
        const m=wmesh(geo,wm('#ffffff',{map:tx,roughness:.2,clearcoat:.9,side:T.DoubleSide,emissive:'#3a2a9a',emissiveIntensity:.15}));m.rotation.z=rot;m.scale.x=sx;f.add(m)};
      lobe(-sx*.5,'#4a6cff','#b08aff',.15);lobe(-sx*2.2,'#3a8cff','#7a6aff',.12);
      const bt=wmesh(new T.TorusGeometry(.022,.007,8,24),'#f1b630',GOLD);bt.position.z=.012;f.add(bt);const gm=wmesh(new T.SphereGeometry(.018,16,12),'#2a6aff',{roughness:.05,clearcoat:1,emissive:'#2a6aff',emissiveIntensity:.25});gm.scale.z=.6;gm.position.z=.014;f.add(gm)};
    fin(-1);fin(1);
    const pts=[new T.Vector3(-.02,.09,-.1),new T.Vector3(-.02,.3,-.08),new T.Vector3(.04,.42,.02),new T.Vector3(.14,.43,.1),new T.Vector3(.2,.36,.14),new T.Vector3(.21,.29,.14)];
    const st=taper(T,pts,.03,.014,40,12);g.add(wmesh(st.g,N,o));const cl=wmesh(new T.CylinderGeometry(.036,.04,.03,20),'#f1b630',GOLD);cl.position.set(-.02,.095,-.1);g.add(cl);
    for(const t of[.35,.7]){const q=new T.CatmullRomCurve3(pts),p=q.getPointAt(t),r=wmesh(new T.TorusGeometry(.024-t*.008,.006,6,20),'#f1b630',GOLD);r.position.copy(p);r.lookAt(p.clone().add(q.getTangentAt(t)));g.add(r)}
    const L=new T.Group();L.position.set(.21,.19,.14);g.add(L);
    L.add(wmesh(new T.SphereGeometry(.072,28,20),'#fff6b0',{emissive:'#ffc21a',emissiveIntensity:3,roughness:.2}));
    for(let k=0;k<4;k++){const c=wmesh(new T.TorusGeometry(.078,.006,6,40),'#f1b630',GOLD);c.rotation.y=k*Math.PI/4;c.scale.y=1.1;L.add(c)}
    const eq=wmesh(new T.TorusGeometry(.079,.007,6,40),'#f1b630',GOLD);eq.rotation.x=Math.PI/2;L.add(eq);
    const cp=wmesh(new T.CylinderGeometry(.022,.04,.035,20),'#f1b630',GOLD);cp.position.y=.09;L.add(cp);const bt=wmesh(new T.ConeGeometry(.02,.03,16),'#f1b630',GOLD);bt.rotation.x=Math.PI;bt.position.y=-.095;L.add(bt);g.position.y=.01},
  h_volcanoN(P,g){const T=P.T,H={roughness:.12,clearcoat:1,clearcoatRoughness:.05};g.add(hband(T,'#262030',{roughness:.35,clearcoat:.6},.03,.026));
    for(const sx of[-1,1]){const y=.0,x=sx*(bodyR((.66+y)/.75)-.03);
      const h=taper(T,[new T.Vector3(x,y,0),new T.Vector3(x+sx*.06,y+.11,.01),new T.Vector3(x+sx*.06,y+.22,.03),new T.Vector3(x+sx*.0,y+.31,.04),new T.Vector3(x-sx*.05,y+.34,.04)],.1,.004,40,20);
      g.add(wmesh(h.g,'#d41b25',H));
      for(const [t,rd] of[[.18,.08],[.32,.072]]){const cu=new T.CatmullRomCurve3([new T.Vector3(x,y,0),new T.Vector3(x+sx*.06,y+.11,.01),new T.Vector3(x+sx*.06,y+.22,.03),new T.Vector3(x+sx*.0,y+.31,.04),new T.Vector3(x-sx*.05,y+.34,.04)]),p=cu.getPointAt(t),r=wmesh(new T.TorusGeometry(rd,.016,10,32),'#f1b630',GOLD);r.position.copy(p);r.lookAt(p.clone().add(cu.getTangentAt(t)));if(t>.2)r.visible=false;g.add(r)}
      for(const [dy,dz,rz] of[[.0,.06,1.2],[-.04,-.04,1.5]]){const sp=wmesh(new T.ConeGeometry(.018,.06,12),'#f1b630',GOLD);sp.position.set(x+sx*.07,y+dy+.02,dz);sp.rotation.z=-sx*rz;g.add(sp)}}
    gemAt(g,0,.075,.27,'#d11a2a',1.05);},
  h_spaceN(P,g){const T=P.T,F={roughness:.95,clearcoat:0,sheen:1,sheenRoughness:.35,sheenColor:new T.Color('#ffffff')};{const hb=hband(T,'#f4f2f8',F,.03,.03),fs=furShells(hb.geometry,'#f4f2f8',{len:.04,rep:[12,1],layers:14});fs.scale.z=1.5;g.add(fs)}
    for(const sx of[-1,1]){const e=new T.Group();e.position.set(sx*.1,.06,-.0);e.rotation.z=-sx*.22;e.rotation.y=-sx*.25;g.add(e);
      const prof=[];for(let k=0;k<=24;k++){const t=k/24;prof.push(new T.Vector2(Math.sin(Math.PI*Math.pow(t,.8))*.115*(1-t*.15)+.001,t*.56))}
      const og=new T.LatheGeometry(prof,40),o=furShells(og,wm('#ffffff',{map:furPaint('bun','#fbfaff')}),{len:.05,rep:[4,2],layers:16});o.scale.z=.42;o.position.y=.02;e.add(o);
      const ip=[];for(let k=0;k<=20;k++){const t=k/20;ip.push(new T.Vector2(Math.sin(Math.PI*Math.pow(t,.8))*.078+.001,t*.46))}
      const i=wmesh(new T.LatheGeometry(ip,32),'#ffadc4',{roughness:.55,sheen:.8,sheenColor:new T.Color('#ffd6e2')});i.scale.z=.25;i.position.set(0,.05,.03);e.add(i);
      const pm=furShells(new T.SphereGeometry(.045,24,16),'#ffffff',{len:.03,rep:[1.5,1.5],layers:14});pm.position.set(sx*.14,.05,.2);g.add(pm);
      const ax=sx*(bodyR((.66-.04)/.75)+.05);for(let k=0;k<4;k++){const l=wmesh(new T.TorusGeometry(.008,.0028,6,12),'#f1b630',GOLD);l.position.set(ax,-.05-k*.015,.04);l.rotation.y=k%2?Math.PI/2:0;g.add(l)}
      const ds=wmesh(starGeo(T,.045,.011,.01,4),'#f1b630',GOLD);ds.scale.y=1.4;ds.position.set(ax,-.135,.04);g.add(ds)}
    const m=wmesh(moonGeo(T,.075,.018),'#f1b630',GOLD);face(m,0,.075,.27);g.add(m);
    for(let k=0;k<3;k++){const l=wmesh(new T.TorusGeometry(.007,.0025,6,12),'#f1b630',GOLD);face(l,0,.0-k*.013,.285);if(k%2)l.rotateY(Math.PI/2);g.add(l)}
    const dr=wmesh(starGeo(T,.03,.008,.008,4),'#f1b630',GOLD);dr.scale.y=1.4;face(dr,0,-.06,.285);g.add(dr)},
  h_farmS(P,g){const T=P.T,HN={roughness:.55,clearcoat:.25,sheen:.3,sheenColor:new T.Color('#fff6e6')};
    for(const sx of[-1,1]){const pts=[new T.Vector3(sx*.17,.05,.03),new T.Vector3(sx*.27,.15,.05)];for(let k=0;k<=40;k++){const t=k/40,a=t*Math.PI*2.1,r=.15*(1-.6*t),u=Math.sin(a)*r,v=Math.cos(a)*r;pts.push(new T.Vector3(sx*(.39+u*.85),.02+v,.06-u*.25))}
      const cu=new T.CatmullRomCurve3(pts),n=120,rad=18,hg=new T.TubeGeometry(cu,n,1,rad,false),p=hg.attributes.position;
      for(let i=0;i<=n;i++){const t=i/n,c=cu.getPointAt(t),r=(.085-.06*Math.pow(t,.8))*(1+.07*Math.pow(Math.sin(t*95),2));for(let j=0;j<=rad;j++){const k=i*(rad+1)+j;p.setXYZ(k,c.x+(p.getX(k)-c.x)*r,c.y+(p.getY(k)-c.y)*r,c.z+(p.getZ(k)-c.z)*r)}}
      hg.computeVertexNormals();g.add(wmesh(hg,'#d8ccb4',HN));const tip=wmesh(new T.SphereGeometry(.026,14,10),'#d8ccb4',HN);tip.position.copy(cu.getPointAt(1));g.add(tip);
      const p0=cu.getPointAt(.03),cf=wmesh(new T.CylinderGeometry(.09,.095,.07,32,1,true),'#f1b630',Object.assign({side:T.DoubleSide},GOLD));cf.position.copy(p0);cf.lookAt(p0.clone().add(cu.getTangentAt(.03)));cf.rotateX(Math.PI/2);g.add(cf);
      for(const d of[-.035,.035]){const rg=wmesh(new T.TorusGeometry(.093,.008,8,40),'#ffd66a',GOLD);rg.position.copy(p0).addScaledVector(cu.getTangentAt(.03),d);rg.lookAt(rg.position.clone().add(cu.getTangentAt(.03)));g.add(rg)}
      const bolt=(()=>{const sh=new T.Shape();sh.moveTo(.0,.1);sh.lineTo(-.04,.0);sh.lineTo(-.008,.0);sh.lineTo(-.03,-.09);sh.lineTo(.04,.02);sh.lineTo(.008,.02);sh.lineTo(.03,.1);sh.closePath();return new T.ExtrudeGeometry(sh,{depth:.016,bevelEnabled:true,bevelSize:.005,bevelThickness:.005,bevelSegments:2})})();
      const b=wmesh(bolt,'#ffd21f',{emissive:'#ffb000',emissiveIntensity:.5,metalness:.4,roughness:.22});b.position.set(sx*.2,.22,.06);b.rotation.z=-sx*.35;g.add(b)}
    const R=.25,hf=a=>{const c=Math.cos(a);return .03+.1*Math.pow(Math.max(0,c),6)};g.add(dmesh(shell(150,8,(u,v)=>{const a=u*Math.PI*2,y=v*hf(a),r=R+.03*y/.2;return [Math.sin(a)*r,y,Math.cos(a)*r]},.018),'#f1b630',GOLD));
    edgeTrim(g,hf,R,'#ffd66a',.01);const bt=wmesh(new T.TorusGeometry(R+.02,.016,10,72),'#ffd66a',GOLD);bt.rotation.x=Math.PI/2;bt.position.y=.008;g.add(bt);
    gemAt(g,0,.065,R+.035,'#1f4fd8',1.15);gemAt(g,.38,.04,R+.03,'#1f4fd8',.5);gemAt(g,-.38,.04,R+.03,'#1f4fd8',.5)},
  h_cityS(P,g){const T=P.T,C='#ffb000',o={roughness:.4,clearcoat:.35,clearcoatRoughness:.1,envMapIntensity:.45};
    const cp=[];for(let k=0;k<=24;k++){const t=k/24;cp.push(V2(Math.max(.001,.29*Math.pow(Math.cos(t*Math.PI/2),.6)*(1-.06*t)),-.02+t*.27))}
    g.add(wmesh(new T.LatheGeometry(cp,72),C,o));
    for(let k=0;k<6;k++){const a=k/6*Math.PI*2,pts=cp.slice(0,23).map(q=>new T.Vector3(Math.sin(a)*(q.x+.004),q.y,Math.cos(a)*(q.x+.004)));g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,.006,6),'#ffb000',o))}
    for(let k=0;k<12;k++){const a=k*2.4+.3,t=.2+(k*.37%1)*.6,q=cp[Math.round(t*24)],dr=wmesh(new T.SphereGeometry(.012,12,10),'#fff6c0',{roughness:.02,clearcoat:1,transparent:true,opacity:.6});dr.scale.set(.8,1.1,.5);face(dr,Math.sin(a)*(q.x+.004),q.y,Math.cos(a)*(q.x+.004));g.add(dr)}
    g.add(dmesh(shell(96,10,(u,v)=>{const a=u*Math.PI*2,bk=Math.pow(Math.max(0,-Math.cos(a)),1.2),sd=Math.pow(Math.sin(a),2),r=.285+v*(.13+.06*bk+.02*sd);return [Math.sin(a)*r,-.02-v*v*(.06+.07*bk+.03*sd)+v*.01,Math.cos(a)*r]},.022),C,o));
    const ed=[];for(let i=0;i<96;i++){const a=i/96*Math.PI*2,bk=Math.pow(Math.max(0,-Math.cos(a)),1.2),sd=Math.pow(Math.sin(a),2),r=.285+.13+.06*bk+.02*sd;ed.push(new T.Vector3(Math.sin(a)*r,-.02-(.06+.07*bk+.03*sd)+.01,Math.cos(a)*r))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(ed,true),192,.013,8,true),'#ffb000',o));
    const b=[];for(let k=0;k<=6;k++){const t=k/6;b.push(V2(.292+.006*Math.sin(t*Math.PI),.0+t*.055))}g.add(wmesh(new T.LatheGeometry(b,72),'#2f62c9',{roughness:.3,clearcoat:.7}));
    const bk=new T.Group();face(bk,0,.028,.3);g.add(bk);for(const [w,h,x,y] of[[.07,.014,0,.026],[.07,.014,0,-.026],[.014,.066,-.028,0],[.014,.066,.028,0]]){const q=wmesh(new T.BoxGeometry(w,h,.014),'#1d3f8f',{metalness:.3,roughness:.3});q.position.set(x,y,0);bk.add(q)}
    const cl=new T.Group();face(cl,.16,.02,.3);cl.scale.setScalar(1.5);g.add(cl);[[0,.008,.03],[-.03,-.005,.022],[.03,-.005,.022],[.012,.0,.026]].forEach(([x,y,r])=>{const c=wmesh(new T.SphereGeometry(r,16,12),'#ffffff',{roughness:.6,sheen:.5});c.position.set(x,y,0);cl.add(c)});
    for(const x of[-.018,.016]){const dr=wmesh(new T.SphereGeometry(.011,12,10),'#3aa8ff',{roughness:.05,clearcoat:1});dr.scale.y=1.45;dr.position.set(x,-.048,.0);cl.add(dr)}
    g.position.y=.04},
  h_desertS(P,g){const T=P.T,o={roughness:.65,clearcoat:.1,sheen:.7,sheenRoughness:.5,sheenColor:new T.Color('#fff3d8')},cs=['#ecd4a2','#dcbc84','#f1dcb0','#d8b47c','#e6c995'];
    const core=wmesh(new T.SphereGeometry(.33,48,24,0,Math.PI*2,0,Math.PI/2),'#e3c48c',o);core.scale.y=.78;core.position.y=-.03;g.add(core);
    [[.0,.33,.22],[.07,.3,-.24],[.14,.25,.24],[.2,.17,-.2]].forEach(([y,r,tl],i)=>{const t=wmesh(new T.TorusGeometry(r,.078-i*.008,18,80),cs[i],o);t.rotation.order='ZXY';t.rotation.x=Math.PI/2;t.rotation.z=tl;t.position.y=y;g.add(t)});
    const sc=[];for(let k=0;k<=30;k++){const a=-.9+k/30*2.6;sc.push(new T.Vector3(Math.sin(a)*.38,.0+.16*(1-k/30),Math.cos(a)*.38))}const sm=wmesh(taper(T,sc,.04,.045,60,10).g,'#e0663a',{roughness:.55,sheen:.5,sheenColor:new T.Color('#ffb08a')});sm.scale.set(1,.7,1);g.add(sm);
    const hang=taper(T,[new T.Vector3(.3,.02,.06),new T.Vector3(.36,-.1,.04),new T.Vector3(.37,-.22,.0),new T.Vector3(.35,-.32,-.02)],.045,.06,24,12);const hm=wmesh(hang.g,'#e0663a',{roughness:.55,sheen:.5,sheenColor:new T.Color('#ffb08a')});hm.scale.z=.45;g.add(hm);
    const pts=[new T.Vector3(-.02,.22,-.02),new T.Vector3(-.05,.36,-.05),new T.Vector3(-.01,.47,0),new T.Vector3(.08,.51,.06),new T.Vector3(.15,.47,.12)],cu=new T.CatmullRomCurve3(pts);
    for(let k=0;k<11;k++){const t=k/10,p=cu.getPointAt(t),r=.088-.02*t,s=wmesh(new T.CylinderGeometry(r,r*1.08,.04,28),k%2?'#c8784a':'#b9683c',{roughness:.4,clearcoat:.5});s.position.copy(p);s.lookAt(p.clone().add(cu.getTangentAt(t)));s.rotateX(Math.PI/2);g.add(s);const rg=wmesh(new T.TorusGeometry(r*1.04,.009,8,28),'#9a4e2c',{roughness:.5});rg.position.copy(p);rg.lookAt(p.clone().add(cu.getTangentAt(t)));g.add(rg)}
    const end=cu.getPointAt(1),tan=cu.getTangentAt(1),mo=new T.Group();mo.position.copy(end).addScaledVector(tan,.02);mo.lookAt(mo.position.clone().add(tan));g.add(mo);
    const lip=wmesh(new T.TorusGeometry(.075,.02,10,32),'#e0663a',{roughness:.4,clearcoat:.5});mo.add(lip);const inn=wmesh(new T.CircleGeometry(.075,28),'#6a1220',{side:T.DoubleSide});inn.position.z=-.008;mo.add(inn);
    for(let k=0;k<12;k++){const a=k/12*Math.PI*2,th=wmesh(new T.ConeGeometry(.011,.035,8),'#fff6e0',{roughness:.3});th.position.set(Math.cos(a)*.062,Math.sin(a)*.062,.004);th.rotation.z=a+Math.PI/2;mo.add(th)}
    gemAt(g,0,.09,.41,'#e8401a',1.5);for(const dx of[-.045,0,.045]){for(let k=0;k<3;k++){const l=wmesh(new T.SphereGeometry(.005,8,6),'#f1b630',GOLD);face(l,dx,.03-k*.014-(dx?0:.01),.41);g.add(l)}const d=wmesh(new T.SphereGeometry(.014,12,10),'#f1b630',GOLD);d.scale.y=1.4;face(d,dx,-.015-(dx?0:.015),.41);g.add(d)}},
  h_candyS(P,g){const T=P.T,R=.26,CK={roughness:.7,clearcoat:.15,sheen:.5,sheenColor:new T.Color('#ffd0a0')},hf=a=>.11+.17*Math.pow((Math.cos(5*a)+1)/2,2.2);
    const tx=canvasTex('ginger2',256,128,(c,w,h)=>{c.fillStyle='#c4783a';c.fillRect(0,0,w,h);for(let i=0;i<260;i++){c.fillStyle=i%3?'rgba(120,60,20,.25)':'rgba(255,220,170,.25)';c.beginPath();c.arc((i*73)%w,(i*41)%h,1+(i%3),0,7);c.fill()}});
    g.add(dmesh(shell(150,12,(u,v)=>{const a=u*Math.PI*2,y=v*hf(a),r=R+.03*y/.2;return [Math.sin(a)*r,y,Math.cos(a)*r]},.035),wm('#ffffff',Object.assign({map:tx},CK))));
    const bt=wmesh(new T.TorusGeometry(R+.025,.026,12,72),wm('#ffffff',Object.assign({map:tx},CK)));bt.rotation.x=Math.PI/2;bt.position.y=.012;g.add(bt);
    const ice=(f,off)=>{const pts=[];for(let i=0;i<300;i++){const a=i/300*Math.PI*2,y=f(a);pts.push(new T.Vector3(Math.sin(a)*(R+.03*y/.2+off),y,Math.cos(a)*(R+.03*y/.2+off)))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts,true),600,.009,6,true),'#ffffff',{roughness:.35,clearcoat:.4}))};
    ice(a=>hf(a)-.025,.04);ice(a=>.055+.014*Math.sin(a*40),.045);
    const bc=['#e3242f','#3cbf4a','#ffcf2e','#ff7ab0'];for(let i=0;i<5;i++){const a=i/5*Math.PI*2,y=hf(a)+.025,r=R+.03*y/.2;const gd=wmesh(new T.SphereGeometry(.036,18,12),bc[i%4],{roughness:.12,clearcoat:1});gd.scale.y=1.15;gd.position.set(Math.sin(a)*r,y,Math.cos(a)*r);g.add(gd);
      for(const d of[.3,-.3]){if(d<0&&i===0)continue;const g2=wmesh(new T.SphereGeometry(.026,14,10),bc[(i+(d>0?1:2))%4],{roughness:.12,clearcoat:1});g2.scale.set(.85,1.2,.6);face(g2,Math.sin(a+d)*(R+.05),.12,Math.cos(a+d)*(R+.05));g.add(g2)}}
    gemAt(g,0,.13,R+.055,'#d11a2a',1.4);g.position.y=.01},
  h_snowS(P,g){const T=P.T;H.pirate(P,g);g.children.filter(c=>c.isGroup).forEach(c=>c.visible=false);
    g.traverse(m=>{if(m.isMesh&&m.material.color){const h=m.material.color.getHex();if(h===0x1c1824)m.material.color.set('#1f2a5c');if(h===0xb51f2d)m.material.color.set('#c8a24a')}});
    const ro=new T.Group();face(ro,.13,.14,.31,.0);g.add(ro);const rs=wmesh(new T.TorusGeometry(.04,.013,10,24),'#f1b630',GOLD);ro.add(rs);const gm=wmesh(new T.SphereGeometry(.03,16,12),'#1f4fd8',{roughness:.05,clearcoat:1,emissive:'#1f4fd8',emissiveIntensity:.2});gm.scale.z=.6;ro.add(gm);
    const lf=new T.Group();face(lf,-.03,.11,.335);g.add(lf);for(const sx of[-1,1])for(let k=0;k<5;k++){const l=wmesh(leafGeo(T),'#f1b630',GOLD);l.scale.setScalar(.2);l.position.set(sx*(.008+k*.004),-.03+k*.022,0);l.rotation.z=-sx*(.9-k*.08);lf.add(l)}
    const st=wmesh(new T.CapsuleGeometry(.004,.1,4,6),'#f1b630',GOLD);st.position.y=.015;lf.add(st);
    const fg=featherGeo(T);[['#2a3fa0',.0,.6,1.25],['#f6f2ea',.05,.15,1.5],['#2a3fa0',.1,-.3,1.2],['#f6f2ea',-.04,.9,.95]].forEach(([c,dx,rz,k])=>{const f=wmesh(fg,c,{roughness:.75,clearcoat:0,sheen:1,sheenRoughness:.4,sheenColor:new T.Color('#ffffff'),side:T.DoubleSide});f.scale.setScalar(k);f.position.set(.14+dx,.2,.12-dx);f.rotation.order='YXZ';f.rotation.y=-.5;f.rotation.x=-.75;f.rotation.z=rz-.5;g.add(f)})},
  h_oceanS(P,g){const T=P.T;g.add(hband(T,'#7c8696',{metalness:.5,roughness:.3,clearcoat:.5},.03,.026));
    const sh=new T.Shape();sh.moveTo(-.2,0);sh.bezierCurveTo(-.12,.15,.0,.33,.17,.4);sh.bezierCurveTo(.08,.28,.1,.12,.18,0);sh.closePath();
    const fg=new T.ExtrudeGeometry(sh,{depth:.035,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:5,curveSegments:28});fg.translate(0,0,-.0175);
    const fp=fg.attributes.position,cl=[],ca=new T.Color('#6f7a8c'),cb=new T.Color('#c4ccd8');for(let i=0;i<fp.count;i++){const t=Math.min(1,Math.max(0,fp.getY(i)/.4));const c=cb.clone().lerp(ca,Math.pow(t,.6));cl.push(c.r,c.g,c.b)}fg.setAttribute('color',new T.Float32BufferAttribute(cl,3));
    const fin=wmesh(fg,wm('#ffffff',{vertexColors:true,roughness:.25,clearcoat:.9}));fin.rotation.y=Math.PI/2-.55;fin.position.set(0,.06,-.02);g.add(fin);
    const W={roughness:.1,clearcoat:1,emissive:'#1a7acf',emissiveIntensity:.35};
    for(let k=0;k<9;k++){const a=(k-4)*.32,c=k%2?'#3ab8ff':'#7ad4ff',w=wmesh(new T.TorusGeometry(.06,.024,12,24,Math.PI*1.3),c,W);w.position.set(Math.sin(a)*.25,.05+(k%3)*.018,Math.cos(a)*.2);w.rotation.y=a+Math.PI/2;w.rotation.x=-.3;g.add(w);
      const fm=wmesh(new T.SphereGeometry(.016,10,8),'#ffffff',{roughness:.3});fm.position.set(Math.sin(a+.12)*.27,.1+(k%3)*.018,Math.cos(a+.12)*.22);g.add(fm)}
    const sl=new T.Group();face(sl,.07,.06,.32);sl.scale.setScalar(1.7);g.add(sl);for(let k=0;k<7;k++){const r=wmesh(new T.CapsuleGeometry(.009,.04,4,8),'#f1b630',GOLD);const a=(k-3)*.32;r.position.set(Math.sin(a)*.025,Math.cos(a)*.025,0);r.rotation.z=-a;sl.add(r)}
    const gm=wmesh(new T.SphereGeometry(.014,12,10),'#2f7ae1',{roughness:.05,clearcoat:1});gm.position.set(0,.0,.012);sl.add(gm)},
  h_volcanoS(P,g){const T=P.T,R=.25;crownBand(g,R,a=>.03+.08*Math.pow(Math.max(0,Math.cos(a)),8),'#f1b630');
    const flame=(()=>{const sh=new T.Shape();sh.moveTo(-.05,0);sh.bezierCurveTo(-.08,.12,-.02,.22,.02,.36);sh.bezierCurveTo(.0,.3,.02,.25,.05,.22);sh.bezierCurveTo(.06,.16,.07,.08,.05,0);sh.closePath();
      const ge=new T.ExtrudeGeometry(sh,{depth:.008,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:3,curveSegments:20});ge.translate(0,0,-.004);const p=ge.attributes.position,cl=[],c0=new T.Color('#ffa200'),c1=new T.Color('#e83000'),c2=new T.Color('#a00008');
      for(let i=0;i<p.count;i++){const t=Math.min(1,Math.max(0,p.getY(i)/.36)),c=t<.5?c0.clone().lerp(c1,t*2):c1.clone().lerp(c2,(t-.5)*2);cl.push(c.r,c.g,c.b);p.setZ(i,p.getZ(i)-Math.abs(p.getX(i))*.4)}ge.setAttribute('color',new T.Float32BufferAttribute(cl,3));ge.computeVertexNormals();return ge})();
    const FM=wm('#ffffff',{vertexColors:true,emissive:'#ff3a00',emissiveIntensity:.05,roughness:.45,clearcoat:.25,envMapIntensity:.5,side:T.DoubleSide});
    for(let i=0;i<11;i++){const t=i/10-.5,a=t*2.3,k=1.25-Math.abs(t)*.35,f=new T.Mesh(flame,FM);f.scale.set(k*(t<0?-1:1),k*(1-Math.abs(t)*.3),k);f.position.set(Math.sin(a)*R*.9,.03,Math.cos(a)*R*.9-.03);f.rotation.y=a;f.rotation.x=-.18;f.rotation.z=-t*2.1;g.add(f)}
    for(let i=0;i<7;i++){const t=i/6-.5,a=t*1.7,f=new T.Mesh(flame,FM);f.scale.set(.7*(t<0?-1:1),.7,.7);f.position.set(Math.sin(a)*R*1.0,.03,Math.cos(a)*R*1.0);f.rotation.y=a;f.rotation.x=-.08;f.rotation.z=-t*1.3;g.add(f)}
    gemAt(g,0,.07,R+.04,'#d11a2a',1.15);for(const sx of[-1,1]){const sw=wmesh(new T.TorusGeometry(.045,.008,8,24,Math.PI*1.2),'#ffd66a',GOLD);face(sw,sx*.075,.04,R+.035);sw.rotateZ(sx>0?-.3:Math.PI+.3);g.add(sw)}},
  h_spaceS(P,g){const T=P.T,tx=canvasTex('cosmos2',256,64,(c,w,h)=>{const gr=c.createLinearGradient(0,0,w,0);gr.addColorStop(0,'#2a1650');gr.addColorStop(.5,'#4a2a8a');gr.addColorStop(1,'#2a1650');c.fillStyle=gr;c.fillRect(0,0,w,h);for(let i=0;i<90;i++){c.fillStyle=i%5?'rgba(255,255,255,.75)':'#ffd23f';c.beginPath();c.arc((i*53)%w,(i*29)%h,i%5?.9:1.8,0,7);c.fill()}});
    g.add(hband(T,wm('#ffffff',{map:tx,roughness:.25,clearcoat:.9}),null,.036,.03));
    const eg=new T.Group();eg.position.set(0,.12,.22);eg.rotation.x=-.2;eg.scale.setScalar(1.6);g.add(eg);const lid=wmesh(new T.TorusGeometry(.065,.014,12,40),'#f1b630',GOLD);lid.scale.set(1.4,.85,1);eg.add(lid);
    const lb=wmesh(new T.TorusGeometry(.075,.012,10,40),'#4a2a8a',{roughness:.3,clearcoat:.8});lb.scale.set(1.45,.95,1);lb.position.z=-.006;eg.add(lb);
    const ball=wmesh(new T.SphereGeometry(.062,28,18),'#f0e6ff',{roughness:.08,clearcoat:1});ball.scale.set(1.35,.8,.6);eg.add(ball);
    const ir=wmesh(new T.SphereGeometry(.042,24,16),'#9a4dff',{roughness:.05,clearcoat:1,emissive:'#7a2dff',emissiveIntensity:.6});ir.scale.set(1,1,.5);ir.position.z=.022;eg.add(ir);
    const sl=wmesh(new T.CapsuleGeometry(.007,.045,4,8),'#140a2a');sl.position.z=.044;sl.scale.z=.4;eg.add(sl);const hl=wmesh(new T.SphereGeometry(.008,10,8),'#ffffff',{emissive:'#ffffff',emissiveIntensity:1});hl.position.set(.015,.015,.045);eg.add(hl);
    for(const sx of[-1,1]){const sp=wmesh(new T.ConeGeometry(.012,.04,8),'#f1b630',GOLD);sp.position.set(sx*.07,.06,0);sp.rotation.z=-sx*.6;eg.add(sp)}
    [[.25,.04,.048],[-.25,.04,.048],[.17,.12,.036],[-.17,.12,.036],[.31,-.07,.032],[-.31,-.07,.032]].forEach(([x,y,s])=>{const st=wmesh(starGeo(T,s,s*.42,.01),'#f1b630',GOLD);const r=bodyR(Math.min(.999,(.66+y)/.75))+.04,z=Math.sqrt(Math.max(0,r*r-x*x));face(st,x,y,z);g.add(st)});
    const mn=wmesh(moonGeo(T,.04,.012),'#f1b630',GOLD);face(mn,.13,.16,.24);g.add(mn);gemAt(g,0,0,0,'#2f7ae1',.45,new T.Vector3(-.3,-.05,.12))},
  h_jungle(P,g){const T=P.T,R=.26,lg=leafGeo(T);const vn=wmesh(new T.TorusGeometry(R+.015,.02,10,72),'#f1b630',GOLD);vn.rotation.x=Math.PI/2;vn.position.y=.03;g.add(vn);
    for(let i=0;i<18;i++){const a=i/18*Math.PI*2,fr=Math.max(0,Math.cos(a)),k=.95+.55*fr,l=wmesh(lg,i%2?'#1a6e24':'#2a8c32',{roughness:.4,clearcoat:.5,side:T.DoubleSide});l.scale.set(k*1.25,k,k);l.position.set(Math.sin(a)*R,.03,Math.cos(a)*R);l.rotation.order='YXZ';l.rotation.y=a+(i%2?.12:-.12);l.rotation.x=.4;l.rotation.z=(i%3-1)*.3;g.add(l)}
    {const m=wmesh(lg,'#156a20',{roughness:.4,clearcoat:.5,side:T.DoubleSide});m.scale.set(1.5,1.15,1.15);m.position.set(0,.05,R+.04);m.rotation.x=.3;g.add(m);
      const vein=wmesh(new T.CapsuleGeometry(.004,.3,4,6),'#5ab04a',{roughness:.5});vein.position.set(0,.18,R+.1);vein.rotation.x=.3;vein.scale.y=.8;g.add(vein)}
    const vp=[];for(let k=0;k<=80;k++){const a=-1.6+k/80*3.2;vp.push(new T.Vector3(Math.sin(a)*(R+.045),.06+.025*Math.sin(a*9),Math.cos(a)*(R+.045)))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(vp),160,.009,8),'#f1b630',GOLD));
    for(let i=0;i<12;i++){const a=-1.5+i/11*3,l=wmesh(lg,'#f1b630',GOLD);l.scale.setScalar(.32);l.position.set(Math.sin(a)*(R+.05),.065+.025*Math.sin(a*9),Math.cos(a)*(R+.05));l.rotation.order='YXZ';l.rotation.y=a;l.rotation.z=(i%2?1:-1)*1.1;g.add(l)}
    gemAt(g,0,.07,R+.07,'#12a04a',1.35)},
  h_castle(P,g){const T=P.T,R=.25,GH={color:'#dfe8ff',roughness:.08,clearcoat:1,transparent:true,opacity:.93,emissive:'#8fb0ff',emissiveIntensity:.55,side:T.DoubleSide};
    g.add(wmesh(shell(120,8,(u,v)=>{const a=u*Math.PI*2,y=v*(.11+.025*Math.sin(a*8)),r=R+.03*v;return [Math.sin(a)*r,y,Math.cos(a)*r]},.03),wm(GH.color,GH)));
    const tr=wmesh(new T.TorusGeometry(R+.03,.02,10,72),wm('#eef3ff',GH));tr.rotation.x=Math.PI/2;tr.position.y=.012;g.add(tr);
    [[0,1.9,.06],[.75,1.35,.05],[-.75,1.35,.05]].forEach(([a,k,y])=>{const gh=ghostMesh(T,GH,k);gh.position.set(Math.sin(a)*(R+.01),y,Math.cos(a)*(R+.01));gh.rotation.y=a;g.add(gh)});
    gemAt(g,0,.06,R+.045,'#1f4fd8',1.1);[.35,-.35,1.2,-1.2].forEach((a,i)=>{const s=wmesh(starGeo(T,i<2?.032:.026,.013,.008),'#f1b630',GOLD);face(s,Math.sin(a)*(R+.045),.055,Math.cos(a)*(R+.045));g.add(s)})},
  h_clouds(P,g){const T=P.T,F={roughness:.9,clearcoat:0,sheen:1,sheenRoughness:.35,sheenColor:new T.Color('#ffffff')};{const hb=hband(T,'#f8f6fb',F,.03,.03),fs=furShells(hb.geometry,'#f8f6fb',{len:.04,rep:[12,1],layers:14});fs.scale.z=1.5;g.add(fs)}
    const tx=canvasTex('unihorn2',64,256,(c,w,h)=>{const gr=c.createLinearGradient(0,0,0,h);['#ff9ccc','#b49cff','#8ad8ff','#ffe08a','#ff9ccc'].forEach((x,i)=>gr.addColorStop(i/4,x));c.fillStyle=gr;c.fillRect(0,0,w,h)});
    const hg=surf(48,48,(u,v)=>{const a=u*Math.PI*2,r=.06*(1-v)*(1+.22*Math.max(0,Math.sin(a+v*Math.PI*10))),y=v*.32;return [Math.sin(a)*r,y,Math.cos(a)*r]},1);
    const hm=wmesh(hg,wm('#ffffff',{map:tx,roughness:.15,clearcoat:1,iridescence:.5}));hm.position.set(0,.09,.1);hm.rotation.x=.18;hm.scale.setScalar(1.55);g.add(hm);
    const sp=[];for(let k=0;k<=120;k++){const t=k/120,a=t*Math.PI*10,r=.06*(1-t)*1.22+.003;sp.push(new T.Vector3(Math.sin(a)*r,t*.32,Math.cos(a)*r))}const sm=wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(sp),300,.004,6),'#f1b630',GOLD);sm.position.copy(hm.position);sm.rotation.x=.18;sm.scale.setScalar(1.55);g.add(sm);
    for(const sx of[-1,1]){const e=new T.Group();e.position.set(sx*.2,.13,.05);e.rotation.z=-sx*.45;g.add(e);const o=furShells(new T.ConeGeometry(.1,.21,32,8),wm('#ffffff',{map:furPaint('uni','#fbfaff')}),{len:.04,rep:[3,2],layers:14});o.scale.z=.5;e.add(o);const i=wmesh(new T.ConeGeometry(.065,.15,24),'#ff9cbc',{roughness:.55});i.scale.z=.3;i.position.set(0,-.01,.02);e.add(i)}
    [['#ff6fae',.08,.0],['#5ab8ff',.12,-.06],['#6ee0b0',.03,-.1]].forEach(([c,x,z],i)=>{const pts=[];for(let k=0;k<=24;k++){const t=k/24,a=t*Math.PI*1.4;pts.push(new T.Vector3(x+.05+Math.sin(a)*.06*(1-t*.4),.12+Math.cos(a)*.07*(1-t*.3)+.04,z-.04))}g.add(wmesh(taper(T,pts,.04,.01,30,12).g,c,{roughness:.35,clearcoat:.6}))});
    const fl=new T.Group();face(fl,0,.07,.25);g.add(fl);for(const sx of[-1,1]){const s=wmesh(new T.TorusGeometry(.03,.007,8,24,Math.PI*1.3),'#f1b630',GOLD);s.position.x=sx*.04;s.rotation.z=sx>0?-.4:Math.PI+.4;fl.add(s)}
    gemAt(g,0,.075,.26,'#c03ad8',.8);
    for(const sx of[-1,1]){const ax=sx*(bodyR((.66-.06)/.75)+.05);for(let k=0;k<3;k++){const l=wmesh(new T.TorusGeometry(.007,.0025,6,12),'#f1b630',GOLD);l.position.set(ax,-.07-k*.013,.04);l.rotation.y=k%2?Math.PI/2:0;g.add(l)}const ds=wmesh(starGeo(T,.04,.01,.01,4),'#f1b630',GOLD);ds.scale.y=1.3;ds.position.set(ax,-.14,.04);g.add(ds)}},
  h_dino(P,g){const T=P.T,o={roughness:.5,clearcoat:.35},GR='#3f8a30';
    const tx=canvasTex('dinoscale',256,256,(c,w,h)=>{c.fillStyle=GR;c.fillRect(0,0,w,h);for(let y=0;y<h;y+=16)for(let x=(y/16%2)*8;x<w;x+=16){c.fillStyle='rgba(20,60,15,.35)';c.beginPath();c.arc(x,y,7,0,7);c.fill();c.fillStyle='rgba(140,210,110,.25)';c.beginPath();c.arc(x-2,y-2,4,0,7);c.fill()}});
    const DM=wm('#ffffff',Object.assign({map:tx,side:T.DoubleSide},o));
    const fr=shell(80,12,(u,v)=>{const a=(u-.5)*Math.PI*1.35,r=.14+v*.3,sc=1+.07*Math.sin(u*Math.PI*18)*v;return [Math.sin(a)*r*sc,.0+Math.cos(a)*r*sc*.95,-.06-v*.1]},.025);g.add(new T.Mesh(fr,DM));
    for(let i=0;i<11;i++){const a=(i/10-.5)*Math.PI*1.3,r=.45,sp=wmesh(new T.ConeGeometry(.05,.11,14),'#ff7a10',{roughness:.4,clearcoat:.5});sp.position.set(Math.sin(a)*r,.0+Math.cos(a)*r*.95,-.16);sp.rotation.z=-a;g.add(sp)}
    const hp=new T.Mesh(new T.SphereGeometry(.29,48,24,0,Math.PI*2,0,Math.PI/2),DM);hp.position.y=-.05;hp.scale.y=.62;g.add(hp);
    const HM={roughness:.3,clearcoat:.8};
    for(const sx of[-1,1]){const hn=taper(T,[new T.Vector3(sx*.12,.12,.12),new T.Vector3(sx*.14,.22,.2),new T.Vector3(sx*.12,.3,.3)],.05,.005,24,16);g.add(wmesh(hn.g,'#f2e2bc',HM));const r=wmesh(new T.TorusGeometry(.05,.012,8,28),'#f1b630',GOLD);r.position.set(sx*.12,.125,.125);r.lookAt(new T.Vector3(sx*.14,.25,.22));g.add(r)}
    {const hn=taper(T,[new T.Vector3(0,.02,.25),new T.Vector3(0,.08,.31),new T.Vector3(0,.15,.34)],.04,.004,20,14);g.add(wmesh(hn.g,'#f2e2bc',HM))}
    gemAt(g,0,0,0,'#ff8a1f',.85,new T.Vector3(0,.0,.29))},
  h_factory(P,g){const T=P.T,M={metalness:.85,roughness:.22,clearcoat:.4};g.add(hband(T,'#b8bec8',M,.042,.03));
    for(let k=-4;k<=4;k++){if(!k)continue;const s=k/5,y=-.17+.26*(1-s*s),r=bodyR(Math.min(.999,(.66+y)/.75))+.03*Math.sqrt(Math.abs(s))+.04;const b=wmesh(new T.SphereGeometry(.012,10,8),'#8a929e',M);b.position.set(Math.sign(s)*r,y+.03*(1-Math.abs(s)),.04);g.add(b)}
    const pn=new T.Group();face(pn,0,.06,.26);pn.rotateX(-.5);g.add(pn);const fr=wmesh(new T.CapsuleGeometry(.032,.15,8,16),'#7a828e',M);fr.rotation.z=Math.PI/2;fr.scale.z=.3;pn.add(fr);
    const gl=wmesh(new T.CapsuleGeometry(.02,.13,8,16),'#18c8f0',{emissive:'#10b8e8',emissiveIntensity:.6,roughness:.2});gl.rotation.z=Math.PI/2;gl.scale.z=.5;gl.position.z=.02;pn.add(gl);
    for(const sx of[-1,1]){const y=-.13,x=sx*(bodyR((.66+y)/.75)+.04),cp=wmesh(new T.CylinderGeometry(.075,.075,.05,32),'#9aa2ae',M);cp.rotation.z=Math.PI/2;cp.position.set(x,y,0);g.add(cp);
      const gm=wmesh(new T.SphereGeometry(.05,20,14),'#d8141f',{roughness:.05,clearcoat:1,emissive:'#e3242f',emissiveIntensity:.35});gm.scale.x=.55;gm.position.set(x+sx*.03,y,0);g.add(gm);const rr=wmesh(new T.TorusGeometry(.055,.012,8,28),'#f1b630',GOLD);rr.rotation.y=Math.PI/2;rr.position.set(x+sx*.028,y,0);g.add(rr)}
    const hp=[];for(let k=0;k<=120;k++){const t=k/120,a=t*Math.PI*2*7,r=.03-.01*t;hp.push(new T.Vector3(Math.cos(a)*r,.13+t*.2,Math.sin(a)*r))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(hp),360,.007,6),'#f1b630',GOLD));
    const bs=wmesh(new T.CylinderGeometry(.04,.055,.04,24),'#9aa2ae',M);bs.position.y=.12;g.add(bs);const ball=wmesh(new T.SphereGeometry(.062,24,16),'#d8141f',{roughness:.06,clearcoat:1,emissive:'#ff2020',emissiveIntensity:.3});ball.position.y=.38;g.add(ball)},
  h_crystal(P,g){const T=P.T,R=.25;{const bd=wmesh(new T.TorusGeometry(R+.015,.026,10,64),'#f0a8ff',{roughness:.1,clearcoat:1,transparent:true,opacity:.9,emissive:'#d070ff',emissiveIntensity:.2});bd.rotation.x=Math.PI/2;bd.position.y=.02;g.add(bd)}
    const cols=['#e8189a','#1f6ae8','#7a2ae8','#e8189a','#1f6ae8'];
    [[0,.4],[.3,.3],[-.3,.3],[.58,.26],[-.58,.26],[.88,.2],[-.88,.2],[1.2,.15],[-1.2,.15],[.15,.22],[-.15,.22],[.44,.18],[-.44,.18]].forEach(([a,h],i)=>{const c=cols[i%5],cg=new T.Group();cg.position.set(Math.sin(a)*(R+.0),.03,Math.cos(a)*(R+.0)-(i>8?.03:0));cg.rotation.y=a;cg.rotation.z=-a*.15;g.add(cg);
      const mat=new T.MeshPhysicalMaterial({color:c,roughness:.04,clearcoat:1,transparent:true,opacity:.9,emissive:c,emissiveIntensity:.35,flatShading:true,envMapIntensity:B3OPT.env*1.2});
      const w=.05*(.7+h);const pr=new T.Mesh(new T.CylinderGeometry(w,w*.8,h*.72,6),mat);pr.position.y=h*.36;cg.add(pr);const tp=new T.Mesh(new T.ConeGeometry(w,h*.3,6),mat);tp.position.y=h*.72+h*.15;cg.add(tp)});
    const fl=[];for(let k=0;k<=120;k++){const a=-1.3+k/120*2.6;fl.push(new T.Vector3(Math.sin(a)*(R+.05),.06+.03*Math.sin(a*7)*Math.cos(a*.5),Math.cos(a)*(R+.05)))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(fl),240,.01,8),'#f1b630',GOLD));
    for(const a of[.3,-.3,.75,-.75]){const s=wmesh(new T.TorusGeometry(.03,.007,8,24,Math.PI*1.4),'#f1b630',GOLD);face(s,Math.sin(a)*(R+.055),.085,Math.cos(a)*(R+.055));s.rotateZ(a>0?-.5:Math.PI+.5);g.add(s)}
    gemAt(g,0,.075,R+.06,'#3a5aff',1.2)}
  };
  const hp=buildHat;buildHat=function(P,id){const f=H[id];if(!f)return hp.apply(this,arguments);const g=new P.T.Group();f(P,g);P.hatSlot.add(g)};
})();
/* series look: the 14 glasses rebuilt in code from the graphics sheet acc/glasses.png */
(function(){
  const GLD={metalness:.8,roughness:.2,clearcoat:.5};
  const sup=(e,ax,ay)=>t=>{const a=t*Math.PI*2,c=Math.cos(a),s=Math.sin(a);return [ax*Math.sign(c)*Math.pow(Math.abs(c),2/e),ay*Math.sign(s)*Math.pow(Math.abs(s),2/e)]};
  const SH={
    circle:sup(2,1,1),rect:sup(4.5,1.05,.82),sun:sup(2.4,1.02,.95),shield:sup(3,1,.9),
    heart:t=>{const a=t*Math.PI*2,x=16*Math.pow(Math.sin(a),3),y=13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a);return [x/16,(y+2)/15]},
    star:t=>{const a=Math.PI/2+t*Math.PI*2,k=(t*10)%2,f=1-Math.abs(k-1),r=.48+.6*Math.pow(1-f,1.6);return [Math.cos(a)*r,Math.sin(a)*r]},
    avi:t=>{const a=t*Math.PI*2,c=Math.cos(a),s=Math.sin(a);let x=c*1.02,y=s*(s>0?.72:1.0);x+=.16*Math.max(0,-s)*Math.max(0,c);return [x,y+.1]},
    clover:t=>{const a=t*Math.PI*2+Math.PI/4,r=.55+.45*Math.pow(Math.abs(Math.cos(2*a)),.6);return [Math.cos(a-Math.PI/4)*r,Math.sin(a-Math.PI/4)*r]}};
  const pts=(f,n=128,k=1)=>{const o=[];for(let i=0;i<n;i++){const p=f(i/n);o.push(new THREE.Vector2(p[0]*k,p[1]*k))}return o};
  const GC={};
  function rimGeo(key,w,depth){const id=key+w+depth;if(GC[id])return GC[id];const T=THREE,f=SH[key],sh=new T.Shape(pts(f)),ho=new T.Path(pts(f,128,1-w).reverse());sh.holes.push(ho);
    const g=new T.ExtrudeGeometry(sh,{depth,bevelEnabled:true,bevelThickness:depth*.45,bevelSize:w*.32,bevelSegments:4,curveSegments:8});g.translate(0,0,-depth/2);g.computeVertexNormals();return GC[id]=g}
  function lensGeo(key,w){const T=THREE,g=new T.ShapeGeometry(new T.Shape(pts(SH[key],128,1-w*.5)));const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(uv.getX(i)+1.2)/2.4,(uv.getY(i)+1.2)/2.4);return g}
  const lensM=(c,op,o={})=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,transparent:true,opacity:op,roughness:.04,clearcoat:1,depthWrite:false,envMapIntensity:B3OPT.env*1.4},o));
  const gradTex=(key,stops)=>canvasTex(key,64,128,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));c.fillStyle=g;c.fillRect(0,0,w,h)});
  // one frame per eye, a bridge and two temples that follow the head
  function pair(P,o){const T=P.T,s=P.glassSlot,k=o.k||1.22,eyes=o.one?[P.eyes[1]]:P.eyes;
    const fm=typeof o.frame==='string'?wm(o.frame,o.fo||{roughness:.25,clearcoat:.9}):o.frame;
    for(const e of eyes){const gp=new T.Group();gp.position.copy(e.position);gp.rotation.y=e.rotation.y;s.add(gp);const sx=Math.sign(e.position.x)||1;
      const r=new T.Mesh(rimGeo(o.shape,o.w||.14,o.d||.035),fm);r.scale.set(B_ERX*k*sx,B_ERY*k*(o.ky||1),1);r.position.z=B_ERZ+.04;gp.add(r);
      if(o.lens){const lm=typeof o.lens==='function'?o.lens(sx):o.lens;const l=new T.Mesh(lensGeo(o.shape,o.w||.14),lm);l.scale.set(B_ERX*k*sx,B_ERY*k*(o.ky||1),1);l.position.z=B_ERZ+.036;gp.add(l)}
      if(o.each)o.each(gp,sx,k)}
    if(o.one)return fm;
    const yB=B_EY+(o.by||.1),zB=surfZ(0,yB)+.07;
    const br=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(-.07,yB-.01,zB),new T.Vector3(0,yB+.015,zB+.012),new T.Vector3(.07,yB-.01,zB)]),20,o.bw||.016,8),fm);s.add(br);
    if(o.bar){const b2=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(-.12,B_EY+B_ERY*k*.62,zB+.01),new T.Vector3(0,B_EY+B_ERY*k*.66,zB+.03),new T.Vector3(.12,B_EY+B_ERY*k*.62,zB+.01)]),20,.011,8),fm);s.add(b2)}
    if(o.noArms)return fm;
    temples(P,o.arm?wm(o.arm,{roughness:.3,clearcoat:.8}):fm,fm,B_EX+B_ERX*k*.98,o.aw);return fm}
  function temples(P,am,fm,X,aw){const T=P.T,s=P.glassSlot;
    for(const sx of[-1,1]){const y=B_EY+.06,c=[];const x0=sx*X,a0=Math.atan2(x0,surfZ(x0,y)+.1);
      c.push(new T.Vector3(x0,y,surfZ(Math.min(Math.abs(x0),bodyR(y/.75)*.98),y)+.08));
      for(let i=1;i<=6;i++){const a=Math.abs(a0)+(i/6)*(1.75-Math.abs(a0)),R=bodyR(y/.75)+.025;c.push(new T.Vector3(sx*Math.sin(a)*R,y+.0,Math.cos(a)*R))}
      s.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(c),40,aw||.015,8),am));
      const h=new T.Mesh(new T.SphereGeometry(.022,12,10),fm);h.position.copy(c[0]);s.add(h)}}
  // a wide piece bent around the face (ski goggles, sport visor, 3D glasses)
  function bent(geo,R,y0){const p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),a=x/R;p.setXYZ(i,Math.sin(a)*(R+z),p.getY(i)+y0,Math.cos(a)*(R+z))}geo.computeVertexNormals();return geo}
  const FR=()=>Math.hypot(B_EX,surfZ(B_EX,B_EY)+B_ERZ)+.06;
  function strap(P,c,w=.06){const T=P.T,R=bodyR(B_EY/.75)+.015,g=new T.CylinderGeometry(R,R,w,64,1,true,Math.PI*.3,Math.PI*1.4);const m=new T.Mesh(g,wm(c,{roughness:.6,clearcoat:.2,side:T.DoubleSide}));m.position.y=B_EY;m.rotation.y=Math.PI;P.glassSlot.add(m)}
  function wideShape(hw,hh,notch){const T=THREE,sh=new T.Shape(),n=64,o=[];for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,c=Math.cos(a),s=Math.sin(a);let x=hw*Math.sign(c)*Math.pow(Math.abs(c),2/3.2),y=hh*Math.sign(s)*Math.pow(Math.abs(s),2/3.2);
      if(notch&&s<0)y+=notch*Math.exp(-Math.pow(x/(hw*.16),2))*hh;o.push(new T.Vector2(x,y))}sh.setFromPoints(o);return sh}
  const G={
    round:P=>pair(P,{shape:'circle',frame:'#f1b630',fo:GLD,w:.1,d:.03,lens:lensM('#e8f4ff',.12)}),
    nerd:P=>{const fm=pair(P,{shape:'rect',frame:'#17141f',fo:{roughness:.18,clearcoat:1},w:.2,d:.06,bw:.024,aw:.022,lens:lensM('#e8f4ff',.12)});
      for(const sx of[-1,1]){const st=wmesh(new THREE.SphereGeometry(.014,10,8),'#d9dde6',{metalness:.9,roughness:.2});const x=sx*(B_EX+B_ERX*1.22*.9);st.position.set(x,B_EY+B_ERY*1.22*.68,surfZ(Math.min(Math.abs(x),.4),B_EY+.15)+.12);P.glassSlot.add(st)}},
    sun:P=>pair(P,{shape:'sun',frame:'#f1b630',fo:GLD,w:.1,d:.035,lens:lensM('#0c0a14',.94,{roughness:.02})}),
    heart:P=>pair(P,{shape:'heart',frame:'#ff5fa8',fo:{roughness:.15,clearcoat:1},w:.15,d:.045,k:1.3,lens:lensM('#ff6fae',.72),by:.14}),
    star:P=>pair(P,{shape:'star',frame:'#f6b820',fo:GLD,w:.15,d:.045,k:1.45,lens:lensM('#ffc21a',.8,{emissive:'#ffaa00',emissiveIntensity:.15}),by:.12}),
    goggles:P=>{const T=P.T,R=FR(),hw=B_EX+B_ERX*1.2,hh=B_ERY*1.22;
      const fs=wideShape(hw,hh,.38),ho=wideShape(hw*.86,hh*.8,.42);fs.holes.push(new T.Path(ho.getPoints(64).reverse()));
      const fg=bent(new T.ExtrudeGeometry(fs,{depth:.05,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:5,curveSegments:24}),R+.02,B_EY);
      P.glassSlot.add(new T.Mesh(fg,wm('#2f6fe0',{roughness:.18,clearcoat:1})));
      const lt=canvasTex('skilens',256,128,(c,w,h)=>{const g=c.createLinearGradient(0,0,w,h);['#4a1ad0','#1a6ae0','#18b0c0','#3ad060','#e0a020'].forEach((s,i)=>g.addColorStop(i/4,s));c.fillStyle=g;c.fillRect(0,0,w,h)});
      const lg=new T.ShapeGeometry(ho,24),uv=lg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/(2*hw)+.5,uv.getY(i)/(2*hh)+.5);bent(lg,R+.035,B_EY);
      P.glassSlot.add(new T.Mesh(lg,new T.MeshPhysicalMaterial({map:lt,roughness:.05,metalness:.6,clearcoat:1,iridescence:.8,transparent:true,opacity:.97,side:T.DoubleSide})));strap(P,'#23263a',.1)},
    monocle:P=>{const T=P.T,fm=pair(P,{shape:'circle',frame:'#f1b630',fo:GLD,w:.11,d:.035,one:1,k:1.2,lens:lensM('#e8f4ff',.18)}),e=P.eyes[1],x0=e.position.x+B_ERX*1.15,y0=B_EY-B_ERY*.6;
      const cu=new T.CatmullRomCurve3([new T.Vector3(x0,y0,surfZ(Math.min(x0,.42),y0)+.12),new T.Vector3(x0+.05,y0-.12,surfZ(Math.min(x0+.05,.44),y0-.12)+.1),new T.Vector3(x0+.03,y0-.3,surfZ(Math.min(x0+.03,.44),y0-.3)+.08)]);
      for(let i=0;i<=26;i++){const p=cu.getPointAt(i/26),b=new T.Mesh(new T.SphereGeometry(.009,8,6),fm);b.position.copy(p);P.glassSlot.add(b)}},
    aviator:P=>pair(P,{shape:'avi',frame:'#e0aa30',fo:GLD,w:.07,d:.025,bar:1,arm:'#7a4a25',lens:sx=>lensM('#ffffff',.9,{map:gradTex('avil',['#2a1608','#6a3c18','#c99060'])})}),
    pinkround:P=>pair(P,{shape:'circle',frame:'#ff6fb5',fo:{roughness:.15,clearcoat:1},w:.17,d:.05,lens:lensM('#ffe8f4',.14)}),
    visor:P=>{const T=P.T,R=FR(),hw=B_EX+B_ERX*1.25,hh=B_ERY*.95;
      const ls=wideShape(hw,hh,.32),lg=new T.ShapeGeometry(ls,24),uv=lg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/(2*hw)+.5,uv.getY(i)/(2*hh)+.5);bent(lg,R+.08,B_EY-.02);
      const lt=canvasTex('visorlens',256,64,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);['#ff3a7a','#ff8a1f','#ffe23a','#3ad0ff','#7a3cff'].forEach((s,i)=>g.addColorStop(i/4,s));c.fillStyle=g;c.fillRect(0,0,w,h)});
      P.glassSlot.add(new T.Mesh(lg,new T.MeshPhysicalMaterial({map:lt,metalness:.5,roughness:.06,clearcoat:1,iridescence:.5,side:T.DoubleSide})));
      const top=new T.Shape();top.moveTo(-hw,0);top.lineTo(hw,0);top.lineTo(hw*.98,.06);top.lineTo(-hw*.98,.06);top.closePath();
      const tg=bent(new T.ExtrudeGeometry(top,{depth:.04,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:3}),R+.085,B_EY-.02+hh*.8);P.glassSlot.add(new T.Mesh(tg,wm('#f6f7fb',{roughness:.2,clearcoat:1})));
      {const wm2=wm('#f6f7fb',{roughness:.2,clearcoat:1});temples(P,wm2,wm2,hw*.97,.02)}},
    threed:P=>{const T=P.T,R=FR(),hw=B_EX+B_ERX*1.28,hh=B_ERY*1.05,fs=new T.Shape();fs.moveTo(-hw,-hh);fs.lineTo(hw,-hh);fs.lineTo(hw,hh);fs.lineTo(-hw,hh);fs.closePath();
      const holes=[];for(const sx of[-1,1]){const cx=sx*B_EX,p=new T.Path(),a=B_ERX*1.0,b=B_ERY*.78;p.moveTo(cx-a,-b);p.lineTo(cx-a,b);p.lineTo(cx+a,b);p.lineTo(cx+a,-b);p.closePath();fs.holes.push(p);holes.push([cx,a,b,sx])}
      const nb=new T.Path();nb.absarc(0,-hh,.06,0,Math.PI,false);fs.holes.push(nb);
      P.glassSlot.add(new T.Mesh(bent(new T.ExtrudeGeometry(fs,{depth:.04,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:3,curveSegments:16}),R+.02,B_EY),wm('#f6f7fb',{roughness:.25,clearcoat:.8})));
      for(const [cx,a,b,sx] of holes){const g=new T.PlaneGeometry(2*a,2*b,8,4);g.translate(cx,0,0);P.glassSlot.add(new T.Mesh(bent(g,R+.035,B_EY),lensM(sx<0?'#1f5fff':'#ff1424',.93,{side:T.DoubleSide})))}
      {const wm2=wm('#f6f7fb',{roughness:.25,clearcoat:.8});temples(P,wm2,wm2,hw*.97,.022)}},
    night:P=>{const T=P.T,M={metalness:.5,roughness:.35,clearcoat:.5},H='#1c1e24';strap(P,'#1c1e24',.11);
      for(const e of P.eyes){const gp=new T.Group();gp.position.copy(e.position);gp.rotation.y=e.rotation.y;P.glassSlot.add(gp);
        const tb=wmesh(new T.CylinderGeometry(.15,.17,.2,40),H,M);tb.rotation.x=Math.PI/2;tb.position.z=B_ERZ+.12;gp.add(tb);
        const rg=wmesh(new T.TorusGeometry(.15,.018,10,40),'#32353e',M);rg.position.z=B_ERZ+.22;gp.add(rg);
        const ln=wmesh(new T.SphereGeometry(.13,32,16,0,Math.PI*2,0,Math.PI/2),'#18c040',{emissive:'#10e040',emissiveIntensity:.9,roughness:.05,clearcoat:1});ln.rotation.x=Math.PI/2;ln.scale.y=.4;ln.position.z=B_ERZ+.215;gp.add(ln)}
      const bx=wmesh(new T.BoxGeometry(.2,.16,.14,2,2,2),H,M);bx.position.set(0,B_EY+.02,surfZ(0,B_EY)+.12);P.glassSlot.add(bx);
      const mt=wmesh(new T.BoxGeometry(.16,.1,.1),'#2a2d35',M);mt.position.set(0,B_EY+.2,surfZ(0,B_EY+.2)+.06);P.glassSlot.add(mt);const mt2=wmesh(new T.BoxGeometry(.06,.14,.06),'#2a2d35',M);mt2.position.set(0,B_EY+.12,surfZ(0,B_EY+.12)+.1);P.glassSlot.add(mt2)},
    scope:P=>{const T=P.T,e=P.eyes[1],gp=new T.Group(),M={metalness:.6,roughness:.3,clearcoat:.5};gp.position.copy(e.position);gp.rotation.y=e.rotation.y;P.glassSlot.add(gp);
      const tb=wmesh(new T.CylinderGeometry(.2,.21,.16,48),'#1e2024',M);tb.rotation.x=Math.PI/2;tb.position.z=B_ERZ+.09;gp.add(tb);
      const rg=wmesh(new T.TorusGeometry(.2,.02,10,48),'#3a3e46',M);rg.position.z=B_ERZ+.17;gp.add(rg);
      const rt=canvasTex('reticle',256,256,(c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,10,w/2,h/2,w/2);g.addColorStop(0,'#2a8a3a');g.addColorStop(1,'#0a3a14');c.fillStyle=g;c.fillRect(0,0,w,h);c.strokeStyle='#8aff8a';c.lineWidth=5;c.beginPath();c.moveTo(w/2,14);c.lineTo(w/2,h-14);c.moveTo(14,h/2);c.lineTo(w-14,h/2);c.stroke();c.lineWidth=3;c.beginPath();c.arc(w/2,h/2,46,0,7);c.stroke();for(let i=-3;i<=3;i++){if(!i)continue;c.beginPath();c.moveTo(w/2+i*24,h/2-8);c.lineTo(w/2+i*24,h/2+8);c.moveTo(w/2-8,h/2+i*24);c.lineTo(w/2+8,h/2+i*24);c.stroke()}});
      const ln=new T.Mesh(new T.CircleGeometry(.19,48),new T.MeshPhysicalMaterial({map:rt,emissive:'#ffffff',emissiveMap:rt,emissiveIntensity:.8,roughness:.05,clearcoat:1}));ln.position.z=B_ERZ+.172;gp.add(ln);
      const tr=wmesh(new T.CylinderGeometry(.05,.05,.08,24),'#2a2d33',M);tr.rotation.z=Math.PI/2;tr.position.set(.24,.02,B_ERZ+.09);gp.add(tr);const kn=wmesh(new T.CylinderGeometry(.055,.055,.03,24),'#f1b630',GLD);kn.rotation.z=Math.PI/2;kn.position.set(.29,.02,B_ERZ+.09);gp.add(kn);
      const tp=wmesh(new T.CylinderGeometry(.035,.035,.07,20),'#2a2d33',M);tp.position.set(0,.24,B_ERZ+.09);gp.add(tp);const mb=wmesh(new T.BoxGeometry(.1,.08,.12),'#2a2d33',M);mb.position.set(0,-.23,B_ERZ+.06);gp.add(mb);
      strap(P,'#23252b',.07)},
    lucky:P=>pair(P,{shape:'clover',frame:'#f1b630',fo:GLD,w:.1,d:.035,k:1.3,arm:'#2a9a3a',lens:lensM('#12902e',.92,{emissive:'#0a5a18',emissiveIntensity:.15})})};
  const _bg=buildGlasses;buildGlasses=function(P,kind){const f=G[kind];if(!f)return _bg(P,kind);f(P)};
})();
