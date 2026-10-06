"""GLB (Meshy output) -> compact Sharliz boss format: <name>.bin + textures (.webp) + meta json.
bin layout: positions f32[3n] | normals i8[3n] (padded to 4) | uvs f32[2n] | indices u32[m] (or u16)"""
import json, struct, sys, io, os
import numpy as np
from PIL import Image

CT = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
NC = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}

def load(path):
    b = open(path, 'rb').read()
    magic, ver, ln = struct.unpack('<4sII', b[:12]); assert magic == b'glTF'
    o = 12; js = None; bin_ = None
    while o < ln:
        cl, ctp = struct.unpack('<II', b[o:o+8]); d = b[o+8:o+8+cl]
        if ctp == 0x4E4F534A: js = json.loads(d)
        elif ctp == 0x004E4942: bin_ = d
        o += 8 + cl
    return js, bin_

def acc(js, bin_, i):
    a = js['accessors'][i]; bv = js['bufferViews'][a['bufferView']]
    dt = CT[a['componentType']]; n = NC[a['type']]; cnt = a['count']
    off = bv.get('byteOffset', 0) + a.get('byteOffset', 0); stride = bv.get('byteStride')
    isz = np.dtype(dt).itemsize * n
    if stride and stride != isz:
        raw = np.frombuffer(bin_, np.uint8, count=stride*(cnt-1)+isz, offset=off)
        arr = np.stack([np.frombuffer(raw[k*stride:k*stride+isz].tobytes(), dt) for k in range(cnt)])
    else:
        arr = np.frombuffer(bin_, dt, count=cnt*n, offset=off).reshape(cnt, n) if n > 1 else np.frombuffer(bin_, dt, count=cnt, offset=off)
    if a.get('normalized') and dt != np.float32:
        arr = arr.astype(np.float32) / np.iinfo(dt).max
    return np.array(arr)

def quat_mat(q):
    x, y, z, w = q
    return np.array([[1-2*(y*y+z*z), 2*(x*y-z*w), 2*(x*z+y*w)], [2*(x*y+z*w), 1-2*(x*x+z*z), 2*(y*z-x*w)], [2*(x*z-y*w), 2*(y*z+x*w), 1-2*(x*x+y*y)]])

def node_mat(nd):
    M = np.eye(4)
    if 'matrix' in nd: return np.array(nd['matrix']).reshape(4, 4).T
    T = np.eye(4); T[:3, 3] = nd.get('translation', [0, 0, 0])
    R = np.eye(4); R[:3, :3] = quat_mat(nd.get('rotation', [0, 0, 0, 1]))
    S = np.diag(list(nd.get('scale', [1, 1, 1])) + [1])
    return T @ R @ S

def image_bytes(js, bin_, ti):
    tex = js['textures'][ti]; im = js['images'][tex['source']]
    bv = js['bufferViews'][im['bufferView']]; o = bv.get('byteOffset', 0)
    return bin_[o:o+bv['byteLength']]

def main(path, name, outdir, tex=1024):
    js, bin_ = load(path)
    # walk nodes, collect primitives with world matrices
    prims = []
    def walk(ni, M):
        nd = js['nodes'][ni]; M2 = M @ node_mat(nd)
        if 'mesh' in nd:
            for p in js['meshes'][nd['mesh']]['primitives']: prims.append((p, M2))
        for c in nd.get('children', []): walk(c, M2)
    for ni in js['scenes'][js.get('scene', 0)]['nodes']: walk(ni, np.eye(4))
    P = []; N = []; U = []; I = []; base = 0; mat = None
    for p, M in prims:
        at = p['attributes']; pos = acc(js, bin_, at['POSITION']).astype(np.float64)
        pos = (np.c_[pos, np.ones(len(pos))] @ M.T)[:, :3]
        nrm = acc(js, bin_, at['NORMAL']) if 'NORMAL' in at else np.zeros_like(pos)
        nrm = nrm @ np.linalg.inv(M[:3, :3]).T; nrm /= np.maximum(1e-8, np.linalg.norm(nrm, axis=1, keepdims=True))
        uv = acc(js, bin_, at['TEXCOORD_0']) if 'TEXCOORD_0' in at else np.zeros((len(pos), 2))
        idx = acc(js, bin_, p['indices']).astype(np.int64) if 'indices' in p else np.arange(len(pos))
        P.append(pos); N.append(nrm); U.append(uv); I.append(idx + base); base += len(pos)
        if mat is None and 'material' in p: mat = js['materials'][p['material']]
    P = np.concatenate(P); N = np.concatenate(N); U = np.concatenate(U); I = np.concatenate(I)
    # normalise: feet on y=0, centred in x/z, height 1
    lo, hi = P.min(0), P.max(0); h = hi[1] - lo[1]
    P = (P - [(lo[0]+hi[0])/2, lo[1], (lo[2]+hi[2])/2]) / h
    n = len(P); it = np.uint16 if n < 65536 else np.uint32
    os.makedirs(outdir, exist_ok=True)
    parts = [P.astype(np.float32).tobytes()]
    nb = np.clip(np.round(N*127), -127, 127).astype(np.int8).tobytes(); nb += b'\0' * ((-len(nb)) % 4); parts.append(nb)
    parts.append(U.astype(np.float32).tobytes()); parts.append(I.astype(it).tobytes())
    open(f'{outdir}/{name}.bin', 'wb').write(b''.join(parts))
    meta = {'n': int(n), 'm': int(len(I)), 'i32': it == np.uint32, 'nb': len(nb), 'w': float((hi[0]-lo[0])/h), 'd': float((hi[2]-lo[2])/h), 'tex': {}}
    pbr = (mat or {}).get('pbrMetallicRoughness', {})
    slots = {'map': pbr.get('baseColorTexture'), 'mr': pbr.get('metallicRoughnessTexture'), 'nrm': (mat or {}).get('normalTexture')}
    for k, t in slots.items():
        if not t: continue
        im = Image.open(io.BytesIO(image_bytes(js, bin_, t['index'])))
        im = im.convert('RGB'); im = im.resize((tex, tex), Image.LANCZOS) if max(im.size) > tex else im
        im.save(f'{outdir}/{name}_{k}.webp', quality=86 if k == 'map' else 80, method=6); meta['tex'][k] = f'{name}_{k}.webp'
    meta['mf'] = pbr.get('metallicFactor', 1); meta['rf'] = pbr.get('roughnessFactor', 1)
    json.dump(meta, open(f'{outdir}/{name}.json', 'w'))
    print(name, meta, 'bin', os.path.getsize(f'{outdir}/{name}.bin'))

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3])
