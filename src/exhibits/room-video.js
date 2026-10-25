// Shared lifecycle for local decorative footage; never launches a game.
export function mountRoomVideo(scene,{signal,isActive,selector='.room-video'}) {
  const video=scene.querySelector(selector);
  if(!video)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const dialog=document.querySelector('#project-dialog');
  let visible=false,failed=false,frame=0,attempt=0;
  video.muted=true;
  const canPlay=()=>!signal.aborted&&!failed&&visible&&!reduced.matches&&isActive();
  function update(){
    const ticket=++attempt;
    if(!canPlay()){video.pause();video.hidden=reduced.matches||failed;return;}
    if(!video.getAttribute('src'))video.src=video.dataset.src;
    video.play().then(()=>{
      if(ticket!==attempt)return;
      if(canPlay())video.hidden=false;else video.pause();
    }).catch(()=>{if(ticket===attempt)video.hidden=true;});
  }
  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(update);}
  const visibility=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;schedule();
  },{threshold:.15});
  visibility.observe(scene);
  const modal=new MutationObserver(schedule);
  modal.observe(dialog,{attributes:true,attributeFilter:['open']});
  document.addEventListener('visibilitychange',schedule,{signal});
  reduced.addEventListener('change',schedule,{signal});
  scene.addEventListener('pointerdown',schedule,{signal});
  video.addEventListener('error',()=>{failed=true;video.hidden=true;},{signal});
  signal.addEventListener('abort',()=>{
    attempt++;cancelAnimationFrame(frame);visibility.disconnect();modal.disconnect();
    video.pause();video.removeAttribute('src');video.load();
  },{once:true});
}
