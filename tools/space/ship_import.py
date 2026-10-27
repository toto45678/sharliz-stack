"""Space ship sprites from the graphics department -> art/sp_*.webp (+ tools/space/dome.json).

python3 -I tools/space/ship_import.py <dir>      (every <name>.png in <dir>, names as in the brief:
                                                  sp_ship_g0_h0.png, sp_ship_g3_gold_l.png, sp_drone.png, sp_bg_farmN.png ...)

Ships: the glass dome is painted pure magenta (#FF00FF) in the drawing. The tool finds it, stores its centre and
radius in dome.json (fractions of the picture) and makes it transparent: the game draws the player's own Sharliz there.
A white background is removed by a flood fill from the edges. Ships/add-ons are trimmed and saved 384 px wide;
sp_bg_* (top-view world tiles) keep their shape at 768 px wide.
"""
import json, os, sys
from collections import deque
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ART = os.path.join(ROOT, 'art')
DOME = os.path.join(ROOT, 'tools', 'space', 'dome.json')


def unwhite(im):
    """transparent background: flood fill near-white pixels from the border"""
    im = im.convert('RGBA'); w, h = im.size; px = im.load(); seen = bytearray(w * h); q = deque()
    for x in range(w):
        q.append((x, 0)); q.append((x, h - 1))
    for y in range(h):
        q.append((0, y)); q.append((w - 1, y))
    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or seen[y * w + x]:
            continue
        seen[y * w + x] = 1
        r, g, b, a = px[x, y]
        if a < 20 or (r > 232 and g > 232 and b > 232):
            px[x, y] = (255, 255, 255, 0)
            q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    return im


def dome(im):
    """find + clear the magenta dome; returns (cx, cy, r) in px or None"""
    px = im.load(); w, h = im.size; pts = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 0 and r > 180 and b > 180 and g < 110:
                pts.append((x, y)); px[x, y] = (0, 0, 0, 0)
    if not pts:
        return None
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return ((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, (max(xs) - min(xs) + max(ys) - min(ys)) / 4)


def main(src):
    domes = json.load(open(DOME)) if os.path.exists(DOME) else {}
    for f in sorted(os.listdir(src)):
        if not f.endswith('.png'):
            continue
        name = f[:-4]; im = Image.open(os.path.join(src, f))
        if name.startswith('sp_bg_'):
            im = im.convert('RGB'); W = 768
            im.resize((W, round(im.height * W / im.width)), Image.LANCZOS).save(os.path.join(ART, name + '.webp'), quality=82)
            print(name, 'background'); continue
        im = unwhite(im)
        d = dome(im) if name.startswith('sp_ship_') else None
        box = im.getbbox(); im = im.crop(box)
        W = 384; k = W / im.width; im = im.resize((W, round(im.height * k)), Image.LANCZOS)
        im.save(os.path.join(ART, name + '.webp'), quality=88)
        if d:
            cx, cy, r = d[0] - box[0], d[1] - box[1], d[2]
            domes[name] = {'x': round(cx / (box[2] - box[0]), 4), 'y': round(cy / (box[3] - box[1]), 4), 'r': round(r / (box[2] - box[0]), 4)}
        print(name, im.size, domes.get(name, ''))
        if name.startswith('sp_ship_') and not d:
            print('  WARNING: no magenta dome found, the Sharliz will sit at the default spot')
    json.dump(domes, open(DOME, 'w'), separators=(',', ':'), sort_keys=True)


if __name__ == '__main__':
    main(sys.argv[1])
