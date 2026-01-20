'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
	  // Remove o defaultValue do campo 'role' da tabela 'users'
	  await queryInterface.changeColumn('users', 'role', {
	    type: Sequelize.STRING,
	    allowNull: false
	  });
  },

  async down (queryInterface, Sequelize) {
    // Restaura o defaultValue do campo 'role' da tabela 'users'
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user'
    });
  }
};
