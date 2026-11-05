import {presetFor} from './vfx-types.mjs?v=fx-v11';
import {assignSkills,heroSkills,heroPassives,passiveStats,abilityText} from './abilities.mjs?v=clip-v10';
export {ABILITIES,PASSIVES,classPassives,heroSkills,heroPassives,abilityText} from './abilities.mjs?v=clip-v10';
export const ROSTER_LIMIT=300;
export const jobs=[['นักดาบ','⚔'],['อัศวิน','♜'],['แทงค์','▣'],['ธนู','➶'],['ปืน','⌁'],['เวทย์','✧'],['นักอัญเชิญ','◇'],['พระ','✚']];
export const bases=[[15,14,8,3],[10,7,18,5],[8,5,23,4],[10,19,7,4],[17,10,9,4],[3,8,7,22],[4,8,10,18],[3,9,10,18]];
export const skills=['คอมโบ: ตีเป้าเดิมแรงขึ้น 8% สูงสุด 40%','คุ้มกัน: รับครึ่งหนึ่งของดาเมจแทนเพื่อนใกล้ตัว แล้วสวน (คูลดาวน์ 4 วินาที)','ยั่ว: ดึงเป้าในระยะ 25 และสร้างโล่ 20% HP สูงสุด (คูลดาวน์ 8 วินาที)','ยิงต่อเนื่อง: ตีเป้าเดิมแรงขึ้น 5% สูงสุด 25% คริทุกนัดที่ 4','เจาะเกราะ: มองข้ามเกราะครึ่งหนึ่ง ยิง 3 นัดแล้วรีโหลด 3 วินาที','ระเบิดเวท: ร่าย 1 วินาที ระเบิดตำแหน่งที่เล็งไว้ พลัง 115% ATK วงรัศมี 14','อัญเชิญ: สร้างมินเนียน 1 ตัว HP 40+INT×2, ATK 40% ของผู้เรียก (คูลดาวน์ 10 วินาที)','ฟื้นฟู: ฮีลเพื่อน ล้างยั่ว/สตัน ชุบผู้หมดสติด้วย HP 30% ทุก 30 วินาที'];
export function loadout(h){if(h.owner)return null;const a=heroSkills(h)[0],p=passiveStats(h);return a?{...a,...p,passive:heroPassives(h).map(p=>p.name).join(' / ')}:null;}
export function skillDescription(h){return heroSkills(h).map(a=>a.name+': '+abilityText(a)).join(' / ')+' · Passive: '+heroPassives(h).map(p=>p.name+' — '+p.text).join(' / ');}
export const BALANCE={version:4,maxFloor:30,farmGemBudget:1500,farmGemBase:30,trainingCost:200,timeout:240};
export function economyDay(now=new Date()){return new Date(now.getTime()+7*3600000).toISOString().slice(0,10);}
export function ensureEconomy(s,day=economyDay()){if(!s.economy||s.economy.day!==day)s.economy={day,farmGems:0,dropCredit:0};return s.economy;}
export const rates=[81.988895,15,3,.01,.001,.0001,.000005];
export const elements=['น้ำ','ไฟ','ลม','ดิน','ไฟฟ้า','แสง','มืด'];
export function elementFactor(a,b){if(a===b)return 1;return (a<5&&(a+1)%5===b)||(a===5&&b===6)||(a===6&&b===5)?1.3:1;}
export const ENEMY_PRESETS=[
 {key:'scout',name:'กอบลินลาดตระเวน',role:'ประชิด',hp:62,atk:11,def:2,range:6,speed:8,interval:1.9},
 {key:'wolf',name:'หมาป่าหนาม',role:'ล้วงแนวหลัง',hp:48,atk:10,def:1,range:6,speed:12,interval:1.5},
 {key:'hexer',name:'กอบลินจอมเวท',role:'ยิงเวท',hp:52,atk:15,def:1,range:28,speed:6,interval:2.6},
 {key:'captain',name:'กรอนน์ หัวหน้ากอง',role:'มินิบอส',hp:310,atk:19,def:5,range:8,speed:6,interval:2.2},
 {key:'warden',name:'ผู้พิทักษ์ประตูหมอก',role:'บอส',hp:900,atk:34,def:7,range:9,speed:5,interval:2.5}
];
export function floorInfo(f){const boss=f%10===0,mini=f%10===5,waves=3;return {element:(f-1)%7,boss,mini,waves,name:'หอคอยชั้น '+f,count:15+(boss||mini?1:0),level:Math.ceil(f/2),stars:Math.min(7,1+Math.floor(f/6)),recommended:Math.round(500*Math.pow(1.045,f-1)*(boss?1.15:mini?1.05:1))};}
export function teamPower(s){const hs=s.team.map(id=>s.heroes.find(h=>h.id===id)),b=bonuses(hs),t=talentBuffs(s);b.hp+=t.hp;b.atk+=t.atk;return Math.round(hs.reduce((sum,h)=>{const d=derive(h),kit=loadout(h);return sum+d.max*(1+b.hp+b.all+(kit?.hp||0))*.5+d.atk*(1+b.atk+b.all+(kit?.atk||0))*2+d.def*(1+t.def)*3;},0));}
export function validateSave(s){return s?.version===5&&(!s.economy||(typeof s.economy.day==='string'&&Number.isSafeInteger(s.economy.farmGems)&&s.economy.farmGems>=0&&Number.isFinite(s.economy.dropCredit)&&s.economy.dropCredit>=0&&s.economy.dropCredit<1.00001))&&s.farmSummary&&[s.farmSummary.runs,s.farmSummary.gems,s.farmSummary.gold].every(n=>Number.isSafeInteger(n)&&n>=0)&&Array.isArray(s.talents)&&s.talents.length===4&&s.talents.every(n=>Number.isInteger(n)&&n>=0&&n<=4)&&[s.materials,s.bossTokens,s.weapons,s.wins].every(n=>Number.isSafeInteger(n)&&n>=0)&&Array.isArray(s.heroes)&&s.heroes.length>0&&s.heroes.length<=ROSTER_LIMIT&&s.heroes.every(h=>(h.locked===undefined||typeof h.locked==='boolean')&&(h.skillIds===undefined||(Array.isArray(h.skillIds)&&h.skillIds.length<=5&&new Set(h.skillIds).size===h.skillIds.length&&h.skillIds.every(id=>typeof id==='string'&&id.length<40)))&&(h.passiveIds===undefined||(Array.isArray(h.passiveIds)&&h.passiveIds.length<=2&&new Set(h.passiveIds).size===h.passiveIds.length&&h.passiveIds.every(id=>typeof id==='string'&&id.length<40)))&&Number.isInteger(h.id)&&h.id>0&&typeof h.name==='string'&&Number.isInteger(h.job)&&h.job>=0&&h.job<8&&Number.isInteger(h.star)&&h.star>=1&&h.star<=7&&Number.isInteger(h.element)&&h.element>=0&&h.element<7&&['dex','luk'].every(k=>h[k]===undefined||(Number.isFinite(h[k])&&h[k]>=0&&h[k]<=100000))&&['str','agi','vit','int','level','xp'].every(k=>Number.isFinite(h[k])&&h[k]>=0&&h[k]<=100000))&&new Set(s.heroes.map(h=>h.id)).size===s.heroes.length&&Array.isArray(s.team)&&s.team.length<=5&&new Set(s.team).size===s.team.length&&s.team.every(id=>s.heroes.some(h=>h.id===id))&&['gems','gold','stones','nextId','pulls','potions'].every(k=>Number.isSafeInteger(s[k])&&s[k]>=0)&&s.nextId>Math.max(...s.heroes.map(h=>h.id))&&Number.isInteger(s.floor)&&s.floor>=1&&s.floor<=30&&Number.isInteger(s.cleared)&&s.cleared>=0&&s.cleared<=30&&s.floor===Math.min(30,s.cleared+1)&&Array.isArray(s.counts)&&s.counts.length===7&&s.counts.every(n=>Number.isSafeInteger(n)&&n>=0)&&Array.isArray(s.log)&&s.log.every(t=>typeof t==='string')&&s.settings&&[1,2,4].includes(s.settings.speed)&&[0,25,50,75].includes(s.settings.hp);}

export const talentNames=['เงิน','จู่โจม','ป้องกัน','ชีวิต'];
export const talentDescriptions=[['ทอง +10%','EXP +10%','เพชรฟาร์ม +10%','โอกาสดรอปอุปกรณ์ 10% → 11%'],['ATK +5%','คริ +5 จุดเปอร์เซ็นต์','ดาเมจคริ +20 จุดเปอร์เซ็นต์','ATK เพิ่มอีก 10% · มองข้ามเกราะ 15%'],['DEF +5%','ดาเมจที่รับ −3%','DEF เพิ่มอีก 10%','ดาเมจที่รับลดอีก 5%'],['HP +5%','ฮีลที่ได้รับ +10%','HP เพิ่มอีก 10%','ชุบอัตโนมัติ 1 คน/ด่าน ด้วย HP 30%']];
export function talentCost(tier){return {gold:[500,1500,4000,10000][tier],materials:tier===2?20:0,bossTokens:tier===3?5:0};}
export function unlockTalent(s,branch){if(s.battle||!Number.isInteger(branch)||branch<0||branch>3||s.talents[branch]>=4)return false;const c=talentCost(s.talents[branch]);if(s.gold<c.gold||s.materials<c.materials||s.bossTokens<c.bossTokens)return false;s.gold-=c.gold;s.materials-=c.materials;s.bossTokens-=c.bossTokens;s.talents[branch]++;return true;}
export function talentBuffs(s){const [m,a,d,h]=s.talents;return {gold:m>=1?.1:0,xp:m>=2?.1:0,gems:m>=3?.1:0,drop:m>=4?.11:.1,atk:(a>=1?.05:0)+(a>=4?.1:0),crit:a>=2?.05:0,critDamage:a>=3?.2:0,pierce:a>=4?.15:0,def:(d>=1?.05:0)+(d>=3?.1:0),reduction:(d>=2?.03:0)+(d>=4?.05:0),hp:(h>=1?.05:0)+(h>=3?.1:0),heal:h>=2?.1:0,revive:h>=4};}
export function gainXP(h,amount){h.xp+=amount;while(h.xp>=h.level*60){h.xp-=h.level*60;h.level++;h.vit++;if(h.job>=5)h.int++;else h.str++;}Object.assign(h,derive(h));}
export function beginFarm(s,floor){if(s.battle||!Number.isInteger(floor)||floor<1||floor>s.cleared)return false;s.auto=false;s.farmLoop=true;s.farmSummary={runs:0,gems:0,gold:0};if(!start(s,true,floor)){s.farmLoop=false;return false;}return true;}
export function hero(id,star,job,element=(id-1)%7){const [str,agi,vit,int]=bases[job];return assignSkills({...derive({str,agi,vit,int,job,star,gear:false}),id,name:['อริน','เรน','ลูน','คีรา','เซน','ไอรา','โนอา','มีรา'][id%8]+' '+id,star,element,job,level:1,xp:0,str,agi,vit,int,gear:false});}
export function derive(h){const scale=1+((h.star||1)-1)/9;return {dex:h.dex??Math.max(1,Math.round(h.agi*.7)),luk:h.luk??5,mdef:Math.floor(h.int/3*scale),max:Math.round((50+h.vit*6)*scale),atk:Math.round((h.job>=5?8+h.int*2:8+h.str*2)*scale),def:Math.floor(h.vit/3*scale)+(h.gear&&h.job<3?5:0),range:h.job<3?6:35,speed:6+h.agi*.25,interval:Math.max(.65,2-h.agi*.035)};}
export function bonuses(hs){const close=hs.filter(h=>h.job<3).length,far=hs.length-close,def=hs.filter(h=>[1,2].includes(h.job)).length,sup=hs.filter(h=>h.job>=6).length;return {atk:far>=3?.2:far>=2?.1:0,hp:close>=3?.2:close>=2?.1:0,reduction:def>=2?.1:0,heal:sup>=2?.15:0,all:close&&far&&sup?.05:0,reward:new Set(hs.map(h=>h.job)).size===5?.08:0};}
export function create(){return {version:5,talents:[0,0,0,0],materials:0,bossTokens:0,weapons:0,wins:0,farmLoop:false,farmSummary:{runs:0,gems:0,gold:0},gems:6000,gold:2500,stones:0,floor:1,cleared:0,nextId:9,heroes:jobs.map((_,j)=>hero(j+1,1,j)),team:[2,3,4,6,8],counts:[0,0,0,0,0,0,0],potions:30,settings:{speed:1,hp:50},auto:false,pulls:0,battle:null,report:null,log:[]};}
export function summon(s,n,rng=Math.random){if(![1,10,50,100].includes(n)||s.battle||s.gems<n*100||s.heroes.length+n>ROSTER_LIMIT)return [];const hs=Array.from({length:n},()=>{let r=rng(),star=7,total=0;for(let i=0;i<rates.length;i++){total+=rates[i];if(r<total/100){star=i+1;break;}}s.counts[star-1]++;return hero(s.nextId++,star,Math.min(7,Math.floor(rng()*8)),Math.min(6,Math.floor(rng()*7)));});s.heroes.push(...hs);s.gems-=n*100;s.pulls+=n;return hs;}
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const alive=u=>u.hp>0;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const nearest=(a,arr)=>arr.filter(alive).sort((b,c)=>dist(a,b)-dist(a,c))[0];
export const encounters=Array.from({length:30},(_,i)=>'3 คลื่น · คลื่นละ 5 ตัว'+((i+1)%5===0?' · ผู้คุมในคลื่นสุดท้าย':''));
function spawn(floor,wave=1){
 const info=floorInfo(floor),kinds=[0,1,0,2,1];if(wave===info.waves&&(info.boss||info.mini))kinds.push(info.boss?4:3);
 return kinds.map((kind,i)=>{const p=ENEMY_PRESETS[kind],angle=(i/5*Math.PI*2)+wave*.55,scale=Math.pow(1.075,floor-1),max=Math.round(p.hp*(kind>=3?.8:.65)*scale);
 return {id:10000+wave*100+i,kind,name:p.name,rank:kind===4?'boss':kind===3?'mini':'normal',element:info.element,level:info.level,x:clamp(50+Math.cos(angle)*42,8,92),y:clamp(46+Math.sin(angle)*37,10,84),max,hp:max,atk:p.atk*(kind>=3?1:.82)*scale,mdef:Math.floor(p.def*.7+floor*.2),dex:8,agi:kind===1?14:6,luk:3,def:p.def+Math.floor(floor/5),range:p.range,speed:p.speed*.8,interval:p.interval,cd:1+i*.12,skillCd:5,stun:0,slow:0,slowUntil:0,taunt:0,targetId:null,facing:1,moving:false,dealt:0,taken:0,healed:0,shield:0};});
}
function move(a,t,dt,units,away=false){
 const d=dist(a,t);if(d<.25)return;
 let dx=(t.x-a.x)/d*(away?-1:1),dy=(t.y-a.y)/d*(away?-1:1);
 // Separation steering precedes movement; deterministic tangent gets past a blocked ally.
 for(const other of units){if(other===a||!alive(other))continue;const gap=dist(a,other);if(gap<5&&gap>.01){dx+=(a.x-other.x)/gap*(5-gap)*.55;dy+=(a.y-other.y)/gap*(5-gap)*.55;}}
 if(away&&((a.x<9&&dx<0)||(a.x>91&&dx>0)||(a.y<11&&dy<0)||(a.y>83&&dy>0))){const old=dx;dx=-dy;dy=old;}
 const length=Math.hypot(dx,dy)||1,step=Math.min(a.speed*(1-(a.slow||0))*dt,d);
 const x=clamp(a.x+dx/length*step,7,93),y=clamp(a.y+dy/length*step,9,85);
 a.moving=Math.hypot(x-a.x,y-a.y)>.015;a.x=x;a.y=y;
 if(Math.abs(t.x-a.x)>1.5)a.facing=t.x>a.x?1:-1;
}
function separate(units,dt){for(let i=0;i<units.length;i++)for(let j=i+1;j<units.length;j++){const a=units[i],b=units[j];if(!alive(a)||!alive(b))continue;const d=dist(a,b);if(d>=3.2)continue;const angle=d>.01?Math.atan2(b.y-a.y,b.x-a.x):(a.id+b.id)*1.7,push=Math.min(dt*1.8,(3.2-d)*.5);a.x=clamp(a.x-Math.cos(angle)*push,7,93);a.y=clamp(a.y-Math.sin(angle)*push,9,85);b.x=clamp(b.x+Math.cos(angle)*push,7,93);b.y=clamp(b.y+Math.sin(angle)*push,9,85);}}
export function start(s,farm=false,selected=null){
 const floor=selected??(farm?s.cleared:s.floor);if(s.battle||!s.team.length||s.team.length>5||!Number.isInteger(floor)||floor<1||floor>30||floor>s.floor)return false;
 const hs=s.team.map(id=>s.heroes.find(h=>h.id===id));if(hs.some(h=>!h))return false;
 const talent=talentBuffs(s),bonus=bonuses(hs);bonus.atk+=talent.atk;bonus.hp+=talent.hp;bonus.reduction+=talent.reduction;
 const units=hs.map((h,i)=>{const d=derive(h),passive=passiveStats(h),max=Math.round(d.max*(1+bonus.hp+bonus.all+passive.hp));return {...h,...d,max,hp:max,atk:d.atk*(1+bonus.atk+bonus.all+passive.atk),def:d.def*(1+bonus.all+talent.def),x:i<2?44+i*12:40+(i-2)*10,y:i<2?44:56,cd:i*.15,skillCd:0,reviveCd:0,activeCd:0,skillTimers:{},passive,regenCd:3,guardCd:0,shield:0,hits:0,last:null,combo:0,dealt:0,taken:0,healed:0,uses:0,downs:0,potionCd:0,stun:0,slow:0,slowUntil:0,targetId:null,action:null,cast:null,actionName:'',facing:1};});
 ensureEconomy(s);s.battle={floor,farm:floor<=s.cleared,time:0,turn:0,wave:1,totalWaves:floorInfo(floor).waves,intermission:0,units,enemies:spawn(floor),bonus,talent,revived:false,critMeter:0,effectId:0,events:[],shots:[],paused:false};s.report=null;s.log=[];return true;
}
export function tick(s,dt=.05){
 const b=s.battle;if(!b||b.paused||!Number.isFinite(dt)||dt<=0)return;
 dt=Math.min(.2,dt);b.time+=dt;b.turn++;
 const log=t=>{s.log.unshift(`${b.time.toFixed(1)}s · ${t}`);s.log=s.log.slice(0,100);};
 const live=()=>b.units.filter(alive),all=()=>[...b.units,...b.enemies];
 const effect=(type,a,t,value=0,duration=.5,extra={})=>{const e={id:++b.effectId,type,x:t.x,y:t.y,fromX:a.x,fromY:a.y,element:a.element,job:a.job,sourceId:a.id,targetId:t.id,value,time:b.time,duration,...extra};b.events.push(e);return e;};
 b.events=b.events.filter(e=>b.time-e.time<e.duration);
 const heal=(a,t,power)=>{if(!alive(t))return;const n=Math.min(t.max-t.hp,Math.round(power));if(n<=0)return;t.hp+=n;a.healed=(a.healed||0)+n;effect('heal',a,t,n,.8,{preset:'restoration'});};
 function damage(a,t,power,skill={}){
  if(!alive(t))return;
  const enemy=a.kind!==undefined,magic=skill.kind==='magic';
  const chance=clamp(.91+((a.dex||8)-(t.agi||8))*.003,.75,.99);a.hitMeter=(a.hitMeter??.5)+chance;if(a.hitMeter<1){effect('miss',a,t,0,.5);return;}a.hitMeter-=1;let amount=power*elementFactor(a.element,t.element),critical=false;
  if(!enemy){const count=b.units.filter(h=>!h.owner&&h.element===a.element).length;amount*=count>=3?1.2:count>=2?1.1:1;a.critMeter=(a.critMeter||0)+Math.min(.4,.03+(a.luk||5)*.003+b.talent.crit);if(a.critMeter>=1){amount*=1.5+b.talent.critDamage;a.critMeter-=1;critical=true;}}
  amount=Math.max(1,Math.round(amount-(magic?(t.mdef??t.def):t.def)*(1-(skill.pierce||(!enemy?b.talent.pierce:0)))));
  if(enemy){amount=Math.max(1,Math.round(amount*(1-b.bonus.reduction)));const knight=live().find(h=>h.job===1&&h!==t&&h.skillCd<=0&&dist(h,t)<16);if(knight){const guard=Math.min(knight.hp,Math.floor(amount*.35));knight.hp-=guard;knight.taken+=guard;amount-=guard;knight.skillCd=4;knight.uses++;if(!alive(knight))knight.downs++;effect('guard',knight,t,guard,.65,{preset:'aegis'});}}
  const absorbed=Math.min(t.shield||0,amount);t.shield=Math.max(0,(t.shield||0)-absorbed);amount-=absorbed;if(absorbed>0)effect('shield-hit',a,t,0,.45,{preset:'aegis'});
  const actual=Math.min(t.hp,amount);t.hp-=actual;t.taken=(t.taken||0)+actual;a.dealt=(a.dealt||0)+actual;t.hurtUntil=b.time+.15;
  effect('damage',a,t,actual,.55,{critical});effect('impact',a,t,0,.5,{preset:presetFor(a,skill),critical,skillId:skill.id||'',rank:a.star||1});
  if(a.owner){const owner=b.units.find(u=>u.id===a.owner);if(owner)owner.dealt+=actual;}
  if(alive(t)){if(skill.stun)t.stun=Math.max(t.stun||0,skill.stun);if(skill.slow){t.slow=skill.slow;t.slowUntil=b.time+3;}}
  if(alive(a)&&!enemy){heal(a,a,actual*((a.passive?.leech||0)+(skill.leech||0)));}
  if(t.hp===0){t.downs=(t.downs||0)+1;t.action=null;t.cast=null;log(`${t.name} หมดสติ`);}
 }
 function impact(a,target,skill,power,center){
  const friendly=['heal','shield','revive','taunt','summon'].includes(skill.kind);
  if(skill.kind==='revive'){if(target&&target.hp===0){target.hp=Math.round(target.max*skill.power);target.stun=0;target.action=null;effect('revive',a,target,target.hp,.9,{preset:'restoration'});}return;}
  if(skill.kind==='summon'){if(b.units.some(u=>u.owner===a.id&&alive(u)))return;const max=Math.round(a.max*.5);b.units=b.units.filter(u=>u.owner!==a.id);b.units.push({...a,id:1000+a.id,owner:a.id,name:'ผู้พิทักษ์ของ '+a.name,job:0,max,hp:max,atk:a.atk*.4,passive:{},skillIds:[],skillTimers:{},range:5,x:a.x+4,y:a.y-3,action:null,cast:null,cd:.6,dealt:0,taken:0,healed:0,uses:0,downs:0,shield:0});effect('summon',a,a,0,.7);return;}
  if(skill.kind==='taunt'){a.shield=Math.max(a.shield,Math.round(a.max*skill.power));b.enemies.filter(e=>alive(e)&&dist(a,e)<24).forEach(e=>{e.taunt=3;e.targetId=a.id;});effect('shield',a,a,0,.8,{preset:'aegis'});return;}
  const pool=friendly?live():(a.kind!==undefined?live():b.enemies.filter(alive));
  let targets=skill.radius?pool.filter(t=>dist(t,center)<=skill.radius):target&&alive(target)?[target]:[];
  if(skill.targets)targets=pool.sort((x,y)=>dist(x,center)-dist(y,center)).slice(0,skill.targets);
  if(skill.radius)effect(friendly?'aura-heal':'burst',a,center,0,.45,{radius:skill.radius,preset:friendly?'restoration':presetFor(a,skill)});
  for(const t of targets){if(skill.kind==='heal'){heal(a,t,power*(1+b.bonus.heal+b.talent.heal+(a.passive?.heal||0)));if(skill.cleanse){t.stun=0;t.slow=0;t.slowUntil=0;}}else if(skill.kind==='shield'){t.shield=Math.max(t.shield,Math.min(t.max*.4,Math.round(power)));effect('shield',a,t,0,.8,{preset:'aegis'});}else damage(a,t,power*(skill.execute&&t.hp/t.max<.3?1.5:1),skill);}
 }
 function prepare(a,target,skill){
  const power=a.atk*skill.power,duration=skill.kind==='magic'?.7:skill.kind==='heal'||skill.kind==='revive'?.45:.22;
  a.motion={start:b.time,duration,kind:skill.kind};a.action={target,skill,power,remaining:duration,center:{x:target.x,y:target.y}};a.actionName=skill.name||'';a.cast=skill.kind==='magic'?a.action.center:null;a.actionUntil=b.time+duration;
  effect('charge',a,target,0,duration,{preset:presetFor(a,skill)});
  if(skill.radius&&a.cast)effect('cast',a,target,0,duration,{radius:skill.radius});
  if(skill.id){a.skillTimers[skill.id]=skill.cooldown;a.uses++;log(`${a.name} · ${skill.name}`);}a.cd=Math.max(a.interval,duration+.15);
 }
 // Resolve only projectiles already in flight. Damage is applied at arrival, never on launch.
 for(const shot of b.shots){shot.remaining-=dt;shot.event.x=shot.skill.radius?shot.center.x:shot.target.x;shot.event.y=shot.skill.radius?shot.center.y:shot.target.y;if(shot.remaining<=1e-8){impact(shot.source,shot.target,shot.skill,shot.power,shot.skill.radius?shot.center:shot.target);shot.done=true;}}
 b.shots=b.shots.filter(x=>!x.done);
 for(const a of all()){
  a.moving=false;a.cd-=dt;a.skillCd-=dt;a.stun=Math.max(0,(a.stun||0)-dt);a.taunt=Math.max(0,(a.taunt||0)-dt);if(b.time>=a.slowUntil)a.slow=0;
  if(a.skillTimers)for(const id in a.skillTimers)a.skillTimers[id]=Math.max(0,a.skillTimers[id]-dt);
  if(!alive(a))continue;
  if(a.kind===undefined&&!a.owner){a.potionCd-=dt;a.guardCd-=dt;a.regenCd-=dt;
   if(a.regenCd<=0){a.regenCd+=3;heal(a,a,a.max*(a.passive.regen||0));}
   if(a.passive.guard&&a.hp/a.max<.35&&a.guardCd<=0){a.shield=Math.max(a.shield,Math.round(a.max*a.passive.guard));a.guardCd=15;effect('shield',a,a,0,.8,{preset:'aegis'});}
   if(s.settings.hp>0&&a.hp/a.max*100<=s.settings.hp&&s.potions>0&&a.potionCd<=0){heal(a,a,a.max*.4*(1+b.talent.heal));s.potions--;a.potionCd=10;}
  }
  if(a.stun>0){a.action=null;a.cast=null;a.motion=null;continue;}
  if(a.action){const act=a.action;act.remaining-=dt;if(act.remaining>1e-8)continue;a.action=null;a.cast=null;
   const ranged=['shot','magic'].includes(act.skill.kind);
   if(ranged){effect('launch',a,act.skill.radius?act.center:act.target,0,.2,{preset:presetFor(a,act.skill)});const travel=clamp(dist(a,act.target)/80,.12,.65),event=effect('projectile',a,act.skill.radius?act.center:act.target,0,travel,{projectile:act.skill.kind,preset:presetFor(a,act.skill),sourceId:a.id,targetId:act.skill.radius?null:act.target.id});b.shots.push({source:a,target:act.target,center:act.center,skill:act.skill,power:act.power,remaining:travel,event});}
   else if(act.skill.kind!=='strike'||dist(a,act.target)<=a.range+4)impact(a,act.target,act.skill,act.power,act.center);
   a.actionUntil=b.time+.16;continue;
  }
  if(b.intermission>0)continue;
  const enemy=a.kind!==undefined,pool=enemy?live():b.enemies.filter(alive);let target=pool.find(t=>t.id===a.targetId&&alive(t));
  const closest=nearest(a,pool);if(!target||a.taunt<=0&&closest&&dist(a,closest)+10<dist(a,target))target=closest;if(!target)continue;a.targetId=target.id;if(Math.abs(a.x-target.x)>1.5)a.facing=target.x>a.x?1:-1;
  // Telegraphed leader attacks use the same windup/impact timeline as heroes.
  if(enemy&&a.kind>=3&&a.skillCd<=0&&dist(a,target)<18&&a.cd<=0){const skill={kind:'magic',power:1.2,radius:13,name:'กวาดลาน'};prepare(a,target,skill);a.skillCd=9;continue;}
  if(!enemy&&!a.owner&&a.cd<=0){
   let choice=null,recipient=null;
   for(const skill of heroSkills(a)){
    if((a.skillTimers[skill.id]||0)>0)continue;
    if(skill.kind==='heal')recipient=live().filter(u=>u.hp<u.max*.9&&dist(a,u)<=35).sort((x,y)=>x.hp/x.max-y.hp/y.max)[0];
    else if(skill.kind==='revive')recipient=b.units.find(u=>!u.owner&&!alive(u)&&dist(a,u)<=35);
    else if(skill.kind==='shield')recipient=live().filter(u=>u.shield<u.max*.06&&dist(a,u)<=30).sort((x,y)=>x.hp/x.max-y.hp/y.max)[0];
    else if(skill.kind==='summon')recipient=b.units.some(u=>u.owner===a.id&&alive(u))?null:a;
    else if(skill.kind==='taunt')recipient=dist(a,target)<24?a:null;
    else recipient=dist(a,target)<=a.range?target:null;
    if(recipient){choice=skill;break;}
   }
   if(choice){prepare(a,recipient,choice);continue;}
  }
  const ranged=a.range>10,d=dist(a,target);
  if(ranged){if(d<12)a.retreating=true;if(d>19)a.retreating=false;if(a.retreating){move(a,target,dt,all(),true);continue;}}
  if(d>a.range){
   let point=target;
   if(!ranged){const slot=(a.id%7)*Math.PI*2/7;point={x:target.x+Math.cos(slot)*(a.range*.65),y:target.y+Math.sin(slot)*(a.range*.65)};}
   move(a,point,dt,all());continue;
  }
  if(a.cd<=0){a.hits=(a.hits||0)+1;a.combo=a.last===target.id?Math.min(5,(a.combo||0)+1):0;a.last=target.id;
   let power=a.job===0?1+a.combo*.06:a.job===3?1+a.combo*.04:a.job===4?1.4:1;
   prepare(a,target,{kind:ranged?(a.kind===2||a.job>=5?'magic':'shot'):'strike',power,name:''});if(a.job===4&&a.hits%3===0)a.cd=3;
  }
 }
 separate(all(),dt);
 if(b.talent.revive&&!b.revived){const h=b.units.find(h=>!h.owner&&!alive(h));if(h){h.hp=Math.round(h.max*.3);b.revived=true;effect('revive',h,h,h.hp,.9,{preset:'restoration'});}}
 let outcome;
 if(!live().some(h=>!h.owner)||b.time>=BALANCE.timeout)outcome='loss';
 else if(b.enemies.every(e=>!alive(e))&&b.shots.length===0){
  if(b.wave<b.totalWaves){if(!b.intermission){b.intermission=1.2;log(`ผ่านคลื่น ${b.wave} · ศัตรูกำลังมา`);}else {b.intermission=Math.max(.001,b.intermission-dt);if(b.intermission<=.001){b.wave++;b.enemies=spawn(b.floor,b.wave);b.intermission=0;for(const h of b.units){h.action=null;h.cast=null;h.motion=null;h.targetId=null;}log(`คลื่น ${b.wave}/${b.totalWaves}`);}}return;}
  outcome='win';
 }
 if(!outcome)return;
const economy=ensureEconomy(s),rawGem=Math.floor((b.farm?BALANCE.farmGemBase:b.floor%10===0?100:10)*(b.farm?1+b.bonus.reward+b.talent.gems:1)),gem=b.farm?Math.min(rawGem,Math.max(0,BALANCE.farmGemBudget-economy.farmGems)):rawGem,gold=Math.floor((100+b.floor*30)*(1+b.talent.gold));let dropped=0;const xp=Math.floor((20+Math.min(10,b.floor)*2)*(1+b.bonus.reward+b.talent.xp));if(outcome==='win'){if(b.farm)economy.farmGems+=gem;s.gems+=gem;s.gold+=gold;s.stones++;s.materials+=2;if(b.floor%5===0)s.bossTokens++;s.wins++;economy.dropCredit=(economy.dropCredit||0)+b.talent.drop;dropped=Math.floor(economy.dropCredit+1e-8);economy.dropCredit-=dropped;s.weapons+=dropped;if(b.farm){s.farmSummary.runs++;s.farmSummary.gems+=gem;s.farmSummary.gold+=gold;}for(const u of b.units.filter(h=>!h.owner)){const h=s.heroes.find(h=>h.id===u.id);gainXP(h,xp);}if(!b.farm){s.cleared=Math.max(s.cleared,b.floor);s.floor=Math.min(30,b.floor+1);}}s.report={floor:b.floor,outcome,time:b.time,wave:b.wave,gems:outcome==='win'?gem:0,gold:outcome==='win'?gold:0,xp:outcome==='win'?xp:0,materials:outcome==='win'?2:0,stones:outcome==='win'?1:0,bossTokens:outcome==='win'&&b.floor%5===0?1:0,weapons:dropped,reason:outcome==='win'?'กำจัดศัตรูครบทุกคลื่น':b.time>=BALANCE.timeout?'หมดเวลา 240 วินาที':'สมาชิกทีมหมดสติทั้งหมด',units:b.units.filter(h=>!h.owner).map(h=>({id:h.id,job:h.job,level:s.heroes.find(u=>u.id===h.id)?.level??h.level,hp:h.hp,max:h.max,name:h.name,dealt:h.dealt,taken:h.taken,healed:h.healed,uses:h.uses,downs:h.downs}))};log(outcome==='win'?`ชนะ ได้ ${gem} เพชร`:'พ่ายแพ้ กลับฐาน ไม่มีตายถาวร');s.battle=null;if(outcome==='win'&&s.farmLoop){start(s,true,b.floor);}else if(outcome==='win'&&s.auto&&b.floor<30){start(s,false,b.floor+1);}else {s.auto=false;s.farmLoop=false;}return outcome;}
export function train(s,id){const h=s.heroes.find(h=>h.id===id);if(!h||s.battle||s.gold<200)return false;s.gold-=200;h.vit++;if(h.job>=5)h.int++;else h.str++;Object.assign(h,derive(h));return true;}
export function equip(s,id){const h=s.heroes.find(h=>h.id===id);if(!h||s.battle||h.gear||(s.stones<3&&s.weapons<1))return false;if(s.weapons>0)s.weapons--;else s.stones-=3;h.gear=true;if(h.job>=3)h.int+=h.job>=5?3:0;if(h.job===3||h.job===4)h.str+=3;Object.assign(h,derive(h));return true;}

export function upgrade(s,id){const h=s.heroes.find(h=>h.id===id);if(!h||s.battle||h.star>=7)return false;const gold=1000*h.star,stones=5*h.star;if(s.gold<gold||s.stones<stones)return false;s.gold-=gold;s.stones-=stones;h.star++;Object.assign(h,derive(h));return true;}
export function trainStat(s,id,stat){const h=s.heroes.find(h=>h.id===id);if(!h||s.battle||!['str','agi','vit','int','dex','luk'].includes(stat)||s.gold<200||h[stat]>=100000)return false;s.gold-=200;h[stat]=(h[stat]??derive(h)[stat])+1;Object.assign(h,derive(h));return true;}
export function craftPotions(s){if(s.battle||s.materials<3||s.gold<30)return false;s.materials-=3;s.gold-=30;s.potions++;return true;}

// Dismantling is atomic: never silently skip protected or stale selections.
export function dismantleReason(s,h){return !h?'ไม่พบตัวละคร':s.battle?'กำลังต่อสู้':s.team.includes(h.id)?'อยู่ในทีม':h.locked?'ล็อกไว้':h.star===7?'คุ้มครอง 7★':'';}
export function dismantleQuote(s,ids){
 if(!Array.isArray(ids)||!ids.length||new Set(ids).size!==ids.length)return {ok:false,reason:'เลือกตัวละครก่อน',stones:0,materials:0};
 const hs=ids.map(id=>s.heroes.find(h=>h.id===id));
 const reason=hs.map(h=>dismantleReason(s,h)).find(Boolean);
 if(reason||hs.length>=s.heroes.length)return {ok:false,reason:reason||'ต้องเหลือตัวละครอย่างน้อย 1 คน',stones:0,materials:0};
 return {ok:true,stones:hs.reduce((n,h)=>n+h.star,0),materials:hs.reduce((n,h)=>n+h.star*2,0),count:hs.length};
}
export function dismantle(s,ids){const q=dismantleQuote(s,ids);if(!q.ok)return q;const selected=new Set(ids);s.heroes=s.heroes.filter(h=>!selected.has(h.id));s.stones+=q.stones;s.materials+=q.materials;return q;}
