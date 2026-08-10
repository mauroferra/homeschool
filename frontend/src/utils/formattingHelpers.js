export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str = '', len = 60) {
  return str.length > len ? `${str.slice(0, len - 3)}...` : str;
}

import { t } from '../i18n';

export function formatDuration(minutes) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} ${t('duration.min')}`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hour = t('duration.hourShort');
  const min = t('duration.min');
  return m ? `${h}${hour} ${m}${min}` : `${h}${hour}`;
}

export function formatTimeRange(start, end) {
  if (!start) return end || '';
  return end ? `${start}–${end}` : start;
}

export function initialsFromEmail(email = '') {
  const name = email.split('@')[0] || '';
  return name.slice(0, 2).toUpperCase();
}