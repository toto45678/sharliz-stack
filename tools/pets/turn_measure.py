"""Measure a ChatGPT turnaround sheet (design/buddies/turn/turn_<id>.png: FRONT, SIDE facing right, BACK on white).
python3 -I tools/pets/turn_measure.py chick [slime ...]
Numbers are in "character units": 1 = the height of the FRONT view's silhouette, x = 0 at the view's centre, z = 0 at the feet.
Prints, per view: width/height, the left/right extents at 20 heights, and colour blobs (white eyes, black eyes, orange beak/feet,
pink/red mouth+blush, ...) with centre, size. Saves design/buddies/turn/_m_<id>.png = masks + blobs for a visual check.
These numbers drive the builders in pets.py / pets_new.py (Tzach: proportions must match the turnarounds)."""
import sys, os, json, colorsys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TURN = os.path.join(ROOT, 'design', 'buddies', 'turn')
VIEWS = ['front', 'side', 'back']
CLASSES = {   # name: (hue range in degrees (lo, hi), s range, v range)
    'white': ((0, 360), (0, .14), (.86, 1.01)),
    'black': ((0, 360), (0, 1.01), (0, .30)),
    'red': ((335, 375), (.35, 1.01), (.45, 1.01)),      # red / hot pink (mouths)
    'pink': ((300, 345), (.12, .6), (.7, 1.01)),         # soft pink (blush, ear insides)
    'orange': ((14, 42), (.5, 1.01), (.6, 1.01)),
    'yellow': ((42, 68), (.45, 1.01), (.6, 1.01)),
    'green': ((68, 165), (.3, 1.01), (.3, 1.01)),
    'cyan': ((165, 200), (.3, 1.01), (.5, 1.01)),
    'blue': ((200, 262), (.3, 1.01), (.2, 1.01)),
    'purple': ((262, 300), (.3, 1.01), (.3, 1.01)),
    'cream': ((20, 60), (.08, .45), (.8, 1.01)),
    'grey': ((0, 360), (0, .14), (.3, .86)),
}


def masks(path):
    im = np.asarray(Image.open(path).convert('RGB')).astype(np.int16)
    bgl = (im.min(-1) >= 246)                                   # near-white pixels
    lab, n = ndimage.label(bgl)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    bg = np.isin(lab, [b for b in border if b])                # near-white pixels connected to the border
    fg = ndimage.binary_fill_holes(~bg)
    fg = ndimage.binary_opening(fg, iterations=2)
    lab, n = ndimage.label(fg)
    sizes = ndimage.sum(fg, lab, range(1, n + 1))
    keep = [i + 1 for i in np.argsort(sizes)[::-1][:3]]
    views = []
    for k in keep:
        m = lab == k; ys, xs = np.where(m)
        views.append(dict(mask=m, x0=xs.min(), x1=xs.max() + 1, y0=ys.min(), y1=ys.max() + 1))
    views.sort(key=lambda v: v['x0'])
    return im, views


def hsv_class(im, mask):
    """class id per foreground pixel (-1 = none)"""
    rgb = im[mask] / 255.
    mx = rgb.max(-1); mn = rgb.min(-1); v = mx; s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    d = np.maximum(mx - mn, 1e-6); r, g, b = rgb[:, 0], rgb[:, 1], rgb[:, 2]
    h = np.where(mx == r, (g - b) / d % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    cls = np.full(len(rgb), -1)
    for i, (name, ((h0, h1), (s0, s1), (v0, v1))) in enumerate(CLASSES.items()):
        hh = np.where(h < h0, h + 360, h) if h1 > 360 else h
        sel = (cls < 0) & (hh >= h0) & (hh < h1) & (s >= s0) & (s < s1) & (v >= v0) & (v < v1)
        cls[sel] = i
    out = np.full(mask.shape, -1); out[mask] = cls
    return out


def measure(pid, verbose=True):
    im, views = masks(os.path.join(TURN, 'turn_%s.png' % pid))
    H = views[0]['y1'] - views[0]['y0']                          # unit = height of the front view
    res = {}
    vis = Image.fromarray(im.astype(np.uint8)); dr = ImageDraw.Draw(vis)
    for name, v in zip(VIEWS, views):
        m = v['mask']; cx = (v['x0'] + v['x1']) / 2; bot = v['y1']; h = (v['y1'] - v['y0']) / H; w = (v['x1'] - v['x0']) / H
        prof = []
        for i in range(1, 20):
            z = i / 20; row = int(round(bot - z * (v['y1'] - v['y0']))); row = max(v['y0'], min(v['y1'] - 1, row))
            xs = np.where(m[row])[0]
            prof.append((z, round((xs.min() - cx) / H, 3), round((xs.max() + 1 - cx) / H, 3)) if len(xs) else (z, 0, 0))
        cls = hsv_class(im, m); blobs = {}
        for i, cname in enumerate(CLASSES):
            lab, n = ndimage.label(cls == i)
            if not n: continue
            sizes = ndimage.sum(cls == i, lab, range(1, n + 1)); order = np.argsort(sizes)[::-1]
            L = []
            for j in order[:6]:
                if sizes[j] < .0004 * H * H: break
                ys, xs = np.where(lab == j + 1)
                L.append(dict(x=round((xs.mean() - cx) / H, 3), z=round((bot - ys.mean()) / H, 3), w=round((xs.max() - xs.min() + 1) / H, 3), h=round((ys.max() - ys.min() + 1) / H, 3), a=round(sizes[j] / H / H, 4)))
                dr.rectangle((xs.min(), ys.min(), xs.max(), ys.max()), outline=(255, 0, 0) if cname in ('white', 'black') else (0, 0, 255))
            if L: blobs[cname] = L
        res[name] = dict(w=round(w, 3), h=round(h, 3), cx=int(cx), bottom=int(bot), prof=prof, blobs=blobs)
        dr.rectangle((v['x0'], v['y0'], v['x1'], v['y1']), outline=(0, 160, 0))
        for z, l, r in prof[::2]:
            y = bot - z * (v['y1'] - v['y0']); dr.line((cx + l * H, y, cx + r * H, y), fill=(0, 160, 0))
        if verbose:
            print('== %s %s: width %.3f height %.3f' % (pid, name, w, h))
            print('   extents (z: left..right):', ' '.join('%.2f:%+.2f..%+.2f' % p for p in prof[1::2]))
            for cname, L in blobs.items():
                print('   %-6s' % cname, ' | '.join('x%+.2f z%.2f %.2fx%.2f' % (b['x'], b['z'], b['w'], b['h']) for b in L))
    vis.save(os.path.join(TURN, '_m_%s.png' % pid))
    json.dump(res, open(os.path.join(TURN, '_m_%s.json' % pid), 'w'))
    return res


if __name__ == '__main__':
    for pid in sys.argv[1:]: measure(pid)
