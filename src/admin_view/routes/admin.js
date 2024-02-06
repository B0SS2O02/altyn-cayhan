const express = require("express");
const router = express.Router();

// const authorization = require("../middleware/authorization");

const {
  getDashboard,
  getUsers,
  getFoods,
  getAddUser,
  getUpdateUser,
  getGallery,
  getOrders,
  getNotification,
  getAddGallery,
  getEditGallery,
  getVideo,
  getAddVideo,
  getEditVideo, getAddFood, getEditFood, getCategory, getEditCategory, getAddCategory, getOrderById
} = require("../controller/admin");

router.get(["/dashboard", "/"], getDashboard);

router.get('/foods', getFoods)
router.get('/add-food', getAddFood)
router.get('/add-food/:id', getEditFood)

router.get('/category', getCategory)
router.get('/add-category', getAddCategory)
router.get('/add-category/:id', getEditCategory)

router.get("/users", getUsers);
router.get("/add-user", getAddUser);
router.get("/user/:id", getUpdateUser);

router.get("/gallery", getGallery);
router.get("/add-gallery", getAddGallery);
router.get("/add-gallery/:id", getEditGallery);

router.get("/video", getVideo);
router.get("/add-video", getAddVideo);
router.get("/add-video/:id", getEditVideo);

router.get('/orders', getOrders)
router.get('/order/:id', getOrderById)

router.get('/send-notification',getNotification)

module.exports = router;
