const { Sequelize } = require("sequelize");
const config = require("../../../config").development;

console.log(config.database);

let sequelize = new Sequelize(config.database);

module.exports = sequelize;
