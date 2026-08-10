import { DataTypes } from 'sequelize';

// Users table created before the password/reset columns were given explicit
// snake_case `field` mappings (old db.sync() era) has camelCase columns.
// Rename them idempotently so both legacy and fresh DBs match the model.
const LEGACY_TO_CANONICAL = [
  { legacy: 'resetToken', canonical: 'reset_token', type: DataTypes.STRING },
  { legacy: 'resetTokenExpires', canonical: 'reset_token_expires', type: DataTypes.DATE },
];

export const up = async ({ context: queryInterface }) => {
  if (!(await queryInterface.tableExists('users'))) return;

  const existing = await queryInterface.describeTable('users');
  for (const { legacy, canonical, type } of LEGACY_TO_CANONICAL) {
    if (existing[legacy] && !existing[canonical]) {
      await queryInterface.renameColumn('users', legacy, canonical);
    } else if (!existing[canonical]) {
      await queryInterface.addColumn('users', canonical, { type, allowNull: true });
    }
  }
};

export const down = async ({ context: queryInterface }) => {
  const existing = await queryInterface.describeTable('users');
  for (const { legacy, canonical } of LEGACY_TO_CANONICAL) {
    if (existing[canonical] && !existing[legacy]) {
      await queryInterface.renameColumn('users', canonical, legacy);
    }
  }
};