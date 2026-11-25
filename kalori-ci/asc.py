# App Store Connect API: make sure the Kalori bundle ID exists with the HealthKit capability,
# and tell whether the app record exists (Apple does not let the API create app records).
import os, sys, time, json, urllib.request, urllib.error, jwt
KEY_ID, ISSUER, KEY = os.environ['ASC_KEY_ID'], os.environ['ASC_ISSUER_ID'], os.environ['ASC_PRIVATE_KEY']
BID = os.environ.get('BUNDLE_ID', 'com.sharlizstack.kalori')
tok = jwt.encode({'iss': ISSUER, 'iat': int(time.time()), 'exp': int(time.time()) + 1100, 'aud': 'appstoreconnect-v1'},
                 KEY, algorithm='ES256', headers={'kid': KEY_ID, 'typ': 'JWT'})
def api(method, path, body=None):
    req = urllib.request.Request('https://api.appstoreconnect.apple.com' + path, method=method,
        data=json.dumps(body).encode() if body else None,
        headers={'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as r: return json.loads(r.read() or b'{}')
    except urllib.error.HTTPError as e:
        print('API', method, path, e.code, e.read().decode()[:600]); return None
r = api('GET', '/v1/bundleIds?filter[identifier]=' + BID)
ids = [d for d in (r or {}).get('data', []) if d['attributes']['identifier'] == BID]
if ids: bid = ids[0]['id']; print('bundle id exists', bid)
else:
    r = api('POST', '/v1/bundleIds', {'data': {'type': 'bundleIds', 'attributes': {'identifier': BID, 'name': 'Kalori', 'platform': 'IOS'}}})
    if not r: sys.exit('could not create the bundle id')
    bid = r['data']['id']; print('bundle id created', bid)
caps = api('GET', f'/v1/bundleIds/{bid}/bundleIdCapabilities') or {}
have = [c['attributes']['capabilityType'] for c in caps.get('data', [])]
print('capabilities:', have)
if 'HEALTHKIT' not in have:
    r = api('POST', '/v1/bundleIdCapabilities', {'data': {'type': 'bundleIdCapabilities', 'attributes': {'capabilityType': 'HEALTHKIT'},
        'relationships': {'bundleId': {'data': {'type': 'bundleIds', 'id': bid}}}}})
    print('HealthKit enabled' if r else 'HealthKit NOT enabled')
apps = api('GET', '/v1/apps?filter[bundleId]=' + BID) or {}
has_app = any(a['attributes']['bundleId'] == BID for a in apps.get('data', []))
print('app record exists:', has_app)
with open(os.environ['GITHUB_OUTPUT'], 'a') as f: f.write(f'has_app={"yes" if has_app else "no"}\n')
