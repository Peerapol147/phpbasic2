# Mistbound — clip-reference rework (clip-v10)

Browser game: https://peerapol147.github.io/phpbasic2/

Serve this directory with `python3 -m http.server 8000 --bind 127.0.0.1` and open http://127.0.0.1:8000/. No build step or API key. Keep `index.html`, both stylesheets, both JS modules and `assets/` together.

## Implemented

- Floating-city hub with moving party members, clickable buildings and translucent management windows. Responsive roster, formation, individual profiles, six trainable attributes (STR/AGI/VIT/INT/DEX/LUK), equipment and star upgrades.
- Vertical red arena with central sigil, small ground-anchored characters and a five-person bottom HUD. Feet animate separately from the torso. It uses existing character art and a newly authored SVG arena, not extracted original-game artwork.
- Three waves per floor, five enemies per wave; a sixth leader joins the final wave of every fifth floor. HP, shields, passives and cooldowns persist across waves. Only completion of the final wave awards resources. Floors 1–30 use one scaling curve; no chapter-11 enemy-count reset.
- Fixed 50ms simulation driven by a bounded animation-frame clock. Speed 1×/2×/4× uses the same timestep. Pause/hidden tabs do not advance time. Target retention, approach slots, separation steering and ranged retreat hysteresis replace nearest-target oscillation.
- Prepare → projectile/strike → impact → recovery. Projectile damage happens on arrival. Ground spells target the indicated location; enemies can leave it. Stun interrupts preparation. Pending projectile effects and simulation share the same clock.
- 40 Active skills across eight classes; three eligible Passive choices per class drawn from six implemented mechanics. Saved character skill IDs survive reloads/upgrades. At 1★/3★/7★, one/two/three Active slots; at 5★, a second Passive slot. Regeneration, life steal, emergency shields, healing bonuses, stun, slow, pierce, execution, cleansing and revival have actual battle effects.
- Seven rarity rates follow the visible reference table: 7★ 0.000005%, 6★ 0.0001%, 5★ 0.001%, 4★ 0.01%, 3★ 3%, 2★ 15%, 1★ 81.988895%. The last value normalizes rounded reference percentages to exactly 100%. No pity. Paid summons enter the roster; GM testing remains isolated.
- Post-floor report with MVP, damage/taken/healing bars, rewards, repeat/next-floor actions. Continuous assault and farming preserved. Shop sells potions and supports one basic crafting recipe. Four sequential talent branches remain functional.

## Reference boundary

The two uploaded clips are the design reference for this rework, not a commercial-game API/specification. [Evidence review](docs/video-reference-recheck.md) records timestamps. [Implementation and balance notes](docs/clip-v10.md) separate visible behavior from provisional coefficients/recipes.

This is a local single-player simulation, not the original game and not a server backend. It does not reproduce every commercial feature: pets, books, individual equipment affixes, online chat, seasonal leaderboards and the full original class roster are not implemented. Character artwork still uses an atlas; split-foot animation is not a complete frame-by-frame sprite animation set. Numeric balance is an initial tested model, not the original game's hidden formulas.

## Saves

`mistbound-v5` is retained. Old heroes acquire stable skill metadata when inspected/used; no automatic reset or currency grant. Optional DEX/LUK values are derived for legacy heroes. Export a save from the header; import JSON from the footer. The legacy `?reset=normal-v8` one-time reset link remains explicitly opt-in and backs up the previous save. Ordinary `?v=fx-v11` links do not reset anything.

## Verification

- `node tests/engine.test.mjs` — 18 economy/save/progression regression tests.
- `node tests/skills.test.mjs` — 53 skill/timeline/wave/upgrade/crafting cases.
- `node scripts/balance-check.mjs` — 56 five-class teams × seven floors, plus training progression. Deterministic scenarios, not player win probabilities.
- `node scripts/chapter-check.mjs` — three progression presets over the first ten floors.
- `node scripts/clip-ui-check.mjs` — local server :8000 and Chromium debugging :9222 required; isolated context covers eight mobile pages, all class catalogs, profiles, training/upgrades, shop/craft, paid summons, GM isolation, pause/4× and visible multi-wave completion.
- Playwright regression checks: `tests/normal-reset-ui.test.cjs`, `tests/summon-preset-ui.test.cjs`, `tests/chapter-ui.test.cjs` (requires Playwright and `/usr/bin/chromium`).

[Earlier development history](docs/history-before-clip-v10.md) is archived and contains superseded rules/test counts.

## VFX presets (fx-v11)

Six shared runtime presets: Crescent Slash, Piercing Arrow, Armor Breaker, Arcane Comet, Restoration and Aegis. Directional trails, contact sparks, healing leaves and shield ripples use the battle clock, including pause and 1×/2×/4×. Support effects follow their recipient; projectiles end at their impact position. Reduced-motion mode hides bloom and particles. These are authored SVG/CSS effects inspired by the concept board, not extracted commercial assets. Damage, cooldowns and rewards are unchanged.

Open `vfx-preview.html` (also linked from the in-game library) to preview all six without reading or changing saves.

- `node tests/vfx.test.mjs` — six mapping, geometry, timing and combat integration cases.
- `node tests/vfx-ui.test.cjs` — requires a local server on port 8000, Playwright and Chromium; checks preview controls/mobile layout, combat pause/speed, reduced motion and runtime errors.

## Roster management (roster-v12)

Heroes → ย่อยตัวละคร supports batch selection, protected heroes, a review dialog and exact resource payouts. Lock important heroes from their card/profile. Training and upgrades have direct actions; inventory shows all seven resources with usage links. Existing v5 saves remain compatible. [Audit, yields and remaining feature gaps](docs/roster-v12-audit.md).

- `node tests/roster.test.mjs` — atomic dismantling, protections, rewards and legacy save compatibility.
- `node tests/roster-ui.test.cjs` — preview/cancel/confirm, reload, locks, roster actions and mobile layouts (same browser/server requirements as VFX tests).

### Inline selection (inline-v14)

Selection now lives inside the hero filter panel; there are no separate bulk/dismantling tabs. Check individual cards or select all matching the current filters, then lock, unlock or review dismantling from the same screen. Hidden selections are counted. Dismantling previews skip protected heroes and snapshot only the eligible IDs for confirmation. Changing filters retains the selection. `node tests/bulk-ui.test.cjs` and `node tests/roster-ui.test.cjs` cover the inline workflow and mobile layout.

## Character motion and rank garments (motion-v15)

Built on `5c584c9` (the inline bulk roster update), preserving the new skill system, waves, economy, rarity table and roster protections. The engine now exposes presentation-only preparation timestamps; the shared renderer uses those timestamps for sword windup/recovery, bow draw/release, firearm recoil and support/casting poses. Stun cancels the pose, and wave changes clear it. Pausing or changing speed also retains the current pose when the battle DOM is rebuilt. Active sword skills receive a second crescent trail, while critical contact sparks are emphasized through the existing VFX pipeline.

The painted class/rarity atlas remains the base. Authored rank-specific cape silhouettes, shoulder pieces, seams and insignia add garment differences to all eight classes at all seven stars, retaining each class's material palette and existing faces/weapons. The same portrait renderer is used by the roster, summons, HUD, profiles, city and battle. This is layered atlas animation: shoulders and weapon pivot together at the waist, with a small overlapping forearm/string rig for the bow; it is not a newly painted frame-by-frame animation set.

Library → **ชุดประจำอาชีพ · 1–7 ดาว** shows all 56 outfits. **ดูท่าต่อสู้และชุดแต่ละดาว** opens `motion-preview.html`, with rank, pause, speed and timeline controls. The preview shares the actual costume/pose/VFX modules and never reads or writes saves. Reduced motion suppresses pose displacement. No reset, currency grant or summon-rate change is performed by this update.

Validation: 84 unit cases across engine (18), skills (53), roster (3), VFX (6) and character motion (4). Browser suites `character-motion-ui`, `vfx-ui`, `roster-ui`, `bulk-ui`, `normal-reset-ui` and `summon-preset-ui` cover the rendered outfits, bow string release, pause/4×, mobile layout, reduced motion, saved roster operations and paid summons. Run with a local server on :8000 and Chromium/Playwright. The renderer reads arena dimensions once per update and observes/unobserves every visible sprite fragment; it continues to share one atlas download.
