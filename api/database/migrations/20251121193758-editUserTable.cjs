'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove a coluna id
    await queryInterface.removeColumn('users', 'id');
    // Adiciona a coluna id como UUID
    await queryInterface.addColumn('users', 'uuid', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      // allowNull: false,
      primaryKey: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove a coluna id
    await queryInterface.removeColumn('users', 'id');
    // Adiciona a coluna id como INTEGER autoincremento
  }
};
