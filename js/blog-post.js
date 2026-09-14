import { fetchPostBySlug } from './blog.js';
import { initCookieBanner, reopenCookieBanner } from './cookieConsent.js';
import { applyTranslations, wireLanguageSwitcher, tField, getLocale } from './i18n.js';

initCookieBanner();
document.getElementById('cookiePreferencesLink')?.addEventListener('click', (e) => { e.preventDefault(); reopenCookieBanner(); });

// Supporta sia /blog/<slug> (URL reale del sito, servita da questo stesso
// file grazie al rewrite in _redirects) sia /blog-post.html?slug=<slug>
// (utile per un test diretto del file senza passare dal rewrite).
function slugFromUrl() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts[0] === 'blog' && parts[1]) return decodeURIComponent(parts[1]);
  return new URLSearchParams(window.location.search).get('slug');
}

function showNotFound() {
  document.getElementById('postBody').style.display = 'none';
  document.getElementById('notFoundMsg').style.display = 'block';
}

let currentPost = null;

// Articoli PubMed non hanno traduzione (titolo/testo restano in inglese, la
// fonte e' comunque in quella lingua); gli articoli scritti a mano usano i
// campi tradotti (title_en, content_en, ...) con ricaduta sull'italiano.
function draw() {
  applyTranslations();
  if (!currentPost) return;
  const isPubmed = currentPost.source === 'pubmed';
  const title = isPubmed ? currentPost.title : tField(currentPost, 'title');
  const content = isPubmed ? currentPost.content : tField(currentPost, 'content');
  const excerpt = isPubmed ? currentPost.excerpt : tField(currentPost, 'excerpt');

  document.title = title + ' — Simone Ruggieri Fisioterapista';
  const descTag = document.getElementById('pageDescription');
  if (descTag && excerpt) descTag.setAttribute('content', excerpt);

  document.getElementById('postTitle').textContent = title;
  document.getElementById('postContent').textContent = content;
}

async function render() {
  wireLanguageSwitcher(document.getElementById('langSwitcherMount'), draw);
  const slug = slugFromUrl();
  if (!slug) { applyTranslations(); showNotFound(); return; }
  const post = await fetchPostBySlug(slug);
  if (!post) { applyTranslations(); showNotFound(); return; }
  currentPost = post;
  draw();
}

render();
