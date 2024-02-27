const Sequelize = require("sequelize");
const { sequelize } = require("../../../database/models");
const ProdCategory = require("./prodCategory");
const Restaurant = require("../restaurant/restaurants");
const config = require("../../../serverSettings.json");

const Model = Sequelize.Model;

class Product extends Model {}

Product.init(
  {
    price: {
      type: Sequelize.STRING,
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    popular: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    discount: {
      type: Sequelize.INTEGER,
    },
    image: {
      type: Sequelize.STRING,
      get() {
        return `${config.url}:${config.port}${this.getDataValue("image")}`;
      },
    },
    position: {
      type: Sequelize.INTEGER,
    },
  },
  {
    modelName: "product",
    sequelize,
  }
);

ProdCategory.hasMany(Product, { onDelete: "CASCADE" });
Product.belongsTo(ProdCategory);
Restaurant.hasMany(Product, { onDelete: "CASCADE" });
Product.belongsTo(Restaurant);
module.exports = Product;
