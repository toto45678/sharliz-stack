"""render a buddy from 4 angles with the game's lobby lights + a lobby screenshot. usage: pet3.py dragon [old]"""
import asyncio,json,subprocess,sys,time
from playwright.async_api import async_playwright
ROOT=__import__('os').path.dirname(__import__('os').path.dirname(__import__('os').path.dirname(__import__('os').path.abspath(__file__))))
import datetime;_d=datetime.date.today();DD=f'{_d.year}-{_d.month}-{_d.day}'
PIDS=sys.argv[1].split(',');PID=PIDS[0];OLD=len(sys.argv)>2
PROG={"unlocked":20,"stars":[3]*19,"coins":3200,"owned":{"pet":[PID]},"look":{"color":"teal","pet":PID},"skins":["none"],"tips":{"style":1,"dice":1,"done3":1,"fog":1},"fogSeen":1,"budGuide":1,
      "login":{"last":DD,"streak":1}}
JS="""async([id,old])=>{if(old){delete PET3D_META[id]}
  for(let i=0;i<60&&!(PET3D[id] instanceof ArrayBuffer)&&!old;i++)await new Promise(r=>setTimeout(r,200));
  const T=THREE,cv=document.createElement('canvas'),r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true,preserveDrawingBuffer:true});r.setPixelRatio(1);r.setSize(1400,250,false);
  r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;r.setClearColor('#efe9ff',1);
  const sc=new T.Scene();studioEnv(T,r,sc);const us=[];const angs=[0,-.7,-Math.PI/2,Math.PI];
  angs.forEach((a,i)=>{const u=buildPet(T,id);u.g.position.x=(i-1.5)*.95;u.g.rotation.y=a;sc.add(u.g);us.push(u)});
  // painted parts: wait for their textures (the game refreshes the buddy when they arrive; here we must render once)
  for(let i=0;i<60;i++){const pend=Object.values(typeof PET3TEX!=='undefined'?PET3TEX:{}).filter(t=>!(t.image&&(t.image.complete===undefined||t.image.complete)&&(t.image.naturalWidth||t.image.width)));if(!pend.length)break;await new Promise(r=>setTimeout(r,200))}
  us.forEach(u=>u.g.traverse(o=>{if(o.material&&o.material.map)o.material.needsUpdate=true}));
  const cam=new T.OrthographicCamera(-1.95,1.95,.62,-.06,.1,50);cam.position.set(0,0,10);cam.lookAt(0,0,0);r.render(sc,cam);return cv.toDataURL('image/png')}"""
async def main():
    srv=subprocess.Popen([sys.executable,'-m','http.server','8794'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        ctx=await b.new_context(locale='he-IL',viewport={'width':390,'height':844});pg=await ctx.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
        await pg.add_init_script(f"localStorage.setItem('sharliz-progress',{json.dumps(json.dumps(PROG))})")
        await pg.goto('http://localhost:8794/index.html');await pg.wait_for_timeout(8000)
        import base64
        for P_ in PIDS:
            url=await pg.evaluate(JS,[P_,OLD])
            open(f'/tmp/p3_{P_}{"_old" if OLD else ""}.png','wb').write(base64.b64decode(url.split(',')[1]))
        await pg.evaluate("try{document.querySelectorAll('#overlay:not([hidden]) .btn').forEach(b=>0)}catch(e){}")
        print('errors',errs[:5]);await b.close()
    srv.terminate()
asyncio.run(main())
