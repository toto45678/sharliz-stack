/* v68: OLD iPHONES. The store app installs on iOS 15 (Capacitor 8), and iPhone 6s / SE (1st gen) / 7 can't update past iOS 15.
   Safari 15 has no canvas roundRect (Safari 16): the world map stopped half-drawn (no pins) and the sticker shop's look icons threw.
   It also has no container units cqw/cqh (Safari 16: the Bonk game's holes) and no color-mix() (Safari 16.2: album paper, house icons),
   and canvas filters only arrived in Safari 18 (locked map worlds were not greyed out). Checked in Chromium with Safari 15's
   missing APIs removed (/mnt/project-files/game/perf/old-iphones/ios15.js). */
(()=>{function rr(x,y,w,h,r){let a=Array.isArray(r)?r:[r==null?0:r];a=a.map(v=>v&&typeof v==='object'?+v.x||0:Math.max(0,+v||0));
    let [tl,tr,br,bl]=a.length===1?[a[0],a[0],a[0],a[0]]:a.length===2?[a[0],a[1],a[0],a[1]]:a.length===3?[a[0],a[1],a[2],a[1]]:a;
    if(w<0){x+=w;w=-w;[tl,tr,br,bl]=[tr,tl,bl,br]}if(h<0){y+=h;h=-h;[tl,tr,br,bl]=[bl,br,tr,tl]}
    const k=Math.min(1,w/(tl+tr||1),w/(bl+br||1),h/(tl+bl||1),h/(tr+br||1));tl*=k;tr*=k;br*=k;bl*=k;
    this.moveTo(x+tl,y);this.arcTo(x+w,y,x+w,y+h,tr);this.arcTo(x+w,y+h,x,y+h,br);this.arcTo(x,y+h,x,y,bl);this.arcTo(x,y,x+w,y,tl);this.closePath();this.moveTo(x,y)}
  for(const C of [window.CanvasRenderingContext2D,window.Path2D,window.OffscreenCanvasRenderingContext2D])if(C&&!C.prototype.roundRect)C.prototype.roundRect=rr;
  const H=document.documentElement,ok=(p,v)=>{try{return CSS.supports(p,v)}catch(e){return false}};
  if(!ok('color','color-mix(in srgb,red 50%,blue)'))H.classList.add('no-cmix');
  if(!ok('width','1cqw')){H.classList.add('no-cq');
    // Bonk holes are sized in % of the hole (container units): give them the hole's size in px instead
    const fit=()=>document.querySelectorAll('.wh-hole').forEach(h=>{const r=h.getBoundingClientRect();h.style.setProperty('--cqw',r.width/100+'px');h.style.setProperty('--cqh',r.height/100+'px')});
    const _s=arcStart;arcStart=function(id){const r=_s.apply(this,arguments);if(id==='whack'){fit();requestAnimationFrame(fit)}return r};
    addEventListener('resize',()=>setTimeout(fit,60))}})();
const CANVAS_FILTER='filter' in CanvasRenderingContext2D.prototype;
// last module: the lobby is built, show it (v68.css hides the half-built lobby HTML until now)
document.documentElement.classList.add('booted');
