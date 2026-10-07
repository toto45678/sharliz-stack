"""The 11 NEW buddies (v61 roster, plan /mnt/project-files/game/buddies-plan.md), built from the brief descriptions
(tools/pets/chatgpt_brief.txt, Part B) in the bee-v2 style: one chunky body + a few parts, painted bodies where it helps.
They get tuned against the ChatGPT turnarounds when those arrive. Imported by pets.py (same helpers, same export)."""
import math, random, sys
# share the helpers AND the META dict of the running pets.py (it may be __main__), never a second copy of the module
_p = sys.modules['__main__'] if getattr(sys.modules['__main__'], '__file__', '').endswith('pets.py') else __import__('pets')
globals().update({k: v for k, v in vars(_p).items() if not k.startswith('__')})
from PIL import Image, ImageDraw, ImageFilter
ROUND0_F = [(0, -.001, .001), (.01, -.11, .11), (.02, -.15, .15), (.035, -.18, .18)]   # round bottom rows for bodies that sit on the ground


# ---------------- extra shape helpers ----------------
def smooth_poly(ctrl, per=5, bump=.0):
    """polyline through control points, each segment subdivided, with an optional sin bump (rounded scallops)"""
    out = []
    for a, b in zip(ctrl, ctrl[1:]):
        for k in range(per):
            f = k / per; x = a[0] + (b[0] - a[0]) * f; z = a[1] + (b[1] - a[1]) * f
            out.append((x, z + bump * math.sin(f * math.pi)))
    out.append(ctrl[-1])
    return out


def feather_wing(side, span=.5, rise=.2):
    """feathered wing in the XZ plane, root (0,0), spreading +X: smooth top edge, 3 rounded feather tips underneath"""
    top = [(span * f, .03 + rise * f ** 1.1 + .05 * math.sin(f * math.pi)) for f in [i / 9 for i in range(10)]]
    low = [(span, .03 + rise), (span * .93, -.17), (span * .78, -.07), (span * .62, -.2), (span * .45, -.09), (span * .3, -.2), (span * .14, -.08), (0, -.03)]
    pts = top + smooth_poly(low, 4, bump=-.03)[1:-1]
    if side < 0: pts = [(-u, v) for u, v in reversed(pts)]
    return pts


def flame_wing(side, span=.42):
    """flame-shaped wing: flat lower edge, three flame tips licking up"""
    low = [(0, 0), (span * .5, -.04), (span, .02)]
    up = [(span, .02), (span * .92, .34), (span * .74, .14), (span * .6, .42), (span * .42, .17), (span * .26, .36), (span * .1, .14), (0, .1)]
    pts = smooth_poly(low, 4)[:-1] + smooth_poly(up, 4, bump=.02)[:-1]
    if side < 0: pts = [(-u, v) for u, v in reversed(pts)]
    return pts


def bolt_outline(w, h):
    """lightning bolt in the XZ plane, base at the bottom centre, pointing up"""
    pts = [(-.05 * w, 0), (.5 * w, .55 * h), (.12 * w, .5 * h), (.35 * w, h), (-.5 * w, .42 * h), (-.08 * w, .47 * h)]
    return _ccw(pts)


def helix_pts(center, axis_len, radius, turns, n=40, up=0.):
    """coil along +Y (backwards) starting at center"""
    pts = []
    for i in range(n + 1):
        f = i / n; a = f * turns * math.tau
        pts.append(Vector((center[0] + math.cos(a) * radius, center[1] + axis_len * f, center[2] + math.sin(a) * radius + up * f)))
    return pts






def galaxy_texture(w=512, h=256, seed=7):
    """deep purple-blue space with a soft nebula swirl and tiny stars; lighter belly in the bottom third"""
    rnd = random.Random(seed)
    im = Image.new('RGB', (w, h)); px = im.load()
    for j in range(h):
        v = 1 - j / h
        for i in range(w):
            u = i / w
            sw = .5 + .5 * math.sin(u * math.tau * 2 + v * 6)                       # swirl bands
            r = 88 + 50 * sw; g = 58 + 40 * sw; b = 190 + 50 * sw
            if v < .34:                                                               # belly: lavender
                k = min(1, (.34 - v) / .08); r = r + (170 - r) * k; g = g + (150 - g) * k; b = b + (235 - b) * k
            px[i, j] = (int(r), int(g), int(b))
    neb = Image.new('RGB', (w, h), (0, 0, 0)); d = ImageDraw.Draw(neb)
    for _ in range(14):
        x, y = rnd.uniform(0, w), rnd.uniform(0, h * .62); rr = rnd.uniform(30, 70)
        col = rnd.choice([(255, 90, 170), (90, 160, 255), (160, 90, 255)])
        d.ellipse((x - rr, y - rr * .6, x + rr, y + rr * .6), fill=col)
    neb = neb.filter(ImageFilter.GaussianBlur(26))
    im = Image.blend(im, Image.eval(neb, lambda c: c), .0)
    im = Image.composite(im, im, Image.new('L', (w, h), 255))
    base = im.load(); nb = neb.load()
    for j in range(h):
        for i in range(w):
            r, g, b = base[i, j]; nr, ng, nbb = nb[i, j]
            base[i, j] = (min(255, r + nr // 2), min(255, g + ng // 3), min(255, b + nbb // 2))
    d = ImageDraw.Draw(im)
    for _ in range(260):
        x, y = rnd.uniform(0, w), rnd.uniform(0, h * .66); rr = rnd.choice([1.5, 1.5, 2, 2.5, 3.5])
        d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=(255, 255, 255) if rr < 2 else (255, 240, 200))
    for _ in range(6):   # a few sparkles
        x, y = rnd.uniform(0, w), rnd.uniform(10, h * .6)
        d.line((x - 6, y, x + 6, y), fill=(255, 255, 255), width=1); d.line((x, y - 6, x, y + 6), fill=(255, 255, 255), width=1)
    return im


# ---------------- the buddies ----------------
def build_penguin():
    """turn_penguin.png: navy egg lofted from the silhouette, white face+belly patch PAINTED (two lobes around the eyes, navy hood between),
    glossy black eyes, short orange beak + big 3-toed feet, flippers hanging at the sides, 3 head feathers, tail bump"""
    NAVY, W, OR = '#2f4a86', '#f8f9ff', '#ff9a2e'
    fr = TP.profile('penguin', 'front', skip=[(.18, .46), (.94, 1.1)], top=.96, bottom=.07)
    sd = TP.profile('penguin', 'side', skip=[(.07, .12, 'r'), (.44, .60, 'r'), (.94, 1.1)], top=.96, bottom=.07)
    L = TP.Loft(fr, sd); body = TP.loft_bm(L, seg=128)
    S = Surface(body)
    def tex(X, Y, Z, F):
        img = TP.fill(X.shape, NAVY)
        m = (F > .1) & (TP.ell(X, Z, 0, .34, .27, .26) | TP.ell(X, Z, -.145, .59, .155, .17) | TP.ell(X, Z, .145, .59, .155, .17))
        m &= ~((Z > .60) & (np.abs(X) < (Z - .60) * .9 + .01))
        return TP.put(img, m, W)
    part('body', body, '#ffffff', role='body', ink=.014, rough=.3, cc=.7, tex=TP.paint(L, tex), nrm=tile_nrm('feathers', 1.0), ns=.2)
    eyes_dot(S, .15, .56, .05, .07)
    blush(S, .26, .47, .045, .028)
    yf = L.at(.51)[3] - L.at(.51)[2]
    beak = spike_bm(Vector((0, yf + .03, .525)), (0, -1, .15), r=.065, h=.095, seg=16)          # short wide beak, open a little
    bm_merge(beak, spike_bm(Vector((0, yf + .03, .49)), (0, -1, -.3), r=.055, h=.08, seg=16))
    part('beak', beak, OR, role='beak', ink=.01)
    part('tuft', tuft_bm((0, .0, .95), n=3, h=.06, r=.022, spread=.6), NAVY, role='horn', ink=.009)
    for sx in (-1, 1):
        sd_ = 'L' if sx < 0 else 'R'
        piv = Vector((sx * .33, .0, .46))
        w = ellipsoid_bm(.05, .09, .12, at=(0, 0, -.11), seg=20, rings=14)
        bmesh.ops.transform(w, matrix=Matrix.Translation(piv) @ Matrix.Rotation(sx * -.22, 4, 'Y'), verts=w.verts)
        part('wing' + sd_, w, NAVY, role='wing' + sd_, ink=.011, pivot=tuple(piv))
    feet = bmesh.new()
    for sx in (-1, 1): bm_merge(feet, foot_bm((sx * .17, .07, .035), sx, s=1.15))
    part('feet', feet, OR, role='feet', ink=.01)
    part('tailBump', ellipsoid_bm(.045, .06, .035, at=(0, L.at(.15)[3] + L.at(.15)[2] - .02, .15), seg=16, rings=12), NAVY, role='tail', ink=.009, pivot=(0, .3, .15))


def build_firefly():
    """turn_firefly.png: navy ball head over a glowing yellow-green belly ball (sizes from the silhouette), huge white eyes, open mouth, blush,
    curly antennae leaning forward, two oval see-through wings standing up behind, stub arms"""
    DB, GL = '#2e3c7a', '#e2ff4a'
    fr = TP.profile('firefly', 'front', skip=[(0, .39), (.39, 1.1)], add=[(.12, 0, 0), (.18, -.17, .17), (.25, -.27, .27), (.32, -.33, .33), (.40, -.37, .37), (.50, -.36, .36), (.60, -.33, .33), (.70, -.26, .26)], top=.78, bottom=.12)
    sd = TP.profile('firefly', 'side', skip=[(0, .25), (.78, 1.1), (.43, .78, 'l')], add=[(.12, 0, 0), (.18, -.15, .16), (.50, -.27, None), (.60, -.26, None), (.70, -.21, None)], top=.78, bottom=.12)
    head = TP.loft_bm(fr, sd, seg=128)
    S = Surface(head)
    part('head', head, DB, role='body', ink=.013)
    bulb = ellipsoid_bm(.29, .25, .22, at=(0, .0, .22), seg=80, rings=44)
    part('bulb', bulb, GL, role='glow', ink=.012, rough=.15, cc=1, emis='#d8ff2a', ei=1.0)
    eyes_open(S, .145, .51, .105, .135, rim=.017, tilt=.2)
    mouth_open(S, 0, .41, .05, .04)
    blush(S, .24, .385, .035, .025)
    ant = bmesh.new()
    for sx in (-1, 1):
        base = Vector((sx * .05, -.03, .765))
        stem = [base, base + Vector((sx * .04, -.03, .05)), base + Vector((sx * .10, -.07, .09)), base + Vector((sx * .165, -.10, .10))]
        curl = curl_pts(stem[-1], Vector((sx, 0, 0)), 1., .075, .035, turns=1.0, n=16)
        pts = smooth_path(stem, 4)[:-1] + curl
        bm_merge(ant, tube_bm(pts, radii(.016, .011, len(pts)), seg=8))
    part('antennae', ant, DB, role='horn', ink=.008)
    for sx in (-1, 1):
        sd_ = 'L' if sx < 0 else 'R'
        # long oval wing rising up-back-out from the head's side (turnaround side view: the wing points to the top-back corner).
        # orientation found by matching the wing's bounding boxes in the front + side views (d = long axis, wv = width axis)
        d = Vector((sx * .423, .582, .695)); wv = Vector((sx * -.543, -.451, .708)); n = d.cross(wv)
        M = Matrix((d, wv, n)).transposed().to_4x4()
        w = ellipsoid_bm(.22, .11, .012, seg=28, rings=16)
        piv = Vector((sx * .28, .12, .44))
        bmesh.ops.transform(w, matrix=Matrix.Translation(piv + d * .22) @ M, verts=w.verts)
        part('wing' + sd_, w, '#f4faff', role='wing' + sd_, ink=.008, rough=.1, cc=1, opacity=.9, emis='#dff0ff', ei=.7, pivot=tuple(piv))
    arms = bmesh.new()
    for sx in (-1, 1): bm_merge(arms, ellipsoid_bm(.055, .05, .065, at=(sx * .35, -.05, .31), seg=16, rings=12, rot=Matrix.Rotation(sx * -.4, 3, 'Y')))
    part('arms', arms, DB, role='arms', ink=.009)


def _ccw(pts):
    area = sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
    return pts if area > 0 else list(reversed(pts))


KIT_EAR = [(-.04, .76), (-.14, .88), (-.222, .955), (-.243, .985), (-.263, 1.0), (-.287, .998), (-.305, .985), (-.316, .965),
           (-.33, .92), (-.337, .86), (-.332, .80), (-.32, .74), (-.30, .68)]                       # left ear, from the turnaround (x, z)
KIT_EAR_IN = [(-.09, .78), (-.165, .87), (-.225, .945), (-.255, .965), (-.275, .962), (-.29, .945), (-.295, .90), (-.295, .84), (-.288, .78), (-.27, .73)]


def build_kitten():
    """turn_kitten.png: orange cat egg lofted from the silhouette. Cream mask (around the eyes + muzzle) and belly PAINTED in the
    texture, huge white eyes with a thick top-outer 'eyeliner', pink nose, open happy mouth, long whiskers past the cheeks,
    big FLAT triangular ears with pink inside, paws low on the belly (z .27), feet, thick curly tail with a cream tip"""
    OR, CR, PK = '#ff9d2e', '#fff0cf', '#ff86b0'
    fr = TP.profile('kitten', 'front', skip=[(.74, 1.1)], top=.93, bottom=.05)
    sd = TP.profile('kitten', 'side', skip=[(.05, .16, 'r'), (.36, .52, 'r'), (.14, .50, 'l')], add=[(.30, -.285, .35), (.20, -.255, .33)], top=.93, bottom=.05)
    L = TP.Loft(fr, sd); body = TP.loft_bm(L, seg=128)
    S = Surface(body)
    def tex(X, Y, Z, F):
        img = TP.fill(X.shape, OR)
        m = (F > .3) & (TP.ell(X, Z, 0, .52, .31, .19) | TP.ell(X, Z, 0, .58, .22, .12) | TP.ell(X, Z, 0, .20, .235, .19))
        return TP.put(img, m, CR)
    part('body', body, '#ffffff', role='body', ink=.014, tex=TP.paint(L, tex), nrm=tile_nrm('fur', 1.0), ns=.3)
    eyes_open(S, .145, .60, .095, .13, rim=.03, tilt=.1, off=.6, up=.5)
    part('nose', S.decal(lambda u, v: abs(u) <= .6 * (v + 1.05) and v <= .75, 0, .535, .035, .025, bulge=.012, lift=.015), PK, role='mouth', ink=0, rough=.3, cc=.6)
    mouth_open(S, 0, .475, .05, .032)
    wh = bmesh.new()
    for sx in (-1, 1):
        for z0, dz in ((.505, .035), (.47, 0), (.44, -.04)):
            P = []
            for f, x in ((0, .13), (.4, .21), (.75, .275)):
                loc, nrm = S.hit(sx * x, z0 + dz * f)
                if loc is None: continue
                P.append(loc + nrm * (.008 + .012 * f))
            if len(P) < 2: continue
            P.append(Vector((sx * .37, P[-1].y - .01, z0 + dz)))
            bm_merge(wh, tube_bm(smooth_path(P, 4), radii(.0085, .005, len(smooth_path(P, 4))), seg=6))
    part('whiskers', wh, '#2a2440', role='part', ink=0, rough=.5)
    ears = bmesh.new(); inner = bmesh.new()
    for sx in (-1, 1):
        e = slab_bm(_ccw([(sx * -x, z) for x, z in KIT_EAR]), thick=.075, bevel=.02, cuts=4)
        bmesh.ops.translate(e, vec=(0, -.03, 0), verts=e.verts); bm_merge(ears, e)
        i = slab_bm(_ccw([(sx * -x, z) for x, z in KIT_EAR_IN]), thick=.02, bevel=.006, cuts=3)
        bmesh.ops.translate(i, vec=(0, -.0625, 0), verts=i.verts); bm_merge(inner, i)
    part('ears', ears, OR, role='horn', ink=.011)
    part('earsIn', inner, PK, role='horn', ink=0, rough=.4)
    paws = bmesh.new()
    for sx in (-1, 1):
        a, cx, b, cy = L.at(.27); bm_merge(paws, ellipsoid_bm(.085, .075, .08, at=(sx * .21, cy - b * .92, .27), seg=20, rings=14))
    part('paws', paws, OR, role='arms', ink=.011)
    feet = bmesh.new()
    for sx in (-1, 1): bm_merge(feet, ellipsoid_bm(.085, .10, .045, at=(sx * .165, L.at(.08)[3] - L.at(.08)[2] * .5, .045), seg=18, rings=12))
    part('feet', feet, OR, role='feet', ink=.01)
    pts = smooth_path([Vector((-.03, .17, .19)), Vector((-.06, .28, .20)), Vector((-.07, .345, .27)), Vector((-.065, .345, .34)), Vector((-.06, .31, .39))], 5)
    part('tail', tube_bm(pts, radii(.065, .05, len(pts)), seg=14), OR, role='tail', ink=.011, pivot=(-.03, .17, .19))
    part('tailTip', ellipsoid_bm(.062, .062, .062, at=tuple(pts[-1]), seg=18, rings=14), CR, role='tail', ink=.01, pivot=(-.03, .17, .19))


def build_octopus():
    """turn_octopus.png: pink-magenta head lofted from the silhouette, huge white eyes, small open mouth, deep-pink blush,
    8 chunky tentacles going down then curling up and out"""
    PP = '#d95fd8'
    fr = TP.profile('octopus', 'front', skip=[(0, .38)], add=[(.30, -.30, .30), (.24, -.21, .21), (.20, 0, 0)], bottom=.20)
    sd = TP.profile('octopus', 'side', skip=[(0, .38)], add=[(.30, -.28, .29), (.24, -.19, .20), (.20, 0, 0)], bottom=.20)
    head = TP.loft_bm(fr, sd, seg=128)
    S = Surface(head)
    part('head', head, PP, role='body', ink=.014)
    eyes_open(S, .17, .605, .105, .14, rim=.018, tilt=.15)
    mouth_open(S, 0, .49, .05, .04)
    blush(S, .25, .46, .035, .035, col='#ff5fa6', op=.8)
    tent = bmesh.new()
    for k in range(8):
        a = (k + .5) / 8 * math.tau; d = Vector((math.sin(a), math.cos(a), 0))
        ctrl = [(.17, .34), (.19, .18), (.20, .08), (.23, .02), (.30, .03), (.39, .10), (.45, .20), (.44, .29), (.38, .31), (.34, .27)]
        pts = smooth_path([d * r + Vector((0, 0, z)) for r, z in ctrl], 8)
        bm_merge(tent, tube_bm(pts, radii(.10, .04, len(pts)), seg=24))
    for v in tent.verts: v.co.y = v.co.y * .85 - .04                                   # the side view is a little flatter
    part('tentacles', tent, PP, role='part', ink=.012)


def build_cloudy():
    """turn_cloudy.png: a cloud of round white puffs placed to match the silhouette (big puff on top, two wide ones at the sides,
    a flat bottom), huge white eyes on the face puff, small open mouth, blush"""
    W = '#fcfcff'
    cl = bmesh.new()
    for x, y, z, r, ry, rz in [(0, -.08, .45, .33, .30, .26), (0, .06, .74, .27, .22, .27), (-.32, .0, .37, .235, .25, .235), (.32, .0, .37, .235, .25, .235), (-.29, -.03, .58, .19, .17, .19), (.29, -.03, .58, .19, .17, .19),
                               (0, .14, .36, .25, .25, .25), (0, .16, .58, .20, .18, .20), (-.21, .12, .50, .19, .18, .19), (.21, .12, .50, .19, .18, .19), (0, 0, .18, .25, .24, .19)]:
        bm_merge(cl, ellipsoid_bm(r, ry, rz, at=(x, y, z), seg=56, rings=32))
    for v in cl.verts:
        if v.co.z < .04: v.co.z = .04 + (v.co.z - .04) * .1
    S = Surface(cl)
    uv_equirect(cl); part('body', cl, W, role='body', ink=.013, rough=.45, cc=.35, emis='#ffffff', ei=.1, nrm=tile_nrm('puffs', 1.0), ns=.25)
    eyes_open(S, .265, .58, .11, .10, rim=.016, tilt=.12)
    mouth_open(S, 0, .39, .06, .045)
    blush(S, .40, .44, .05, .03)


def build_monkey():
    """turn_monkey.png: brown pear body lofted from the silhouette (muzzle bulges forward), tan face + belly PAINTED, huge white eyes,
    big round ears tilted forward with tan inside, 3 hairs, stub arms, feet, curly tail at the back"""
    BR, TAN = '#9a5b2e', '#f3cd98'
    fr = TP.profile('monkey', 'front', skip=[(.22, .40), (.54, .92)], add=[(.70, -.30, .30), (.80, -.23, .23)], top=.90, bottom=.05)
    sd = TP.profile('monkey', 'side', skip=[(.05, .16, 'r'), (.05, .40, 'l'), (.86, 1.1)], add=[(.20, -.27, .31)], top=.90, bottom=.05)
    L = TP.Loft(fr, sd); body = TP.loft_bm(L, seg=128)
    S = Surface(body)
    def tex(X, Y, Z, F):
        img = TP.fill(X.shape, BR)
        face = (F > .2) & (TP.ell(X, Z, -.16, .61, .17, .16) | TP.ell(X, Z, .16, .61, .17, .16) | TP.ell(X, Z, 0, .48, .24, .12))
        belly = (F > .3) & TP.ell(X, Z, 0, .24, .195, .145)
        return TP.put(img, face | belly, TAN)
    part('body', body, '#ffffff', role='body', ink=.014, tex=TP.paint(L, tex), nrm=tile_nrm('fur', 1.0), ns=.3)
    eyes_open(S, .145, .57, .10, .12, rim=.018, tilt=.1)
    mouth_open(S, 0, .49, .045, .045)
    ears = bmesh.new(); inner = bmesh.new()
    for sx in (-1, 1):
        R = Matrix.Rotation(sx * -.45, 3, 'Z')
        bm_merge(ears, ellipsoid_bm(.135, .06, .135, at=(sx * .37, .02, .695), seg=28, rings=18, rot=R))
        bm_merge(inner, ellipsoid_bm(.09, .04, .10, at=(sx * .37 - sx * .02, -.03, .695), seg=20, rings=12, rot=R))
    part('ears', ears, BR, role='horn', ink=.011)
    part('earsIn', inner, TAN, role='horn', ink=0)
    tf = tuft_bm((.02, -.08, .89), n=3, h=.10, r=.028, spread=.6, back=-.14)
    part('tuft', tf, BR, role='horn', ink=.009)
    arms = bmesh.new()
    for sx in (-1, 1): bm_merge(arms, ellipsoid_bm(.05, .055, .07, at=(sx * .375, -.02, .31), seg=16, rings=12, rot=Matrix.Rotation(sx * -.25, 3, 'Y')))
    part('arms', arms, BR, role='arms', ink=.01)
    feet = bmesh.new()
    for sx in (-1, 1): bm_merge(feet, ellipsoid_bm(.09, .12, .045, at=(sx * .14, L.at(.08)[3] - L.at(.08)[2] * .55, .045), seg=18, rings=12))
    part('feet', feet, BR, role='feet', ink=.01)
    yb = L.at(.25)[3] + L.at(.25)[2]
    pts = smooth_path([Vector((0, yb - .03, .18)), Vector((.0, yb + .05, .20)), Vector((.0, yb + .09, .30)), Vector((0, yb + .04, .38)), Vector((0, yb - .02, .33))], 5)
    part('tail', tube_bm(pts, radii(.045, .03, len(pts)), seg=12), BR, role='tail', ink=.01, pivot=(0, yb - .03, .18))


def build_bunny():
    ICE, DEEP = '#bfe6ff', '#7cc8ff'
    fr = TP.profile('bunny', 'front', skip=[(.14, .36, 'lr'), (.62, 1.1)], add=[(.16, -.255, .255), (.22, -.265, .265), (.28, -.26, .26)], top=.66, bottom=.07)
    sd = TP.profile('bunny', 'side', skip=[(.16, .30, 'l'), (.42, .56, 'l'), (.26, .55, 'r'), (.62, 1.1)],
                    add=[(.23, -.21, None), (.49, -.185, None), (.33, None, .235), (.42, None, .235)], top=.66, bottom=.07)
    L = TP.Loft(fr, sd); body = TP.loft_bm(L, seg=128)
    S = Surface(body)
    part('body', body, ICE, role='body', ink=.013, rough=.05, cc=1, emis='#9fd8ff', ei=.08, nrm=tile_nrm('crystal', 1.2), ns=.45)
    eyes_open(S, .12, .385, .105, .15, rim=.014, tilt=.15)
    mouth_open(S, 0, .345, .04, .028)
    blush(S, .185, .32, .04, .03, col='#ffb3d9', op=.7)
    ears = bmesh.new()
    EARP = ((0, 0), (.47, .12), (.6, .25), (.75, .38), (.85, .5), (.92, .62), (.8, .75), (.6, .88), (0, 1))
    for sx in (-1, 1):
        g = gem_bm(.095, .45, 6, prof=EARP)
        M = Matrix.Translation((sx * .172, -.05, .60)) @ Matrix.Rotation(-.48, 4, 'X') @ Matrix.Diagonal((1, 1.2, 1, 1))
        bmesh.ops.transform(g, matrix=M, verts=g.verts); bm_merge(ears, g)
    part('ears', ears, DEEP, role='horn', ink=.011, rough=.04, cc=1, emis='#8fd6ff', ei=.3)
    paws = bmesh.new(); feet = bmesh.new()
    for sx in (-1, 1):
        a, cx, b, cy = L.at(.27); bm_merge(paws, ellipsoid_bm(.065, .06, .10, at=(sx * .225, cy - b + .03, .25), seg=20, rings=14))
        bm_merge(feet, ellipsoid_bm(.075, .13, .05, at=(sx * .155, -.02, .048), seg=18, rings=12))
    part('paws', paws, ICE, role='arms', ink=.011, rough=.05, cc=1, emis='#9fd8ff', ei=.06)
    part('feet', feet, ICE, role='feet', ink=.01, rough=.05, cc=1, emis='#9fd8ff', ei=.06)
    a, cx, b, cy = L.at(.24)
    part('tailBall', ellipsoid_bm(.06, .06, .062, at=(0, cy + b - .005, .24), seg=20, rings=14), ICE, role='tail', ink=.01, rough=.05, cc=1, emis='#bfe8ff', ei=.12, pivot=(0, cy + b - .03, .24))
    sh = bmesh.new()
    for x, z, h, r in [(0, .44, .13, .042), (-.085, .43, .10, .036), (.085, .43, .10, .036), (-.14, .42, .08, .03), (.14, .42, .08, .03)]:
        a, cx, b, cy = L.at(z); g = gem_bm(r, h, 6)
        M = Matrix.Translation((x, cy + b - .03, z)) @ Matrix.Rotation(-.35, 4, 'X') @ Matrix.Rotation(x * 1.5, 4, 'Y')
        bmesh.ops.transform(g, matrix=M, verts=g.verts); bm_merge(sh, g)
    part('shards', sh, DEEP, role='horn', ink=.009, rough=.04, cc=1, emis='#8fd6ff', ei=.25)


def build_phoenix():
    OR, RD, YL = '#ff8a1f', '#ff3b2f', '#ffd63b'
    fr = TP.profile('phoenix', 'front', skip=[(.32, .72, 'lr'), (.72, 1.1)], add=[(.40, -.33, .33), (.50, -.325, .325), (.60, -.30, .30), (.68, -.25, .25)], top=.74, bottom=.09)
    sd = TP.profile('phoenix', 'side', skip=[(.06, .72, 'l'), (.33, .50, 'r'), (.72, 1.1)],
                    add=[(.12, -.20, None), (.20, -.26, None), (.28, -.275, None), (.36, -.25, None), (.45, -.215, None), (.55, -.20, None), (.65, -.19, None), (.42, None, .34)], top=.74, bottom=.09)
    L = TP.Loft(fr, sd); body = TP.loft_bm(L, seg=128)
    S = Surface(body)
    def tex(X, Y, Z, F):
        k = np.clip((Z - .18) / .32, 0, 1); k = (k * k * (3 - 2 * k))[..., None]
        return (TP.rgb(RD) * (1 - k) + TP.rgb(OR) * k).astype(np.uint8)
    part('body', body, '#ffffff', role='body', ink=.014, rough=.3, cc=.7, tex=TP.paint(L, tex))
    eyes_open(S, .145, .45, .09, .125, rim=.02, tilt=.12)
    a, cx, b, cy = L.at(.415)
    part('beak', spike_bm(Vector((0, cy - b + .02, .415)), (0, -1, -.2), r=.06, h=.06, seg=14), YL, role='mouth', ink=.008, rough=.35)
    mouth_open(S, 0, .365, .045, .03)
    feet = bmesh.new()
    for sx in (-1, 1): bm_merge(feet, foot_bm((sx * .13, -.03, .04), s=1.0))
    part('feet', feet, '#ffb020', role='feet', ink=.009, rough=.35)
    crest = {c: bmesh.new() for c in (RD, OR, YL)}
    for x, y, h, rot in [(0, -.04, .30, Matrix.Rotation(.15, 3, 'X')), (-.06, -.034, .17, Matrix.Rotation(-.40, 3, 'Y')), (.06, -.046, .17, Matrix.Rotation(.40, 3, 'Y')),
                         (0, -.10, .20, Matrix.Rotation(.40, 3, 'X')), (0, .03, .19, Matrix.Rotation(-.15, 3, 'X'))]:
        for s, col in flame_bm(.18 if h > .25 else .14, h, (x, y, .70), rot=rot): bm_merge(crest[col], s)
    for i, col in enumerate((RD, OR, YL)): part('crest' + str(i), crest[col], col, role='horn', ink=.009, rough=.3, emis=col, ei=.2)
    for sx in (-1, 1):
        sd_ = 'L' if sx < 0 else 'R'; wg = {c: bmesh.new() for c in (RD, OR, YL)}; piv = (sx * .26, .06, .50)
        for lean, h, w, dy in [(2.45, .23, .17, .012), (1.90, .20, .16, .006), (1.40, .20, .17, 0.), (.68, .27, .16, -.012)]:
            rot = Matrix.Rotation(sx * .35, 3, 'Z') @ Matrix.Rotation(sx * lean, 3, 'Y')
            for s, col in flame_bm(w, h, (piv[0], piv[1] + dy, piv[2]), rot=rot, shape=feather): bm_merge(wg[col], s)
        for i, col in enumerate((RD, OR, YL)): part('wing' + sd_ + str(i), wg[col], col, role='wing' + sd_, ink=.009, rough=.3, emis=col, ei=.2, pivot=piv)
    tail = {c: bmesh.new() for c in (RD, OR, YL)}
    a, cx, b, cy = L.at(.12); piv = (0, cy + b - .02, .11)
    for x, y, h, rot in [(0, 0, .28, Matrix.Rotation(-.62, 3, 'X')), (-.07, .006, .23, Matrix.Rotation(-.72, 3, 'X') @ Matrix.Rotation(-.45, 3, 'Y')),
                         (.07, -.006, .23, Matrix.Rotation(-.72, 3, 'X') @ Matrix.Rotation(.45, 3, 'Y'))]:
        for s, col in flame_bm(.15, h, (x, piv[1] + y, piv[2]), rot=rot, shape=feather): bm_merge(tail[col], s)
    for i, col in enumerate((RD, OR, YL)): part('tail' + str(i), tail[col], col, role='tail', ink=.009, rough=.3, emis=col, ei=.2, pivot=piv)


def build_robodog():
    WH, GR, CY, DK = '#f4f5f8', '#8d9099', '#5ff5ff', '#2b2b33'
    head = ellipsoid_bm(.27, .225, .20, at=(0, -.04, .665), seg=64, rings=40); uv_equirect(head)
    S = Surface(head)
    part('head', head, WH, role='body', ink=.014, rough=.3, cc=.8, nrm=tile_nrm('panels', 1.2, reps=(2, 1)), ns=.35)
    part('visor', S.decal(lambda u, v: abs(u) ** 3 + abs(v) ** 3 <= 1, 0, .655, .14, .095, bulge=.012, lift=.004), DK, role='part', ink=0, rough=.25, cc=.9)
    for sx in (-1, 1):
        sd_ = 'L' if sx < 0 else 'R'
        part('eye' + sd_, S.decal(ELLIPSE, sx * .115, .615, .052, .068, bulge=.01, lift=.02), CY, role='eye', ink=0, rough=.2, cc=.6, emis=CY, ei=.9, pivot=(sx * .115, -.4, .615))
    muz = ellipsoid_bm(.15, .10, .095, at=(0, -.19, .545), seg=40, rings=24); SM = Surface(muz)
    part('muzzle', muz, WH, role='body', ink=.012, rough=.3, cc=.8)
    part('nose', ellipsoid_bm(.032, .026, .022, at=(0, -.28, .565), seg=16, rings=10), DK, role='mouth', ink=0, rough=.2, cc=.8)
    mouth_open(SM, 0, .495, .045, .028)
    ears = bmesh.new()
    for sx in (-1, 1):
        rot = Matrix.Rotation(sx * .25, 3, 'Z') @ Matrix.Rotation(-sx * .22, 3, 'Y')
        bm_merge(ears, wing_slab(paddle(.15, .33), (sx * .235, .0, .81), rot, thick=.055, bevel=.014))
    part('ears', ears, GR, role='part', ink=.011, rough=.4, cc=.5)
    part('antenna', tube_bm([Vector((0, -.04, .84)), Vector((0, -.04, .95))], [.012, .012], seg=10), '#555a66', role='part', ink=0, rough=.4, metal=.3)
    part('antBase', ellipsoid_bm(.038, .038, .02, at=(0, -.04, .858), seg=16, rings=8), GR, role='part', ink=.008, rough=.4)
    part('antBall', ellipsoid_bm(.038, .038, .038, at=(0, -.04, .962), seg=20, rings=14), CY, role='glow', ink=0, rough=.2, cc=.6, emis=CY, ei=.9)
    part('collar', ellipsoid_bm(.16, .18, .03, at=(0, -.01, .447), seg=48, rings=10), GR, role='part', ink=.009, rough=.4)
    body = ellipsoid_bm(.16, .185, .17, at=(0, -.01, .30), seg=56, rings=32); uv_equirect(body); SB = Surface(body)
    part('body', body, WH, role='body', ink=.014, rough=.3, cc=.8, nrm=tile_nrm('panels', 1.2, reps=(2, 1)), ns=.3)
    part('chestRing', SB.decal(ELLIPSE, 0, .265, .045, .045, bulge=.006, lift=.004), GR, role='part', ink=0, rough=.4)
    part('chest', SB.decal(ELLIPSE, 0, .265, .032, .032, bulge=.008, lift=.012), CY, role='glow', ink=0, rough=.2, emis=CY, ei=.9)
    legs = bmesh.new(); paws = bmesh.new(); joints = bmesh.new()
    for sx in (-1, 1):
        bm_merge(legs, tube_bm([Vector((sx * .14, -.12, .30)), Vector((sx * .15, -.12, .08))], [.08, .074], seg=18))
        bm_merge(legs, tube_bm([Vector((sx * .135, .09, .28)), Vector((sx * .145, .09, .08))], [.06, .056], seg=18))
        bm_merge(paws, ellipsoid_bm(.095, .095, .045, at=(sx * .155, -.13, .045), seg=18, rings=12))
        bm_merge(paws, ellipsoid_bm(.075, .08, .04, at=(sx * .15, .08, .04), seg=18, rings=12))
        bm_merge(joints, ellipsoid_bm(.025, .045, .045, at=(sx * .185, -.12, .28), seg=12, rings=10))
    part('legs', legs, WH, role='feet', ink=.011, rough=.3, cc=.7)
    part('paws', paws, GR, role='feet', ink=.01, rough=.4)
    part('joints', joints, GR, role='part', ink=.008, rough=.4)
    base = Vector((0, .14, .30)); d = Vector((0, .85, .53)).normalized(); ex = Vector((1, 0, 0)); ez = d.cross(ex).normalized()
    pts = [base + d * (.14 * t) + (ex * math.cos(t * math.tau * 3.5) + ez * math.sin(t * math.tau * 3.5)) * .028 for t in np.linspace(0, 1, 56)]
    part('tail', tube_bm(pts, [.011] * len(pts), seg=8), '#555a66', role='tail', ink=0, rough=.4, metal=.3, pivot=tuple(base))
    part('tailBall', ellipsoid_bm(.045, .045, .045, at=tuple(base + d * .165), seg=18, rings=12), GR, role='tail', ink=.009, rough=.4, pivot=tuple(base))


def build_whale():
    PU = '#5a3ad8'
    fr = TP.profile('whale', 'front', skip=[(.08, .33, 'lr'), (.82, 1.1)], add=[(.10, -.28, .28), (.17, -.345, .345), (.24, -.385, .385), (.30, -.405, .405)] + ROUND0_F, top=.83, bottom=0.)
    sd = TP.profile('whale', 'side', skip=[(.33, .48, 'l'), (.82, 1.1)], add=[(.40, -.28, None), (0, .069, .071), (.01, -.04, .18), (.02, -.075, .215), (.035, -.10, .24)], top=.83, bottom=0.)
    L = TP.Loft(fr, sd); body = TP.loft_bm(L, seg=128)
    S = Surface(body)
    W, H = 1024, 512
    tile = Image.open(os.path.join(NRM_DIR, 'tex_galaxy.png')).convert('RGB').resize((512, 512), Image.LANCZOS)
    base = Image.new('RGB', (W, H)); base.paste(tile, (0, 0)); base.paste(tile, (512, 0))
    img = np.asarray(base, dtype=np.float32)
    U = (np.arange(W) + .5) / W; V = 1 - (np.arange(H) + .5) / H; UU, VV = np.meshgrid(U, V); X, Y, Z, F = L.xyz(UU, VV)
    def core(cx, cz, rx, rz, side, k):
        d = ((X - cx) / rx) ** 2 + ((Z - cz) / rz) ** 2; g = np.exp(-d * 2.2) * np.clip(side, 0, 1)
        return (g * k)[..., None]
    glow = core(0, .30, .22, .16, (F - .25) * 2, .9) + core(0, .46, .24, .18, (-F - .25) * 2, .7)
    img = img * (1 - glow) + np.array([255, 236, 255], np.float32) * glow
    part('body', body, '#ffffff', role='body', ink=.014, rough=.22, cc=.9, emis='#4a2cb8', ei=.18, tex=Image.fromarray(img.clip(0, 255).astype(np.uint8)))
    eyes_open(S, .18, .48, .11, .15, rim=.02, tilt=.12)
    mouth_open(S, 0, .40, .05, .035)
    blush(S, .28, .35, .05, .04, col='#ff9ad5', op=.8)
    for sx in (-1, 1):
        sd_ = 'L' if sx < 0 else 'R'; piv = (sx * .28, -.12, .27); d = Vector((sx * .65, -.35, -.70)).normalized()
        f = ellipsoid_bm(.15, .04, .075, at=tuple(Vector(piv) + d * .10), seg=28, rings=16, rot=aim(d))
        part('fin' + sd_, f, PU, role='wing' + sd_, ink=.011, rough=.3, cc=.7, pivot=piv)
    a, cx, b, cy = L.at(.13); fl = bmesh.new(); piv = (0, cy + b - .02, .16)
    for sx in (-1, 1):
        rot = Matrix.Rotation(-.8, 3, 'X') @ Matrix.Rotation(sx * .4, 3, 'Y')
        bm_merge(fl, ellipsoid_bm(.05, .025, .06, at=(sx * .05, cy + b - .005, .13), seg=24, rings=14, rot=rot))
    part('tail', fl, PU, role='tail', ink=.011, rough=.3, cc=.7, pivot=piv)
    sp = ellipsoid_bm(.045, .045, .04, at=(0, -.04, .81), seg=18, rings=12)
    for sx in (-1, 1):
        pts = [Vector((0, -.04, .80)), Vector((sx * .05, -.06, .87)), Vector((sx * .10, -.08, .935))]
        bm_merge(sp, tube_bm(pts, [.03, .04, .055], seg=14))
        bm_merge(sp, ellipsoid_bm(.06, .068, .062, at=(sx * .11, -.09, .938), seg=20, rings=14))
    part('spout', sp, PU, role='horn', ink=.01, rough=.3, cc=.7, emis='#4a2cb8', ei=.2)


def build_griffin():
    YL, CR, BL, BR = '#ffd93d', '#fff1c4', '#1e6fff', '#c98a2e'
    fr = TP.profile('griffin', 'front', skip=[(.33, .80, 'lr'), (.78, 1.1)],
                    add=[(.40, -.335, .335), (.48, -.325, .325), (.56, -.30, .30), (.64, -.26, .26), (.70, -.21, .21), (.74, -.15, .15)] + ROUND0_F, top=.77, bottom=0.)
    sd = TP.profile('griffin', 'side', skip=[(.06, .36, 'l'), (.36, .46, 'r'), (.78, 1.1)],
                    add=[(.12, -.215, None), (.20, -.23, None), (.28, -.24, None), (.41, None, .345), (0, .034, .036), (.01, -.07, .14), (.02, -.10, .17), (.035, -.115, .19)], top=.77, bottom=0.)
    L = TP.Loft(fr, sd); body = TP.loft_bm(L, seg=128)
    S = Surface(body)
    part('body', body, YL, role='body', ink=.014, rough=.3, cc=.7)
    eyes_open(S, .15, .44, .10, .125, rim=.02, tilt=.12)
    a, cx, b, cy = L.at(.405)
    part('beak', spike_bm(Vector((0, cy - b + .02, .405)), (0, -1, -.2), r=.04, h=.05, seg=14), '#ff9a1f', role='mouth', ink=.008, rough=.35)
    mouth_open(S, 0, .345, .05, .03)
    blush(S, .29, .31, .035, .03, col='#ffa347', op=.6)
    for sx in (-1, 1):
        sd_ = 'L' if sx < 0 else 'R'; piv = (sx * .28, .05, .56); wg = bmesh.new()
        sweep = Matrix.Rotation(sx * .30, 3, 'Z')
        for lean, h, w, dy in [(2.55, .22, .15, .016), (2.10, .22, .15, .008), (1.50, .23, .15, 0.), (1.15, .27, .15, -.008), (.80, .29, .15, -.016)]:
            bm_merge(wg, wing_slab(feather(w, h), piv, sweep @ Matrix.Rotation(sx * lean, 3, 'Y'), dy=dy))
        bolt = wing_slab([(u + sx * .08, v - .09) for u, v in bolt_outline(.11, .26)], piv, sweep, dy=-.046, thick=.016, bevel=.004)
        part('wing' + sd_, wg, CR, role='wing' + sd_, ink=.01, rough=.35, cc=.5, pivot=piv)
        part('bolt' + sd_, bolt, BL, role='wing' + sd_, ink=.006, rough=.3, cc=.6, pivot=piv)
    part('crest', slab_at(bolt_outline(.15, .23), (-.01, -.06, .772), thick=.10, bevel=.02, rot=Matrix.Rotation(.12, 3, 'X')), YL, role='horn', ink=.01, rough=.3, cc=.7)
    pts = smooth_path([Vector((0, .17, .10)), Vector((0, .27, .11)), Vector((0, .34, .16)), Vector((0, .355, .22))], 5)
    part('tail', tube_bm(pts, radii(.035, .027, len(pts)), seg=10), YL, role='tail', ink=.009, rough=.35, pivot=(0, .17, .10))
    part('tailTuft', ellipsoid_bm(.055, .05, .09, at=(0, .335, .26), seg=18, rings=12, rot=Matrix.Rotation(.25, 3, 'X')), BR, role='tail', ink=.009, rough=.45, pivot=(0, .17, .10))


PETS_NEW = {'penguin': (build_penguin, dict(height=.55, flt=0)),
            'firefly': (build_firefly, dict(height=.46, flt=1, anim={'wing': [34, .3]})),
            'kitten': (build_kitten, dict(height=.56, flt=0)),
            'octopus': (build_octopus, dict(height=.5, flt=1)),
            'cloudy': (build_cloudy, dict(height=.42, flt=1)),
            'monkey': (build_monkey, dict(height=.56, flt=0)),
            'bunny': (build_bunny, dict(height=.62, flt=0)),
            'phoenix': (build_phoenix, dict(height=.56, flt=1, anim={'wing': [9, .3]})),
            'robodog': (build_robodog, dict(height=.52, flt=0)),
            'whale': (build_whale, dict(height=.5, flt=1, anim={'wing': [3, .25]})),
            'griffin': (build_griffin, dict(height=.6, flt=1, anim={'wing': [7, .35]}))}



def facet(bm):
    """flat shading: every face gets its own vertices (gems, crystals)"""
    bmesh.ops.split_edges(bm, edges=bm.edges[:]); bm.normal_update(); return bm


def gem_bm(r, h, sides=6, prof=((0, 0), (.45, .12), (1, .42), (.92, .72), (.45, .93), (0, 1))):
    """faceted crystal standing on z=0 pointing up (+Z): a lathe with few sides, flat shaded"""
    return facet(lathe_bm([(r * a, h * b) for a, b in prof], seg=sides))


def teardrop(w, h):
    """flame tongue / feather / floppy ear outline in the XZ plane, base at (0,0), tip at (0,h) (h<0 hangs down)"""
    pts = [(0, 0), (.35 * w, .08 * h), (.5 * w, .3 * h), (.42 * w, .55 * h), (.22 * w, .78 * h), (0, h), (-.22 * w, .78 * h), (-.42 * w, .55 * h), (-.5 * w, .3 * h), (-.35 * w, .08 * h)]
    return _ccw(pts)


def slab_at(outline, at, thick=.04, bevel=.012, rot=None, cuts=3):
    """slab_bm placed at `at` with an optional rotation Matrix (applied before the translation)"""
    s = slab_bm(outline, thick=thick, bevel=bevel, cuts=cuts)
    M = Matrix.Translation(at) @ (rot.to_4x4() if rot else Matrix())
    bmesh.ops.transform(s, matrix=M, verts=s.verts); return s


def feather(w, h):
    """plump feather / flame tongue with a rounded tip (w wide, h tall, base at (0,0))"""
    pts = [(0, 0), (.33 * w, .07 * h), (.48 * w, .28 * h), (.5 * w, .5 * h), (.42 * w, .72 * h), (.26 * w, .9 * h), (.1 * w, .99 * h), (0, h),
           (-.1 * w, .99 * h), (-.26 * w, .9 * h), (-.42 * w, .72 * h), (-.5 * w, .5 * h), (-.48 * w, .28 * h), (-.33 * w, .07 * h)]
    return _ccw(pts)

def flame_bm(w, h, at, rot=None, cols=('#ff3b2f', '#ff8a1f', '#ffd63b'), thick=.055, shape=None):
    """three stacked teardrops (or `shape`) red > orange > yellow (like the turnaround flames); returns [(bm, colour)]"""
    out = []; shape = shape or teardrop
    for i, (k, col) in enumerate(zip((1., .74, .46), cols)):
        s = slab_at(shape(w * k, h * k), (0, -.012 * i, 0), thick=thick - .012 * i, bevel=.012, rot=None)
        M = Matrix.Translation(at) @ (rot.to_4x4() if rot else Matrix())
        bmesh.ops.transform(s, matrix=M, verts=s.verts); out.append((s, col))
    return out




def paddle(w, h, n=36):
    """round-topped paddle (dog ear): top at (0,0), hangs to -h, a little wider near the bottom"""
    pts = []
    for i in range(n):
        t = i / n * math.tau; k = (1 - math.cos(t)) / 2
        pts.append((.5 * w * math.sin(t) * (.78 + .32 * k), -h * k))
    return _ccw(pts)


def aim(d):
    """3x3 rotation turning +X into direction d"""
    return Vector((1, 0, 0)).rotation_difference(Vector(d).normalized()).to_matrix()


def wing_slab(outline, pivot, rot, dy=0., thick=.045, bevel=.012):
    s = slab_bm(outline, thick=thick, bevel=bevel, cuts=3)
    M = Matrix.Translation(pivot) @ rot.to_4x4() @ Matrix.Translation((0, dy, 0))
    bmesh.ops.transform(s, matrix=M, verts=s.verts); return s


