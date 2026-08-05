import { Sequelize } from 'sequelize';
import config from '../config/env.js';

let sequelize;

export function createConnection() {
  if (sequelize) return sequelize;

  const opts = config.db;
  if (opts.dialect === 'sqlite') {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: opts.storage,
      logging: opts.logging,
    });
  } else {
    sequelize = new Sequelize(opts.database, opts.username, opts.password, {
      dialect: opts.dialect,
      host: opts.host,
      port: opts.port,
      logging: opts.logging,
      define: { underscored: false },
    });
  }
  return sequelize;
}

export async function authenticate() {
  const db = createConnection();
  await db.authenticate();
  return db;
}

export async function closeConnection() {
  if (sequelize) await sequelize.close();
  sequelize = undefined;
}

export function getSequelize() {
  return createConnection();
}

export default { createConnection, authenticate, closeConnection, getSequelize };