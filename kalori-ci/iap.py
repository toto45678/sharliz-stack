# Kalori: app price (₪19.90, Israel), AI packs as consumable in-app purchases with price, availability and
# review screenshot. Nothing is submitted for review here.
import os, time, json, hashlib, urllib.request, urllib.error, jwt
KEY_ID, ISSUER, KEY = os.environ['ASC_KEY_ID'], os.environ['ASC_ISSUER_ID'], os.environ['ASC_PRIVATE_KEY']
BID = 'com.sharlizstack.kalori'; ROOT = 'kalori/app/store'
M = json.load(open(f'{ROOT}/metadata.json', encoding='utf-8')); TERR = M.get('territories', ['ISR']); BASE = TERR[0]
def tok(): return jwt.encode({'iss': ISSUER, 'iat': int(time.time()), 'exp': int(time.time()) + 1100, 'aud': 'appstoreconnect-v1'}, KEY, algorithm='ES256', headers={'kid': KEY_ID, 'typ': 'JWT'})
def api(method, path, body=None):
    req = urllib.request.Request(path if path.startswith('http') else 'https://api.appstoreconnect.apple.com' + path, method=method,
        data=json.dumps(body).encode() if body is not None else None, headers={'Authorization': 'Bearer ' + tok(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as r: return json.loads(r.read() or b'{}')
    except urllib.error.HTTPError as e:
        print(f'ERROR {method} {path[:100]} {e.code}: {e.read().decode()[:700]}'); return None
def allpages(path):
    out = []; 
    while path:
        r = api('GET', path); 
        if not r: break
        out += r.get('data', []); path = (r.get('links') or {}).get('next')
    return out
def same_price(a, want): 
    try: return abs(float(a) - float(want)) < 0.001
    except: return False
app = api('GET', f'/v1/apps?filter[bundleId]={BID}')['data'][0]; AID = app['id']; print('app', AID)
print('\n== app price', M['appPrice'], BASE)
pts = allpages(f'/v1/apps/{AID}/appPricePoints?filter[territory]={BASE}&limit=200')
pp = next((p for p in pts if same_price(p['attributes']['customerPrice'], M['appPrice'])), None)
print('price points', len(pts), 'match', pp and pp['attributes'])
if pp:
    r = api('POST', '/v1/appPriceSchedules', {'data': {'type': 'appPriceSchedules', 'relationships': {
        'app': {'data': {'type': 'apps', 'id': AID}}, 'baseTerritory': {'data': {'type': 'territories', 'id': BASE}},
        'manualPrices': {'data': [{'type': 'appPrices', 'id': '${p1}'}]}}},
        'included': [{'type': 'appPrices', 'id': '${p1}', 'attributes': {'startDate': None}, 'relationships': {'appPricePoint': {'data': {'type': 'appPricePoints', 'id': pp['id']}}}}]})
    print('app price set' if r else 'app price NOT set')
print('\n== app availability', TERR)
r = api('POST', '/v2/appAvailabilities', {'data': {'type': 'appAvailabilities', 'attributes': {'availableInNewTerritories': False}, 'relationships': {
    'app': {'data': {'type': 'apps', 'id': AID}}, 'territoryAvailabilities': {'data': [{'type': 'territoryAvailabilities', 'id': '${t%d}' % i} for i, _ in enumerate(TERR)]}}},
    'included': [{'type': 'territoryAvailabilities', 'id': '${t%d}' % i, 'attributes': {'available': True}, 'relationships': {'territory': {'data': {'type': 'territories', 'id': t}}}} for i, t in enumerate(TERR)]})
print('availability set' if r else 'availability NOT set (maybe already set)')
shot = open(f'{ROOT}/iap_review.png', 'rb').read()
for pid, info in M['iap'].items():
    print('\n== IAP', pid)
    ex = [i for i in allpages(f'/v1/apps/{AID}/inAppPurchasesV2?limit=200') if i['attributes'].get('productId') == pid]
    if ex: iid = ex[0]['id']; print('exists', iid, ex[0]['attributes'].get('state'))
    else:
        r = api('POST', '/v2/inAppPurchases', {'data': {'type': 'inAppPurchases', 'attributes': {'name': f'AI pack {pid[3:]}', 'productId': pid,
            'inAppPurchaseType': 'CONSUMABLE', 'reviewNote': 'Adds AI food-recognition credits to the on-device balance. Buy it from Settings -> "זיהוי אוכל ב-AI", or when the 5 free daily recognitions run out.'},
            'relationships': {'app': {'data': {'type': 'apps', 'id': AID}}}}})
        if not r: continue
        iid = r['data']['id']; print('created', iid)
    locs = api('GET', f'/v2/inAppPurchases/{iid}/inAppPurchaseLocalizations') or {'data': []}
    if not any(l['attributes']['locale'].startswith('he') for l in locs['data']):
        api('POST', '/v1/inAppPurchaseLocalizations', {'data': {'type': 'inAppPurchaseLocalizations', 'attributes': {'locale': 'he', 'name': info['name'], 'description': info['description'][:55]},
            'relationships': {'inAppPurchaseV2': {'data': {'type': 'inAppPurchases', 'id': iid}}}}}); print('localization he')
    ipts = allpages(f'/v2/inAppPurchases/{iid}/pricePoints?filter[territory]={BASE}&limit=200')
    ip = next((p for p in ipts if same_price(p['attributes']['customerPrice'], info['price'])), None)
    print('iap price points', len(ipts), 'match', ip and ip['attributes'])
    if ip:
        r = api('POST', '/v1/inAppPurchasePriceSchedules', {'data': {'type': 'inAppPurchasePriceSchedules', 'relationships': {
            'inAppPurchase': {'data': {'type': 'inAppPurchases', 'id': iid}}, 'baseTerritory': {'data': {'type': 'territories', 'id': BASE}},
            'manualPrices': {'data': [{'type': 'inAppPurchasePrices', 'id': '${p1}'}]}}},
            'included': [{'type': 'inAppPurchasePrices', 'id': '${p1}', 'attributes': {'startDate': None}, 'relationships': {'inAppPurchasePricePoint': {'data': {'type': 'inAppPurchasePricePoints', 'id': ip['id']}}}}]})
        print('iap price set' if r else 'iap price NOT set')
    r = api('POST', '/v1/inAppPurchaseAvailabilities', {'data': {'type': 'inAppPurchaseAvailabilities', 'attributes': {'availableInNewTerritories': False}, 'relationships': {
        'inAppPurchase': {'data': {'type': 'inAppPurchases', 'id': iid}}, 'availableTerritories': {'data': [{'type': 'territories', 'id': t} for t in TERR]}}}})
    print('iap availability set' if r else 'iap availability NOT set (maybe already)')
    cur = api('GET', f'/v2/inAppPurchases/{iid}/appStoreReviewScreenshot')
    if not (cur and cur.get('data')):
        r = api('POST', '/v1/inAppPurchaseAppStoreReviewScreenshots', {'data': {'type': 'inAppPurchaseAppStoreReviewScreenshots', 'attributes': {'fileName': 'iap_review.png', 'fileSize': len(shot)},
            'relationships': {'inAppPurchaseV2': {'data': {'type': 'inAppPurchases', 'id': iid}}}}})
        if r:
            sid = r['data']['id']
            for op in r['data']['attributes']['uploadOperations']:
                urllib.request.urlopen(urllib.request.Request(op['url'], method=op['method'], data=shot[op['offset']:op['offset'] + op['length']],
                    headers={h['name']: h['value'] for h in op.get('requestHeaders', [])})).read()
            api('PATCH', f'/v1/inAppPurchaseAppStoreReviewScreenshots/{sid}', {'data': {'type': 'inAppPurchaseAppStoreReviewScreenshots', 'id': sid,
                'attributes': {'uploaded': True, 'sourceFileChecksum': hashlib.md5(shot).hexdigest()}}}); print('review screenshot uploaded')
    st = api('GET', f'/v2/inAppPurchases/{iid}'); print('state', st and st['data']['attributes'].get('state'))
print('\nDONE')
