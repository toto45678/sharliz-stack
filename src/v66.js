/* ===== v66: BALLERINA SUIT (Tzach, Oct 8: "its power kills every obstacle that attacks the Sharliz") =====
   Outfit 'ballet' (coins only, 6000). Power: less than a second after an attacker comes into view, the Sharliz does a pirouette
   and a pink ribbon star flies out and knocks it out — every enemy and attack of the 8 classic hazards and the 22 new
   mechanics, also when a boss sends them. Moving ground (dunes, waves, conveyor) is the world itself and stays; rising
   lava is pushed back down when it gets close. No points/missions for her kills (they are not the player's taps).
   Cost (fair powers): one heart less, and like every powered item it slows the swing ×0.95 (v49). */
Object.assign(I18N.en,{ps_ballet:'Knocks out every attacker',ng_heart1:'One heart less',m_pirouette:'Pirouette!'});
Object.assign(I18N.he,{ps_ballet:'מחסלת כל מי שתוקף',ng_heart1:'לב אחד פחות',m_pirouette:'פירואט!'});
WOUT.ballet={p:6000,n:['Ballerina suit','חליפת בלרינה']};
GEAR_FX.outfit.ballet={ballet:1,hearts:-1};
const balOn=()=>mode!=='duo'&&lookNow().outfit==='ballet'&&wOwned('outfit','ballet');
{const _cc=csChips;csChips=function(F){const out=_cc(F);if(F&&F.ballet){out.unshift(['+',t('ps_ballet')]);out.push(['-',t('ng_heart1')])}return out}}

/* ---------- who is attacking right now: {o (marker object), tag, pos() screen xy, kill(), alive()} ---------- */
const BAL_KINDS={bomb:1,balloon:1,ice:1,giant:1,tiny:1,jelly:1};
const BAL={zaps:[],seen:new WeakMap(),DELAY:.45,FLY:.25};
function balTargets(){const L=[],M=hz.m||{},add=(o,tag,pos,kill,alive)=>L.push({o,tag,pos,kill,alive:alive||(()=>true)});
  const on=p=>p.x>-S*.6&&p.x<W+S*.6&&p.y>-S&&p.y<H+S;
  // classic hazards
  const c=hz.crow;if(c&&c.phase==='come'&&c.x&&on(c))add(c,'crow',()=>({x:c.x,y:c.y}),()=>{c.phase='shoo';c.t=0;track('shoo');burst(c.x,scrToW(c.y),['#1a1020','#3b2a4a','#ffffff'],10,160)},()=>hz.crow===c&&c.phase==='come');
  const o=hz.octo;if(o&&o.phase==='peek')add(o,'octo',()=>octoPos(o),()=>{o.phase='hide';o.t=0},()=>hz.octo===o&&o.phase==='peek');
  const k=hz.ink;if(k&&k.t<k.dur-1)add(k,'ink',()=>({x:k.cx,y:sy(k.wy)}),()=>{k.t=Math.max(k.t,k.dur-.7)},()=>hz.ink===k);
  const g=hz.gust;if(g)add(g,'gust',()=>({x:g.dir>0?S*.9:W-S*.9,y:H*.42}),()=>{hz.gust=null;hz.gustK=1;hz.gustV=0},()=>hz.gust===g);
  const q=hz.quake;if(q)add(q,'quake',()=>({x:W/2,y:Math.min(H-40,sy(0))}),()=>{hz.quake=null},()=>hz.quake===q);
  for(const s of [swinger,dropping])if(s&&BAL_KINDS[s.kind]){const kd=s.kind,p=()=>s===swinger?swingScr():{x:xOf(s.xs),y:sy(s.y)};
    add(s,'kind_'+kd,p,()=>{if(kd==='bomb')track('defuse');s.kind=null;delete s.fuse;delete s.sz;delete s.wt;jig(s,1.2)},()=>s.kind===kd&&(s===swinger||s===dropping))}
  const top=tower[tower.length-1];if(top&&top.floatT>0&&tower.length>1)add(top,'float',()=>topScreen(),()=>{top.floatT=0;top.inflate=0;if(top.kind==='balloon')top.kind=null},()=>top.floatT>0&&tower[tower.length-1]===top);
  // the new mechanics
  const m=k=>M[k];let x;
  if(x=m('bats'))for(const b of x.list)if(x.t>=b.d&&!b.gone&&!b.vy&&on(b))add(b,'bat',()=>({x:b.x,y:b.y}),()=>{b.vy=-260},()=>!b.gone&&!b.vy);
  if(x=m('blackout')){const q=x;add(q,'blackout',()=>({x:W/2,y:H*.28}),()=>{nightExtra=0;delete hz.m.blackout},()=>hz.m.blackout===q)}
  if((x=m('scorpion'))&&!x.fly){const q=x;add(q,'scorpion',()=>MECH.scorpion.pos(q),()=>{const p=MECH.scorpion.pos(q);q.fly={x:p.x,y:p.y,vx:q.side*420,vy:-360,r:0}},()=>hz.m.scorpion===q&&!q.fly)}
  if((x=m('icicle'))&&!x.shard){const q=x;add(q,'icicle',()=>({x:q.x,y:q.y+q.len*.5}),()=>{q.shard=.01;burst(q.x,scrToW(q.y+q.len*.5),['#e8fbff','#8fd7f2','#ffffff'],14)},()=>hz.m.icicle===q&&!q.shard)}
  if(x=m('jellyfish'))for(const j of x.list)if(!j.pop&&j.y<H-S*.3)add(j,'jf',()=>({x:xOf(j.xs),y:j.y}),()=>{j.pop=.01},()=>!j.pop);
  if(x=m('lava')){const q=x,top=tower.length-1;if(top>0&&q.lvl>top-1.4)add(q,'lava',()=>({x:W/2,y:Math.min(H-30,sy(-.2*BH-(q.lvl+.5)*STEP))}),()=>{q.lvl=Math.max(-2.2,q.lvl-1.6)},()=>!!hz.m.lava)}
  if(x=m('portal')){const q=x;add(q,'portal',()=>({x:Math.max(S*.6,xOf(-rangeXs())-S*.3),y:sy(swingY())}),()=>{hz.portal=null;delete hz.m.portal},()=>hz.m.portal===q)}
  if(x=m('tornado')){const q=x;add(q,'tornado',()=>({x:q.dir>0?W*.1:W*.9,y:H*.5}),()=>{delete hz.m.tornado},()=>hz.m.tornado===q)}
  if((x=m('newspaper'))&&!x.torn){const q=x;add(q,'paper',()=>({x:q.x,y:q.y}),()=>{q.torn=.01},()=>hz.m.newspaper===q&&!q.torn)}
  if((x=m('hail'))&&x.t<x.dur){const q=x;add(q,'hail',()=>{const c=q.c.find(c=>!c.hit);return c?{x:c.x,y:Math.max(c.y,hudBottom+30)}:{x:topScreen().x,y:hudBottom+40}},
    ()=>{q.t=Math.max(q.t,q.dur);for(const c of q.c)if(!c.hit){c.hit=1;burst(c.x,scrToW(c.y),[c.col,'#ffffff'],4,100)}},()=>hz.m.hail===q&&q.t<q.dur)}
  if((x=m('freeze'))&&swinger&&(swinger.frozen>0||swinger.fast>0)){const q=x,s=swinger;add(q,'freeze',()=>swingScr(),()=>{s.frozen=0;s.fast=0;delete hz.m.freeze;burst(xOf(s.xs),swingY(),['#e8fbff','#8fd7f2'],10)},()=>hz.m.freeze===q&&swinger===s)}
  if((x=m('meteor'))&&!x.smash&&!x.hit){const q=x;add(q,'meteor',()=>{const p=MECH.meteor.mpos(q);return {x:clamp(p.x,S*.6,W-S*.6),y:Math.max(p.y,hudBottom+S*.6)}},()=>{const p=MECH.meteor.mpos(q);q.smash=.01;burst(p.x,scrToW(p.y),['#5a3a2e','#ff8a00','#ffd60a'],16)},()=>hz.m.meteor===q&&!q.smash&&!q.hit)}
  if(x=m('gravity')){const q=x;add(q,'gravity',()=>({x:W/2,y:H*.55}),()=>{hz.gravK=1;delete hz.m.gravity},()=>hz.m.gravity===q)}
  if((x=m('lightning'))&&!x.done&&!x.gone){const q=x;add(q,'lightning',()=>({x:q.x,y:hudBottom+40}),()=>{q.gone=.01},()=>hz.m.lightning===q&&!q.done&&!q.gone)}
  if((x=m('monkey'))&&!x.scared){const q=x;add(q,'monkey',()=>MECH.monkey.pos(q),()=>{q.scared=.01},()=>hz.m.monkey===q&&!q.scared)}
  if((x=m('ghost'))&&!x.done){const q=x;add(q,'ghost',()=>MECH.ghost.pos(q),()=>{q.done=.01},()=>hz.m.ghost===q&&!q.done)}
  if(swinger&&swinger.ghost>0){const s=swinger;add(s,'ghosted',()=>swingScr(),()=>{s.ghost=0},()=>s.ghost>0)}
  if(x=m('cloud')){const q=x,y=()=>sy(swingY())+BH*.25;if(q.x>S*.3&&q.x<W-S*.3)add(q,'cloud',()=>({x:q.x,y:y()}),()=>{delete hz.m.cloud;if(dropping)dropping.cloudT=0;burst(q.x,scrToW(y()),['#ffffff','#e8f2ff'],14,180)},()=>hz.m.cloud===q)}
  if((x=m('egg'))&&!x.got&&!x.hatched){const q=x;add(q,'egg',()=>{const tp=topScreen();return {x:tp.x+S*.15,y:tp.y-BH*.75}},()=>{q.got=.01},()=>hz.m.egg===q&&!q.got&&!q.hatched)}
  if(x=m('mirror')){const q=x;add(q,'mirror',()=>({x:W/2,y:H*.4}),()=>{try{cv.style.transform=''}catch(e){}delete hz.m.mirror},()=>hz.m.mirror===q)}
  return L}

/* ---------- the pirouette: wait a moment (so you see what came), spin, throw a ribbon star, poof ---------- */
function balSrc(){if(swinger&&state==='aim'&&!swinger.entering){const p=swingScr();return {s:swinger,x:p.x,y:p.y}}const n=tower.length;if(!n)return {s:null,x:W/2,y:H*.6};const p=topScreen();return {s:tower[n-1],x:p.x,y:p.y-BH*.1}}
function balMark(o,tag){let r=BAL.seen.get(o);if(!r)BAL.seen.set(o,r={});return r[tag]||(r[tag]={s:time,z:0})}
function balUpdate(dt){
  if(balOn()&&['aim','wait','drop'].includes(state)){
    for(const T of balTargets()){const p=T.pos();if(!(p.x>S*.25&&p.x<W-S*.25&&p.y>hudBottom*.5&&p.y<H-S*.2))continue;   // the timer starts once you can see it
      const r=balMark(T.o,T.tag);if(r.z||time-r.s<BAL.DELAY)continue;r.z=1;
      const src=balSrc();if(src.s)src.s.spinAt=time;BAL.zaps.push({T,r,x0:src.x,y0:src.y,t:0,bend:Math.random()<.5?-1:1});try{sfx.zap()}catch(e){}}}
  for(const z of BAL.zaps){z.t+=dt/BAL.FLY;if(z.t<1){if(z.T.alive())z.last=z.T.pos();continue}
    if(!z.done){z.done=1;let p=z.last||{x:z.x0,y:z.y0};if(z.T.alive()){p=z.T.pos();try{z.T.kill()}catch(e){}z.hit={x:p.x,y:p.y,t:0};
        burst(p.x,scrToW(p.y),['#ff5fb4','#ffd1ea','#ffffff','#ffd23f'],18,240);try{sfx.pop()}catch(e){}vib(10)}
      const r=BAL.seen.get(z.T.o);if(r)delete r[z.T.tag]}            // a knocked-out attacker leaves the list; if the same thing comes back (a boss re-arms a piece) it is fought again
    if(z.hit)z.hit.t+=dt}
  BAL.zaps=BAL.zaps.filter(z=>!z.done||(z.hit&&z.hit.t<.8))}
function balPath(z,e){const p=z.last||z.T.pos(),dx=p.x-z.x0,dy=p.y-z.y0,cx=(z.x0+p.x)/2-dy*.35*z.bend,cy=(z.y0+p.y)/2+dx*.35*z.bend,u=1-e;
  return {x:u*u*z.x0+2*u*e*cx+e*e*p.x,y:u*u*z.y0+2*u*e*cy+e*e*p.y}}
function balDraw(){if(!BAL.zaps.length)return;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  for(const z of BAL.zaps){
    if(z.t<1){const e=Math.max(0,z.t),tail=Math.max(0,e-.45),N=10;
      // the spin ring around the dancer
      const sp=Math.min(1,z.t*1.6);ctx.save();ctx.globalAlpha=1-sp*.6;ctx.strokeStyle='#ff5fb4';ctx.lineWidth=3;ctx.setLineDash([10,7]);ctx.lineDashOffset=-time*80;
      ctx.beginPath();ctx.ellipse(z.x0,z.y0+BH*.42,S*(.75+sp*.35),S*(.2+sp*.08),0,0,7);ctx.stroke();ctx.restore();
      // ribbon trail (ink edge, pink, white core)
      const pts=[];for(let i=0;i<=N;i++)pts.push(balPath(z,tail+(e-tail)*i/N));
      for(const [w,c] of [[S*.2,'#120d2b'],[S*.15,'#ff5fb4'],[S*.06,'#fff0f8']]){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke()}
      const h=pts[pts.length-1];ctx.save();ctx.translate(h.x,h.y);ctx.rotate(time*14);ctx.fillStyle='#ffd23f';ctx.strokeStyle=INK;ctx.lineWidth=3;star(S*.3);ctx.stroke();ctx.fill();ctx.restore()}
    else if(z.hit){const q=z.hit,k=q.t/.8;
      ctx.save();ctx.globalAlpha=Math.max(0,1-k);ctx.strokeStyle='#ff5fb4';ctx.lineWidth=4;ctx.beginPath();ctx.arc(q.x,q.y,S*(.4+k*1.1),0,7);ctx.stroke();
      for(let i=0;i<6;i++){const a=i/6*Math.PI*2+k*2,r=S*(.5+k*1.2);ctx.save();ctx.translate(q.x+Math.cos(a)*r,q.y+Math.sin(a)*r);ctx.fillStyle=i%2?'#ffd1ea':'#ffd23f';ctx.strokeStyle=INK;ctx.lineWidth=2;star(S*.13);ctx.stroke();ctx.fill();ctx.restore()}ctx.restore();
      if(z===BAL.zaps.find(w=>w.hit&&Math.hypot(w.hit.x-q.x,w.hit.y-q.y)<S*1.5))gameText(ctx,t('m_pirouette'),clamp(q.x,S*1.4,W-S*1.4),q.y-S*.7<H*.26?q.y+S*1.1+k*S*.3:q.y-S*.7-k*S*.6,Math.round(S*.42),POPPAL.wow,-.08)}}
  ctx.restore()}

/* ---------- hooks ---------- */
{const _uh=updateHazards;updateHazards=function(dt){_uh(dt);try{balUpdate(dt)}catch(e){}}}
{const _df=drawHazardsFront;drawHazardsFront=function(){_df();try{balDraw()}catch(e){}}}
{const _rh=resetHazards;resetHazards=function(){_rh();BAL.zaps=[];BAL.seen=new WeakMap()}}
// the dancer spins: a quick turn around her own axis (scaleX through −1)
{const _ds=drawSharliz;drawSharliz=function(s,x,y,...a){const k=s&&s.spinAt!==undefined?(time-s.spinAt)/.45:9;if(!(k>=0&&k<1))return _ds(s,x,y,...a);
  const c=Math.cos(k*Math.PI*2);ctx.save();ctx.translate(x,y);ctx.scale(Math.sign(c)*Math.max(.08,Math.abs(c)),1);ctx.translate(-x,-y);try{return _ds(s,x,y,...a)}finally{ctx.restore()}}}

/* ---------- the suit in 3D: satin leotard, three pleated tutu layers with sequins, a bow and a little crystal ---------- */
function balTutuGeo(T,r0,r1,y0,amp,ph){const nA=160,nR=6,pos=[],idx=[];
  for(let i=0;i<=nA;i++){const a=i/nA*Math.PI*2,sc=1+.035*Math.sin(a*8+ph*2);for(let j=0;j<=nR;j++){const s=j/nR,r=r0+(r1-r0)*s*sc,y=y0-s*.1-s*s*.05+amp*Math.sin(a*18+ph)*s;pos.push(Math.cos(a)*r,y,Math.sin(a)*r)}}
  for(let i=0;i<nA;i++)for(let j=0;j<nR;j++){const p=i*(nR+1)+j,q=p+nR+1;idx.push(p,q,p+1,q,q+1,p+1)}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g}
function balEdge(T,r0,r1,y0,amp,ph,w){const pts=[];for(let i=0;i<160;i++){const a=i/160*Math.PI*2,r=r0+(r1-r0)*(1+.035*Math.sin(a*8+ph*2));pts.push(new T.Vector3(Math.cos(a)*r,y0-.15+amp*Math.sin(a*18+ph),Math.sin(a)*r))}
  return new T.TubeGeometry(new T.CatmullRomCurve3(pts,true),320,w,5,true)}
{const _bo=buildOutfit;buildOutfit=function(P,kind,base){if(kind!=='ballet')return _bo(P,kind,base);const T=P.T,s=P.outfitSlot;
  const satin=c=>wm(c,{roughness:.32,clearcoat:.35,sheen:1,sheenColor:new T.Color('#fff0f8'),sheenRoughness:.35});
  // leotard
  const pts=[];for(let i=0;i<=22;i++){const y=-.4+i/22*.3;pts.push(new T.Vector2(bodyR(y/.75)+.018,y))}
  winked(s,new T.LatheGeometry(pts,72),satin('#ff5fae'),null,1.015);
  const ny=-.1,trim=new T.Mesh(new T.TorusGeometry(bodyR(ny/.75)+.022,.022,10,72),satin('#ffd0e8'));trim.rotation.x=Math.PI/2;trim.position.y=ny;s.add(trim);
  for(let i=0;i<13;i++){const a=Math.PI*.2+i/12*Math.PI*.6,r=bodyR(ny/.75)+.04,b=wmesh(new T.SphereGeometry(.021,10,8),'#fffaf2',{roughness:.12,clearcoat:1});b.position.set(Math.cos(a)*r,ny-.012,Math.sin(a)*r);s.add(b)}
  // sequins on the leotard
  for(let i=0;i<26;i++){const y=-.36+((i*37)%26)/26*.26,a=(i*2.399)%(Math.PI*2),r=bodyR(y/.75)+.022;if(Math.sin(a)<.05)continue;const q=wmesh(new T.SphereGeometry(.011,6,5),i%3?'#ffffff':'#ffd23f',{emissive:i%3?'#ffd6ee':'#ffb300',emissiveIntensity:.5,metalness:.4});q.position.set(Math.cos(a)*r,y,Math.sin(a)*r);s.add(q)}
  // tutu: three pleated layers, palest on top
  const wy=-.36,r0=bodyR(wy/.75)-.01;
  [[0,.7,'#ff8cc6',.018,0,'#120d2b',.008],[.05,.64,'#ffb0d8',.016,1.3,'#e0559c',.006],[.1,.58,'#ffd8ec',.014,2.6,'#e0559c',.006]].forEach(([dy,r1,c,amp,ph,ec,ew])=>{
    s.add(new T.Mesh(balTutuGeo(T,r0,r1,wy+dy,amp,ph),wm(c,{side:T.DoubleSide,roughness:.55,clearcoat:.15,sheen:1,sheenColor:new T.Color('#ffffff'),sheenRoughness:.6})));
    s.add(new T.Mesh(balEdge(T,r0,r1,wy+dy,amp,ph,ew),new T.MeshBasicMaterial({color:ec})))});
  for(let i=0;i<34;i++){const a=i/34*Math.PI*2+.09,s1=.35+((i*7)%10)/10*.55,r=r0+(.58-r0)*s1,y=wy+.1-s1*.1-s1*s1*.05+.014*Math.sin(a*18+2.6)*s1+.012;
    const q=wmesh(new T.SphereGeometry(.012,6,5),i%4?'#ffffff':'#ffd23f',{emissive:i%4?'#ffe6f3':'#ffb300',emissiveIntensity:.6,metalness:.3});q.position.set(Math.cos(a)*r,y,Math.sin(a)*r);s.add(q)}
  // waistband + bow in front
  const wb=new T.Mesh(new T.TorusGeometry(bodyR(-.265/.75)+.025,.026,10,72),satin('#ff4fa3'));wb.rotation.x=Math.PI/2;wb.position.y=-.265;s.add(wb);
  const g=new T.Group();g.position.set(0,-.25,surfZ(0,-.25)+.045);s.add(g);
  for(const sx of[-1,1]){const w=winked(g,new T.ConeGeometry(.075,.15,20),satin('#ff4fa3'),null,1.1);w.rotation.z=sx*Math.PI/2;w.position.x=sx*.07;w.scale.z=.5;
    const tl=winked(g,new T.CapsuleGeometry(.018,.09,4,8),satin('#ff4fa3'),null,1.12);tl.position.set(sx*.035,-.07,-.005);tl.rotation.z=sx*.35}
  const kn=winked(g,new T.SphereGeometry(.035,14,10),'#fffaf2',{roughness:.12,clearcoat:1},1.1);kn.scale.z=.7;
  // little crystal on the chest
  const cy=-.155,gem=winked(s,new T.OctahedronGeometry(.04,0),'#e8f6ff',{roughness:.05,metalness:.2,clearcoat:1,emissive:'#bfe7ff',emissiveIntensity:.35},1.12);gem.position.set(0,cy,surfZ(0,cy)+.04);gem.scale.set(1,1.3,.6)}}
