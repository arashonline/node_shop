const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_shop','node_shop','node_shop', {
    dialect : 'mysql', 
    host:'localhost'
});

module.exports = sequelize;