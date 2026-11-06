export const SAVE_KEY = "mistbound-city-prototype-v1";
export function decode(raw) {
  const s = JSON.parse(raw);
  if (
    s.schemaVersion !== 1 ||
    !s.city ||
    !s.wallet ||
    !Array.isArray(s.heroes) ||
    !Array.isArray(s.events) ||
    !Array.isArray(s.deaths) ||
    !Array.isArray(s.settled) ||
    !Array.isArray(s.rewound) ||
    !Array.isArray(s.city.squads) ||
    !s.items ||
    !s.settings
  )
    throw Error("รูปแบบเซฟไม่รองรับ");
  if (s.raid?.phase === "ACTIVE") {
    if (
      !Array.isArray(s.raid.units) ||
      !Array.isArray(s.raid.projectiles) ||
      !Array.isArray(s.raid.commands)
    )
      throw Error("ข้อมูลเรดไม่ครบ");
    s.raid.paused = true;
  }
  return s;
}
export function save(s, storage = localStorage) {
  storage.setItem(SAVE_KEY, JSON.stringify(s));
}
