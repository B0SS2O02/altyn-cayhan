const Sequelize = require("sequelize");
const { sequelize } = require("../../../database/models"); 
const Orders = require("./orders");
const Product = require("../product/product");

const Model = Sequelize.Model;

class OrdersItem extends Model { }

OrdersItem.init(
    {
        count: Sequelize.INTEGER
    },
    {
        modelName: "orderItem",
        sequelize,
    }
);

Orders.hasMany(OrdersItem, { onDelete: 'CASCADE' })
Product.hasMany(OrdersItem, { onDelete: 'CASCADE' })
OrdersItem.belongsTo(Product)
module.exports = OrdersItem;
