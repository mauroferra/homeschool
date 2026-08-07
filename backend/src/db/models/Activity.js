import { DataTypes } from 'sequelize';
import { getSequelize } from '../db.js';

const Activity = getSequelize().define('Activity', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  title_en: { type: DataTypes.STRING },
  title_cs: { type: DataTypes.STRING },
  title_it: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  description_en: { type: DataTypes.TEXT },
  description_cs: { type: DataTypes.TEXT },
  description_it: { type: DataTypes.TEXT },
  estimatedDuration: { type: DataTypes.INTEGER, field: 'estimated_duration' },
  links: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  attachments: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  themeId: { type: DataTypes.INTEGER, field: 'theme_id', allowNull: true },
  userId: { type: DataTypes.INTEGER, field: 'user_id', allowNull: false },
}, {
  tableName: 'activities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Activity;