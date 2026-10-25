import {parkLife,parkFlowers} from './improvement-life.js';
// Unified vector scenery: all props share the same ground, palette and perspective.
const colours=['#ab7351','#b47f58','#a97250','#b7825b'];
export const BIN_GEOMETRY=Object.freeze({openingRadius:37,baseRadius:42,outerRadius:49,rimFront:-116});

// Positions derive from actual support surfaces, never independent screen offsets.
export function cleanupLayout(portrait,aspect){
  const h=portrait?1100:900,w=aspect?h*aspect:(portrait?600:1440);
  const unit=Math.min(1.2,w/(portrait?600:1440));
  const bench={x:w*.5,y:h*.77,s:(portrait ? .87:1.25)*unit,seatY:-64,seatHalfWidth:160};
  const sideScale=(portrait ? .53:.86)*unit;
  const sideOffset=180*bench.s+49*sideScale+(portrait?16:25)*unit;
  const sideY=bench.y+12*bench.s;
  const bins=[
    {x:bench.x-sideOffset,y:sideY,s:sideScale,surface:'ground'},
    {x:bench.x+sideOffset+14*unit,y:sideY-10*unit,s:sideScale,surface:'ground'},
    {x:w*.19,y:h*.902,s:(portrait ? 1.02:1.65)*unit,surface:'ground'},
    {x:w*.79,y:h*.858,s:(portrait ? .88:1.42)*unit,surface:'ground'},
    {x:bench.x-106*bench.s,y:bench.y+bench.seatY*bench.s,s:sideScale,surface:'seat'},
    {x:bench.x+53*bench.s,y:bench.y+bench.seatY*bench.s,s:sideScale,surface:'seat'},
    {x:w*.91,y:h*.735,s:(portrait ? .52:.80)*unit,surface:'ground',behind:true}
  ];
  const support=bins[5];
  bins.push({x:support.x,y:support.y+BIN_GEOMETRY.rimFront*support.s,s:support.s,surface:'rim',parent:5});
  return {w,h,unit,bench,bins,road:{back:h*.71,front:h*.92}};
}

function building(x,base,w,h,roof,windows=false){
  const apertures=windows?Array.from({length:Math.floor(h/30)},(_,row)=>
    Array.from({length:Math.max(1,Math.floor(w/26))},(_,col)=>`<rect x="${x+9+col*23}" y="${base-h+17+row*27}" width="8" height="13" rx="1" fill="#dce3d4" opacity=".28"/>`).join('')).join(''):'';
  return `<path d="M${x} ${base}V${base-h}h${w*.35}v-${roof}h${w*.3}v${roof}h${w*.35}V${base}Z"/>${apertures}`;
}

function tree(x,y,s){
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="210" rx="70" ry="13" fill="#476754" opacity=".1"/><path d="M0 20V210M0 130l-37-42M0 100l40-40" fill="none" stroke="#637754" stroke-width="15" stroke-linecap="round"/><path d="M-68 68C-124 36-92-34-48-37C-64-103 32-122 57-62C118-66 137 15 88 44C99 106 18 139-12 101C-32 119-69 103-68 68Z" fill="#668d6c"/><path d="M-70 47C-104 13-69-34-37-24C-28-83 34-80 52-38C91-32 102 9 77 30C38 4 10 30-13 70C-36 47-50 41-70 47Z" fill="#91ad75"/></g>`;
}

function bench(x,y,s){
  // Symmetric frontal projection: parallel slats, vertical supports, rear/front
  // feet on two depth lines of the same level paving plane.
  return `<g class="cleanup-bench" transform="translate(${x} ${y}) scale(${s})"><ellipse cy="14" rx="190" ry="17" fill="#4c6756" opacity=".15"/><g fill="#405c53"><rect x="-142" y="-190" width="12" height="190" rx="2"/><rect x="130" y="-190" width="12" height="190" rx="2"/></g><g fill="#b9825b" stroke="#926448" stroke-width="2">${[-185,-154,-123].map(py=>`<rect x="-164" y="${py}" width="328" height="24" rx="3"/>`).join('')}</g><g fill="#ce9b6b" stroke="#a57851" stroke-width="1.5"><path d="M-160-86H160l7 14H-167Z"/><path d="M-169-68H169l11 14H-180Z"/></g><path d="M-180-54H180v10H-180Z" fill="#9f6e4e"/><g fill="#405c53"><rect x="-162" y="-44" width="12" height="58" rx="1"/><rect x="150" y="-44" width="12" height="58" rx="1"/></g><g fill="#ded5b8">${[-145,145].map(px=>[-173,-142,-111].map(py=>`<circle cx="${px}" cy="${py}" r="2.2"/>`).join('')).join('')}</g></g>`;
}

function rubbish(x,y,s){
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="5" rx="83" ry="13" fill="#6b7057" opacity=".13"/><path d="M-78-30l23-19 26 7 11 28-25 21-35-12Z" fill="#f2eddb" stroke="#bfb89d" stroke-width="2"/><path d="M-78-30l34 8 15-20m-15 20 1 29m-1-29 26 8" stroke="#c6bda3" stroke-width="2" fill="none"/><g transform="translate(19 -29) rotate(62)"><path d="M-9-37h18v17l9 12v42q-18 9-36 0V-8l9-12Z" fill="#8bbfc0" stroke="#567f7e" stroke-width="2"/><path d="M-18 3h36v18h-36Z" fill="#e6d8b4"/><rect x="-10" y="-42" width="20" height="9" rx="2" fill="#cb7e59"/></g><g transform="translate(58 -4) rotate(-15)"><path d="M-16-27h32l-5 30h-22Z" fill="#c77e5c"/><ellipse cy="-27" rx="19" ry="5" fill="#f4e9cb"/><path d="M-12-19h23" stroke="#dfa579" stroke-width="3"/></g><path d="M-8 8l18-5 14 8-19 5Z" fill="#deb973"/></g>`;
}

function lamp(x,y,height,unit){
  const top=-height/unit;
  return `<g class="cleanup-lamp" transform="translate(${x} ${y}) scale(${unit})"><ellipse cy="2" rx="27" ry="8" fill="#405c53" opacity=".16"/><path d="M-4-13V${top+79}Q-4 ${top+72} 6 ${top+72}H32V${top+62}" fill="none" stroke="#355b57" stroke-width="8" stroke-linejoin="round"/><path d="M-10-25H10L17 0H-17Z" fill="#355b57"/><path d="M8 ${top+4}H56L50 ${top+62}H14Z" fill="#fff1c4" stroke="#355b57" stroke-width="5" stroke-linejoin="round"/><path d="M32 ${top+6}V${top+60}" stroke="#64847a" stroke-width="3"/><path d="M1 ${top+3}L32 ${top-18}L63 ${top+3}Z" fill="#355b57"/><path d="M9 ${top-1}H55" stroke="#75978a" stroke-width="3" stroke-linecap="round"/></g>`;
}

export function binArt(index,placement,isNew=false){
  const {x,y,s:scale,surface}=placement,wood=colours[index%colours.length];
  const contact=surface==='ground'?'<ellipse cy="0" cx="8" rx="59" ry="12" fill="#546c56" opacity=".19"/>':'<ellipse cy="0" rx="43" ry="1.8" fill="#294c47" opacity=".55"/>';
  const slats=Array.from({length:5},(_,i)=>`<path d="M${-34+i*15}-112v89" stroke="${wood}" stroke-width="11" stroke-linecap="round"/>`).join('');
  return `<g class="cleanup-bin" data-bin="${index}" data-support="${surface}" transform="translate(${x} ${y}) scale(${scale})"><g class="cleanup-bin-pop${isNew?' is-new':''}">${contact}<path d="M-48-129Q0-143 48-129l-5 111Q0 2-43-18Z" fill="#3d625d"/><path d="M22-132q14 0 26 3l-5 111q-12 6-24 9Z" fill="#2f514e"/>${slats}<ellipse class="cleanup-bin-foot" cy="-6" rx="42" ry="6" fill="#294c47"/><ellipse cy="-129" rx="49" ry="13" fill="#bdd0ba"/><ellipse cy="-130" rx="37" ry="8" fill="#294c47"/><path d="M-42-17q43 17 85 0v8q-43 17-85 0Z" fill="#355650"/><path d="M-36-122v94" stroke="#e2bb83" stroke-width="3" opacity=".55"/></g></g>`;
}

export function cleanupArt(portrait,count=0,newFrom=count,aspect){
  const layout=cleanupLayout(portrait,aspect),{w,h,unit,bench:b,bins,road}=layout;
  const skyline=Array.from({length:portrait?10:19},(_,i)=>{
    const bw=portrait?65:88,bh=75+(i*43%140);
    return building(i*bw-30,h*.52,bw-7,bh,i%3===0?20:0,true);
  }).join('');
  const drawBins=predicate=>bins.slice(0,count).map((p,index)=>({p,index}))
    .filter(({p,index})=>predicate(p,index)).sort((a,b)=>a.p.y-b.p.y)
    .map(({p,index})=>binArt(index,p,index>=newFrom)).join('');
  const treeLayout=[
    {x:.39,y:.55,s:.72},{x:.67,y:.59,s:.95},{x:.31,y:.63,s:1.10},
    {x:.10,y:.69,s:1.60},{x:.89,y:.70,s:2.30},{x:1.03,y:.65,s:1.1}
  ].sort((a,b)=>a.y-b.y);
  const trees=front=>treeLayout.filter(t=>(t.y>.664)===front).map(t=>tree(w*t.x,h*t.y-210*t.s*unit,t.s*unit)).join('');
  const bush=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-77 0C-107-28-72-65-45-48C-47-101 24-103 37-61C80-85 116-27 72 0Z" fill="#668d6c"/><path d="M-59-15q-7-34 22-27q8-47 38-26q27-7 23 30q33-12 42 18" stroke="#91ad75" stroke-width="13" fill="none" stroke-linecap="round"/></g>`;
  return `<svg class="cleanup-park" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="cleanup-sky" x2="0" y2="1"><stop stop-color="#c8dfda"/><stop offset="1" stop-color="#e5e8cc"/></linearGradient><linearGradient id="cleanup-path" x2="0" y2="1"><stop stop-color="#dbcca8"/><stop offset="1" stop-color="#edd1af"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#cleanup-sky)"/>
    <circle cx="${w*.79}" cy="${h*.28}" r="${portrait?42:60}" fill="#fff4cc"/>
    <g fill="#a9c3bb" opacity=".65">${building(-40,h*.50,w*.38,h*.25,20)}${building(w*.34,h*.50,w*.33,h*.31,14)}${building(w*.72,h*.50,w*.35,h*.22,25)}</g>
    <g fill="#89a9a0">${skyline}</g>
    <path d="M0 ${h*.53}Q${w*.4} ${h*.51} ${w} ${h*.53}V${h}H0Z" fill="#a7bc8d"/>
    <path d="M0 ${h*.64}Q${w*.4} ${h*.61} ${w} ${h*.64}V${h}H0Z" fill="#8fa97d"/>
    ${parkFlowers(w,h,unit)}
    <path d="M0 ${h*.634}Q${w*.5} ${h*.628} ${w} ${h*.634}V${h*.679}Q${w*.5} ${h*.674} 0 ${h*.679}Z" fill="#d3c7a4"/>
    ${trees(false)}
    ${parkLife(w,h,unit,portrait)}
    ${trees(true)}
    ${bush(w*.88,h*.705,(portrait ? .55:.9)*unit)}${bush(w*.28,h*.705,(portrait ? .37:.55)*unit)}
    <path class="cleanup-road" d="M0 ${road.back}H${w}V${road.front}H0Z" fill="url(#cleanup-path)"/>
    <path d="M0 ${road.back}H${w}M0 ${road.front}H${w}" stroke="#e9d8b8" stroke-width="7"/>
    <path d="M0 ${road.back-7}H${w}" stroke="#6e8c6e" stroke-width="5"/>
    <g stroke="#bfae91" stroke-width="1.5" opacity=".3"><path d="M0 ${h*.84}H${w}M${w*.12} ${road.back}L${w*.05} ${road.front}M${w*.88} ${road.back}L${w*.95} ${road.front}"/></g>
    ${lamp(w*(portrait ? .075:.235),h*.785,h*(portrait ? .43:.57),unit)}
    <g data-cleanup-layer="rear">${drawBins(p=>p.behind)}</g>
    ${bench(b.x,b.y,b.s)}
    <g data-cleanup-layer="ground">${drawBins((p,i)=>p.surface==='ground'&&!p.behind)}</g>
    <g data-cleanup-layer="seat">${drawBins(p=>p.surface==='seat')}</g>
    <g data-cleanup-layer="rim">${drawBins(p=>p.surface==='rim')}</g>
    ${rubbish(w*.49,h*.875,(portrait ? .85:1.05)*unit)}
  </svg>`;
}
