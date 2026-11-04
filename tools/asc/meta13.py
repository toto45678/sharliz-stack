# Saves store texts into version 1.3 (Tzach approved the roundtable's recommendations 04.11 09:25 UTC). Never submits.
import os, sys, json
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
VER = '1.3'; T = json.load(open(os.path.join(os.path.dirname(__file__), 'texts-1.3.json'), encoding='utf-8'))
low = json.dumps(T, ensure_ascii=False).lower()
for w in ('android', 'google', 'play store', 'earnable', '#1'):
    if w in low: sys.exit('texts contain ' + w)
for k, v in T.items():
    assert len(v['subtitle']) <= 30 and len(v['keywords']) <= 100 and len(v['promotionalText']) <= 170 and len(v['description']) <= 4000, k
st, b = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=10')
ver = next((v for v in b['data'] if v['attributes']['versionString'] == VER), None)
if not ver:
    st, r = call('POST', '/appStoreVersions', {'data': {'type': 'appStoreVersions', 'attributes': {'platform': 'IOS', 'versionString': VER, 'releaseType': 'MANUAL'},
                  'relationships': {'app': {'data': {'type': 'apps', 'id': APP}}}}})
    if st != 201: sys.exit(f'create version {st} {r}')
    ver = r['data']; log('created version', VER)
log('version', VER, ver['attributes']['appStoreState'])
if ver['attributes']['appStoreState'] not in ('PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED'): sys.exit('not editable')
VID = ver['id']
st, L = call('GET', f'/appStoreVersions/{VID}/appStoreVersionLocalizations?limit=50'); locs = {l['attributes']['locale']: l for l in L['data']}
log('version locales before', sorted(locs))
for loc, t in T.items():
    attrs = {k: t[k] for k in ('description', 'keywords', 'promotionalText') if k in t}
    if loc in locs:
        st, r = call('PATCH', f'/appStoreVersionLocalizations/{locs[loc]["id"]}', {'data': {'type': 'appStoreVersionLocalizations', 'id': locs[loc]['id'], 'attributes': attrs}})
    else:
        attrs['locale'] = loc
        st, r = call('POST', '/appStoreVersionLocalizations', {'data': {'type': 'appStoreVersionLocalizations', 'attributes': attrs,
                     'relationships': {'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': VID}}}}})
    log('version text', loc, st, '' if st in (200, 201) else r)
st, b = call('GET', f'/apps/{APP}/appInfos')
ai = next((a for a in b['data'] if (a['attributes'].get('appStoreState') or a['attributes'].get('state')) not in ('READY_FOR_SALE',)), None)
if not ai: sys.exit('no editable appInfo')
st, L = call('GET', f'/appInfos/{ai["id"]}/appInfoLocalizations?limit=50'); ilocs = {l['attributes']['locale']: l for l in L['data']}
pp = ilocs['en-US']['attributes'].get('privacyPolicyUrl')
for loc, t in T.items():
    if loc in ilocs:
        st, r = call('PATCH', f'/appInfoLocalizations/{ilocs[loc]["id"]}', {'data': {'type': 'appInfoLocalizations', 'id': ilocs[loc]['id'], 'attributes': {'subtitle': t['subtitle']}}})
    else:
        st, r = call('POST', '/appInfoLocalizations', {'data': {'type': 'appInfoLocalizations',
                     'attributes': {'locale': loc, 'name': t['name'], 'subtitle': t['subtitle'], 'privacyPolicyUrl': pp},
                     'relationships': {'appInfo': {'data': {'type': 'appInfos', 'id': ai['id']}}}}})
    log('name/subtitle', loc, st, '' if st in (200, 201) else r)
st, L = call('GET', f'/appInfos/{ai["id"]}/appInfoLocalizations?limit=50')
for l in L['data']: a = l['attributes']; log('  ', a['locale'], '|', a.get('name'), '|', a.get('subtitle'))
log('SAVED in', VER, '(not submitted)')
