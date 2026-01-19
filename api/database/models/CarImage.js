
import { DataTypes } from 'sequelize';
import sequelize from '../index.js';

const CarImage = sequelize.define('CarImage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  carId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cars',
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'CarImage',
  timestamps: true,
});

CarImage.associate = function(models) {
  CarImage.belongsTo(models.cars, {
    foreignKey: 'carId',
    as: 'car',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default CarImage;
