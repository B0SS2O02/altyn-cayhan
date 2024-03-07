module.exports = {
  database: {
    database: "altyncayhana",
    username: "root",
    password: "root5312023",
    dialect: "postgres",
    host: "127.0.0.1",
    port: 5432,
    logging: true,
    dialectOptions: {
      maxRetryCount: 10,
      minRetryCount: 1,
      retryInterval: 1000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  key: {
    JWT_SECRET_KEY: "futboljankoyer__!",
  },
};
