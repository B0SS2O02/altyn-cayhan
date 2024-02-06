const app = require("./src/app");
const sequelize = require("./src/api/config/database");
const logger = require("./src/api/shared/logger");
const { connectWSS } = require("./src/api/wss/webSocketServer");
const server = async () => {
  try {
    await sequelize.sync();
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
