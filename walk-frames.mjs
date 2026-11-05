// Source sheet is preserved as generated; frames are selected, never warped or rigged.
export const WALK={src:'assets/animation/swordsman-walk.png',fps:10,count:8,width:1774,height:887,frames:[
 {x:0,y:0,w:444,h:444,foot:403,name:'ลงส้นเท้า'},
 {x:444,y:0,w:443,h:444,foot:403,name:'รับน้ำหนัก'},
 {x:887,y:0,w:443,h:444,foot:403,name:'ยกขาผ่าน'},
 {x:1330,y:0,w:444,h:444,foot:402,name:'ก้าวไปข้างหน้า'},
 {x:0,y:444,w:444,h:443,foot:402,name:'สลับขาลงพื้น'},
 {x:444,y:444,w:443,h:443,foot:403,name:'รับน้ำหนัก'},
 {x:887,y:444,w:443,h:443,foot:403,name:'ยกขาผ่าน'},
 {x:1330,y:444,w:444,h:443,foot:403,name:'คืนเข้าสู่รอบใหม่'}
]};
export function walkIndex(seconds,fps=WALK.fps){return Math.floor(Math.max(0,seconds)*fps+1e-8)%WALK.count;}
export function drawWalk(ctx,img,index,x,ground,scale=1,flip=false,alpha=1){const f=WALK.frames[index];ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,ground);ctx.scale(flip?-scale:scale,scale);ctx.drawImage(img,f.x,f.y,f.w,f.h,-222,-f.foot,f.w,f.h);ctx.restore();}
