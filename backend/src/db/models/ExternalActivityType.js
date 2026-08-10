import { DataTypes } from 'sequelize';
import { getSequelize } from '../db.js';

const ExternalActivityType = getSequelize().define('ExternalActivityType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, field: 'user_id', allowNull: false },
}, {
  tableName: 'external_activity_types',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default ExternalActivityType;