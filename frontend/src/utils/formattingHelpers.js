export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str = '', len = 60) {
  return str.length > len ? `${str.slice(0, len - 3)}...` : str;
}

export function formatDuration(minutes) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function initialsFromEmail(email = '') {
  const name = email.split('@')[0] || '';
  return name.slice(0, 2).toUpperCase();
}