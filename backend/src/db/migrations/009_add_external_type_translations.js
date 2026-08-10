import { DataTypes } from 'sequelize';

const EXTERNAL_TYPE_TRANSLATION_COLUMNS = [
  { name: 'name_en', type: DataTypes.STRING },
  { name: 'name_cs', type: DataTypes.STRING },
  { name: 'name_it', type: DataTypes.STRING },
];

export const up = async ({ context: queryInterface }) => {
  const existing = await queryInterface.describeTable('external_activity_types').catch(() => ({}));
  for (const col of EXTERNAL_TYPE_TRANSLATION_COLUMNS) {
    if (!existing[col.name]) {
      await queryInterface.addColumn('external_activity_types', col.name, { type: col.type });
    }
  }
};

export const down = async ({ context: queryInterface }) => {
  const existing = await queryInterface.describeTable('external_activity_types').catch(() => ({}));
  for (const col of EXTERNAL_TYPE_TRANSLATION_COLUMNS) {
    if (existing[col.name]) {
      await queryInterface.removeColumn('external_activity_types', col.name);
    }
  }
};