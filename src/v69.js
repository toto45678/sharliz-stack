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
  function miniPumpkin(T,r){const p=new T.Group(),b=surf(40,16,(u,v)=>{const a=u*Math.PI*2,q=2*v-1,rr=r*Math.sqrt(Math.max(0,1-q*q))*(1-.09*Math.pow(Math.abs(Math.sin(a*4)),.7));return [Math.sin(a)*rr,q*r*.8,Math.cos(a)*rr]},1);p.add(wmesh(b,'#ff7a1a',{roughness:.35,clearcoat:.6}));
    const s=wmesh(new T.CylinderGeometry(r*.12,r*.18,r*.5,10),'#3c9a3a',{roughness:.4});s.position.y=r*.95;p.add(s);return p}
  function featherGeo(T){const sh=new T.Shape();sh.moveTo(0,0);sh.bezierCurveTo(.06,.08,.055,.24,0,.32);sh.bezierCurveTo(-.055,.24,-.06,.08,0,0);const ge=new T.ExtrudeGeometry(sh,{depth:.006,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:2,curveSegments:16});const p=ge.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,p.getZ(i)-Math.abs(x)*.35+(y*y)*.2)}ge.computeVertexNormals();return ge}
  function leafGeo(T){const sh=new T.Shape();sh.moveTo(0,0);sh.bezierCurveTo(.09,.06,.08,.2,0,.27);sh.bezierCurveTo(-.08,.2,-.09,.06,0,0);const ge=new T.ExtrudeGeometry(sh,{depth:.003,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:1,curveSegments:14});const p=ge.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,p.getZ(i)-x*x*2.5+y*y*.4)}ge.computeVertexNormals();return ge}
  function ghostMesh(T,mo,k){const pts=[];for(let i=0;i<=20;i++){const f=i/20;pts.push(V2(Math.max(.001,Math.sin(Math.min(1,f*1.5)*Math.PI/2)*.055),.13-f*.13))}pts.reverse();const ge=new T.LatheGeometry(pts,32),p=ge.attributes.position;for(let i=0;i<p.count;i++){if(p.getY(i)<.02){const a=Math.atan2(p.getZ(i),p.getX(i));p.setY(i,p.getY(i)+Math.sin(a*5)*.012)}}ge.computeVertexNormals();
    const gr=new T.Group(),m=new T.Mesh(ge,wm(mo.color,mo));gr.add(m);for(const sx of[-1,1]){const e=wmesh(new T.SphereGeometry(.009,8,6),'#2a2a4a');e.position.set(sx*.018,.085,.05);gr.add(e)}gr.scale.setScalar(k*1.3);return gr}
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
  h_farmN(P,g){const T=P.T,R=.25;crownBand(g,R,a=>.08+.07*Math.pow((Math.cos(4*a)+1)/2,3),'#f1b630');
    [[0,1],[.75,.62],[-.75,.62]].forEach(([a,k])=>{const p=miniPumpkin(T,.09*k);p.position.set(Math.sin(a)*(R+.01),.12+.06*k,Math.cos(a)*(R+.01));g.add(p)});
    gemAt(g,0,.05,R+.03,'#e8401a',.85);gemAt(g,.45,.045,R+.025,'#d11a2a',.5);gemAt(g,-.45,.045,R+.025,'#d11a2a',.5)},
  h_cityN(P,g){const T=P.T;g.add(hband(T,'#3a3440',{roughness:.4,clearcoat:.5},.022,.022));
    const tx=canvasTex('catstripe',128,128,(c,w,h)=>{c.fillStyle='#9a9aa2';c.fillRect(0,0,w,h);c.fillStyle='#55555e';for(let i=0;i<5;i++){c.beginPath();c.ellipse(w/2,i*h/5+10,w*.45,7,0,0,7);c.fill()}});
    for(const sx of[-1,1]){const e=new T.Group(),y=.0,x=sx*(bodyR((.66+y)/.75)-.03);e.position.set(x,y+.02,0);e.rotation.z=-sx*.42;g.add(e);
      const o=wmesh(new T.ConeGeometry(.12,.25,32),wm('#c8c8d0',{map:tx,roughness:.85,clearcoat:0,sheen:1,sheenColor:new T.Color('#ffffff')}));o.scale.z=.45;o.position.y=.12;e.add(o);
      const i=wmesh(new T.ConeGeometry(.075,.17,24),'#ff9cb8',{roughness:.6});i.scale.z=.3;i.position.set(0,.1,.03);e.add(i)}
    const bl=wmesh(new T.SphereGeometry(.028,16,12),'#f1b630',GOLD);bl.position.set(-.27,-.06,.06);g.add(bl);gemAt(g,.0,-.0,0,'#a020c8',.5,new T.Vector3(.27,-.06,.06))},
  h_desertN(P,g){const T=P.T,R=.25;crownBand(g,R,a=>.08+.06*Math.pow((Math.cos(5*a)+1)/2,4),'#1f1a24',{roughness:.3,clearcoat:.8},1);
    gemAt(g,0,.06,R+.03,'#d11a2a',.9);gemAt(g,.8,.05,R+.025,'#d11a2a',.5);gemAt(g,-.8,.05,R+.025,'#d11a2a',.5);
    const cu=new T.CatmullRomCurve3([new T.Vector3(0,.06,-.18),new T.Vector3(0,.22,-.2),new T.Vector3(0,.38,-.12),new T.Vector3(0,.46,.02),new T.Vector3(0,.42,.14)]);
    for(let i=0;i<7;i++){const t=i/7,p=cu.getPointAt(t),r=.085-.04*t,s=wmesh(new T.SphereGeometry(r,24,16),'#1f1a24',{roughness:.25,clearcoat:.9});s.position.copy(p);s.scale.set(1,.85,1);g.add(s);
      if(i){const rg=wmesh(new T.TorusGeometry(r*.92,.009,8,32),'#f1b630',GOLD);rg.position.copy(cu.getPointAt(t-.07));rg.lookAt(rg.position.clone().add(cu.getTangentAt(t-.07)));g.add(rg)}}
    const st=taper(T,[new T.Vector3(0,.43,.15),new T.Vector3(0,.4,.22),new T.Vector3(0,.33,.24),new T.Vector3(0,.28,.21)],.032,.003,16,10);g.add(wmesh(st.g,'#f1b630',GOLD))},
  h_candyN(P,g){const T=P.T,tx=canvasTex('candywitch',512,512,(c,w,h)=>{c.save();c.translate(w/2,h/2);c.rotate(-.5);for(let i=-12;i<12;i++){c.fillStyle=i%2?'#ff6fae':'#5ee0b8';c.fillRect(-w,i*h/8,2*w,h/8+1)}c.restore()}),o={roughness:.3,clearcoat:.7};
    g.add(dmesh(shell(72,8,(u,v)=>{const a=u*Math.PI*2,r=.2+v*.27;return [Math.sin(a)*r,-.03*v*v+.02*v*Math.cos(a*2),Math.cos(a)*r]},.02),'#ff6fae',o));
    const H0=.56;g.add(wmesh(surf(64,40,(u,v)=>{const a=u*Math.PI*2,r=Math.max(.004,.225*(1-v));return [Math.sin(a)*r+.24*Math.pow(v,3),v<.02?-.07+v/.02*.07:v*H0-.08*Math.pow(v,6),Math.cos(a)*r]},1),wm('#ffffff',Object.assign({map:tx},o))));
    const lp=new T.Mesh(new T.CylinderGeometry(.06,.06,.02,32),[wm('#ffffff',o),wm('#ffffff',Object.assign({map:canvasTex('lolCW',128,128,(c,w,h)=>{c.fillStyle='#ffffff';c.fillRect(0,0,w,h);c.strokeStyle='#ff4f98';c.lineWidth=11;c.beginPath();for(let k=0;k<160;k++){const t=k/160*Math.PI*7,r=t/(Math.PI*7)*w*.5;c.lineTo(w/2+Math.cos(t)*r,h/2+Math.sin(t)*r)}c.stroke()})},o)),wm('#ffffff',o)]);face(lp,-.14,.09,.17);lp.rotateX(Math.PI/2);g.add(lp);
    for(const sx of[-1,1]){const b=wmesh(new T.SphereGeometry(.045,16,12),'#ff4f98',o);b.scale.set(1.3,.85,.5);b.position.set(.14+sx*.05,.06,.18);b.rotation.z=sx*.3;g.add(b)}
    [['#5ee85a',-.04,.05,.23],['#ffd23f',.02,.13,.2],['#ff8fc0',-.2,.04,.13]].forEach(([c,x,y,z])=>{const b=wmesh(new T.SphereGeometry(.026,14,10),c,{roughness:.15,clearcoat:1});b.position.set(x,y,z);g.add(b)});g.position.y=.06},
  h_snowN(P,g){const T=P.T,o={roughness:.95,clearcoat:0,sheen:1,sheenRoughness:.4,sheenColor:new T.Color('#ffffff'),emissive:'#ffffff',emissiveIntensity:.04};
    const hg=new T.SphereGeometry(.34,64,32,-Math.PI*.85,Math.PI*1.7+Math.PI*0,0,Math.PI*.62),p=hg.attributes.position,v=new T.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const d=v.clone().normalize(),n=Math.sin(d.x*61)*Math.sin(d.y*57)*Math.sin(d.z*63);v.multiplyScalar(1+.025*n);p.setXYZ(i,v.x,v.y,v.z)}hg.computeVertexNormals();
    const h=wmesh(hg,'#f7f8fc',Object.assign({side:T.DoubleSide},o));h.rotation.y=Math.PI;h.position.y=-.1;h.scale.y=.85;g.add(h);
    const rim=wmesh(fluff(T,1,4),'#f2f5fb',o);rim.scale.set(.34,.07,.34);rim.position.y=.03;g.add(rim);
    for(const sx of[-1,1]){const e=wmesh(new T.ConeGeometry(.08,.17,24),'#f7f8fc',o);e.scale.z=.55;e.position.set(sx*.17,.25,-.02);e.rotation.z=-sx*.35;g.add(e);
      const tip=wmesh(new T.ConeGeometry(.045,.08,20),'#3a7be0',{roughness:.7});tip.scale.z=.6;tip.position.set(sx*.2,.31,-.02);tip.rotation.z=-sx*.35;g.add(tip);
      const ey=wmesh(new T.SphereGeometry(.024,16,12),'#4ab0ff',{roughness:.1,clearcoat:1,emissive:'#2a8aff',emissiveIntensity:.3});ey.scale.set(1.2,.9,.5);face(ey,sx*.09,.2,.25);g.add(ey);
      const pm=wmesh(fluff(T,.045,sx+3),'#f7f8fc',o);pm.position.set(sx*.33,-.24,.04);g.add(pm);const sg=wmesh(new T.CylinderGeometry(.005,.005,.08,6),'#f1b630',GOLD);sg.position.set(sx*.33,-.18,.04);g.add(sg)}
    const cr=wmesh(new T.OctahedronGeometry(.04,0),'#8fe0ff',{roughness:.05,clearcoat:1,emissive:'#5cc8ff',emissiveIntensity:.35,flatShading:true});cr.scale.set(.7,1.3,.5);face(cr,0,.22,.27);g.add(cr)},
  h_oceanN(P,g){const T=P.T,o={roughness:.3,clearcoat:.7};g.add(hband(T,'#3b3a8a',o,.026,.025));
    for(const sx of[-1,1]){const fan=new T.Group();fan.position.set(sx*.29,-.04,.03);fan.rotation.y=sx*.4;g.add(fan);for(let k=0;k<4;k++){const f=wmesh(new T.SphereGeometry(.045,16,10),k%2?'#5a6cff':'#9a5cff',{roughness:.2,clearcoat:.9,transparent:true,opacity:.92});f.scale.set(.25,1.2,.6);f.position.set(sx*.02,.0,0);f.rotation.x=-.6+k*.4;f.translateY(.05);fan.add(f)}}
    const st=taper(T,[new T.Vector3(0,.08,-.12),new T.Vector3(0,.3,-.1),new T.Vector3(0,.4,.04),new T.Vector3(0,.35,.18),new T.Vector3(0,.28,.22)],.026,.014,30,10);g.add(wmesh(st.g,'#3b3a8a',o));
    const L=wmesh(new T.SphereGeometry(.065,24,16),'#fff3a0',{emissive:'#ffd23a',emissiveIntensity:1.3,roughness:.2});L.position.set(0,.2,.25);g.add(L);
    for(const ry of[Math.PI/2]){const c=wmesh(new T.TorusGeometry(.053,.006,6,32),'#f1b630',GOLD);c.scale.setScalar(1.25);c.position.copy(L.position);c.rotation.y=ry;g.add(c)}
    const cp=wmesh(new T.ConeGeometry(.03,.03,16),'#f1b630',GOLD);cp.position.set(0,.275,.25);g.add(cp)},
  h_volcanoN(P,g){const T=P.T;g.add(hband(T,'#2a2433',{roughness:.4,clearcoat:.5},.022,.022));
    for(const sx of[-1,1]){const y=.0,x=sx*(bodyR((.66+y)/.75)-.02),h=taper(T,[new T.Vector3(x,y,0),new T.Vector3(x+sx*.05,y+.1,0),new T.Vector3(x+sx*.06,y+.2,.01),new T.Vector3(x+sx*.02,y+.27,.02)],.062,.004,24,14);g.add(wmesh(h.g,'#d4202a',{roughness:.15,clearcoat:1}));
      const r=wmesh(new T.TorusGeometry(.058,.014,10,28),'#f1b630',GOLD);r.position.set(x+sx*.01,y+.03,0);r.rotation.x=Math.PI/2;r.rotation.y=sx*.3;g.add(r)}
    gemAt(g,0,.07,.25,'#d11a2a',.6)},
  h_spaceN(P,g){const T=P.T,F={roughness:.9,clearcoat:0,sheen:1,sheenRoughness:.4,sheenColor:new T.Color('#ffffff')};g.add(hband(T,'#f4f2f8',F,.026,.024));
    for(const sx of[-1,1]){const e=new T.Group();e.position.set(sx*.1,.06,-.02);e.rotation.z=-sx*.18;g.add(e);const o=wmesh(new T.CapsuleGeometry(.055,.28,8,20),'#f8f7fb',F);o.scale.z=.45;o.position.y=.19;e.add(o);
      const i=wmesh(new T.CapsuleGeometry(.032,.22,8,16),'#ffb3c8',{roughness:.6});i.scale.z=.3;i.position.set(0,.19,.022);e.add(i);const pm=wmesh(fluff(T,.04,sx+5),'#ffffff',F);pm.position.set(sx*.04,.03,.06);g.add(pm)}
    const m=wmesh(moonGeo(T,.05,.012),'#f1b630',GOLD);face(m,0,.08,.24);g.add(m);const dr=wmesh(starGeo(T,.018,.008,.006,4),'#f1b630',GOLD);face(dr,0,.01,.255);g.add(dr)},
  h_farmS(P,g){const T=P.T;g.add(hband(T,'#f1b630',GOLD,.024,.02));
    for(const sx of[-1,1]){const pts=[];for(let k=0;k<=24;k++){const t=k/24,a=t*Math.PI*1.7,r=.13*(1-t*.55);pts.push(new T.Vector3(sx*(.25+.05*t+Math.sin(a)*r*.25),.06+Math.cos(a)*r-.0,Math.sin(a)*r*.9-.02))}
      const h=taper(T,pts,.065,.022,60,16);const hm=wmesh(h.g,'#d9cdb3',{roughness:.5,clearcoat:.3});g.add(hm);
      const bolt=(()=>{const sh=new T.Shape();sh.moveTo(.0,.08);sh.lineTo(-.03,.0);sh.lineTo(-.005,.0);sh.lineTo(-.02,-.07);sh.lineTo(.03,.015);sh.lineTo(.005,.015);sh.lineTo(.02,.08);sh.closePath();return new T.ExtrudeGeometry(sh,{depth:.012,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:2})})();
      const b=wmesh(bolt,'#ffd21f',{emissive:'#ffb000',emissiveIntensity:.45,metalness:.3,roughness:.25});b.position.set(sx*.2,.26,0);b.rotation.z=-sx*.25;g.add(b)}
    gemAt(g,0,.06,.25,'#1f4fd8',.8);gemAt(g,.35,.05,.25,'#1f4fd8',.4);gemAt(g,-.35,.05,.25,'#1f4fd8',.4)},
  h_cityS(P,g){const T=P.T,C='#ffcf1e',o={roughness:.18,clearcoat:1,clearcoatRoughness:.06};
    const d=wmesh(new T.SphereGeometry(.29,48,24,0,Math.PI*2,0,Math.PI/2),C,o);d.scale.y=.95;g.add(d);const sk=wmesh(new T.CylinderGeometry(.29,.295,.04,48,1,true),C,o);sk.position.y=-.02;g.add(sk);
    g.add(dmesh(shell(80,8,(u,v)=>{const a=u*Math.PI*2,bk=Math.pow(Math.max(0,-Math.cos(a)),1.5),r=.28+v*(.1+.08*bk);return [Math.sin(a)*r,-.03-v*v*(.03+.07*bk),Math.cos(a)*r]},.02),C,o));
    const b=[];for(let k=0;k<=6;k++){const t=k/6;b.push(V2(.292+.004*Math.sin(t*Math.PI),.0+t*.05))}g.add(wmesh(new T.LatheGeometry(b,64),'#2f62c9',{roughness:.35,clearcoat:.6}));
    const bk=new T.Group();face(bk,0,.025,.3);g.add(bk);for(const [w,h,x,y] of[[.06,.012,0,.022],[.06,.012,0,-.022],[.012,.056,-.024,0],[.012,.056,.024,0]]){const q=wmesh(new T.BoxGeometry(w,h,.012),'#e8e8ee',{metalness:.8,roughness:.2});q.position.set(x,y,0);bk.add(q)}
    const cl=new T.Group();face(cl,.17,.0,.26);g.add(cl);[[0,0,.03],[-.03,-.005,.022],[.03,-.005,.022]].forEach(([x,y,r])=>{const c=wmesh(new T.SphereGeometry(r,14,10),'#ffffff',{roughness:.8});c.position.set(x,y,0);cl.add(c)});
    for(const x of[-.02,.015]){const dr=wmesh(new T.SphereGeometry(.012,12,10),'#4ab0ff',{roughness:.05,clearcoat:1});dr.scale.y=1.4;dr.position.set(x,-.045,.0);cl.add(dr)}
    g.position.y=.04},
  h_desertS(P,g){const T=P.T,o={roughness:.6,clearcoat:.15,sheen:.6,sheenColor:new T.Color('#fff3d8')},cs=['#e8cc96','#d9b77c','#efd7a8','#d6ad70'];
    const core=wmesh(new T.SphereGeometry(.27,32,16,0,Math.PI*2,0,Math.PI/2),'#e3c48c',o);core.position.y=.05;g.add(core);
    cs.forEach((c,i)=>{const t=wmesh(new T.TorusGeometry(.275-i*.032,.068-i*.006,16,64),c,o);t.rotation.x=Math.PI/2+(i%2?.2:-.16);t.rotation.z=(i%2?.14:-.1);t.position.y=.0+i*.06;g.add(t)});
    const cl=taper(T,[new T.Vector3(.2,.06,.14),new T.Vector3(.3,-.05,.12),new T.Vector3(.33,-.2,.06),new T.Vector3(.32,-.3,0)],.05,.035,20,10);const cm=wmesh(cl.g,'#e0703a',o);cm.scale.z=.5;g.add(cm);
    const pts=[new T.Vector3(-.02,.2,-.02),new T.Vector3(-.04,.34,-.05),new T.Vector3(0,.44,0),new T.Vector3(.08,.47,.06),new T.Vector3(.14,.43,.12)];const w=taper(T,pts,.075,.06,40,16);g.add(wmesh(w.g,'#c8784a',{roughness:.4,clearcoat:.5}));
    const cu=new T.CatmullRomCurve3(pts);for(let k=1;k<8;k++){const t=k/8,p=cu.getPointAt(t),r=wmesh(new T.TorusGeometry(.073-.012*t,.008,8,28),'#a85a34',{roughness:.5});r.position.copy(p);r.lookAt(p.clone().add(cu.getTangentAt(t)));g.add(r)}
    const end=cu.getPointAt(1),tan=cu.getTangentAt(1),mo=new T.Group();mo.position.copy(end);mo.lookAt(end.clone().add(tan));g.add(mo);
    const lip=wmesh(new T.TorusGeometry(.062,.016,10,28),'#c8784a',{roughness:.4,clearcoat:.5});mo.add(lip);const inn=wmesh(new T.CircleGeometry(.06,24),'#7a1a24',{side:T.DoubleSide});inn.position.z=-.005;mo.add(inn);
    for(let k=0;k<8;k++){const a=k/8*Math.PI*2,th=wmesh(new T.ConeGeometry(.01,.03,8),'#fff6e0',{roughness:.3});th.position.set(Math.cos(a)*.05,Math.sin(a)*.05,.0);th.rotation.z=a+Math.PI/2;mo.add(th)}
    gemAt(g,0,.11,.3,'#e8401a',.8)},
  h_candyS(P,g){const T=P.T,R=.25;crownBand(g,R,a=>.1+.08*Math.pow((Math.cos(5*a)+1)/2,2),'#c97a3c',{roughness:.75,clearcoat:.1,sheen:.4,sheenColor:new T.Color('#ffd0a0')},1);
    const ic=[];for(let k=0;k<=200;k++){const a=k/200*Math.PI*2;ic.push(new T.Vector3(Math.sin(a)*(R+.03),.06+.015*Math.sin(a*30),Math.cos(a)*(R+.03)))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(ic,true),400,.008,6,true),'#ffffff',{roughness:.4}));
    const bc=['#e3242f','#3cbf4a','#ffcf2e'];for(let i=0;i<5;i++){const a=i/5*Math.PI*2,gd=wmesh(new T.SphereGeometry(.03,14,10,0,Math.PI*2,0,Math.PI*.6),bc[i%3],{roughness:.15,clearcoat:1});gd.position.set(Math.sin(a)*(R+.03),.17,Math.cos(a)*(R+.03));g.add(gd);
      const g2=wmesh(new T.SphereGeometry(.02,12,10),bc[(i+1)%3],{roughness:.15,clearcoat:1});g2.scale.z=.6;face(g2,Math.sin(a+.6)*(R+.035),.035,Math.cos(a+.6)*(R+.035));g.add(g2)}
    gemAt(g,0,.1,R+.04,'#d11a2a',.85)},
  h_snowS(P,g){const T=P.T;H.pirate(P,g);g.children.filter(c=>c.isGroup).forEach(c=>c.visible=false);
    g.traverse(m=>{if(m.isMesh&&m.material.color){const h=m.material.color.getHex();if(h===0x1c1824)m.material.color.set('#1f2a5c');if(h===0xb51f2d)m.material.color.set('#c8a24a')}});
    const ro=new T.Group();face(ro,.17,.17,.22,.0);g.add(ro);const rs=wmesh(new T.TorusGeometry(.035,.012,10,24),'#f1b630',GOLD);ro.add(rs);const gm=wmesh(new T.SphereGeometry(.025,14,10),'#1f4fd8',{roughness:.05,clearcoat:1});gm.scale.z=.6;ro.add(gm);
    for(const [c,dx,rz,len] of[['#2a3fa0',-.02,.25,.26],['#f6f2ea',.02,-.15,.3],['#2a3fa0',.05,-.45,.22]]){const f=taper(T,[new T.Vector3(.16+dx,.2,.16),new T.Vector3(.16+dx+Math.sin(rz)*len*.5,.2+len*.6,.1),new T.Vector3(.16+dx+Math.sin(rz)*len,.2+len*.95,0)],.032,.006,20,10);const fm=wmesh(f.g,c,{roughness:.7,sheen:1,sheenColor:new T.Color('#ffffff')});fm.scale.z=.5;g.add(fm)}},
  h_oceanS(P,g){const T=P.T;g.add(hband(T,'#7c8696',{metalness:.5,roughness:.3,clearcoat:.5},.026,.024));
    const sh=new T.Shape();sh.moveTo(-.16,0);sh.bezierCurveTo(-.1,.12,.0,.26,.12,.32);sh.bezierCurveTo(.06,.22,.08,.1,.14,0);sh.closePath();
    const fg=new T.ExtrudeGeometry(sh,{depth:.03,bevelEnabled:true,bevelSize:.02,bevelThickness:.02,bevelSegments:4,curveSegments:24});fg.translate(0,0,-.015);
    const fin=wmesh(fg,'#8a94a6',{roughness:.3,clearcoat:.8});fin.rotation.y=Math.PI/2;fin.position.y=.07;g.add(fin);
    for(let k=0;k<5;k++){const a=(k-2)*.35,w=wmesh(new T.TorusGeometry(.04,.014,8,20,Math.PI),'#7fd4ff',{roughness:.05,clearcoat:1,transparent:true,opacity:.85});w.position.set(Math.sin(a)*.22,.04+(k%2)*.015,Math.cos(a)*.14);w.rotation.y=a;g.add(w)}
    gemAt(g,0,.03,.22,'#2f9ae1',.55)},
  h_volcanoS(P,g){const T=P.T,R=.25;const tia=wmesh(new T.TorusGeometry(R+.01,.016,10,64,Math.PI*1.1),'#f1b630',GOLD);tia.rotation.x=Math.PI/2;tia.rotation.z=-Math.PI*.05+Math.PI*-.0;tia.rotation.y=0;tia.position.y=.03;tia.rotation.z=Math.PI*1.95;g.add(tia);
    const fg=featherGeo(T);const cs=[['#e3242f','#ff3a1a'],['#ff7a1a','#ff5a00'],['#ffcf2e','#ffb000']];
    for(let i=0;i<9;i++){const t=i/8-.5,a=t*2.2,k=1.15-Math.abs(t)*.7,c=cs[(i+1)%3];const f=wmesh(fg,c[0],{emissive:c[1],emissiveIntensity:.35,roughness:.35,clearcoat:.6});f.scale.setScalar(k);f.position.set(Math.sin(a)*R*.85,.04,Math.cos(a)*R*.85-.04);f.rotation.y=a;f.rotation.x=-.25;f.rotation.z=-t*.9;g.add(f)}
    for(let i=0;i<6;i++){const t=i/5-.5,a=t*1.6,f=wmesh(fg,'#ffd23f',{emissive:'#ffb000',emissiveIntensity:.5,roughness:.35});f.scale.setScalar(.6);f.position.set(Math.sin(a)*R*.9,.04,Math.cos(a)*R*.9);f.rotation.y=a;f.rotation.x=-.1;f.rotation.z=-t*.8;g.add(f)}
    gemAt(g,0,.06,R+.03,'#d11a2a',.75)},
  h_spaceS(P,g){const T=P.T,tx=canvasTex('cosmos',256,64,(c,w,h)=>{c.fillStyle='#3a1f66';c.fillRect(0,0,w,h);for(let i=0;i<70;i++){c.fillStyle=i%5?'rgba(255,255,255,.7)':'#ffd23f';c.beginPath();c.arc((i*53)%w,(i*29)%h,i%5?.9:1.8,0,7);c.fill()}});
    g.add(hband(T,wm('#ffffff',{map:tx,roughness:.3,clearcoat:.8}),null,.03,.026));
    const eg=new T.Group();eg.position.set(0,.14,.21);eg.rotation.x=-.5;eg.scale.setScalar(1.45);g.add(eg);const lid=wmesh(new T.TorusGeometry(.065,.016,12,40),'#f1b630',GOLD);lid.scale.set(1.4,.85,1);eg.add(lid);
    const ball=wmesh(new T.SphereGeometry(.062,28,18),'#e8d8ff',{roughness:.08,clearcoat:1});ball.scale.set(1.35,.8,.6);eg.add(ball);
    const ir=wmesh(new T.SphereGeometry(.042,24,16),'#9a4dff',{roughness:.05,clearcoat:1,emissive:'#7a2dff',emissiveIntensity:.5});ir.scale.set(1,1,.5);ir.position.z=.022;eg.add(ir);
    const sl=wmesh(new T.CapsuleGeometry(.007,.045,4,8),'#140a2a');sl.position.z=.044;sl.scale.z=.4;eg.add(sl);
    [[.22,.04],[-.22,.04],[.15,.13],[-.15,.13]].forEach(([x,y],i)=>{const s=wmesh(starGeo(T,.03-(i>1?.008:0),.013,.008),'#f1b630',GOLD);face(s,x,y,bodyR((.66+y)/.75)*Math.cos(Math.asin(Math.min(.99,Math.abs(x)/Math.max(.05,bodyR((.66+y)/.75)))))+.02);g.add(s)})},
  h_jungle(P,g){const T=P.T,R=.26;const vn=wmesh(new T.TorusGeometry(R+.01,.015,8,64),'#f1b630',GOLD);vn.rotation.x=Math.PI/2;vn.position.y=.03;g.add(vn);
    const lg=leafGeo(T);for(let i=0;i<16;i++){const a=i/16*Math.PI*2,k=.75+.35*Math.abs(Math.cos(a/2)),l=wmesh(lg,i%2?'#2f8f3a':'#3fae4a',{roughness:.35,clearcoat:.6,side:T.DoubleSide});l.scale.setScalar(k);l.position.set(Math.sin(a)*R,.03,Math.cos(a)*R);l.rotation.y=a;l.rotation.x=-.35;l.rotation.z=(i%3-1)*.25;g.add(l)}
    for(let i=0;i<8;i++){const a=(i+.5)/8*Math.PI*2,l=wmesh(lg,'#f1b630',GOLD);l.scale.setScalar(.35);l.position.set(Math.sin(a)*(R+.02),.04,Math.cos(a)*(R+.02));l.rotation.y=a;l.rotation.x=-1.1;g.add(l)}
    gemAt(g,0,.06,R+.03,'#1fae5a',.75)},
  h_castle(P,g){const T=P.T,R=.25,GH={color:'#dfe8ff',roughness:.1,clearcoat:1,transparent:true,opacity:.72,emissive:'#9fb8ff',emissiveIntensity:.25,side:T.DoubleSide};
    g.add(wmesh(shell(120,8,(u,v)=>{const a=u*Math.PI*2,y=v*(.1+.03*Math.sin(a*8)),r=R+.03*v;return [Math.sin(a)*r,y,Math.cos(a)*r]},.016),wm(GH.color,GH)));
    [[0,1],[.85,.75],[-.85,.75]].forEach(([a,k])=>{const gh=ghostMesh(T,GH,k);gh.position.set(Math.sin(a)*(R+.02),.09,Math.cos(a)*(R+.02));gh.rotation.y=a;g.add(gh)});
    gemAt(g,0,.05,R+.035,'#1f4fd8',.7);[.4,-.4,1.3,-1.3].forEach(a=>{const s=wmesh(starGeo(T,.022,.01,.006),'#f1b630',GOLD);face(s,Math.sin(a)*(R+.035),.05,Math.cos(a)*(R+.035));g.add(s)})},
  h_clouds(P,g){const T=P.T,F={roughness:.9,clearcoat:0,sheen:1,sheenColor:new T.Color('#ffffff')};g.add(hband(T,'#f8f6fb',F,.028,.024));
    const tx=canvasTex('unihorn',64,256,(c,w,h)=>{const gr=c.createLinearGradient(0,0,0,h);['#ffd0e8','#d6c8ff','#c8f0ff','#fff2c0','#ffd0e8'].forEach((x,i)=>gr.addColorStop(i/4,x));c.fillStyle=gr;c.fillRect(0,0,w,h)});
    const hg=surf(48,40,(u,v)=>{const a=u*Math.PI*2,r=.055*(1-v)*(1+.18*Math.max(0,Math.sin(a*1+v*Math.PI*10))),y=v*.3;return [Math.sin(a)*r,y,Math.cos(a)*r]},1);
    const hm=wmesh(hg,wm('#ffffff',{map:tx,roughness:.12,clearcoat:1,iridescence:.6}));hm.position.set(0,.09,.07);hm.rotation.x=.2;hm.scale.setScalar(1.35);g.add(hm);
    for(const sx of[-1,1]){const e=wmesh(new T.ConeGeometry(.055,.12,20),'#f8f6fb',F);e.scale.z=.5;e.position.set(sx*.2,.1,-.02);e.rotation.z=-sx*.5;g.add(e);const i=wmesh(new T.ConeGeometry(.03,.08,16),'#ffb3c8',{roughness:.6});i.scale.z=.3;i.position.set(sx*.2,.1,.006);i.rotation.z=-sx*.5;g.add(i)}
    [['#ff9ccc',.06,.3],['#9ad8ff',.1,-.1],['#b8f0d0',.0,-.4]].forEach(([c,x,rz])=>{const m=taper(T,[new T.Vector3(x,.1,0),new T.Vector3(x+.06,.18,-.04),new T.Vector3(x+.12,.16,-.08)],.035,.008,16,10);const mm=wmesh(m.g,c,{roughness:.4,clearcoat:.5});g.add(mm)});
    gemAt(g,0,.08,.2,'#c03ad8',.5)},
  h_dino(P,g){const T=P.T,o={roughness:.5,clearcoat:.35};
    const fr=shell(64,10,(u,v)=>{const a=(u-.5)*Math.PI*1.25,r=.12+v*.26,sc=1+.06*Math.sin(u*Math.PI*14)*v;return [Math.sin(a)*r*sc,.05+Math.cos(a)*r*sc*.95,-.1-v*.06]},.02);g.add(dmesh(fr,'#4f9a3c',o));
    for(let i=0;i<9;i++){const a=(i/8-.5)*Math.PI*1.2,r=.39,sp=wmesh(new T.ConeGeometry(.035,.08,12),'#ff8a1f',{roughness:.4,clearcoat:.5});sp.position.set(Math.sin(a)*r,.05+Math.cos(a)*r*.95,-.16);sp.rotation.z=-a;g.add(sp)}
    const hp=wmesh(new T.SphereGeometry(.27,32,16,0,Math.PI*2,0,Math.PI/2),'#5aa846',o);hp.position.y=-.02;hp.scale.y=.75;g.add(hp);
    for(const [x,y,z,s,rx] of[[-.11,.18,.08,1,-.6],[.11,.18,.08,1,-.6],[0,.07,.23,.65,-1.1]]){const h=wmesh(new T.ConeGeometry(.04*s,.17*s,20),'#f2e6c8',{roughness:.3,clearcoat:.7});h.position.set(x,y,z);h.rotation.x=rx+Math.PI/2*0;h.rotation.x=-rx*-1-.0;h.rotation.set(rx*-1+Math.PI/2-1.2,0,-x*1.5);g.add(h);
      const r=wmesh(new T.TorusGeometry(.04*s,.01,8,24),'#f1b630',GOLD);r.position.set(x,y-.05*s,z-.02*s);r.rotation.set(Math.PI/2-(rx*-1+Math.PI/2-1.2)+Math.PI/2,0,0);g.add(r)}
    gemAt(g,0,.02,.27,'#ff8a1f',.55)},
  h_factory(P,g){const T=P.T,M={metalness:.85,roughness:.25,clearcoat:.4};g.add(hband(T,'#b8bec8',M,.034,.026));
    const strip=hband(T,'#5ef0ff',{emissive:'#2ad8ff',emissiveIntensity:1,roughness:.3},.012,.05,.35);g.add(strip);
    for(const sx of[-1,1]){const y=-.15,x=sx*(bodyR((.66+y)/.75)+.03),cp=wmesh(new T.CylinderGeometry(.055,.055,.04,28),'#9aa2ae',M);cp.rotation.z=Math.PI/2;cp.position.set(x,y,0);g.add(cp);
      const gm=wmesh(new T.SphereGeometry(.035,16,12),'#e3242f',{roughness:.05,clearcoat:1,emissive:'#e3242f',emissiveIntensity:.3});gm.scale.x=.5;gm.position.set(x+sx*.025,y,0);g.add(gm);const rr=wmesh(new T.TorusGeometry(.036,.008,8,24),'#f1b630',GOLD);rr.rotation.y=Math.PI/2;rr.position.set(x+sx*.022,y,0);g.add(rr)}
    const hp=[];for(let k=0;k<=100;k++){const t=k/100,a=t*Math.PI*2*8;hp.push(new T.Vector3(Math.cos(a)*.022,.12+t*.16,Math.sin(a)*.022))}g.add(wmesh(new T.TubeGeometry(new T.CatmullRomCurve3(hp),300,.005,6),'#f1b630',GOLD));
    const bs=wmesh(new T.CylinderGeometry(.03,.04,.03,20),'#9aa2ae',M);bs.position.y=.11;g.add(bs);const ball=wmesh(new T.SphereGeometry(.045,20,14),'#e3242f',{roughness:.08,clearcoat:1,emissive:'#ff2020',emissiveIntensity:.35});ball.position.y=.31;g.add(ball)},
  h_crystal(P,g){const T=P.T,R=.25;{const bd=wmesh(new T.TorusGeometry(R+.01,.02,10,64),'#f4c8ff',{roughness:.1,clearcoat:1,transparent:true,opacity:.85});bd.rotation.x=Math.PI/2;bd.position.y=.02;g.add(bd)}
    const ar=wmesh(new T.TorusGeometry(R+.025,.012,8,48,Math.PI*.7),'#f1b630',GOLD);ar.rotation.set(Math.PI/2,0,Math.PI*.15+Math.PI*.0);ar.rotation.z=Math.PI/2-Math.PI*.35;ar.position.y=.04;g.add(ar);
    const cols=['#ff8ad8','#8ac8ff','#c79aff','#ff8ad8','#8ac8ff'];
    [[0,.24],[.35,.17],[-.35,.17],[.7,.13],[-.7,.13],[1.05,.1],[-1.05,.1],[.18,.12],[-.18,.12]].forEach(([a,h],i)=>{const c=cols[i%5],cg=new T.Group();cg.position.set(Math.sin(a)*(R+.01),.03,Math.cos(a)*(R+.01));cg.rotation.y=a;cg.rotation.z=-a*.12;g.add(cg);
      const mat=new T.MeshPhysicalMaterial({color:c,roughness:.05,clearcoat:1,transparent:true,opacity:.82,emissive:c,emissiveIntensity:.3,flatShading:true,envMapIntensity:B3OPT.env*1.3});
      const pr=new T.Mesh(new T.CylinderGeometry(.035,.03,h*.75,6),mat);pr.position.y=h*.375;cg.add(pr);const tp=new T.Mesh(new T.ConeGeometry(.035,h*.3,6),mat);tp.position.y=h*.75+h*.15;cg.add(tp)});
    gemAt(g,0,.05,R+.035,'#7c3aed',.6)}
  };
  const hp=buildHat;buildHat=function(P,id){const f=H[id];if(!f)return hp.apply(this,arguments);const g=new P.T.Group();f(P,g);P.hatSlot.add(g)};
})();
