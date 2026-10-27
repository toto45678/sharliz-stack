"""Tower base line of a levels-500 world: python3 -I tools/worlds/k3y.py <id> [...]
finds the top edge of the sand pad in the middle of art/w3f_<id>.webp and writes K3Y = pad top - .025
(the offset jungle's pad has against the farm value it was drawn for) to tools/worlds/k3y.json (v81 V81_K3Y)."""
import os,sys,json
import numpy as np
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT=os.path.join(ROOT,'tools','worlds','k3y.json')
D=json.load(open(OUT)) if os.path.exists(OUT) else {}
for id in sys.argv[1:]:
    a=np.array(Image.open(os.path.join(ROOT,'art',f'w3f_{id}.webp')).convert('RGBA')).astype(int)
    H,W=a.shape[:2];c=a[H//3:,W//2-30:W//2+30];r,g,b,al=c[...,0],c[...,1],c[...,2],c[...,3]
    rows=np.where(((al>200)&(r>180)&(g>120)&(g<185)&(b>60)&(b<130)).mean(1)>.8)[0]
    if not len(rows):print(id,'no pad found, left as is');continue
    D[id]=round((rows[0]+H//3)/H-.025,3);print(id,'K3Y',D[id])
json.dump(D,open(OUT,'w'),separators=(',',':'))
