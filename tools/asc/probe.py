# READ-ONLY probe: can the App Store Connect API key read Sales and Trends + Analytics Reports? Writes nothing.
import os, sys, gzip, time, urllib.request, urllib.error, json
import jwt
API = 'https://api.appstoreconnect.apple.com/v1'
def token():
    now = int(time.time())
    return jwt.encode({'iss': os.environ['ASC_ISSUER_ID'], 'iat': now, 'exp': now + 1100, 'aud': 'appstoreconnect-v1'},
                      os.environ['ASC_PRIVATE_KEY'], algorithm='ES256', headers={'kid': os.environ['ASC_KEY_ID'], 'typ': 'JWT'})
def get(path, raw=False):
    req = urllib.request.Request(API + path, headers={'Authorization': 'Bearer ' + token(), 'Accept': 'application/a-gzip, application/json'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            b = r.read(); return r.status, (b if raw else json.loads(b) if b else {})
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode(errors='replace')[:700]
APP = '6819720504'
# (a) Sales and Trends: needs the vendor number; without it Apple's error says what is missing
V = os.environ.get('VENDOR', '')
for d in os.environ.get('DAYS', '2026-11-02 2026-11-03').split():
    st, b = get(f'/salesReports?filter[frequency]=DAILY&filter[reportType]=SALES&filter[reportSubType]=SUMMARY&filter[version]=1_1&filter[reportDate]={d}' + (f'&filter[vendorNumber]={V}' if V else ''), raw=True)
    if st == 200:
        rows = gzip.decompress(b).decode().splitlines()
        print('sales', d, 'OK rows', len(rows)); hdr = rows[0].split('\t')
        for r in rows[1:]:
            c = dict(zip(hdr, r.split('\t')))
            if c.get('Apple Identifier') == APP: print('  ', c.get('Country Code'), c.get('Product Type Identifier'), c.get('Units'))
    else: print('sales', d, st, b)
if os.environ.get('SALES_ONLY'): sys.exit(0)
# (b) Analytics Reports: list existing requests only (no POST)
st, b = get(f'/apps/{APP}/analyticsReportRequests')
print('analytics requests', st, json.dumps(b)[:1500] if st == 200 else b)
if st == 200:
    for rq in b.get('data', []):
        st2, r2 = get(f'/analyticsReportRequests/{rq["id"]}/reports?limit=200')
        print(' request', rq['id'], rq['attributes'], 'reports', st2, [x['attributes'].get('name') for x in r2.get('data', [])] if st2 == 200 else r2)
