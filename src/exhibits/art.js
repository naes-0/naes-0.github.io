// Code-native scenery for portfolio teasers; not documentary images of the works.
export function treeArt(installation = false) {
  let paths = '';
  function branch(x,y,length,angle,depth) {
    const nx=x+Math.sin(angle)*length, ny=y-Math.cos(angle)*length;
    paths+=`<path d="M${x},${y}L${nx},${ny}" stroke-width="${Math.max(.6,depth*.9)}"/>`;
    if(depth) { branch(nx,ny,length*.73,angle-.49,depth-1); branch(nx,ny,length*.72,angle+.54,depth-1); }
    else paths+=`<circle cx="${nx}" cy="${ny}" r="${installation?1.4:3}" fill="currentColor"/>`;
  }
  branch(300,390,94,0,7);
  return `<svg class="tree-art" viewBox="0 0 600 430" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round">${paths}</g>${installation?'<ellipse cx="300" cy="405" rx="150" ry="10" fill="currentColor" opacity=".08"/>':''}</svg>`;
}
export function marshmallow() {
  return `<svg class="marshmallow" viewBox="0 0 500 500" aria-hidden="true"><defs><radialGradient id="mallow"><stop stop-color="#fffdf5"/><stop offset=".65" stop-color="#ffd6df"/><stop offset="1" stop-color="#c876a8"/></radialGradient><filter id="mallow-shadow"><feDropShadow dy="18" stdDeviation="13" flood-color="#9b296d" flood-opacity=".25"/></filter></defs><g filter="url(#mallow-shadow)"><path fill="url(#mallow)" d="M250 62C277 64 290 104 311 104S356 95 371 121S372 170 390 190S430 217 428 249S395 285 391 309S395 358 368 376S322 373 302 390S272 433 243 426S213 391 187 389S143 392 124 368S127 324 109 303S67 271 75 241S109 216 109 187S107 141 131 124S176 130 197 109S220 61 250 62Z"/>${Array.from({length:13},(_,i)=>`<path d="M250 95 Q${90+i*20} 200 ${110+i*22} 350" fill="none" stroke="#fff9f1" stroke-opacity=".6" stroke-width="8"/>`).join('')}</g></svg>`;
}
export function butterflyArt(label = 'Butterfly') {
  const colours=['blue','purple','pink','red','orange','yellow','green','brown'];
  const hex={blue:'#2378e5',purple:'#9c42d1',pink:'#f27fb7',red:'#e94b48',orange:'#f29132',yellow:'#f7d85d',green:'#38925d',brown:'#8a5741'};
  let wings='';
  for(const flip of [1,-1]) {
    wings+=`<g transform="translate(400 220) scale(${flip} 1)"><path d="M0 10C-38-160-250-210-195-25C-178 24-120 20-90 20C-238 10-191 197-84 133C-24 98-15 55 0 10Z" fill="#18242e"/>`;
    colours.forEach((c,i)=>{ const a=i*Math.PI/11-.8, x=-98+Math.sin(a)*62,y=-48+Math.cos(a)*67;
      wings+=`<ellipse class="colour-patch" data-colour="${c}" cx="${x}" cy="${y-65}" rx="${22+i%3*3}" ry="${47-i*2}" transform="rotate(${-55+i*13} ${x} ${y-65})" fill="${hex[c]}"/><ellipse class="colour-patch" data-colour="${c}" cx="${-48-i*13}" cy="${57+i%3*16}" rx="13" ry="24" transform="rotate(35 ${-48-i*13} ${57+i%3*16})" fill="${hex[c]}"/>`;
    });
    wings+='<g fill="#fff6de">'+Array.from({length:9},(_,i)=>`<circle cx="${-30-i*17}" cy="${-98+i*i*.9}" r="3"/>`).join('')+'</g></g>';
  }
  return `<svg class="butterfly-art" viewBox="0 0 800 460" role="img" aria-label="${label}"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#b4dce8"/><stop offset="1" stop-color="#eef3e9"/></linearGradient></defs><rect class="colour-patch" data-colour="blue" width="800" height="460" fill="url(#sky)"/><circle class="colour-patch" data-colour="yellow" cx="660" cy="85" r="48" fill="#fff1a1"/><path class="colour-patch" data-colour="green" d="M0 380Q120 240 260 360T550 330T800 350V460H0Z" fill="#4e8c62"/><path class="colour-patch" data-colour="green" d="M0 440Q190 320 370 415T800 370V460H0Z" fill="#286747"/>${wings}<g fill="#172329" stroke="#172329" stroke-width="4"><ellipse cx="400" cy="234" rx="9" ry="64"/><path d="M400 190Q365 149 373 130M400 190Q433 149 427 130" fill="none"/></g></svg>`;
}
export function beachArt() {
  return `<svg class="beach-art" viewBox="0 0 800 430" aria-hidden="true"><path d="M0 235Q140 200 300 240T800 210V430H0" fill="#59cbd3"/><path d="M0 310Q250 220 450 300T800 270V430H0" fill="#f6d895"/><g class="smiling-sun" transform="translate(640 95)"><g stroke="#f4ae20" stroke-width="8">${Array.from({length:12},(_,i)=>`<path d="M0-60V-80" transform="rotate(${i*30})"/>`).join('')}</g><circle r="51" fill="#ffd34e"/><path d="M-42-15H42M-33-15Q-32 15-11 3L-4-15M4-15L11 3Q32 15 33-15" fill="#202332" stroke="#202332" stroke-width="5"/><path d="M-13 23Q0 39 17 20" fill="none" stroke="#202332" stroke-width="4"/></g><g class="beach-person"><path d="M200 345L520 345" stroke="#f68588" stroke-width="42" stroke-linecap="round"/><circle cx="267" cy="287" r="30" fill="#cc896a"/><path d="M300 314L412 324L483 310M326 315L348 278M407 324L445 351" fill="none" stroke="#cc896a" stroke-width="25" stroke-linecap="round"/><path class="protection-shirt" d="M303 298L364 305L360 336L300 330Z" fill="#5f71d9"/><path class="protection-hat" d="M224 270Q260 225 294 269L306 275L217 277Z" fill="#fff4bf"/></g><g class="protection-parasol"><path d="M440 320V140" stroke="#78624a" stroke-width="8"/><path d="M310 154Q440-5 570 154Q530 133 505 154Q470 134 440 154Q407 134 375 154Q340 134 310 154" fill="#f7798b"/><path d="M440 47L440 153M440 47Q385 82 375 154M440 47Q495 82 505 154" stroke="#ffbcc0" stroke-width="3" fill="none"/></g></svg>`;
}
