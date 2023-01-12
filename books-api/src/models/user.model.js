const { sequelize, Sequelize } = require(".");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            unique: {
                args: true,
                msg: 'email telah dipakai!'
            },
            validate: {
                isEmail: {
                    msg: "Must be a valid email address"
                }
            }
        },
        password: {
            type: Sequelize.STRING,
           
        }
    })
    return User
}