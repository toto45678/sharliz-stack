(()=>{
// Thief Crow (classic hazard, world 1). The crow swoops at the TOP Sharliz and steals it; tap him to shoo him away.
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const topP=()=>{const p=topScreen();return {x:p.x,y:p.y}};
// language-neutral video: keep only the landing words the bats video also shows
if(!window.__pp0)window.__pp0=popup;window.popup=function(text,x,y,c,key){if(!['perfect','wow','great'].includes(key))return;return window.__pp0.apply(this,arguments)};
// no random swinger hazards while the tower is built (the world's own hazard would show up early)
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
const setup=()=>{startEvent('thief');const c=hz.crow,ct=sy(swingY())-100;c.side=-1;c.x0=-34;c.y0=ct+70;c.t=.85;c.x=c.x0;c.y=c.y0};
const onScr=c=>c&&c.x>14&&c.x<W-14;
const c0side=()=>-1;   // the crow comes from the left and flies back there with the stolen Sharliz: the X goes on the other side
// scene B: put the swinger at the point of its swing from where it first reaches the drop point T game seconds later
// (the hand shoos the crow at ~0.85 s, so the Perfect drop follows right after the green check instead of a long wait)
function phase(T){const top=tower[tower.length-1],dist=Math.max(1,yOf(tower.length)-swingY()),tf=Math.sqrt(2*dist/(BH*30*zone().grav)),tx=top.xs-wind*tf,r=rangeXs(),sp=speed();let best=null;
  for(const d0 of [1,-1])for(let x0=-r;x0<=r;x0+=.01){let xs=x0,dir=d0,hit=9;for(let i=1;i<150;i++){const px=xs;xs+=dir*sp*(1-.42*Math.min(1,(xs/r)**2))/30;if(xs<-r){xs=-r;dir=1}if(xs>r){xs=r;dir=-1}if((px-tx)*(xs-tx)<=0){hit=i/30;break}}
    if(!best||Math.abs(hit-T)<best.e)best={e:Math.abs(hit-T),x0,d0}}
  swinger.xs=best.x0;swinger.dir=best.d0}
// scene A: the crow steals the top Sharliz
const A={level:5,get floors(){calm();fast(true);build(2);return 2},dur:9,seed:11,fadeOut:true,
  start(){fast(false);setup();arm()},
  speed(t){const c=hz.crow,M=SC.mem;if(M.stoleT!=null)return t-M.stoleT<.6?.45:1;if(!c)return 1;if(M.seenT!=null&&t-M.seenT<.9)return .3;return c.phase==='come'&&c.t/c.dur>.9?.5:1},
  tick(t){clk();calm();const c=hz.crow,M=SC.mem,I=[];
    if(c&&c.phase==='come'&&M.stoleT==null){M.tp=topP();
      if(onScr(c)){M.seenT=M.seenT??t;const sp=t-M.seenT;if(sp<.9)I.push({k:'spot',x:c.x,y:c.y,r:62,a:.55*Math.min(1,sp/.2)*Math.min(1,(.9-sp)/.25)});
        I.push({k:'ring',x:c.x,y:c.y,r:44,col:'#ef4444'});
        const tp=M.tp,dx=tp.x-c.x,dy=tp.y-c.y,L=Math.hypot(dx,dy);if(L>120)I.push({k:'arrow',x1:c.x+dx/L*52,y1:c.y+dy/L*52,x2:tp.x-dx/L*56,y2:tp.y-dy/L*56,col:'#ef4444',p:1})}}
    if(c&&c.carry&&M.stoleT==null){M.stoleT=t;this.dur=t+1.7}
    if(M.stoleT!=null){const p=Math.min(1,(t-M.stoleT)/.45);
      if(c&&c.carry)I.push({k:'ring',x:c.x,y:c.y+BH*.62,r:66,col:'#ef4444'});
      const tp=M.tp;I.push({k:'badge',x:tp.x-c0side()*78,y:tp.y-10,ok:false,p})}
    return I}};
// scene B: tap the crow -> he flies away, the tower keeps its top
const B={level:5,get floors(){calm();fast(true);build(2);return 2},dur:12,seed:11,fadeIn:true,fadeOut:true,
  start(){fast(false);setup();phase(1.45);const s=sw();SC.mem.h={x:W*.72,y:s.y+470};SC.mem.press=-9;SC.mem.taps=[];arm()},
  speed(t){const M=SC.mem;return M.doneT==null?.6:1},
  tick(t){clk();calm();const c=hz.crow,M=SC.mem,I=[],dt=1/30,s=sw();
    if(M.doneT==null){
      if(c&&c.phase==='come'&&onScr(c)){const tx=c.x,ty=c.y+6;M.h.x+=(tx-M.h.x)*Math.min(1,dt*8);M.h.y+=(ty-M.h.y)*Math.min(1,dt*8);
        I.push({k:'ring',x:c.x,y:c.y,r:44,col:'#facc15'});
        if(Math.hypot(M.h.x-tx,M.h.y-ty)<14&&c.t>1.7){M.press=t;M.taps.push({x:c.x,y:c.y,t});SC_tap(c.x,c.y);if(c.phase==='shoo')M.doneT=t}}}
    else{M.h.x+=(W*.8-M.h.x)*Math.min(1,dt*4);M.h.y+=(s.y+480-M.h.y)*Math.min(1,dt*4)}
    for(const q of M.taps){const p=(t-q.t)/.5;if(p<1){I.push({k:'ripple',x:q.x,y:q.y,p});I.push({k:'ring',x:q.x,y:q.y,r:44+p*10,col:'#22c55e'})}}
    if(M.doneT!=null){const p=Math.min(1,(t-M.doneT)/.45),tp=topP();I.push({k:'badge',x:W/2,y:s.y+105,ok:true,p});
      if(t-M.doneT>.45&&!M.dropped&&(SC_aim(.035)||t-M.doneT>2.4)){drop();M.dropped=t}
      if(M.dropped&&!M.endSet){M.endSet=1;this.dur=t+1.5}}
    const pr=Math.max(0,1-(t-M.press)/.18);I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});
    return I}};
SC.scenes=[A,B];
})();
