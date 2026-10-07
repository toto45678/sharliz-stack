"""Grayscale height tile (from ChatGPT, white = raised) -> tangent-space normal map, seamless.
python3 tools/pets/nrm.py in_height.png out_normal.png [strength=2.0] [size=512]
Use the result with part(..., nrm=Image.open(out), ns=1) in pets.py (the UVs come from uv_equirect, so the tile repeats around the body)."""
import sys, numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
strength = float(sys.argv[3]) if len(sys.argv) > 3 else 2.0
size = int(sys.argv[4]) if len(sys.argv) > 4 else 512
h = np.asarray(Image.open(src).convert('L').resize((size, size), Image.LANCZOS), dtype=np.float32) / 255.
# soften a little so cartoon tiles don't produce razor edges
k = np.array([1, 4, 6, 4, 1], np.float32); k = np.outer(k, k); k /= k.sum()
pad = np.pad(h, 2, mode='wrap'); hs = np.zeros_like(h)
for dy in range(5):
    for dx in range(5): hs += k[dy, dx] * pad[dy:dy + size, dx:dx + size]
dx = (np.roll(hs, -1, 1) - np.roll(hs, 1, 1)) * strength * size / 2 / 64   # wrap = seamless
dy = (np.roll(hs, -1, 0) - np.roll(hs, 1, 0)) * strength * size / 2 / 64
nx, ny, nz = -dx, dy, np.ones_like(hs)           # +Y up in tangent space (OpenGL convention, three.js)
l = np.sqrt(nx * nx + ny * ny + nz * nz)
rgb = np.stack([nx / l, ny / l, nz / l], -1) * .5 + .5
Image.fromarray((rgb * 255).round().astype(np.uint8)).save(dst, quality=95)
print('wrote', dst, size, 'x', size)
