const express = require("express");
const { body, validationResult } = require("express-validator");
const path = require("path");
const { wss } = require("../wss/webSocketServer");
const ErrorException = require("../error/ErrorException");
const { deleteFile } = require("../shared/deleteFile");
const { uploadProduct } = require("../util/multer");
// const { uploadProduct } = require("../util/multer");
const fs = require("fs");
const router = express.Router();
const prodService = require("./prodService");
const ValidationException = require("../error/ValidationException");
const ProdCategory = require("./prodCategory");
const { sequelize } = require("../../../database/models");
const ProdCategoryTranslation = require("./prodCategoryTranslation");
const { upVersion } = require("../util/version");

router
  .route("/product/category")
  .get(async (req, res, next) => {
    try {
      const prodCategory = await prodService.getAllCategory(
        req.headers["accept-language"],
        req.query.restaurant
      );
      res.send(prodCategory);
    } catch (err) {
      next(err);
    }
  })
  .post(
    uploadProduct.single("image"),
    [
      body("*.*.title")
        .isString()
        .withMessage("title field must be string format")
        .notEmpty()
        .withMessage("title field should not be empty"),
    ],
    async (req, res, next) => {
      try {
        if (!req.file) {
          return next(
            new ValidationException([
              {
                msg: "Please upload an image",
                param: "image",
              },
            ])
          );
        }
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          if (fs.existsSync(path.join("uploads", "product", req.file.filename)))
            await deleteFile(
              path.join("uploads", "product", req.file.filename)
            );
          return next(new ValidationException(errors.array()));
        }

        const prodCategory = await prodService.saveCategory(req.body, req.file);
        upVersion();
        res.send(prodCategory);
      } catch (err) {
        next(err);
      }
    }
  );

router
  .route("/product/category/:id")
  .get(async (req, res, next) => {
    try {
      const shopCategoryById = await prodService.findProdCategory(
        req.params.id,
        req.query.translations,
        req.headers["accept-language"],
        req.query.page,
        req.query.size
      );
      res.send(shopCategoryById);
    } catch (err) {
      next(err);
    }
  })
  .put(uploadProduct.single("image"), async (req, res, next) => {
    try {
      const updatedShopCategory = await prodService.updateCategoryById(
        req.body,
        req.file,
        req.params.id
      );
      upVersion();
      res.send(updatedShopCategory);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await prodService.deleteCategoryById(req.params.id);
      await prodService.newOrderPositionCategory();
      upVersion();
      res.send({
        success: true,
      });
    } catch (err) {
      next(err);
    }
  });

// product create update delete -------

router
  .route("/product")
  .get(async (req, res, next) => {
    try {
      const { page, size, category, allCategory, sort, restaurant } = req.query;
      console.log(req.query);
      const prodCategory = await prodService.getProducts(
        category,
        restaurant,
        page,
        size,
        allCategory,
        req.headers["accept-language"],
        true,
        sort
      );
      res.send(prodCategory);
    } catch (err) {
      next(err);
    }
  })
  .post(
    uploadProduct.single("image"),
    [
      body("*.*.title")
        .isString()
        .withMessage("title field must be string format")
        .notEmpty()
        .withMessage("title field should not be empty"),
    ],
    async (req, res, next) => {
      try {
        if (!req.file) {
          return next(
            new ValidationException([
              {
                msg: "Please upload an image",
                param: "image",
              },
            ])
          );
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          if (fs.existsSync(path.join("uploads", "product", req.file.filename)))
            await deleteFile(
              path.join("uploads", "product", req.file.filename)
            );
          return next(new ValidationException(errors.array()));
        }
        const prodCategory = await prodService.saveProduct(req.body, req.file);
        upVersion();
        res.send(prodCategory);
        res.send("ok");
      } catch (err) {
        next(err);
      }
    }
  );
router.get("/product-active/:id", async (req, res, next) => {
  try {
    await prodService.toggleActive(req.params.id);
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
});

router
  .route("/product/:id")
  .get(async (req, res, next) => {
    try {
      const product = await prodService.findProduct(
        req.params.id,
        req.query.translations
      );
      res.send(product);
    } catch (err) {
      next(err);
    }
  })
  .put(uploadProduct.single("image"), async (req, res, next) => {
    try {
      if (
        Object.keys(req.body).length === 1 &&
        Object.keys(req.body)[0] === "active"
      )
        await prodService.toggleActive(req.params.id);
      else
        await prodService.updateProductById(req.body, req.file, req.params.id);
      upVersion();
      res.send({ success: true });
    } catch (err) {
      console.log(err, "-------");
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await prodService.deleteProductByid(req.params.id);
      await prodService.newOrderPositionProduct();
      upVersion();
      res.send({
        success: true,
      });
    } catch (err) {
      next(err);
    }
  });

router.put("/product-drag", async (req, res, next) => {
  const seqTrans = await sequelize.transaction();
  try {
    console.log(req.body);
    await prodService.resortProduct(req.body, seqTrans);
    await seqTrans.commit();
    console.log("everything ok!");
    upVersion();
    res.send();
  } catch (err) {
    console.log(err);
    await seqTrans.rollback();
    next(err);
  } finally {
    await seqTrans.cleanup();
  }
});

router.put("/product-category-drag", async (req, res, next) => {
  const seqTrans = await sequelize.transaction();
  try {
    await prodService.resortCategory(req.body, seqTrans);
    await seqTrans.commit();
    upVersion();
    res.send();
  } catch (err) {
    await seqTrans.rollback();
    next(err);
  } finally {
    await seqTrans.cleanup();
  }
});

router.get("/search/:word", async (req, res, next) => {
  try {
    const { word } = req.params;
    const { page, size, category, allCategory, sort, restaurant } = req.query;
    const prodCategory = await prodService.getProductsSearch(
      category,
      restaurant,
      page,
      size,
      allCategory,
      req.headers["accept-language"],
      true,
      sort,
      word
    );
    res.send(prodCategory);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
