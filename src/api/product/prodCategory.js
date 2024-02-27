const Sequelize = require("sequelize");
const { sequelize } = require("../../../database/models");

const config = require("../../../serverSettings.json");
const Restaurant = require("../restaurant/restaurants");
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

Restaurant.hasMany(ProdCategory, { onDelete: "CASCADE" });
ProdCategory.belongsTo(Restaurant);
module.exports = ProdCategory;
