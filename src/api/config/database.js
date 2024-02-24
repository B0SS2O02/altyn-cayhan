const { Sequelize } = require("sequelize");
const config = require("../../../config").development;

let sequelize = new Sequelize(config.database);

module.exports = sequelize;
