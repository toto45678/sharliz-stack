#!/usr/bin/env python3
"""Gift codes for the game (src/v73.js). The gift is written inside the code, so new codes need no store update.

  python3 tools/coupons/make.py --coins 500 --packs 2                 # one code
  python3 tools/coupons/make.py --coins 200 --boosters 1 --count 20   # 20 different codes, same gift
  python3 tools/coupons/make.py --egg g --expires 2026-12-31          # code stops working after that day
  python3 tools/coupons/make.py --check K7QM-4XPA-R2S0                # what a code gives

Values (nearest allowed value is used, the script prints what each code really gives):
  coins    0 50 100 150 200 300 500 750 1000 1500 2000 3000 5000 7500 10000 20000
  boosters 0-7 of EACH booster (slow, laser, shield, heart)
  packs    0-7 sticker packs     gpacks 0-3 golden sticker packs
  egg      c (common) r (rare) g (golden)
  cookies  0 3 5 10 15 20 30 50
A device can redeem each code once. Same gift + same expiry → use a different --serial (or --count) for a new code.
"""
import argparse, datetime, hashlib, hmac, secrets, sys

KEY = bytes.fromhex('fd351378def5c38919dc513396c50604')   # same key as CP_K in src/v73.js
ABC = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
COINS = [0, 50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000, 7500, 10000, 20000]
COOK = [0, 3, 5, 10, 15, 20, 30, 50]
EGG = [None, 'c', 'r', 'g']
T0 = datetime.date(2026, 10, 26)


def nearest(table, v):
    return min(range(len(table)), key=lambda i: (abs(table[i] - v), i))


def encode(coins=0, boosters=0, packs=0, gpacks=0, egg=None, cookies=0, expires=None, serial=0):
    wk = 0
    if expires:
        wk = -(-((expires - T0).days + 1) // 7)       # round up: the code works at least until that day
        if not 1 <= wk < 512:
            sys.exit('expiry must be between tomorrow and 2036')
    fields = [(1, 2), (nearest(COINS, coins), 4), (min(7, boosters), 3), (min(7, packs), 3), (min(3, gpacks), 2),
              (EGG.index(egg), 2), (nearest(COOK, cookies), 3), (wk, 9), (serial & 255, 8)]
    pay = 0
    for v, n in fields:
        pay = pay << n | v
    mac = hmac.new(KEY, pay.to_bytes(5, 'big'), hashlib.sha256).digest()[:3]
    num = pay << 24 | int.from_bytes(mac, 'big')
    s = ''.join(ABC[num >> (5 * (11 - i)) & 31] for i in range(12))
    return s[:4] + '-' + s[4:8] + '-' + s[8:]


def decode(code):
    s = code.upper().replace('-', '').replace(' ', '').replace('O', '0').replace('I', '1').replace('L', '1')
    if len(s) != 12 or any(c not in ABC for c in s):
        return None
    num = 0
    for c in s:
        num = num << 5 | ABC.index(c)
    pay, sig = num >> 24, num & 0xFFFFFF
    if hmac.new(KEY, pay.to_bytes(5, 'big'), hashlib.sha256).digest()[:3] != sig.to_bytes(3, 'big'):
        return None
    out = {}
    for name, n in reversed([('ver', 2), ('coins', 4), ('boosters', 3), ('packs', 3), ('gpacks', 2), ('egg', 2), ('cookies', 3), ('wk', 9), ('serial', 8)]):
        out[name] = pay & ((1 << n) - 1)
        pay >>= n
    out['coins'] = COINS[out['coins']]
    out['cookies'] = COOK[out['cookies']]
    out['egg'] = EGG[out['egg']]
    out['expires'] = str(T0 + datetime.timedelta(days=out.pop('wk') * 7 - 1)) if out['wk'] else 'never'
    return out


def describe(d):
    parts = []
    if d['coins']: parts.append(f"{d['coins']} coins")
    if d['boosters']: parts.append(f"{d['boosters']} of each booster")
    if d['packs']: parts.append(f"{d['packs']} sticker packs")
    if d['gpacks']: parts.append(f"{d['gpacks']} golden packs")
    if d['egg']: parts.append({'c': 'common', 'r': 'rare', 'g': 'golden'}[d['egg']] + ' egg')
    if d['cookies']: parts.append(f"{d['cookies']} cookies")
    return ', '.join(parts) + (f" · works until {d['expires']}" if d['expires'] != 'never' else ' · never expires')


if __name__ == '__main__':
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument('--coins', type=int, default=0)
    a.add_argument('--boosters', type=int, default=0)
    a.add_argument('--packs', type=int, default=0)
    a.add_argument('--gpacks', type=int, default=0)
    a.add_argument('--egg', choices=['c', 'r', 'g'])
    a.add_argument('--cookies', type=int, default=0)
    a.add_argument('--expires', type=datetime.date.fromisoformat)
    a.add_argument('--serial', type=int)
    a.add_argument('--count', type=int, default=1)
    a.add_argument('--check')
    o = a.parse_args()
    if o.check:
        d = decode(o.check)
        print(describe(d) if d else 'not a valid code')
        sys.exit(0 if d else 1)
    if not (o.coins or o.boosters or o.packs or o.gpacks or o.egg or o.cookies):
        sys.exit('give at least one gift (see --help)')
    serials = [o.serial] if o.serial is not None and o.count == 1 else secrets.SystemRandom().sample(range(256), min(256, o.count))
    for sn in serials:
        c = encode(o.coins, o.boosters, o.packs, o.gpacks, o.egg, o.cookies, o.expires, sn)
        print(c, ' ', describe(decode(c)))
