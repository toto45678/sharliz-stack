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
    g.rotation.x=.12}
  };
  const hp=buildHat;buildHat=function(P,id){const f=H[id];if(!f)return hp.apply(this,arguments);const g=new P.T.Group();f(P,g);P.hatSlot.add(g)};
})();
