"""Builds the home-screen icons (icons/) and lobby logos (art/logo_*.webp) from the ChatGPT masters in tools/brand/chatgpt/.
usage: python3 tools/brand/make_icons.py [icon1|icon2]"""
import os,sys
from PIL import Image,ImageFilter
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
M=os.path.join(ROOT,'tools','brand','chatgpt')
pick=sys.argv[1] if len(sys.argv)>1 else 'icon1'
src=Image.open(os.path.join(M,pick+'.png')).convert('RGB')          # iOS icons must be opaque
w,h=src.size;s=min(w,h);src=src.crop(((w-s)//2,(h-s)//2,(w-s)//2+s,(h-s)//2+s)).resize((1024,1024),Image.LANCZOS)
for n in [1024,512,192,180,167,152,120]:
    src.resize((n,n),Image.LANCZOS).save(os.path.join(ROOT,'icons',f'icon-{n}.png'),optimize=True)
# maskable (Android): art inside the 80% safe circle, blurred art behind it
bg=src.resize((512,512),Image.LANCZOS).filter(ImageFilter.GaussianBlur(18))
bg.paste(src.resize((410,410),Image.LANCZOS),(51,51));bg.save(os.path.join(ROOT,'icons','icon-maskable-512.png'),optimize=True)
for L in ['en','he']:
    im=Image.open(os.path.join(M,f'logo_{L}.png')).convert('RGBA');im=im.crop(im.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox())
    im.thumbnail((900,900),Image.LANCZOS);im.save(os.path.join(ROOT,'art',f'logo_{L}.webp'),quality=92,method=6)
    print(L,im.size)
print('icons from',pick)
