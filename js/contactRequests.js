// Elenco delle richieste di contatto arrivate dal modulo del sito pubblico
// (solo staff, vedi RLS su contact_requests).
import { supabase } from './supabaseClient.js';
import { qs, el, showToast, escapeHtml, formatDateTime } from './ui.js';

function contactLinks(contact) {
  const raw = contact.trim();
  const safe = escapeHtml(raw);
  if (raw.includes('@')) return `<a href="mailto:${encodeURIComponent(raw)}" style="color:var(--accent);">${safe}</a>`;
  const digits = raw.replace(/[^\d+]/g, '');
  if (digits.replace(/\D/g, '').length < 6) return safe;
  const waDigits = digits.replace(/\D/g, '');
  const wa = waDigits.length <= 10 ? '39' + waDigits : waDigits;
  return `<a href="tel:${digits}" style="color:var(--accent);">${safe}</a> · <a href="https://wa.me/${wa}" target="_blank" rel="noopener" style="color:var(--accent);">WhatsApp</a>`;
}

function updateBadge(rows) {
  const badge = qs('#requestsBadge');
  if (!badge) return;
  const n = rows.filter((r) => r.status === 'nuova').length;
  badge.textContent = String(n);
  badge.style.display = n ? '' : 'none';
}

export async function render() {
  const list = qs('#requestsList');
  if (!list) return;
  const { data, error } = await supabase.from('contact_requests').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) {
    console.error(error);
    list.innerHTML = '<p class="text-dim">Non riesco a caricare le richieste.</p>';
    return;
  }
  updateBadge(data);
  if (!data.length) {
    list.innerHTML = '<p class="text-dim">Nessuna richiesta per ora.</p>';
    return;
  }
  list.innerHTML = '';
  data.forEach((r) => {
    const row = el('div', 'request-row' + (r.status === 'contattata' ? ' done' : ''), '');
    row.innerHTML = `
      <div class="rq-main">
        <div class="rq-name">${escapeHtml(r.full_name)}${r.status === 'nuova' ? '<span class="rq-badge">nuova</span>' : ''}</div>
        <div class="rq-meta">${contactLinks(r.contact)} · ${escapeHtml(formatDateTime(r.created_at))}${r.preferred_time ? ' · ' + escapeHtml(r.preferred_time) : ''}</div>
        ${r.message ? `<div class="rq-msg">${escapeHtml(r.message)}</div>` : ''}
      </div>
      <div class="rq-actions"></div>`;
    const actions = row.querySelector('.rq-actions');
    if (r.status === 'nuova') {
      const done = el('button', 'btn btn-ghost btn-small', 'Segna come contattata');
      done.onclick = async () => {
        const { error: e } = await supabase.from('contact_requests').update({ status: 'contattata', handled_at: new Date().toISOString() }).eq('id', r.id);
        if (e) { showToast('Errore nell\'aggiornamento.', 'error'); return; }
        render();
      };
      actions.appendChild(done);
    }
    const del = el('button', 'btn btn-ghost btn-small', 'Elimina');
    del.onclick = async () => {
      if (!confirm('Eliminare questa richiesta? Non si può annullare.')) return;
      const { error: e } = await supabase.from('contact_requests').delete().eq('id', r.id);
      if (e) { showToast('Errore nell\'eliminazione.', 'error'); return; }
      render();
    };
    actions.appendChild(del);
    list.appendChild(row);
  });
}
