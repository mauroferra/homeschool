import i18n, { toLocaleTag } from '../i18n';

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
  return new Date(date).toLocaleDateString(toLocaleTag(i18n.language), { day: 'numeric', month: 'short', ...opts });
}

export function formatWeekLabel(startDate) {
  const s = startOfWeek(startDate);
  const e = addDays(s, 6);
  return `${formatDate(s)} / ${formatDate(e, { year: 'numeric' })}`;
}

export function addWeek(startDate, delta) {
  return addDays(startDate, delta * 7);
}

export function startOfMonth(date = new Date()) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addMonths(date, delta) {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + delta);
  return d;
}

export function weekdayIndex(date) {
  const d = new Date(date);
  return d.getDay() === 0 ? 6 : d.getDay() - 1;
}

export function isSameDay(a, b) {
  return dateOnlyISO(a) === dateOnlyISO(b);
}

export function isSameMonth(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth();
}

export function formatMonthLabel(date) {
  return new Date(date).toLocaleDateString(toLocaleTag(i18n.language), { month: 'long', year: 'numeric' });
}

export function formatDayLabel(date) {
  return new Date(date).toLocaleDateString(toLocaleTag(i18n.language), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function getMonthGrid(date) {
  const first = startOfMonth(date);
  const start = startOfWeek(first);
  const nextMonthFirst = startOfMonth(addMonths(date, 1));
  const end = addDays(startOfWeek(nextMonthFirst), 6);
  const grid = [];
  let cursor = new Date(start);
  while (cursor <= end) {
    const week = [];
    for (let i = 0; i < 7; i += 1) {
      week.push(new Date(cursor));
      cursor = addDays(cursor, 1);
    }
    grid.push(week);
  }
  return grid;
}

export function parseISO(iso) {
  return new Date(`${iso}T12:00:00`);
}

export function dayOffset(startDate, dayIndex) {
  return addDays(startOfWeek(startDate), dayIndex);
}
