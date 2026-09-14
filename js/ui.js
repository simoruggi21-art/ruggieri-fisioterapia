// Piccole utility di DOM condivise da tutti i moduli.

export function qs(sel, root = document) {
  return root.querySelector(sel);
}

export function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

export function showToast(message, type = 'ok') {
  const toast = el('div', `toast ${type}`, message);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3800);
}

export function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Trasforma i link (es. YouTube) scritti nel testo in link cliccabili.
// Il testo viene sempre prima escapato: sicuro anche se contiene caratteri HTML.
export function linkifyHtml(str) {
  const escaped = escapeHtml(str);
  return escaped.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
    const clean = url.replace(/[.,;:!?)]+$/, '');
    const trailing = url.slice(clean.length);
    return `<a href="${clean}" target="_blank" rel="noopener" style="color:var(--accent); border-bottom:1px solid var(--accent-deep);">${clean}</a>${trailing}`;
  });
}

export function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

export function initialsOf(name) {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

// Colore deterministico dal nome, cosi' lo stesso paziente ha sempre lo
// stesso colore invece di uno casuale ad ogni render.
export function avatarColor(name) {
  let hash = 0;
  for (const ch of String(name ?? '')) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 38%, 42%)`;
}

export function avatarHtml(name) {
  return `<div class="avatar-circle" style="background:${avatarColor(name)};">${escapeHtml(initialsOf(name))}</div>`;
}

export function computeAge(birthDate) {
  if (!birthDate) return null;
  const b = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}
