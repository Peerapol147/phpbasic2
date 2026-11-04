// Run with a local server: python3 -m http.server 8000 --bind 127.0.0.1
// Requires Playwright and Chromium; optional browser path via CHROMIUM_PATH.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1162,height:800}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{const seed=sessionStorage.getItem('test-seed');if(seed){localStorage.setItem('mistbound-v5',seed);sessionStorage.removeItem('test-seed');}window.saveWrites=0;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(...args){window.saveWrites++;return original.apply(this,args);};});
  await page.goto(process.env.GAME_TEST_URL||'http://127.0.0.1:8000');
  await page.locator('[data-page="gacha"]').click();
  await page.locator('[data-action="summon:50"]').click();
  assert.equal(await page.locator('#results .portrait .hero-art').count(),50);
  assert.equal(await page.locator('#results').evaluate(n=>n.scrollTop),0);
  const art=await page.locator('.portrait .hero-art').first().evaluate(async n=>{const c=getComputedStyle(n),image=new Image();image.src=c.backgroundImage.slice(5,-2);await image.decode();return {background:c.backgroundImage,position:c.position,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height};});
  assert.match(art.background,/hero-atlas/);assert.equal(art.position,'relative');assert.ok(art.width>0&&art.height>0);
  await page.screenshot({path:'/tmp/mistbound-summon-fixed.png'});
  await page.locator('#results').evaluate(n=>{n.scrollTop=n.scrollHeight;});
  await page.locator('.portrait .hero-art').last().scrollIntoViewIfNeeded();
  assert.notEqual(await page.locator('.portrait .hero-art').last().evaluate(n=>getComputedStyle(n).backgroundImage),'none');
  await page.locator('#close-results').click();
  await page.evaluate(async()=>{const {create}=await import('./engine.mjs');const s=create();s.floor=20;s.cleared=19;sessionStorage.setItem('test-seed',JSON.stringify(s));});
  await page.reload();await page.locator('[data-page="tower"]').click();await page.locator('[data-action="floor:20"]').click();await page.locator('[data-action="selected"]').click();
  await page.locator('.combat-options>summary').click();
  await page.evaluate(()=>{window.originalFighter=document.querySelector('.fighter');window.originalNav=document.querySelector('#nav button');window.originalHUD=document.querySelector('.hud-unit');window.saveWrites=0;});
  await page.waitForTimeout(2200);
  const retained=await page.evaluate(()=>({fighter:window.originalFighter===document.querySelector('.fighter'),nav:window.originalNav===document.querySelector('#nav button'),hud:window.originalHUD===document.querySelector('.hud-unit'),options:document.querySelector('.combat-options').open,writes:window.saveWrites}));
  assert.deepEqual(retained,{fighter:true,nav:true,hud:true,options:true,writes:0});
  const unit=await page.locator('.fighter').first().boundingBox(),arena=await page.locator('.arena').boundingBox();assert.ok(unit.x>=arena.x&&unit.x<arena.x+arena.width&&unit.y>=arena.y&&unit.y<arena.y+arena.height);
  await page.waitForTimeout(3200);assert.ok(await page.evaluate(()=>window.saveWrites)>=1);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mistbound-v5')).battle),null);
  await page.locator('[data-action="pause"]').click();const time=await page.locator('.combat-top').innerText();await page.waitForTimeout(500);assert.equal(await page.locator('.combat-top').innerText(),time);
  await page.screenshot({path:'/tmp/mistbound-combat-optimized.png'});
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('[data-action="pause"]').click();await page.locator('[data-action="speed"]').click();await page.locator('[data-action="speed"]').click();
  await page.waitForSelector('.battle-report',{timeout:60000});
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mistbound-v5')).report.outcome),await page.locator('.battle-report h2').innerText().then(t=>t.includes('พิชิต')?'win':'loss'));
  assert.deepEqual(errors,[]);console.log('PASS: 50 summon portraits, loaded atlas, persistent fighters/HUD/nav, retained settings, throttled saves, battle persistence, pause, 4x, mobile and report');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
