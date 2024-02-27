const { sequelize } = require("../../../database/models");
const Sequelize = require("sequelize");
const config = require("../../../serverSettings.json");
const Model = Sequelize.Model;

class Restaurant extends Model {}

Restaurant.init(
  {
    image: {
      type: Sequelize.STRING,
      get() {
        return `${config.url}:${config.port}${this.getDataValue("image")}`;
      },
    },
    position: Sequelize.INTEGER,
  },
  {
    timestamps: false,
    modelName: "restaurant",
    sequelize,
  }
);

module.exports = Restaurant;
