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
src/v39.js/.css        hat powers: HAT_FX (one advantage + one cost per shop hat), hatK()/hatNow(), wardrobe 'Hat power' box
src/v38.js/.css        daily login gift: 7-day streak calendar (progress.login), pops up once a day in the lobby
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
Done Oct 6 (logo-icon, merged): new home-screen icon + lobby logo art made in Raz's ChatGPT (masters in `tools/brand/chatgpt/`, regenerate sizes with `python3 tools/brand/make_icons.py icon1|icon2`); lobby logo is now an image (`art/logo_he.webp` / `art/logo_en.webp`, English says SHARLIZ TOWER) via a build.py patch on `buildLogo`. Character look for any art: plain white oval eyes, NO pupils.
Also done: 3D bosses for all 8 worlds (Meshy multi-view), boss signature attacks, 3D gags, foreground caps (farm/ocean/volcano), PWA on GitHub Pages.

Done Oct 6 (src/v36.js + v36.css + build.py patches):
- Smooth character outline while swinging (sheared strips, N=28, high-quality smoothing) — was a stair-step from 18 shifted strips.
- Popups: info messages go to a toast lane at the bottom (`toast()`, max 3, de-duplicated); landing feedback smaller, beside the tower; "nice" removed; boss damage numbers stay on the boss.
- End card: coin rows grouped into ≤3 (clear / skill / bonuses) with icons, pill styling; stars drop in one by one with sound + sparks; 3 stars → rays, bouncing stars, "מושלם!" tag, confetti; mission checklist shows only missed missions.
- Victory popup "burst" (v37, `winBurst()` in v36.js + `.card.wb` CSS): compact purple burst card centred over the dimmed game, tilted yellow title, stars on top, 3 tilted reward cards + yellow coin badge; stars + dancing hero (`.wb-top`, moved out of card-body) break out above the card top, middle star bigger. Chosen by Tzach from 4 GPT mockups (#2).

Done Oct 6 (src/v38.js + v38.css, branch daily-gift): daily login gift. 7-day streak calendar (50/80/100+booster/120/150+booster/200/400+2 boosters chest), pops up by itself the first time the lobby is idle each day (only after level 1), missing a day resets to day 1, after day 7 it starts over. State in `progress.login={last,streak}`. Part of the monetization plan (free + purchases, see project memory).

Done Oct 6 (src/v39.js + v39.css + build.py "v39" patches, branch hat-perks): every shop hat has an advantage and a cost (approved by Raz). party +15% coins/faster swing; cowboy slower swing/perfect pts ×.6; viking +1 heart/landing ×.88; propeller fall ×.7/wind ×1.6; chef +2 coins per perfect/clear reward ×.5; flowers landing ×1.2/points ×.7; wizard aim line always/coins ×.9; pirate boss dmg ×1.5/faster swing; king +25% coins/−1 heart; tophat frenzy ×1.5 long/needs 7 perfects; beanie wind ×.25/fall ×1.3. Trophy hats have no power. Hats are ignored in duo mode and when not owned. Swing-speed changes don't change landing tolerance (landTol divides by hatSpd).

Bug hunt Oct 6 (build.py "v38" patches + v33/v36/v31/sw.js): autoplay bot (all 80 levels, win+lose, 0 JS errors) + 3 code reviews. Fixed:
- Boss killed while a piece was still falling / tower collapsing → win never fired (game continued forever, boss dead). Win timer is now robust; landings/heart loss ignored after the killing blow, and a late landing can no longer flip a won level back to "bossdown".
- Boss-gate "close" left the player stuck (only visible with DEV_OPEN=false) → goes to the map.
- Pause→Restart in Endless/Daily/Duo now restarts the mode (endless coins could be farmed).
- Game clock no longer runs during pause / intro cards (boss attacked right after "got it"; fast-mission timer).
- fever/slow-mo/shake reset per level; stale boss wind-up can't hit a restarted level; boosters disabled after the last heart.
- Saves without `stars` crashed every launch; save-code import now rebakes looks.
- iOS: 'interrupted' audio resumes; env lighting regenerated after WebGL context restore; bake no longer caches blank sprites if the context is lost.
- 3D boss: textures load before showing (no black flash), shader precompiled, only current world's boss kept in GPU memory, render cached (re-renders only when the pose changes), 404 retry.
- Card hero/stars/confetti stop when the card closes; victory card max-height; toasts cleared per level; share-sheet cancel; SW caches only OK pages.
Not changed (design?): every level starts with a coin balloon.

Backlog: 8 world music tracks (Suno — needs Tzach's OK), Tzach's own illustrations for the album "specials" page + how to earn them, store prep (DEV_OPEN=false, native wrapper, real IAP, privacy policy), check performance on iPhone.
