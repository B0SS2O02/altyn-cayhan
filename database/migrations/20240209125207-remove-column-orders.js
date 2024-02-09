"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders", "isPaidBank");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "isPaidBank", {
      type: Sequelize.BOOLEAN,
    });
  },
};
