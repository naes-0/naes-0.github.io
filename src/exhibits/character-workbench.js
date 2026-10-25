import {components,readings} from './content.js';

export const characterIcons={
  build:'<svg class="character-arrow" viewBox="0 0 32 32" aria-hidden="true"><path d="M5 16H27M18 7L27 16L18 25"/></svg>',
  clear:'<span class="character-reset" aria-hidden="true">↶</span>',
  save:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m7 16 6 6L26 9"/></svg>',
};

export function characterIconButton(label,action,icon,disabled=false){
  return `<button class="character-tool" type="button" data-action="${action}" aria-label="${label}" title="${label}" ${disabled?'disabled':''}>${characterIcons[icon]}</button>`;
}

export function characterWorkbenchMarkup(c,common){
  return `<div class="character-studio"><h3 class="character-studio-title">${c.composeTitle}</h3><div class="character-workbench"><div class="parts-tray" role="group" aria-label="${c.title}">${components.map((p,i)=>`<button type="button" data-part="${i}" aria-pressed="false" aria-label="${p}: ${common.parts[i]}, ${readings[i]}"><span>${p}</span></button>`).join('')}</div><div class="character-transfer" aria-hidden="true">${characterIcons.build}</div><div class="character-paper"><div class="glyph-slots" aria-live="polite" aria-label="${c.build}"><span></span><span></span></div><div class="character-paper-tools">${characterIconButton(c.clear,'clear','clear')}${characterIconButton(c.build,'build','build',true)}</div></div></div><div class="character-result" role="status" tabindex="-1"></div></div>`;
}
