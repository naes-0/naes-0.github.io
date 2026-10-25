// Illustrated advertising vignette, not documentation of the original installation.
// Word leaves and the character's little performance are entirely local.
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const words = {
  ru: ['язык','слово','смысл','форма','ветер','память','время','имя','осень','мысль','голос','связь','знак','корень','мир','парадигма'],
  en: ['language','word','meaning','form','wind','memory','time','name','autumn','thought','voice','connection','sign','root','world','paradigm'],
};
const random = n => { const x = Math.sin(n * 74.173 + 7.37) * 43758.5453; return x - Math.floor(x); };

function tree(x, y, scale, seed) {
  // Hand-drawn botanical skeleton. Radius belongs to each junction: a lateral
  // shoot grows out of its parent rather than restarting as a thick capsule.
  const mirror=seed===43?-1:1,tips=[];
  const tapered=nodes=>{
    const samples=[];
    for(let i=0;i<nodes.length-1;i++){
      const p0=nodes[Math.max(0,i-1)],p1=nodes[i],p2=nodes[i+1],p3=nodes[Math.min(nodes.length-1,i+2)];
      for(let k=0;k<14;k++){
        const t=k/14,t2=t*t,t3=t2*t;
        const at=j=>.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3);
        samples.push([at(0),at(1),Math.max(0,p1[2]+(p2[2]-p1[2])*t)]);
      }
    }
    samples.push(nodes.at(-1));
    const left=[],right=[];
    samples.forEach((p,i)=>{
      const before=samples[Math.max(0,i-1)],after=samples[Math.min(samples.length-1,i+1)];
      const dx=after[0]-before[0],dy=after[1]-before[1],d=Math.hypot(dx,dy)||1;
      const r=p[2];
      left.push([p[0]-dy/d*r,p[1]+dx/d*r]);right.push([p[0]+dy/d*r,p[1]-dx/d*r]);
    });
    const coords=pts=>pts.map(p=>p.map(n=>n.toFixed(2)).join(' ')).join('L');
    tips.push([x+nodes.at(-1)[0]*scale*mirror,y+nodes.at(-1)[1]*scale]);
    return `<path d="M${coords(left)}L${coords(right.reverse())}Z" fill="#635c4c"/>`;
  };
  const branches=[
    [[0,5,15],[-6,-57,13],[-5,-122,11],[-12,-188,9],[-7,-247,7],[-20,-303,5],[-12,-359,3],[-20,-408,1.5],[-14,-453,0]],
    [[-6,-133,9],[-35,-176,7],[-66,-210,5],[-91,-253,3.4],[-110,-300,2],[-143,-335,0]],
    [[-65,-209,4.5],[-109,-225,3],[-148,-254,1.7],[-187,-273,0]],
    [[-109,-225,2.4],[-129,-257,1.2],[-131,-287,0]],
    [[-146,-253,1.6],[-175,-252,.8],[-201,-267,0]],
    [[-89,-250,3],[-84,-287,2],[-94,-322,1],[-89,-352,0]],
    [[-110,-300,1.6],[-127,-307,.8],[-153,-331,0]],
    [[-12,-190,7.5],[21,-218,5.7],[46,-250,4.1],[70,-295,2.6],[97,-319,1.5],[119,-357,0]],
    [[44,-248,3.8],[83,-259,2.6],[121,-285,1.4],[149,-324,0]],
    [[82,-258,2],[107,-251,1.2],[137,-262,0]],
    [[120,-284,1.3],[145,-284,.8],[171,-304,0]],
    [[70,-295,2.3],[64,-329,1.4],[74,-362,0]],
    [[96,-318,1.2],[97,-344,.7],[89,-365,0]],
    [[-8,-246,5.7],[-42,-279,4],[-61,-320,2.6],[-66,-362,1.2],[-87,-398,0]],
    [[-60,-319,2.2],[-91,-340,1.2],[-115,-374,0]],
    [[-66,-361,1],[-55,-387,.7],[-58,-414,0]],
    [[-20,-302,4],[8,-329,3],[29,-369,1.7],[31,-404,.8],[47,-439,0]],
    [[28,-369,1.4],[52,-383,.8],[69,-411,0]],
    [[-12,-357,2.8],[-34,-384,1.8],[-42,-425,.8],[-61,-449,0]],
    [[-34,-384,1.2],[-59,-395,.7],[-74,-418,0]],
    [[-20,-408,1.2],[-3,-428,.7],[2,-461,0]],
    [[-5,-116,8],[33,-140,6],[65,-169,4.2],[104,-184,2.7],[138,-209,1.3],[164,-243,0]],
    [[64,-169,3.6],[70,-204,2.3],[88,-233,1.2],[94,-262,0]],
    [[103,-184,2.1],[140,-181,1.3],[174,-195,.7],[198,-216,0]],
    [[138,-208,1.2],[144,-236,.6],[137,-259,0]],
    [[33,-140,3.7],[49,-169,2],[51,-199,.9],[43,-222,0]],
  ];
  let art=branches.map(nodes=>tapered(nodes)).join('');
  art+=`<path d="M-21 6Q-9-4-12-28L8-29Q6-9 24 7L8 2 1-1-8 4Z" fill="#635c4c"/><path d="M-6-13Q-12-72-9-116M-8-144Q-18-185-11-226M-5-164Q17-192 34-221" fill="none" stroke="#b1a185" stroke-width="1.1" opacity=".4"/>`;
  return {art:`<g transform="translate(${x} ${y}) scale(${scale})"><g transform="scale(${mirror} 1)">${art}</g></g>`,tips};
}

function cityArt(locale) {
  const treeOne=tree(390,612,1.13,21),treeTwo=tree(1140,610,.9,43);
  const verge=`<g class="pa-grass-verge"><!-- Roots stay in the verge, behind the straight curb at y610. --><path d="M0 594Q151 589 295 598T578 596T860 588T1126 591T1400 588V621H0Z" fill="#86856a"/><path d="M0 621H1400" fill="none" stroke="#b6ad87" stroke-width="2"/>${Array.from({length:330},(_,i)=>{const x=random(i+30)*1400,y=598+random(i+260)*10,h=4+random(i+480)*19;return `<path d="M${x.toFixed(1)} ${y.toFixed(1)}q${(-3+random(i+89)*6).toFixed(1)} ${(-h*.6).toFixed(1)} ${(-7+random(i+96)*14).toFixed(1)} ${(-h).toFixed(1)}" fill="none" stroke="${['#a69b72','#b5a77a','#6f755b','#c0af80'][i%4]}" stroke-width="${(.7+random(i)*.6).toFixed(1)}"/>`;}).join('')}</g>`;
  const buildings = [
    [35,310,145,292,'#b8b7ac'],[195,288,157,310,'#c8bcb0'],[377,352,148,246,'#b2b6ac'],
    [572,300,148,306,'#c4c3b5'],[751,327,158,275,'#bcb8a9'],[944,277,137,316,'#d0c2ac'],[1097,328,185,270,'#b7b7a8'],[1294,316,149,280,'#c7b9a4'],
  ].map(([x,y,w,h,fill],i)=>{
    let windows='';
    for(let row=0;row<5;row++)for(let col=0;col<3;col++){
      const wx=x+17+col*(w-38)/3,wy=y+32+row*45;
      const arch=i%3===0&&row===0;
      windows+=`<g><path d="M${wx} ${wy+27}v-23${arch?'q9-9 18 0':'h18'}v23z" fill="${(row+col+i)%4===0?'#dfc9a4':'#829395'}"/><path d="M${wx+9} ${wy+3}v24m-9-11h18" stroke="#dcd3c3" stroke-width="2"/><path d="M${wx-3} ${wy+28}h24" stroke="#a39e90" stroke-width="3"/>${i%3===1&&row%2===1?`<path d="M${wx-7} ${wy+22}h32v13h-32zm7 1v11m8-11v11m8-11v11m8-11v11" fill="none" stroke="#818e83" stroke-width="1.2"/>`:''}</g>`;
    }
    return `<g opacity="${.67+i%3*.08}"><path d="M${x} ${y+h}V${y}h${w}v${h}z" fill="${fill}"/><path d="M${x+8} ${y}l15-18h${w-46}l15 18z" fill="#8e9b94"/><path d="M${x+w-38} ${y-9}v-23h12v23" fill="#aaa99a"/><path d="M${x-5} ${y}h${w+10}v9H${x-5}z" fill="#a8aaa1"/><path d="M${x+7} ${y+14}h${w-14}M${x+6} ${y+h-34}h${w-12}" stroke="#ece1cf" stroke-width="3"/>${windows}<path d="M${x+8} ${y+h-32}h${w-16}v32H${x+8}z" fill="#8a9690"/><path d="M${x+w/2} ${y+h-32}v32" stroke="#c8c6b5" stroke-width="3"/></g>`;
  }).join('');
  const ground = Array.from({length:63},(_,i)=>{
    const x=25+random(i+40)*1360,y=645+random(i+110)*180;
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" transform="rotate(${(-30+random(i+85)*60).toFixed(1)} ${x} ${y})" fill="${['#8a5c3c','#aa6337','#ba7b3f','#7a7461','#b59258'][i%5]}" opacity="${.4+random(i+12)*.4}" font-size="${12+random(i+62)*10}" font-family="Georgia,serif">${words[locale][i%16]}</text>`;
  }).join('');
  // Keep neighbouring word leaves legible, especially the longer English ones.
  const wordTips=[];
  [treeOne,treeTwo].forEach((trunk,treeIndex)=>trunk.tips.forEach(([x,y],i)=>{
    if(i%2===0&&!wordTips.some(p=>p.treeIndex===treeIndex&&Math.abs(p.x-x)<100&&Math.abs(p.y-y)<42))wordTips.push({x,y,treeIndex});
  }));
  const hanging=wordTips.map(({x,y,treeIndex},i)=>`<g class="${treeIndex===0?'pa-first-tree':''}"><g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><text class="pa-word ${i%4===0?'pa-word-falling':'pa-word-held'}" text-anchor="middle" dy="-3" style="--word-delay:${(-random(i+50)*17).toFixed(2)}s;--word-turn:${(-15+random(i+2)*30).toFixed(1)}deg;--word-time:${(12+random(i+20)*9).toFixed(2)}s" fill="${['#99512d','#b87932','#857747','#c59646'][i%4]}" font-family="Georgia,serif" font-size="${13+random(i+10)*9}">${words[locale][i%16]}</text></g></g>`).join('');
  return `<svg class="pa-city" viewBox="0 0 1400 850" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
    <linearGradient id="pa-sky" x2=".3" y2="1"><stop stop-color="#b9c9c7"/><stop offset=".55" stop-color="#dedbc9"/><stop offset="1" stop-color="#e7d9b8"/></linearGradient>
    <linearGradient id="pa-paving" x2=".4" y2="1"><stop stop-color="#b8b8a3"/><stop offset="1" stop-color="#8e9c96"/></linearGradient>
    <linearGradient id="pa-mist" x2="0" y2="1"><stop stop-color="#e9dfc9" stop-opacity="0"/><stop offset=".65" stop-color="#e9dfc9" stop-opacity=".55"/><stop offset="1" stop-color="#e9dfc9" stop-opacity="0"/></linearGradient>
    <filter id="pa-grain"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".07"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
  </defs>
  <path d="M0 0h1400v850H0z" fill="url(#pa-sky)"/>
  <g opacity=".24" fill="#f8f0d9"><path d="M-40 170Q170 100 340 161T760 145T1480 113v52Q1170 210 950 177T490 206T-40 209z"/><path d="M-30 235Q140 194 380 236T900 220T1440 226v22Q1070 278 850 252T330 276T-30 267z"/></g>
  <g opacity=".25" fill="#939f99"><path d="M0 485V384h45v-35h38v43h56v-69h34v77h67v-42h70v45h73v-58h89v54h89v-84h27v-18h20v101h84v-51h81v36h46v-87h36v-28h27v111h93v-44h65v52h47v-72h80v64h97v-42h41v34h86v-54h65v42h83v-30h58v123z"/></g>
  ${buildings}<path d="M0 497h1400v149H0z" fill="url(#pa-mist)"/>
  <g fill="none" stroke="#85958a" opacity=".35"><path d="M0 590H1400M0 596H1400" stroke-width="2"/>${Array.from({length:59},(_,i)=>`<path d="M${i*24} 581v27m-3-27h6"/>`).join('')}</g>
  <path d="M0 610H1400V850H0Z" fill="url(#pa-paving)"/>
  ${verge}
  <path d="M0 610H1400V628H0Z" fill="#c7c6b1"/><path d="M0 629H1400" fill="none" stroke="#798b85" stroke-width="2"/>
  <g stroke="#677f79" stroke-opacity=".18" fill="none"><path d="M0 742h1400M0 805h1400M0 680h1400M420 625 70 850M620 624 490 850M820 624 930 850M1020 625 1370 850"/><path d="M0 710h1400M0 774h1400M0 836h1400" stroke="#e0d3b7" stroke-opacity=".3"/></g>
  <g opacity=".35" fill="#e0d7bd"><ellipse cx="605" cy="704" rx="125" ry="7"/><ellipse cx="1090" cy="785" rx="94" ry="9"/><ellipse cx="185" cy="818" rx="165" ry="10"/></g>
  <g stroke="#56615b" stroke-width="5" fill="none"><path d="M870 614V449q0-25 24-25h35M892 423v-18h32v18"/><path d="M889 425h38l-5 27h-25z" fill="#c2baa0" stroke-width="3"/><path d="M852 616h36M862 602h16" stroke-width="7"/></g>
  <g class="pa-bench" stroke-linejoin="round">
    <path d="m985 642 144-3 13 6-149 4z" fill="#53645a" opacity=".15"/>
    <g fill="none" stroke="#526157" stroke-width="4" stroke-linecap="round"><path d="m1000 568 3 42-5 31m102-77 3 43 12 30M1016 611l-1 28m74-31 6 30"/><path d="m1003 603 101-4m-102 13 103-4" stroke-width="3"/></g>
    <g fill="#a18762" stroke="#776b52" stroke-width="1.1"><path d="m992 569 119-4 1 8-119 4z"/><path d="m993 582 119-4 1 8-119 4z"/><path d="m993 597 120-4 8 5-120 4z"/><path d="m1002 604 120-4 8 5-120 4z"/></g>
    <path d="m993 570 117-4m-116 17 117-4m-116 19 117-4m-108 11 116-4" stroke="#d0b18a" stroke-width="1" fill="none"/>
    <g fill="#655f4d"><circle cx="1001" cy="573" r="1"/><circle cx="1103" cy="570" r="1"/><circle cx="1002" cy="586" r="1"/><circle cx="1104" cy="582" r="1"/></g>
  </g>
  <g opacity=".13" fill="#354c44"><ellipse cx="391" cy="620" rx="142" ry="13"/><ellipse cx="1140" cy="617" rx="109" ry="9"/></g>
  ${treeTwo.art}<g class="pa-first-tree">${treeOne.art}</g>${ground}${hanging}
  <g fill="none" stroke="#f7e8c8" stroke-width="1.5" stroke-opacity=".23" class="pa-wind"><path d="M50 300q100-30 200-10m550 50q100-15 190 0M900 715q110-25 220-10M85 530q100-20 190-4"/></g>
  <path d="M0 0h1400v850H0z" fill="transparent" filter="url(#pa-grain)" pointer-events="none"/>
  </svg>`;
}

function characterArt(phrase,en) {
  // One compact profile silhouette, with the neck, shoulder and pelvis aligned.
  return `<svg class="pa-character" viewBox="0 0 300 450" role="group" aria-label="${en?'The passer-by and his paper tissue':'Прохожий с бумажным платочком'}"><defs>
  <linearGradient id="pa-coat" x2="1" y2=".3"><stop stop-color="#91826a"/><stop offset="1" stop-color="#a59477"/></linearGradient>
  <linearGradient id="pa-skin" x2="1"><stop stop-color="#e8ba94"/><stop offset="1" stop-color="#e8ba94"/></linearGradient>
  <linearGradient id="pa-paper" x2=".8" y2="1"><stop stop-color="#fffdf5"/><stop offset=".48" stop-color="#f1eee1"/><stop offset=".5" stop-color="#faf7ed"/><stop offset="1" stop-color="#e7e3d4"/></linearGradient>
  <clipPath id="pa-far-face-clip"><path class="pa-far-face-clip"/></clipPath><clipPath id="pa-paper-clip"><path class="pa-paper-clip"/></clipPath></defs><g aria-hidden="true"><ellipse cx="159" cy="431" rx="58" ry="6" fill="#354c44" opacity=".14"/>
  ${[0,1].map(i=>`<g class="${i?'pa-front-leg':'pa-back-leg'}"><path class="pa-trouser" fill="${i?'#505951':'#3e4842'}"/><path class="pa-trouser-crease" fill="none" stroke="#a2a28e" stroke-opacity=".14" stroke-width="1"/><g class="pa-shoe"><path class="pa-shoe-outline" d="M-8-5Q-1-2 6-5L10 2 26 7Q30 9 29 13L-9 13Z" fill="${i?'#5e4e3b':'#514634'}"/><path class="pa-shoe-sole" d="M-9 13H29" stroke="#c1ac88" stroke-width="2"/></g></g>`).join('')}</g>
  <g class="pa-upper-body"><g aria-hidden="true">
  <!-- Profile construction: neck/rib cage/pelvis share one sagittal axis.
       The long coat hides the hip joint at y230, not a shortened thigh. -->
  <path class="pa-rest-upper" fill="#7f715b"/>
  <path class="pa-coat-body" d="M148 123C132 126 124 138 121 154C116 175 122 193 124 211L119 247 114 286Q130 293 150 290L157 282 162 291Q179 293 190 286L183 246C190 222 190 200 187 179C186 155 180 137 164 128Z" fill="url(#pa-coat)"/>
  <path class="pa-lapel" d="M150 133L141 147 153 163 166 137 172 145 164 170" fill="#b3a186"/>
  <path class="pa-coat-seam" d="M163 166Q174 207 167 245L161 281M126 214Q153 224 186 217" fill="none" stroke="#716650" stroke-width="1.2"/>
  <path d="M168 231l15-4 1 4-15 4Z" fill="#82745e"/>
  <g class="pa-buttons" fill="#665c4a"><circle cx="169" cy="186" r="1.8"/><circle cx="171" cy="213" r="1.8"/><circle cx="167" cy="246" r="1.8"/><circle cx="164" cy="271" r="1.8"/></g>
  <path d="M121 279Q133 284 148 281M169 283l15-2" stroke="#c3b092" stroke-width="1" fill="none" opacity=".5"/>
  <g class="pa-scarf-tail"><path d="M151 123C128 126 111 117 97 121L78 117 67 122 81 128Q116 142 150 135Z" fill="#974c3b"/><path d="M82 125Q115 134 145 130M77 120l-2 6m6-6-2 8m6-6-1 7" fill="none" stroke="#cb8d68" stroke-width="1.2"/></g>
  <g class="pa-rest-arm"><path class="pa-rest-sleeve" fill="#897a62"/><g class="pa-rest-hand"><path d="M-6-6Q1-10 8-5L13 3 8 10-2 8-8 2Z" fill="#e8ba94"/><path d="M0-2l7 6m-11-3 6 5" fill="none" stroke="#bc8b6c" stroke-width="1"/></g></g>
  <g class="pa-working-arm"><path class="pa-sleeve" fill="#a59477"/><path class="pa-sleeve-seam" fill="none" stroke="#c8b393" stroke-opacity=".35" stroke-width="1.2"/><path class="pa-cuff" fill="#8b795f"/></g>
  <g class="pa-head">
  <path d="M151 105L149 125Q156 134 168 127L166 105Z" fill="#d6a17f"/>
  <g class="pa-far-ear" fill="#d77770"><path d="M0-7C-8-9-10 5-2 9Q8 10 11 3Q9-6 0-7Z"/><path d="M-3-3Q-7 0-3 4" fill="none" stroke="#b96a60" stroke-width="1.2"/></g>
  <g class="pa-ear" fill="#d77770"><path d="M0-7C-8-9-10 5-2 9Q8 10 11 3Q9-6 0-7Z"/><path d="M-3-3Q-7 0-3 4" fill="none" stroke="#b96a60" stroke-width="1.2"/></g>
  <path class="pa-face" d="M143 66C142 51 153 43 165 45C179 45 184 56 182 72L185 83 193 91Q195 96 183 97L181 106Q178 114 166 111L152 104Q142 98 141 86Z" fill="#e8ba94"/>
  <path class="pa-hair" d="M144 91C134 85 135 68 138 58C139 44 149 37 162 39Q185 38 185 61L179 67 172 58Q161 63 149 61L149 81Z" fill="#565246"/>
  <path class="pa-near-temple" fill="none" stroke="#4b574c" stroke-width="1.8"/>
  <path class="pa-bridge" fill="none" stroke="#4b574c" stroke-width="1.8"/>
  <path class="pa-far-temple" clip-path="url(#pa-far-face-clip)" fill="none" stroke="#4b574c" stroke-width="1.8"/>
  <path class="pa-glasses" d="M146 79L164 79M164 77Q173 73 183 77L182 86Q173 91 165 85Z" fill="none" stroke="#4b574c" stroke-width="1.8"/>
  <circle class="pa-eye" cx="174" cy="81" r="1.3" fill="#524f40"/>
  <circle clip-path="url(#pa-far-face-clip)" class="pa-far-eye" cx="150" cy="81" r="0" fill="#524f40"/><path clip-path="url(#pa-far-face-clip)" class="pa-far-glasses" fill="none" stroke="#4b574c" stroke-width="1.8"/><path class="pa-brow" d="M166 72Q171 68 178 74" fill="none" stroke="#665341" stroke-width="1.5"/><path clip-path="url(#pa-far-face-clip)" class="pa-far-brow" fill="none" stroke="#665341" stroke-width="1.5"/><path class="pa-mouth" d="M175 105Q179 100 183 105" stroke="#946b56" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <ellipse class="pa-nose" cx="187" cy="92" rx="4.5" ry="3.7" fill="#c96b65"/>
  <path d="M147 119Q157 124 170 119L175 134Q157 144 141 133Z" fill="#974c3b"/><path d="M145 128Q159 136 171 128" fill="none" stroke="#cb8d68" stroke-width="1.5"/>
  </g>
  </g>
  <g class="pa-tissue-rig"><g class="pa-hand"><path class="pa-grip" d="M-3-8q9-4 13 3l1 14q-1 7-6 6L1 4q-6 1-7-3L-7-3q-1-4 4-5z" fill="url(#pa-skin)" stroke="#a57b61" stroke-width="1"/><path class="pa-knuckles" d="m3-2 2 9M0 0l-3-1" stroke="#bc8b6c" stroke-width="1" fill="none"/></g><g class="pa-tissue" role="button" tabindex="0" aria-label="${escape(phrase)}"><title>${en?'Read about Paradigm':'Подробнее о Парадигме'}</title>
  <path class="pa-paper-shape" d="M0 0-74-3-153 1-230-2-314 3-310 61-315 117-310 187-238 184-157 190-80 186-1 190-3 120 1 60Z" fill="url(#pa-paper)" stroke="#c4beac" stroke-width=".8"/>
  <g clip-path="url(#pa-paper-clip)"><g class="pa-paper-flat"><path d="m-158 1 2 187M-312 94q149-10 312 2" fill="none" stroke="#c4beac" stroke-opacity=".35" stroke-width="1"/>
  <path d="m-157 2 4 183m-156-93q154-7 308 3" fill="none" stroke="#fffdf4" stroke-opacity=".7" stroke-width="1.5"/>
  <foreignObject class="pa-paper-words" x="-289" y="19" width="264" height="154"><div xmlns="http://www.w3.org/1999/xhtml" class="pa-tissue-copy">${escape(phrase)}</div></foreignObject><text class="pa-doctor-signature" x="-17" y="177" text-anchor="end">${en?'doctor physician':'доктор врач'}</text></g><path class="pa-crumple-creases" fill="none" stroke="#b9b2a1" stroke-width="0"/></g>
  </g><g class="pa-fingers-front" aria-hidden="true" pointer-events="none"><path class="pa-front-thumb" fill="#e8ba94" stroke="#a57b61"/></g></g>
  <g class="pa-sneeze-puff" aria-hidden="true" fill="#fff9e8" opacity="0"><ellipse cx="211" cy="100" rx="18" ry="6"/><ellipse cx="230" cy="96" rx="12" ry="5"/></g>
  </g></svg>`;
}

export function paradigmAutumnMarkup(c,common) {
  const locale=c.mediaLocale || (typeof document!=='undefined'&&document.documentElement.lang.startsWith('en')?'en':'ru');
  const en=locale==='en';
  const phrase=en?'Paradigm on the tongue, twice a day, to support your immune system':'Парадигма на язык два раза в день для укрепления иммунитета';
  return `<div class="pa-autumn" data-pa-locale="${locale}">${cityArt(locale)}<div class="pa-walker">${characterArt(phrase,en)}</div><a class="ad-skip" href="#project/paradigm">${common.skipAd}<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 5v14l11-7Z"/><path d="M18 5h2v14h-2Z"/></svg></a><span class="sr-only">${escape(en?'An autumn street. A shivering passer-by with folded arms blows his nose, turns towards you, shows a paper tissue, brings it closer and crumples it in his fist.':'Осенняя улица. Дрожащий прохожий со сложенными на груди руками сморкается, поворачивается к зрителю, показывает платочек с текстом, приближает его и сминает в кулак.')}</span></div>`;
}

const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=n=>{n=Math.max(0,Math.min(1,n));return n*n*(3-2*n);};
const point=(x,y)=>({x,y});
const asPath=p=>`${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
function joint(a,b,l1,l2,bend) {
  const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(.01,Math.hypot(dx,dy));
  const along=Math.min(l1,(l1*l1-l2*l2+d*d)/(2*d));
  const h=Math.sqrt(Math.max(0,l1*l1-along*along));
  return point(a.x+dx/d*along-dy/d*h*bend,a.y+dy/d*along+dx/d*h*bend);
}
function limbPath(a,b,c,widths,roundShoulder=false) {
  const norm=(p,q)=>{const d=Math.hypot(q.x-p.x,q.y-p.y)||1;return point(-(q.y-p.y)/d,(q.x-p.x)/d);};
  const n1=norm(a,b),n2=norm(b,c),d=Math.hypot(n1.x+n2.x,n1.y+n2.y)||1;
  const ns=[n1,point((n1.x+n2.x)/d,(n1.y+n2.y)/d),n2];
  const edge=(p,i,sign)=>point(p.x+ns[i].x*widths[i]*sign,p.y+ns[i].y*widths[i]*sign);
  const left=[a,b,c].map((p,i)=>edge(p,i,1)),right=[a,b,c].map((p,i)=>edge(p,i,-1));
  const before=(a,b)=>point(lerp(a.x,b.x,.72),lerp(a.y,b.y,.72));
  const after=(b,c)=>point(lerp(b.x,c.x,.28),lerp(b.y,c.y,.28));
  const length=Math.hypot(b.x-a.x,b.y-a.y)||1;
  const cap=point(a.x-(b.x-a.x)/length*widths[0],a.y-(b.y-a.y)/length*widths[0]);
  return `M${asPath(left[0])}L${asPath(before(left[0],left[1]))}Q${asPath(left[1])} ${asPath(after(left[1],left[2]))}L${asPath(left[2])}L${asPath(right[2])}L${asPath(after(right[1],right[2]))}Q${asPath(right[1])} ${asPath(before(right[0],right[1]))}L${asPath(right[0])}${roundShoulder?`Q${asPath(cap)} ${asPath(left[0])}`:''}Z`;
}

// A side-view construction shared by rendering and the kinematic checks.
// Units: crown ≈64, chin ≈114, hip 230, knee ≈324, sole 426.
export function paradigmLegPose(cycle,blend=1) {
  const stride=56,stanceShare=.62;
  const steps=[0,1].map(i=>{
    const p=((cycle+i*.5)%1+1)%1,stance=p<stanceShare;
    const swing=Math.max(0,(p-stanceShare)/(1-stanceShare));
    const u=swing,u2=u*u,u3=u2*u;
    // At takeoff/landing the foot keeps moving back at the support velocity.
    const tangent=-stride*(1-stanceShare)/stanceShare;
    const recovered=(2*u3-3*u2+1)*(-stride/2)+(u3-2*u2+u)*tangent+(-2*u3+3*u2)*(stride/2)+(u3-u2)*tangent;
    const fx=stance?lerp(stride/2,-stride/2,p/stanceShare):recovered;
    const lift=stance?0:Math.pow(Math.sin(swing*Math.PI),1.4)*24;
    const footTilt=stance?0:-Math.sin(swing*Math.PI)*18*blend;
    const angle=footTilt*Math.PI/180;
    const soleCorrection=Math.max(0,...[-9,29].map(x=>x*Math.sin(angle)+13*Math.cos(angle)-13));
    return {stance,fx,lift,footTilt,soleCorrection};
  });
  // The just-released leg still constrains reach at toe-off. Dropping it from
  // the support calculation instantly made the pelvis jump and stretched it.
  const pelvisY=lerp(230,Math.max(...steps.map(step=>413-step.lift-step.soleCorrection-Math.sqrt(182**2-step.fx**2))),blend);
  return {pelvisY,legs:steps.map(({stance,fx,lift,footTilt,soleCorrection},i)=>{
    const hip=point(i===0?148:155,pelvisY);
    const ankle=point(hip.x+lerp(i===0?-2:3,fx,blend),413-lift*blend-soleCorrection);
    const bent=joint(hip,ankle,94,89,-1);
    const knee=point(lerp(hip.x+(i===0?-1:1),bent.x,blend),lerp(324,bent.y,blend));
    return {hip,knee,ankle,stance,footTilt,soleCorrection};
  })};
}

// One clock for the physical gag. No opacity is involved in paper or ink.
export function paradigmPerformance(act) {
  const raise=smooth(act/1.15);
  // One linear stroke: no late acceleration or eased approach to the viewer.
  const reach=Math.max(0,Math.min(1,(act-3.65)/.4));
  const closing=smooth((act-8.5)/.85),pull=smooth((act-9.35)/.33);
  const turn=smooth((act-3.65)/.4)*(1-smooth((act-9.35)/.65));
  const unfold=reach;
  const recovery=smooth((act-2.2)/.4)*(1-pull);
  const breath=Math.sin(Math.PI*Math.max(0,Math.min(1,(act-2.25)/1.4)))**2;
  const crumple=1-unfold+unfold*closing;
  const sneeze=smooth((act-1.2)/.2)*(1-smooth((act-2.05)/.2));
  return {raise,reach,turn,unfold,recovery,breath,fly:reach,closing,crumple,pull,sneeze,zoom:1+1.65*reach*(1-pull)};
}

// Three complete drawings share anatomical sides with the shoulder girdle.
// The near side opens toward screen-left; features stay attached to the skull.
const headKeys=[
  {ear:[145,87],far:[176,87],eye:[173,81],farEye:[184,81],rim:[165,76,181,87],farRim:[183,77,186,86],nose:188,mouth:[180,105],temple:[147,79,165,79]},
  {ear:[139,87],far:[181,87],eye:[160,81],farEye:[179,81],rim:[150,75,170,87],farRim:[175,76,184,87],nose:177,mouth:[171,105],temple:[140,79,150,79]},
  {ear:[136,87],far:[184,87],eye:[149,81],farEye:[171,81],rim:[139,75,159,87],farRim:[161,75,181,87],nose:160,mouth:[160,106],temple:[137,79,139,79]},
];
export function paradigmHeadTurn(turn) {
  const i=turn<.5?0:1,t=Math.min(1,Math.max(0,turn*2-i));
  const a=headKeys[i],b=headKeys[i+1];
  const values=k=>a[k].map((n,j)=>lerp(n,b[k][j],t));
  const pos=k=>{const v=values(k);return point(...v);};
  const rim=k=>{const [l,top,r,bottom]=values(k);return [[l+2,top],[r-2,top],[r,top+2],[r-1,bottom-1],[r-3,bottom],[l+2,bottom],[l,bottom-2],[l,top+2]];};
  const temple=values('temple');
  const meridian=lerp(a.nose,b.nose,t);
  return {nearEar:pos('ear'),farEar:pos('far'),nearEye:pos('eye'),farEye:pos('farEye'),
    nearRim:rim('rim'),farRim:rim('farRim'),meridian,mouth:pos('mouth'),
    nearTemple:[point(temple[0],temple[1]),point(temple[2],temple[3])],
    farTemple:[point(values('farRim')[2],79),point(values('far')[0],79)],
    bridge:[point(values('rim')[2],79),point(meridian,77),point(values('farRim')[0],79)]};
}

// Shoulder sockets, elbows and wrists are authored as linked poses, rather
// than blending opposite IK solutions (which swung the far elbow behind him).
export function paradigmArmPose(turn,raise,reach,pull,recovery=0) {
  const mix=(a,b,t)=>point(lerp(a.x,b.x,t),lerp(a.y,b.y,t));
  const shoulder=mix(point(143,148),point(119,149),turn);
  const farShoulder=mix(point(166,148),point(185,149),turn);
  const crossed=point(174,169),nose=point(183,104),close=point(170,170);
  const approach=mix(mix(nose,point(178,140),recovery),close,reach);
  let wrist=mix(crossed,approach,raise);
  wrist=mix(wrist,crossed,pull);
  const folded=mix(point(133,201),point(112,202),turn);
  const lifted=mix(mix(point(167,155),point(162,175),recovery),point(112,169),turn);
  let elbow=mix(folded,lifted,raise*(1-pull));
  elbow=mix(elbow,point(131,199),reach*(1-pull));
  const farElbow=mix(point(182,201),point(195,204),turn);
  const farWrist=mix(point(145,176),point(143,177),turn);
  return {shoulder,elbow,wrist,farShoulder,farElbow,farWrist};
}

function morphPath(a,b,t) {
  const numbers=b.match(/-?\d*\.?\d+/g).map(Number);let i=0;
  return a.replace(/-?\d*\.?\d+/g,n=>lerp(Number(n),numbers[i++],t).toFixed(3));
}
const paperOutline=[[0,0],[-74,-3],[-153,1],[-230,-2],[-314,3],[-310,61],[-315,117],[-310,187],[-238,184],[-157,190],[-80,186],[-1,190],[-3,120],[1,60]];
const openGrip=[[-3,-8],[3,-10],[9,-7],[11,-1],[11,10],[8,16],[4,16],[1,10],[0,4],[-5,3],[-8,0],[-8,-3],[-6,-4],[-6,-7],[-4,-8],[-3,-8]];
const closedGrip=[[-25,-14],[-18,-22],[-7,-25],[5,-23],[17,-19],[25,-10],[26,0],[20,17],[9,25],[-5,27],[-21,20],[-30,9],[-29,-1],[-21,-5],[-16,1],[-20,-9]];
function roundedPolygon(points) {
  const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
  let d=`M${mid(points.at(-1),points[0]).join(' ')}`;
  points.forEach((p,i)=>{d+=`Q${p.join(' ')} ${mid(p,points[(i+1)%points.length]).join(' ')}`;});
  return d+'Z';
}

export function mountParadigmAutumn(scene,c,{signal,isActive,route}) {
  const stage=scene.querySelector('.pa-autumn'),article=scene.closest('.portfolio-ad');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const walker=scene.querySelector('.pa-walker'),body=scene.querySelector('.pa-upper-body');
  const head=scene.querySelector('.pa-head'),arm=scene.querySelector('.pa-working-arm');
  const paper=scene.querySelector('.pa-tissue'),paperRig=scene.querySelector('.pa-tissue-rig');
  const paperFlat=scene.querySelector('.pa-paper-flat'),puff=scene.querySelector('.pa-sneeze-puff');
  const paperShape=scene.querySelector('.pa-paper-shape'),paperClip=scene.querySelector('.pa-paper-clip');
  const hand=scene.querySelector('.pa-hand'),grip=scene.querySelector('.pa-grip'),knuckles=scene.querySelector('.pa-knuckles');
  const restSleeve=scene.querySelector('.pa-rest-sleeve'),restHand=scene.querySelector('.pa-rest-hand'),restUpper=scene.querySelector('.pa-rest-upper');
  const morphs=[
    ['.pa-coat-body','M148 123C127 124 110 136 108 154C105 175 112 193 115 211L110 247 104 286Q127 295 149 291L151 284 154 291Q178 295 199 286L190 246C196 222 199 200 197 179C199 154 187 134 166 128Z'],
    ['.pa-face','M138 66C137 51 150 43 162 45C176 45 183 56 181 72L180 83 180 91Q180 96 179 97L176 106Q168 116 157 111L145 104Q137 98 138 86Z'],
    ['.pa-hair','M139 91C133 85 133 68 136 58C139 44 150 37 163 39Q185 38 185 61L179 67 171 58Q157 63 142 61L144 81Z'],
    ['.pa-lapel','M145 133L131 147 149 163 158 137 177 145 161 170'],
    ['.pa-coat-seam','M154 166Q155 207 154 245L153 281M114 214Q153 224 192 217'],
  ].map(([selector,target])=>{const node=scene.querySelector(selector);return {node,from:node.getAttribute('d'),target};});
  const legs=[scene.querySelector('.pa-back-leg'),scene.querySelector('.pa-front-leg')];
  let elapsed=0,raf=0,last=0,running=false;
  // The same wrist owns the same paper throughout the complete performance.
  // Feet use a stance/swing cycle; during stance their world position is fixed.
  function render(time) {
    const forced=stage.dataset.paPhase;
    const distance=Math.min(800,stage.clientWidth*.6+100);
    const scale=walker.clientWidth/300;
    const stride=56,period=1.08;
    // Match pavement travel to the planted foot, including at mobile scale.
    const walkDuration=distance/(scale*stride/(.62*period));
    const sceneDuration=10.5,loop=walkDuration*2+sceneDuration;
    const fixed={present:6.8,sneeze:1.8,turn:3.8,breath:3.0,fly:5.2,crumple:8.95,fist:9.33,pull:9.53,returned:10.1};
    const t=reduced.matches?walkDuration+6.8:Object.hasOwn(fixed,forced)?walkDuration+fixed[forced]:forced==='walk'?4:time%loop;
    const going=t<walkDuration,leaving=t>=walkDuration+sceneDuration,walking=going||leaving;
    const walkTime=going?t:leaving?t-walkDuration-sceneDuration:walkDuration;
    const act=t-walkDuration;
    const travel=going?lerp(-distance,0,t/walkDuration):leaving?lerp(0,distance,walkTime/walkDuration):0;
    walker.style.transform=`translateX(${travel.toFixed(2)}px)`;
    const cycle=walking?(walkTime/period)%1:.5;
    const settle=walking?smooth(walkTime/.25)*(1-smooth((walkTime-walkDuration+.28)/.28)):0;
    const performance=paradigmPerformance(act);
    const {raise,reach,turn,unfold,recovery,breath,fly,closing,crumple,pull,sneeze,zoom}=performance;
    // Side view: the two hip sockets almost overlap. The body rises over the
    // planted leg and lowers at double support, rather than bending both knees
    // to accommodate an arbitrary, constant pelvis height.
    const legPose=paradigmLegPose(cycle,settle);
    const {pelvisY}=legPose;
    const bob=pelvisY-230;
    const lean=1.5+1.5*settle+5*sneeze-1.2*breath;
    const cold=(1-smooth((act-2.8)/.5))+smooth((act-9.8)/.5);
    const tremor=reduced.matches?0:Math.sin(t*57)*1.25*cold;
    body.setAttribute('transform',`translate(${tremor.toFixed(3)} ${(bob-2*breath+Math.sin(t*49)*.6*cold*(reduced.matches?0:1)).toFixed(3)}) rotate(${(lean*(1-turn)).toFixed(2)} 151 230)`);
    morphs.forEach(({node,from,target})=>{
      const quarter=node.classList.contains('pa-face')?'M140 66C139 51 151 43 164 45C178 45 184 56 182 72L183 83 182 91Q185 96 178 97L176 106Q171 115 160 111L148 104Q139 98 140 86Z':node.classList.contains('pa-hair')?'M141 91C133 85 134 68 137 58C139 44 150 37 163 39Q185 38 185 61L179 67 171 58Q159 63 145 61L146 81Z':morphPath(from,target,.5);
      node.setAttribute('d',turn<.5?morphPath(from,quarter,turn*2):morphPath(quarter,target,turn*2-1));
    });
    scene.querySelector('.pa-buttons').setAttribute('transform',`translate(${-15*turn} 0)`);
    const headPose=paradigmHeadTurn(turn);
    scene.querySelector('.pa-ear').setAttribute('transform',`translate(${asPath(headPose.nearEar)}) scale(${lerp(.85,.65,turn)} 1)`);
    scene.querySelector('.pa-far-ear').setAttribute('transform',`translate(${asPath(headPose.farEar)}) scale(${-lerp(.4,.65,turn)} 1)`);
    for(const [which,p] of [['near',headPose.nearEye],['far',headPose.farEye]]){
      const eye=scene.querySelector(which==='near'?'.pa-eye':'.pa-far-eye');
      eye.setAttribute('cx',p.x);eye.setAttribute('cy',p.y);eye.setAttribute('r','1.3');
    }
    scene.querySelector('.pa-glasses').setAttribute('d',roundedPolygon(headPose.nearRim));
    scene.querySelector('.pa-far-glasses').setAttribute('d',roundedPolygon(headPose.farRim));
    scene.querySelector('.pa-near-temple').setAttribute('d',`M${asPath(headPose.nearTemple[0])}L${asPath(headPose.nearTemple[1])}`);
    scene.querySelector('.pa-far-temple').setAttribute('d',`M${asPath(headPose.farTemple[0])}L${asPath(headPose.farTemple[1])}`);
    scene.querySelector('.pa-bridge').setAttribute('d',`M${asPath(headPose.bridge[0])}Q${asPath(headPose.bridge[1])} ${asPath(headPose.bridge[2])}`);
    const m=headPose.meridian;
    scene.querySelector('.pa-far-face-clip').setAttribute('d',`M${m+1} 60Q${m+1} 79 ${m+2} 91L220 110V50H${m+1}Z`);
    const brow=(p,side,rim)=>{const half=(Math.max(...rim.map(v=>v[0]))-Math.min(...rim.map(v=>v[0])))*.4;return `M${p.x-half} 73Q${p.x+side*2} 68 ${p.x+half} 73`;};
    scene.querySelector('.pa-brow').setAttribute('d',brow(headPose.nearEye,1,headPose.nearRim));
    scene.querySelector('.pa-far-brow').setAttribute('d',brow(headPose.farEye,-1,headPose.farRim));
    scene.querySelector('.pa-nose').setAttribute('cx',headPose.meridian);
    const mouthHalf=4+5*Math.sin(turn*Math.PI/2),mouthY=lerp(105,106,turn);
    scene.querySelector('.pa-mouth').setAttribute('d',`M${headPose.mouth.x-mouthHalf} ${mouthY}Q${headPose.mouth.x} 100 ${headPose.mouth.x+mouthHalf} ${mouthY}`);
    scene.querySelector('.pa-nose').setAttribute('cy',lerp(92,94,turn));
    // About seven head-lengths overall. Hunching tucks the chin into the collar;
    // it does not enlarge the skull or detach the neck from the thorax.
    head.setAttribute('transform',`translate(0 ${(-2*Math.sin(turn*Math.PI)).toFixed(3)}) rotate(${((9+tremor*.6)*(1-turn)+sneeze*7).toFixed(2)} 153 121) translate(153 121) scale(.7) translate(-153 -121)`);
    legs.forEach((leg,i)=>{
      const pose=legPose.legs[i],spread=(i===0?-10:10)*turn;
      const hip=point(pose.hip.x+spread,pose.hip.y),knee=point(pose.knee.x+spread,pose.knee.y),ankle=point(pose.ankle.x+spread,pose.ankle.y);
      const {stance,footTilt,soleCorrection}=pose;
      leg.querySelector('.pa-trouser').setAttribute('d',limbPath(hip,knee,ankle,[12,8.8,6]));
      leg.querySelector('.pa-trouser-crease').setAttribute('d',`M${asPath(hip)}Q${asPath(knee)} ${asPath(ankle)}`);
      leg.querySelector('.pa-shoe').setAttribute('transform',`translate(${asPath(ankle)}) rotate(${footTilt.toFixed(2)})`);
      leg.querySelector('.pa-shoe-outline').setAttribute('d',morphPath('M-8-5Q-1-2 6-5L10 2 26 7Q30 9 29 13L-9 13Z','M-8-5Q-1-2 6-5L8 2 10 7Q13 9 10 13L-10 13Z',turn));
      leg.querySelector('.pa-shoe-sole').setAttribute('d',`M${lerp(-9,-10,turn)} 13H${lerp(29,10,turn)}`);
      leg.dataset.grounded=String(!walking||stance);leg.dataset.soleY=(ankle.y+13+soleCorrection).toFixed(2);
    });
    const {shoulder,elbow,wrist,farShoulder,farElbow,farWrist}=paradigmArmPose(turn,raise,reach,pull,recovery);
    const finalZoom=Math.min(2.65,stage.clientWidth*.88/(314*.85*scale));
    // Opening and camera approach would otherwise multiply into an apparent
    // acceleration. Compensate that product so the visible sheet grows linearly.
    const foldedWidth=32,openWidth=315;
    const openingScale=lerp(foldedWidth,openWidth*finalZoom,reach)/lerp(foldedWidth,openWidth,unfold);
    const handScale=lerp(openingScale,1,pull),nearWidth=6.8*handScale;
    arm.querySelector('.pa-sleeve').setAttribute('d',limbPath(shoulder,elbow,wrist,[14,11,nearWidth],true));
    arm.querySelector('.pa-sleeve-seam').setAttribute('d',`M${shoulder.x-5} ${shoulder.y}Q${elbow.x-4} ${elbow.y} ${wrist.x-2} ${wrist.y}`);
    const forearmLength=Math.hypot(wrist.x-elbow.x,wrist.y-elbow.y)||1,ux=(wrist.x-elbow.x)/forearmLength,uy=(wrist.y-elbow.y)/forearmLength;
    const base=point(wrist.x-ux*8*handScale,wrist.y-uy*8*handScale),nx=-uy*nearWidth,ny=ux*nearWidth;
    arm.querySelector('.pa-cuff').setAttribute('d',`M${base.x+nx} ${base.y+ny}L${wrist.x+nx} ${wrist.y+ny}L${wrist.x-nx} ${wrist.y-ny}L${base.x-nx} ${base.y-ny}Z`);
    restUpper.setAttribute('d',limbPath(farShoulder,point(lerp(farShoulder.x,farElbow.x,.5),lerp(farShoulder.y,farElbow.y,.5)),farElbow,[11,11,10],true));
    restSleeve.setAttribute('d',limbPath(farElbow,point(lerp(farElbow.x,farWrist.x,.5),lerp(farElbow.y,farWrist.y,.5)),farWrist,[10,8.5,6.5]));
    restHand.setAttribute('transform',`translate(${asPath(farWrist)}) rotate(-24)`);
    paperRig.setAttribute('transform',`translate(${asPath(wrist)}) scale(${handScale.toFixed(4)})`);
    const paperCentreY=lerp(70,95,1-crumple);
    paper.setAttribute('transform',`scale(.85) rotate(${(-12*crumple).toFixed(3)}) translate(157 ${-paperCentreY})`);
    const outline=paperOutline.map((p,i)=>{const a=i/paperOutline.length*Math.PI*2,r=13+(i%3)*2;return [lerp(p[0],-157+Math.cos(a)*r,crumple),lerp(p[1],70+Math.sin(a)*r,crumple)];});
    const d='M'+outline.map(p=>p.map(n=>n.toFixed(3)).join(' ')).join('L')+'Z';
    paperShape.setAttribute('d',d);paperClip.setAttribute('d',d);
    paperFlat.style.visibility=crumple>.995?'hidden':'visible';
    paperFlat.setAttribute('transform',`translate(-157 95) scale(${(1-.96*crumple).toFixed(4)}) translate(157 -95)`);
    const creases=scene.querySelector('.pa-crumple-creases');
    creases.setAttribute('d','M-173 68l10 5-6 8m9-26-2 18 11-7m-16-2 13 10-9 4m3-18-8-2m-5 1 5 8');
    creases.setAttribute('stroke-width',(crumple*1.2).toFixed(3));
    const palmScale=lerp(.55,1,reach)*(1-.45*pull);
    hand.setAttribute('transform',`scale(${palmScale.toFixed(4)})`);
    grip.setAttribute('d',roundedPolygon(openGrip.map((p,i)=>[lerp(p[0],closedGrip[i][0],crumple),lerp(p[1],closedGrip[i][1],crumple)])));
    knuckles.setAttribute('d',crumple>.2?'M-20-10Q-13-15-7-9M-7-13Q1-16 7-9M7-12Q14-12 19-5M-25 2Q-14-4-5 7L-10 17M-15 20Q1 25 13 16':'m3-2 2 9M0 0l-3-1');
    const frontFingers=scene.querySelector('.pa-fingers-front');
    frontFingers.setAttribute('transform',`scale(${palmScale.toFixed(4)})`);
    const thumb=[[-27,4],[-24,-5],[-16,-9],[-7,-5],[0,3],[-3,12],[-10,20],[-20,16],[-28,10]];
    const thumbNode=scene.querySelector('.pa-front-thumb');
    thumbNode.setAttribute('d',roundedPolygon(thumb.map(p=>p.map(n=>n*crumple))));
    thumbNode.setAttribute('stroke-width',crumple);
    puff.style.display=sneeze>.1?'':'none';puff.setAttribute('opacity','1');
    stage.dataset.paPose=walking?'walk':pull>.99?'returned':pull>.01?'pull':closing>.99?'fist':closing>.01?'crumple':reach>.999?'present':reach>.01?'reach':sneeze>.1?'sneeze':breath>.01?'breath':'prepare';
    stage.dataset.paTime=t.toFixed(2);
    stage.dataset.paAct=act.toFixed(3);
  }
  function tick(now) {
    if(!running||signal.aborted)return;
    if(last)elapsed+=Math.min((now-last)/1000,.05);
    last=now;render(elapsed);raf=requestAnimationFrame(tick);
  }
  function synchronize() {
    const active=isActive();stage.classList.toggle('pa-paused',!active);
    const animate=active&&!reduced.matches&&!stage.dataset.paPhase&&!signal.aborted;
    if(animate&&!running){running=true;last=0;raf=requestAnimationFrame(tick);}
    if(!animate&&running){running=false;cancelAnimationFrame(raf);last=0;}
    if(!animate)render(elapsed);
  }
  const observer=new MutationObserver(synchronize);
  observer.observe(article,{attributes:true,attributeFilter:['class']});
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  observer.observe(stage,{attributes:true,attributeFilter:['data-pa-phase']});
  const dialog=document.querySelector('#project-dialog');
  if(dialog)observer.observe(dialog,{attributes:true,attributeFilter:['open']});
  document.addEventListener('visibilitychange',synchronize,{signal});
  paper.addEventListener('click',event=>route('paradigm',event.currentTarget),{signal});
  paper.addEventListener('focus',()=>{stage.dataset.paPhase='present';render(elapsed);synchronize();},{signal});
  paper.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();route('paradigm',event.currentTarget);}},{signal});
  const motion=()=>{stage.classList.toggle('pa-reduced',reduced.matches);synchronize();};
  reduced.addEventListener('change',motion,{signal});
  const resize=new ResizeObserver(()=>render(elapsed));resize.observe(stage);
  signal.addEventListener('abort',()=>{running=false;cancelAnimationFrame(raf);observer.disconnect();resize.disconnect();},{once:true});
  motion();render(elapsed);
}


