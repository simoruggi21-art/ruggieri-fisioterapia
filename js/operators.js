import { supabase } from './supabaseClient.js';
import { qs, el, escapeHtml, showToast } from './ui.js';
import { getState } from './state.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

async function fetchOperators() {
  const { data, error } = await supabase.from('profiles').select('*').in('role', ['operator', 'technician']).order('full_name');
  if (error) { console.error(error); return []; }
  return data;
}

const ROLE_NAMES = { technician: 'Tecnico', operator: 'Operatore' };

async function fetchPatients() {
  const { data, error } = await supabase.from('profiles').select('*').eq('role', 'patient').order('full_name');
  if (error) { console.error(error); return []; }
  return data;
}

export async function render() {
  const tbody = qs('#operatorsTableBody');
  if (!tbody) return;
  const [operators, patients] = await Promise.all([fetchOperators(), fetchPatients()]);

  tbody.innerHTML = '';
  if (operators.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="padding:20px 18px; color:var(--text-dimmer); font-size:14px;">Nessun tecnico o operatore ancora creato. Usa il pulsante qui sopra per aggiungerne uno.</td></tr>`;
  }
  operators.forEach((o) => {
    const count = o.role === 'technician' ? 'tutti i' : patients.filter((p) => p.operator_id === o.id).length;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="padding:14px 18px; border-bottom:1px solid var(--line); font-size:14.5px;">${escapeHtml(o.full_name || '—')} <span class="rq-badge">${ROLE_NAMES[o.role] || ''}</span></td>
      <td style="padding:14px 18px; border-bottom:1px solid var(--line); font-size:14px; color:var(--text-dim);">${escapeHtml(o.email || '')}</td>
      <td style="padding:14px 18px; border-bottom:1px solid var(--line); font-size:14px; color:var(--text-dim);">${count} paziente${count === 1 ? '' : 'i'}</td>
    `;
    tbody.appendChild(tr);
  });

  renderAssignmentTable(patients, operators.filter((o) => o.role === 'operator'));
}

function renderAssignmentTable(patients, operators) {
  const tbody = qs('#assignmentTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  patients.forEach((p) => {
    const tr = document.createElement('tr');
    const options = ['<option value="">Solo Simone</option>']
      .concat(operators.map((o) => `<option value="${o.id}" ${p.operator_id === o.id ? 'selected' : ''}>${escapeHtml(o.full_name)}</option>`));
    tr.innerHTML = `
      <td style="padding:12px 18px; border-bottom:1px solid var(--line); font-size:14.5px;">${escapeHtml(p.full_name || p.email)}</td>
      <td style="padding:12px 18px; border-bottom:1px solid var(--line);">
        <select class="assignPatientSelect" data-id="${p.id}" style="background:var(--bg-alt); border:1px solid var(--line); color:var(--text); padding:6px 10px; border-radius:3px; font-size:13.5px;">${options.join('')}</select>
      </td>
    `;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('.assignPatientSelect').forEach((sel) => {
    sel.onchange = async (e) => {
      const { error } = await supabase.from('profiles').update({ operator_id: e.target.value || null }).eq('id', sel.dataset.id);
      if (error) showToast('Errore assegnazione.', 'error'); else showToast('Assegnazione aggiornata.', 'ok');
      render();
    };
  });
}

// Creazione account del team (solo amministratore): tecnico = accesso operativo
// completo; operatore = solo i pazienti assegnati. Riceve l'email per scegliere la password.
export function wireStaffModal() {
  qs('#addStaffBtn')?.addEventListener('click', () => {
    ['staffName', 'staffEmail', 'staffPhone'].forEach((id) => { qs('#' + id).value = ''; });
    qs('#staffRole').value = 'technician';
    qs('#staffOverlay').style.display = 'flex';
  });
  qs('#staffCloseBtn')?.addEventListener('click', () => { qs('#staffOverlay').style.display = 'none'; });
  qs('#staffConfirmBtn')?.addEventListener('click', async () => {
    const { session } = getState();
    const full_name = qs('#staffName').value.trim();
    const email = qs('#staffEmail').value.trim();
    const phone = qs('#staffPhone').value.trim() || null;
    const role = qs('#staffRole').value;
    if (!full_name || !email) { showToast('Nome ed email sono obbligatori.', 'error'); return; }
    const res = await fetch(`${SUPABASE_URL}/functions/v1/create-staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}`, apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify({ full_name, email, phone, role }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || 'Errore nella creazione dell\'account.', 'error'); return; }
    qs('#staffOverlay').style.display = 'none';
    showToast(data.invite_sent ? 'Account creato: ho inviato l\'email per scegliere la password.' : 'Account creato, ma l\'email non \u00e8 partita: la persona pu\u00f2 usare "Primo accesso" dalla pagina di accesso.', data.invite_sent ? 'ok' : 'error');
    await render();
  });
}
