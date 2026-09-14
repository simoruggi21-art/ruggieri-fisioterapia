import { supabase } from './supabaseClient.js';
import { qs, el, showToast } from './ui.js';
import { fetchSiteContent, fetchServices, render as renderPublicContent } from './publicContent.js';

let servicesDraft = [];

export async function render() {
  const form = qs('#profileNameInput');
  if (!form) return;
  const content = await fetchSiteContent();
  servicesDraft = await fetchServices();
  if (!content) return;

  qs('#profileNameInput').value = content.name || '';
  qs('#profileTaglineInput').value = content.tagline || '';
  qs('#profileBioInput').value = content.bio || '';
  qs('#profileFormazioneInput').value = content.formazione || '';
  qs('#profileSpecInput').value = content.specializzazione || '';
  qs('#profileAlboInput').value = content.albo || '';
  qs('#profileAddressInput').value = content.address || '';
  qs('#profilePhoneInput').value = content.phone || '';
  qs('#heroLine1Input').value = content.hero_line1 || '';
  qs('#heroLine2Input').value = content.hero_line2 || '';
  qs('#heroLine3Input').value = content.hero_line3 || '';
  qs('#heroLedeInput').value = content.hero_lede || '';
  qs('#fijlkamNoteInput').value = content.fijlkam_note || '';
  qs('#igHandleInput').value = content.ig_handle || '';
  qs('#footerEmailInput').value = content.footer_email || '';
  qs('#googleReviewUrlInput').value = content.google_review_url || '';

  const preview = qs('#profilePhotoPreview');
  const previewInitials = qs('#profilePreviewInitials');
  if (content.photo_url) {
    preview.style.backgroundImage = `url(${content.photo_url})`;
    previewInitials.style.display = 'none';
  } else {
    preview.style.backgroundImage = '';
    previewInitials.style.display = 'block';
  }

  setPreview(qs('#actionPhotoPreview'), content.photo_action_url);
  setPreview(qs('#detailPhotoPreview'), content.photo_detail_url);

  renderServicesEditor();
}

function setPreview(el, url) {
  if (!el) return;
  el.style.backgroundImage = url ? `url(${url})` : '';
}

function renderServicesEditor() {
  const editor = qs('#servicesEditor');
  if (!editor) return;
  editor.innerHTML = servicesDraft.map((s, i) => `
    <div style="border:1px solid var(--line); border-radius:4px; padding:16px; display:flex; flex-direction:column; gap:10px;">
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <input type="text" class="svcTitle" data-i="${i}" value="${s.title || ''}" placeholder="Nome trattamento" style="flex:2; min-width:160px;">
        <input type="text" class="svcDuration" data-i="${i}" value="${s.duration || ''}" placeholder="Durata" style="flex:1; min-width:100px;">
        <input type="number" class="svcPrice" data-i="${i}" value="${s.price ?? 0}" placeholder="Prezzo" style="width:110px;">
      </div>
      <textarea class="svcDesc" data-i="${i}" style="width:100%; min-height:50px; font-size:13.5px;">${s.description || ''}</textarea>
      <button class="btn btn-ghost btn-small removeServiceBtn" data-i="${i}" style="align-self:flex-end;">Rimuovi trattamento</button>
    </div>
  `).join('');
  editor.querySelectorAll('.removeServiceBtn').forEach((btn) => {
    btn.onclick = () => { servicesDraft.splice(parseInt(btn.dataset.i), 1); renderServicesEditor(); };
  });
}

export function addServiceRow() {
  servicesDraft.push({ title: 'Nuovo trattamento', description: '', duration: '', price: 0, sort_order: servicesDraft.length });
  renderServicesEditor();
}

function readServicesFromEditor() {
  return Array.from(document.querySelectorAll('.svcTitle')).map((input) => {
    const i = input.dataset.i;
    return {
      title: input.value || 'Trattamento',
      description: qs(`.svcDesc[data-i="${i}"]`).value,
      duration: qs(`.svcDuration[data-i="${i}"]`).value,
      price: parseFloat(qs(`.svcPrice[data-i="${i}"]`).value) || 0,
      sort_order: parseInt(i),
    };
  });
}

export async function uploadPhoto(file) {
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('La foto supera i 2 MB.', 'error'); return; }
  const path = `profile-${Date.now()}.${file.name.split('.').pop()}`;
  const { error: upErr } = await supabase.storage.from('public-assets').upload(path, file, { upsert: true });
  if (upErr) { showToast('Errore caricamento foto.', 'error'); return; }
  const { data } = supabase.storage.from('public-assets').getPublicUrl(path);
  await supabase.from('site_content').update({ photo_url: data.publicUrl }).eq('id', 1);
  await render();
  await renderPublicContent();
  showToast('Foto aggiornata.', 'ok');
}

export async function removePhoto() {
  await supabase.from('site_content').update({ photo_url: null }).eq('id', 1);
  await render();
  await renderPublicContent();
}

async function uploadNamedPhoto(file, column, prefix) {
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('La foto supera i 2 MB.', 'error'); return; }
  const path = `${prefix}-${Date.now()}.${file.name.split('.').pop()}`;
  const { error: upErr } = await supabase.storage.from('public-assets').upload(path, file, { upsert: true });
  if (upErr) { showToast('Errore caricamento foto.', 'error'); return; }
  const { data } = supabase.storage.from('public-assets').getPublicUrl(path);
  await supabase.from('site_content').update({ [column]: data.publicUrl }).eq('id', 1);
  await render();
  await renderPublicContent();
  showToast('Foto aggiornata.', 'ok');
}

export async function uploadActionPhoto(file) {
  await uploadNamedPhoto(file, 'photo_action_url', 'action');
}

export async function removeActionPhoto() {
  await supabase.from('site_content').update({ photo_action_url: null }).eq('id', 1);
  await render();
  await renderPublicContent();
}

export async function uploadDetailPhoto(file) {
  await uploadNamedPhoto(file, 'photo_detail_url', 'detail');
}

export async function removeDetailPhoto() {
  await supabase.from('site_content').update({ photo_detail_url: null }).eq('id', 1);
  await render();
  await renderPublicContent();
}

export async function saveProfile() {
  const payload = {
    name: qs('#profileNameInput').value,
    tagline: qs('#profileTaglineInput').value,
    bio: qs('#profileBioInput').value,
    formazione: qs('#profileFormazioneInput').value,
    specializzazione: qs('#profileSpecInput').value,
    albo: qs('#profileAlboInput').value,
    address: qs('#profileAddressInput').value,
    phone: qs('#profilePhoneInput').value,
    hero_line1: qs('#heroLine1Input').value,
    hero_line2: qs('#heroLine2Input').value,
    hero_line3: qs('#heroLine3Input').value,
    hero_lede: qs('#heroLedeInput').value,
    fijlkam_note: qs('#fijlkamNoteInput').value,
    ig_handle: qs('#igHandleInput').value.replace('@', '').trim(),
    footer_email: qs('#footerEmailInput').value,
    google_review_url: qs('#googleReviewUrlInput').value.trim(),
    updated_at: new Date().toISOString(),
  };
  const statusEl = qs('#profileSaveStatus');
  const { error } = await supabase.from('site_content').update(payload).eq('id', 1);

  servicesDraft = readServicesFromEditor();
  await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (servicesDraft.length) {
    await supabase.from('services').insert(servicesDraft.map(({ title, description, duration, price, sort_order }) => ({ title, description, duration, price, sort_order })));
  }
  servicesDraft = await fetchServices();
  renderServicesEditor();

  statusEl.textContent = error ? 'Errore nel salvataggio.' : 'Salvato ✓ — ora visibile a tutti sul sito.';
  await renderPublicContent();
  setTimeout(() => { statusEl.textContent = ''; }, 3500);
}
