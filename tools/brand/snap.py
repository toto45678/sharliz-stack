import asyncio,sys
from playwright.async_api import async_playwright
page,out=sys.argv[1],sys.argv[2]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    pg=await b.new_page(viewport={'width':2200,'height':1200})
    await pg.goto('http://localhost:8800/'+page);await pg.wait_for_timeout(800)
    for el in await pg.query_selector_all('[data-snap],.ic'):
      i=await el.get_attribute('id');await el.screenshot(path=f'{out}/{i}.png',omit_background=True)
    await b.close()
asyncio.run(main())
