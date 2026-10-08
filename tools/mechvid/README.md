# Mechanic explainer videos (v62)

Every mechanic's intro card plays `art/mv_<key>.mp4` (real gameplay, ~8–11 s, loops). Kids 9+ must understand it with no words:
1. **Scene A – what goes wrong:** the hazard comes in, marked precisely (red ring / spotlight / red arrow), slow motion at the key
   moment, then a big red ✗ badge where the damage happens.
2. **Scene B – what to do:** same setup, the white glove hand does the right action at the exact spot (tap ripple, green ring),
   or the right timing is shown (perfect landing), then a big green ✓ badge.
No text inside the video (the game speaks 14 languages): the card shows two translated lines under it (`hzx_<key>` what happens,
`hzo_<key>` what to do, in src/v62.js + src/i18n).

## Recording
```
python3 tools/mechvid/rec.py <key> art/mv_<key>.mp4            # PORT=88xx to run several at once
python3 tools/mechvid/rec.py <key> /tmp/x.mp4 --probe          # one screenshot per scene (setup check)
python3 tools/build.py                                          # MV_LIST picks up art/mv_*.mp4
```
Headless Chromium can't play H.264; to preview the card, route the mp4 to a WebM copy and block the service worker.

## Scene files: tools/mechvid/scenes/<key>.js
`SC.scenes=[A,B]`, each `{level, floors, seed, dur, fadeIn, fadeOut, start(), tick(t), speed(t), camTop, hide}`:
- `level`/`floors`: the level to start and how many floors to build first (perfect drops, not recorded).
- `start()`: runs once after the build (start the mechanic: `startEvent('<key>')`, then nudge its state so the scene is clear).
- `tick(t)`: runs every video frame (t = video seconds); return overlay items; may set `this.dur` to end the scene.
- `speed(t)`: game speed (1 = normal, .4 = slow motion).
- `SC.mem`: per-scene scratch object. `SC.allowHz/allowGold/allowCoin`: random hazards, golden pieces, coin balloon (off by default).
Helpers: `SC_aim(tol)` (true when dropping now lands within tol), `drop()`, `SC_tap(x,y)` (calls hzTap, never drops),
`sy(swingY())` swinger screen y, `xOf(xs)` screen x, `hz.m.<key>` = live state of a v44 mechanic.
Overlay items (screen coords of the game canvas): `{k:'ring',x,y,r,col}`, `{k:'arrow',x1,y1,x2,y2,col,p}`, `{k:'spot',x,y,r,a}`,
`{k:'ripple',x,y,p}`, `{k:'badge',x,y,ok,p}` (p 0→1 pops it in), `{k:'hand',x,y,press}` (fingertip at x,y), `{k:'fn',f:(g,t)=>{}}`
(custom canvas drawing; `SC_lib` has hand/badge/ring/ripple/spot/arrow). Colours: danger '#ef4444', target '#facc15', good '#22c55e'.
Camera: a 390×488 crop starting 100 px above the swinger (override with `camTop`).
