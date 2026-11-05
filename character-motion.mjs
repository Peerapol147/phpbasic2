const clamp=n=>Math.max(0,Math.min(1,n));
// The engine's preparation and release timestamps are the only animation clock.
export function characterPose(h,time,reduced=false){
 const out={phase:'idle',body:0,arm:0,offhand:0,lean:0,step:0,draw:0,flare:0};
 if(h.hp<=0){out.phase='fallen';return out;}
 if(h.stun>0){out.phase='stunned';return out;}
 const m=h.motion;
 if(m&&time<m.start+m.duration+.3){
  const wind=time<m.start+m.duration,p=clamp((time-m.start)/m.duration),q=clamp((time-m.start-m.duration)/.3),recoil=Math.sin(q*Math.PI),support=['heal','revive','shield','taunt','summon','magic'].includes(m.kind);
  out.phase=wind?'prepare':q<.32?'release':'recover';
  if(support){out.arm=wind?-24*p:-24*(1-q);out.offhand=wind?18*p:18*(1-q);out.body=-2*(wind?p:1-q);out.flare=wind?p:1-q;}
  else if(h.job===3){out.arm=wind?-18*p:-18*(1-q);out.offhand=wind?30*p:-12*recoil;out.draw=wind?p:Math.max(0,1-q*8);out.lean=wind?-p:2*recoil;out.body=wind?-3*p:3*recoil;}
  else if(h.job===4){out.arm=wind?-7*p:12*recoil;out.lean=wind?0:-2*recoil;out.body=wind?-2*p:-5*recoil;}
  else {out.arm=wind?-48*p:62*(1-q);out.offhand=wind?8*p:-10*(1-q);out.body=wind?-5*p:9*(1-q);out.lean=wind?-1.2*p:3*(1-q);}
 }else if(h.moving){out.phase='walk';out.step=Math.sin(time*15+h.id)*2;out.body=Math.sin(time*15+h.id)*1.5;}
 if(reduced){out.body=out.arm=out.offhand=out.lean=out.step=0;out.draw=0;}
 return out;
}
export function updateCharacter(node,h,time,reduced=false){
 const p=characterPose(h,time,reduced);node.dataset.pose=p.phase;
 for(const [key,val] of Object.entries(p))if(key!=='phase')node.style.setProperty('--pose-'+key,String(val));
}

export function rigMarkup(h,sprite){return `<span class="battle-sprite rig-job${h.job}"><span class="sprite-upper">${sprite(h.job,h.star,h.element)}</span>${h.job===3?`<span class="sprite-arm off-arm">${sprite(h.job,h.star,h.element)}</span>`:''}<span class="sprite-leg left">${sprite(h.job,h.star,h.element)}</span><span class="sprite-leg right">${sprite(h.job,h.star,h.element)}</span>${h.job===3?'<svg class="bow-rig" viewBox="0 0 100 175" aria-hidden="true"><path class="bow-limb" d="M77 58Q108 88 77 120"/><path class="bow-string" d="M77 58 77 120"/><path class="nocked-arrow" d="M42 90H95m-9-4 9 4-9 4"/></svg>':''}</span>`;}

