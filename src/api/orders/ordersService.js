const ProdTranslation = require("../product/prodTranslation");
const Product = require("../product/product");
const Orders = require("./orders");
const Payment = require("./payment");
const OrdersItem = require("./ordersItem");
const ErrorException = require("../error/ErrorException");
const NotFoundException = require("../error/NotFoundException");
const tfeb = require("./tfeb");

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const findOrders = async (page, size, lang, isView) => {
  let limits = {},
    where = {};
  if (page && size) {
    limits = {
      limit: size,
      offset: (page - 1) * size,
    };
  }

  if (isView) where = { ...where, isView: isView };

  const orders = await Orders.findAndCountAll({
    ...limits,
    where,
    include: [
      {
        model: Payment,
        attributes: ["transactionId", "status"],
      },
    ],
    order: [["id", "asc"]],
  });
  return {
    orders: orders.rows.map((convSequelize) => {
      const data = convSequelize.get({ plain: true });
      if (data.paymentMethod != "card") {
        delete data?.payments;
        delete data?.bank;
      }
      return data;
    }),
    page,
    size,
    totalPages: Math.ceil(orders.count / size),
  };
};

const updateStatusOnly = async (id, body) => {
  await Orders.update({ status: body.status }, { where: { id: id } });
};
const findOrderById = async (id, lang = "tm") => {
  console.log(id);
  let order = await Orders.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Payment,
        attributes: ["transactionId", "status"],
      },
      {
        model: OrdersItem,
        attributes: ["count"],
        include: [
          {
            model: Product,
            attributes: ["id", "price", "popular", "discount", "image"],
            include: [
              {
                model: ProdTranslation,
                attributes: ["title", "description", "lang"],
                where: { lang: lang },
              },
            ],
          },
        ],
      },
    ],
  });
  let convSequelizeOrder = await order.get({ plain: true });
  if (convSequelizeOrder.paymentMethod != "card") {
    delete convSequelizeOrder?.payments;
    delete convSequelizeOrder?.bank;
  }
  convSequelizeOrder.orderItems.map((data, index) => {
    Object.entries(...data.product.prodTranslations).forEach(
      (element, index) => {
        data.product[element[index]] = element[index + 1];
      }
    );
    delete data.product.prodTranslations;
    convSequelizeOrder.orderItems[index] = data;
  });

  return convSequelizeOrder;
};

const saveOrder = async (body, seqTrans) => {
  console.log(body);
  // const timeOfDay = body.deliveryTime % 4;
  // const currentDate = new Date()
  // const now = Date.now() + body.deliveryTime / 4 * 24 * 60 * 60 * 1000
  // let deliveryTime = new Date(currentDate.getTime() + body.deliveryTime / 4 * 24 * 60 * 60 * 1000).getTime()
  // const bank = body.bank.toString();
  // console.log(bank, 'here bank')

  const order = await Orders.create(
    {
      address: body.address,
      fullName: body.fullName,
      deliveryTime: body.deliveryTime,
      //   isPaidBank: body.paymentMethod == "card" ? false : true,
      //   timeOfDay,
      // paymentMethod: body.paymentMethod,
      phoneNumber: body.phoneNumber,
      status: "waiting",
    },
    { transaction: seqTrans }
  );
  const deliver = JSON.parse(
    fs.readFileSync(path.resolve("delivery.json"), "utf8")
  );

  let amount = parseInt(deliver.deliveryCharge) || 0;
  for (let index = 0; index < body.orders.length; index++) {
    const element = body.orders[index];
    const product = await Product.findByPk(element.foodId);

    if (!product) {
      throw new ErrorException(`Product by ${element.foodId} not found `);
    }
    if (element.count > 0) {
      amount += element.count * product.price;

      await OrdersItem.create(
        {
          count: element.count,
          orderId: order.id,
          productId: element.foodId,
        },
        { transaction: seqTrans }
      );
    }
  }
  if (amount > 0) {
    order.totalPrice = amount;
    await order.save({ transaction: seqTrans });
  }

  // return _data;
  return order;
};

const bankUrlRedirect = {
  auth: [
    {
      userName: "102122516430",
      password: "D3R23dTPdfhG36c",
    },
    {
      userName: "hazyna_doner",
      password: "hazyna_doner1",
    },
    {
      userName: "hazynaAPI",
      password: "Qwerty2",
    },
  ],
  banks: [
    `https://mpi.gov.tm/payment/rest`,
    `https://epg.senagatbank.com.tm/epg/rest`,
    `https://epg.rysgalbank.tm/epg/rest`,
  ],
  registerUrl: function (bankId, orderId, amount, language) {
    console.log(this.auth[bankId], bankId);
    console.log(this.auth[bankId].userName, "---");
    return `${this.banks[bankId]}/register.do?userName=${this.auth[bankId].userName}&password=${this.auth[bankId].password}&orderNumber=${orderId}&amount=${amount}00&language=${language}&currency=934&returnUrl=http://localhost:3001/api/v1/order/payment/callback-handler`;
  },
  checkOrderUrl: function (bankId, transactionId, language) {
    return `${this.banks[bankId]}/getOrderStatus.do?userName=${this.auth[bankId].userName}&password=${this.auth[bankId].password}&orderId=${transactionId}&language=${language}`;
  },
};

const createForms = async (order, seqTrans, language = "ru") => {
  try {
    console.log(order.bank, order.totalPrice, order.id);
    const newOrderUUID = crypto.randomUUID().replace(/-/g, "");
    let response,
      data = {};
    if (order.bank == "3") {
      //that means client choose tfeb bank(wneshekonomicheskiy bank)
      console.log("wnesh");
      console.log(newOrderUUID);
      response = await tfeb.registerTFEB(newOrderUUID, order.totalPrice);
      console.log(response);
      data = response;
    } else {
      response = await fetch(
        bankUrlRedirect.registerUrl(
          order.bank,
          newOrderUUID,
          order.totalPrice,
          language
        )
      );
      response = await response.json();
      console.log(response);
      data.url = response.formUrl;
      data.finalUrl = `http://localhost:3001/api/v1/order/payment/callback-handler?orderId=${response.orderId}`;
      data.checkOrder = `http://localhost:3001/api/v1/order/payment/check-status?orderId=${response.orderId}`;
    }
    await order.createPayment(
      {
        transactionId: response.orderId,
        status: "pending",
      },
      { transaction: seqTrans }
    );
    console.log("final data->", response);
    return data;
    //  { url: response.formUrl, finalUrl: `http://localhost:3001/api/v1/order/payment/callback-handler?orderId=${response.orderId}`, checkOrder: `http://localhost:3001/api/v1/order/payment/check-status?orderId=${response.orderId}` }
  } catch (err) {
    console.log(err);
    throw new ErrorException(
      "Something went wrong please try again, Message:" + err.message
    );
  }
};

const checkStatusByPayment = async (transactionId) => {
  const pay = await Payment.findOne({
    where: {
      transactionId,
    },
  });
  console.log(pay.status, "order this check id ->", transactionId);
  if (pay.status == "success") return true;
  else return false;
};

const checkOrder = async (transactionId, language = "ru") => {
  const order = await Orders.findOne({
    attributes: ["paymentMethod", "bank"],
    include: [
      {
        model: Payment,
        where: {
          transactionId,
        },
      },
    ],
  });
  //   if (order.isPaidBank == true)
  //     return {
  //       success: true,
  //       isPaidBank: order.isPaidBank,
  //       message: "Siziň sargytyňyz üstünlikli tölendi",
  //     };
  //   if (order.paymentMethod != "card") {
  //     console.log(
  //       "something went wrong order this id=>",
  //       order.id,
  //       "payment method cash but card "
  //     );
  //   }

  let response = await fetch(
    bankUrlRedirect.checkOrderUrl(order.bank, transactionId, language)
  );
  response = await response.json();
  if (
    (response.ErrorCode == 0 || response.errorCode == 0) &&
    (response.AuthCode == 2 || response.authCode == 2)
  )
    if (response.OrderStatus == 2 || response.orderStatus == 2)
      return { success: true, message: "Siziň sargytyňyz üstünlikli tölendi" };
    else if (response.OrderStatus == 0 || response.orderStatus == 0)
      return {
        success: false,
        message: "Tölegiňiz geçmedi.Tazeden synanyşmagyňyzy haýyş edýäris ",
      };
    else if (response.orderStatus == 6 || response.OrderStatus == 6)
      return {
        success: false,
        message:
          "Tölegiňiz edilmeli wagty geçdi.Tazeden synanyşmagyňyzy haýyş edýäris",
      };
  // else if (response.ErrorCode)
  return {
    success: false,
    message: "Tölegiňiz geçmedi.Tazeden synanyşmagyňyzy haýyş edýäris",
  };
  // return { success: false, message: 'Töleg şahsyýetnamasyndaky ýalňyşlyk sebäpli sargyt ret edildi.' }
};

const deleteOrderById = async (id) => {
  const order = await Orders.findByPk(id);
  if (!order) throw new NotFoundException();
  await order.destroy();
};

const changeIsViews = async (ids) => {
  for (const iterator of ids) {
    await Orders.update({ isView: true }, { where: { id: iterator } });
  }
};
const updateTransactionStatus = async (transactionId) => {
  const data = await Payment.findOne({
    where: {
      transactionId: transactionId,
    },
  });
  if (!data) return false;
  data.status = "success";
  await data.save();
  const toBeUpdatedOrder = await Orders.findByPk(data.orderId);
  if (!toBeUpdatedOrder) return false;
  toBeUpdatedOrder.isPaidBank = true;
  await toBeUpdatedOrder.save();
  return data;
};

module.exports = {
  saveOrder,
  findOrderById,
  checkOrder,
  findOrders,
  checkStatusByPayment,
  updateTransactionStatus,
  createForms,
  changeIsViews,
  deleteOrderById,
  updateStatusOnly,
};

/*



*/
