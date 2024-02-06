const Sequelize = require("sequelize");
const config = require("config");
require("pg").defaults.parseInt8 = true;
const dbConfig = config.get("database");
console.log(dbConfig)
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    // storage: dbConfig.storage,
    logging: dbConfig.logging,
  }
);

// const { Sequelize } = require('sequelize');

// // Option 1: Passing a connection URI
// const sequelize = new Sequelize('postgres://root:root5312023@127.0.0.1:5432/jankoyer')

module.exports = sequelize;
