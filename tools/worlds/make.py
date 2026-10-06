"""Generated world art (tools/worlds/<id>_<layer>.png, 2k from GPT-Image) -> game sizes in art/.
w3b/w3m/w3f: 900x1350 RGBA webp; mapn: 1024x1536 RGB webp.  python3 tools/worlds/make.py jungle castle ..."""
import sys,os
from PIL import Image
R=os.path.join(os.path.dirname(__file__),'..','..')
for w in sys.argv[1:]:
    for k,size,mode,q in (('w3b',(900,1350),'RGBA',84),('w3m',(900,1350),'RGBA',84),('w3f',(900,1350),'RGBA',84),('mapn',(1024,1536),'RGB',82)):
        f=os.path.join(R,'tools','worlds',f'{w}_{k}.png')
        if not os.path.exists(f):print('missing',f);continue
        im=Image.open(f).convert(mode).resize(size,Image.LANCZOS)
        if mode=='RGBA':  # clean faint alpha noise in the empty areas
            a=im.getchannel('A').point(lambda v:0 if v<10 else v);im.putalpha(a)
        o=os.path.join(R,'art',f'{k}_{w}.webp');im.save(o,quality=q,method=6);print(o,os.path.getsize(o))
