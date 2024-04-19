const { Sequelize } = require("sequelize");
const config = require("../../../config")[process.env.NODE_ENV];

console.log(config.database);

let sequelize = new Sequelize(config.database);

module.exports = sequelize;
