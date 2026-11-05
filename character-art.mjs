// Authored garment silhouettes over the existing painted class/rarity atlas.
// Geometry changes by rank, while each class keeps its own material palette.
export const OUTFIT_NAMES=['ชุดเดินทาง','ชุดลาดตระเวน','ชุดประจำกอง','ชุดหัวหน้าหน่วย','ชุดองครักษ์','ชุดจอมทัพ','ชุดราชัน'];
const palettes=[['#702c35','#c9a575'],['#264665','#b6c7cd'],['#3f533b','#b9a274'],['#354f39','#c9af73'],['#44372c','#c5ac76'],['#47345f','#d0b387'],['#284950','#b9a676'],['#d3c6a4','#bda16b']];
const cloaks=['','M23 36 16 61 24 67 30 42Z','M22 32 8 75 24 84 37 38Z','M22 31 3 85 21 94 39 39Z','M20 30 0 90 18 96 29 78 38 39Z','M19 29 0 94 20 98 31 76 39 38Z','M18 27 0 95 13 99 25 94 34 74 40 37Z'];
export function costumeMarkup(job,star){
 const j=Math.max(0,Math.min(7,job|0)),r=Math.max(1,Math.min(7,star|0)),[cloth,metal]=palettes[j],robe=j>=5;
 const cape=cloaks[r-1];
 const shoulder=r===1?'M20 38 28 35 34 42 26 47Z':r===2?'M17 37 27 32 38 41 31 48 19 45Z':r===3?'M14 36 26 29 40 39 34 49 19 47Z':r===4?'M12 35 25 27 42 38 35 50 17 47Z':r===5?'M10 34 24 25 44 37 35 51 15 47 12 40Z':r===6?'M9 31 16 27 19 29 25 24 30 28 35 27 44 37 36 48 29 44 23 49 17 44 12 46Z':'M7 32 13 22 23 26 27 19 36 29 46 37 36 51 26 45 16 49Z';
 const seam=r>=3?'<path d="m18 40 9-5 10 7-6 4" fill="none" stroke="'+metal+'" stroke-width="1.2"/>':'';
 const badge=r>=5?'<path d="m27 33 3 6-3 6-3-6z" fill="'+(j>=5?'#b0d4de':'#e4d09a')+'" stroke="#423b35" stroke-width=".7"/>':'';
 return `${cape?`<svg class="costume-cape" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${cape}" fill="${cloth}" stroke="#19222d" stroke-width="1.5"/><path d="M22 39 10 79 21 88 29 65" fill="none" stroke="${metal}" stroke-width="${r>=5?1.4:.7}" opacity=".7"/>${r===7?'<path d="m12 78 6 4-2 8m4-18 6 4-2 8" fill="none" stroke="'+metal+'" stroke-width="1.4"/>':''}</svg>`:''}<svg class="costume-trim" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><g transform="translate(18 13) scale(.62)"><path d="${shoulder}" fill="${r===6?'#cec8b5':robe||j===3||j===4?cloth:r<3?'#63503c':metal}" stroke="#25282d" stroke-width="1.1"/>${seam}<path d="m20 37 7-4 8 7-4 5-11-2z" fill="none" stroke="#f4e5bc" stroke-width=".6" opacity=".4"/>${badge}</g>${r>=4?`<path d="m38 66 8 2-2 ${r+5}-7-3z" fill="${cloth}" stroke="${metal}" stroke-width=".7"/>`:''}</svg>`;
}

export function portraitMarkup(job,star=1,element=null){const j=Math.max(0,Math.min(7,Math.trunc(job)||0)),r=Math.max(1,Math.min(7,Math.trunc(star)||1));return `<span class="hero-art job${j} rarity${r} ${Number.isInteger(element)?'aura-element-'+element:''}" role="img" aria-label="${['นักดาบ','อัศวิน','แทงค์','ธนู','ปืน','เวทย์','นักอัญเชิญ','พระ'][j]} ${r} ดาว" data-art="${j}-${r}" data-outfit="${r}" title="${OUTFIT_NAMES[r-1]}" style="--motion-delay:-${(j*.23+r*.11).toFixed(2)}s;--art-x:${(r-1)*100/6}%;--art-y:${j*100/7}%">${costumeMarkup(j,r)}<span class="painted-art"></span></span>`;}
