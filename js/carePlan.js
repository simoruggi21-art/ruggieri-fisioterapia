// Calcolo condiviso dell'obiettivo di sedute: a settimana, con deroga per una sola
// settimana e cadenza (es. una seduta ogni 2 settimane).

export function mondayOf(date = new Date()) {
  const m = new Date(date);
  m.setHours(0, 0, 0, 0);
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return m;
}

export function dateKey(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// Finestra di conteggio: la settimana in corso e, se la cadenza e' piu' lunga,
// le settimane precedenti comprese nel periodo.
export function planWindow(profile, now = new Date()) {
  const interval = Math.max(1, profile.weeks_between_sessions || 1);
  const monday = mondayOf(now);
  const start = new Date(monday);
  start.setDate(start.getDate() - (interval - 1) * 7);
  const end = new Date(monday);
  end.setDate(end.getDate() + 7);
  const overridden = profile.week_target_week === dateKey(monday) && profile.week_target_override != null;
  const target = overridden ? profile.week_target_override : (profile.sessions_per_week || 0);
  return { interval, start, end, monday, overridden, target };
}

export function cadenceLabel(perWeek, interval) {
  if (interval > 1) return perWeek === 1 ? `una seduta ogni ${interval} settimane` : `${perWeek} sedute ogni ${interval} settimane`;
  return `${perWeek} ${perWeek === 1 ? 'seduta' : 'sedute'} a settimana`;
}
