const app = require("./src/app");
const { sequelize } = require("./database/models");
const logger = require("./src/api/shared/logger");
const { connectWSS } = require("./src/api/wss/webSocketServer");
const defaults = require("./src/api/util/defaults");
const server = async () => {
  try {
<<<<<<< HEAD
    await sequelize.sync({alter:true});
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
=======
    await sequelize.sync();
    await defaults();
>>>>>>> 4938acace6cebe300abff175c21746606e2da2c3
    app.listen(3001, async () => {
      logger.info(
        "server is listening another 3001 port" +
          process.env.npm_package_version
      );
      connectWSS(3002);
    });
  } catch (err) {
    console.log(err);
  }
};

server();
