import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  if (!(await queryInterface.tableExists('external_activity_types'))) {
    await queryInterface.createTable('external_activity_types', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: { type: DataTypes.STRING, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  }
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('external_activity_types');
};