# Read-only: live 1.3 page per language: number claims in the description, keywords, promo, own screenshot sets.
import os, sys, re
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
st, b = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=3')
v = next(x for x in b['data'] if x['attributes']['versionString'] == '1.3')
st, L = call('GET', f'/appStoreVersions/{v["id"]}/appStoreVersionLocalizations?limit=50')
for l in sorted(L['data'], key=lambda l: l['attributes']['locale']):
    a = l['attributes']; d = a.get('description') or ''
    nums = sorted(set(m.group(0) for m in re.finditer(r'[^.\n]{0,25}\b\d{2,3}\b[^.\n]{0,25}', d)))
    log('==', a['locale'], '| desc', len(d), '| kw:', a.get('keywords'))
    log('   promo:', a.get('promotionalText'))
    for n in nums: log('   num:', n.strip())
    st, S = call('GET', f'/appStoreVersionLocalizations/{l["id"]}/appScreenshotSets?limit=20')
    for s in S.get('data', []):
        st, sh = call('GET', f'/appScreenshotSets/{s["id"]}/appScreenshots?limit=20')
        log('   shots', s['attributes']['screenshotDisplayType'], [x['attributes']['fileName'] for x in sh.get('data', [])])
