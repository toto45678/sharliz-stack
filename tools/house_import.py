"""Import the Sharliz House art from the graphics department into art/ (webp, right sizes).
usage: python3 tools/house_import.py [/mnt/project-files/graphics/house]
  rooms/room_<skin>_<room>.png -> art/hs_room_<skin>_<room>.webp (max 1024 px wide)
  exterior/house_<skin>.png     -> art/hs_house_<skin>.webp      (max 320 px, used as the skin swatch + lobby icon)
  furniture/f_<id>.png          -> art/hs_f_<id>.webp            (256 px per floor tile, as in the spec)
A new room picture also needs its four floor corners in HS_CAL (src/v67.js); tools/house_cal.py draws the grid to check them."""
import sys,os,glob
from PIL import Image
SRC=sys.argv[1] if len(sys.argv)>1 else '/mnt/project-files/graphics/house'
ART=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'art')
def save(im,out,maxw):
    im=im.convert('RGBA');bb=im.getchannel('A').getbbox()
    if bb:im=im.crop(bb)
    if im.width>maxw:im=im.resize((maxw,round(im.height*maxw/im.width)),Image.LANCZOS)
    im.save(out,'WEBP',quality=86,method=6);print(os.path.basename(out),im.size,os.path.getsize(out)//1024,'KB')
for f in sorted(glob.glob(os.path.join(SRC,'rooms','room_*.png'))):
    im=Image.open(f).convert('RGBA');w=min(1024,im.width)   # rooms keep their full canvas (HS_CAL corners are in its px)
    if im.width>w:im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    out=os.path.join(ART,'hs_'+os.path.basename(f)[:-4]+'.webp');im.save(out,'WEBP',quality=86,method=6);print(os.path.basename(out),im.size,os.path.getsize(out)//1024,'KB')
for f in sorted(glob.glob(os.path.join(SRC,'exterior','house_*.png'))):save(Image.open(f),os.path.join(ART,'hs_'+os.path.basename(f)[:-4]+'.webp'),320)
for f in sorted(glob.glob(os.path.join(SRC,'furniture','f_*.png'))):save(Image.open(f),os.path.join(ART,'hs_'+os.path.basename(f)[:-4]+'.webp'),520)
