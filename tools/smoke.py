"""Headless smoke test: serves the repo, loads the game, plays into a few levels (incl. a boss) and prints any JS errors.
usage: python3 tools/smoke.py [levels...]   (needs playwright + chromium; swiftshader makes it slow, ~2fps)"""
import asyncio,json,sys,os,subprocess,time
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LVS=[int(x) for x in sys.argv[1:]] or [1,10]
PROG={"unlocked":80,"stars":[3]*79,"coins":3200,"owned":{},"look":{"color":"teal"},"skins":["none"],"tips":{"style":1,"dice":1,"done3":1,"fog":1},"fogSeen":1,
      "seen":{k:1 for k in ['crow','bomb','gust','balloon','giant','tiny','sticky','octo','wind','ice','bubble','quake','fog']+['boss_'+z for z in ['farm','city','desert','snow','space','candy','ocean','volcano']]}}
async def main():
    srv=subprocess.Popen([sys.executable,'-m','http.server','8799'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
            pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
            errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('console: '+m.text) if m.type=='error' else None)
            await pg.add_init_script(f"localStorage.setItem('sharliz-progress',{json.dumps(json.dumps(PROG))});localStorage.setItem('sharliz-lang','he')")
            await pg.goto('http://localhost:8799/index.html')
            for i in range(80):
                await pg.wait_for_timeout(500)
                if await pg.evaluate("typeof H3!=='undefined'&&H3.state==='ready'&&!!H3.baked"):break
            for lv in LVS:
                await pg.evaluate(f"startLevel({lv})");await pg.wait_for_timeout(1500)
                await pg.evaluate("if(!document.getElementById('overlay').hidden){const b=document.querySelector('#card .btn');b&&b.click()}")
                await pg.wait_for_timeout(4000)
                print(lv,await pg.evaluate("JSON.stringify({zone:zone().id,boss:!!hz.boss,kit3:!!(scene&&scene.kit3),state})"))
                await pg.screenshot(path=os.path.join(ROOT,f'.smoke_{lv}.png'))
            print('errors:' if errs else 'no errors');print('\n'.join(errs[:20]))
            await b.close()
    finally: srv.terminate()
asyncio.run(main())
