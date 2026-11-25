# TestFlight: an internal group "משפחה" that gets every build automatically, with every App Store Connect user of the team in it.
import os, time, json, urllib.request, urllib.error, jwt
KEY_ID, ISSUER, KEY = os.environ['ASC_KEY_ID'], os.environ['ASC_ISSUER_ID'], os.environ['ASC_PRIVATE_KEY']
BID = 'com.sharlizstack.kalori'
def tok(): return jwt.encode({'iss': ISSUER, 'iat': int(time.time()), 'exp': int(time.time()) + 1100, 'aud': 'appstoreconnect-v1'}, KEY, algorithm='ES256', headers={'kid': KEY_ID, 'typ': 'JWT'})
def api(method, path, body=None):
    req = urllib.request.Request('https://api.appstoreconnect.apple.com' + path, method=method, data=json.dumps(body).encode() if body is not None else None,
        headers={'Authorization': 'Bearer ' + tok(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as r: return json.loads(r.read() or b'{}')
    except urllib.error.HTTPError as e: print(f'ERROR {method} {path[:90]} {e.code}: {e.read().decode()[:500]}'); return None
AID = api('GET', f'/v1/apps?filter[bundleId]={BID}')['data'][0]['id']
for b in api('GET', f'/v1/builds?filter[app]={AID}&sort=-uploadedDate&limit=5')['data']:
    print('build', b['attributes']['version'], b['attributes']['processingState'], 'expired' if b['attributes'].get('expired') else '')
groups = api('GET', f'/v1/apps/{AID}/betaGroups')['data']
g = next((x for x in groups if x['attributes'].get('isInternalGroup')), None)
if not g:
    g = api('POST', '/v1/betaGroups', {'data': {'type': 'betaGroups', 'attributes': {'name': 'משפחה', 'isInternalGroup': True, 'hasAccessToAllBuilds': True},
        'relationships': {'app': {'data': {'type': 'apps', 'id': AID}}}}})['data']; print('group created', g['id'])
else: print('group', g['attributes']['name'], g['id'])
users = api('GET', '/v1/users?limit=50')['data']
have = {t['attributes'].get('email') for t in (api('GET', f'/v1/betaGroups/{g["id"]}/betaTesters?limit=200') or {'data': []})['data']}
for u in users:
    em = u['attributes'].get('username'); 
    print('user', u['attributes'].get('firstName'), u['attributes'].get('roles'), 'in group' if em in have else 'adding')
    if em in have: continue
    api('POST', '/v1/betaTesters', {'data': {'type': 'betaTesters', 'attributes': {'email': em, 'firstName': u['attributes'].get('firstName') or '', 'lastName': u['attributes'].get('lastName') or ''},
        'relationships': {'betaGroups': {'data': [{'type': 'betaGroups', 'id': g['id']}]}}}})

for b in api('GET', f'/v1/builds?filter[app]={AID}&sort=-uploadedDate&limit=3&include=buildBetaDetail')['data'][:3]:
    d = api('GET', f'/v1/builds/{b["id"]}/buildBetaDetail')
    print('beta', b['attributes']['version'], d and d['data']['attributes'])
    if b['attributes'].get('usesNonExemptEncryption') is None: print('  encryption not answered')
tl = api('GET', f'/v1/betaTesters?filter[apps]={AID}&limit=50') or {'data': []}
for t in tl['data']:
    a = t['attributes']; print('tester', a.get('firstName'), a.get('inviteType'), a.get('state'))
    api('POST', '/v1/betaTesterInvitations', {'data': {'type': 'betaTesterInvitations', 'relationships': {'app': {'data': {'type': 'apps', 'id': AID}}, 'betaTester': {'data': {'type': 'betaTesters', 'id': t['id']}}}}})
    print('  invitation sent')
print('DONE')
