const router = require("express").Router();
const prodCat = require("../product/prodCategory");
const prodCatTranslate = require("../product/prodCategoryTranslation");
const product = require("../product/product");
const productTranslate = require("../product/prodTranslation");
const { getVersion } = require("../util/version");
const Restaurant = require("../restaurant/restaurants");
const RestaurantTranslation = require("../restaurant/restTranslator");
const { GetOffline } = require("./offlineService");

router.get("/offline", async (req, res, next) => {
  try {
    const data = await GetOffline();

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

router.get("/offline-version", async (req, res, next) => {
  try {
    res.json(getVersion());
  } catch (error) {
    next(error);
  }
});

module.exports = router;
