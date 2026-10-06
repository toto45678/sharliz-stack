import asyncio,sys,base64,json
from playwright.async_api import async_playwright
OUT=sys.argv[1]
JOBS=[(c,f,h) for c in ['pink','orange','teal','magenta'] for f in [0,2,4,3,1] for h in ['none']]+[('pink',2,'king'),('orange',0,'party'),('teal',2,'propeller')]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.goto('http://localhost:8799/index.html')
    for i in range(80):
      await pg.wait_for_timeout(500)
      if await pg.evaluate("typeof H3!=='undefined'&&H3.state==='ready'"):break
    for c,f,h in JOBS:
      url=await pg.evaluate("""([c,f,h])=>{const T=THREE;if(!window._R){const cv=document.createElement('canvas'),r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true,preserveDrawingBuffer:true});r.setPixelRatio(1);r.setSize(1200,2150,false);r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=0.92;r.setClearColor(0,0);
        const sc=new T.Scene();studioEnv(T,r,sc);const P=buildSharliz3D(T);P.g.rotation.x=.05;sc.add(P.g);const cam=new T.OrthographicCamera(-.6,.6,2.1,-.05,.1,50);cam.position.set(0,0,10);cam.lookAt(0,0,0);window._R={r,sc,P,cam}}
        const {r,sc,P,cam}=window._R;applyLook(P,Object.assign({},LOOK0,{color:c,hat:h}));setFace3(P,f);r.render(sc,cam);return r.domElement.toDataURL('image/png')}""",[c,f,h])
      open(f'{OUT}/{c}_{f}_{h}.png','wb').write(base64.b64decode(url.split(',')[1]))
    await b.close()
asyncio.run(main())
