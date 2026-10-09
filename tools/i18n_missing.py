"""Find game text that the 12 extra languages don't have yet.
usage: python3 tools/build.py && python3 tools/i18n_missing.py
Refreshes src/i18n/en.json (the English source: I18N keys + ['English','עברית'] pairs + PW_TXT + fmt) from the built game
and prints, per language, the keys/pairs missing in src/i18n/<code>.json. Missing text shows in English until translated."""
import asyncio,json,os,re,subprocess,sys,time
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));I=os.path.join(ROOT,'src','i18n')
EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
async def dump():
    srv=subprocess.Popen([sys.executable,'-m','http.server','8794'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
    try:
        async with async_playwright() as p:
            b=await p.chromium.launch(**({'executable_path':EXE} if os.path.exists(EXE) else {}))
            pg=await b.new_page(locale='en-US');await pg.goto('http://localhost:8794/index.html');await pg.wait_for_timeout(4000)
            d=json.loads(await pg.evaluate("JSON.stringify({en:I18N.en,pw:PW_TXT.en})"));await b.close();return d
    finally: srv.terminate()
d=asyncio.run(dump())
# derived at runtime (v42 night/storm names, v47 trophy power lines, v61 new buddy powers) — not translated directly
keys={k:v for k,v in d['en'].items() if isinstance(v,str) and v.strip() and not k.startswith('_') and not re.fullmatch(r'z[A-Z][a-z]+[NS]',k) and not k.startswith(('hp_h_','hm_h_','pk_x_'))}
s=open(os.path.join(ROOT,'index.html'),encoding='utf-8').read()
pairs=sorted(set(m.replace("\\'","'") for m in re.findall(r"T_\('((?:[^'\\\n]|\\.)*)'\)",s))|set(re.findall(r'T_\("((?:[^"\\\n]|\\.)*)"\)',s)))
src={'keys':keys,'pairs':pairs,'pw':d['pw'],'fmt':{'night':'{w} by Night','storm':'Stormy {w}'}}
json.dump(src,open(os.path.join(I,'en.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(f'en.json: {len(keys)} keys, {len(pairs)} pairs')
for f in sorted(os.listdir(I)):
    if f=='en.json' or not f.endswith('.json'):continue
    x=json.load(open(os.path.join(I,f),encoding='utf-8'))
    mk=[k for k in keys if k not in x['keys']];mp=[p for p in pairs if p not in x['pairs']];mw=[k for k in d['pw'] if k not in x.get('pw',{})]
    print(f[:-5],'missing keys',len(mk),'pairs',len(mp),'pw',len(mw),(mk+mp+mw)[:6])
