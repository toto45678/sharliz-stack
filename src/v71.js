/* ===== v71: EYE SOCKETS (Tzach, Oct 25: "can the Sharliz model itself be improved?" → chose "eyes in a socket + gloss", like Bobby in the series).
   The body keeps its exact shape (bodyR), but it is rebuilt as a denser lathe with a pocket cut around each eye: the eye (with its lids) sits
   SK.back deeper, tilted up SK.tilt to follow the egg, and the pocket wall fades back to the surface over a fillet of SK.w (eye radii).
   The dark v69 socket ring is hidden (the real pocket replaces it), blush inside the pocket is hidden, the body gets a vinyl clearcoat.
   Wraps buildSharliz3D after v69, so every 3D Sharliz (lobby, My hero, thumbnails, baked sprites; BAKE_V b33) gets it. Glasses follow P.eyes. */
(()=>{const SK={back:.045,dep:.004,k:1.025,w:.07,tilt:.1,cc:1,ccr:.07,rough:.3,seg:200,rows:150};
  const frames=T=>[-1,1].map(sx=>{const x=sx*B_EX,z=surfZ(x,B_EY)-.014,ry=Math.atan2(x,z)*.85,q=new T.Quaternion().setFromEuler(new T.Euler(-SK.tilt,ry,0,'YXZ'));
    return {c:new T.Vector3(x,B_EY,z),ry,q,qi:q.clone().invert()}});
  // how far a body point p falls inside a pocket (1 = on the floor, 0 = outside the fillet)
  function dent(F,p){let best=0,bf=null;for(const f of F){const q=p.clone().sub(f.c).applyQuaternion(f.qi);if(q.z<-.05)continue;
      const d=Math.hypot(q.x/(B_ERX*SK.k),q.y/(B_ERY*SK.k)),s=(d-1)/SK.w,t=d<=1?1:s>=1?0:1-s*s*(3-2*s);if(t>best){best=t;bf=f}}
    return best?{t:best,f:bf}:null}
  let GEO=null;   // the dented body is the same for every Sharliz: build once, share
  function bodyGeo(T,F){if(GEO)return GEO;const pts=[];for(let i=0;i<=SK.rows;i++){const u=-Math.cos(Math.PI*i/SK.rows);pts.push(new T.Vector2(Math.max(bodyR(u),1e-4),u*.75))}
    const g=new T.LatheGeometry(pts,SK.seg);g.rotateY(Math.PI);const pos=g.attributes.position,p=new T.Vector3(),zF=-SK.back-SK.dep;
    for(let i=0;i<pos.count;i++){p.fromBufferAttribute(pos,i);const r=dent(F,p);if(!r)continue;const q=p.clone().sub(r.f.c).applyQuaternion(r.f.qi);
      if(q.z<=zF)continue;q.z+=(zF-q.z)*r.t;q.applyQuaternion(r.f.q).add(r.f.c);pos.setXYZ(i,q.x,q.y,q.z)}
    g.computeVertexNormals();return GEO=g}
  function gloss(P){const M=P.bodyMat;if(M&&!M.metalness){M.clearcoat=SK.cc;M.clearcoatRoughness=SK.ccr;M.roughness=SK.rough;M.needsUpdate=true}}
  function socket(P){if(P.slSk)return;const T=P.T,body=P.m.children.find(o=>o.isMesh&&o.material===P.bodyMat);if(!body)return;P.slSk=1;
    const F=frames(T);body.geometry=bodyGeo(T,F);
    P.eyes.forEach((e,i)=>{const f=F[i];e.rotation.set(-SK.tilt,f.ry,0,'YXZ');e.position.copy(f.c).add(new T.Vector3(0,0,-SK.back).applyQuaternion(f.q))});
    if(P.slSock)for(const o of P.slSock)o.visible=false;
    P.m.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='CircleGeometry'&&o.material&&o.material.transparent){const r=dent(F,o.position);if(r)o.visible=r.t<.5}});
    gloss(P)}
  const b0=buildSharliz3D;buildSharliz3D=function(){const P=b0.apply(this,arguments);try{socket(P)}catch(e){console.warn('socket',e)}return P};
  const a0=applyLook;applyLook=function(P){const r=a0.apply(this,arguments);if(P.slSk){gloss(P);if(P.slSock)for(const o of P.slSock)o.visible=false}return r};
})();
/* MORE FACES (Tzach, Oct 25: "angry, nauseous and so on, all with the eyelids"): no pupils and no brows, so the eyelids carry the feeling.
   FACES3 entries may add tilt (top lids, + = inner corner down = angry, − = outer corner down = sad), lt (lower lids, same sign rule),
   kE/lE (per eye [left,right] top/lower closing, overrides k/low), esE (per eye size), sy (eye height), mx (mouth sideways), ms (mouth size). Tzach dropped furious, suspicious and laughing (Oct 25: none of 3 variants each worked). and the new mouths frown + wavy. */
(()=>{Object.assign(FACES3,{
    8:{k:.4,low:.14,tilt:.45,mouth:'frown'},                       // angry
    10:{kE:[.5,.64],lE:[.32,.22],tilt:-.22,lt:.1,mouth:'wavy'},   // nauseous
    11:{k:.44,low:.08,tilt:-.8,mouth:'frown'},                   // sad
    14:{k:.34,low:.06,tilt:-.65,es:1.05,mouth:'o'},                 // worried
    15:{k:.36,low:.34,tilt:-.2,lt:.1,mouth:'smile'}});            // dreamy / in love
  const sf0=setFace3;setFace3=function(P,f,blinkK=0){sf0.apply(this,arguments);const F=FACES3[f]||FACES3[0];
    P.eyes.forEach((e,i)=>{const sx=e.userData.sx||1,k=Math.max(F.kE?F.kE[i]:F.k||0,blinkK),lo=F.lE?F.lE[i]:F.low||0,L=P.lids[i],D=P.lows[i];
      L.rotation.order=D.rotation.order='ZXY';L.rotation.x=Math.PI/2+Math.PI*k*.98;L.rotation.z=sx*(F.tilt||0)*(1-blinkK);
      D.rotation.x=-Math.PI/2-Math.PI*lo*(1-k);D.rotation.z=-sx*(F.lt||0)*(1-blinkK);
      if(F.esE||F.sy){const s=(F.es||1)*(F.esE?F.esE[i]:1);e.scale.set(B_ERX*s,B_ERY*s*(F.sy||1),B_ERZ)}});
    for(const n in P.mouths){const o=P.mouths[n];if(o.userData.x0===undefined)o.userData.x0=o.position.x;o.position.x=o.userData.x0+(F.mx||0);if(F.ms||o.userData.ms){o.scale.setScalar(F.ms||1);o.userData.ms=F.ms}}};
  const b0=buildSharliz3D;buildSharliz3D=function(T){const P=b0.apply(this,arguments);try{const sm=P.mouths.smile,m=sm.parent;
      const fr=new T.Mesh(sm.geometry,sm.material);fr.position.copy(sm.position);fr.position.y-=.03;fr.visible=false;m.add(fr);P.mouths.frown=fr;
      const pts=[];for(let i=0;i<=24;i++){const u=i/24;pts.push(new T.Vector3((u-.5)*.1*B3OPT.mouth,Math.sin(u*Math.PI*3)*.01,0))}
      const wv=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,.009*Math.sqrt(B3OPT.mouth),8,false),sm.material);
      wv.position.set(0,B_MY+.004,sm.position.z+.002);wv.visible=false;m.add(wv);P.mouths.wavy=wv}catch(e){console.warn('faces',e)}return P};
})();
