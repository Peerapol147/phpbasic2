// Presentation only: interpolate fixed simulation ticks without changing combat state.
const clamp=n=>Math.max(0,Math.min(1,n));
const key=u=>(u.kind===undefined?'hero:':'enemy:')+u.id;
export function snapshotMotion(b){return {time:b.time,wave:b.wave,units:new Map([...b.units,...b.enemies].map(u=>[key(u),{x:u.x,y:u.y}]))};}
export function motionFrame(b,previous,alpha){
 if(!previous||previous.wave!==b.wave)return b;
 const p=clamp(alpha),time=previous.time+(b.time-previous.time)*p;
 const blend=u=>{const old=previous.units.get(key(u));if(!old||Math.hypot(u.x-old.x,u.y-old.y)>12)return u;return {...u,x:old.x+(u.x-old.x)*p,y:old.y+(u.y-old.y)*p};};
 return {...b,time,units:b.units.map(blend),enemies:b.enemies.map(blend),events:b.events.filter(e=>e.time<=time)};
}
export function poseFor(u,time,reduced=false){
 if(reduced||u.hp<=0||u.stun>0)return {lift:0,lean:0,reach:0};
 const moving=u.moving&&!u.action,phase=time*(u.speed||8)*1.7+u.id*2.4;
 const lift=moving?-Math.abs(Math.sin(phase))*.7:0;
 let reach=0,lean=moving?Math.sin(phase)*.6:0;
 if(u.action){const kind=u.action.skill.kind,duration=kind==='magic'?.7:['heal','revive'].includes(kind)?.45:.22,p=clamp(1-u.action.remaining/duration);reach=-Math.sin(p*Math.PI/2)*(kind==='strike'?1.4:.5);lean=-p*1.2;}
 else if(u.actionUntil>time){const recover=clamp((u.actionUntil-time)/.16);reach=Math.sin(recover*Math.PI/2)*(u.range>10?-.8:2.5);lean=reach*.6;}
 return {lift,lean,reach};
}
