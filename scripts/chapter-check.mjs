import {create,start,tick,hero,gainXP,floorInfo} from '../engine.mjs';
const results=[];
for(const [level,star] of [[1,1],[3,1],[5,2]])for(let floor=1;floor<=10;floor++){
 const s=create();s.heroes=[2,0,3,5,7].map((job,i)=>{const h=hero(i+1,star,job,i);gainXP(h,30*level*(level-1));return h});s.team=s.heroes.map(h=>h.id);s.floor=floor;s.settings.hp=0;start(s,false,floor);let outcome;for(let i=0;i<1000&&s.battle;i++)outcome=tick(s);results.push({level,star,floor,enemies:floorInfo(floor).count,outcome,time:+s.report.time.toFixed(1)});
}
console.log(JSON.stringify(results,null,2));
