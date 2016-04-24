import mysql from 'mysql';

var pool;

// TODO: Do we really need a pool for a single thread?
export function init(connectionCredentials) {
	return new Promise((resolve, reject) => {
		pool = mysql.createPool(connectionCredentials);
		console.log('db initialized')
		resolve();
	});
}

export function queryDB(...args) {
	return (new Promise((resolve, reject) => {
		if (!pool) reject("database connection pool was never initialized");
		pool.getConnection((connectionErr, connection) => {
			if (connectionErr) {
				connection.release();
				reject(connectionErr);
			} else {
				connection.query(...args, (queryErr, results, fields) => {
					if (queryErr) {
						connection.release();
						reject(queryErr);
					} else {
						connection.release();
						resolve({
							results,
							fields
						});
					}
				})
			}
		});
	}));
}
