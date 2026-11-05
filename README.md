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

### Bulk selection (bulk-v13)

Heroes → เลือกหลายตัว provides select-all matching the current filters, deselect-visible, clear-all, and batch lock/unlock. Hidden selections are counted explicitly. Sending a selection to dismantling skips protected heroes and still requires the review/confirmation step. The dismantling tab also supports select-all eligible heroes. Switching tabs clears selection; changing filters retains it. `node tests/bulk-ui.test.cjs` verifies these workflows and mobile overflow.
