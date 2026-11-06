# 1.3 fix: the new languages had no support URL (Apple refused the version item). Copies support/marketing URLs from English,
# then cancels the event-only submission so the event goes to review together with 1.3 (its deep link needs 1.3).
import os, sys, time
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
st, b = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=10')
VID = next(v for v in b['data'] if v['attributes']['versionString'] == '1.3')['id']
st, L = call('GET', f'/appStoreVersions/{VID}/appStoreVersionLocalizations?limit=50'); locs = {l['attributes']['locale']: l for l in L['data']}
en = locs['en-US']['attributes']; log('en urls', en.get('supportUrl'), en.get('marketingUrl'))
for loc, l in sorted(locs.items()):
    a = l['attributes']; want = {k: en[k] for k in ('supportUrl', 'marketingUrl') if en.get(k) and not a.get(k)}
    miss = [k for k in ('description', 'keywords', 'whatsNew', 'supportUrl') if not a.get(k) and k not in want]
    if want:
        st, r = call('PATCH', f'/appStoreVersionLocalizations/{l["id"]}', {'data': {'type': 'appStoreVersionLocalizations', 'id': l['id'], 'attributes': want}})
        log('urls', loc, list(want), st, '' if st == 200 else r)
    log('check', loc, 'missing:', miss)
SID = os.environ.get('CANCEL')
if SID:
    st, r = call('PATCH', f'/reviewSubmissions/{SID}', {'data': {'type': 'reviewSubmissions', 'id': SID, 'attributes': {'canceled': True}}})
    log('cancel', st, r['data']['attributes'].get('state') if st == 200 else r)
    for i in range(30):
        st, r = call('GET', f'/reviewSubmissions/{SID}'); s = r['data']['attributes']['state'] if st == 200 else r
        log('old submission', s)
        if s in ('COMPLETE', 'CANCELED', 'READY_FOR_REVIEW'): break
        time.sleep(20)
    st, b = call('GET', f'/apps/{APP}/appEvents?limit=50')
    log('event state', [e['attributes'].get('eventState') for e in b['data'] if e['attributes'].get('referenceName') == 'Christmas 2026'])
