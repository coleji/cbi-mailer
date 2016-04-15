import mysql from 'mysql';

var pool;

function init(connectionCredentials) {
  pool = mysql.createPool(connectionCredentials);
}

function queryDB(...args) {
  pool.getConnection((err, connection) => {
    connection.query(...args);
    connection.release();
  });
}

export default {
  init,
  queryDB
};
