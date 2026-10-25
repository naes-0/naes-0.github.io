import { projectResources } from './content/resources.js';
import { getPage } from './navigation.js';
import { projects, selectProjects, localizeProject } from './content/projects.js';
import { getLocale, t } from './i18n.js';

function resourceLinks(project) {
  const names={presentation:'resourcePresentation',video:'resourceVideo',download:'resourceDownload',website:'resourceWebsite'};
  return `<div class="project-resources">${(projectResources[project.id] || []).map(resource => {
    const details = [resource.format,resource.bytes ? `${(resource.bytes / 1000000).toFixed(1)} ${getLocale() === 'ru' ? 'МБ' : 'MB'}` : ''].filter(Boolean);
    const label=t(project.id === 'fragmentary' && resource.kind === 'video' ? 'resourceListen' : names[resource.kind]) + (details.length ? ` (${details.join(', ')})` : '');
    return `<a class="text-link" href="${resource.url}" ${resource.download ? 'download' : 'target="_blank" rel="noopener noreferrer"'}>${label}</a>`;
  }).join('')}</div>`;
}

export function initGallery() {
  const grid = document.querySelector('#project-grid');
  const dialog = document.querySelector('#project-dialog');
  const content = document.querySelector('#dialog-content');
  const archive = document.querySelector('#archive-toggle');
  const close = document.querySelector('#close-dialog');
  let expanded = false, activeId = '', opener = null;
  document.addEventListener('projectrequest', event => {
    if (!projects.some(project => project.id === event.detail?.id)) return;
    opener = event.detail.opener;
    location.hash = `project/${event.detail.id}`;
  });

  function render() {
    const selected = selectProjects('all', true).map(project => localizeProject(project, getLocale()));
    grid.replaceChildren(...selected.map(project => {
      const article = document.createElement('article');
      article.className = 'project-card';
      article.dataset.project = project.id;
      // Values come exclusively from the checked-in editorial content, never user input.
      article.innerHTML = `<button type="button" aria-label="${t('openProject',{title:project.title})}"><div class="project-visual"><img src="/assets/${project.preview || project.image}" alt="${project.alt}" loading="lazy" width="1920" height="1080"></div><div class="project-meta"><h3>${project.title}</h3><span class="project-arrow" aria-hidden="true">↗</span></div><p class="project-type">${project.type}</p></button>`;
      article.querySelector('button').addEventListener('click', event => { opener = event.currentTarget; location.hash = `project/${project.id}`; });
      return article;
    }));
    updateVisibility();
    mountMedia(grid);
  }
  function updateVisibility() {
    const all = expanded || getPage() === 'portfolio';
    grid.querySelectorAll('.project-card').forEach((card,index) => { card.hidden = !all && index >= 4; });
    document.querySelector('#result-count').textContent = t('count',{count:all ? projects.length : 4});
    archive.hidden = getPage() === 'portfolio';
    archive.style.display = archive.hidden ? 'none' : '';
    archive.setAttribute('aria-expanded', String(expanded));
    archive.innerHTML = t(expanded ? 'less' : 'more');
  }
  archive.addEventListener('click', () => { expanded = !expanded; updateVisibility(); });
  function mountMedia(container) {
    container.querySelectorAll('img').forEach(img => {
      const failed = () => {
        if (img.nextElementSibling?.classList.contains('media-retry')) return;
        const retry = document.createElement('button'); retry.type = 'button'; retry.className='media-retry';
        retry.textContent=t('mediaUnavailable');
        retry.addEventListener('click', event => { event.stopPropagation(); retry.remove(); img.src=img.getAttribute('src'); });
        // A card is already a button; keep its error message non-interactive there.
        if (img.closest('.project-card')) { const message=document.createElement('span'); message.className='media-retry'; message.textContent=t('mediaError'); img.after(message); }
        else img.after(retry);
      };
      img.addEventListener('error',failed);
      if (img.complete && img.currentSrc && img.naturalWidth === 0) failed();
    });
  }

  function showProject(id) {
    const index = projects.findIndex(project => project.id === id);
    if (index < 0) return;
    const project = localizeProject(projects[index], getLocale());
    activeId = id;
    content.querySelectorAll('video').forEach(video => video.pause());
    const localVideos = (projectResources[project.id] || []).filter(resource => resource.kind === 'video' && resource.url.startsWith('/assets/') && resource.url !== `/assets/${project.video}`);
    content.innerHTML = `<div class="dialog-header"><p class="project-type">${project.type}</p><h2 id="dialog-title">${project.title}</h2></div><img class="dialog-cover" src="/assets/${project.preview || project.image}" alt="${project.alt}"><div class="dialog-body"><dl class="dialog-facts">${project.year ? `<dt>${t('year')}</dt><dd>${project.year}</dd>` : ''}<dt>${t('tools')}</dt><dd>${project.tools}</dd><dt>${t('format')}</dt><dd>${project.status}</dd></dl><div class="dialog-prose"><p class="intro">${project.intro}</p>${project.body.map(p => `<p>${p}</p>`).join('')}${resourceLinks(project)}</div></div><div class="dialog-gallery">${localVideos.map(resource => `<video class="dialog-video" controls playsinline preload="none" poster="/assets/${project.preview || project.image}" src="${resource.url}" aria-label="${t('videoAlt',{title:project.title})}"></video>`).join('')}${project.video ? `<figure><video class="dialog-video" controls playsinline preload="none" poster="/assets/${project.image}" src="/assets/${project.video}" aria-label="${t('videoAlt',{title:project.title})}"></video><figcaption class="media-caption">${project.caption || t('documentation')}</figcaption></figure>` : ''}${[project.image,...project.gallery].filter(src => src !== (project.preview || project.image)).map((src,i) => `<img src="/assets/${src}" alt="${i===0?project.alt:t('mediaAlt',{title:project.title,index:i+1})}" loading="lazy">`).join('')}${!project.video && project.caption ? `<p class="media-caption">${project.caption}</p>` : ''}</div><div class="dialog-navigation"><button data-prev>${t('prev')}</button><button data-next>${t('next')}</button></div>`;
    content.querySelector('[data-prev]').addEventListener('click', () => { location.hash = `project/${projects[(index-1+projects.length)%projects.length].id}`; });
    content.querySelector('[data-next]').addEventListener('click', () => { location.hash = `project/${projects[(index+1)%projects.length].id}`; });
    if (!dialog.open) {
      const focused = document.activeElement;
      if (focused?.matches('a[href^="#project/"], .ad-scene button, .ad-scene input')) opener = focused;
      dialog.showModal(); document.body.classList.add('modal-open');
    }
    dialog.scrollTop = 0;
    mountMedia(content);
    close.focus({preventScroll:true});
  }
  function closeProject() {
    if (!dialog.open) return;
    const closingId = activeId;
    content.querySelectorAll('video').forEach(video => video.pause());
    dialog.close();
    document.body.classList.remove('modal-open');
    activeId = '';
    if (opener?.isConnected && opener.getClientRects().length) opener.focus({preventScroll:true});
    else {
      const fallback = document.documentElement.dataset.gallery === 'ads' ? document.querySelector(`#ad-${closingId} .ad-close`) || document.querySelector('#works-title') : grid.querySelector(`[data-project="${closingId}"] button`) || document.querySelector('#works-title');
      const pageHeading = document.querySelector(`#page-${getPage()}-title`);
      (getPage() !== 'home' && getPage() !== 'portfolio' ? pageHeading : fallback)?.focus();
    }
  }
  function requestClose() {
    history.replaceState(null, '', `${location.pathname}${location.search}${['home','portfolio'].includes(getPage()) ? '#works' : `#page-${getPage()}-title`}`);
    closeProject();
  }
  close.addEventListener('click', requestClose);
  dialog.addEventListener('cancel', event => { event.preventDefault(); requestClose(); });
  dialog.addEventListener('click', event => { const r=dialog.getBoundingClientRect(); if(event.target===dialog && (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)) requestClose(); });
  function handleHash() {
    const match = location.hash.match(/^#project\/([a-z-]+)$/);
    if (match && projects.some(project => project.id === match[1])) showProject(match[1]);
    else if (activeId) closeProject();
  }
  window.addEventListener('hashchange', handleHash);
  document.addEventListener('languagechange', () => {
    const focused = document.activeElement;
    const scroll = dialog.scrollTop;
    const openerId = opener?.closest('[data-project]')?.dataset.project;
    render();
    if (openerId) opener = grid.querySelector(`[data-project="${openerId}"] button`);
    if (activeId) { showProject(activeId); dialog.scrollTop = scroll; }
    if (focused?.isConnected) focused.focus({preventScroll:true});
  });
  document.addEventListener('pagechange', render);
  render(); handleHash();
}
