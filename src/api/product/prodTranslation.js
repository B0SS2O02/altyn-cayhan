const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");

const Model = Sequelize.Model;

class ProdTranslation extends Model { }

ProdTranslation.init(
    {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        lang: Sequelize.STRING
    },
    {
        modelName: "prodTranslation",
        sequelize,
    }
);

Product.hasMany(ProdTranslation, { onDelete: 'CASCADE' })
ProdTranslation.belongsTo(Product)


module.exports = ProdTranslation;
