import { DataTypes } from 'sequelize';

const ACTIVITY_TRANSLATION_COLUMNS = [
  { name: 'title_en', type: DataTypes.STRING },
  { name: 'title_cs', type: DataTypes.STRING },
  { name: 'title_it', type: DataTypes.STRING },
  { name: 'description_en', type: DataTypes.TEXT },
  { name: 'description_cs', type: DataTypes.TEXT },
  { name: 'description_it', type: DataTypes.TEXT },
];

export const up = async ({ context: queryInterface }) => {
  if (!(await queryInterface.tableExists('activities'))) {
    await queryInterface.createTable('activities', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      ...Object.fromEntries(ACTIVITY_TRANSLATION_COLUMNS.map((c) => [c.name, { type: c.type }])),
      category: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      estimated_duration: { type: DataTypes.INTEGER },
      links: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
      attachments: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
      theme_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'themes', key: 'id' },
        onDelete: 'SET NULL',
      },
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
    const existing = await queryInterface.describeTable('activities').catch(() => ({}));
    for (const col of ACTIVITY_TRANSLATION_COLUMNS) {
      if (!existing[col.name]) {
        await queryInterface.addColumn('activities', col.name, { type: col.type });
      }
    }
  }
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('activities');
};