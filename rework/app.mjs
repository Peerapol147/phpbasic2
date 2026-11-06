import { CONFIG, CLASSES, TROOPS, RAIDS, ZONES, BUILDINGS } from "./config.mjs";
import {
  createCampaign,
  heroStats,
  healHero,
  recruit,
  repair,
} from "./domain.mjs";
import {
  beginRaid,
  step,
  queueOrder,
  rewind,
  returnToCity,
  devDamage,
} from "./simulation.mjs";
import { SAVE_KEY, decode, save } from "./storage.mjs";
const $ = (id) => document.getElementById(id),
  canvas = $("world"),
  ctx = canvas.getContext("2d");
let s,
  blocked = false;
try {
  s = localStorage.getItem(SAVE_KEY)
    ? decode(localStorage.getItem(SAVE_KEY))
    : createCampaign();
} catch (e) {
  blocked = true;
  s = createCampaign();
  $("message").textContent =
    "โหลดเซฟไม่ได้: " + e.message + " — ดาวน์โหลดสำรองก่อนเริ่มใหม่";
}
let lastControls = "",
  critical = "";
let selected = new Set(["hero-1"]),
  camera = { x: 32, y: 23 },
  zoom = 19,
  chosenRaid = "raid-1",
  dev = false,
  last = performance.now(),
  acc = 0,
  uiTime = 0,
  saveTime = 0;
const active = () => s.raid?.phase === "ACTIVE",
  city = () => !s.raid || s.raid.phase === "CITY";
function persist() {
  if (blocked) return;
  try {
    save(s);
  } catch (e) {
    blocked = true;
    msg("บันทึกไม่ได้ หยุดการจำลองไว้แล้ว กรุณาดาวน์โหลดเซฟ: " + e.message);
  }
}
function msg(t) {
  $("message").textContent = t;
}
function act(fn) {
  if (blocked) return;
  const result = fn();
  if (result?.reason) msg(result.reason);
  persist();
  ui();
}
function order(type, point = null, targetId = null) {
  act(() => queueOrder(s, [...selected], type, point, targetId));
}
function project(x, y) {
  return {
    x: canvas.clientWidth / 2 + (x - camera.x) * zoom,
    y: canvas.clientHeight / 2 + (y - camera.y) * zoom * 0.78,
  };
}
function unproject(x, y) {
  return {
    x: camera.x + (x - canvas.clientWidth / 2) / zoom,
    y: camera.y + (y - canvas.clientHeight / 2) / (zoom * 0.78),
  };
}
function rect(x, y, w, h, color) {
  const p = project(x, y);
  ctx.fillStyle = color;
  ctx.fillRect(p.x, p.y, w * zoom, h * zoom * 0.78);
}
function circle(x, y, r, color) {
  const p = project(x, y);
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, r * zoom, r * zoom * 0.78, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
function label(x, y, t, color = "#c7c6ae", size = 12) {
  const p = project(x, y);
  ctx.font = `${size}px Tahoma`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(t, p.x, p.y);
}
function draw() {
  const w = canvas.clientWidth,
    h = canvas.clientHeight,
    dpr = devicePixelRatio || 1;
  if (
    canvas.width !== Math.round(w * dpr) ||
    canvas.height !== Math.round(h * dpr)
  ) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#18282a";
  ctx.fillRect(0, 0, w, h);
  rect(20, 3, 24, 56, "#34413c");
  rect(28, 3, 8, 56, "#635e4d");
  for (let y = 3; y < 60; y += 2)
    for (let x = 20; x < 44; x += 2) {
      const p = project(x, y);
      ctx.strokeStyle = "#ffffff07";
      ctx.strokeRect(p.x, p.y, zoom * 2, zoom * 1.56);
    }
  for (let i = 0; i < 48; i++) {
    const x = i % 2 ? 18 - (i % 3) : 46 + (i % 3),
      y = 3 + i * 1.2;
    circle(x, y, 1.1, "#482f34");
    circle(x + 0.2, y - 0.3, 0.8, "#704044");
  }
  rect(20, 23.5, 9, 1.4, "#202c30");
  rect(36, 23.5, 8, 1.4, "#202c30");
  for (const x of [20, 27, 36, 42]) {
    rect(x, 22.7, 2, 2.6, "#475052");
    label(x + 1, 23.8, "⚑", "#b86453", 23);
  }
  const b = s.raid,
    gate = active() ? b.gate.hp : s.city.gateHP,
    fort = active() ? b.fort.hp : s.city.fortHP;
  rect(29, 23.8, 7, 0.7, gate > 0 ? "#a18a5c" : "#38332e");
  label(
    32,
    26,
    `ประตู ${Math.ceil(gate)}/${CONFIG.gate.hp}`,
    gate > 0 ? "#dec48d" : "#ee8c70",
  );
  for (const building of BUILDINGS) {
    rect(building.x - 1.4, building.y - 1, 2.8, 2, "#515955");
    label(building.x, building.y, building.icon, "#d7bf88", 25);
    label(building.x, building.y + 1.7, building.name, "#adb7ac", 10);
  }
  rect(29.5, 53, 5, 3, "#353b40");
  label(32, 54.8, "♜", "#cdb780", 32);
  label(32, 58, `ป้อม ${Math.ceil(fort)}/${CONFIG.fort.hp}`);
  label(32, 8, "แนวเหนือ · ทางเข้ากองบุก", "#bbb19a", 16);
  label(32, 34, "ถนนชั้นใน", "#bbb19a", 14);
  if (b && b.phase !== "CITY") {
    for (const t of b.telegraphs) circle(t.x, t.y, 2, "#dc603c77");
    for (const u of b.units) {
      if (u.hp <= 0) {
        label(u.x, u.y, "×", "#754e46", 17);
        continue;
      }
      const pick = selected.has(u.id) || selected.has(u.squadId);
      if (pick) {
        circle(u.x, u.y, 0.8, "#eac77b50");
        const point = u.order.point;
        if (point && ["move", "retreat"].includes(u.order.type)) {
          const a = project(u.x, u.y),
            p = project(point.x, point.y);
          ctx.strokeStyle = "#eac77b70";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }
      circle(
        u.x,
        u.y,
        0.43,
        u.side === "enemy" ? "#a4544c" : u.heroId ? "#c7b474" : "#719b92",
      );
      label(
        u.x,
        u.y + 0.2,
        u.icon || "◆",
        u.side === "enemy" ? "#ffe3d6" : "#152624",
        u.heroId ? 20 : 13,
      );
      const p = project(u.x, u.y - 0.8);
      ctx.fillStyle = "#161e20";
      ctx.fillRect(p.x - 11, p.y, 22, 3);
      ctx.fillStyle = u.side === "enemy" ? "#d47161" : "#81c5a4";
      ctx.fillRect(p.x - 11, p.y, (22 * u.hp) / u.max, 3);
      if (u.shield > 0) {
        ctx.strokeStyle = "#b2ddec";
        ctx.beginPath();
        ctx.arc(
          project(u.x, u.y).x,
          project(u.x, u.y).y,
          zoom * 0.65,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
    }
    for (const p of b.projectiles) {
      const t =
        b.units.find((u) => u.id === p.targetId) ||
        [b.gate, b.fort].find((u) => u.id === p.targetId);
      if (t) {
        const f = 1 - p.remaining / p.duration;
        circle(
          p.start.x + (t.x - p.start.x) * f,
          p.start.y + (t.y - p.start.y) * f,
          0.13,
          p.kind === "magic" ? "#f0ad66" : "#e9d29b",
        );
      }
    }
    for (const e of b.effects) {
      if (e.type === "hit")
        label(
          e.x,
          e.y - 1 - (0.45 - (e.until - b.time)),
          String(e.value),
          "#ffce9d",
        );
      else if (e.type === "area" || e.type === "shield")
        circle(
          e.x,
          e.y,
          e.type === "area" ? 1.5 : 2,
          e.type === "area" ? "#e8974855" : "#91cfe655",
        );
    }
  }
  const m = $("minimap").getContext("2d");
  m.fillStyle = "#142023";
  m.fillRect(0, 0, 128, 160);
  m.fillStyle = "#536151";
  m.fillRect(40, 8, 48, 143);
  m.fillStyle = "#b39b67";
  m.fillRect(40, 60, 48, 3);
  m.fillRect(59, 135, 10, 6);
  if (b && b.phase !== "CITY")
    for (const u of b.units.filter((u) => u.hp > 0)) {
      m.fillStyle = u.side === "enemy" ? "#e37866" : "#9dd1ba";
      m.fillRect(u.x * 2, u.y * 2.5, 2, 2);
    }
  m.strokeStyle = "#f1d69c";
  m.strokeRect(
    (camera.x - w / zoom / 2) * 2,
    (camera.y - h / (zoom * 0.78) / 2) * 2.5,
    (w / zoom) * 2,
    (h / (zoom * 0.78)) * 2.5,
  );
}
function ui() {
  let controlHTML = "";
  const b = s.raid;
  $("resources").textContent =
    `ทอง ${Math.floor(s.city.gold)} · ไม้ ${s.city.wood} · หิน ${s.city.stone} · เหล็ก ${s.city.iron} | เพชร ${s.wallet.gems}`;
  $("banner").textContent = blocked
    ? "หยุด: ตรวจสอบเซฟ"
    : active()
      ? `${b.paused ? "หยุดวางแผน" : "กำลังป้องกัน"} • ระลอก ${b.wave}/3 • ${b.time.toFixed(1)} วินาที${b.nextWave ? " • เตรียมระลอกถัดไป" : ""}`
      : city()
        ? "เตรียมเมือง • เริ่มเรดเมื่อพร้อม"
        : b.phase === "VICTORY"
          ? "ป้องกันสำเร็จ"
          : b.phase === "REWOUND"
            ? "ย้อนเมืองแล้ว • ฮีโร่ไม่ย้อนคืน"
            : "ป้อมแตก • การป้องกันสิ้นสุด";
  $("status").textContent = active()
    ? `ประตู ${Math.ceil(b.gate.hp)} / ป้อม ${Math.ceil(b.fort.hp)} · คำสั่งรอ ${b.commands.length}${b.gate.breached ? " · ประตูแตกแล้ว ตั้งรับชั้นในต่อได้" : ""}`
    : `ผ่านแล้ว ${s.cleared.length}/3 เรด · ฮีโร่เสียชีวิต ${s.deaths.length} คน`;
  $("roster").innerHTML =
    s.heroes
      .map((h) => {
        const u = active() ? b.units.find((u) => u.id === h.id) : null,
          d = heroStats(h, s.items);
        return `<button class="card ${selected.has(h.id) ? "selected" : ""} ${h.alive ? "" : "dead"}" data-pick="${h.id}"><span class="badge">${CLASSES[h.classId].icon}</span><span>${h.name} · ${CLASSES[h.classId].name}<br><small>${h.alive ? `★★ Lv.${h.level} · HP ${Math.ceil(h.hp)}/${d.max} · MP ${Math.floor(h.mana)}` : "เสียชีวิตถาวร"}${u?.skillCd > 0 ? " · CD " + Math.ceil(u.skillCd) : ""}</small><progress value="${h.hp}" max="${d.max}"></progress></span></button>`;
      })
      .join("") +
    s.city.squads
      .map(
        (q) =>
          `<button class="card ${selected.has(q.id) ? "selected" : ""}" data-pick="${q.id}">${TROOPS[q.type].icon} ${TROOPS[q.type].name} · ${active() ? b.units.filter((u) => u.squadId === q.id && u.hp > 0).length : q.count}/5</button>`,
      )
      .join("");
  const hero = s.heroes.find((h) => selected.size === 1 && selected.has(h.id));
  $("details").textContent = hero
    ? `${CLASSES[hero.classId].skill.name} • ใช้ ${CLASSES[hero.classId].skill.mana} MP / CD ${CLASSES[hero.classId].skill.cd}s • ATK ${heroStats(hero, s.items).atk} / MATK ${heroStats(hero, s.items).matk} / DEF ${heroStats(hero, s.items).def}`
    : "เลือกฮีโร่เพื่อดูสกิล · เลือกหลายหน่วยด้วย Shift";
  if (city())
    controlHTML = `<h2>เตรียมกองป้องกัน</h2><select id="raidSelect">${RAIDS.map((r) => `<option value="${r.id}" ${r.id === chosenRaid ? "selected" : ""}>${r.name}</option>`).join("")}</select><p>${RAIDS.find((r) => r.id === chosenRaid).text}</p><button class="primary" data-do="start">เริ่มเรด · ฮีโร่ที่มีชีวิตทั้งหมด</button><h2>ฟื้นฟูเมือง</h2><button data-do="heal">รักษาฮีโร่ที่เลือก</button><button data-do="gate">ซ่อมประตู</button><button data-do="fort">ซ่อมป้อม</button>${s.city.squads.map((q) => `<button data-recruit="${q.id}">เกณฑ์ ${TROOPS[q.type].name} +1 · 20 ทอง</button>`).join("")}<p class="hint">กำลังรักษา ${s.city.healing.length} คน · เกณฑ์ ${s.city.recruits.length} คน<br>ผลิตทรัพยากรขณะเปิดหน้าเมืองทุก 60 วินาที<br>โรงตีเหล็ก / กาชา / ดันเจี้ยน: รอบถัดไป</p>`;
  else if (active())
    controlHTML =
      '<p>ไม่มีฟื้น HP/MP ระหว่างเรด · ถอนหน่วยก่อนถูกสังหาร</p><label><input id="autoPause" type="checkbox" ' +
      (s.settings.autoPauseBreach ? "checked" : "") +
      "> หยุดอัตโนมัติเมื่อประตูแตก</label>";
  else
    controlHTML = `<h2>${b.phase === "VICTORY" ? "ผลชัยชนะ" : "ผลการสูญเสีย"}</h2><p>เพชร +${b.report.gems} · ทอง +${b.report.gold}<br>ฮีโร่ตาย ${b.report.deaths.length} · ทหารสูญเสีย ${b.report.soldiersLost}</p>${b.phase === "DEFEAT" ? '<p class="danger">ย้อนเฉพาะเมืองและทหาร ฮีโร่ที่ตายและอุปกรณ์สูญหายไม่กลับคืน</p><button data-do="rewind">ย้อนเมือง</button>' : '<button class="primary" data-do="return">กลับเมือง</button>'}`;
  if (controlHTML !== lastControls) {
    $("controls").innerHTML = controlHTML;
    lastControls = controlHTML;
  }
  $("pause").disabled = !active();
  $("pause").textContent = b?.paused ? "เล่นต่อ (Space)" : "หยุด (Space)";
  for (const id of ["hold", "retreat", "skill", "all"])
    $(id).disabled = !active();
  $("dev").disabled = !city();
  $("devActions").innerHTML =
    b?.dev && active()
      ? '<button data-damage="gate">ทดสอบประตูแตก</button><button data-damage="hero-1">ทดสอบฮีโร่ตาย</button><button data-damage="fort">ทดสอบแพ้</button>'
      : "";
  $("log").textContent = s.events
    .slice(-35)
    .reverse()
    .map(
      (e) =>
        `${e.tick} · ${e.type} ${e.ability || e.reason || e.sourceName || ""} ${e.amount ?? ""}`,
    )
    .join("\n");
  $("log").style.whiteSpace = "pre-line";
}
$("zones").innerHTML = ZONES.map(
  (z) =>
    `<button data-zone="${z.id}" ${z.open ? "" : "disabled"}>${z.name}</button>`,
).join("");
document.addEventListener("click", (e) => {
  const el = e.target.closest("button");
  if (!el) return;
  if (el.dataset.zone) {
    const z = ZONES.find((z) => z.id === el.dataset.zone);
    camera = { x: z.x, y: z.y };
  }
  if (el.dataset.pick) {
    if (!e.shiftKey) selected.clear();
    const id = el.dataset.pick;
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    ui();
  }
  if (el.dataset.recruit)
    act(() => {
      if (!recruit(s, el.dataset.recruit)) msg("หมู่เต็มแล้ว หรือทองไม่พอ");
    });
  if (el.dataset.damage) act(() => devDamage(s, el.dataset.damage, 100000));
  if (el.dataset.do)
    act(() => {
      switch (el.dataset.do) {
        case "start":
          return beginRaid(
            s,
            chosenRaid,
            s.heroes
              .filter((h) => h.alive && h.location === "HOME")
              .map((h) => h.id),
            { dev },
          );
        case "heal": {
          const id = [...selected][0];
          return healHero(s, id);
        }
        case "gate":
        case "fort":
          if (!repair(s, el.dataset.do)) msg("ไม่ต้องซ่อม หรือทรัพยากรไม่พอ");
          break;
        case "rewind":
          rewind(s);
          break;
        case "return":
          returnToCity(s);
          camera = { x: 32, y: 46 };
          break;
      }
    });
});
document.addEventListener("change", (e) => {
  if (e.target.id === "raidSelect") {
    chosenRaid = e.target.value;
    ui();
  }
  if (e.target.id === "autoPause") {
    s.settings.autoPauseBreach = e.target.checked;
    persist();
  }
});
function togglePause() {
  if (active() && !blocked) {
    s.raid.paused = !s.raid.paused;
    persist();
    ui();
  }
}
$("pause").onclick = togglePause;
document.addEventListener("keydown", (e) => {
  if (
    e.code === "Space" &&
    !["SELECT", "INPUT", "BUTTON"].includes(document.activeElement.tagName)
  ) {
    e.preventDefault();
    togglePause();
  }
});
$("speed").value = s.settings.speed;
$("speed").onchange = (e) => {
  s.settings.speed = Number(e.target.value);
  persist();
};
$("hold").onclick = () => order("hold");
$("retreat").onclick = () => order("retreat", { x: 32, y: 35 });
$("skill").onclick = () => order("skill");
$("all").onclick = () => {
  selected = new Set(
    s.raid.units
      .filter((u) => u.side === "ally" && u.hp > 0)
      .map((u) => u.heroId || u.squadId),
  );
  ui();
};
$("dev").onchange = (e) => {
  dev = e.target.checked;
};
function pointer(e, right = false) {
  if (!active()) return;
  const r = canvas.getBoundingClientRect(),
    p = unproject(e.clientX - r.left, e.clientY - r.top),
    u = s.raid.units
      .filter((u) => u.hp > 0)
      .sort(
        (a, b) =>
          Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y),
      )[0];
  if (u && Math.hypot(u.x - p.x, u.y - p.y) < 1) {
    if (u.side === "ally" && !right) {
      if (!e.shiftKey) selected.clear();
      const id = u.heroId || u.squadId;
      selected.has(id) ? selected.delete(id) : selected.add(id);
      ui();
    } else if (u.side === "enemy") order("attack", null, u.id);
    return;
  }
  order("move", p);
}
canvas.onclick = (e) => pointer(e);
canvas.oncontextmenu = (e) => {
  e.preventDefault();
  pointer(e, true);
};
canvas.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    zoom = Math.max(10, Math.min(32, zoom - e.deltaY * 0.015));
  },
  { passive: false },
);
$("minimap").onclick = (e) => {
  const r = e.target.getBoundingClientRect();
  camera = {
    x: Math.max(24, Math.min(40, (e.clientX - r.left) / 2)),
    y: Math.max(10, Math.min(54, (e.clientY - r.top) / 2.5)),
  };
};
$("export").onclick = () => {
  const blob = new Blob(
      [
        blocked
          ? localStorage.getItem(SAVE_KEY) || JSON.stringify(s)
          : JSON.stringify(s, null, 2),
      ],
      { type: "application/json" },
    ),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = "mistbound-city-backup.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$("reset").onclick = () => {
  if (
    !confirm(
      "เริ่มเซฟทดลองใหม่? เซฟทดลองปัจจุบันจะเก็บสำรองหนึ่งชุด เกมเดิมไม่เปลี่ยน",
    )
  )
    return;
  try {
    const old = localStorage.getItem(SAVE_KEY);
    if (old) localStorage.setItem(SAVE_KEY + "-backup", old);
    s = createCampaign();
    blocked = false;
    persist();
    ui();
    msg("เริ่มเซฟทดลองใหม่แล้ว");
  } catch (e) {
    msg("สำรองไม่สำเร็จ ไม่ได้ลบเซฟเดิม: " + e.message);
  }
};
window.addEventListener("pagehide", persist);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (active()) s.raid.paused = true;
    persist();
    acc = 0;
  }
  last = performance.now();
});
function frame(now) {
  const dt = Math.min(0.2, (now - last) / 1000);
  last = now;
  if (!document.hidden && !blocked) {
    acc += dt * s.settings.speed;
    while (acc >= CONFIG.step) {
      step(s);
      acc -= CONFIG.step;
      const key = [
        s.deaths.length,
        s.settled.length,
        s.rewound.length,
        s.raid?.gate.breached,
      ].join(":");
      if (key !== critical) {
        critical = key;
        persist();
      }
    }
  }
  uiTime += dt;
  saveTime += dt;
  if (uiTime > 0.3) {
    ui();
    uiTime = 0;
  }
  if (saveTime > 1) {
    persist();
    saveTime = 0;
  }
  draw();
  requestAnimationFrame(frame);
}
ui();
persist();
requestAnimationFrame(frame);
