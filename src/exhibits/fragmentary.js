import {getLocale} from '../i18n.js';

const icon=(name)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${name==='play'?'<path d="M8 5v14l11-7Z"/>':name==='previous'?'<path d="M5 5h2v14H5zm14 0v14L8 12Z"/>':'<path d="M17 5h2v14h-2zM5 5l11 7-11 7Z"/>'}</svg>`;

// Track selection stays in this scene. Play leads to the work and its real recording.
export function fragmentaryMarkup(c) {
  const en=(c.mediaLocale||getLocale())==='en';
  const demo=en?'demo':'демо';
  const names=['no u 1','fp1'];
  const tracks=names.map(name=>`${name} — ${demo}`);
  const labels=en?{play:'Open the work and recording',previous:'Previous track',next:'Next track',select:'Select track'}:{play:'Открыть проект и запись',previous:'Предыдущий трек',next:'Следующий трек',select:'Выбрать трек'};
  return `<div class="fp-player">
    <div class="fp-now">
      <div class="fp-artwork" aria-hidden="true"><svg viewBox="0 0 200 200"><path class="fp-note" d="M70 63Q70 59 74 58L139 45Q145 44 145 50V121C145 133 127 142 117 137C107 132 111 121 124 117C128 115 132 115 135 116V76L80 87V134C80 146 62 155 52 150C42 145 46 134 59 130C63 128 67 128 70 129Z"/></svg></div>
      <div class="fp-details">
        <h3 class="fp-title" aria-live="polite">${names[0]}</h3>
        <p class="fp-subtitle">${demo}</p>
        <div class="fp-timeline" aria-hidden="true"><span></span></div>
        <div class="fp-transport">
          <button type="button" class="fp-skip" data-fp-step="-1" aria-label="${labels.previous}">${icon('previous')}</button>
          <a class="fp-play" href="#project/fragmentary" aria-label="${labels.play}: ${tracks[0]}">${icon('play')}</a>
          <button type="button" class="fp-skip" data-fp-step="1" aria-label="${labels.next}">${icon('next')}</button>
        </div>
      </div>
    </div>
    <div class="fp-tracklist">${tracks.map((title,i)=>`<div class="fp-track${i===0?' is-current':''}"><button type="button" class="fp-track-select" data-fp-track="${i}" data-fp-title="${names[i]}" aria-pressed="${i===0}" aria-label="${labels.select}: ${title}"><span class="fp-track-icon" aria-hidden="true"><i></i><i></i><i></i></span><span class="fp-track-name">${title}</span></button><a class="fp-track-play" href="#project/fragmentary" aria-label="${labels.play}: ${title}">${icon('play')}</a></div>`).join('')}</div>
  </div>`;
}

export function mountFragmentary(scene,{signal}) {
  const tracks=[...scene.querySelectorAll('[data-fp-track]')];
  let current=0;
  function select(index){
    current=(index+tracks.length)%tracks.length;
    tracks.forEach((button,i)=>{
      button.setAttribute('aria-pressed',String(i===current));
      button.closest('.fp-track').classList.toggle('is-current',i===current);
    });
    scene.querySelector('.fp-title').textContent=tracks[current].dataset.fpTitle;
    scene.querySelector('.fp-play').setAttribute('aria-label',tracks[current].closest('.fp-track').querySelector('.fp-track-play').getAttribute('aria-label'));
  }
  scene.addEventListener('click',event=>{
    const track=event.target.closest('[data-fp-track]');
    const step=event.target.closest('[data-fp-step]');
    if(track)select(Number(track.dataset.fpTrack));
    if(step)select(current+Number(step.dataset.fpStep));
  },{signal});
}
