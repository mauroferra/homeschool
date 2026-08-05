import * as weekService from '../../services/week.service.js';

export async function listForWeek(req, res, next) {
  try {
    const instances = await weekService.listWeekInstances(req.user.id, parseInt(req.params.week_id, 10), {
      household: req.query.household || 'All',
    });
    res.json(instances);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const instance = await weekService.createWeekInstance(req.user.id, parseInt(req.params.week_id, 10), req.body);
    res.status(201).json(instance);
  } catch (err) {
    next(err);
  }
}

export async function createAdHoc(req, res, next) {
  try {
    const instance = await weekService.createAdHocInstance(req.user.id, parseInt(req.params.week_id, 10), req.body);
    res.status(201).json(instance);
  } catch (err) {
    next(err);
  }
}

export async function get(req, res, next) {
  try {
    const instance = await weekService.getInstance(req.user.id, parseInt(req.params.id, 10));
    res.json(instance);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const instance = await weekService.updateInstance(req.user.id, parseInt(req.params.id, 10), req.body);
    res.json(instance);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await weekService.deleteInstance(req.user.id, parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}