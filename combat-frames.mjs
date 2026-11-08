import {WALK} from './walk-frames.mjs?v=walk-v17';
import {ABILITIES,abilityText} from './abilities.mjs?v=clip-v10';
const sequence=[0,1,2,3,4,5,6,7];
const timing=[140,140,160,65,90,100,130,275];
const sheet=(key,feet,scale=1)=>({src:`assets/animation/swordsman-${key}.png`,scale,frames:WALK.frames.map((f,i)=>({...f,foot:feet[i]}))});
export const SHEETS={walk:{...WALK,scale:1},slash:sheet('slash',[406,406,406,406,406,406,407,406]),sweep:sheet('sweep',[411,410,411,411,411,411,411,411]),thrust:sheet('thrust',[401,401,401,401,398,398,398,398],1.06),finish:sheet('finish',[410,410,410,410,406,407,409,409])};
const skill=id=>ABILITIES[0].find(a=>a.id===id);
const clip=(id,name,sheet,extra={})=>({id,name,sheet,sequence:[...sequence],timing:[...timing],impacts:[4],color:'#f2d496',...extra});
export const CLIPS=[
 clip('walk','เดิน','walk',{timing:Array(8).fill(100),impacts:[],description:'ท่าเดิน 8 เฟรม'}),
 clip('normal','โจมตีปกติ','slash',{description:'ฟันเฉียงหนึ่งครั้ง · เตรียม → กระทบ → คืนท่า'}),
 clip('sword-cut','ฟันต่อเนื่อง','slash',{sequence:[0,1,2,3,4,5,2,3,4,5,6,7],timing:[140,110,130,65,80,85,100,65,90,100,130,275],impacts:[4,8],color:'#9fdff2',description:'ตัวอย่างคอมโบสองจังหวะ ใช้เฟรมฟันกลับมาเตรียมโจมตีครั้งที่สอง'}),
 clip('sword-sweep','กวาดดาบ','sweep',{color:'#f7cd86',description:'กวาดแนวนอน · แนวคมดาบแผ่กว้าง'}),
 clip('sword-break','ฟันทะลวง','thrust',{color:'#b8eaff',description:'แทงตรง · จังหวะพุ่งสั้นและประกายทะลวง'}),
 clip('sword-drain','คมดาบดูดชีวิต','slash',{color:'#de729d',description:'ใช้ท่าฟันเฉียงร่วมกับพลังสีชาดและสายพลังไหลกลับ'}),
 clip('sword-finish','ดาบพิพากษา','finish',{timing:[140,180,260,75,130,150,170,295],color:'#fbd77d',description:'ยกดาบสองมือ → ฟันหนักลงพื้น → คืนท่า'})
].map(c=>({...c,mechanics:skill(c.id)?abilityText(skill(c.id)):'',duration:c.timing.reduce((a,b)=>a+b,0)/1000}));
export function sampleClip(c,time,loop=true){const ms=loop?((Math.max(0,time)*1000)%(c.duration*1000)):Math.min(Math.max(0,time)*1000,c.duration*1000-1e-6);let begin=0,step=0;for(;step<c.timing.length-1&&ms>=begin+c.timing[step]-1e-6;step++)begin+=c.timing[step];const hit=c.impacts.filter(i=>i<=step).at(-1);const hitStart=hit===undefined?Infinity:c.timing.slice(0,hit).reduce((a,b)=>a+b,0);return {step,source:c.sequence[step],local:(ms-begin)/c.timing[step],phase:c.id==='walk'?'เดิน':c.impacts.includes(step)?'กระทบ':step===c.sequence.length-1?'พร้อม':step<(c.impacts[0]??4)?'เตรียม / ปล่อย':'คืนท่า',impactAge:(ms-hitStart)/1000};}
export function stepTime(c,step){return c.timing.slice(0,step).reduce((a,b)=>a+b,0)/1000;}
export function drawFrame(ctx,img,sheet,source,x,ground,scale=1,flip=false,alpha=1){const f=sheet.frames[source];ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,ground);ctx.scale(flip?-scale*sheet.scale:scale*sheet.scale,scale*sheet.scale);ctx.drawImage(img,f.x,f.y,f.w,f.h,-222,-f.foot,f.w,f.h);ctx.restore();}
export function drawCombatFX(ctx,c,s,x,ground,scale,flip,enabled=true,showTarget=true){if(c.id==='walk')return;const dir=flip?-1:1,reach=c.sheet==='thrust'?190:c.sheet==='sweep'?210:c.sheet==='finish'?160:183,hitY=c.sheet==='thrust'?-215:c.sheet==='sweep'?-180:c.sheet==='finish'?-40:-100,age=s.impactAge,hit=age>=0&&age<.22;
 ctx.save();ctx.translate(x,ground);ctx.scale(dir*scale,scale);ctx.lineCap='round';
 // Stationary training target at the sword's contact point, never an automatic damage claim.
 if(showTarget){ctx.fillStyle=hit&&enabled?'#d8bc81':'#59616a';ctx.fillRect(reach-5,-220,10,220);ctx.fillStyle=hit&&enabled?'#e4c390':'#79838a';ctx.beginPath();ctx.ellipse(reach,hitY,23,35,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#303e48';ctx.lineWidth=3;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(reach-20,hitY+i*10);ctx.lineTo(reach+20,hitY+i*10);ctx.stroke();}
 }
 if(!enabled){ctx.restore();return;}
 const attacking=[3,4].includes(s.source),fade=Math.max(0,1-age/.24);
 if(attacking){ctx.globalAlpha=.8;ctx.strokeStyle=c.color;ctx.shadowColor=c.color;ctx.shadowBlur=14;ctx.lineWidth=12;ctx.beginPath();if(c.sheet==='thrust'){ctx.moveTo(75,-215);ctx.lineTo(reach+20,-215);}else if(c.sheet==='sweep'){ctx.ellipse(40,-180,reach,42,0,-1.4,1.4);}else if(c.sheet==='finish'){ctx.moveTo(25,-355);ctx.quadraticCurveTo(195,-260,reach,-40);}else{ctx.moveTo(25,-340);ctx.quadraticCurveTo(240,-230,reach,-100);}ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#fff8e4';ctx.lineWidth=3;ctx.stroke();}
 if(hit){ctx.globalAlpha=fade;ctx.strokeStyle=c.color;ctx.lineWidth=3;for(let i=0;i<9;i++){const a=i*2.399,dist=12+age*160;ctx.beginPath();ctx.moveTo(reach+Math.cos(a)*dist*.4,hitY+Math.sin(a)*dist*.4);ctx.lineTo(reach+Math.cos(a)*dist,hitY+Math.sin(a)*dist);ctx.stroke();}ctx.fillStyle='#fff4d3';ctx.beginPath();ctx.arc(reach,hitY,8*fade+1,0,Math.PI*2);ctx.fill();}
 if(c.id==='sword-drain'&&age>=0&&age<.5){ctx.globalAlpha=1-age/.5;ctx.fillStyle='#f099b5';for(let i=0;i<7;i++){const p=Math.min(1,age*2+i*.04);ctx.beginPath();ctx.arc(reach*(1-p),hitY-50*Math.sin(p*Math.PI),3,0,Math.PI*2);ctx.fill();}}
 ctx.restore();}
