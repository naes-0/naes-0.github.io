import { initNavigation } from './navigation.js';
import { initGallery } from './gallery.js';
import { initCube } from './experience.js';
import { initI18n, t } from './i18n.js';
import { initTheme } from './theme.js';
import { initPlayful } from './playful.js';
import { initAdGallery } from './exhibits/index.js';

initI18n();
initTheme();
initNavigation();
initGallery();
initCube();
initPlayful();
initAdGallery();

document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText('2003a.z@mail.ru'); status.textContent = t('copied'); }
  catch { status.textContent = t('copyFallback'); }
});
