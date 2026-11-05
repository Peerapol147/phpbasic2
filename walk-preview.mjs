import {WALK,walkIndex,drawWalk} from './walk-frames.mjs?v=walk-v17';
const $=id=>document.getElementById(id),canvas=$('stage'),ctx=canvas.getContext('2d'),img=new Image();
let clock=0,last=performance.now(),fps=10,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,ready=false,index=0;
function pause(){playing=false;$('play').textContent='เล่นต่อ';}
function selectFrame(n){pause();index=(n+8)%8;clock=index/fps;draw();}
function sprite(x,ground,scale,frame=index,alpha=1){drawWalk(ctx,img,frame,x,ground,scale,$('flip').checked,alpha);}
function draw(){if(!ready)return;ctx.clearRect(0,0,960,440);const direction=$('flip').checked?-1:1,travel=$('mode').value==='travel',distance=(clock*fps/8*150)%680,x=travel?direction===1?140+distance:820-distance:450;
 ctx.strokeStyle='#6e80884d';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(36,345.5);ctx.lineTo(924,345.5);ctx.stroke();for(let px=60;px<920;px+=40){ctx.beginPath();ctx.moveTo(px,345);ctx.lineTo(px,351);ctx.stroke();}
 ctx.fillStyle='#00000030';ctx.beginPath();ctx.ellipse(x,345,48,6,0,0,Math.PI*2);ctx.fill();
 if($('onion').checked)sprite(x,345,.72,(index+7)%8,.2);sprite(x,345,.72);
 ctx.font='12px system-ui';ctx.fillStyle='#9fb2be';ctx.fillText('ขนาดในสนาม',790,385);sprite(830,367,.15);ctx.fillStyle='#ddc08a';ctx.fillRect(x-2,345,4,4);
 $('frame-label').textContent=`${String(index+1).padStart(2,'0')} / 08`;$('scrub').value=index;$('status').textContent=`${playing?'เล่นวน':'หยุดที่เฟรม'} ${index+1} · ${WALK.frames[index].name}`;
 document.querySelectorAll('#frames [data-frame]').forEach(n=>n.setAttribute('aria-pressed',String(Number(n.dataset.frame)===index)));
 canvas.dataset.frame=index;canvas.dataset.playing=playing;
}
img.onload=()=>{ready=true;$('frames').innerHTML=WALK.frames.map((f,i)=>`<button class="frame" data-frame="${i}" aria-label="ดูเฟรม ${i+1}: ${f.name}" aria-pressed="false"><canvas width="180" height="180"></canvas><span><b>${String(i+1).padStart(2,'0')}</b>${f.name}</span></button>`).join('');document.querySelectorAll('#frames [data-frame]').forEach((n,i)=>{drawWalk(n.querySelector('canvas').getContext('2d'),img,i,90,165,.4);n.onclick=()=>selectFrame(i);});['play','previous','next'].forEach(id=>$(id).disabled=false);$('play').textContent=playing?'หยุด':'เล่นต่อ';draw();};
img.onerror=()=>{$('status').textContent='โหลดภาพไม่สำเร็จ';$('error').textContent='โหลด Sprite sheet ไม่สำเร็จ ลองรีโหลดหน้าอีกครั้ง';};img.src=WALK.src;
$('play').onclick=()=>{playing=!playing;last=performance.now();$('play').textContent=playing?'หยุด':'เล่นต่อ';draw();};$('previous').onclick=()=>selectFrame(index-1);$('next').onclick=()=>selectFrame(index+1);$('scrub').oninput=e=>selectFrame(Number(e.target.value));
$('fps').onchange=e=>{const phase=clock*fps;fps=Number(e.target.value);clock=phase/fps;draw();};for(const id of ['mode','onion','flip'])$(id).onchange=draw;
function frame(now){const delta=Math.min(.1,(now-last)/1000);last=now;if(ready&&playing&&!document.hidden){clock+=delta;index=walkIndex(clock,fps);draw();}requestAnimationFrame(frame);}requestAnimationFrame(frame);
