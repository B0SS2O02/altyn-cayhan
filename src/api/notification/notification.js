const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Model = Sequelize.Model;

class Notification extends Model { }

Notification.init(
    {
        token: {
            type: Sequelize.TEXT
        },
        deviceId: {
            type: Sequelize.TEXT
        }
    },
    {
        sequelize,
        modelName: "notification",
    }
);

module.exports = Notification;
