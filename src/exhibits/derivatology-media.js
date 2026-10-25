// User-supplied transparent footage: preserve its native timing and hard-cut loop.
export function mountDerivatologyMedia(scene,{signal,isActive}) {
  const video=scene.querySelector('.deriv-woman-video');
  if(!video||signal.aborted)return;
  const promo=scene.querySelector('.deriv-promo');
  const fallback=scene.querySelector('.deriv-woman-fallback');
  const article=scene.closest('.portfolio-ad')||scene;
  const dialog=document.querySelector('#project-dialog');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let failed=false,attempt=0,frame=0;
  video.muted=true;
  const active=()=>!signal.aborted&&!document.hidden&&!reduced.matches&&isActive();
  const showPoster=()=>{
    video.hidden=true;
    if(fallback)fallback.hidden=false;
  };
  function update(){
    const ticket=++attempt;
    const running=active();
    promo?.classList.toggle('paused',!running);
    if(!running||failed){
      video.pause();
      if(reduced.matches||failed)showPoster();
      return;
    }
    // No request until the feed marks this article visible and active.
    if(!video.getAttribute('src'))video.src=video.dataset.src;
    video.play().then(()=>{
      if(ticket!==attempt)return;
      if(!active()){video.pause();return;}
      video.hidden=false;
      if(fallback)fallback.hidden=true;
    }).catch(()=>{
      if(ticket===attempt)showPoster();
    });
  }
  function schedule(){
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(update);
  }
  // The feed owns visibility; observe its class rather than duplicate thresholds.
  const visibility=new MutationObserver(schedule);
  visibility.observe(article,{attributes:true,attributeFilter:['class']});
  const modal=new MutationObserver(schedule);
  if(dialog)modal.observe(dialog,{attributes:true,attributeFilter:['open']});
  reduced.addEventListener('change',schedule,{signal});
  document.addEventListener('visibilitychange',schedule,{signal});
  scene.addEventListener('pointerdown',schedule,{signal});
  video.addEventListener('error',()=>{
    failed=true;
    ++attempt;
    video.pause();
    showPoster();
  },{signal});
  signal.addEventListener('abort',()=>{
    ++attempt;
    cancelAnimationFrame(frame);
    visibility.disconnect();
    modal.disconnect();
    video.pause();
    video.removeAttribute('src');
    video.load();
  },{once:true});
  update();
}
