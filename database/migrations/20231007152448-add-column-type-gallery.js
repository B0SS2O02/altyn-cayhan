"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("galleries", "type", {
      type: Sequelize.ENUM,
      values: ['gallery', 'banner']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("galleries", "type");
  },
};

