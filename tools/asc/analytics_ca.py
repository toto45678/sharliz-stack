# Read-only: download Analytics Reports instances (DAILY) for 3 reports, keep Territory=CA, sum Counts by date + key columns.
import os, sys, gzip, csv, io, urllib.request, collections
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
REQS = ('383444a6-91d7-45f6-9ee9-a4a4bbafa113', '0c1b2f26-58b3-46f2-a15c-01138a157bb7')
WANT = ('App Downloads Standard', 'App Store Discovery and Engagement Standard')
FROM = os.environ.get('FROM', '2026-11-01'); PPID = '7e41119e-9cc7-473d-9d3f-20d935b14e17'
for rq in REQS:
    st, rs = call('GET', f'/analyticsReportRequests/{rq}/reports?filter[category]=APP_USAGE,COMMERCE&limit=200')
    if st != 200: log('reports', rq, st, rs); continue
    for r in [x for x in rs['data'] if x['attributes'].get('name') in WANT]:
        st, ins = call('GET', f'/analyticsReports/{r["id"]}/instances?filter[granularity]=DAILY&limit=60')
        days = sorted([i for i in ins.get('data', []) if i['attributes']['processingDate'] >= FROM], key=lambda i: i['attributes']['processingDate']) if st == 200 else []
        log('##', rq[:8], r['attributes']['name'], '| daily instances since', FROM, len(days), [d['attributes']['processingDate'] for d in days])
        agg = collections.Counter(); hdr = None
        for d in days:
            st, sg = call('GET', f'/analyticsReportInstances/{d["id"]}/segments')
            for s in sg.get('data', []) if st == 200 else []:
                raw = urllib.request.urlopen(s['attributes']['url'], timeout=120).read()
                try: raw = gzip.decompress(raw)
                except OSError: pass
                rows = csv.DictReader(io.StringIO(raw.decode('utf-8', 'replace')), delimiter='\t')
                hdr = hdr or rows.fieldnames
                for row in rows:
                    if row.get('Territory') != 'CA': continue
                    key = tuple(row.get(c, '') for c in ('Date', 'Download Type', 'Event', 'Page Type', 'Source Type') if c in row)
                    pp = row.get('Product Page ID') or row.get('Page Title') or ''
                    agg[key + ((('CPP' if PPID in pp else pp[:20]),) if pp else ())] += int(float(row.get('Counts') or 0))
        log('columns', hdr)
        for k, v in sorted(agg.items()): log('  CA', ' | '.join(k), '=', v)
