# Sharliz Stack (שארליז) — notes for every Claude session

Mobile tower-stacking game by **Tzach** (talks Hebrew — always answer him in Hebrew, step by step, short).
You drop swinging "Sharliz" blobs to build a tower; 8 worlds × 10 levels, a boss every 10th level.

- **Live game (iPhone home-screen app / PWA):** https://toto45678.github.io/sharliz-stack/
  Every push to `main` redeploys via `.github/workflows/pages.yml` (GitHub Pages, source = GitHub Actions) in ~1 min.
- Older preview channel: a private claude.ai artifact (`https://claude.ai/artifact/3ZD3gfHRyp8v5JSfPA1yYS`). GitHub Pages is now the main channel.
- Tzach's local copy: `C:\Users\Tzach\Desktop\SHARLIZ GAME\game\` (only reachable when a session is linked to his PC).

## Working in parallel
Several sessions may work at once. **Each session works on its own branch** (`fix-popups`, `end-screen`, …), never directly on `main`.
Merge to `main` only after `tools/build.py` + `tools/smoke.py` pass, then update the "Status / open work" section below.
Never spend Higgsfield or Suno credits without Tzach's OK.

## Layout
```
index.html            BUILT game (PWA shell + game). Do not hand-edit — run tools/build.py
sw.js                 service worker (offline cache; build bumps its version string)
manifest.webmanifest, icons/   home-screen app metadata + icons
art/                  all images/audio/fonts/3D used at runtime (served as-is)
src/base.html         the v27 single-file game (canvas 2D + three.js lobby). Patched at build time.
src/v28.js/.css       v28 module: shop/IAP test-mode, buddy perks, weekly missions, personalities, lobby spin+sick, sticker book
src/v29.js            foreground caps constant (+ retired boss sprite-sheet code, meta is empty now)
src/v31.js            3D comic gags (fail: bleh/blehT melt & puke, bones/bonesP zap→skeleton; win: dance) rendered live with three.js
src/v33.js            3D bosses: loads art/b3d_<zone>.{wasm,json,_map/_mr/_nrm.webp}, procedural rig per boss (B3D_RIG),
                      idle/wind-up/attack signature move/phase roar/entrance/defeat (b3Draw)
tools/build.py        applies exact-string patches (rep) to base.html, injects the modules + css, writes index.html
tools/smoke.py        headless check: python3 tools/smoke.py 1 10 20  → prints state + JS errors, saves .smoke_*.png
tools/glb2sh.py       Meshy GLB → compact boss format: python3 tools/glb2sh.py boss.glb b3d_<zone> art/
```

### Build & test
```
python3 tools/build.py            # regenerates index.html (+ preview.html with --preview, no PWA shell)
python3 tools/smoke.py 1 10       # needs playwright+chromium; headless WebGL (swiftshader) is ~2fps, game time runs slow
python3 -m http.server 8765       # manual look
```
- `rep(old,new)` in build.py must match **exactly once** — the build aborts with `EDIT FAILED` otherwise. Patches apply in file order, so a later patch must target the already-patched text.
- To change game logic: prefer adding a `rep()` patch or code in a module over editing `src/base.html` (keeps diffs reviewable). Editing base.html directly is OK for big rewrites — then fix any rep() that stops matching.
- Hebrew text needs `<meta charset="utf-8">` (the PWA head has it).
- Binary 3D data is named `.wasm` only because the claude.ai artifact host refuses `.bin`; it's raw data (positions f32 | normals i8 | uv f32 | indices u16/u32), see glb2sh.py.

## Key game facts
- `DEV_OPEN=true` (in a build.py patch): all 80 levels + bosses open for testing. **Set false before store release.** Real progress is still tracked.
- Characters in-game are baked sprites from the 3D model (bake key `BAKE_V`, IndexedDB `sharliz-bake`); drawn by `drawSharliz0` in 18 horizontal strips (jiggle/squash).
- Boss states: `b.wind` (wind-up .8s) → attack (`b.atkAt`, `BOSS_ATK[zone]`) → `b.stun` 3.4s (×2 damage), `b.hurt`, `b.phAt` (phase), `b.dead`.
- Popups: `popup(text,x,y,color,key,sub)` (44 call sites); landing feedback uses `key` (perfect/great/wow/gust).
- End card: `win()` → `showOverlay({stars, extra: tallyCard})`; coin rows come from `tallyRows(won)` (v28 adds a buddy-bonus row).
- Prices/IAP are test-mode only (`IAP` in v28.js; real payments need a native wrapper later).

## Status / open work (update when you finish something)
Done recently (branch `logo-icon`, Oct 6): new home-screen icon + lobby logo art made in Raz's ChatGPT (masters in `tools/brand/chatgpt/`, regenerate sizes with `python3 tools/brand/make_icons.py icon1|icon2`); lobby logo is now an image (`art/logo_he.webp` / `art/logo_en.webp`, English says SHARLIZ TOWER) via a build.py patch on `buildLogo`. Character look for any art: plain white oval eyes, NO pupils.
Also done: 3D bosses for all 8 worlds (Meshy multi-view), boss signature attacks, 3D gags, foreground caps (farm/ocean/volcano), PWA on GitHub Pages.

In progress / requested by Tzach (Oct 6):
1. **Jagged black outline** on characters while swinging. Cause: `drawSharliz0` draws 18 strips each shifted by `off(t)` → stair-steps when `kx` (swing velocity) ≠ 0. Fix plan: per-strip shear transform so offsets are continuous (`ctx.transform(1,0,sh,1,o0-sh*yd0,0)` with o0/o1 at strip top/bottom), N≈28, `ctx.imageSmoothingQuality='high'`.
2. **Popups block the play area** (many fire around `swingY()`). Plan: info messages → small queued toast lane under the HUD/boss bar; landing feedback smaller, beside the tower, shorter; drop "nice".
3. **End-of-level card**: max 3 coin rows (group: clear / skill / bonuses), nicer look, stars appear one by one with sound, special celebration for 3 stars.
4. Then: full bug hunt across the game.

Backlog: 8 world music tracks (Suno — needs Tzach's OK), Tzach's own illustrations for the album "specials" page + how to earn them, store prep (DEV_OPEN=false, native wrapper, real IAP, privacy policy), check performance on iPhone.
