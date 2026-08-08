import { DataTypes } from 'sequelize';

const THEME_TRANSLATION_COLUMNS = [
  { name: 'name_en', type: DataTypes.STRING },
  { name: 'name_cs', type: DataTypes.STRING },
  { name: 'name_it', type: DataTypes.STRING },
  { name: 'description_en', type: DataTypes.TEXT },
  { name: 'description_cs', type: DataTypes.TEXT },
  { name: 'description_it', type: DataTypes.TEXT },
];

export const up = async ({ context: queryInterface }) => {
  if (!(await queryInterface.tableExists('themes'))) {
    await queryInterface.createTable('themes', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      ...Object.fromEntries(THEME_TRANSLATION_COLUMNS.map((c) => [c.name, { type: c.type }])),
      description: { type: DataTypes.TEXT },
      start_date: { type: DataTypes.DATEONLY },
      end_date: { type: DataTypes.DATEONLY },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  } else {
    // Existing DBs created before the translation columns existed need them
    // back-ported idempotently.
    const existing = await queryInterface.describeTable('themes').catch(() => ({}));
    for (const col of THEME_TRANSLATION_COLUMNS) {
      if (!existing[col.name]) {
        await queryInterface.addColumn('themes', col.name, { type: col.type });
      }
    }
  }
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('themes');
};