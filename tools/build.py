import re,sys,os,json,time
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=os.path.join(ROOT,'src')
P=lambda *a:os.path.join(*a)
src=open(P(SRC,'base.html'),encoding='utf-8').read()
def rep(old,new,count=1):
    global src
    n=src.count(old)
    if n!=count: sys.exit(f'EDIT FAILED ({n} matches, want {count}): {old[:90]!r}')
    src=src.replace(old,new)

# ---- render: personalities, emotes, buddy at the base
rep("drawSharliz(s,xOf(s.xs)+ox+(s.slideX||0),yy,ox/(S*6)+collapseRot(i),mood,lookFor(i,n),s.squash+(mood==='strain'?.3:breath));",
    "{const pm=persMood(s,i,n,mood);mood=pm.mood;const px=xOf(s.xs)+ox+(s.slideX||0)+pm.dx;drawSharliz(s,px,yy+pm.dy,ox/(S*6)+collapseRot(i)+pm.rot,mood,pm.look||lookFor(i,n),s.squash+(mood==='strain'?.3:breath)+pm.sq);if(pm.emo)EMO.push([pm.emo,px,yy+pm.dy,s])}")
rep("  if(gag){ctx.save();if(gag.filter)","  drawEmotes();\n  if(gag){ctx.save();if(gag.filter)")
rep("\n  drawGround();\n","\n  drawGround();drawBuddyGame();\n")
# ---- perks wired into the rules
rep("const guideAlpha=()=>boost.laser>0?1:","const guideAlpha=()=>boost.laser>0||perk('aim')?1:")
rep("fever=8;partyT=1.6;","fever=perk('fever')?12:8;partyT=1.6;")
rep("const e=settings.easy?1.25:1;return [p*e,g*e,m]","const e=(settings.easy?1.25:1)*(perk('sticky')?1.12:1);return [p*e,g*e,m]")
# ---- weekly missions tracking
rep("function track(id,amt=1){if(mode==='duo')return;","function track(id,amt=1){if(mode==='duo')return;trackW(id,amt);")
rep("renderBoosterBar();track('wins');","renderBoosterBar();track('wins');if(lv.starsNow>=3)track('stars3');")
# ---- bake: personality features per colour
rep("const BAKE_V='b27';","const BAKE_V='b29';")
rep("if(col==='hero')applyLook(P,Object.assign({},L,{hat}));else applyLook(P,Object.assign({},LOOK0,{colorHex:col,color:'_',hat}));",
    "if(col==='hero'){applyLook(P,Object.assign({},L,{hat}));persBake(P,'hero')}else{applyLook(P,Object.assign({},LOOK0,{colorHex:col,color:'_',hat},PERS_LOOKX[PERS[col]]||{}));persBake(P,col)}")
rep("for(let f=0;f<faces;f++){setFace3(P,f);r.render(scene,cam);","for(let f=0;f<faces;f++){setFace3(P,f);persFace(P,f);r.render(scene,cam);")
# ---- lobby hero: carousel spin, nausea, buddies that move around you
rep("const P=H3.parts;if(!P)return false;const T=P.T,pet=!!H3.pet;","const P=H3.parts;if(!P)return false;const T=P.T,pet=!!H3.pet;spinStep(Math.min(.05,frameDt));")
rep("const cw=Math.ceil(size*(pet?3.4:2.6)),ch=Math.ceil(size*4.1),left=Math.round(G.stageX-cw/2-(pet?size*.17:0))",
    "const cw=Math.ceil(size*(pet?3.7:2.6)),ch=Math.ceil(size*4.1),left=Math.round(G.stageX-cw/2)")
rep("const g=H3.g,baseY=-ch/2+size*.32,hx=pet?size*.45:0;","const g=H3.g,baseY=-ch/2+size*.32,hx=0;")
rep("if(H3.pet){const u=H3.pet;petStep(u,time,frameDt);const ps=size*1.05;u.g.scale.setScalar(ps);u.g.position.x=-size*.5;u.g.position.z=size*.1;u.g.position.y=baseY+u.g.position.y*ps;u.g.lookAt(hx,baseY+size*.8,size*3)}\n  H3.r.render(H3.scene,H3.cam);",
    "let lk=0;if(H3.pet)lk=petLobby(H3.pet,size,baseY,hx);if(!SPIN.phase)g.rotation.y+=lk;sickPose(P,g,size,cw,ch,left,top);\n  H3.r.render(H3.scene,H3.cam);drawLobbyFx();")
rep("let wdDrag=null;tCv.addEventListener('pointermove',e=>{if(wdDrag&&W3.on){H3.yaw+=(e.clientX-wdDrag)*.012;wdDrag=e.clientX}});addEventListener('pointerup',()=>{wdDrag=null});",
    "let wdDrag=null;addEventListener('pointermove',e=>lobbyMove(e));addEventListener('pointerup',()=>lobbyUp());addEventListener('pointercancel',()=>lobbyUp());")
rep("tCv.addEventListener('pointerdown',e=>{if(W3.on){wdDrag=e.clientX;return}const G=lobbyGeo(),size=heroSize();if(Math.abs(e.clientX-G.stageX)<size*.8&&e.clientY<G.stageY&&e.clientY>G.stageY-size*2.2){audio();if(time-LOB.jump>.8){LOB.jump=time;LOB.tapN++;sfx.perfect(1+(LOB.tapN%3));vib(15)}}});",
    "tCv.addEventListener('pointerdown',e=>lobbyDown(e));")
# ---- wardrobe: premium buddies + perk line
rep("const b=document.createElement('button');b.className='wd-item'+(rr?' r-'+rr:'')",
    "const real=wIsReal(c,id),b=document.createElement('button');b.className='wd-item'+(real?' prem':'')+(rr?' r-'+rr:'')")
rep("(eq?`<em class=\"ok\">✓</em>`:owned?'':gate?`<em class=\"lk\"></em>`:`<em>",
    "(eq?`<em class=\"ok\">✓</em>`:owned?'':gate?`<em class=\"lk\"></em>`:real?`<em class=\"real\">${IAP.products[real].price}</em>`:`<em>")
rep("if(gate){b.disabled=true;b.textContent=gate}else{b.innerHTML=`<span></span> ${coinImg()}${p}`;b.querySelector('span').textContent=t('buyEquip');if(progress.coins<p)b.classList.add('poor');b.onclick=wBuy}ft.appendChild(b)}",
    "if(gate){b.disabled=true;b.textContent=gate}else if(wIsReal(s.cat,s.id)){b.className='btn wd-buy prem';b.innerHTML=`<span></span> ${IAP.products[wIsReal(s.cat,s.id)].price}`;b.querySelector('span').textContent=t('buyEquip');b.onclick=wBuy}else{b.innerHTML=`<span></span> ${coinImg()}${p}`;b.querySelector('span').textContent=t('buyEquip');if(progress.coins<p)b.classList.add('poor');b.onclick=wBuy}if(s.cat==='pet'&&PERKS[s.id]){const pk=document.createElement('div');pk.className='wd-perk';pk.innerHTML='<b></b> <span></span>';pk.querySelector('b').textContent=t('perk')+':';pk.querySelector('span').textContent=t('pk_'+PERKS[s.id]);ft.appendChild(pk)}ft.appendChild(b)}")
rep("else{const d=document.createElement('div');d.className='wd-hint';d.textContent=t(cat==='sets'?'setsHint':'wdHint');ft.appendChild(d)}}",
    "else{const pid=s&&s.cat==='pet'?s.id:cat==='pet'?petNow():null;if(pid&&PERKS[pid]){const pk=document.createElement('div');pk.className='wd-perk big';pk.innerHTML='<b></b> <span></span>';pk.querySelector('b').textContent=t('perk')+':';pk.querySelector('span').textContent=t('pk_'+PERKS[pid]);ft.appendChild(pk)}else{const d=document.createElement('div');d.className='wd-hint';d.textContent=t(cat==='sets'?'setsHint':'wdHint');ft.appendChild(d)}}}")
rep("function wBuy(){const s=W3.sel;if(!s)return;const {cat,id}=s,p=wPrice(cat,id);",
    "function wBuy(){const s=W3.sel;if(!s)return;const {cat,id}=s,p=wPrice(cat,id);if(wIsReal(cat,id)&&!wOwned(cat,id)){buyReal(cat,id);return}")
# ---- v29: animated boss sprites + foreground caps
rep("flatMap(z=>['w3b_'+z,'w3m_'+z,'w3f_'+z])];","flatMap(z=>['w3b_'+z,'w3m_'+z,'w3f_'+z]),'w3c_farm','w3c_ocean','w3c_volcano'];")
rep("bottom=groundAt(.36)+H*.12;ctx.drawImage(md,(W-w)/2,bottom-h,w,h)}","bottom=groundAt(.36)+H*.12;ctx.drawImage(md,(W-w)/2,bottom-h,w,h);const cp=pic('w3c_'+z.id);if(cp){const k=w/cp.naturalWidth;ctx.drawImage(cp,(W-w)/2,bottom-h-W3C_SEAM*k,w,cp.naturalHeight*k)}}")
rep("['back_'+zid,'mid_'+zid,'boss_'+zid,'boss_'+zid+'_hurt'].forEach(n=>{try{hzPic(n)}catch(e){}});","['back_'+zid,'mid_'+zid,'boss_'+zid,'boss_'+zid+'_hurt'].forEach(n=>{try{hzPic(n)}catch(e){}});try{bspLoad(zid)}catch(e){}try{b3Load(zid)}catch(e){}if(PIC_SET.has('w3c_'+zid))loadPic('w3c_'+zid);")
rep("  if(im){const w=bh*im.naturalWidth/im.naturalHeight;if(!b.dead){ctx.globalAlpha=.96;if(!(b.wind>0||b.hurt>0||b.stun>0))ctx.filter=scene&&scene.kit3?'brightness(.94)':'brightness(.8) saturate(.82)'}ctx.drawImage(im,-w/2,-bh/2,w,bh);ctx.filter='none'}",
    "  const bk=b.dead||b.stun>0||(b.hurt>0&&Math.floor(b.hurt*12)%2===0)?'hurt':'idle',m3=b3Ready(z),spd=m3?null:bspReady(z,bk);\n  if(m3||spd||im){if(!b.dead){ctx.globalAlpha=.96;if(!(b.wind>0||b.hurt>0||b.stun>0))ctx.filter=scene&&scene.kit3?'brightness(.94)':'brightness(.8) saturate(.82)'}if(m3)b3Draw(b,bh,m3);else if(spd)bspDraw(ctx,spd,bh,b.wind>0?ft*1.6:ft);else{const w=bh*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,-w/2,-bh/2,w,bh)}ctx.filter='none'}")
# ---- pre-release: all levels open (flip DEV_OPEN to false for the store build)
STORE='--store' in sys.argv
rep("const worldOpen=w=>progress.unlocked>(w-1)*LPZ;","const DEV_OPEN=true,openLv=()=>DEV_OPEN?TOTAL:progress.unlocked;\nconst worldOpen=w=>progress.unlocked>(w-1)*LPZ;")
rep("function fogged(zi){return ","function fogged(zi){if(DEV_OPEN)return false;return ")
rep("ZONES.forEach((z,zi)=>{if(zi*LPZ+1>progress.unlocked){","ZONES.forEach((z,zi)=>{if(zi*LPZ+1>openLv()){")
rep("locked=lv>progress.unlocked,current=","locked=lv>openLv(),current=")
rep("progress.unlocked=Math.min(TOTAL,Math.max(progress.unlocked,level+1));saveProgress();","if(!DEV_OPEN||level<=progress.unlocked)progress.unlocked=Math.min(TOTAL,Math.max(progress.unlocked,level+1));saveProgress();")
rep("function bossGateOpen(lvN){","function bossGateOpen(lvN){if(DEV_OPEN)return true;")
# ---- old saves without an owned list crashed the sticker badge
rep("function wallet(){progress.coins=progress.coins||0;","function wallet(){progress.owned=progress.owned||{};progress.coins=progress.coins||0;")
rep("return (progress.owned[cat]||[]).includes(id)}","return ((progress.owned||{})[cat]||[]).includes(id)}")
# ---- v35: 3D boss acting (attack moves, phase roar, entrance, defeat)
rep("if(b.dead&&k0>.7)return;","if(b.dead&&k0>(B3D_META[z]&&B3.load[z]==='ok'?1.5:.7))return;")
rep("if(b.dead){const sc=1+k0*1.3;ctx.scale(sc,sc);ctx.globalAlpha=Math.max(0,1-k0*1.45)}","if(b.dead&&!(B3D_META[z]&&B3.load[z]==='ok')){const sc=1+k0*1.3;ctx.scale(sc,sc);ctx.globalAlpha=Math.max(0,1-k0*1.45)}")
rep("sfx.roar();b.stun=3.4;BOSS_ATK[b.z](b);","sfx.roar();b.stun=3.4;b.atkAt=time;BOSS_ATK[b.z](b);")
rep("b.phase=ph;lv.cpBossHp=b.hp;","b.phase=ph;b.phAt=time;lv.cpBossHp=b.hp;")
# ---- cleanup: the 3D-kit worlds don't need the old painted fallback sets up front; old boss sprite sheets retired
rep("['w3b_'+zid,'w3m_'+zid,'w3f_'+zid,'far_'+zid,...[0,1,2,3,4,5,6,7,8].flatMap(i=>['g_'+zid+'_'+i,'s_'+zid+'_'+i])].forEach(loadPic);['back_'+zid,'mid_'+zid,'boss_'+zid,'boss_'+zid+'_hurt'].forEach(n=>{try{hzPic(n)}catch(e){}});try{bspLoad(zid)}catch(e){}",
    "['w3b_'+zid,'w3m_'+zid,'w3f_'+zid].forEach(loadPic);['boss_'+zid,'boss_'+zid+'_hurt'].forEach(n=>{try{hzPic(n)}catch(e){}});")
rep("if(PIC_SET.has('w3c_'+zid))loadPic('w3c_'+zid);try{rigFor(zid,0)}catch(e){}}","if(PIC_SET.has('w3c_'+zid))loadPic('w3c_'+zid);}")
rep("PIC_NAMES.filter(n=>/^(mapn?_|goal_tag|fb_)/.test(n)||/_farm(_|$)/.test(n)).forEach(loadPic);","PIC_NAMES.filter(n=>/^(mapn?_|goal_tag|fb_)/.test(n)||/^w3[bmfc]_farm$/.test(n)).forEach(loadPic);")
rep("if(popReady(z.id)||kit3Ready(z.id)){buildPopScene(z);return}","if(kit3Ready(z.id)||popReady(z.id)){buildPopScene(z);return}")
# ---- v31: 3D comic gags
rep("if(gag){ctx.save();if(gag.filter)ctx.filter=gag.filter;drawAnim(ctx,gag.name,gag.t,gag.x,sy(gag.wy)+BH/2,BH);ctx.restore()}",
    "if(gag){if(gag.g3)g3Draw(gag);else{ctx.save();if(gag.filter)ctx.filter=gag.filter;drawAnim(ctx,gag.name,gag.t,gag.x,sy(gag.wy)+BH/2,BH);ctx.restore()}}")
rep("  if(survivor>0&&animReady(name)&&!reduceMotion){","  const useG3=!animReady(name)&&!reduceMotion&&g3Init();\n  if(survivor>0&&(animReady(name)||useG3)&&!reduceMotion){")
rep("sfx.trombone();s.hidden=true;gag={name,filter,t:0,x:xOf(s.xs),wy:yOf(survivor)};\n    await wait(animLen(name)*1000+150);",
    "sfx.trombone();s.hidden=true;gag={name,filter,t:0,x:xOf(s.xs),wy:yOf(survivor),g3:useG3,col:s.color};\n    await wait((useG3?g3Len(name):animLen(name))*1000+150);")
rep("if(animReady('dance')&&!reduceMotion){setTimeout(()=>{if(state!=='win')return;s0.hidden=true;gag={name:'dance',filter:'',t:0,x:xOf(s0.xs),wy:yOf(tower.length-1)}},250)}",
    "const dG3=!animReady('dance')&&!reduceMotion&&g3Init();if((animReady('dance')||dG3)&&!reduceMotion){setTimeout(()=>{if(state!=='win')return;s0.hidden=true;gag={name:'dance',filter:'',t:0,x:xOf(s0.xs),wy:yOf(tower.length-1),g3:dG3,col:s0.color}},250)}")
# ---- v36: smooth character outline while swinging (continuous sheared strips instead of 18 stepped ones)
rep("bodyTop=ay-bh,N=18;","bodyTop=ay-bh,N=28;")
rep(",yd1=-(ay-r1)*k*syk,o=off(t);",",yd1=-(ay-r1)*k*syk,o0=off(clamp((r0-bodyTop)/bh,0,1)),o1=off(clamp((r1-bodyTop)/bh,0,1)),sh=(o1-o0)/((yd1-yd0)||1);")
rep("ctx.save();ctx.translate(o,0);ctx.scale(flip,1);","ctx.save();ctx.transform(1,0,sh,1,o0-sh*yd0,0);ctx.imageSmoothingQuality='high';ctx.scale(flip,1);")
# ---- v36: landing feedback smaller, beside the tower, shorter; toast lane drawn last
rep("size=Math.min(W*.14,62)*sc,px=clamp(p.x,W*.32,W*.68),py=Math.max(sy(p.y),140);","size=Math.min(W*.1,44)*sc,px=clamp(p.x+(p.x<W/2?1:-1)*S*1.8,W*.22,W*.78),py=Math.max(sy(p.y)+BH*.6,150);")
rep("life:key?1.25:1.1,max:key?1.25:1.1","life:key?.95:1.1,max:key?.95:1.1")
rep("  ctx.restore();\n}\nfunction star(r){","  ctx.restore();\n  drawToasts();\n}\nfunction star(r){")
# ---- v38: bug hunt fixes
# boss gate "close" left the player stuck on the finished level (shows once DEV_OPEN=false)
rep("sub:t('gateSub',{n:gateNeed(zi),h:worldStars(zi)}),actions:[{label:t('close'),primary:true,fn:hideOverlay}]",
    "sub:t('gateSub',{n:gateNeed(zi),h:worldStars(zi)}),actions:[{label:t('close'),primary:true,fn:()=>{if(state==='map'||state==='title')hideOverlay();else go(()=>openMap())}}]")
# boss killed by a star while the tower was collapsing -> the heart loss cancelled the win
rep("sfx.crash();loseHeart(t('crash'),W/2,yOf(k),true,'whoops');","sfx.crash();if(hz.boss&&hz.boss.dead)return;loseHeart(t('crash'),W/2,yOf(k),true,'whoops');")
# ...and a piece landing / missing right after the killing blow pulled the game back to 'wait' -> the win never fired (bot: levels 10, 20)
rep("state='bossdown';swinger=null;setTimeout(()=>{if(state==='bossdown')win()},1500)","state='bossdown';swinger=null;setTimeout(()=>{if(hz.boss===b&&b.dead&&state!=='win'&&state!=='over')win()},1500)")
rep("  state='wait';spawnAt=time+.25;updateHud();\n}\nfunction startCollapse","  if(hz.boss&&hz.boss.dead){if(state!=='win'&&state!=='over')state='bossdown';updateHud();return}\n  state='wait';spawnAt=time+.25;updateHud();\n}\nfunction startCollapse")
rep("function loseHeart(msg,x,y,silent,key){","function loseHeart(msg,x,y,silent,key){if(hz.boss&&hz.boss.dead)return;")
# pause -> restart in endless/daily/duo kept the old run (endless coins could be farmed)
rep("{label:t('restart'),icon:'restart',fn:()=>go(()=>{score=levelStartScore;startLevel()})}","{label:t('restart'),icon:'restart',fn:()=>go(()=>{if(mode!=='levels'){startMode(mode);return}score=levelStartScore;startLevel()})}")
# the game clock ran during pause / intro cards: boss attacked right after "got it", fast-mission timer counted pauses
rep("if(state==='paused'||state==='intro') return;","if(state==='paused'||state==='intro'){if(lv)lv.t0+=dt;if(hz){if(hz.next)hz.next+=dt;if(hz.coinNext)hz.coinNext+=dt;if(hz.boss)hz.boss.atk+=dt}if(spawnAt)spawnAt+=dt;return}")
# fever / slow-mo / shake carried into the next level
rep("cv.style.filter='';wind=0;","cv.style.filter='';wind=0;fever=0;slowmoT=0;shake=0;")
# a boss wind-up from the previous attempt could fire into a restarted level
rep("setTimeout(()=>{if(!hz.boss||hz.boss.dead||!['aim','wait','drop'].includes(state))return;","setTimeout(()=>{if(hz.boss!==b||b.dead||!['aim','wait','drop'].includes(state))return;")
# iOS 'interrupted' audio (call / Siri) never resumed
rep("if(actx&&actx.state==='suspended') actx.resume(); return actx;","if(actx&&actx.state!=='running'){try{const p=actx.resume();if(p&&p.catch)p.catch(()=>{})}catch(e){}} return actx;")
# world transition canvas: 100vh is taller than the visible area in iOS Safari
rep("canvas.wt{position:fixed;inset:0;width:100vw;height:100vh;z-index:98}","canvas.wt{position:fixed;inset:0;width:100%;height:100%;z-index:98}")
# saves without a stars list (old / imported codes) crashed every launch
rep("if(p&&p.unlocked)progress=p}catch(e){}","if(p&&p.unlocked)progress=p}catch(e){}\nprogress.stars=Array.isArray(progress.stars)?progress.stars:[];progress.unlocked=Math.max(1,+progress.unlocked||1);")
rep("function wallet(){progress.owned=progress.owned||{};","function wallet(){progress.owned=progress.owned||{};if(!Array.isArray(progress.stars))progress.stars=[];")
rep("if(!o||!o.unlocked)throw 0;progress=o;wallet();saveProgress();popupToast(t('loaded'));updateWalletUI()","if(!o||!o.unlocked)throw 0;progress=o;wallet();saveProgress();popupToast(t('loaded'));updateWalletUI();try{rebakeIfNeeded()}catch(e){}")
# boosters could be spent after the last heart was lost
rep("function useBooster(id){\n  const inv=wallet().inv;if(!inv[id])return;","function useBooster(id){\n  if(state==='over'||state==='win'||state==='bossdown')return;const inv=wallet().inv;if(!inv[id])return;")
rep("if(hearts<=0){state='over';setTimeout(failGag,900)}","if(hearts<=0){state='over';renderBoosterBar();setTimeout(failGag,900)}")
# mission / sticker badges on the map went stale
rep("renderBoosterBar();if(typeof wBadge==='function')wBadge()}","renderBoosterBar();if(typeof wBadge==='function')wBadge();try{missionBadge();if(typeof stkBadge==='function')stkBadge()}catch(e){}}")
# cancelling the share sheet still opened the photo screen
rep("await navigator.share({files:[file],title:'Sharliz Stack'});return}}catch(e){}","await navigator.share({files:[file],title:'Sharliz Stack'});return}}catch(e){if(e&&e.name==='AbortError')return}")
# WebGL context lost during the character bake cached invisible characters forever
rep("cells.push([f*cw,0,cw,ch,cw/2,top*P_,1.5*P_,P_])}\n","cells.push([f*cw,0,cw,ch,cw/2,top*P_,1.5*P_,P_])}\n    if(r.getContext().isContextLost()){if(++BAKE_LOST<900){ci--;return true}}\n")
rep("function rebakeIfNeeded(){","var BAKE_LOST=0;\nfunction rebakeIfNeeded(){")
rep("function bakeChars0(){","function bakeChars0(){BAKE_LOST=0;")
rep("CHARS[col]={pic:key,cells,b3d:true};bakePut(col,bakeSig(col,L,hat),sheet,cells);return true}}","CHARS[col]={pic:key,cells,b3d:true};if(BAKE_LOST<900)bakePut(col,bakeSig(col,L,hat),sheet,cells);return true}}")
# lighting (environment map) vanished after iOS restored a lost WebGL context
rep("const pm=new T.PMREMGenerator(r);scene.environment=pm.fromScene(env,.03).texture;pm.dispose();",
    "const regen=()=>{const pm=new T.PMREMGenerator(r);scene.environment=pm.fromScene(env,.03).texture;pm.dispose()};regen();r.domElement.addEventListener('webglcontextrestored',()=>setTimeout(()=>{try{regen()}catch(e){}},0));")
# card animations kept drawing into the hidden card during the next level
rep("(function loop(now){if(!c.isConnected)return;","(function loop(now){if(!c.isConnected||c.closest('[hidden]'))return;",2)
# ---- v37: bigger dancing hero on the victory popup
# ---- lobby logo: painted title art (art/logo_he|en.webp, made in tools/brand) instead of the CSS text
rep("function buildLogo(){bigText(document.getElementById('logo1'),t('name1'));bigText(document.getElementById('logo2'),t('name2'))}",
    "function buildLogo(){const l=document.querySelector('#title .logo');if(!l)return;l.classList.add('img');l.innerHTML=`<img src=\"art/logo_${lang==='he'?'he':'en'}.webp\" alt=\"${t('name1')} ${t('name2')}\" draggable=\"false\">`}")
rep(".logo .l1{font-size:clamp(",".logo.img img{display:block;width:min(60vw,255px);height:auto;transform:rotate(-2deg);animation:logoIn .7s cubic-bezier(.3,1.7,.5,1) both}\n.logo .l1{font-size:clamp(")
# ---- v39: hats with an advantage and a cost (HAT_FX in v39.js)
rep("*easyK()*(lvInZone()===4&&mode==='levels'?.9:1);","*easyK()*(lvInZone()===4&&mode==='levels'?.9:1)*hatSpd();")
rep("function landTol(d){const sp=speed(),","function landTol(d){const sp=speed()/hatSpd(),")
rep("const e=(settings.easy?1.25:1)*(perk('sticky')?1.12:1);return [p*e,g*e,m]","const e=(settings.easy?1.25:1)*(perk('sticky')?1.12:1)*hatTol();return [p*e,g*e,m]")
rep("sinceGold=3;hearts=3;combo=0;","sinceGold=3;hearts=3+hatHearts();combo=0;")
rep("fl%10===0&&hearts<3){","fl%10===0&&hearts<3+hatHearts()){")
rep("if(id==='heart'){if(hearts>=4)","if(id==='heart'){if(hearts>=4+Math.max(0,hatHearts()))")
rep("dropping.vy+=BH*30*zone().grav*(dropping.kind==='balloon'?.42:1)*dt;","dropping.vy+=BH*30*zone().grav*(dropping.kind==='balloon'?.42:1)*hatFall()*dt;")
rep("dropping.y+=dropping.vy*dt;dropping.xs+=wind*dt;","dropping.y+=dropping.vy*dt;dropping.xs+=wind*hatWind()*dt;")
rep("score+=25*combo;","score+=Math.round(25*combo*hatK('perfPts')*hatPts());")
rep("{score+=15;lv.great++;","{score+=Math.round(15*hatPts());lv.great++;")
rep("{combo=0;score+=10;","{combo=0;score+=Math.round(10*hatPts());")
rep("const dm=s.dmg*(b.stun>0?2:1);","const dm=Math.round(s.dmg*hatBoss())*(b.stun>0?2:1);")
rep("const guideAlpha=()=>boost.laser>0||perk('aim')?1:","const guideAlpha=()=>boost.laser>0||perk('aim')||hatK('aim',0)?1:")
rep("if(combo>=5&&combo%5===0&&fever<=0","if(combo>=hatFevN()&&combo%hatFevN()===0&&fever<=0")
rep("fever=perk('fever')?12:8;partyT=1.6;","fever=(perk('fever')?12:8)*hatK('feverT');partyT=1.6;")
# coin balloon appeared at the start of every level (coinNext was unset -> due at once); first one now after 12-22s
rep("if(!hz.coinB&&['aim','wait','drop'].includes(state)&&time>(hz.coinNext||0)){","if(!hz.coinNext&&['aim','wait','drop'].includes(state))hz.coinNext=time+12+Math.random()*10;\n  if(!hz.coinB&&['aim','wait','drop'].includes(state)&&time>hz.coinNext){")
# Suno world music (art/mus_<zone>.mp3, one track per world; lobby keeps mus_lobby_a)
rep("const MUSF={map:['mus_lobby_a']};","const MUSF={map:['mus_lobby_a'],farm:['mus_farm'],city:['mus_city'],desert:['mus_desert'],snow:['mus_snow'],space:['mus_space'],candy:['mus_candy'],ocean:['mus_ocean'],volcano:['mus_volcano']};")
# ---- v42: seasons — 300 levels (S1 day 1-80, S2 night 81-160, S3 storm 161-240, S4 six new worlds 241-300)
# ZONES grows from 8 to 30 stages. z.id stays the ART id (so every art lookup keeps working); z.sid is the unique stage id,
# z.season 1-4. Difficulty uses etOf(zi) (a smooth tier 0..~7.8) instead of the raw stage index.
rep("const TOTAL=ZONES.length*LPZ;",r"""{const B=ZONES.slice();for(const z of B){z.sid=z.id;z.season=1}
  const night=sk=>sk.map(([a,c])=>[a,mix(c,'#0b1030',.62)]),storm=sk=>sk.map(([a,c])=>[a,mix(c,'#3a4252',.55)]);
  for(const s of [2,3])for(const z of B)ZONES.push(Object.assign({},z,{sid:z.id+(s===2?'N':'S'),season:s,key:z.key+(s===2?'N':'S'),sky:s===2?night(z.sky):storm(z.sky),cloud:z.cloud&&(s===2?mix(z.cloud,'#1a2050',.6):mix(z.cloud,'#4a5060',.5)),starsAt:s===2?-99:z.starsAt}));
  for(const [sid,art,key] of [['jungle','farm','zJungle'],['castle','city','zCastle'],['clouds','snow','zClouds'],['dino','desert','zDino'],['factory','space','zFactory'],['crystal','candy','zCrystal']]){const b=B.find(z=>z.id===art);ZONES.push(Object.assign({},b,{sid,season:4,key}))}}
const etOf=zi=>typeof mode!=='undefined'&&mode==='event'?1.5:zi<8?zi:4+(zi-8)*.18;
// floors added by the level's place in its world: +1 per level, with a 'rest' level now and then (+0) (Tzach, Oct 6; was +2 per level)
const lvStep=k=>[0,1,2,2,3,4,4,5,6][k]||0;
const TOTAL=ZONES.length*LPZ;""")
rep("6+2*zoneIdx(level)+2*lvInZone()","6+Math.round(2*etOf(zoneIdx(level)))+lvStep(lvInZone())")
rep("(1.45+zoneIdx(level)*.14","(1.45+etOf(zoneIdx(level))*.14")
rep("lv=.5+.5*(level-1)/(TOTAL-1)","lv=.5+.5*Math.min(1,(etOf(zoneIdx(level))*LPZ+lvInZone())/79)")
rep("hp=3*(5+zi);","hp=3*(5+Math.round(etOf(zi)))+3*((ZONES[zi].season||1)-1);")
rep("let p=Math.max(.09,sp*(55-zi*1.4)/2000),g=Math.max(.2,sp*(120-zi*3)/2000)","let p=Math.max(.09,sp*(55-etOf(zi)*1.4)/2000),g=Math.max(.2,sp*(120-etOf(zi)*3)/2000)")
rep("g=6+2*zi+2*k;","g=6+Math.round(2*etOf(zi))+lvStep(k);")
rep("const bossReach=()=>4+Math.floor(zoneIdx(level)/2);","const bossReach=()=>4+Math.floor(etOf(zoneIdx(level))/2);")
rep("BOSS_NAMES[zone().id]","(BOSS_NAMES[zone().sid]||BOSS_NAMES[zone().id])",3)
rep("lv.firstBoss=!progress.beat[zone().id];progress.beat[zone().id]=1;","lv.firstBoss=!progress.beat[zone().sid];progress.beat[zone().sid]=1;")
rep("40+zi*6:15+zi*3","40+Math.round(etOf(zi)*6):15+Math.round(etOf(zi)*3)")
rep("30+zi*6","30+Math.round(etOf(zi)*6)")
rep("const hzPrimary=()=>HZ_ORDER[Math.min(zoneIdx(level),HZ_ORDER.length-1)];","const hzPrimary=()=>HZ_ORDER[Math.min(zoneIdx(level)%8,HZ_ORDER.length-1)];")
# map: 30 stage panels — keep the canvas under iOS's area limit, tint night / storm panels
rep("const dpr=Math.min(1.5,window.devicePixelRatio||1);mc.width=W*dpr;mc.height=mapH*dpr;","const dpr=Math.min(1.5,window.devicePixelRatio||1,Math.sqrt(12e6/(W*mapH)));mc.width=W*dpr;mc.height=mapH*dpr;")
rep("if(lk)g.filter='blur(5px) saturate(.55) brightness(1.08)';g.drawImage(pic('mapn_'+z.id),0,y0,W,ph+1);g.filter='none';",
    "{const f=((lk?'blur(5px) saturate(.55) brightness(1.08) ':'')+(z.ownMap?'':(z.mapf||SEASON_MAPF[z.season]||''))).trim();g.filter=f||'none'}g.drawImage(pic('mapn_'+z.id),0,y0,W,ph+1);g.filter='none';if(!z.ownMap&&SEASON_TINT[z.season]){g.fillStyle=SEASON_TINT[z.season];g.fillRect(0,y0,W,ph+1);if(z.season===2){const rs=mulberry(i*53+1);g.fillStyle='#fff7d6';for(let k=0;k<60;k++){g.globalAlpha=.35+rs()*.6;g.fillRect(rs()*W,y0+rs()*ph*.5,1.6,1.6)}g.globalAlpha=1}}")
# in-game season look: background tint + foreground (night darkness / storm rain) under the popups
rep("const nm=t(BOSS_NAMES[z]);","const nm=t(BOSS_NAMES[b.sid]||BOSS_NAMES[z]);")
rep("const th=document.getElementById('wThumb');const src='art/mapn_'+z.id+'.webp'","const th=document.getElementById('wThumb');const src='art/'+artAlias('mapn_'+z.id)+'.webp'")
rep("hz.boss={z:zone().id,","hz.boss={z:zone().id,sid:zone().sid,")
rep("ctx.save();if(shake>0)ctx.translate(","if(typeof seasonBg==='function')seasonBg();ctx.save();if(shake>0)ctx.translate(")
rep("  drawKaleido();\n  for(const p of popups){","  if(typeof seasonFx==='function')seasonFx();drawKaleido();\n  for(const p of popups){")
# ---- v44: 22 new mechanics / enemies for seasons 2-4 (src/v44.js). Hazard choice per stage comes from mechList()/mechPrimary().
rep("const hzList=()=>HZ_ORDER.slice(0,Math.min(zoneIdx(level)+1,HZ_ORDER.length));","const hzList=()=>zoneIdx(level)>=8&&typeof mechList==='function'?mechList():HZ_ORDER.slice(0,Math.min(zoneIdx(level)+1,HZ_ORDER.length));")
rep("const hzPrimary=()=>HZ_ORDER[Math.min(zoneIdx(level)%8,HZ_ORDER.length-1)];","const hzPrimary=()=>zoneIdx(level)>=8&&typeof mechPrimary==='function'?mechPrimary():HZ_ORDER[Math.min(zoneIdx(level)%8,HZ_ORDER.length-1)];")
rep("swinger.xs+=swinger.dir*speed()*(swinger.entering?1.8:(1-.42*Math.min(1,(swinger.xs/r)**2)))*dt;","swinger.xs+=swinger.dir*speed()*(swinger.frozen>0?0:swinger.fast>0?1.35:1)*(swinger.entering?1.8:(1-.42*Math.min(1,(swinger.xs/r)**2)))*dt;")
rep("if(!swinger.entering){if(swinger.xs<-r){swinger.xs=-r;swinger.dir=1}if(swinger.xs>r){swinger.xs=r;swinger.dir=-1}}","if(!swinger.entering){if(hz.portal&&Math.abs(swinger.xs)>r){swinger.xs=-Math.sign(swinger.xs)*r*.98;burst(xOf(swinger.xs),swingY(),['#22d3ee','#c084fc','#ff3ea5'],8,160)}else{if(swinger.xs<-r){swinger.xs=-r;swinger.dir=1}if(swinger.xs>r){swinger.xs=r;swinger.dir=-1}}}")
rep("*hatFall()*dt;","*hatFall()*(hz.gravK||1)*dt;")
rep("const p=hzPrimary(),bk='boss_'+zone().id;","const p=hzPrimary(),bk='boss_'+zone().sid;")
rep("b.atkAt=time;BOSS_ATK[b.z](b);","b.atkAt=time;(BOSS_ATK[b.sid]||BOSS_ATK[b.z])(b);")
rep("hz.boss={z:zone().id,sid:zone().sid,","hz.boss={z:zone().base||zone().id,sid:zone().sid,ak:bossArt(),")
rep("const b=hz.boss;if(!b)return;const z=b.z,im=hzPic(","const b=hz.boss;if(!b)return;const z=b.ak||b.z,im=hzPic(")
rep("const im=hzPic('boss_'+zone().id),bx=210","const im=hzPic('boss_'+bossArt()),bx=210")
# ---- v47: boss trophy hats for the new stages + astronaut suit
rep("const hid='h_'+zone().id;","const hid='h_'+zone().sid;")
rep('h.innerHTML=`<img src="art/${hatPicId(lv.newHat)}.webp" alt=""><span></span>`;','h.innerHTML=`<img src="${hatThumbSrc(lv.newHat)}" alt=""><span></span>`;')
# ---- v48: character-sheet style screen — hero sits higher (slots around it, power bars + drawer below)
rep("b.onclick=()=>{if(k==='skins'){hideOverlay();if(state==='title')openWardrobe();","b.onclick=()=>{if(k==='skins'||k==='style'){if(k==='style')W3.cat='trail';hideOverlay();if(state==='title')openWardrobe();")
rep("G=WD?Object.assign({},G0,{stageX:W/2,stageY:H*.47}):G0;","G=WD?Object.assign({},G0,{stageX:W/2,stageY:H*.385}):G0;")
# ---- v50: bug hunt 2
# a piece that lands after the last heart is gone (lava / hazard during the fall) used to pull the game out of 'over' -> played on with 0 hearts
rep("function resolveLanding(){\n  const d=dropping;dropping=null;","function resolveLanding(){\n  const d=dropping;dropping=null;if(state==='over'){bodies.push({s:d,x:xOf(d.xs),y:yOf(tower.length),vx:0,vy:-BH,rot:0,vr:3,mood:'scared'});return}")
# night / storm stages took the stage id as art id (v46), so the classic world's snow, sand, ocean current, space fall cap and ambience were lost
rep("flakes=Array.from({length:z.id==='snow'?60:0}","flakes=Array.from({length:baseId(z)==='snow'?60:0}")
rep("flakes=Array.from({length:z.id==='snow'?50:0}","flakes=Array.from({length:baseId(z)==='snow'?50:0}")
rep("sand:zone().id==='desert'})}","sand:baseId(zone())==='desert'})}")
rep("if(!dropping)return;const z=zone().id;","if(!dropping)return;const z=baseId(zone());")
rep("if(!sfxOn||!actx||state==='paused')return;ambT-=dt;if(ambT>0)return;const z=zone().id;","if(!sfxOn||!actx||state==='paused')return;ambT-=dt;if(ambT>0)return;const z=baseId(zone());")
rep("function worldTwist(dt){","function baseId(z){return (z.season===2||z.season===3)&&z.base?z.base:z.id}\nfunction worldTwist(dt){")
# mirror mechanic: flip the tap once for everything (coin balloon, hazards), not only inside hzTap
rep("const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;if(tapCoinBalloon","const r=cv.getBoundingClientRect(),py=e.clientY-r.top;let px=e.clientX-r.left;if(cv.style.transform)px=W-px;if(tapCoinBalloon")
# ...and the mirrored canvas stayed flipped behind the pause menu / win card
rep("if(state==='paused'||state==='intro'){if(lv)lv.t0+=dt;","if(state==='paused'||state==='intro'){if(cv.style.transform)cv.style.transform='';if(lv)lv.t0+=dt;")
rep("function win(){\n  state='win';","function win(){\n  cv.style.transform='';state='win';")
rep("if(hearts<=0){state='over';renderBoosterBar();","if(hearts<=0){state='over';cv.style.transform='';renderBoosterBar();")
# ---- inject module + css
import glob as _g
B3D={os.path.basename(f)[4:-5]:json.load(open(f)) for f in sorted(_g.glob(P(ROOT,'art','b3d_*.json')))}
rd=lambda n:open(P(SRC,n),encoding='utf-8').read()
ART_OWN=sorted({os.path.basename(f)[4:-5] for f in _g.glob(P(ROOT,'art','w3b_*.webp'))} - {'farm','city','desert','candy','snow','ocean','volcano','space'})
ART_OWN=[i for i in ART_OWN if all(os.path.exists(P(ROOT,'art',f'{k}_{i}.webp')) for k in ('w3m','w3f'))]
# ---- v50: bonus stage "Treasure in the Clouds" after a boss win (src/v50.js)
rep("const speed=()=>(","const speed=()=>mode==='bonus'?bnSpeed():(")
rep(":[{label:t('next'),icon:'play',primary:true,fn:()=>{hideOverlay();",":[...bnAct(),{label:t('next'),icon:'play',primary:true,fn:()=>{hideOverlay();")
# ---- v52: holiday events (mode 'event' plays like a normal level: goal + countdown)
rep("mode==='daily'?endless.goal:mode!=='levels'?999:","mode==='daily'?endless.goal:mode!=='levels'&&mode!=='event'?999:")
rep("function drawCountdown(){if(isBoss()||mode!=='levels'||","function drawCountdown(){if(isBoss()||(mode!=='levels'&&mode!=='event')||")
# ---- languages (Tzach, Oct 7): the device language + English. 14 languages; en/he live in I18N, the other 12 in
# src/i18n/<code>.json → art/i18n_<code>.js, loaded by the head script (LANG_HEAD) before the game. Changing language reloads.
LANGS={'en':'English','he':'עברית','es':'Español','pt':'Português','fr':'Français','de':'Deutsch','it':'Italiano','ru':'Русский',
       'tr':'Türkçe','ar':'العربية','ja':'日本語','ko':'한국어','zh':'中文','id':'Indonesia'}
LANG_RTL={'he','ar'}
rep("let lang=store('sharliz-lang'); if(!I18N[lang]) lang='en';",
    "let lang=window.SHZ_LANG||'en';if(window.LANGX&&!I18N[lang])I18N[lang]=Object.assign({},LANGX.keys,{_label:LANGX.label,_dir:LANGX.dir});if(!I18N[lang])lang='en';\n"
    "function LANG_SET(){return ['en','he'].concat(lang!=='en'&&lang!=='he'&&I18N[lang]?[lang]:[])}")
rep("  Object.keys(I18N).forEach(code=>{const b=document.createElement('button');b.textContent=I18N[code]._label;b.setAttribute('aria-pressed',code===lang);b.onclick=()=>{lang=code;store('sharliz-lang',code);sfx.click();applyLang()};el.appendChild(b)});",
    "  const N=window.LANG_NAMES||{};['en'].concat(window.SHZ_DEV&&SHZ_DEV!=='en'?[SHZ_DEV]:[]).forEach(code=>{const b=document.createElement('button');b.textContent=N[code]||code;b.setAttribute('aria-pressed',code===lang);"
    "b.onclick=()=>{if(code===lang)return;store('sharliz-lang',code);sfx.click();if(!window.LANGX&&I18N[code]){lang=code;applyLang()}else location.reload()};el.appendChild(b)});")
js=rd('v28.js')+'\n'+rd('v29.js').replace('__BSP_META__','{}')+'\n'+rd('v31.js')+'\n'+rd('v33.js').replace('__B3D_META__',json.dumps(B3D,separators=(',',':')))+'\n'+rd('v36.js')+'\n'+rd('v38.js')+'\n'+rd('v39.js')+'\n'+rd('v40.js')+'\n'+rd('v41.js')+'\n'+rd('v42.js')+'\n'+rd('v43.js')+'\n'+rd('v44.js')+'\n'+rd('v45.js')+'\n'+rd('v46.js').replace('__ART_OWN__',json.dumps(ART_OWN)).replace('__ART_CAP__',json.dumps([i for i in ART_OWN if os.path.exists(P(ROOT,'art',f'w3c_{i}.webp'))])).replace('__ART_MAP__',json.dumps([i for i in ART_OWN if os.path.exists(P(ROOT,'art',f'mapn_{i}.webp'))]))+'\n'+rd('v47.js')+'\n'+rd('v48.js')+'\n'+rd('v49.js')+'\n'+rd('v50.js')+'\n'+rd('v51.js')+'\n'+rd('v52.js')+'\n'+rd('v53.js')+'\n'+rd('v54.js')+'\n'+rd('v55.js')+'\n'+rd('v56.js')+'\n'+rd('v57.js')+'\n'+rd('v58.js')
css=rd('v28.css')+'\n'+rd('v36.css')+'\n'+rd('v38.css')+'\n'+rd('v39.css')+'\n'+rd('v40.css')+'\n'+rd('v42.css')+'\n'+rd('v43.css')+'\n'+rd('v48.css')+'\n'+rd('v49.css')+'\n'+rd('v50.css')+'\n'+rd('v51.css')+'\n'+rd('v52.css')+'\n'+rd('v53.css')+'\n'+rd('v54.css')+'\n'+rd('v55.css')+'\n'+rd('v56.css')+'\n'+rd('v57.css')+'\n'+rd('v58.css')
i=src.rindex('requestAnimationFrame(t0=>{last=t0;requestAnimationFrame(frame)});')
src=src[:i]+js+'\n'+src[i:]
i=src.index('</style>')
src=src[:i]+css+'\n'+src[i:]
_H=re.compile('[֐-׿]');_T=list(re.finditer(r"""'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)\"""",src));_out=[];_last=0;_nw=0
for _i in range(len(_T)-1):
    _a,_b=_T[_i],_T[_i+1]
    if re.fullmatch(r'\s*,\s*',src[_a.end():_b.start()]) and _H.search(_b.group(0)) and not _H.search(_a.group(0)) and re.search('[A-Za-z]',_a.group(0)):
        _out.append(src[_last:_a.start()]+'T_('+_a.group(0)+')');_last=_a.end();_nw+=1
src=''.join(_out)+src[_last:]
assert _nw>=250,_nw
os.makedirs(P(ROOT,'art'),exist_ok=True)
for _c in LANGS:
    if _c in ('en','he'):continue
    _f=P(SRC,'i18n',_c+'.json')
    if not os.path.exists(_f):continue
    _d=json.load(open(_f,encoding='utf-8'))
    _x={'code':_c,'label':LANGS[_c],'dir':'rtl' if _c in LANG_RTL else 'ltr','keys':_d['keys'],'pairs':_d['pairs'],'pw':_d.get('pw',{}),'fmt':_d.get('fmt',{})}
    open(P(ROOT,'art','i18n_'+_c+'.js'),'w',encoding='utf-8').write('window.LANGX='+json.dumps(_x,ensure_ascii=False,separators=(',',':'))+';\n')
_OK=[c for c in LANGS if c in ('en','he') or os.path.exists(P(ROOT,'art','i18n_'+c+'.js'))]
LANG_HEAD=('<script>(function(){var OK='+json.dumps(_OK)+';window.LANG_NAMES='+json.dumps(LANGS,ensure_ascii=False)+';'
  "function dl(){var a=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'en'];for(var i=0;i<a.length;i++){var c=String(a[i]||'').toLowerCase().split(/[-_]/)[0];if(c==='iw')c='he';if(c==='in')c='id';if(OK.indexOf(c)>=0)return c}return 'en'}"
  "var d=dl(),s=null;try{s=localStorage.getItem('sharliz-lang')}catch(e){}var l=(s==='en'||s===d)?s:d;window.SHZ_DEV=d;window.SHZ_LANG=l;window.LANGX=null;"
  "window.T_=function(x){var X=window.LANGX;return X&&X.pairs&&X.pairs[x]!=null?X.pairs[x]:x};"
  "if(l!=='en'&&l!=='he')document.write('<script src=\"art/i18n_'+l+'.js?v=__V__\"><\\/script>')})();</script>\n")
head='''<!doctype html><html lang="he" dir="ltr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="שארליז">
<meta name="theme-color" content="#3a1a8a"><meta name="format-detection" content="telephone=no">
<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icons/icon-180.png"><link rel="icon" type="image/png" href="icons/icon-192.png">
<style>html,body{overscroll-behavior:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}
#pwaHint{position:fixed;left:12px;right:12px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:99999;background:#1b1240;color:#fff;border:3px solid #120d2b;border-radius:18px;padding:12px 44px 12px 14px;font:600 15px/1.35 Rubik,system-ui,sans-serif;box-shadow:0 6px 0 #0a0620,0 10px 30px rgba(0,0,0,.4);direction:rtl}
#pwaHint b{color:#ffd23f}#pwaHint button{position:absolute;top:8px;left:10px;background:none;border:0;color:#fff;font-size:22px;line-height:1}</style>
</head><body>
'''
head=head.replace('</head><body>',LANG_HEAD+'</head><body>')
tail='''
<script>
if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
(function(){try{const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),sa=navigator.standalone||matchMedia('(display-mode: standalone)').matches;
  if(!ios||sa||sessionStorage.getItem('pwaHint'))return;sessionStorage.setItem('pwaHint','1');
  const he=(typeof lang!=='undefined'?lang:'he')==='he',d=document.createElement('div');d.id='pwaHint';
  d.innerHTML=he?'כדי לשחק במסך מלא: לחצו על <b>שיתוף</b> <span style="font-size:18px">⬆︎</span> ואז <b>"הוספה למסך הבית"</b>':'For full screen: tap <b>Share</b> <span style="font-size:18px">⬆︎</span> then <b>"Add to Home Screen"</b>';
  const x=document.createElement('button');x.textContent='×';x.onclick=()=>d.remove();d.appendChild(x);setTimeout(()=>document.body.appendChild(d),2500);setTimeout(()=>d.remove(),16000)}catch(e){}})();
</script></body></html>'''
V='sharliz-'+time.strftime('%Y%m%d%H%M%S')
head=head.replace('__V__',V)
open(P(ROOT,'index.html'),'w',encoding='utf-8').write(head+src+tail)
sw=open(P(ROOT,'sw.js')).read();sw=re.sub(r"const V='[^']*';","const V='%s';"%V,sw,count=1);open(P(ROOT,'sw.js'),'w').write(sw)
if '--preview' in sys.argv:open(P(ROOT,'preview.html'),'w',encoding='utf-8').write('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+src)
print('built index.html',len(src),V)
if STORE:
    # native app build (Capacitor): levels locked, no service worker / home-screen hint, real purchases via src/native.js
    import shutil
    W=P(ROOT,'app','www');shutil.rmtree(W,ignore_errors=True);os.makedirs(W)
    nat=open(P(SRC,'native.js'),encoding='utf-8').read()
    assert src.count('const DEV_OPEN=true,')==1
    ssrc=src.replace('const DEV_OPEN=true,','const DEV_OPEN=false,')
    shead=head.replace('<link rel="manifest" href="manifest.webmanifest">','')
    open(P(W,'index.html'),'w',encoding='utf-8').write(shead+'<script>'+nat+'</script>\n'+ssrc+'\n</body></html>')
    for d in ('art','icons'):shutil.copytree(P(ROOT,d),P(W,d),ignore=shutil.ignore_patterns('bsp_*'))
    print('store build ->',W)
