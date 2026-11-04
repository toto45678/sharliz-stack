# Christmas In-App Event (Tzach approved the roundtable plan 04.11 09:25 UTC, incl. submitting it). SUBMIT=1 sends it to review.
import os, sys, hashlib
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
D = os.path.join(os.path.dirname(__file__), 'event-christmas')
REF = 'Christmas 2026'
LOC = {'en-US': {'name': 'Sharliz Christmas Event', 'shortDescription': '10 snowy stages and a Yeti boss',
                 'longDescription': 'Stack your tower through 10 snowy stages, beat the Yeti boss, and win holiday hats and a Star Shield for your ship.'},
       'he': {'name': 'חג המולד בשארליז', 'shortDescription': '10 שלבים מושלגים ובוס יטי',
              'longDescription': 'בונים מגדל ב-10 שלבים מושלגים, מנצחים את בוס היטי וזוכים בכובעי חג ובמגן כוכב לחללית.'}}
for l, t in LOC.items():
    assert len(t['name']) <= 30 and len(t['shortDescription']) <= 50 and len(t['longDescription']) <= 120, (l, [len(x) for x in t.values()])
    if any(w in json.dumps(t).lower() for w in ('android', 'google', 'free')): sys.exit('bad word')
st, b = call('GET', f'/apps/{APP}/appEvents?limit=50')
for e in b['data']: log('event', e['id'], e['attributes'].get('referenceName'), e['attributes'].get('eventState'))
ev = next((e for e in b['data'] if e['attributes'].get('referenceName') == REF), None)
if not ev:
    terr = []; url = '/territories?limit=200'
    while url:
        st, t = call('GET', url); terr += [x['id'] for x in t['data']]; url = t.get('links', {}).get('next')
    log('territories', len(terr))
    st, r = call('POST', '/appEvents', {'data': {'type': 'appEvents', 'attributes': {
        'referenceName': REF, 'badge': 'SPECIAL_EVENT', 'primaryLocale': 'en-US', 'priority': 'NORMAL',
        'purpose': 'APPROPRIATE_FOR_ALL_USERS', 'purchaseRequirement': 'NO_COST_ASSOCIATED',
        'territorySchedules': [{'territories': terr, 'publishStart': '2026-12-01T12:00:00Z',
                                'eventStart': '2026-12-15T12:00:00Z', 'eventEnd': '2026-12-26T20:00:00Z'}]},
        'relationships': {'app': {'data': {'type': 'apps', 'id': APP}}}}})
    if st != 201: sys.exit(f'create event {st} {r}')
    ev = r['data']; log('created event', ev['id'])
EID = ev['id']
st, L = call('GET', f'/appEvents/{EID}/localizations?limit=50'); have = {l['attributes']['locale']: l for l in L['data']}
for loc, t in LOC.items():
    if loc in have:
        st, r = call('PATCH', f'/appEventLocalizations/{have[loc]["id"]}', {'data': {'type': 'appEventLocalizations', 'id': have[loc]['id'], 'attributes': t}})
    else:
        st, r = call('POST', '/appEventLocalizations', {'data': {'type': 'appEventLocalizations', 'attributes': dict(t, locale=loc),
                     'relationships': {'appEvent': {'data': {'type': 'appEvents', 'id': EID}}}}})
        if st == 201: have[loc] = r['data']
    log('event text', loc, st, '' if st in (200, 201) else r)
# images on the primary locale
lid = have['en-US']['id']
st, cur = call('GET', f'/appEventLocalizations/{lid}/appEventScreenshots')
done = {x['attributes'].get('appEventAssetType') for x in cur['data']} if st == 200 else set()
for typ, f in (('EVENT_CARD', 'card_1920x1080.png'), ('EVENT_DETAILS_PAGE', 'details_1080x1920.png')):
    if typ in done: log('image exists', typ); continue
    data = open(os.path.join(D, f), 'rb').read()
    st, a = call('POST', '/appEventScreenshots', {'data': {'type': 'appEventScreenshots', 'attributes': {'fileName': f, 'fileSize': len(data), 'appEventAssetType': typ},
                 'relationships': {'appEventLocalization': {'data': {'type': 'appEventLocalizations', 'id': lid}}}}})
    if st != 201: log('image reserve', typ, st, a); continue
    a = a['data']
    for op in a['attributes']['uploadOperations']:
        rq = urllib.request.Request(op['url'], method=op['method'], data=data[op['offset']:op['offset'] + op['length']], headers={h['name']: h['value'] for h in op['requestHeaders']})
        urllib.request.urlopen(rq, timeout=300).read()
    st, r = call('PATCH', f'/appEventScreenshots/{a["id"]}', {'data': {'type': 'appEventScreenshots', 'id': a['id'], 'attributes': {'uploaded': True}}})
    log('image', typ, st, '' if st == 200 else r)
time.sleep(20)
st, cur = call('GET', f'/appEventLocalizations/{lid}/appEventScreenshots')
log('images now', [(x['attributes'].get('appEventAssetType'), (x['attributes'].get('assetDeliveryState') or {}).get('state')) for x in cur.get('data', [])] if st == 200 else cur)
if os.environ.get('SUBMIT'):
    st, subs = call('GET', f'/apps/{APP}/reviewSubmissions?filter[platform]=IOS&filter[state]=READY_FOR_REVIEW&limit=5')
    sub = subs['data'][0] if st == 200 and subs['data'] else None
    if not sub:
        st, r = call('POST', '/reviewSubmissions', {'data': {'type': 'reviewSubmissions', 'attributes': {'platform': 'IOS'}, 'relationships': {'app': {'data': {'type': 'apps', 'id': APP}}}}}); sub = r['data']
    st, r = call('POST', '/reviewSubmissionItems', {'data': {'type': 'reviewSubmissionItems', 'relationships': {
        'reviewSubmission': {'data': {'type': 'reviewSubmissions', 'id': sub['id']}}, 'appEvent': {'data': {'type': 'appEvents', 'id': EID}}}}})
    log('add item', st, '' if st == 201 else r)
    if st == 201:
        st, r = call('PATCH', f'/reviewSubmissions/{sub["id"]}', {'data': {'type': 'reviewSubmissions', 'id': sub['id'], 'attributes': {'submitted': True}}})
        log('SUBMITTED event', st, r['data']['attributes'].get('state') if st == 200 else r)
st, e = call('GET', f'/appEvents/{EID}'); log('event state', e['data']['attributes'].get('eventState'))
