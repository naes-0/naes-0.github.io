import {getLocale} from '../i18n.js';
import {paintBeachText} from './beach-lettering.js';

// Bespoke interface illustration, not documentation or a medical simulation.
// The clock face is drawn from paths, with no font dependency.
function clockFace(time){
  const glyphs={
    '0':'M8 1C-1 0-1 26 7 27 17 29 18 1 8 1Z',
    '1':'M2 6 9 1 8 27M3 27h11',
    '3':'M1 4C9-3 19 3 12 11L7 14C21 11 18 32 1 25',
    '8':'M8 1C-3 0-1 13 8 14 18 14 18 0 8 1ZM8 14C-3 13-3 28 8 28 19 29 20 14 8 14Z'
  };
  return `<g class="bvp-clock-digits" data-time="${time}" fill="none" stroke="#654b43" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${[0,1,3,4].map((index,i)=>`<path d="${glyphs[time[index]]}" transform="translate(${[-44,-24,9,29][i]} -13)"/>`).join('')}<path d="M0-4v1m0 11v1" stroke-width="3.8"/></g>`;
}
const glasses=`<g stroke="#794b45" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"><path d="M-41-14H-9Q0-8 9-14H41V-6H37L33 7Q31 16 21 16H18Q9 16 5 3L3-3Q0-6-3-3L-5 3Q-9 16-18 16H-21Q-31 16-33 7L-37-6H-41Z" fill="#4e6d70"/><path d="M-29 5q5-8 12-13M13 6q6-9 13-14" stroke="#c7e0d9" stroke-width="3.6" fill="none"/><path d="M-22 8l7-10M20 8l6-9" stroke="#a8c9c5" stroke-width="1.6" fill="none"/></g>`;
const shirt=`<g transform="rotate(-12)" stroke="#794b45" stroke-width="2.8" stroke-linejoin="round"><path d="M-17-32Q-4-24 10-32L38-12 26 6 15-1 18 33Q-6 39-29 28L-23-4-35 1-43-16Z" fill="#acd8cc"/><path d="M-17-32Q-11-12 10-32M-25 21q17 8 31 5M16-3l-4 10" fill="none" stroke="#649d94" stroke-width="2"/></g>`;
const cap=`<g stroke="#794b45" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M-43 10C-47-16-29-39-7-40 19-43 39-25 40 6L15 20Z" fill="#82bfd7"/><path d="M-8-39C8-29 12-6 9 15" fill="none" stroke="#508fae" stroke-width="2"/><path d="M-43 10Q-26 5-12 10C4 17 13 15 25 12 39 10 57 14 59 20 59 29 28 30 13 28L-27 22Q-41 19-43 10Z" fill="#a8d9e7"/><path d="M-11-12q5-6 10 0t10 0" fill="none" stroke="#fff3c8"/><ellipse cx="-7" cy="-40" rx="4" ry="2.4" fill="#b6e2e9"/></g>`;
function parasolArtwork(poleEnd=101){return `<g stroke="#794b45" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"><path d="M-3-121h6v${poleEnd+121}h-6Z" fill="#d49b68"/><path d="M-96-56C-76-92-43-114 0-123 44-113 76-89 96-56Q81-44 66-55 50-42 33-53 16-43 0-55-17-43-34-53-50-42-66-55-81-45-96-56Z" fill="#f38e77"/><path d="M0-122C-28-103-51-75-66-55Q-50-42-34-53C-26-82-15-105 0-122M0-122C16-105 26-81 33-53Q50-42 66-55C50-82 29-108 0-122" fill="#fff0ba" stroke="none"/><path d="M-96-56C-76-92-43-114 0-123 44-113 76-89 96-56Q81-44 66-55 50-42 33-53 16-43 0-55-17-43-34-53-50-42-66-55-81-45-96-56ZM0-122Q-7-86 0-55M0-122Q-40-96-66-55M0-122Q40-97 66-55" fill="none"/><path d="M0-131v8" stroke-width="5"/></g>`;}
const parasol=parasolArtwork();
const bottle=`<g stroke="#794b45" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"><path d="M-23-40Q-29-37-28-26L-30 32Q-30 48-17 49H18Q31 47 30 33L27-27Q27-39 20-40Z" fill="#fff3d6"/><path d="M-21-56Q0-61 21-56V-40H-21Z" fill="#8bc8dc"/><path d="M-21-47H21" stroke="#5697b5" stroke-width="2"/><path d="M-28-24Q0-19 28-24L29 19Q0 24-29 19Z" fill="#ffca63" stroke="none"/><circle cy="-2" r="11" fill="#fff8df" stroke-width="2"/><path d="M0-21v4M0 13v5M-19-2h4M15-2h4m-33-13 3 3m22 22 3 3m-28 0 3-3m22-22 3-3" fill="none" stroke-width="2"/><path d="M-12 35H12" fill="none"/><path d="M-19-30v9" stroke="#fff" stroke-width="4"/></g>`;
const clock=`<g stroke="#794b45" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"><path d="M-42 42v10m84-10v10" stroke-width="7"/><path d="M-63-34Q-66-46-53-48H53Q66-46 63-33L59 33Q58 45 46 46H-46Q-59 45-60 32Z" fill="#8bc5d8"/><path d="M-53-32Q0-37 53-32L49 30Q0 35-50 30Z" fill="#fff4d1"/><path d="M-38-49v-6h14v6M25-49v-6h14v6" fill="#b6deea"/><path d="M-55-39q25-4 42-3" stroke="#c9eaf0" fill="none" stroke-width="3"/>${clockFace('13:00')}</g>`;

function palmFrond(x,y,dx,dy,bend,width){
  const ex=x+dx,ey=y+dy,cx=x+dx*.48-dy*bend,cy=y+dy*.48+dx*bend;
  let leaves='';
  // Keep the seven original frond directions, but use broad, outlined cartoon leaflets.
  for(let i=1;i<11;i++){
    const t=i/12,u=1-t,px=u*u*x+2*u*t*cx+t*t*ex,py=u*u*y+2*u*t*cy+t*t*ey;
    const tx=2*(u*(cx-x)+t*(ex-cx)),ty=2*(u*(cy-y)+t*(ey-cy)),len=Math.hypot(tx,ty),vx=tx/len,vy=ty/len;
    for(const side of [-1,1]){
      const reach=width*1.12*Math.sin(t*Math.PI)**.65,nx=-vy*side,ny=vx*side;
      const tipx=px+nx*reach+vx*reach*.65,tipy=py+ny*reach+vy*reach*.65;
      leaves+=`<path d="M${px-vx*6} ${py-vy*6}Q${px+nx*reach*.85-vx*10} ${py+ny*reach*.85-vy*10} ${tipx} ${tipy}Q${px+nx*reach*.44+vx*11} ${py+ny*reach*.44+vy*11} ${px+vx*7} ${py+vy*7}Z" fill="${side===1?'#9acb72':'#72b47a'}" stroke="#58684e" stroke-width="1.25" stroke-linejoin="round"/>`;
    }
  }
  return `<g>${leaves}<path d="M${x} ${y}Q${cx} ${cy} ${ex} ${ey}" fill="none" stroke="#66734e" stroke-width="2.5" stroke-linecap="round"/></g>`;
}

function coastline(speakerLabel){
  return `<defs>
    <linearGradient id="bvp-sky" x2="0" y2="1"><stop class="bvp-sky-high"/><stop offset="1" class="bvp-sky-low"/></linearGradient>
  </defs>
  <path fill="url(#bvp-sky)" d="M0 0H1000V850H0Z"/>
  <g class="bvp-sun bvp-speaker" data-beach-speaker="sun" role="button" tabindex="0" aria-label="${speakerLabel}" stroke="#b98255" stroke-width="2.7" stroke-linecap="round">
    <path d="M760 92v-11m0 117v11m-53-64h-11m117 0h11m-102-38-8-8m83 83 8 8m-83-8-8 8m83-83 8-8" fill="none"/>
    <circle cx="760" cy="145" r="35" fill="#ffda78"/>
    <g transform="translate(760 140) rotate(-8) scale(.65)">${glasses}</g><path d="M746 158Q761 166 778 153C774 169 755 173 746 158Z" fill="#fff7dc" stroke="#794b45" stroke-width="2"/>
  </g>
  <g class="bvp-clouds" fill="#fff9eb" stroke="#9bbfc4" stroke-width="2.2" stroke-linejoin="round">
    <path d="M92 224C78 224 77 210 89 207 84 193 98 185 111 191 119 177 139 183 142 195 157 190 171 202 165 213 179 217 174 226 163 226Z"/>
    <path class="bvp-cloud-middle" d="M405 197C394 195 396 185 405 182 404 169 420 164 429 173 442 160 459 171 459 181 474 176 487 188 480 196Z"/>
    <path d="M845 278C834 275 835 266 845 263 841 250 856 243 868 250 879 236 901 246 899 261 912 258 925 268 918 278Z"/>
  </g>
  <path d="M0 334C56 314 81 320 111 326 151 318 174 332 212 328 257 325 286 333 329 334Z" fill="#99c8b0" stroke="#69948b" stroke-width="2"/>
  <path d="M0 334H1000V850H0Z" fill="#80c9da"/>
  <path d="M0 435Q190 411 372 436T720 424T1000 433V850H0Z" fill="#a5deE4"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M0 334H1000" stroke="#6e9fae" stroke-width="2.2"/>
    <path d="M279 371q14-8 28 0t28 0m95 24q18-9 36 0t36 0m163-30q13-8 26 0t26 0m111 48q15-8 30 0t30 0M42 439q17-9 34 0t34 0m197 38q16-8 32 0t32 0m133-28q17-8 34 0t34 0" stroke="#e5f7ee" stroke-width="3.4"/>
  </g>
  <!-- Rounded coastal rocks, each with one broad shadow instead of fine texture. -->
  <g stroke="#92725a" stroke-width="2.7" stroke-linejoin="round">
    <path d="M-20 303C-3 277 28 277 42 290 63 274 97 290 101 309 127 303 149 320 149 340 173 336 198 353 199 374 226 381 231 409 212 426 219 449 198 465 174 468 152 492 128 491 106 489 77 510 35 511-20 516Z" fill="#d9c697"/>
    <path d="M-10 342Q20 318 40 345C52 366 36 378 46 401 56 421 77 429 61 448 49 462 25 465-10 471" fill="#c4ad83" stroke="none"/>
    <path d="M112 332Q142 331 149 351C139 370 145 384 164 395 180 406 174 422 151 435 137 453 120 460 103 461 128 427 106 406 115 387 124 368 116 348 112 332Z" fill="#eedab1" stroke="none"/>
    <path d="M-12 306Q10 290 31 303C40 282 60 285 72 303 86 293 108 306 111 319 131 310 151 326 154 342L127 339 106 326 76 325 54 313 20 319Z" fill="#9dc77a"/>
    <path d="M62 369q9 15 5 31m121-4q-12 3-16 17" fill="none" stroke-width="2"/>
  </g>
  <!-- Preserve the cove and its gently winding beach. -->
  <path class="bvp-sand-shape" d="M1000 370C905 389 912 445 802 467S621 467 589 508 469 548 354 555 142 596 0 635V850H1000Z" fill="#ffe4a4"/>
  <path d="M1000 658C901 674 833 711 751 729 648 746 572 721 479 739 360 762 286 805 178 797 103 791 48 816 0 826V850H1000Z" fill="#f9cf87"/>
  <path class="bvp-shore-foam" d="M1000 363C902 381 908 438 800 460S617 460 585 502 465 542 351 549 142 589 0 629" fill="none" stroke="#fff9df" stroke-width="15" stroke-linecap="round"/>
  <path class="bvp-shore-edge" d="M1000 370C905 389 912 445 802 467S621 467 589 508 469 548 354 555 142 596 0 635" fill="none" stroke="#bca377" stroke-width="2.3"/>
  <g fill="none" stroke="#c5a270" stroke-width="2.4" stroke-linecap="round"><path d="m128 698 11-2m37 79 15 2m142 24 11-1m420-5 13 2m86-131 12-2m-460-33 12-2"/></g>
  <g fill="#fff1c4"><ellipse cx="202" cy="739" rx="7" ry="3"/><ellipse cx="750" cy="819" rx="8" ry="3"/><ellipse cx="871" cy="631" rx="6" ry="3"/></g>
  <g class="bvp-palm" transform="translate(68 391)" stroke="#794b45" stroke-width="2.6" stroke-linejoin="round">
    <path d="M-31 204C-24 145-7 63 1-3L15-5C13 72-5 158-9 205Z" fill="#d9ac74"/>
    <path d="M-27 188q8 7 18 5m-14-34q8 7 18 5m-11-34q7 6 17 5m-10-34q7 5 17 5m-10-33q8 5 17 4m-10-33q7 5 17 4" fill="none" stroke="#b9845d" stroke-width="2"/>
    ${palmFrond(7,-3,-133,-71,-.12,26)}${palmFrond(7,-3,-151,30,.3,28)}${palmFrond(7,-3,-70,98,.24,24)}${palmFrond(7,-3,19,-147,-.22,28)}${palmFrond(7,-3,154,-66,-.28,31)}${palmFrond(7,-3,167,61,-.3,32)}${palmFrond(7,-3,57,133,-.28,26)}
    <ellipse cx="1" cy="9" rx="10" ry="13" fill="#bc8c5b" transform="rotate(22 1 9)"/><ellipse cx="17" cy="11" rx="9" ry="12" fill="#d2a16b" transform="rotate(-16 17 11)"/>
  </g>
  <g transform="translate(960 810)" stroke="#68704e" stroke-width="2.5" stroke-linejoin="round">
    <path d="M0 42C-3 7-10-19-24-42-27-23-16-3-3 8M0 42C8 14 20-11 41-28 42-8 19 12 7 16M0 42C-17 17-34 9-53 8-46 28-23 35-5 33" fill="#9cc87c"/>
  </g>
  <g class="bvp-shell" transform="translate(212 769) rotate(-16)" fill="#a2dde2" stroke="#794b45" stroke-width="2" stroke-linejoin="round">
    <path d="M-16 8C-27 1-28-11-20-13-19-25-8-25-4-17 0-31 12-25 12-15 23-20 28-8 19 2L6 13Z"/><path d="M6 13-20-13M6 13-4-17M6 13 12-15M6 13 22-4" fill="none" stroke-width="1.5"/>
  </g>
  <g fill="none" stroke="#6b7770" stroke-width="2.2" stroke-linecap="round"><path d="M602 267q7-8 14 0 7-8 14 0m30-22q5-6 10 0 5-6 10 0"/></g>`;
}

function vasya(speakerLabel){
  // Original SVG cartoon after the author's new style reference: round contours,
  // oversized smiling face, arms behind the head and a reclining fabric lounger.
  return `<ellipse cx="555" cy="760" rx="175" ry="27" fill="#9b7953" opacity=".18"/>

    <g transform="translate(380 450)" stroke="#794b45" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">
      <!-- The frame and its three grounded supports share the seat's perspective. -->
      <path d="m27 261-5 57 8 2 9-54M110 297l-3 40 8 1 9-38M264 201l-5 103 9 1 11-105" fill="#cf8d59"/>
      <path d="M238 12Q241 8 247 11L338 40Q345 43 342 52L271 208 115 306 24 268 25 259 174 174Z" fill="#688fbd"/>
      <path d="M241 14 335 44 265 202 111 296 28 261 179 178Z" fill="#c9e2f9"/>
      <path d="M179 178 265 202M28 261l83 35 154-94M111 296v10" fill="none"/>
      <!-- A quiet blue cast shadow makes the resting body touch the fabric. -->
      <path d="M241 71C273 73 290 102 283 130L243 172 220 221 181 254 113 291 72 273 150 224 174 185 205 126Z" fill="#8ab5e7" stroke="none"/>
      <g class="bvp-vasya bvp-speaker" data-beach-speaker="vasya" role="button" tabindex="0" aria-label="${speakerLabel}">
        <!-- Both arms curve behind the head; their hands disappear into the hair. -->
        <path class="bvp-skin" d="M212 143C190 135 172 119 169 102 165 86 174 73 189 67 199 63 212 64 219 70L216 83C204 79 193 83 191 92 189 103 203 115 220 121Z"/>
        <path class="bvp-skin" d="M251 133C270 123 282 112 280 100 279 91 272 83 267 78 260 73 262 65 269 66 286 72 302 91 301 107 301 127 283 145 262 152Z"/>
        <!-- Far leg is visibly offset from the near leg, with soft ankles and feet. -->
        <path class="bvp-skin" d="M152 220 176 237C155 250 133 261 112 265L86 266C78 267 74 262 68 259L49 250Q43 246 46 241C49 236 59 240 65 242L83 246Q91 246 98 242L139 217Z"/>
        <path class="bvp-skin" d="M178 235 198 247C180 264 158 278 136 286L116 293C111 295 112 302 105 305 97 309 90 303 84 301L58 288C52 285 50 279 54 275 59 270 70 276 78 277L95 281Q101 283 108 278L153 241Z"/>
        <!-- A relaxed belly and neck, rather than a stick torso or assembled rectangles. -->
        <path class="bvp-skin" d="M222 130 248 137 247 146Q255 145 263 144C248 164 230 182 220 204L212 223Q185 225 157 203C165 182 178 161 193 147L209 133 221 142Z"/>
        <path class="bvp-skin-shade" d="M253 149C239 172 220 188 216 210L211 219 197 217C212 205 213 183 226 166Z" stroke="none"/>
        <path d="M158 200Q181 218 214 217L208 236Q201 254 183 264L161 252 167 237Q156 242 146 246L125 226Z" fill="#f36862"/>
        <path d="M129 226 145 242Q156 238 167 233M167 233l-5 19 21 12Q200 253 208 236" fill="none" stroke="#b64a48" stroke-width="2"/>
        <path d="M166 250 184 257Q200 248 205 237" fill="none" stroke="#da514e" stroke-width="5"/>
        <g class="bvp-body-details" fill="#986550" stroke="none"><ellipse cx="204" cy="158" rx="1.9" ry="1.5" transform="rotate(18 204 158)"/><ellipse cx="231" cy="168" rx="1.9" ry="1.5" transform="rotate(18 231 168)"/><path d="M193 192q-3 2-1 5" stroke="#986550" stroke-width="1.8" fill="none"/></g><g class="bvp-worn-shirt"><path d="M207 130 219 140Q233 151 247 140L259 133 279 146 266 165 252 156C236 173 223 195 216 217Q184 222 157 202C165 182 177 160 190 148L177 137 191 121Z" fill="#acd8cc"/><path d="M219 140Q233 154 247 140M166 197q24 16 44 12m-30-53 7-9m62 13 3-4" stroke="#649d94" stroke-width="2" fill="none"/></g>
        <!-- Round cheek, tiny ear, warm curls and a broad, unforced smile. -->
        <path class="bvp-skin" d="M198 81C202 61 225 56 248 65 267 70 278 85 276 103 287 98 291 109 285 117Q282 124 273 124C263 142 248 149 230 143 210 139 196 125 193 108 190 96 192 86 198 81Z"/>
        <path class="bvp-skin-shade" d="M267 123Q256 142 235 143C252 149 267 139 273 124Z" stroke="none"/>
        <path class="bvp-hair" d="M196 88Q184 86 190 76C179 73 184 62 193 62 190 53 200 46 211 49 219 39 233 43 241 49 253 43 267 50 270 59 284 60 289 72 286 81 296 89 287 101 278 105L272 93Q259 96 254 86C242 91 235 85 231 79 219 85 213 79 209 75Z" fill="#f6c363"/>
        <path d="M206 57q8-7 17-1m27 4q9-3 15 5" stroke="#ffe3a3" stroke-width="3" fill="none"/>
        <g class="bvp-bare-eyes" fill="none" stroke-width="2.2"><path d="M209 102q6-7 12 1m21 7q6-7 12 0"/></g><g class="bvp-worn-glasses" transform="translate(236 104) rotate(12)">${glasses}</g>
        <path d="M224 123Q235 131 246 126C243 142 226 142 224 123Z" fill="#e993a0" stroke-width="2"/>
        <path d="M278 108q-6-2-6 5l4-1" fill="none" stroke-width="1.8"/>
        <ellipse cx="209" cy="117" rx="7" ry="3.4" fill="#f3a292" opacity=".7" stroke="none"/>
        <ellipse cx="260" cy="125" rx="6" ry="3" fill="#f3a292" opacity=".7" stroke="none"/>
        <g class="bvp-cream-marks" fill="none" stroke="#fffdf0" stroke-width="5" stroke-linecap="round">
          <path d="M205 120l7 2M180 102l3 7M284 106l-2 7M112 257l9-4"/><path class="bvp-cream-torso" d="M189 189l9 4"/>
        </g>
      </g>
    </g>
    <g data-beach-speaker="vasya" class="bvp-worn-cap" transform="translate(621 515) rotate(15) scale(.88)">${cap}</g><g class="bvp-overhead-parasol" transform="translate(575 655) scale(1.8)">${parasolArtwork(73)}</g>`;
}

export function beachProtectionMarkup(c,common){
  const en=(c.mediaLocale||getLocale())==='en';
  const t=en?{
    headline:'Sun, sea, beach',question:'What could go wrong?',
    cream:'Apply sunscreen to Vasya',cap:'Put the cap on Vasya',umbrella:'Move the parasol over Vasya',clock:'Move beach time to the evening',glasses:'Put the sunglasses on Vasya',shirt:'Put the T-shirt on Vasya',
    sun:'Talk to the sun',vasya:'Talk to Vasya',
    hints:{cream:'Help silly Vasya',glasses:'Protect your eyes',shirt:'Protect your skin',cap:'Protect your head',clock:'Go out at a safe time',umbrella:'Stay in the shade'},
    alt:'A cartoon beach. Help Vasya put on protection, or click Vasya and the sun to hear what they say.'
  }:{
    headline:'Солнце, море, пляж',question:'Что может пойти не так?',
    cream:'Намазать Васю солнцезащитным кремом',cap:'Надеть кепку на Васю',umbrella:'Поставить зонт над Васей',clock:'Перевести пляжные часы на вечер',glasses:'Надеть солнечные очки на Васю',shirt:'Надеть футболку на Васю',
    sun:'Поговорить с солнцем',vasya:'Поговорить с Васей',
    hints:{cream:'Помоги глупому Васе',glasses:'защити глаза',shirt:'защити кожу',cap:'защити голову',clock:'выходи в безопасное время',umbrella:'оставайся в теньке'},
    alt:'Мультяшный пляж. Помогите Васе надеть защитные вещи или нажмите на Васю и солнце, чтобы услышать их реплики.'
  };
  const item=(id,x,y,art)=>`<g class="bvp-object bvp-object-${id}" data-beach-item="${id}" data-beach-x="${x}" data-beach-y="${y}" data-beach-hint="${t.hints[id]}" transform="translate(${x} ${y})" role="button" tabindex="0" aria-label="${t[id]}" aria-pressed="false"><title>${t.hints[id]}</title><ellipse class="bvp-object-shadow" cy="${id==='glasses'?25:49}" rx="45" ry="9" fill="#98754b" opacity=".2"/><circle class="bvp-hit" r="67" fill="transparent"/><g class="bvp-object-art">${art}</g><circle class="bvp-focus" r="66" fill="none" stroke="#173e46" stroke-width="3"/></g>`;
  return `<div class="bvp-beach" data-beach-locale="${en?'en':'ru'}">
    <header class="bvp-heading"><h3>${t.headline}</h3><p>${t.question}</p></header>
    <div class="bvp-stage"><svg class="bvp-world" viewBox="0 0 1000 850" role="group" aria-label="${t.alt}">
      <g class="bvp-coast-layout">${coastline(t.sun)}</g><g class="bvp-person-layout"><ellipse class="bvp-parasol-shadow" cx="585" cy="690" rx="155" ry="78" fill="#3c675a" opacity="0"/>${vasya(t.vasya)}</g>
      ${item('umbrella',745,512,parasol)}
      ${item('cap',290,704,cap)}
      ${item('cream',800,750,bottle)}
      ${item('clock',285,580,clock)}
      ${item('glasses',360,795,glasses)}
      ${item('shirt',420,625,shirt)}
    </svg></div>
    <div class="bvp-hint" data-hint-item="cream" aria-hidden="true" hidden>
      <p class="bvp-prompt">${t.hints.cream}</p>
      <svg class="bvp-finger" viewBox="0 0 64 80" fill="none">
        <ellipse cx="36" cy="72" rx="20" ry="4" fill="#936e4a" opacity=".16"/>
        <circle class="bvp-finger-ring" cx="22" cy="9" r="8" stroke="#fffaf1" stroke-width="3"/>
        <path d="M23 40 17 31C13 25 8 28 10 34L21 55Q24 60 24 67L48 68Q56 59 56 47V33C56 27 49 26 47 31V27C47 21 40 20 38 25V23C38 17 31 17 29 22L28 9C28 1 19 1 19 9Z" fill="#fff5e3" stroke="#795347" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23 8v10m6 13v7m9-11v10m9-5v7M23 66l26 1-1 8-25-1Z" stroke="#bd9983" stroke-width="1.5" stroke-linecap="round" fill="#d3e9e9"/>
      </svg>
    </div>
    <div class="bvp-dialogue" role="status" aria-live="polite" hidden></div>
    <p class="bvp-status" role="status" aria-live="polite"></p>
  </div>`;
}

export function mountBeachProtection(scene,c,{signal,isActive,route}){
  const root=scene.querySelector('.bvp-beach');
  if(!root)return;
  const en=root.dataset.beachLocale==='en',applied=new Set();
  const items=[...root.querySelectorAll('[data-beach-item]')];
  const hint=root.querySelector('.bvp-hint'),caption=hint.querySelector('.bvp-prompt');
  const bubble=root.querySelector('.bvp-dialogue'),world=root.querySelector('.bvp-world');
  const headings=[...root.querySelectorAll('.bvp-heading h3,.bvp-heading p')].map(node=>({node,text:node.textContent}));
  const sun=root.querySelector('.bvp-sun');
  const sunLayout=document.createElementNS('http://www.w3.org/2000/svg','g');
  // Keep the sun behind clouds, the horizon and water, including at sunset.
  sunLayout.append(sun);root.querySelector('.bvp-coast-layout').insertBefore(sunLayout,root.querySelector('.bvp-clouds'));
  const dialog=document.querySelector('#project-dialog');
  const messages=en?{cream:'Sunscreen applied.',cap:'The cap is on.',umbrella:'Vasya is in the shade.',clock:'The clock now reads 18:30. Evening on the beach.',glasses:'The sunglasses are on.',shirt:'The T-shirt is on.'}:{cream:'Крем нанесён.',cap:'Кепка на голове.',umbrella:'Вася в тени.',clock:'На часах 18:30. На пляже вечер.',glasses:'Очки надеты.',shirt:'Футболка надета.'};
  const lines=en?{
    sun:['Hey, buddy!','Lovely weather today!','Just the time for some sunbathing!','What, don’t you trust me?','The sun is a person’s best friend.','Something smells roasted.','I love a barbecue. How about you?'],
    vasya:['What a lovely day!','Coming back from holiday without a tan is bad luck.','Just the time to lie in the sun.','Great weather today!','If only I didn’t have to leave.','I’ll go swimming later.','Maybe I should buy some corn on the cob?']
  }:{
    sun:['Эй, дружище!','Хорошая погодка сегодня','Самое время позагорать','Ты что, мне не доверяешь?','Солнце — лучший друг человека','Пахнет жареным','Я обожаю барбекю, а ты?'],
    vasya:['Хороший денёк','Приехать из отпуска без загара — плохая примета','Самое время полежать на солнышке','Отличная погода сегодня','Эх, вот бы не уезжать','Потом пойду купаться','Может варёной кукурузы купить?']
  };
  const counters={sun:0,vasya:0};
  let hintTarget=items.find(item=>item.dataset.beachItem==='cream');
  let idleTimer=0,bubbleTimer=0,alignFrame=0,interacted=false,wasActive=false;
  const active=()=>!signal.aborted&&!document.hidden&&!dialog?.open&&isActive();
  const alignViewport=()=>{
    cancelAnimationFrame(alignFrame);
    const align=()=>{
      if(signal.aborted||document.hidden||dialog?.open)return;
      const r=root.getBoundingClientRect();
      if(r.bottom>0&&r.top<innerHeight&&r.height<=innerHeight+1&&Math.abs(r.top)>.75)window.scrollTo({top:scrollY+r.top,behavior:'instant'});
    };
    alignFrame=requestAnimationFrame(()=>{align();alignFrame=requestAnimationFrame(align);});
  };
  const remaining=()=>['cream','glasses','shirt','cap','clock','umbrella'].map(id=>items.find(item=>item.dataset.beachItem===id)).filter(item=>!applied.has(item.dataset.beachItem));
  const clearIdle=()=>{clearTimeout(idleTimer);idleTimer=0;};
  const shorePaths=[...root.querySelectorAll('.bvp-sand-shape,.bvp-shore-foam,.bvp-shore-edge')].map(node=>({node,d:node.getAttribute('d')}));
  const layout=()=>{
    const {width:w,height:h}=root.getBoundingClientRect(),portrait=w/h<.9;
    for(const {node,text} of headings)paintBeachText(node,text,w*(w<=750?.72:.78));
    world.setAttribute('viewBox',`0 0 ${w} ${h}`);
    root.querySelector('.bvp-coast-layout').setAttribute('transform',`scale(${w/1000} ${h/850})`);
    const palmScale=Math.min(h/850,w/650);
    root.querySelector('.bvp-palm').setAttribute('transform',`translate(68 ${(h*(portrait ? .62 : .76)-205*palmScale)/(h/850)}) scale(${palmScale/(w/1000)} ${palmScale/(h/850)})`);
    for(const {node,d} of shorePaths){const shoreline='M1000 370C885 374 801 393 695 404S484 411 381 414 147 428 0 447';node.setAttribute('d',portrait?shoreline+(node.classList.contains('bvp-sand-shape')?'V850H1000Z':''):d);}
    root.querySelector('.bvp-shell').setAttribute('transform',portrait?`translate(80 790) rotate(-16) scale(${Math.min(.65,w/550,h/850)/(w/1000)} ${Math.min(.65,w/550,h/850)/(h/850)})`:'translate(212 769) rotate(-16)');
    const personScale=Math.min(w*.62/350,h*.52/350);
    root.querySelector('.bvp-person-layout').setAttribute('transform',`translate(${w*.54-560*personScale} ${h*.89-788*personScale}) scale(${personScale})`);
    const propScale=Math.min(.95,Math.max(.6,Math.min(w/600,h/800)));
    const positions=portrait?{umbrella:[.80,.54],clock:[.22,.59],shirt:[.33,.70],cap:[.14,.80],glasses:[.23,.92],cream:[.88,.87]}:{umbrella:[.82,.59],clock:[.30,.64],shirt:[.40,.69],cap:[.28,.82],glasses:[.39,.91],cream:[.82,.84]};
    for(const item of items){const [x,y]=positions[item.dataset.beachItem];item.setAttribute('transform',`translate(${w*x} ${h*y}) scale(${propScale})`);}
    const sunScale=Math.max(.6,Math.min(1.15,w/950,h/750));
    root.style.setProperty('--bvp-sunset-y',`${h*.19/sunScale}px`);
    root.style.setProperty('--bvp-sunset-x',`${-Math.min(370,w*.32/sunScale)}px`);
    sunLayout.setAttribute('transform',`scale(${1000/w} ${850/h}) translate(${w*.82-760*sunScale} ${h*.19-145*sunScale}) scale(${sunScale})`);
  };
  const placeHint=()=>{
    if(hint.hidden)return;
    paintBeachText(caption,caption.dataset.beachText||caption.textContent,root.clientWidth<=750?158:213);
    const item=items.find(item=>item.dataset.beachItem===hint.dataset.hintItem);
    const r=root.getBoundingClientRect(),screenPoint=new DOMPoint(0,0).matrixTransform(item.getScreenCTM());
    const p={x:screenPoint.x-r.left,y:screenPoint.y-r.top};
    hint.style.left=`${p.x}px`;hint.style.top=`${Math.min(p.y-9,r.height-72)}px`;
    const size=caption.getBoundingClientRect(),w=size.width,h=size.height;
    const art=item.querySelector('.bvp-object-art').getBoundingClientRect();
    const box={x:art.left-r.left,y:art.top-r.top,w:art.width,h:art.height};
    const obstacles=remaining().map(other=>{const q=other.querySelector('.bvp-object-art').getBoundingClientRect();return{x:q.left-r.left,y:q.top-r.top,w:q.width,h:q.height};});
    const person=root.querySelector('.bvp-vasya').getBoundingClientRect();
    obstacles.push({x:person.left-r.left,y:person.top-r.top,w:person.width,h:person.height});
    const hand=hint.getBoundingClientRect();
    const handBox={x:hand.left-r.left-10,y:hand.top-r.top-10,w:hand.width+20,h:hand.height+20};
    const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
    const candidates=[
      {x:box.x+box.w/2-w/2,y:box.y-h-16},
      {x:box.x+box.w/2-w/2,y:box.y+box.h+16},
      {x:box.x-w-24,y:box.y+box.h/2-h/2},
      {x:box.x+box.w+16,y:box.y+box.h/2-h/2},
      {x:box.x-w-24,y:box.y-h-12},
      {x:box.x+box.w+12,y:box.y-h-12},
      {x:box.x-w-24,y:box.y+box.h+12},
      {x:box.x+box.w+12,y:box.y+box.h+12}
    ].map(q=>({x:Math.max(12,Math.min(r.width-w-12,q.x)),y:Math.max(12,Math.min(r.height-h-12,q.y)),w,h}));
    const score=q=>(overlap(q,box)+overlap(q,handBox))*100000+obstacles.reduce((sum,o)=>sum+overlap(q,o),0)*1000+Math.hypot(q.x+w/2-p.x,q.y+h/2-p.y);
    const chosen=candidates.sort((a,b)=>score(a)-score(b))[0];
    caption.style.left=`${chosen.x+w/2-p.x+28}px`;
    caption.style.top=`${chosen.y-parseFloat(hint.style.top)}px`;
  };
  const showHint=()=>{
    const item=hintTarget;
    if(!item||!active())return;
    hint.dataset.hintItem=item.dataset.beachItem;caption.dataset.beachText=item.dataset.beachHint;
    hint.hidden=false;placeHint();
  };
  const scheduleHint=()=>{
    clearIdle();
    if(!active()||remaining().length===0)return;
    idleTimer=setTimeout(()=>{idleTimer=0;showHint();},3000);
  };
  const activity=()=>{interacted=true;hint.hidden=true;scheduleHint();};
  const placeBubble=()=>{
    if(bubble.hidden)return;
    paintBeachText(bubble,bubble.dataset.beachText,Math.min(260,root.clientWidth-76));
    const r=root.getBoundingClientRect(),sunBox=sun.querySelector('circle').getBoundingClientRect(),hair=root.querySelector('.bvp-hair').getBoundingClientRect();
    const cap=root.classList.contains('has-cap')?root.querySelector('.bvp-worn-cap').getBoundingClientRect():hair;
    const isSun=bubble.dataset.speaker==='sun',above=!isSun||root.classList.contains('has-clock');
    bubble.dataset.placement=above?'above':'below';
    const p=isSun?{x:(sunBox.left+sunBox.right)/2-r.left,y:(above?sunBox.top:sunBox.bottom)-r.top}:{x:(hair.left+hair.right)/2-r.left,y:Math.min(hair.top,cap.top)-r.top};
    const half=bubble.getBoundingClientRect().width/2;
    const center=Math.max(half+10,Math.min(r.width-half-10,p.x));
    bubble.style.left=`${center}px`;
    bubble.style.setProperty('--tail-x',`${Math.max(22,Math.min(half*2-22,p.x-center+half))}px`);
    const h=bubble.getBoundingClientRect().height;
    bubble.style.top=`${Math.max(10,Math.min(r.height-h-10,above?p.y-h-22:p.y+10))}px`;
  };
  const talk=speaker=>{
    bubble.dataset.speaker=speaker;
    bubble.dataset.beachText=lines[speaker][counters[speaker]++%lines[speaker].length];
    bubble.hidden=false;placeBubble();
    clearTimeout(bubbleTimer);bubbleTimer=setTimeout(()=>{bubble.hidden=true;},10000);
  };
  const apply=target=>{
    const id=target.dataset.beachItem;
    if(applied.has(id))return;
    applied.add(id);root.classList.add(`has-${id}`);
    if(target===hintTarget)hintTarget=remaining()[0];
    target.setAttribute('aria-pressed','true');root.querySelector('.bvp-status').textContent=messages[id];
    if(id==='clock'){root.querySelector('.bvp-clock-digits').outerHTML=clockFace('18:30');target.setAttribute('aria-label',messages.clock);bubble.hidden=true;}
    scheduleHint();
    if(applied.size===items.length)route('speech',target);
  };
  const activate=target=>{
    activity();alignViewport();
    const item=target.closest('[data-beach-item]'),speaker=target.closest('[data-beach-speaker]');
    if(item)apply(item);else if(speaker)talk(speaker.dataset.beachSpeaker);
  };
  root.addEventListener('click',event=>activate(event.target),{signal});
  root.addEventListener('keydown',event=>{
    if(event.key==='Escape'){bubble.hidden=true;return;}
    if(!event.repeat&&(event.key==='Enter'||event.key===' ')&&event.target.closest('[data-beach-item],[data-beach-speaker]')){event.preventDefault();activate(event.target);}
  },{signal});
  root.addEventListener('focusin',event=>{if(event.target.matches(':focus-visible'))alignViewport();},{signal});
  // The hint owns one target until that object is used; hovering and focus never retarget it.
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>{
    const visible=active();root.classList.toggle('is-paused',motion.matches||!visible);
    if(visible===wasActive)return;
    wasActive=visible;
    if(!visible){clearIdle();clearTimeout(bubbleTimer);hint.hidden=true;bubble.hidden=true;}
    else if(interacted)scheduleHint();else showHint();
  };
  const observer=new MutationObserver(sync);
  observer.observe(scene.closest('.portfolio-ad'),{attributes:true,attributeFilter:['class']});
  if(dialog)observer.observe(dialog,{attributes:true,attributeFilter:['open']});
  const resize=new ResizeObserver(()=>{layout();placeHint();placeBubble();});resize.observe(root);
  document.addEventListener('visibilitychange',sync,{signal});motion.addEventListener('change',sync,{signal});
  signal.addEventListener('abort',()=>{observer.disconnect();resize.disconnect();clearIdle();clearTimeout(bubbleTimer);cancelAnimationFrame(alignFrame);},{once:true});
  layout();sync();
}
