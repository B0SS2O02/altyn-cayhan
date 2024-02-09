const app = require("./src/app");
const sequelize = require("./src/api/config/database");
const logger = require("./src/api/shared/logger");
const { connectWSS } = require("./src/api/wss/webSocketServer");
const Auth = require("./src/api/auth/auth");
const server = async () => {
  try {
    await sequelize.sync();
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
