import * as externalTypeService from '../../services/externalType.service.js';

export async function list(req, res, next) {
  try {
    const types = await externalTypeService.listExternalTypes(req.user.id);
    res.json(types);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const type = await externalTypeService.createExternalType(req.user.id, req.body);
    res.status(201).json(type);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const type = await externalTypeService.updateExternalType(req.user.id, parseInt(req.params.id, 10), req.body);
    res.json(type);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await externalTypeService.deleteExternalType(req.user.id, parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}