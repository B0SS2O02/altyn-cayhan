const express = require("express");
const router = express.Router();
const restService = require("./restService.js");
const { uploadRestaurant } = require("../util/multer.js");

router.route("/restaurant").get(async (req, res, next) => {
  try {
    const prodCategory = await restService.getRestaurants(
      req.headers["accept-language"] || "ru"
    );
    res.send(prodCategory);
  } catch (error) {
    next(error);
  }
});

router
  .route("/restaurant/:id")
  .get(async (req, res, next) => {
    try {
      const RestaurantById = await restService.findRestaurant(
        req.params.id,
        req.query.translations,
      );
      res.send(RestaurantById);
    } catch (error) {
      next(error);
    }
  })
  .put(uploadRestaurant.single("image"), async (req, res, next) => {
    try {
      const restaurants = await restService.updateRestaurantById(
        req.body,
        req.file,
        req.params.id
      );
      res.send(restaurants);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
