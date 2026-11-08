# Mistbound development guidance

Use the project-local game-development skills installed in `.agents/skills/`.
Start with `.agents/skills/router/SKILL.md`; read only the relevant specialized
skills and their references for the current task. User requests take precedence.

## Project engine and current scope

This is a browser game using native JavaScript ES modules, HTML/CSS and Canvas 2D.
Do not scaffold a different engine merely because it appears in the skill catalog.
The city-defense implementation is in `rework/`. Its domain/simulation is separate
from presentation. Preserve fixed-step simulation and save isolation during UI work.

Current authorized product direction: replace the old game entry with the new city
interface, reuse existing character/animation/effect presets, and follow the user's
city and battle reference images. The root entry now routes to the city interface. Character portraits and sword impact
presets are reused; the battlefield visual rework and full animation migration remain pending.

Suggested task routing:
- City interface: `game-ui-ux`, `create-game-assets`.
- Raid mechanics and balance: `tower-defense`.
- Movement and impact presentation: `ai-behavior-trees-utility-ai`, `game-feel`.
- Persistence changes: `save-systems`.

Read `rework/DECISIONS.md` for implemented scope and known limitations. Never replace
functional controls with decorative mockup text or claim unimplemented systems work.

## Verification

Run `node rework/tests/simulation.test.mjs` for simulation changes.
For browser changes serve the repository on port 8000 and run
`node rework/tests/browser.cjs`; inspect desktop and narrow-screen screenshots.
Use `node rework/tests/balance.mjs` when changing combat values. Treat its baseline
as evidence, not proof that the game is balanced. Confirm deployment separately
from git push success.

## Installed skill provenance

`docs/gamedev-skills/installation.json` pins the upstream source and revision.
LICENSE and NOTICE are retained beside it. Skills are development guidance, not
runtime game dependencies. Updates must be reviewed rather than auto-downloaded.
