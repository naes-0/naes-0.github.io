import { getPage } from '../navigation.js';
import {projects,localizeProject} from '../content/projects.js';
import {getLocale} from '../i18n.js';
import {getTheme} from '../theme.js';
import {copy,adOrder} from './content.js';
import {sceneMarkup,mountScene} from './scenes.js';

export function initAdGallery() {
  const feed=document.createElement('div');feed.id='ad-feed';
  document.querySelector('#project-grid').before(feed);
  const toggle=document.createElement('a');toggle.className='descriptions-link';toggle.href='#works';
  document.querySelector('.hero-bottom').append(toggle);
  const returnLink=document.createElement('button');returnLink.className='return-ads';returnLink.type='button';
  document.querySelector('.works-heading').append(returnLink);
  const worksLink=document.querySelector('.hero-works-link');
  let descriptions=new URL(location.href).searchParams.get('view')==='descriptions', lifecycle,observer;
  function route(id,opener) { document.dispatchEvent(new CustomEvent('projectrequest',{detail:{id,opener}})); }
  function render() {
    lifecycle?.abort();observer?.disconnect();lifecycle=new AbortController();
    const {signal}=lifecycle,common=copy[getLocale()];
    toggle.textContent=common.descriptions;returnLink.textContent=common.returnFeed;
    feed.replaceChildren();
    if(getTheme()!=='playful'||descriptions||getPage()!=='home')return;
    for(const [index,id] of adOrder.entries()) {
      const original=projects.find(p=>p.id===id),project=localizeProject(original,getLocale());
      const article=document.createElement('article');article.className=`portfolio-ad ad-${id}`;article.id=`ad-${id}`;article.dataset.ad=id;
      article.setAttribute('aria-label',project.title);
      const closeHref=id==='casino'?project.url:id==='ergo'?'/downloads/ergo-windows.zip':id==='regular-room'?'/downloads/regular-room-windows.zip':`#project/${id}`;
      const feedback=id==='ergo'?`<div class="ad-foot ergo-feedback"><button type="button" class="feedback-yes">${common.interested}</button><button type="button" class="feedback-no">${common.notInterested}</button></div>`:'';
      const exit=id==='paradigm'?'':id==='ergo'?`<a class="ad-close ergo-close" href="#ad-casino" aria-label="${common.close}">×</a>`:`<a class="ad-close" href="${closeHref}" ${id==='regular-room'?'download':''} aria-label="${common.close}">×</a>`;
      article.innerHTML=`<div class="ad-scene">${exit}${sceneMarkup(id,common[id],common,project)}</div>${feedback||`<div class="ad-foot"><a href="#project/${id}">${project.title}${id==='paradigm'?'':' ↗'}</a>${id==='paradigm'?'':`<div>${index?`<a class="ad-previous" href="#ad-${adOrder[index-1]}" aria-label="${common.previous}">↑</a>`:''}${index<adOrder.length-1?`<a class="ad-next" href="#ad-${adOrder[index+1]}">${common.next}</a>`:''}</div>`}</div>`}`;
      feed.append(article);
      if (id === 'ergo') {
        const feedbackBox = article.querySelector('.ergo-feedback');
        feedbackBox.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
          const thanks = document.createElement('p');
          thanks.textContent = getLocale() === 'en' ? 'Thank you!' : 'Спасибо!';
          thanks.tabIndex = -1; thanks.setAttribute('role','status');
          feedbackBox.replaceChildren(thanks); thanks.focus({preventScroll:true});
        }, {signal}));
      }
      mountScene(article,id,common[id],common,{signal,route,projectUrl:project.url,isActive:()=>article.classList.contains('ad-in-view')&&getTheme()==='playful'&&!descriptions&&!document.hidden&&!document.querySelector('#project-dialog').open});
    }
    observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('ad-in-view',entry.isIntersecting)),{threshold:.12});
    feed.querySelectorAll('.portfolio-ad').forEach(article=>observer.observe(article));
  }
  function sync(rebuild=true) {
    const active=getTheme()==='playful'&&getPage()==='home';
    document.documentElement.dataset.gallery=active&&!descriptions?'ads':'classic';
    worksLink.href=active?'#ad-ergo':'#works';
    feed.hidden=!active||descriptions;toggle.hidden=!active;returnLink.hidden=!active||!descriptions;
    if(rebuild)render();
  }
  function setView(value) {
    descriptions=value;const url=new URL(location.href);
    if(value)url.searchParams.set('view','descriptions');else url.searchParams.delete('view');
    history.replaceState(history.state,'',url.pathname+url.search+url.hash);sync();
  }
  worksLink.addEventListener('click',event=>{
    if(getTheme()!=='playful'||getPage()!=='home')return;
    event.preventDefault();
    if(descriptions)setView(false);
    const url=new URL(location.href);url.hash='ad-ergo';history.pushState(null,'',url.pathname+url.search+url.hash);
    const first=feed.querySelector('#ad-ergo');
    if(first)window.scrollTo({top:first.getBoundingClientRect().top+window.scrollY,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
  toggle.addEventListener('click',()=>setView(true));
  returnLink.addEventListener('click',()=>setView(false));
  document.addEventListener('pagechange',()=>sync());
  document.addEventListener('themechange',()=>sync());
  document.addEventListener('languagechange',()=>sync());
  window.addEventListener('popstate',()=>{const next=new URL(location.href).searchParams.get('view')==='descriptions';if(next!==descriptions){descriptions=next;sync();}});
  sync();
}
