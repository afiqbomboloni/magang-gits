const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model")(sequelize, Sequelize)
db.role = require("../models/role.model")(sequelize, Sequelize)

db.authors = require("./author.model.js")(sequelize, Sequelize);
db.books = require("./book.model.js")(sequelize, Sequelize);
db.publishers = require("./publisher.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "role_id",
  otherKey: "user_id"
})

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id"
})

db.authors.hasMany(db.books, { 
  foreignKey: "author_id",
  as: "book" });

db.books.belongsTo(db.authors, {
  foreignKey: "author_id",
  as: "author",
});

db.books.hasOne(db.publishers, {
  foreignKey: {
    name: "book_id",
    unique: {
      args: true,
      msg: "Buku ini telah dipilih"
    }, 
  },
  as: "publisher"});

db.publishers.belongsTo(db.books, {
  foreignKey: {
    name: "book_id",
    unique: {
      args: true,
      msg: "Buku ini telah dipilih"
    },
  },
    as: "book",
});

db.ROLES = ['admin', 'user']

module.exports = db;