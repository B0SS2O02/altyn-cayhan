const app = require("./src/app");
const { sequelize } = require("./database/models");
const logger = require("./src/api/shared/logger");
const { connectWSS } = require("./src/api/wss/webSocketServer");
const defaults = require("./src/api/util/defaults");
const config = require("./serverSettings.json");
const server = async () => {
  try {
    await sequelize.sync();
    await defaults();
    app.listen(config.port, async () => {
      logger.info(
        "server is listening another 3001 port" +
          process.env.npm_package_version
      );
      connectWSS(config.socketPort);
    });
  } catch (err) {
    console.log(err);
  }
};

server();
