const express = require("express");
const router = express.Router();

// const authorization = require("../middleware/authorization");

const {
  getDashboard,
  getUsers,
  getFoods,
  getAddUser,
  getUpdateUser,
  getOrders,
  getNotification,
  getAddFood,
  getEditFood,
  getCategory,
  getEditCategory,
  getAddCategory,
  getOrderById,
  getRestaurant,
  getEditRestaurant,
} = require("../controller/admin");

router.get(["/dashboard", "/"], getDashboard);

router.get("/foods", getFoods);
router.get("/add-food", getAddFood);
router.get("/add-food/:id", getEditFood);

router.get("/category", getCategory);
router.get("/add-category", getAddCategory);
router.get("/add-category/:id", getEditCategory);

router.get("/users", getUsers);
router.get("/add-user", getAddUser);
router.get("/user/:id", getUpdateUser);

router.get("/orders", getOrders);
router.get("/order/:id", getOrderById);

router.get("/send-notification", getNotification);

router.get("/restaurant", getRestaurant);
router.get("/add-restaurant/:id", getEditRestaurant);

module.exports = router;
