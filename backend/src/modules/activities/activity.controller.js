import * as activityService from '../../services/activity.service.js';

export async function list(req, res, next) {
  try {
    const activities = await activityService.listActivities(req.user.id, { themeId: req.query.theme_id });
    res.json(activities);
  } catch (err) {
    next(err);
  }
}

export async function get(req, res, next) {
  try {
    const activity = await activityService.getActivity(req.user.id, parseInt(req.params.id, 10));
    res.json(activity);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const activity = await activityService.createActivity(req.user.id, req.body);
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const activity = await activityService.updateActivity(req.user.id, parseInt(req.params.id, 10), req.body);
    res.json(activity);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await activityService.deleteActivity(req.user.id, parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}