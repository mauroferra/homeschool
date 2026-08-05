import * as userService from '../../services/user.service.js';

export async function list(req, res, next) {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const user = await userService.updateUser(parseInt(req.params.id, 10), req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await userService.deleteUser(parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}