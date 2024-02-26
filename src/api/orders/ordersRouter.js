const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const OrdersService = require("./ordersService");
const ValidationException = require("../error/ValidationException");
const { sequelize } = require("../../../database/models");
const ErrorException = require("../error/ErrorException");
const { wss } = require("../wss/webSocketServer");
const { checkOrderTFEB } = require("./tfeb");

router
  .route("/order")
  .get(async (req, res, next) => {
    try {
      const { page, size, isView } = req.query;
      const orders = await OrdersService.findOrders(
        page,
        size,
        req.headers["accept-language"],
        isView
      );
      res.send(orders);
    } catch (err) {
      console.log(err);
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      const isViewedIdLists = req.body;
      await OrdersService.changeIsViews(isViewedIdLists);
      res.send({ success: true });
    } catch (err) {
      next(err);
    }
  })
  .post(
    [
      body("address")
        .notEmpty()
        .withMessage("Address field should not be empty")
        .isString()
        .withMessage("Address must be string format"),
      body("fullName")
        .notEmpty()
        .withMessage("FullName field should not be empty")
        .isString()
        .withMessage("FullName must be string format"),
      body("phoneNumber")
        .notEmpty()
        .withMessage("Phone number field should not be empty")
        .isInt()
        .withMessage("Phone-Number must be integer format"),
      body("orders")
        .notEmpty()
        .withMessage("Orders field should not be empty")
        .isArray()
        .withMessage("Orders must be array"),
      body("deliveryTime")
        .notEmpty()
        .withMessage("DeliveryTime field should not be empty"),
    ],
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationException(errors.array()));
      }
      const seqTrans = await sequelize.transaction();
      try {
        console.log("---------", req.body);
        let order = await OrdersService.saveOrder(req.body, seqTrans);
        // let dataPayment;
        // if (req.body.paymentMethod == 'card') {
        //     dataPayment = await OrdersService.createForms(order, seqTrans, 'ru')
        //     if (!dataPayment.url) {
        //         return res.send({ success: false, url: undefined, message: 'Something went wrong,please try again' })
        //     }
        // } else {
        const _order = await order.get({ plain: true });
        dataPayment = { order: _order };
        await wss.post({ event: "order", data: order });
        // }
        await seqTrans.commit();
        console.log(dataPayment);
        res.send({ success: true, ...dataPayment });
      } catch (err) {
        console.log("Error--------------", err);
        await seqTrans.rollback();
        next(err);
      } finally {
        await seqTrans.cleanup();
      }
    }
  );
router
  .route("/order/:id")
  .get(async (req, res, next) => {
    try {
      const order = await OrdersService.findOrderById(
        req.params.id,
        req.headers["accept-language"]
      );
      res.send(order);
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      if (!req.body.status)
        return next(new ErrorException("Yalnyshlk yuze cykdy"));
      await OrdersService.updateStatusOnly(req.params.id, req.body);
      res.send({ success: true });
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await OrdersService.deleteOrderById(req.params.id);
      res.send({ success: true });
    } catch (err) {
      next(err);
    }
  });

router.get(
  "/order/payment/callback-handler-tfeb/:orderId",
  async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const checkStatus = await checkOrderTFEB(orderId);
      if (!checkStatus.success || checkStatus.isPaidBank) {
        return res.json(checkStatus);
      }
      const data = await OrdersService.updateStatusOnly(orderId);
      if (!data) {
        return res.json(checkStatus);
      }
      const order = await OrdersService.findOrderById(data.orderId);
      await wss.post({ event: "order", data: order });
      return res.json(checkStatus);
    } catch (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "Tazeden synanyşmagyňyzy haýyş edýäris",
      });
    }
  }
);

router.get("/order/payment/check-status-tfeb", async (req, res, next) => {
  try {
    const { orderId } = req.query;
    console.log("---");
    const checkStatus = await OrdersService.checkStatusByPayment(orderId);
    if (!checkStatus) {
      return res.redirect(
        "http://localhost:3001/api/v1/order/payment/callback-handler-tfeb/" +
          orderId
      );
    }
    console.log("status success");
    return res.json({
      success: checkStatus,
      message: "Siziň sargytyňyz üstünlikli tölendi",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Tazeden synanyşmagyňyzy haýyş edýäris",
    });
  }
});

router.get("/order/payment/check-status", async (req, res, next) => {
  try {
    const { orderId } = req.query;
    console.log("---", orderId);
    const checkStatus = await OrdersService.checkStatusByPayment(orderId);
    if (!checkStatus) {
      return res.redirect(
        "http://localhost:3001/api/v1/order/payment/callback-handler?orderId=" +
          orderId
      );
    }
    console.log("status success");
    return res.json({
      success: checkStatus,
      message: "Siziň sargytyňyz üstünlikli tölendi",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Tazeden synanyşmagyňyzy haýyş edýäris",
    });
  }
});

router.get("/order/payment/callback-handler", async (req, res, next) => {
  try {
    const { orderId } = req.query;
    console.log(orderId);
    const checkStatus = await OrdersService.checkOrder(orderId);
    console.log(checkStatus);
    if (!checkStatus.success || checkStatus.isPaidBank) {
      return res.json(checkStatus);
    }
    console.log("status order=>>>>>>>>>>", checkStatus);
    const data = await OrdersService.updateTransactionStatus(orderId);
    // console.log('cycle of update status result===>>>>', data)
    if (!data) {
      return res.json(checkStatus);
    }
    const order = await OrdersService.findOrderById(data.orderId);
    await wss.post({ event: "order", data: order });
    return res.json(checkStatus);
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Tazeden synanyşmagyňyzy haýyş edýäris",
    });
  }
});
// router.post('/order/callback-handler-failure', async (req, res, next) => {
//     console.log(req.body)
// })
module.exports = router;
