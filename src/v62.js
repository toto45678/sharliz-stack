/* ===== v62: MECHANIC VIDEOS (Tzach Oct 7: every new mechanic needs a clear gameplay video, kids 9+) =====
   art/mv_<key>.mp4 = real gameplay recorded by tools/mechvid/rec.py (virtual clock + a scripted scene): first what goes wrong (red ✗),
   then what to do (hand taps, green ✓), with rings and arrows. No words in the video; the two lines under it are translated
   (hzx_<key> = what happens, hzo_<key> = what to do; the old caption hzc_<key> when they are missing).
   The intro card plays it instead of the small drawn demo; the drawn demo stays as the fallback. The file is loaded as a blob
   (iOS can't play a video the service worker answers without byte ranges). */
const MV_LIST=__MV_LIST__,MV={url:null};
Object.assign(I18N.en,{hzx_bats:'Bats bump your Sharliz off its swing',hzo_bats:'Tap the bats to scare them away!'});
Object.assign(I18N.he,{hzx_bats:'עטלפים דוחפים את השארליז מהנדנוד',hzo_bats:'הקישו על העטלפים כדי להבריח אותם!'});
{const _dl=demoLoop;demoLoop=function(c,k){if(!MV_LIST.includes(k))return _dl(c,k);
  const box=document.createElement('div');box.className='hz-vbox';const v=document.createElement('video');v.className='hz-vid';
  v.muted=true;v.defaultMuted=true;v.loop=true;v.autoplay=true;v.playsInline=true;for(const a of ['muted','playsinline','autoplay','loop'])v.setAttribute(a,'');v.setAttribute('aria-hidden','true');
  box.appendChild(v);c.replaceWith(box);let fell=false;const fall=()=>{if(fell||!box.isConnected)return;fell=true;box.replaceWith(c);_dl(c,k)};
  fetch('art/mv_'+k+'.mp4').then(r=>{if(!r.ok)throw 0;return r.blob()}).then(b=>{if(!box.isConnected)return;if(MV.url)URL.revokeObjectURL(MV.url);MV.url=URL.createObjectURL(b);v.src=MV.url;
    const p=v.play();if(p&&p.catch)p.catch(()=>{})}).catch(fall);
  v.addEventListener('error',fall,{once:true});
  // the two lines: ✗ what happens, ✓ what to do (old one-line caption when a mechanic doesn't have them yet)
  const cap=box.parentNode&&box.parentNode.querySelector('p.hz-cap'),L=I18N[lang]||I18N.en,X=L['hzx_'+k]||I18N.en['hzx_'+k],O=L['hzo_'+k]||I18N.en['hzo_'+k];
  if(cap&&X&&O){const two=document.createElement('div');two.className='hz-two';
    for(const [ok,txt] of [[0,X],[1,O]]){const r=document.createElement('div');r.className='hz-row '+(ok?'ok':'no');const i=document.createElement('i');i.innerHTML=ok?'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>':'<svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17"/></svg>';
      const s=document.createElement('span');s.textContent=txt;r.append(i,s);two.appendChild(r)}
    cap.replaceWith(two)}}}
