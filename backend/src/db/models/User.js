import { DataTypes } from 'sequelize';
import { getSequelize } from '../db.js';

const User = getSequelize().define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
  role: { type: DataTypes.STRING, defaultValue: 'parent' },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
  resetToken: { type: DataTypes.STRING, allowNull: true },
  resetTokenExpires: { type: DataTypes.DATE, allowNull: true },
  profile: { type: DataTypes.JSON, allowNull: true },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  defaultScope: {
    attributes: { exclude: ['passwordHash', 'resetToken', 'resetTokenExpires'] },
  },
});

User.prototype.toDTO = function toDTO() {
  const json = this.toJSON();
  return {
    id: json.id,
    email: json.email,
    role: json.role,
    active: json.active,
    created_at: json.created_at,
  };
};

export default User;