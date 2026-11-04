# READ-ONLY: Canada page versions and visibility.
import os, sys
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
PID = '7e41119e-9cc7-473d-9d3f-20d935b14e17'
st, p = call('GET', f'/appCustomProductPages/{PID}'); log('page', p['data']['attributes'])
st, b = call('GET', f'/appCustomProductPages/{PID}/appCustomProductPageVersions?limit=20')
for v in b['data']: log('version', v['id'], v['attributes'])
