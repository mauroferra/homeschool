import bcrypt from 'bcryptjs';
import { User } from '../../src/db/models/index.js';

export async function upsertAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@faro.app';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(password, 10);
  const [user] = await User.findOrCreate({
    where: { email },
    defaults: { email, passwordHash: hash, role: 'admin', active: true },
  });
  return user;
}