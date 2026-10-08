"""deterministic little clip of a buddy hopping/blinking/fluttering (frames rendered in the game engine) -> mp4.
usage: pet3anim.py dragon out.mp4 [seconds]"""
import asyncio,json,subprocess,sys,time,base64,os,datetime
from playwright.async_api import async_playwright
ROOT=__import__('os').path.dirname(__import__('os').path.dirname(__import__('os').path.dirname(__import__('os').path.abspath(__file__))))
PID=sys.argv[1];OUT=sys.argv[2];SEC=float(sys.argv[3]) if len(sys.argv)>3 else 4
_d=datetime.date.today();DD=f'{_d.year}-{_d.month}-{_d.day}'
PROG={"unlocked":20,"stars":[3]*19,"coins":3200,"owned":{"pet":[PID]},"look":{"color":"teal","pet":PID},"skins":["none"],"tips":{"style":1,"dice":1,"done3":1,"fog":1},"fogSeen":1,"budGuide":1,"login":{"last":DD,"streak":1}}
SETUP="""async(id)=>{for(let i=0;i<60&&!(PET3D[id] instanceof ArrayBuffer);i++)await new Promise(r=>setTimeout(r,200));
  const T=THREE,cv=document.createElement('canvas'),r=new T.WebGLRenderer({canvas:cv,alpha:false,antialias:true,preserveDrawingBuffer:true});r.setPixelRatio(1);r.setSize(540,540,false);
  r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;r.setClearColor('#f1ebff',1);
  const sc=new T.Scene();studioEnv(T,r,sc);const u=buildPet(T,id);u.t=0;u.blinkAt=1.2;sc.add(u.g);
  const sh=new T.Mesh(new T.CircleGeometry(.2,32),new T.MeshBasicMaterial({color:'#120d2b',transparent:true,opacity:.18}));sh.rotation.x=-Math.PI/2;sh.position.y=.001;sc.add(sh);
  const cam=new T.PerspectiveCamera(30,1,.1,50);cam.position.set(0,.55,2.1);cam.lookAt(0,.36,0);window._A={r,sc,u,cam,cv,sh};return 1}"""
FRAME="""(f)=>{const {r,sc,u,cam,cv,sh}=window._A,dt=1/30,t=f*dt;petStep(u,0,dt);
  // the lobby hop: hop, hop, a little pause; squash on landing; turns a bit to look around
  const ph=t%3.2,moving=ph<2.2,hop=moving?Math.abs(Math.sin(t*5.2)):0,sq=moving&&hop<.14?.86:1;
  u.g.position.y=hop*.16;u.g.scale.set(2-sq,sq,2-sq);u.g.rotation.y=Math.sin(t*.9)*.55;
  sh.scale.setScalar(1-hop*.35);r.render(sc,cam);return cv.toDataURL('image/jpeg',.92)}"""
async def main():
    srv=subprocess.Popen([sys.executable,'-m','http.server','8795'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
    D=OUT+'_frames';os.makedirs(D,exist_ok=True)
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        ctx=await b.new_context(viewport={'width':390,'height':844});pg=await ctx.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script(f"localStorage.setItem('sharliz-progress',{json.dumps(json.dumps(PROG))})")
        await pg.goto('http://localhost:8795/index.html');await pg.wait_for_timeout(7000)
        await pg.evaluate(SETUP,PID)
        n=int(SEC*30)
        for f in range(n):
            u=await pg.evaluate(FRAME,f);open(f'{D}/{f:04d}.jpg','wb').write(base64.b64decode(u.split(',')[1]))
        print('errors',errs[:3]);await b.close()
    srv.terminate()
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{D}/%04d.jpg','-c:v','libx264','-pix_fmt','yuv420p','-crf','20',OUT])
    print('wrote',OUT,os.path.getsize(OUT))
asyncio.run(main())
