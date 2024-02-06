const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Model = Sequelize.Model;

class Auth extends Model {}

Auth.init(
  {
    fullName: {
      type: Sequelize.STRING,
    },
    login: Sequelize.STRING,
    password: Sequelize.STRING,
    role: {
      type: Sequelize.ENUM,
      values: ["admin"],
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "auth",
  }
);

module.exports = Auth;
