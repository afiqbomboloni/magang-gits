const {sequelize, Sequelize} = require(".");

module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define("books", {
        judul: {
            type: Sequelize.STRING,
            unique: {
                args: true,
                msg: 'judul tersebut telah ada!'
            }
        },
        tema: {
            type: Sequelize.STRING
        },
    });
    return Book;
}