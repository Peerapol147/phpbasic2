# Roster and interface audit — roster-v12

Checked against the main branch at 8f3493f, including actual UI handlers and engine exports.

## Fixed

- No dismantling function or UI existed in this version. Added a dedicated roster tab, individual/multiple selection, reward preview, explicit confirmation, cancellation and persistent resource awards. Protected team members, locked heroes and 7★; reject stale/duplicate/missing selections and the final remaining hero atomically. No dismantling during battle.
- Added persistent per-hero locks, accepted optionally in v5 saves. Batch “1★ untrained” respects current filters and skips any trained, leveled, equipped or protected hero. Filtering retains selection and clearly reports the total.
- Provisional yield: `star` stones and `2 × star` materials per hero; no gems, training refund or equipment refund. These are usable existing resources, not a new unusable fragment currency. Yields are visible before confirming. Future class/element fragments are not implemented.
- Training and star-upgrade tabs now have their own direct per-card actions with affordability checks. Roster/formation cards have add/remove controls. Formation slots expose details and remove actions, and explain empty slots.
- Roster overview shows capacity, team power and available upgrade resources. Search empty states provide recovery actions. Newly filtered portraits are re-observed for animation.
- Inventory displays all seven resources, their source/use, and routes to the appropriate screen; training and upgrade routes select the matching tab.
- Profile training/upgrade refreshes the resource wallet immediately. Clearing selections on save import and GM transitions prevents cross-state selection leakage.
- Responsive controls, readable cards, scrollable mobile tabs, full-width mobile search, and a bounded review list.

## Still absent (not hidden buttons)

Pets and their gacha, skill-book gacha, Potential F–SS, class/element fragments, multiple equipment slots/affixes, a separate warehouse and online backend systems are not implemented. Four talent branches, 30-floor continuous assault, farm loop, skills/passives, training, upgrades, basic equipment, potions and basic potion crafting already exist. This update restores roster management rather than presenting unimplemented features as working controls.

## Checks

80 unit/regression cases across engine, skills, VFX and roster. Browser coverage includes preview/cancel/confirm dismantling, exact rewards and reload, lock persistence, training, formation, filters, seven inventory items and six mobile screens. VFX browser regression also run separately.
