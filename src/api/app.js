const express = require("express");
const app = express();
const fs = require("fs");
const ErrorHandler = require("./error/ErrorHandler");
const ShopRouter = require("./product/prodRouter");
const AuthRouter = require("./auth/authRouter");
const OrdersRouter = require("./orders/ordersRouter");
const RestRouter = require("./restaurant/restRouter");
const OfflineRouter = require("./offline/offlineRouter.js");

app
  .route("/delivery")
  .get((req, res) => {
    res.send(JSON.parse(fs.readFileSync("delivery.json", "utf8")));
  })
  .put((req, res) => {
    const delivery = JSON.parse(fs.readFileSync("delivery.json", "utf8"));
    fs.writeFileSync(
      "delivery.json",
      JSON.stringify({ ...delivery, deliveryCharge: req.body.deliveryCharge })
    );
    res.send();
  });
app.put("/set-cookie", async (req, res, next) => {
  if (
    req.body &&
    req.body.lang &&
    (req.body.lang.includes("ru") || req.body.lang.includes("tm"))
  ) {
    res.cookie("lang", req.body.lang);
  }
  res.send({ success: true });
});

app.use(ShopRouter);
app.use(AuthRouter);
app.use(OrdersRouter);
app.use(RestRouter);
app.use(OfflineRouter);

app.use(ErrorHandler);

module.exports = app;
