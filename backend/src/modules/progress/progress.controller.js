import * as progressService from '../../services/progress.service.js';

export async function weeklyStats(req, res, next) {
  try {
    const stats = await progressService.getWeeklyStats(req.user.id, { weekId: req.query.week_id });
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

export async function lastFourWeeks(req, res, next) {
  try {
    const weeks = await progressService.getLastFourWeeks(req.user.id);
    res.json(weeks);
  } catch (err) {
    next(err);
  }
}

export async function reflections(req, res, next) {
  try {
    const result = await progressService.getReflections(req.user.id, { weekId: req.query.week_id });
    res.json(result);
  } catch (err) {
    next(err);
  }
}