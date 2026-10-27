/* ===== v73: GIFT CODES (Tzach, Oct 26: "a place to type a coupon code that gives you gifts, so we can treat people now and then").
   Settings → Gift code. Works offline (no network call, nothing leaves the device): the gift is written INSIDE the code and
   the code carries a 24-bit signature, so new codes never need a store update. Make codes with tools/coupons/make.py
   (same format as cpDecode below). Each code works once per device (progress.coupon.used). Named codes (CP_NAMED) ship
   with the build. The first code ever redeemed also gives album sticker s274 (once its art is in). ===== */
Object.assign(I18N.en,{cpRow:'Gift code',cpEnter:'Enter',cpTitle:'Gift code',cpSub:'Got a secret code? Type it here for a gift!',cpGo:'Get my gift!',
  cpBad:'Hmm, that code doesn\'t work. Check the letters and try again.',cpUsed:'You already got the gift from this code.',cpOld:'This code has expired.',
  cpWait:'Too many tries. Wait a minute and try again.',cpYay:'Your gift!',cpCollect:'Collect!',cpPacks:'sticker packs',cpGPacks:'golden packs',cpCookies:'cookies',cpEgg:'egg',cpBoost:'of each booster'});
Object.assign(I18N.he,{cpRow:'קוד מתנה',cpEnter:'הכנסה',cpTitle:'קוד מתנה',cpSub:'יש לך קוד סודי? כתבו אותו כאן וקבלו מתנה!',cpGo:'לקבל מתנה!',
  cpBad:'אופס, הקוד לא עובד. בדקו את האותיות ונסו שוב.',cpUsed:'כבר קיבלת את המתנה מהקוד הזה.',cpOld:'הקוד הזה כבר לא בתוקף.',
  cpWait:'יותר מדי ניסיונות. חכו דקה ונסו שוב.',cpYay:'המתנה שלך!',cpCollect:'לקחת!',cpPacks:'חבילות מדבקות',cpGPacks:'חבילות זהב',cpCookies:'עוגיות',cpEgg:'ביצה',cpBoost:'מכל בוסטר'});

// ---- code format (keep in sync with tools/coupons/make.py) ----
// 12 Crockford base-32 chars = 60 bits = 36 payload bits + 24 signature bits (first 3 bytes of HMAC-SHA256(key, payload as 5 bytes))
// payload, high bit first: ver 2 | coins 4 | boosters 3 (n of each) | packs 3 | golden packs 2 | egg 2 (c r g) | cookies 3 | expiry 9 (weeks after CP_T0, 0 = never) | serial 8
const CP_COINS=[0,50,100,150,200,300,500,750,1000,1500,2000,3000,5000,7500,10000,20000],CP_COOK=[0,3,5,10,15,20,30,50],CP_EGG=[null,'c','r','g'];
const CP_T0=Date.UTC(2026,9,26),CP_ABC='0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const CP_NAMED={SHARLIZ:{c:300,pk:1}};   // easy codes for posts; changing these needs a new build
const CP_K=[0xd4,0x47,0xa8,0x7c,0x93,0x63,0x1c,0xa1,0x68,0x66,0x52,0x7f,0x03,0x1b,0x21,0x74].map((b,i)=>b^((i*73+41)&255));
function cpSha(bytes){const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],L=bytes.length,n=((L+9+63)>>6)<<6,m=new Uint8Array(n);m.set(bytes);m[L]=0x80;
  const bl=L*8;m[n-4]=bl>>>24;m[n-3]=bl>>>16&255;m[n-2]=bl>>>8&255;m[n-1]=bl&255;const w=new Array(64),r=(x,k)=>x>>>k|x<<(32-k);
  for(let o=0;o<n;o+=64){for(let i=0;i<16;i++)w[i]=m[o+i*4]<<24|m[o+i*4+1]<<16|m[o+i*4+2]<<8|m[o+i*4+3];
    for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2];w[i]=(w[i-16]+(r(a,7)^r(a,18)^a>>>3)+w[i-7]+(r(b,17)^r(b,19)^b>>>10))|0}
    let [a,b,c,d,e,f,g,h]=H;for(let i=0;i<64;i++){const t1=(h+(r(e,6)^r(e,11)^r(e,25))+(e&f^~e&g)+K[i]+w[i])|0,t2=((r(a,2)^r(a,13)^r(a,22))+(a&b^a&c^b&c))|0;h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0}
    H[0]=H[0]+a|0;H[1]=H[1]+b|0;H[2]=H[2]+c|0;H[3]=H[3]+d|0;H[4]=H[4]+e|0;H[5]=H[5]+f|0;H[6]=H[6]+g|0;H[7]=H[7]+h|0}
  const out=new Uint8Array(32);H.forEach((v,i)=>{out[i*4]=v>>>24;out[i*4+1]=v>>>16&255;out[i*4+2]=v>>>8&255;out[i*4+3]=v&255});return out}
function cpMac(msg){const k=new Uint8Array(64);k.set(CP_K);const ip=new Uint8Array(64+msg.length),op=new Uint8Array(96);
  for(let i=0;i<64;i++){ip[i]=k[i]^0x36;op[i]=k[i]^0x5c}ip.set(msg,64);op.set(cpSha(ip),64);return cpSha(op)}
function cpNorm(s){return String(s||'').toUpperCase().replace(/[\s\-_.]/g,'').replace(/O/g,'0').replace(/[IL]/g,'1')}
// → {gift, exp, key} or {err:'bad'|'old'}
function cpDecode(raw){const s=cpNorm(raw),nm=String(raw||'').toUpperCase().replace(/[\s\-_.]/g,'');
  if(CP_NAMED[nm])return {gift:CP_NAMED[nm],key:'n:'+nm};
  if(s.length!==12||[...s].some(ch=>CP_ABC.indexOf(ch)<0))return {err:'bad'};
  let bits='';for(const ch of s)bits+=CP_ABC.indexOf(ch).toString(2).padStart(5,'0');
  const pay=bits.slice(0,36),sig=bits.slice(36),msg=new Uint8Array(5),pb=('0000'+pay);
  for(let i=0;i<5;i++)msg[i]=parseInt(pb.slice(i*8,i*8+8),2);
  const mac=cpMac(msg),ms=[mac[0],mac[1],mac[2]].map(b=>b.toString(2).padStart(8,'0')).join('');
  if(ms!==sig)return {err:'bad'};
  let p=0;const take=n=>{const v=parseInt(pay.slice(p,p+n),2);p+=n;return v};
  const ver=take(2);if(ver!==1)return {err:'bad'};
  const g={c:CP_COINS[take(4)],b:take(3),pk:take(3),gpk:take(2),egg:CP_EGG[take(2)],ck:CP_COOK[take(3)]},wk=take(9);take(8);
  if(wk&&Date.now()>CP_T0+wk*7*864e5)return {err:'old'};
  return {gift:g,key:'s:'+s}}
function cpState(){const C=progress.coupon=progress.coupon||{};C.used=C.used||{};C.n=C.n||0;return C}
function cpGive(g){const W=wallet();if(g.c)W.coins+=g.c;
  if(g.b)['slow','laser','shield','heart'].forEach(b=>W.inv[b]=(W.inv[b]||0)+g.b);
  if(g.ck&&typeof nest==='function')nest().treats+=g.ck;
  // packs + egg pop their own 'you got' notes, so they are handed over when the gift card closes (cpPend; kept in the save until then)
  if(g.pk||g.gpk||g.egg)cpState().pend={pk:g.pk,gpk:g.gpk,egg:g.egg};
  saveProgress();
  if(g.c){sfx.coin(4);coinShower(g.c)}else sfx.coin(2);
  try{sfx.flourish(2)}catch(e){}updateWalletUI();try{updateLobby()}catch(e){}}
// the album sticker for the first gift code (it shows up by itself once art/stk_s274.webp is in)
function cpPend(){const C=cpState(),P=C.pend;if(!P)return;delete C.pend;saveProgress();
  if(P.pk&&typeof sbGive==='function')sbGive(P.pk);if(P.gpk&&typeof sbGive==='function')sbGive(P.gpk,1);
  if(P.egg&&typeof eggGive==='function')eggGive(P.egg)}
function cpSticker(){try{const C=cpState();if(!C.n||C.stk||typeof has3!=='function'||!has3('s274'))return;const D=sbData();D.got.s274=(D.got.s274||0)+1;C.stk=1;saveProgress();try{stkBadge()}catch(e){}
  const s=SHZ.find(x=>x[0]==='s274');if(s)noteToast((lang==='he'?s[3]:s[2])+' ★')}catch(e){}}
let CPV={txt:'',msg:'',err:0,gift:null};
function cpTry(){const C=cpState(),now=Date.now();
  if(C.lock&&now<C.lock){CPV.msg=t('cpWait');CPV.err=1;return}
  const r=cpDecode(CPV.txt);
  if(r.err){C.miss=(C.miss||0)+1;if(C.miss>=8){C.miss=0;C.lock=now+60000}saveProgress();CPV.msg=t(r.err==='old'?'cpOld':'cpBad');CPV.err=1;vib(40);return}
  if(C.used[r.key]){CPV.msg=t('cpUsed');CPV.err=1;return}
  C.used[r.key]=now;C.n++;C.miss=0;cpGive(r.gift);CPV.gift=r.gift;CPV.msg='';CPV.err=0}
function cpTiles(g){const L=[];const add=(img,big,small)=>L.push({img,big,small});
  if(g.c)add('ic_coin',g.c,'');if(g.b)['slow','laser','shield','heart'].forEach(b=>add('ic_'+b,'×'+g.b,''));
  if(g.pk)add('sb_pack','×'+g.pk,t('cpPacks'));if(g.gpk)add('sb_gpack','×'+g.gpk,t('cpGPacks'));
  if(g.egg)add('egg_'+g.egg,'×1',t('cpEgg'));if(g.ck)add('ns_cookie','×'+g.ck,t('cpCookies'));return L}
function openCoupon(){sfx.click();CPV={txt:'',msg:'',err:0,gift:null};
  showOverlay(()=>{const won=CPV.gift;return {title:won?t('cpYay'):t('cpTitle'),extra:card=>{
    const box=document.createElement('div');box.className='cp-box'+(won?' won':'');
    if(won){const g=document.createElement('div');g.className='cp-gifts';
      cpTiles(won).forEach(T=>{const el=document.createElement('div');el.className='cp-tile';el.innerHTML=`<img src="art/${T.img}.webp" alt=""><b></b><small></small>`;el.querySelector('b').textContent=T.big;el.querySelector('small').textContent=T.small;g.appendChild(el)});
      box.innerHTML='<img class="cp-chest" src="art/ic_chest_open.webp" alt="">';box.appendChild(g)}
    else{box.innerHTML='<img class="cp-ic" src="art/ic_gift.webp" alt=""><p class="cp-sub"></p><input class="cp-in" maxlength="20" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go" dir="ltr" placeholder="XXXX-XXXX-XXXX"><p class="cp-msg" aria-live="polite"></p>';
      box.querySelector('.cp-sub').textContent=t('cpSub');const inp=box.querySelector('.cp-in'),msg=box.querySelector('.cp-msg');inp.value=CPV.txt;msg.textContent=CPV.msg;msg.classList.toggle('err',!!CPV.err);
      inp.oninput=()=>{CPV.txt=inp.value;if(CPV.msg){CPV.msg='';msg.textContent=''}};
      inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();const b=document.querySelector('#card .cp-go');if(b)b.click()}}}
    card.appendChild(box)},
    actions:won?[{label:t('cpCollect'),primary:true,fn:()=>{hideOverlay();setTimeout(()=>{cpPend();cpSticker()},250)}}]
      :[{label:t('cpGo'),primary:true,fn:()=>{const inp=document.querySelector('#card .cp-in');if(inp)CPV.txt=inp.value;if(!cpNorm(CPV.txt))return;cpTry();rerenderOverlay();cpMark()}},
        {label:t('close'),fn:()=>{hideOverlay();openSettings()}}]}},true);cpMark()}
// tag the primary button so Enter on the keyboard can press it
function cpMark(){const all=[...document.querySelectorAll('#card button')];const go=all.find(x=>x.textContent.trim()===t('cpGo'));if(go)go.classList.add('cp-go')}
{const _sr3=settingsRows;settingsRows=function(card){_sr3(card);if(state==='paused')return;
  const r=document.createElement('div');r.className='opt-row';const l=document.createElement('span');l.textContent=t('cpRow');const b=document.createElement('button');b.className='buy';b.textContent=t('cpEnter');b.onclick=openCoupon;r.appendChild(l);r.appendChild(b);card.appendChild(r)}}
cpPend();cpSticker();   // a gift card closed by quitting the app
