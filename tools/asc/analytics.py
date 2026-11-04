# Analytics Reports API. Tzach approved creating the read-only request on 04.11 09:11 UTC.
#   CREATE=1 -> make ONGOING + ONE_TIME_SNAPSHOT requests if missing (the only write). Otherwise list requests/reports/instances.
import os, time, json, urllib.request, urllib.error
import jwt
API = 'https://api.appstoreconnect.apple.com/v1'; APP = '6819720504'
def token():
    now = int(time.time())
    return jwt.encode({'iss': os.environ['ASC_ISSUER_ID'], 'iat': now, 'exp': now + 1100, 'aud': 'appstoreconnect-v1'},
                      os.environ['ASC_PRIVATE_KEY'], algorithm='ES256', headers={'kid': os.environ['ASC_KEY_ID'], 'typ': 'JWT'})
def call(m, path, body=None):
    req = urllib.request.Request(path if path.startswith('http') else API + path, method=m,
          data=json.dumps(body).encode() if body else None, headers={'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r: b = r.read(); return r.status, json.loads(b) if b else {}
    except urllib.error.HTTPError as e: return e.code, e.read().decode(errors='replace')[:800]
st, b = call('GET', f'/apps/{APP}/analyticsReportRequests'); reqs = b['data'] if st == 200 else []
have = {r['attributes']['accessType'] for r in reqs}
if os.environ.get('CREATE'):
    for at in ('ONGOING', 'ONE_TIME_SNAPSHOT'):
        if at in have: print('exists', at); continue
        st, b = call('POST', '/analyticsReportRequests', {'data': {'type': 'analyticsReportRequests', 'attributes': {'accessType': at},
                     'relationships': {'app': {'data': {'type': 'apps', 'id': APP}}}}})
        print('CREATED' if st == 201 else 'create failed', at, st, b['data']['id'] if st == 201 else b)
    st, b = call('GET', f'/apps/{APP}/analyticsReportRequests'); reqs = b['data']
for rq in reqs:
    print('request', rq['id'], rq['attributes'])
    st, rs = call('GET', f'/analyticsReportRequests/{rq["id"]}/reports?limit=200')
    if st != 200: print('  reports', st, rs); continue
    WANT = ('App Downloads Standard', 'App Store Discovery and Engagement Standard', 'App Store Installation and Deletion Standard')
    for r in [x for x in rs['data'] if x['attributes'].get('name') in WANT]:
        st, ins = call('GET', f'/analyticsReports/{r["id"]}/instances?limit=50')
        n = len(ins['data']) if st == 200 else st
        print('  report', r['attributes'].get('category'), '|', r['attributes'].get('name'), '| instances', n)
