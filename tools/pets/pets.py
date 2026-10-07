"""Buddies (pets) modelled in Blender by code -> compact game format art/pet_<id>.wasm + art/pet_<id>.json.
Run:  python3 tools/pets/pets.py dragon [unicorn ...]     (needs `pip install bpy`, Blender 5.x as a Python module)
Every buddy is a few smooth low-poly parts with flat colours; shine comes from the game's lights (MeshPhysical + clearcoat),
the dark outline from an inverted hull pushed along the normals (ink = thickness in model units, 0 = none).
Model space: Blender Z-up, front = -Y, feet at z=0, height ~1. The exporter turns it Y-up / front +Z (three.js).
Parts with role wingL/wingR/tail/eye/... keep their pivot so the game can animate them (v60 petStep)."""
import sys, os, json, math, struct
import bpy, bmesh
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ART = os.path.join(ROOT, 'art')
META = {}   # object name -> material/role info


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    META.clear()


def bl_mat(name, m):
    """a matching Blender material, so the saved .blend looks right when opened in Blender"""
    mt = bpy.data.materials.new(name); mt.use_nodes = True
    b = mt.node_tree.nodes.get('Principled BSDF'); h = m['c'].lstrip('#')
    lin = lambda c: (c / 255) / 12.92 if c / 255 <= .04045 else ((c / 255 + .055) / 1.055) ** 2.4
    b.inputs['Base Color'].default_value = (lin(int(h[0:2], 16)), lin(int(h[2:4], 16)), lin(int(h[4:6], 16)), 1)
    b.inputs['Roughness'].default_value = m['r']; b.inputs['Metallic'].default_value = m['m'] or 0
    if 'Coat Weight' in b.inputs: b.inputs['Coat Weight'].default_value = m['cc']
    if m['o'] < 1: b.inputs['Alpha'].default_value = m['o']
    return mt


def obj_from_bm(name, bm, mat):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    for p in me.polygons: p.use_smooth = True
    META[name] = dict(mat)
    me.materials.append(bl_mat(name, mat))
    return ob


def part(name, ob_or_bm, color, role='part', ink=.012, rough=.32, cc=.6, metal=0, emis=None, ei=0, opacity=1, pivot=(0, 0, 0)):
    m = dict(c=color, role=role, ink=ink, r=rough, cc=cc, m=metal, e=emis, ei=ei, o=opacity, p=list(pivot))
    if isinstance(ob_or_bm, bmesh.types.BMesh):
        return obj_from_bm(name, ob_or_bm, m)
    ob_or_bm.name = name; META[name] = m
    for p in ob_or_bm.data.polygons: p.use_smooth = True
    return ob_or_bm


# ---------------- shape helpers (all return BMesh in model space) ----------------
def sphere_bm(r=1., seg=40, rings=20):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=r)
    return bm


def egg_bm(w=.84, d=.8, h=1., taper=.2, flat=.06, seg=48, rings=26):
    """tall glossy egg: wider low, narrower top, a slightly flattened bottom; bottom at z=0"""
    bm = sphere_bm(1, seg, rings)
    for v in bm.verts:
        x, y, z = v.co
        k = 1 - taper * max(0, z) - .04 * max(0, -z)           # narrow top
        zz = z if z > -.8 else -.8 + (z + .8) * .45               # flatten the bottom a little
        v.co = Vector((x * w / 2 * k, y * d / 2 * k, (zz + 1) / 2 * h))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


def ellipsoid_bm(rx, ry, rz, at=(0, 0, 0), seg=24, rings=14, rot=None):
    bm = sphere_bm(1, seg, rings)
    M = Matrix.Translation(at) @ (rot.to_4x4() if rot else Matrix()) @ Matrix.Diagonal((rx, ry, rz, 1))
    bmesh.ops.transform(bm, matrix=M, verts=bm.verts)
    return bm


def cone_bm(r1, r2, h, seg=20, round_tip=True):
    """cone along +Z from z=0, rounded tip"""
    bm = bmesh.new()
    rings = 10
    for i in range(rings + 1):
        f = i / rings; r = r1 + (r2 - r1) * f
        if round_tip and f > .75: r *= math.sqrt(max(0., 1 - ((f - .75) / .25) ** 2)) * .9 + .1 * (1 - (f - .75) / .25)
        for j in range(seg):
            a = j / seg * math.tau
            bm.verts.new((math.cos(a) * r, math.sin(a) * r, h * f))
    bm.verts.ensure_lookup_table()
    for i in range(rings):
        for j in range(seg):
            a, b = i * seg + j, i * seg + (j + 1) % seg
            bm.faces.new((bm.verts[a], bm.verts[b], bm.verts[b + seg], bm.verts[a + seg]))
    top = bm.verts.new((0, 0, h)); bot = bm.verts.new((0, 0, 0)); bm.verts.ensure_lookup_table()
    for j in range(seg):
        bm.faces.new((bm.verts[rings * seg + j], bm.verts[rings * seg + (j + 1) % seg], top))
        bm.faces.new((bm.verts[(j + 1) % seg], bm.verts[j], bot))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


def tube_bm(pts, radii, seg=12):
    """smooth tube through 3D points (list of Vector) with per-point radius, closed ends"""
    bm = bmesh.new(); n = len(pts); rows = []
    for i, p in enumerate(pts):
        t = (pts[min(n - 1, i + 1)] - pts[max(0, i - 1)]).normalized()
        a = Vector((0, 0, 1)) if abs(t.z) < .9 else Vector((1, 0, 0))
        u = t.cross(a).normalized(); v = t.cross(u)
        rows.append([bm.verts.new(p + (u * math.cos(j / seg * math.tau) + v * math.sin(j / seg * math.tau)) * radii[i]) for j in range(seg)])
    for i in range(n - 1):
        for j in range(seg):
            bm.faces.new((rows[i][j], rows[i][(j + 1) % seg], rows[i + 1][(j + 1) % seg], rows[i + 1][j]))
    c0 = bm.verts.new(pts[0] - (pts[1] - pts[0]).normalized() * radii[0] * .6)
    c1 = bm.verts.new(pts[-1] + (pts[-1] - pts[-2]).normalized() * radii[-1] * .6)
    for j in range(seg):
        bm.faces.new((rows[0][(j + 1) % seg], rows[0][j], c0))
        bm.faces.new((rows[-1][j], rows[-1][(j + 1) % seg], c1))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


def slab_bm(outline, thick=.03, bevel=.012, cuts=3):
    """flat shape (list of (u,v) in the XZ plane, counter-clockwise) extruded along Y with rounded rims.
    The flat faces get interior vertices (subdivided fill) so smooth shading doesn't streak across long thin triangles."""
    bm = bmesh.new()
    vs = [bm.verts.new((u, -thick / 2, v)) for u, v in outline]
    for a, b in zip(vs, vs[1:] + vs[:1]): bm.edges.new((a, b))
    bmesh.ops.triangle_fill(bm, use_beauty=True, use_dissolve=False, edges=bm.edges[:])
    inner = [e for e in bm.edges if len(e.link_faces) == 2]
    if cuts and inner: bmesh.ops.subdivide_edges(bm, edges=inner, cuts=cuts, use_grid_fill=False)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    for f in bm.faces:
        if f.normal.y > 0: f.normal_flip()
    ext = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
    nv = [g for g in ext['geom'] if isinstance(g, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, thick, 0), verts=nv)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.normal_update()
    rim = [e for e in bm.edges if len(e.link_faces) == 2 and (abs(e.link_faces[0].normal.y) > .5) != (abs(e.link_faces[1].normal.y) > .5)]
    if bevel: bmesh.ops.bevel(bm, geom=rim, offset=bevel, segments=2, affect='EDGES', profile=.5)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


class Surface:
    """ray-casts onto a part (usually the body) so eyes/mouth/belly sit exactly on its curve"""
    def __init__(self, bm):
        self.bm = bm.copy(); self.bm.verts.ensure_lookup_table(); self.t = BVHTree.FromBMesh(self.bm)

    def hit(self, x, z, front=-1):
        o = Vector((x, front * 5, z)); d = Vector((0, -front, 0))
        loc, nrm, _, _ = self.t.ray_cast(o, d)
        return loc, nrm

    def decal(self, shape, cx, cz, sx, sz, bulge=.025, lift=.004, n=16, rings=7, front=-1):
        """closed lens lying on the surface. shape(u,v) -> True inside, u,v in [-1,1]; built on a polar grid of the ellipse,
        clipped by shape via radial search. Domed by `bulge` at the centre."""
        bm = bmesh.new(); seg = n * 2
        def rim_r(a):
            lo, hi = 0., 1.
            if shape(math.cos(a) * .999, math.sin(a) * .999): return 1.
            for _ in range(18):
                m = (lo + hi) / 2
                if shape(math.cos(a) * m, math.sin(a) * m): lo = m
                else: hi = m
            return lo
        R = [rim_r(j / seg * math.tau) for j in range(seg)]
        cu = sum(math.cos(j / seg * math.tau) * R[j] for j in range(seg)) / seg * 0  # keep centre
        top, bot = [], []
        for i in range(1, rings + 1):
            f = i / rings; rowt, rowb = [], []
            for j in range(seg):
                a = j / seg * math.tau; u, v = math.cos(a) * R[j] * f, math.sin(a) * R[j] * f
                loc, nrm = self.hit(cx + u * sx, cz + v * sz, front)
                dome = bulge * math.sqrt(max(0., 1 - f * f)) + lift
                rowt.append(bm.verts.new(loc + nrm * dome))
                rowb.append(bm.verts.new(loc - nrm * .006) if i < rings else rowt[-1])
            top.append(rowt); bot.append(rowb)
        loc, nrm = self.hit(cx, cz, front)
        ct = bm.verts.new(loc + nrm * (bulge + lift)); cb = bm.verts.new(loc - nrm * .006)
        for j in range(seg):
            k = (j + 1) % seg
            bm.faces.new((ct, top[0][j], top[0][k])); bm.faces.new((cb, bot[0][k], bot[0][j]))
            for i in range(rings - 1):
                bm.faces.new((top[i][j], top[i + 1][j], top[i + 1][k], top[i][k]))
                bm.faces.new((bot[i][k], bot[i + 1][k], bot[i + 1][j], bot[i][j]))
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        return bm


ELLIPSE = lambda u, v: u * u + v * v <= 1
D_SMILE = lambda u, v: u * u + v * v <= 1 and v <= .15          # open smile: flat top, round bottom
def CRESCENT(u, v):                                              # closed happy eye ^ shape
    return u * u + (v + .2) ** 2 <= 1 and u * u + (v + .75) ** 2 >= 1


# ---------------- export ----------------
def export(pid, height=.56, flt=1, extra=None):
    deps = bpy.context.evaluated_depsgraph_get()
    obs = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    zmin = min((o.matrix_world @ v.co).z for o in obs for v in o.data.vertices)
    zmax = max((o.matrix_world @ v.co).z for o in obs for v in o.data.vertices)
    s = height / (zmax - zmin)
    parts, blob = [], bytearray()
    for o in obs:
        ev = o.evaluated_get(deps); me = ev.to_mesh()
        bm = bmesh.new(); bm.from_mesh(me); ev.to_mesh_clear()
        bmesh.ops.triangulate(bm, faces=bm.faces[:]); bm.transform(o.matrix_world)
        bm.verts.ensure_lookup_table(); bm.normal_update()
        M = META[o.name]; pv = Vector(M['p'])
        P, N, I = [], [], []
        for v in bm.verts:
            c = (v.co - pv) * s
            P += [c.x, c.z, -c.y]; n = v.normal
            N += [max(-127, min(127, round(n.x * 127))), max(-127, min(127, round(n.z * 127))), max(-127, min(127, round(-n.y * 127)))]
        for f in bm.faces: I += [v.index for v in f.verts]
        nv, ni = len(bm.verts), len(I); bm.free()
        off = len(blob)
        blob += struct.pack('<%df' % len(P), *P)
        nb = struct.pack('<%db' % len(N), *N); nb += b'\0' * (-len(nb) % 4); blob += nb
        big = nv > 65535
        ib = struct.pack(('<%dI' if big else '<%dH') % ni, *I); ib += b'\0' * (-len(ib) % 4); blob += ib
        q = {k: v for k, v in M.items() if v is not None and k != 'p'}
        q.update(n=o.name, v=nv, i=ni, off=off, p=[round(pv.x * s, 4), round((pv.z - zmin) * s, 4), round(-pv.y * s, 4)], ink=round(M['ink'] * s, 4))
        if big: q['i32'] = 1
        # positions are relative to the pivot; the pivot itself is in "feet at y=0" space
        parts.append(q)
    for q in parts:   # move feet to y=0: shift every pivot (positions are pivot-relative)
        pass
    zoff = -zmin * s
    for q, o in zip(parts, obs):
        pv = Vector(META[o.name]['p'])
        q['p'] = [round(pv.x * s, 4), round(pv.z * s + zoff, 4), round(-pv.y * s, 4)]
    meta = dict(h=round(height, 3), float=flt, parts=parts, bytes=len(blob))
    if extra: meta.update(extra)
    open(os.path.join(ART, 'pet_%s.wasm' % pid), 'wb').write(blob)
    json.dump(meta, open(os.path.join(ART, 'pet_%s.json' % pid), 'w'), separators=(',', ':'))
    tv = sum(q['v'] for q in parts); print(pid, 'parts', len(parts), 'verts', tv, 'tris', sum(q['i'] for q in parts) // 3, 'bytes', len(blob))


# ---------------- the buddies ----------------
def face(S, eyes=(.17, .63, .135, .17), mouth=(0, .43, .075, .055), eye_kind='open', tongue=True, blush=None, front=-1, rim=.022):
    ex, ez, ew, eh = eyes
    for sx in (-1, 1):
        shp = ELLIPSE if eye_kind == 'open' else CRESCENT
        part('eye' + ('L' if sx < 0 else 'R'), S.decal(shp, sx * ex, ez, ew, eh, bulge=.03),
             '#ffffff', role='eye', ink=0, rough=.15, cc=1, emis='#ffffff', ei=.35, pivot=(sx * ex, -.3, ez))
        # sticker-style black border: a slightly bigger dark lens under the white
        part('eyeRim' + ('L' if sx < 0 else 'R'), S.decal(shp, sx * (ex + rim * .45), ez - rim * .15, ew + rim, eh + rim * .8, bulge=.012, lift=.001),
             '#120d2b', role='eye', ink=0, rough=.4, cc=.3, pivot=(sx * ex, -.3, ez))
        if blush:
            bx, bz, bw, bh = blush
            part('blush' + ('L' if sx < 0 else 'R'), S.decal(ELLIPSE, sx * bx, bz, bw, bh, bulge=.004, lift=.003), '#ff8fb0', role='blush', ink=0, rough=.5, cc=.2, opacity=.75)
    mx, mz, mw, mh = mouth
    part('mouth', S.decal(D_SMILE, mx, mz, mw, mh, bulge=.006, lift=.003), '#3b0f22', role='mouth', ink=.006, rough=.5, cc=.2)
    if tongue:
        part('tongue', S.decal(lambda u, v: u * u + (v + .35) ** 2 <= .36 and v <= .05, mx, mz - mh * .45, mw * .55, mh * .55, bulge=.004, lift=.008),
             '#ff6f8f', role='mouth', ink=0, rough=.4, cc=.3)


def bat_wing(side, span=.56, rise=.26):
    """bat wing in the XZ plane, root at (0,0), spreading to +X (mirrored for the left wing).
    Top edge = the 'arm' arcing up to the tip; lower edge = 3 scallops between finger points that fan out from the root."""
    pts = []
    tip = (span, rise)
    for i in range(10):
        f = i / 9; pts.append((span * f, rise * f ** 1.15 + .07 * math.sin(f * math.pi)))
    fingers = [tip, (span * .86, rise * .02 - .04), (span * .58, -.1), (span * .3, -.12), (.0, -.06)]
    for a, b in zip(fingers, fingers[1:]):
        for k in range(1, 8):
            f = k / 7; x = a[0] + (b[0] - a[0]) * f; z = a[1] + (b[1] - a[1]) * f
            pts.append((x, z + .055 * math.sin(f * math.pi)))
    pts = pts[:-1]
    if side < 0: pts = [(-u, v) for u, v in reversed(pts)]
    return pts, fingers


def bm_merge(dst, src):
    tmp = bpy.data.meshes.new('t'); src.to_mesh(tmp); src.free(); dst.from_mesh(tmp); bpy.data.meshes.remove(tmp)


def spike_bm(base, direction, r=.06, h=.16, seg=16):
    """rounded cone standing on `base`, pointing along `direction` (Vector)"""
    c = cone_bm(r, r * .15, h, seg=seg)
    q = Vector((0, 0, 1)).rotation_difference(Vector(direction).normalized())
    bmesh.ops.transform(c, matrix=Matrix.Translation(base) @ q.to_matrix().to_4x4(), verts=c.verts)
    return c


def build_dragon():
    """ChatGPT turnaround (design/buddies/dragon_turnaround.png): minty green egg, 3 dark green spikes on top,
    small bat wings (dark green bones, light membrane) on the sides, short spike tail, blush, open smile"""
    G, DG, MEM = '#8be04e', '#2f9a32', '#a6e25a'
    body = egg_bm(.84, .8, 1.)
    S = Surface(body)
    part('body', body, G, role='body', ink=.014)
    face(S, eyes=(.19, .59, .145, .18), mouth=(.0, .395, .075, .07), blush=(.31, .46, .06, .032), rim=.02)
    sp = bmesh.new()
    for x, z, r, h, tilt in [(0, .96, .1, .23, 0), (-.16, .9, .08, .17, -.5), (.16, .9, .08, .17, .5)]:
        bm_merge(sp, spike_bm(Vector((x, .02, z - .03)), (math.sin(tilt), .05, math.cos(tilt)), r, h))
    part('spikes', sp, DG, role='horn', ink=.011)
    for sx in (-1, 1):
        side = 'L' if sx < 0 else 'R'
        pts, fingers = bat_wing(sx, span=.46, rise=.22)
        w = slab_bm(pts, thick=.022, bevel=.008)
        ribs = bmesh.new()
        tip = Vector((fingers[0][0] * sx, 0, fingers[0][1]))
        bm_merge(ribs, tube_bm([Vector((0, 0, 0)), Vector((tip.x * .5, 0, tip.z * .75 + .03)), tip], [.052, .044, .028], seg=12))
        for (u, v) in fingers[1:4]:
            bm_merge(ribs, tube_bm([Vector((0, 0, 0)), Vector((u * sx * .5, 0, v * .5 + .02)), Vector((u * sx * .96, 0, v))], [.034, .027, .017], seg=10))
        piv = Vector((sx * .34, .1, .66))
        M = Matrix.Translation(piv) @ Matrix.Rotation(sx * .32, 4, 'Z') @ Matrix.Rotation(sx * -.1, 4, 'Y')
        bmesh.ops.transform(w, matrix=M, verts=w.verts); bmesh.ops.transform(ribs, matrix=M, verts=ribs.verts)
        part('wing' + side, w, MEM, role='wing' + side, ink=.008, pivot=tuple(piv))
        part('wingBone' + side, ribs, DG, role='wing' + side, ink=.008, pivot=tuple(piv))
    tail = spike_bm(Vector((0, .3, .2)), (0, 1, -.3), r=.09, h=.25)
    part('tail', tail, DG, role='tail', ink=.012, pivot=(0, .3, .2))


PETS = {'dragon': (build_dragon, dict(height=.64, flt=0))}

if __name__ == '__main__':
    ids = sys.argv[1:] or list(PETS)
    for pid in ids:
        reset(); fn, kw = PETS[pid]; fn(); export(pid, kw.get('height', .56), kw.get('flt', 1))
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join('/tmp', 'pet_%s.blend' % pid))
