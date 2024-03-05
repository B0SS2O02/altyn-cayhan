module.exports = {
<<<<<<< HEAD
    database: {
      dialect: "postgres",
      username: "root",
      password: "root14122023",
      database: "altyncayhana",
      host: "127.0.0.1",
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
=======
  database: {
    dialect: "postgres",
    // username: "root",
    // password: "root5312023",
    // host: "95.85.127.110",
    username: "postgres",
    password: "pikir",
    host: "127.0.0.1",

    database: "altyncayhana",
    port: 5432,
    logging: false,
    dialectOptions: {
      maxRetryCount: 10, // Maximum number of connection acquisition retries
      minRetryCount: 1, // Minimum number of connection acquisition retries
      retryInterval: 1000, // Time interval between retries in milliseconds (1 second in this example)
>>>>>>> 712ec142eba3fe9ccb1b7f5213e1124b66a5da1e
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
<<<<<<< HEAD
  };
  
  
=======
  },
  key: {
    JWT_SECRET_KEY: "futboljankoyer__!",
  },
};
>>>>>>> 712ec142eba3fe9ccb1b7f5213e1124b66a5da1e
