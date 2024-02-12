const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const Restaurant = require("./restaurants");

const Model = Sequelize.Model;

class RestaurantTranslation extends Model {}

RestaurantTranslation.init(
  {
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    lang: Sequelize.STRING,
  },
  {
    modelName: "restaurantTranslation",
    timestamps: false,
    sequelize,
  }
);

Restaurant.hasMany(RestaurantTranslation, { onDelete: "CASCADE" });
RestaurantTranslation.belongsTo(Restaurant);

module.exports = RestaurantTranslation;
