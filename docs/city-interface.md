# City interface checkpoint 02

The root entry now redirects to `rework/`. The old gameplay entry is retired; old
source modules remain to support preset imports and historical tests. No legacy
localStorage data is deleted.

City art: generated for Mistbound with image_gen, 6 Nov 2026, copied without edits
from generated_images/exec-ce9c159b-d1dc-4109-b98b-daac7e36d8a8.png.
Text, navigation and building interactions are HTML overlays, not baked into art.

Reused presets: hero atlas and character-art portrait/costume renderer, class mapping
for five current heroes, sword impact FX from combat-frames.mjs. Other legacy combat
skills do not automatically become new combat rules. Battlefield background and
frame-based character motion remain separate next steps.

Working city actions: resource inspection, hero selection, recruitment, healing,
gate/fort repair, raid selection/start and last-result inspection. Summoning and
smithing are explicitly unavailable. No fake countdown or fabricated resource totals.

Validation: five simulation tests and Chromium desktop/mobile flow including pause,
reload, death and rewind. Screenshot inspected at 1440×1000; mobile overflow checked
at 390×844. This is a city UI checkpoint, not a claim that the battle reference is done.
