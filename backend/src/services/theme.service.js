import { Theme, Activity } from '../db/models/index.js';
import { notFound, badRequest } from '../utils/error.js';
import { dateOnlyISO } from '../utils/date.js';

function dto(t) {
  const j = t.toJSON();
  return { id: j.id, name: j.name, name_en: j.name_en, name_cs: j.name_cs, name_it: j.name_it, description: j.description, description_en: j.description_en, description_cs: j.description_cs, description_it: j.description_it, start_date: j.startDate, end_date: j.endDate };
}

export async function listThemes(userId) {
  const themes = await Theme.findAll({ where: { userId }, order: [['startDate', 'ASC']] });
  return themes.map(dto);
}

export async function createTheme(userId, data) {
  if (!data.name || !String(data.name).trim()) throw badRequest('Theme name is required', 'VALIDATION');
  const theme = await Theme.create({
    name: String(data.name).trim(),
    description: data.description || null,
    startDate: data.start_date ? dateOnlyISO(data.start_date) : null,
    endDate: data.end_date ? dateOnlyISO(data.end_date) : null,
    userId,
  });
  return dto(theme);
}

export async function updateTheme(userId, id, data) {
  const theme = await Theme.findOne({ where: { id, userId } });
  if (!theme) throw notFound('Theme not found');
  if (data.name !== undefined) theme.name = String(data.name).trim();
  if (data.description !== undefined) theme.description = data.description;
  if (data.start_date !== undefined) theme.startDate = dateOnlyISO(data.start_date);
  if (data.end_date !== undefined) theme.endDate = dateOnlyISO(data.end_date);
  await theme.save();
  return dto(theme);
}

export async function deleteTheme(userId, id) {
  const theme = await Theme.findOne({ where: { id, userId } });
  if (!theme) throw notFound('Theme not found');
  await theme.destroy();
  return { success: true };
}

export async function themeUsage(userId, id) {
  const count = await Activity.count({ where: { themeId: id, userId } });
  return count;
}