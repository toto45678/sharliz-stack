"""Autoplay bot: plays levels headless (fast-forwarding game time), reports win/lose/stuck + JS errors per level.
usage: python3 tools/bot.py [skill 0..1] levels...   e.g. python3 tools/bot.py .9 1 2 10 81 90"""
import asyncio,json,sys,os,subprocess,time
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SK=float(sys.argv[1]) if len(sys.argv)>1 else .9
LVS=[int(x) for x in sys.argv[2:]] or [1,10]
PROG={"unlocked":300,"stars":[3]*299,"coins":3200,"owned":{},"look":{"color":"teal"},"skins":["none"],"tips":{"style":1,"dice":1,"done3":1,"fog":1},"fogSeen":1,"tut":1,"login":{"last":"2099-01-01","streak":1},"stOffer":1}
BOT=r"""
window.__bot={skill:%s,log:[]};
setInterval(()=>{try{
  for(let k=0;k<10;k++){
    if(state==='intro'){const b=document.querySelector('#card .btn.primary,#card .btn');if(b)b.click();break}
    if(!['wait','aim','drop','collapse'].includes(state))break;
    if(state==='aim'&&swinger&&!swinger.entering){
      const top=tower[tower.length-1],dist=Math.max(1,yOf(tower.length)-swingY()),tf=Math.sqrt(2*dist/(BH*30*zone().grav));
      const aim=swinger.xs+wind*tf, err=Math.abs(aim-top.xs);
      const want=Math.random()<__bot.skill?.03:.35;
      if(err<want)drop();
    }
    if(typeof hz!=='undefined'){ // tap stoppable enemies sometimes
    }
    time+=1/60;ft=Math.floor(time*12)/12;update(1/60);
  }
}catch(e){__bot.log.push(String(e&&e.stack||e))}},20);
""" % SK
async def main():
    srv=subprocess.Popen([sys.executable,'-m','http.server',os.environ.get('BOT_PORT','8798')],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
            pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
            errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('console: '+m.text) if m.type=='error' else None)
            await pg.add_init_script(f"localStorage.setItem('sharliz-progress',{json.dumps(json.dumps(PROG))});localStorage.setItem('sharliz-lang','he')")
            await pg.goto('http://localhost:'+os.environ.get('BOT_PORT','8798')+'/index.html',timeout=180000)
            for i in range(80):
                await pg.wait_for_timeout(500)
                if await pg.evaluate("typeof H3!=='undefined'&&H3.state==='ready'&&!!H3.baked"):break
            await pg.evaluate(BOT)
            for lv in LVS:
                n0=len(errs)
                await pg.evaluate(f"hideOverlay();startLevel({lv})")
                t0=time.time();res='stuck'
                while time.time()-t0<float(os.environ.get('BOT_T','150')):
                    await pg.wait_for_timeout(1000)
                    st=await pg.evaluate("JSON.stringify({state,fl:tower.length-1,goal:goal(),hearts,boss:hz.boss?{hp:hz.boss.hp,dead:!!hz.boss.dead}:null,ov:!document.getElementById('overlay').hidden})")
                    s=json.loads(st)
                    if s['state'] in('win','over','failed') and s['ov']:res=s['state'];break
                print(lv,res,st,flush=True)
                if res=='stuck':await pg.screenshot(path=os.path.join(ROOT,f'.bot_{lv}.png'))
                bl=await pg.evaluate("__bot.log.splice(0)")
                for e in (errs[n0:]+bl)[:5]:print('   ERR',e[:400])
            await b.close()
    finally: srv.terminate()
asyncio.run(main())
