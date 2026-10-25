import ru from './content/locales/ru.js';
import en from './content/locales/en.js';

export const messages = { ru, en };
let locale = 'ru';
export const normalizeLocale = value => value === 'en' ? 'en' : 'ru';
export const getLocale = () => locale;
export function translate(language, key, values = {}) {
  const template = messages[normalizeLocale(language)][key];
  if (typeof template !== 'string') throw new Error('Missing translation: ' + key);
  return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? '{' + name + '}'));
}
export const t = (key, values) => translate(locale, key, values);

function applyPage() {
  document.documentElement.lang = locale;
  document.title = t('pageTitle');
  // Only checked-in translations enter HTML; no user or external strings are evaluated.
  document.querySelectorAll('[data-i18n]').forEach(node => { node.innerHTML = t(node.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(node => { node.setAttribute('aria-label', t(node.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-content]').forEach(node => { node.setAttribute('content', t(node.dataset.i18nContent)); });
  document.querySelectorAll('[data-language]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.language === locale));
  });
  document.querySelector('#copy-status').textContent = '';
}
export function setLocale(language, updateUrl = true) {
  locale = normalizeLocale(language);
  if (updateUrl) {
    const url = new URL(location.href);
    if (locale === 'ru') url.searchParams.delete('lang');
    else url.searchParams.set('lang', locale);
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
  }
  applyPage();
  document.dispatchEvent(new CustomEvent('languagechange', { detail: { locale } }));
}
export function initI18n() {
  setLocale(new URL(location.href).searchParams.get('lang'), false);
  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => setLocale(button.dataset.language));
  });
  window.addEventListener('popstate', () => {
    const next = normalizeLocale(new URL(location.href).searchParams.get('lang'));
    if (next !== locale) setLocale(next, false);
  });
}

