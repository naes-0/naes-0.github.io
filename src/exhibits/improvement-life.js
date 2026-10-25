import {naturalGaitCSS,NATURAL_SPEED,NATURAL_CYCLE} from './improvement-natural-gait.js';
import {pramArt} from './improvement-pram.js';
import {parkGaitCSS} from './improvement-gait.js';
// Decorative park residents, drawn here rather than presented as project media.
function leg(side,{trousers,farTrouser,legWidth,shoe,shoeType,clipKey}){
  const boot=shoeType==='boot',trainer=shoeType==='trainer';
  const outline=`M-5 ${boot?-12:-5}H4V-4L11-3Q16-2 14 1H-5Z`;
  const naturalOutline=`M-4 ${boot?-11:-5}H3V-4L11-3Q14-2 12 1H-4Z`;
  // Only the round stroke cap is masked, in the same local coordinates as the shoe.
  return `<g class="park-leg-layer park-leg-${side} park-phase-${side}"><defs><mask id="park-ankle-${clipKey}-${side}" maskUnits="userSpaceOnUse" x="-100" y="-180" width="200" height="240" style="mask-type:luminance"><rect x="-100" y="-180" width="200" height="240" fill="white"/><circle class="park-original-cap" r="${legWidth/2+.15}" fill="black"/><rect class="park-natural-cap" x="-${legWidth/2+1}" y="-4" width="${legWidth+2}" height="12" fill="black"/><path class="park-original-sole" d="${outline}" fill="white"/><path class="park-natural-sole" d="${naturalOutline}" fill="white"/></mask></defs><path mask="url(#park-ankle-${clipKey}-${side})" class="park-human-leg park-phase-${side}" d="M-16-51L-10-25L0 0" stroke="${side==='a'?farTrouser:trousers}" stroke-width="${legWidth}"/><g class="park-shoe park-original-shoe" fill="${shoe}"><path d="${outline}"/><path d="M-5 1H14" stroke="${trainer?'#f4edda':shoe}" stroke-width="${trainer?3:1.5}"/>${trainer?'<path d="M3-3l4 2m-1-3 4 2" stroke="#a9b9b1" stroke-width="1.5"/>':''}</g><g class="park-shoe park-natural-shoe" fill="${shoe}"><path d="${naturalOutline}"/><path d="M-4 1H12" stroke="${trainer?'#f4edda':shoe}" stroke-width="${trainer?2:1}"/>${trainer?'<path d="M2-3l3 2m0-3 3 2" stroke="#a9b9b1" stroke-width="1.2"/>':''}</g></g>`;
}
function pushArm(coat,side){
  const grip=side==='a'?40:46;
  return `<g class="park-fixed-grip"><path class="park-push-link park-push-${side}" d="M7-95L22-78L${grip}-78" stroke="${coat}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="${grip}" cy="-78" r="4" fill="#dfb891"/></g>`;
}
function arm(coat,side,bag=false,push=false){
  return `<g class="park-arm-mount" transform="translate(${side==='a'?-7:7} -102)"><g class="park-arm-length"><g class="${push?'park-push-arm':'park-upper-arm park-phase-'+side}"><path d="M0 0L${push?18:0} 24" stroke="${coat}" stroke-width="9"/><g transform="translate(${push?18:0} 24)"><g class="${push?'':'park-forearm park-phase-'+side}"><path d="M0 0L${push?12:8} ${push?0:22}" stroke="${coat}" stroke-width="8"/><circle cx="${push?12:8}" cy="${push?0:22}" r="4" fill="#dfb891"/>${bag?'<path d="M2 26v-5h12v5" stroke="#665347" stroke-width="3" fill="none"/><rect x="-6" y="26" width="30" height="23" rx="3" fill="#88654a"/><path d="M-5 34h28" stroke="#ba9270" stroke-width="2"/>':''}</g></g></g></g></g>`;
}
function reachingArm(coat){
  return `<g class="park-reaching-arm" transform="translate(7 -102)"><g class="park-arm-length"><path d="M0 0L44-9.3525" stroke="${coat}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" fill="none"/><path transform="translate(0 -1.3525)" d="M43-11L48-12L54-11Q56-9 53-9L49-9L55-7Q56-5 53-5L48-6L51-3Q51-1 49-2L44-5Z" fill="#dfb891"/></g></g>`;
}
function person({coat='#bf795e',hair='#5c4d42',elder=false,run=false,bag=false,skirt=false,push=false,trousers='#324b58',farTrouser='#293f49',legWidth=11,shoe='#343b38',shoeType='flat'}={}){
  const clothes={trousers,farTrouser,legWidth,shoe,shoeType,clipKey:coat.slice(1)};
  return `<g class="park-person${run?' park-runner':''}${push?' park-parent':''}${elder?' park-elder':''}" style="--natural-gait:${run?NATURAL_CYCLE.run:elder?NATURAL_CYCLE.walk*NATURAL_SPEED.walk/NATURAL_SPEED.elder:NATURAL_CYCLE.walk}s;--natural-half:${-(run?NATURAL_CYCLE.run:elder?NATURAL_CYCLE.walk*NATURAL_SPEED.walk/NATURAL_SPEED.elder:NATURAL_CYCLE.walk)/2}s">
    ${push?pushArm(coat,'a'):`<g class="park-body park-far-arm">${arm(coat,'a')}</g>`}
    <g class="park-legs" stroke-linecap="round" fill="none">${leg('a',clothes)}${leg('b',clothes)}</g>
    <g class="park-body park-near-body"><path d="M-11-112Q0-118 12-110L15-59Q1-52-15-59Z" fill="${coat}"/>
      ${skirt?`<path class="park-dress" d="M-13-77L-23-50Q0-43 23-50L13-77Z" fill="${coat}"/>`:''}
      <g class="park-head"><path d="M-7-119v-12h13v13" fill="#d6ac85"/>
      <path class="park-face" d="M-11-134Q-10-146 2-144Q13-142 12-133L18-127L12-124L11-117Q3-112-6-120L-12-126Z" fill="#dfb891"/>
      <path d="M-12-126Q-20-145-7-150Q7-155 13-142L3-140Q-8-141-6-128L-10-122Z" fill="${elder?'#d7d6c9':hair}"/>
      ${skirt?`<ellipse cx="-15" cy="-135" rx="7" ry="9" fill="${elder?'#d7d6c9':hair}"/>`:''}
      <circle cx="9" cy="-132" r="1.4" fill="#405952"/>
      ${run?'<g class="park-run-mouth"><path d="M8-123H14L13-119H9Z" fill="#edabb5"/><path d="M10-122.3h3.5" stroke="#f0dfc4" stroke-width="1"/></g>':''}
      ${elder?'<path d="M5-134h10m-1 1v5H7v-5m-2 0h-8" stroke="#667969" stroke-width="1" fill="none"/>':''}
      </g>${push?'':arm(coat,'b',bag)}${run?reachingArm(coat):''}
    </g>${push?pushArm(coat,'b'):''}</g>`;
}

function dog(){
  return `<g class="park-dog"><path class="park-dog-tail" d="M-25-37Q-49-55-43-67" stroke="#a46e49" stroke-width="7" fill="none" stroke-linecap="round"/>
    <g stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none">${[{x:-23,front:false,phase:'a',far:true},{x:16,front:true,phase:'b',far:true},{x:-18,front:false,phase:'b'},{x:21,front:true,phase:'a'}].map((l,i)=>`<g transform="translate(${l.x} 0)"><path class="park-dog-limb park-paw-${i} park-dog-${l.front?'front':'rear'} park-phase-${l.phase}" d="M0-29L4-15L12 0h5" stroke="${l.far?'#8c6349':'#b38155'}"/></g>`).join('')}</g>
    <g class="park-dog-body"><ellipse class="park-dog-original-torso" cx="-5" cy="-33" rx="28" ry="16" fill="#bc8a59"/><path class="park-dog-natural-torso" d="M-31-31C-33-48 7-50 25-39C28-24 14-19-22-20Q-33-20-31-31Z" fill="#bc8a59"/><path d="M14-41L21-64L39-60L44-44L35-29H15Z" fill="#c69460"/><path d="M20-62Q7-69 11-42L21-38Z" fill="#865d43"/><circle cx="34" cy="-53" r="2" fill="#354e47"/><path d="M39-47h11l-3 8h-12" fill="#bc8a59"/><circle cx="48" cy="-46" r="3" fill="#354e47"/>
    <path d="M16-35l20 3" stroke="#ac6456" stroke-width="5"/>
    <path class="park-leash" d="M18-33Q-22-10-49-13T-99-2" stroke="#725a4c" stroke-width="2.5" fill="none"/>
  </g></g>`;
}

// Both modes use a compact schedule; each tour waits for its slowest visitor.
export const NATURAL_STARTS=Object.freeze({woman:0,briefcase:6,couple:12,dog:22,owner:26});
export function naturalTour(w,scale){
  const travel=speed=>(w+520)/(scale*speed);
  return Math.ceil(Math.max(NATURAL_STARTS.woman+travel(NATURAL_SPEED.walk),NATURAL_STARTS.briefcase+travel(NATURAL_SPEED.walk),NATURAL_STARTS.couple+travel(NATURAL_SPEED.elder),NATURAL_STARTS.dog+travel(NATURAL_SPEED.dog),NATURAL_STARTS.owner+travel(NATURAL_SPEED.run))+1);
}

function originalTravel(w,scale,name){
  return Math.min(64*.65,(w+520)/(scale*(name==='dog'||name==='owner'?130:name==='couple'?34:52)));
}
export function originalStarts(w,scale){
  // The reversed traveller is wholly off the left edge, including his trailing
  // shoe/arm/briefcase. Account for the original route's arrival clamp too.
  const briefcaseExit=NATURAL_STARTS.briefcase+originalTravel(w,scale,'briefcase')*(w+260+50*scale)/(w+520);
  const dog=briefcaseExit+.15;
  return {...NATURAL_STARTS,dog,owner:dog+4};
}

// Halve only invisible time: the tail after the final silhouette leaves, and
// the lead-in before the next stroller appears. Routes and gait speeds stay put.
export function transitionTiming(w,scale,natural=true){
  const delays=natural?NATURAL_STARTS:originalStarts(w,scale);
  const rear={woman:50,briefcase:50,couple:95,dog:110,owner:60},distance=w+520;
  const base=natural?naturalTour(w,scale):Math.ceil(Math.max(...Object.entries(delays).map(([name,delay])=>delay+originalTravel(w,scale,name)))+1);
  const exit=Math.max(...Object.entries(delays).map(([name,delay])=>{
    const speed=natural?NATURAL_SPEED[name==='dog'?'dog':name==='owner'?'run':name==='couple'?'elder':'walk']:name==='dog'||name==='owner'?130:name==='couple'?34:52;
    const travel=natural?distance/(scale*speed):Math.min(64*.65,distance/(scale*speed));
    return delay+travel*(w+260+rear[name]*scale)/distance;
  }));
  const entry=Math.max(0,260-130*scale)/(scale*(natural?NATURAL_SPEED.walk:52));
  return {duration:Math.max(exit,(base+exit)/2),lead:entry/2,exit,base,entry};
}

export function parkLife(w,h,unit,portrait){
  const scale=(portrait?1.05:1.45)*unit,tour=naturalTour(w,scale),normalTiming=transitionTiming(w,scale),comicTiming=transitionTiming(w,scale,false),comicStarts=originalStarts(w,scale);
  const traveller=(name,body,reverse=false,fast=false)=>`<g class="park-traveller park-visit-${name}${fast?' park-fast':''}" style="--park-natural-delay:${NATURAL_STARTS[name]}s;--park-natural-arrival:${Math.min(99,(w+520)/(scale*(fast?(name==='dog'?NATURAL_SPEED.dog:NATURAL_SPEED.run):name==='couple'?NATURAL_SPEED.elder:NATURAL_SPEED.walk))/tour*100)}%;--park-delay:${comicStarts[name]}s;--park-arrival:${Math.min(65,(w+520)/(scale*(fast?130:name==='couple'?34:52))/64*100)}%;--park-start:${reverse?w+260:-260}px;--park-end:${reverse?-260:w+260}px"><g transform="translate(0 ${h*.664}) scale(${reverse?-scale:scale} ${scale})"><ellipse cy="-1" rx="${name==='woman'?91:44}" ry="5" fill="#45634f" opacity=".13"/>${body}</g></g>`;
  return `<g class="cleanup-park-life" style="--park-natural-tour:${tour}s;--park-natural-clock:${normalTiming.duration}s;--park-original-clock:${comicTiming.duration}s;--park-natural-lead:${normalTiming.lead}s;--park-original-lead:${comicTiming.lead}s" data-gait="natural" aria-hidden="true"><style>${parkGaitCSS}${naturalGaitCSS}</style>
    ${traveller('woman',pramArt()+person({skirt:true,push:true,trousers:'#d4ac88',farTrouser:'#bd9677',legWidth:7,shoe:'#654d4d',shoeType:'boot'}))}
    ${traveller('briefcase',person({coat:'#657d87',bag:true,trousers:'#354c62',farTrouser:'#293b4e',shoe:'#383b3d'}),true)}
    ${traveller('couple',person({coat:'#977a92',elder:true,skirt:true,trousers:'#726e71',farTrouser:'#5e5c60',legWidth:7,shoe:'#504348'})+`<g class="park-couple-partner" transform="translate(-44 0)">${person({coat:'#8b9470',elder:true,trousers:'#81715c',farTrouser:'#6b5d4e',legWidth:10,shoe:'#5c483c'})}</g>`)}
    ${traveller('dog',dog(),false,true)}
    ${traveller('owner',person({coat:'#bc9557',run:true,trousers:'#496b70',farTrouser:'#365559',legWidth:10,shoe:'#dce6dc',shoeType:'trainer'}),false,true)}
  </g>`;
}

export function parkFlowers(w,h,unit){
  return `<g class="cleanup-flowers">${Array.from({length:38},(_,i)=>{
    const front=i>24,x=w*((i*37%97)+1)/100,y=h*(front?.95+(i%4)*.012:.557+(i*17%13)*.0105);
    const s=(front?.8:.35+(y/h-.55)*2.1)*unit;
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0v-15m0 10q-9-8-11-3m11 2q7-9 10-5" stroke="#617f55" stroke-width="2" fill="none"/><g fill="${i%3===0?'#e8ba8b':'#f4e7bf'}"><ellipse cy="-18" rx="3" ry="5"/><ellipse cx="-5" cy="-14" rx="5" ry="3"/><ellipse cx="5" cy="-14" rx="5" ry="3"/><ellipse cy="-10" rx="3" ry="5"/></g><circle cy="-14" r="3" fill="#c39b55"/></g>`;
  }).join('')}</g>`;
}
