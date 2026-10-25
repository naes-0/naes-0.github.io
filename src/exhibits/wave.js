import { getLocale } from '../i18n.js';

// A fictional search homepage for Undulation. Input stays in the form.
export const waveCopy = {
  ru: {
    brand: 'Яндэкс', tail: 'ндэкс', first: 'Я',
    slogan: 'Найдётся, о чём волноваться',
    label: 'Что вас волнует?', query: 'Волнение', search: 'Найти',
    suggestionsLabel: 'Попробуйте спросить',
    suggestions: ['почему я волнуюсь', 'как поймать волну', 'что меня волнует'],
  },
  en: {
    brand: 'Yandeks', tail: 'andeks', first: 'Y',
    slogan: 'Find something to worry about',
    label: 'What’s on your mind?', query: 'Undulation', search: 'Search',
    suggestionsLabel: 'Try asking',
    suggestions: ['what even is undulation', 'how to undull a life', 'smart words no one knows'],
  },
};

export function waveMarkup(c = {}) {
  const text = waveCopy[c.mediaLocale || getLocale()] || waveCopy.ru;
  return `<div class="wave-search-page">
    <div class="wave-search-identity">
      <h3 class="wave-search-logo" aria-label="${text.brand}"><span>${text.first}</span>${text.tail}</h3>
      <p class="wave-search-slogan">${text.slogan}</p>
    </div>
    <form class="wave-search-form" role="search">
      <label class="wave-search-label" for="wave-query">${text.label}</label>
      <div class="wave-search-box">
        <svg class="wave-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>
        <input id="wave-query" name="query" type="search" value="${text.query}" autocomplete="off" spellcheck="false">
        <button class="wave-search-submit" type="submit">${text.search}</button>
      </div>
      <div class="wave-search-suggestions" role="group" aria-label="${text.suggestionsLabel}">
        ${text.suggestions.map((query, index) => `<button type="button" data-wave-query="${index}">${query}</button>`).join('')}
      </div>
    </form>
  </div>`;
}

export function mountWave(scene, { signal, route }) {
  const form = scene.querySelector('.wave-search-form');
  const input = form.elements.query;
  form.addEventListener('submit', event => {
    event.preventDefault();
    route('wave', form.querySelector('[type="submit"]'));
  }, { signal });
  scene.querySelectorAll('[data-wave-query]').forEach(button => {
    button.addEventListener('click', () => {
      input.value = button.textContent;
      input.focus({ preventScroll: true });
    }, { signal });
  });
}
