# READ-ONLY: Sales and Trends daily SUMMARY from FROM to yesterday + all in-app purchase states + current store texts.
import os, sys, gzip, datetime as dt, collections
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
d0 = dt.date.fromisoformat(os.environ.get('FROM', '2026-10-15')); d1 = dt.date.today() - dt.timedelta(days=1)
units = collections.Counter(); dl_country = collections.Counter(); dl_day = collections.Counter(); proceeds = collections.Counter(); missing = []
d = d0
while d <= d1:
    st, b = call('GET', f'/salesReports?filter[frequency]=DAILY&filter[reportType]=SALES&filter[reportSubType]=SUMMARY&filter[version]=1_1&filter[vendorNumber]={VENDOR}&filter[reportDate]={d}', raw=True)
    if st != 200: missing.append(f'{d}:{st}')
    else:
        rows = gzip.decompress(b).decode().splitlines(); h = rows[0].split('\t')
        for r in rows[1:]:
            c = dict(zip(h, r.split('\t'))); u = int(float(c.get('Units', 0) or 0)); pt = c.get('Product Type Identifier', '')
            key = (pt, c.get('SKU', ''), c.get('Title', '')); units[key] += u
            proceeds[(c.get('SKU', ''), c.get('Currency of Proceeds', ''))] += u * float(c.get('Developer Proceeds', 0) or 0)
            if pt in ('1', '1F', '1T', 'F1'):
                dl_country[c.get('Country Code', '')] += u; dl_day[str(d)] += u
    d += dt.timedelta(days=1)
log('== SALES', d0, '..', d1, '| days without a report:', missing or 'none')
log('-- units by product type / SKU (1/1F = first-time download, 7/7F = update, 3F = redownload, IA* = in-app purchase)')
for k, v in sorted(units.items()): log(' ', k, v)
log('-- first-time downloads by country:', dict(dl_country.most_common()))
log('-- first-time downloads by day:', dict(sorted(dl_day.items())))
log('-- proceeds (units x developer proceeds):', {k: round(v, 2) for k, v in proceeds.items() if v})
log('== IN-APP PURCHASES')
st, b = call('GET', f'/apps/{APP}/inAppPurchasesV2?limit=50')
if st != 200: log('iap list', st, b)
else:
    for p in b['data']: a = p['attributes']; log(' ', a.get('productId'), a.get('inAppPurchaseType'), a.get('state'), a.get('name'))
    log('  total', len(b['data']))
log('== STORE TEXTS')
st, b = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=5')
for v in b['data']:
    log('version', v['id'], v['attributes']['versionString'], v['attributes']['appStoreState'])
    st, L = call('GET', f'/appStoreVersions/{v["id"]}/appStoreVersionLocalizations?limit=50')
    for l in L['data']: a = l['attributes']; log('  ', a['locale'], '| promo:', a.get('promotionalText'), '| kw:', a.get('keywords'))
st, b = call('GET', f'/apps/{APP}/appInfos')
for ai in b['data']:
    log('appInfo', ai['id'], ai['attributes'].get('appStoreState') or ai['attributes'].get('state'))
    st, L = call('GET', f'/appInfos/{ai["id"]}/appInfoLocalizations?limit=50')
    for l in L['data']: a = l['attributes']; log('  ', a['locale'], '| name:', a.get('name'), '| subtitle:', a.get('subtitle'))
