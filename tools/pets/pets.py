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
    for key, sock in (('tex', 'Base Color'), ('nrm', None)):
        im = m.get(key)
        if im is None: continue
        path = os.path.join('/tmp', 'pet_%s_%s.png' % (name, key)); im.save(path)
        t = mt.node_tree.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(path)
        if key == 'tex': mt.node_tree.links.new(t.outputs['Color'], b.inputs[sock])
        else:
            t.image.colorspace_settings.name = 'Non-Color'
            nm = mt.node_tree.nodes.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = m.get('ns', 1)
            mt.node_tree.links.new(t.outputs['Color'], nm.inputs['Color']); mt.node_tree.links.new(nm.outputs['Normal'], b.inputs['Normal'])
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


def part(name, ob_or_bm, color, role='part', ink=.012, rough=.32, cc=.6, metal=0, emis=None, ei=0, opacity=1, pivot=(0, 0, 0), tex=None, nrm=None, ns=1.0):
    """tex / nrm = PIL images (colour map / tangent-space normal map) mapped by the part's UV layer (see uv_equirect);
    they are saved as art/pet_<id>_<part>.webp by export(); the game multiplies `color` into the map, so use '#ffffff' with tex"""
    m = dict(c=color, role=role, ink=ink, r=rough, cc=cc, m=metal, e=emis, ei=ei, o=opacity, p=list(pivot))
    if tex is not None: m['tex'] = tex
    if nrm is not None: m['nrm'] = nrm; m['ns'] = ns
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


def uv_equirect(bm, z0=None, z1=None):
    """UVs for a body: u goes around (0.5 = front, -Y), v = height from z0 (0) to z1 (1). Texture images are drawn in that space."""
    zs = [v.co.z for v in bm.verts]; z0 = min(zs) if z0 is None else z0; z1 = max(zs) if z1 is None else z1
    uv = bm.loops.layers.uv.verify()
    for f in bm.faces:
        us = [((math.atan2(l.vert.co.x, -l.vert.co.y) / math.tau) + .5) % 1. for l in f.loops]
        if max(us) - min(us) > .5: us = [u + 1 if u < .5 else u for u in us]
        for l, u in zip(f.loops, us):
            l[uv].uv = (u, max(0., min(1., (l.vert.co.z - z0) / (z1 - z0))))
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
                if loc is None: raise ValueError('decal misses the surface at x=%.2f z=%.2f (centre %.2f,%.2f size %.2f,%.2f)' % (cx + u * sx, cz + v * sz, cx, cz, sx, sz))
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


def _stroke(self, pts, r=.016, lift=.0, front=-1, seg=8, sink=.35):
    """tube through surface points pts=[(x,z),...] (projected from the front), half sunk into the surface"""
    P = []
    for x, z in pts:
        loc, nrm = self.hit(x, z, front)
        if loc is None: continue
        P.append(loc + nrm * (r * (1 - sink) + lift))
    return tube_bm(P, [r] * len(P), seg=seg)


Surface.stroke = _stroke


def arc_pts(cx, cz, w, h, n=12, up=True, a0=.12, a1=.88):
    """points along a half ellipse: up=True -> ∩ (happy closed eye), False -> ∪ (smile)"""
    out = []
    for i in range(n):
        f = a0 + (a1 - a0) * i / (n - 1); a = math.pi * f
        out.append((cx - math.cos(a) * w, cz + (math.sin(a) if up else -math.sin(a)) * h))
    return out


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
        def push(v):
            c = (v.co - pv) * s
            P.extend((c.x, c.z, -c.y)); n = v.normal
            N.extend((max(-127, min(127, round(n.x * 127))), max(-127, min(127, round(n.z * 127))), max(-127, min(127, round(-n.y * 127)))))
        UV = None
        if ('tex' in M or 'nrm' in M) and bm.loops.layers.uv:
            # textured part: vertices are split where the UV differs (the seam at the back), one vertex per (vert, uv)
            lay = bm.loops.layers.uv.active; UV = []; idx = {}
            for f in bm.faces:
                for l in f.loops:
                    u, w = l[lay].uv.x, l[lay].uv.y; k = (l.vert.index, round(u, 4), round(w, 4))
                    if k not in idx: idx[k] = len(idx); push(l.vert); UV.extend((u, w))
                    I.append(idx[k])
            nv = len(idx)
        else:
            for v in bm.verts: push(v)
            for f in bm.faces: I += [v.index for v in f.verts]
            nv = len(bm.verts)
        ni = len(I); bm.free()
        if not nv: print('  empty part skipped:', o.name); continue
        off = len(blob)
        # positions as int16 in the part's box (half the size of float32, plenty for a small buddy)
        lo = [min(P[k::3]) for k in range(3)]; hi = [max(P[k::3]) for k in range(3)]
        sc = [max(1e-6, (hi[k] - lo[k]) / 65534) for k in range(3)]
        Q = [round((P[i] - lo[i % 3]) / sc[i % 3]) - 32767 for i in range(len(P))]
        blob += struct.pack('<%dh' % len(Q), *Q); blob += b'\0' * (-len(blob) % 4)
        nb = struct.pack('<%db' % len(N), *N); nb += b'\0' * (-len(nb) % 4); blob += nb
        if UV is not None:   # u16 normalised, read with BufferAttribute(...,2,true)
            ub = struct.pack('<%dH' % len(UV), *[max(0, min(65535, round(x * 65535))) for x in UV]); ub += b'\0' * (-len(ub) % 4); blob += ub
        big = nv > 65535
        ib = struct.pack(('<%dI' if big else '<%dH') % ni, *I); ib += b'\0' * (-len(ib) % 4); blob += ib
        q = {k: v for k, v in M.items() if v is not None and k not in ('p', 'tex', 'nrm')}
        for key in ('tex', 'nrm'):
            if key in M:
                fn = 'pet_%s_%s_%s.webp' % (pid, o.name, key); M[key].save(os.path.join(ART, fn), quality=92, method=6); q[key] = fn
        if UV is not None: q['uv'] = 1
        q.update(qs=[round(x, 9) for x in sc], qo=[round(lo[k] + 32767 * sc[k], 7) for k in range(3)], n=o.name, v=nv, i=ni, off=off, p=[round(pv.x * s, 4), round((pv.z - zmin) * s, 4), round(-pv.y * s, 4)], ink=round(M['ink'] * s, 4))
        if big: q['i32'] = 1
        # positions are relative to the pivot; the pivot itself is in "feet at y=0" space
        parts.append(q)
    for q in parts:   # move feet to y=0: shift every pivot (positions are pivot-relative)
        pass
    zoff = -zmin * s
    for q in parts:
        pv = Vector(META[q['n']]['p'])
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


INK_C = '#120d2b'


def eyes_open(S, ex, ez, ew, eh, rim=.02, bulge=.03, off=.2):
    """Sharliz eyes: big white ovals, NO pupils, thin black border (a little thicker on the outer-bottom side); they blink"""
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        part('eye' + sd, S.decal(ELLIPSE, sx * ex, ez, ew, eh, bulge=bulge), '#ffffff', role='eye', ink=0, rough=.15, cc=1, emis='#ffffff', ei=.35, pivot=(sx * ex, -.3, ez))
        part('eyeRim' + sd, S.decal(ELLIPSE, sx * (ex + rim * off), ez - rim * .1, ew + rim * .75, eh + rim * .7, bulge=bulge * .55, lift=.001), INK_C, role='eye', ink=0, rough=.4, cc=.3, pivot=(sx * ex, -.3, ez))


def eyes_happy(S, ex, ez, ew, eh, r=.017, lashes=False):
    """closed happy eyes ∩ as raised dark lines"""
    bm = bmesh.new()
    for sx in (-1, 1):
        bm_merge(bm, S.stroke(arc_pts(sx * ex, ez, ew, eh, up=True), r=r))
        if lashes:
            for k in range(3):
                a = math.pi * (.88 - .14 * k) if sx > 0 else math.pi * (.12 + .14 * k)     # arc parameter near the outer end
                px, pz = sx * ex - math.cos(a) * ew * (1 if sx > 0 else 1), ez + math.sin(a) * eh
                nx, nz = -math.cos(a) / ew, math.sin(a) / eh; ln = math.hypot(nx, nz); nx, nz = nx / ln, nz / ln
                bm_merge(bm, S.stroke([(px, pz), (px + nx * eh * .55 * (1 if sx > 0 else 1), pz + nz * eh * .55)], r=r * .75, seg=6))
    part('eyesH', bm, INK_C, role='eyeH', ink=0, rough=.3, cc=.6)


def eyes_dot(S, ex, ez, ew, eh, col='#120d2b', glint=True):
    """little glossy black eyes (animals that are not Sharliz may have them)"""
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        part('eye' + sd, S.decal(ELLIPSE, sx * ex, ez, ew, eh, bulge=.02), col, role='eye', ink=0, rough=.1, cc=1, pivot=(sx * ex, -.3, ez))
        if glint:
            part('glint' + sd, S.decal(ELLIPSE, sx * ex - ew * .3, ez + eh * .35, ew * .32, eh * .28, bulge=.004, lift=.022), '#ffffff', role='eye', ink=0, rough=.1, cc=1,
                 emis='#ffffff', ei=.6, pivot=(sx * ex, -.3, ez))


def mouth_open(S, mx, mz, mw, mh, tongue=True):
    part('mouth', S.decal(D_SMILE, mx, mz, mw, mh, bulge=.006, lift=.003), '#3b0f22', role='mouth', ink=.006, rough=.5, cc=.2)
    if tongue:
        part('tongue', S.decal(lambda u, v: u * u + (v + .35) ** 2 <= .36 and v <= .05, mx, mz - mh * .45, mw * .55, mh * .55, bulge=.004, lift=.008),
             '#ff6f8f', role='mouth', ink=0, rough=.4, cc=.3)


def mouth_smile(S, mx, mz, mw, mh, r=.013):
    part('mouth', S.stroke(arc_pts(mx, mz, mw, mh, up=False), r=r), INK_C, role='mouth', ink=0, rough=.3, cc=.6)


def blush(S, bx, bz, bw, bh, col='#ff8fb0', op=.75):
    for sx in (-1, 1):
        part('blush' + ('L' if sx < 0 else 'R'), S.decal(ELLIPSE, sx * bx, bz, bw, bh, bulge=.004, lift=.003), col, role='blush', ink=0, rough=.5, cc=.2, opacity=op)


def lathe_bm(profile, seg=48, wav=None):
    """surface of revolution around Z: profile = [(r, z), ...] bottom->top. wav(a, z) -> radius/height wobble (dr, dz)"""
    bm = bmesh.new(); rows = []
    for r, z in profile:
        row = []
        for j in range(seg):
            a = j / seg * math.tau; dr, dz = wav(a, z) if wav else (0, 0)
            row.append(bm.verts.new((math.cos(a) * (r + dr), math.sin(a) * (r + dr), z + dz)))
        rows.append(row)
    for i in range(len(rows) - 1):
        for j in range(seg):
            k = (j + 1) % seg
            bm.faces.new((rows[i][j], rows[i][k], rows[i + 1][k], rows[i + 1][j]))
    for row, z in ((rows[0], profile[0][1]), (rows[-1], profile[-1][1])):
        if (row[0].co.xy.length > 1e-4):
            c = bm.verts.new((0, 0, sum(v.co.z for v in row) / len(row)))
            for j in range(seg): bm.faces.new((row[j], row[(j + 1) % seg], c))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


def star_outline(n=5, r1=.55, r2=.3, p=1.6, N=120):
    """smooth puffy star: radius r(θ) blends between inner and outer radius, tips and valleys are round"""
    pts = []
    for i in range(N):
        t = i / N * math.tau; k = ((1 + math.cos(n * t)) / 2) ** p
        r = r2 + (r1 - r2) * k; a = t + math.pi / 2
        pts.append((math.cos(a) * r, math.sin(a) * r))
    return pts


def pillow_bm(outline, H=.12, cuts=4, power=.5):
    """inflated flat shape (a balloon/cushion): outline in the XZ plane, both faces bulge by H*(d/dmax)^power,
    d = distance to the outline. Good for stars, cookies, flat wings."""
    bm = bmesh.new()
    vs = [bm.verts.new((u, 0, v)) for u, v in outline]
    for a_, b_ in zip(vs, vs[1:] + vs[:1]): bm.edges.new((a_, b_))
    bmesh.ops.triangle_fill(bm, use_beauty=True, use_dissolve=False, edges=bm.edges[:])
    for _ in range(cuts):
        inner = [e for e in bm.edges if len(e.link_faces) == 2]
        bmesh.ops.subdivide_edges(bm, edges=inner, cuts=1, use_grid_fill=False)
        bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bmesh.ops.beautify_fill(bm, faces=bm.faces[:], edges=bm.edges[:])
    seg = [(Vector((outline[i][0], outline[i][1])), Vector((outline[(i + 1) % len(outline)][0], outline[(i + 1) % len(outline)][1]))) for i in range(len(outline))]
    def dist(p):
        best = 9
        for a_, b_ in seg:
            ab = b_ - a_; t = max(0, min(1, (p - a_).dot(ab) / max(1e-9, ab.length_squared)))
            best = min(best, (p - (a_ + ab * t)).length)
        return best
    ds = {v: dist(Vector((v.co.x, v.co.z))) for v in bm.verts}
    dm = max(ds.values()) or 1
    for f in bm.faces:
        if f.normal.y > 0: f.normal_flip()
    # back copy
    back = bm.copy()
    for v in bm.verts: v.co.y = -H * (ds[v] / dm) ** power
    bvs = list(back.verts)
    for v, fv in zip(bvs, list(bm.verts)): v.co.y = -fv.co.y
    for f in back.faces: f.normal_flip()
    tmp = bpy.data.meshes.new('t'); back.to_mesh(tmp); back.free(); bm.from_mesh(tmp); bpy.data.meshes.remove(tmp)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


def band_bm(S, z0, z1, off=.004):
    """a stripe around a body: the body faces between heights z0..z1, pushed out a little and closed"""
    bm = S.bm.copy()
    kill = [v for v in bm.verts if not (z0 <= v.co.z <= z1)]
    bmesh.ops.delete(bm, geom=kill, context='VERTS')
    bm.normal_update()
    for v in bm.verts: v.co += v.normal * off
    ret = bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=-.006)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


def snowman_bm(r1, z1, r2, z2, seg=48, rows=44, k=7., wx=1., wy=1.):
    """one smooth surface of revolution = union of two spheres (body r1 at z1, head r2 at z2) with a soft neck (smooth max)"""
    zb, zt = z1 - r1, z2 + r2; prof = []
    for i in range(rows + 1):
        z = zb + (zt - zb) * i / rows
        a = math.sqrt(max(0., r1 * r1 - (z - z1) ** 2)); b = math.sqrt(max(0., r2 * r2 - (z - z2) ** 2))
        prof.append((max(.003, (a ** k + b ** k) ** (1 / k)), z))
    bm = lathe_bm(prof, seg=seg)
    if wx != 1 or wy != 1: bmesh.ops.scale(bm, vec=(wx, wy, 1), verts=bm.verts)
    return bm


def foot_bm(at, sx=1, s=1., toes=3):
    """a little 3-toed foot (pad + toes) pointing to the front (-Y); at = (x, y, z) of the pad centre"""
    bm = ellipsoid_bm(.075 * s, .085 * s, .04 * s, at=at, seg=16, rings=10)
    for i in range(toes):
        f = (i - (toes - 1) / 2) / max(1, (toes - 1) / 2)
        bm_merge(bm, ellipsoid_bm(.033 * s, .06 * s, .032 * s, at=(at[0] + f * .055 * s, at[1] - .085 * s - (1 - abs(f)) * .02 * s, at[2] - .002), seg=12, rings=8,
                                  rot=Matrix.Rotation(-f * .35, 3, 'Z')))
    return bm


def tuft_bm(at, n=3, h=.15, r=.035, spread=.5, back=.0):
    """n little feather/hair tubes fanning out of `at` (top of the head)"""
    bm = bmesh.new()
    for i in range(n):
        t = (i - (n - 1) / 2) / max(1, (n - 1) / 2) * spread
        pts = smooth_path([Vector(at) + Vector((math.sin(t) * h * f * (0.6 + f), back * f, math.cos(t) * h * f * (1.1 - .25 * f))) for f in (0, .35, .7, 1.)], 4)
        bm_merge(bm, tube_bm(pts, radii(r, r * .3, len(pts)), seg=8))
    return bm


def beak_bm(at, up=.1, size=1., gap=.035):
    """small open bird beak at `at` on the face (front -Y): upper + lower cone"""
    bm = spike_bm(Vector(at) + Vector((0, 0, gap * .5)), (0, -1, up), r=.06 * size, h=.12 * size, seg=12)
    bm_merge(bm, spike_bm(Vector(at) - Vector((0, 0, gap * .5)), (0, -1, -.3), r=.05 * size, h=.095 * size, seg=12))
    return bm


def curl_pts(start, d, up, r0, r1, turns=1.1, n=18, out=.0):
    """points of a spiral in the vertical plane spanned by d (horizontal unit Vector) and `up`: starts at `start`, radius r0 -> r1"""
    pts = []
    for i in range(n + 1):
        f = i / n; a = f * turns * math.tau; r = r0 + (r1 - r0) * f
        pts.append(Vector(start) + d * (math.sin(a) * r + out * f) + Vector((0, 0, 1)) * (r - math.cos(a) * r) * up)
    return pts


def ridged_cone_bm(r, h, ridges=4, amp=.012, seg=24, rows=40):
    """unicorn-style horn: a cone with soft rings around it"""
    prof = [(max(.003, r * (1 - i / rows) ** .9 + amp * max(0., math.sin(i / rows * math.tau * ridges)) + .006), h * i / rows) for i in range(rows + 1)]
    return lathe_bm(prof, seg=seg)


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


def mouth_small(S, mx, mz, mw, mh, lift=.004, col='#c21f55', tongue=True):
    """little open 'o' mouth: dark pink oval with a lighter tongue in its lower half"""
    part('mouth', S.decal(ELLIPSE, mx, mz, mw, mh, bulge=.005, lift=lift), col, role='mouth', ink=.005, rough=.45, cc=.3)
    if tongue:
        part('tongue', S.decal(ELLIPSE, mx, mz - mh * .4, mw * .6, mh * .45, bulge=.004, lift=lift + .006), '#ff7f9f', role='mouth', ink=0, rough=.4, cc=.3)


def nubs(S, x, z, r=.06, y=None, name='arms', col='#000000', ink=.01, out=.0, down=.0):
    """two little stub arms on the sides of a body (ellipsoids half sunk into the surface)"""
    bm = bmesh.new()
    for sx in (-1, 1):
        at = Vector((sx * x, y if y is not None else 0., z))
        bm_merge(bm, ellipsoid_bm(r * 1.1, r, r * 1.3, at=tuple(at + Vector((sx * out, 0, -down))), seg=16, rings=10, rot=Matrix.Rotation(sx * -.5, 3, 'Y')))
    part(name, bm, col, role='arms', ink=ink)


# ---------------- the nine existing buddies (designs from their album stickers art/stk_p_<id>) ----------------
def build_chick():
    """turnaround design/buddies/turn/turn_chick.png: two yellow balls (head on body), 3 head feathers, happy closed eyes, blush,
    open orange beak, wings up like cheering, orange 3-toed feet"""
    Y, Y2, OR = '#ffd84a', '#ffc632', '#ff9a2e'
    body = snowman_bm(.36, .36, .32, .78, k=9, wx=1.04, wy=1.)
    S = Surface(body)
    part('body', body, Y, role='body', ink=.014, rough=.3, cc=.7)
    eyes_happy(S, .13, .83, .085, .055, r=.02)
    blush(S, .23, .74, .06, .032)
    part('beak', beak_bm((0, -.28, .74), up=.15, size=1.15, gap=.06), OR, role='beak', ink=.01)
    part('mouthIn', ellipsoid_bm(.04, .06, .02, at=(0, -.3, .74), seg=12, rings=8), '#b3233f', role='mouth', ink=0, rough=.5, cc=.2)
    part('tuft', tuft_bm((0, -.01, 1.07), n=3, h=.15, r=.035, spread=.55), Y, role='horn', ink=.01)
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        piv = Vector((sx * .32, .02, .5))
        w = ellipsoid_bm(.075, .055, .21, at=(0, 0, .17), seg=18, rings=12)
        bmesh.ops.transform(w, matrix=Matrix.Translation(piv) @ Matrix.Rotation(sx * .8, 4, 'Y'), verts=w.verts)
        part('wing' + sd, w, Y2, role='wing' + sd, ink=.011, pivot=tuple(piv))
    feet = bmesh.new()
    for sx in (-1, 1): bm_merge(feet, foot_bm((sx * .16, -.24, .035), sx, s=1.2))
    part('feet', feet, OR, role='feet', ink=.01)


def build_slime():
    """turn_slime.png: green glossy dome whose base spreads into round lobes, huge white Sharliz eyes, tiny open mouth, a drip at the back"""
    G = '#7be24a'
    prof = [(.28, 0.), (.36, .012), (.405, .035), (.415, .07), (.405, .11)]
    for i in range(1, 24):
        f = i / 23; a = f * math.pi / 2
        prof.append((max(.003, .385 * math.cos(a) ** .6), .11 + .39 * math.sin(a) ** 1.1))
    def wav(a, z):
        k = max(0., 1 - z / .17) ** 1.5; lobe = max(0., math.cos(a * 7)) ** 1.3
        return (.075 * k * (.2 + .8 * lobe), 0)
    body = lathe_bm(prof, seg=84, wav=wav)
    S = Surface(body)
    part('body', body, G, role='body', ink=.014, rough=.06, cc=1)
    eyes_open(S, .155, .3, .125, .155, rim=.017)
    mouth_small(S, 0, .145, .04, .035, tongue=False)
    blush(S, .3, .2, .045, .025, op=.45)
    drip = spike_bm(Vector((0, .3, .1)), (0, .25, 1), r=.055, h=.2, seg=12)
    bm_merge(drip, ellipsoid_bm(.055, .055, .06, at=(0, .3, .1), seg=14, rings=10))
    part('drip', drip, G, role='drops', ink=.009, rough=.06, cc=1)


def build_ghost():
    """turn_ghost.png: white sheet ghost, wavy hem, two black oval eyes, little stub arms, no mouth"""
    W = '#f8f6ff'
    prof = [(.36, 0.0), (.365, .08), (.36, .25), (.35, .45), (.33, .6), (.29, .72), (.22, .82), (.13, .89), (.003, .92)]
    hem = lambda a, z: (.012 * math.sin(a * 6) * max(0, 1 - z / .14), .05 * math.sin(a * 6) * max(0, 1 - z / .14))
    body = lathe_bm(prof, seg=60, wav=hem)
    S = Surface(body)
    part('body', body, W, role='body', ink=.014, rough=.3, cc=.5)
    inner = lathe_bm([(.33, .02), (.003, .05)], seg=60, wav=lambda a, z: (0, .05 * math.sin(a * 6)))
    part('hollow', inner, '#d9d2ee', role='body', ink=0, rough=.6, cc=0)
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        part('eye' + sd, S.decal(ELLIPSE, sx * .12, .61, .06, .092, bulge=.02), INK_C, role='eye', ink=0, rough=.12, cc=1, pivot=(sx * .12, -.3, .61))
        part('glint' + sd, S.decal(ELLIPSE, sx * .12 - .014, .64, .016, .02, bulge=.003, lift=.022), '#ffffff', role='eye', ink=0, rough=.1, cc=1, emis='#ffffff', ei=.5, pivot=(sx * .12, -.3, .61))
    arms = bmesh.new()
    for sx in (-1, 1):
        bm_merge(arms, ellipsoid_bm(.085, .05, .045, at=(sx * .36, -.03, .39), seg=16, rings=10, rot=Matrix.Rotation(sx * -.35, 3, 'Y')))
    part('arms', arms, W, role='arms', ink=.008, rough=.3, cc=.5)


def build_bee():
    """v2 (Fable, Oct 7): one egg body PAINTED by a texture (black heart-shaped head cap with a notch at the top, two stripes),
    happy closed eyes, smile, blush, antennae, two see-through wings up at the back, small stinger. Tzach approved the look."""
    from PIL import Image
    Yb, Bk = '#ffd23f', '#1d1530'
    W, D, H, TAP = .86, .82, .9, .12
    body = egg_bm(W, D, H, taper=TAP); uv_equirect(body, 0, H)
    S = Surface(body)
    def rad(zn):                                   # horizontal radius of egg_bm at normalised height zn (-1..1), roughly
        k = 1 - TAP * max(0, zn) - .04 * max(0, -zn)
        return W / 2 * k * math.sqrt(max(0., 1 - zn * zn))
    def cap_line(u):
        du = abs(u - .5); bump = math.cos(math.pi * du / .30) if du < .30 else 0.
        return .63 - .17 * max(0., bump) ** 1.2
    def col(u, v):
        zn = 2 * v - 1; z = (zn + 1) / 2 * H; r = rad(zn)
        x = r * math.sin((u - .5) * math.tau); y = -r * math.cos((u - .5) * math.tau)
        if y < .05 and z > .62 and abs(x) < .015 + .6 * (z - .62): return Yb        # yellow V notch, top front
        if v > cap_line(u): return Bk
        if .31 < v < .375 or .14 < v < .20: return Bk
        return Yb
    TW, TH = 1024, 512; im = Image.new('RGB', (TW, TH)); px = im.load()
    h2rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
    for j in range(TH):
        v = 1 - (j + .5) / TH
        for i in range(TW): px[i, j] = h2rgb(col((i + .5) / TW, v))
    im = im.resize((512, 256), Image.LANCZOS)
    part('body', body, '#ffffff', role='body', ink=.014, rough=.28, cc=.8, tex=im)
    for sx, nm in ((-1, 'eyeL'), (1, 'eyeR')):
        loc, _ = S.hit(sx * .145, .62)
        part(nm, S.stroke(arc_pts(sx * .145, .62, .075, .055, up=True), r=.019, lift=.01), '#ffffff', role='eye', ink=0, rough=.2, cc=.8, emis='#ffffff', ei=.3, pivot=tuple(loc))
    part('mouth', S.stroke(arc_pts(0, .52, .045, .03, up=False, n=7), r=.013, lift=.01), '#ffffff', role='mouth', ink=0, rough=.3, cc=.6, emis='#ffffff', ei=.2)
    bl = bmesh.new()
    for sx in (-1, 1): bm_merge(bl, S.decal(ELLIPSE, sx * .26, .53, .055, .04, bulge=.012, lift=.003))
    part('blush', bl, '#ff8fb1', role='blush', ink=0, rough=.6, cc=.3, opacity=.85)
    ant = bmesh.new()
    for sx in (-1, 1):
        base = Vector((sx * .11, -.04, H - .03))
        pts = [base + Vector((sx * .22 * t * t, -.02 * t, .26 * t - .05 * t * t)) for t in (0, .25, .5, .75, 1)]
        bm_merge(ant, tube_bm(pts, [.017] * 5, seg=8)); bm_merge(ant, ellipsoid_bm(.045, .045, .045, at=tuple(pts[-1]), seg=14, rings=10))
    part('antennae', ant, Bk, role='horn', ink=.009, rough=.35, cc=.7)
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        # thin oval, long axis along ±X, facing the front; root at the pivot, tip up and out, swept a little back
        w = ellipsoid_bm(.28, .012, .14, at=(sx * .27, 0, 0), seg=24, rings=12)
        R = Matrix.Rotation(math.radians(sx * 22), 3, 'Z') @ Matrix.Rotation(math.radians(-42 * sx), 3, 'Y')
        piv = Vector((sx * .13, .13, .62))
        bmesh.ops.transform(w, matrix=Matrix.Translation(piv) @ R.to_4x4(), verts=w.verts)
        part('wing' + sd, w, '#f4faff', role='wing' + sd, ink=.008, rough=.1, cc=1, opacity=.92, emis='#e4f4ff', ei=.8, pivot=tuple(piv))
    part('stinger', spike_bm(Vector((0, .35, .16)), (0, .5, -.9), r=.04, h=.09, seg=10), Bk, role='tail', ink=.009, pivot=(0, .36, .17))


def build_star():
    """turn_star.png: puffy golden star, happy closed eyes, blush, open mouth with tongue"""
    Y = '#ffd12e'
    out = star_outline(5, .55, .31, p=1.45, N=90)
    st = pillow_bm(out, H=.21, cuts=3, power=.5)
    bmesh.ops.translate(st, vec=(0, 0, .5), verts=st.verts)
    S = Surface(st)
    part('body', st, Y, role='body', ink=.014, emis='#ffb000', ei=.4, rough=.25, cc=.7)
    eyes_happy(S, .115, .55, .062, .05, r=.017)
    mouth_open(S, 0, .455, .05, .045)
    blush(S, .21, .48, .045, .026)


def build_mini():
    """turn_mini.png: a plain teal Sharliz egg, huge white eyes, tiny pink open mouth"""
    body = egg_bm(.78, .74, 1., taper=.22)
    S = Surface(body)
    part('body', body, '#44d2dc', role='body', ink=.016)
    eyes_open(S, .165, .59, .14, .175, rim=.02)
    mouth_small(S, 0, .395, .04, .04)


def build_cyborg():
    """turn_cyborg.png: silver metal egg, big white eyes, glowing pink screen mouth, red antenna ball on top, a seam around the head cap,
    glowing purple discs on the sides"""
    M, DK = '#c9ccd8', '#454a5e'
    body = egg_bm(.8, .76, 1., taper=.22)
    S = Surface(body)
    part('body', body, M, role='body', ink=.014, metal=.4, rough=.28, cc=.8)
    zn = 2 * .86 - 1; kk = 1 - .22 * zn; rx, ry = .4 * kk * math.sqrt(1 - zn * zn), .38 * kk * math.sqrt(1 - zn * zn)
    ring = tube_bm([Vector((math.sin(a) * rx, -math.cos(a) * ry, .86)) for a in [i / 48 * math.tau for i in range(49)]], [.007] * 49, seg=8)
    bm_merge(ring, S.stroke([(0, .87), (0, .95)], r=.007, lift=.0, sink=.2))
    part('seam', ring, '#6f7488', role='body', ink=0, metal=.6, rough=.3)
    eyes_open(S, .17, .6, .13, .165, rim=.02)
    part('screen', S.decal(lambda u, v: abs(u) ** 8 + abs(v) ** 8 <= 1, 0, .40, .08, .042, bulge=.006, lift=.004), '#ff7fc4', role='glow', ink=.006, emis='#ff3fa0', ei=1.0, rough=.2)
    ant = tube_bm([Vector((0, 0, .97)), Vector((0, 0, 1.05)), Vector((0, 0, 1.13))], [.02, .019, .018], seg=10)
    part('antenna', ant, DK, role='horn', ink=.007, metal=.5, rough=.3)
    part('bulb', ellipsoid_bm(.075, .075, .075, at=(0, 0, 1.2)), '#ff2a3a', role='glow', ink=.009, emis='#ff0a20', ei=.9, rough=.15, cc=1)
    for sx in (-1, 1):
        sd = 'L' if sx < 0 else 'R'
        ring = bmesh.new(); bmesh.ops.create_cone(ring, cap_ends=True, segments=28, radius1=.11, radius2=.11, depth=.05)
        bmesh.ops.transform(ring, matrix=Matrix.Translation((sx * .395, .02, .6)) @ Matrix.Rotation(math.pi / 2, 4, 'Y'), verts=ring.verts)
        part('earRing' + sd, ring, DK, role='part', ink=.009, metal=.5, rough=.3)
        core = bmesh.new(); bmesh.ops.create_cone(core, cap_ends=True, segments=24, radius1=.078, radius2=.078, depth=.07)
        bmesh.ops.transform(core, matrix=Matrix.Translation((sx * .4, .02, .6)) @ Matrix.Rotation(math.pi / 2, 4, 'Y'), verts=core.verts)
        part('ear' + sd, core, '#8a5cff', role='glow', ink=0, emis='#9a4dff', ei=.9, rough=.2, cc=1)


def build_unicorn():
    """turn_unicorn.png: white egg, ringed golden horn, happy closed eyes with lashes, blush, open mouth (no ears, no mane)"""
    W = '#fdfbff'
    body = egg_bm(.8, .76, .96, taper=.2)
    S = Surface(body)
    part('body', body, W, role='body', ink=.014, rough=.22, cc=.9)
    eyes_happy(S, .165, .58, .095, .085, r=.019, lashes=True)
    mouth_open(S, 0, .435, .06, .055)
    blush(S, .3, .49, .06, .03)
    horn = ridged_cone_bm(.09, .27, ridges=4, amp=.011)
    bmesh.ops.transform(horn, matrix=Matrix.Translation((0, -.05, .9)) @ Matrix.Rotation(.2, 4, 'X'), verts=horn.verts)
    part('horn', horn, '#f5b73a', role='horn', ink=.01, metal=.5, rough=.25, emis='#c8860f', ei=.15)


def build_dino():
    """turn_dino.png: green baby dino hatching: bottom shell with a zigzag rim, green spots + cracks, shell cap on its head,
    glossy black eyes, snout with nostrils, open smile, arms on the rim, bumps down the back, tail out the back"""
    G, G2, SH, SP = '#5fc95c', '#8fdc6c', '#f3e9d2', '#8fd16a'
    # bottom shell
    prof = []
    for i in range(16):
        f = i / 15; a = -math.pi / 2 + f * math.pi * .55
        prof.append((max(.003, .43 * math.cos(a)), .43 + .43 * math.sin(a)))
    zig = lambda a, z: (0, (.035 * (2 * abs(((a / math.tau * 11) % 1) - .5) * 2 - 1)) * max(0., (z - .33) / .12))
    shell = lathe_bm(prof, seg=66, wav=zig)
    SS = Surface(shell)
    part('shell', shell, SH, role='shell', ink=.013, rough=.45, cc=.3)
    # the baby dino: head + snout in one surface
    head = ellipsoid_bm(.34, .32, .32, at=(0, -.02, .66), seg=36, rings=20)
    bm_merge(head, ellipsoid_bm(.19, .16, .12, at=(0, -.28, .56), seg=24, rings=12))
    S = Surface(head)
    part('head', head, G, role='body', ink=.013)
    eyes_dot(S, .14, .73, .058, .075)
    blush(S, .25, .63, .055, .03)
    mouth_open(S, 0, .485, .095, .05)
    nos = bmesh.new()
    for sx in (-1, 1): bm_merge(nos, ellipsoid_bm(.015, .015, .012, at=(sx * .055, -.37, .665), seg=10, rings=6))
    part('nostrils', nos, '#2b6b2e', role='part', ink=0)
    # shell cap on the head
    cprof = [(max(.003, .40 * math.sqrt(max(0., 1 - (z / .36) ** 2))), z) for z in [i / 12 * .32 for i in range(13)]]
    czig = lambda a, z: (0, (.03 * (2 * abs(((a / math.tau * 9) % 1) - .5) * 2 - 1)) * max(0., 1 - z / .08))
    cap = lathe_bm(cprof, seg=54, wav=czig)
    bmesh.ops.transform(cap, matrix=Matrix.Translation((0.02, -.01, .8)) @ Matrix.Rotation(.1, 4, 'Y') @ Matrix.Rotation(-.08, 4, 'X'), verts=cap.verts)
    CS = Surface(cap)
    part('cap', cap, SH, role='shell', ink=.013, rough=.45, cc=.3)
    # spots on cap + shell, cracks on the shell
    spots = bmesh.new()
    for x, z, r, SURF, fr in [(.1, .9, .05, CS, 1), (-.15, .86, .04, CS, 1), (.2, .82, .035, CS, -1), (-.05, .95, .035, CS, -1),
                               (.2, .2, .055, SS, -1), (-.22, .28, .045, SS, -1), (.02, .1, .04, SS, -1), (-.1, .32, .03, SS, -1), (.15, .25, .05, SS, 1), (-.2, .15, .04, SS, 1)]:
        loc, nrm = SURF.hit(x, z, front=fr)
        if loc is not None: bm_merge(spots, ellipsoid_bm(r, r, r * .3, at=tuple(loc), rot=Vector((0, 0, 1)).rotation_difference(nrm).to_matrix()))
    part('spots', spots, SP, role='shell', ink=0, rough=.45, cc=.3)
    cr = bmesh.new()
    for pts in [[(.1, .38), (.14, .3), (.1, .24), (.15, .17)], [(-.2, .36), (-.24, .3), (-.21, .25)]]:
        bm_merge(cr, SS.stroke(pts, r=.006, lift=0, sink=.5, seg=6))
    part('cracks', cr, '#b8a98a', role='shell', ink=0, rough=.6)
    arms = bmesh.new()
    for sx in (-1, 1): bm_merge(arms, ellipsoid_bm(.065, .1, .05, at=(sx * .21, -.35, .5), rot=Matrix.Rotation(sx * .3, 3, 'Z')))
    part('arms', arms, G, role='arms', ink=.01)
    spk = bmesh.new()
    for y, z, r in [(.27, .84, .04), (.3, .73, .045), (.28, .62, .045)]:
        bm_merge(spk, ellipsoid_bm(r, r * .8, r * 1.2, at=(0, y + .02, z), seg=14, rings=10))
    part('spikes', spk, G2, role='horn', ink=.009)
    pts = smooth_path([Vector((.1, .33, .42)), Vector((.16, .48, .34)), Vector((.14, .56, .2)), Vector((.08, .58, .07))], 5)
    part('tail', tube_bm(pts, radii(.075, .03, len(pts)), seg=10), G, role='tail', ink=.011, pivot=(.1, .33, .42))


PETS = {'dragon': (build_dragon, dict(height=.64, flt=0)),
        'chick': (build_chick, dict(height=.5, flt=0)),
        'slime': (build_slime, dict(height=.33, flt=0)),
        'ghost': (build_ghost, dict(height=.55, flt=1)),
        'bee': (build_bee, dict(height=.5, flt=1, anim={'wing': [30, .25]})),
        'star': (build_star, dict(height=.5, flt=1)),
        'mini': (build_mini, dict(height=.42, flt=0)),
        'cyborg': (build_cyborg, dict(height=.66, flt=0)),
        'unicorn': (build_unicorn, dict(height=.66, flt=0)),
        'dino': (build_dino, dict(height=.58, flt=0))}

try:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))   # python -I drops the script dir
    from pets_new import PETS_NEW; PETS.update(PETS_NEW)      # the 11 new buddies (tools/pets/pets_new.py)
except ImportError as e:
    print('pets_new not loaded:', e)

if __name__ == '__main__':
    ids = sys.argv[1:] or list(PETS)
    for pid in ids:
        reset(); fn, kw = PETS[pid]; fn(); export(pid, kw.get('height', .56), kw.get('flt', 1), {'anim': kw['anim']} if 'anim' in kw else None)
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join('/tmp', 'pet_%s.blend' % pid))
