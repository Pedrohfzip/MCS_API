import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Car extends Model {
    static associate(models) {
      // define association here, if needed
    }
  }
  Car.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      yaer: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Car',
      tableName: 'cars',
    }
  );
  return Car;
};
