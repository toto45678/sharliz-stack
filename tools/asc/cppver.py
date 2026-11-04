# Opens a new version of the approved Canada custom product page (to replace screenshot 01). cpp.py then fills it.
import os, sys
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
PID = '7e41119e-9cc7-473d-9d3f-20d935b14e17'
st, b = call('GET', f'/appCustomProductPages/{PID}/appCustomProductPageVersions?limit=20')
for v in b['data']: log('cpp version', v['id'], v['attributes'])
if any(v['attributes'].get('state') in ('PREPARE_FOR_SUBMISSION', 'REJECTED') for v in b['data']): log('editable version exists'); sys.exit(0)
st, r = call('POST', '/appCustomProductPageVersions', {'data': {'type': 'appCustomProductPageVersions',
             'relationships': {'appCustomProductPage': {'data': {'type': 'appCustomProductPages', 'id': PID}}}}})
log('new cpp version', st, r['data']['id'] if st == 201 else r)
