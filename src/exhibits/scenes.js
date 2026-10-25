import {butterflyLandscapeMarkup,mountButterflyLandscape} from './butterfly-landscape.js';
import {beachProtectionMarkup,mountBeachProtection} from './beach-protection.js';
import {waveMarkup,mountWave} from './wave.js';
import {communicationMarkup,mountCommunication} from './communication.js';
import {fragmentaryMarkup,mountFragmentary} from './fragmentary.js';
import {worldviewMarkup,mountWorldview} from './worldview.js';
import {paradigmAutumnMarkup,mountParadigmAutumn} from './paradigm-autumn.js';
import {copy,components,readings,characterResult} from './content.js';
import {improvementMarkup,mountImprovement} from './improvement.js';
import {getLocale,setLocale} from '../i18n.js';
import {ergoMarkup,mountErgo} from './ergo.js';
import {casinoMarkup,mountCasino} from './casino.js';
import {mountRoomVideo} from './room-video.js';
import {derivatologyMarkup} from './derivatology.js';
import {mountDerivatologyMedia} from './derivatology-media.js';
import {characterWorkbenchMarkup,characterIcons} from './character-workbench.js';

const button=(text,action,cls='')=>`<button type="button" class="ad-button ${cls}" data-action="${action}">${text}</button>`;
const form=(label,send)=>`<form class="ad-form"><input aria-label="${label}" name="prompt" required maxlength="240" placeholder="${label}" autocomplete="off"><button class="ad-button" type="submit">${send} ↑</button></form>`;
const description=(id,text)=>`<a class="ad-button" href="#project/${id}">${text}</a>`;
const download=(href,text)=>`<a class="ad-button" href="/downloads/${href}" download>${text}</a>`;

export function sceneMarkup(id,c,common,project) {
  const sceneCopy = {...c,mediaLocale:common===copy.en?'en':'ru'};
  switch(id) {
    case 'casino': return casinoMarkup(c,project.url);
    case 'ergo': return ergoMarkup(c);
    case 'regular-room': return `<img class="room-backdrop" src="/assets/regular-room-background.jpg" alt="" loading="lazy"><video class="room-backdrop room-video" data-src="/assets/regular-room-loop.mp4" muted loop playsinline preload="none" aria-hidden="true" hidden></video><div class="room-shade" aria-hidden="true"></div><div class="room-menu"><h3>${c.title}</h3>${download('regular-room-windows.zip',c.start)}${button(c.language,'room-language')}${description(id,c.exit)}</div>`;
    case 'learned-helplessness': return `<header class="helpless-heading"><h3>${c.title}</h3></header><div class="helpless-column"><div class="demo-chat" role="log" aria-live="polite"><p>${c.greeting}</p><p class="human">${c.humanOne}</p><p>${c.replyOne}</p></div><form class="helpless-composer"><textarea aria-label="${common.write}" name="prompt" required maxlength="240" placeholder="${common.write}" rows="2"></textarea><button type="submit">${common.send}</button></form></div>`;
    case 'improvement': return improvementMarkup(c);
    case 'derivatology': return derivatologyMarkup(c);
    case 'paradigm': return paradigmAutumnMarkup(sceneCopy,common);
    case 'wave': return waveMarkup(sceneCopy);
    case 'communication': return communicationMarkup(sceneCopy);
    case 'worldview': return worldviewMarkup(sceneCopy);
    case 'fragmentary': return fragmentaryMarkup(sceneCopy);
    case 'butterfly': return butterflyLandscapeMarkup(sceneCopy,common);
    case 'speech': return beachProtectionMarkup(sceneCopy,common);
    case 'characters': return characterWorkbenchMarkup(c,common);
    default: return description(id,common.about);
  }
}

export function mountScene(section,id,c,common,{signal,route,projectUrl,isActive}) {
  const scene=section.querySelector('.ad-scene');
  const on=(node,event,callback)=>node.addEventListener(event,callback,{signal});
  const status=()=>scene.querySelector('.ad-status');
  const later=(callback,delay=1400)=>{
    const timeout=setTimeout(()=>{if(!signal.aborted&&isActive())callback();},delay);
    signal.addEventListener('abort',()=>clearTimeout(timeout),{once:true});
  };
  const open=()=>route(id,scene.querySelector('button,a'));
  let submissions=0,clicks=0;
  if(id==='ergo') mountErgo(scene,c,{signal,locale:getLocale()});
  if(id==='casino') mountCasino(scene,c,{signal,isActive});
  if(id==='derivatology') mountDerivatologyMedia(scene,{signal,isActive});
  if(id==='paradigm') mountParadigmAutumn(scene,c,{signal,isActive,route});
  if(id==='speech') mountBeachProtection(scene,c,{signal,isActive,route});
  if(id==='butterfly') mountButterflyLandscape(scene,c,{signal,isActive});
  if(id==='regular-room'){
    mountRoomVideo(scene,{signal,isActive});
    on(scene.querySelector('[data-action="room-language"]'),'click',()=>setLocale(getLocale()==='ru'?'en':'ru'));
  }
  if(['learned-helplessness','derivatology'].includes(id)) {
    const form=scene.querySelector('form');
    let replyPending=false,replyTimeout;
    signal.addEventListener('abort',()=>clearTimeout(replyTimeout),{once:true});
    if(id==='learned-helplessness') {
      on(form,'keydown',event=>{
        if(event.target!==form.elements.prompt||event.key!=='Enter'||event.shiftKey||event.ctrlKey||event.altKey||event.metaKey||event.isComposing)return;
        event.preventDefault();
        if(!event.repeat&&form.elements.prompt.value.trim())form.requestSubmit();
      });
    }
    // Never store, log or send the visitor's input.
    on(form,'submit',event=>{
      event.preventDefault();
      if(id==='derivatology'){route(id,form.querySelector('button'));return;}
      if(replyPending)return;
      const input=form.elements.prompt;if(!input.value.trim())return;
      if(id==='learned-helplessness') {
        if(++submissions===2){location.assign(projectUrl);return;}
        const log=scene.querySelector('.demo-chat'), human=document.createElement('p'),reply=document.createElement('p');
        human.className='human';human.textContent=input.value;reply.textContent=c.reply;log.append(human);log.scrollTop=log.scrollHeight;
        replyPending=true;form.querySelector('button').disabled=true;log.setAttribute('aria-busy','true');
        replyTimeout=setTimeout(()=>{
          if(signal.aborted||!log.isConnected)return;
          log.append(reply);log.scrollTop=log.scrollHeight;log.removeAttribute('aria-busy');
          replyPending=false;form.querySelector('button').disabled=false;
        },1000);
      }
      input.value='';input.focus({preventScroll:true});
    });
  }
  if(id==='improvement') mountImprovement(scene,c,{signal,projectUrl});
  if(id==='wave') mountWave(scene,{signal,route});
  if(id==='communication') mountCommunication(scene,{signal,route,isActive});
  if(id==='fragmentary') mountFragmentary(scene,{signal});
  if(id==='worldview') mountWorldview(scene,{signal,route,isActive});
  if(id==='characters') {
    let parts=[],built=0,locked=false;const result=scene.querySelector('.character-result'),slots=scene.querySelector('.glyph-slots');
    const build=scene.querySelector('[data-action="build"]');
    const clear=()=>{parts=[];locked=false;result.replaceChildren();slots.innerHTML='<span></span><span></span>';build.disabled=true;scene.querySelectorAll('[data-part]').forEach(el=>{el.disabled=false;el.setAttribute('aria-pressed','false');});alignScene();};
    const alignScene=()=>requestAnimationFrame(()=>{
      if(signal.aborted||!scene.isConnected)return;
      const target=Math.max(0,window.scrollY+scene.getBoundingClientRect().bottom-window.innerHeight);
      if(Math.abs(target-window.scrollY)>1)window.scrollTo({top:target,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    });
    const revealResult=()=>requestAnimationFrame(()=>{
      if(signal.aborted||!result.isConnected)return;
      result.focus({preventScroll:true});
      // Use the same scene edge for building and clearing.
      alignScene();
    });
    const completeKnown=()=>{built++;locked=true;build.disabled=true;scene.querySelectorAll('[data-part]').forEach(el=>el.disabled=true);if(built>=3)open();else revealResult();};
    on(scene,'click',event=>{
      const part=event.target.closest('[data-part]'),action=event.target.closest('[data-action]')?.dataset.action;
      if(part&&parts.length<2&&!locked){parts.push(components[Number(part.dataset.part)]);slots.children[parts.length-1].textContent=parts.at(-1);part.setAttribute('aria-pressed','true');build.disabled=parts.length!==2;}
      if(action==='clear'||action==='another')clear();
      if(action==='build'&&parts.length===2&&!locked){
        locked=true;const known=characterResult(parts),explanation=parts.map(p=>{const i=components.indexOf(p);return `${p}, ${readings[i]} — ${common.parts[i]}`;}).join(' + ');
        build.disabled=true;result.replaceChildren();
        const preview=document.createElement('div');preview.className='character-result-glyph';preview.textContent=known?known.glyph:parts.join('');result.append(preview);
        if(known){slots.textContent=known.glyph;const detail=document.createElement('p');detail.textContent=`${known.pinyin} — ${common.known[known.meaning]}`;detail.setAttribute('aria-label',`${explanation}. ${c.formNote}`);result.append(detail);completeKnown();}
        else {
          const partsDetails=document.createElement('dl');partsDetails.className='character-parts-details';
          for(const part of parts){const i=components.indexOf(part),row=document.createElement('div'),term=document.createElement('dt'),meaning=document.createElement('dd');term.textContent=`${part} ${readings[i]}`;meaning.textContent=common.parts[i];row.append(term,meaning);partsDetails.append(row);}
          const invitation=document.createElement('p');invitation.className='character-invitation';invitation.textContent=c.newCombination;
          result.append(partsDetails,invitation);
          result.insertAdjacentHTML('beforeend',`<form class="new-character" aria-label="${c.newCombination}"><label>${c.pronunciation}<input name="sound" maxlength="60" required></label><label>${c.meaning}<input name="meaning" maxlength="100" required></label><button class="character-tool" type="submit" aria-label="${c.save}" title="${c.save}">${characterIcons.save}</button></form>`);
          revealResult();
        }
      }
    });
    on(scene,'submit',event=>{if(!event.target.matches('.new-character'))return;event.preventDefault();if(!event.target.reportValidity())return;open();});
  }
}
