'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adiciona a coluna carId na tabela carsToUser
    await queryInterface.addColumn('carsToUser', 'carId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'cars',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove a coluna carId da tabela carsToUser
    await queryInterface.removeColumn('carsToUser', 'carId');
  }
};
