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
    const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(p,3));const ua=A.attributes.uv.array,uv=new Float32Array(N*4);uv.set(ua,0);uv.set(ua,N*2);g.setAttribute('uv',new T.BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();return g}
  function taper(T,pts,r0,r1,n=40,rad=14){const cu=new T.CatmullRomCurve3(pts),g=new T.TubeGeometry(cu,n,1,rad,false),p=g.attributes.position;
    for(let i=0;i<=n;i++){const t=i/n,c=cu.getPointAt(t),r=r0+(r1-r0)*Math.pow(t,.9);for(let j=0;j<=rad;j++){const k=i*(rad+1)+j;p.setXYZ(k,c.x+(p.getX(k)-c.x)*r,c.y+(p.getY(k)-c.y)*r,c.z+(p.getZ(k)-c.z)*r)}}
    g.computeVertexNormals();return {g,end:cu.getPointAt(1),start:cu.getPointAt(0)}}
  function fluff(T,r,seed=1){const g=new T.SphereGeometry(r,56,40),p=g.attributes.position,v=new T.Vector3();
    for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).normalize();const n=Math.sin(v.x*23+seed)*Math.sin(v.y*21+seed*2)*Math.sin(v.z*25+seed*3)+.5*Math.sin(v.x*41-v.z*37+seed)*Math.sin(v.y*43);v.multiplyScalar(r*(1+.07*n));p.setXYZ(i,v.x,v.y,v.z)}
    g.computeVertexNormals();return g}
  function starGeo(T,R,r,d,n=5,bv=.8){const sh=new T.Shape();for(let k=0;k<n*2;k++){const a=Math.PI/2+k*Math.PI/n,rr=k%2?r:R;k?sh.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):sh.moveTo(Math.cos(a)*rr,Math.sin(a)*rr)}
    const g=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelSize:d*bv,bevelThickness:d*bv,bevelSegments:3});g.translate(0,0,-d/2);return g}
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
  // furPaint v2 (cat, bunny, wolf and unicorn ears; furPaint v1 above has no callers in this batch any more): lathe UV u=0 front(+z), .25 +x, .5 back, .75 -x; v roots->tip. Combed strokes (o.stroke alphas) first, then 3-4 broad DIAGONAL stripes (o.angle deg, o.ry px, o.rx*w wide,
  // soft edge alphas o.sa) spanning the back and the outer front lobes; the pink footprint (u +-.11, below v o.frontV) restored in o.front (pinkish, so hairs over the pink read as pink fur) with an AO band o.ao at its edge; baked light: o.gv root->tip stops, o.keyStops key light over u (lit at u~.85 = screen top-left)
  function furPaint2(key,col,stripe,o={}){return canvasTex('fp3_'+key,256,256,(c,w,h)=>{c.fillStyle=col;c.fillRect(0,0,w,h);let s=11;const R=()=>(s=(s*16807)%2147483647)/2147483647;const rgba=(C,a)=>`rgba(${C.r*255|0},${C.g*255|0},${C.b*255|0},${a})`;
      const sk=o.stroke||[.16,.22];for(let i=0;i<2600;i++){const x=R()*w,y=R()*h,l=8+R()*14,d=R()<.5;c.strokeStyle=d?`rgba(0,0,0,${sk[0]})`:`rgba(255,255,255,${sk[1]})`;c.lineWidth=1+R();c.beginPath();c.moveTo(x,y);c.lineTo(x+l*.21+(R()-.5)*3,y-l*.98);c.stroke()}
      if(stripe){const S=new THREE.Color(stripe),ang=(o.angle===undefined?-28:o.angle)*Math.PI/180;for(const v of(o.at||[.2,.45,.7,.92])){const y=(1-v)*h,ry=(o.ry||22)+R()*5,sa=o.sa||[.3,.5,1];for(const[k,a]of[[11,sa[0]],[5,sa[1]],[0,sa[2]]]){c.fillStyle=rgba(S,a);c.beginPath();c.ellipse(w/2,y,w*(o.rx||.72),ry+k,ang,0,7);c.fill()}}
        const F=new THREE.Color(o.front||col),m=c.createLinearGradient(0,0,w,0);const hm=(C,A,y0,y1)=>{const g=c.createLinearGradient(0,0,w,0);const[f0,f1]=o.frontU||[.07,.11];for(const[p,q]of[[0,1],[f0,1],[f1,0],[1-f1,0],[1-f0,1],[1,1]])g.addColorStop(p,rgba(C,q*A));c.fillStyle=g;c.fillRect(0,y0,w,y1-y0)};hm(F,1,0,h);const G=new THREE.Color(col),fv=o.frontV||.72;hm(G,1,0,(1-fv-.05)*h);hm(G,.5,(1-fv-.05)*h,(1-fv+.03)*h)}
      // item 4: AO on the grey side of the seam -- a dark band around the pink footprint (u +-.105), full height; not for the tuft map
      if(o.key!==false){const ao=c.createLinearGradient(0,0,w,0),[f0,f1]=o.frontU||[.07,.11],f2=2*f1-f0;for(const[p,q]of[[0,0],[f0,0],[f1,.35],[f2,0],[1-f2,0],[1-f1,.35],[1-f0,0],[1,0]])ao.addColorStop(p,`rgba(0,0,0,${q*(o.ao===undefined?1:o.ao/.35)})`);c.fillStyle=ao;c.fillRect(0,0,w,h)}
      const gv=c.createLinearGradient(0,h,0,0);for(const[p,q]of(o.gv||[[0,'rgba(20,10,30,.62)'],[.5,'rgba(20,10,30,0)'],[1,'rgba(255,255,255,.45)']]))gv.addColorStop(p,q);c.fillStyle=gv;c.fillRect(0,0,w,h);
      if(o.key!==false){const gu=c.createLinearGradient(0,0,w,0);for(const[p,q]of(o.keyStops||[[0,'rgba(255,255,255,.14)'],[.15,'rgba(255,255,255,0)'],[.4,'rgba(0,0,0,.32)'],[.6,'rgba(0,0,0,.1)'],[.85,'rgba(255,255,255,.3)'],[1,'rgba(255,255,255,.14)']]))gu.addColorStop(p,q);c.fillStyle=gu;c.fillRect(0,0,w,h)}})}
  function furShells(geo,c,o={}){const T=THREE,L=o.layers||12,len=o.len||.03,g=new T.Group(),am=hairTex(o.rep||[6,6],{key:o.hair}),up=new T.Vector3(...(o.up||[0,1,0])),ramp=o.ramp||[.55,.6],at=o.at||[.06,.8],shI=o.sheenI===undefined?1:o.sheenI;
    geo=geo.index?geo.toNonIndexed():geo.clone();geo.computeVertexNormals();const P0=geo.attributes.position,N0=geo.attributes.normal;
    const base=wmesh(geo,typeof c==='string'?new THREE.Color(c).multiplyScalar(o.baseMul||.5).getStyle():c,Object.assign({roughness:.9,clearcoat:0,sheen:shI,sheenRoughness:.4,sheenColor:new T.Color(o.sheen||'#ffffff')},o.mat||{}));g.add(base);
    const U0=geo.attributes.uv,MK=o.mask,K=MK?new Float32Array(P0.count):null;if(MK)for(let k=0;k<P0.count;k++)K[k]=MK(P0.getX(k),P0.getY(k),P0.getZ(k),U0?U0.getX(k):0,U0?U0.getY(k):0);
    for(let i=1;i<=L;i++){const t=i/L,ge=geo.clone(),p=ge.attributes.position;for(let k=0;k<p.count;k++){const l=K?len*K[k]:len,d=l*t;p.setXYZ(k,P0.getX(k)+N0.getX(k)*d+up.x*l*t*t*.5,P0.getY(k)+N0.getY(k)*d+up.y*l*t*t*.5,P0.getZ(k)+N0.getZ(k)*d+up.z*l*t*t*.5)}
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
  // onion-dome ear outline: r(t)=R*cos(pi*(t*(1+a)-a)/2) -> base narrower than the widest point (t=a/(1+a)), both sides convex all the way, finite slope at the tip; pw > 1 tapers the last ~28% into a point
  const earLp=(R,H,a=.3,n=28,pw=1.35)=>{const p=[];for(let i=0;i<=n;i++){const t=i/n;p.push(V2(Math.max(.002,R*Math.pow(Math.max(0,Math.cos(Math.PI*(t*(1+a)-a)/2)),pw)),t*H-H/2))}return p};
  const catLp=(R,H,e,k,n=24)=>{const p=[];for(let i=0;i<=n;i++){const t=i/n;p.push(V2(Math.max(.002,R*Math.pow(1-t,e)*(1+k*Math.sin(t*Math.PI))),t*H-H/2))}return p};
  // hanging loop + stem that ties an earring to the band (x,y = loop centre)
  const earHang=(T,g,x,y,z)=>{const lp=wmesh(new T.TorusGeometry(.016,.005,8,20),'#f1b630',GOLD);lp.position.set(x,y,z);g.add(lp);const st=wmesh(new T.CylinderGeometry(.006,.006,.06,10),'#f1b630',GOLD);st.position.set(x,y+.02,z-.025);st.rotation.x=-.8;g.add(st)};
  // headband arc (same curve as hband: off .022): bandPt(s) -> [x,y] of the tube centre, bandY(x) -> y of the tube centre at hat x
  const bandPt=(s,off=.022)=>{const y0=-.17,y=y0+(.09-y0)*(1-s*s),r=bodyR(Math.min(.999,(.66+y)/.75));return [Math.sign(s)*(r+off*Math.sqrt(Math.abs(s))),y+off*(1-Math.abs(s))]};
  const bandTab=[];for(let i=0;i<=400;i++)bandTab.push(bandPt(i/200-1));const bandY=x=>{let b=0,bd=9;for(const q of bandTab){const d=Math.abs(q[0]-x);if(d<bd){bd=d;b=q[1]}}return b};
  // bend the bottom part of an ear lathe (local y -H/2..H/2) so its base follows the band arc: M = lathe-local -> hat space; base lands at band centre + yOff
  const earBend=(geo,H,M,yOff=-.025)=>{const Mi=M.clone().invert(),v=new THREE.Vector3(),p=geo.attributes.position;for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const t=(v.y+H/2)/H;if(t<.4){v.applyMatrix4(M);const w=1-t/.4;v.y+=(bandY(v.x)+yOff-v.y)*w;v.applyMatrix4(Mi);p.setXYZ(i,v.x,v.y,v.z)}}geo.computeVertexNormals();return geo};
  // recess the pink footprint into the FRONT face of an ear lathe (lathe-local, after earBend): z -= depth*(1-q^2)*smoothstep(1,.5,q), depth tapered to 0 by dt(y) toward the footprint tip, q = dishQ footprint ratio; normals recomputed so the rim hairs lean into the hollow
  const earDish=(geo,dq,depth=.10,dt)=>{const p=geo.attributes.position;for(let i=0;i<p.count;i++){const q=dq(p.getX(i),p.getY(i),p.getZ(i));if(q<1){const u=Math.min(1,Math.max(0,(1-q)/.5)),ss=u*u*(3-2*u),tp=dt?dt(p.getY(i)):1;p.setZ(i,p.getZ(i)-depth*(1-q*q)*ss*tp)}}geo.computeVertexNormals();return geo};
  // head surface z at hat-space (x,y) (+off): the body is a lathe, so the front surface off the axis is sqrt(r^2-x^2), not r
  const headZ=(x,y,off=0)=>{const r=bodyR(Math.min(.999,(.66+y)/.75));return Math.sqrt(Math.max(0,r*r-x*x))+off};
  // hanging star jewellery (recipe A): loop + stem on the band facing outward (unless loop=false), one continuous gold chain (tube with a slight sag + 4 beads) from (x,y0) down L, ending in a 4-point gold star of size `star`; everything sits on the head surface via headZ
  const hangStar=(T,g,x,y0,L,star=.045,loop=true)=>{const ry=y=>Math.atan2(x,headZ(x,y));if(loop){const by=bandY(x),lp=wmesh(new T.TorusGeometry(.013,.0035,8,20),'#f1b630',GOLD);lp.position.set(x,by+.004,headZ(x,by,.005));lp.rotation.y=ry(by);g.add(lp)}
    const y1=y0-L,pts=[];for(let k=0;k<=4;k++){const t=k/4,y=y0+(y1-y0)*t;pts.push(new T.Vector3(x,y,headZ(x,y,.008+.01*t+.006*Math.sin(t*Math.PI))))}const cu=new T.CatmullRomCurve3(pts);g.add(wmesh(new T.TubeGeometry(cu,24,.0045,6),'#f1b630',GOLD));
    for(let k=0;k<4;k++){const b=wmesh(new T.SphereGeometry(.007,8,6),'#f1b630',GOLD);b.position.copy(cu.getPointAt((k+.5)/4));g.add(b)}
    const ds=wmesh(starGeo(T,star,star*.29,.01,4),wm('#f1b630',Object.assign({emissive:'#7a5a10',emissiveIntensity:.15},GOLD)));ds.scale.y=1.35;const ys=y1-star*1.35*.85;ds.position.set(x,ys,headZ(x,ys,.02));ds.rotation.y=ry(ys);g.add(ds)};
  // batch-2 paint helpers (shop hats sheet 1): shade(hex,k) lighter (k>0) / darker (k<0) css colour; bakeLight(c,w,h,o) overlays the fake light on a finished canvas map:
  // o.gv vertical stops bottom->top (roots/base dark, top lit), o.gu horizontal stops over u (lathe/sphere u: 0 front, .25 +x, .5 back, .75 -x; lit at u~.85 = screen top-left, darkest at u~.4)
  const WA=a=>`rgba(255,255,255,${a})`,KA=a=>`rgba(0,0,0,${a})`;
  const shade=(c,k)=>{const C=new THREE.Color(c);return (k>0?C.lerp(new THREE.Color('#ffffff'),k):C.lerp(new THREE.Color('#000000'),-k)).getStyle()};
  const bakeLight=(c,w,h,o={})=>{const gv=c.createLinearGradient(0,h,0,0);for(const[p,q]of(o.gv||[[0,KA(.28)],[.25,KA(0)],[1,WA(.18)]]))gv.addColorStop(p,q);c.fillStyle=gv;c.fillRect(0,0,w,h);
    const gu=c.createLinearGradient(0,0,w,0);for(const[p,q]of(o.gu||[[0,WA(.12)],[.15,WA(0)],[.4,KA(.22)],[.6,KA(.08)],[.85,WA(.26)],[1,WA(.12)]]))gu.addColorStop(p,q);c.fillStyle=gu;c.fillRect(0,0,w,h)};
  // soft grain/noise pass (leather, felt, knit): n soft dots of alpha a in dark/light
  const grain=(c,w,h,n,a,seed=5)=>{let s=seed;const R=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<n;i++){const x=R()*w,y=R()*h,r=1+R()*2.5;c.fillStyle=R()<.5?KA(a):WA(a);c.beginPath();c.arc(x,y,r,0,7);c.fill()}};
  // fur pompom / fur ball: shell fur on a sphere (or o.geo) with a painted self-lit map (roots dark at the seam, key light top-left), <= 20 layers
  const furBall=(r,col,key,o={})=>{const T=THREE,m=wm('#ffffff',{map:furPaint2(key,col,null,{ao:0,stroke:o.stroke||[.12,.16],gv:o.gv||[[0,KA(.38)],[.3,KA(0)],[1,WA(.3)]],keyStops:o.keyStops||[[0,WA(.14)],[.15,WA(0)],[.4,KA(.18)],[.6,KA(.04)],[.85,WA(.28)],[1,WA(.14)]]}),emissive:'#ffffff',emissiveIntensity:o.emi===undefined?.35:o.emi,roughness:.95,clearcoat:0,sheen:.3,sheenRoughness:.5,sheenColor:new T.Color('#ffffff')});m.emissiveMap=m.map;
    return furShells(o.geo||new T.SphereGeometry(r,28,18),m,Object.assign({len:o.len||r*.45,rep:o.rep||[2.5,1.5],layers:o.layers||18,ramp:[.88,.2],at:[.05,.55],hair:'hairD',sheenI:.3},o.sh||{}))};
  // batch-4 helpers: hexGem(g,x,y,z,col,s) = faceted hexagonal gem (flat face to the camera) in a gold bezel; onHead(an,y,off) = point on the head surface at angle an around the y axis (for flaps/tails lying along the head)
  const hexGem=(g,x,y,z,col,s=1)=>{const T=THREE,gm=wmesh(new T.CylinderGeometry(.046*s,.046*s,.03*s,6),col,{roughness:.06,clearcoat:1,clearcoatRoughness:.05,flatShading:true,emissive:col,emissiveIntensity:.35,envMapIntensity:.6});gm.scale.set(1,1,1.3);face(gm,x,y,z);gm.rotateX(Math.PI/2);g.add(gm);
    const set=wmesh(new T.TorusGeometry(.05*s,.011*s,8,6),'#ffd66a',GOLD);set.scale.set(1,1.3,1);face(set,x*.99,y,z*.99);set.rotateZ(Math.PI/6);g.add(set)};
  const onHead=(an,y,off=0)=>{const R=bodyR(Math.min(.999,(.66+y)/.75))+off;return [R*Math.sin(an),y,R*Math.cos(an)]};
  const H={
  party(P,g){const T=P.T,cs=[[221,28,33],[250,200,42],[27,115,236],[72,192,64]];// drawing's red / yellow / blue / green (sampled)
    // continuous spiral: band index f = v*N + u*4 (4 = one colour cycle per turn, so the seam at u 0/1 is continuous); each band one solid colour, edges slightly darker; subtle key light, rim AO at the bottom, contact shadow under the pompom
    const tx=canvasTex('partyhat7',512,512,(c,w,h)=>{const im=c.createImageData(w,h),d=im.data,N=4.5;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const u=x/w,v=1-y/h,f=v*N+u*4,i=Math.floor(f)%4,t=f-Math.floor(f),e=Math.min(t,1-t),m=.86+.14*Math.min(1,e/.12),k=(y*w+x)*4,C=cs[(i+4)%4];d[k]=C[0]*m;d[k+1]=C[1]*m;d[k+2]=C[2]*m;d[k+3]=255}c.putImageData(im,0,0);
      bakeLight(c,w,h,{gv:[[0,KA(.3)],[.07,KA(0)],[.88,KA(0)],[1,KA(.45)]],gu:[[0,WA(.06)],[.15,WA(0)],[.4,KA(.12)],[.6,KA(.04)],[.85,WA(.12)],[1,WA(.06)]]})});
    const Hc=.62,R=.22,pts=[];for(let k=0;k<=30;k++){const t=k/30;pts.push(V2(Math.max(.004,R*(1-t)+.01*Math.sin(t*Math.PI)),t*Hc))}pts.unshift(V2(R-.015,-.005),V2(R,0));
    g.add(wmesh(new T.LatheGeometry(pts,64),wm('#ffffff',{map:tx,roughness:.3,clearcoat:.55,clearcoatRoughness:.1,envMapIntensity:.5})));
    // big red fur pompom (real shell fur) sitting on the tip
    const pm=furBall(.1,'#dd1c21','ppParty4',{len:.05,layers:20,rep:[2,1.2],emi:.3,stroke:[.1,.1],gv:[[0,KA(.35)],[.3,KA(0)],[1,WA(.1)]]});pm.position.y=Hc+.02;g.add(pm);g.rotation.z=-.1;g.position.y=-.015},
  cowboy(P,g){const T=P.T,C='#6e4634',L={roughness:.55,clearcoat:.1,clearcoatRoughness:.5,sheen:0,envMapIntensity:.25};// drawing's chocolate leather (#734b39 sampled), no sheen so the studio env cannot tint it mauve
    // leather maps: soft grain, warm (same-hue) key light <= .12, AO where the crown meets the brim (brim v=0 inner edge, crown v=0 bottom)
    const WK=a=>`rgba(255,215,170,${a})`,lea=(key,o)=>canvasTex(key,512,256,(c,w,h)=>{c.fillStyle=C;c.fillRect(0,0,w,h);grain(c,w,h,2200,.03,3);bakeLight(c,w,h,o)});
    const brimM=wm('#ffffff',Object.assign({map:lea('cbBrim3',{gv:[[0,KA(.45)],[.28,KA(0)],[1,WK(.08)]],gu:[[0,WK(.06)],[.15,WK(0)],[.4,KA(.14)],[.6,KA(.04)],[.85,WK(.12)],[1,WK(.06)]]})},L)),crownM=wm('#ffffff',Object.assign({side:T.DoubleSide,map:lea('cbCrown3',{gv:[[0,KA(.4)],[.22,KA(0)],[1,WK(.12)]],gu:[[0,WK(.06)],[.15,WK(0)],[.4,KA(.14)],[.6,KA(.04)],[.85,WK(.12)],[1,WK(.06)]]})},L));
    const brim=shell(72,10,(u,v)=>{const a=u*Math.PI*2,r=.2+v*.29,sx=Math.sin(a),cz=Math.cos(a),side=Math.pow(Math.abs(sx),2.2),e=Math.pow(v,2.1);
      return [r*sx,e*(.22*side-.035*(1-side)),r*cz*.86]},.024);g.add(wmesh(brim,brimM));
    // rounded cattleman crown: domed top, soft centre crease fading into the sides, two front side dents
    const cr=surf(64,32,(u,v)=>{const a=u*Math.PI*2,sx=Math.sin(a),cz=Math.cos(a);let r=Math.max(.006,(.215-.025*v*v)*(v>.7?Math.pow(Math.max(0,Math.cos((v-.7)/.3*Math.PI/2)),.5):1)),y=-.07+v*.36;// cos clamped: at v=1 it is -1e-16 and pow() of it is NaN (black cap)
      const crease=.032*Math.exp(-Math.pow(sx*r/.12,2))*Math.pow(v,4)*Math.min(1,Math.max(0,(r-.02)/.08)),dent=.045*Math.pow(v,3)*Math.max(0,cz)*(Math.exp(-Math.pow((sx-.6)/.3,2))+Math.exp(-Math.pow((sx+.6)/.3,2)));
      r*=1-dent;return [r*sx,y-crease,r*cz*.92*(1-.08*v)]},1);g.add(wmesh(cr,crownM));
    // dark stitched band with AO at its top and bottom edges
    const bandTx=canvasTex('cbBand2',256,64,(c,w,h)=>{c.fillStyle='#4a2a18';c.fillRect(0,0,w,h);grain(c,w,h,900,.04,9);bakeLight(c,w,h,{gv:[[0,KA(.45)],[.25,KA(0)],[.5,WK(.08)],[.8,KA(0)],[1,KA(.4)]],gu:[[0,WK(.06)],[.15,WK(0)],[.4,KA(.14)],[.6,KA(.04)],[.85,WK(.1)],[1,WK(.06)]]});c.strokeStyle='rgba(230,190,140,.5)';c.lineWidth=2;c.setLineDash([6,5]);for(const y of[h*.14,h*.86]){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}});
    const bd=[];for(let k=0;k<=8;k++){const t=k/8;bd.push(V2(.219-.004*t+.007*Math.sin(t*Math.PI),.0+t*.08))}const band=wmesh(new T.LatheGeometry(bd,64),wm('#ffffff',{map:bandTx,roughness:.45,clearcoat:.2,envMapIntensity:.3}));band.scale.z=.92;g.add(band);
    // sheriff star: big gold 5-point star with ball tips and a round badge centre, in front of the band
    const G=Object.assign({},GOLD,{emissive:'#6a4a08',emissiveIntensity:.15}),st=wmesh(starGeo(T,.068,.03,.012),'#dca844',G);face(st,0,.04,.225);g.add(st);
    for(let k=0;k<5;k++){const a=Math.PI/2+k*Math.PI*2/5,b=wmesh(new T.SphereGeometry(.011,10,8),'#f0c060',GOLD);b.position.set(Math.cos(a)*.068,.04+Math.sin(a)*.068,.236);g.add(b)}
    const rg=wmesh(new T.TorusGeometry(.022,.005,8,24),'#f0c060',GOLD);rg.position.set(0,.04,.238);g.add(rg);const dot=wmesh(new T.SphereGeometry(.012,12,8),'#f0c060',GOLD);dot.position.set(0,.04,.24);g.add(dot);g.position.y=.07},
  viking(P,g){const T=P.T,S={metalness:.7,roughness:.32,clearcoat:.3,envMapIntensity:.8};
    // brushed steel dome map (sphere v: 1 top .. .5 rim): fine horizontal brush strokes, lit top-left, AO at the rim seam with the gold band
    const steel=canvasTex('vkSteel1',512,256,(c,w,h)=>{c.fillStyle='#b9bec8';c.fillRect(0,0,w,h);let s=3;const R=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<2600;i++){const y=R()*h,x=R()*w,l=20+R()*60;c.strokeStyle=R()<.5?KA(.06):WA(.1);c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x+l,y);c.stroke()}
      bakeLight(c,w,h,{gv:[[0,KA(0)],[.5,KA(.4)],[.6,KA(0)],[1,WA(.2)]],gu:[[0,WA(.1)],[.15,WA(0)],[.4,KA(.26)],[.6,KA(.08)],[.85,WA(.3)],[1,WA(.1)]]})});
    const dome=wmesh(new T.SphereGeometry(.31,48,24,0,Math.PI*2,0,Math.PI/2),wm('#ffffff',Object.assign({map:steel},S)));dome.scale.y=1.02;dome.position.y=.02;g.add(dome);
    // gold rim band (taller) with big rivets, gold strap over the top with rivets
    const bd=[];for(let k=0;k<=10;k++){const t=k/10,a=t*Math.PI;bd.push(V2(.315+.022*Math.sin(a),-.04+t*.105))}g.add(wmesh(new T.LatheGeometry(bd,64),'#e0a93a',GOLD));
    for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=wmesh(new T.SphereGeometry(.02,12,8),'#f2c15a',GOLD);r.position.set(Math.sin(a)*.338,.012,Math.cos(a)*.338);g.add(r)}
    const strap=wmesh(new T.TorusGeometry(.318,.03,10,48,Math.PI),'#e0a93a',GOLD);strap.rotation.y=Math.PI/2;strap.scale.set(1,1.02,1.25);strap.position.y=.02;g.add(strap);
    for(let i=1;i<6;i++){const a=i/6*Math.PI,r=wmesh(new T.SphereGeometry(.018,10,8),'#f2c15a',GOLD);r.position.set(0,.02+Math.sin(a)*.335,Math.cos(a)*.335);g.add(r)}
    // horns: fat cream horns curving up and out of gold cuffs; tube map u along the horn: dark AO at the base in the cuff, faint growth ridges, lit tip
    const hornTx=canvasTex('vkHorn1',256,64,(c,w,h)=>{c.fillStyle='#f3e9d2';c.fillRect(0,0,w,h);for(let x=0;x<w;x+=6){c.fillStyle=KA(.05+.03*Math.sin(x));c.fillRect(x,0,2,h)}const gr=c.createLinearGradient(0,0,w,0);gr.addColorStop(0,KA(.5));gr.addColorStop(.18,KA(0));gr.addColorStop(1,WA(.2));c.fillStyle=gr;c.fillRect(0,0,w,h);const gv=c.createLinearGradient(0,h,0,0);gv.addColorStop(0,KA(.18));gv.addColorStop(.45,KA(0));gv.addColorStop(1,WA(.12));c.fillStyle=gv;c.fillRect(0,0,w,h)});
    for(const sx of[-1,1]){const h=taper(T,[new T.Vector3(sx*.26,.1,0),new T.Vector3(sx*.42,.16,0),new T.Vector3(sx*.5,.3,0),new T.Vector3(sx*.47,.44,-.02),new T.Vector3(sx*.4,.53,-.03)],.095,.008);
      g.add(wmesh(h.g,wm('#ffffff',{map:hornTx,roughness:.3,clearcoat:.7,clearcoatRoughness:.15})));
      const rg=wmesh(new T.TorusGeometry(.085,.03,12,32),'#e0a93a',GOLD);rg.position.set(sx*.31,.125,0);rg.lookAt(sx*.62,.26,0);g.add(rg)}},
  propeller(P,g){const T=P.T,cols=['#f9cb2d','#43b04e','#f23539','#1f68dd','#f23539','#1f68dd'],O={roughness:.35,clearcoat:.5,clearcoatRoughness:.15,envMapIntensity:.5};// drawing's primaries (sampled): front-left blue | front-right yellow, red + green beside them
    // 6 panels painted on one dome (sphere u: .25 = front), light piping + a soft groove at each seam, subtle key light, AO at the sweatband
    const tx=canvasTex('propCap2',1024,512,(c,w,h)=>{for(let i=0;i<6;i++){const u0=.25+i/6;for(const off of[0,-1]){const x0=(u0+off)*w,x1=x0+w/6;if(x1<0||x0>w)continue;const gr=c.createLinearGradient(x0,0,x1,0),C=cols[i];gr.addColorStop(0,shade(C,-.2));gr.addColorStop(.05,shade(C,.25));gr.addColorStop(.1,C);gr.addColorStop(.5,shade(C,.06));gr.addColorStop(.9,C);gr.addColorStop(.95,shade(C,-.08));gr.addColorStop(1,shade(C,-.2));c.fillStyle=gr;c.fillRect(x0,0,w/6+1,h)}}
      bakeLight(c,w,h,{gv:[[0,KA(0)],[.5,KA(.25)],[.56,KA(0)],[1,WA(.08)]],gu:[[0,WA(.06)],[.15,WA(0)],[.4,KA(.1)],[.6,KA(.03)],[.85,WA(.12)],[1,WA(.06)]]})});
    const dome=wmesh(new T.SphereGeometry(.3,64,32,0,Math.PI*2,0,Math.PI/2),wm('#ffffff',Object.assign({map:tx},O)));dome.scale.y=.95;g.add(dome);
    const rim=wmesh(new T.TorusGeometry(.298,.008,10,64),'#1f68dd',O);rim.rotation.x=Math.PI/2;g.add(rim);
    // bill: an opaque blue wedge projecting FORWARD from the cap front (root on the cap circle under the front, length .22, width .4, slight droop, rounded tip, edges curling up a little)
    // the bill is level (slight upturn): the render camera looks down ~13 deg, so a drooping bill presents face-on as a broad plate under the cap (the 'collar' the AD saw); level, it reads as a thin solid bill
    const btx=canvasTex('propBill2',128,128,(c,w,h)=>{c.fillStyle='#1461d6';c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KA(.2)],[.3,KA(0)],[.8,WA(0)],[1,WA(.1)]],gu:[[0,KA(.08)],[.3,WA(.08)],[.6,WA(0)],[1,KA(.1)]]})});
    const bill=dmesh(shell(24,8,(u,v)=>{const q=u*2-1,x=q*.17*(1-.1*v),z=Math.sqrt(Math.max(0,.0841-x*x))+.2*v*(1-.3*q*q),y=-.014+.02*v*v+.012*q*q*v;return [x,y,z]},.026),wm('#ffffff',{map:btx,roughness:.35,clearcoat:.5,envMapIntensity:.5}));g.add(bill);
    // gold button, axle, hub and two red blades (spinning)
    const bt=wmesh(new T.SphereGeometry(.032,16,12),'#f2c15a',GOLD);bt.position.y=.282;bt.scale.y=.6;g.add(bt);
    const ax=wmesh(new T.CylinderGeometry(.014,.018,.09,16),'#f2c15a',GOLD);ax.position.y=.33;g.add(ax);
    const pr=new T.Group();pr.position.y=.385;g.add(pr);for(const sx of[-1,1]){const b=wmesh(new T.SphereGeometry(.05,24,12),'#ed3134',{roughness:.3,clearcoat:.6,envMapIntensity:.5});b.scale.set(3.6,.2,.8);b.position.x=sx*.16;b.rotation.x=sx*.4;pr.add(b)}
    const kn=wmesh(new T.SphereGeometry(.034,16,12),'#f2c15a',GOLD);kn.position.y=.39;g.add(kn);P.spin.push(pr);g.position.y=.05},
  chef(P,g){const T=P.T,CL={roughness:.62,clearcoat:.1,sheen:.2,sheenColor:new T.Color('#ffffff'),envMapIntensity:.4},CW='#f2efea',lit=m=>{m.emissive=new T.Color('#ffffff');m.emissiveMap=m.map;m.emissiveIntensity=.3;return m};
    // tall pleated toque: cylindrical band (AO under the crown overhang) and a puffy crown with 8 pleat lobes; pleats also painted (dark grooves, lit ridges), roots dark over the band, lit top-left
    const bandTx=canvasTex('chefBand3',256,128,(c,w,h)=>{c.fillStyle='#f7f4ef';c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KA(.15)],[.2,KA(0)],[.65,KA(0)],[1,KA(.5)]],gu:[[0,WA(.1)],[.15,WA(0)],[.4,KA(.2)],[.6,KA(.06)],[.85,WA(.22)],[1,WA(.1)]]})});
    const band=[];for(let k=0;k<=12;k++){const t=k/12;band.push(V2(.228+.01*t,-.03+t*.22))}g.add(wmesh(new T.LatheGeometry(band,64),lit(wm(CW,Object.assign({map:bandTx},CL)))));
    const topTx=canvasTex('chefTop5',1024,512,(c,w,h)=>{c.fillStyle='#ffffff';c.fillRect(0,0,w,h);for(let x=0;x<w;x++){const ph=x/w*Math.PI*2*8,k=Math.pow((Math.cos(ph)+1)/2,.6);c.fillStyle=`rgba(110,100,120,${(.35*(1-k)).toFixed(3)})`;c.fillRect(x,0,1,h)}
      const fade=c.createLinearGradient(0,0,0,h);fade.addColorStop(0,'rgba(251,249,245,.95)');fade.addColorStop(.25,'rgba(251,249,245,0)');c.fillStyle=fade;c.fillRect(0,0,w,h);
      bakeLight(c,w,h,{gv:[[0,KA(.4)],[.15,KA(0)],[1,WA(.12)]],gu:[[0,WA(.1)],[.15,WA(0)],[.4,KA(.22)],[.6,KA(.06)],[.85,WA(.22)],[1,WA(.1)]]})});
    const top=surf(128,48,(u,v)=>{const a=u*Math.PI*2,y=.17+v*.38,prof=v<.5?.235+.12*Math.sin(v/.5*Math.PI/2):.355*Math.pow(Math.cos((v-.5)/.5*Math.PI/2),.8);
      const lobe=Math.pow((Math.cos(a*8)+1)/2,.8),pl=1+.2*lobe*Math.pow(Math.sin(Math.min(1,v*1.05)*Math.PI),.7)-.03;
      return [Math.sin(a)*prof*pl,y+(v>.5?.03*lobe:0)*Math.sin((v-.5)/.5*Math.PI),Math.cos(a)*prof*pl]},1);g.add(wmesh(top,lit(wm(CW,Object.assign({map:topTx},CL)))));
    const rim=wmesh(new T.TorusGeometry(.238,.012,8,64),'#f1ede6',CL);rim.rotation.x=Math.PI/2;rim.position.y=.19;g.add(rim);g.position.y=-.05},
  flowers(P,g){const T=P.T;g.add(hband(T,'#4a9a30',{roughness:.5,clearcoat:.2,envMapIntensity:.4},.026,.024,1));
    // petal map over sphere u (petal local +x = outward tip at u .5): dark at the flower centre (AO), lit tip; flower centre: yellow with a darker rim
    const petM=(C,i)=>wm('#ffffff',{map:canvasTex('petal3_'+i,128,32,(c,w,h)=>{const gr=c.createLinearGradient(0,0,w,0);gr.addColorStop(0,shade(C,-.4));gr.addColorStop(.2,shade(C,-.1));gr.addColorStop(.5,shade(C,.22));gr.addColorStop(.8,shade(C,-.1));gr.addColorStop(1,shade(C,-.4));c.fillStyle=gr;c.fillRect(0,0,w,h);const gv=c.createLinearGradient(0,h,0,0);gv.addColorStop(0,KA(.25));gv.addColorStop(.5,KA(0));gv.addColorStop(1,WA(.18));c.fillStyle=gv;c.fillRect(0,0,w,h)}),roughness:.4,clearcoat:.4,envMapIntensity:.5});
    const cenM=wm('#ffffff',{map:canvasTex('fcenter2',64,64,(c,w,h)=>{const gr=c.createRadialGradient(w*.4,h*.35,2,w/2,h/2,w*.5);gr.addColorStop(0,'#ffe066');gr.addColorStop(.6,'#ffc21a');gr.addColorStop(1,'#b07a08');c.fillStyle=gr;c.fillRect(0,0,w,h)}),roughness:.5,envMapIntensity:.4});
    const cs=['#ffffff','#e93346','#9f68e2','#f764ba','#e1a91f','#9f68e2','#e93346'],PM=cs.map(petM),lg=leafGeo(T),LM={roughness:.5,clearcoat:.2,envMapIntensity:.4};// drawing's white daisy / red / purple / pink / yellow (sampled)
    // flowers on the band arc (s = -1 left .. 1 right), big ones in front; each flower faces outward from the head, petals as 5 flattened spheres + domed centre; leaves tucked under them
    const at=(s,dy=0,dz=0)=>{const [x,y]=bandPt(s);return [x,y+dy,headZ(x,y,.012+dz)]};
    // 7 big separate flowers (scale 2.2) on the band, 7 light-green leaves tucked between them
    [0,.33,-.33,.66,-.66,1,-1].forEach((s,i)=>{const [x,y,z]=at(s,.03,.05),f=new T.Group();f.position.set(x,y,z);f.lookAt(x*3,y+.15,z*3);f.scale.setScalar(2.2);g.add(f);
      for(let k=0;k<5;k++){const b=k/5*Math.PI*2+Math.PI/2,pt=new T.Mesh(new T.SphereGeometry(.04,18,12),PM[i%cs.length]);pt.scale.set(1.1,.72,.2);pt.position.set(Math.cos(b)*.042,Math.sin(b)*.042,0);pt.rotation.z=b;f.add(pt)}
      const ce=new T.Mesh(new T.SphereGeometry(.024,14,10),cenM);ce.position.z=.012;ce.scale.z=.55;f.add(ce)});
    [.16,-.16,.5,-.5,.83,-.83,1.15].forEach((s,i)=>{const rz=(i%2?-.5:.6)+(i%3)*.15,[x,y,z]=at(s,-.01,.02),l=wmesh(lg,'#5aa83a',LM);l.position.set(x,y,z);l.lookAt(x*3,y,z*3);l.rotateZ(rz+(rz>0?.6:-.6));l.scale.setScalar(.85);g.add(l)})},
  wizard(P,g){const T=P.T,B='#3a2fc4',o={roughness:.35,clearcoat:.6,sheen:.4,sheenColor:new T.Color('#8a7cff'),envMapIntensity:.6};
    // painted maps: brim (AO ring at the crown, lit top-left), cone (dark root over the band, key light left, soft AO fold under the bend), satin band (AO edges, highlight)
    const brimTx=canvasTex('wzBrim1',256,128,(c,w,h)=>{c.fillStyle='#2f3ad0';c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KA(.5)],[.3,KA(0)],[1,WA(.1)]],gu:[[0,WA(.1)],[.15,WA(0)],[.4,KA(.2)],[.6,KA(.06)],[.85,WA(.28)],[1,WA(.1)]]})});
    const brim=shell(72,8,(u,v)=>{const a=u*Math.PI*2,r=.2+v*.27;return [Math.sin(a)*r,-.035*v*v-.012*Math.cos(a*2)*v+.02*Math.pow(v,3),Math.cos(a)*r]},.024);g.add(wmesh(brim,wm('#ffffff',Object.assign({map:brimTx},o))));
    const coneTx=canvasTex('wzCone1',512,512,(c,w,h)=>{c.fillStyle=B;c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KA(.45)],[.12,KA(0)],[.6,KA(0)],[.72,KA(.18)],[.85,KA(0)],[1,WA(.1)]],gu:[[0,WA(.12)],[.15,WA(0)],[.4,KA(.28)],[.6,KA(.08)],[.85,WA(.3)],[1,WA(.12)]]})});
    const H0=.58,cone=surf(64,40,(u,v)=>{const a=u*Math.PI*2,r=Math.max(.004,.235*(1-v)*(1+.06*Math.sin(v*Math.PI)));const bx=.26*Math.pow(v,2.6),by=-.08*Math.pow(v,5);return [Math.sin(a)*r+bx,v<.02?-.07+v/.02*.07:v*H0+by,Math.cos(a)*r]},1);
    g.add(wmesh(cone,wm('#ffffff',Object.assign({map:coneTx},o))));
    const bandTx=canvasTex('wzBand1',256,64,(c,w,h)=>{c.fillStyle='#8a3ae8';c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KA(.4)],[.25,KA(0)],[.55,WA(.2)],[.8,KA(0)],[1,KA(.35)]],gu:[[0,WA(.1)],[.15,WA(0)],[.4,KA(.22)],[.6,KA(.06)],[.85,WA(.3)],[1,WA(.1)]]})});
    const bd=[];for(let k=0;k<=8;k++){const t=k/8;bd.push(V2(.238-.022*t+.007*Math.sin(t*Math.PI),.0+t*.09))}g.add(wmesh(new T.LatheGeometry(bd,64),wm('#ffffff',{map:bandTx,roughness:.25,clearcoat:.7,sheen:.8,sheenColor:new T.Color('#d3a8ff'),envMapIntensity:.5})));
    // big flat yellow stars + a crescent, self-lit so they read at 1/4 size
    const G={roughness:.35,clearcoat:.5,emissive:'#ffb400',emissiveIntensity:.25,envMapIntensity:.4};
    [[-.5,.19,1.15],[.55,.25,1.1],[0,.36,.95],[-.25,.47,.8]].forEach(([a,y,s])=>{const v=y/H0,r=.235*(1-v)+.014,st=wmesh(starGeo(T,.05*s,.022*s,.01),'#ffcb3c',G);face(st,Math.sin(a)*r+.26*Math.pow(v,2.6),y,Math.cos(a)*r,.0);g.add(st)});
    {const a=.32,y=.15,v=y/H0,r=.235*(1-v)+.014,m=wmesh(moonGeo(T,.058,.01),'#ffcb3c',G);face(m,Math.sin(a)*r,y,Math.cos(a)*r);g.add(m)}g.position.y=.06},
  pirate(P,g,O={}){const T=P.T,o={roughness:.42,clearcoat:.5,sheen:.3,sheenColor:new T.Color('#5a5070'),envMapIntensity:.5},WC=O.wall||'#231d2c',LC=O.line||'#c0202f',K=O.k||'';// O: wall/line colours + key suffix (h_snowS admiral reuses this builder in navy/gold)
    // painted black leather (lit top-left, AO over the dome at the wall root, lighter rolled top edge) and the red lining (dark inside, lighter at the rim)
    const wallTx=canvasTex('prWall2'+K,512,128,(c,w,h)=>{c.fillStyle=WC;c.fillRect(0,0,w,h);grain(c,w,h,900,.018,7);bakeLight(c,w,h,{gv:[[0,KA(.55)],[.3,KA(0)],[.85,WA(.06)],[1,WA(.16)]],gu:[[0,WA(.12)],[.15,WA(0)],[.4,KA(.3)],[.6,KA(.1)],[.85,WA(.3)],[1,WA(.12)]]})});
    const lineTx=canvasTex('prLine2'+K,256,64,(c,w,h)=>{c.fillStyle=LC;c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KA(.6)],[.6,KA(.2)],[1,KA(0)]],gu:[[0,KA(0)],[.5,KA(.15)],[1,KA(0)]]})});
    const dome=wmesh(new T.SphereGeometry(.26,40,20,0,Math.PI*2,0,Math.PI/2),WC,o);dome.scale.set(1,1.05,.92);dome.position.y=.02;g.add(dome);// black crown showing between the two peaks
    // bicorne walls: two upturned walls (front, back) meeting in points at the sides; front wall tall enough to hide the dome, slight dip in the middle
    const R0=a=>.25+.14*Math.pow(Math.abs(Math.sin(a)),6),Hh=a=>{const s=Math.abs(Math.sin(a)),c=Math.cos(a);return .25+.1*Math.pow(s,2.5)-.03*Math.pow(Math.max(0,c),8)+.03*Math.pow(Math.max(0,-c),2)},
      pt=(a,v)=>{const r=R0(a)*(1+.16*v),y=Hh(a)*v;return [Math.sin(a)*r,y,Math.cos(a)*r*.92]};
    g.add(dmesh(shell(120,10,(u,v)=>pt(u*Math.PI*2,v),.02),wm('#ffffff',Object.assign({map:wallTx},o))));
    g.add(wmesh(surf(120,10,(u,v)=>{const q=pt(u*Math.PI*2,v);return [q[0]*.97,q[1],q[2]*.97]},1),wm('#ffffff',{map:lineTx,roughness:.6,side:T.BackSide,envMapIntensity:.3})));
    const ed=[];for(let i=0;i<120;i++){const q=pt(i/120*Math.PI*2,1);ed.push(new T.Vector3(q[0],q[1]+.008,q[2]))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(ed,true),240,.02,8,true),'#e8b23c',Object.assign({},GOLD,{emissive:'#6a4a08',emissiveIntensity:.12})));
    // big skull & crossbones in the middle of the front wall (cream, slightly self-lit; dark sockets and nose)
    const sk=new T.Group(),q=pt(0,.72);sk.position.set(q[0],q[1]+.01,q[2]+.025);sk.scale.setScalar(1.45);g.add(sk);const W={roughness:.4,clearcoat:.5,emissive:'#fff4e0',emissiveIntensity:.12,envMapIntensity:.4};
    const hd=wmesh(new T.SphereGeometry(.042,24,16),'#f4f0e6',W);hd.scale.set(1,.95,.5);hd.position.y=.012;sk.add(hd);const jw=wmesh(new T.SphereGeometry(.027,16,10),'#f4f0e6',W);jw.scale.set(1,.72,.5);jw.position.y=-.028;sk.add(jw);
    for(const sx of[-1,1]){const e=wmesh(new T.SphereGeometry(.013,12,8),'#1c1824',{roughness:.8});e.position.set(sx*.017,.014,.018);e.scale.z=.5;sk.add(e);
      const ang=sx*.85,bn=wmesh(new T.CapsuleGeometry(.009,.13,4,8),'#f4f0e6',W);bn.rotation.z=ang;bn.position.set(0,-.025,-.012);sk.add(bn);
      for(const e2 of[-1,1]){const kn=wmesh(new T.SphereGeometry(.013,10,8),'#f4f0e6',W);kn.position.set(-Math.sin(ang)*.072*e2,-.025+Math.cos(ang)*.072*e2,-.012);sk.add(kn)}}
    const ns=wmesh(new T.ConeGeometry(.006,.012,6),'#1c1824',{roughness:.8});ns.position.set(0,-.004,.02);ns.rotation.x=.3;sk.add(ns);for(let i=-1;i<=1;i++){const t=wmesh(new T.BoxGeometry(.004,.008,.004),'#cfc8ba',{roughness:.7});t.position.set(i*.007,-.03,.012);sk.add(t)}g.position.y=.03},
  king(P,g){const T=P.T,R=.25,pk=a=>Math.pow((Math.cos(5*a)+1)/2,1.8),hgt=a=>.15+.33*pk(a),G=Object.assign({},GOLD,{metalness:.8,roughness:.18,emissive:'#b07410',emissiveIntensity:.22,envMapIntensity:1.1});
    // painted gold: rich yellow, AO at the base band over the head, lit top-left, lighter toward the points
    const gtx=canvasTex('kgGold3',512,128,(c,w,h)=>{c.fillStyle='#ffc927';c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KA(.35)],[.14,KA(0)],[.6,WA(.1)],[1,WA(.28)]],gu:[[0,WA(.14)],[.15,WA(0)],[.4,KA(.16)],[.6,KA(.1)],[.85,WA(.3)],[1,WA(.14)]]})});
    const wall=shell(150,14,(u,v)=>{const a=u*Math.PI*2,y=v*hgt(a),r=R+.03*y/.48;return [Math.sin(a)*r,y,Math.cos(a)*r]},.02);g.add(wmesh(wall,wm('#ffffff',Object.assign({map:gtx},G))));
    for(const y of[.0,.115]){const t=wmesh(new T.TorusGeometry(R+.022+y*.11,.017,10,72),'#ffd24a',G);t.rotation.x=Math.PI/2;t.position.y=y+.008;g.add(t)}
    for(let i=0;i<18;i++){const a=i/18*Math.PI*2,b=wmesh(new T.SphereGeometry(.014,10,8),'#ffe070',G);b.position.set(Math.sin(a)*(R+.04),.008,Math.cos(a)*(R+.04));g.add(b)}
    // big balls on the five points, small ones in the dips
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2,r=R+.035+.022;const b=wmesh(new T.SphereGeometry(.045,18,12),'#ffd24a',G);b.position.set(Math.sin(a)*r,.5,Math.cos(a)*r);g.add(b);
      const a2=a+Math.PI/5,b2=wmesh(new T.SphereGeometry(.026,14,10),'#ffd24a',G);b2.position.set(Math.sin(a2)*(R+.03),.2,Math.cos(a2)*(R+.03));g.add(b2)}
    // faceted gems in hexagonal gold bezels on the band: big red in front, blue at the sides, green at the back
    const gem=(a,c,s)=>{const m=wmesh(new T.IcosahedronGeometry(.055*s,0),c,{roughness:.06,clearcoat:1,clearcoatRoughness:.05,flatShading:true,emissive:c,emissiveIntensity:.35});const y=.068;m.scale.set(.9,1.2,.5);face(m,Math.sin(a)*(R+.045),y,Math.cos(a)*(R+.045));g.add(m);
      const set=wmesh(new T.TorusGeometry(.058*s,.011,8,6),'#ffe070',G);set.scale.set(.95,1.2,1);face(set,Math.sin(a)*(R+.04),y,Math.cos(a)*(R+.04));set.rotateZ(Math.PI/6);g.add(set)};
    gem(0,'#e01828',1.45);gem(-.9,'#1f5ae8',1.05);gem(.9,'#1f5ae8',1.05);gem(Math.PI,'#1fae5a',1.0)},
  beanie(P,g){const T=P.T,RC='#c81720',KM={roughness:.9,clearcoat:0,sheen:.3,sheenRoughness:.6,sheenColor:new T.Color('#ff6a6a'),envMapIntensity:.3},lit=m=>{m.emissive=new T.Color('#ffffff');m.emissiveMap=m.map;m.emissiveIntensity=.15;return m};
    // painted chunky knit: vertical ribs (dark grooves, lit ridges) with stitch rows, AO on the dome just above the cuff and under the cuff's edges, key light top-left
    const knit=(key,w,h,ribs,gv)=>canvasTex(key,w,h,(c,W,H)=>{c.fillStyle=RC;c.fillRect(0,0,W,H);for(let x=0;x<W;x++){const ph=x/W*Math.PI*2*ribs,k=(Math.cos(ph)+1)/2;c.fillStyle=KA(.3*Math.pow(1-k,2.2));c.fillRect(x,0,1,H);c.fillStyle=`rgba(255,120,110,${(.12*k*k).toFixed(3)})`;c.fillRect(x,0,1,H)}
      const rows=H/14;for(let y=0;y<H;y+=rows){c.fillStyle=KA(.1);c.fillRect(0,y,W,2);c.fillStyle=WA(.05);c.fillRect(0,y+rows*.5,W,2)}bakeLight(c,W,H,{gv,gu:[[0,WA(.05)],[.15,WA(0)],[.4,KA(.12)],[.6,KA(.04)],[.85,WA(.1)],[1,WA(.05)]]})});
    const dome=new T.Mesh(new T.SphereGeometry(.31,64,32,0,Math.PI*2,0,Math.PI/2),lit(wm('#ffffff',Object.assign({map:knit('knitDome3',1024,512,48,[[0,KA(0)],[.5,KA(.4)],[.6,KA(0)],[1,WA(.06)]])},KM))));dome.scale.y=1.12;dome.position.y=.03;g.add(dome);
    const cf=surf(96,14,(u,v)=>{const a=u*Math.PI*2,t=v*Math.PI;const rib=1+.028*Math.cos(a*32);const r=(.318+.034*Math.sin(t))*rib;return [Math.sin(a)*r,-.045+v*.14,Math.cos(a)*r]},1);
    g.add(wmesh(cf,lit(wm('#ffffff',Object.assign({map:knit('knitCuff3',1024,128,32,[[0,KA(.35)],[.25,KA(0)],[.75,KA(0)],[1,KA(.4)]])},KM)))));
    // big red fur pompom
    const pm=furBall(.115,'#a8101a','ppBeanie5',{len:.055,layers:20,rep:[2,1.2],emi:.15,stroke:[.1,.06],gv:[[0,KA(.38)],[.3,KA(0)],[1,WA(.06)]]});pm.position.y=.4;g.add(pm)},
  /* batch 2 (graphics sheet acc/hats2.png) */
  bow(P,g){const T=P.T,C='#f8689a',PK=a=>`rgba(255,215,232,${a})`;// drawing's satin pink (sampled #fb77a0); satin = painted maps (edges dark, light centre band, AO at the knot) + pink sheen, slight self-light so the colour does not sink
    const sat=(key,gu,gv,lines)=>canvasTex(key,256,128,(c,w,h)=>{c.fillStyle=C;c.fillRect(0,0,w,h);if(lines)for(let i=0;i<lines;i++){const x=w*(.1+.8*i/(lines-1));const gr=c.createLinearGradient(x-9,0,x+9,0);gr.addColorStop(0,KA(0));gr.addColorStop(.5,KA(.14));gr.addColorStop(1,KA(0));c.fillStyle=gr;c.fillRect(x-9,0,18,h)}bakeLight(c,w,h,{gu,gv})});
    const M=(key,gu,gv,lines)=>{const m=wm('#ffffff',{map:sat(key,gu,gv,lines),roughness:.42,clearcoat:.2,clearcoatRoughness:.3,sheen:.5,sheenRoughness:.4,sheenColor:new T.Color('#ff9ec8'),envMapIntensity:.35,emissive:'#ffffff',emissiveIntensity:.14});m.emissiveMap=m.map;return m};
    const EDGE=[[0,KA(.1)],[.18,KA(0)],[.42,PK(.1)],[.58,PK(.1)],[.82,KA(0)],[1,KA(.1)]];// soft edges: no outline on the .008 ribbon rim
    const loopM=M('bowLoop2',[[0,KA(.3)],[.12,KA(0)],[.22,PK(.14)],[.45,PK(.06)],[.85,KA(0)],[1,KA(.3)]],EDGE),tailM=M('bowTail2',[[0,KA(.45)],[.2,KA(0)],[.55,PK(.08)],[1,KA(.08)]],EDGE),knotM=M('bowKnot2',[[0,KA(.1)],[.3,PK(.12)],[.6,KA(0)],[1,KA(.25)]],[[0,KA(.45)],[.2,KA(0)],[.8,KA(0)],[1,KA(.45)]],3);
    const top=new T.Group();top.position.set(0,.13,.0);top.rotation.x=-.22;g.add(top);
    // loops: one ribbon strip per side, out from the knot along the front face, round the far end and back (u), width across = y (v); puffy in z at mid width, pinched at the knot; thin shell for the ribbon's edge
    for(const sx of[-1,1]){const lp=shell(56,14,(u,v)=>{const th=Math.PI*u,s=Math.sin(th),q=2*v-1,hh=.04+.16*Math.pow(Math.sin(s*Math.PI*.72),.9);return [sx*(.045+.27*s*(1-.22*q*q*Math.pow(s,4))),q*hh-.02*s,Math.cos(th)*(.04+.09*(1-q*q)*Math.sqrt(s))]},.008);top.add(wmesh(lp,loopM));
      // tails: hang from the knot down the front of the head (surface-following via headZ), swinging outward, V-notched end
      const tl=shell(20,8,(u,v)=>{const q=2*v-1,ue=u*(1-.14*(1-Math.abs(q))),x=sx*(.03+.14*ue+.03*Math.sin(ue*Math.PI))+q*.05*.9,y=.13-.26*ue+sx*q*.05*.42;return [x,y,headZ(x,y,.02+.012*Math.sin(ue*Math.PI))]},.006);g.add(wmesh(tl,tailM))}
    const kp=[];for(let k=0;k<=10;k++){const t=k/10;kp.push(V2(.065+.018*Math.sin(t*Math.PI),t*.13-.065))}const kn=wmesh(new T.LatheGeometry(kp,32),knotM);kn.rotation.z=Math.PI/2;kn.scale.z=.85;kn.position.z=.015;top.add(kn)},
  cap(P,g){const T=P.T,RD='#c91c25',WT='#fbf9f7',o={roughness:.45,clearcoat:.3,clearcoatRoughness:.2,envMapIntensity:.4};// drawing's red (#d72931 sampled; a hair deeper so the studio light does not lift it to salmon) and off-white front panels
    // 6 panels on one dome (sphere u: .25 = front): the two FRONT panels white (u .25 +- 1/6), the rest red; seam = soft dark groove + light piping, each panel slightly darker at its edges (puffy); AO at the rim (v .5) over the sweatband, soft key light top-left
    const tx=canvasTex('capDome1',1024,512,(c,w,h)=>{for(let i=0;i<6;i++){const u0=.25-1/6+i/6,C=i<2?WT:RD,e=i<2?.5:1;for(const off of[0,-1,1]){const x0=(u0+off)*w,x1=x0+w/6;if(x1<0||x0>w)continue;const gr=c.createLinearGradient(x0,0,x1,0);gr.addColorStop(0,shade(C,-.22*e));gr.addColorStop(.04,shade(C,.12));gr.addColorStop(.1,C);gr.addColorStop(.5,shade(C,.03));gr.addColorStop(.9,C);gr.addColorStop(.96,shade(C,-.06*e));gr.addColorStop(1,shade(C,-.22*e));c.fillStyle=gr;c.fillRect(x0,0,w/6+1,h)}}
      grain(c,w,h,1600,.02,4);bakeLight(c,w,h,{gv:[[0,KA(0)],[.5,KA(.25)],[.56,KA(0)],[1,WA(.06)]],gu:[[0,WA(.05)],[.15,WA(0)],[.4,KA(.08)],[.6,KA(.03)],[.85,WA(.1)],[1,WA(.05)]]})});
    const dm=wm('#ffffff',Object.assign({map:tx,emissive:'#ff3a3a',emissiveIntensity:.06},o));dm.emissiveMap=dm.map;const dome=wmesh(new T.SphereGeometry(.335,72,32,0,Math.PI*2,0,Math.PI/2),dm);dome.scale.y=1.05;dome.position.y=-.02;g.add(dome);
    const rim=wmesh(new T.TorusGeometry(.333,.007,10,72),shade(RD,-.15),o);rim.rotation.x=Math.PI/2;rim.position.y=-.02;g.add(rim);
    // visor (propeller approach, AD round 1): opaque shelf projecting FORWARD from under the cap's front rim, ~17 deg below level, sides curling down a little; root tucked under the rim (no light slit) and every vertex clamped outside the head surface (headZ at its own height) so it never passes through the face; .022 thickness
    const vtx=canvasTex('capVisor1',256,128,(c,w,h)=>{c.fillStyle=RD;c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KA(.3)],[.25,KA(0)],[.85,WA(.04)],[1,KA(.08)]],gu:[[0,KA(.1)],[.3,WA(.06)],[.6,WA(0)],[1,KA(.12)]]});c.strokeStyle=KA(.35);c.lineWidth=2;c.setLineDash([5,4]);for(const v of[.8,.9]){c.beginPath();c.moveTo(0,h*(1-v));c.lineTo(w,h*(1-v));c.stroke()}});
    const vis=shell(32,10,(u,v)=>{const q=u*2-1,x=q*.235*(1-.15*v),y=-.012-.035*v-.035*q*q*q*q*v,z0=Math.sqrt(Math.max(0,.1109-x*x))-.012,z=z0+.24*v*(1-.45*q*q*q*q);return [x,y,z]},-.022);/* AD batch-3 r2: root y -.012 starts .012 INSIDE the dome wall within the rim torus band (no slit), ~8 deg down so the camera (18 deg above the hat) sees the TOP face as a wedge; th<0 = thickness hangs under the painted top; ends curl down with q^4, no head clamp (the head below the rim is narrower than the bill's path) */;g.add(wmesh(vis,wm('#ffffff',Object.assign({map:vtx,side:T.DoubleSide},o))));
    const bt=wmesh(new T.SphereGeometry(.032,16,10),RD,o);bt.position.y=.33;bt.scale.y=.55;g.add(bt)},
  paper(P,g){const T=P.T,PW='#f1f0ec',PG='#aaa6a2',PD='#5e5b59';// drawing's newsprint white / print grey / dark headline (sampled)
    // newsprint map: bold columns of text rows (read at 1/4), a headline on the crown; the photo block and the dashed bold column only in the HULL region (canvas y 300-500 = hull v .02-.42; the crown uses y 25-230, text only); paper tone darkens toward the bottom (fold AO), subtle key light
    const tx=canvasTex('news6',1024,512,(c,w,h)=>{c.fillStyle=PW;c.fillRect(0,0,w,h);let sd=5;const R=()=>(sd=(sd*16807)%2147483647)/2147483647;
      for(let col=0;col<10;col++){const x=14+col*102;for(let r=0;r<20;r++){const y=40+r*11;if(y>250)break;if(col===7&&r<1)continue;c.fillStyle=R()<.1?PD:PG;c.fillRect(x,y,54+R()*34,4)}for(let r=0;r<9;r++){const y=300+r*22;if(col===6&&r>1&&r<7)continue;if(col===3&&r>1&&r<8)continue;c.fillStyle=R()<.12?PD:PG;c.fillRect(x,y,50+R()*36,9)}}
      c.fillStyle=PD;c.fillRect(14,12,420,18);c.fillRect(728,12,270,18);c.fillStyle=PW;c.fillRect(290,100,440,34);c.fillStyle=PD;c.fillRect(300,108,420,18);c.fillStyle=PG;c.fillRect(620,330,110,80);c.fillStyle='#8f8781';c.beginPath();c.arc(675,355,16,0,7);c.fill();c.fillRect(650,372,50,38);c.fillStyle=PW;c.fillRect(656,382,12,8);
      for(let r=0;r<6;r++){c.fillStyle=PD;c.fillRect(320,340+r*16,80,9)}grain(c,w,h,1200,.025,8);bakeLight(c,w,h,{gv:[[0,KA(.22)],[.3,KA(0)],[1,WA(.08)]],gu:[[0,WA(.06)],[.3,WA(0)],[.55,KA(.08)],[.8,WA(.06)],[1,WA(.06)]]})});
    const m=wm('#ffffff',{map:tx,roughness:.85,clearcoat:0,side:T.DoubleSide,envMapIntensity:.4,emissive:'#ffffff',emissiveIntensity:.1});m.emissiveMap=m.map;
    // hull band: pointed at the ends (superellipse top view), the top edge rising at the ends, the bottom slightly narrower; one thin sheet
    const X=.37,Z=.2,hull=surf(96,8,(u,v)=>{const a=u*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a),k=.88+.12*v,x=X*Math.sign(ca)*Math.pow(Math.abs(ca),.7)*k,z=Z*Math.sign(sa)*Math.pow(Math.abs(sa),1.25)*k;return [x,v*(.11+.07*Math.pow(Math.abs(ca),3)),z]},1);
    {const uv=hull.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*1.6,.02+uv.getY(i)*.4)}g.add(new T.Mesh(hull,m));
    // crown: front and back triangles with a vertical centre crease (two half-triangles each, the crease edge pushed out), meeting at the top ridge, plus the two small side triangles
    const pos=[],uv=[],tri=(A,B,C)=>{const side=A[0]===B[0]&&B[0]===C[0];for(const q of[A,B,C]){pos.push(q[0],q[1],q[2]);uv.push(.5+(side?q[2]:q[0])*.9,side?.44+(q[1]-Y)*.15:.55+q[1]*.9+q[2]*.3)}}/* side faces (constant x): u from z, v inside the blank strip between the thin rows and the bold rows (canvas y 256-300) -> plain opaque off-white */,Y=.1,AY=.36,CX=.3;
    for(const sz of[-1,1]){const zb=sz*Z*.86,zc=sz*Z*.94;tri([-CX,Y,zb],[0,Y,zc],[0,AY,sz*.01]);tri([0,Y,zc],[CX,Y,zb],[0,AY,sz*.01])}
    for(const sx of[-1,1])tri([sx*CX,Y,-Z*.86],[sx*CX,Y,Z*.86],[0,AY,0]);
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.computeVertexNormals();
    const cm=m.clone();cm.flatShading=true;g.add(new T.Mesh(geo,cm));g.position.y=.05},
  antenna(P,g){const T=P.T,GR='#80e03a',LM='#b6fa40',o={roughness:.3,clearcoat:.6,clearcoatRoughness:.15,envMapIntensity:.5};// drawing's band green (#72cd33 sampled) and lime balls (#bbfa4f)
    // thick green band over the head (tube u along the band, v around: lit on top, dark underneath), slightly self-lit so it stays green in the studio light
    const btx=canvasTex('antBand3',512,64,(c,w,h)=>{c.fillStyle=GR;c.fillRect(0,0,w,h);const gv=c.createLinearGradient(0,0,0,h);for(const[p,q]of[[0,KA(.14)],[.25,KA(0)],[.5,WA(.1)],[.75,KA(0)],[1,KA(.14)]])gv.addColorStop(p,q);c.fillStyle=gv;c.fillRect(0,0,w,h);const gu=c.createLinearGradient(0,0,w,0);for(const[p,q]of[[0,KA(.12)],[.2,KA(0)],[.4,WA(.08)],[.7,KA(0)],[1,KA(.12)]])gu.addColorStop(p,q);c.fillStyle=gu;c.fillRect(0,0,w,h)});
    const bm=wm('#ffffff',Object.assign({map:btx,emissiveIntensity:.3,emissive:'#ffffff'},o));bm.emissiveMap=bm.map;const hb=hband(T,bm,null,.034,.024,.75);hb.scale.z=1.15;g.add(hb);// rounder tube than the default 1.5 flattening
    for(const sx of[-1,1]){const x=sx*.17,by=bandY(x),sl=(bandY(x+.02)-bandY(x-.02))/.04,tilt=Math.atan(sl)-sx*.12,a=new T.Group();a.position.set(x,by+.01,0);a.rotation.z=tilt;g.add(a);
      // green collar on the band, short fat steel coil (5 turns), big glowing lime ball on top
      const col=wmesh(new T.CylinderGeometry(.04,.046,.05,20),GR,o);col.position.y=.02;a.add(col);
      const hp=[];for(let k=0;k<=120;k++){const t=k/120,an=t*Math.PI*2*5;hp.push(new T.Vector3(Math.cos(an)*.04,.045+t*.11,Math.sin(an)*.04))}
      a.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(hp),240,.011,8),'#bfc3c8',{metalness:.6,roughness:.4,envMapIntensity:.5,emissive:'#60666e',emissiveIntensity:.12}));
      const b=wmesh(new T.SphereGeometry(.11,32,20),'#2f6a00',{roughness:.7,clearcoat:0,emissive:'#9cff00',emissiveIntensity:1,envMapIntensity:0});/* pre-tonemap colour pushed past the drawing's #bcfa51 because ACES lifts the blue channel *//* vivid lime, self-lit hot core */b.position.y=.16+.1;a.add(b)}},
  headphones(P,g){const T=P.T,BL='#2550bd',YL='#f4b422',DK='#1b3a8f',o={roughness:.32,clearcoat:.6,clearcoatRoughness:.15,envMapIntensity:.45},B=Object.assign({emissive:BL,emissiveIntensity:.14},o),Y=Object.assign({},o,{emissive:'#c07a00',emissiveIntensity:.14,envMapIntensity:.3});// drawing's blue #254eb6 / yellow #edb230 (sampled)
    // fat blue band sitting on the head (hband, off .03), yellow slider blocks at its ends, big cups: blue shell, yellow outer plate with a blue ring and a yellow centre disc (facing out), dark-blue cushion pressed on the head
    g.add(hband(T,BL,B,.042,.03,1));const yc=-.2,rc=bodyR((.66+yc)/.75);
    for(const sx of[-1,1]){const cg=new T.Group();cg.position.set(sx*(rc+.06),yc,0);cg.rotation.set(0,-sx*.65,-sx*Math.PI/2);g.add(cg);// local +y = outward, turned ~37 deg toward the camera so the yellow face reads from the front
      cg.add(wmesh(new T.CylinderGeometry(.15,.16,.1,48),BL,B));
      const pl=wmesh(new T.CylinderGeometry(.143,.15,.024,48),YL,Y);pl.position.y=.06;cg.add(pl);
      const rg=wmesh(new T.TorusGeometry(.105,.026,12,48),BL,B);rg.rotation.x=Math.PI/2;rg.position.y=.072;cg.add(rg);
      const cd=wmesh(new T.CylinderGeometry(.075,.075,.014,32),YL,Y);cd.position.y=.078;cg.add(cd);
      const cu=wmesh(new T.TorusGeometry(.11,.042,12,48),DK,{roughness:.75,clearcoat:.05,envMapIntensity:.3});cu.rotation.x=Math.PI/2;cu.position.y=-.06;cg.add(cu);
      const cc=wmesh(new T.CylinderGeometry(.08,.08,.012,32),DK,{roughness:.8,envMapIntensity:.3});cc.position.y=-.06;cg.add(cc);
      // yoke: yellow slider block on the band end, short blue stem down to the cup
      const sl=wmesh(new T.BoxGeometry(.055,.1,.085),YL,Y);sl.position.set(sx*.39,-.065,0);sl.rotation.z=-sx*.38;g.add(sl);const st=wmesh(new T.CylinderGeometry(.03,.03,.09,16),BL,B);st.position.set(sx*(rc+.03),-.08,0);st.rotation.z=-sx*.3;g.add(st)}},
  flowerpin(P,g){const T=P.T,PK='#f768a3',WT='#f7f4f1',f=new T.Group(),x=.09,y=.04,z=headZ(x,y,.012);face(f,x,y,z,.3);f.scale.setScalar(1.3);g.add(f);// drawing's pink clip (#fa7ead sampled), white daisy, yellow centre (#f8ca30)
    // petal map over the petal sphere's u (tip at u .5): dark root at the centre (AO under the yellow dome), lit tip, edges a little darker; slight self-light so the white stays white in the shade
    const petM=wm('#ffffff',{map:canvasTex('fpPetal2',128,32,(c,w,h)=>{const gr=c.createLinearGradient(0,0,w,0);gr.addColorStop(0,shade(WT,-.35));gr.addColorStop(.2,shade(WT,-.1));gr.addColorStop(.5,'#ffffff');gr.addColorStop(.8,shade(WT,-.04));gr.addColorStop(1,shade(WT,-.35));c.fillStyle=gr;c.fillRect(0,0,w,h);const gv=c.createLinearGradient(0,h,0,0);gv.addColorStop(0,KA(.2));gv.addColorStop(.5,KA(0));gv.addColorStop(1,WA(.1));c.fillStyle=gv;c.fillRect(0,0,w,h)}),roughness:.38,clearcoat:.5,envMapIntensity:.45,emissive:'#ffffff',emissiveIntensity:.12});petM.emissiveMap=petM.map;
    for(let k=0;k<10;k++){const b=k/10*Math.PI*2+Math.PI/2,p=new T.Mesh(new T.SphereGeometry(.05,20,14),petM);p.scale.set(1.3,.74,.42);p.position.set(Math.cos(b)*.08,Math.sin(b)*.08,0);p.rotation.z=b;f.add(p)}
    const cen=wm('#ffffff',{map:canvasTex('fpCenter2',64,64,(c,w,h)=>{const gr=c.createRadialGradient(w*.4,h*.35,2,w/2,h/2,w*.5);gr.addColorStop(0,'#ffe066');gr.addColorStop(.55,'#f8ca30');gr.addColorStop(1,'#c58a10');c.fillStyle=gr;c.fillRect(0,0,w,h)}),roughness:.3,clearcoat:.7,envMapIntensity:.5,emissive:'#f8ca30',emissiveIntensity:.12}),ce=new T.Mesh(new T.SphereGeometry(.055,24,16),cen);ce.scale.z=.65;ce.position.z=.022;f.add(ce);
    // snap clip: pink stadium bar with a slot, extruded, slanting down to the side and bent back toward the head so its far end neither floats nor sinks; gold rivet at the end
    const stad=(P_,x0,x1,r)=>{P_.moveTo(x0,r);P_.lineTo(x1,r);P_.absarc(x1,0,r,Math.PI/2,-Math.PI/2,true);P_.lineTo(x0,-r);P_.absarc(x0,0,r,-Math.PI/2,Math.PI/2,true)},sh=new T.Shape();stad(sh,0,.27,.034);const ho=new T.Path();stad(ho,.05,.22,.012);sh.holes.push(ho);
    const cge=new T.ExtrudeGeometry(sh,{depth:.014,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:3,curveSegments:16}),cg=new T.Group();cg.position.set(.02,-.015,0);cg.rotation.z=-.22;f.add(cg);f.updateMatrix();cg.updateMatrix();
    // the clip is laid out flat in the flower's frame, then every vertex is projected radially onto the head surface at its own height (the head is an egg, wider below the flower) + its own thickness: it hugs the head, nothing floats or sinks
    const M=f.matrix.clone().multiply(cg.matrix),vv=new T.Vector3(),proj=(x,y,zl)=>{vv.set(x,y,0).applyMatrix4(M);const an=Math.atan2(vv.x,vv.z),R=bodyR(Math.min(.999,(.66+vv.y)/.75))+.01+zl*1.3;return [R*Math.sin(an),vv.y,R*Math.cos(an)]};
    {const p=cge.attributes.position;for(let i=0;i<p.count;i++){const q=proj(p.getX(i),p.getY(i),p.getZ(i));p.setXYZ(i,q[0],q[1],q[2])}cge.computeVertexNormals()}f.remove(cg);
    g.add(wmesh(cge,PK,{roughness:.28,clearcoat:.7,clearcoatRoughness:.1,envMapIntensity:.5,emissive:PK,emissiveIntensity:.1}));const rv=wmesh(new T.SphereGeometry(.014,12,8),'#f1b630',GOLD);rv.position.set(...proj(.24,0,.018));g.add(rv)},
  hardhat(P,g){const T=P.T,C='#ffb800',o={roughness:.5,clearcoat:.05,clearcoatRoughness:.4,envMapIntensity:.05,emissive:'#ff8800',emissiveIntensity:.32},KO=a=>`rgba(150,70,0,${a})`;// drawing's lemon-amber, shadows baked yellow-orange (KO) not brown// drawing's safety yellow (#fdca2c sampled; the studio light lifts it, so a hair deeper)
    // painted shell: same-hue key light top-left (warm, <= .12), AO at the rim over the brim, faint seam shadows beside the central ridge; the brim darker inside (under the shell) and lit at its lip
    const WK=a=>`rgba(255,240,200,${a})`,stx=canvasTex('hhShell7',1024,512,(c,w,h)=>{c.fillStyle=C;c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KO(0)],[.5,KO(.2)],[.58,KO(0)],[1,WK(.06)]],gu:[[0,WK(.04)],[.15,WK(0)],[.4,KO(.1)],[.6,KO(.03)],[.85,WK(.08)],[1,WK(.04)]]})});
    const btx=canvasTex('hhBrim7',256,64,(c,w,h)=>{c.fillStyle=C;c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KO(.3)],[.35,KO(0)],[.85,WK(.04)],[1,WK(.08)]],gu:[[0,WK(.04)],[.15,WK(0)],[.4,KO(.08)],[.6,KO(.03)],[.85,WK(.08)],[1,WK(.04)]]})});
    const sm=wm('#ffffff',Object.assign({map:stx},o)),bm=wm('#ffffff',Object.assign({map:btx,side:T.DoubleSide},o));
    const d=wmesh(new T.SphereGeometry(.31,64,32,0,Math.PI*2,0,Math.PI/2),sm);d.scale.set(1,1.02,1.06);d.position.y=-.01;g.add(d);const sk=wmesh(new T.CylinderGeometry(.31,.314,.06,64,1,true),sm);sk.scale.z=1.06;sk.position.y=-.04;g.add(sk);
    // wide central ridge front-to-back (flat top with a shallow slot), two low side ribs
    const rG=new T.Group();rG.scale.set(1.9,1,1);g.add(rG);const rg=wmesh(new T.TorusGeometry(.305,.022,12,48,Math.PI*.86),C,o);rg.rotation.y=Math.PI/2;rg.rotation.z=Math.PI*.07;rg.scale.set(1.03,1.0,1);rg.position.y=-.012;rG.add(rg);// wide low central ridge (~.015 proud)
    for(const ry of[.42,-.42]){const r=wmesh(new T.TorusGeometry(.312,.018,10,48,Math.PI*.8),C,o);r.rotation.y=Math.PI/2+ry;r.rotation.z=Math.PI*.1;r.scale.set(1.06,1.0,1);r.position.y=-.01;g.add(r)}
    // brim all round with a longer front peak and a raised lip; three accessory slots (front + both sides) sitting on the brim
    const brim=shell(96,10,(u,v)=>{const a=u*Math.PI*2,fr=Math.pow(Math.max(0,Math.cos(a)),2),r=.3+v*(.05+.13*fr),lip=v>.85?.012*(v-.85)/.15:0;return [Math.sin(a)*r,-.045-.035*v*v*fr+.01*v*(1-fr)+lip,Math.cos(a)*r*1.06]},.022);g.add(wmesh(brim,bm));
    for(const[a,sz]of[[0,1],[1.25,.85],[-1.25,.85]]){const b=wmesh(new T.BoxGeometry(.07*sz,.03,.045*sz),C,o);const r=.3+.045+.07*Math.pow(Math.max(0,Math.cos(a)),2);b.position.set(Math.sin(a)*r,-.03-.02*Math.pow(Math.cos(a),2),Math.cos(a)*r*1.06);b.rotation.y=a;g.add(b)}g.position.y=.02},
  royal(P,g){const T=P.T,R=.255,GD='#ffc63a',G=Object.assign({},GOLD,{metalness:.8,roughness:.2,emissive:'#b07410',emissiveIntensity:.25,envMapIntensity:1}),RD='#a0020e';// drawing's gold #e8ae2f, velvet red #a0020e, ermine white with black tails (sampled)
    // ermine band: shell fur on a torus; map (u around the band, v around the tube: v 0/1 = outer face, .25 top lit, .75 underside dark) with a row of black oblong tails on the outer face
    const fm=wm('#ffffff',{map:canvasTex('royalFur2',1024,128,(c,w,h)=>{c.fillStyle='#fbfaf6';c.fillRect(0,0,w,h);let sd=3;const Rn=()=>(sd=(sd*16807)%2147483647)/2147483647;for(let i=0;i<1800;i++){const x=Rn()*w,y=Rn()*h,l=6+Rn()*10;c.strokeStyle=Rn()<.5?KA(.05):WA(.1);c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x+(Rn()-.5)*4,y-l);c.stroke()}
      const gv=c.createLinearGradient(0,0,0,h);for(const[p,q]of[[0,WA(.1)],[.25,WA(.0)],[.5,KA(.0)],[.75,KA(.16)],[1,KA(.08)]])gv.addColorStop(p,q);c.fillStyle=gv;c.fillRect(0,0,w,h);
      c.fillStyle='#1a1620';for(let i=0;i<12;i++){const x=(i+.5)/12*w;c.beginPath();c.ellipse(x,h*.1,6,7,0,0,7);c.fill();c.beginPath();c.ellipse(x+w/28,h*.9,6,7,0,0,7);c.fill()}}),/* two staggered rows of round spots on the outer face */emissive:'#ffffff',emissiveIntensity:.3,roughness:.95,clearcoat:0,sheen:.3,sheenRoughness:.5,sheenColor:new T.Color('#ffffff')});fm.emissiveMap=fm.map;
    const ft=new T.TorusGeometry(R+.015,.07,24,96);ft.rotateX(Math.PI/2);const fur=furShells(ft,fm,{len:.026,rep:[10,1.2],layers:16,ramp:[.88,.2],at:[.1,.5],hair:'hairD',sheenI:.3});fur.position.y=-.005;g.add(fur);const kg=new T.Group();kg.position.y=.045;g.add(kg);// crown body lifted above the fur's hair tips
    // red velvet cap: matte, darker toward the band (AO), same-hue self-light so it stays deep red not pink
    const ctx=canvasTex('royalVelvet1',256,128,(c,w,h)=>{c.fillStyle=RD;c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KA(0)],[.5,KA(.35)],[.62,KA(0)],[1,`rgba(255,120,120,.1)`]],gu:[[0,`rgba(255,120,120,.06)`],[.15,KA(0)],[.4,KA(.14)],[.6,KA(.04)],[.85,`rgba(255,120,120,.1)`],[1,`rgba(255,120,120,.06)`]]})}),cm=wm('#ffffff',{map:ctx,roughness:.85,clearcoat:0,sheen:.6,sheenRoughness:.5,sheenColor:new T.Color('#ff5a5a'),envMapIntensity:.3,emissive:'#ff2020',emissiveIntensity:.08});
    const cap=wmesh(new T.SphereGeometry(R-.005,48,24,0,Math.PI*2,0,Math.PI/2),cm);cap.scale.y=1.0;cap.position.y=.08;kg.add(cap);
    // gold base band (AO at its edges, lit top-left) with big faceted gems in gold bezels (red front, blue sides, green back) and pearls between
    const gtx=canvasTex('royalGold2',512,64,(c,w,h)=>{c.fillStyle='#ffd23a';c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KA(.3)],[.25,KA(0)],[.55,WA(.1)],[.85,KA(0)],[1,KA(.2)]],gu:[[0,WA(.1)],[.15,WA(0)],[.4,KA(.1)],[.6,KA(.04)],[.85,WA(.2)],[1,WA(.1)]]})});
    const bd=[];for(let k=0;k<=8;k++){const t=k/8;bd.push(V2(R+.012+.01*Math.sin(t*Math.PI),.04+t*.1))}kg.add(wmesh(new T.LatheGeometry(bd,64),wm('#ffffff',Object.assign({map:gtx},G))));
    for(const y of[.045,.135]){const t=wmesh(new T.TorusGeometry(R+.022,.012,10,72),GD,G);t.rotation.x=Math.PI/2;t.position.y=y;kg.add(t)}
    const gem=(a,y,c,sz,r=R+.03)=>{const m=wmesh(new T.IcosahedronGeometry(.045*sz,0),c,{roughness:.06,clearcoat:1,clearcoatRoughness:.05,flatShading:true,emissive:c,emissiveIntensity:.35});m.scale.set(.9,1.15,.5);face(m,Math.sin(a)*r,y,Math.cos(a)*r);kg.add(m);const st=wmesh(new T.TorusGeometry(.048*sz,.009,8,6),'#ffe070',G);st.scale.set(.95,1.2,1);face(st,Math.sin(a)*(r-.006),y,Math.cos(a)*(r-.006));st.rotateZ(Math.PI/6);kg.add(st)};
    gem(0,.09,'#d8101e',1.3);gem(Math.PI/2,.09,'#1f5ae8',1);gem(-Math.PI/2,.09,'#1f5ae8',1);gem(Math.PI,.09,'#1fae5a',1);
    for(let i=0;i<8;i++){const a=(i+.5)/8*Math.PI*2,pe=wmesh(new T.SphereGeometry(.017,12,10),'#fff8ee',{roughness:.15,clearcoat:1,emissive:'#fff0e0',emissiveIntensity:.15});pe.position.set(Math.sin(a)*(R+.03),.09,Math.cos(a)*(R+.03));kg.add(pe)}
    // crest on the rim: 4 big crosses (at the arch roots) with a red gem, 4 trefoil balls between; two pearl-studded arches, orb and cross with a red gem
    const crossG=(()=>{const sh=new T.Shape();sh.moveTo(-.024,0);sh.lineTo(-.024,.045);sh.lineTo(-.05,.055);sh.lineTo(-.05,.095);sh.lineTo(-.014,.085);sh.lineTo(-.014,.125);sh.lineTo(.014,.125);sh.lineTo(.014,.085);sh.lineTo(.05,.095);sh.lineTo(.05,.055);sh.lineTo(.024,.045);sh.lineTo(.024,0);return new T.ExtrudeGeometry(sh,{depth:.014,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:2})})();
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2,big=i%2===0;if(big){const o=wmesh(crossG,GD,G);face(o,Math.sin(a)*(R+.015),.135,Math.cos(a)*(R+.015));kg.add(o);const gm=wmesh(new T.SphereGeometry(.014,10,8),'#d8101e',{roughness:.05,clearcoat:1,emissive:'#d8101e',emissiveIntensity:.3});gm.position.set(0,.07,.02);o.add(gm)}
      else{const o=wmesh(new T.SphereGeometry(.024,14,10),GD,G);o.position.set(Math.sin(a)*(R+.015),.16,Math.cos(a)*(R+.015));kg.add(o)}}
    for(const ry of[0,Math.PI/2]){const ar=wmesh(new T.TorusGeometry(R+.005,.018,10,48,Math.PI),GD,G);ar.rotation.y=ry;ar.scale.y=1.05;ar.position.y=.14;kg.add(ar);
      for(let k=1;k<9;k++){const t=k/9*Math.PI,pe=wmesh(new T.SphereGeometry(.015,10,8),'#fff8ee',{roughness:.15,clearcoat:1,emissive:'#fff0e0',emissiveIntensity:.15});pe.position.set(Math.cos(t)*(R+.026)*Math.cos(ry),.14+Math.sin(t)*(R+.026)*1.05,-Math.cos(t)*(R+.026)*Math.sin(ry));kg.add(pe)}}
    const orb=wmesh(new T.SphereGeometry(.045,20,14),GD,G);orb.position.y=.14+R*1.05+.04;kg.add(orb);
    const cx=new T.Group();cx.position.y=orb.position.y+.08;kg.add(cx);for(const [w,h] of[[.026,.12],[.09,.026]]){const b=wmesh(new T.BoxGeometry(w,h,.022),GD,G);cx.add(b)}
    const cg=wmesh(new T.SphereGeometry(.018,10,8),'#d8101e',{roughness:.05,clearcoat:1,emissive:'#d8101e',emissiveIntensity:.3});cg.position.z=.014;cx.add(cg)},
  cloudhat(P,g){const T=P.T;// drawing: smooth puffy white cloud (overlapping round puffs, soft grey-blue underside) with a big six-band rainbow standing behind it on the right
    const ptx=canvasTex('cloudPuff2',64,128,(c,w,h)=>{const gr=c.createLinearGradient(0,h,0,0);gr.addColorStop(0,'#d8dce4');gr.addColorStop(.4,'#f6f6f8');gr.addColorStop(.7,'#ffffff');gr.addColorStop(1,'#ffffff');c.fillStyle=gr;c.fillRect(0,0,w,h);const gu=c.createLinearGradient(0,0,w,0);for(const[p,q]of[[0,WA(0)],[.4,KA(.08)],[.6,KA(.02)],[.85,WA(.08)],[1,WA(0)]])gu.addColorStop(p,q);c.fillStyle=gu;c.fillRect(0,0,w,h)});
    const pm=wm('#ffffff',{map:ptx,roughness:.95,clearcoat:0,sheen:.5,sheenRoughness:.6,sheenColor:new T.Color('#ffffff'),envMapIntensity:.2,emissive:'#ffffff',emissiveIntensity:.2});pm.emissiveMap=pm.map;
    [[0,.1,.05,.21],[-.19,.05,.04,.14],[.18,.05,.05,.14],[-.09,.02,.17,.15],[.09,.02,.17,.15],[0,.06,-.12,.15],[-.28,0,-.02,.1],[.27,0,-.02,.1],[.34,-.02,.0,.11]].forEach(([x,y,z,r])=>{const m=new T.Mesh(new T.SphereGeometry(r,32,24),pm);m.position.set(x,y,z);g.add(m)});
    const base=new T.Mesh(new T.SphereGeometry(.3,40,24),pm);base.scale.y=.45;base.position.set(0,.02,.04);g.add(base);// flattened body the puffs sit in
    // rainbow: six flat bands (tori, flattened in depth) in one upright arc behind the cloud, turned a little toward the camera; ends buried in the puffs
    const cols=['#ef3535','#ff8a1a','#ffd21f','#3cbf4a','#2f7de1','#8b4fd8'],rb=new T.Group();rb.position.set(.03,.13,-.05);rb.rotation.y=-.45;g.add(rb);// feet of all six bands buried in the side puffs (extra puff under the right foot), arc high enough that the blue/purple bands clear the centre puff
    cols.forEach((c,i)=>{const t=wmesh(new T.TorusGeometry(.3-i*.028,.019,8,56,Math.PI),c,{roughness:.45,clearcoat:.3,emissive:c,emissiveIntensity:.12,envMapIntensity:.45});t.scale.z=.7;rb.add(t)})},
  halo(P,g){const T=P.T,GD='#ffc000',G={metalness:.1,roughness:.5,clearcoat:.2,emissive:'#f09000',emissiveIntensity:.5,envMapIntensity:.15},R=.3,y=.26;// drawing's gold #eeb839 (sampled): a tilted thin ring hovering over the head with puffy 5-point stars, big ones in front, small at the back
    const ring=wmesh(new T.TorusGeometry(R,.012,8,80),GD,G);ring.rotation.x=Math.PI/2;ring.position.y=y;g.add(ring);
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2,f=(Math.cos(a)+1)/2,s=.62+.38*Math.pow(f,1.5),sz=.058*s,st=wmesh(starGeo(T,sz,sz*.48,.03*s,5,.4),GD,G);st.position.set(Math.sin(a)*R,y,Math.cos(a)*R);g.add(st)}// every star billboarded to the camera (+z), evenly spaced, smaller toward the back; puffy: depth .03 with a .4 bevel
    g.rotation.x=.42;g.position.y=.03}  ,
  /* batch 3 (graphics sheet acc/hats3.png) */
  pumpkin(P,g){const T=P.T,O='#fc7a12',KO=a=>`rgba(120,30,0,${a})`,WK=a=>`rgba(255,220,170,${a})`,o={roughness:.33,clearcoat:.5,clearcoatRoughness:.25,envMapIntensity:.22,emissive:'#ff5a00',emissiveIntensity:.1};// drawing's orange (#fc8e20 mid / #ef650b shade / #fc9d58 lit sampled), stem #4f9d2c, cuts #711700 with a yellow glow
    // plate: flat orange disc with a rolled lip, darker than the pumpkin (drawing #ef650b)
    const pl=[];for(let k=0;k<=10;k++){const t=k/10;pl.push(V2(.39+.03*Math.sin(t*Math.PI),-.035+t*.03))}pl.unshift(V2(0,-.035));pl.push(V2(.36,0),V2(0,0));g.add(wmesh(new T.LatheGeometry(pl,72),'#ee6a0e',o));
    // body: 8 deep ribs, rounded dome with a dimple at the stem; map = painted face (cuts dark maroon, yellow glow in the lower half of every cut), rib seams, lit top-left, roots dark at the plate
    const F=(X,Y)=>[X/2.07+.5,(Y+.03)/.4],tx=canvasTex('pumpkin5',1024,512,(c,w,h)=>{c.fillStyle=O;c.fillRect(0,0,w,h);for(let i=0;i<=8;i++){const x=i/8*w,gr=c.createLinearGradient(x-26,0,x+26,0);gr.addColorStop(0,KO(0));gr.addColorStop(.5,KO(.22));gr.addColorStop(1,KO(0));c.fillStyle=gr;c.fillRect(x-26,0,52,h)}// face centred at u .5 (map seam at the back, body turned PI)
      const sh=(pts,gy0,gy1)=>{{c.save();c.fillStyle='#5a1200';c.beginPath();pts.forEach(([u,v],i)=>{const X=u*w,Y=(1-v)*h;i?c.lineTo(X,Y):c.moveTo(X,Y)});c.closePath();c.fill();c.save();c.clip();const gr=c.createLinearGradient(0,(1-gy1)*h,0,(1-gy0)*h);gr.addColorStop(0,'rgba(255,200,40,0)');gr.addColorStop(.45,'rgba(255,205,50,.75)');gr.addColorStop(1,'#ffd84a');c.fillStyle=gr;c.fillRect(0,0,w,h);c.restore();c.restore()}};
      const S=(pts,y0,y1)=>sh(pts.map(p=>F(p[0],p[1])),F(0,y0)[1],F(0,y1)[1]);S([[-.17,.21],[-.05,.215],[-.10,.29]],.20,.27);S([[.05,.215],[.17,.21],[.10,.29]],.20,.27);S([[-.03,.15],[.03,.15],[0,.20]],.15,.19);
      S([[-.21,.14],[-.12,.115],[0,.105],[.12,.115],[.21,.14],[.16,.07],[.08,.035],[0,.025],[-.08,.035],[-.16,.07]],.025,.09);
      const RB=(X0,Y0,X1,Y1,col)=>{{const a=F(X0,Y1),b=F(X1,Y0);c.fillStyle=col;c.fillRect(a[0]*w,(1-a[1])*h,(b[0]-a[0])*w,(a[1]-b[1])*h)}};RB(-.065,.08,-.02,.12,O);RB(.03,.085,.065,.12,O);RB(-.025,.025,.025,.06,'#ffd84a');
      bakeLight(c,w,h,{gv:[[0,KO(.35)],[.2,KO(0)],[.85,WK(.06)],[1,WK(.16)]],gu:[[0,WK(.1)],[.15,WK(0)],[.4,KO(.18)],[.6,KO(.05)],[.85,WK(.14)],[1,WK(.1)]]})});
    const body=surf(128,40,(u,v)=>{const a=u*Math.PI*2+Math.PI,rib=1-.075*Math.pow(Math.abs(Math.sin(a*4)),.55),q=2*v-1,pr=q<0?.33*(1-.12*q*q):.33*Math.sqrt(Math.max(0,1-q*q*.92))*(1-.1*q*q),r=pr*rib;return [Math.sin(a)*Math.max(.001,r),.17+q*.2-.05*Math.pow(Math.max(0,q),5),Math.cos(a)*Math.max(.001,r)]},1);
    const bm=wm('#ffffff',Object.assign({map:tx},o));bm.emissive=new T.Color('#ff7a1a');bm.emissiveMap=tx;bm.emissiveIntensity=.16;g.add(wmesh(body,bm));const bt=wmesh(new T.CircleGeometry(.3,48),O,o);bt.rotation.x=Math.PI/2;bt.position.y=-.02;g.add(bt);
    // fat green stem leaning right, curly tendril, one leaf lying on the pumpkin's right shoulder
    const GR={roughness:.45,clearcoat:.35,emissive:'#2a6a18',emissiveIntensity:.1};const st=taper(T,[new T.Vector3(0,.3,0),new T.Vector3(.01,.37,0),new T.Vector3(.04,.42,0),new T.Vector3(.09,.45,0)],.055,.03,20,10);g.add(wmesh(st.g,'#4f9d2c',GR));
    const vp=[];for(let k=0;k<=40;k++){const t=k/40,a=t*Math.PI*3.2;vp.push(new T.Vector3(.09+t*.12+Math.cos(a)*.035*(1-t*.5),.44+Math.sin(a)*.035*(1-t*.5)-t*.03,.01))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(vp),80,.009,6),'#63b04e',GR));
    const lf=wmesh(leafGeo(T),'#4f9d2c',GR);lf.scale.setScalar(.75);lf.position.set(.13,.32,.12);lf.rotation.set(.6,.3,-1.6);g.add(lf);g.position.y=.03},
  witch(P,g){const T=P.T,C='#2a252b',GK=a=>`rgba(170,165,185,${a})`,o={roughness:.5,clearcoat:.25,clearcoatRoughness:.35,sheen:.12,sheenColor:new T.Color('#9a98a4'),envMapIntensity:.25};// drawing's black felt #272227 with grey #5b5560 key light, orange band #dd5d14/#f5911f, purple #6928a4/#a55ed2, yellow buckle
    // felt maps: crown lit top-left in grey (not pink: low env), AO at the base over the band; brim lit on top, dark underside
    const ctx=canvasTex('witchCrown2',512,512,(c,w,h)=>{c.fillStyle=C;c.fillRect(0,0,w,h);grain(c,w,h,1400,.025,6);bakeLight(c,w,h,{gv:[[0,KA(.45)],[.2,KA(0)],[.75,GK(.06)],[1,GK(.1)]],gu:[[0,GK(.14)],[.15,GK(.0)],[.4,KA(.3)],[.6,KA(.12)],[.85,GK(.36)],[1,GK(.14)]]})});
    const btx=canvasTex('witchBrim2',512,128,(c,w,h)=>{c.fillStyle=C;c.fillRect(0,0,w,h);grain(c,w,h,900,.025,8);bakeLight(c,w,h,{gv:[[0,KA(.35)],[.4,KA(0)],[1,GK(.08)]],gu:[[0,GK(.12)],[.15,GK(0)],[.4,KA(.18)],[.6,KA(.06)],[.85,GK(.3)],[1,GK(.12)]]})});
    const cm=wm('#ffffff',Object.assign({map:ctx},o)),bm=wm('#ffffff',Object.assign({map:btx,side:T.DoubleSide},o));
    // wide flat brim with a slightly rolled lip, .03 thick
    g.add(wmesh(shell(80,8,(u,v)=>{const a=u*Math.PI*2,r=.21+v*.3;return [Math.sin(a)*r,-.025*v*v+.018*Math.pow(v,6)+.012*v*Math.cos(a*2),Math.cos(a)*r]},.03),bm));
    // fat crown, a crease two thirds up, the tip bending right and hooking down
    const H0=.64;g.add(wmesh(surf(64,48,(u,v)=>{const a=u*Math.PI*2,r=Math.max(.004,.245*Math.pow(1-v,1.05)*(1+.06*Math.sin(v*Math.PI))*(1-.06*Math.exp(-Math.pow((v-.62)/.06,2))));const bx=.34*Math.pow(v,3)-.04*Math.pow(v,1.5),by=-.22*Math.pow(v,7);return [Math.sin(a)*r+bx,v<.02?-.07+v/.02*.07:v*H0+by,Math.cos(a)*r]},1),cm));
    const band=(y0,h,c,dr,e)=>{const b=[];for(let k=0;k<=8;k++){const t=k/8;b.push(V2(.247+dr-.022*(y0+t*h)/.1+.006*Math.sin(t*Math.PI),y0+t*h))}g.add(wmesh(new T.LatheGeometry(b,64),c,{roughness:.35,clearcoat:.5,emissive:e,emissiveIntensity:.12,envMapIntensity:.4}))};
    band(0,.075,'#ec6f16',.004,'#c04000');band(.075,.045,'#9a4ae0',.0,'#7a28c8');
    // big square yellow buckle with a prong, standing proud of the orange band
    const bk=new T.Group();face(bk,0,.037,.254);g.add(bk);const G2={metalness:.35,roughness:.28,clearcoat:.5,emissive:'#a06a00',emissiveIntensity:.18,envMapIntensity:.6};for(const [w,h,x,y] of[[.13,.026,0,.052],[.13,.026,0,-.052],[.026,.13,-.052,0],[.026,.13,.052,0],[.07,.016,-.022,0]]){const b=wmesh(new T.BoxGeometry(w,h,.022),'#f7c81c',G2);b.position.set(x,y,0);bk.add(b)}
    g.position.y=.06},
  starcrown(P,g){const T=P.T,R=.25,sc=a=>.11+.03*Math.pow(Math.abs(Math.cos(a*6)),3),G=Object.assign({},GOLD,{metalness:.45,roughness:.3,emissive:'#e09a18',emissiveIntensity:.4,envMapIntensity:.5});// drawing's gold #dd9e27 body / #fcd355 lit (sampled), purple gem #9320d9
    const gtx=canvasTex('scGold3',512,128,(c,w,h)=>{c.fillStyle='#ffcc30';c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,KA(.25)],[.2,KA(0)],[.6,WA(.08)],[1,WA(.22)]],gu:[[0,WA(.14)],[.15,WA(0)],[.4,KA(.18)],[.6,KA(.08)],[.85,WA(.3)],[1,WA(.14)]]})});
    g.add(wmesh(shell(120,10,(u,v)=>{const a=u*Math.PI*2,y=v*sc(a),r=R+.03*y/.14;return [Math.sin(a)*r,y,Math.cos(a)*r]},.02),wm('#ffffff',Object.assign({map:gtx},G))));
    const gs=wmesh(new T.TorusGeometry(R+.02,.016,10,72),'#ffd24a',G);gs.rotation.x=Math.PI/2;gs.position.y=.008;g.add(gs);
    // puffy five-point stars standing on the rim, big in front, smaller to the sides, every one facing out; gold beads between them
    const SG=Object.assign({},G);// Lead r1: stars spaced so none overlap, turned toward the camera (y = a*.55) so the side ones show their face; one bead in every gap, out at R+.04
    [[0,.12,1],[.85,.09,.8],[-.85,.09,.8],[1.65,.07,.6],[-1.65,.07,.6],[2.45,.06,.55],[-2.45,.06,.55],[Math.PI,.08,.7]].forEach(([a,s,k])=>{const st=wmesh(starGeo(T,s,s*.47,.03*k+.012,5,.5),'#ffd23f',SG);st.position.set(Math.sin(a)*(R+.02),.13+s*.8,Math.cos(a)*(R+.02));st.rotation.y=a*.55;g.add(st)});
    for(const a of[.425,-.425,1.25,-1.25,2.05,-2.05,2.8,-2.8]){const b=wmesh(new T.SphereGeometry(.021,12,8),'#ffd66a',G);b.position.set(Math.sin(a)*(R+.04),.138,Math.cos(a)*(R+.04));g.add(b)}
    hexGem(g,0,.095,R+.04,'#8a22d8',.95)},
  stkhat(P,g){const T=P.T,CR='#f8f3ee',o={roughness:.42,clearcoat:.4,clearcoatRoughness:.3,envMapIntensity:.4};// drawing: cream cap, red (#f2232f) / blue (#1886f5) split bill, yellow-orange pompom (#fdd621/#fba40c), puffy stickers with white borders
    // sticker painter: star / smiley / rainbow / heart with a fat white border and a soft gloss; sphere map: u .25 = front, canvas top = dome top, rim at y = h (SphereGeometry v spans the partial sphere)
    const star=(c,r)=>{c.beginPath();for(let k=0;k<10;k++){const an=-Math.PI/2+k*Math.PI/5,rr=k%2?r*.48:r;k?c.lineTo(Math.cos(an)*rr,Math.sin(an)*rr):c.moveTo(Math.cos(an)*rr,Math.sin(an)*rr)}c.closePath()};
    const heart=(c,r)=>{c.beginPath();c.moveTo(0,r*.9);c.bezierCurveTo(-r*1.3,-r*.1,-r*.55,-r*1.1,0,-r*.35);c.bezierCurveTo(r*.55,-r*1.1,r*1.3,-r*.1,0,r*.9);c.closePath()};
    const stk=(c,x,y,r,kind,col,rot=0)=>{c.save();c.translate(x,y);c.rotate(rot);c.lineJoin='round';const bd=()=>{c.lineWidth=r*.42;c.strokeStyle='#ffffff';c.stroke();c.lineWidth=r*.1;c.strokeStyle='rgba(60,50,70,.18)';c.stroke()};
      if(kind==='star'){star(c,r);bd();c.fillStyle=col;c.fill();c.save();c.clip();c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(-r*.25,-r*.3,r*.4,r*.2,-.5,0,7);c.fill();c.restore()}
      else if(kind==='heart'){heart(c,r);bd();c.fillStyle=col;c.fill()}
      else if(kind==='smile'){c.beginPath();c.arc(0,0,r,0,7);bd();c.fillStyle=col;c.fill();c.fillStyle='#3a2a10';for(const sx of[-1,1]){c.beginPath();c.ellipse(sx*r*.38,-r*.2,r*.1,r*.17,0,0,7);c.fill()}c.lineWidth=r*.12;c.strokeStyle='#3a2a10';c.lineCap='round';c.beginPath();c.arc(0,r*.05,r*.55,.3,Math.PI-.3);c.stroke();c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(-r*.3,-r*.5,r*.35,r*.17,-.5,0,7);c.fill()}
      else if(kind==='rainbow'){c.beginPath();c.arc(0,r*.4,r,Math.PI,0);c.lineTo(r*.6,r*.4);c.arc(0,r*.4,r*.6,0,Math.PI,true);c.closePath();bd();const cs=['#f0323a','#ff9a1e','#ffe034','#4ecf4a','#2e8ef0','#8a4fd8'];for(let i=0;i<6;i++){c.beginPath();c.arc(0,r*.4,r-i*r*.066,Math.PI,0);c.lineTo(r-(i+1)*r*.066,r*.4);c.arc(0,r*.4,r-(i+1)*r*.066,0,Math.PI,true);c.closePath();c.fillStyle=cs[i];c.fill()}
        c.fillStyle='#ffffff';for(const sx of[-1,1]){for(const[dx,dy,rr]of[[0,0,.3],[-.25,.1,.22],[.25,.1,.22]]){c.beginPath();c.arc(sx*r*.85+dx*r,r*.45+dy*r,rr*r,0,7);c.fill()}}}
      c.restore()};
    const tx=canvasTex('stkhat6',1024,512,(c,w,h)=>{c.fillStyle=CR;c.fillRect(0,0,w,h);
      stk(c,256,330,118,'star','#ffd21e',.1);stk(c,112,350,66,'smile','#ffb822');stk(c,395,300,78,'rainbow','#fff');stk(c,350,400,38,'star','#2e8ef0',-.2);stk(c,440,380,32,'star','#8a4fd8',.3);
      stk(c,160,232,34,'star','#f0323a',.4);stk(c,50,290,34,'star','#4ecf4a',-.3);stk(c,256,210,30,'star','#ff7ab8',0);stk(c,450,240,28,'star','#4ecf4a',.5);stk(c,60,430,26,'heart','#f0323a');stk(c,330,215,22,'heart','#ff7ab8');stk(c,18,370,30,'star','#ff9a1e',.2);stk(c,500,330,30,'star','#f0323a',0);stk(c,180,440,24,'star','#8a4fd8',.1);
      stk(c,580,320,44,'star','#ffd21e',.2);stk(c,660,250,30,'star','#2e8ef0',0);stk(c,740,360,38,'smile','#ffb822');stk(c,850,290,40,'star','#8a4fd8',.3);stk(c,940,390,28,'heart','#f0323a');stk(c,1000,260,26,'star','#ff9a1e',0);stk(c,790,240,28,'star','#4ecf4a',.4);stk(c,900,410,30,'star','#2e8ef0',.2);
      bakeLight(c,w,h,{gv:[[0,KA(0)],[.86,KA(0)],[.96,KA(.22)],[1,KA(.28)]],gu:[[0,KA(.06)],[.25,WA(.06)],[.5,KA(.1)],[.75,KA(.03)],[1,KA(.06)]]})});
    const d=wmesh(new T.SphereGeometry(.335,64,32,0,Math.PI*2,0,Math.PI/2),wm('#ffffff',Object.assign({map:tx},o)));d.position.y=-.02;d.scale.y=.96;g.add(d);
    const rim=wmesh(new T.TorusGeometry(.333,.008,10,72),shade(CR,-.12),o);rim.rotation.x=Math.PI/2;rim.position.y=-.02;g.add(rim);
    // bill: a nearly level shelf (~8 deg down, so the camera 13 deg above sees its TOP face as a wedge) whose root starts .02 INSIDE the dome wall under the rim (no slit); ends curl down smoothly; the head below the rim is narrower than the shelf's path so no clamp is needed
    const vtx=canvasTex('stkVisor3',256,64,(c,w,h)=>{c.fillStyle='#e8232e';c.fillRect(0,0,w/2,h);c.fillStyle='#1c8cff';c.fillRect(w/2,0,w/2,h);bakeLight(c,w,h,{gv:[[0,KA(.25)],[.3,KA(0)],[.85,WA(.1)],[1,KA(.08)]],gu:[[0,KA(.1)],[.3,WA(.05)],[.6,WA(0)],[1,KA(.12)]]})});
    const vis=shell(32,10,(u,v)=>{const q=u*2-1,x=q*.235*(1-.15*v),y=-.012-.035*v-.035*q*q*q*q*v,z0=Math.sqrt(Math.max(0,.0992-x*x)),z=z0+.24*v*(1-.45*q*q*q*q);return [x,y,z]},-.022);g.add(wmesh(vis,wm('#ffffff',Object.assign({},o,{map:vtx,side:T.DoubleSide,clearcoat:.2,envMapIntensity:.15}))));// th<0: the painted face is the TOP, the thickness hangs below it; root y -.012 = inside the rim torus band
    // big yellow-orange fur pompom
    const pm=furBall(.135,'#ffb000','stkpom6',{layers:20,len:.075,rep:[3,2],emi:.45,sh:{sheenI:0},gv:[[0,'rgba(200,90,0,.3)'],[.35,KA(0)],[1,'rgba(255,240,180,.2)']],keyStops:[[0,WA(.08)],[.15,WA(0)],[.4,'rgba(160,60,0,.2)'],[.6,KA(.04)],[.85,WA(.16)],[1,WA(.08)]]});pm.position.y=.38;g.add(pm)},
  h_farm(P,g){const T=P.T,R=.26;// drawing: braided brown rope band (#925a2c / #6b4730), gold beads (#dc9e2a), purple hex gem, big black feathers (#252020, grey #554f50 highlights) with brown roots (#503424)
    const rope=[];for(let s=0;s<2;s++){const p=[];for(let k=0;k<=160;k++){const a=k/160*Math.PI*2,w=a*14+s*Math.PI;p.push(new T.Vector3(Math.sin(a)*(R+.014*Math.cos(w)),.025+.014*Math.sin(w),Math.cos(a)*(R+.014*Math.cos(w))))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(p,true),320,.026,8,true),s?'#8a5630':'#a8703e',{roughness:.65,clearcoat:.15,emissive:'#3a1c08',emissiveIntensity:.15,envMapIntensity:.4}))}
    for(let i=0;i<10;i++){const a=(i+.5)/10*Math.PI*2;if(Math.abs(a-Math.PI*2)<.2||a<.2)continue;const b=wmesh(new T.SphereGeometry(.02,12,8),'#f0b43a',Object.assign({},GOLD,{emissive:'#a06a10',emissiveIntensity:.2}));b.position.set(Math.sin(a)*(R+.035),.025,Math.cos(a)*(R+.035));g.add(b)}
    // feather map over featherGeo's shape coords (x -.06..06 -> u, y 0..32 -> v): brown root, black blade, grey key light on the left edge, light quill down the centre, diagonal barb strokes
    const ftx=canvasTex('farmFeather3',128,512,(c,w,h)=>{const gr=c.createLinearGradient(0,h,0,0);gr.addColorStop(0,'#503424');gr.addColorStop(.2,'#2a2426');gr.addColorStop(1,'#232022');c.fillStyle=gr;c.fillRect(0,0,w,h);
      let sd=9;const Rn=()=>(sd=(sd*16807)%2147483647)/2147483647;for(let i=0;i<700;i++){const x=Rn()*w,y=Rn()*h,sx=x<w/2?-1:1;c.strokeStyle=Rn()<.5?KA(.18):'rgba(140,135,150,.16)';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x+sx*10,y+5);c.stroke()}
      const gu=c.createLinearGradient(0,0,w,0);gu.addColorStop(0,'rgba(120,115,130,.45)');gu.addColorStop(.3,'rgba(120,115,130,.06)');gu.addColorStop(.6,KA(0));gu.addColorStop(.75,'rgba(120,115,130,.2)');gu.addColorStop(1,KA(.3));c.fillStyle=gu;c.fillRect(0,0,w,h);
      const q=c.createLinearGradient(w*.46,0,w*.54,0);q.addColorStop(0,'rgba(170,140,110,0)');q.addColorStop(.5,'rgba(190,160,120,.7)');q.addColorStop(1,'rgba(170,140,110,0)');c.fillStyle=q;c.fillRect(w*.46,h*.05,w*.08,h*.95)});
    ftx.repeat.set(1/.12,1/.32);ftx.offset.set(.5,0);const fm=wm('#ffffff',{map:ftx,roughness:.55,clearcoat:.05,clearcoatRoughness:.4,sheen:.2,sheenColor:new T.Color('#66666c'),envMapIntensity:.1,emissive:'#2a2628',emissiveIntensity:.15,side:T.DoubleSide}),fg=featherGeo(T);
    // 9 separate feathers (Lead r1), tallest in front, short at the sides, fanning outward and sideways so gaps show between the blades; roots buried in the rope
    for(let i=0;i<9;i++){const a=i/9*Math.PI*2,k=1.0+.7*Math.pow(Math.abs(Math.cos(a)),1.2),f=wmesh(fg,fm);f.scale.set(k*.95,k,k);f.position.set(Math.sin(a)*(R-.01),.0,Math.cos(a)*(R-.01));f.rotation.y=a;f.rotation.x=-.3;f.rotation.z=-.15*Math.sin(a);g.add(f)}
    hexGem(g,0,.055,R+.045,'#8a22d8',1.0)},
  h_city(P,g){const T=P.T,C='#5e3018',KB=a=>`rgba(40,14,4,${a})`,WK=a=>`rgba(255,210,160,${a})`,L={roughness:.5,clearcoat:.3,clearcoatRoughness:.35,sheen:.2,sheenColor:new T.Color('#c8946a'),envMapIntensity:.25,emissive:'#3a1a08',emissiveIntensity:.1};// drawing's leather #582f1a / lit #936556 / shade #2a1912, gold #d3952e, black lenses
    // leather map: 6 panels (sphere u .25 = front), soft dark seam grooves with light stitch dashes, grain, lit top-left, AO at the bottom edge
    const lea=canvasTex('aviLea3',1024,512,(c,w,h)=>{c.fillStyle=C;c.fillRect(0,0,w,h);grain(c,w,h,2600,.035,3);for(let i=0;i<6;i++){const x=((.25+i/6)%1)*w;for(const X of[x,x+w,x-w]){const gr=c.createLinearGradient(X-14,0,X+14,0);gr.addColorStop(0,KB(0));gr.addColorStop(.5,KB(.5));gr.addColorStop(1,KB(0));c.fillStyle=gr;c.fillRect(X-14,0,28,h*.5);c.strokeStyle='rgba(240,200,140,.55)';c.lineWidth=2;c.setLineDash([6,6]);for(const d of[-9,9]){c.beginPath();c.moveTo(X+d,h*.06);c.lineTo(X+d,h*.5);c.stroke()}c.setLineDash([])}}
      c.fillStyle=KB(.35);c.fillRect(0,h*.47,w,h*.03);bakeLight(c,w,h,{gv:[[0,KB(0)],[.5,KB(.45)],[.62,KB(0)],[1,WK(.12)]],gu:[[0,WK(.08)],[.15,WK(0)],[.4,KB(.3)],[.6,KB(.08)],[.85,WK(.22)],[1,WK(.08)]]})});
    const lm=wm('#ffffff',Object.assign({map:lea},L));const hm=wmesh(new T.SphereGeometry(.335,64,32,0,Math.PI*2,0,Math.PI*.52),lm);hm.position.y=-.02;g.add(hm);const sk=wmesh(new T.CylinderGeometry(.335,.345,.08,64,1,true),lm);sk.position.y=-.06;g.add(sk);
    const bt=wmesh(new T.SphereGeometry(.028,14,10),'#5a2e14',L);bt.position.y=.31;bt.scale.y=.6;g.add(bt);
    // ear flaps lying along the head (onHead), rounded, with a gold rivet; a short chin strap end under the right one
    for(const sx of[-1,1]){const fl=shell(14,16,(u,v)=>{const hw=.16*Math.sqrt(Math.max(0,1-Math.pow((v-.3)/.75,2)))+.02,an=sx*1.05+(u-.5)*2*hw/.34,y=-.06-.19*v;return onHead(an,y,.008)},-.028);g.add(wmesh(fl,lm));// Lead r1: pads centred forward (an +-1.05), short, thick (th<0: the surf's normals point into the head, so the thickness goes outward), rivet on the pad
      const rv=wmesh(new T.SphereGeometry(.018,12,8),'#e0a93a',GOLD);rv.position.set(...onHead(sx*1.05,-.16,.044));g.add(rv)}
    // goggles on the front: fat gold rims with black lenses, gold bridge, a dark leather strap around the helmet behind them with a gold buckle on the right
    const st=wmesh(new T.TorusGeometry(.338,.022,10,72),'#4a2410',L);st.rotation.x=Math.PI/2;st.position.y=.07;st.scale.set(1,1,1);g.add(st);const bk=wmesh(new T.BoxGeometry(.05,.04,.02),'#e0a93a',GOLD);face(bk,.3,.07,.17);g.add(bk);
    const GL=Object.assign({},GOLD,{metalness:.7,roughness:.2,emissive:'#8a5a10',emissiveIntensity:.18});for(const sx of[-1,1]){const gg=new T.Group();face(gg,sx*.1,.06,.33,.0);gg.rotateX(-.2);g.add(gg);const rm=wmesh(new T.TorusGeometry(.082,.024,14,40),'#e8b23c',GL);gg.add(rm);
      const ln=wmesh(new T.SphereGeometry(.078,28,18),'#16141c',{roughness:.05,clearcoat:1,metalness:.15,envMapIntensity:.9});ln.scale.z=.4;gg.add(ln);const hl=wmesh(new T.SphereGeometry(.012,12,8),'#dfe4f0',{roughness:.3,emissive:'#6a7090',emissiveIntensity:.25});hl.scale.z=.2;hl.position.set(-.03,.04,.034);gg.add(hl)}
    const br=wmesh(new T.CapsuleGeometry(.014,.03,4,10),'#e8b23c',GL);br.rotation.z=Math.PI/2;br.position.set(0,.085,.33);g.add(br)},
  h_desert(P,g){const T=P.T,o={roughness:.55,clearcoat:.12,clearcoatRoughness:.4,sheen:0,envMapIntensity:.2};// drawing's silk: red #dc1b2a, yellow #eea11a, green #037933, blue #0a3c94 (sampled), red oval gem in gold, white feather
    // fold map per colour: soft diagonal fold shadows across the band (torus u = along the band), lit on top, dark under
    const fold=(k,C,e,ei=.18,fa=.2)=>{const m=wm('#ffffff',Object.assign({map:canvasTex('turb5'+k,1024,128,(c,w,h)=>{c.fillStyle=C;c.fillRect(0,0,w,h);for(let i=0;i<22;i++){const x=i/22*w;const gr=c.createLinearGradient(x,0,x+w/22,0);gr.addColorStop(0,KA(.0));gr.addColorStop(.4,KA(fa));gr.addColorStop(.6,WA(.05));gr.addColorStop(1,KA(0));c.fillStyle=gr;c.fillRect(x,0,w/22+1,h)}
      const gv=c.createLinearGradient(0,0,0,h);for(const[p,q]of[[0,KA(.35)],[.3,KA(0)],[.5,WA(.08)],[.75,KA(0)],[1,KA(.35)]])gv.addColorStop(p,q);c.fillStyle=gv;c.fillRect(0,0,w,h);const gu=c.createLinearGradient(0,0,w,0);for(const[p,q]of[[0,WA(.06)],[.15,WA(0)],[.4,KA(.22)],[.6,KA(.06)],[.85,WA(.1)],[1,WA(.06)]])gu.addColorStop(p,q);c.fillStyle=gu;c.fillRect(0,0,w,h)}),emissive:e,emissiveIntensity:ei},o));return m};
    const RD='#dc1626',YL='#ffc233',GN='#0e9238',BL='#1a48c0';
    // red crown: a fat dome of folds; then four flat wide wraps (oblate tori, 40% overlap, tilted +-.2 and rolled +-.18 so they cross diagonally in front) blue (bottom) / green / yellow / red
    const dome=wmesh(new T.SphereGeometry(.27,48,24,0,Math.PI*2,0,Math.PI*.55),fold('R',RD,'#7a0010'));dome.position.y=.1;dome.scale.y=.85;g.add(dome);
    [[BL,'#0a2a90',.0,.1,-.18,.3],[GN,'#065a20',.062,.1,.18,.285],[YL,'#e08a00',.124,.1,-.18,.265],[RD,'#a00018',.186,.1,.18,.245]].forEach(([C,e,y,tb,rz,R],i)=>{const t=wmesh(new T.TorusGeometry(R,tb,18,72),fold(['B','G','Y','R2'][i],C,e,i===2?.3:.18,i===2?.1:.2));t.rotation.x=Math.PI/2+(i%2?.2:-.2);t.rotation.z=rz;t.scale.set(1,1,.55);t.position.y=y;g.add(t)});
    // oval red gem in a gold bezel on the yellow band, white feather rising out of it and curving back
    const gm=wmesh(new T.IcosahedronGeometry(.068,0),'#e0102a',{roughness:.06,clearcoat:1,clearcoatRoughness:.05,flatShading:true,emissive:'#ff2030',emissiveIntensity:.35,envMapIntensity:.5});gm.scale.set(.85,1.15,.5);face(gm,0,.15,.35);g.add(gm);
    const set=wmesh(new T.TorusGeometry(.072,.015,10,28),'#f1b630',Object.assign({},GOLD,{emissive:'#8a5a10',emissiveIntensity:.15}));set.scale.set(.9,1.2,1);face(set,0,.15,.34);g.add(set);
    const ftx=canvasTex('turbFeather1',128,512,(c,w,h)=>{c.fillStyle='#f6efe2';c.fillRect(0,0,w,h);let sd=4;const Rn=()=>(sd=(sd*16807)%2147483647)/2147483647;for(let i=0;i<500;i++){const x=Rn()*w,y=Rn()*h,sx=x<w/2?-1:1;c.strokeStyle=Rn()<.5?KA(.07):WA(.3);c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x+sx*10,y+5);c.stroke()}
      const gu=c.createLinearGradient(0,0,w,0);gu.addColorStop(0,KA(.16));gu.addColorStop(.3,KA(0));gu.addColorStop(.7,KA(0));gu.addColorStop(1,KA(.16));c.fillStyle=gu;c.fillRect(0,0,w,h);const q=c.createLinearGradient(w*.46,0,w*.54,0);q.addColorStop(0,KA(0));q.addColorStop(.5,'rgba(200,170,120,.45)');q.addColorStop(1,KA(0));c.fillStyle=q;c.fillRect(w*.46,0,w*.08,h)});
    ftx.repeat.set(1/.12,1/.32);ftx.offset.set(.5,0);const fe=wmesh(featherGeo(T),wm('#ffffff',{map:ftx,roughness:.6,sheen:.6,sheenColor:new T.Color('#ffffff'),envMapIntensity:.35,emissive:'#ffffff',emissiveIntensity:.1,side:T.DoubleSide}));fe.scale.set(1.6,1.55,1.3);fe.position.set(0,.22,.3);fe.rotation.set(-.35,0,.1);g.add(fe);
    // red tail: a strip of silk hanging from the back right, lying along the head (onHead), waving a little
    const tl=shell(12,24,(u,v)=>{const q=u*2-1,an=Math.PI*.5+q*.18*(1-.25*v)+.1*v,y=.0-.3*v,off=.012+.01*Math.sin(v*Math.PI*2.2);return onHead(an,y,off)},-.02);/* th<0: the strip's thickness goes outward from the head */const tm=fold('T',RD,'#7a0010');g.add(wmesh(tl,tm))},
  h_candy(P,g){const T=P.T,R=.26,PK='#fc8fb8',pk=a=>Math.pow((Math.cos(5*a)+1)/2,2.2),hh=a=>.1+.07*pk(a)+.16*Math.pow(Math.max(0,Math.cos(a)),14),F={roughness:.25,clearcoat:.8,clearcoatRoughness:.1,envMapIntensity:.3,emissive:'#ff5a9a',emissiveIntensity:.2};// drawing's frosting #f6a5cc / shade #ec91af / drips #fecbe3, beans red #e90f1c green #0f9b12 yellow #fce00d purple orange #f97d00
    // frosting wall: 5 soft peaks, the front one a tall cone with an orange ball; painted roots-dark / lit top
    const ftx=canvasTex('candyFrost3',512,128,(c,w,h)=>{c.fillStyle=PK;c.fillRect(0,0,w,h);bakeLight(c,w,h,{gv:[[0,'rgba(170,40,90,.3)'],[.3,KA(0)],[1,WA(.16)]],gu:[[0,WA(.1)],[.15,WA(0)],[.4,'rgba(170,40,90,.2)'],[.6,KA(.04)],[.85,WA(.18)],[1,WA(.1)]]})});
    g.add(dmesh(shell(150,12,(u,v)=>{const a=u*Math.PI*2,y=v*hh(a),r=R+.02*Math.min(1,y/.12)*(1-v*.3)+.006*Math.sin(a*30)*v*(1-v)-.01*Math.pow(v,6);return [Math.sin(a)*r,y,Math.cos(a)*r]},.05),wm('#ffffff',Object.assign({map:ftx},F))));// .05 thick cake band, rim rolling inward at the top
    const ob=wmesh(new T.SphereGeometry(.04,16,12),'#f97d00',Object.assign({},F,{emissive:'#f05000',emissiveIntensity:.15}));ob.position.set(0,hh(0)+.02,R+.01);g.add(ob);
    // drip skirt: a scalloped frosting sheet running over the bottom edge down the head, 11 fat drips of different lengths, kept just outside the head (bodyR) so it never sinks in; lighter pink, rounded ends
    const hr=y=>bodyR(Math.min(.999,(.66+y)/.75));g.add(dmesh(shell(220,12,(u,v)=>{const a=u*Math.PI*2,b=(Math.cos(a*9+.6)+1)/2,d=.012+.075*Math.pow(b,1.6)*(1+.3*Math.sin(a*3)),y=.03-Math.sin(v*Math.PI/2)*(.03+d),r=Math.max(R+.03,hr(y)+.016)+.008*Math.pow(b,3)*Math.sin(v*Math.PI)+.014*Math.pow(b,2)*Math.pow(v,3);return [Math.sin(a)*r,y,Math.cos(a)*r]},.035),'#fcc4e0',Object.assign({},F,{emissive:'#ffb3d6',emissiveIntensity:.3})));// Lead r1: 9 fat rounded tongues with a bulb at the end, the lightest pink of the hat
    // big glossy jelly beans lying on the wall and the top edge
    const bc=['#e90f1c','#0f9b12','#fce00d','#8a3ad8','#f97d00','#2a8ee8','#fd8db7'],BM=c=>({roughness:.12,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:.6,emissive:c,emissiveIntensity:.1});
    for(let i=0;i<13;i++){const a=i/13*Math.PI*2+.25,c=bc[i%7],b=wmesh(new T.CapsuleGeometry(.03,.045,6,14),c,BM(c)),y=.045+(i%3)*.03;face(b,Math.sin(a)*(R+.035),y,Math.cos(a)*(R+.035));b.rotateZ(i*.95);b.rotateX(Math.PI/2+.3);g.add(b)}
    for(let i=0;i<5;i++){const a=(i+.5)/5*Math.PI*2,c=bc[(i+3)%7],b=wmesh(new T.CapsuleGeometry(.03,.04,6,14),c,BM(c));b.position.set(Math.sin(a)*(R-.01),hh(a)+.02,Math.cos(a)*(R-.01));b.rotation.set(.4,a,.9);g.add(b)}
    // two big swirl lollipops on beige sticks, leaning outward
    const sw=(n,c1,c2)=>canvasTex(n,256,256,(c,w,h)=>{c.fillStyle=c1;c.fillRect(0,0,w,h);c.strokeStyle=c2;c.lineWidth=20;c.lineCap='round';c.beginPath();for(let k=0;k<400;k++){const t=k/400*Math.PI*8,r=t/(Math.PI*8)*w*.47;c.lineTo(w/2+Math.cos(t)*r,h/2+Math.sin(t)*r)}c.stroke();const gr=c.createRadialGradient(w*.38,h*.35,4,w/2,h/2,w*.5);gr.addColorStop(0,WA(.3));gr.addColorStop(.5,WA(0));gr.addColorStop(1,KA(.18));c.fillStyle=gr;c.fillRect(0,0,w,h)});
    [[-.17,.02,'lolR2','#ffffff','#e3242f',.25],[.19,.0,'lolB2','#ffffff','#2f9ae1',-.2]].forEach(([x,z,n,c1,c2,rz])=>{const s=wmesh(new T.CylinderGeometry(.009,.009,.26,10),'#efdcc2',{roughness:.5});s.position.set(x,.2,z);s.rotation.z=rz;g.add(s);
      const dk=new T.Mesh(new T.CylinderGeometry(.09,.09,.03,40),[wm('#ffffff',{roughness:.2,clearcoat:1}),wm('#ffffff',{map:sw(n,c1,c2),roughness:.15,clearcoat:1,envMapIntensity:.5}),wm('#ffffff',{map:sw(n,c1,c2),roughness:.15,clearcoat:1,envMapIntensity:.5})]);dk.rotation.x=Math.PI/2;dk.position.set(x-Math.sin(rz)*.13,.2+Math.cos(rz)*.13+.08,z);dk.rotation.z=rz;g.add(dk)})},
  h_snow(P,g){const T=P.T;// drawing: white long fur (#d2c7c8 roots / #f3f1f3 tips), two faceted blue crystal horns (#36b8f8 / #8ec7fc)
    const fm=wm('#ffffff',{map:furPaint2('snowfur2','#f4f2f4',null,{ao:0,stroke:[.08,.12],gv:[[0,'rgba(150,140,150,.45)'],[.35,KA(0)],[1,WA(.3)]],keyStops:[[0,WA(.1)],[.15,WA(0)],[.4,'rgba(120,110,130,.18)'],[.6,KA(.03)],[.85,WA(.22)],[1,WA(.1)]]}),emissive:'#ffffff',emissiveIntensity:.5,roughness:.95,clearcoat:0,sheen:.2,sheenRoughness:.5,sheenColor:new T.Color('#eef2ff')});fm.emissiveMap=fm.map;
    // fur dome: a squashed hemisphere down to the ears, 22 shells of long hair
    const dg=new T.SphereGeometry(.34,48,28,0,Math.PI*2,0,Math.PI*.52);dg.scale(1,.82,1);dg.translate(0,-.06,0);{const p=dg.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),rr=Math.hypot(x,z);if(rr>.1){const Rm=bodyR(Math.min(.999,(.66+y)/.75))+.02;if(rr<Rm){p.setX(i,x*Rm/rr);p.setZ(i,z*Rm/rr)}}}}/* Lead r1: dome clamped outside the head so the fur has a lower edge all round */const fur=furShells(dg,fm,{len:.06,rep:[5,2.5],layers:24,ramp:[.9,.18],at:[.05,.5],hair:'hairD',sheenI:.2,mat:{emissive:new T.Color('#ffffff'),emissiveIntensity:.35,emissiveMap:fm.map}});/* shells self-lit too so the hair tips at the silhouette stay white, not dark specks */g.add(fur);
    // crystal horns: faceted taper (6 sides, jittered rings), curving up and out, roots buried in the fur
    for(const sx of[-1,1]){const h=taper(T,[new T.Vector3(sx*.2,.0,0),new T.Vector3(sx*.33,.17,0),new T.Vector3(sx*.38,.33,0),new T.Vector3(sx*.3,.5,.0)],.15,.015,10,8);const p=h.g.attributes.position;let sd=sx>0?3:7;const Rn=()=>(sd=(sd*16807)%2147483647)/2147483647;let k=1;for(let i=0;i<p.count;i++){if(i%9===0)k=1+(Rn()-.5)*.03;p.setX(i,p.getX(i)*k);p.setZ(i,p.getZ(i)*k)}h.g.computeVertexNormals();// fat crystal cones, tips curling inward; jitter per ring so facets stay planar
      const m=wmesh(h.g,new T.MeshPhysicalMaterial({color:'#33a4f6',roughness:.1,metalness:0,clearcoat:1,clearcoatRoughness:.05,emissive:'#1a80f0',emissiveIntensity:.4,flatShading:true,envMapIntensity:B3OPT.env*.7}));g.add(m)}},
  h_volcano(P,g){const T=P.T,R=.26;// drawing: dark faceted rocks (#2a2424 / lit #604e4f) on a glowing lava bed (#f3690e), tall flames orange #fe8b20 with yellow cores #fde238
    const RK={roughness:.85,clearcoat:0,flatShading:true,envMapIntensity:.12,emissive:'#ff5a10',emissiveIntensity:.02};// Lead r1: lighter rocks with lava bounce, no magenta env
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2,k=1+.25*Math.cos(a),r=wmesh(new T.DodecahedronGeometry(.075*k+(i%3)*.012,0),i%2?'#3e3436':'#5c4c4e',RK);r.scale.set(.85,1.35+(i%2)*.45,.85);face(r,Math.sin(a)*R,.06+(i%2)*.025,Math.cos(a)*R);r.rotateZ(i*1.3);r.rotateX(.25);g.add(r)}
    const lv=wmesh(new T.TorusGeometry(R,.06,8,48),'#ff6a10',{emissive:'#ff5000',emissiveIntensity:1.4,roughness:.6,envMapIntensity:0});lv.rotation.x=Math.PI/2;lv.position.y=.06;g.add(lv);// lava bed raised so it glows through the cracks between the rocks
    // flame map (lathe v = height): yellow core at the root, orange body, deeper orange-red tip; self-lit
    const ftx=canvasTex('flame3',64,256,(c,w,h)=>{const gr=c.createLinearGradient(0,h,0,0);gr.addColorStop(0,'#fde238');gr.addColorStop(.25,'#fda818');gr.addColorStop(.55,'#fe7e14');gr.addColorStop(1,'#f0500a');c.fillStyle=gr;c.fillRect(0,0,w,h)});
    const FM=wm('#ffffff',{map:ftx,emissive:'#ffffff',emissiveIntensity:.95,roughness:.6,clearcoat:0,envMapIntensity:0});FM.emissiveMap=ftx;const YM=wm('#ffffff',{map:canvasTex('flameY2',16,64,(c,w,h)=>{const gr=c.createLinearGradient(0,h,0,0);gr.addColorStop(0,'#fff6a0');gr.addColorStop(.5,'#fde238');gr.addColorStop(1,'#fdb21c');c.fillStyle=gr;c.fillRect(0,0,w,h)}),emissive:'#ffffff',emissiveIntensity:.9,roughness:.6,envMapIntensity:0});YM.emissiveMap=YM.map;
    const fl=(h,r,s)=>{const pts=[];for(let k=0;k<=24;k++){const t=k/24;pts.push(V2(Math.max(.001,r*Math.sin(Math.min(1,t*2.4)*Math.PI/2)*(1-Math.pow(t,1.5))),t*h))}const ge=new T.LatheGeometry(pts,18),p=ge.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i)/h;p.setX(i,p.getX(i)+Math.sin(y*4+s)*.08*y*y);p.setZ(i,p.getZ(i)+Math.cos(y*3+s)*.02*y*y)}ge.computeVertexNormals();return ge};
    // 12 wavy tongues around the ring, each a main flame with a bent tip plus a short side lobe peeling off outward, and a yellow core
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2,sg=i%2?1:-1,h=.3+.3*((i*7)%4)/3+.08*(1-Math.cos(a))/2,f=wmesh(fl(h,.1,i),FM);f.position.set(Math.sin(a)*(R-.03),.05,Math.cos(a)*(R-.03));f.rotation.y=a;f.rotation.z=.25*sg;g.add(f);
      const lb=wmesh(fl(h*.5,.07,i+5),FM);lb.position.copy(f.position);lb.rotation.y=a+.5*sg;lb.rotateX(-.35);g.add(lb);
      const y=wmesh(fl(h*.6,.06,i+2),YM);y.position.set(Math.sin(a)*(R-.02),.06,Math.cos(a)*(R-.02));y.rotation.y=a;g.add(y)}}  ,
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
    const W=a=>`rgba(255,255,255,${a})`;let furM=(sx)=>wm('#ffffff',{map:furPaint2('cat8'+(sx<0?'L':'R'),'#cdcdd6','#50505a',{angle:-28*-sx,ry:19,rx:.86,sa:[.25,.5,.95],at:[.22,.5,.78],stroke:[.10,.14],front:'#f0a8be',frontV:.82,frontU:[.075,.115],ao:.12,gv:[[0,'rgba(20,10,30,.16)'],[.25,'rgba(20,10,30,0)'],[1,W(.45)]],keyStops:[[0,W(.18)],[.15,W(0)],[.4,W(0)],[.6,W(0)],[.85,W(.32)],[1,W(.18)]]}),roughness:.95,clearcoat:0,sheen:.3,sheenRoughness:.5,sheenColor:new T.Color('#e8e8f0')});const fm=furM;furM=(sx)=>{const m=fm(sx);m.emissive=new T.Color('#ffffff');m.emissiveMap=m.map;m.emissiveIntensity=.45;return m};
    const SH={ramp:[.88,.2],at:[.05,.55],hair:'hairD',sheenI:.3};
    // furShells length mask over the pink footprint (lathe-local x,y,z BEFORE the group's scale.z; cy = pink centre y .112 in ear-group space minus the lathe offset .13; same footprint as earDish/pp): k=.25 on the floor and the wall (q<.6), ramps to 1 at the rim (q=1), 1 elsewhere / on the back face
    const dishQ=(x,y,z,cy=.112-.13)=>{if(z<=0)return 9;const t=(y-cy+.1)/.2;if(t<=0||t>=1)return 9;return Math.abs(x)/(.09*Math.pow(1-t,.6)*(1+.5*Math.sin(t*Math.PI)))},dishMask=(x,y,z)=>{const q=dishQ(x,y,z);return q<.6?.25:q<1?.25+.75*(q-.6)/.4:1};
    // pink inner map per side: flat matte #ff98b6, slightly darker base, ONE thin crease line at the lathe's sides (where pink meets fur), soft contact shadow under the tuft; no hot spot (the rim light is the only highlight)
    const pinkM=(sx)=>{const m=wm('#8c8c8c',{map:canvasTex('earpink8'+(sx<0?'L':'R'),128,256,(c,w,h)=>{const gr=c.createLinearGradient(0,h,0,0);gr.addColorStop(0,'#e0708e');gr.addColorStop(.3,'#ff98b6');gr.addColorStop(1,'#ffa8c0');c.fillStyle=gr;c.fillRect(0,0,w,h);
      const ox=(sx<0?.75:.25)*w,ov=c.createRadialGradient(ox,h*.12,2,ox,h*.12,w*.7);ov.addColorStop(0,'rgba(120,40,60,.15)');ov.addColorStop(1,'rgba(120,40,60,0)');c.fillStyle=ov;c.fillRect(0,0,w,h);
      for(let x=0;x<w;x++){const e=Math.abs(Math.sin(x/w*Math.PI*2)),d=Math.max(0,(e-.3)/.7);c.fillStyle=`rgba(120,40,60,${(d*d*.5).toFixed(3)})`;c.fillRect(x,0,1,h)}
      const ux=(sx<0?.12:.88)*w;for(const X of[ux-w,ux,ux+w]){const g4=c.createRadialGradient(X,h*.78,2,X,h*.78,w*.30);g4.addColorStop(0,'rgba(70,15,35,.4)');g4.addColorStop(1,'rgba(70,15,35,0)');c.fillStyle=g4;c.fillRect(0,0,w,h)}}),roughness:.95,clearcoat:0,clearcoatRoughness:1,sheen:0,specularIntensity:0,envMapIntensity:.2,emissive:'#ffffff',emissiveIntensity:.55});m.emissiveMap=m.map;return m};
    // white tuft: white with a faint root tint only, no stripes/key light, slight white emissive so the shadow side stays white
    const tuftM=wm('#ffffff',{map:furPaint2('tuft3','#ffffff',null,{gv:[[0,'rgba(200,200,210,.25)'],[.3,'rgba(0,0,0,0)'],[1,'rgba(255,255,255,.3)']],key:false}),emissive:'#ffffff',emissiveIntensity:.15,roughness:.85,sheen:0});
    const ear=(sx)=>{const e=new T.Group(),y=.03,x=sx*(bodyR((.66+y)/.75)+.01),by=bandY(x),sl=(bandY(x+.02)-bandY(x-.02))/.04;e.position.set(x,by+.02,-.01);e.rotation.z=Math.atan(sl)-sx*.1;e.rotation.y=-sx*.55;g.add(e);e.updateMatrix();
      const mk=(R,H,zs,seg)=>earDish(earBend(new T.LatheGeometry(earLp(R,H),seg),H,e.matrix.clone().multiply(new T.Matrix4().compose(new T.Vector3(0,.13,0),new T.Quaternion(),new T.Vector3(1,1,zs)))),dishQ,.10,y=>{const t=(y+.018+.1)/.2;return t>.8?Math.max(0,(1-t)/.2):1});
      const o=furShells(mk(.195,.33,.45,56),furM(sx),Object.assign({len:.04,rep:[3,2.5],layers:15,mask:dishMask},SH));o.scale.z=.45;o.position.y=.13;e.add(o);
      const rim=furShells(mk(.195*1.05,.33*1.04,.1,48),furM(sx),Object.assign({len:.035,rep:[2.5,2.5],layers:3,up:[sx*.3,1,0]},SH,{ramp:[.95,.15]}));rim.scale.z=.1;rim.position.y=.13;e.add(rim);
      // pink: thin plate on the recess floor (~.04 behind the fur rim's hair tips), its outer ring hidden under the recess wall
      const i=wmesh((g=>{g.computeVertexNormals();return g})(new T.LatheGeometry(catLp(.09,.2,.6,.5),64)),pinkM(sx));i.scale.z=.07;i.position.set(0,.112,.053);i.rotation.x=-.08;e.add(i);
      // white tuft: ONE brush rooted on the recess floor at the pink's lower inner corner, tipping forward/inward out of the hollow over the pink
      const tuft=furShells(furGeo(new T.ConeGeometry(.035,.17,20,8),.008,140),tuftM,{len:.06,rep:[1,1],layers:7,up:[-sx*.15,1,.3],ramp:[1,.1],at:[.04,.4],hair:'hairD',sheenI:0});tuft.scale.z=.3;tuft.position.set(-sx*.035,.045,.058);tuft.rotation.z=sx*.35;tuft.rotation.x=-.25;e.add(tuft);return e};
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
  h_snowN(P,g){const T=P.T,W=a=>`rgba(255,255,255,${a})`,SH={ramp:[.88,.2],at:[.05,.55],hair:'hairD',sheenI:.3},FM={roughness:.95,clearcoat:0,sheen:.3,sheenRoughness:.5,sheenColor:new T.Color('#eef2ff')};
    const DR=.37,DY=-.13,SX=1.06,SY=.95;
    // hood dome map (sphere uv: u .25 = front, v 1 = top): white combed fur, blue lining showing in the arched face opening at the front bottom, AO at the opening edge, roots dark at the rim, key light left; the same ellipse tests drive the hair mask (short hairs over the lining and under the eye plates)
    const OP=(u,v)=>{const a=(u-.25)/.135,b=v/.3;return a*a+b*b},EY=(u,v)=>{const a=(Math.abs(u-.25)-.045)/.055,b=(v-.46)/.15;return a*a+b*b},xr=y=>bodyR(Math.min(.999,(.66+y)/.75));
    const domeTex=canvasTex('wolfdome1',1024,512,(c,w,h)=>{c.fillStyle='#f8f9fe';c.fillRect(0,0,w,h);let s=11;const R=()=>(s=(s*16807)%2147483647)/2147483647;
      for(let i=0;i<9000;i++){const x=R()*w,y=R()*h,l=8+R()*16,d=R()<.5;c.strokeStyle=d?'rgba(90,110,150,.10)':W(.2);c.lineWidth=1+R();c.beginPath();c.moveTo(x,y);c.lineTo(x+(R()-.5)*4,y-l);c.stroke()}
      const gv=c.createLinearGradient(0,h,0,0);gv.addColorStop(0,'rgba(50,60,100,.3)');gv.addColorStop(.3,'rgba(0,0,0,0)');gv.addColorStop(1,W(.3));c.fillStyle=gv;c.fillRect(0,0,w,h);
      const gu=c.createLinearGradient(0,0,w,0);for(const[p,q]of[[0,W(.1)],[.1,W(.28)],[.25,W(0)],[.42,'rgba(0,0,0,.14)'],[.6,'rgba(0,0,0,.05)'],[.8,W(.1)],[1,W(.1)]])gu.addColorStop(p,q);c.fillStyle=gu;c.fillRect(0,0,w,h);
      // the face opening: blue lining with a lighter top-left and a dark edge, then a soft AO ring outside it
      const im=c.getImageData(0,0,w,h),d=im.data;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const u=x/w,v=1-y/h,q=OP(u,v),k=(y*w+x)*4;if(q<1.1){const t=Math.min(1,Math.max(0,(1.1-q)/.16)),bl=[70+40*(1-q)*(u<.25?1:.4),140+40*(1-q),235],ed=q>.8?(q-.8)/.3:0;for(let j=0;j<3;j++)d[k+j]=d[k+j]*(1-t)+t*bl[j]*(1-.35*ed)}else if(q<1.6){const t=1-(q-1.1)/.5;for(let j=0;j<3;j++)d[k+j]*=1-.22*t}}c.putImageData(im,0,0)});
    const domeM=wm('#ffffff',Object.assign({map:domeTex,emissive:'#ffffff',emissiveMap:domeTex,emissiveIntensity:.42},FM));
    const dm=new T.SphereGeometry(DR,96,48,0,Math.PI*2,0,Math.PI*.5);dm.scale(SX,SY,1);const hm=furShells(dm,domeM,Object.assign({len:.06,rep:[9,4],layers:14,mat:{side:T.DoubleSide},mask:(x,y,z,u,v)=>{const q=OP(u,v),e=EY(u,v);return q<1?.1:e<.7?.12:e<1?.12+.88*(e-.7)/.3:q<1.4?.1+.9*(q-1)/.4:1}},SH));hm.position.y=DY;g.add(hm);
    const rr=(th)=>[Math.sin(th)*DR*SX,DY+Math.cos(th)*DR*SY,Math.sin(th)*DR];// dome surface point at polar angle th (front)
    // white fur rim at the bottom edge
    const rim=furShells(new T.TorusGeometry(DR*1.02,.05,20,120),wm('#ffffff',Object.assign({emissive:'#ffffff',emissiveIntensity:.3},FM)),Object.assign({len:.035,rep:[12,2],layers:8},SH));rim.scale.x=SX;rim.rotation.x=Math.PI/2;rim.position.y=DY+.025;g.add(rim);
    // side cheeks of the hood coming down beside the face, charms hanging from their ends
    for(const sx of[-1,1]){const fl=furShells(new T.CapsuleGeometry(.055,.11,8,20),wm('#ffffff',Object.assign({emissive:'#ffffff',emissiveIntensity:.25},FM)),Object.assign({len:.035,rep:[2,2],layers:8,up:[0,-1,0]},SH));fl.scale.z=.7;fl.position.set(sx*(xr(-.22)+.04),-.22,.05);fl.rotation.z=sx*.12;g.add(fl);
      // cord from the cheek's lower front corner: loop, links every .017, big faceted gem in a gold diamond bezel, pompom
      const cz=.14,ax=y=>sx*(xr(y)+.02),lp=wmesh(new T.TorusGeometry(.014,.004,6,16),'#f1b630',GOLD);lp.position.set(ax(-.29),-.29,cz);lp.rotation.y=Math.PI/2;g.add(lp);for(let k=0;k<4;k++){const y=-.30-k*.017,l=wmesh(new T.TorusGeometry(.009,.003,6,12),'#f1b630',GOLD);l.position.set(ax(y),y,cz);l.rotation.y=k%2?Math.PI/2:0;g.add(l)}
      const gm=wmesh(new T.OctahedronGeometry(.06,0),'#3aa0ff',{roughness:.05,clearcoat:1,flatShading:true,emissive:'#2a80ff',emissiveIntensity:.35});gm.scale.set(.7,1.3,.5);gm.position.set(ax(-.43),-.43,cz+.01);g.add(gm);const bz=wmesh(new T.TorusGeometry(.048,.009,6,4),'#ffd66a',GOLD);bz.scale.set(.85,1.5,1);bz.position.set(ax(-.43),-.43,cz+.01);g.add(bz);
      const pm=furShells(new T.SphereGeometry(.065,20,14),wm('#ffffff',Object.assign({emissive:'#ffffff',emissiveIntensity:.3},FM)),Object.assign({len:.03,rep:[1.5,1.5],layers:6},SH));pm.position.set(ax(-.55),-.55,cz+.01);g.add(pm)}
    // wolf ears: earLp pointed lathe, recessed blue inner (earDish + hair mask), blue matte plate on the recess floor, bases buried in the dome fur
    const furM=(sx)=>{const m=wm('#ffffff',Object.assign({map:furPaint2('wolfear2'+(sx<0?'L':'R'),'#f6f8fe','#ffffff',{sa:[0,0,0],stroke:[.08,.12],front:'#a8caf4',frontV:.82,frontU:[.075,.115],ao:.12,gv:[[0,'rgba(40,50,90,.2)'],[.3,'rgba(0,0,0,0)'],[.62,'rgba(63,134,232,0)'],[.78,'rgba(63,134,232,.95)'],[1,'rgba(40,96,210,1)']],keyStops:[[0,W(.14)],[.15,W(0)],[.4,'rgba(0,0,0,.08)'],[.6,W(0)],[.85,W(.28)],[1,W(.14)]]}),emissive:'#ffffff',emissiveIntensity:.42},FM));m.emissiveMap=m.map;return m};
    const Y0=-.02,pr=t=>.075*Math.pow(1-t,.6)*(1+.5*Math.sin(t*Math.PI)),dishQ=(x,y,z)=>{if(z<=0)return 9;const t=(y-Y0+.13)/.26;if(t<=0||t>=1)return 9;return Math.abs(x)/pr(t)},dishMask=(x,y,z)=>{const q=dishQ(x,y,z);return q<.6?.35:q<1?.35+.65*(q-.6)/.4:1},dt=y=>{const t=(y-Y0+.13)/.26;return t>.8?Math.max(0,(1-t)/.2):1};
    const blueM=(sx)=>{const m=wm('#8c8c8c',{map:canvasTex('wolfblue2'+(sx<0?'L':'R'),128,256,(c,w,h)=>{const gr=c.createLinearGradient(0,h,0,0);gr.addColorStop(0,'#2c62c4');gr.addColorStop(.35,'#3f8ae8');gr.addColorStop(1,'#6fb0f4');c.fillStyle=gr;c.fillRect(0,0,w,h);
      // soft edge: the plate darkens into the recess wall toward the lathe's sides (u .25 / .75) instead of ending on a crisp line
      for(let x=0;x<w;x++){const e=Math.abs(Math.sin(x/w*Math.PI*2)),d=Math.min(1,Math.max(0,(e-.6)/.4)),sm=d*d*(3-2*d);c.fillStyle=`rgba(40,60,120,${(sm*.35).toFixed(3)})`;c.fillRect(x,0,1,h)}}),roughness:.95,clearcoat:0,sheen:0,specularIntensity:0,envMapIntensity:.2,emissive:'#ffffff',emissiveIntensity:.5});m.emissiveMap=m.map;return m};
    for(const sx of[-1,1]){const e=new T.Group(),ER=.15,EH=.42,ZS=.5;e.position.set(sx*.2,.12,-.02);e.rotation.z=-sx*.2;e.rotation.y=-sx*.3;g.add(e);
      const mk=(r,h,seg)=>earDish(new T.LatheGeometry(earLp(r,h),seg),dishQ,.10,dt);
      const o=furShells(mk(ER,EH,56),furM(sx),Object.assign({len:.04,rep:[3,2.5],layers:9,mask:dishMask},SH));o.scale.z=ZS;o.position.y=EH/2;e.add(o);
      const rim2=furShells(mk(ER*1.05,EH*1.04,48),furM(sx),Object.assign({len:.035,rep:[2.5,2.5],layers:3,up:[sx*.3,1,0]},SH,{ramp:[.95,.15]}));rim2.scale.z=.1;rim2.position.y=EH/2;e.add(rim2);
      const i=wmesh((q=>{q.computeVertexNormals();return q})(new T.LatheGeometry(catLp(.06,.18,.6,.5),64)),blueM(sx));i.scale.z=.07;i.position.set(0,EH/2+Y0,.045);i.rotation.x=-.08;e.add(i)}
    // eyes: big round blue eyes (white rim, radial iris, round pupil, two highlights, one gold tick at the outer corner) on thin sphere patches hugging the dome front; left eye = the right patch mirrored
    const eyeTex=canvasTex('wolfeye3',256,256,(c,w,h)=>{c.clearRect(0,0,w,h);c.fillStyle='#eef4ff';c.beginPath();c.arc(.5*w,.5*h,.44*h,0,7);c.fill();const ir=c.createRadialGradient(.5*w,.5*h,2,.5*w,.5*h,.36*h);ir.addColorStop(0,'#8fd8ff');ir.addColorStop(.6,'#2f8ff0');ir.addColorStop(1,'#1a4fb0');c.fillStyle=ir;c.beginPath();c.arc(.5*w,.5*h,.36*h,0,7);c.fill();c.strokeStyle='#14244a';c.lineWidth=3;c.stroke();
      c.fillStyle='#07122e';c.beginPath();c.arc(.5*w,.5*h,.17*h,0,7);c.fill();c.fillStyle='rgba(255,255,255,.95)';c.beginPath();c.ellipse(.4*w,.36*h,.1*h,.085*h,0,0,7);c.fill();c.beginPath();c.arc(.6*w,.62*h,.04*h,0,7);c.fill();
      c.strokeStyle='#f1b630';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(.84*w,.3*h);c.lineTo(.98*w,.16*h);c.stroke()});
    const eyeM=wm('#ffffff',{map:eyeTex,transparent:true,alphaTest:.3,roughness:.5,clearcoat:.4,emissive:'#ffffff',emissiveMap:eyeTex,emissiveIntensity:.35});
    const eg=new T.SphereGeometry(DR+.022,32,24,Math.PI/2+.34-.31,.5,.6,.5);eg.scale(SX,SY,1);for(const sx of[-1,1]){const ey=new T.Mesh(eg,eyeM);ey.scale.x=sx;ey.position.y=DY;g.add(ey)}
    // brow: saturated blue faceted gem in a gold bezel ABOVE the eyes, on a gold crown plate (horizontal bar + two scroll wings)
    const dg=new T.Group(),q=rr(.38);dg.position.set(0,q[1],q[2]+.03);dg.lookAt(0,q[1]+.25,q[2]+1);g.add(dg);
    const cr=wmesh(new T.IcosahedronGeometry(.06,0),'#2f7bff',{roughness:.1,clearcoat:1,emissive:'#2457ff',emissiveIntensity:.6,flatShading:true});cr.scale.set(1,1.35,.5);cr.position.z=.03;dg.add(cr);const cs=wmesh(new T.TorusGeometry(.05,.01,8,6),'#ffd66a',GOLD);cs.scale.set(1,1.35,1);cs.position.z=.027;dg.add(cs);
    const bar=wmesh(new T.CapsuleGeometry(.011,.11,4,8),'#f1b630',GOLD);bar.position.set(0,-.06,.03);bar.rotation.z=Math.PI/2;dg.add(bar);for(const sx of[-1,1]){const b=wmesh(new T.TorusGeometry(.03,.009,8,24,Math.PI*1.3),'#f1b630',GOLD);b.position.set(sx*.085,-.05,.03);b.rotation.z=sx>0?-.5:Math.PI+.5;dg.add(b)}g.position.y=.01},
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
  h_spaceN(P,g){const T=P.T,W=a=>`rgba(255,255,255,${a})`,SH={ramp:[.88,.2],at:[.05,.55],hair:'hairD',sheenI:.3};
    // smooth pale cream band (the drawing's band is plain, the fur is only on the pompoms)
    g.add(hband(T,'#f1e6d2',{roughness:.55,clearcoat:.3},.024,.03));
    // ear fur map: white, no stripes (zero-alpha bands), pink-tinted zone one hair-length around the hollow, baked light top-left
    const furM=(sx)=>{const m=wm('#ffffff',{map:furPaint2('bun9'+(sx<0?'L':'R'),'#f7f5fb','#ffffff',{sa:[0,0,0],stroke:[.07,.11],front:'#f6bccd',frontV:.93,frontU:[.055,.085],ao:.10,gv:[[0,'rgba(60,40,70,.14)'],[.2,'rgba(0,0,0,0)'],[1,W(.3)]],keyStops:[[0,W(.12)],[.15,W(0)],[.4,'rgba(0,0,0,.08)'],[.6,W(0)],[.85,W(.25)],[1,W(.12)]]}),roughness:.95,clearcoat:0,sheen:.3,sheenRoughness:.5,sheenColor:new T.Color('#f0f0ff'),emissive:'#ffffff',emissiveIntensity:.42});m.emissiveMap=m.map;return m};
    // tall oval pink footprint (lathe-local, centred on y 0, height .34, half-width .066): same function for earDish, the hair mask and the pink plate
    const pr=t=>.05*Math.pow(Math.sin(t*Math.PI),.6),dishQ=(x,y,z)=>{if(z<=0)return 9;const t=(y+.17)/.34;if(t<=0||t>=1)return 9;return Math.abs(x)/pr(t)},dishMask=(x,y,z)=>{const q=dishQ(x,y,z);return q<.6?.35:q<1?.35+.65*(q-.6)/.4:1},dt=y=>{const t=(y+.17)/.34;return t<.15?t/.15:t>.85?Math.max(0,(1-t)/.15):1};
    // pink inner plate map: flat matte pastel pink, darker toward the base, thin crease at the sides
    const pinkM=(sx)=>{const m=wm('#8c8c8c',{map:canvasTex('bunpink10'+(sx<0?'L':'R'),128,256,(c,w,h)=>{const gr=c.createLinearGradient(0,h,0,0);gr.addColorStop(0,'#f0a0b8');gr.addColorStop(.3,'#ffbccf');gr.addColorStop(1,'#ffc8d8');c.fillStyle=gr;c.fillRect(0,0,w,h);
      for(let x=0;x<w;x++){const e=Math.abs(Math.sin(x/w*Math.PI*2)),d=Math.max(0,(e-.3)/.7);c.fillStyle=`rgba(120,40,60,${(d*d*.22).toFixed(3)})`;c.fillRect(x,0,1,h)}
      const ox=(sx<0?.75:.25)*w,ov=c.createRadialGradient(ox,h*.5,2,ox,h*.5,w*.8);ov.addColorStop(0,'rgba(255,255,255,.12)');ov.addColorStop(1,'rgba(120,40,60,.1)');c.fillStyle=ov;c.fillRect(0,0,w,h)}),roughness:.95,clearcoat:0,clearcoatRoughness:1,sheen:0,specularIntensity:0,envMapIntensity:.2,emissive:'#ffffff',emissiveIntensity:.55});m.emissiveMap=m.map;return m};
    const R=.17,EH=.46,ZS=.5,YS=EH/2-.035;
    const ear=(sx)=>{const e=new T.Group(),x=sx*.125,by=bandY(x),sl=(bandY(x+.02)-bandY(x-.02))/.04;e.position.set(x,by+.02,-.01);e.rotation.z=Math.atan(sl)-sx*.14;e.rotation.y=-sx*.3;g.add(e);e.updateMatrix();
      const mk=(r,h,zs,seg)=>earDish(earBend(new T.LatheGeometry(earLp(r,h,.2,32,.85),seg),h,e.matrix.clone().multiply(new T.Matrix4().compose(new T.Vector3(0,YS,0),new T.Quaternion(),new T.Vector3(1,1,zs)))),dishQ,.10,dt);
      const o=furShells(mk(R,EH,ZS,56),furM(sx),Object.assign({len:.04,rep:[3,4],layers:15,mask:dishMask},SH));o.scale.z=ZS;o.position.y=YS;e.add(o);
      const rim=furShells(mk(R*1.05,EH*1.03,.1,48),furM(sx),Object.assign({len:.035,rep:[2.5,4],layers:3,up:[sx*.3,1,0]},SH,{ramp:[.95,.15]}));rim.scale.z=.1;rim.position.y=YS;e.add(rim);
      const pp=[];for(let k=0;k<=24;k++){const t=k/24;pp.push(V2(Math.max(.002,pr(t)),t*.34-.17))}const i=wmesh((q=>{q.computeVertexNormals();return q})(new T.LatheGeometry(pp,64)),pinkM(sx));i.scale.z=.07;i.scale.y=.9;i.position.set(0,YS,.02);i.rotation.x=-.18;e.add(i);
      // white fluff ball at the ear base in front of the band
      const pm=furShells(new T.SphereGeometry(.055,20,14),wm('#ffffff',{roughness:.9,emissive:'#ffffff',emissiveIntensity:.3}),Object.assign({len:.03,rep:[1.5,1.5],layers:7},SH));pm.position.set(sx*.2,bandY(sx*.2)+.01,.06);g.add(pm);return e};
    ear(-1);ear(1);
    // plump gold crescent (hero): a fat torus arc, tube scaled fat in the middle and thin at the tips, sitting ON the band dead centre (centre bandY+.04, just in front of the band tube) rising between the ears; bulge left, opening right, axis ~12 deg up
    const tg=new T.TorusGeometry(.11,.038,18,64,Math.PI*1.45),tp=tg.attributes.position;for(let i=0;i<tp.count;i++){const x=tp.getX(i),y=tp.getY(i),a=Math.atan2(y,x),f=((a+2*Math.PI)%(2*Math.PI))/(Math.PI*1.45),cx=.11*Math.cos(a),cy=.11*Math.sin(a),k=.4+.6*Math.sin(Math.min(1,f)*Math.PI);tp.setXYZ(i,cx+(x-cx)*k,cy+(y-cy)*k,tp.getZ(i)*k)}tg.computeVertexNormals();
    const m=wmesh(tg,wm('#f1b630',Object.assign({},GOLD,{roughness:.18,emissive:'#8a6410',emissiveIntensity:.12})));const MR=Math.PI*.45,MY=bandY(0)+.05;m.position.set(0,MY,.08);m.rotation.z=MR;g.add(m);
    // chain looped around the moon's lower tip (the arc's end at ring angle rot+1.45 PI) with a star under it; ear-base stars hanging from loops on the band
    const ta=MR+Math.PI*1.45,tx=.11*Math.cos(ta),ty=MY+.11*Math.sin(ta),lp=wmesh(new T.TorusGeometry(.016,.004,8,20),'#f1b630',GOLD);lp.position.set(tx,ty,.085);lp.rotation.x=Math.PI/2;g.add(lp);hangStar(T,g,tx,ty-.012,.03,.045,false);
    for(const sx of[-1,1])hangStar(T,g,sx*.27,bandY(sx*.27)+.004,.05,.045)},
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
  h_snowS(P,g){const T=P.T;H.pirate(P,g,{wall:'#1f2a5c',line:'#c8a24a',k:'_adm'});g.children.filter(c=>c.isGroup).forEach(c=>c.visible=false);
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
  h_clouds(P,g){const T=P.T,W=a=>`rgba(255,255,255,${a})`,SH={ramp:[.88,.2],at:[.05,.55],hair:'hairD',sheenI:.3},FM={roughness:.95,clearcoat:0,sheen:.3,sheenRoughness:.5,sheenColor:new T.Color('#f4f0ff')};
    // white fur band (self-lit base)
    {const hb=hband(T,'#f8f6fb',{roughness:.9},.03,.03),fs=furShells(hb.geometry,wm('#f8f6fb',Object.assign({emissive:'#ffffff',emissiveIntensity:.35},FM)),Object.assign({len:.04,rep:[12,1],layers:10},SH));fs.scale.z=1.5;g.add(fs)}
    // ears: white earLp lathe, recessed pink inner (earDish + hair mask), matte pink plate, bases bent into the band, turned outward
    const furM=(sx)=>{const m=wm('#ffffff',Object.assign({map:furPaint2('uniear1'+(sx<0?'L':'R'),'#f8f6fb','#ffffff',{sa:[0,0,0],stroke:[.07,.11],front:'#f6bccd',frontV:.82,frontU:[.075,.115],ao:.10,gv:[[0,'rgba(60,40,70,.16)'],[.25,'rgba(0,0,0,0)'],[1,W(.35)]],keyStops:[[0,W(.12)],[.15,W(0)],[.4,'rgba(0,0,0,.08)'],[.6,W(0)],[.85,W(.25)],[1,W(.12)]]}),emissive:'#ffffff',emissiveIntensity:.42},FM));m.emissiveMap=m.map;return m};
    const Y0=-.005,pr=t=>.06*Math.pow(1-t,.6)*(1+.5*Math.sin(t*Math.PI)),dishQ=(x,y,z)=>{if(z<=0)return 9;const t=(y-Y0+.07)/.14;if(t<=0||t>=1)return 9;return Math.abs(x)/pr(t)},dishMask=(x,y,z)=>{const q=dishQ(x,y,z);return q<.6?.35:q<1?.35+.65*(q-.6)/.4:1},dt=y=>{const t=(y-Y0+.07)/.14;return t>.8?Math.max(0,(1-t)/.2):1};
    const pinkM=(sx)=>{const m=wm('#8c8c8c',{map:canvasTex('unipink2'+(sx<0?'L':'R'),128,256,(c,w,h)=>{const gr=c.createLinearGradient(0,h,0,0);gr.addColorStop(0,'#f0a0b8');gr.addColorStop(.3,'#ffbccf');gr.addColorStop(1,'#ffc8d8');c.fillStyle=gr;c.fillRect(0,0,w,h);
      for(let x=0;x<w;x++){const e=Math.abs(Math.sin(x/w*Math.PI*2)),d=Math.max(0,(e-.3)/.7);c.fillStyle=`rgba(120,40,60,${(d*d*.22).toFixed(3)})`;c.fillRect(x,0,1,h)}}),roughness:.95,clearcoat:0,sheen:0,specularIntensity:0,envMapIntensity:.2,emissive:'#ffffff',emissiveIntensity:.55});m.emissiveMap=m.map;return m};
    const ER=.125,EH=.26,ZS=.45,YS=EH/2-.035;
    for(const sx of[-1,1]){const e=new T.Group(),x=sx*.2,by=bandY(x),sl=(bandY(x+.02)-bandY(x-.02))/.04;e.position.set(x,by+.02,-.01);e.rotation.z=Math.atan(sl)-sx*.12;e.rotation.y=-sx*.5;g.add(e);e.updateMatrix();
      const mk=(r,h,zs,seg)=>earDish(earBend(new T.LatheGeometry(earLp(r,h),seg),h,e.matrix.clone().multiply(new T.Matrix4().compose(new T.Vector3(0,YS,0),new T.Quaternion(),new T.Vector3(1,1,zs)))),dishQ,.09,dt);
      const o=furShells(mk(ER,EH,ZS,56),furM(sx),Object.assign({len:.04,rep:[3,2.5],layers:12,mask:dishMask},SH));o.scale.z=ZS;o.position.y=YS;e.add(o);
      const rim=furShells(mk(ER*1.05,EH*1.04,.1,48),furM(sx),Object.assign({len:.035,rep:[2.5,2.5],layers:3,up:[sx*.3,1,0]},SH,{ramp:[.95,.15]}));rim.scale.z=.1;rim.position.y=YS;e.add(rim);
      const pp=[];for(let k=0;k<=24;k++){const t=k/24;pp.push(V2(Math.max(.002,pr(t)),t*.14-.07))}const i=wmesh((q=>{q.computeVertexNormals();return q})(new T.LatheGeometry(pp,64)),pinkM(sx));i.scale.z=.07;i.position.set(0,YS+Y0,.018);i.rotation.x=-.1;e.add(i)}
    // pastel spiral horn (pink/lavender/blue/cream bands, iridescent) with a gold spiral ridge, standing on the band right of centre, tipped a little forward
    // pastel bands following the twist: the surf groove phase is a+v*PI*10 (5 turns), so colour by (u+v*5)%1: pink, lavender, blue, cream
    const tx=canvasTex('unihorn3',256,256,(c,w,h)=>{const im=c.createImageData(w,h),d=im.data,C=[[255,156,204],[180,156,255],[138,216,255],[255,236,190]];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const u=x/w,v=1-y/h,f=((u+v*5)%1)*4,i=Math.floor(f),t=f-i,a=C[i%4],b=C[(i+1)%4],k=(y*w+x)*4,sm=t*t*(3-2*t);for(let j=0;j<3;j++)d[k+j]=a[j]*(1-sm)+b[j]*sm;d[k+3]=255}c.putImageData(im,0,0)});
    const hg=surf(48,48,(u,v)=>{const a=u*Math.PI*2,r=.075*(1-v)*(1+.22*Math.max(0,Math.sin(a+v*Math.PI*10))),y=v*.32;return [Math.sin(a)*r,y,Math.cos(a)*r]},1);
    const HX=0,GY=bandY(0)-.005,HY=GY+.005,hm=wmesh(hg,wm('#ffffff',{map:tx,roughness:.15,clearcoat:1,iridescence:.5}));hm.position.set(HX,HY,.03);hm.rotation.set(.16,0,-.08);hm.scale.setScalar(1.55);g.add(hm);
    const sp=[];for(let k=0;k<=120;k++){const t=k/120,a=t*Math.PI*10,r=.075*(1-t)*1.22+.003;sp.push(new T.Vector3(Math.sin(a)*r,t*.32,Math.cos(a)*r))}const sm=wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(sp),300,.004,6),'#f1b630',GOLD);sm.position.copy(hm.position);sm.rotation.copy(hm.rotation);sm.scale.setScalar(1.55);g.add(sm);
    // mane: three swept glossy locks (taper tubes) behind the horn base, pink quiff curling right, blue lock under it, lavender at the back-left; top of each lock paled by normal-based vertex colours
    const lock=(col,pts,r0,r1)=>{const t=taper(T,pts.map(p=>new T.Vector3(...p)),r0,r1,40,14),pa=t.g.attributes.position;for(let i=0;i<=40;i++){const f=i/40,rd=r0*(1-.9*Math.pow(f,2.4))+r1*f,rl=r0+(r1-r0)*Math.pow(f,.9),q=rd/rl;let cx=0,cy=0,cz=0;for(let j=0;j<=14;j++){const k=i*15+j;cx+=pa.getX(k)/15;cy+=pa.getY(k)/15;cz+=pa.getZ(k)/15}for(let j=0;j<=14;j++){const k=i*15+j;pa.setXYZ(k,cx+(pa.getX(k)-cx)*q,cy+(pa.getY(k)-cy)*q,cz+(pa.getZ(k)-cz)*q)}}t.g.computeVertexNormals();const n=t.g.attributes.normal,cl=[],B=new T.Color(col),Wc=new T.Color('#ffffff');for(let k=0;k<n.count;k++){const c=B.clone().lerp(Wc,Math.max(0,n.getY(k))*.45);cl.push(c.r,c.g,c.b)}t.g.setAttribute('color',new T.Float32BufferAttribute(cl,3));const mh=wmesh(t.g,wm('#ffffff',{vertexColors:true,roughness:.25,clearcoat:.8,clearcoatRoughness:.15}));mh.scale.z=.6;g.add(mh)};
    lock('#ff8fc4',[[.04,HY+.03,-.04],[.11,HY+.17,-.01],[.25,HY+.19,.03],[.35,HY+.13,.08],[.39,HY+.06,.12]],.072,.008);lock('#7fc4ff',[[.03,HY-.01,-.03],[.1,HY+.08,0],[.22,HY+.1,.04],[.31,HY+.04,.09],[.34,HY-.03,.14]],.06,.007);lock('#c9b0ff',[[-.03,HY+.02,-.05],[-.1,HY+.14,-.05],[-.18,HY+.12,-.03],[-.22,HY+.06,-.02]],.045,.006);
    // tiara: wide gold plate hugging the band front, marquise magenta gem in a gold bezel at the centre under the horn, scroll wings at the sides
    const TY=bandY(0)-.035,rp=headZ(0,TY)+.022,pl=wmesh(new T.CylinderGeometry(rp,rp,.045,32,1,true,-.55,1.1),'#f1b630',Object.assign({side:T.DoubleSide},GOLD));pl.position.set(0,TY,0);g.add(pl);
    const gm=wmesh(new T.IcosahedronGeometry(.045,0),'#d428d8',{roughness:.08,clearcoat:1,clearcoatRoughness:.05,flatShading:true,emissive:'#ff40ff',emissiveIntensity:.3});gm.scale.set(1.5,1,.5);gm.position.set(0,TY+.005,headZ(0,TY,.045));gm.rotation.x=.15;g.add(gm);const bz=wmesh(new T.TorusGeometry(.05,.008,8,6),'#ffd66a',GOLD);bz.scale.set(1.5,1,1);bz.position.copy(gm.position);bz.rotation.x=.15;g.add(bz);
    for(const sx of[-1,1]){const x=sx*.12,sw=wmesh(new T.TorusGeometry(.03,.009,8,24,Math.PI*1.3),'#f1b630',GOLD);sw.position.set(x,TY,headZ(x,TY,.04));sw.rotation.set(0,Math.atan2(x,headZ(x,TY)),sx>0?-.4:Math.PI+.4);g.add(sw)}
    // star charms hanging from loops on the band ends
    for(const sx of[-1,1])hangStar(T,g,sx*.2,bandY(sx*.2)+.004,.05,.045)},
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
