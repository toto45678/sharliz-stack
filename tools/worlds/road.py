"""Trace the white winding road of a world map panel (mapn_<id>) into MAPROAD points (x,y as 0..1, bottom to top).
usage: python3 -I tools/worlds/road.py <id> [<id> ...]   reads art/mapn_<id>.webp, writes tools/worlds/roads.json (build.py injects it into v81 as V81_ROADS)."""
import os,sys,json
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT=os.path.join(ROOT,'tools','worlds','roads.json')
def runs(px,W,y):
    r=[];s=None
    for x in range(W):
        p=px[x,y];w=min(p)>222 and max(p)-min(p)<28
        if w and s is None:s=x
        if not w and s is not None:
            if x-s>=W*.04:r.append((s,x))
            s=None
    if s is not None and W-s>=W*.04:r.append((s,W))
    return r
def trace(path,n=60):
    im=Image.open(path).convert('RGB');W,H=im.size;px=im.load();pts=[];prev=None
    for i in range(n):
        y=min(H-1,max(0,round(H-1-i*(H-1)/(n-1))))
        rs=[]
        for dy in (0,-4,4,-9,9,-15,15):
            rs=runs(px,W,min(H-1,max(0,y+dy)))
            if rs:break
        if not rs:continue
        if prev is None:c=max(rs,key=lambda r:r[1]-r[0])
        else:c=min(rs,key=lambda r:abs((r[0]+r[1])/2-prev))
        x=(c[0]+c[1])/2
        if prev is not None and abs(x-prev)>W*.12:continue
        prev=x;pts.append([round(x/W,3),round(y/(H-1),3)])
    return pts
D=json.load(open(OUT)) if os.path.exists(OUT) else {}
for id in sys.argv[1:]:
    D[id]={'path':trace(os.path.join(ROOT,'art',f'mapn_{id}.webp')),'stops':[]};print(id,len(D[id]['path']),'points')
json.dump(D,open(OUT,'w'),separators=(',',':'))
