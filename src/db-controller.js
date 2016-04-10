import mysql from 'mysql';

function getPool(connectionCredentials) {
  return mysql.createPool(connectionCredentials);
}

function queryDB(...args) {
	connection.query(...args);
}

export default {
  getPool,
  queryDB
};

/*
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});*/
