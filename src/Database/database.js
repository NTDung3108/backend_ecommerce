const mysql = require('mysql');
const { promisify } = require('util');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'ecommerce_db',
    decimalNumbers: true,
});

pool.getConnection((err, connection) => {
    if( err ){
        if(err.code === 'PROTOCOL_CONNECTION_LOST') console.log('DATABASE CONNECTION WAS CLOSED');
        if(err.code === 'ER_CON_COUNT_ERROR') console.log('DATABASE HAS TO MANY CONNECTIONS');
        if(err.code === 'ECONNREFUSED') console.log('DATABASE CONNECTION WAS REFUSED');
    }

    if(connection){
        console.log('DATABASE IS CONECTED');
        return;
    }
});

pool.query = promisify( pool.query );
module.exports = pool;