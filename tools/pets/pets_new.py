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


def smooth_path(pts, n=6):
    """Catmull-Rom through the control points (Vectors) so tubes bend smoothly instead of kinking"""
    P = [pts[0]] + list(pts) + [pts[-1]]; out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(n):
            t = k / n; t2 = t * t; t3 = t2 * t
            out.append(.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(P[-2]); return out


def radii(r0, r1, n):
    return [r0 + (r1 - r0) * i / (n - 1) for i in range(n)]


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
    """navy egg, white belly, orange beak + feet, two little flippers, happy dot eyes"""
    NAVY, W, OR = '#243a73', '#f7f9ff', '#ff9a2e'
    body = egg_bm(.86, .82, .95, taper=.12)
    S = Surface(body)
    part('body', body, NAVY, role='body', ink=.014)
    part('belly', S.decal(ELLIPSE, 0, .42, .24, .3, bulge=.012, lift=.003), W, role='body', ink=0, rough=.35, cc=.5)
    # white eye patches + dot eyes
    for sx in (-1, 1):
        part('patch' + ('L' if sx < 0 else 'R'), S.decal(ELLIPSE, sx * .15, .64, .11, .12, bulge=.008, lift=.002), W, role='body', ink=0, rough=.35, cc=.5)
    eyes_dot(S, .15, .64, .05, .062)
    blush(S, .3, .52, .05, .03)
    beak = spike_bm(Vector((0, -.4, .55)), (0, -1, -.25), r=.06, h=.14, seg=12)
    part('beak', beak, OR, role='beak', ink=.01)
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        w = ellipsoid_bm(.06, .1, .2, at=(0, 0, -.14), rot=Matrix.Rotation(sx * .35, 3, 'Y'))
        piv = Vector((sx * .4, .0, .5)); bmesh.ops.translate(w, vec=piv + Vector((sx * .04, 0, 0)), verts=w.verts)
        part('wing' + sd, w, NAVY, role='wing' + sd, ink=.011, pivot=tuple(piv))
    feet = bmesh.new()
    for sx in (-1, 1):
        bm_merge(feet, ellipsoid_bm(.1, .13, .045, at=(sx * .17, -.12, .03)))
    part('feet', feet, OR, role='feet', ink=.01)


def build_firefly():
    """dark blue head + body, a big softly glowing yellow-green bottom, see-through wings, curly antennae"""
    DB, GL = '#2b3a8a', '#d9ff4a'
    head = ellipsoid_bm(.34, .32, .32, at=(0, -.1, .58))
    S = Surface(head)
    part('head', head, DB, role='body', ink=.013)
    bulb = ellipsoid_bm(.3, .34, .28, at=(0, .22, .3))
    part('bulb', bulb, GL, role='glow', ink=.012, rough=.2, cc=.9, emis='#c8ff3a', ei=1.1)
    eyes_dot(S, .12, .66, .055, .065)
    mouth_smile(S, 0, .5, .05, .025)
    blush(S, .21, .55, .045, .025)
    ant = bmesh.new()
    for sx in (-1, 1):
        base = Vector((sx * .1, -.08, .86))
        pts = smooth_path([base + Vector((sx * (.08 * t + .1 * math.sin(t * 3)), -.04 * t, .28 * t - .06 * math.sin(t * 3))) for t in (0, .25, .5, .75, 1.)])
        bm_merge(ant, tube_bm(pts, radii(.016, .011, len(pts)), seg=8))
        bm_merge(ant, ellipsoid_bm(.03, .03, .03, at=tuple(pts[-1])))
    part('antennae', ant, DB, role='horn', ink=.008)
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        w = ellipsoid_bm(.26, .012, .12, at=(sx * .25, 0, 0), seg=24, rings=12)
        R = Matrix.Rotation(math.radians(sx * 25), 3, 'Z') @ Matrix.Rotation(math.radians(-40 * sx), 3, 'Y')
        piv = Vector((sx * .12, .18, .7))
        bmesh.ops.transform(w, matrix=Matrix.Translation(piv) @ R.to_4x4(), verts=w.verts)
        part('wing' + sd, w, '#f4faff', role='wing' + sd, ink=.008, rough=.1, cc=1, opacity=.9, emis='#e4f4ff', ei=.7, pivot=tuple(piv))


def build_kitten():
    """orange-and-cream egg cat: pointy ears with pink inside, whiskers, pink nose, curly tail, happy closed eyes"""
    OR, CR, PK = '#ff9a3c', '#fff1d6', '#ff8fb1'
    body = egg_bm(.86, .82, .85, taper=.1)
    S = Surface(body)
    part('body', body, OR, role='body', ink=.014)
    part('muzzle', S.decal(lambda u, v: (u - .5) ** 2 * 1.2 + v * v <= 1 or (u + .5) ** 2 * 1.2 + v * v <= 1, 0, .44, .15, .075, bulge=.022, lift=.003), CR, role='body', ink=0, rough=.4, cc=.4)
    part('belly', S.decal(ELLIPSE, 0, .22, .17, .12, bulge=.006, lift=.002), CR, role='body', ink=0, rough=.4, cc=.4)
    eyes_happy(S, .17, .6, .08, .065, r=.019)
    blush(S, .31, .5, .05, .03)
    part('nose', S.decal(lambda u, v: u * u + v * v <= 1, 0, .5, .04, .028, bulge=.016, lift=.006), PK, role='mouth', ink=0, rough=.3, cc=.6)
    m = bmesh.new()
    for sx in (-1, 1): bm_merge(m, S.stroke(arc_pts(sx * .04, .45, .04, .025, up=False), r=.011, lift=.012))
    part('mouth', m, INK_C, role='mouth', ink=0, rough=.3, cc=.6)
    wh = bmesh.new()
    for sx in (-1, 1):
        for dz, tilt in ((.03, .03), (-.02, -.03)):
            loc, nrm = S.hit(sx * .2, .46 + dz)
            if loc is None: continue
            bm_merge(wh, tube_bm([loc + nrm * .008, loc + Vector((sx * .13, -.02, tilt * 2)) + nrm * .012], [.012, .008], seg=6))
    part('whiskers', wh, '#fff6e6', role='part', ink=0, rough=.5)
    ears = bmesh.new(); inner = bmesh.new()
    for sx in (-1, 1):
        bm_merge(ears, spike_bm(Vector((sx * .22, .0, .78)), (sx * .35, .05, 1), r=.1, h=.24, seg=12))
        bm_merge(inner, spike_bm(Vector((sx * .22, -.04, .8)), (sx * .35, -.1, 1), r=.055, h=.16, seg=10))
    part('ears', ears, OR, role='horn', ink=.011)
    part('earsIn', inner, PK, role='horn', ink=0)
    pts = smooth_path([Vector((0, .36, .25)), Vector((.08, .5, .3)), Vector((.12, .58, .42)), Vector((.04, .58, .55)), Vector((-.06, .5, .58))])
    part('tail', tube_bm(pts, radii(.05, .03, len(pts)), seg=10), OR, role='tail', ink=.011, pivot=(0, .36, .25))


def build_octopus():
    """pink-purple round head, six short curly tentacles, big dot eyes, blush"""
    PP, LT = '#c86ad8', '#f0b8ff'
    head = ellipsoid_bm(.4, .38, .36, at=(0, 0, .5))
    for v in head.verts:
        if v.co.z < .5: v.co.z = .5 + (v.co.z - .5) * .7       # flatter bottom
    S = Surface(head)
    part('head', head, PP, role='body', ink=.014)
    part('facePatch', S.decal(ELLIPSE, 0, .45, .26, .15, bulge=.006, lift=.002), LT, role='body', ink=0, rough=.45, cc=.4, opacity=.9)
    eyes_dot(S, .14, .55, .07, .085)
    mouth_smile(S, 0, .4, .05, .028, r=.011)
    blush(S, .29, .46, .05, .03)
    tent = bmesh.new()
    for k in range(6):
        a = (k + .5) / 6 * math.tau; dx, dy = math.sin(a), math.cos(a)
        base = Vector((dx * .22, dy * .2, .26))
        pts = [base + Vector((dx * .2 * t, dy * .18 * t, -.26 * t + .14 * t * t)) for t in (0, .3, .6, .85, 1.)]
        pts.append(pts[-1] + Vector((dx * .04, dy * .04, .09)))     # curl up at the end
        bm_merge(tent, tube_bm(pts, [.085, .075, .06, .05, .04, .03], seg=10))
    part('tentacles', tent, PP, role='part', ink=.012)


def build_cloudy():
    """a fluffy white cloud made of a few round puffs, happy closed eyes and blush"""
    W = '#fbfbff'
    cl = ellipsoid_bm(.42, .3, .25, at=(0, 0, .32))
    for x, y, z, r in [(-.22, 0, .45, .2), (.03, -.02, .55, .24), (.26, .02, .46, .19), (-.3, .08, .3, .16), (.33, .06, .3, .15), (0, .14, .4, .22)]:
        bm_merge(cl, ellipsoid_bm(r, r * .95, r * .9, at=(x, y, z), seg=20, rings=12))
    S = Surface(cl)
    part('body', cl, W, role='body', ink=.013, rough=.5, cc=.3, emis='#ffffff', ei=.12)
    eyes_happy(S, .13, .47, .07, .055, r=.017)
    mouth_smile(S, 0, .35, .045, .025, r=.011)
    blush(S, .27, .4, .05, .03)


def build_monkey():
    """brown egg body, tan face patch and belly, big round ears, curly tail, dot eyes"""
    BR, TAN = '#8a5a34', '#f2cfa0'
    body = egg_bm(.84, .8, .85, taper=.1)
    S = Surface(body)
    part('body', body, BR, role='body', ink=.014)
    part('face', S.decal(lambda u, v: (u * u + (v - .25) ** 2 <= .75) or (u * u + (v + .35) ** 2 <= .8), 0, .55, .25, .2, bulge=.012, lift=.003), TAN, role='body', ink=0, rough=.45, cc=.4)
    part('belly', S.decal(ELLIPSE, 0, .22, .19, .16, bulge=.008, lift=.002), TAN, role='body', ink=0, rough=.45, cc=.4)
    eyes_dot(S, .12, .6, .05, .06)
    mouth_smile(S, 0, .44, .06, .03, r=.011)
    blush(S, .25, .5, .045, .025)
    ears = bmesh.new(); inner = bmesh.new()
    for sx in (-1, 1):
        bm_merge(ears, ellipsoid_bm(.11, .06, .12, at=(sx * .44, .02, .62)))
        bm_merge(inner, ellipsoid_bm(.065, .035, .075, at=(sx * .45, -.03, .62)))
    part('ears', ears, BR, role='horn', ink=.011)
    part('earsIn', inner, TAN, role='horn', ink=0)
    tuft = tube_bm([Vector((0, 0, .84)), Vector((.03, -.02, .93)), Vector((.08, -.03, .98))], [.035, .025, .012], seg=8)
    part('tuft', tuft, BR, role='horn', ink=.009)
    pts = smooth_path([Vector((0, .36, .28)), Vector((.05, .52, .34)), Vector((.03, .6, .48)), Vector((-.07, .56, .58)), Vector((-.12, .46, .54))])
    part('tail', tube_bm(pts, radii(.045, .025, len(pts)), seg=10), BR, role='tail', ink=.01, pivot=(0, .36, .28))


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
