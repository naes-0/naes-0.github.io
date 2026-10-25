// Approved study layers, promoted without re-tracing or flattening interactions.
import {derivatologyLayers,derivatologyEnglishLayers} from './derivatology-layers.js';

function layers(c){
  if(c.mediaLocale==='ru')return derivatologyLayers;
  return derivatologyEnglishLayers;
}

export function derivatologyMarkup(c) {
  const art=layers(c);
  return `<div class="deriv-promo heading-active clouds-active paused">
    <div class="deriv-visual">
      <div class="deriv-layer deriv-woman"><video class="deriv-woman-video" data-src="/assets/derivatology-woman.webm" poster="/assets/derivatology-woman-poster.webp" width="400" height="400" muted loop playsinline preload="none" aria-label="${c.reactionAlt}"></video><img class="deriv-woman-fallback" hidden src="/assets/derivatology-woman-poster.webp" width="400" height="400" alt="${c.reactionAlt}" loading="lazy"></div>
      <div class="deriv-layer deriv-heading">${art.heading}</div>
      <div class="deriv-layer deriv-clouds">${art.clouds}</div>
      <div class="deriv-layer deriv-ribbon">${art.ribbon}</div>
    </div>
    <h3 class="deriv-screenreader">${c.title} ${c.instruction}. ${c.ribbon}</h3>
    <div class="deriv-panel" data-locale="${c.mediaLocale}">
      <img class="deriv-panel-art" src="/assets/derivatology-panel-${c.mediaLocale}.webp" width="657" height="924" alt="" loading="lazy">
      <h4 class="deriv-screenreader">${c.panelTitle}</h4>
      <form class="ad-form deriv-form">
        <label class="deriv-screenreader" for="deriv-situation">${c.how}</label>
        <textarea id="deriv-situation" name="prompt" maxlength="1000" rows="3" placeholder="${c.placeholder}" autocomplete="off"></textarea>
        <div class="deriv-screenreader">${c.price}</div>
        <button class="ad-button deriv-cta" type="submit"><span class="deriv-screenreader">${c.cta}</span></button>
      </form>
    </div>
  </div>`;
}
