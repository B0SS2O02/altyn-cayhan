const ProdCategory = require("../product/prodCategory");
const ProdCategoryTranslation = require("../product/prodCategoryTranslation");
const ProdTranslation = require("../product/prodTranslation");
const Product = require("../product/product");
const RestaurantTranslation = require("../restaurant/restTranslator");
const Restaurant = require("../restaurant/restaurants");

const GetOffline = async () => {
  const data = await Restaurant.findAll({
    attributes: ["id", "image"],
    include: [
      {
        model: RestaurantTranslation,
        attributes: ["title", "description", "lang"],
      },
      {
        model: ProdCategory,
        attributes: ["id", "image"],
        include: [
          {
            model: ProdCategoryTranslation,
            attributes: ["title", "lang"],
          },
          {
            model: Product,
            attributes: [
              "id",
              "image",
              "price",
              "active",
              "popular",
              "discount",
            ],
            include: [
              {
                model: ProdTranslation,
                attributes: ["title", "description", "lang"],
              },
            ],
          },
        ],
      },
    ],
  });

  const translateEdit = (value) => {
    let tmp = {};
    for (const i of value) {
      for (const key in i) {
        if (key != "lang") {
          if (!tmp[key]) {
            tmp[key] = {};
          }
          tmp[key][i.lang] = i[key];
        }
      }
    }
    return tmp;
  };

  const structured = (data) => {
    let result = [];
    data = JSON.parse(JSON.stringify(data));

    for (const element of data) {
      let temp = {};
      for (const key in element) {
        if (key == "restaurantTranslations") {
          temp = { ...temp, ...translateEdit(element[key]) };
        } else if (key == "prodCategories") {
          let tempCatList = [];
          for (const cat of element[key]) {
            let tempCat = {};
            for (const catKey in cat) {
              if (catKey == "ProdCategoryTranslations") {
                tempCat = { ...tempCat, ...translateEdit(cat[catKey]) };
              } else if (catKey == "products") {
                let tempProductList = [];
                for (const product of cat[catKey]) {
                  let tempProduct = {};
                  for (const productKey in product) {
                    if (productKey == "prodTranslations") {
                      tempProduct = {
                        ...tempProduct,
                        ...translateEdit(product[productKey]),
                      };
                    } else {
                      tempProduct[productKey] = product[productKey];
                    }
                  }
                  tempProductList.push(tempProduct);
                }
                tempCat["products"] = tempProductList;
              } else {
                tempCat[catKey] = cat[catKey];
              }
            }
            tempCatList.push(tempCat);
          }
          temp["category"] = tempCatList;
        } else {
          temp[key] = element[key];
          console.log(key, element[key]);
        }
      }

      result.push(temp);
    }

    return result;
  };

  return structured(data);
};

module.exports = { GetOffline };
