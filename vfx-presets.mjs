import {VFX_PRESETS} from './vfx-types.mjs?v=fx-v11';
export {VFX_PRESETS};
const clamp=n=>Math.max(0,Math.min(1,n));
const svg=body=>`<svg viewBox="0 0 160 100" aria-hidden="true">${body}</svg>`;
const glyphs={
 slash:'<path class="tint" d="M20 83Q144 98 131 8Q115 68 20 83Z"/><path class="core" d="M28 83Q129 86 131 8Q125 70 28 83Z"/><path class="line" d="M5 67Q111 92 119 8M18 92Q147 94 145 28"/>',
 arrow:'<path class="trail" d="M2 47Q49 24 108 47M8 57Q55 76 119 52M0 51H144"/><path class="tint" d="m111 43 49 7-49 9 11-9Z"/><path class="core" d="m122 48 38 2-38 4 7-4Z"/>',
 bullet:'<path class="trail" d="M1 50h19m11 0h23m12 0h33"/><path class="tint" d="M108 45h39l13 5-13 6h-39Z"/><path class="core" d="M111 48h40l9 2-9 2h-40Z"/>',
 comet:'<path class="tint" d="M1 24Q56 40 81 25L69 42Q105 20 137 34L159 50 135 68Q107 80 67 59L77 76Q36 67 10 62L49 51Z"/><path class="trail" d="M8 33Q80 66 123 49M14 75Q70 41 127 48M22 14Q91 31 134 50"/><ellipse class="core" cx="139" cy="50" rx="18" ry="13"/><path class="line" d="m127 27-12 11 3 29 19 12 19-14"/>',
 restoration:'<ellipse class="line" cx="80" cy="83" rx="43" ry="11"/><path class="trail" d="M55 83Q25 45 64 19M106 83Q138 42 95 8"/><path class="tint" d="M47 60q-18-13-8-23 19 4 8 23m68-11q-6-20 11-22 6 17-11 22M67 30q-15-16-2-25 16 10 2 25m27 36q-4-17 12-18 3 16-12 18"/><path class="core" d="M77 33h6v15h15v6H83v15h-6V54H62v-6h15Z"/>',
 aegis:'<path class="veil" d="m80 6 37 15 16 37-20 32H47L27 58l16-37Z"/><path class="line" d="m80 6 37 15 16 37-20 32H47L27 58l16-37ZM80 6v26l25 12 28 14M27 58l28-14 25-12v31l33 27M47 90l33-27M55 44v25m50-25v25"/><path class="core" d="m109 25 8 12 13 5-14 5-5 14-5-15-12-7 13-3Z"/>'
};
const burst=svg('<path class="tint" d="m80 7 8 27 24-17-13 27 40-2-30 14 20 21-31-9-6 26-12-25-19 18 5-25-36 9 28-19-18-17 29 7Z"/><path class="core" d="m80 24 5 21 18-9-12 17 20 7-24 1-7 18-3-20-20 7 15-14-8-13 14 5Z"/>');
const ring=svg('<ellipse class="line" cx="80" cy="52" rx="57" ry="31"/><ellipse class="line thin" cx="80" cy="52" rx="43" ry="23"/>');
export function isPresetEvent(e){return !!VFX_PRESETS[e.preset];}
export function presetMarkup(e){
 const phase=e.type==='projectile'?'travel':e.type==='charge'?'charge':e.type==='launch'?'launch':'impact';
 const numeric=['heal','revive','guard'].includes(e.type)&&e.value>0;
 const particles=Array.from({length:e.preset==='bullet'?7:9},(_,i)=>{const angle=(i*137.5+e.id*13)*Math.PI/180,r=17+i%3*11;return `<i class="fx-spark" style="--dx:${Math.cos(angle)*r}px;--dy:${Math.sin(angle)*r}px;--turn:${i*41}deg"></i>`;}).join('');
 const shape=svg(glyphs[e.preset]);
 return `<span data-effect="${e.id}" class="vfx-preset preset-${e.preset} phase-${phase} ${e.type==='shield-hit'?'shield-hit':''} ${e.radius?'area-effect':''}" aria-hidden="true"><span class="vfx-ground">${ring}</span><span class="vfx-orient"><span class="vfx-bloom">${shape}</span><span class="vfx-form">${shape}</span><span class="vfx-impact">${burst}</span><span class="vfx-particles">${particles}</span></span>${numeric?`<b class="vfx-value">+${Math.round(e.value)}</b>`:''}</span>`;
}
// Uses the battle clock, never CSS elapsed time. All stages pause/scale together.
export function presetGeometry(e,b,width=900,height=800,reduced=false){
 const p=clamp((b.time-e.time)/e.duration),units=[...b.units,...b.enemies],source=units.find(u=>u.id===e.sourceId),target=units.find(u=>u.id===e.targetId);
 const following=['heal','revive','shield','guard','shield-hit'].includes(e.type);
 const from={x:e.fromX,y:e.fromY-3.5},to={x:e.x,y:e.y-3.5};
 let x=to.x,y=to.y;
 if(e.type==='charge'||e.type==='launch'){x=(source?.x??e.fromX);y=(source?.y??e.fromY)-3.5;}
 else if(e.type==='projectile'){x=from.x+(to.x-from.x)*p;y=from.y+(to.y-from.y)*p;}
 else if(following&&target){x=target.x;y=target.y-3.5;}
 const angle=Math.atan2((to.y-from.y)*height,(to.x-from.x)*width)*180/Math.PI;
 const base=VFX_PRESETS[e.preset].size,screenScale=clamp(width/600)*.3+.7;
 const charge=e.type==='charge',travel=e.type==='projectile';
 const opacity=charge?.35+p*.65:travel?1:Math.min(1,(1-p)*3);
 const scale=charge?.45+p*.45:travel?1:reduced?1:.55+Math.sin(Math.min(1,p*2)*Math.PI/2)*.55;
 return {x,y,angle,p,opacity,scale,size:base*screenScale,spread:reduced?0:p*.9,flash:travel||charge?0:Math.max(0,1-p*3),ground:following?1:Math.max(0,1-p),areaWidth:e.radius?e.radius*2/100*width:0,areaHeight:e.radius?e.radius*2/100*height:0};
}
export function updatePreset(node,e,b,width,height,reduced=false){
 const g=presetGeometry(e,b,width,height,reduced),s=node.style;
 s.left=g.x+'%';s.top=g.y+'%';s.width=g.size+'px';s.height=g.size+'px';
 for(const [k,v] of Object.entries({p:g.p,angle:g.angle+'deg',alpha:g.opacity,scale:g.scale,spread:g.spread,flash:g.flash,ground:g.ground,color:VFX_PRESETS[e.preset].color,'area-width':g.areaWidth+'px','area-height':g.areaHeight+'px'}))s.setProperty('--'+k,v);
 if(e.type==='charge')node.hidden=!b.units.concat(b.enemies).some(u=>u.id===e.sourceId&&u.hp>0&&u.action);
}
