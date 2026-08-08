import { DataTypes } from 'sequelize';

// Idempotent baseline: on a fresh DB it creates the table; on an existing DB
// (built by the pre-umzug sync() stage) it skips, so running against both is safe.
export const up = async ({ context: queryInterface }) => {
  if (!(await queryInterface.tableExists('users'))) {
    await queryInterface.createTable('users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: 'parent' },
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
      reset_token: { type: DataTypes.STRING, allowNull: true },
      reset_token_expires: { type: DataTypes.DATE, allowNull: true },
      profile: { type: DataTypes.JSON, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  }
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('users');
};