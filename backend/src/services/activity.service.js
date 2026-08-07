import { Activity, Theme } from '../db/models/index.js';
import { notFound, badRequest } from '../utils/error.js';
import { categories } from '../utils/constants.js';
import { sanitizeLinks } from '../utils/formatting.js';

export function dto(a) {
  const j = a.toJSON();
  return {
    id: j.id,
    title: j.title,
    title_en: j.title_en,
    title_cs: j.title_cs,
    title_it: j.title_it,
    category: j.category,
    description: j.description,
    description_en: j.description_en,
    description_cs: j.description_cs,
    description_it: j.description_it,
    estimated_duration: j.estimatedDuration,
    links: j.links || [],
    attachments: j.attachments || [],
    theme_id: j.themeId,
    theme_name: j.Theme ? j.Theme.name : null,
  };
}

export async function listActivities(userId, { themeId } = {}) {
  const where = { userId };
  if (themeId) where.themeId = themeId;
  const activities = await Activity.findAll({ where, order: [['title', 'ASC']], include: [{ model: Theme, as: 'Theme', required: false }] });
  return activities.map(dto);
}

export async function getActivity(userId, id) {
  const activity = await Activity.findOne({ where: { id, userId }, include: [{ model: Theme, as: 'Theme', required: false }] });
  if (!activity) throw notFound('Activity not found');
  return dto(activity);
}

export async function createActivity(userId, data) {
  if (!data.title || !String(data.title).trim()) throw badRequest('Activity title is required', 'VALIDATION');
  if (!categories.includes(data.category)) throw badRequest(`Category must be one of: ${categories.join(', ')}`, 'VALIDATION');
  const activity = await Activity.create({
    title: String(data.title).trim(),
    category: data.category,
    description: data.description || null,
    estimatedDuration: data.estimated_duration ?? null,
    links: sanitizeLinks(data.links),
    attachments: Array.isArray(data.attachments) ? data.attachments : [],
    themeId: data.theme_id || null,
    userId,
  });
  return getActivity(userId, activity.id);
}

export async function updateActivity(userId, id, data) {
  const activity = await Activity.findOne({ where: { id, userId } });
  if (!activity) throw notFound('Activity not found');
  if (data.title !== undefined) activity.title = String(data.title).trim();
  if (data.category !== undefined) {
    if (!categories.includes(data.category)) throw badRequest(`Category must be one of: ${categories.join(', ')}`, 'VALIDATION');
    activity.category = data.category;
  }
  if (data.description !== undefined) activity.description = data.description;
  if (data.estimated_duration !== undefined) activity.estimatedDuration = data.estimated_duration;
  if (data.links !== undefined) activity.links = sanitizeLinks(data.links);
  if (data.theme_id !== undefined) activity.themeId = data.theme_id;
  await activity.save();
  return getActivity(userId, activity.id);
}

export async function deleteActivity(userId, id) {
  const activity = await Activity.findOne({ where: { id, userId } });
  if (!activity) throw notFound('Activity not found');
  await activity.destroy();
  return { success: true };
}