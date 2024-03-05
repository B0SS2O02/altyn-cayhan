const app = require("./src/app");
const { sequelize } = require("./database/models");
const logger = require("./src/api/shared/logger");
const { connectWSS } = require("./src/api/wss/webSocketServer");
const defaults = require("./src/api/util/defaults");
const config = require("./serverSettings.json");

const server = async () => {
  try {
    await sequelize.sync({ alter: true });
    // await Auth.count().then(async (response) => {
    //   if (!response) {
    //     await Auth.create({
    //       fullName: "admin",
    //       login: "admin",
    //       password: "admin1234",
    //       role: "admin",
    //     });
    //   }
    // });
    await sequelize.sync();
    await defaults();
    app.listen(config.port, async () => {
      logger.info(
        `server is listening another ${config.port} port` +
          process.env.npm_package_version
      );
      connectWSS(config.socketPort);
	console.log("Server is started")
    });
  } catch (err) {
    console.log(err);
  }
};

server();
