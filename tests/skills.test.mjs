import {test} from 'node:test';
import assert from 'node:assert/strict';
import {create,hero,start,tick,heroSkills,heroPassives,ABILITIES,validateSave,upgrade,trainStat,craftPotions} from '../engine.mjs';
function step(s,seconds){for(let i=0;i<Math.ceil(seconds/.05)&&s.battle;i++)tick(s,.05);}
function arena(job=3,star=1){const s=create();s.heroes=[hero(1,star,job),hero(2,1,1)];s.team=[1,2];s.settings.hp=0;start(s);const b=s.battle,h=b.units[0],ally=b.units[1],e=b.enemies[0];b.enemies=[e];h.x=40;h.y=50;h.cd=0;ally.x=42;ally.y=53;ally.cd=1000;ally.speed=0;for(const a of heroSkills(ally))ally.skillTimers[a.id]=1000;e.x=job<3?45:60;e.y=50;e.hp=e.max=10000;e.cd=1000;e.speed=0;return {s,b,h,ally,e};}
for(const [job,list] of Object.entries(ABILITIES))for(const skill of list)test(`${job}: ${skill.id} resolves its declared effect`,()=>{
 const {s,b,h,ally,e}=arena(Number(job),7);h.skillIds=[skill.id];h.passive={};ally.hp=skill.kind==='revive'?0:ally.max*.4;
 if(skill.kind==='summon')h.hp=h.max;
 step(s,2.5);assert.ok(h.uses>=1,'skill used');
 if(skill.kind==='heal')assert.ok(ally.hp>ally.max*.4,'healing applied');
 else if(skill.kind==='shield')assert.ok(b.units.some(u=>u.shield>0),'shield applied');
 else if(skill.kind==='summon'){const pet=b.units.find(u=>u.owner===h.id);assert.ok(pet);assert.equal(pet.atk,h.atk*.4);assert.notEqual(pet.skillTimers,h.skillTimers);}
 else if(skill.kind==='revive')assert.ok(ally.hp>0,'revived');
 else if(skill.kind==='taunt')assert.ok(h.shield>0);
 else assert.ok(e.hp<e.max,'damage applied');
});
test('projectile launch does not damage until impact and pause freezes flight',()=>{const {s,b,h,e}=arena();for(const a of heroSkills(h))h.skillTimers[a.id]=1000;const hp=e.hp;step(s,.3);assert.ok(b.shots.length>0);assert.equal(e.hp,hp);b.paused=true;const snapshot=JSON.stringify(b);step(s,2);assert.equal(JSON.stringify(b),snapshot);b.paused=false;step(s,.5);assert.ok(e.hp<hp);});
test('ground-targeted spell misses an enemy that leaves the indicated circle',()=>{const {s,b,h,e}=arena(5,7);h.skillIds=['mage-wave'];tick(s);assert.ok(h.action);e.x=90;e.y=80;step(s,1.5);assert.equal(e.hp,e.max);assert.ok(!b.shots.length);});
test('stun interrupts preparation before a projectile is emitted',()=>{const {s,b,h,e}=arena(5,7);h.skillIds=['mage-orb'];tick(s);h.stun=1;step(s,.8);assert.equal(b.shots.length,0);assert.equal(e.hp,e.max);});
test('three waves preserve HP and cooldown, reward only once after the last',()=>{
 const s=create();s.settings.hp=0;start(s);const b=s.battle,h=b.units[0];h.hp=50;for(const u of b.units){u.passive={};u.cd=1000;}h.skillTimers.test=20;const gems=s.gems;
 for(let wave=1;wave<=3;wave++){assert.equal(b.wave,wave);for(const e of b.enemies)e.hp=0;b.shots=[];for(let i=0;i<100&&s.battle&&b.wave===wave;i++)tick(s);if(wave<3){assert.equal(s.gems,gems);assert.equal(h.hp,50);assert.ok(h.skillTimers.test>10);}}
 assert.equal(s.report.wave,3);assert.equal(s.wins,1);assert.ok(s.gems>gems);const earned=s.gems;step(s,2);assert.equal(s.gems,earned);
});
test('regen is periodic and cannot revive dead heroes',()=>{const {s,h}=arena(0);h.passive={regen:.02};h.hp=50;h.speed=0;h.cd=1000;step(s,2.9);assert.equal(h.hp,50);step(s,.2);assert.equal(h.hp,50+Math.round(h.max*.02));h.hp=0;step(s,3.2);assert.equal(h.hp,0);});
test('low HP passive produces a bounded shield with a cooldown',()=>{const {s,h}=arena(0);h.passive={guard:.12};h.hp=20;h.cd=1000;h.speed=0;tick(s);assert.equal(h.shield,Math.round(h.max*.12));h.shield=0;step(s,1);assert.equal(h.shield,0);});
test('skill loadouts round-trip and legacy heroes gain stable metadata',()=>{const h=hero(33,7,5);const before=heroSkills(h).map(a=>a.id);assert.deepEqual(heroSkills(JSON.parse(JSON.stringify(h))).map(a=>a.id),before);delete h.skillIds;delete h.passiveIds;assert.deepEqual(heroSkills(h).map(a=>a.id),before);assert.ok(heroPassives(h).length===2);});
test('upgrade unlocks a second slot without rerolling character skills',()=>{const s=create(),h=s.heroes[0],ids=[...h.skillIds];s.gold=10000;s.stones=100;assert.ok(upgrade(s,h.id));assert.ok(upgrade(s,h.id));assert.equal(h.star,3);assert.equal(heroSkills(h).length,2);assert.deepEqual(h.skillIds,ids);assert.ok(validateSave(s));start(s);assert.equal(upgrade(s,h.id),false);});
test('training and crafting charge exactly once and reject insufficient resources',()=>{const s=create(),agi=s.heroes[0].agi;assert.ok(trainStat(s,1,'agi'));assert.equal(s.heroes[0].agi,agi+1);assert.equal(s.gold,2300);assert.equal(trainStat(s,1,'admin'),false);assert.equal(craftPotions(s),false);s.materials=3;const n=s.potions;assert.ok(craftPotions(s));assert.equal(s.potions,n+1);assert.equal(s.materials,0);assert.equal(s.gold,2270);});
test('all floor leaders arrive on the final wave, IDs never alias heroes',()=>{for(const floor of [5,10,15,20,25,30]){const s=create();s.floor=floor;start(s,false,floor);const b=s.battle;assert.equal(b.enemies.length,5);for(let wave=1;wave<3;wave++){b.enemies.forEach(e=>e.hp=0);b.shots=[];for(let i=0;i<100&&b.wave===wave;i++)tick(s);}assert.equal(b.wave,3);assert.equal(b.enemies.length,6);assert.equal(b.enemies.at(-1).kind,floor%10===0?4:3);assert.ok(b.enemies.every(e=>e.id>10000));}});
test('legacy saves without DEX/LUK can train them and remain valid',()=>{const s=create(),h=s.heroes[0];delete h.dex;delete h.luk;assert.ok(validateSave(s));assert.ok(trainStat(s,h.id,'dex'));assert.ok(trainStat(s,h.id,'luk'));assert.equal(h.dex,11);assert.equal(h.luk,6);assert.ok(validateSave(s));});
test('magical defense reduces an actual spell impact',()=>{const results=[];for(const mdef of [0,10000]){const {s,h,e}=arena(5,7);h.skillIds=['mage-orb'];e.mdef=mdef;step(s,1.6);results.push(e.max-e.hp);}assert.ok(results[0]>results[1]);assert.equal(results[1],1);});
test('LUK changes critical damage over repeated attacks',()=>{const results=[];for(const luk of [1,100]){const {s,h,e}=arena(3);h.luk=luk;h.passive={};for(const a of heroSkills(h))h.skillTimers[a.id]=1000;step(s,15);results.push(e.max-e.hp);}assert.ok(results[1]>results[0]);});
