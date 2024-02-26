const NotFoundException = require("../error/NotFoundException");
const { deleteFile } = require("../shared/deleteFile");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const ProdCategory = require("./prodCategory");
const Product = require("./product");
const ProdCategoryTranslation = require("./prodCategoryTranslation");
const ProdTranslation = require("./prodTranslation");
const { Op } = require("sequelize");
const Restaurant = require("../restaurant/restaurants");
const RestaurantTranslation = require("../restaurant/restTranslator");

const addNewPath = (originalname) => {
  return `/uploads/product/${
    new Date().toISOString().replace(/:/g, "-") + "_"
  }${originalname.split(".")[0]}.webp`;
};

const formatImages = async (oldImagePath, newImagePath) => {
  await sharp(oldImagePath)
    .toFormat("webp")
    .resize(360)
    .webp({ quality: 90 })
    .toFile(newImagePath);
  try {
    if (fs.existsSync(oldImagePath)) {
      await deleteFile(oldImagePath);
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllCategory = async (lang) => {
  const category = await ProdCategory.findAll({
    order: [["position", "asc"]],
    include: [
      {
        model: ProdCategoryTranslation,
        attributes: ["title"],
        where: {
          lang: lang,
        },
      },
    ],
  });
  return {
    category: category.map((convSeqeulize) => {
      const data = convSeqeulize.get({ plain: true });
      if (data.ProdCategoryTranslations) {
        Object.entries(...data.ProdCategoryTranslations).forEach((e, i) => {
          data["title"] = e[i + 1];
        });
        delete data.ProdCategoryTranslations;
      }
      // if (data.prodCategory) {
      //   Object.entries(...data.prodCategory).forEach((e, i) => {
      //     data['titleCategory'] = e[i + 1]
      //   })
      //   delete data.prodCategory
      // }
      return data;
    }),
  };
  return category;
};

const getProducts = async (
  prodCategoryId = false,
  restaurant,
  page,
  size,
  allCategory = false,
  lang = "tm",
  translations = false,
  sort
) => {
  let where = {},
    limits = {},
    include = [];
  if (page && size) {
    limits = {
      limit: size,
      offset: (page - 1) * size,
    };
  }
  if (prodCategoryId) where.prodCategoryId = prodCategoryId;
  if (restaurant) where["restaurantId"] = restaurant;
  if ((sort && !sort.active) || !sort) {
    where = {
      ...where,
      active: true,
    };
  }

  if (sort && sort.popular) {
    where = {
      ...where,
      popular: true,
    };
  }
  if (sort && sort.discount) {
    where = {
      ...where,
      discount: {
        [Op.not]: null,
      },
    };
  }

  include.push({
    model: ProdCategory,
    attributes: ["id"],
    include: [
      {
        model: ProdCategoryTranslation,
        attributes: ["title"],
        where: {
          lang: lang,
        },
      },
    ],
  });

  include.push({
    model: Restaurant,
    attributes: ["id"],
    include: [
      {
        model: RestaurantTranslation,
        attributes: ["title"],
        where: {
          lang: lang,
        },
      },
    ],
  });

  if (translations) {
    include.push({
      model: ProdTranslation,
      attributes: ["title", "description"],
      where: {
        lang: lang,
      },
    });
  }
  const products = await Product.findAndCountAll({
    where,
    ...limits,
    include,
    order: [["position", "asc"]],
  });

  console.log(products);

  return {
    products: products.rows.map((convSeqeulize) => {
      const data = convSeqeulize.get({ plain: true });
      let currentPrice = data.price ? parseFloat(data.price).toFixed(2) : null;
      if (data.discount && data.discount > 0 && data.price) {
        currentPrice = (
          currentPrice - parseFloat((data.price * data.discount) / 100)
        ).toFixed(2);
      }

      data.currentPrice = currentPrice;

      data.category = data.prodCategory.ProdCategoryTranslations[0].title;
      delete data.prodCategory;

      console.log("++++++++++", data);
      data.restaurant = data.restaurant.restaurantTranslations[0].title;
      delete data.prodCategory;

      if (data.prodTranslations) {
        Object.entries(...data.prodTranslations).forEach((e, i) => {
          data[e[0]] = e[1];
        });
        delete data.prodTranslations;
      }
      //     if (data.prodCategory) {
      //       Object.entries(...data.prodCategory).forEach((e, i) => {
      //         data['titleCategory'] = e[i + 1]
      //       })
      //       delete data.prodCategory
      //     }
      return data;
    }),
    size,
    page,
    totalPages: Math.ceil(products.count / size),
  };
  return products;
};

const saveCategory = async (body, file) => {
  const mainImgPath = addNewPath(file.originalname);
  const oldImgPath = path.join(file.destination, file.filename);
  await formatImages(oldImgPath, `.${mainImgPath}`);
  const pos = await ProdCategory.max("position");
  const category = await ProdCategory.create({
    image: mainImgPath,
    position: pos + 1,
  });
  for (let index = 0; index < Object.keys(body.translations).length; index++) {
    await category.createProdCategoryTranslation({
      title: Object.values(body.translations)[index].title,
      lang: Object.keys(body.translations)[index],
    });
  }
  return category;
};

const findProdCategory = async (id, translations = false, lang) => {
  let include = [],
    where = {};
  if (lang)
    where = {
      lang: lang,
    };
  if (translations || lang) {
    include = [
      {
        model: ProdCategoryTranslation,
        attributes: ["title", "lang"],
        where,
      },
    ];
  }
  const category = ProdCategory.findOne({
    where: {
      id: id,
    },
    include,
  });
  if (!category) throw new NotFoundException();
  return category;
};

const updateCategoryById = async (body, file, id) => {
  const category = await findProdCategory(id);
  const currentCategoryBody = {};
  if (file) {
    if (
      fs.existsSync(
        path.join("uploads", "product", category.image.split("/").pop())
      )
    )
      await deleteFile(
        path.join("uploads", "product", category.image.split("/").pop())
      );
    const mainImgPath = addNewPath(file.originalname);
    const oldImgPath = path.join(file.destination, file.filename);
    await formatImages(oldImgPath, `.${mainImgPath}`);
    currentCategoryBody.image = mainImgPath;
  }
  if (body) {
    Object.keys(body).forEach((item) => {
      if (body[item] && item !== "translations")
        currentCategoryBody[item] = body[item];
    });
  }
  if (body.translations) {
    for (
      let index = 0;
      index < Object.keys(body.translations).length;
      index++
    ) {
      // const element = Object.keys(body.translations)[index];
      if (Object.values(body.translations)[index].title.length > 0) {
        await ProdCategoryTranslation.update(
          {
            title: Object.values(body.translations)[index].title,
          },
          {
            where: {
              [Op.and]: {
                lang: Object.keys(body.translations)[index],
                prodCategoryId: id,
              },
            },
          }
        );
      }
    }
  }
  if (Object.keys(currentCategoryBody).length > 0) {
    await category.update(currentCategoryBody);
  }
  return category;
};

const deleteCategoryById = async (id) => {
  const shopCategoryToBeDeleted = await findProdCategory(id);

  if (shopCategoryToBeDeleted.image) {
    if (
      fs.existsSync(
        path.join(
          "uploads",
          "product",
          shopCategoryToBeDeleted.image.split("/").pop()
        )
      )
    )
      await deleteFile(
        path.join(
          "uploads",
          "product",
          shopCategoryToBeDeleted.image.split("/").pop()
        )
      );
  }
  await shopCategoryToBeDeleted.destroy();
};

const saveProduct = async (body, file) => {
  const mainImgPath = addNewPath(file.originalname);
  const oldImgPath = path.join(file.destination, file.filename);
  await formatImages(oldImgPath, `.${mainImgPath}`);
  const pos = await Product.max("position");
  const product = await Product.create({
    prodCategoryId: body.prodCategoryId,
    restaurantId: body.restaurantId,
    price: body.price,
    popular: body.popular,
    position: pos + 1,
    discount: body.discount || null,
    image: mainImgPath,
  });
  for (let index = 0; index < Object.keys(body.translations).length; index++) {
    await product.createProdTranslation({
      lang: Object.keys(body.translations)[index],
      description: Object.values(body.translations)[index].description,
      title: Object.values(body.translations)[index].title,
    });
  }
  const data = JSON.parse(
    fs.readFileSync(path.resolve("delivery.json"), "utf8")
  );
  fs.writeFileSync(
    path.resolve("delivery.json"),
    JSON.stringify({ ...data, totalFoods: data.totalFoods + 1 })
  );
  return product;
};

const findProduct = async (id, translations = false) => {
  let include = [];
  if (translations) {
    include = [
      {
        model: ProdTranslation,
        attributes: ["title", "description", "lang"],
      },
    ];
  }
  const product = await Product.findOne({
    where: {
      id: id,
    },
    include,
  });
  if (!product) throw new NotFoundException();
  return product;
};

const toggleActive = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) throw new NotFoundException();
  product.active = !product.active;
  await product.save();
};

const updateProductById = async (body, file, id) => {
  const product = await findProduct(id);
  const currentProductBody = {};
  if (file) {
    if (
      fs.existsSync(
        path.join("uploads", "product", product.image.split("/").pop())
      )
    )
      await deleteFile(
        path.join("uploads", "product", product.image.split("/").pop())
      );
    const mainImgPath = addNewPath(file.originalname);
    const oldImgPath = path.join(file.destination, file.filename);
    await formatImages(oldImgPath, `.${mainImgPath}`);
    currentProductBody.image = mainImgPath;
  }
  if (body) {
    Object.keys(body).forEach((item) => {
      if (item !== "translations" && item !== "image") {
        if (item === "discount") {
          currentProductBody[item] = body[item] || null;
        } else {
          currentProductBody[item] = body[item];
        }
      }
    });
  }
  if (body.translations)
    for (
      let index = 0;
      index < Object.keys(body.translations).length;
      index++
    ) {
      if (Object.values(body.translations)[index].title.length > 0)
        await ProdTranslation.update(
          {
            title: Object.values(body.translations)[index].title,
            description: Object.values(body.translations)[index].description,
          },
          {
            where: {
              [Op.and]: {
                productId: id,
                lang: Object.keys(body.translations)[index],
              },
            },
          }
        );
    }
  if (Object.keys(currentProductBody).length > 0) {
    await product.update(currentProductBody);
  }
  return product;
};

const deleteProductByid = async (id) => {
  const productToBeDeleted = await findProduct(id);
  if (productToBeDeleted.image) {
    if (
      fs.existsSync(
        path.join(
          "uploads",
          "product",
          productToBeDeleted.image.split("/").pop()
        )
      )
    )
      await deleteFile(
        path.join(
          "uploads",
          "product",
          productToBeDeleted.image.split("/").pop()
        )
      );
  }
  const data = JSON.parse(
    fs.readFileSync(path.resolve("delivery.json"), "utf8")
  );
  if (data.totalFoods - 1 > -1)
    fs.writeFileSync(
      path.resolve("delivery.json"),
      JSON.stringify({ ...data, totalFoods: data.totalFoods - 1 })
    );
  await productToBeDeleted.destroy();
};
const newOrderPositionProduct = async () => {
  const d = await Product.findAll({
    order: [["position", "asc"]],
  });
  for (let index = 1; index < d.length; index++) {
    const currentElem = d[index];
    const prevElem = d[index - 1];
    if (currentElem.position - 1 !== prevElem.position) {
      currentElem.position = prevElem.position + 1;
      await currentElem.save();
    }
  }
};

const newOrderPositionCategory = async () => {
  const d = await ProdCategory.findAll({
    order: [["position", "asc"]],
  });
  for (let index = 1; index < d.length; index++) {
    const currentElem = d[index];
    const prevElem = d[index - 1];
    if (currentElem.position - 1 !== prevElem.position) {
      currentElem.position = prevElem.position + 1;
      await currentElem.save();
    }
  }
};

const findCategoryByPos = async (index, tx) => {
  const prod = await ProdCategory.findOne({
    where: { position: index },
    transaction: tx,
  });
  if (!prod)
    throw new Error("can not find category id please contact +99365829174");
  return prod;
};
const resortCategory = async (body, tx) => {
  if (body.newElem !== body.currentElem) {
    let prod;
    prod = await findCategoryByPos(body.currentElem, tx);
    prod.position = -1;
    await prod.save({ transaction: tx });
    if (body.newElem < body.currentElem)
      for (let i = body.newElem; i < body.currentElem; i++) {
        prod = await findCategoryByPos(i, tx);
        prod.position = i + 1;
        await prod.save({ transaction: tx });
      }
    else
      for (let i = body.currentElem + 1; i <= body.newElem; i++) {
        prod = await findCategoryByPos(i, tx);
        prod.position = i - 1;
        await prod.save({ transaction: tx });
      }
    prod = await findCategoryByPos(-1, tx);
    prod.position = body.newElem;
    await prod.save({ transaction: tx });
  }
};

/*
221
222
223 -1


*/
const resortProduct = async (body, tx) => {
  console.log(body.newElem, body.currentElem);
  if (body.newElem !== body.currentElem) {
    let prod;
    try {
      prod = await findProductByPos(body.currentElem, tx);
      console.log(body.currentElem, "founding...");
      console.log(prod.id, "id,s position to -1");
      prod.position = -1;
      await prod.save({ transaction: tx });

      if (body.newElem < body.currentElem)
        for (let i = body.currentElem - 1; i >= body.newElem; i--) {
          console.log(`here's ${i} id finding`);
          prod = await findProductByPos(i, tx);
          console.log(
            "found it position number id =",
            prod.id,
            "position is ",
            prod.position,
            "new position is ",
            i + 1
          );
          prod.position = i + 1;
          await prod.save({ transaction: tx });
        }
      else
        for (let i = body.currentElem + 1; i <= body.newElem; i++) {
          prod = await findProductByPos(i, tx);
          console.log(`here's ${i} id finding`);
          console.log(
            "found it position number id =",
            prod.id,
            "position is ",
            prod.position,
            "new position is ",
            i + 1
          );
          prod.position = i - 1;
          await prod.save({ transaction: tx });
        }

      console.log("then finding positioin in table -1");
      prod = await findProductByPos(-1, tx);
      console.log(prod.position);
      console.log(
        "found it position -1 changing to ",
        prod.id,
        prod.position,
        body.newElem
      );
      prod.position = body.newElem;
      await prod.save({ transaction: tx });
    } catch (err) {
      console.log(err);
    }
  }
  return;
};

const findProductByPos = async (index, tx) => {
  const prod = await Product.findOne({
    where: { position: index },
    transaction: tx,
  });
  if (!prod) throw new Error("can not find product id please try again");
  return prod;
};

module.exports = {
  saveCategory,
  resortCategory,
  resortProduct,
  updateCategoryById,
  deleteCategoryById,
  saveProduct,
  updateProductById,
  deleteProductByid,
  findProduct,
  findProdCategory,
  getProducts,
  getAllCategory,
  toggleActive,
  newOrderPositionProduct,
  newOrderPositionCategory,
};
