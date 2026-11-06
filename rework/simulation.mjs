import { CONFIG, CLASSES, TROOPS, ENEMIES, RAIDS } from "./config.mjs";
import { clone, event, heroStats, damageValue, cityStep } from "./domain.mjs";
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y),
  alive = (u) => u.hp > 0,
  clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export function walkable(x, y, b, side = "ally") {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 20 || x > 44 || y < 3 || y > 59) return false;
  if (y === 24) {
    if (x < 29 || x > 35) return false;
    if (side === "enemy" && b.gate.hp > 0) return false;
  }
  return true;
}
export function lineOfSight(a, t, b) {
  const n = Math.ceil(dist(a, t) * 4);
  for (let i = 1; i < n; i++) {
    const x = a.x + ((t.x - a.x) * i) / n,
      y = a.y + ((t.y - a.y) * i) / n;
    if (
      Math.abs(y - 24) < 0.45 &&
      (x < 29 || x > 35 || (b.gate.hp > 0 && t.id !== "gate"))
    )
      return false;
  }
  return true;
}
export function findPath(from, to, b, side = "ally") {
  const start = { x: Math.round(from.x), y: Math.round(from.y) },
    end = { x: Math.round(to.x), y: Math.round(to.y) };
  if (!walkable(end.x, end.y, b, side)) return null;
  const id = (p) => p.y * 64 + p.x,
    q = [start],
    seen = new Map([[id(start), null]]);
  let cursor = 0;
  while (cursor < q.length) {
    const p = q[cursor++];
    if (p.x === end.x && p.y === end.y) {
      const path = [];
      let k = id(p);
      while (seen.get(k) !== null) {
        path.unshift({ x: k % 64, y: Math.floor(k / 64) });
        k = seen.get(k);
      }
      return path;
    }
    for (const [dx, dy] of [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ]) {
      const n = { x: p.x + dx, y: p.y + dy },
        k = id(n);
      if (!seen.has(k) && walkable(n.x, n.y, b, side)) {
        seen.set(k, id(p));
        q.push(n);
      }
    }
  }
  return null;
}
function unit(base) {
  return {
    mana: 0,
    maxMana: 0,
    matk: 0,
    mdef: 0,
    shield: 0,
    shieldUntil: 0,
    rootUntil: 0,
    cd: 0,
    skillCd: 0,
    cast: null,
    targetId: null,
    path: null,
    pathGoal: null,
    moving: false,
    order: { type: "hold", point: { x: base.x, y: base.y } },
    ...base,
  };
}
function spawn(s) {
  const b = s.raid,
    def = RAIDS.find((r) => r.id === b.definitionId);
  let i = 0;
  for (const [type, count] of Object.entries(def.waves[b.wave - 1]))
    for (let k = 0; k < count; k++, i++) {
      const p = ENEMIES[type];
      b.units.push(
        unit({
          ...p,
          id: `${b.id}-enemy-${b.wave}-${i}`,
          side: "enemy",
          type,
          max: p.hp,
          x: 29 + (i % 7),
          y: 4 - Math.floor(i / 7) * 0.3,
          bossCd: 12,
        }),
      );
    }
  event(s, "wave", { wave: b.wave });
}
export function beginRaid(s, definitionId, heroIds, options = {}) {
  if (s.raid && s.raid.phase !== "CITY")
    return { ok: false, reason: "มีเรดที่ยังไม่จบ" };
  if (
    !RAIDS.some((r) => r.id === definitionId) ||
    !Array.isArray(heroIds) ||
    new Set(heroIds).size !== heroIds.length
  )
    return { ok: false, reason: "รายการไม่ถูกต้อง" };
  const hs = heroIds.map((id) => s.heroes.find((h) => h.id === id));
  if (hs.some((h) => !h?.alive || h.location !== "HOME") || !hs.length)
    return { ok: false, reason: "เลือกฮีโร่ที่ยังมีชีวิตและอยู่เมือง" };
  if (s.city.fortHP <= 0) return { ok: false, reason: "ต้องซ่อมป้อมก่อน" };
  const b = {
    id: "raid-" + s.nextRaid++,
    definitionId,
    phase: "ACTIVE",
    paused: false,
    tick: 0,
    time: 0,
    wave: 1,
    nextWave: null,
    commands: [],
    projectiles: [],
    telegraphs: [],
    effects: [],
    units: [],
    gate: {
      ...CONFIG.gate,
      id: "gate",
      name: "ประตูเหนือ",
      max: CONFIG.gate.hp,
      hp: s.city.gateHP,
    },
    fort: {
      ...CONFIG.fort,
      id: "fort",
      name: "ป้อมกลาง",
      max: CONFIG.fort.hp,
      hp: s.city.fortHP,
    },
    snapshot: clone(s.city),
    settlement: "PENDING",
    rewind: "PENDING",
    report: null,
    dev: !!options.dev,
  };
  s.raid = b;
  if (options.dev && Number.isFinite(options.gateHP))
    b.gate.hp = options.gateHP;
  hs.forEach((h, i) => {
    h.location = "RAID";
    const d = heroStats(h, s.items);
    b.units.push(
      unit({
        ...d,
        id: h.id,
        heroId: h.id,
        classId: h.classId,
        name: h.name,
        icon: CLASSES[h.classId].icon,
        side: "ally",
        hp: h.hp,
        mana: h.mana,
        x: 29 + (i % 3) * 3,
        y: i < 3 ? 19.5 : 22,
      }),
    );
  });
  for (const [j, q] of s.city.squads.entries())
    for (let i = 0; i < q.count; i++) {
      const p = TROOPS[q.type];
      b.units.push(
        unit({
          ...p,
          id: q.id + "-" + i,
          squadId: q.id,
          side: "ally",
          max: p.hp,
          x: 25 + i * 3,
          y: 17 + j * 2.5,
        }),
      );
    }
  s.city.healing = s.city.healing.filter((id) => !heroIds.includes(id));
  spawn(s);
  event(s, "raid-start", { definitionId, heroIds: [...heroIds] });
  return { ok: true };
}
export function queueOrder(s, ids, type, point = null, targetId = null) {
  const b = s.raid;
  if (
    !b ||
    b.phase !== "ACTIVE" ||
    !["move", "hold", "retreat", "attack", "skill"].includes(type)
  )
    return { ok: false, reason: "คำสั่งใช้ไม่ได้" };
  const us = b.units.filter(
    (u) =>
      u.side === "ally" &&
      alive(u) &&
      (ids.includes(u.id) || ids.includes(u.squadId)),
  );
  if (!us.length) return { ok: false, reason: "เลือกหน่วยที่ยังมีชีวิตก่อน" };
  if (
    ["move", "retreat"].includes(type) &&
    (!point || !walkable(point.x, point.y, b))
  )
    return { ok: false, reason: "ทางถูกปิดหรืออยู่นอกพื้นที่เดิน" };
  if (point && (!Number.isFinite(point.x) || !Number.isFinite(point.y)))
    return { ok: false, reason: "ตำแหน่งไม่ถูกต้อง" };
  b.commands.push({
    unitIds: us.map((u) => u.id),
    type,
    point: point
      ? { x: clamp(point.x, 20, 44), y: clamp(point.y, 3, 59) }
      : null,
    targetId,
  });
  return { ok: true };
}
function hurt(
  s,
  target,
  power,
  source,
  kind = "physical",
  ability = "โจมตีปกติ",
) {
  if (!alive(target)) return;
  const b = s.raid,
    amount = damageValue(
      power,
      kind === "magic" ? target.mdef || 0 : target.def || 0,
    ),
    absorbed = Math.min(target.shield || 0, amount),
    actual = Math.min(target.hp, amount - absorbed);
  target.shield = (target.shield || 0) - absorbed;
  target.hp -= actual;
  const hit = event(s, "damage", {
    sourceId: source.id,
    sourceName: source.name,
    targetId: target.id,
    amount: actual,
    absorbed,
    ability,
    zone: target.y < 24 ? "north" : "inner",
  });
  b.effects.push({
    type: "hit",
    x: target.x,
    y: target.y,
    value: actual,
    until: b.time + 0.45,
  });
  if (target.heroId) {
    const h = s.heroes.find((h) => h.id === target.heroId);
    h.hp = target.hp;
    h.mana = target.mana;
    if (target.hp <= 0 && h.alive) {
      h.alive = false;
      h.location = "DEAD";
      for (const id of [h.weaponId, h.armorId])
        if (s.items[id]) s.items[id].status = "lost";
      const record = {
        heroId: h.id,
        sourceEventId: hit.id,
        raidId: b.id,
        sourceName: source.name,
        ability,
        amount: actual,
        tick: b.tick,
        zone: hit.zone,
      };
      s.deaths.push(record);
      event(s, "hero-death", record);
    } else if (h.hp > 0 && h.hp / target.max < 0.25 && !target.lowWarned) {
      target.lowWarned = true;
      event(s, "hero-low", { heroId: h.id, x: target.x, y: target.y });
    }
  }
  if (target.id === "gate" && target.hp === 0 && !target.breached) {
    target.breached = true;
    b.units.forEach((u) => {
      u.path = null;
      u.pathGoal = null;
    });
    event(s, "gate-breached", { x: 32, y: 24 });
    if (s.settings.autoPauseBreach) b.paused = true;
  }
}
function move(u, to, b) {
  u.moving = false;
  if (u.rootUntil > b.time) return;
  const goal = Math.round(to.x) + "," + Math.round(to.y);
  if (u.pathGoal !== goal || !u.path) {
    u.path = findPath(u, to, b, u.side);
    u.pathGoal = goal;
  }
  if (!u.path) return;
  let distance = u.speed * CONFIG.step;
  while (u.path.length && distance > 0) {
    const p = u.path[0],
      d = dist(u, p);
    if (d < 0.01) {
      u.path.shift();
      continue;
    }
    const step = Math.min(distance, d);
    u.x += ((p.x - u.x) / d) * step;
    u.y += ((p.y - u.y) / d) * step;
    distance -= step;
    u.moving = true;
    if (step === d) u.path.shift();
  }
  if (u.path.length === 0 && ["move", "retreat"].includes(u.order.type)) {
    u.order = { type: "hold", point: { x: u.x, y: u.y } };
  }
}
function launch(s, a, t, power, kind, ability, delay = 0) {
  const b = s.raid;
  if (delay > 0)
    b.projectiles.push({
      sourceId: a.id,
      sourceName: a.name,
      targetId: t.id,
      power,
      kind,
      ability,
      remaining: delay,
      start: { x: a.x, y: a.y },
      duration: delay,
    });
  else hurt(s, t, power, a, kind, ability);
  b.effects.push({ type: "attack", x: a.x, y: a.y, until: b.time + 0.3 });
  a.attackAt = b.time;
}
function skill(s, a, order) {
  const b = s.raid,
    c = CLASSES[a.classId];
  if (!c) return;
  const sk = c.skill;
  if (a.skillCd > 0 || a.mana < sk.mana) {
    event(s, "command-rejected", {
      unitId: a.id,
      reason: "มานาไม่พอหรือสกิลยังไม่พร้อม",
    });
    return;
  }
  const target =
    b.units.find(
      (u) => u.id === order.targetId && u.side === "enemy" && alive(u),
    ) ||
    b.units
      .filter(
        (u) =>
          u.side === "enemy" &&
          alive(u) &&
          dist(a, u) <= sk.range &&
          lineOfSight(a, u, b),
      )
      .sort((x, y) => dist(a, x) - dist(a, y))[0];
  const point = order.point || target;
  if (
    a.classId !== "guardian" &&
    (!point ||
      dist(a, point) > sk.range ||
      !lineOfSight(a, point, b) ||
      (a.classId !== "mage" && !target))
  ) {
    event(s, "command-rejected", {
      unitId: a.id,
      reason: "ไม่มีเป้าหมายในระยะหรือมีกำแพงบัง",
    });
    return;
  }
  a.mana -= sk.mana;
  a.skillCd = sk.cd;
  const h = s.heroes.find((h) => h.id === a.heroId);
  h.mana = a.mana;
  if (a.classId === "guardian") {
    for (const u of b.units.filter(
      (u) => u.side === "ally" && alive(u) && dist(a, u) <= 2,
    )) {
      u.shield = Math.max(u.shield, Math.round(u.max * 0.2));
      u.shieldUntil = b.time + 6;
    }
    b.effects.push({ type: "shield", x: a.x, y: a.y, until: b.time + 0.6 });
  } else if (a.classId === "mage") {
    for (const u of b.units.filter(
      (u) =>
        u.side === "enemy" &&
        alive(u) &&
        dist(point, u) <= 1.5 &&
        lineOfSight(point, u, b),
    ))
      hurt(s, u, a.matk * sk.power, a, "magic", sk.name);
    b.effects.push({
      type: "area",
      x: point.x,
      y: point.y,
      until: b.time + 0.7,
    });
  } else if (a.classId === "archer")
    a.cast = {
      targetId: target.id,
      remaining: 0.5,
      power: a.atk * sk.power,
      ability: sk.name,
    };
  else {
    launch(s, a, target, a.atk * sk.power, "physical", sk.name);
    if (a.classId === "spearman") target.rootUntil = b.time + 2;
  }
  event(s, "skill", { sourceId: a.id, ability: sk.name });
}
function applyCommands(s) {
  const b = s.raid;
  for (const cmd of b.commands)
    for (const id of cmd.unitIds) {
      const u = b.units.find((u) => u.id === id && alive(u));
      if (!u) continue;
      if (cmd.type === "skill") {
        skill(s, u, cmd);
        continue;
      }
      u.cast = null;
      u.path = null;
      u.pathGoal = null;
      u.targetId = cmd.targetId;
      u.order = {
        type: cmd.type,
        point: cmd.point || { x: u.x, y: u.y },
        targetId: cmd.targetId,
      };
    }
  b.commands = [];
}
function settle(s, outcome) {
  const b = s.raid;
  if (s.settled.includes(b.id)) return;
  b.phase = outcome === "win" ? "VICTORY" : "DEFEAT";
  b.paused = true;
  b.settlement = "APPLIED";
  s.settled.push(b.id);
  s.city.gateHP = b.gate.hp;
  s.city.fortHP = b.fort.hp;
  for (const h of s.heroes.filter((h) => h.location === "RAID")) {
    const u = b.units.find((u) => u.heroId === h.id);
    if (u) {
      h.hp = u.hp;
      h.mana = u.mana;
    }
    h.location = h.alive ? "HOME" : "DEAD";
  }
  for (const q of s.city.squads)
    q.count = b.units.filter((u) => u.squadId === q.id && alive(u)).length;
  const first = !s.cleared.includes(b.definitionId),
    gems = outcome === "win" ? (first ? 100 : 10) : 0,
    gold = outcome === "win" ? (first ? 150 : 40) : 0;
  if (outcome === "win") {
    s.wallet.gems += gems;
    s.city.gold += gold;
    s.city.wood += 30;
    s.city.stone += 30;
    s.city.iron += 10;
    if (first) s.cleared.push(b.definitionId);
    for (const h of s.heroes.filter(
      (h) => h.alive && b.units.some((u) => u.heroId === h.id),
    )) {
      h.xp += 20;
      while (h.level < 10 && h.xp >= 50 + 25 * (h.level - 1)) {
        h.xp -= 50 + 25 * (h.level - 1);
        h.level++;
      }
    }
  }
  b.report = {
    outcome,
    gems,
    gold,
    materials: outcome === "win" ? { wood: 30, stone: 30, iron: 10 } : null,
    deaths: s.deaths.filter((d) => d.raidId === b.id),
    soldiersLost:
      b.snapshot.squads.reduce((n, q) => n + q.count, 0) -
      s.city.squads.reduce((n, q) => n + q.count, 0),
    time: b.time,
    gateHP: b.gate.hp,
    fortHP: b.fort.hp,
  };
  event(s, "raid-result", { outcome, gems, gold });
}
export function rewind(s) {
  const b = s.raid;
  if (!b || (b.phase !== "DEFEAT" && b.phase !== "REWOUND")) return false;
  if (s.rewound.includes(b.id)) return true;
  s.city = clone(b.snapshot);
  s.city.healing = s.city.healing.filter((id) =>
    s.heroes.some((h) => h.id === id && h.alive && h.location === "HOME"),
  );
  s.rewound.push(b.id);
  b.rewind = "APPLIED";
  b.phase = "REWOUND";
  event(s, "rewind", { deadHeroes: b.report.deaths.map((d) => d.heroId) });
  return true;
}
export function returnToCity(s) {
  const b = s.raid;
  if (!b || !["VICTORY", "REWOUND"].includes(b.phase)) return false;
  b.phase = "CITY";
  event(s, "return-city");
  return true;
}
export function devDamage(s, targetId, amount) {
  if (!s.raid?.dev || s.raid.phase !== "ACTIVE") return false;
  const b = s.raid,
    target =
      targetId === "gate"
        ? b.gate
        : targetId === "fort"
          ? b.fort
          : b.units.find((u) => u.id === targetId);
  if (!target) return false;
  hurt(s, target, amount, { id: "dev", name: "สถานการณ์ทดสอบ" });
  if (b.fort.hp <= 0) settle(s, "loss");
  return true;
}
export function step(s) {
  const b = s.raid;
  if (!b || b.phase === "CITY") {
    cityStep(s, CONFIG.step);
    return;
  }
  if (b.phase !== "ACTIVE" || b.paused) return;
  b.tick++;
  b.time = b.tick * CONFIG.step;
  applyCommands(s);
  b.effects = b.effects.filter((e) => e.until > b.time);
  for (const p of b.projectiles) {
    p.remaining -= CONFIG.step;
    if (p.remaining <= 0) {
      const target =
        b.units.find((u) => u.id === p.targetId) ||
        [b.gate, b.fort].find((u) => u.id === p.targetId);
      if (target && alive(target))
        hurt(
          s,
          target,
          p.power,
          { id: p.sourceId, name: p.sourceName },
          p.kind,
          p.ability,
        );
    }
  }
  b.projectiles = b.projectiles.filter((p) => p.remaining > 0);
  for (const t of b.telegraphs) {
    if (b.time >= t.at) {
      for (const u of b.units.filter(
        (u) => u.side === "ally" && alive(u) && dist(u, t) <= 2,
      ))
        hurt(
          s,
          u,
          100,
          { id: t.sourceId, name: "หัวหน้ากองบุก" },
          "physical",
          "ทุบพื้นที่",
        );
    }
  }
  b.telegraphs = b.telegraphs.filter((t) => b.time < t.at);
  for (const u of b.units.filter(alive)) {
    if (!alive(u)) continue;
    u.moving = false;
    u.cd = Math.max(0, u.cd - CONFIG.step);
    u.skillCd = Math.max(0, u.skillCd - CONFIG.step);
    if (u.shieldUntil <= b.time) u.shield = 0;
    if (u.cast) {
      u.cast.remaining -= CONFIG.step;
      if (u.cast.remaining <= 0) {
        const target = b.units.find(
          (x) => x.id === u.cast.targetId && alive(x),
        );
        if (target && lineOfSight(u, target, b))
          launch(
            s,
            u,
            target,
            u.cast.power,
            "physical",
            u.cast.ability,
            dist(u, target) / 16,
          );
        u.cast = null;
      }
      continue;
    }
    if (u.side === "ally" && ["move", "retreat"].includes(u.order.type)) {
      move(u, u.order.point, b);
      continue;
    }
    let target;
    if (u.side === "enemy") {
      const choices = b.units.filter(
        (a) =>
          a.side === "ally" &&
          alive(a) &&
          dist(u, a) <= Math.max(2.5, u.range) &&
          lineOfSight(u, a, b),
      );
      target = choices
        .sort((a, c) => dist(u, a) - dist(u, c))
        .find(
          (a) =>
            u.range > 1 ||
            b.units.filter(
              (e) =>
                e.side === "enemy" &&
                alive(e) &&
                e.targetId === a.id &&
                e.id !== u.id,
            ).length < (a.classId === "guardian" ? 2 : 1),
        );
      if (!target) target = b.gate.hp > 0 && u.y < 24 ? b.gate : b.fort;
      if (u.type === "captain") {
        u.bossCd -= CONFIG.step;
        if (u.bossCd <= 0 && target.side === "ally") {
          b.telegraphs.push({
            x: target.x,
            y: target.y,
            at: b.time + 2,
            sourceId: u.id,
          });
          u.bossCd = 12;
        }
      }
    } else {
      target = b.units.find(
        (e) => e.id === u.order.targetId && alive(e) && e.side === "enemy",
      );
      if (!target) {
        const point = u.order.point;
        target = b.units
          .filter(
            (e) =>
              e.side === "enemy" &&
              alive(e) &&
              dist(point, e) <= u.range + 2 &&
              lineOfSight(u, e, b),
          )
          .sort((a, c) => dist(u, a) - dist(u, c))[0];
      }
      if (!target) {
        if (dist(u, u.order.point) > 0.2) move(u, u.order.point, b);
        continue;
      }
    }
    u.targetId = target.id;
    const inRange =
      dist(u, target) <= u.range + 0.25 && lineOfSight(u, target, b);
    if (inRange && u.cd <= 0) {
      const magic = u.classId === "mage",
        power =
          (magic ? u.matk : u.atk) *
          (u.type === "breaker" && ["gate", "fort"].includes(target.id)
            ? 3
            : 1);
      launch(
        s,
        u,
        target,
        power,
        magic ? "magic" : "physical",
        "โจมตีปกติ",
        u.range > 2 ? dist(u, target) / 16 : 0,
      );
      u.cd = u.interval;
    } else if (!inRange) {
      const point =
        target.id === "gate"
          ? { x: clamp(u.x, 29, 35), y: 23 }
          : target.id === "fort"
            ? { x: 32, y: 53 }
            : target;
      if (
        u.side === "enemy" ||
        u.order.type === "attack" ||
        dist(u, u.order.point) < 1.9
      )
        move(u, point, b);
    }
  }
  // Small bounded separation keeps units distinct without changing collision topology.
  const us = b.units.filter(alive);
  for (let i = 0; i < us.length; i++)
    for (let j = i + 1; j < us.length; j++) {
      const a = us[i],
        c = us[j],
        d = dist(a, c);
      if (d > 0.01 && d < 0.55) {
        const dx = ((a.x - c.x) / d) * 0.015,
          dy = ((a.y - c.y) / d) * 0.015;
        if (walkable(a.x + dx, a.y + dy, b, a.side)) {
          a.x += dx;
          a.y += dy;
        }
        if (walkable(c.x - dx, c.y - dy, b, c.side)) {
          c.x -= dx;
          c.y -= dy;
        }
      }
    }
  if (b.fort.hp <= 0) {
    settle(s, "loss");
    return;
  }
  if (
    !b.units.some((u) => u.side === "enemy" && alive(u)) &&
    !b.projectiles.length
  ) {
    if (b.wave === 3) {
      settle(s, "win");
      return;
    }
    if (b.nextWave === null) b.nextWave = b.time + CONFIG.waveDelay;
    if (b.time >= b.nextWave) {
      b.wave++;
      b.nextWave = null;
      spawn(s);
    }
  }
  for (const h of s.heroes.filter((h) => h.location === "RAID")) {
    const u = b.units.find((u) => u.heroId === h.id);
    if (u) {
      h.hp = u.hp;
      h.mana = u.mana;
    }
  }
}
