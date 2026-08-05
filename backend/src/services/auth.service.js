import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { User } from '../db/models/index.js';
import { badRequest, unauthorized, notFound } from '../utils/error.js';

async function issueToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

export async function login({ email, password }) {
  const user = await User.unscoped().findOne({ where: { email: email.toLowerCase().trim() } });
  if (!user || !user.active) throw unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  const token = await issueToken(user);
  return { token, user: user.toDTO() };
}

export async function logout() {
  return { success: true };
}

export async function requestPasswordReset({ email }) {
  const user = await User.unscoped().findOne({ where: { email: email.toLowerCase().trim() } });
  if (!user) return { success: true, message: 'If that email exists, a reset link has been sent.' };
  const token = jwt.sign({ sub: user.id, purpose: 'reset' }, config.jwt.secret, { expiresIn: '30m' });
  user.resetToken = token;
  user.resetTokenExpires = new Date(Date.now() + config.resetTokenTtlMinutes * 60 * 1000);
  await user.save();
  const link = `${config.baseUrl}/api/v1/auth/reset/confirm?token=${token}`;
  console.log(`[auth] Password reset link for ${email}: ${link}`);
  if (process.env.NODE_ENV !== 'production') {
    return { success: true, message: 'Reset link generated (dev): see server logs.', resetLink: link };
  }
  return { success: true, message: 'If that email exists, a reset link has been sent.' };
}

export async function confirmPasswordReset({ token, password }) {
  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch {
    throw badRequest('Reset token is invalid or expired', 'INVALID_RESET_TOKEN');
  }
  if (payload.purpose !== 'reset') throw badRequest('Reset token is invalid', 'INVALID_RESET_TOKEN');
  const user = await User.unscoped().findByPk(payload.sub);
  if (!user) throw notFound('User not found');
  if (!user.resetToken || user.resetToken !== token) throw badRequest('Reset token has already been used', 'INVALID_RESET_TOKEN');
  const hash = await bcrypt.hash(password, 10);
  user.passwordHash = hash;
  user.resetToken = null;
  user.resetTokenExpires = null;
  await user.save();
  return { success: true };
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.unscoped().findByPk(userId);
  if (!user) throw notFound('User not found');
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) throw badRequest('Current password is incorrect', 'INVALID_CURRENT_PASSWORD');
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { success: true };
}

export async function updateProfile(userId, { profile }) {
  const user = await User.unscoped().findByPk(userId);
  if (!user) throw notFound('User not found');
  user.profile = profile || user.profile || {};
  await user.save();
  return user.toDTO();
}

export async function getProfile(userId) {
  const user = await User.unscoped().findByPk(userId);
  if (!user) throw notFound('User not found');
  return user.toDTO();
}