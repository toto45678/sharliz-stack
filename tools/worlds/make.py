"""Generated world art (tools/worlds/<id>_<layer>.png, 2k GPT-Image) -> game sizes in art/.
w3b/w3m/w3f 900x1350 RGBA, w3c 900x703 RGBA, mapn 1024x1536 RGB (webp).
Night/storm sets (<world>N / <world>S) are relit copies of a day layer: their alpha is clipped to the day layer's
alpha (so no extra moons/clouds sneak into the empty areas).   python3 tools/worlds/make.py jungle farmN ..."""
import sys,os
from PIL import Image,ImageFilter,ImageChops
R=os.path.join(os.path.dirname(__file__),'..','..')
BASES=['farm','city','desert','candy','snow','ocean','volcano','space']
for w in sys.argv[1:]:
    base=w[:-1] if w[-1] in 'NS' and w[:-1] in BASES else None
    for k,size,mode,q in (('w3b',(900,1350),'RGBA',84),('w3m',(900,1350),'RGBA',84),('w3f',(900,1350),'RGBA',84),('w3c',(900,703),'RGBA',84),('mapn',(1024,1536),'RGB',82)):
        f=os.path.join(R,'tools','worlds',f'{w}_{k}.png')
        if not os.path.exists(f) or (base and k=='mapn'):continue  # night/storm maps keep the tinted day map
        im=Image.open(f).convert(mode).resize(size,Image.LANCZOS)
        if mode=='RGBA':
            a=im.getchannel('A').point(lambda v:0 if v<10 else v)
            if base:
                ba=Image.open(os.path.join(R,'art',f'{k}_{base}.webp')).convert('RGBA').resize(size).getchannel('A').filter(ImageFilter.MaxFilter(5))
                a=ImageChops.multiply(a,ba)
            im.putalpha(a)
        o=os.path.join(R,'art',f'{k}_{w}.webp');im.save(o,quality=q,method=4);print(o,os.path.getsize(o))
