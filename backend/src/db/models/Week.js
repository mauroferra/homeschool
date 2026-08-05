import { DataTypes } from 'sequelize';
import { getSequelize } from '../db.js';

const Week = getSequelize().define('Week', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  startDate: { type: DataTypes.DATEONLY, field: 'start_date', allowNull: false },
  userId: { type: DataTypes.INTEGER, field: 'user_id', allowNull: false },
  parentReflection: { type: DataTypes.TEXT, field: 'parent_reflection', allowNull: true },
}, {
  tableName: 'weeks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [{ unique: true, fields: ['start_date', 'user_id'] }],
});

export default Week;