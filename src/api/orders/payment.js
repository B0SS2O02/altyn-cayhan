const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const Orders = require("./orders");

const Model = Sequelize.Model;

class Payment extends Model { }

Payment.init(
    {
        transactionId: Sequelize.STRING,
        status: {
            type: Sequelize.ENUM,
            values: ['success', 'failure', 'pending']
        }
    },
    {
        modelName: "payment",
        timestamps:false,
        sequelize,
    }
);

Orders.hasMany(Payment, { onDelete: 'CASCADE' })
Payment.belongsTo(Orders, { onDelete: 'CASCADE' })

module.exports = Payment;
