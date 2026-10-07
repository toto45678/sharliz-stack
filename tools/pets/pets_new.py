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
    """turn_penguin.png: navy egg, one white face+belly patch with two lobes around the eyes, glossy black eyes, orange beak + 3-toed feet,
    flippers hanging at the sides, 3 head feathers, a little tail bump at the back"""
    NAVY, W, OR = '#2f4a86', '#f8f9ff', '#ff9a2e'
    body = egg_bm(.84, .8, .96, taper=.1, flat=.08)
    S = Surface(body)
    part('body', body, NAVY, role='body', ink=.014, rough=.3, cc=.7)
    def patch(u, v):   # in the box centre (0,.47) half size (.3,.37): belly + two lobes around the eyes, navy point between them
        return (u * u / .9 + (v + .22) ** 2 / .62 <= 1) or ((u - .52) ** 2 + (v - .45) ** 2 <= .26) or ((u + .52) ** 2 + (v - .45) ** 2 <= .26)
    part('patch', S.decal(patch, 0, .47, .3, .37, bulge=.01, lift=.003, n=24, rings=9), W, role='body', ink=0, rough=.35, cc=.5)
    eyes_dot(S, .14, .64, .052, .068)
    blush(S, .27, .54, .05, .028)
    part('beak', beak_bm((0, -.4, .57), up=.0, size=.85, gap=.03), OR, role='beak', ink=.01)
    part('tuft', tuft_bm((0, .0, .95), n=3, h=.12, r=.03, spread=.6), NAVY, role='horn', ink=.009)
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        piv = Vector((sx * .39, .0, .58))
        w = ellipsoid_bm(.06, .1, .2, at=(0, 0, -.16), seg=18, rings=12)
        bmesh.ops.transform(w, matrix=Matrix.Translation(piv) @ Matrix.Rotation(sx * -.3, 4, 'Y'), verts=w.verts)
        part('wing' + sd, w, NAVY, role='wing' + sd, ink=.011, pivot=tuple(piv))
    feet = bmesh.new()
    for sx in (-1, 1): bm_merge(feet, foot_bm((sx * .17, -.2, .035), sx, s=1.25))
    part('feet', feet, OR, role='feet', ink=.01)
    part('tailBump', ellipsoid_bm(.06, .08, .05, at=(0, .37, .12), seg=14, rings=10), NAVY, role='tail', ink=.009, pivot=(0, .34, .12))


def build_firefly():
    """turn_firefly.png: navy ball head over a glowing yellow-green belly ball, huge white eyes, curly antennae, see-through wings, stub arms"""
    DB, GL = '#2e3c7a', '#e2ff4a'
    head = ellipsoid_bm(.31, .3, .3, at=(0, -.02, .7), seg=72, rings=40)
    S = Surface(head)
    part('head', head, DB, role='body', ink=.013)
    bulb = ellipsoid_bm(.29, .31, .28, at=(0, .05, .3), seg=64, rings=36)
    part('bulb', bulb, GL, role='glow', ink=.012, rough=.15, cc=1, emis='#d8ff2a', ei=1.0)
    eyes_open(S, .125, .72, .11, .13, rim=.017)
    mouth_small(S, 0, .56, .035, .03)
    blush(S, .24, .63, .045, .025)
    ant = bmesh.new()
    for sx in (-1, 1):
        base = Vector((sx * .1, -.03, .98))
        stem = [base, base + Vector((sx * .05, 0, .09)), base + Vector((sx * .11, 0, .17)), base + Vector((sx * .17, 0, .22))]
        curl = curl_pts(stem[-1], Vector((sx, 0, 0)), 1., .055, .025, turns=1.0, n=14)
        pts = smooth_path(stem, 4)[:-1] + curl
        bm_merge(ant, tube_bm(pts, radii(.017, .011, len(pts)), seg=8))
    part('antennae', ant, DB, role='horn', ink=.008)
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        w = ellipsoid_bm(.27, .012, .14, at=(sx * .26, 0, 0), seg=24, rings=12)
        R = Matrix.Rotation(math.radians(sx * 12), 3, 'Z') @ Matrix.Rotation(math.radians(-48 * sx), 3, 'Y')
        piv = Vector((sx * .2, .1, .74))
        bmesh.ops.transform(w, matrix=Matrix.Translation(piv) @ R.to_4x4(), verts=w.verts)
        part('wing' + sd, w, '#f4faff', role='wing' + sd, ink=.008, rough=.1, cc=1, opacity=.9, emis='#dff0ff', ei=.7, pivot=tuple(piv))
    arms = bmesh.new()
    for sx in (-1, 1): bm_merge(arms, ellipsoid_bm(.05, .045, .07, at=(sx * .33, -.06, .47), seg=14, rings=10, rot=Matrix.Rotation(sx * -.4, 3, 'Y')))
    part('arms', arms, DB, role='arms', ink=.009)


def build_kitten():
    """turn_kitten.png: orange egg cat, cream muzzle+belly patch, huge white eyes, pink nose, whiskers, pointy ears with pink inside,
    little paws on the belly, feet, curly tail with a cream tip"""
    OR, CR, PK = '#ff9d2e', '#fff0cf', '#ff86b0'
    body = egg_bm(.86, .82, .92, taper=.12)
    S = Surface(body)
    part('body', body, OR, role='body', ink=.014)
    def patch(u, v):   # box centre (0,.37) half (.31,.36): muzzle ellipse + belly ellipse + a bridge
        x, z = u * .31, .37 + v * .36
        return ((x / .27) ** 2 + ((z - .52) / .13) ** 2 <= 1) or ((x / .25) ** 2 + ((z - .23) / .16) ** 2 <= 1) or ((x / .22) ** 2 + ((z - .38) / .17) ** 2 <= 1)
    part('patch', S.decal(patch, 0, .37, .31, .36, bulge=.012, lift=.003, n=24, rings=9), CR, role='body', ink=0, rough=.4, cc=.4)
    eyes_open(S, .155, .62, .12, .15, rim=.018)
    part('nose', S.decal(lambda u, v: u * u + v * v <= 1 and v > -.9, 0, .505, .03, .022, bulge=.012, lift=.02), PK, role='mouth', ink=0, rough=.3, cc=.6)
    mouth_small(S, 0, .455, .035, .03, lift=.02)
    wh = bmesh.new()
    for sx in (-1, 1):
        for dz, tilt in ((.035, .035), (0, 0), (-.035, -.035)):
            loc, nrm = S.hit(sx * .2, .47 + dz)
            if loc is None: continue
            bm_merge(wh, tube_bm([loc + nrm * .006, loc + Vector((sx * .19, -.02, tilt * 2.4)) + nrm * .03], [.011, .006], seg=6))
    part('whiskers', wh, '#2a2440', role='part', ink=0, rough=.5)
    ears = bmesh.new(); inner = bmesh.new()
    for sx in (-1, 1):
        bm_merge(ears, spike_bm(Vector((sx * .24, .0, .8)), (sx * .42, .05, 1), r=.115, h=.27, seg=14))
        bm_merge(inner, spike_bm(Vector((sx * .25, -.045, .82)), (sx * .42, -.08, 1), r=.062, h=.18, seg=12))
    part('ears', ears, OR, role='horn', ink=.011)
    part('earsIn', inner, PK, role='horn', ink=0)
    paws = bmesh.new()
    for sx in (-1, 1): bm_merge(paws, ellipsoid_bm(.075, .07, .065, at=(sx * .25, -.34, .34), seg=16, rings=10))
    part('paws', paws, OR, role='arms', ink=.01)
    feet = bmesh.new()
    for sx in (-1, 1): bm_merge(feet, ellipsoid_bm(.095, .1, .05, at=(sx * .17, -.2, .04), seg=16, rings=10))
    part('feet', feet, OR, role='feet', ink=.01)
    pts = smooth_path([Vector((0, .36, .22)), Vector((.15, .52, .26)), Vector((.24, .6, .42)), Vector((.13, .62, .57)), Vector((-.03, .56, .58))], 5)
    part('tail', tube_bm(pts, radii(.065, .04, len(pts)), seg=10), OR, role='tail', ink=.011, pivot=(0, .36, .22))
    part('tailTip', ellipsoid_bm(.05, .05, .05, at=tuple(pts[-1]), seg=14, rings=10), CR, role='tail', ink=.01, pivot=(0, .36, .22))


def build_octopus():
    """turn_octopus.png: pink-magenta ball head, huge white eyes, tiny open mouth, blush, seven chunky tentacles curling up at the tips"""
    PP = '#d95fd8'
    head = ellipsoid_bm(.4, .39, .37, at=(0, 0, .5), seg=80, rings=44)
    for v in head.verts:
        if v.co.z < .5: v.co.z = .5 + (v.co.z - .5) * .75
    S = Surface(head)
    part('head', head, PP, role='body', ink=.014)
    eyes_open(S, .15, .53, .125, .145, rim=.018)
    mouth_small(S, 0, .38, .035, .03)
    blush(S, .3, .44, .05, .03)
    tent = bmesh.new()
    for k in range(7):
        a = (k + .5) / 7 * math.tau; d = Vector((math.sin(a), math.cos(a), 0))
        ctrl = [(.14, .3), (.28, .18), (.4, .09), (.47, .045), (.49, .1), (.45, .16), (.4, .14)]
        pts = smooth_path([d * r + Vector((0, 0, z)) for r, z in ctrl], 8)
        bm_merge(tent, tube_bm(pts, radii(.085, .04, len(pts)), seg=18))
    part('tentacles', tent, PP, role='part', ink=.012)


def build_cloudy():
    """turn_cloudy.png: a cloud of round white puffs, huge white eyes, tiny open mouth, blush"""
    W = '#fcfcff'
    cl = ellipsoid_bm(.33, .3, .31, at=(0, -.03, .38), seg=64, rings=36)
    for x, y, z, r in [(-.03, .08, .55, .27), (-.36, .02, .3, .24), (.36, .02, .3, .24), (0, .24, .36, .26), (-.2, -.12, .22, .18), (.2, -.12, .22, .18), (-.22, .2, .52, .17), (.24, .2, .5, .17)]:
        bm_merge(cl, ellipsoid_bm(r, r * .95, r * .92, at=(x, y, z), seg=48, rings=28))
    S = Surface(cl)
    part('body', cl, W, role='body', ink=.013, rough=.45, cc=.35, emis='#ffffff', ei=.1)
    eyes_open(S, .14, .43, .105, .125, rim=.016)
    mouth_small(S, 0, .28, .035, .03)
    blush(S, .28, .35, .05, .028)


def build_monkey():
    """turn_monkey.png: brown egg, wide tan face patch and belly, huge white eyes, big round ears with tan inside, 3 hairs, stub arms, feet, curly tail"""
    BR, TAN = '#9a5b2e', '#f3cd98'
    body = egg_bm(.84, .8, .92, taper=.12)
    S = Surface(body)
    part('body', body, BR, role='body', ink=.014)
    def facep(u, v):   # box centre (0,.57) half (.3,.19): two round cheeks + a lower lip ellipse, dip between the brows
        return ((u - .42) ** 2 + (v - .12) ** 2 <= .62) or ((u + .42) ** 2 + (v - .12) ** 2 <= .62) or (u * u / .55 + (v + .45) ** 2 / .32 <= 1)
    part('face', S.decal(facep, 0, .57, .3, .19, bulge=.012, lift=.003, n=24, rings=8), TAN, role='body', ink=0, rough=.45, cc=.4)
    part('belly', S.decal(ELLIPSE, 0, .24, .2, .17, bulge=.008, lift=.002), TAN, role='body', ink=0, rough=.45, cc=.4)
    eyes_open(S, .14, .62, .115, .135, rim=.018)
    mouth_small(S, 0, .47, .035, .03, lift=.02)
    ears = bmesh.new(); inner = bmesh.new()
    for sx in (-1, 1):
        bm_merge(ears, ellipsoid_bm(.14, .07, .15, at=(sx * .46, .03, .6), seg=20, rings=12))
        bm_merge(inner, ellipsoid_bm(.085, .045, .095, at=(sx * .47, -.025, .6), seg=16, rings=10))
    part('ears', ears, BR, role='horn', ink=.011)
    part('earsIn', inner, TAN, role='horn', ink=0)
    part('tuft', tuft_bm((0, -.01, .9), n=3, h=.13, r=.03, spread=.5), BR, role='horn', ink=.009)
    arms = bmesh.new()
    for sx in (-1, 1): bm_merge(arms, ellipsoid_bm(.06, .06, .11, at=(sx * .42, -.03, .36), seg=14, rings=10, rot=Matrix.Rotation(sx * -.25, 3, 'Y')))
    part('arms', arms, BR, role='arms', ink=.01)
    feet = bmesh.new()
    for sx in (-1, 1): bm_merge(feet, ellipsoid_bm(.09, .1, .05, at=(sx * .17, -.2, .04), seg=16, rings=10))
    part('feet', feet, BR, role='feet', ink=.01)
    pts = smooth_path([Vector((0, .36, .2)), Vector((.12, .52, .24)), Vector((.16, .6, .4)), Vector((.04, .62, .54)), Vector((-.1, .55, .5)), Vector((-.08, .5, .4))], 5)
    part('tail', tube_bm(pts, radii(.05, .03, len(pts)), seg=10), BR, role='tail', ink=.01, pivot=(0, .36, .2))


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
