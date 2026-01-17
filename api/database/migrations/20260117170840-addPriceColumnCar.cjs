'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adiciona a coluna 'price' na tabela 'Cars'
    await queryInterface.addColumn('cars', 'price', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove a coluna 'price' da tabela 'cars'
    await queryInterface.removeColumn('cars', 'price');
  }
};
