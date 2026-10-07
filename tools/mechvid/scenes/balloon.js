(()=>{
// Bubblegum Sharliz (classic swinger hazard, world 4). It floats down slowly; once it lands its bubble inflates (3 s ring)
// and lifts it off the tower. Land another Sharliz on top before that and the bubble pops.
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
const aimErr=()=>{const top=tower[tower.length-1];return top.xs-(swinger.xs+predictLanding().dxs)};
const aimed=tol=>state==='aim'&&swinger&&!swinger.entering&&Math.abs(aimErr())<tol;
// the swinging Sharliz is a bubblegum one (same as the game's swinger hazard roll); run the swing on until it is
// ~lead seconds from the drop point, so the scene starts right before the drop
function toAim(lead){swinger.kind='balloon';for(let k=0;k<900;k++){SC_step();if(state==='aim'&&swinger&&!swinger.entering){const e=aimErr(),v=swinger.dir*speed()*(1-.42*Math.min(1,(swinger.xs/rangeXs())**2));if(Math.sign(e)===Math.sign(v)&&Math.abs(e/v)>lead*.8&&Math.abs(e/v)<lead*1.2)return}}}
// drop the bubblegum Sharliz onto the tower (not recorded); both scenes start the moment it has landed and its bubble
// starts to grow. Camera snapped to where the game eases it, leftovers of the skipped frames cleared.
function land(){toAim(.25);for(let k=0;k<90&&!aimed(.03);k++)SC_step();drop();const d=dropping;for(let k=0;k<200&&dropping;k++)SC_step();
  camY=camTarget();popups=[];particles=[];kaleido=[];notes=[];return d}
const bubble=s=>{const n=tower.indexOf(s),r=S*(.42+(s.inflate||0)*.42);return {x:xOf(s.xs)+swayOffset(n,tower.length),y:sy(yOf(n))-BH*.5-r*.75,r}};
// scene A: nobody lands on it -> the bubble lifts it away
const A={level:33,get floors(){calm();fast(true);build(4);return 4},dur:10,seed:9,fadeOut:true,
  start(){SC.mem.bal=land();fast(false);arm()},
  speed(t){const M=SC.mem;if(M.upT!=null)return t-M.upT<.6?.45:1;if(M.bal&&M.bal.floatT<.45)return .5;return 1},
  tick(t){clk();calm();const M=SC.mem,I=[],s=sw();
    if(M.bal&&M.upT==null){if(tower.includes(M.bal)){const b=bubble(M.bal);M.last={x:xOf(M.bal.xs),y:sy(yOf(tower.indexOf(M.bal))),b};I.push({k:'ring',x:b.x,y:b.y,r:b.r+16,col:'#ef4444'})}
      else{M.upT=t;this.dur=t+1.5}}
    if(M.upT!=null){const p=Math.min(1,(t-M.upT)/.45),q=M.last,bd=bodies.find(o=>o.s===M.bal);
      if(bd)I.push({k:'ring',x:bd.x,y:sy(bd.y)-BH*.35,r:70,col:'#ef4444'});
      I.push({k:'badge',x:q.x+(q.x<W/2?84:-84),y:q.y-20,ok:false,p})}
    return I}};
// scene B: the next Sharliz lands on the bubble -> pop, the tower keeps the floor
const B={level:33,get floors(){calm();fast(true);build(4);return 4},dur:12,seed:9,fadeIn:true,fadeOut:true,
  start(){SC.mem.bal=land();
    const s=sw();SC.mem.h={x:W*.8,y:s.y+470};SC.mem.press=-9;SC.mem.taps=[];fast(false);arm()},
  speed(t){const M=SC.mem;if(M.dropT!=null&&M.landT==null)return .45;return M.landT==null?.75:1},
  tick(t){clk();calm();const M=SC.mem,I=[],dt=1/30,s=sw(),bal=M.bal;
    if(M.landT==null&&bal&&tower.includes(bal)&&bal.floatT>0){const b=bubble(bal);I.push({k:'ring',x:b.x,y:b.y,r:b.r+16,col:'#facc15'})}
    if(M.dropT==null){
      if(swinger&&!swinger.entering&&state==='aim'){M.h.x+=(s.x-M.h.x)*Math.min(1,dt*7);M.h.y+=(s.y+8-M.h.y)*Math.min(1,dt*7);
        if(aimed(.025)||(bal.floatT<.9&&aimed(.12))){M.press=t;M.taps.push({x:s.x,y:s.y,t});drop();M.d=dropping;M.dropT=t;M.n0=tower.length}}
      else{M.h.x+=(W*.6-M.h.x)*Math.min(1,dt*4);M.h.y+=(s.y+200-M.h.y)*Math.min(1,dt*4)}}
    else{M.h.x+=(W*.85-M.h.x)*Math.min(1,dt*3);M.h.y+=(s.y+480-M.h.y)*Math.min(1,dt*3)}
    if(M.dropT!=null&&M.landT==null&&dropping!==M.d){M.landT=t;M.ok=tower.length>M.n0&&!bal.floatT;this.dur=t+1.5}
    for(const q of M.taps){const p=(t-q.t)/.5;if(p<1)I.push({k:'ripple',x:q.x,y:q.y,p})}
    if(M.landT!=null&&M.ok){const p=Math.min(1,(t-M.landT)/.45),tp=topScreen();if(t-M.landT<.8)I.push({k:'ring',x:tp.x,y:tp.y-BH*.35,r:62,col:'#22c55e'});I.push({k:'badge',x:W/2,y:s.y+110,ok:true,p})}
    const pr=Math.max(0,1-(t-M.press)/.18);I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});
    return I}};
SC.scenes=[A,B];
})();
