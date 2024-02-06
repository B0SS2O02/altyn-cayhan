"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('products', 'discount', {
      type: Sequelize.INTEGER
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'discount', {});
  },
};
