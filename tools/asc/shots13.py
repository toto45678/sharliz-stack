# Adds the parents screenshot (08) as the LAST en-US screenshot of version 1.3 (iPhone 6.9" + iPad 13"). Never submits.
import os, sys, hashlib
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
D = os.path.join(os.path.dirname(__file__), 'main-1.3')
st, b = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&filter[versionString]=1.3')
V = b['data'][0]; assert V['attributes']['appStoreState'] == 'PREPARE_FOR_SUBMISSION'
st, L = call('GET', f'/appStoreVersions/{V["id"]}/appStoreVersionLocalizations?limit=50')
en = next(l for l in L['data'] if l['attributes']['locale'] == 'en-US')
st, S = call('GET', f'/appStoreVersionLocalizations/{en["id"]}/appScreenshotSets?limit=50')
def upload(set_id, path):
    data = open(path, 'rb').read(); name = '08_no_loot_boxes.jpg'
    st, a = call('POST', '/appScreenshots', {'data': {'type': 'appScreenshots', 'attributes': {'fileName': name, 'fileSize': len(data)},
                 'relationships': {'appScreenshotSet': {'data': {'type': 'appScreenshotSets', 'id': set_id}}}}})
    a = a['data']
    for op in a['attributes']['uploadOperations']:
        r = urllib.request.Request(op['url'], method=op['method'], data=data[op['offset']:op['offset'] + op['length']],
                                   headers={h['name']: h['value'] for h in op['requestHeaders']})
        urllib.request.urlopen(r, timeout=300).read()
    call('PATCH', f'/appScreenshots/{a["id"]}', {'data': {'type': 'appScreenshots', 'id': a['id'], 'attributes': {'uploaded': True, 'sourceFileChecksum': hashlib.md5(data).hexdigest()}}})
    for i in range(40):
        s = call('GET', f'/appScreenshots/{a["id"]}')[1]['data']['attributes'].get('assetDeliveryState') or {}
        if s.get('state') in ('COMPLETE', 'FAILED'): break
        time.sleep(8)
    log('  uploaded', path, s.get('state'), s.get('errors') or '')
for s in S['data']:
    t = s['attributes']['screenshotDisplayType']
    st, shots = call('GET', f'/appScreenshotSets/{s["id"]}/appScreenshots?limit=50')
    names = [x['attributes'].get('fileName') for x in shots['data']]
    log('set', t, len(names), names)
    f = {'APP_IPHONE_67': 'iphone_08_no_loot_boxes.jpg', 'APP_IPAD_PRO_3GEN_129': 'ipad_08_no_loot_boxes.jpg'}.get(t)
    if not f: continue
    if not names: log('  EMPTY set: not adding 08 alone'); continue
    if '08_no_loot_boxes.jpg' in names: log('  08 already there'); continue
    if len(names) >= 10: log('  set full (10)'); continue
    upload(s['id'], os.path.join(D, f))
