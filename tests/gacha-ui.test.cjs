const assert=require('node:assert/strict');const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});try{
 const page=await browser.newPage({viewport:{width:1162,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.GAME_TEST_URL||'http://127.0.0.1:8000')+'/?gachaTest=1');
 await page.locator('[data-page="heroes"]').click();await page.locator('.hero-art.art-visible').first().waitFor();
 const aura=await page.locator('.knight-card .hero-art').first().evaluate(n=>({class:n.className,color:getComputedStyle(n).getPropertyValue('--aura'),motion:getComputedStyle(n).animationPlayState,gradient:getComputedStyle(n,'::before').backgroundImage}));
 assert.match(aura.class,/aura-element-\d/);assert.equal(aura.motion,'running');assert.match(aura.gradient,/radial-gradient/);
 await page.locator('[data-page="gacha"]').click();assert.match(await page.locator('.gacha-test-panel').innerText(),/เพชร ∞/);
 await page.evaluate(()=>document.querySelector('#save').focus());
 // First test draw persists the unchanged real game state through the normal UI save path.
 await page.locator('[data-action="summon:50"]').click();await page.locator('[data-action="summon-all"]').click();assert.equal(await page.locator('#results .hero').count(),50);await page.locator('#close-results').click();
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('mistbound-v5')));
 for(let i=0;i<3;i++){await page.locator('[data-action="summon:50"]').click();await page.locator('[data-action="summon-all"]').click();await page.locator('#close-results').click();}
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('mistbound-v5')));assert.equal(after.gems,before.gems);assert.deepEqual(after.heroes,before.heroes);assert.deepEqual(after.counts,before.counts);assert.equal(after.pulls,before.pulls);
 await page.locator('.gacha-test-panel details summary').click();const colors={3:'#6ab8ff',4:'#be86f4',5:'#f3ca65',6:'#ff5c6c'};
 for(let star=1;star<=7;star++){
  await page.locator(`[data-action="preview-rarity:${star}"]`).click();await page.locator(`.summon-reveal.rarity-${star}`).waitFor();
  assert.equal(await page.locator('.reveal-stage .hero-art').getAttribute('data-art'),`0-${star}`);
  if(colors[star])assert.equal(await page.locator('.summon-reveal').evaluate(n=>getComputedStyle(n).getPropertyValue('--rarity').trim()),colors[star]);
  if(star===7){assert.equal(await page.locator('.reveal-rays use[href$="#prism-ring"]').count(),1);await page.waitForTimeout(750);await page.screenshot({path:'/tmp/mistbound-rainbow-reveal.png'});}
  await page.locator('#close-results').click();
 }
 await page.locator('[data-action="summon:10"]').click();await page.locator('.batch-grid').waitFor();assert.equal(await page.locator('.batch-grid [data-order]').count(),10);await page.locator('[data-action="summon-all"]').click();await page.locator('#close-results').click();
 await page.waitForTimeout(800);assert.equal(await page.locator('#results').isVisible(),false);
 await page.locator('[data-action="toggle-gacha-test"]').click();await page.locator('[data-action="summon:1"]').click();await page.locator('[data-action="summon-all"]').click();await page.locator('#close-results').click();
 const normal=await page.evaluate(()=>JSON.parse(localStorage.getItem('mistbound-v5')));assert.equal(normal.gems,before.gems-100);assert.equal(normal.heroes.length,before.heroes.length+1);
 await page.locator('[data-action="toggle-gacha-test"]').click();await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('.gacha-test-panel details summary').click();await page.locator('[data-action="preview-rarity:7"]').click();await page.locator('.summon-reveal.rarity-7').waitFor();assert.equal(await page.locator('.reveal-rays').evaluate(n=>getComputedStyle(n).animationName),'none');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 console.log('PASS: elemental aura/motion, 200 free test pulls without save changes, 7 rarity previews/colors, next/skip/close, normal paid summon, reduced motion and mobile');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
