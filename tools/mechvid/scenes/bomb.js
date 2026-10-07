(()=>{
// Bomb Sharliz (classic swinger hazard, world 2). Tap the bomb to defuse it; if it lands on the tower: BOOM (2 floors lost).
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
if(!window.__pp0)window.__pp0=popup;window.popup=function(text,x,y,c,key){if(!['perfect','wow','great'].includes(key))return;return window.__pp0.apply(this,arguments)};
// harness race: the game's own rAF frame (queued before __man.on) can fire late with the REAL clock and set `last`,
// so the next virtual step gets a big negative dt (time jumps back). Keep `last` on the virtual clock.
const clk=()=>{try{if(last!==__man.now())last=__man.now()}catch(e){}};
// end of start(): if that late frame fires during rec.py's wait, it then takes one normal .033 step instead of a negative one
const arm=()=>{try{last=-1e12}catch(e){}};
const calm=()=>{try{hz.firstDone=true;hz.since=-9}catch(e){}};
// skip drawing while SC_setup builds the tower (those frames are not recorded; headless canvas drawing is the slow part)
if(!window.__render0)window.__render0=render;
const fast=on=>{window.render=on?function(){}:window.__render0;if(!on)try{flyCoins=[]}catch(e){}};
// SC_setup drops only when SC_aim(.02); with a fixed 1/30 s step the swing can hit the same positions every pass and
// never fall inside that window (seen on level 23), so the floors getter also drops on a slightly wider window
const build=n=>{try{if(tower.length-1<n&&SC_aim(.045))drop()}catch(e){}};
const BC=6;   // bomb picture centre below the swing point
// the bomb swings in from the right in both scenes (spawn side is a coin flip; mirror it while it is still off screen)
const bombNow=()=>{const b=swinger&&swinger.kind==='bomb'?swinger:null;if(b&&b.entering&&!b.sided){b.sided=1;if(b.xs<0){b.xs=-b.xs;b.dir=-b.dir}}return b};
const vel=s=>s.dir*speed()*(s.entering?1.8:(1-.42*Math.min(1,(s.xs/rangeXs())**2)))*S;
// the next Sharliz is a bomb (same as the game's swinger hazard roll) and swings in from the side
const setup=()=>{swinger=null;state='wait';spawnAt=time;hz.forceKind='bomb'};
const onScr=x=>x>20&&x<W-20;
// scene A: the bomb is dropped onto the tower -> BOOM
const A={level:13,get floors(){calm();fast(true);build(3);return 3},dur:9,seed:5,fadeOut:true,
  start(){fast(false);setup();arm()},
  speed(t){const M=SC.mem;if(M.boomT!=null)return t-M.boomT<.6?.45:1;if(M.dropT!=null)return .45;if(M.seenT!=null&&t-M.seenT<.9)return .3;return 1},
  tick(t){clk();calm();const M=SC.mem,I=[],s=sw(),b=bombNow(),f=dropping&&dropping.kind==='bomb'?dropping:null;
    if(b){const x=xOf(b.xs),y=s.y+BC;if(onScr(x)){if(!b.entering)M.seenT=M.seenT??t;const sp=M.seenT==null?-1:t-M.seenT;if(sp>=0&&sp<.9)I.push({k:'spot',x,y,r:64,a:.55*Math.min(1,sp/.2)*Math.min(1,(.9-sp)/.25)});I.push({k:'ring',x,y,r:48,col:'#ef4444'})}
      if(!b.entering&&M.seenT!=null&&t-M.seenT>1.2&&SC_aim(.035)){M.topP=topScreen();drop();M.dropT=t}}
    if(f){const x=xOf(f.xs),y=sy(f.y)+BC,tp=M.topP;I.push({k:'ring',x,y,r:48,col:'#ef4444'});const L=tp.y-y;if(L>120)I.push({k:'arrow',x1:x,y1:y+54,x2:tp.x,y2:tp.y-58,col:'#ef4444',p:1})}
    if(hz.boom&&M.boomT==null){M.boomT=t;M.bp={x:hz.boom.x,wy:hz.boom.wy};this.dur=t+1.6}
    if(M.boomT!=null){const p=Math.min(1,(t-M.boomT)/.45),q={x:M.bp.x,y:sy(M.bp.wy)};if(t-M.boomT<.6)I.push({k:'ring',x:q.x,y:q.y,r:62,col:'#ef4444'});I.push({k:'badge',x:q.x+(q.x<W/2?84:-84),y:q.y-40,ok:false,p})}
    return I}};
// scene B: tap the bomb -> defused; the next Sharliz lands normally
const B={level:13,get floors(){calm();fast(true);build(3);return 3},dur:12,seed:5,fadeIn:true,fadeOut:true,
  start(){fast(false);setup();const s=sw();SC.mem.h={x:W*.72,y:s.y+470};SC.mem.press=-9;SC.mem.taps=[];arm()},
  speed(t){const M=SC.mem,b=bombNow();if(M.doneT==null)return b&&b.entering?1:.6;return !M.dropped&&t-M.doneT>.6&&(!swinger||swinger.entering)?1.6:1},
  tick(t){clk();calm();const M=SC.mem,I=[],dt=1/30,s=sw(),b=bombNow();
    if(M.doneT==null){
      if(b){const x=xOf(b.xs),y=s.y+BC;if(onScr(x)){if(!b.entering)M.seenT=M.seenT??t;const v=vel(b),tx=x+v*.12,ty=y+4;M.h.x+=(tx-M.h.x)*Math.min(1,dt*9);M.h.y+=(ty-M.h.y)*Math.min(1,dt*9);
        I.push({k:'ring',x,y,r:48,col:'#facc15'});
        if(!b.entering&&M.seenT!=null&&t-M.seenT>.45&&Math.hypot(M.h.x-x,M.h.y-y)<16){M.press=t;M.taps.push({x,y,t});SC_tap(x,y);if(!bombNow())M.doneT=t}}}}
    else{M.h.x+=(W*.8-M.h.x)*Math.min(1,dt*4);M.h.y+=(s.y+480-M.h.y)*Math.min(1,dt*4)}
    for(const q of M.taps){const p=(t-q.t)/.5;if(p<1){I.push({k:'ripple',x:q.x,y:q.y,p});I.push({k:'ring',x:q.x,y:q.y,r:48+p*10,col:'#22c55e'})}}
    if(M.doneT!=null){const p=Math.min(1,(t-M.doneT)/.45);I.push({k:'badge',x:W/2,y:s.y+110,ok:true,p});
      if(t-M.doneT>.6&&!M.dropped&&swinger&&!swinger.entering&&(SC_aim(.035)||t-M.doneT>3)){drop();M.dropped=t}
      if(M.dropped&&!M.endSet){M.endSet=1;this.dur=t+1.5}}
    const pr=Math.max(0,1-(t-M.press)/.18);I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});
    return I}};
SC.scenes=[A,B];
})();
