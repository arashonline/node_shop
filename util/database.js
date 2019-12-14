const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'node_shop',
    database: 'node_shop',
    password: 'node_shop',
})

module.exports = pool.promise();