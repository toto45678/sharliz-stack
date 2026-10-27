"""Import a levels-500 world from graphics: python3 -I tools/worlds/import500.py <id> [<id> ...]
reads /mnt/project-files/graphics/levels-500/<id>/{w3b,w3m,w3f,mapn,bg}_<id>.png -> art/*.webp, traces the map road (road.py) and makes the home background (+ shop thumbnail)."""
import os,sys,subprocess,tempfile
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))));ART=os.path.join(ROOT,'art')
G='/mnt/project-files/graphics/levels-500'
tmp=tempfile.mkdtemp();roads=[]
for id in sys.argv[1:]:
    S=os.path.join(G,id)
    for k in ('w3b','w3m','w3f'):
        f=os.path.join(S,f'{k}_{id}.png')
        if os.path.exists(f):Image.open(f).convert('RGBA').save(os.path.join(ART,f'{k}_{id}.webp'),'WEBP',quality=82,method=6)
    f=os.path.join(S,f'mapn_{id}.png')
    if os.path.exists(f):Image.open(f).convert('RGB').save(os.path.join(ART,f'mapn_{id}.webp'),'WEBP',quality=80,method=6);roads.append(id)
    f=os.path.join(S,f'bg_{id}.png')
    if os.path.exists(f):os.symlink(f,os.path.join(tmp,f'bg_{id}.png'))
    print(id,'done')
if roads:subprocess.run([sys.executable,'-I',os.path.join(ROOT,'tools/worlds/road.py')]+roads,check=True)
subprocess.run([sys.executable,'-I',os.path.join(ROOT,'tools/worlds/k3y.py')]+sys.argv[1:],check=True)
if os.listdir(tmp):subprocess.run([sys.executable,'-I',os.path.join(ROOT,'tools/backgrounds/make.py'),tmp],check=True)
