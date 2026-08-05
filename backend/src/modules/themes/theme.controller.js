import * as themeService from '../../services/theme.service.js';

export async function list(req, res, next) {
  try {
    const themes = await themeService.listThemes(req.user.id);
    res.json(themes);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const theme = await themeService.createTheme(req.user.id, req.body);
    res.status(201).json(theme);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const theme = await themeService.updateTheme(req.user.id, parseInt(req.params.id, 10), req.body);
    res.json(theme);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await themeService.deleteTheme(req.user.id, parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}