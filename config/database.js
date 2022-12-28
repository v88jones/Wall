const mysql = require('mysql');

const database = mysql.createConnection({
    host: '192.168.254.111',
    user: 'v88jones',
    password: '',
    database: 'the_wall',
    port: 3306
});

database.connect();

module.exports = database;