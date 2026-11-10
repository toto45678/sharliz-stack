# WRITES (Tzach approved 10.11 19:53 UTC): en-US promotional text on the live version. PROMO env picks the text.
import os, sys
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
TXT = {'now': 'New: 500 levels and 50 bosses. Can your tower beat the pirate boss? A Christmas event arrives Dec 15.',
       'dec': 'Christmas comes to the tower! From Dec 15, beat Yeti Freezy in the snow, earn candy canes and a Santa hat. Play free.'}
PROMO = TXT[os.environ.get('PROMO', 'now')]
if len(PROMO) > 170 or 'android' in PROMO.lower(): sys.exit('bad promo')
st, b = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=5')
for V in b['data']:
    a = V['attributes']
    if a['appStoreState'] not in ('READY_FOR_SALE', 'PREPARE_FOR_SUBMISSION', 'WAITING_FOR_REVIEW', 'PENDING_DEVELOPER_RELEASE'): continue
    st, L = call('GET', f'/appStoreVersions/{V["id"]}/appStoreVersionLocalizations?limit=50')
    en = next(l for l in L['data'] if l['attributes']['locale'] == 'en-US')
    if en['attributes'].get('promotionalText') == PROMO: log(a['versionString'], a['appStoreState'], 'promo already set'); continue
    st, r = call('PATCH', f'/appStoreVersionLocalizations/{en["id"]}', {'data': {'type': 'appStoreVersionLocalizations', 'id': en['id'], 'attributes': {'promotionalText': PROMO}}})
    log(a['versionString'], a['appStoreState'], 'promo PATCH', st, r['data']['attributes']['promotionalText'] if st == 200 else r)
