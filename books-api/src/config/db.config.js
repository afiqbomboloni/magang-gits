module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "tukanggalon123",
    DB: "db_book",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };