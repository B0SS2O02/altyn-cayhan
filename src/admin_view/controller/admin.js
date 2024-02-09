const { Fetch } = require("../../api/util/axios");
const path = require("path");
const fs = require("fs");
const url = "http://localhost:3001/api/v1/";

exports.getDashboard = async (req, res, next) => {
  const data = JSON.parse(
    fs.readFileSync(path.resolve("delivery.json"), "utf8")
  );
  res.render("admin/pages/dashboard.html", { data });
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

    const { page, size, totalPages } = product.data;
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
  const fetchedData = await Fetch(
    `${url}product/category`,
    "GET",
    null,
    res.locals.lang
  );
  res.render("admin/pages/add_food.html", {
    category: fetchedData.data.category,
    edit: false,
  });
};

exports.getEditFood = async (req, res, next) => {
  const fetchedCategory = await Fetch(
    `${url}product/category`,
    "GET",
    null,
    res.locals.lang
  );
  const fetchedProduct = await Fetch(
    `${url}product/${req.params.id}?translations=true`,
    "GET"
  );
  res.render("admin/pages/add_food.html", {
    category: fetchedCategory.data.category,
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
  res.render("admin/pages/add_category.html", {
    edit: false,
  });
};

exports.getEditCategory = async (req, res, next) => {
  const fetchedCategory = await Fetch(
    `${url}product/category/${req.params.id}?translations=true`,
    "GET",
    null,
    res.locals.lang
  );
  res.render("admin/pages/add_category.html", {
    data: fetchedCategory.data,
    edit: true,
  });
};

exports.getVideo = async (req, res, next) => {
  try {
    let { page: qPage, size: qSize } = req.query;
    if (!qPage || !qSize) {
      qPage = 1;
      qSize = 10;
    }
    const video = await Fetch(
      url + `video?page=${qPage}&size=${qSize}&random=false`,
      "GET",
      null,
      res.locals.lang
    );
    const { page, size, totalPages } = video.data;
    res.render("admin/pages/video.html", {
      path: "/video",
      data: video.data,
      page: parseInt(page),
      size: parseInt(size),
      totalPages,
      deleteVideoUrl: "/api/v1/video/",
    });
  } catch (err) {
    next(err);
    console.log(err.message);
  }
};

exports.getAddVideo = async (req, res, next) => {
  res.render("admin/pages/add_video.html", {
    edit: false,
  });
};

exports.getEditVideo = async (req, res, next) => {
  const fetchedVideo = await Fetch(`${url}video/${req.params.id}`, "GET", null);
  res.render("admin/pages/add_video.html", {
    data: fetchedVideo.data,
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

exports.getGallery = async (req, res, next) => {
  let { page: qPage, size: qSize } = req.query;
  if (!qPage || !qSize) {
    qPage = 1;
    qSize = 10;
  }
  const gallery = await Fetch(
    `${url}gallery?page=${qPage}&size=${qSize}`,
    "GET",
    null,
    res.locals.lang
  );

  const { page, size, totalPages } = gallery.data;
  try {
    res.render("admin/pages/gallery.html", {
      deleteGalleryUrl: "/api/v1/gallery/",
      data: gallery.data,
      page: parseInt(page),
      size: parseInt(size),
      totalPages,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAddGallery = async (req, res, next) => {
  try {
    res.render("admin/pages/add_gallery.html", {
      edit: false,
      typeLists: ["gallery", "banner"],
      deleteImageById: "/api/v1/gallery/image/",
    });
  } catch (err) {
    next(err);
  }
};

exports.getEditGallery = async (req, res, next) => {
  const gallery = await Fetch(`${url}gallery/${req.params.id}`, "GET", null);
  try {
    res.render("admin/pages/add_gallery.html", {
      edit: true,
      typeLists: ["gallery", "banner"],
      data: gallery.data,
    });
  } catch (err) {
    next(err);
  }
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

    console.log('data',order.data);

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
