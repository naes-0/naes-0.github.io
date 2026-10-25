import {joint} from './improvement-gait.js';
import {capturedMotion} from './improvement-motion.js';

// The natural tour plays first; the intentionally odd rig remains untouched.
const tau=2*Math.PI,phase=p=>((p%1)+1)%1,n=v=>Number(v.toFixed(4));
export const NATURAL_CYCLE={walk:capturedMotion.walk.period,run:capturedMotion.run.period,dog:.72};
export const NATURAL_BODY_SCALE=.82;
export const NATURAL_SPEED={walk:72,elder:45,run:190,dog:140};
export function gaitForLoop(index){return index%2?'original':'natural';}
// Cubic Hermite keys: time, value, velocity per cycle. Explicit tangents at
// contact keep a planted foot moving backwards at exactly the travel speed.
function curve(keys,t){
  let i=0;while(i<keys.length-2&&t>keys[i+1][0])i++;
  const a=keys[i],b=keys[i+1],d=b[0]-a[0],u=Math.max(0,Math.min(1,(t-a[0])/d));
  const tangent=j=>keys[j][2]??(j===0||j===keys.length-1?0:(keys[j+1][1]-keys[j-1][1])/(keys[j+1][0]-keys[j-1][0]));
  return (2*u**3-3*u*u+1)*a[1]+(u**3-2*u*u+u)*d*tangent(i)+(-2*u**3+3*u*u)*b[1]+(u**3-u*u)*d*tangent(i+1);
}
// Periodic Catmull-Rom sampling retains captured timing, including overlap.
const runRows=capturedMotion.run.rows.map((row,i,rows)=>row.map((_,j)=>
  [1,4,6,4,1].reduce((sum,w,k)=>sum+w*rows[(i+k-2+rows.length)%rows.length][j],0)/16));
function sample(p,run){
  const rows=run?runRows:capturedMotion.walk.rows,x=phase(p)*rows.length,i=Math.floor(x),t=x-i;
  return rows[0].map((_,j)=>{
    const at=k=>rows[(k+rows.length)%rows.length][j],a=at(i-1),b=at(i),c=at(i+1),d=at(i+2);
    return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);
  });
}
const rad=v=>v*Math.PI/180;
function localPose(p,run){
  const row=sample(p,run),q=phase(p),smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  // CMU's toe markers are noisy. Clean the planted interval rather than making
  // the whole character rock on each tiny fluctuation of a captured toe.
  const flat=run?smooth((q-.02)/.055)*(1-smooth((q-.23)/.07)):smooth((q-.12)/.08)*(1-smooth((q-.43)/.1));
  const pitch=row[2]*(1-flat),thigh=rad(row[0]),shin=rad(row[1]),r=rad(pitch);
  const knee={x:36*Math.sin(thigh),y:36*Math.cos(thigh)};
  const ankle={x:knee.x+35*Math.sin(shin),y:knee.y+35*Math.cos(shin)};
  const foot={x:ankle.x-4*Math.sin(r),y:ankle.y+4*Math.cos(r),angle:pitch,pivot:0};
  // The visible sole, not the ankle marker, determines floor contact.
  const bottom=Math.max(...[-4,12].map(x=>foot.y+x*Math.sin(r)+Math.cos(r)));
  return {row,knee,ankle,foot,bottom};
}
function rawRig(p,run){
  const a=localPose(p,run),b=localPose(p+.5,run);
  const flight=run?Math.max(0,(a.row[6]+b.row[6])/2-.65):0;
  const hip={x:0,y:-Math.max(a.bottom,b.bottom)-flight};
  const ankle={x:a.ankle.x,y:a.ankle.y+hip.y};
  const foot={...a.foot,y:a.foot.y+hip.y,ankle,stance:a.bottom+hip.y> -(run?1.2:1.8)};
  return {hip,foot,knee:{x:a.knee.x,y:a.knee.y+hip.y},stance:foot.stance};
}
// Preserve the measured footwork, but remove marker noise from the runner's
// torso. One smooth rise/fall per step replaces high-frequency floor feedback.
const runHipSamples=Array.from({length:128},(_,i)=>rawRig(i/128,true).hip.y);
const runHipMean=runHipSamples.reduce((s,y)=>s+y,0)/runHipSamples.length;
const runHipCos=runHipSamples.reduce((s,y,i)=>s+y*Math.cos(2*tau*i/128),0)*2/128;
const runHipSin=runHipSamples.reduce((s,y,i)=>s+y*Math.sin(2*tau*i/128),0)*2/128;
const runHipDamping=Math.min(1,2.5/Math.hypot(runHipCos,runHipSin));
const runHip=p=>runHipMean+runHipDamping*(runHipCos*Math.cos(2*tau*p)+runHipSin*Math.sin(2*tau*p));
const runHipOffset=Math.max(0,...Array.from({length:512},(_,i)=>{
  const p=i/512;
  return Math.max(...[p,p+.5].map(q=>{const a=rawRig(q,true).foot.ankle;return a.y-Math.sqrt(70.85**2-a.x**2);}))-runHip(p);
}));
function rig(p,run){
  const pose=rawRig(p,run);if(!run)return pose;
  const hip={x:0,y:runHip(p)+runHipOffset};
  return {...pose,hip,knee:joint(hip,pose.foot.ankle,36,35)};
}
export function naturalFoot(p,run=false){return rig(p,run).foot;}
export function naturalHuman(p,run=false){return rig(p,run);}
export function naturalLean(p,run=false){return run?12:sample(p,false)[5]+6;}
export function naturalArm(p,run=false){
  const row=sample(p,run);
  // Retarget the actor's shoulder rest pose to this narrow side-view torso;
  // otherwise both elbows remain hidden behind the illustrated body.
  const upper=run?(row[3]+32.7404)*1.4-8:row[3];
  return {upper:-upper-naturalLean(p,run),fore:Math.atan2(8,22)*180/Math.PI+upper-row[4]};
}
function inverseFoot(point,f){
  const r=-f.angle*Math.PI/180,x=point.x-f.x-f.pivot,y=point.y-f.y;
  return {x:f.pivot+x*Math.cos(r)-y*Math.sin(r),y:x*Math.sin(r)+y*Math.cos(r)};
}
function legPath(p,run){
  const {hip,knee,foot}=naturalHuman(p,run),h=inverseFoot(hip,foot),k=inverseFoot(knee,foot);
  return `M${n(h.x)} ${n(h.y)}L${n(k.x)} ${n(k.y)}L0-4`;
}
function footTransform(p,run){
  const f=naturalFoot(p,run);
  return `transform:translate(${n(f.x)}px,${n(f.y)}px) translateX(${f.pivot}px) rotate(${n(f.angle)}deg) translateX(${-f.pivot}px)`;
}
export function naturalPush(p,side){
  const {hip}=naturalHuman(p),r=rad(naturalLean(p)+10),x=(side==='a'?-7:7)*NATURAL_BODY_SCALE,y=-44*NATURAL_BODY_SCALE;
  const shoulder={x:hip.x+x*Math.cos(r)-y*Math.sin(r),y:hip.y+x*Math.sin(r)+y*Math.cos(r)};
  const grip={x:side==='a'?40:46,y:-78};
  return {shoulder,grip,elbow:joint(shoulder,grip,28.5,26,-1)};
}
// Rotary gallop: hind propulsion, extended flight, fore contact, collected flight.
export const PAW_PHASES=[0,.48,.1,.58]; // far rear, far front, near rear, near front
const pawRoots=[{x:-23,front:false},{x:16,front:true},{x:-18,front:false},{x:21,front:true}];
// Rendering order is far rear, far front, near rear, near front.
function rawDogBody(p){
  p=phase(p);
  const pitch=-6*Math.cos(tau*(p-.05)),r=rad(pitch);
  const shift=curve([[0,4,0],[.25,2,-14],[.48,-4,0],[.72,-1,20],[.92,4,0],[1,4,0]],p);
  let lift=curve([[0,-1,0],[.12,1,0],[.28,-3,-25],[.4,-6,0],[.48,0,0],[.64,1,0],[.8,-2,-30],[.92,-5,0],[1,-1,0]],p);
  // The torso yields under load; never stretch a planted leg to reach it.
  pawRoots.forEach((root,index)=>{
    const {hock}=pawTarget(p,index),localX=root.x+(root.front?0:shift),localY=(root.front?-37:-35)+31;
    const x=localX*Math.cos(r)-localY*Math.sin(r),base=-31+localX*Math.sin(r)+localY*Math.cos(r);
    const reach=(root.front?36:37)-.03,dy=Math.sqrt(Math.max(0,reach**2-(hock.x-x)**2));
    lift=Math.max(lift,hock.y-dy-base);
  });
  return {lift,pitch,shift};
}
// Smooth the entire periodic support envelope, not each isolated pose. A fixed
// clearance offset preserves reach while removing sharp stance-switch jolts.
const dogSamples=384,dogLiftRaw=Array.from({length:dogSamples},(_,i)=>rawDogBody(i/dogSamples).lift);
const dogLiftSmooth=dogLiftRaw.map((_,i)=>{let total=0,weight=0;for(let k=-18;k<=18;k++){const w=Math.exp(-k*k/128);total+=w*dogLiftRaw[(i+k+dogSamples)%dogSamples];weight+=w;}return total/weight;});
const dogLiftClearance=Math.max(0,...dogLiftRaw.map((v,i)=>v-dogLiftSmooth[i]))+.025;
export function naturalDogBody(p){
  const x=phase(p)*dogSamples,i=Math.floor(x),t=x-i,at=k=>dogLiftSmooth[(k+dogSamples)%dogSamples];
  const a=at(i-1),b=at(i),c=at(i+1),d=at(i+2);
  const lift=.5*(2*b+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t)+dogLiftClearance;
  return {...rawDogBody(p),lift};
}
function pawTarget(p,index){
  const root=pawRoots[index],q=phase(p-PAW_PHASES[index]),stance=.24,speed=NATURAL_SPEED.dog*NATURAL_CYCLE.dog;
  const front=root.front?41:-3;
  let x=front-speed*q,y=0;
  if(q>=stance){
    const back=front-speed*stance;
    x=curve(root.front?[[stance,back,-speed],[.42,3,0],[.64,16,115],[.85,42,30],[1,front,-speed]]:[[stance,back,-speed],[.38,-43,0],[.54,-30,130],[.76,1,80],[.87,6,0],[1,front,-speed]],q);
    y=curve(root.front?[[stance,0,0],[.42,-8,-20],[.64,-14,0],[.85,-17,0],[.94,-12,45],[1,0,0]]:[[stance,0,0],[.38,-15,-30],[.58,-18,0],[.79,-12,35],[1,0,0]],q);
  }
  const foot={x:x+(index===2?4:index===3?5:0),y};
  // The wrist/hock folds during recovery, rather than translating a rigid paw.
  const fold=q<stance?0:Math.sin(Math.PI*(q-stance)/(1-stance));
  const metAngle=rad(root.front?Math.atan2(2,7)*180/Math.PI-83*fold:Math.atan2(7,10)*180/Math.PI+60*fold);
  const metLength=root.front?Math.hypot(2,7):Math.hypot(7,10);
  const hock={x:foot.x-metLength*Math.sin(metAngle),y:foot.y-metLength*Math.cos(metAngle)};
  return {foot,hock,stance:q<stance,fold};
}
export function naturalPaw(p,index){
  const root=pawRoots[index],{foot,hock,stance,fold}=pawTarget(p,index),torso=naturalDogBody(p),r=rad(torso.pitch);
  const localX=root.x+(root.front?0:torso.shift),localY=(root.front?-37:-35)+31;
  const hip={x:localX*Math.cos(r)-localY*Math.sin(r),y:-31+localX*Math.sin(r)+localY*Math.cos(r)+torso.lift};
  return {hip,foot,hock,knee:joint(hip,hock,root.front?16:17,20,root.front?-1:1),stance,fold};
}
function pawPath(p,index){
  const {hip,knee,hock,foot,fold}=naturalPaw(p,index),root=pawRoots[index];
  return `M${n(hip.x-root.x)} ${n(hip.y)}L${n(knee.x-root.x)} ${n(knee.y)}L${n(hock.x-root.x)} ${n(hock.y)}L${n(foot.x-root.x)} ${n(foot.y)}l${n(5-9*fold)} ${n(-2*fold)}`;
}
const frames=(name,fn)=>`@keyframes ${name}{${Array.from({length:97},(_,i)=>`${n(i*100/96)}%{${fn(i/96)}}`).join('')}}`;
export const naturalGaitCSS=[
  ...[false,true].flatMap(run=>{
    const id=run?'run':'walk';
    return [frames(`park-natural-${id}-leg`,p=>`d:path('${legPath(p,run)}')`),
      frames(`park-natural-${id}-anchor`,p=>footTransform(p,run)),
      frames(`park-natural-${id}-arm`,p=>`transform:rotate(${n(naturalArm(p,run).upper)}deg)`),
      frames(`park-natural-${id}-elbow`,p=>`transform:rotate(${n(naturalArm(p,run).fore)}deg)`),
      frames(`park-natural-${id}-head`,p=>`transform:translateY(-125px) rotate(${n(-naturalLean(p,run)*.55)}deg) translateY(125px)`),
      frames(`park-natural-${id}-body`,p=>{const {hip}=naturalHuman(p,run);return `transform:translate(${hip.x}px,${n(hip.y+58)}px) translateY(-58px) rotate(${n(naturalLean(p,run))}deg) scale(${NATURAL_BODY_SCALE}) translateY(58px)`;})];
  }),
  frames('park-natural-push-body',p=>{const {hip}=naturalHuman(p);return `transform:translateY(${n(hip.y+58)}px) translateY(-58px) rotate(${n(naturalLean(p)+10)}deg) scale(${NATURAL_BODY_SCALE}) translateY(58px)`;}),
  ...['a','b'].map(side=>frames(`park-natural-push-${side}`,p=>{const {shoulder:s,elbow:e,grip:g}=naturalPush(p,side);return `d:path('M${n(s.x)} ${n(s.y)}L${n(e.x)} ${n(e.y)}L${g.x} ${g.y}')`;})),
  ...pawRoots.map((_,i)=>frames(`park-natural-paw-${i}`,p=>`d:path('${pawPath(p,i)}')`)),
  frames('park-natural-dog-spine',p=>{const {shift}=naturalDogBody(p),rear=-25+shift,arch=-48-shift*.35;return `d:path('M${n(rear-6)}-31C${n(rear-8)} ${n(arch)} 7 ${n(arch-2)} 25-39C28-24 14-19 ${n(rear+3)}-20Q${n(rear-8)}-20 ${n(rear-6)}-31Z')`;}),
  frames('park-natural-dog-tail',p=>{const {shift}=naturalDogBody(p);const tip=-35+3*Math.sin(tau*p);return `d:path('M${n(-25+shift)}-37Q${n(-46+shift)}-42 ${n(-66+shift)} ${n(tip)}')`;}),
  frames('park-natural-dog-body',p=>{const b=naturalDogBody(p);return `transform:translateY(${n(b.lift)}px) translateY(-31px) rotate(${n(b.pitch)}deg) translateY(31px)`;})
].join('');
