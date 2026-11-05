# Clip-v10 implementation record

Reference only: the uploaded `New Tab - Google Chrome 2026-11-05 01-42-05.mp4` and `SUMMON TO DIE - Google Chrome 2026-11-05 01-45-26.mp4`. No external game's ability designs were consulted for this rework. The prior Wesnoth-inspired v9 document is historical.

## Visible reference → implementation

- First clip 00:55–01:15: per-class Active/Passive tables, cooldown and rarity requirements → executable `abilities.mjs` catalog, profiles showing equipped skill IDs, star-gated slots and real periodic/trigger passives.
- First clip around 01:25–01:35 and end: class artwork/stat bars and hero details → six trainable attributes; derived physical/magic defense; DEX influences hit rate and LUK influences critical frequency. Numerical formulas below are our provisional interpretation, not measured original rules.
- First clip around 02:15–02:35: shop/gacha → potion purchase/crafting view and existing 1/10/50/100 summon controls, with rare-tier rates matching the supplied readable table. The 1★ remainder removes rounding excess.
- Second clip 00:05–01:25: city-backed roster/training/talents/preparation → persistent city backdrop, compact cards, click-to-inspect, formation, ordered talents and a scrollable preparation sidebar.
- Second clip 01:32–01:40 and 01:51–01:55: central party, enemies entering from several directions, consecutive waves → radial spawn points, three-wave floor state machine, no between-wave HP reset, final-wave leaders.
- Second clip 01:45/02:05/02:25: results overlay → centered report, MVP, damage/taken/healing bars, reward summary, return/repeat/continue.
- Second clip 02:35–03:00: city activity → five clickable party walkers on the plaza. This is decorative movement, not multiplayer/NPC simulation.

## Deliberately provisional values

The clips do not expose source code, all coefficients or all encounter rules. Three waves of five enemies, 50ms timestep, 30-floor scope, 240-second timeout, spawn geometry, power recommendation, cooldown coefficients, star-slot thresholds and recipes are implementation/tuning choices. They are not claimed to be reverse-engineered original values.

Enemies use a continuous `1.075^(floor-1)` multiplier on HP/ATK, retaining distinct leader stat budgets. Existing currency/XP/farm caps and talent costs remain to preserve progression. Star upgrade costs `1000 × current star` gold plus `5 × current star` stones. Attribute training costs 200 gold. Potion crafting consumes three materials and 30 gold. Recipes are visible before spending. Higher stars and training do not reroll skills.

Active coefficients range roughly 65–240% ATK depending on area, targets and cooldown; shields cap at 40% target max HP. Regeneration is 2% max HP every three seconds; life steal uses actual damage (no credit for overkill or shield absorption); emergency shield triggers below 35% HP with 15-second cooldown. Healing cannot revive except the explicit revive skill/talent. Summons are capped at one living minion per summoner with an independent cooldown dictionary.

Physical defense derives from VIT; magical defense from INT. Accuracy is clamped to 75–99% and determined by DEX against target AGI; critical credit is bounded at 40% and uses LUK plus talent bonuses. Fractional deterministic meters provide reproducible tests instead of per-frame random rolls. Risk text is a power heuristic, not a measured victory probability.

## State and timeline safeguards

- Pre-impact actions cancel on stun/death. Launched projectiles can still arrive after their source dies, but dead targets do not take duplicate damage.
- Ground-area projectiles terminate at the indicated ground point; single-target projectiles track the target. Their rendered coordinates use simulation time, including pause and speed changes.
- Wave transition waits for remaining projectiles, keeps party HP/cooldowns, clears obsolete actions/targets, and gives no rewards. All waves must finish before a floor victory. Loss/timeout is checked before victory to avoid rewarding mutual annihilation.
- Runtime battle objects are not saved. Legacy saves keep the v5 key. Reload stops the battle rather than paying offline rewards.
- Browser QA uses an isolated browser context. GM state is still a clone and does not overwrite the ordinary save.

## Scope still absent

The full original roster/classes, Potential grades, pets, skill books, equipment affix/slot inventory, seasonal systems, chat and original sprite animation assets remain absent. Existing generic equipment behavior is preserved. This release reworks the playable city → prepare → summon/develop → multi-wave combat → report loop; it is not a claim to reproduce every menu in the original game.

## Balance evidence

`docs/balance-v10.json` records the reproducible 56-team sweep, with one-star level-one heroes, default elements/order, no potions or talents. It also compares 0/5/10 training purchases per hero. These are scenario outcomes, not population win rates. Initial five-class teams handle the early floors; final-wave leaders at higher floors create progression walls, and training moves the default team's stopping point. The recommendation is calibrated as `500 × 1.045^(floor-1)`, multiplied by 1.05 for minibosses or 1.15 for bosses; ratios below .6/.85/1.2 map to very high/high/medium risk. It remains a coarse stat estimate, not a replacement for composition-specific simulation.
