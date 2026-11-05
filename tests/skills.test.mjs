import {test} from 'node:test';
import assert from 'node:assert/strict';
import {create,hero,start,tick,loadout,SKILL_BOOK,derive} from '../engine.mjs';
for(const job of [0,1,3,5,7])for(let variant=0;variant<3;variant++)test(`class ${job} variant ${variant} has persistent passive and usable active`,()=>{
 const s=create(),h=hero(variant+1,1,job);s.heroes=[h];s.team=[h.id];s.settings.hp=0;start(s);const b=s.battle,u=b.units[0],kit=loadout(h),d=derive(h);
 assert.equal(loadout(JSON.parse(JSON.stringify(h))).name,kit.name);assert.equal(u.max,Math.round(d.max*(1+kit.hp)));assert.ok(Math.abs(u.atk-d.atk*(1+kit.atk))<1e-8);
 b.enemies=b.enemies.slice(0,1);const e=b.enemies[0];e.x=u.x+(job<3?5:20);e.y=u.y;e.hp=e.max=100000;e.atk=0;e.speed=0;e.cd=100;u.hp=1;u.activeCd=0;
 for(let i=0;i<12;i++)tick(s);
 assert.ok(u.uses>0);assert.ok(job===7?u.healed>0:u.dealt>0);assert.ok(Number.isFinite(u.hp));
});
test('all five catalogs have three distinct active names and bounded passive bonuses',()=>{for(const list of Object.values(SKILL_BOOK)){assert.equal(new Set(list.map(x=>x[0])).size,3);for(const a of list)assert.ok(a.slice(5).every(n=>n>=0&&n<=.1));}});
test('active cannot fire repeatedly inside its cooldown',()=>{const s=create();s.team=[1];start(s);const b=s.battle,h=b.units[0],e=b.enemies[0];b.enemies=[e];h.x=e.x-5;h.y=e.y;h.activeCd=0;e.hp=100000;e.cd=100;tick(s);assert.equal(h.uses,1);for(let i=0;i<10;i++)tick(s);assert.equal(h.uses,1);});
test('ranged unit holds position in distance dead band',()=>{const s=create();s.team=[4];start(s);const b=s.battle,h=b.units[0],e=b.enemies[0];b.enemies=[e];e.x=h.x+14;e.y=h.y;e.speed=0;e.cd=100;const x=h.x;tick(s);assert.equal(h.x,x);assert.equal(h.moving,false);});
