import { supabase } from './supabaseClient.js';
import { qs, el, escapeHtml, showToast } from './ui.js';

async function fetchOperators() {
  const { data, error } = await supabase.from('profiles').select('*').eq('role', 'operator').order('full_name');
  if (error) { console.error(error); return []; }
  return data;
}

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
    tbody.innerHTML = `<tr><td colspan="3" style="padding:20px 18px; color:var(--text-dimmer); font-size:14px;">Nessun operatore ancora creato. Vedi le istruzioni sopra per aggiungerne uno.</td></tr>`;
  }
  operators.forEach((o) => {
    const count = patients.filter((p) => p.operator_id === o.id).length;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="padding:14px 18px; border-bottom:1px solid var(--line); font-size:14.5px;">${escapeHtml(o.full_name || '—')}</td>
      <td style="padding:14px 18px; border-bottom:1px solid var(--line); font-size:14px; color:var(--text-dim);">${escapeHtml(o.email || '')}</td>
      <td style="padding:14px 18px; border-bottom:1px solid var(--line); font-size:14px; color:var(--text-dim);">${count} paziente${count === 1 ? '' : 'i'}</td>
    `;
    tbody.appendChild(tr);
  });

  renderAssignmentTable(patients, operators);
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
