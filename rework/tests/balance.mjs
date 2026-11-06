import { createCampaign } from "../domain.mjs";
import { beginRaid, step } from "../simulation.mjs";
for (const id of ["raid-1", "raid-2", "raid-3"]) {
  const s = createCampaign();
  s.settings.autoPauseBreach = false;
  beginRaid(
    s,
    id,
    s.heroes.map((h) => h.id),
  );
  for (let i = 0; i < 18000 && s.raid.phase === "ACTIVE"; i++) step(s);
  console.log(
    JSON.stringify({
      raid: id,
      result: s.raid.phase,
      time: s.raid.time,
      wave: s.raid.wave,
      deaths: s.deaths.length,
      gate: s.raid.gate.hp,
      fort: s.raid.fort.hp,
    }),
  );
}
