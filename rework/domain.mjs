import { CONFIG, CLASSES, BUILDINGS, TROOPS } from "./config.mjs";
export const clone = (x) => structuredClone(x);
export function heroStats(h, items) {
  const c = CLASSES[h.classId],
    [str, agi, vit, int] = h.stats,
    w = items[h.weaponId],
    a = items[h.armorId];
  return {
    max: c.base[0] + vit * 20 + (h.level - 1) * 15,
    maxMana: c.base[1] + int * 5,
    atk:
      c.base[2] +
      str * 3 +
      (h.classId !== "mage" && w?.status === "equipped" ? w.power : 0),
    matk:
      c.base[3] +
      int * 3 +
      (h.classId === "mage" && w?.status === "equipped" ? w.power : 0),
    def: vit * 2 + (a?.status === "equipped" ? 10 : 0),
    mdef: int + vit + (a?.status === "equipped" ? 5 : 0),
    range: c.range,
    interval: Math.max(0.6, c.interval / (1 + agi * 0.02)),
    speed: c.speed,
  };
}
export function createCampaign() {
  const s = {
    schemaVersion: CONFIG.schema,
    saveId: "city-" + Date.now().toString(36),
    revision: 0,
    nextRaid: 1,
    nextEvent: 1,
    city: {
      gold: 2000,
      wood: 600,
      stone: 600,
      iron: 200,
      production: 0,
      buildings: BUILDINGS.map((b) => ({ id: b.id, level: 1 })),
      gateHP: CONFIG.gate.hp,
      fortHP: CONFIG.fort.hp,
      squads: Object.keys(TROOPS).map((type, i) => ({
        id: "squad-" + (i + 1),
        type,
        count: 5,
        tier: 1,
      })),
      recruits: [],
      healing: [],
    },
    wallet: { gems: 300 },
    heroes: [],
    items: {},
    deaths: [],
    events: [],
    settled: [],
    rewound: [],
    cleared: [],
    raid: null,
    settings: { speed: 1, autoPauseBreach: true },
  };
  for (const [i, classId] of Object.keys(CLASSES).entries()) {
    const id = "hero-" + (i + 1),
      h = {
        id,
        name: ["อารัน", "เรน", "คีรา", "เซน", "ไอรา"][i],
        classId,
        elementId: "E" + (i + 1),
        rarity: 2,
        level: 1,
        xp: 0,
        stats: [...CLASSES[classId].stats],
        alive: true,
        location: "HOME",
        weaponId: id + "-weapon",
        armorId: id + "-armor",
      };
    s.items[h.weaponId] = {
      id: h.weaponId,
      status: "equipped",
      power: 10,
      owner: id,
    };
    s.items[h.armorId] = { id: h.armorId, status: "equipped", owner: id };
    Object.assign(h, {
      hp: heroStats(h, s.items).max,
      mana: heroStats(h, s.items).maxMana,
    });
    s.heroes.push(h);
  }
  return s;
}
export function event(s, type, payload = {}) {
  const e = {
    id: "event-" + s.nextEvent++,
    type,
    tick: s.raid?.tick ?? 0,
    raidId: s.raid?.id ?? null,
    ...payload,
  };
  s.events.push(e);
  if (s.events.length > 600) s.events.shift();
  s.revision++;
  return e;
}
export function damageValue(power, def) {
  return Math.max(1, Math.round((power * 100) / (100 + def)));
}
export function availableHeroes(s) {
  return s.heroes.filter((h) => h.alive && h.location === "HOME");
}
export function healHero(s, id) {
  if (s.raid && !["CITY", "REWOUND"].includes(s.raid.phase))
    return { ok: false, reason: "รักษาได้เมื่อกลับเมือง" };
  const h = s.heroes.find((h) => h.id === id);
  if (!h?.alive || h.location !== "HOME")
    return { ok: false, reason: "ฮีโร่ไม่อยู่เมืองหรือเสียชีวิต" };
  if (s.city.healing.includes(id)) return { ok: false, reason: "กำลังรักษา" };
  const d = heroStats(h, s.items),
    cost = Math.ceil((d.max - h.hp) / 10);
  if (h.hp === d.max && h.mana === d.maxMana)
    return { ok: false, reason: "พร้อมรบแล้ว" };
  if (s.city.gold < cost) return { ok: false, reason: "ทองไม่พอ" };
  s.city.gold -= cost;
  s.city.healing.push(id);
  event(s, "heal-start", { heroId: id, cost });
  return { ok: true };
}
export function recruit(s, id) {
  if (s.raid && s.raid.phase !== "CITY") return false;
  const q = s.city.squads.find((q) => q.id === id);
  if (
    !q ||
    q.count + s.city.recruits.filter((r) => r.squadId === id).length >= 5 ||
    s.city.gold < 20
  )
    return false;
  s.city.gold -= 20;
  s.city.recruits.push({ squadId: id, remaining: 10 });
  event(s, "recruit-start", { squadId: id });
  return true;
}
export function repair(s, key) {
  if (s.raid && s.raid.phase !== "CITY") return false;
  const max = key === "gate" ? CONFIG.gate.hp : CONFIG.fort.hp,
    prop = key === "gate" ? "gateHP" : "fortHP",
    missing = max - s.city[prop],
    blocks = Math.ceil(missing / 100);
  if (!blocks || s.city.gold < blocks * 10 || s.city.stone < blocks * 5)
    return false;
  s.city.gold -= blocks * 10;
  s.city.stone -= blocks * 5;
  s.city[prop] = max;
  event(s, "repair", { structure: key });
  return true;
}
export function cityStep(s, dt) {
  if (s.raid && s.raid.phase !== "CITY") return;
  s.city.production += dt;
  if (s.city.production >= 60) {
    s.city.production -= 60;
    for (const [key, n, max] of [
      ["gold", 30, 10000],
      ["wood", 10, 3000],
      ["stone", 10, 3000],
      ["iron", 3, 1000],
    ])
      s.city[key] = Math.min(max, s.city[key] + n);
    event(s, "production");
  }
  for (const q of s.city.recruits) q.remaining -= dt;
  for (const q of s.city.recruits.filter((q) => q.remaining <= 0)) {
    const squad = s.city.squads.find((x) => x.id === q.squadId);
    squad.count = Math.min(5, squad.count + 1);
    event(s, "recruit-complete", { squadId: q.squadId });
  }
  s.city.recruits = s.city.recruits.filter((q) => q.remaining > 0);
  for (const id of s.city.healing) {
    const h = s.heroes.find((h) => h.id === id);
    if (!h?.alive) continue;
    const d = heroStats(h, s.items);
    h.hp = Math.min(d.max, h.hp + 10 * dt);
    h.mana = Math.min(d.maxMana, h.mana + 5 * dt);
  }
  s.city.healing = s.city.healing.filter((id) => {
    const h = s.heroes.find((h) => h.id === id),
      d = h && heroStats(h, s.items);
    return h?.alive && (h.hp < d.max || h.mana < d.maxMana);
  });
}
