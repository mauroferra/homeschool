import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  if (!(await queryInterface.tableExists('activity_instances'))) {
    await queryInterface.createTable('activity_instances', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      week_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'weeks', key: 'id' },
        onDelete: 'CASCADE',
      },
      day_of_week: { type: DataTypes.INTEGER, allowNull: false },
      block_type: { type: DataTypes.STRING, allowNull: false },
      activity_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'activities', key: 'id' },
        onDelete: 'SET NULL',
      },
      home_tag: { type: DataTypes.STRING, defaultValue: 'Home A' },
      status: { type: DataTypes.STRING, defaultValue: 'Not started' },
      reflection_text: { type: DataTypes.TEXT, allowNull: true },
      ad_hoc_title: { type: DataTypes.STRING, allowNull: true },
      ad_hoc_category: { type: DataTypes.STRING, allowNull: true },
      ad_hoc_description: { type: DataTypes.TEXT, allowNull: true },
      ad_hoc_duration: { type: DataTypes.INTEGER, allowNull: true },
      ad_hoc_links: { type: DataTypes.JSON, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  }
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('activity_instances');
};