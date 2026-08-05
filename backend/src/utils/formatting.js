export function capitalize(str = '') {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str = '', length = 80) {
  if (!str) return str;
  return str.length > length ? `${str.slice(0, length - 3)}...` : str;
}

export function sanitizeLinks(links) {
  if (!Array.isArray(links)) return [];
  return links.filter(Boolean).map((l) => String(l).trim()).slice(0, 20);
}

export function safeList(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}