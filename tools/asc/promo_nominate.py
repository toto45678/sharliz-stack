# WRITES (Tzach approved 04.11 09:25 UTC): (1) en-US promotional text on the live version, (2) a holiday Featuring Nomination.
import os, sys
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
PROMO = 'Stack your tower, beat 50 bosses, fly into space! 500 levels free. No loot boxes, and nothing random is ever sold.'
st, b = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&filter[appStoreState]=READY_FOR_SALE&limit=1')
V = b['data'][0]; log('live version', V['attributes']['versionString'])
st, L = call('GET', f'/appStoreVersions/{V["id"]}/appStoreVersionLocalizations?limit=50')
en = next(l for l in L['data'] if l['attributes']['locale'] == 'en-US')
if en['attributes'].get('promotionalText') == PROMO: log('promo already set')
else:
    st, r = call('PATCH', f'/appStoreVersionLocalizations/{en["id"]}', {'data': {'type': 'appStoreVersionLocalizations', 'id': en['id'], 'attributes': {'promotionalText': PROMO}}})
    log('promo PATCH', st, r['data']['attributes']['promotionalText'] if st == 200 else r)

DESC = ("Sharliz Tower is a family stacking game: drop swinging Sharliz characters to build a tower, then beat the boss at the end of each world. "
        "It has 500 levels across 6 seasons and 50 bosses, and it plays in 14 languages. From level 89, space levels let players fly a ship over each world, "
        "with a garage to upgrade it. On December 15 a Christmas event opens in the current version: 10 stages on a snowy world with a Yeti boss, "
        "holiday items, and a Star Shield ship upgrade for finishing every stage. The game has no loot boxes, and nothing random is ever sold.")
for w in ('android', 'google', 'earnable'):
    if w in DESC.lower(): sys.exit('bad word ' + w)
st, b = call('GET', f'/nominations?filter[relatedApps]={APP}&limit=20')
log('existing nominations', st, [(n['attributes'].get('name'), n['attributes'].get('state')) for n in b['data']] if st == 200 else b)
if st == 200 and any('Christmas' in (n['attributes'].get('name') or '') for n in b['data']): sys.exit('nomination exists, nothing sent')
body = {'data': {'type': 'nominations', 'attributes': {
            'name': 'Sharliz Tower: Christmas event', 'type': 'NEW_CONTENT', 'description': DESC, 'submitted': True,
            'publishStartDate': '2026-12-15T00:00:00Z', 'publishEndDate': '2026-12-26T23:59:00Z',
            'deviceFamilies': ['IPHONE', 'IPAD'], 'hasInAppEvents': False, 'launchInSelectMarketsFirst': False, 'preOrderEnabled': False},
        'relationships': {'relatedApps': {'data': [{'type': 'apps', 'id': APP}]}}}}
st, r = call('POST', '/nominations', body)
log('nomination POST', st, r if st != 201 else (r['data']['id'], r['data']['attributes'].get('state')))
