import { Op } from 'sequelize';
import { Week, ActivityInstance, Activity } from '../db/models/index.js';
import { notFound } from '../utils/error.js';
import { dateOnlyISO, startOfWeek, addDays } from '../utils/date.js';
import { statuses, categories } from '../utils/constants.js';
import { instanceDto } from './week.service.js';

export async function getWeeklyStats(userId, { weekId } = {}) {
  let week;
  if (weekId) {
    week = await Week.findOne({ where: { id: weekId, userId } });
  } else {
    const start = dateOnlyISO(startOfWeek());
    week = await Week.findOne({ where: { userId, startDate: start } });
  }
  if (!week) throw notFound('No week found for this period');

  const instances = await ActivityInstance.findAll({ where: { weekId: week.id } });
  const total = instances.length;
  const completed = instances.filter((i) => i.status === 'Completed').length;
  const skipped = instances.filter((i) => i.status === 'Skipped').length;
  const inProgress = instances.filter((i) => i.status === 'In progress').length;

  const byCategory = {};
  for (const c of categories) byCategory[c] = 0;
  for (const inst of instances) {
    let cat = null;
    if (inst.adHocCategory) {
      cat = inst.adHocCategory;
    } else if (inst.activityId) {
      const act = await Activity.findByPk(inst.activityId);
      cat = act ? act.category : null;
    }
    if (cat && inst.status === 'Completed') byCategory[cat] = (byCategory[cat] || 0) + 1;
  }

  return {
    week_id: week.id,
    start_date: week.startDate,
    end_date: dateOnlyISO(addDays(week.startDate, 6)),
    parent_reflection: week.parentReflection,
    total,
    completed,
    skipped,
    in_progress: inProgress,
    pending: total - completed - skipped - inProgress,
    by_category: byCategory,
  };
}

export async function getLastFourWeeks(userId) {
  const weeks = await Week.findAll({ where: { userId }, order: [['startDate', 'DESC']], limit: 4 });
  const result = [];
  for (const week of weeks) {
    const instances = await ActivityInstance.findAll({ where: { weekId: week.id } });
    let completed = 0;
    const byCategory = {};
    for (const inst of instances) {
      let cat = null;
      if (inst.adHocCategory) cat = inst.adHocCategory;
      else if (inst.activityId) {
        const act = await Activity.findByPk(inst.activityId);
        cat = act ? act.category : null;
      }
      if (inst.status === 'Completed') {
        completed += 1;
        if (cat) byCategory[cat] = (byCategory[cat] || 0) + 1;
      }
    }
    result.push({
      week_id: week.id,
      start_date: week.startDate,
      completed,
      by_category: byCategory,
    });
  }
  return result;
}

export async function getReflections(userId, { weekId } = {}) {
  const where = { userId };
  if (weekId) where.id = weekId;
  const weeks = await Week.findAll({ where, order: [['startDate', 'DESC']], limit: 12 });
  const reflections = [];
  for (const week of weeks) {
    if (week.parentReflection && week.parentReflection.trim()) {
      reflections.push({ type: 'weekly', week_id: week.id, start_date: week.startDate, text: week.parentReflection });
    }
    const instances = await ActivityInstance.findAll({
      where: { weekId: week.id, reflectionText: { [Op.ne]: null } },
      include: [{ model: Activity, as: 'Activity', required: false }],
    });
    for (const inst of instances) {
      if (!inst.reflectionText || !inst.reflectionText.trim()) continue;
      reflections.push({
        type: 'activity',
        instance_id: inst.id,
        week_id: week.id,
        start_date: week.startDate,
        text: inst.reflectionText,
        title: inst.adHocTitle || (inst.Activity ? inst.Activity.title : 'Activity'),
        status: inst.status,
      });
    }
  }
  return { reflections };
}

export { statuses };