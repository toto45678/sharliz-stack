"""Home backgrounds (v71): ChatGPT originals -> art/bg_<id>.webp (1024x1536) + shop thumbnails art/bgt_<id>.webp (240x360).
usage: python3 tools/backgrounds/make.py [folder with bg_<id>.png]   (default /mnt/project-files/graphics/chatgpt/backgrounds)
ids: a stage id for boss backgrounds (farm, farmN, jungle...) or sp_<name> for the specials in BG_SP (src/v71.js).
Also refreshes art/bgt_lobby.webp (the classic background's thumbnail). Pictures keep lobby.webp's podium: top at 65.5% height."""
import os,sys,glob
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))));ART=os.path.join(ROOT,'art')
SRC=sys.argv[1] if len(sys.argv)>1 else '/mnt/project-files/graphics/chatgpt/backgrounds'
W,H=1024,1536
def cover(im,w,h):
    k=max(w/im.width,h/im.height);im=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS)
    x,y=(im.width-w)//2,(im.height-h)//2;return im.crop((x,y,x+w,y+h))
def make(src,id):
    im=cover(Image.open(src).convert('RGB'),W,H)
    im.save(os.path.join(ART,f'bg_{id}.webp'),'WEBP',quality=80,method=6)
    cover(im,240,360).save(os.path.join(ART,f'bgt_{id}.webp'),'WEBP',quality=76,method=6)
    return os.path.getsize(os.path.join(ART,f'bg_{id}.webp'))
cover(Image.open(os.path.join(ART,'lobby.webp')).convert('RGB'),240,360).save(os.path.join(ART,'bgt_lobby.webp'),'WEBP',quality=76,method=6)
n=0
for f in sorted(glob.glob(os.path.join(SRC,'bg_*.png'))+glob.glob(os.path.join(SRC,'bg_*.jpg'))+glob.glob(os.path.join(SRC,'bg_*.webp'))):
    id=os.path.splitext(os.path.basename(f))[0][3:]
    print(f'bg_{id}: {make(f,id)//1024} KB');n+=1
print(n,'backgrounds')
