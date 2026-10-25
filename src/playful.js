// Theme-only interactions. No tracking or extra saved state.
import {initPlayfulTyping} from './playful-typing.js';
import { t } from './i18n.js';
export function initPlayful() {
  const root = document.documentElement;
  initPlayfulTyping();
  const controls=document.querySelector('.site-header .site-controls');
  function syncHeader(){
    const compact=root.dataset.theme==='playful'&&window.scrollY>4;
    root.classList.toggle('playful-scrolled',compact);
    controls.inert=compact;
  }
  window.addEventListener('scroll',syncHeader,{passive:true});
  document.addEventListener('themechange',syncHeader);
  syncHeader();
}
