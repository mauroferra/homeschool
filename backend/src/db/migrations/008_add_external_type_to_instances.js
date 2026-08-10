import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  if (!(await queryInterface.tableExists('activity_instances'))) return;
  const existing = await queryInterface.describeTable('activity_instances').catch(() => ({}));
  if (!existing.external_type_id) {
    await queryInterface.addColumn('activity_instances', 'external_type_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'external_activity_types', key: 'id' },
      onDelete: 'SET NULL',
    });
  }
};

export const down = async ({ context: queryInterface }) => {
  const existing = await queryInterface.describeTable('activity_instances').catch(() => ({}));
  if (existing.external_type_id) {
    await queryInterface.removeColumn('activity_instances', 'external_type_id');
  }
};