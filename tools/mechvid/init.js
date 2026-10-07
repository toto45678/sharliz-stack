(()=>{let man=false,vt=0;
 window.__man={on(){if(man)return;man=true;vt=performance.now();const of=window.frame;window.__frameOrig=of;window.frame=function(){requestAnimationFrame(frame)}},
  step(ms){vt+=ms;const r=window.requestAnimationFrame;window.requestAnimationFrame=()=>0;try{__frameOrig(vt)}catch(e){console.error(String(e&&e.stack||e))}finally{window.requestAnimationFrame=r}},now:()=>vt};
 let s=1;const R=()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
 window.__seed=n=>{s=n>>>0};const nr=Math.random;Math.random=()=>man?R():nr();
})();
