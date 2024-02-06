const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Model = Sequelize.Model;

class ProdCategory extends Model {}

ProdCategory.init(
  {
    image: {
      type: Sequelize.STRING,
    },
    position: Sequelize.INTEGER,
  },
  {
    modelName: "prodCategory",
    sequelize,
  }
);
module.exports = ProdCategory;
