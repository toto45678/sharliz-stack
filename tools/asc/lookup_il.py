# Read-only: is 1.4 live and is the Hebrew page served? (iTunes lookup, no auth)
import json, urllib.request
for q in ('country=il&lang=he', 'country=us'):
    with urllib.request.urlopen(f'https://itunes.apple.com/lookup?id=6819720504&{q}', timeout=30) as r: d = json.load(r)['results'][0]
    print(q, '| version', d.get('version'), '|', d.get('currentVersionReleaseDate'), '|', d.get('trackName'), '|', (d.get('description') or '')[:80].replace('\n', ' '))
