
const {sequelize, Sequelize} = require(".");

module.exports = (sequelize, Sequelize) => {
    const Publisher = sequelize.define("publishers", {
        nama: {
            type: Sequelize.STRING,
            unique: {
                args: true,
                msg: 'nama telah dipakai!'
            }
        },
    });
    return Publisher;
}