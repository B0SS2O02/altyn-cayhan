module.exports = {
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
    },
    key: {
      JWT_SECRET_KEY: "futboljankoyer__!",
    },
  };
  
  
