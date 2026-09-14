import { supabase } from './supabaseClient.js';
import { getState } from './state.js';
import { qs, escapeHtml, showToast, formatDateTime } from './ui.js';
import { t, tField, getLocale } from './i18n.js';

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // rimuove accenti (é, à, ecc.)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function fetchPublishedPosts() {
  const { data, error } = await supabase.from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function fetchPostBySlug(slug) {
  const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('published', true).maybeSingle();
  if (error) { console.error(error); return null; }
  return data;
}

async function fetchAllPostsAdmin() {
  const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

// Accanto agli articoli scritti a mano, il blog mostra anche una selezione
// automatica da PubMed (rinnovata ogni 3 giorni, vedi Edge Function
// fetch-pubmed-articles e sql/schema.sql). In home se ne vedono solo 3 per
// volta, a rotazione ogni 15 minuti (calcolata su un blocco temporale
// assoluto, cosi' tutti i visitatori vedono la stessa terna nello stesso
// momento) finche' non si apre "Vedi tutti gli articoli".
const ROTATE_MS = 15 * 60 * 1000;
const GROUP_SIZE = 3;
let expanded = false;
let rotateTimer = null;

function currentGroup(posts) {
  const groupCount = Math.ceil(posts.length / GROUP_SIZE);
  if (groupCount <= 1) return posts;
  const bucket = Math.floor(Date.now() / ROTATE_MS);
  const start = (bucket % groupCount) * GROUP_SIZE;
  return posts.slice(start, start + GROUP_SIZE);
}

function postCardHtml(p) {
  const isPubmed = p.source === 'pubmed';
  const href = isPubmed ? p.external_url : `blog/${encodeURIComponent(p.slug)}`;
  const linkTarget = isPubmed ? ' target="_blank" rel="noopener"' : '';
  const badge = isPubmed ? `<span style="font-size:11px; color:var(--accent); border:1px solid var(--accent-deep); border-radius:20px; padding:2px 8px; margin-right:8px; vertical-align:2px;">${t('blog.pubmedTag')}</span>` : '';
  // Gli articoli PubMed non hanno un abstract tradotto (solo il titolo
  // originale, sempre in inglese): in lingue diverse dall'italiano mostriamo
  // un testo generico invece dell'estratto italiano salvato dalla Edge
  // Function, ed eventualmente il nome della rivista.
  const pubmedSub = isPubmed && getLocale() === 'it' && p.journal
    ? `<p class="desc" style="font-style:italic;">${escapeHtml(p.journal)}</p>`
    : isPubmed
      ? `<p class="desc" style="font-style:italic;">${p.journal ? escapeHtml(p.journal) + ' — ' : ''}${escapeHtml(t('blog.pubmedExcerpt'))}</p>`
      : `<p class="desc">${escapeHtml(tField(p, 'excerpt'))}</p>`;
  const displayTitle = isPubmed ? p.title : tField(p, 'title');
  return `
    <a href="${href}"${linkTarget} class="price-row" style="text-decoration:none; color:inherit;">
      <div>
        <h3>${badge}${escapeHtml(displayTitle)}</h3>
        ${pubmedSub}
      </div>
      <p class="amount" style="font-size:16px;">${isPubmed ? t('blog.pubmedRead') : t('blog.readMore')}</p>
    </a>
  `;
}

// Usata sia dal sito pubblico (index.html) sia, come no-op sicuro, se
// chiamata da app.html dopo aver salvato un articolo (li' #blogList non
// esiste, vedi lo stesso pattern in publicContent.js).
export async function renderPublicList() {
  const target = qs('#blogList');
  if (!target) return;
  const posts = await fetchPublishedPosts();
  if (!posts.length) {
    target.innerHTML = `<p class="text-dim">${escapeHtml(t('blog.empty'))}</p>`;
    return;
  }

  const draw = () => {
    const shown = expanded ? posts : currentGroup(posts);
    target.innerHTML = shown.map(postCardHtml).join('');
    if (posts.length > GROUP_SIZE) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'btn btn-ghost btn-small';
      toggle.style.marginTop = '24px';
      toggle.textContent = expanded ? t('blog.showFeatured') : `${t('blog.showAll')} (${posts.length})`;
      toggle.onclick = () => { expanded = !expanded; draw(); };
      target.appendChild(toggle);
    }
  };
  draw();

  if (rotateTimer) clearInterval(rotateTimer);
  rotateTimer = setInterval(() => { if (!expanded) draw(); }, 60 * 1000);
}

// FAQ: contenuto statico e tradotto (vedi i18n.js), non dal database — piu'
// semplice da mantenere per un numero ridotto di domande che cambiano di rado.
export function renderFaq() {
  const target = qs('#faqList');
  if (!target) return;
  const items = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
  ];
  target.innerHTML = items.map((item, i) => `
    <details class="faq-item" ${i === 0 ? 'open' : ''}>
      <summary>${escapeHtml(item.q)}</summary>
      <p class="text-dim">${escapeHtml(item.a)}</p>
    </details>
  `).join('');
}

let editingPostId = null;

export async function renderAdmin() {
  const list = qs('#blogAdminList');
  if (!list) return;
  const posts = await fetchAllPostsAdmin();
  if (!posts.length) {
    list.innerHTML = '<p class="text-dim" style="font-size:13px;">Nessun articolo ancora pubblicato.</p>';
    return;
  }
  list.innerHTML = posts.map((p) => `
    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; border:1px solid var(--line); border-radius:4px; padding:12px 16px;">
      <div>
        <div style="font-weight:500; font-size:13.5px;">${p.source === 'pubmed' ? '<span style="font-size:11px; color:var(--accent); border:1px solid var(--accent-deep); border-radius:20px; padding:1px 7px; margin-right:6px; vertical-align:1px;">PubMed</span>' : ''}${escapeHtml(p.title)} ${p.published ? '' : '<span class="text-dim" style="font-size:11.5px;">(bozza)</span>'}</div>
        <div class="text-dim" style="font-size:12px; margin-top:2px;">${formatDateTime(p.created_at)}${p.source === 'pubmed' && p.journal ? ' · ' + escapeHtml(p.journal) : ' · /blog/' + escapeHtml(p.slug)}</div>
      </div>
      <div style="display:flex; gap:8px; flex-shrink:0;">
        <button class="btn btn-ghost btn-small" data-edit-post="${p.id}" style="padding:5px 10px; font-size:12px;">Modifica</button>
        <button class="btn btn-ghost btn-small" data-delete-post="${p.id}" style="padding:5px 10px; font-size:12px;">Elimina</button>
      </div>
    </div>
  `).join('');
  list.querySelectorAll('[data-edit-post]').forEach((btn) => {
    btn.onclick = () => startEditPost(posts.find((p) => p.id === btn.dataset.editPost));
  });
  list.querySelectorAll('[data-delete-post]').forEach((btn) => {
    btn.onclick = () => deletePost(btn.dataset.deletePost);
  });
}

function startEditPost(post) {
  if (!post) return;
  editingPostId = post.id;
  qs('#blogTitleInput').value = post.title;
  qs('#blogExcerptInput').value = post.excerpt;
  qs('#blogContentInput').value = post.content;
  qs('#blogPublishedInput').checked = post.published;
  qs('#blogSaveBtn').textContent = 'Salva modifiche';
  qs('#blogCancelEditBtn').style.display = '';
  qs('#blogTitleInput').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
  editingPostId = null;
  qs('#blogTitleInput').value = '';
  qs('#blogExcerptInput').value = '';
  qs('#blogContentInput').value = '';
  qs('#blogPublishedInput').checked = true;
  qs('#blogSaveBtn').textContent = 'Pubblica articolo';
  qs('#blogCancelEditBtn').style.display = 'none';
}

async function savePost() {
  const { session } = getState();
  const title = qs('#blogTitleInput').value.trim();
  const excerpt = qs('#blogExcerptInput').value.trim();
  const content = qs('#blogContentInput').value.trim();
  const published = qs('#blogPublishedInput').checked;
  if (!title || !content) { showToast('Titolo e contenuto sono obbligatori.', 'error'); return; }

  if (editingPostId) {
    const { error } = await supabase.from('blog_posts').update({
      title, excerpt, content, published, updated_at: new Date().toISOString(), updated_by: session.user.id,
    }).eq('id', editingPostId);
    if (error) { showToast('Errore nel salvataggio.', 'error'); return; }
    showToast('Articolo aggiornato.', 'ok');
  } else {
    const baseSlug = slugify(title) || 'articolo';
    let slug = baseSlug;
    let attempt = 1;
    // Titoli molto simili potrebbero generare lo stesso slug: invece di
    // bloccare la pubblicazione, riprova con un suffisso numerico.
    for (;;) {
      const { error } = await supabase.from('blog_posts').insert({ slug, title, excerpt, content, published, updated_by: session.user.id });
      if (!error) break;
      if (error.code === '23505') { attempt += 1; slug = `${baseSlug}-${attempt}`; continue; }
      showToast('Errore nella pubblicazione.', 'error');
      return;
    }
    showToast('Articolo pubblicato.', 'ok');
  }
  resetForm();
  await renderAdmin();
  await renderPublicList();
}

async function deletePost(id) {
  if (!confirm('Eliminare definitivamente questo articolo? Non si può annullare.')) return;
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) { showToast('Errore nell\'eliminazione.', 'error'); return; }
  showToast('Articolo eliminato.', 'ok');
  await renderAdmin();
}

export function wireAdmin() {
  qs('#blogSaveBtn')?.addEventListener('click', savePost);
  qs('#blogCancelEditBtn')?.addEventListener('click', resetForm);
}
