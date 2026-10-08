"""Mechanic explainer videos (v62): plays a scripted scene in the real game with a virtual clock, draws the hints
(hand, rings, arrows, red X / green check) on an overlay, screenshots every frame and encodes art/mv_<mech>.mp4.
usage: python3 tools/mechvid/rec.py bats art/mv_bats.mp4 [--probe]   (scenes in tools/mechvid/scenes/<mech>.js; then run tools/build.py)
--probe saves one screenshot per scene instead of recording. Needs playwright + ffmpeg."""
import asyncio,json,subprocess,sys,time,os,shutil,tempfile
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))));HERE=os.path.dirname(os.path.abspath(__file__))
MECH=sys.argv[1];OUT=sys.argv[2];PROBE='--probe' in sys.argv
PROG={"unlocked":300,"stars":[3]*299,"coins":3200,"owned":{},"look":{"color":"teal"},"skins":["none"],"tips":{"style":1,"dice":1,"done3":1,"fog":1},"fogSeen":1,"tut":1,"login":{"last":"2099-01-01","streak":1},"stOffer":1,"budGuide":1}
INIT=open(os.path.join(HERE,'init.js')).read()
LIB=open(os.path.join(HERE,'lib.js')).read()
SCN=open(os.path.join(HERE,'scenes',MECH+'.js')).read()
async def main():
    port=int(os.environ.get('PORT','8811'))
    srv=subprocess.Popen([sys.executable,'-m','http.server',str(port)],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
    D=os.path.join(tempfile.gettempdir(),'mechvid_'+MECH);shutil.rmtree(D,ignore_errors=True);os.makedirs(D)
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        ctx=await b.new_context(locale='en-US',viewport={'width':390,'height':844},device_scale_factor=2,has_touch=True,is_mobile=True)
        pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('console: '+m.text) if m.type=='error' else None)
        await pg.add_init_script(f"localStorage.setItem('sharliz-progress',{json.dumps(json.dumps(PROG))});"+INIT)
        await pg.goto(f'http://localhost:{port}/index.html',timeout=180000)
        for i in range(120):
            await pg.wait_for_timeout(500)
            if await pg.evaluate("typeof H3!=='undefined'&&H3.state==='ready'&&!!H3.baked"):break
        await pg.wait_for_timeout(1500)
        await pg.evaluate(LIB);await pg.evaluate(SCN)
        scenes=await pg.evaluate("SC.scenes.length")
        n=0
        for si in range(scenes):
            await pg.evaluate("__man.on()");await pg.wait_for_timeout(400)
            info=await pg.evaluate(f"SC_setup({si})");await pg.wait_for_timeout(2600)
            print('scene',si,info,flush=True)
            if PROBE:
                t0=time.time();print('eval',await pg.evaluate("1+1"),time.time()-t0,flush=True)
                for k in range(3):
                    try:
                        await pg.screenshot(path=OUT+f'_probe{si}.png',timeout=8000);print('shot ok');break
                    except Exception as e: print('shot fail',str(e)[:80],flush=True)
                continue
            while True:
                t0=time.time();r=await pg.evaluate("SC_frame()")
                if r is None:break
                t1=time.time();clip=r['clip']
                await pg.screenshot(path=f'{D}/{n:05d}.png',clip=clip,timeout=300000);n+=1
                if n<6 or n%30==0:print('frame',n,round(t1-t0,2),round(time.time()-t1,2),flush=True)
        print('frames',n,'errors',errs[:5])
        await b.close()
    srv.terminate()
    if not PROBE and n:
        subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{D}/%05d.png','-vf','scale=360:-2:flags=lanczos','-c:v','libx264','-profile:v','main','-pix_fmt','yuv420p','-crf','28','-movflags','+faststart',OUT])
        print('wrote',OUT,os.path.getsize(OUT));shutil.rmtree(D,ignore_errors=True)
asyncio.run(main())
