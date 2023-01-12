const {sequelize, Sequelize} = require(".");

module.exports = (sequelize, Sequelize) => {
    const Author = sequelize.define("authors", {
        nama: {
            type: Sequelize.STRING,
            unique: {
                args: true,
                msg: 'nama telah dipakai!'
            }
        },
        asal: {
            type: Sequelize.STRING
        },
    });
    return Author;
}