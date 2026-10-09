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
  setPreview(qs('#studioPhotoPreview'), content.photo_studio_url);

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


// Le foto da telefono pesano 3-8 MB: le riduciamo nel browser (lato lungo max
// 1600px, JPEG) prima del caricamento, cosi' non serve ritoccarle a mano.
async function compressImage(file, maxSide = 1600, quality = 0.85) {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    return blob || file;
  } catch (err) {
    return file;
  }
}

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

async function uploadToPublicAssets(file, prefix) {
  const blob = await compressImage(file);
  if (blob.size > MAX_UPLOAD_BYTES) { showToast('La foto e\' troppo pesante anche dopo la compressione.', 'error'); return null; }
  const ext = blob.type === 'image/jpeg' ? 'jpg' : (file.name.split('.').pop() || 'jpg');
  const path = `${prefix}-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage.from('public-assets').upload(path, blob, { upsert: true, contentType: blob.type || file.type });
  if (upErr) { showToast('Errore caricamento foto.', 'error'); return null; }
  return supabase.storage.from('public-assets').getPublicUrl(path).data.publicUrl;
}

export async function uploadPhoto(file) {
  if (!file) return;
  const url = await uploadToPublicAssets(file, 'profile');
  if (!url) return;
  await supabase.from('site_content').update({ photo_url: url }).eq('id', 1);
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
  const url = await uploadToPublicAssets(file, prefix);
  if (!url) return;
  await supabase.from('site_content').update({ [column]: url }).eq('id', 1);
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

export async function uploadStudioPhoto(file) {
  await uploadNamedPhoto(file, 'photo_studio_url', 'studio');
}

export async function removeStudioPhoto() {
  await supabase.from('site_content').update({ photo_studio_url: null }).eq('id', 1);
  await render();
  await renderPublicContent();
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
