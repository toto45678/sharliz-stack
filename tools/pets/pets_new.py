"""The 11 NEW buddies (v61 roster, plan /mnt/project-files/game/buddies-plan.md), built from the brief descriptions
(tools/pets/chatgpt_brief.txt, Part B) in the bee-v2 style: one chunky body + a few parts, painted bodies where it helps.
They get tuned against the ChatGPT turnarounds when those arrive. Imported by pets.py (same helpers, same export)."""
import math, random, sys
# share the helpers AND the META dict of the running pets.py (it may be __main__), never a second copy of the module
_p = sys.modules['__main__'] if getattr(sys.modules['__main__'], '__file__', '').endswith('pets.py') else __import__('pets')
globals().update({k: v for k, v in vars(_p).items() if not k.startswith('__')})
from PIL import Image, ImageDraw, ImageFilter


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


def bolt_outline(s=1., cx=0, cz=0):
    """lightning bolt pointing down, height ~1*s"""
    pts = [(-.06, .5), (.14, .5), (.03, .1), (.17, .1), (-.1, -.5), (-.02, -.08), (-.17, -.08)]
    return [(cx + u * s, cz + v * s) for u, v in pts]


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
    part('body', body, '#ffffff', role='body', ink=.014, rough=.3, cc=.7, tex=TP.paint(L, tex))
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
    part('body', body, '#ffffff', role='body', ink=.014, tex=TP.paint(L, tex))
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
    part('body', cl, W, role='body', ink=.013, rough=.45, cc=.35, emis='#ffffff', ei=.1)
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
    part('body', body, '#ffffff', role='body', ink=.014, tex=TP.paint(L, tex))
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
    """crystal bunny: pale icy-blue glassy body, long crystal ears, small shards on the back, sparkle"""
    ICE, DEEP = '#bfefff', '#5ec4ff'
    body = egg_bm(.8, .76, .8, taper=.14)
    S = Surface(body)
    part('body', body, '#d8f4ff', role='body', ink=.013, rough=.08, cc=1, emis='#9fe4ff', ei=.3)
    eyes_dot(S, .14, .55, .055, .07, col='#1f3f8a')
    mouth_smile(S, 0, .42, .04, .022, r=.01)
    blush(S, .26, .47, .045, .025, col='#ffb3d9')
    ears = bmesh.new()
    for sx in (-1, 1):
        bm_merge(ears, spike_bm(Vector((sx * .14, .02, .74)), (sx * .18, .05, 1), r=.09, h=.42, seg=6))
    part('ears', ears, DEEP, role='horn', ink=.011, rough=.08, cc=1, emis='#5ec4ff', ei=.35)
    sh = bmesh.new()
    for x, y, z, h, tilt in [(0, .3, .5, .2, .6), (-.16, .26, .42, .15, .8), (.17, .25, .4, .14, .8)]:
        bm_merge(sh, spike_bm(Vector((x, y, z)), (x * .4, tilt, 1 - tilt * .3), r=.05, h=h, seg=6))
    part('shards', sh, DEEP, role='horn', ink=.009, rough=.08, cc=1, emis='#5ec4ff', ei=.25)


def build_phoenix():
    """orange-red round bird: flame crest, small flame wings, flame tail feathers, golden beak, glowing"""
    RED, OR, YEL = '#ff5a2a', '#ff9a1e', '#ffd43a'
    body = egg_bm(.84, .8, .85, taper=.1)
    S = Surface(body)
    part('body', body, RED, role='body', ink=.014, emis='#ff4a10', ei=.18)
    part('belly', S.decal(ELLIPSE, 0, .3, .16, .16, bulge=.008, lift=.002), OR, role='body', ink=0, rough=.3, cc=.6, emis='#ff8a20', ei=.2)
    eyes_dot(S, .15, .58, .055, .07)
    blush(S, .29, .47, .05, .03, col='#ffb37a')
    part('beak', spike_bm(Vector((0, -.38, .47)), (0, -1, -.2), r=.055, h=.13, seg=12), YEL, role='beak', ink=.01)
    crest = bmesh.new()
    for x, tilt, h in [(0, 0, .3), (-.1, -.6, .22), (.1, .6, .22)]:
        bm_merge(crest, spike_bm(Vector((x, .02, .8)), (math.sin(tilt) * .8, .15, math.cos(tilt)), r=.07, h=h, seg=10))
    part('crest', crest, YEL, role='horn', ink=.01, emis='#ffd43a', ei=.35)
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        w = slab_bm(flame_wing(sx, span=.3), thick=.03, bevel=.01)
        piv = Vector((sx * .36, .06, .5))
        M = Matrix.Translation(piv) @ Matrix.Rotation(sx * .25, 4, 'Z') @ Matrix.Rotation(sx * -.15, 4, 'Y')
        bmesh.ops.transform(w, matrix=M, verts=w.verts)
        part('wing' + sd, w, OR, role='wing' + sd, ink=.009, emis='#ff8a20', ei=.3, pivot=tuple(piv))
    tail = bmesh.new()
    for x, tilt, h in [(0, 0, .34), (-.1, -.45, .26), (.1, .45, .26)]:
        bm_merge(tail, spike_bm(Vector((x, .3, .32)), (math.sin(tilt) * .6, 1, .5 + abs(tilt) * .2), r=.065, h=h, seg=10))
    part('tail', tail, YEL, role='tail', ink=.01, emis='#ffd43a', ei=.35, pivot=(0, .3, .32))


def build_robodog():
    """white and light-grey rounded robot puppy: floppy metal ears, cyan screen eyes, antenna, springy tail"""
    W, GR, CY, DK = '#f4f6fb', '#b9c2d6', '#38e8ff', '#1b2440'
    body = ellipsoid_bm(.36, .44, .3, at=(0, .08, .4))
    part('body', body, W, role='body', ink=.013, rough=.3, cc=.7, metal=.1)
    head = ellipsoid_bm(.3, .28, .27, at=(0, -.26, .66))
    S = Surface(head)
    part('head', head, W, role='body', ink=.013, rough=.3, cc=.7, metal=.1)
    part('screen', S.decal(lambda u, v: u * u * .6 + v * v <= 1, 0, .67, .22, .11, bulge=.01, lift=.004), DK, role='body', ink=0, rough=.2, cc=1)
    for sx in (-1, 1):
        part('eye' + ('L' if sx < 0 else 'R'), S.decal(ELLIPSE, sx * .09, .68, .05, .055, bulge=.004, lift=.012), CY, role='eye', ink=0, rough=.2, cc=1, emis=CY, ei=1.0, pivot=(sx * .09, -.5, .68))
    part('snout', S.decal(ELLIPSE, 0, .53, .09, .05, bulge=.02, lift=.003), GR, role='body', ink=0, rough=.3, cc=.6, metal=.2)
    part('nose', S.decal(ELLIPSE, 0, .55, .035, .025, bulge=.012, lift=.02), DK, role='mouth', ink=0, rough=.2, cc=1)
    ears = bmesh.new()
    for sx in (-1, 1):
        bm_merge(ears, ellipsoid_bm(.045, .11, .17, at=(sx * .3, -.2, .58), rot=Matrix.Rotation(sx * .15, 3, 'Y')))
    part('ears', ears, GR, role='horn', ink=.01, rough=.3, cc=.6, metal=.3)
    ant = tube_bm([Vector((.08, -.22, .9)), Vector((.1, -.22, 1.02))], [.014, .012], seg=8)
    bm_merge(ant, ellipsoid_bm(.03, .03, .03, at=(.1, -.22, 1.04)))
    part('antenna', ant, GR, role='horn', ink=.008, metal=.3)
    part('antLight', ellipsoid_bm(.018, .018, .018, at=(.1, -.22, 1.04)), '#ff4a4a', role='glow', ink=0, emis='#ff2a2a', ei=1.2)
    legs = bmesh.new()
    for sx in (-1, 1):
        for y in (-.2, .26):
            bm_merge(legs, ellipsoid_bm(.085, .085, .13, at=(sx * .2, y, .12)))
    part('legs', legs, GR, role='feet', ink=.01, rough=.3, cc=.6, metal=.3)
    panels = bmesh.new()
    SB = Surface(ellipsoid_bm(.36, .44, .3, at=(0, .08, .4)))
    for sx in (-1, 1):
        loc, nrm = SB.hit(sx * .3, .42, front=-1)
    part('collar', ellipsoid_bm(.26, .14, .05, at=(0, -.14, .5)), '#ff4a4a', role='body', ink=.008, rough=.4, cc=.5)
    coil = tube_bm(helix_pts((0, .5, .48), .16, .045, 2.5, n=40, up=.12), [.016] * 41, seg=8)
    bm_merge(coil, ellipsoid_bm(.035, .035, .035, at=(0, .66, .6)))
    part('tail', coil, GR, role='tail', ink=.007, metal=.4, pivot=(0, .5, .48))


def build_whale():
    """chubby galaxy whale: deep purple-blue painted body full of stars with a nebula swirl, fins, tail fluke, glowing"""
    PB = '#ffffff'
    body = ellipsoid_bm(.4, .56, .36, at=(0, .06, .42), seg=48, rings=26)
    for v in body.verts:                                     # fatter head, thinner tail end
        f = (v.co.y - .06) / .56
        if f > 0: v.co.x *= 1 - .35 * f * f; v.co.z = .42 + (v.co.z - .42) * (1 - .3 * f * f)
    uv_equirect(body, .06, .78)
    S = Surface(body)
    part('body', body, PB, role='body', ink=.014, rough=.25, cc=.9, emis='#8a5ad8', ei=.35, tex=galaxy_texture())
    for sx in (-1, 1):
        part('eye' + ('L' if sx < 0 else 'R'), S.decal(ELLIPSE, sx * .2, .5, .06, .075, bulge=.02), '#ffffff', role='eye', ink=0, rough=.1, cc=1, emis='#ffffff', ei=.4, pivot=(sx * .2, -.3, .5))
        part('pupil' + ('L' if sx < 0 else 'R'), S.decal(ELLIPSE, sx * .2, .49, .03, .04, bulge=.004, lift=.02), '#1b1040', role='eye', ink=0, rough=.2, cc=.8, pivot=(sx * .2, -.3, .5))
    mouth_smile(S, 0, .34, .14, .05, r=.012)
    blush(S, .33, .42, .05, .03, col='#ff9ad5')
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        w = ellipsoid_bm(.16, .09, .035, at=(sx * .13, 0, 0), rot=Matrix.Rotation(sx * -.4, 3, 'Y'))
        piv = Vector((sx * .34, -.02, .36)); bmesh.ops.translate(w, vec=piv, verts=w.verts)
        part('wing' + sd, w, '#5a3ab0', role='wing' + sd, ink=.01, rough=.3, cc=.7, pivot=tuple(piv))
    fl = bmesh.new()
    for sx in (-1, 1):
        bm_merge(fl, ellipsoid_bm(.18, .1, .035, at=(sx * .15, .72, .5), rot=Matrix.Rotation(sx * .5, 3, 'Z')))
    part('tail', fl, '#5a3ab0', role='tail', ink=.01, rough=.3, cc=.7, pivot=(0, .6, .48))


def build_griffin():
    """baby thunder griffin: golden round body, eagle beak, feathered wings with blue lightning marks, lion tail, bolt crest"""
    GOLD, DG, BL, TAN = '#ffc63a', '#e09a1e', '#4ac8ff', '#ffe6a8'
    body = egg_bm(.86, .82, .85, taper=.1)
    S = Surface(body)
    part('body', body, GOLD, role='body', ink=.014)
    part('belly', S.decal(ELLIPSE, 0, .3, .2, .2, bulge=.008, lift=.002), TAN, role='body', ink=0, rough=.35, cc=.5)
    eyes_dot(S, .15, .6, .055, .07)
    blush(S, .29, .49, .05, .03)
    beak = spike_bm(Vector((0, -.38, .5)), (0, -1, -.45), r=.065, h=.15, seg=12)
    part('beak', beak, DG, role='beak', ink=.01)
    crest = slab_bm(bolt_outline(.2, 0, 0), thick=.03, bevel=.008)
    bmesh.ops.transform(crest, matrix=Matrix.Translation((.0, -.1, .9)) @ Matrix.Rotation(.3, 4, 'Y'), verts=crest.verts)
    part('crest', crest, BL, role='horn', ink=.008, emis='#4ac8ff', ei=.5)
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        w = slab_bm(feather_wing(sx, span=.46, rise=.2), thick=.03, bevel=.01)
        piv = Vector((sx * .36, .08, .56))
        M = Matrix.Translation(piv) @ Matrix.Rotation(sx * .3, 4, 'Z') @ Matrix.Rotation(sx * -.12, 4, 'Y')
        bmesh.ops.transform(w, matrix=M, verts=w.verts)
        part('wing' + sd, w, GOLD, role='wing' + sd, ink=.009, pivot=tuple(piv))
        b = slab_bm(bolt_outline(.16, 0, 0), thick=.012, bevel=.004)
        bmesh.ops.transform(b, matrix=M @ Matrix.Translation((sx * .24, -.025, .06)), verts=b.verts)
        part('bolt' + sd, b, BL, role='wing' + sd, ink=0, emis='#4ac8ff', ei=.6, pivot=tuple(piv))
    pts = smooth_path([Vector((0, .36, .28)), Vector((.04, .52, .26)), Vector((.03, .6, .34)), Vector((-.02, .6, .44))])
    tail = tube_bm(pts, radii(.04, .025, len(pts)), seg=10)
    bm_merge(tail, ellipsoid_bm(.06, .06, .075, at=tuple(pts[-1] + Vector((-.02, 0, .05)))))
    part('tail', tail, DG, role='tail', ink=.01, pivot=(0, .36, .3))


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
