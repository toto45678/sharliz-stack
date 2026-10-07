(()=>{
// keep unrelated random pieces out of the clip (special swinger hazards, sticky/magnet) — like SC.allowHz does for events
if(!window.__scPlain){window.__scPlain=1;
  // clock guard: on a busy machine the game's last real animation frame can fire late, after the virtual clock took over, and turn the
  // clock back (negative dt). Between recorded frames update/render are parked, and time/last are put back if anything ran meanwhile.
  const U=update,R=render,nop=()=>{},st=__man.step;let quiet=false,park=null;
  __man.step=function(ms){if(park){time=park.t;last=park.l}update=U;render=quiet?nop:R;try{return st.call(this,ms)}finally{park={t:time,l:last};update=nop;render=nop}};
  // same game clock every run (wind, swing bob); the unrecorded tower build skips drawing (else the GPU backlog stalls the first screenshot)
  const _su=window.SC_setup;window.SC_setup=i=>{park=null;time=500;last=__man.now();quiet=true;try{return _su(i)}finally{quiet=false;flyCoins.length=0;try{cv.style.filter=''}catch(e){}}};  // (a combo party during the build can leave a hue filter on the canvas)
  const _hs=hzSwinger;hzSwinger=function(){if(SC.allowHz)return _hs.apply(this,arguments)};
  const _sp=spawnSwinger;spawnSwinger=function(){const n=popups.length;const r=_sp.apply(this,arguments);if(!SC.allowHz&&swinger&&(swinger.kind==='sticky'||swinger.kind==='magnet')){swinger.kind=null;popups.length=n}return r}}
// Shifting dunes (desertS, passive): the sand slides the whole tower left and right (amp .38, 7 s period). Aim for where it will be.
// same colours in both scenes
const paint=()=>{if(swinger)swinger.color=COLORS[0];const cs=[COLORS[1],COLORS[3],COLORS[2],COLORS[1]];tower.forEach((s,i)=>{if(i)s.color=cs[i%cs.length]})};
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const fallT=()=>Math.sqrt(2*Math.max(1,yOf(tower.length)-swingY())/(BH*30*zone().grav));
const amp=()=>.38+lvInZone()*.03,W7=Math.PI*2/7;
const oAt=tt=>amp()*Math.sin(tt*W7);
const ahead=()=>{const m=hz.m.dunes;return oAt(m.t+fallT())-oAt(m.t)};   // how far the tower slides while a Sharliz falls
// start the slide at a chosen phase (moving right) and keep the wind calm — the dunes are the topic
function setPhase(th){const m=hz.m.dunes,o=amp()*Math.sin(th),d=o-m.last;for(const s of tower)s.xs+=d;m.t=th/W7;m.last=o;windSeed=-(time+1.6)*.33}
function dash(g,x1,y1,x2,y2,col,w=4){g.save();g.setLineDash([9,8]);g.lineCap='round';g.lineWidth=w+4;g.strokeStyle=SC_lib.INK;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.lineWidth=w;g.strokeStyle=col;g.stroke();g.restore()}
// dashed outline of a Sharliz (where the top of the tower WAS)
function ghost(g,x,y,col){g.save();g.translate(x,y);g.setLineDash([8,7]);g.lineWidth=7;g.strokeStyle=SC_lib.INK;g.beginPath();g.ellipse(0,0,S*.5,BH*.5,0,0,7);g.stroke();g.lineWidth=3.5;g.strokeStyle=col;g.stroke();g.restore()}
// the slide: arrows under the top Sharliz pointing the way the sand moves it
function slideArrow(I,T,col,dir){const y=T.y+BH*.62;I.push({k:'arrow',x1:T.x-dir*28,y1:y,x2:T.x+dir*58,y2:y,col,p:1})}
const A={level:181,floors:5,dur:9,seed:9,fadeOut:true,
  start(){paint();setPhase(-.95);const M=SC.mem;M.h0=hearts;M.g=topScreen();M.gxs=tower[tower.length-1].xs;M.h={x:W*.8,y:sw().y+150};M.press=-9},
  speed(t){const M=SC.mem;if(M.hitT!=null)return t-M.hitT<.5?.5:1;if(M.dropT!=null)return .4;if(tower[tower.length-1].xs-M.gxs>.45&&swinger&&!swinger.entering&&Math.abs(swinger.xs-M.gxs)<.4)return .45;return 1},
  tick(t){const M=SC.mem,I=[],s=sw(),T=topScreen(),m=hz.m.dunes;
    if(M.hitT==null&&hearts<M.h0){M.hitT=t;M.hp=M.land||{x:s.x,y:T.y};this.dur=t+1.7}
    if(dropping)M.land={x:xOf(dropping.xs),y:T.y};
    if(M.hitT==null){I.push({k:'fn',f:g=>ghost(g,M.g.x,M.g.y,'#ffffff')});
      if(M.dropT==null){slideArrow(I,T,'#ef4444',Math.sign(ahead())||1);I.push({k:'ring',x:T.x,y:T.y,r:56,col:'#ef4444'})}
      // the player aims where the tower WAS
      if(M.dropT==null&&state==='aim'&&swinger&&!swinger.entering){I.push({k:'fn',f:g=>dash(g,M.g.x,M.g.y-BH*.62,M.g.x,s.y+BH*.62,'rgba(255,255,255,.85)',3)});
        if(tower[tower.length-1].xs-M.gxs>.52&&Math.abs(swinger.xs-M.gxs)<.03){drop();M.dropT=t;M.press=t;M.tap={x:M.h.x,y:M.h.y,t}}}}
    if(M.tap){const p=(t-M.tap.t)/.5;if(p<1)I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p})}
    if(M.hitT!=null){const p=Math.min(1,(t-M.hitT)/.45);I.push({k:'ring',x:M.hp.x,y:M.hp.y,r:52,col:'#ef4444'});I.push({k:'badge',x:Math.max(44,Math.min(W-44,M.hp.x+(M.hp.x<W/2?-62:62))),y:M.hp.y-74,ok:false,p})}
    if(M.dropT==null||t-M.dropT<.45)I.push({k:'hand',x:M.h.x,y:M.h.y,press:Math.max(0,1-(t-M.press)/.18)});
    return I}};
const B={level:181,floors:5,dur:12,seed:9,fadeIn:true,fadeOut:true,
  start(){paint();setPhase(-.95);const M=SC.mem;M.gxs=tower[tower.length-1].xs;M.h={x:W*.8,y:sw().y+150};M.press=-9;M.p0=lv.perfect},
  speed(t){const M=SC.mem;if(M.doneT!=null)return 1;if(M.dropT!=null)return .45;if(tower[tower.length-1].xs-M.gxs>.4&&swinger&&!swinger.entering){const tx=tower[tower.length-1].xs+ahead()-wind*fallT();if(Math.abs(swinger.xs-tx)<.4)return .4}return 1},
  tick(t){const M=SC.mem,I=[],s=sw(),T=topScreen();
    if(M.dropT==null){const dir=Math.sign(ahead())||1,txs=tower[tower.length-1].xs+ahead(),tx=xOf(txs);slideArrow(I,T,'#facc15',dir);
      // where the top WILL be when the Sharliz arrives
      I.push({k:'fn',f:g=>{ghost(g,tx,T.y,'#facc15');dash(g,tx,T.y-BH*.62,tx,s.y+BH*.62,'#facc15',4)}});
      if(tower[tower.length-1].xs-M.gxs>.45&&state==='aim'&&swinger&&!swinger.entering&&Math.abs(swinger.xs+wind*fallT()-txs)<.022){drop();M.dropT=t;M.press=t;M.tap={x:M.h.x,y:M.h.y,t};M.tx=tx}}
    if(M.dropT!=null&&M.doneT==null&&dropping)I.push({k:'fn',f:g=>dash(g,M.tx,T.y-BH*.62,M.tx,s.y+BH*.62,'#22c55e',4)});
    if(M.tap){const p=(t-M.tap.t)/.5;if(p<1){I.push({k:'ripple',x:M.tap.x,y:M.tap.y,p});I.push({k:'ring',x:M.tap.x,y:M.tap.y,r:26+p*8,col:'#22c55e'})}}
    if(M.doneT==null&&lv.perfect>M.p0){M.doneT=t;M.bp={x:W/2,y:s.y+105};this.dur=t+1.7}
    if(M.doneT!=null){const p=Math.min(1,(t-M.doneT)/.45),L=tower[tower.length-1];if(t-M.doneT<.9)I.push({k:'ring',x:xOf(L.xs),y:sy(yOf(tower.length-1)),r:54,col:'#22c55e'});I.push({k:'badge',x:M.bp.x,y:M.bp.y,ok:true,p})}
    const pr=Math.max(0,1-(t-M.press)/.18);
    if(M.doneT==null)I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});else{M.h.x+=(W*.92-M.h.x)*.12;M.h.y+=(s.y+420-M.h.y)*.12;I.push({k:'hand',x:M.h.x,y:M.h.y,press:0})}
    return I}};
SC.scenes=[A,B];
})();
