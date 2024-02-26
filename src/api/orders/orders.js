const Sequelize = require("sequelize");
const { sequelize } = require("../../../database/models");

const Model = Sequelize.Model;

class Orders extends Model {}

Orders.init(
  {
    fullName: Sequelize.STRING,
    address: Sequelize.STRING,
    phoneNumber: Sequelize.STRING,
    totalPrice: Sequelize.FLOAT,
    deliveryTime: Sequelize.STRING,
    timeOfDay: Sequelize.INTEGER,
    isView: Sequelize.BOOLEAN,
    status: {
      type: Sequelize.ENUM,
      values: ["completed", "cancelled", "on the way", "waiting"],
    },
  },
  {
    modelName: "order",
    sequelize,
  }
);

module.exports = Orders;
