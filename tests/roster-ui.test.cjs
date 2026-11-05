const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
await page.goto('http://127.0.0.1:8000/');await page.locator('[data-page=heroes]').click();assert.equal(await page.locator('.roster-item').count(),8);
await page.locator('[data-action="lock:1"]').click();
await page.locator('[data-salvage="5"]').check();await page.locator('[data-salvage="7"]').check();assert.equal(await page.locator('[data-salvage]:checked').count(),2);
await page.locator('[data-action="dismantle-review"]').click();assert.equal(await page.locator('.salvage-review li').count(),2);await page.locator('[data-action="close-detail"]').click();assert.equal(await page.locator('.roster-item').count(),8);
await page.locator('[data-action="dismantle-review"]').click();await page.locator('[data-action="dismantle-confirm"]').click();assert.equal(await page.locator('.roster-item').count(),6);let save=await page.evaluate(()=>JSON.parse(localStorage.getItem('mistbound-v5')));assert.equal(save.stones,2);assert.equal(save.materials,4);assert.equal(save.heroes.find(h=>h.id===1).locked,true);assert.deepEqual(save.team,[2,3,4,6,8]);
await page.reload();await page.locator('[data-page=heroes]').click();assert.equal(await page.locator('.roster-item').count(),6);await page.screenshot({path:'/tmp/roster-desktop.png',fullPage:true});
await page.locator('#hero-search').fill('no such hero');assert.equal(await page.locator('.empty-roster').count(),1);await page.locator('.empty-roster [data-action=clear-filters]').click();assert.equal(await page.locator('.roster-item').count(),6);
await page.locator('[data-action="hero-tab:training"]').click();const gold=save.gold;await page.locator('[data-action="train:1"]').click();save=await page.evaluate(()=>JSON.parse(localStorage.getItem('mistbound-v5')));assert.equal(save.gold,gold-200);
await page.locator('[data-action="hero-tab:party"]').click();await page.locator('.formation-slots [data-action="team:2"]').click();assert.match(await page.locator('.formation-slots').innerText(),/ว่าง/);await page.locator('.roster-actions [data-action="team:2"]').click();
await page.locator('[data-page=bag]').click();assert.equal(await page.locator('.inventory-item').count(),7);
await page.setViewportSize({width:390,height:844});for(const name of ['heroes','bag','shop','talents','gacha','tower']){await page.locator(`[data-page=${name}]`).click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,name);}
await page.locator('[data-page=heroes]').click();await page.screenshot({path:'/tmp/roster-mobile.png',fullPage:true});assert.deepEqual(errors,[]);console.log('PASS lock, batch preview/cancel/confirm, exact saved rewards, reload, filters, train, formation, inventory, six mobile pages.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
