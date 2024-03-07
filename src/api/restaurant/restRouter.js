const express = require("express");
const router = express.Router();
const restService = require("./restService.js");
const { uploadRestaurant } = require("../util/multer.js");
const Restaurant = require("./restaurants.js");

router.route("/restaurant").get(async (req, res, next) => {
  try {
    const prodCategory = await restService.getRestaurants(
      req.headers["accept-language"] || "ru",
      req.query.category
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
        req.query.translations
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
      console.log(error);
      next(error);
    }
  });

router.put("/restaurant-drag", async (req, res) => {
  console.log(req.body);
  const { newElem, currentElem } = req.body;
  const newElemRecord = await Restaurant.findOne({
    where: {
      position: newElem,
    },
  });
  const currentElemRecord = await Restaurant.findOne({
    where: {
      position: currentElem,
    },
  });
  console.log(currentElemRecord.toJSON(), newElemRecord.toJSON());

  await Restaurant.update(
    { position: newElem },
    { where: { id: currentElemRecord.id } }
  );

  await Restaurant.update(
    { position: currentElem },
    { where: { id: newElemRecord.id } }
  );

  console.log(currentElemRecord.toJSON(), newElemRecord.toJSON());
  
  res.send("ok");
});

module.exports = router;
