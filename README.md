# Mistbound — Tower 30

Standalone offline game: `/workspace/exports/Mistbound-Tower30.html`. Open in Chrome or Edge. Development server: `python3 -m http.server 8000` from this directory.

## This version
- Compact pre-dungeon sidebar: click each hero for stats, training and equipment. Formation remains editable on Heroes.
- 30 floors, boss plus two escorts every fifth floor. Regular floors combine melee, flanking and ranged enemies.
- Continuous assault advances one floor after each win; stops on defeat, retreat or floor 30. Full HP resets between floors. Closing/reloading stops the run; no background/offline rewards.
- Speed 1×/2×/4× advances the same fixed-step simulation. Pause freezes it.
- HP potions: threshold off/25/50/75%; heal 40% max HP, 10-second individual cooldown, finite stock. Buy 10 for 300 gold outside battle. Cannot revive.
- Seven elements, cycle water→fire→wind→earth→lightning→water at 1.3×; light/dark counter each other. Same-element 2/3 members give 10%/20% elemental damage, highest tier only. No elemental reactions or four-member special skills yet.
- Rarities 1–7: HP/ATK/base DEF scale by 1+(stars−1)/9, so 1-star stats are approximately 60% of 7-star. All eight free starters remain one star.
- Experimental harsh gacha rates: 81.8%, 15%, 3%, 0.1%, 0.07%, 0.02%, 0.01%. Sum 100%. 100 gems per pull; no pity. These are explicit prototype choices, not verified original-game rates.
- Recommended power is a heuristic: 700×1.065^(floor−1), ×1.4 on bosses. Team power uses bonus-adjusted HP/ATK and DEF. Risk labels compare those scores; they are NOT win probabilities and do not fully model element/formation.
- Separate v4 save key, strict JSON import validation; older saves remain untouched but are not imported into this version.

## Checks
`node tests/engine.test.mjs` — 9 tests: gacha rates/boundaries, element multipliers, rarity ratio, floor gates, automatic advance/stop, reward idempotency, finite potions/cooldowns, pause, save validation and element-sensitive win/loss at floor 17.

Simulation validation is not a balance guarantee. Browser appearance and actual click flows remain unverified. No status reactions, special class-pair skills, offline farming, stamina, pity, permanent death or LLM. Reports retain the latest battle; continuous mode begins a fresh log on each new floor.

## Farm & Talents update (v5)
Latest standalone: `/workspace/exports/Mistbound-Farm-Talents.html`; separate `mistbound-v5` save, no automatic migration. Eight initial heroes and summoned heroes have unique IDs/names; combinations of class/element can repeat.

Cleared floors can be farmed continuously until defeat or manual retreat. No offline farming. Session summary tracks runs, gems and gold. Every victory grants two materials; boss victories give one boss token. Ordinary first clears give 10 gems; first clears at 10/20/30 give 100. Repeat clears give 30 before bonuses. Rewards and healing reset between completed encounters as documented above.

EXP now levels heroes at 60×current level, granting VIT+1 and STR/INT+1. Training purchases attributes separately without incrementing level.

Four talent branches with four sequential tiers. Costs: 500 gold; 1500 gold; 4000 gold +20 materials; 10000 gold +5 boss tokens. Combat bonuses are snapshotted on battle start. Life tier 4 revives only one hero once per encounter, not every hero. Crit and equipment drops use deterministic fractional accumulation for reproducible testing, not random rolls (base gear cadence 10 wins, economy tier 4 rate 11%). Equipment is a generic resource consumed before stones when equipping; no item rarity or slots yet. Defense tier 4's damage reduction works; status resistance remains explicitly deferred because enemies currently inflict no status effects. No Potential, star upgrades, pets, books or crafting yet.

13 engine tests pass, including farm looping, level gains, talent costs and one-use revival. Browser interaction remains unverified.

## City UI revision
Latest standalone: `/workspace/exports/Mistbound-CityUI.html`. Keeps v5 state format; use Export/Import to transfer saves between downloaded files if browser file storage differs.

City artwork remains behind translucent menu windows with a close-to-city action. Heroes now have compact cards, live name/class/element search, class/element/star/team filters, sorting, and roster/formation/training tabs. A detail dialog shows calculated attributes, skills, equipment and training previews; it stays open and refreshes after actions. A codex describes the eight implemented classes and elemental rules. No fusion, star-upgrade or extra mechanics were added merely to match reference screens.

Verified the bundled HTML using local HTTP in headless Chromium at desktop 1440×1000 and mobile 390×844: city, roster, class filter, empty search, clear filters, details, training updates with dialog retained, formation and codex. No JS exceptions in those checks and no horizontal overflow at the checked mobile viewport. All 13 simulation tests also pass. Local file navigation was blocked by this environment's browser policy, so direct file opening was not browser-tested here.

## Combat presentation and balance revision
Large combat viewport, five-member bottom HUD, damage/heal numbers, separate enemy silhouettes, detailed end-of-battle reward breakdown, hero statistics, replay/next-floor actions and four-column talents. Battle simulation remains separate from UI. No authoritative online backend or multiplayer security is claimed: GitHub Pages runs the engine in the browser.

Economy: farm gems capped at 1500/day using Bangkok date; first-clear rewards are separate. Gold/EXP/materials continue after the cap. This is a maximum of 15 farm-funded pulls/day, not a promise it requires one hour. Browser clock/save editing can bypass local limits. Gear drop credit now accumulates across wins instead of recalculating history when a talent changes. Dead summoned units are removed when replaced; minion damage counts toward their owner.

Balance evidence: `node scripts/balance-check.mjs`, results in `docs/balance-results.json`. Tested 56 unique five-class teams at 7 floors, default formation/elements, 1-star level-1, no potions or talents. Wins: floor 1/5/10: 56/56; floor 15: 46/56; floor 20: 5/56; floor 25/30: 0/56. These are deterministic test cases, not population win probabilities. Sample team crosses its floor-20 wall after 5 training purchases per hero (5000 gold). Training/XP farming speed and late-game variety still need player testing; unlimited gold means this is not a competitive economy.

15 engine tests pass. Chromium verified city, filters, detail/training, formation, codex, battle entry, five-member HUD, pause/resume and final report without runtime exceptions. Original CSS characters are placeholders, not the reference game's artwork.

## Combat readability and scaling revision (balance v2)

Combat now displays class-specific slash, arrow, gunshot, spell, heal, potion, shield, guard, summon and revival effects. Spell targeting circles indicate the fixed blast location. Effect age follows simulation time across UI refreshes; pause freezes animations. Reduced-motion mode removes travel animations. Enemy silhouettes now use original CSS creature art instead of chess symbols.

Tank shields scale to 20% of battle max HP. Summons scale to (40 + INT × 2) HP and 40% of the summoner's battle ATK, with existing healing synergy applied. Mage blasts use 115% ATK and resolve at the selected ground location after one second even if the target moves out of range. Movement can therefore avoid a blast. Existing v5 saves remain readable.

Validation: 19 engine tests, including cast completion, shield scaling, minion scaling/limit, and paused effect history. The 56-team balance matrix is regenerated in `docs/balance-results.json`: 56 wins at floors 1/5/10, 48 at 15, 9 at 20, zero at 25/30 for untrained level-1 teams without potions/talents. A separate default-team floor-30 check lost at 15/25 training purchases per hero and won at 40 (40,000 gold total), without potions. These scenarios establish progression feasibility, not comprehensive economy balance. Browser validation covered boss combat, visible effects, pause/resume, 4× speed, final report and mobile overflow. No deployment is implied by these checks.

## Class and rarity artwork

`assets/hero-atlas.png` contains 56 original generated character designs: seven rarity columns (1–7 stars), eight class rows in engine job order (swordsman, knight, tank, archer, gunner, mage, summoner, priest). The transparent atlas is 887×1774 pixels. CSS uses a 4:7 cell aspect ratio and 700%×800% background sizing; keep those aligned if replacing the atlas. Each rarity changes costume/equipment, not just a tint. Characters of the same class and rarity share the same illustration, independent of name, level and element.

The roster, summon results, detail dialog, formation, compact team, battle units and battle HUD select art using both `job` and `star`. The city traveler and class codex default to one star. The Data/Codex page includes a horizontally scrollable 56-design catalog. These are static full-body illustrations with CSS combat movement and effects, not multi-frame animation sheets. Existing saves use their stored class/rarity without migration. The artwork was generated for this project; the reference video informed the fantasy RPG direction, not extracted character assets.

Browser checks confirmed all 56 unique atlas positions, HTTP asset loading, all seven swordsman rarities and matching profile artwork, mobile gallery width, and live combat. Source generation output is retained outside the repository under `/workspace/generated_images/`; the game only needs the checked-in asset path.

## Rendering and summon-art fix

The summon dialog's old `.portrait span` badge rule reset the art background to `none`. The level badge now has its own `.portrait-level` selector. Regression coverage exercises an actual 50-pull dialog, atlas image decoding, and the last portrait after scrolling. Dialogs open at the top instead of jumping to the close button.

During combat, unit/HUD nodes are retained; updates change position, HP and status in place. Effects are keyed by their simulation event IDs and expire individually. Movement uses CSS translate rather than layout coordinates. Full rendering remains for navigation and encounter transitions. Background simulation stops while the document is hidden. Saves exclude transient battle state, are throttled to once per five seconds during combat, and flush on actions, battle outcomes, page hide and tab hide. Expensive backdrop blurs are removed; offscreen catalog rows and summon cards use content visibility.

The same 2.2-second Chromium floor-20 probe measured 1,378 removed DOM elements and 11 storage writes before, versus 1 removed element and zero writes after; fighter nodes remain attached. These are operation counts, not a device FPS guarantee. Run `node tests/ui.test.cjs` with the local server, Playwright and system Chromium for the summon-art, DOM-retention, autosave, pause, speed, mobile and battle-report regression checks.
