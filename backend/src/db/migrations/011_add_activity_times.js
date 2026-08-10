import { DataTypes } from 'sequelize';

const TIME_COLUMNS = [
  { name: 'start_time', type: DataTypes.STRING(5) },
  { name: 'end_time', type: DataTypes.STRING(5) },
];

export const up = async ({ context: queryInterface }) => {
  if (!(await queryInterface.tableExists('activities'))) return;
  const existing = await queryInterface.describeTable('activities').catch(() => ({}));
  for (const col of TIME_COLUMNS) {
    if (!existing[col.name]) {
      await queryInterface.addColumn('activities', col.name, { type: col.type });
    }
  }
};

export const down = async ({ context: queryInterface }) => {
  const existing = await queryInterface.describeTable('activities').catch(() => ({}));
  for (const col of TIME_COLUMNS) {
    if (existing[col.name]) {
      await queryInterface.removeColumn('activities', col.name);
    }
  }
};