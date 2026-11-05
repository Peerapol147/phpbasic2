import {VFX_PRESETS,presetMarkup,updatePreset} from './vfx-presets.mjs?v=fx-v11';
const descriptions={slash:'คมโค้งสีทองตามแนวฟัน พร้อมประกายสั้นที่จุดกระทบ',arrow:'หัวศรสีฟ้าและเส้นแสงเรียว พุ่งไปในทิศเดียวกับวิถี',bullet:'ไฟปากกระบอก เส้นกระสุน และสะเก็ดโลหะเมื่อโดนเป้า',comet:'แกนพลังสว่าง หางเปลวเวท และแสงแตกตัวเมื่อถึงเป้า',restoration:'แสงจากผู้ร่าย ตามด้วยละอองใบไม้และวงฟื้นฟูใต้เท้า',aegis:'เกราะแสงหกเหลี่ยม รับแรงปะทะแล้วเกิดประกายเฉพาะจุด'};
const panels=Object.entries(VFX_PRESETS).map(([key,preset],i)=>{
 const job=[0,3,4,5,7,1][i],node=document.createElement('article');node.innerHTML=`<h2>${preset.name}<small>${preset.thai}</small></h2><div class="preview-arena"><span class="actor" style="left:22%;--row:${job*100/7}%"></span>${['aegis','restoration'].includes(key)?'<span class="actor" style="left:78%;--row:14.2857%"></span>':'<svg class="target" viewBox="0 0 100 120"><use href="assets/combat-kit.svg#scout"></use></svg>'}<div class="phase-label"></div></div><p>${descriptions[key]}</p>`;document.querySelector('#presets').append(node);
 return {key,node,arena:node.querySelector('.preview-arena'),phase:'',actor:{id:1,x:22,y:55,hp:100,action:true},target:{id:2,x:78,y:55,hp:100}};
});
let time=0,last=performance.now(),paused=false;
document.querySelector('#pause').onclick=e=>{paused=!paused;e.target.textContent=paused?'▶ เล่นต่อ':'Ⅱ หยุดภาพ';};
document.querySelector('#replay').onclick=()=>{time=0;for(const p of panels)p.phase='';};
function render(){const t=time%3.3;for(const p of panels){const support=['restoration','aegis'].includes(p.key),phase=t<.6?'charge':t<1.2?'projectile':t<2.3?'impact':'rest',start=phase==='charge'?0:phase==='projectile'?.6:1.2,duration=phase==='charge'?.6:phase==='projectile'?.6:1.1;
 const type=phase==='impact'?(p.key==='restoration'?'heal':p.key==='aegis'?'shield-hit':'impact'):phase;
 const event={id:1,type,preset:p.key,sourceId:1,targetId:2,x:78,y:55,fromX:22,fromY:55,time:start,duration,value:p.key==='restoration'?42:0};
 // The melee stage sweeps into contact; support spells form on the recipient.
 if(phase==='projectile'&&(support||p.key==='slash')){event.type='launch';if(support){event.sourceId=2;event.fromX=78;}}
 if(p.phase!==phase){p.arena.querySelectorAll('[data-effect]').forEach(n=>n.remove());if(phase!=='rest')p.arena.insertAdjacentHTML('beforeend',presetMarkup(event));p.phase=phase;}
 const fx=p.arena.querySelector('[data-effect]');if(fx)updatePreset(fx,event,{time:t,units:[p.actor,p.target],enemies:[]},p.arena.clientWidth,p.arena.clientHeight,matchMedia('(prefers-reduced-motion: reduce)').matches);
 p.node.querySelector('.phase-label').textContent=phase==='charge'?'CAST · เตรียมพลัง':phase==='projectile'?'RELEASE · ปล่อยพลัง':phase==='impact'?'IMPACT · กระทบเป้า':'RECOVER · พักจังหวะ';
}}
function frame(now){const elapsed=Math.min(.08,(now-last)/1000);last=now;if(!paused&&!document.hidden)time+=elapsed*Number(document.querySelector('#speed').value);render();requestAnimationFrame(frame);}requestAnimationFrame(frame);
