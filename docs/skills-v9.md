# Skills v9: first five classes

Implemented 3 fixed loadouts each for sword, knight, archer, mage and priest (15 actives paired with 15 named passives). Characters deterministically select a loadout by ID modulo 3, independent of rarity. This preserves old saves, avoids rerolling skills on reload, and permits low-rarity specialists. It does not make every summoned character's skill unique; several characters can share a loadout.

`SKILL_BOOK` in engine.mjs is the executable balance table. The in-game codex shows every multiplier, radius, cooldown and passive. Profile shows the specific character's kit. Existing class mechanics remain: sword combo, knight intercept/counter, archer focus/critical cycle, priest cleanse/revive. Tank, gun and summoner retain their existing skills in this release.

## Design and research

Consulted The Battle for Wesnoth's primary ability definitions:
https://github.com/wesnoth/wesnoth/blob/master/data/core/macros/abilities.cfg
Its `heals` ability separates healing amount, affected allies and positional adjacency. Adapted that constraint into a bounded healing radius and a cooldown, rather than unlimited team-wide healing. This is a tactical RPG reference, not a claim that its turn-based numerical balance transfers to an auto-battler. No assets or implementation were copied. The user's Prototype and positional-role requirements are the main design reference.

Single-target attacks receive a higher coefficient; area attacks trade coefficient for potential multiple targets. Mage area attacks require a one-second cast at a fixed ground position: moving enemies can evade. Priest heals only missing HP; each area target receives its independently capped heal. Revive retains its separate 30-second cooldown. Passive budget: ATK 5–6%, HP 8–10%, or movement 8–10%; no extra rarity multiplier on skills. Team power includes the new ATK/HP passives. Raw profile stats remain base stats, while passive descriptions identify the combat bonuses.

## Movement and effects

Retain living target unless another is at least 10 arena units closer. Ranged retreat enters below 11 and exits above 17 to avoid boundary oscillation. Reduced separation radius/impulse and applied it consistently across floors. Mage holds position while casting except emergency boss evasion. Rendering interpolates 200ms simulation positions; subtle one-pixel steps replace whole-body rocking. Ground shadows, source-to-target projectiles and fixed cast circles convey location. Cast indicator radius now matches each kit's actual hit radius. This is smoother static-sprite rendering, not new skeletal animation or navigation around obstacles.

## Validation and remaining tuning

Run `node --test tests/engine.test.mjs tests/skills.test.mjs` and `node scripts/chapter-check.mjs`.
15 loadout cases exercise actual attack/heal and passives; additional cases check cooldown and ranged dead band. Existing elemental win/loss, saves, economy, bosses and summon coverage still pass. Browser smoke checks: 15 catalog entries, combat interpolation, paid summon, GM isolation and restored roster; no JS exceptions.

30 chapter simulations (10 floors × three progression presets, potions disabled): level 1 / 1-star reference team won floors 1–9 and lost floor 10 at 84s; level 3 / 1-star won floor 10 at 44.4s; level 5 / 2-star won at 56.4s. These are specific compositions/positions, not statistical win rates or proof of global balance. Timing and enemy movement can make stronger teams slower. All 30-floor balance and all possible team compositions still require broader tuning; existing encounter-count discontinuity after chapter 1 is not addressed here.

No save reset, currency grant or gacha rate change. Client-side single-player simulation remains client-side; this release does not introduce a server backend.
