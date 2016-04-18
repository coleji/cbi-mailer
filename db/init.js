import mysql from 'mysql';

var pool;

// TODO: Do we really need a pool for a single thread?
export function init(connectionCredentials) {
	pool = mysql.createPool(connectionCredentials);
	console.log('db initialized')
}

export function queryDB(...args) {
	console.log('inside queryDB')
	return (new Promise((resolve, reject) => {
		if (!pool) reject("database connection pool was never initialized");
		pool.getConnection((connectionErr, connection) => {
			console.log('just called getConnection')
			if (connectionErr) {
				connection.release();
				reject(connectionErr);
			} else {
				connection.query(...args, (queryErr, results, fields) => {
					console.log('just called query')
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
