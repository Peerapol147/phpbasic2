const assert=require('node:assert/strict');const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});try{
 const p=await browser.newPage({viewport:{width:1162,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto((process.env.GAME_TEST_URL||'http://127.0.0.1:8000')+'/?gachaTest=1');
 await p.locator('#gm-toggle').click();await p.locator('[data-action="gm-enter"]').click();await p.locator('[data-page="gacha"]').click();await p.locator('[data-action="toggle-gacha-test"]').click();
 const rolls=await p.evaluate(async()=>{const {rates}=await import('./engine.mjs');let total=0;return [0,...rates.map(r=>{const midpoint=(total+r/2)/100;total+=r;return midpoint;})];}),colors=['','#b5c0d2','#8cdb9b','#6ab8ff','#be86f4','#f3ca65','#ff5c6c','#e5bcff'];
 for(let highest=1;highest<=7;highest++){
  await p.evaluate(roll=>{let calls=0;Math.random=()=>{const call=calls++,slot=call%3,index=Math.floor(call/3);return slot===0&&index===99?roll:0;};},rolls[highest]);
  await p.locator('[data-action="summon:100"]').click();const omen=p.locator('.omen');await omen.waitFor();
  assert.equal(await omen.getAttribute('data-highest-rarity'),String(highest));assert.equal(await omen.evaluate(n=>getComputedStyle(n).getPropertyValue('--rarity').trim()),colors[highest]);
  assert.equal(await p.locator('#results .hero-art').count(),0);assert.equal(await p.locator('.omen-particle').count(),10+highest*4);
  if(highest===7){await p.waitForTimeout(1100);await p.screenshot({path:'/tmp/mistbound-rainbow-omen.png'});await p.locator('[data-action="summon-open"]').click();await p.locator('.batch-grid').waitFor();assert.equal(await p.locator('.omen').count(),0);}
  await p.locator('[data-action="summon-all"]').click();assert.equal(await p.locator('.summon-tile').count(),100);assert.equal(await p.locator('[data-order="100"]').getAttribute('data-star'),String(highest));assert.equal(await p.locator('[data-order="1"]').getAttribute('data-star'),'1');await p.locator('#close-results').click();
 }
 // Automatic completion, then a new batch must use its own highest rarity.
 await p.evaluate(()=>{Math.random=()=>.99999995;});await p.locator('[data-action="summon:100"]').click();await p.locator('.batch-grid').waitFor({timeout:5000});await p.locator('[data-action="summon-all"]').click();await p.evaluate(()=>{Math.random=()=>0;});await p.locator('[data-action="summon-repeat"]').click();assert.equal(await p.locator('.omen').getAttribute('data-highest-rarity'),'1');await p.locator('#close-results').click();await p.waitForTimeout(1000);assert.equal(await p.locator('#results').isVisible(),false);
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{Math.random=()=>.999999995;});await p.locator('[data-action="summon:100"]').click();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await p.locator('#results-body').evaluate(n=>n.scrollWidth>n.clientWidth),false);await p.waitForTimeout(900);await p.screenshot({path:'/tmp/mistbound-mobile-omen.png'});await p.locator('#close-results').click();
 await p.emulateMedia({reducedMotion:'reduce'});await p.locator('[data-action="summon:100"]').click();await p.locator('.batch-grid').waitFor({timeout:3000});assert.equal(await p.locator('.summon-tile:not(.pending)').count(),100);assert.deepEqual(errors,[]);
 console.log('PASS: highest rarity in last of 100 rolls for all 7 tiers, exact colors, hidden characters, bounded particles, skip/automatic transition, repeat recalculation, cancel, mobile and reduced motion');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
