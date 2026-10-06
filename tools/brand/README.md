Logo + home-screen icon concepts (thread "logo & icon", Oct 2026).
1. Serve the repo (`python3 -m http.server 8799`) and run `python3 tools/brand/render.py <dir>` → renders the real 3D Sharliz (from the game's three.js code) as transparent PNGs.
2. Crop/saturate them into the same dir as icons.html/logos.html (+ art/fonts/*.woff, art/skin_king.webp, art/ribbon.webp), serve it on :8800 and run `snap.py icons.html <out>` / `snap.py logos.html <out>`.
