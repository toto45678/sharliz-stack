"""Album v3 batches from the graphics department → art/stk_<id>.webp (src/v64.js shows a sticker once its picture is here).
usage: python3 tools/album_import.py [folder]      (default /mnt/project-files/graphics/stickers/album_v3)
  regular/<s025..s270>.png  die-cut sticker, transparent  → trimmed, fitted inside 287x332
  story/<st19..st118>.png   3:4 card                       → 390x520
  gold/<g01..g30>.png       3:4 card with the gold frame   → 390x520
File names may carry a prefix/suffix (stk_s025.png, s025_final.png); png/webp/jpg. Re-running overwrites.
Then: python3 tools/build.py (STK3_ART lists what is in art/)."""
import os,re,sys
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=sys.argv[1] if len(sys.argv)>1 else '/mnt/project-files/graphics/stickers/album_v3'
ID=re.compile(r'(?:stk_)?(s\d{3}|st\d{2,3}|g\d\d)(?=[^0-9]|$)')
def fit(im,W,H,trim):
    im=im.convert('RGBA')
    if trim:
        bb=im.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox()
        if bb:im=im.crop(bb)
    k=min(W/im.width,H/im.height);im=im.resize((max(1,round(im.width*k)),max(1,round(im.height*k))),Image.LANCZOS)
    if trim:return im                      # stickers keep their own shape (like art/stk_s21 265x332)
    out=Image.new('RGBA',(W,H),(0,0,0,0));out.paste(im,((W-im.width)//2,(H-im.height)//2),im);return out
n={}
for sub,(W,H,trim) in {'regular':(287,332,True),'story':(390,520,False),'gold':(390,520,False)}.items():
    d=os.path.join(SRC,sub)
    if not os.path.isdir(d):continue
    for f in sorted(os.listdir(d)):
        m=ID.match(f)
        if not m or not f.lower().endswith(('.png','.webp','.jpg','.jpeg')):continue
        sid=m.group(1)
        if ('story' if sid.startswith('st') else 'gold' if sid.startswith('g') else 'regular')!=sub:continue
        fit(Image.open(os.path.join(d,f)),W,H,trim).save(os.path.join(ROOT,'art',f'stk_{sid}.webp'),'WEBP',quality=86,method=6)
        n[sub]=n.get(sub,0)+1
print('imported',n or 'nothing')
