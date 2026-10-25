// Local playable based on the supplied Godot scene. No engine, APIs or storage.
export const ergoMutations = [
  {id:'shell',order:400,group:'covering',ru:'Плотный панцирь',en:'Dense shell'},
  {id:'fins',order:500,ru:'Плавники',en:'Fins'},
  {id:'small_buds',order:800,ru:'Колониальное почкование',en:'Colonial budding'},
  {id:'large_ears',order:200,back:true,ru:'Большие уши',en:'Large ears'},
  {id:'muscular_tail',order:1601,ru:'Мускулистый хвост',en:'Muscular tail'},
  {id:'moisture_skin',order:1200,group:'covering',ru:'Влагоудерживающая кожа',en:'Moisture-retaining skin'},
  {id:'mucus_gloss',order:700,group:'covering',ru:'Защитная слизь',en:'Protective mucus'},
  {id:'fur',order:600,group:'covering',ru:'Шерсть',en:'Fur'},
];
export const createErgoState = () => ({clicks:0,round:0,mutations:[],complete:false});
export function advanceErgo(state, available, random=Math.random) {
  if(state.complete)return state;
  const candidates=ergoMutations.filter(m=>available.includes(m.id)&&!state.mutations.includes(m.id));
  if(!candidates.length)return state;
  const clicks=state.clicks+1;
  if(clicks<3)return {...state,clicks};
  const chosen=candidates[Math.min(candidates.length-1,Math.floor(random()*candidates.length))];
  const round=state.round+1;
  return {clicks:0,round,mutations:[...state.mutations,chosen.id],complete:round===3};
}

export function ergoWater() {
  // environment_background.gd, passive water. Continuous fill fixes export gaps.
  const rays=Array.from({length:5},(_,i)=>{const x=1600*(.08+i*.21);return `<path d="M${x} 0h144l224 648H${x-64}Z"/>`;}).join('');
  const plants=Array.from({length:9},(_,i)=>{
    const x=1600*(.03+i*.12),y=900*(.91+.025*Math.sin(i*2));
    return `<path class="ergo-plant" style="--delay:${-i*.6}s" d="M${x} ${y}L${x+7*Math.sin(i)} 720L${x-12*Math.sin(i)} ${900*(.69+.03*(i%3))}"/>`;
  }).join('');
  const bubbles=Array.from({length:16},(_,i)=>`<circle class="ergo-bubble" style="--delay:${-i*1.3}s;--duration:${9+i%5*2}s" cx="${(112+i*219)%1600}" cy="${100+(i*83)%520}" r="${3+i%3*2}"/>`).join('');
  return `<svg class="ergo-water" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="ergo-water-gradient" x2="0" y2="1"><stop stop-color="#9ee4e8"/><stop offset="1" stop-color="#3f9fb8"/></linearGradient></defs><rect width="1600" height="900" fill="url(#ergo-water-gradient)"/><g class="ergo-light-rays" fill="#e8fff4" opacity=".12">${rays}</g><path d="M0 720L288 684L608 738L992 693L1344 729L1600 675V900H0Z" fill="#d6c58a"/><g stroke="#398c78" stroke-opacity=".82" stroke-width="12.8" stroke-linecap="round" fill="none">${plants}</g><g fill="#e5ffff" opacity=".48">${bubbles}</g></svg>`;
}

const hand=`<span class="ergo-tap" aria-hidden="true"><span class="ergo-tap-ring"></span><span class="ergo-tap-ring ring-second"></span><svg class="ergo-hand" viewBox="0 0 100 120"><path d="M31 57V15C31 3 46 3 46 15V43C48 35 60 37 60 46V48C64 40 75 44 75 53V56C80 48 91 54 89 65L86 91Q85 106 72 112L48 114Q35 108 29 99L10 75C2 65 13 56 21 64L31 74Z" fill="#fffdf3" stroke="#24414a" stroke-width="4" stroke-linejoin="round"/><path d="M46 43V66M60 48V68M75 56V72" fill="none" stroke="#24414a" stroke-width="3" stroke-linecap="round"/></svg></span>`;

export function ergoMarkup(c) {
  return `${ergoWater()}<h3 class="ergo-appeal"><span>${c.lead}</span><span>${c.goal}</span></h3><button class="ergo-play" type="button" aria-label="${c.tap}" disabled><span class="ergo-creature"><span class="ergo-body-stack"><img class="ergo-base" src="/assets/ergo-character.png" width="1024" height="1024" alt=""><span class="ergo-mutations"></span></span></span>${hand}</button><div class="ergo-progress"><p class="ergo-count" role="status" aria-live="polite">${c.loading}</p><div class="ergo-meter" role="progressbar" aria-label="${c.progress}" aria-valuemin="0" aria-valuemax="3" aria-valuenow="0"><span></span></div><p class="ergo-reward" role="status" aria-live="polite"></p><button class="ergo-retry" type="button" hidden>${c.retry}</button><a class="ergo-install" href="/downloads/ergo-windows.zip" download aria-label="${c.install}. ${c.download}" title="${c.download}" hidden>${c.install}</a></div><section class="ergo-ending" aria-labelledby="ergo-ending-title" hidden><div class="ergo-ending-card"><h3 id="ergo-ending-title">${c.extinct}</h3><a class="ergo-why" href="#project/ergo">${c.why}</a></div></section>`;
}

function loadMutation(mutation,signal) {
  return new Promise(resolve=>{
    const image=new Image();
    const finish=result=>{image.onload=null;image.onerror=null;signal.removeEventListener('abort',abort);resolve(result);};
    const abort=()=>finish(null);
    image.onload=()=>finish({mutation,image});image.onerror=()=>finish(null);
    signal.addEventListener('abort',abort,{once:true});
    image.src=`/assets/ergo-${mutation.id}.png`;
    if(signal.aborted)abort();
  });
}

export function mountErgo(scene,c,{signal,locale='ru'}) {
  const play=scene.querySelector('.ergo-play'),count=scene.querySelector('.ergo-count');
  const meter=scene.querySelector('.ergo-meter'),reward=scene.querySelector('.ergo-reward');
  const layers=scene.querySelector('.ergo-mutations'),install=scene.querySelector('.ergo-install');
  const retry=scene.querySelector('.ergo-retry'),body=scene.querySelector('.ergo-body-stack');
  const ending=scene.querySelector('.ergo-ending'),why=scene.querySelector('.ergo-why');
  let state=createErgoState(),assets=new Map(),busy=false,pulse=null;
  const remaining=()=>state.clicks===2?c.remainingOne:c.remaining.replace('{count}',String(3-state.clicks));
  function update() {
    count.textContent=state.complete?c.complete:remaining();
    meter.setAttribute('aria-valuenow',String(state.complete?3:state.clicks));
    meter.setAttribute('aria-valuetext',count.textContent);
    meter.querySelector('span').style.width=`${state.complete?100:state.clicks/3*100}%`;
    play.setAttribute('aria-label',`${c.tap}. ${state.complete?c.complete:remaining()}`);
    scene.dataset.ergoRounds=String(state.round);scene.dataset.ergoClicks=String(state.clicks);
  }
  async function prepare() {
    if(busy)return;busy=true;retry.hidden=true;count.textContent=c.loading;
    const loaded=await Promise.all(ergoMutations.map(m=>loadMutation(m,signal)));
    if(signal.aborted)return;
    assets=new Map(loaded.filter(Boolean).map(item=>[item.mutation.id,item]));busy=false;
    if(assets.size<3){count.textContent=c.loadError;retry.hidden=false;install.hidden=false;return;}
    play.disabled=false;install.hidden=true;update();
  }
  play.addEventListener('click',()=>{
    if(state.complete||play.disabled)return;
    const before=state;state=advanceErgo(state,[...assets.keys()]);if(state===before)return;
    scene.classList.add('ergo-engaged');pulse?.cancel();
    meter.classList.remove('ergo-meter-earned');
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // ErgoBody3D: click_scale=1+pulse*.012 plus the click_glow shader.
      pulse=body.animate([{transform:'scale(1)',filter:'brightness(1)'},{transform:'scale(1.012)',filter:'brightness(1.16)',offset:.12},{transform:'scale(1)',filter:'brightness(1)'}],{duration:230,easing:'ease-out'});
    }
    if(state.round!==before.round) {
      const id=state.mutations.at(-1),{mutation,image}=assets.get(id);
      image.className='ergo-layer';image.dataset.mutation=id;image.alt='';
      if(mutation.group){layers.querySelectorAll(`[data-group="${mutation.group}"]`).forEach(el=>el.remove());image.dataset.group=mutation.group;}
      image.style.zIndex=String(mutation.back?0:2000-mutation.order);layers.append(image);
      reward.textContent=c.mutation.replace('{name}',mutation[locale]);
      meter.classList.remove('ergo-meter-earned');void meter.offsetWidth;meter.classList.add('ergo-meter-earned');
    }
    update();
    if(state.complete){
      scene.classList.add('ergo-complete');play.disabled=true;
      ending.hidden=false;install.click();install.hidden=true;
      const notice=document.createElement('p');notice.className='ergo-downloading';
      notice.setAttribute('role','status');notice.textContent=c.downloading;
      ending.querySelector('.ergo-ending-card').append(notice);
      why.focus({preventScroll:true});
    }
  },{signal});
  retry.addEventListener('click',prepare,{signal});
  play.addEventListener('keydown',event=>{if(event.repeat&&['Enter',' '].includes(event.key))event.preventDefault();},{signal});
  signal.addEventListener('abort',()=>pulse?.cancel(),{once:true});prepare();
}
