(()=>{
const sw=()=>({x:xOf(swinger?swinger.xs:0),y:sy(swingY())});
const live=b=>b&&!b.gone&&!b.vy;
const onScr=(m,b)=>m.t>=b.d&&!b.gone&&b.x>18&&b.x<W-18;
// scene A: what happens if you don't tap
const A={level:81,floors:4,dur:9,seed:7,fadeOut:true,
  start(){startEvent('bats');const m=hz.m.bats,y=sw().y;m.list[0].y=y;m.list[1].y=y-30;m.list[2].y=y+26;for(const b of m.list)b.x=b.vx>0?-24:W+24},
  speed(t){const m=hz.m.bats,M=SC.mem;if(M.hitT!=null)return t-M.hitT<.5?.5:1;if(!m)return 1;if(M.seenT!=null&&t-M.seenT<1.1)return .3;const b=m.list[0],s=sw();return Math.hypot(b.x-s.x,b.y-s.y)<170&&m.t>=b.d?.4:1},
  tick(t){const m=hz.m.bats,M=SC.mem,I=[],s=sw();
    if(m&&M.hitT==null){const b=m.list[0];if(b.hit){M.hitT=t;M.hitP={x:s.x,y:s.y};this.dur=t+1.6}
      else if(onScr(m,b)){M.seenT=M.seenT??t;const sp=t-M.seenT;if(sp<1.1)I.push({k:'spot',x:b.x,y:b.y,r:58,a:.55*Math.min(1,sp/.2)*Math.min(1,(1.1-sp)/.25)});I.push({k:'ring',x:b.x,y:b.y,r:40,col:'#ef4444'});const dx=s.x-b.x,dy=s.y-b.y,L=Math.hypot(dx,dy);if(L>110)I.push({k:'arrow',x1:b.x+dx/L*48,y1:b.y+dy/L*48,x2:s.x-dx/L*50,y2:s.y-dy/L*50,col:'#ef4444',p:1})}}
    if(M.hitT!=null){const p=Math.min(1,(t-M.hitT)/.45);I.push({k:'ring',x:s.x,y:s.y,r:52,col:'#ef4444'});I.push({k:'badge',x:s.x+(s.x<W/2?62:-62),y:s.y-58,ok:false,p})}
    return I}};
// scene B: tap the bats away
const B={level:81,floors:4,dur:12,seed:7,fadeIn:true,fadeOut:true,
  start(){startEvent('bats');const m=hz.m.bats,y=sw().y;m.list[0].y=y;m.list[1].y=y-30;m.list[2].y=y+26;for(const b of m.list)b.x=b.vx>0?-24:W+24;SC.mem.h={x:W*.7,y:sw().y+470};SC.mem.i=0;SC.mem.press=-9;SC.mem.taps=[]},
  speed(t){const M=SC.mem;return M.doneT==null?.55:1},
  tick(t){const m=hz.m.bats,M=SC.mem,I=[],dt=1/30,s=sw();
    if(M.doneT==null){
      const b=m&&m.list[M.i];
      if(b&&onScr(m,b)&&live(b)){const lead=.12,tx=b.x+b.vx*lead*.55,ty=b.y;M.h.x+=(tx-M.h.x)*Math.min(1,dt*9);M.h.y+=(ty-M.h.y)*Math.min(1,dt*9);
        I.push({k:'ring',x:b.x,y:b.y,r:40,col:'#facc15'});
        if(Math.hypot(M.h.x-b.x,M.h.y-b.y)<16&&t-M.press>.25){SC_tap(b.x,b.y);M.press=t;M.taps.push({x:b.x,y:b.y,t});M.i++}}
      else if(b&&!live(b))M.i++;
      if(m&&M.i>=3&&!m.list.some(live))M.doneT=t;if(!hz.m.bats&&M.i>0)M.doneT=M.doneT??t}
    else{M.h.x+=(W*.75-M.h.x)*Math.min(1,dt*4);M.h.y+=(s.y+480-M.h.y)*Math.min(1,dt*4)}
    for(const q of M.taps){const p=(t-q.t)/.45;if(p<1){I.push({k:'ripple',x:q.x,y:q.y,p});I.push({k:'ring',x:q.x,y:q.y,r:40+p*10,col:'#22c55e'})}}
    if(M.doneT!=null){const p=Math.min(1,(t-M.doneT)/.45);I.push({k:'badge',x:W/2,y:s.y+150,ok:true,p});
      if(t-M.doneT>.5&&!M.dropped&&(SC_aim(.035)||t-M.doneT>2.2)){drop();M.dropped=t}
      if(M.dropped&&!M.endSet){M.endSet=1;this.dur=t+1.6}}
    const pr=Math.max(0,1-(t-M.press)/.18);I.push({k:'hand',x:M.h.x,y:M.h.y,press:pr});
    return I}};
SC.scenes=[A,B];
})();
