import * as weekService from '../../services/week.service.js';

export async function list(req, res, next) {
  try {
    const weeks = await weekService.listWeeks(req.user.id);
    res.json(weeks);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const week = await weekService.createWeek(req.user.id, req.body);
    res.status(201).json(week);
  } catch (err) {
    next(err);
  }
}

export async function get(req, res, next) {
  try {
    const week = await weekService.getWeek(req.user.id, parseInt(req.params.id, 10));
    res.json(week);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await weekService.deleteWeek(req.user.id, parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function updateReflection(req, res, next) {
  try {
    const week = await weekService.updateWeekReflection(req.user.id, parseInt(req.params.id, 10), req.body);
    res.json(week);
  } catch (err) {
    next(err);
  }
}