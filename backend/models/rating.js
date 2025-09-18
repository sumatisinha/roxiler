import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Rating = sequelize.define('Rating', {
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } }
}, { timestamps: true });

export default Rating;