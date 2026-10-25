// A drawing of the cube described in the artist's manifesto, not an archive work.
import { t } from './i18n.js';
export const cubeVertices = [
  [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
  [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
];
export const cubeEdges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
export const cubeFaces = [[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[0,3,7,4]];

export function projectCube(yaw, pitch) {
  return cubeVertices.map(([x,y,z]) => {
    const rx = x*Math.cos(yaw) + z*Math.sin(yaw);
    const rz = z*Math.cos(yaw) - x*Math.sin(yaw);
    return [rx, y*Math.cos(pitch)-rz*Math.sin(pitch), y*Math.sin(pitch)+rz*Math.cos(pitch)];
  });
}

export function initCube() {
  const canvas = document.querySelector('#cube');
  const context = canvas.getContext('2d');
  if (!context) return;
  const button = document.querySelector('#change-view');
  const reading = document.querySelector('#cube-reading');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const poses = [[.62,-.46], [0,0], [-.72,.52]];
  let caption = 'cubeInitial';
  function toggleCaption() {
    caption = caption === 'cubeInitial' ? 'cubeChanged' : 'cubeInitial';
    reading.textContent=t(caption);
  }
  let front, back;
  function palette() {
    const colors = getComputedStyle(canvas);
    front = colors.getPropertyValue('--cube-edge').trim();
    back = colors.getPropertyValue('--cube-back').trim();  }
  palette();
  let yaw=poses[0][0], pitch=poses[0][1], view=0, frame=0, pointer=null, width=0, height=0;

  function draw() {
    context.clearRect(0,0,width,height);
    const points=projectCube(yaw,pitch), scale=Math.min(width,height)*.235;
    // The same twelve edges remain present in every view. Depth only changes tone.
    cubeEdges.map(([a,b])=>({a,b,z:(points[a][2]+points[b][2])/2})).sort((a,b)=>a.z-b.z).forEach(({a,b,z})=>{
      context.strokeStyle=z<-.15?back:front;
      context.lineWidth=1.7;
      context.beginPath();
      context.moveTo(width/2+points[a][0]*scale,height/2+points[a][1]*scale);
      context.lineTo(width/2+points[b][0]*scale,height/2+points[b][1]*scale);
      context.stroke();
    });
  }
  function resize() {
    const rect=canvas.getBoundingClientRect(), dpr=Math.min(devicePixelRatio||1,2);
    width=rect.width; height=rect.height;
    canvas.width=Math.round(width*dpr); canvas.height=Math.round(height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0); draw();
  }
  function stop() { cancelAnimationFrame(frame); frame=0; }
  button.addEventListener('click',()=>{
    stop(); view=(view+1)%poses.length; toggleCaption();
    const start=[yaw,pitch], end=poses[view], at=performance.now();
    const step=now=>{
      const t=reduced.matches?1:Math.min((now-at)/650,1), ease=1-Math.pow(1-t,3);
      yaw=start[0]+(end[0]-start[0])*ease; pitch=start[1]+(end[1]-start[1])*ease; draw();
      frame=t<1?requestAnimationFrame(step):0;
    };
    frame=requestAnimationFrame(step);
  });
  canvas.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    stop(); pointer={id:event.pointerId,x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,changed:false};
    canvas.setPointerCapture(event.pointerId); canvas.classList.add('dragging');
  });
  canvas.addEventListener('pointermove',event=>{
    if(!pointer || pointer.id!==event.pointerId)return;
    yaw+=(event.clientX-pointer.x)*.008; pitch+=(event.clientY-pointer.y)*.008;
    pointer.x=event.clientX; pointer.y=event.clientY;
    if (!pointer.changed && Math.hypot(event.clientX-pointer.startX,event.clientY-pointer.startY)>3) {
      pointer.changed=true; toggleCaption();
    }
    draw();
  });
  function release(){pointer=null;canvas.classList.remove('dragging');}
  canvas.addEventListener('pointerup',release);
  canvas.addEventListener('pointercancel',release);
  canvas.addEventListener('lostpointercapture',release);
  document.addEventListener('languagechange',()=>{reading.textContent=t(caption);});
  document.addEventListener('themechange',()=>{palette();draw();});
  document.addEventListener('compositionchange',()=>{palette();draw();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  reduced.addEventListener('change',()=>{if(reduced.matches){stop();draw();}});
  new ResizeObserver(resize).observe(canvas);
  resize();
}
