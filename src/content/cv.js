import { onePager } from './one-pager.js';

const headings = {
  ru: { projects: 'Избранные проекты', education: 'Образование', skills: 'Инструменты и навыки', languages: 'Языки' },
  en: { projects: 'Selected projects', education: 'Education', skills: 'Tools and skills', languages: 'Languages' },
};
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

function renderOnePager(locale) {
  const content = onePager[locale];
  const labels = headings[locale];
  return `
    <h2>${escapeHTML(content.name)}</h2>
    <p>${escapeHTML(content.role)}<br>${escapeHTML(content.location)}<br><a href="mailto:${escapeHTML(content.email)}">${escapeHTML(content.email)}</a></p>
    <h2>${labels.projects}</h2>
    <p>${escapeHTML(content.projectsIntroduction)}</p>
    ${content.projects.map(project => `<h3>${escapeHTML(project.title)} (${project.year})</h3><p>${escapeHTML(project.summary)}</p>`).join('\n')}
    <h2>${labels.education}</h2>
    ${content.education.map(item => `<p>${escapeHTML(item)}</p>`).join('\n')}
    <h2>${labels.skills}</h2>
    ${content.skills.map(item => `<p>${escapeHTML(item)}</p>`).join('\n')}
    <h2>${labels.languages}</h2>
    ${content.languages.map(item => `<p>${escapeHTML(item)}</p>`).join('\n')}
  `;
}

export const cvContent = { ru: renderOnePager('ru'), en: renderOnePager('en') };
