export const themes = ['light','dark','playful'];
export const resolveTheme = (query, saved) => themes.includes(query)
  ? query : themes.includes(saved) ? saved : 'light';
export const getTheme = () => resolveTheme(document.documentElement.dataset.theme, null);

function savedTheme() {
  try { return localStorage.getItem('portfolio-theme'); } catch { return null; }
}
function syncControls() {
  const theme = getTheme();
  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
  });
  document.querySelector('meta[name="theme-color"]').content = {dark:'#121212',light:'#ffffff',playful:'#e0f0fb'}[theme];
}
export function setTheme(value, updateUrl = true) {
  const theme = resolveTheme(value, null);
  document.documentElement.dataset.theme = theme;
  if (updateUrl) {
    const url = new URL(location.href);
    if (theme === 'light') url.searchParams.delete('theme');
    else url.searchParams.set('theme', theme);
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    try { localStorage.setItem('portfolio-theme', theme); } catch { /* URL selection still works. */ }
  }
  syncControls();
  document.dispatchEvent(new CustomEvent('themechange', {detail:{theme}}));
}
export function initTheme() {
  setTheme(resolveTheme(new URL(location.href).searchParams.get('theme'), savedTheme()), false);
  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    button.addEventListener('click', () => setTheme(button.dataset.themeChoice));
  });
  window.addEventListener('popstate', () => {
    const theme = resolveTheme(new URL(location.href).searchParams.get('theme'), savedTheme());
    if (theme !== getTheme()) setTheme(theme, false);
  });
}

