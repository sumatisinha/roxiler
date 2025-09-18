import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Store = sequelize.define('Store', {
  name: { type: DataTypes.STRING(60), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  address: { type: DataTypes.STRING(400) },
}, { timestamps: true });

export default Store;