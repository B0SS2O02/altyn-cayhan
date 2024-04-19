const { Fetch } = require("../../api/util/axios");
const path = require("path");
const fs = require("fs");
const url = "http://localhost:8880/api/v1/";

exports.getDashboard = async (req, res, next) => {
  function parseCookie(cookieString) {
    const cookies = {};
    cookieString.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      cookies[name] = decodeURIComponent(value);
    });
    return cookies;
  }
  
  const user=JSON.parse(parseCookie(req.headers.cookie).user.slice(2));
  const data = JSON.parse(
    fs.readFileSync(path.resolve("delivery.json"), "utf8")
  );
  res.render("admin/pages/dashboard.html", { data ,role:user.role});
};

exports.getFoods = async (req, res, next) => {
  try {
    // let { page: qPage, size: qSize } = req.query
    // if (!qPage || !qSize) {
    //   qPage = 1
    //   qSize = 10
    // }
    // const product = await Fetch(url + `product?allCategory=true&sort[active]=true&page=${qPage}&size=${qSize}`, "GET", null, res.locals.lang);
    const product = await Fetch(
      url + `product?allCategory=true&sort[active]=true`,
      "GET",
      null,
      res.locals.lang
    );

    console.log("-------", product.data);

    const { page, size, totalPages } = product.data;
    console.log(page, size, totalPages);
    res.render("admin/pages/foods.html", {
      path: "/foods",
      page: parseInt(page),
      size: parseInt(size),
      totalPages,
      data: product.data,
      deleteProductUrl: "/api/v1/product/",
      activeProductUrl: "/api/v1/product-active/",
    });
  } catch (err) {
    next(err);
    console.log(err.message);
  }
};

exports.getAddFood = async (req, res, next) => {
  const fetchedDataCat = await Fetch(
    `${url}product/category?all=true`,
    "GET",
    null,
    res.locals.lang
  );
  const fetchedDataRest = await Fetch(
    `${url}restaurant`,
    "GET",
    null,
    res.locals.lang
  );
  console.log(fetchedDataCat.data, fetchedDataRest.data);
  res.render("admin/pages/add_food.html", {
    category: fetchedDataCat.data.category,
    restaurant: fetchedDataRest.data.restaurants,
    edit: false,
  });
};

exports.getEditFood = async (req, res, next) => {
  const fetchedDataCat = await Fetch(
    `${url}product/category`,
    "GET",
    null,
    res.locals.lang
  );
  const fetchedDataRest = await Fetch(
    `${url}restaurant`,
    "GET",
    null,
    res.locals.lang
  );
  const fetchedProduct = await Fetch(
    `${url}product/${req.params.id}?translations=true`,
    "GET"
  );
  res.render("admin/pages/add_food.html", {
    category: fetchedDataCat.data.category,
    restaurant: fetchedDataRest.data.restaurants,
    data: fetchedProduct.data,
    edit: true,
  });
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Fetch(
      url + "product/category",
      "GET",
      null,
      res.locals.lang
    );
    res.render("admin/pages/category.html", {
      path: "/foods",
      data: category.data,
      deleteCategoryUrl: "/api/v1/product/category/",
      activeCategoryUrl: "/api/v1/active-category/",
    });
  } catch (err) {
    next(err);
    console.log(err.message);
  }
};

exports.getAddCategory = async (req, res, next) => {
  const fetchedDataRest = await Fetch(
    `${url}restaurant`,
    "GET",
    null,
    res.locals.lang
  );
  res.render("admin/pages/add_category.html", {
    edit: false,
    restaurant: fetchedDataRest.data.restaurants,
  });
};

exports.getEditCategory = async (req, res, next) => {
  const fetchedCategory = await Fetch(
    `${url}product/category/${req.params.id}?translations=true&one=true`,
    "GET",
    null,
    res.locals.lang
  );
  const fetchedDataRest = await Fetch(
    `${url}restaurant`,
    "GET",
    null,
    res.locals.lang
  );
  console.log(fetchedCategory.data, fetchedDataRest.data);
  res.render("admin/pages/add_category.html", {
    data: fetchedCategory.data,
    restaurant: fetchedDataRest.data.restaurants,
    edit: true,
  });
};

exports.getUsers = async (req, res, next) => {
  const users = await Fetch(`${url}users`, "GET");
  res.render("admin/pages/users.html", {
    data: users.data,
    activeUserUrl: "/api/v1/user-active/",
    deleteUserUrl: "/api/v1/auth/",
  });
};

exports.getAddUser = async (req, res, next) => {
  res.render("admin/pages/add_user.html", {
    edit: false,
  });
};

exports.getUpdateUser = async (req, res, next) => {
  const user = await Fetch(`${url}user/${req.params.id}`, "GET");
  res.render("admin/pages/add_user.html", {
    edit: true,
    data: user.data,
  });
};

exports.getNotification = async (req, res, next) => {
  try {
    res.render("admin/pages/notification.html");
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    let { page: qPage, size: qSize } = req.query;
    if (!qPage || !qSize) {
      qPage = 1;
      qSize = 20;
    }
    const staticStatusOrder = [
      "completed",
      "cancelled",
      "on the way",
      "waiting",
    ];
    const order = await Fetch(
      url + `order?page=${qPage}&size=${qSize}`,
      "GET",
      null,
      res.locals.lang
    );

    // console.log("order------", order.data);
    const delivery = await Fetch(url + "delivery", "GET");
    const { page, size, totalPages } = order.data;
    // const timeOfDay =['09:00-12:00','12:00-15:00','15:00-18:00','18:00-21:00']
    const paymentStatus = {
      pending: "garasylyar",
      failure: "yatyryldy",
      success: "pul tolendi",
    };

    console.log("data", order.data);

    console.log(totalPages, page, size);
    res.render("admin/pages/orders.html", {
      path: "/foods",
      data: order.data,
      page: parseInt(page),
      size: parseInt(size),
      totalPages,
      // timeOfDay,
      paymentStatus,
      deliveryCharge: delivery.data.deliveryCharge,
      staticStatusOrder: staticStatusOrder,
      deleteOrderUrl: "/api/v1/order/",
      activeOrderUrl: "/api/v1/active-order/",
    });
  } catch (err) {
    next(err);
    console.log(err.message);
  }
};

exports.getOrderById = async (req, res, next) => {
  const staticStatusOrder = ["completed", "cancelled", "on the way", "waiting"];
  const fetchedData = await Fetch(
    `${url}order/${req.params.id}`,
    "GET",
    null,
    res.locals.lang
  );

  const delivery = await Fetch(`${url}/delivery`, "GET", null);
  res.render("admin/pages/single_order.html", {
    data: fetchedData.data,
    deliveryCharge: delivery.data.deliveryCharge,
    staticStatusOrder: staticStatusOrder,
    edit: false,
  });
};

exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Fetch(
      url + "restaurant",
      "GET",
      null,
      res.locals.lang
    );
    console.log(restaurant.data);
    res.render("admin/pages/restaurant.html", {
      path: "/foods",
      data: restaurant.data,
    });
  } catch (err) {
    next(err);
    console.log(err.message);
  }
};

exports.getEditRestaurant = async (req, res, next) => {
  const fetchedCategory = await Fetch(
    `${url}restaurant/${req.params.id}?translations=true`,
    "GET",
    null,
    res.locals.lang
  );
  res.render("admin/pages/add_restaurant.html", {
    data: fetchedCategory.data,
    edit: true,
  });
};
