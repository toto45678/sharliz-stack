"""Silhouette fit: how well a built buddy matches its ChatGPT turnaround (front + side views).
Called from pets.py after a build (python3 -I tools/pets/pets.py chick --fit) — it needs the live Blender scene.
Projects every mesh triangle to the front plane (x, z) and the side plane (-y, z), rasterises them, normalises by height
(bottom-aligned, centred like the turnaround masks from turn_measure.py) and prints the IoU per view.
Saves design/buddies/turn/_fit_<id>.png: turnaround silhouette red, model blue, overlap purple (front | side)."""
import os, sys
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import turn_measure as TM

S = 400   # raster: character height in px


def model_masks():
    import bpy, bmesh
    deps = bpy.context.evaluated_depsgraph_get()
    tris = []
    for o in bpy.context.scene.objects:
        if o.type != 'MESH' or o.name.startswith('ink'): continue
        ev = o.evaluated_get(deps); me = ev.to_mesh(); me.calc_loop_triangles(); M = o.matrix_world
        vs = [M @ v.co for v in me.vertices]
        for t in me.loop_triangles: tris.append([vs[i] for i in t.vertices])
        ev.to_mesh_clear()
    P = np.array([[(v.x, v.y, v.z) for v in t] for t in tris])          # (n,3,3)
    zmin, zmax = P[..., 2].min(), P[..., 2].max(); h = zmax - zmin
    out = {}
    for name, ax, sign in (('front', 0, 1), ('side', 1, -1)):
        u = sign * P[..., ax]; v = P[..., 2]
        uc = (u.min() + u.max()) / 2
        if os.environ.get('FITDBG'): print('  model %s u %.3f..%.3f z %.3f..%.3f (h %.3f)' % (name, u.min(), u.max(), zmin, zmax, h))
        W = int(S * 1.6); img = Image.new('1', (W, S + 4), 0); d = ImageDraw.Draw(img)
        for k in range(len(P)):
            pts = [(W / 2 + (u[k, j] - uc) / h * S, S + 2 - (v[k, j] - zmin) / h * S) for j in range(3)]
            d.polygon(pts, fill=1)
        out[name] = np.asarray(img, dtype=bool)
    return out


def turn_masks(pid):
    im, views = TM.masks(os.path.join(TM.TURN, 'turn_%s.png' % pid))
    H = views[0]['y1'] - views[0]['y0']; out = {}
    for name, v in zip(('front', 'side'), views[:2]):
        m = Image.fromarray(v['mask'][v['y0']:v['y1'], v['x0']:v['x1']].astype(np.uint8) * 255)
        if os.environ.get('FITDBG'): print('  turn %s x %.3f..%.3f h %.3f' % (name, (v['x0'] - (views[0]['x0'] + views[0]['x1']) / 2) / H, (v['x1'] - (views[0]['x0'] + views[0]['x1']) / 2) / H, (v['y1'] - v['y0']) / H))
        hh = v['y1'] - v['y0']; ww = v['x1'] - v['x0']
        m = m.resize((max(1, int(round(ww / H * S))), int(round(hh / H * S))), Image.BILINEAR)
        W = int(S * 1.6); canvas = Image.new('L', (W, S + 4), 0)
        canvas.paste(m, (W // 2 - m.width // 2, S + 2 - m.height))
        out[name] = np.asarray(canvas) > 127
    return out


def fit(pid, save=True):
    A = turn_masks(pid); B = model_masks(); ious = {}
    panels = []
    for name in ('front', 'side'):
        a, b = A[name], B[name]
        ious[name] = round((a & b).sum() / max(1, (a | b).sum()), 3)
        rgb = np.full(a.shape + (3,), 255, np.uint8)
        rgb[a & ~b] = (255, 90, 90); rgb[b & ~a] = (90, 120, 255); rgb[a & b] = (170, 90, 190)
        panels.append(Image.fromarray(rgb))
    print('FIT %s  front IoU %.3f  side IoU %.3f   (red = turnaround only, blue = model only)' % (pid, ious['front'], ious['side']))
    if os.environ.get('FITROWS'):     # per-height differences: where the model is narrower (-) / wider (+) than the turnaround, in units
        for name in ('front', 'side'):
            a, b = A[name], B[name]; out = []
            for z in np.arange(.05, 1.0, .05):
                row = int(round(S + 2 - z * S)); xa = np.where(a[row])[0]; xb = np.where(b[row])[0]
                if not len(xa) or not len(xb): out.append('%.2f:%s' % (z, 'A' if len(xa) else 'B')); continue
                dl = (xb.min() - xa.min()) / S; dr = (xb.max() - xa.max()) / S
                if abs(dl) > .015 or abs(dr) > .015: out.append('%.2f:L%+.2f R%+.2f' % (z, -dl, dr))
            print('   %s rows (model minus turnaround, L=left/back R=right/front):' % name, ' '.join(out))
    if save:
        W = sum(p.width for p in panels) + 10; im = Image.new('RGB', (W, panels[0].height), (255, 255, 255)); x = 0
        for p in panels: im.paste(p, (x, 0)); x += p.width + 10
        im.save(os.path.join(TM.TURN, '_fit_%s.png' % pid))
    return ious
