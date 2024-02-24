const { sequelize } = require("../../../database/models");
const Sequelize = require("sequelize");

const Model = Sequelize.Model;

class Restaurant extends Model {}

Restaurant.init(
  {
    image: Sequelize.STRING,
    position: Sequelize.INTEGER,
  },
  {
    timestamps: false,
    modelName: "restaurant",
    sequelize,
  }
);

module.exports = Restaurant;
