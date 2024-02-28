const Auth = require("../auth/auth");
const RestaurantTranslation = require("../restaurant/restTranslator");
const Restaurant = require("../restaurant/restaurants");

const rests = [
  {
    image: "/uploads/restaurant/res1.webp",
    position: 1,
    translate: [
      { title: "rest 1", description: "rest 1 description", lang: "ru" },
      { title: "rest 1", description: "rest 1 description", lang: "tm" },
    ],
  },
  {
    image: "/uploads/restaurant/res2.webp",
    position: 2,
    translate: [
      { title: "rest 2", description: "rest 2 description", lang: "ru" },
      { title: "rest 2", description: "rest 2 description", lang: "tm" },
    ],
  },
  {
    image: "/uploads/restaurant/res3.webp",
    position: 3,
    translate: [
      { title: "rest 3", description: "rest 3 description", lang: "ru" },
      { title: "rest 3", description: "rest 3 description", lang: "tm" },
    ],
  },
];

module.exports = async () => {
  await Auth.count().then(async (response) => {
    if (!response) {
      await Auth.create({
        fullName: "admin",
        login: "admin",
        password: "admin1234",
        role: "admin",
      });
    }
  });

  await Restaurant.count().then(async (value) => {
    if (!value) {
      for (const rest of rests) {
        let Rest = await Restaurant.create({
          image: rest.image,
          position: rest.position,
        });
        for (const translate of rest.translate) {
          RestaurantTranslation.create({
            title: translate.title,
            description: translate.description,
            lang: translate.lang,
            restaurantId: Rest.id,
          });
        }
      }
    }
  });
};
