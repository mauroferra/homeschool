export function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay() === 0 ? 6 : d.getDay() - 1; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toISO(date) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function dateOnlyISO(date) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function weekRangeISO(startDate) {
  const start = startOfWeek(startDate);
  const end = addDays(start, 6);
  return { start: dateOnlyISO(start), end: dateOnlyISO(end) };
}