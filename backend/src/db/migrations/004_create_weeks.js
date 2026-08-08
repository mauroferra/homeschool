import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  if (!(await queryInterface.tableExists('weeks'))) {
    await queryInterface.createTable('weeks', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      start_date: { type: DataTypes.DATEONLY, allowNull: false },
      parent_reflection: { type: DataTypes.TEXT, allowNull: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
    await queryInterface.addIndex('weeks', ['start_date', 'user_id'], { unique: true });
  }
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('weeks');
};