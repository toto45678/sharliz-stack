# Read-only keyword rank check (iTunes Search API, top 200): our app position per term and country. None = not in the top 200.
import json, urllib.request, urllib.parse, time, sys
APP = 6819720504
KW = {'us': 'stack,block,drop,build,balance,casual,arcade,family,kids,puzzle,space,ship,cute,offline,physics',
      'il': 'ערימה,בלוקים,ילדים,בוס,בית,עיצוב,מדבקות,אלבום,דמויות,פאזל,משפחה,ארקייד,איזון,קומות,רהיטים',
      'fr': 'empiler,tour,blocs,construire,équilibre,arcade,famille,enfants,casse-tête,espace,mignon,hors ligne',
      'mx': 'apilar,torre,bloques,construir,equilibrio,arcade,familia,niños,rompecabezas,espacio,sin internet',
      'de': 'stapeln,turm,blöcke,bauen,balance,arcade,familie,kinder,rätsel,weltraum,süß,offline,geschick',
      'jp': '積み上げ,タワー,ブロック,バランス,カジュアル,アーケード,家族,子供,パズル,宇宙,かわいい,オフライン'}
# 2-word phrases a player would type, built from the app's own keywords
PH = {'us': ['stack tower', 'tower stack', 'stacking game', 'boss battle kids', 'block drop', 'balance tower', 'cute stack game', 'offline kids game', 'sharliz', 'tower builder'],
      'il': ['מגדל', 'משחק מגדל', 'שארליז'], 'fr': ['empiler tour', 'jeu tour'], 'mx': ['apilar torre', 'juego torre'], 'de': ['turm stapeln', 'stapel spiel'], 'jp': ['タワー 積み上げ', '積み上げ ゲーム']}
out = {}
for c in KW:
    terms = PH[c] + KW[c].split(',')[:10]
    for t in terms:
        u = 'https://itunes.apple.com/search?' + urllib.parse.urlencode({'term': t, 'country': c, 'entity': 'software', 'limit': 200})
        for i in range(3):
            try: r = json.load(urllib.request.urlopen(u, timeout=30)); break
            except Exception as e: time.sleep(10); r = {'results': []}
        ids = [x.get('trackId') for x in r.get('results', [])]
        out[f'{c}:{t}'] = ids.index(APP) + 1 if APP in ids else None
        time.sleep(3.2)
    print(c, {k.split(':', 1)[1]: v for k, v in out.items() if k.startswith(c + ':')}, flush=True)
print("RANKS_JSON", json.dumps(out, ensure_ascii=False))
