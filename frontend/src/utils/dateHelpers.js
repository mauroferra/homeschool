export function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay() === 0 ? 6 : d.getDay() - 1;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function dateOnlyISO(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getWeekRange(startDate) {
  const start = startOfWeek(startDate);
  const end = addDays(start, 6);
  return { start, end };
}

export function formatDate(date, opts = {}) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...opts });
}

export function formatWeekLabel(startDate) {
  const s = startOfWeek(startDate);
  const e = addDays(s, 6);
  return `${formatDate(s)} – ${formatDate(e, { year: 'numeric' })}`;
}

export function addWeek(startDate, delta) {
  return addDays(startDate, delta * 7);
}

export function parseISO(iso) {
  return new Date(`${iso}T12:00:00`);
}

export function dayOffset(startDate, dayIndex) {
  return addDays(startOfWeek(startDate), dayIndex);
}