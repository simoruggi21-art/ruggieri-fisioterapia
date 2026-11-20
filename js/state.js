// Piccolo store condiviso: sessione utente + profilo (ruolo) correnti.
// I moduli leggono lo stato con getState() e si iscrivono ai cambi con subscribe().

let state = {
  session: null,   // sessione Supabase Auth (null se ospite)
  profile: null,    // riga public.profiles dell'utente loggato
  ready: false,      // true quando il controllo iniziale della sessione e' terminato
};

const listeners = new Set();

export function getState() {
  return state;
}

export function setState(partial) {
  state = { ...state, ...partial };
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function role() {
  return state.profile ? state.profile.role : null;
}

export function isAuthed() {
  return !!state.session;
}

export function isStaff() {
  return role() === 'admin' || role() === 'technician' || role() === 'operator';
}

export function isAdmin() {
  return role() === 'admin';
}

// Accesso completo: amministratore, oppure tecnico con il permesso "accesso completo"
// (finanze, team, turni, assegnazioni). L'eliminazione dei pazienti resta solo dell'amministratore.
export function hasFullAccess() {
  return role() === 'admin' || (role() === 'technician' && state.profile?.full_access === true);
}

// Amministratore o tecnico: gestiscono agenda, pazienti, contenuti del sito.
// Finanze, ruoli e cancellazione pazienti restano solo dell'amministratore (isAdmin).
export function isManager() {
  return role() === 'admin' || role() === 'technician';
}
