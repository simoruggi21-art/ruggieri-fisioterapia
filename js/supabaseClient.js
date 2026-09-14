import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

if (SUPABASE_URL.startsWith('INSERISCI') || SUPABASE_ANON_KEY.startsWith('INSERISCI')) {
  console.warn(
    'Configura js/config.js con URL e anon key del tuo progetto Supabase prima di usare il sito.'
  );
}

const REMEMBER_KEY = 'sb-remember-me';

function isRemembered() {
  return localStorage.getItem(REMEMBER_KEY) !== 'false';
}

export function setRememberMe(remember) {
  localStorage.setItem(REMEMBER_KEY, remember ? 'true' : 'false');
}

// Storage "dinamico": se l'utente sceglie di non essere ricordato, la sessione
// va in sessionStorage (sparisce alla chiusura del browser) invece che in
// localStorage (persistente). Il default e' "ricordami" attivo, come nel
// comportamento standard di Supabase.
const dynamicStorage = {
  getItem: (key) => (isRemembered() ? window.localStorage : window.sessionStorage).getItem(key),
  setItem: (key, value) => {
    const store = isRemembered() ? window.localStorage : window.sessionStorage;
    const other = isRemembered() ? window.sessionStorage : window.localStorage;
    store.setItem(key, value);
    other.removeItem(key);
  },
  removeItem: (key) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  },
};

// window.supabase e' il pacchetto caricato via <script> in index.html
// (createClient e' una funzione, non va confuso con l'istanza client sotto).
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { storage: dynamicStorage, persistSession: true, autoRefreshToken: true },
});
