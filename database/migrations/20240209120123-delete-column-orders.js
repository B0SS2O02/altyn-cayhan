"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders", "paymentMethod");
    await queryInterface.removeColumn("orders", "bank");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "paymentMethod", {
      type: Sequelize.ENUM,
      values: ["cash", "card"],
    });
    await queryInterface.addColumn("orders", "bank", {
      type: Sequelize.ENUM,
      values: ["0", "1", "2", "3"],
    });
  },
};
