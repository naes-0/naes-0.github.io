// Foot trajectories drive the joints, rather than independently swinging bones.
const tau=Math.PI*2;
export function humanPose(phase,run=false){
  const p=((phase%1)+1)%1,stance=run?.34:.62;
  const speed=run?130*.64:52;
  const front=run?17:16,back=front-speed*stance;
  let x,y=0;
  if(p<stance)x=front-speed*p;
  else{
    const t=(p-stance)/(1-stance),ease=t*t*(3-2*t);
    x=back+(front-back)*ease;
    y=-(run?33:13)*Math.sin(Math.PI*t);
  }
  // Two compressed support phases and two genuine flight phases per run cycle.
  const half=p%.5;
  const lift=run?(half<.34?2*Math.sin(Math.PI*half/.34):-7*Math.sin(Math.PI*(half-.34)/.16)):2*Math.cos(2*tau*p);
  return {foot:{x,y},hip:{x:0,y:(run?-49:-51)+lift},stance:p<stance};
}
export function joint(a,b,upper,lower,bend=1){
  const dx=b.x-a.x,dy=b.y-a.y,raw=Math.hypot(dx,dy),d=Math.min(upper+lower-.001,Math.max(.001,raw));
  const along=(upper*upper-lower*lower+d*d)/(2*d),height=Math.sqrt(Math.max(0,upper*upper-along*along));
  return {x:a.x+dx/raw*along+bend*dy/raw*height,y:a.y+dy/raw*along-bend*dx/raw*height};
}
const n=v=>Number(v.toFixed(3));
function humanPath(p,run){
  const {foot,hip}=humanPose(p,run),knee=joint(hip,foot,29,28);
  // The shoe and this endpoint share the same parent translation.
  return `M${n(hip.x-foot.x)} ${n(hip.y-foot.y)}L${n(knee.x-foot.x)} ${n(knee.y-foot.y)}L0 0`;
}
function dogPath(p,front){
  const phase=(p+1)%1,stance=.42,hip={x:0,y:-29+1.5*Math.cos(2*tau*p)};
  let x=12-62.4*phase,y=0;
  if(phase>=stance){const t=(phase-stance)/(1-stance);x=(12-62.4*stance)+(62.4*stance)*t*t*(3-2*t);y=-12*Math.sin(Math.PI*t);}
  const hock={x:x-4,y:y-6},knee=joint(hip,hock,16,16,front?-1:1);
  return `M0 ${n(hip.y)}L${n(knee.x)} ${n(knee.y)}L${n(hock.x)} ${n(hock.y)}L${n(x)} ${n(y)}h5`;
}
function frames(name,value){return `@keyframes ${name}{${Array.from({length:41},(_,i)=>`${i*2.5}%{${value(i/40)}}`).join('')}}`;}
export const parkGaitCSS=[
  frames('park-walk-foot',p=>`d:path('${humanPath(p,false)}')`),
  frames('park-running-foot',p=>`d:path('${humanPath(p,true)}')`),
  frames('park-walk-body',p=>`transform:translateY(${n(humanPose(p).hip.y+58)}px)`),
  frames('park-running-body',p=>`transform:translateY(${n(humanPose(p,true).hip.y+58)}px) translateY(-58px) rotate(26deg) translateY(58px)`),
  frames('park-walk-shoe',p=>{const {foot}=humanPose(p);return `transform:translate(${n(foot.x)}px,${n(foot.y)}px)`}),
  frames('park-running-shoe',p=>{const {foot}=humanPose(p,true);return `transform:translate(${n(foot.x)}px,${n(foot.y)}px)`}),
  ...['a','b'].map(side=>frames(`park-push-${side}`,p=>{const shoulder={x:side==='a'?-7:7,y:-102+humanPose(p).hip.y+58},grip={x:side==='a'?40:46,y:-78},elbow=joint(shoulder,grip,28,26,-1);return `d:path('M${shoulder.x} ${n(shoulder.y)}L${n(elbow.x)} ${n(elbow.y)}L${grip.x} ${grip.y}')`})),
  frames('park-dog-front',p=>`d:path('${dogPath(p,true)}')`),
  frames('park-dog-rear',p=>`d:path('${dogPath(p,false)}')`)
].join('');
