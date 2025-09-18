import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING(60), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING(400) },
  role: { type: DataTypes.ENUM('admin', 'normal', 'owner'), allowNull: false }
}, { timestamps: true });

export default User;