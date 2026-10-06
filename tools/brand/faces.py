import cv2, numpy as np, math
from PIL import Image, ImageDraw, ImageFilter
SRC=Image.open('/mnt/project-files/logo-icon/refs/characters.png').convert('RGB')
W,H=SRC.size; SS=4; INK=(26,14,48)

def eyes_of(c, body):
    hsv=cv2.cvtColor(c,cv2.COLOR_RGB2HSV)
    white=((hsv[:,:,1]<50)&(hsv[:,:,2]>185)).astype(np.uint8)*255
    white&=cv2.erode(body,np.ones((25,25),np.uint8))
    n,lab,st,cen=cv2.connectedComponentsWithStats(white)
    big=sorted(range(1,n),key=lambda k:-st[k,cv2.CC_STAT_AREA])[:2]
    out=[]
    for k in big:
        cs,_=cv2.findContours((lab==k).astype(np.uint8),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
        (x,y),(MA,ma),ang=cv2.fitEllipse(max(cs,key=len))
        out.append(dict(cx=x,cy=y,rx=MA/2,ry=ma/2,ang=ang,mask=(lab==k)))
    return sorted(out,key=lambda e:e['cx'])

def overlay(size):
    return Image.new('RGBA',(size[0]*SS,size[1]*SS),(0,0,0,0))

def lid(img, blank, e, f, side, line=True, reach=1.18, blur=14):
    """Cover the part of eye e where f(x,y)>0 (x,y relative to eye center, normalised by radii) with body texture, then ink the edge."""
    h,w=e['mask'].shape
    yy,xx=np.mgrid[0:h,0:w]
    nx=(xx-e['cx'])/e['rx']; ny=(yy-e['cy'])/e['ry']
    inside=(nx**2+ny**2)<=reach
    cover=inside & (f(nx,ny)>0)
    # soft edge
    m=Image.fromarray((cover*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    img.paste(blank.filter(ImageFilter.GaussianBlur(blur)), (0,0), m)
    if line:
        ov=overlay((w,h)); d=ImageDraw.Draw(ov)
        pts=[]
        for t in np.linspace(-1.05,1.05,160):
            # find boundary y for this x by scanning
            col=[ny_ for ny_ in np.linspace(-1.1,1.1,400) if (t**2+ny_**2)<=1.12 and abs(f(t,ny_))<0.02]
            if col: pts.append(((e['cx']+t*e['rx'])*SS,(e['cy']+np.mean(col)*e['ry'])*SS))
        if len(pts)>2: d.line(pts,fill=INK,width=int(7*SS),joint='curve')
        img.alpha_composite(ov.resize((w,h),Image.LANCZOS))

def ink(img, draw_fn):
    ov=overlay(img.size); d=ImageDraw.Draw(ov); draw_fn(d, SS)
    img.alpha_composite(ov.resize(img.size,Image.LANCZOS))

def patch_mouth(img, blank, mx, my, r):
    h,w=img.size[1],img.size[0]
    m=Image.new('L',(w,h),0); ImageDraw.Draw(m).ellipse((mx-r,my-r,mx+r,my+r),fill=255)
    img.paste(blank,(0,0),m.filter(ImageFilter.GaussianBlur(2)))

def blush(img, x, y, rx, ry, col=(255,90,140), a=110):
    ov=Image.new('RGBA',img.size,(0,0,0,0)); ImageDraw.Draw(ov).ellipse((x-rx,y-ry,x+rx,y+ry),fill=col+(a,))
    img.alpha_composite(ov.filter(ImageFilter.GaussianBlur(rx*.45)))

names=['pink','orange','teal','magenta']
for i,name in enumerate(names):
    c=np.array(SRC.crop((i*W//4,0,(i+1)*W//4,H)))
    body=np.load(f'body_{name}.npy')
    E=eyes_of(c,body); L,R=E
    blank=Image.open(f'blank_{name}.png').convert('RGBA')
    soft=blank.filter(ImageFilter.GaussianBlur(18))
    img=Image.fromarray(c).convert('RGBA')
    mx=(L['cx']+R['cx'])/2
    hsv=cv2.cvtColor(c,cv2.COLOR_RGB2HSV); dk=(hsv[:,:,2]<80)
    x0,x1=int(L['cx']+L['rx']*.6),int(R['cx']-R['rx']*.6); y0,y1=int(L['cy']-L['ry']*.1),int(L['cy']+L['ry']*1.1)
    ys,xs=np.nonzero(dk[y0:y1,x0:x1]); omx,omy=x0+xs.mean(),y0+ys.mean()
    patch_mouth(img,soft,omx,omy,max(14,(ys.max()-ys.min())*0.9))
    my=omy+30
    S=lambda v:v*SS
    if name=='teal':      # BRAVE: determined lids slanting down to the middle + confident grin
        lid(img,blank,L,lambda x,y: -(y+0.62-0.30*x),1)
        lid(img,blank,R,lambda x,y: -(y+0.62+0.30*x),1)
        ink(img,lambda d,s: d.arc((S(mx-30),S(my-40),S(mx+34),S(my+6)),20,150,fill=INK,width=int(7*s)))
    if name=='orange':    # SUNNY: happy squinting eyes (cheeks push up) + big open smile + blush
        lid(img,blank,L,lambda x,y: (y-(0.6-0.62*(1-x*x))),1)
        lid(img,blank,R,lambda x,y: (y-(0.6-0.62*(1-x*x))),1)
        def sm(d,s):
            box=(S(mx-42),S(my-46),S(mx+42),S(my+22))
            d.chord(box,0,180,fill=(70,20,40,255),outline=INK,width=int(6*s))
            d.chord((S(mx-22),S(my-6),S(mx+22),S(my+18)),180,360,fill=(255,120,150,255))
        ink(img,sm)
        blush(img,L['cx']-L['rx']*.35,L['cy']+L['ry']*1.05,40,22)
        blush(img,R['cx']+R['rx']*.35,R['cy']+R['ry']*1.05,40,22)
    if name=='pink':      # SHY: sleepy half-closed lids, looking down, tiny wobbly smile, strong blush
        lid(img,blank,L,lambda x,y: -(y+0.12-0.12*x*x),1)
        lid(img,blank,R,lambda x,y: -(y+0.12-0.12*x*x),1)
        def wv(d,s):
            pts=[(S(mx-18+t*36),S(my-14+3.5*math.sin(t*math.pi*2))) for t in np.linspace(0,1,40)]
            d.line(pts,fill=INK,width=int(5*s),joint='curve')
        ink(img,wv)
        blush(img,L['cx']-L['rx']*.2,L['cy']+L['ry']*1.0,50,26,a=150)
        blush(img,R['cx']+R['rx']*.2,R['cy']+R['ry']*1.0,50,26,a=150)
    if name=='magenta':   # CHEEKY: wink + smirk with tongue out
        h_,w_=c.shape[:2]; yy,xx=np.mgrid[0:h_,0:w_]
        reg=((((xx-L['cx'])/L['rx'])**2+((yy-L['cy'])/L['ry'])**2)<=1.6).astype(np.uint8)*255
        cur=np.array(img.convert('RGB')); fill=cv2.inpaint(cur,reg,25,cv2.INPAINT_TELEA)
        fill=Image.fromarray(fill).filter(ImageFilter.GaussianBlur(10)).convert('RGBA')
        img.paste(fill,(0,0),Image.fromarray(reg).filter(ImageFilter.GaussianBlur(3)))   # fully closed left eye
        ink(img,lambda d,s: d.arc((S(L['cx']-L['rx']*.85),S(L['cy']-L['ry']*.25),S(L['cx']+L['rx']*.85),S(L['cy']+L['ry']*.75)),190,350,fill=INK,width=int(10*s)))
        def sk(d,s):
            d.arc((S(mx-34),S(my-44),S(mx+30),S(my)),25,155,fill=INK,width=int(7*s))
            d.chord((S(mx-2),S(my-12),S(mx+24),S(my+20)),0,180,fill=(255,110,150,255),outline=INK,width=int(4*s))
        ink(img,sk)
    # crop + transparent bg
    pil=img.copy(); a=Image.fromarray(body).filter(ImageFilter.GaussianBlur(.8)); pil.putalpha(a)
    pil=pil.crop(pil.getbbox()); pil.save(f'face_{name}.png')
    print(name,[ (round(e['cx']),round(e['cy']),round(e['rx']),round(e['ry']),round(e['ang'])) for e in E])
