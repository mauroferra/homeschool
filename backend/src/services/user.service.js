import bcrypt from 'bcryptjs';
import { User } from '../db/models/index.js';
import { notFound, badRequest } from '../utils/error.js';

export async function listUsers() {
  const users = await User.findAll();
  return users.map((u) => u.toDTO());
}

export async function createUser({ email, password, role }) {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.unscoped().findOne({ where: { email: normalizedEmail } });
  if (existing) throw badRequest('An account with this email already exists', 'EMAIL_IN_USE');
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email: normalizedEmail, passwordHash: hash, role });
  return user.toDTO();
}

export async function updateUser(id, { role, active }) {
  const user = await User.unscoped().findByPk(id);
  if (!user) throw notFound('User not found');
  if (role !== undefined) user.role = role;
  if (active !== undefined) user.active = active === true || active === 'true';
  await user.save();
  return user.toDTO();
}

export async function deleteUser(id) {
  const user = await User.unscoped().findByPk(id);
  if (!user) throw notFound('User not found');
  user.active = false;
  await user.save();
  return { success: true };
}