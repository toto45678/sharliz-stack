# Read-only weekly table: all territories, per day: store page views (Page view events), first-time downloads.
# Overlapping daily instances: a date's numbers come from the newest instance that contains it (no double counting).
import os, sys, gzip, csv, io, urllib.request, collections
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
FROM, TO = os.environ.get('FROM', '2026-11-02'), os.environ.get('TO', '2026-11-08')
RQ = '383444a6-91d7-45f6-9ee9-a4a4bbafa113'
st, rs = call('GET', f'/analyticsReportRequests/{RQ}/reports?limit=200')
out = {}
for name, ev in (('App Store Discovery and Engagement Standard', 'Page view'), ('App Downloads Standard', 'First-time download')):
    r = next(x for x in rs['data'] if x['attributes']['name'] == name)
    st, ins = call('GET', f'/analyticsReports/{r["id"]}/instances?filter[granularity]=DAILY&limit=60')
    best = {}
    for d in sorted(ins['data'], key=lambda i: i['attributes']['processingDate']):
        per = collections.Counter(); ca = collections.Counter()
        st, sg = call('GET', f'/analyticsReportInstances/{d["id"]}/segments')
        for s in sg.get('data', []):
            raw = urllib.request.urlopen(s['attributes']['url'], timeout=120).read()
            try: raw = gzip.decompress(raw)
            except OSError: pass
            for row in csv.DictReader(io.StringIO(raw.decode('utf-8', 'replace')), delimiter='\t'):
                if (row.get('Event') or row.get('Download Type')) != ev: continue
                if not (FROM <= row['Date'] <= TO): continue
                n = int(float(row.get('Counts') or 0)); per[row['Date']] += n
                if row.get('Territory') == 'CA': ca[row['Date']] += n
        for dt in per: best[dt] = (per[dt], ca[dt])
    out[ev] = best
    log('##', ev, 'by day (all / CA):', {k: v for k, v in sorted(best.items())})
