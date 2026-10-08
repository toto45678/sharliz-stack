"""Build buddy bodies STRAIGHT FROM THE TURNAROUND SILHOUETTES (Tzach, Oct 7: "proportions must match, use as many polygons as needed").
profile(pid, view, ...)   -> [(z, left, right)] of the character's silhouette at many heights, read from design/buddies/turn/turn_<id>.png
                             (turn_measure.masks); `skip` ranges hide appendages (arms, wings, ears, tails) and are bridged smoothly,
                             `add` points pin the hidden parts of the body (e.g. the top of a head under the ears), `top` closes it with a cap.
loft_bm(front, side)      -> one smooth body whose front AND side silhouettes equal those profiles (elliptical cross-sections).
polar_outline(pid, view)  -> the silhouette outline as points (for flat characters such as the star -> pillow_bm).
Loft + paint(...)         -> colour maps / normal maps painted in the body's own UV space from 3D tests (patches, spots, cracks, seams),
                             so surface details are textures, not geometry (Tzach, Oct 7).
Units are the turnaround's: 1 = the height of the front view, x = 0 at the view's centre, z = 0 at the feet, front = -Y."""
import os, sys, math
import numpy as np
from mathutils import Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import turn_measure as TM
from scipy.interpolate import PchipInterpolator
from scipy import ndimage

_CACHE = {}
LAST = None
VIEW_I = {'front': 0, 'side': 1, 'back': 2}


def views(pid):
    if pid not in _CACHE: _CACHE[pid] = TM.masks(os.path.join(TM.TURN, 'turn_%s.png' % pid))
    return _CACHE[pid]


def rows(pid, view='front', n=80):
    """(z, left, right) at n+1 heights from the bottom (z=0) to the top of the view; side view: left = back, right = front"""
    im, V = views(pid); H = V[0]['y1'] - V[0]['y0']; v = V[VIEW_I[view]]
    m = v['mask']; cx = (v['x0'] + v['x1']) / 2; bot = v['y1']; hv = v['y1'] - v['y0']
    out = []
    for i in range(n + 1):
        f = i / n; row = int(round(bot - 1 - f * (hv - 1))); row = max(v['y0'], min(v['y1'] - 1, row))
        xs = np.where(m[row])[0]; z = f * hv / H
        out.append((z, (xs.min() - cx) / H, (xs.max() + 1 - cx) / H) if len(xs) else (z, 0., 0.))
    return out


def _cap(z1, w1, z2, w2, top, n=6):
    """points continuing a narrowing side (w1 at z1, w2 at z2 = last known) smoothly to width 0 at z=top (quarter ellipse)"""
    s = (w2 - w1) / max(1e-6, z2 - z1)        # slope at z2 (sign of w)
    best = None
    for zc in np.linspace(z2 - 2 * (top - z2), z2 - 1e-3, 60):
        R = top - zc; t = (z2 - zc) / R
        if t >= 1: continue
        W = w2 / math.sqrt(1 - t * t); sl = -W * t / (R * math.sqrt(1 - t * t))
        err = abs(sl - s)
        if best is None or err < best[0]: best = (err, W, zc, R)
    _, W, zc, R = best
    return [(z2 + (top - z2) * k, W * math.sqrt(max(0., 1 - ((z2 + (top - z2) * k - zc) / R) ** 2))) for k in np.linspace(0, 1, n + 1)[1:]]


def _skipped(z, side, skip):
    for s in skip:
        if s[0] <= z <= s[1] and side in (s[2] if len(s) > 2 else 'lr'): return True
    return False


def profile(pid, view='front', skip=(), add=(), top=None, bottom=None, n=64, smooth=2, scale=1.):
    """silhouette profile [(z, l, r)] with appendages removed.
    skip = [(z0, z1[, 'l'|'r'|'lr'])]: rows inside are replaced by a smooth bridge (PCHIP through the rows outside).
    add = [(z, l, r)]: extra known points of the body (hidden parts), used like measured rows; l or r may be None.
    top / bottom: the body ends there (rows beyond are dropped); `top` closes it with a rounded cap. scale: multiply the widths."""
    R = rows(pid, view, n); out = {}
    for side, idx in (('l', 1), ('r', 2)):
        pts = [(z, (l, r)[idx - 1]) for z, l, r in R if not _skipped(z, side, skip) and (top is None or z <= top) and (bottom is None or z >= bottom)]
        pts += [(z, (l, r)[idx - 1]) for z, l, r in add if (l, r)[idx - 1] is not None]      # None = no information for that side
        pts.sort()
        if top is not None and pts[-1][0] < top - 1e-6:
            (z1, w1), (z2, w2) = pts[-2], pts[-1]
            pts += _cap(z1, w1, z2, w2, top)
        zs = np.array([p[0] for p in pts]); ws = np.array([p[1] for p in pts])
        zs, ui = np.unique(zs, return_index=True); ws = ws[ui]
        z0 = bottom if bottom is not None else R[0][0]; z1 = top if top is not None else R[-1][0]
        if zs[0] > z0 + 1e-6: zs = np.insert(zs, 0, z0); ws = np.insert(ws, 0, ws[0] * .92)       # bottom hidden (feet, tentacles): hold the first width, a touch narrower
        if zs[-1] < z1 - 1e-6: zs = np.append(zs, z1); ws = np.append(ws, ws[-1] * .92)
        f = PchipInterpolator(zs, ws, extrapolate=False)
        Z = np.linspace(z0, z1, n + 1); W = f(Z)
        if smooth:
            k = np.ones(2 * smooth + 1) / (2 * smooth + 1); Wp = np.pad(W, smooth, mode='edge'); W = np.convolve(Wp, k, mode='valid')
        if top is not None or abs(W[-1]) < .08: W[-1] = 0.      # a narrow top row = the pole of a round top
        out[side] = (Z, W * scale)
    Z = out['l'][0]
    return [(float(z), float(l), float(r)) for z, l, r in zip(Z, out['l'][1], out['r'][1])]


class Loft:
    """rows of elliptical cross-sections: z, a (half width), cx, b (half depth), cy (model y of the centre; front = -y)"""
    def __init__(self, front, side):
        zf = np.array([p[0] for p in front]); zs = np.array([p[0] for p in side])
        sl = np.interp(zf, zs, [p[1] for p in side]); sr = np.interp(zf, zs, [p[2] for p in side])
        self.z = zf; self.a = np.array([(r - l) / 2 for _, l, r in front]); self.cx = np.array([(l + r) / 2 for _, l, r in front])
        self.b = (sr - sl) / 2; self.cy = -(sl + sr) / 2
        self.z0, self.z1 = float(zf[0]), float(zf[-1])

    def at(self, z):
        return (float(np.interp(z, self.z, self.a)), float(np.interp(z, self.z, self.cx)), float(np.interp(z, self.z, self.b)), float(np.interp(z, self.z, self.cy)))

    def xyz(self, U, V):
        """numpy: texel (u, v) -> surface point (x, y, z) and F = front-ness (cos theta: 1 front, -1 back)"""
        Z = self.z0 + V * (self.z1 - self.z0)
        a = np.interp(Z, self.z, self.a); cx = np.interp(Z, self.z, self.cx); b = np.interp(Z, self.z, self.b); cy = np.interp(Z, self.z, self.cy)
        th = (U - .5) * math.tau
        return cx + a * np.sin(th), cy - b * np.cos(th), Z, np.cos(th)


def loft_bm(front, side=None, seg=96, wav=None, uv=True, pole_eps=2e-3, caps=(True, True)):
    """body from a front profile + a side profile (same z range) or a ready Loft: elliptical cross-sections, flat caps where the end
    rows are wide, poles where they close. wav(theta, z) -> (k, dz): radius x(1+k) and height shift (lobes, hems).
    UVs: u around (0.5 = front), v = height. The Loft used is kept in LAST (for texture painting / placing parts)."""
    import bmesh
    global LAST
    L = front if isinstance(front, Loft) else Loft(front, side); LAST = L; bm = bmesh.new(); rows_ = []; isp = []
    for i, z in enumerate(L.z):
        a, cx, b, cy = L.a[i], L.cx[i], L.b[i], L.cy[i]
        if a < pole_eps or b < pole_eps:
            rows_.append([bm.verts.new((cx, cy, z))] * seg); isp.append(True); continue
        row = []
        for j in range(seg):
            t = j / seg * math.tau; k, dz = wav(t, z) if wav else (0., 0.)
            row.append(bm.verts.new((cx + a * (1 + k) * math.sin(t), cy - b * (1 + k) * math.cos(t), z + dz)))
        rows_.append(row); isp.append(False)
    for i in range(len(rows_) - 1):
        A, B = rows_[i], rows_[i + 1]
        if isp[i] and isp[i + 1]: continue
        for j in range(seg):
            k = (j + 1) % seg
            if isp[i]: bm.faces.new((A[0], B[k], B[j]))
            elif isp[i + 1]: bm.faces.new((A[j], A[k], B[0]))
            else: bm.faces.new((A[j], A[k], B[k], B[j]))
    for idx, flip, want in ((0, True, caps[0]), (len(rows_) - 1, False, caps[1])):      # flat caps
        if want and not isp[idx]:
            row = rows_[idx]; c = bm.verts.new((L.cx[idx], L.cy[idx], L.z[idx]))
            for j in range(seg):
                k = (j + 1) % seg
                bm.faces.new((row[k], row[j], c) if flip else (row[j], row[k], c))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.normal_update(); c = sum((v.co for v in bm.verts), Vector()) / len(bm.verts)
    if sum(f.normal.dot(f.calc_center_median() - c) for f in bm.faces) < 0:       # recalc picked inside-out (a crater-shaped cap can fool it)
        bmesh.ops.reverse_faces(bm, faces=bm.faces[:]); bm.normal_update()
    if uv:
        lay = bm.loops.layers.uv.verify()
        for f in bm.faces:
            us = []
            for l in f.loops:
                x, y, z = l.vert.co; a, cx, b, cy = L.at(z)
                us.append((math.atan2(x - cx, -(y - cy)) / math.tau + .5) % 1. if (a > pole_eps and b > pole_eps) else None)
            known = [u for u in us if u is not None]
            if not known: continue
            if max(known) - min(known) > .5: known = [u + 1 if u < .5 else u for u in known]; us = [None if u is None else (u + 1 if u < .5 else u) for u in us]
            mean = sum(known) / len(known)
            for l, u in zip(f.loops, us):
                l[lay].uv = ((mean if u is None else u), max(0., min(1., (l.vert.co.z - L.z0) / (L.z1 - L.z0))))
    return bm


def polar_outline(pid, view='front', n=160, centre=None):
    """outline of the silhouette as [(x, z)] counter-clockwise (x right, z up), for star-convex shapes (rays from the centroid)"""
    im, V = views(pid); H = V[0]['y1'] - V[0]['y0']; v = V[VIEW_I[view]]; m = v['mask']
    ys, xs = np.where(m); cy, cx = (ys.mean(), xs.mean()) if centre is None else (v['y1'] - centre[1] * H, (v['x0'] + v['x1']) / 2 + centre[0] * H)
    out = []
    for i in range(n):
        a = i / n * math.tau; dx, dy = math.cos(a), -math.sin(a); far = 0.
        for r in np.arange(0, max(m.shape), .5):
            x, y = int(round(cx + dx * r)), int(round(cy + dy * r))
            if x < 0 or y < 0 or x >= m.shape[1] or y >= m.shape[0]: break
            if m[y, x]: far = r
        out.append(((cx + dx * far - (v['x0'] + v['x1']) / 2) / H, (v['y1'] - (cy + dy * far)) / H))
    return out


def blob(pid, view, cls, k=0):
    """k-th largest colour blob of a class in that view, from turn_measure (dict x z w h) — eyes/mouth/feet positions"""
    res = TM.measure(pid, verbose=False)
    L = res[view]['blobs'].get(cls, [])
    return L[k] if k < len(L) else None


# ---------------- texture painting ----------------
def paint(loft, fn, W=1024, H=512):
    """colour map for a loft body: fn(X, Y, Z, F) -> (H, W, 3) uint8 array, numpy; F = front-ness (1 front .. -1 back)"""
    from PIL import Image
    U = (np.arange(W) + .5) / W; V = 1 - (np.arange(H) + .5) / H
    UU, VV = np.meshgrid(U, V); X, Y, Z, F = loft.xyz(UU, VV)
    rgb = fn(X, Y, Z, F)
    return Image.fromarray(np.asarray(rgb, dtype=np.uint8))


def rgb(hexcol):
    h = hexcol.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.uint8)


def fill(shape, col):
    out = np.empty(shape + (3,), np.uint8); out[...] = rgb(col); return out


def put(img, mask, col):
    img[mask] = rgb(col); return img


def ell(X, Z, cx, cz, rx, rz, Y=None, cy=None, ry=None):
    """boolean: inside an ellipse (x, z); with Y/cy/ry an ellipsoid test (keeps it on one face of the body)"""
    d = ((X - cx) / rx) ** 2 + ((Z - cz) / rz) ** 2
    if Y is not None: d = d + ((Y - cy) / ry) ** 2
    return d <= 1


def height_to_normal(h, strength=2.0, blur=1.0):
    """height image (float array 0..1 or PIL L) -> tangent-space normal map (PIL RGB), seamless in u"""
    from PIL import Image
    if not isinstance(h, np.ndarray): h = np.asarray(h.convert('L'), np.float32) / 255.
    hs = ndimage.gaussian_filter(h, blur, mode=('reflect', 'wrap')) if blur else h
    size = h.shape[1]
    dx = (np.roll(hs, -1, 1) - np.roll(hs, 1, 1)) * strength * size / 2 / 64
    dy = (np.roll(hs, -1, 0) - np.roll(hs, 1, 0)) * strength * size / 2 / 64
    nx, ny, nz = -dx, dy, np.ones_like(hs); l = np.sqrt(nx * nx + ny * ny + nz * nz)
    out = np.stack([nx / l, ny / l, nz / l], -1) * .5 + .5
    return Image.fromarray((out * 255).round().astype(np.uint8))


def draw_strokes(shape, strokes, width, blur=0):
    """float mask (H, W) with polylines drawn (points in texel coords) — for cracks / seams in height or colour maps"""
    from PIL import Image, ImageDraw
    im = Image.new('L', (shape[1], shape[0]), 0); d = ImageDraw.Draw(im)
    for pts in strokes: d.line(pts, fill=255, width=width, joint='curve')
    a = np.asarray(im, np.float32) / 255.
    return ndimage.gaussian_filter(a, blur) if blur else a


def tex_xy(loft, x, z, W=1024, H=512):
    """front-view point (x, z) on the body -> texel (px, py), on the front face"""
    a, cx, b, cy = loft.at(z); s = max(-1., min(1., (x - cx) / max(1e-6, a)))
    u = math.asin(s) / math.tau + .5; v = (z - loft.z0) / (loft.z1 - loft.z0)
    return (u * W, (1 - v) * H)
