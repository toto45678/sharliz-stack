# App Store Connect API: build a Custom Product Page (name, promo text, iPhone screenshots, App Preview, iPad
# screenshots when the page has none). It NEVER submits the page for review: Tzach clicks Submit himself.
#   PAGE=tools/asc/cpp-ca python3 tools/asc/cpp.py   (run by .github/workflows/asc.yml with SCRIPT=tools/asc/cpp.py)
import glob, hashlib, json, os, sys, time, urllib.request, urllib.error
import jwt

API = 'https://api.appstoreconnect.apple.com/v1'
BUNDLE = 'com.sharlizstack.tower'
D = os.environ['PAGE']; P = json.load(open(f'{D}/page.json', encoding='utf-8'))
low = json.dumps(P, ensure_ascii=False).lower()
for w in ('android', 'google', 'play store'):
    if w in low: sys.exit(f'page text names another platform: {w}')

def token():
    now = int(time.time())
    return jwt.encode({'iss': os.environ['ASC_ISSUER_ID'], 'iat': now, 'exp': now + 1100, 'aud': 'appstoreconnect-v1'},
                      os.environ['ASC_PRIVATE_KEY'], algorithm='ES256', headers={'kid': os.environ['ASC_KEY_ID'], 'typ': 'JWT'})

def call(method, path, body=None, soft=False):
    url = path if path.startswith('http') else API + path
    req = urllib.request.Request(url, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            raw = r.read(); return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        msg = e.read().decode(errors='replace')
        print(f'!! {method} {url} -> {e.code}\n{msg}', flush=True)
        if soft: return None
        raise SystemExit(1)

def log(*a): print(*a, flush=True)

def upload(kind, set_rel, set_id, path, extra=None):
    """kind = appScreenshots | appPreviews; reserve, PUT the parts, commit with the md5, wait until Apple has it."""
    data = open(path, 'rb').read(); name = os.path.basename(path)
    attrs = {'fileName': name, 'fileSize': len(data)}
    if extra: attrs.update(extra)
    a = call('POST', f'/{kind}', {'data': {'type': kind, 'attributes': attrs,
            'relationships': {set_rel: {'data': {'type': set_rel + 's', 'id': set_id}}}}})['data']
    for op in a['attributes']['uploadOperations']:
        part = data[op['offset']:op['offset'] + op['length']]
        r = urllib.request.Request(op['url'], method=op['method'], data=part,
                                   headers={h['name']: h['value'] for h in op['requestHeaders']})
        urllib.request.urlopen(r, timeout=300).read()
    call('PATCH', f'/{kind}/{a["id"]}', {'data': {'type': kind, 'id': a['id'],
         'attributes': {'uploaded': True, 'sourceFileChecksum': hashlib.md5(data).hexdigest()}}})
    for i in range(60):
        st = call('GET', f'/{kind}/{a["id"]}')['data']['attributes'].get('assetDeliveryState') or {}
        if st.get('state') in ('COMPLETE', 'FAILED'): break
        time.sleep(10)
    log(kind[3:-1], name, st.get('state'), st.get('errors') or '')
    return a['id'], st.get('state')

app = call('GET', f'/apps?filter[bundleId]={BUNDLE}')['data'][0]; APP = app['id']; log('app', APP)

# --- the page (reused if a page with this name exists) ---
pages = call('GET', f'/apps/{APP}/appCustomProductPages?limit=50')['data']
for p in pages: log('existing page', p['attributes'].get('name'), p['attributes'].get('visible'))
page = next((p for p in pages if p['attributes'].get('name') == P['name']), None)
if not page:
    page = call('POST', '/appCustomProductPages', {'data': {'type': 'appCustomProductPages', 'attributes': {'name': P['name']},
        'relationships': {'app': {'data': {'type': 'apps', 'id': APP}},
                          'appCustomProductPageVersions': {'data': [{'type': 'appCustomProductPageVersions', 'id': '${v1}'}]}}},
        'included': [{'type': 'appCustomProductPageVersions', 'id': '${v1}', 'relationships': {
                          'appCustomProductPageLocalizations': {'data': [{'type': 'appCustomProductPageLocalizations', 'id': '${l1}'}]}}},
                     {'type': 'appCustomProductPageLocalizations', 'id': '${l1}',
                      'attributes': {'locale': P['locale'], 'promotionalText': P['promotionalText']}}]})['data']
    log('created page', P['name'])
PID = page['id']; log('page id', PID)
vers = call('GET', f'/appCustomProductPages/{PID}/appCustomProductPageVersions?limit=10')['data']
for v in vers: log('page version', v['id'], v['attributes'])
ver = next((v for v in vers if v['attributes'].get('state') in (None, 'PREPARE_FOR_SUBMISSION', 'REJECTED')), None)
if not ver: sys.exit('no editable page version (already submitted?): nothing changed')
VID = ver['id']

locs = call('GET', f'/appCustomProductPageVersions/{VID}/appCustomProductPageLocalizations?limit=50')['data']
loc = next((l for l in locs if l['attributes']['locale'] == P['locale']), None)
if not loc:
    loc = call('POST', '/appCustomProductPageLocalizations', {'data': {'type': 'appCustomProductPageLocalizations',
        'attributes': {'locale': P['locale'], 'promotionalText': P['promotionalText']},
        'relationships': {'appCustomProductPageVersion': {'data': {'type': 'appCustomProductPageVersions', 'id': VID}}}}})['data']
else:
    call('PATCH', f'/appCustomProductPageLocalizations/{loc["id"]}', {'data': {'type': 'appCustomProductPageLocalizations',
         'id': loc['id'], 'attributes': {'promotionalText': P['promotionalText']}}})
LID = loc['id']; log('localization', P['locale'], LID, 'promo text set')
REL = {'data': {'type': 'appCustomProductPageLocalizations', 'id': LID}}

def ss_set(dtype):
    sets = call('GET', f'/appCustomProductPageLocalizations/{LID}/appScreenshotSets?limit=50')['data']
    s = next((s for s in sets if s['attributes']['screenshotDisplayType'] == dtype), None)
    return s, [x['attributes']['screenshotDisplayType'] for x in sets]

def fill_shots(dtype, files, replace):
    s, _ = ss_set(dtype)
    if not s:
        s = call('POST', '/appScreenshotSets', {'data': {'type': 'appScreenshotSets', 'attributes': {'screenshotDisplayType': dtype},
                 'relationships': {'appCustomProductPageLocalization': REL}}})['data']
    old = call('GET', f'/appScreenshotSets/{s["id"]}/appScreenshots?limit=50')['data']
    if old and not replace: log(dtype, 'already has', len(old), 'screenshots, kept'); return
    for o in old: call('DELETE', f'/appScreenshots/{o["id"]}')
    for f in files: upload('appScreenshots', 'appScreenshotSet', s['id'], f)

_, have = ss_set('-'); log('screenshot sets before', have)
if not os.environ.get('POSTER_ONLY'): fill_shots(P['iphone'], sorted(glob.glob(f'{D}/iphone/*.jpg')), True)
if not os.environ.get('POSTER_ONLY'): fill_shots(P['ipad'], sorted(glob.glob(f'{D}/ipad/*.jpg')), False)  # keeps a set Apple copied from the main page

# --- App Preview ---
if os.environ.get('POSTER_ONLY'):  # second run: Apple must finish processing the video before the poster frame can be set
    ps = call('GET', f'/appCustomProductPageLocalizations/{LID}/appPreviewSets?limit=50')['data'][0]
    for o in call('GET', f'/appPreviewSets/{ps["id"]}/appPreviews?limit=10')['data']:
        log('preview', o['attributes'].get('fileName'), o['attributes'].get('assetDeliveryState'), o['attributes'].get('previewFrameTimeCode'))
        r = call('PATCH', f'/appPreviews/{o["id"]}', {'data': {'type': 'appPreviews', 'id': o['id'],
                 'attributes': {'previewFrameTimeCode': P['posterTimeCode']}}}, soft=True)
        log('poster frame', P['posterTimeCode'], 'set' if r is not None else 'NOT set')
    sys.exit(0)
sets = call('GET', f'/appCustomProductPageLocalizations/{LID}/appPreviewSets?limit=50')['data']
ps = next((s for s in sets if s['attributes']['previewType'] == P['previewType']), None)
if not ps:
    ps = call('POST', '/appPreviewSets', {'data': {'type': 'appPreviewSets', 'attributes': {'previewType': P['previewType']},
              'relationships': {'appCustomProductPageLocalization': REL}}})['data']
for o in call('GET', f'/appPreviewSets/{ps["id"]}/appPreviews?limit=10')['data']: call('DELETE', f'/appPreviews/{o["id"]}')
pid, st = upload('appPreviews', 'appPreviewSet', ps['id'], f'{D}/{P["preview"]}', {'mimeType': 'video/mp4'})
r = call('PATCH', f'/appPreviews/{pid}', {'data': {'type': 'appPreviews', 'id': pid,
         'attributes': {'previewFrameTimeCode': P['posterTimeCode']}}}, soft=True)
log('poster frame', P['posterTimeCode'], 'set' if r is not None else 'NOT set (set it in ASC)')

# --- summary ---
_, have = ss_set('-'); log('screenshot sets now', have)
log('page versions', [(v['id'], v['attributes']) for v in call('GET', f'/appCustomProductPages/{PID}/appCustomProductPageVersions')['data']])
log('READY (not submitted): page', P['name'], PID)
