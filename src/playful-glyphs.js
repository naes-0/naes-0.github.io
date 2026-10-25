import {neonFontOutlines} from './playful-font-outlines.js';
const SVG_NS = 'http://www.w3.org/2000/svg';

function svgElement(name, attributes = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  return node;
}

let neonClipId=0;
function neonGlyph(character){
 const data=neonFontOutlines[character]||neonFontOutlines.o;
 const svg=svgElement('svg',{viewBox:'0 0 '+data.width+' '+data.height,class:'title-glyph title-glyph-neon',preserveAspectRatio:'none','aria-hidden':'true',focusable:'false'});
 svg.style.setProperty('--neon-width',data.emWidth+'em');svg.style.setProperty('--neon-height',data.emHeight+'em');svg.style.setProperty('--neon-bottom',data.emBottom+'em');
 const id='gogh-neon-clip-'+(++neonClipId),defs=svgElement('defs'),clip=svgElement('clipPath',{id,clipPathUnits:'userSpaceOnUse'});
 clip.append(svgElement('path',{d:data.path,transform:'translate(0 '+data.top+') scale(1 -1)'}));defs.append(clip);svg.append(defs);
 const shape=character==='ж'?[
  'M967 100C947 330 984 690 964 969',
  'M294 106C337 205 379 341 454 441C512 518 714 548 953 528C1228 505 1368 519 1439 432C1525 327 1576 177 1639 104',
  'M273 961C350 809 399 660 467 592C553 507 761 504 965 529C1203 557 1382 511 1466 613C1546 711 1581 858 1659 962'
 ]:['M674 179C401 163 285 334 295 568C307 831 468 956 687 952C947 948 1073 779 1065 545C1055 313 948 167 674 179'];
 const body=svgElement('g',{'clip-path':'url(#'+id+')'}),lit=svgElement('g',{class:'tube-lit'});
 for(const d of shape){body.append(svgElement('path',{d,class:'tube-glass'}));lit.append(svgElement('path',{d,class:'tube-colour'}),svgElement('path',{d,class:'tube-core'}));}
 body.append(lit);svg.append(body);return svg;
}

let pixelClipId=0;
function pixelFontGlyph(){
 const data=neonFontOutlines.t,id='pixel-font-'+(++pixelClipId),svg=svgElement('svg',{class:'title-glyph title-glyph-pixel-font',viewBox:'0 0 '+data.width+' '+data.height,preserveAspectRatio:'none','aria-hidden':'true',focusable:'false'});
 const defs=svgElement('defs'),pattern=svgElement('pattern',{id,width:320,height:320,patternUnits:'userSpaceOnUse'}),colours=['#24db59','#ff2591','#8427f5','#ffd52b','#0976f2','#30e2c2'];
 for(let y=0;y<8;y++)for(let x=0;x<8;x++)pattern.append(svgElement('rect',{x:x*40,y:y*40,width:40,height:40,fill:colours[(x*17+y*31+x*y*7)%6]}));
 defs.append(pattern);svg.append(defs,svgElement('path',{d:data.path,transform:'translate(0 '+data.top+') scale(1 -1)',fill:'url(#'+id+')'}));return svg;
}

function handwrittenGlyph(character) {
  const svg = svgElement('svg', { viewBox: '2 31 82 62', preserveAspectRatio:'none', class: 'title-glyph title-glyph-handwritten', 'aria-hidden': 'true', focusable: 'false' });
  svg.append(svgElement('path', { d: character.toLowerCase()==='т' ? 'M5 85C14 77 19 48 23 35L12 86C22 59 34 33 42 35C52 39 34 75 37 85C44 60 56 35 64 35C76 37 56 72 62 84C67 93 76 85 81 78' : 'M8 36H76M43 30L29 84Q27 95 46 86', class: 'handwritten-ink' }));
  return svg;
}

let gridId=0;
function volumeGlyph(character){
 const svg=svgElement('svg',{viewBox:'0 0 120 120',class:'title-glyph title-glyph-volume','aria-hidden':'true',focusable:'false'});
 const id='letter-grid-'+(++gridId),defs=svgElement('defs'),pattern=svgElement('pattern',{id,width:10,height:10,patternUnits:'userSpaceOnUse'});
 pattern.append(svgElement('path',{d:'M10 0H0V10',fill:'none',stroke:'#526573','stroke-width':'.65',opacity:'.6'}));defs.append(pattern);svg.append(defs);
 const faces=character.toLowerCase()==='r'?[
 ['M24 28L12 10H64L76 28Z','#ccdce5'],['M76 28L64 10L88 30L100 48Z','#bbcfd9'],
 ['M24 28L12 10V94L24 112Z','#9eb4c1'],['M46 68L34 50H60L72 68Z','#9eb4c1'],
 ['M82 78L70 60L94 94L106 112Z','#afc3cf'],
 ['M24 28H76L100 48V72L82 78L106 112H82L58 78H46V112H24ZM46 50V68H72L78 62V56L72 50Z','#e8f3f8']
 ]:[
  ['M20 34L8 12H37L49 34Z','#ccdce5'],['M49 34L37 12L48 52L60 74Z','#afc3cf'],
  ['M73 34L61 12H93L105 34Z','#ccdce5'],['M60 74L48 52L61 12L73 34Z','#bbcfd9'],
  ['M20 34L8 12V89L20 111Z','#9eb4c1'],['M82 67L70 45V89L82 111Z','#9eb4c1'],
  ['M20 34H49L60 74L73 34H105V111H82V67L70 90H50L39 67V111H20Z','#e8f3f8']
 ];
 for(const [d,fill]of faces){svg.append(svgElement('path',{d,fill,stroke:'#344c5a','stroke-width':'1.1','stroke-linejoin':'round','fill-rule':'evenodd'}));svg.append(svgElement('path',{d,fill:'url(#'+id+')','fill-rule':'evenodd'}));}
 return svg;
}

/** The neon keeps the real Gogh character; its tube sits over the plastic face. */
export function decorateTitleLetter(letter,character,finish){
 if(finish==='pixel'&&character==='t'){letter.classList.add('pixel-font-letter');letter.append(pixelFontGlyph());return;}
 if(finish==='donut'){
  const source=document.createElement('span');source.className='glyph-source';source.textContent=character;
  const photo=document.createElement('img');photo.className='title-bagel-photo';photo.src='/assets/hero/bagel-cutout.webp';photo.alt='';photo.width=256;photo.height=256;
  photo.addEventListener('error',()=>{photo.remove();source.classList.remove('glyph-source');letter.classList.remove('has-title-glyph');letter.dataset.texture='solid';},{once:true});
  letter.replaceChildren(source,photo);letter.classList.add('has-title-glyph');return;
 }
 if(finish==='neon'){
  letter.classList.add('neon-sign');letter.append(neonGlyph(character));return;
 }
 if(!['volume','handwritten'].includes(finish))return;
 const source=document.createElement('span');source.className='glyph-source';source.textContent=character;
 letter.replaceChildren(source);letter.classList.add('has-title-glyph');
 letter.append(finish==='volume'?volumeGlyph(character):handwrittenGlyph(character));
}
