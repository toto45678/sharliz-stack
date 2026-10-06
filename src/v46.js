/* ===== v46: own art for stages that used to borrow another world's art =====
   build.py injects ART_OWN = stage ids that have art/w3b_,w3m_,w3f_,mapn_<sid>.webp (season-4 worlds first, later night/storm sets).
   Such a stage switches its art id (z.id) to its sid; z.base keeps the world it was drawn from, and every per-world table /
   fallback picture (pop engine far_/g_/s_/back_/mid_, music, map road, K3Y…) is aliased to that base until it gets its own. */
const ART_OWN=__ART_OWN__,ART_CAP=__ART_CAP__,ART_MAP=__ART_MAP__;
const ART_BASE={};
// skies for the new worlds: [climb fraction, colour] like the classic ones
const NEW_SKY={jungle:[[0,'#d6f0c8'],[.35,'#8fd3a8'],[.75,'#3f9a8a'],[1.05,'#24606e'],[1.4,'#14283e']],
  castle:[[0,'#e7c9f0'],[.35,'#b18ad8'],[.75,'#6c4bb0'],[1.05,'#3a2a78'],[1.4,'#170f38']],
  clouds:[[0,'#fde4f2'],[.35,'#d8e8ff'],[.75,'#9fc4ff'],[1.05,'#6a8fe0'],[1.4,'#2c3a8a']],
  dino:[[0,'#ffe2b0'],[.35,'#ffc38a'],[.75,'#e98a6a'],[1.05,'#8e4f78'],[1.4,'#2e2050']],
  factory:[[0,'#d9f3f0'],[.35,'#9fd8de'],[.75,'#5aa0b8'],[1.05,'#355f86'],[1.4,'#1a2448']],
  crystal:[[0,'#d8c6ff'],[.35,'#a68af0'],[.75,'#6a4cc8'],[1.05,'#3b2a86'],[1.4,'#160e3a']]};
for(const z of ZONES){if(!ART_OWN.includes(z.sid)||z.sid===z.id)continue;
  ART_BASE[z.sid]=z.base=z.id;z.id=z.sid;z.ownArt=true;z.ownMap=ART_MAP.includes(z.sid);if(z.ownMap)z.mapf='';if(NEW_SKY[z.sid])z.sky=NEW_SKY[z.sid];
  for(const k of ['w3b_','w3m_','w3f_'].concat(z.ownMap?['mapn_']:[],ART_CAP.includes(z.sid)?['w3c_']:[])){PIC_NAMES.push(k+z.sid);PIC_SET.add(k+z.sid)}
  for(const T of [POP,K3Y,MAPROAD,LIFE,BAND,MUSF])if(T&&T[z.base]&&!T[z.sid])T[z.sid]=T[z.base];
  if(typeof BASECOL!=='undefined'&&BASECOL['far_'+z.base])BASECOL['far_'+z.sid]=BASECOL['far_'+z.base]}
// any picture the stage doesn't have yet comes from its base world
const ART_RE=Object.keys(ART_BASE).length?new RegExp('^(.*_)('+Object.keys(ART_BASE).join('|')+')(_.*)?$'):null;
function artAlias(n){if(!ART_RE||PIC_SET.has(n))return n;const m=n.match(ART_RE);return m?m[1]+ART_BASE[m[2]]+(m[3]||''):n}
{const _p=pic;pic=function(n){return _p(artAlias(n))}}
{const _l=loadPic;loadPic=function(n){return _l(artAlias(n))}}
