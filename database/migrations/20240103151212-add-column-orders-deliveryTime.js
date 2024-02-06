'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "timeOfDay", {
      type: Sequelize.INTEGER,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders", "timeOfDay",{})
  }
};
