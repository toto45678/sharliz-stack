# Prepares version 1.4 (Tzach approved 10.11 19:53 UTC: new screenshots, texts, keywords + version number; submit 18.11, auto release >= 23.11).
# Creates/edits the version only. NEVER submits. Build 89 only (same game as 1.3); build 90 has later game fixes.
import os, sys, json, hashlib
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
VER, BUILD = '1.4', '89'; D = os.path.join(os.path.dirname(__file__), 'main-1.4')
SHOTS = ['01_stack_it_beat_him', '02_will_it_hold', '03_50_bosses', '04_no_loot_boxes', '05_dress_up']
WN = {'en-US': 'Get ready: the Christmas event starts Dec 15!',
      'he': 'מתכוננים: אירוע חג המולד מתחיל ב-15 בדצמבר!',
      'fr-FR': "Préparez-vous : l'événement de Noël commence le 15 décembre !",
      'es-MX': '¡Prepárate: el evento de Navidad empieza el 15 de diciembre!',
      'de-DE': 'Macht euch bereit: Das Weihnachts-Event startet am 15. Dezember!',
      'ja': '準備はいい？クリスマスイベントは12月15日スタート！'}
HE_OUT, HE_IN = ['בית', 'עיצוב', 'אלבום', 'דמויות'], ['קוביות', 'בנייה', 'איזון', 'מגדלים']
BAD = ('android', 'google', 'play store', 'אנדרואיד', 'גוגל', 'earnable', '#1')
# 1. version
st, b = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=10')
ver = next((v for v in b['data'] if v['attributes']['versionString'] == VER), None)
if not ver:
    st, r = call('POST', '/appStoreVersions', {'data': {'type': 'appStoreVersions', 'attributes': {'platform': 'IOS', 'versionString': VER},
                  'relationships': {'app': {'data': {'type': 'apps', 'id': APP}}}}})
    if st != 201: sys.exit(f'create version {st} {r}')
    ver = r['data']; log('created version', VER)
VID = ver['id']; log('version', VER, ver['attributes']['appStoreState'])
if ver['attributes']['appStoreState'] not in ('PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED'): sys.exit('not editable')
st, r = call('PATCH', f'/appStoreVersions/{VID}', {'data': {'type': 'appStoreVersions', 'id': VID,
             'attributes': {'releaseType': 'SCHEDULED', 'earliestReleaseDate': '2026-11-22T22:00:00+00:00'}}})
log('release: scheduled >= 23.11 00:00 Israel', st, '' if st == 200 else r)
# 2. build 89
st, b = call('GET', f'/builds?filter[app]={APP}&filter[version]={BUILD}&filter[preReleaseVersion.version]={VER}&limit=5')
bl = b['data'][0] if st == 200 and b['data'] else None
if not bl: sys.exit('build 89 not found')
log('build', BUILD, bl['attributes'].get('processingState'))
st, r = call('PATCH', f'/appStoreVersions/{VID}/relationships/build', {'data': {'type': 'builds', 'id': bl['id']}})
log('attach build 89', st, '' if st in (200, 204) else r)
st, r = call('GET', f'/appStoreVersions/{VID}/build'); log('  version build now:', r['data']['attributes']['version'] if st == 200 and r.get('data') else r)
# 3. texts
st, L = call('GET', f'/appStoreVersions/{VID}/appStoreVersionLocalizations?limit=50'); locs = {l['attributes']['locale']: l for l in L['data']}
for loc, l in sorted(locs.items()):
    a = l['attributes']; attrs = {'whatsNew': WN.get(loc, WN['en-US'])}
    if loc == 'he':
        kw = [k.strip() for k in (a.get('keywords') or '').split(',') if k.strip()]
        log('he keywords before', ','.join(kw))
        out = [k for k in kw if k in HE_OUT]; kw = [k for k in kw if k not in HE_OUT]
        seen = set(); kw = [k for k in kw if not (k in seen or seen.add(k))]
        for k in HE_IN[:len(out) or 4]:
            if k not in kw and len(','.join(kw + [k])) <= 100: kw.append(k)
        attrs['keywords'] = ','.join(kw); log('he removed', out, '-> after', attrs['keywords'], len(attrs['keywords']))
    st, r = call('PATCH', f'/appStoreVersionLocalizations/{l["id"]}', {'data': {'type': 'appStoreVersionLocalizations', 'id': l['id'], 'attributes': attrs}})
    log('texts', loc, st, '' if st == 200 else r)
st, L = call('GET', f'/appStoreVersions/{VID}/appStoreVersionLocalizations?limit=50')
for l in L['data']:
    a = l['attributes']; txt = ' '.join(str(a.get(k) or '') for k in ('description', 'keywords', 'promotionalText', 'whatsNew')).lower()
    hits = [w for w in BAD if w in txt]
    log('check', a['locale'], 'OK' if not hits else 'BAD WORDS ' + str(hits), '| kw', len(a.get('keywords') or ''), '| wn', a.get('whatsNew'))
# 4. en-US screenshots: 01-05 on iPhone 6.9" + iPad 13"; drop the old 6.1" set
def upload(set_id, path, name):
    data = open(path, 'rb').read()
    st, a = call('POST', '/appScreenshots', {'data': {'type': 'appScreenshots', 'attributes': {'fileName': name, 'fileSize': len(data)},
                 'relationships': {'appScreenshotSet': {'data': {'type': 'appScreenshotSets', 'id': set_id}}}}})
    if st != 201: log('  reserve failed', name, st, a); return
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
    log('  uploaded', name, s.get('state'), s.get('errors') or '')
en = locs['en-US']['id']
st, S = call('GET', f'/appStoreVersionLocalizations/{en}/appScreenshotSets?limit=50'); sets = {s['attributes']['screenshotDisplayType']: s for s in S['data']}
log('en-US sets', sorted(sets))
want = [n + '.jpg' for n in SHOTS]
for dtype, pre in (('APP_IPHONE_67', 'iphone_'), ('APP_IPAD_PRO_3GEN_129', 'ipad_')):
    s = sets.get(dtype)
    if not s:
        st, r = call('POST', '/appScreenshotSets', {'data': {'type': 'appScreenshotSets', 'attributes': {'screenshotDisplayType': dtype},
                     'relationships': {'appStoreVersionLocalization': {'data': {'type': 'appStoreVersionLocalizations', 'id': en}}}}})
        s = r['data']; log('created set', dtype)
    st, shots = call('GET', f'/appScreenshotSets/{s["id"]}/appScreenshots?limit=50')
    names = [x['attributes'].get('fileName') for x in shots['data']]
    log(dtype, 'before', names)
    if names == want: log('  already 01-05'); continue
    for x in shots['data']: log('  delete', x['attributes'].get('fileName'), call('DELETE', f'/appScreenshots/{x["id"]}')[0])
    for n in SHOTS: upload(s['id'], os.path.join(D, pre + n + '.jpg'), n + '.jpg')
    st, shots = call('GET', f'/appScreenshotSets/{s["id"]}/appScreenshots?limit=50')
    log(dtype, 'after', [x['attributes'].get('fileName') for x in shots['data']])
for dtype, s in sets.items():
    if dtype in ('APP_IPHONE_67', 'APP_IPAD_PRO_3GEN_129'): continue
    st, shots = call('GET', f'/appScreenshotSets/{s["id"]}/appScreenshots?limit=50')
    log('old set', dtype, [x['attributes'].get('fileName') for x in shots['data']], '-> delete set', call('DELETE', f'/appScreenshotSets/{s["id"]}')[0])
st, S = call('GET', f'/appStoreVersionLocalizations/{en}/appScreenshotSets?limit=50'); log('en-US sets now', [s['attributes']['screenshotDisplayType'] for s in S['data']])
for loc, l in sorted(locs.items()):
    if loc == 'en-US': continue
    st, S = call('GET', f'/appStoreVersionLocalizations/{l["id"]}/appScreenshotSets?limit=50')
    if st == 200 and S['data']: log('NOTE', loc, 'has its own sets', [s['attributes']['screenshotDisplayType'] for s in S['data']])
log('PREPARED', VER, '(not submitted)')
