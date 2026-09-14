import { supabase, setRememberMe } from './supabaseClient.js';
import { setState, getState } from './state.js';
import { showToast } from './ui.js';

async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) {
    console.error('Errore nel caricamento del profilo', error);
    return null;
  }
  return data;
}

async function loadProfileOrSignOut(session) {
  if (!session) return null;
  const profile = await loadProfile(session.user.id);
  if (!profile) {
    // Sessione orfana (es. account cancellato lato database): esce in modo pulito
    // invece di lasciare il sito in uno stato "a metà" (loggato ma senza ruolo).
    await supabase.auth.signOut();
    return null;
  }
  return profile;
}

export async function init(onChange) {
  const { data: { session } } = await supabase.auth.getSession();
  const profile = await loadProfileOrSignOut(session);
  setState({ session: profile ? session : null, profile, ready: true });
  onChange(getState());

  supabase.auth.onAuthStateChange(async (_event, session) => {
    const profile = await loadProfileOrSignOut(session);
    setState({ session: profile ? session : null, profile, ready: true });
    onChange(getState());
  });
}

export async function signUp({ email, password, fullName, phone, gender, birthDate }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error };

  // Se la conferma email e' attiva, a questo punto non c'e' ancora una sessione:
  // il profilo verra' completato al primo login (i campi extra restano vuoti
  // finche' l'utente non accede la prima volta con conferma avvenuta).
  if (data.session) {
    await supabase
      .from('profiles')
      .update({ phone: phone || null, gender: gender || null, birth_date: birthDate || null })
      .eq('id', data.user.id);
  }
  return { data };
}

export async function completeProfileIfNeeded({ phone, gender, birthDate }) {
  const { profile, session } = getState();
  if (!session || !profile) return;
  if (profile.phone || profile.gender || profile.birth_date) return; // gia' compilato
  if (!phone && !gender && !birthDate) return;
  await supabase
    .from('profiles')
    .update({ phone: phone || null, gender: gender || null, birth_date: birthDate || null })
    .eq('id', session.user.id);
}

export async function signIn({ email, password, remember }) {
  setRememberMe(remember !== false);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
}

export async function signOut() {
  await supabase.auth.signOut();
  showToast('Disconnesso.');
}

export async function updateOwnProfile(fields) {
  const { session } = getState();
  if (!session) return { error: new Error('Non autenticato') };
  const { error } = await supabase.from('profiles').update(fields).eq('id', session.user.id);
  return { error };
}
