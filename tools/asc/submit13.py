# Version 1.3: attach build BUILD, What's New from whatsnew-1.3.json, Christmas event deep link, and (SUBMIT=1) one review submission
# with the version + the Christmas In-App Event. Tzach: "אתה יכול לפרסם את הגרסה הבאה" (06.11 09:04 UTC). Release stays MANUAL.
import os, sys, json, time
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
VER, BUILD = '1.3', os.environ.get('BUILD', '88')
W = {k: v for k, v in json.load(open(os.path.join(os.path.dirname(__file__), 'whatsnew-1.3.json'), encoding='utf-8')).items() if not k.startswith('_')}
low = json.dumps(W, ensure_ascii=False).lower()
for w in ('android', 'google', 'play store', 'earnable', '#1'):
    if w in low: sys.exit('whatsNew contains ' + w)
st, b = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=10')
ver = next(v for v in b['data'] if v['attributes']['versionString'] == VER); VID = ver['id']
log('version', VER, ver['attributes']['appStoreState'], ver['attributes'].get('releaseType'))
if ver['attributes']['appStoreState'] not in ('PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED'): sys.exit('not editable')
for i in range(80):
    st, bs = call('GET', f'/builds?filter[app]={APP}&filter[version]={BUILD}&filter[preReleaseVersion.version]={VER}&limit=5')
    s = bs['data'][0]['attributes']['processingState'] if st == 200 and bs['data'] else f'NOT_FOUND {st}'
    if i % 4 == 0 or s == 'VALID': log('build', BUILD, s)
    if s == 'VALID': break
    if s in ('FAILED', 'INVALID'): sys.exit('build not usable')
    time.sleep(30)
else: sys.exit('build still not processed')
st, r = call('PATCH', f'/appStoreVersions/{VID}/relationships/build', {'data': {'type': 'builds', 'id': bs['data'][0]['id']}}); log('build attached', st, '' if st == 204 else r)
st, L = call('GET', f'/appStoreVersions/{VID}/appStoreVersionLocalizations?limit=50'); locs = {l['attributes']['locale']: l for l in L['data']}
log('locales', sorted(locs))
for loc, t in W.items():
    if loc not in locs: log('NO LOCALE', loc); continue
    st, r = call('PATCH', f'/appStoreVersionLocalizations/{locs[loc]["id"]}', {'data': {'type': 'appStoreVersionLocalizations', 'id': locs[loc]['id'], 'attributes': {'whatsNew': t}}})
    log('whatsNew', loc, st, '' if st == 200 else r)
for loc in sorted(set(locs) - set(W)):
    st, r = call('PATCH', f'/appStoreVersionLocalizations/{locs[loc]["id"]}', {'data': {'type': 'appStoreVersionLocalizations', 'id': locs[loc]['id'], 'attributes': {'whatsNew': W['en-US']}}})
    log('whatsNew (English)', loc, st)
st, b = call('GET', f'/apps/{APP}/appEvents?limit=50')
ev = next(e for e in b['data'] if e['attributes'].get('referenceName') == 'Christmas 2026'); EID = ev['id']
st, r = call('PATCH', f'/appEvents/{EID}', {'data': {'type': 'appEvents', 'id': EID, 'attributes': {'deepLink': 'sharliztower://event/christmas'}}})
log('event deepLink', st, '' if st == 200 else r)
st, L = call('GET', f'/appEvents/{EID}/localizations?limit=50')
for l in L['data']:
    st, c = call('GET', f'/appEventLocalizations/{l["id"]}/appEventScreenshots')
    log('event images', l['attributes']['locale'], [(x['attributes'].get('appEventAssetType'), (x['attributes'].get('assetDeliveryState') or {}).get('state')) for x in c.get('data', [])] if st == 200 else c)
if not os.environ.get('SUBMIT'): log('not submitted'); sys.exit(0)
st, subs = call('GET', f'/reviewSubmissions?filter[app]={APP}&filter[platform]=IOS&filter[state]=READY_FOR_REVIEW,UNRESOLVED_ISSUES&limit=5')
sub = subs['data'][0] if st == 200 and subs['data'] else None
if not sub:
    st, r = call('POST', '/reviewSubmissions', {'data': {'type': 'reviewSubmissions', 'attributes': {'platform': 'IOS'}, 'relationships': {'app': {'data': {'type': 'apps', 'id': APP}}}}})
    if st != 201: sys.exit(f'submission {st} {r}')
    sub = r['data']
log('submission', sub['id'], sub['attributes'].get('state'))
st, it = call('GET', f'/reviewSubmissions/{sub["id"]}/items'); log('items before', len(it.get('data', [])) if st == 200 else it)
for rel, typ, i in (('appStoreVersion', 'appStoreVersions', VID), ('appEvent', 'appEvents', EID)):
    st, r = call('POST', '/reviewSubmissionItems', {'data': {'type': 'reviewSubmissionItems', 'relationships': {
        'reviewSubmission': {'data': {'type': 'reviewSubmissions', 'id': sub['id']}}, rel: {'data': {'type': typ, 'id': i}}}}})
    log('add', rel, st, '' if st == 201 else r)
    if rel == 'appStoreVersion' and st != 201 and '409' not in str(st): sys.exit('version item failed, not submitting')
st, r = call('PATCH', f'/reviewSubmissions/{sub["id"]}', {'data': {'type': 'reviewSubmissions', 'id': sub['id'], 'attributes': {'submitted': True}}})
log('SUBMITTED', st, r['data']['attributes'].get('state') if st == 200 else r)
st, v = call('GET', f'/appStoreVersions/{VID}'); log('version state', v['data']['attributes']['appStoreState'])
st, e = call('GET', f'/appEvents/{EID}'); log('event state', e['data']['attributes'].get('eventState'))
