'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('cars', 'gas', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'N/A',
    });
    await queryInterface.addColumn('cars', 'color', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'N/A',
    });
    await queryInterface.addColumn('cars', 'km', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('cars', 'gas');
    await queryInterface.removeColumn('cars', 'color');
    await queryInterface.removeColumn('cars', 'km');
  }
};
