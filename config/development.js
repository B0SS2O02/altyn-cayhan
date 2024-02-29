module.exports = {
  database: {
    dialect: "postgres",
    username: "root",
    password: "root5312023",
    database: "altyncayhana",
    host: "95.85.127.110",
    port: 5432,
    logging: false,
    dialectOptions: {
      maxRetryCount: 10, // Maximum number of connection acquisition retries
      minRetryCount: 1, // Minimum number of connection acquisition retries
      retryInterval: 1000, // Time interval between retries in milliseconds (1 second in this example)
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

