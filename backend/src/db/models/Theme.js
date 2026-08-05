import { DataTypes } from 'sequelize';
import { getSequelize } from '../db.js';

const Theme = getSequelize().define('Theme', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  startDate: { type: DataTypes.DATEONLY, field: 'start_date' },
  endDate: { type: DataTypes.DATEONLY, field: 'end_date' },
  userId: { type: DataTypes.INTEGER, field: 'user_id', allowNull: false },
}, {
  tableName: 'themes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Theme;