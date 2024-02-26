const { Op } = require("sequelize");
const Restaurant = require("./restaurants");
const RestTranlator = require("./restTranslator");

module.exports.getRestaurants = async (lang) => {
  const restaurants = await Restaurant.findAll({
    include: [
      {
        model: RestTranlator,
        attributes: { exclude: ["id", "restaurantId", "lang"] },
        where: {
          lang: lang,
        },
      },
    ],
  });

  const structured = (data) => {
    let result = [];
    data = JSON.parse(JSON.stringify(data));

    for (const element of data) {
      let temp = {};
      for (const key in element) {
        if (key == "restaurantTranslations") {
          for (const translate of element[key]) {
            for (const tKey in translate) {
              temp[tKey] = translate[tKey];
            }
          }
        } else {
          temp[key] = element[key];
        }
      }

      result.push(temp);
    }
    return result;
  };

  return {
    restaurants: structured(restaurants),
  };
};

module.exports.findRestaurant = async (id, translations = false, lang) => {
  let include = [],
    where = {};

  if (lang)
    where = {
      lang: lang,
    };
  if (translations || lang) {
    include = [
      {
        model: RestTranlator,
        attributes: ["description", "title", "lang"],
        where,
      },
    ];
  }
  const restaurant = await Restaurant.findOne({
    where: {
      id: id,
    },
    include,
  });

  if (!restaurant) throw new NotFoundException();
  return restaurant;
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
        model: RestTranlator,
        attributes: ["title", "lang"],
        where,
      },
    ];
  }
  const restaurant = Restaurant.findOne({
    where: {
      id: id,
    },
    include,
  });
  if (!restaurant) throw new NotFoundException();
  return restaurant;
};

module.exports.updateRestaurantById = async (body, file, id) => {
  const restaurant = await findProdCategory(id);
  const currentRestaurantBody = {};
  if (file) {
    if (
      fs.existsSync(
        path.join("uploads", "restaurant", restaurant.image.split("/").pop())
      )
    )
      await deleteFile(
        path.join("uploads", "restaurant", restaurant.image.split("/").pop())
      );
    const mainImgPath = addNewPath(file.originalname);
    const oldImgPath = path.join(file.destination, file.filename);
    await formatImages(oldImgPath, `.${mainImgPath}`);
    currentRestaurantBody.image = mainImgPath;
  }
  if (body) {
    Object.keys(body).forEach((item) => {
      if (body[item] && item !== "translations")
        currentRestaurantBody[item] = body[item];
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
        await RestTranlator.update(
          {
            title: Object.values(body.translations)[index].title,
          },
          {
            where: {
              [Op.and]: {
                lang: Object.keys(body.translations)[index],
                restaurantId: id,
              },
            },
          }
        );
      }
    }
  }

  if (Object.keys(currentRestaurantBody).length > 0) {
    await restaurant.update(currentRestaurantBody);
  }
  return restaurant;
};
