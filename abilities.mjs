// Presentation and mechanics observed in the supplied clips. Coefficients are
// provisional Mistbound values, not extracted/claimed Summon to Die rules.
const active=(id,name,kind,power,cooldown,star=1,radius=0,extra={})=>({id,name,kind,power,cooldown,star,radius,...extra});
export const ABILITIES={
0:[active('sword-cut','ฟันต่อเนื่อง','strike',1.35,5),active('sword-sweep','กวาดดาบ','strike',.85,7,1,10),active('sword-break','ฟันทะลวง','strike',1.5,8,3,0,{pierce:.5}),active('sword-drain','คมดาบดูดชีวิต','strike',1.5,9,5,0,{leech:.3}),active('sword-finish','ดาบพิพากษา','strike',2,10,7,0,{execute:true})],
1:[active('knight-bash','โล่กระแทก','strike',1,7,1,0,{stun:.6}),active('knight-ward','คำสัตย์คุ้มครอง','shield',.65,8),active('knight-sweep','วงดาบพิทักษ์','strike',.9,8,3,10),active('knight-light','โล่แสง','shield',1.1,10,5,15),active('knight-last','ปราการศักดิ์สิทธิ์','shield',1.6,13,7,20)],
2:[active('tank-taunt','ท้าทาย','taunt',.2,8),active('tank-bash','กระแทกพื้น','strike',.8,7,1,9,{slow:.3}),active('tank-ward','เกราะเหล็ก','shield',1,10,3),active('tank-quake','แผ่นดินสะเทือน','strike',1.2,10,5,14,{stun:.8}),active('tank-wall','กำแพงมีชีวิต','shield',1.6,12,7,18)],
3:[active('bow-pierce','ศรเจาะจุด','shot',1.6,6),active('bow-volley','ศรคู่','shot',.85,7,1,0,{targets:2}),active('bow-slow','ศรตรึง','shot',1.2,8,3,0,{slow:.4}),active('bow-rain','ฝนศร','shot',.9,9,5,14),active('bow-finish','ศรสังหาร','shot',2.2,11,7,0,{execute:true})],
4:[active('gun-shot','กระสุนเจาะเกราะ','shot',1.7,7,1,0,{pierce:.5}),active('gun-burst','ยิงกระจาย','shot',.8,8,1,0,{targets:3}),active('gun-shell','กระสุนระเบิด','shot',1,9,3,10),active('gun-slow','กระสุนหยุดยั้ง','shot',1.4,9,5,0,{slow:.4}),active('gun-finish','กระสุนพิพากษา','shot',2.4,12,7,0,{execute:true})],
5:[active('mage-orb','ลูกแก้วเวท','magic',1.45,5),active('mage-wave','ระเบิดอาคม','magic',.8,7,1,13),active('mage-bind','วงเวทพันธนาการ','magic',.65,8,3,12,{slow:.4}),active('mage-storm','พายุเวท','magic',1.15,10,5,17),active('mage-star','ดาวตก','magic',1.8,12,7,14,{stun:.7})],
6:[active('summon-call','อัญเชิญผู้พิทักษ์','summon',.4,10),active('summon-mend','สายใยชีวิต','heal',.7,6),active('summon-ward','ม่านวิญญาณ','shield',.8,8,3,12),active('summon-wave','คลื่นวิญญาณ','magic',1,9,5,14),active('summon-star','วิญญาณพิพากษา','magic',1.7,11,7,16)],
7:[active('priest-heal','แสงเยียวยา','heal',1.15,4),active('priest-ring','วงแสงรักษา','heal',.65,6,1,15),active('priest-cleanse','ชำระมลทิน','heal',.9,6,3,0,{cleanse:true}),active('priest-shield','เกราะศรัทธา','shield',1.2,9,5,15),active('priest-revive','คืนชีพ','revive',.35,30,7)]
};
export const PASSIVES=[
 {id:'vital',name:'ร่างกายแข็งแกร่ง',text:'HP สูงสุด +8%',hp:.08},
 {id:'focus',name:'สมาธิ',text:'ATK +6%',atk:.06},
 {id:'renew',name:'ฟื้นกำลัง',text:'ฟื้น HP 2% ทุก 3 วินาที ขณะยังมีชีวิต',regen:.02},
 {id:'mercy',name:'ศรัทธา',text:'พลังรักษา +15%',heal:.15},
 {id:'siphon',name:'ดูดซับชีวิต',text:'โจมตีโดนแล้วฟื้น HP 5% ของดาเมจจริง',leech:.05},
 {id:'guard',name:'ตั้งรับ',text:'เมื่อ HP ต่ำกว่า 35% รับโล่ 12% HP · คูลดาวน์ 15 วินาที',guard:.12}
];
const hash=n=>{n=Math.imul(n^n>>>16,0x45d9f3b);return (n^n>>>16)>>>0;};
export function classPassives(job){return (job===7?[0,2,3]:job<3?[0,4,5]:[1,2,4]).map(i=>PASSIVES[i]);}
export function assignSkills(h){
 const list=ABILITIES[h.job];
 if(!list)return h;
 if(!Array.isArray(h.skillIds)||!h.skillIds.length||h.skillIds.some(id=>!list.some(a=>a.id===id))){
  const seed=hash(h.id*7919+h.job*97),first=list[h.job===6?0:seed%2];
  h.skillIds=[first.id,...list.filter(a=>a!==first).sort((a,b)=>hash(seed+a.id.length+a.star*17)-hash(seed+b.id.length+b.star*17)).map(a=>a.id)];
 }
 if(!Array.isArray(h.passiveIds)||!h.passiveIds.length||h.passiveIds.some(id=>!PASSIVES.some(p=>p.id===id))){
  const pool=h.job===7?[0,2,3]:h.job<3?[0,4,5]:[1,2,4];const seed=hash(h.id*31+h.job);h.passiveIds=[PASSIVES[pool[seed%3]].id,PASSIVES[pool[(seed+1)%3]].id];
 }
 return h;
}
export function heroSkills(h){assignSkills(h);const slots=h.star>=7?3:h.star>=3?2:1;return (h.skillIds||[]).map(id=>ABILITIES[h.job].find(a=>a.id===id)).filter(a=>a.star<=h.star).slice(0,slots);}
export function heroPassives(h){assignSkills(h);return (h.passiveIds||[]).slice(0,h.star>=5?2:1).map(id=>PASSIVES.find(p=>p.id===id));}
export function passiveStats(h){return heroPassives(h).reduce((out,p)=>{for(const k of ['hp','atk','regen','heal','leech','guard'])out[k]=(out[k]||0)+(p[k]||0);return out;},{});}
export function abilityText(a){const kind={strike:'ดาเมจ',shot:'ดาเมจ',magic:'เวท',heal:'ฟื้น HP',shield:'โล่',taunt:'โล่ %HP',summon:'ATK มินเนียน',revive:'ฟื้น %HP'}[a.kind];return `${kind} ${Math.round(a.power*100)}%${['taunt','revive'].includes(a.kind)?'':' ATK'}${a.radius?' · รัศมี '+a.radius:''}${a.targets?' · '+a.targets+' เป้า':''}${a.stun?' · สตัน '+a.stun+'s':''}${a.slow?' · ช้า '+Math.round(a.slow*100)+'% 3s':''}${a.pierce?' · เจาะเกราะ 50%':''}${a.cleanse?' · ล้างสถานะ':''}${a.leech?' · ดูดเลือด 30%':''}${a.execute?' · แรงขึ้น 50% เมื่อเป้า HP<30%':''} · CD ${a.cooldown}s`;}
