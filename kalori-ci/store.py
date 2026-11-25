# Fills the Kalori App Store page through the App Store Connect API: categories, age rating, texts,
# screenshots, content rights, the build, and (when given) the App Review contact. It never submits for review.
import os, sys, time, json, hashlib, urllib.request, urllib.error, jwt
KEY_ID, ISSUER, KEY = os.environ['ASC_KEY_ID'], os.environ['ASC_ISSUER_ID'], os.environ['ASC_PRIVATE_KEY']
BID = 'com.sharlizstack.kalori'; ROOT = 'kalori/app/store'
M = json.load(open(f'{ROOT}/metadata.json', encoding='utf-8')); LOC = M['locale']
def tok(): return jwt.encode({'iss': ISSUER, 'iat': int(time.time()), 'exp': int(time.time()) + 1100, 'aud': 'appstoreconnect-v1'}, KEY, algorithm='ES256', headers={'kid': KEY_ID, 'typ': 'JWT'})
def api(method, path, body=None, ok_fail=False):
    req = urllib.request.Request(path if path.startswith('http') else 'https://api.appstoreconnect.apple.com' + path, method=method,
        data=json.dumps(body).encode() if body is not None else None, headers={'Authorization': 'Bearer ' + tok(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as r: return json.loads(r.read() or b'{}')
    except urllib.error.HTTPError as e:
        print(('note ' if ok_fail else 'ERROR ') + f'{method} {path[:90]} {e.code}: {e.read().decode()[:500]}'); return None
def step(n): print('\n== ' + n)
for u in (M['privacyPolicyUrl'], M['supportUrl'], M['privacyPolicyUrl'].replace('/Kalori/','/kalori/')):
    try: print('url', u, urllib.request.urlopen(u, timeout=20).status)
    except Exception as e: print('ERROR url', u, e)
app = api('GET', f'/v1/apps?filter[bundleId]={BID}')['data'][0]; AID = app['id']; print('app', AID)
step('content rights'); api('PATCH', f'/v1/apps/{AID}', {'data': {'type': 'apps', 'id': AID, 'attributes': {'contentRightsDeclaration': 'DOES_NOT_USE_THIRD_PARTY_CONTENT'}}})
step('app info: categories + subtitle + privacy URL')
infos = api('GET', f'/v1/apps/{AID}/appInfos')['data']
info = next((i for i in infos if i['attributes'].get('appStoreState') not in ('READY_FOR_SALE', 'REPLACED_WITH_NEW_INFO')), infos[0]); IID = info['id']
api('PATCH', f'/v1/appInfos/{IID}', {'data': {'type': 'appInfos', 'id': IID, 'relationships': {
    'primaryCategory': {'data': {'type': 'appCategories', 'id': 'HEALTH_AND_FITNESS'}},
    'secondaryCategory': {'data': {'type': 'appCategories', 'id': 'FOOD_AND_DRINK'}}}}})
for l in api('GET', f'/v1/appInfos/{IID}/appInfoLocalizations')['data']:
    print('info loc', l['attributes']['locale'], l['attributes'].get('name'))
    if l['attributes']['locale'].startswith(LOC):
        api('PATCH', f'/v1/appInfoLocalizations/{l["id"]}', {'data': {'type': 'appInfoLocalizations', 'id': l['id'], 'attributes': {'subtitle': M['subtitle'], 'privacyPolicyUrl': M['privacyPolicyUrl']}}})
step('age rating')
ar = api('GET', f'/v1/appInfos/{IID}/ageRatingDeclaration')
if ar:
    a = ar['data']['attributes']; print('current', json.dumps(a, ensure_ascii=False)[:600])
    want = {}
    for k, v in a.items():
        if k in ('healthOrWellnessTopics',): want[k] = True
        elif isinstance(v, bool) or k in ('gambling', 'unrestrictedWebAccess', 'lootBox', 'messagingAndChat', 'parentalControls', 'ageAssurance', 'userGeneratedContent', 'advertising', 'seventeenPlus', 'kidsAgeBand'):
            if k not in ('kidsAgeBand', 'ageRatingOverride', 'koreaAgeRatingOverride', 'ageRatingOverrideV2'): want[k] = False
        elif v is None or isinstance(v, str):
            if k not in ('kidsAgeBand', 'ageRatingOverride', 'koreaAgeRatingOverride', 'ageRatingOverrideV2', 'developerAgeRatingInfoUrl'): want[k] = 'NONE'
    # Apple's field types change between versions: send everything, and flip the type of any field it rejects
    import re
    for attempt in range(12):
        req = urllib.request.Request('https://api.appstoreconnect.apple.com/v1/ageRatingDeclarations/' + ar['data']['id'], method='PATCH',
            data=json.dumps({'data': {'type': 'ageRatingDeclarations', 'id': ar['data']['id'], 'attributes': want}}).encode(),
            headers={'Authorization': 'Bearer ' + tok(), 'Content-Type': 'application/json'})
        try:
            urllib.request.urlopen(req).read(); print('age rating set', json.dumps(want)); break
        except urllib.error.HTTPError as e:
            errs = json.loads(e.read() or b'{}').get('errors', []); changed = False
            print('age try', attempt, '|'.join(((er.get('source') or {}).get('pointer','').split('/')[-1]+':'+er.get('detail','')[:80]) for er in errs))
            for er in errs:
                k = (er.get('source') or {}).get('pointer', '').split('/')[-1]; d = er.get('detail', '')
                if 'Expected a BOOLEAN' in d: want[k] = (k == 'healthOrWellnessTopics'); changed = True
                elif 'Expected a STRING' in d or 'Expected an ENUM' in d: want[k] = 'NONE'; changed = True
                elif 'not allowed' in d.lower() or 'unknown' in d.lower() or 'cannot' in d.lower(): want.pop(k, None); changed = True
                elif er.get('code') == 'ENTITY_ERROR.ATTRIBUTE.REQUIRED' and k not in want: want[k] = False; changed = True
                else: print('age rating:', d[:200])
            if not changed: break
step('version texts')
vers = api('GET', f'/v1/apps/{AID}/appStoreVersions?filter[platform]=IOS')['data']
ver = next(v for v in vers if v['attributes']['appStoreState'] in ('PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED')); VID = ver['id']
print('version', ver['attributes']['versionString'], ver['attributes']['appStoreState'])
api('PATCH', f'/v1/appStoreVersions/{VID}', {'data': {'type': 'appStoreVersions', 'id': VID, 'attributes': {'copyright': '2026', 'releaseType': 'MANUAL'}}})
locs = api('GET', f'/v1/appStoreVersions/{VID}/appStoreVersionLocalizations')['data']
vl = next((l for l in locs if l['attributes']['locale'].startswith(LOC)), locs[0]); VLID = vl['id']; print('version loc', vl['attributes']['locale'])
api('PATCH', f'/v1/appStoreVersionLocalizations/{VLID}', {'data': {'type': 'appStoreVersionLocalizations', 'id': VLID, 'attributes': {
    'description': M['description'], 'keywords': M['keywords'], 'promotionalText': M['promotionalText'], 'supportUrl': M['supportUrl']}}})
step('screenshots (6.9-inch iPhone)')
sets = api('GET', f'/v1/appStoreVersionLocalizations/{VLID}/appScreenshotSets')['data']
ss = next((s for s in sets if s['attributes']['screenshotDisplayType'] == 'APP_IPHONE_67'), None)
if not ss:
    ss = api('POST', '/v1/appScreenshotSets', {'data': {'type': 'appScreenshotSets', 'attributes': {'screenshotDisplayType': 'APP_IPHONE_67'},
        'relationships': {'appStoreVersionLocalization': {'data': {'type': 'appStoreVersionLocalizations', 'id': VLID}}}}})['data']
SID = ss['id']
for old in api('GET', f'/v1/appScreenshotSets/{SID}/appScreenshots')['data']: api('DELETE', f'/v1/appScreenshots/{old["id"]}')
for f in sorted(x for x in os.listdir(ROOT) if x.startswith('appstore_') and x.endswith('.png')):
    data = open(f'{ROOT}/{f}', 'rb').read()
    r = api('POST', '/v1/appScreenshots', {'data': {'type': 'appScreenshots', 'attributes': {'fileName': f, 'fileSize': len(data)},
        'relationships': {'appScreenshotSet': {'data': {'type': 'appScreenshotSets', 'id': SID}}}}})
    if not r: continue
    sid = r['data']['id']
    for op in r['data']['attributes']['uploadOperations']:
        part = data[op['offset']:op['offset'] + op['length']]
        req = urllib.request.Request(op['url'], method=op['method'], data=part, headers={h['name']: h['value'] for h in op.get('requestHeaders', [])})
        urllib.request.urlopen(req).read()
    api('PATCH', f'/v1/appScreenshots/{sid}', {'data': {'type': 'appScreenshots', 'id': sid, 'attributes': {'uploaded': True, 'sourceFileChecksum': hashlib.md5(data).hexdigest()}}})
    print('uploaded', f)
step('build')
want_build = os.environ.get('BUILD_NUMBER', '').strip()
blds = api('GET', f'/v1/builds?filter[app]={AID}&sort=-uploadedDate&limit=10')['data']
for b in blds: print('build', b['attributes']['version'], b['attributes']['processingState'])
b = next((b for b in blds if b['attributes']['processingState'] == 'VALID' and (not want_build or b['attributes']['version'] == want_build)), None)
if b: api('PATCH', f'/v1/appStoreVersions/{VID}/relationships/build', {'data': {'type': 'builds', 'id': b['id']}}); print('attached build', b['attributes']['version'])
else: print('ERROR no processed build to attach yet')
step('App Review contact')
phone = os.environ.get('REVIEW_PHONE', '').strip()
if phone:
    attrs = {'contactFirstName': os.environ.get('REVIEW_FIRST', ''), 'contactLastName': os.environ.get('REVIEW_LAST', ''), 'contactPhone': phone,
             'contactEmail': os.environ.get('REVIEW_EMAIL', ''), 'demoAccountRequired': False, 'notes': M['reviewNotes']}
    cur = api('GET', f'/v1/appStoreVersions/{VID}/appStoreReviewDetail', ok_fail=True)
    if cur and cur.get('data'): api('PATCH', f'/v1/appStoreReviewDetails/{cur["data"]["id"]}', {'data': {'type': 'appStoreReviewDetails', 'id': cur['data']['id'], 'attributes': attrs}})
    else: api('POST', '/v1/appStoreReviewDetails', {'data': {'type': 'appStoreReviewDetails', 'attributes': attrs, 'relationships': {'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': VID}}}}})
    print('review contact set')
else: print('skipped: no phone yet')
print('\nDONE')
