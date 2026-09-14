import { supabase } from './supabaseClient.js';
import { qs, el, showToast } from './ui.js';

const MONTH_LABELS = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];

function lastSixMonthKeys() {
  const out = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

async function fetchRevenue(monthKeys) {
  const { data, error } = await supabase.from('monthly_revenue').select('*').in('month', monthKeys);
  if (error) { console.error(error); return {}; }
  const map = {};
  data.forEach((r) => { map[r.month] = Number(r.amount); });
  return map;
}

async function saveRevenue(month, amount) {
  await supabase.from('monthly_revenue').upsert({ month, amount });
}

export async function render() {
  const bars = qs('#barsChart');
  if (!bars) return;
  const months = lastSixMonthKeys();
  const revenueMap = await fetchRevenue(months);
  const values = months.map((m) => revenueMap[m] || 0);
  const max = Math.max(...values, 1);

  bars.innerHTML = '';
  months.forEach((m, i) => {
    const d = new Date(m);
    const col = el('div', 'bar-col', '');
    const bar = el('div', 'bar', '');
    bar.style.height = (values[i] / max * 160) + 'px';
    const label = el('div', 'm-label', MONTH_LABELS[d.getMonth()]);
    const input = document.createElement('input');
    input.type = 'number'; input.min = '0'; input.value = values[i];
    input.addEventListener('change', async (e) => {
      const amount = parseFloat(e.target.value) || 0;
      await saveRevenue(m, amount);
      render();
    });
    col.appendChild(bar); col.appendChild(label); col.appendChild(input);
    bars.appendChild(col);
  });

  const current = values[values.length - 1];
  qs('#curMonth').textContent = '€' + current.toLocaleString('it-IT');
  updateTax(current);
  qs('#taxRate').oninput = () => updateTax(current);
}

function updateTax(current) {
  const rate = parseFloat(qs('#taxRate').value) || 0;
  qs('#taxResult').textContent = '€' + Math.round(current * rate / 100).toLocaleString('it-IT');
}

// ---- Simulatore regime fiscale (calcolo puro lato client, nessun dato salvato) ----
let regime = 'forfettario';

function calcIrpef(imponibile) {
  let imposta = 0;
  if (imponibile <= 0) return 0;
  imposta += Math.min(imponibile, 28000) * 0.23;
  if (imponibile > 28000) imposta += (Math.min(imponibile, 50000) - 28000) * 0.33;
  if (imponibile > 50000) imposta += (imponibile - 50000) * 0.43;
  return imposta;
}

export function setRegime(r) {
  regime = r;
  qs('#btnForfettario').classList.toggle('active', r === 'forfettario');
  qs('#btnOrdinario').classList.toggle('active', r === 'ordinario');
  qs('#forfettarioFields').style.display = r === 'forfettario' ? 'block' : 'none';
  qs('#ordinarioFields').style.display = r === 'ordinario' ? 'block' : 'none';
  updateRegimeCalc();
}

export function updateRegimeCalc() {
  const revenue = parseFloat(qs('#annualRevenue').value) || 0;
  const inpsRate = parseFloat(qs('#inpsRate').value) || 0;
  let imponibile, inps, tax, addizionali = 0, net;

  if (regime === 'forfettario') {
    const coeff = (parseFloat(qs('#coeffRedd').value) || 0) / 100;
    const aliquota = parseFloat(qs('#aliquotaSostitutiva').value) / 100;
    imponibile = revenue * coeff;
    inps = imponibile * inpsRate / 100;
    tax = Math.max(0, imponibile - inps) * aliquota;
    qs('#outTaxLabel').textContent = 'Imposta sostitutiva';
    qs('#outAddRow').style.display = 'none';
  } else {
    const expenses = parseFloat(qs('#deductExpenses').value) || 0;
    const addRate = parseFloat(qs('#addRegCom').value) || 0;
    const reddito = Math.max(0, revenue - expenses);
    inps = reddito * inpsRate / 100;
    imponibile = Math.max(0, reddito - inps);
    tax = calcIrpef(imponibile);
    addizionali = imponibile * addRate / 100;
    qs('#outTaxLabel').textContent = 'IRPEF (scaglioni 23/33/43%)';
    qs('#outAddRow').style.display = 'flex';
    qs('#outAdd').textContent = '€' + Math.round(addizionali).toLocaleString('it-IT');
  }

  const total = inps + tax + addizionali;
  net = revenue - total;

  qs('#outImponibile').textContent = '€' + Math.round(imponibile).toLocaleString('it-IT');
  qs('#outInps').textContent = '€' + Math.round(inps).toLocaleString('it-IT');
  qs('#outTax').textContent = '€' + Math.round(tax).toLocaleString('it-IT');
  qs('#outTotal').textContent = '€' + Math.round(total).toLocaleString('it-IT');
  qs('#outNet').textContent = '€' + Math.round(net).toLocaleString('it-IT');
}
