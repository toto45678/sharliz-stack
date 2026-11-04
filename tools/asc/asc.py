# Shared App Store Connect API helpers (key from the GitHub secrets).
import os, time, json, gzip, urllib.request, urllib.error
import jwt
API = 'https://api.appstoreconnect.apple.com/v1'; APP = '6819720504'; VENDOR = '94946362'
def token():
    now = int(time.time())
    return jwt.encode({'iss': os.environ['ASC_ISSUER_ID'], 'iat': now, 'exp': now + 1100, 'aud': 'appstoreconnect-v1'},
                      os.environ['ASC_PRIVATE_KEY'], algorithm='ES256', headers={'kid': os.environ['ASC_KEY_ID'], 'typ': 'JWT'})
def call(m, path, body=None, raw=False):
    url = path if path.startswith('http') else (API.replace('/v1', '') + path if path.startswith('/v2') else API + path)
    for t in range(3):
        req = urllib.request.Request(url, method=m, data=json.dumps(body).encode() if body is not None else None,
              headers={'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json', 'Accept': 'application/a-gzip, application/json'})
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                b = r.read(); return r.status, (b if raw else (json.loads(b) if b else {}))
        except urllib.error.HTTPError as e: return e.code, e.read().decode(errors='replace')[:1200]
        except (TimeoutError, OSError) as e: err = str(e); time.sleep(3)
    return 0, 'network: ' + err
def log(*a): print(*a, flush=True)
