import mysql from 'mysql';

var pool;

function init(connectionCredentials) {
  pool = mysql.createPool(connectionCredentials);
}

function queryDB(...args) {
  return (new Promise((resolve, reject) => {
    console.log('about to query');
    pool.getConnection((err, connection) => {
      console.log('got a connection')
      connection.query(...args, (err, results, fields) => {
        if (err) {
          console.log('query err')
          reject(err);
        } else {
          console.log('query success')
          resolve({results, fields});
        }
      })
    });
  }));
}

export default {
  init,
  queryDB
};
