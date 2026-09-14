import { supabase } from './supabaseClient.js';
import { qs, el, escapeHtml } from './ui.js';
import { t, tField } from './i18n.js';

let cachedContent = null;
let cachedServices = null;

export async function fetchSiteContent() {
  try {
    const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).single();
    if (error) { console.error(error); return null; }
    cachedContent = data;
    return data;
  } catch (err) {
    console.error('Rete non raggiungibile, contenuti pubblici non caricati.', err);
    return null;
  }
}

export async function fetchServices() {
  try {
    const { data, error } = await supabase.from('services').select('*').order('sort_order');
    if (error) { console.error(error); return []; }
    cachedServices = data;
    return data;
  } catch (err) {
    console.error('Rete non raggiungibile, servizi non caricati.', err);
    return [];
  }
}

export function getCachedContent() { return cachedContent; }
export function getCachedServices() { return cachedServices; }

export async function render() {
  const content = await fetchSiteContent();
  const services = await fetchServices();
  if (content) applyContentToDom(content);
  renderPriceList(services);
  renderRecap(content, services);
}

function renderRecap(c, services) {
  if (!qs('#recapPhoneItem')) return; // pagina senza il markup pubblico (es. app.html)
  const phoneItem = qs('#recapPhoneItem');
  if (c?.phone && c.phone.trim()) {
    qs('#recapPhone').textContent = c.phone;
    qs('#recapPhone').href = 'tel:' + c.phone.replace(/[^+\d]/g, '');
    phoneItem.style.display = '';
  } else {
    phoneItem.style.display = 'none';
  }

  const emailItem = qs('#recapEmailItem');
  if (c?.footer_email && c.footer_email.trim()) {
    qs('#recapEmail').textContent = c.footer_email;
    qs('#recapEmail').href = 'mailto:' + c.footer_email;
    emailItem.style.display = '';
  } else {
    emailItem.style.display = 'none';
  }

  const addressItem = qs('#recapAddressItem');
  if (c?.address && c.address.trim()) {
    qs('#recapAddress').textContent = c.address;
    addressItem.style.display = '';
  } else {
    addressItem.style.display = 'none';
  }

  const pricesItem = qs('#recapPricesItem');
  if (services && services.length) {
    qs('#recapPrices').innerHTML = services.map((s) => `
      <div class="recap-price-row"><span>${escapeHtml(tField(s, 'title'))}</span> <span class="recap-price-amount">€${Number(s.price).toLocaleString('it-IT')}</span></div>
    `).join('');
    pricesItem.style.display = '';
  } else {
    pricesItem.style.display = 'none';
  }

  const recapReviewLink = qs('#recapReviewLink');
  if (recapReviewLink) {
    if (c?.google_review_url) {
      recapReviewLink.href = c.google_review_url;
      recapReviewLink.style.display = '';
    } else {
      recapReviewLink.style.display = 'none';
    }
  }
}

function applyContentToDom(c) {
  if (!qs('#aboutName')) return; // pagina senza il markup pubblico (es. app.html)
  qs('#aboutName').textContent = c.name || '';
  qs('#heroEyebrow').textContent = tField(c, 'tagline');
  qs('#aboutBio').textContent = tField(c, 'bio');
  qs('#credFormazione').textContent = tField(c, 'formazione') || '—';
  qs('#credSpecializzazione').textContent = tField(c, 'specializzazione') || '—';
  qs('#credAlbo').textContent = c.albo || '—';
  qs('#heroLine1').textContent = tField(c, 'hero_line1');
  qs('#heroLine2').textContent = tField(c, 'hero_line2');
  qs('#heroLine3').textContent = tField(c, 'hero_line3');
  qs('#heroLede').textContent = tField(c, 'hero_lede');
  qs('#fijlkamNote').textContent = tField(c, 'fijlkam_note');

  const igHandle = c.ig_handle || '';
  if (igHandle) {
    qs('#navIgText').textContent = igHandle;
    qs('#navIgLink').href = 'https://instagram.com/' + igHandle;
    qs('#footerIgText').textContent = '@' + igHandle;
    qs('#footerIgLink').href = 'https://instagram.com/' + igHandle;
    qs('#navIgLink').style.display = '';
    qs('#footerIgLink').style.display = '';
  } else {
    qs('#navIgLink').style.display = 'none';
    qs('#footerIgLink').style.display = 'none';
  }

  qs('#footerContactLine').textContent = c.footer_email
    ? t('footer.contactLine').replace('{email}', c.footer_email)
    : '';

  const reviewLink = qs('#googleReviewLink');
  if (c.google_review_url) {
    reviewLink.href = c.google_review_url;
    reviewLink.style.display = '';
  } else {
    reviewLink.style.display = 'none';
  }

  updateStructuredData(c);

  const initials = (c.name || 'SR').split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const photoSlot = qs('#photoSlot');
  const initialsEl = qs('#photoInitials');
  const tagEl = qs('#photoTag');
  if (c.photo_url) {
    photoSlot.style.backgroundImage = `url(${c.photo_url})`;
    initialsEl.style.display = 'none';
    tagEl.style.display = 'none';
  } else {
    photoSlot.style.backgroundImage = '';
    initialsEl.textContent = initials || 'SR';
    initialsEl.style.display = 'block';
    tagEl.style.display = 'block';
  }

  setGalleryPhoto(qs('#actionPhotoSlot'), c.photo_action_url);
  setGalleryPhoto(qs('#detailPhotoSlot'), c.photo_detail_url);
  qs('#aboutGallery').style.display = (c.photo_action_url || c.photo_detail_url) ? '' : 'none';

  const block = qs('#addressBlock');
  if (c.address && c.address.trim()) {
    block.style.display = 'block';
    const encoded = encodeURIComponent(c.address);
    qs('#addressText').textContent = c.address;
    qs('#addressMapsLink').href = 'https://www.google.com/maps/search/?api=1&query=' + encoded;
    qs('#addressMapEmbed').src = 'https://www.google.com/maps?q=' + encoded + '&output=embed';
  } else {
    block.style.display = 'none';
  }
}

function setGalleryPhoto(slot, url) {
  if (!slot) return;
  if (url) {
    slot.style.backgroundImage = `url(${url})`;
    slot.style.display = '';
  } else {
    slot.style.backgroundImage = '';
    slot.style.display = 'none';
  }
}

function updateStructuredData(c) {
  let script = document.getElementById('ld-json-business');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'ld-json-business';
    document.head.appendChild(script);
  }
  const data = {
    '@context': 'https://schema.org',
    '@type': 'PhysicalTherapy',
    name: c.name || 'Simone Ruggieri',
    description: c.bio || c.tagline || '',
    url: window.location.origin,
    ...(c.address ? { address: { '@type': 'PostalAddress', streetAddress: c.address } } : {}),
    ...(c.ig_handle ? { sameAs: ['https://instagram.com/' + c.ig_handle] } : {}),
  };
  script.textContent = JSON.stringify(data);
}

function renderPriceList(services) {
  const list = qs('#priceList');
  if (!list) return;
  if (!services || services.length === 0) {
    list.innerHTML = '<p class="text-dim">Tariffe in aggiornamento — scrivimi per informazioni.</p>';
    return;
  }
  list.innerHTML = services.map(s => `
    <div class="price-row">
      <div>
        <h3>${escapeHtml(tField(s, 'title'))}</h3>
        <p class="desc">${escapeHtml(tField(s, 'description'))}</p>
      </div>
      <p class="duration">${escapeHtml(tField(s, 'duration'))}</p>
      <p class="amount">€${Number(s.price).toLocaleString('it-IT')}</p>
    </div>
  `).join('');
}
