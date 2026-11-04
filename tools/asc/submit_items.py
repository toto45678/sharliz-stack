# One review submission: the Canada page fix (version 2) + the Christmas in-app event.
# Tzach: 'תעשה את זה אתה' for the Canada page (31.10) and approved submitting the event (04.11 09:25 UTC).
import os, sys
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
CPPV = '6195965d-b00e-458f-b53c-9cdd55e7537d'; EV = '6830593968'
st, s = call('GET', f'/appCustomProductPageVersions/{CPPV}'); log('cpp v2', s['data']['attributes'])
st, s = call('GET', f'/appEvents/{EV}'); log('event', s['data']['attributes'].get('eventState'))
st, subs = call('GET', f'/apps/{APP}/reviewSubmissions?filter[platform]=IOS&filter[state]=READY_FOR_REVIEW&limit=5')
sub = subs['data'][0] if st == 200 and subs['data'] else None
if not sub:
    st, r = call('POST', '/reviewSubmissions', {'data': {'type': 'reviewSubmissions', 'attributes': {'platform': 'IOS'}, 'relationships': {'app': {'data': {'type': 'apps', 'id': APP}}}}})
    sub = r['data']
log('submission', sub['id'])
for rel, typ, i in (('appCustomProductPageVersion', 'appCustomProductPageVersions', CPPV), ('appEvent', 'appEvents', EV)):
    st, r = call('POST', '/reviewSubmissionItems', {'data': {'type': 'reviewSubmissionItems', 'relationships': {
        'reviewSubmission': {'data': {'type': 'reviewSubmissions', 'id': sub['id']}}, rel: {'data': {'type': typ, 'id': i}}}}})
    log('item', rel, st, '' if st == 201 else r)
st, r = call('PATCH', f'/reviewSubmissions/{sub["id"]}', {'data': {'type': 'reviewSubmissions', 'id': sub['id'], 'attributes': {'submitted': True}}})
log('SUBMITTED', st, r['data']['attributes'].get('state') if st == 200 else r)
st, s = call('GET', f'/appEvents/{EV}'); log('event now', s['data']['attributes'].get('eventState'))
st, s = call('GET', f'/appCustomProductPageVersions/{CPPV}'); log('cpp v2 now', s['data']['attributes'].get('state'))
