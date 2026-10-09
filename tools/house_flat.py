"""The FLAT Sharliz House art (Toca Boca look, Tzach Oct 9; spec /mnt/project-files/game/house/flat-spec.md).
usage:
  python3 -I tools/house_flat.py cut <sheet.png> <id,id,...> [outdir]
      cuts a sheet of items on a white (or transparent) background into <outdir>/f_<id>.png (transparent), in reading order
      (rows top to bottom, each row left to right); default outdir = the sheet's folder + /furniture. Prints each item's width in
      sheet px: items drawn at ONE scale keep their sizes relative to each other (HF_SZ in src/v67.js).
  python3 -I tools/house_flat.py import [/mnt/project-files/graphics/house/flat] [--all]
      rooms/room_<skin>_<room>.png  -> art/hf_room_<skin>_<room>.webp  (cropped to 4:3 from the middle, 1024x768)
      furniture/f_<id>.png          -> art/hf_<id>.webp                 (trimmed, max 520 px wide)
      furniture/f_<id>_d<N>.png     -> art/hf_<id>_d<N>.webp            (designs 2..10)
  Only files newer than their webp are converted (--all redoes everything). An item switches to its flat pictures in the game as soon as
  art/hf_<id>.webp exists; a room picture's floor line goes in HF_CAL (src/v67.js) when it isn't at 70% of the height."""
import sys,os,glob
import numpy as np
from PIL import Image
from scipy import ndimage as nd
ART=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'art')

def bg_mask(im):
    """background = transparent pixels, or near-white pixels connected to the picture's border"""
    a=np.asarray(im.convert('RGBA')).astype(np.int16)
    if (a[...,3]<200).mean()>.05:return a[...,3]<40
    rgb=a[...,:3];white=(rgb.min(-1)>226)&(rgb.max(-1)-rgb.min(-1)<26)
    lab,_=nd.label(white);edge=np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]]));edge=edge[edge>0]
    return np.isin(lab,edge)

def cut(sheet,ids,out):
    im=Image.open(sheet).convert('RGBA');bg=bg_mask(im);fg=~bg;H,W=fg.shape
    # join the bits of one item (bubbles, sparkles, a lamp's string) before splitting the sheet into items
    joined=nd.binary_dilation(fg,iterations=max(3,W//150));lab,n=nd.label(joined)
    objs=[(s,(lab[s]==k+1)&fg[s]) for k,s in enumerate(nd.find_objects(lab))]
    objs=[o for o in objs if o[1].sum()>fg.sum()*.004]
    if len(objs)!=len(ids):print(f'WARNING: found {len(objs)} items on the sheet, expected {len(ids)}')
    # reading order: rows (items whose vertical middles are close), then left to right
    objs.sort(key=lambda o:(o[0][0].start+o[0][0].stop)/2);rows=[]
    for o in objs:
        cy=(o[0][0].start+o[0][0].stop)/2
        if rows and abs(cy-rows[-1][0])<H*.12:rows[-1][1].append(o)
        else:rows.append([cy,[o]])
    order=[o for _,r in rows for o in sorted(r,key=lambda o:o[0][1].start)]
    os.makedirs(out,exist_ok=True);arr=np.asarray(im).copy()
    for id_,(s,m) in zip(ids,order):
        c=arr[s].copy();keep=nd.binary_dilation(m,iterations=1);c[...,3]=np.where(keep,c[...,3],0)
        p=Image.fromarray(c);bb=p.getchannel('A').getbbox();p=p.crop(bb)
        f=os.path.join(out,f'f_{id_}.png');p.save(f);print(f'{id_:10s} {p.width:4d} x {p.height:4d} px  -> {f}')

def trim(im,maxw):
    im=im.convert('RGBA');bb=im.getchannel('A').getbbox()
    if bb:im=im.crop(bb)
    if im.width>maxw:im=im.resize((maxw,round(im.height*maxw/im.width)),Image.LANCZOS)
    return im

def imp(src,all_):
    n=0
    for f in sorted(glob.glob(os.path.join(src,'rooms','room_*.png'))):
        o=os.path.join(ART,'hf_'+os.path.basename(f)[:-4]+'.webp')
        if not all_ and os.path.exists(o) and os.path.getmtime(o)>=os.path.getmtime(f):continue
        im=Image.open(f).convert('RGB');w,h=im.size
        if w/h>4/3:c=round(h*4/3);im=im.crop(((w-c)//2,0,(w-c)//2+c,h))
        elif w/h<4/3:c=round(w*3/4);im=im.crop((0,(h-c)//2,w,(h-c)//2+c))
        im=im.resize((1024,768),Image.LANCZOS);im.save(o,'WEBP',quality=86,method=6);n+=1;print(os.path.basename(o),im.size,os.path.getsize(o)//1024,'KB')
    for f in sorted(glob.glob(os.path.join(src,'furniture','f_*.png'))):
        o=os.path.join(ART,'hf_'+os.path.basename(f)[2:-4]+'.webp')
        if not all_ and os.path.exists(o) and os.path.getmtime(o)>=os.path.getmtime(f):continue
        im=trim(Image.open(f),520);im.save(o,'WEBP',quality=86,method=6);n+=1;print(os.path.basename(o),im.size,os.path.getsize(o)//1024,'KB')
    print(n,'converted')

if __name__=='__main__':
    a=[x for x in sys.argv[1:] if not x.startswith('--')]
    if a and a[0]=='cut':cut(a[1],a[2].split(','),a[3] if len(a)>3 else os.path.join(os.path.dirname(os.path.abspath(a[1])),'furniture'))
    elif a and a[0]=='import':imp(a[1] if len(a)>1 else '/mnt/project-files/graphics/house/flat','--all' in sys.argv)
    else:print(__doc__)
