/* ===== v58: illustrated sticker chapters (Tzach) =====
   Rare chapter = 18 STORY stickers (illustrated scenes, holo glow), earned by catching rare Sharliz on the rope.
   Boss chapter = 30 illustrated battle scenes (Sharliz vs that boss), holo glow. Worlds = illustrated postcard of each world. */
Object.assign(I18N.en,{pg_rare:'Sharliz stories',hint_rare:'Catch a rare Sharliz on the rope',stkVs:'Sharliz vs {b}',storyGot:'New story sticker!'});
Object.assign(I18N.he,{pg_rare:'סיפורי שארליז',hint_rare:'תפסו שארליז נדיר על החבל',stkVs:'שארליז נגד {b}',storyGot:'מדבקת סיפור חדשה!'});
const STORY=[
 ['st01','Flower picnic','פיקניק בפרחים','Sandwiches taste better with friends.','כריכים טעימים יותר עם חברים.'],
 ['st02','Sandcastle tower','מגדל חול','The tallest sandcastle on the beach!','ארמון החול הכי גבוה בחוף!'],
 ['st03','To the moon','עד הירח','Stack high enough and you reach the moon.','אם בונים מספיק גבוה — מגיעים לירח.'],
 ['st04','Balloon ride','טיסה בכדור פורח','The view from up here is the best.','הנוף מכאן הכי יפה.'],
 ['st05','Birthday party','מסיבת יום הולדת','Make a wish!','תבקשו משאלה!'],
 ['st06','Snowball fight','מלחמת כדורי שלג','Nobody is safe in the snow village.','אף אחד לא מוגן בכפר השלג.'],
 ['st07','Under the sea','מתחת לים','Blub blub — hello fishies!','בלוב בלוב — שלום דגים!'],
 ['st08','Campfire night','מדורה בלילה','Stories under a million stars.','סיפורים מתחת למיליון כוכבים.'],
 ['st09','Lift-off!','המראה!','3… 2… 1… Sharliz in space!','3… 2… 1… שארליז בחלל!'],
 ['st10','Roller coaster','רכבת הרים','Hold on tight! (with what?)','תחזיקו חזק! (במה?)'],
 ['st11','Rainbow slide','מגלשת קשת','The fastest way down a rainbow.','הדרך הכי מהירה לרדת מקשת.'],
 ['st12','Sunset fishing','דייג בשקיעה','Something is pulling the line…','משהו מושך בחכה…'],
 ['st13','Jungle river','נהר בג׳ונגל','A leaf boat adventure.','הרפתקה בסירת עלה.'],
 ['st14','Rock concert','הופעת רוק','The crowd sings every word!','הקהל שר כל מילה!'],
 ['st15','Rainy day','יום גשום','Puddles are for jumping.','שלוליות זה בשביל לקפוץ.'],
 ['st16','Family photo','תמונה משפחתית','Everybody say “Sharliz!”','כולם להגיד „שארליז!”'],
 ['st17','Dragon flight','מעוף הדרקון','Over the castle and far away.','מעל הטירה והרחק משם.'],
 ['st18','Treasure cave','מערת האוצר','It glows… it\'s ours!','זה זוהר… זה שלנו!']];
function storySync(){try{const D=sbData();D.story=D.story||[];const al=progress.album||{};const caught=Object.values(al).reduce((a,v)=>a+(+v||0),0);const target=Math.min(STORY.length,caught);let added=0;
  while(D.story.length<target){const left=STORY.map(s=>s[0]).filter(id=>!D.story.includes(id));if(!left.length)break;D.story.push(pick(left));added++}if(added)saveProgress();return added}catch(e){return 0}}
{const P=STK_PAGES.find(p=>p.id==='rare');if(P)P.items=()=>{const D=sbData(),L=lang==='he'?1:0,own=D.story||[];return STORY.map(s=>({id:'story:'+s[0],n:own.includes(s[0])?1:0,src:'art/stk_'+s[0]+'.webp',name:L?s[2]:s[1],line:L?s[4]:s[3],rar:'h',card:1}))}}
{const P=STK_PAGES.find(p=>p.id==='boss');if(P){const _it=P.items;P.items=()=>_it().map(it=>{const z=it.id.slice(5);return Object.assign(it,{src:'art/stk_b_'+z+'.webp',rar:'h',card:1,name:t('stkVs',{b:it.name})})})}}
/* worlds: an illustrated postcard of each world (art/stk_w_<sid>.webp); worlds still waiting for art use their game layers */
const W_ART='farm city desert candy snow ocean volcano space jungle castle clouds dino'.split(' ');
const WSTK={};
function worldStk(z,cb){const k=z.sid||z.id;if(WSTK[k]&&WSTK[k]!=='…')return WSTK[k];if(WSTK[k]==='…')return '';WSTK[k]='…';
  const ids=['w3b','w3m','w3f'].map(L=>{const a=typeof artAlias==='function'?artAlias(L+'_'+k):L+'_'+k;return 'art/'+a+'.webp'});
  const c=document.createElement('canvas');c.width=300;c.height=400;const g=c.getContext('2d');const sky=z.sky||[[0,'#9cc8d2'],[1,'#35558e']];
  const gr=g.createLinearGradient(0,400,0,0);sky.forEach(([tt,col])=>gr.addColorStop(Math.min(1,tt/1.1),col));g.fillStyle=gr;g.fillRect(0,0,300,400);
  let n=0;const ims=ids.map(src=>{const im=new Image();im.onload=im.onerror=()=>{if(++n===ids.length){ims.forEach(i=>{if(i.naturalWidth){const sw=i.naturalWidth,sh=i.naturalHeight,cw=sw*.86,ch=cw*4/3;g.drawImage(i,(sw-cw)/2,sh-ch,cw,ch,0,0,300,400)}});try{WSTK[k]=c.toDataURL('image/webp',.85)}catch(e){WSTK[k]=''}cb&&cb()}};im.src=src;return im});return ''}
{const P=STK_PAGES.find(p=>p.id==='world');if(P){const _it=P.items;P.items=()=>{const it=_it();return it.map((x,i)=>{const z=ZONES[i],k=z.sid||z.id;if(W_ART.includes(k))return Object.assign(x,{src:'art/stk_w_'+k+'.webp',img:null,round:false,card:1});return Object.assign(x,{src:null,round:false,card:1,img:()=>worldStk(z,()=>{if(typeof SB!=='undefined'&&SB.view==='page'&&sbChapters()[SB.ch]&&sbChapters()[SB.ch].id==='world'){clearTimeout(WSTK._t);WSTK._t=setTimeout(()=>sbPageView(),60)}})})})}}}
{const _o=openAlbum;openAlbum=function(){storySync();return _o.apply(this,arguments)}}
{const _ul=updateLobby;updateLobby=function(){const r=_ul.apply(this,arguments);try{if(storySync())stkBadge()}catch(e){}return r}}
/* buddies: an illustrated scene of the buddy with Sharliz (paid buddies glow) */
{const P=STK_PAGES.find(p=>p.id==='buddy');if(P){const _it=P.items;P.items=()=>_it().map(it=>{const id=it.id.slice(6);return Object.assign(it,{src:'art/stk_p_'+id+'.webp',img:null,card:1,rar:WPET[id]&&WPET[id].real?'h':'c'})})}}
