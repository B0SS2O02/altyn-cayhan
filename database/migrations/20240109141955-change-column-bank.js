'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders","bank",{})
    await queryInterface.addColumn("orders", "bank", {
      type:Sequelize.ENUM,
      values:['0','1','2','3']
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders","bank",{})
    await queryInterface.addColumn("orders","bank",{
      type:Sequelize.STRING,
      defaultValue:null
    })
  }
};
