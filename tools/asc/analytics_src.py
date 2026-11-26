# Read-only: Discovery and Engagement (DAILY) by Event x Source Type, all territories and IL, for two periods (A vs B).
import os, sys, gzip, csv, io, urllib.request, collections
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
A = os.environ.get('A', '2026-11-09:2026-11-17').split(':'); B = os.environ.get('B', '2026-11-18:2026-11-25').split(':')
RQ = '383444a6-91d7-45f6-9ee9-a4a4bbafa113'
st, rs = call('GET', f'/analyticsReportRequests/{RQ}/reports?limit=200')
r = next(x for x in rs['data'] if x['attributes']['name'] == 'App Store Discovery and Engagement Standard')
st, ins = call('GET', f'/analyticsReports/{r["id"]}/instances?filter[granularity]=DAILY&limit=60')
best = {}; dates = set()
for d in sorted(ins['data'], key=lambda i: i['attributes']['processingDate']):
    day = collections.defaultdict(collections.Counter)
    st, sg = call('GET', f'/analyticsReportInstances/{d["id"]}/segments')
    for s in sg.get('data', []):
        raw = urllib.request.urlopen(s['attributes']['url'], timeout=120).read()
        try: raw = gzip.decompress(raw)
        except OSError: pass
        for row in csv.DictReader(io.StringIO(raw.decode('utf-8', 'replace')), delimiter='\t'):
            n = int(float(row.get('Counts') or 0)); k = (row.get('Event'), row.get('Source Type'))
            day[row['Date']][('ALL',) + k] += n
            if row.get('Territory') == 'IL': day[row['Date']][('IL',) + k] += n
    for dt, c in day.items(): best[dt] = c
log('dates with data:', sorted(best))
for name, (a, b) in (('A', A), ('B', B)):
    tot = collections.Counter()
    for dt, c in best.items():
        if a <= dt <= b: tot.update(c)
    log('##', name, a, b, {' | '.join(k): v for k, v in sorted(tot.items())})
