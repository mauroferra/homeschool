import * as authService from '../../services/auth.service.js';

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function reset(req, res, next) {
  try {
    const result = await authService.requestPasswordReset(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function resetConfirm(req, res, next) {
  try {
    const result = await authService.confirmPasswordReset(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const result = await authService.changePassword(req.user.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}