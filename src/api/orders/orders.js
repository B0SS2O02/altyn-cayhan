const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Model = Sequelize.Model;

class Orders extends Model { }

Orders.init(
    {
        fullName: Sequelize.STRING,
        address: Sequelize.STRING,
        phoneNumber: Sequelize.STRING,
        totalPrice: Sequelize.INTEGER,
        deliveryTime: Sequelize.STRING,
        timeOfDay: Sequelize.INTEGER,
        isPaidBank: Sequelize.BOOLEAN,
        paymentMethod: {
            type: Sequelize.ENUM,
            values: ['cash', 'card']
        },
        bank: {
            type: Sequelize.ENUM,
            values: ['0', '1', '2', '3']
        },
        isView: Sequelize.BOOLEAN,
        status: {
            type: Sequelize.ENUM,
            values: ['completed', 'cancelled', 'on the way', 'waiting']
        }
    },
    {
        modelName: "order",
        sequelize,
    }
);

module.exports = Orders;
