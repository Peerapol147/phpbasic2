import test from "node:test";
import assert from "node:assert/strict";
import { createCampaign } from "../domain.mjs";
import {
  beginRaid,
  step,
  queueOrder,
  devDamage,
  rewind,
  returnToCity,
  lineOfSight,
  findPath,
} from "../simulation.mjs";
import { decode } from "../storage.mjs";
function start() {
  const s = createCampaign();
  beginRaid(
    s,
    "raid-1",
    s.heroes.map((h) => h.id),
    { dev: true },
  );
  return s;
}
test("pause freezes projectiles, timers and queued orders; loading resumes paused without healing", () => {
  const s = start();
  s.raid.paused = true;
  const h = s.raid.units[0];
  h.hp = 123;
  h.skillCd = 4;
  s.raid.projectiles.push({sourceId:h.id,sourceName:h.name,targetId:s.raid.units.find(u=>u.side==='enemy').id,power:20,kind:'physical',ability:'test',remaining:1,duration:1,start:{x:h.x,y:h.y}});
  s.heroes[0].hp = 123;
  queueOrder(s, [h.id], "retreat", { x: 32, y: 35 });
  const before = JSON.stringify(s);
  for (let i = 0; i < 30; i++) step(s);
  assert.equal(JSON.stringify(s), before);
  s.raid.paused = false;
  step(s);
  assert.equal(s.raid.commands.length, 0);
  assert.equal(s.raid.projectiles[0].remaining, .95);
  assert.equal(h.skillCd, 3.95);
  const loaded = decode(JSON.stringify(s));
  assert.equal(loaded.raid.paused, true);
  assert.equal(loaded.heroes[0].hp, 123);
  assert.deepEqual(loaded.raid.projectiles, s.raid.projectiles);
});
test("gate breach does not end battle, opens route and stops automatically", () => {
  const s = start();
  assert.equal(lineOfSight({ x: 32, y: 23 }, s.raid.gate, s.raid), true);
  assert.equal(
    findPath({ x: 32, y: 23 }, { x: 32, y: 25 }, s.raid, "enemy"),
    null,
  );
  devDamage(s, "gate", 100000);
  assert.equal(s.raid.phase, "ACTIVE");
  assert.equal(s.raid.paused, true);
  assert.ok(findPath({ x: 32, y: 23 }, { x: 32, y: 25 }, s.raid, "enemy"));
});
test("rewind restores city and troops once but preserves death, equipment loss and wallet", () => {
  const s = start(),
    gold = s.city.gold;
  devDamage(s, "hero-1", 100000);
  devDamage(s, "fort", 100000);
  assert.equal(s.raid.phase, "DEFEAT");
  assert.equal(s.wallet.gems, 300);
  s.city.gold = 0;
  rewind(s);
  assert.equal(s.city.gold, gold);
  assert.equal(s.heroes[0].alive, false);
  assert.equal(s.items["hero-1-weapon"].status, "lost");
  assert.equal(s.city.squads[0].count, 5);
  const snapshot = JSON.stringify(s);
  rewind(s);
  assert.equal(JSON.stringify(s), snapshot);
  assert.equal(s.deaths.length, 1);
  assert.ok(returnToCity(s));
});
test("victory rewards settle only once", () => {
  const s = start();
  s.raid.wave = 3;
  for (const u of s.raid.units.filter((u) => u.side === "enemy")) u.hp = 0;
  step(s);
  assert.equal(s.raid.phase, "VICTORY");
  assert.equal(s.wallet.gems, 400);
  const before = JSON.stringify(s);
  for (let i = 0; i < 10; i++) step(s);
  assert.equal(JSON.stringify(s), before);
});
test("unopposed attackers can break gate then fort through normal combat", () => {
  const s = start();
  s.settings.autoPauseBreach = false;
  for (const u of s.raid.units.filter((u) => u.side === "ally")) u.hp = 0;
  for (let i = 0; i < 24000 && s.raid.phase === "ACTIVE"; i++) step(s);
  assert.equal(s.raid.gate.hp, 0);
  assert.equal(s.raid.phase, "DEFEAT");
});
