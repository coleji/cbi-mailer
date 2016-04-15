import mysql from 'mysql';

var pool;

function init(connectionCredentials) {
  pool = mysql.createPool(connectionCredentials);
}

function queryDB(...args) {
  console.log('about to query');
  pool.getConnection((err, connection) => {
    console.log('got a connection')
    connection.query(...args);
    connection.release();
  });
}

export default {
  init,
  queryDB
};
