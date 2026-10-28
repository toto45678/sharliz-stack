# App Store Connect API: fill a version's store texts, pick its build and (MODE=submit) send it to App Review.
# Run by .github/workflows/asc.yml with the repo's App Store Connect API key (same key app.yml signs with).
#   VERSION=1.2 BUILD=85 TEXTS=tools/asc/texts-1.2.json MODE=fill|submit python3 tools/asc/release.py
# Never names another platform: the texts file is checked before anything is written.
import json, os, sys, time, urllib.request, urllib.error
import jwt  # pyjwt[crypto]

API = 'https://api.appstoreconnect.apple.com/v1'
BUNDLE = 'com.sharlizstack.tower'
VERSION, BUILD, MODE = os.environ['VERSION'], os.environ['BUILD'], os.environ.get('MODE', 'fill')
T = json.load(open(os.environ['TEXTS'], encoding='utf-8'))
low = json.dumps(T, ensure_ascii=False).lower()
for w in ('android', 'google', 'play store'):
    if w in low: sys.exit(f'texts name another platform: {w}')

def token():
    now = int(time.time())
    return jwt.encode({'iss': os.environ['ASC_ISSUER_ID'], 'iat': now, 'exp': now + 1100, 'aud': 'appstoreconnect-v1'},
                      os.environ['ASC_PRIVATE_KEY'], algorithm='ES256', headers={'kid': os.environ['ASC_KEY_ID'], 'typ': 'JWT'})

def call(method, path, body=None, ok_missing=False):
    url = path if path.startswith('http') else API + path
    req = urllib.request.Request(url, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            raw = r.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        msg = e.read().decode(errors='replace')
        if ok_missing and e.code == 404: return None
        print(f'!! {method} {url} -> {e.code}\n{msg}')
        raise SystemExit(1)

def log(*a): print(*a, flush=True)

app = call('GET', f'/apps?filter[bundleId]={BUNDLE}')['data'][0]
APP = app['id']; log('app', APP, app['attributes']['name'])

# --- the version (created like the "+ iOS App" button; copies the live version's texts) ---
vs = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=10')['data']
for v in vs: log('version', v['attributes']['versionString'], v['attributes']['appStoreState'])
ver = next((v for v in vs if v['attributes']['versionString'] == VERSION), None)
if not ver:
    ver = call('POST', '/appStoreVersions', {'data': {'type': 'appStoreVersions',
        'attributes': {'platform': 'IOS', 'versionString': VERSION, 'releaseType': 'MANUAL'},
        'relationships': {'app': {'data': {'type': 'apps', 'id': APP}}}}})['data']
    log('created version', VERSION)
VID = ver['id']
state = ver['attributes']['appStoreState']
if MODE == 'release':
    if state != 'PENDING_DEVELOPER_RELEASE': sys.exit(f'version {VERSION} is {state}, not waiting for release')
    call('POST', '/appStoreVersionReleaseRequests', {'data': {'type': 'appStoreVersionReleaseRequests',
        'relationships': {'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': VID}}}}})
    log('RELEASED:', call('GET', f'/appStoreVersions/{VID}')['data']['attributes']['appStoreState']); sys.exit(0)
if state not in ('PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED'):
    sys.exit(f'version {VERSION} is {state}: not editable, nothing changed')
call('PATCH', f'/appStoreVersions/{VID}', {'data': {'type': 'appStoreVersions', 'id': VID, 'attributes': {'releaseType': 'MANUAL'}}})
log('release: MANUAL')

# --- build ---
for i in range(40):
    bs = call('GET', f'/builds?filter[app]={APP}&filter[version]={BUILD}&filter[preReleaseVersion.version]={VERSION}&limit=5')['data']
    st = bs[0]['attributes']['processingState'] if bs else 'NOT_FOUND'
    log('build', BUILD, st)
    if st == 'VALID': break
    if st in ('FAILED', 'INVALID'): sys.exit('build not usable')
    time.sleep(30)
else:
    sys.exit('build still not processed')
BID = bs[0]['id']
call('PATCH', f'/appStoreVersions/{VID}/relationships/build', {'data': {'type': 'builds', 'id': BID}})
log('build selected', BUILD)

# --- version texts per language ---
locs = {l['attributes']['locale']: l for l in call('GET', f'/appStoreVersions/{VID}/appStoreVersionLocalizations?limit=50')['data']}
log('version languages', sorted(locs))
en = locs.get('en-US')
VFIELDS = ('description', 'keywords', 'promotionalText', 'whatsNew', 'supportUrl', 'marketingUrl')
for loc in ('en-US', 'he'):
    want = {k: v for k, v in T[loc].items() if k in VFIELDS}
    if loc != 'en-US' and en:  # same support/marketing pages as English
        for k in ('supportUrl', 'marketingUrl'):
            if en['attributes'].get(k): want.setdefault(k, en['attributes'][k])
    if loc in locs:
        L = locs[loc]
        call('PATCH', f"/appStoreVersionLocalizations/{L['id']}", {'data': {'type': 'appStoreVersionLocalizations', 'id': L['id'], 'attributes': want}})
    else:
        call('POST', '/appStoreVersionLocalizations', {'data': {'type': 'appStoreVersionLocalizations',
            'attributes': dict(want, locale=loc), 'relationships': {'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': VID}}}}})
    log('texts', loc, ', '.join(f'{k} {len(v)}' for k, v in want.items()))

# --- app name/subtitle per language (the app info that goes with this version) ---
infos = call('GET', f'/apps/{APP}/appInfos')['data']
for i in infos: log('appInfo', i['id'], i['attributes'].get('appStoreState') or i['attributes'].get('state'))
info = next((i for i in infos if (i['attributes'].get('appStoreState') or i['attributes'].get('state')) in
             ('PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED', 'PREPARE_FOR_SUBMISSION')), None)
if not info: sys.exit('no editable app info')
ilocs = {l['attributes']['locale']: l for l in call('GET', f"/appInfos/{info['id']}/appInfoLocalizations?limit=50")['data']}
log('app info languages', sorted(ilocs))
ien = ilocs.get('en-US')
want = {k: T['he'][k] for k in ('name', 'subtitle')}
if ien and ien['attributes'].get('privacyPolicyUrl'): want['privacyPolicyUrl'] = ien['attributes']['privacyPolicyUrl']
if 'he' in ilocs:
    L = ilocs['he']
    call('PATCH', f"/appInfoLocalizations/{L['id']}", {'data': {'type': 'appInfoLocalizations', 'id': L['id'], 'attributes': want}})
else:
    call('POST', '/appInfoLocalizations', {'data': {'type': 'appInfoLocalizations', 'attributes': dict(want, locale='he'),
        'relationships': {'appInfo': {'data': {'type': 'appInfos', 'id': info['id']}}}}})
log('app info he', want)

# --- notes for the reviewer ---
rd = call('GET', f'/appStoreVersions/{VID}/appStoreReviewDetail', ok_missing=True)
rd = rd and rd.get('data')
if rd:
    call('PATCH', f"/appStoreReviewDetails/{rd['id']}", {'data': {'type': 'appStoreReviewDetails', 'id': rd['id'],
        'attributes': {'notes': T['reviewNotes'], 'demoAccountRequired': False}}})
    a = rd['attributes']
    log('review notes', len(T['reviewNotes']), '| contact set:', bool(a.get('contactEmail')), bool(a.get('contactPhone')))
else:
    # copy the contact from the last version the reviewers saw (what App Store Connect's form does)
    prev = None
    for v in vs:
        if v['id'] == VID: continue
        r = call('GET', f"/appStoreVersions/{v['id']}/appStoreReviewDetail", ok_missing=True)
        if r and r.get('data'): prev = r['data']['attributes']; break
    if not prev: sys.exit('no review contact to copy')
    attrs = {k: prev.get(k) for k in ('contactFirstName', 'contactLastName', 'contactPhone', 'contactEmail')}
    attrs.update(notes=T['reviewNotes'], demoAccountRequired=False)
    call('POST', '/appStoreReviewDetails', {'data': {'type': 'appStoreReviewDetails', 'attributes': attrs,
        'relationships': {'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': VID}}}}})
    log('review notes', len(T['reviewNotes']), '(contact copied from the previous version)')

# --- screenshots on file (English ones serve every language that has none) ---
for loc, L in sorted(locs.items()):
    sets = call('GET', f"/appStoreVersionLocalizations/{L['id']}/appScreenshotSets?limit=20")['data']
    log('screenshots', loc, [s['attributes']['screenshotDisplayType'] for s in sets])

if MODE != 'submit':
    log('MODE=fill: everything filled, NOT submitted'); sys.exit(0)

# --- send to App Review (manual release: it goes live only when someone presses Release) ---
open_subs = call('GET', f'/reviewSubmissions?filter[app]={APP}&filter[platform]=IOS&filter[state]=READY_FOR_REVIEW,UNRESOLVED_ISSUES')['data']
sub = open_subs[0] if open_subs else call('POST', '/reviewSubmissions', {'data': {'type': 'reviewSubmissions',
    'attributes': {'platform': 'IOS'}, 'relationships': {'app': {'data': {'type': 'apps', 'id': APP}}}}})['data']
log('review submission', sub['id'], sub['attributes'].get('state'))
items = call('GET', f"/reviewSubmissions/{sub['id']}/items")['data']
if not items:
    call('POST', '/reviewSubmissionItems', {'data': {'type': 'reviewSubmissionItems', 'relationships': {
        'reviewSubmission': {'data': {'type': 'reviewSubmissions', 'id': sub['id']}},
        'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': VID}}}}})
    log('version added to the submission')
res = call('PATCH', f"/reviewSubmissions/{sub['id']}", {'data': {'type': 'reviewSubmissions', 'id': sub['id'], 'attributes': {'submitted': True}}})
log('SUBMITTED:', res['data']['attributes'].get('state'))
v = call('GET', f'/appStoreVersions/{VID}')['data']
log('version state now', v['attributes']['appStoreState'])
