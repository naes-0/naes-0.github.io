import {gaitForLoop} from './improvement-natural-gait.js';
import {cleanupArt} from './improvement-art.js';
// Vector advertising scenery; original project documentation remains in the archive.
const hand=`<span class="cleanup-tap" aria-hidden="true"><i></i><i></i><svg viewBox="0 0 100 120"><path d="M31 57V15C31 3 46 3 46 15V43C48 35 60 37 60 46V48C64 40 75 44 75 53V56C80 48 91 54 89 65L86 91Q85 106 72 112L48 114Q35 108 29 99L10 75C2 65 13 56 21 64L31 74Z" fill="#fff8e4" stroke="#365749" stroke-width="4" stroke-linejoin="round"/></svg></span>`;

export function improvementMarkup(c) {
  return `<span class="cleanup-life-clock" aria-hidden="true"></span><div class="cleanup-art">${cleanupArt(false)}</div><h3 class="cleanup-headline"><span>${c.headline}</span><span>${c.instruction}</span></h3><div class="cleanup-litter">${hand}</div><button type="button" class="cleanup-play" aria-label="${c.addLabel}"></button><p class="cleanup-status visually-hidden" role="status"></p>`;
}

export function mountImprovement(scene,c,{signal,projectUrl}) {
  const art=scene.querySelector('.cleanup-art'),clock=scene.querySelector('.cleanup-life-clock');
  let loop=0;
  const syncGait=()=>{
    const life=art.querySelector('.cleanup-park-life');if(!life)return;
    life.dataset.gait=gaitForLoop(loop);life.dataset.loop=String(loop);
    clock.style.animationDuration=life.style.getPropertyValue(`--park-${life.dataset.gait}-clock`);
    // A different one-shot animation starts the next tour without seeking an
    // infinite animation backwards across its iteration boundary.
    clock.style.animationName=`park-loop-clock-${life.dataset.gait}`;
  };
  clock.addEventListener('animationend',event=>{
    if(event.target===clock&&event.animationName===`park-loop-clock-${gaitForLoop(loop)}`){loop++;syncGait();}
  },{signal});
  const dialog=document.querySelector('#project-dialog');
  const syncPause=()=>scene.toggleAttribute('data-park-paused',document.hidden||Boolean(dialog?.open));
  document.addEventListener('visibilitychange',syncPause,{signal});
  const modalObserver=new MutationObserver(syncPause);
  if(dialog)modalObserver.observe(dialog,{attributes:true,attributeFilter:['open']});
  signal.addEventListener('abort',()=>modalObserver.disconnect(),{once:true});
  syncPause();
  let clicks=0,count=0,portrait=false,aspect=0;
  const resize=new ResizeObserver(()=>{
    const rect=scene.getBoundingClientRect(),nextAspect=rect.width/rect.height,next=nextAspect<.8;
    if(Math.abs(nextAspect-aspect)>.001){portrait=next;aspect=nextAspect;art.innerHTML=cleanupArt(portrait,count,count,aspect);syncGait();for(const animation of clock.getAnimations())animation.currentTime=0;}
  });
  resize.observe(scene);
  signal.addEventListener('abort',()=>resize.disconnect(),{once:true});
  // The apparent close control is part of this deliberately unhelpful ad too.
  scene.addEventListener('click',event=>{
    event.preventDefault();
    clicks++;
    if(clicks===5){location.assign(projectUrl);return;}
    const previous=count;count=[1,2,4,8][clicks-1];
    // Update only bin layers: the residents' DOM and animation clocks stay intact.
    const next=document.createElement('template');
    next.innerHTML=cleanupArt(portrait,count,previous,aspect);
    for(const layer of art.querySelectorAll('[data-cleanup-layer]')){
      const fresh=next.content.querySelector(`[data-cleanup-layer="${layer.dataset.cleanupLayer}"]`);
      layer.replaceChildren(...fresh.childNodes);
    }
    scene.querySelector('.cleanup-status').textContent=c.status.replace('{count}',count);
  },{signal});
}
