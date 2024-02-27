const Sequelize = require("sequelize");
const { sequelize } = require("../../../database/models");

const config = require("../../../serverSettings.json");
const Model = Sequelize.Model;

class ProdCategory extends Model {}

ProdCategory.init(
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
    modelName: "prodCategory",
    sequelize,
  }
);
module.exports = ProdCategory;
