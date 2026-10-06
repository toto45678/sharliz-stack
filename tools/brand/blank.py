import cv2, numpy as np
from PIL import Image, ImageDraw
im=Image.open('/mnt/project-files/logo-icon/refs/characters.png').convert('RGB')
W,H=im.size
for i,name in enumerate(['pink','orange','teal','magenta']):
    c=np.array(im.crop((i*W//4,0,(i+1)*W//4,H)))
    hsv=cv2.cvtColor(c,cv2.COLOR_RGB2HSV)
    # body silhouette: not white background (flood from corners)
    pil=Image.fromarray(c); bg=pil.copy(); ImageDraw.floodfill(bg,(2,2),(255,0,255),thresh=40); ImageDraw.floodfill(bg,(bg.width-3,bg.height-3),(255,0,255),thresh=40)
    b=np.array(bg); body=~((b[:,:,0]==255)&(b[:,:,1]==0)&(b[:,:,2]==255))
    body=body.astype(np.uint8)*255
    inner=cv2.erode(body,np.ones((25,25),np.uint8))
    white=((hsv[:,:,1]<60)&(hsv[:,:,2]>170)).astype(np.uint8)*255
    dark=(hsv[:,:,2]<90).astype(np.uint8)*255
    # face region only: upper-middle band
    ys,xs=np.nonzero(body); y0,y1=ys.min(),ys.max()
    band=np.zeros_like(body); band[int(y0+(y1-y0)*.15):int(y0+(y1-y0)*.62),:]=255
    m=((white|dark)&inner&band)
    # keep only big white blobs (eyes) + dark near them: just dilate
    m=cv2.dilate(m,np.ones((9,9),np.uint8))
    # gloss highlights are white too: drop small components
    n,lab,st,_=cv2.connectedComponentsWithStats(m)
    keep=np.zeros_like(m)
    for k in range(1,n):
        if st[k,cv2.CC_STAT_AREA]>800: keep[lab==k]=255
    out=cv2.inpaint(c,keep,15,cv2.INPAINT_TELEA)
    Image.fromarray(out).save(f'blank_{name}.png'); Image.fromarray(keep).save(f'mask_{name}.png')
    np.save(f'body_{name}.npy',body)
    print(name, c.shape)
