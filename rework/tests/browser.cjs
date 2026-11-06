const assert = require("node:assert/strict");
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  try {
    const p = await b.newPage({ viewport: { width: 1440, height: 1000 } }),
      errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto("http://127.0.0.1:8000/rework/");
    await p.evaluate(() =>
      localStorage.setItem("mistbound-v5", "legacy-untouched"),
    );
    await p.getByText("เครื่องมือทดสอบและเซฟ", { exact: true }).click();
    await p.locator("#dev").check();
    await p.locator('[data-do="start"]').click();
    await p.locator("#pause").click();
    await p.locator("#retreat").click();
    await p.waitForTimeout(1100);
    let s = await p.evaluate(() =>
      JSON.parse(localStorage.getItem("mistbound-city-prototype-v1")),
    );
    assert.equal(s.raid.paused, true);
    assert.equal(s.raid.commands.length, 1);
    const tick = s.raid.tick;
    await p.reload();
    await p.waitForTimeout(300);
    assert.match(await p.locator("#banner").innerText(), /หยุดวางแผน/);
    await p.locator("#pause").click();
    await p.waitForTimeout(300);
    await p.getByText("เครื่องมือทดสอบและเซฟ", { exact: true }).click();
    await p.locator('[data-damage="gate"]').click();
    assert.match(await p.locator("#status").innerText(), /ประตูแตก/);
    await p.locator('[data-damage="hero-1"]').click();
    await p.locator('[data-damage="fort"]').click();
    await p.locator('[data-do="rewind"]').click();
    await p.locator('[data-do="return"]').click();
    assert.match(
      await p.locator('[data-pick="hero-1"]').innerText(),
      /เสียชีวิตถาวร/,
    );
    assert.equal(
      await p.evaluate(() => localStorage.getItem("mistbound-v5")),
      "legacy-untouched",
    );
    await p.screenshot({ path: "/tmp/rework-desktop.png", fullPage: true });
    await p.setViewportSize({ width: 390, height: 844 });
    assert.equal(
      await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await p.screenshot({ path: "/tmp/rework-mobile.png", fullPage: true });
    assert.deepEqual(errors, []);
    console.log(
      "PASS browser: pause commands, reload, breach, death, defeat, rewind, legacy save isolation, mobile layout. Initial tick",
      tick,
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
