import { Week, ActivityInstance, Activity, Theme, ExternalActivityType } from '../db/models/index.js';
import { notFound, badRequest } from '../utils/error.js';
import { dateOnlyISO, weekRangeISO, startOfWeek, addDays, toISO } from '../utils/date.js';
import { blockTypes } from '../utils/constants.js';

const instanceInclude = [
  { model: Activity, as: 'Activity', required: false, include: [{ model: Theme, as: 'Theme', required: false }] },
  { model: ExternalActivityType, as: 'ExternalActivityType', required: false },
];

export function weekDto(week) {
  const j = week.toJSON();
  return { id: j.id, start_date: j.startDate, user_id: j.userId, parent_reflection: j.parentReflection };
}

export function instanceDto(at) {
  const j = at.toJSON();
  const activity = j.Activity || j.activity || {};
  const isAdHoc = j.adHocTitle != null || j.externalTypeId != null;
  const isExternal = j.blockType === blockTypes.EXTERNAL_ACTIVITY;
  const externalType = j.ExternalActivityType || {};
const title = externalType.name || j.adHocTitle || activity.title;
const category = j.adHocCategory || activity.category;
return {
  id: j.id,
  week_id: j.weekId,
  day_of_week: j.dayOfWeek,
  block_type: j.blockType,
  activity_id: j.activityId,
  home_tag: j.homeTag,
  status: j.status,
  reflection_text: j.reflectionText,
  created_at: j.createdAt,
  updated_at: j.updatedAt,
  ad_hoc: isAdHoc,
  is_external: isExternal,
  external_type_id: j.externalTypeId,
  activity: {
    id: activity.id,
    title,
    title_en: externalType.nameEn || activity.title_en,
    title_cs: externalType.nameCs || activity.title_cs,
    title_it: externalType.nameIt || activity.title_it,
      category,
      description: j.adHocDescription ?? activity.description,
      description_en: activity.description_en,
      description_cs: activity.description_cs,
      description_it: activity.description_it,
      estimated_duration: j.adHocDuration ?? activity.estimatedDuration,
      links: (j.adHocLinks && j.adHocLinks.length ? j.adHocLinks : activity.links) || [],
      theme_name: activity.Theme ? activity.Theme.name : null,
    },
  };
}

export async function listWeeks(userId) {
  const weeks = await Week.findAll({ where: { userId }, order: [['startDate', 'DESC']] });
  return weeks.map(weekDto);
}

export async function getWeek(userId, id) {
  const week = await Week.findOne({ where: { id, userId } });
  if (!week) throw notFound('Week not found');
  return weekDto(week);
}

export async function createWeek(userId, { start_date }) {
  const start = start_date || dateOnlyISO(startOfWeek());
  const wk = await Week.findOrCreate({ where: { startDate: start, userId }, defaults: { startDate: start, userId } });
  return weekDto(wk[0]);
}

export async function findOrCreateWeekForDate(userId, date) {
  const start = dateOnlyISO(startOfWeek(date));
  const wk = await Week.findOrCreate({ where: { startDate: start, userId }, defaults: { startDate: start, userId } });
  return wk[0];
}

export async function deleteWeek(userId, id) {
  const week = await Week.findOne({ where: { id, userId } });
  if (!week) throw notFound('Week not found');
  await week.destroy();
  return { success: true };
}

export async function updateWeekReflection(userId, id, { parent_reflection }) {
  const week = await Week.findOne({ where: { id, userId } });
  if (!week) throw notFound('Week not found');
  week.parentReflection = parent_reflection ?? null;
  await week.save();
  return weekDto(week);
}

export async function listWeekInstances(userId, weekId, { household } = {}) {
  const week = await Week.findOne({ where: { id: weekId, userId } });
  if (!week) throw notFound('Week not found');
  const where = { weekId };
  if (household && household !== 'All') where.homeTag = household;
  const instances = await ActivityInstance.findAll({ where, include: instanceInclude, order: [['dayOfWeek', 'ASC']] });
  return instances.map(instanceDto);
}

export async function createWeekInstance(userId, weekId, data, { uploadedAttachments = [] } = {}) {
  const week = await Week.findOne({ where: { id: weekId, userId } });
  if (!week) throw notFound('Week not found');
  const instance = await ActivityInstance.create({
    weekId,
    dayOfWeek: data.day_of_week,
    blockType: data.block_type,
    activityId: data.activity_id,
    homeTag: data.home_tag || 'Home A',
    status: data.status || 'Not started',
    reflectionText: data.reflection_text ?? null,
  });
  return getInstance(userId, instance.id);
}

export async function getInstance(userId, id) {
  const instance = await ActivityInstance.findOne({ where: { id }, include: instanceInclude });
  if (!instance) throw notFound('Activity instance not found');
  const week = await Week.findByPk(instance.weekId);
  if (!week || week.userId !== userId) throw notFound('Activity instance not found');
  return instanceDto(instance);
}

export async function createAdHocInstance(userId, weekId, { day_of_week, block_type, home_tag, title, category, description, estimated_duration, links, status }) {
  const week = await Week.findOne({ where: { id: weekId, userId } });
  if (!week) throw notFound('Week not found');
  const instance = await ActivityInstance.create({
    weekId,
    dayOfWeek: day_of_week,
    blockType: block_type,
    activityId: null,
    homeTag: home_tag || 'Home A',
    status: status || 'Not started',
    reflectionText: null,
    adHocTitle: title,
    adHocCategory: category,
    adHocDescription: description,
    adHocDuration: estimated_duration,
    adHocLinks: links || [],
  });
  return getInstance(userId, instance.id);
}

export async function createExternalPlaceholder(userId, weekId, { day_of_week, home_tag, external_type_id, title }) {
  const week = await Week.findOne({ where: { id: weekId, userId } });
  if (!week) throw notFound('Week not found');
  let externalTypeId = null;
  let adHocTitle = title || null;
  if (external_type_id) {
    const type = await ExternalActivityType.findOne({ where: { id: external_type_id, userId } });
    if (!type) throw notFound('External activity type not found');
    externalTypeId = type.id;
    adHocTitle = null;
  } else if (!adHocTitle) {
    throw badRequest('External activity type or title is required', 'VALIDATION');
  }
  const instance = await ActivityInstance.create({
    weekId,
    dayOfWeek: day_of_week,
    blockType: blockTypes.EXTERNAL_ACTIVITY,
    activityId: null,
    homeTag: home_tag || 'Home A',
    status: null,
    reflectionText: null,
    adHocTitle,
    externalTypeId,
  });
  return getInstance(userId, instance.id);
}

export async function updateInstance(userId, id, data) {
  const instance = await ActivityInstance.findOne({ where: { id } });
  if (!instance) throw notFound('Activity instance not found');
  const week = await Week.findByPk(instance.weekId);
  if (!week || week.userId !== userId) throw notFound('Activity instance not found');
  if (data.day_of_week !== undefined) instance.dayOfWeek = data.day_of_week;
  if (data.block_type !== undefined) instance.blockType = data.block_type;
  if (data.activity_id !== undefined) instance.activityId = data.activity_id;
  if (data.home_tag !== undefined) instance.homeTag = data.home_tag;
  if (data.status !== undefined) instance.status = data.status;
  if (data.reflection_text !== undefined) instance.reflectionText = data.reflection_text;
  await instance.save();
  return getInstance(userId, instance.id);
}

export async function deleteInstance(userId, id) {
  const instance = await ActivityInstance.findOne({ where: { id } });
  if (!instance) throw notFound('Activity instance not found');
  const week = await Week.findByPk(instance.weekId);
  if (!week || week.userId !== userId) throw notFound('Activity instance not found');
  await instance.destroy();
  return { success: true };
}