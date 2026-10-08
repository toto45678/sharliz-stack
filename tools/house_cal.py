"""Check a room picture's floor corners: draws the 6x6 furniture grid from the 4 corners (top right bottom left, in the
picture's own px, the same numbers as HS_CAL in src/v67.js) onto the picture.
usage: python3 tools/house_cal.py art/hs_room_cottage_living.webp out.png 510,416 939,629 499,870 90,626"""
import sys
from PIL import Image,ImageDraw
src,out=sys.argv[1],sys.argv[2];T,R,B,L=[tuple(map(float,a.split(','))) for a in sys.argv[3:7]];G=6
im=Image.open(src).convert('RGBA');d=ImageDraw.Draw(im)
def q(u,v):return tuple((1-u)*(1-v)*T[k]+u*(1-v)*R[k]+u*v*B[k]+(1-u)*v*L[k] for k in (0,1))
for k in range(G+1):d.line([q(k/G,0),q(k/G,1)],fill=(255,0,60,255),width=3);d.line([q(0,k/G),q(1,k/G)],fill=(255,0,60,255),width=3)
im.save(out)
