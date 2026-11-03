import { qs, escapeHtml } from './ui.js';

// Dopo la creazione di un paziente: conferma l'invito e, se c'e' il numero,
// propone di mandare lo stesso link anche su WhatsApp.
export function showInviteResult({ name, phone, invite_sent, invite_link }) {
  const box = qs('#inviteResultBody');
  const digits = (phone || '').replace(/\D/g, '');
  const wa = digits.length >= 8 && invite_link
    ? 'https://wa.me/' + (digits.length <= 10 ? '39' + digits : digits)
      + '?text=' + encodeURIComponent(`Ciao ${name}, ecco il link per attivare il tuo profilo e scegliere la password: ${invite_link}`)
    : null;
  box.innerHTML = `
    <p class="text-dim" style="margin-top:10px;">${invite_sent
      ? `Ho inviato a <strong>${escapeHtml(name)}</strong> un'email con il link per scegliere la password.`
      : `L'email di invito non \u00e8 partita. ${escapeHtml(name)} pu\u00f2 comunque andare su ruggierifisio.it/app, toccare \u00abPrimo accesso o password dimenticata\u00bb e inserire la sua email.`}</p>
    <div class="invite-actions">
      ${wa ? `<a class="btn btn-primary btn-small" href="${wa}" target="_blank" rel="noopener">Invia anche su WhatsApp</a>` : ''}
      <button class="btn btn-ghost btn-small" id="inviteResultCloseBtn">Chiudi</button>
    </div>`;
  qs('#inviteResultOverlay').style.display = 'flex';
  qs('#inviteResultCloseBtn').onclick = () => { qs('#inviteResultOverlay').style.display = 'none'; };
}
