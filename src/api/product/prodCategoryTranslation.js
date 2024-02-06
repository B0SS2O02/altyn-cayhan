const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const ProdCategory = require("./prodCategory");

const Model = Sequelize.Model;

class ProdCategoryTranslation extends Model { }

ProdCategoryTranslation.init(
    {
        title: Sequelize.STRING,
        lang: Sequelize.STRING
    },
    {
        modelName: "ProdCategoryTranslation",
        sequelize,
    }
);

ProdCategory.hasMany(ProdCategoryTranslation, { onDelete: 'CASCADE' })
ProdCategoryTranslation.belongsTo(ProdCategory)

module.exports = ProdCategoryTranslation;
