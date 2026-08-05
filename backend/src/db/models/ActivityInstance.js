import { DataTypes } from 'sequelize';
import { getSequelize } from '../db.js';

const ActivityInstance = getSequelize().define('ActivityInstance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  weekId: { type: DataTypes.INTEGER, field: 'week_id', allowNull: false },
  dayOfWeek: { type: DataTypes.INTEGER, field: 'day_of_week', allowNull: false, validate: { min: 0, max: 6 } },
  blockType: { type: DataTypes.STRING, field: 'block_type', allowNull: false },
  activityId: { type: DataTypes.INTEGER, field: 'activity_id', allowNull: true },
  homeTag: { type: DataTypes.STRING, field: 'home_tag', defaultValue: 'Home A' },
  status: { type: DataTypes.STRING, defaultValue: 'Not started' },
  reflectionText: { type: DataTypes.TEXT, field: 'reflection_text', allowNull: true },
  adHocTitle: { type: DataTypes.STRING, field: 'ad_hoc_title', allowNull: true },
  adHocCategory: { type: DataTypes.STRING, field: 'ad_hoc_category', allowNull: true },
  adHocDescription: { type: DataTypes.TEXT, field: 'ad_hoc_description', allowNull: true },
  adHocDuration: { type: DataTypes.INTEGER, field: 'ad_hoc_duration', allowNull: true },
  adHocLinks: { type: DataTypes.JSON, field: 'ad_hoc_links', allowNull: true },
}, {
  tableName: 'activity_instances',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default ActivityInstance;