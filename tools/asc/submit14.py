# SUBMITS 1.4 for review (Tzach approved 10.11 19:53 UTC: submit 18.11, release automatically after approval, not before 23.11).
# Checks first: build 89, 5 screenshots per en-US set, What's New everywhere, SCHEDULED release. Aborts if anything is off.
import os, sys
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
st, b = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&filter[versionString]=1.4')
V = b['data'][0]; a = V['attributes']; VID = V['id']
log('1.4', a['appStoreState'], a.get('releaseType'), a.get('earliestReleaseDate'))
if a['appStoreState'] != 'PREPARE_FOR_SUBMISSION': sys.exit('not in PREPARE_FOR_SUBMISSION, nothing sent')
if a.get('releaseType') != 'SCHEDULED' or not (a.get('earliestReleaseDate') or '').startswith('2026-11-2'):
    st, r = call('PATCH', f'/appStoreVersions/{VID}', {'data': {'type': 'appStoreVersions', 'id': VID, 'attributes': {'releaseType': 'SCHEDULED', 'earliestReleaseDate': '2026-11-22T22:00:00+00:00'}}})
    log('set scheduled', st)
st, r = call('GET', f'/appStoreVersions/{VID}/build')
bv = r['data']['attributes']['version'] if st == 200 and r.get('data') else None
log('build', bv)
if bv != '89': sys.exit('build is not 89, nothing sent')
st, L = call('GET', f'/appStoreVersions/{VID}/appStoreVersionLocalizations?limit=50')
for l in L['data']:
    la = l['attributes']; log('whatsNew', la['locale'], la.get('whatsNew'))
    if not la.get('whatsNew'): sys.exit('missing whatsNew ' + la['locale'])
en = next(l for l in L['data'] if l['attributes']['locale'] == 'en-US')
st, S = call('GET', f'/appStoreVersionLocalizations/{en["id"]}/appScreenshotSets?limit=50')
for s in S['data']:
    st, sh = call('GET', f'/appScreenshotSets/{s["id"]}/appScreenshots?limit=50')
    ok = [x['attributes'].get('fileName') for x in sh['data'] if (x['attributes'].get('assetDeliveryState') or {}).get('state') == 'COMPLETE']
    log('shots', s['attributes']['screenshotDisplayType'], ok)
    if len(ok) != 5: sys.exit('screenshot set not complete, nothing sent')
st, subs = call('GET', f'/reviewSubmissions?filter[app]={APP}&filter[platform]=IOS&filter[state]=READY_FOR_REVIEW,UNRESOLVED_ISSUES&limit=5')
sub = subs['data'][0] if st == 200 and subs['data'] else None
if not sub:
    st, r = call('POST', '/reviewSubmissions', {'data': {'type': 'reviewSubmissions', 'attributes': {'platform': 'IOS'}, 'relationships': {'app': {'data': {'type': 'apps', 'id': APP}}}}})
    if st != 201: sys.exit(f'create submission {st} {r}')
    sub = r['data']
log('submission', sub['id'])
st, it = call('GET', f'/reviewSubmissions/{sub["id"]}/items?include=appStoreVersion')
have = [i for i in it.get('data', [])] if st == 200 else []
log('items before', len(have))
if not any(((i.get('relationships') or {}).get('appStoreVersion') or {}).get('data', {}) and i['relationships']['appStoreVersion']['data']['id'] == VID for i in have):
    st, r = call('POST', '/reviewSubmissionItems', {'data': {'type': 'reviewSubmissionItems', 'relationships': {
        'reviewSubmission': {'data': {'type': 'reviewSubmissions', 'id': sub['id']}}, 'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': VID}}}}})
    log('add 1.4', st, '' if st == 201 else r)
    if st != 201: sys.exit('item failed, not submitted')
st, r = call('PATCH', f'/reviewSubmissions/{sub["id"]}', {'data': {'type': 'reviewSubmissions', 'id': sub['id'], 'attributes': {'submitted': True}}})
log('SUBMIT', st, r['data']['attributes'].get('state') if st == 200 else r)
time.sleep(20)
st, b = call('GET', f'/appStoreVersions/{VID}'); log('1.4 now', b['data']['attributes']['appStoreState'], b['data']['attributes'].get('earliestReleaseDate'))
