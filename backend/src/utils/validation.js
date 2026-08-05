export function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

export function inEnum(value, allowed = []) {
  return allowed.includes(value);
}

export function validDateString(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}