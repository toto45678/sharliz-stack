/* v69: SERIES LOOK (Tzach, Oct 24: 'same shape as now, only the render like the Sharlizes in the series'). Every 3D Sharliz
   (lobby hero, My hero, thumbnails, mini buddy, gags and the baked in-game sprites) keeps its exact shape but loses the black
   ink hulls (body, eyes, hats, glasses, outfits), the eyes sit in a socket of darker body colour, the body darkens towards the
   bottom like Bobby in the series, the eyes are soft porcelain, the blush is faint, and the brows of the worrier and the grump
   are gone (no eyebrows on Sharliz, Tzach Oct 16). Sample approved Oct 24: /mnt/project-files/game/series-look/sample_v1.jpg. Also a new top hat (below).
   Shape, faces and looks stay in base.html; this only re-dresses the materials after buildSharliz3D / applyLook / persBake. */
(()=>{const INKHEX=0x120d2b;
  function isInk(m,T){return m&&m.isMeshBasicMaterial&&m.color&&m.color.getHex()===INKHEX}
  function slSockets(P,base){const T=P.T;if(!P.slSock){P.slSock=[];
      for(const e of P.eyes)for(const o of e.children)if(o.isMesh&&isInk(o.material,T)&&o.material.side===T.BackSide){
        o.material=new T.MeshPhysicalMaterial({color:'#000000',roughness:.55});o.scale.set(1.07,1.055,.55);P.slSock.push(o)}}
    const c=new T.Color(base||'#ff6b98').multiplyScalar(.6);for(const o of P.slSock)o.material.color.copy(c)}
  function slBody(P){if(P.slBody)return;P.slBody=1;const M=P.bodyMat;
    M.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying float vSY;').replace('#include <begin_vertex>','#include <begin_vertex>\nvSY=position.y;');
      s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying float vSY;').replace('#include <color_fragment>','#include <color_fragment>\n{float k=smoothstep(-.75,.6,vSY);diffuseColor.rgb*=mix(vec3(.6,.64,.8),vec3(.98),k);}')};
    M.customProgramCacheKey=()=>'slbody';M.needsUpdate=true}
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
