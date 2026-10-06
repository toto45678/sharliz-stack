/* ===== v29: animated boss loops (Higgsfield → sprite sheets) + foreground caps ===== */
const W3C_SEAM=675;
const BSP=__BSP_META__,BSPI={};
function bspLoad(z){for(const k of ['idle','hurt']){const n='bsp_'+z+'_'+k;if(BSP[n]&&!BSPI[n]){const i=new Image();i.decoding='async';i.src='art/'+n+'.webp';BSPI[n]=i}}}
function bspReady(z,k){const n='bsp_'+z+'_'+k;if(!BSP[n])return null;const i=BSPI[n];if(!i){bspLoad(z);return null}return i.complete&&i.naturalWidth?{m:BSP[n],im:i}:null}
function bspDraw(c,d,bh,t){const m=d.m,r=m.ref,s=bh/(r[3]-r[1]),cx=(r[0]+r[2])/2,cy=(r[1]+r[3])/2;
  const bx=(m.box[0]-cx)*s,by=(m.box[1]-cy)*s,bw=(m.box[2]-m.box[0])*s,bb=(m.box[3]-m.box[1])*s;
  const f=(((t/m.dur)%1)+1)%1*m.n,i=Math.floor(f)%m.n,j=(i+1)%m.n,a=f-Math.floor(f),fx=k=>(k%m.c)*m.w,fy=k=>Math.floor(k/m.c)*m.h,ga=c.globalAlpha;
  c.drawImage(d.im,fx(i),fy(i),m.w,m.h,bx,by,bw,bb);
  if(a>.08){c.globalAlpha=ga*a;c.drawImage(d.im,fx(j),fy(j),m.w,m.h,bx,by,bw,bb);c.globalAlpha=ga}}
