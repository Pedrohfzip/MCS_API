'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Cria a tabela carsToUser para ligação entre usuário e carro
    await queryInterface.createTable('carsToUser', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove a tabela carsToUser
    await queryInterface.dropTable('carsToUser');
  }
};
