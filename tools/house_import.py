"""Import the Sharliz House art from the graphics department into art/ (webp, right sizes).
usage: python3 tools/house_import.py [/mnt/project-files/graphics/house] [--all]
  rooms/room_<skin>_<room>.png -> art/hs_room_<skin>_<room>.webp (max 1024 px wide)
  exterior/house_<skin>.png     -> art/hs_house_<skin>.webp      (max 320 px, used as the skin swatch + lobby icon)
  furniture/f_<id>.png          -> art/hs_f_<id>.webp            (256 px per floor tile, as in the spec)
  furniture/f_<id>_d<N>.png     -> art/hs_f_<id>_d<N>.webp       (designs 2..10 of an item)
Only files newer than their webp are converted (--all redoes everything), 4 at a time.
A design that faces the other way than design 1 is mirrored on import: its outline is compared with design 1 and with
design 1 mirrored, and it is flipped when the mirror matches clearly better (by .12; the sofa designs were .2+, a crescent lamp .05 was a false flip; printed, check by eye).
A new room picture also needs its four floor corners in HS_CAL (src/v67.js); tools/house_cal.py draws the grid to check them."""
import sys,os,glob,re
from multiprocessing import Pool
from PIL import Image,ImageOps
args=[a for a in sys.argv[1:] if not a.startswith('--')]
SRC=args[0] if args else '/mnt/project-files/graphics/house'
ALL='--all' in sys.argv
ART=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'art')
def crop(im,maxw):
    im=im.convert('RGBA');bb=im.getchannel('A').getbbox()
    if bb:im=im.crop(bb)
    if im.width>maxw:im=im.resize((maxw,round(im.height*maxw/im.width)),Image.LANCZOS)
    return im
def outline(im,S=96):
    a=im.getchannel('A').point(lambda v:255 if v>40 else 0).resize((S,S));return [p>127 for p in a.tobytes()]
def iou(a,b):
    i=sum(x and y for x,y in zip(a,b));u=sum(x or y for x,y in zip(a,b));return i/u if u else 0
def job(t):
    kind,f,out=t
    if kind=='room':
        im=Image.open(f).convert('RGBA');w=min(1024,im.width)   # rooms keep their full canvas (HS_CAL corners are in its px)
        if im.width>w:im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    else:im=crop(Image.open(f),320 if kind=='house' else 520)
    note=''
    m=re.match(r'f_(\w+?)_d\d+$',os.path.basename(f)[:-4])
    if m:
        d1=os.path.join(os.path.dirname(f),'f_'+m.group(1)+'.png')
        if os.path.exists(d1):
            b=crop(Image.open(d1),520);o=outline(im);same=iou(o,outline(b));mir=iou(o,outline(ImageOps.mirror(b)))
            if mir>same+.12:im=ImageOps.mirror(im);note=f'  MIRRORED to face like design 1 ({same:.2f} vs {mir:.2f})'
    im.save(out,'WEBP',quality=86,method=6)
    return f'{os.path.basename(out)} {im.size} {os.path.getsize(out)//1024} KB{note}'
jobs=[]
for kind,pat in (('room','rooms/room_*.png'),('house','exterior/house_*.png'),('f','furniture/f_*.png')):
    for f in sorted(glob.glob(os.path.join(SRC,pat))):
        out=os.path.join(ART,'hs_'+os.path.basename(f)[:-4]+'.webp')
        if ALL or not os.path.exists(out) or os.path.getmtime(out)<os.path.getmtime(f):jobs.append((kind,f,out))
if __name__=='__main__':
    with Pool(4) as p:
        for line in p.imap(job,jobs):print(line)
    print(len(jobs),'converted')
