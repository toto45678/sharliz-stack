# Release 1.3 (Tzach: "אתה יכול לפרסם את הגרסה הבאה", 06.11) once Apple approved it.
import os, sys
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
st, b = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=3')
v = next(x for x in b['data'] if x['attributes']['versionString'] == '1.3'); log('1.3', v['attributes']['appStoreState'])
if v['attributes']['appStoreState'] == 'PENDING_DEVELOPER_RELEASE':
    st, r = call('POST', '/appStoreVersionReleaseRequests', {'data': {'type': 'appStoreVersionReleaseRequests', 'relationships': {'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': v['id']}}}}})
    log('release request', st, '' if st == 201 else r)
st, r = call('GET', f'/appStoreVersions/{v["id"]}'); log('1.3 now', r['data']['attributes']['appStoreState'])
st, b = call('GET', f'/apps/{APP}/appEvents?limit=10')
log('events', [(e['attributes']['referenceName'], e['attributes'].get('eventState')) for e in b['data']])
