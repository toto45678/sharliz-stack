# Hebrew promotional text for December (roundtable 13.11 item d). PREPARED ONLY: it goes to Tzach in the 25.11 package.
# PROMO_HE=show (default) only reads and prints the current he text. Any other value WRITES and needs Tzach's yes first:
#   d3 (3.12), d13 (13.12), gen (27.12, back to the general text).
import os, sys
sys.path.insert(0, os.path.dirname(__file__)); from asc import *
TXT = {'d3':  'חופש חנוכה? בונים מגדל מדמויות שארליז ומנצחים בוסים: 500 שלבים ו-50 בוסים לכל המשפחה. מ-15.12 אירוע שלג: מנצחים את היטי בכובע סנטה. משחקים חינם.',
       'd13': 'אירוע השלג מגיע ב-15.12: מנצחים את היטי בכובע סנטה ואוספים סוכריות. 500 שלבים ו-50 בוסים לכל המשפחה. משחקים חינם.',
       'gen': 'בונים מגדל מדמויות שארליז מרחפות, מנצחים 50 בוסים ומעצבים בית משלכם. 500 שלבים בחינם. בלי קופסאות מזל, ושום דבר אקראי לא נמכר.'}
MODE = os.environ.get('PROMO_HE', 'show')
BAN = ('android', 'google', 'play store', 'אנדרואיד', 'גוגל', '#1')
for k, v in TXT.items():
    if len(v) > 170 or any(w in v.lower() for w in BAN): sys.exit(f'bad promo {k} ({len(v)} chars)')
if MODE != 'show' and MODE not in TXT: sys.exit('PROMO_HE must be show, d3, d13 or gen')
st, b = call('GET', f'/apps/{APP}/appStoreVersions?filter[platform]=IOS&limit=5')
for V in b['data']:
    a = V['attributes']
    if a['appStoreState'] not in ('READY_FOR_SALE', 'PREPARE_FOR_SUBMISSION', 'WAITING_FOR_REVIEW', 'PENDING_DEVELOPER_RELEASE'): continue
    st, L = call('GET', f'/appStoreVersions/{V["id"]}/appStoreVersionLocalizations?limit=50')
    he = next((l for l in L['data'] if l['attributes']['locale'] == 'he'), None)
    if not he: log(a['versionString'], a['appStoreState'], 'no he locale'); continue
    cur = he['attributes'].get('promotionalText')
    if MODE == 'show': log(a['versionString'], a['appStoreState'], 'he promo now:', cur); continue
    if cur == TXT[MODE]: log(a['versionString'], a['appStoreState'], 'promo already set'); continue
    st, r = call('PATCH', f'/appStoreVersionLocalizations/{he["id"]}', {'data': {'type': 'appStoreVersionLocalizations', 'id': he['id'], 'attributes': {'promotionalText': TXT[MODE]}}})
    log(a['versionString'], a['appStoreState'], 'he promo PATCH', st, r['data']['attributes']['promotionalText'] if st == 200 else r)
