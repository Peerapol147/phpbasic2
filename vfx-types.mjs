export const VFX_PRESETS = {
 slash:{name:'Crescent Slash',thai:'คมดาบจันทร์เสี้ยว',color:'#ffce75',size:80},
 arrow:{name:'Piercing Arrow',thai:'ศรทะลวง',color:'#72e9ff',size:68},
 bullet:{name:'Armor Breaker',thai:'กระสุนเจาะเกราะ',color:'#ffac52',size:62},
 comet:{name:'Arcane Comet',thai:'ดาวหางอาคม',color:'#b18aff',size:86},
 restoration:{name:'Restoration',thai:'แสงฟื้นฟู',color:'#92edaf',size:76},
 aegis:{name:'Aegis',thai:'โล่พิทักษ์',color:'#ffe096',size:78}
};
export function presetFor(actor,skill={}){
 if(['heal','revive'].includes(skill.kind))return 'restoration';
 if(['shield','taunt'].includes(skill.kind))return 'aegis';
 if(skill.kind==='magic'||skill.kind==='summon'||actor.kind===2)return 'comet';
 if(actor.job===4)return 'bullet';
 if(actor.job===3)return 'arrow';
 return 'slash';
}
