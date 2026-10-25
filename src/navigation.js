import { cvContent } from './content/cv.js';
import { getLocale, t } from './i18n.js';

export const pageNames = ['home','bio','portfolio','statement','manifesto','cv','contacts'];
export function pageFromPath(pathname) {
  const name = pathname.split('/').pop().replace(/\.html$/, '');
  return pageNames.includes(name) ? name : 'home';
}
export const getPage = () => pageFromPath(location.pathname);
export function pageUrl(page, current) {
  const url = new URL(current);
  const selected = pageNames.includes(page) ? page : 'home';
  url.pathname = selected === 'home' ? '/' : `/${selected}.html`;
  url.hash = '';
  return url.pathname + url.search;
}

export function initNavigation() {
  const root = document.documentElement;
  const menu = document.querySelector('.side-menu');
  const panel = document.querySelector('#side-panel');
  const toggle = document.querySelector('#menu-toggle');
  const backdrop = document.querySelector('#menu-backdrop');
  let open = false, focusTimer, currentPage;
  function setOpen(value, focus = false) {
    clearTimeout(focusTimer);
    open = value;
    menu.dataset.open = String(value);
    toggle.setAttribute('aria-expanded', String(value));
    panel.inert = !value;
    panel.setAttribute('aria-hidden', String(!value));
    backdrop.hidden = !value;
    if (value && focus) {
      const focusFirstLink = () => panel.querySelector('a').focus({preventScroll:true});
      focusFirstLink();
      // The panel may still be transitioning from visibility:hidden.
      focusTimer=setTimeout(() => {
        if (open && document.activeElement === toggle) focusFirstLink();
      },220);
    }
  }
  function closeMenu(restore = false) {
    const inside = panel.contains(document.activeElement);
    if (restore && inside) toggle.focus();
    setOpen(false);
  }
  toggle.addEventListener('click', () => open ? closeMenu(true) : setOpen(true, true));
  backdrop.addEventListener('click', () => closeMenu(true));
  document.querySelector('#menu-close').addEventListener('click', () => closeMenu(true));
  menu.addEventListener('focusout', event => {
    if (event.relatedTarget && !menu.contains(event.relatedTarget)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) { event.preventDefault(); closeMenu(true); }
  });
  function sync() {
    const page = getPage();
    document.querySelector('#cv-content').innerHTML = cvContent[getLocale()];
    const language = getLocale();
    const documentUrl = page => `/downloads/anastasia-zamaraeva-${page}-${language}.pdf`;
    if (['bio','statement','cv','portfolio','manifesto'].includes(page)) {
      const download = document.querySelector('#document-download');
      download.href = documentUrl(page);
      download.textContent = t('downloadDocument',{title:t('page' + page[0].toUpperCase() + page.slice(1)),language:language.toUpperCase()});
    }
    document.querySelectorAll('[data-document-file]').forEach(link => {
      link.href = documentUrl(link.dataset.documentFile);
      if (link.hasAttribute('download')) link.download = `Anastasia_Zamaraeva_Portfolio_${language.toUpperCase()}.pdf`;
    });
    document.querySelectorAll('.document-links [data-page-link]').forEach(link => {link.hidden=link.dataset.pageLink===page;});
    root.dataset.page = page;
    document.querySelectorAll('[data-page-link]').forEach(link => {
      link.href = pageUrl(link.dataset.pageLink, location.href);
      if (link.dataset.pageLink === page) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    document.title = page === 'home' ? t('pageTitle') : `${t('page' + page[0].toUpperCase() + page.slice(1))} — ${t('authorName')}`;
    if (currentPage !== page) {
      currentPage = page;
      document.dispatchEvent(new CustomEvent('pagechange', { detail: { page } }));
    }
  }
  document.querySelectorAll('[data-page-link]').forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu();
    history.pushState(null, '', pageUrl(link.dataset.pageLink, location.href));
    // Closing a project through navigation also releases its media and scroll lock.
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    sync();
    const heading = document.querySelector(getPage() === 'home' ? '#hero-title' : `#page-${getPage()}-title`);
    heading?.setAttribute('tabindex','-1');
    heading?.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
  }));
  window.addEventListener('popstate', () => { closeMenu(); sync(); });
  document.addEventListener('languagechange', sync);
  document.addEventListener('themechange', sync);
  const header = document.querySelector('.site-header');
  new ResizeObserver(() => root.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`)).observe(header);
  sync();
}
