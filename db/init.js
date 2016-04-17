import mysql from 'mysql';

var pool;

// TODO: Do we really need a pool for a single thread?
function init(connectionCredentials) {
	pool = mysql.createPool(connectionCredentials);
}

function queryDB(...args) {
	return (new Promise((resolve, reject) => {
		if (!pool) reject("database connection pool was never initialized");
		pool.getConnection((err, connection) => {
			connection.query(...args, (err, results, fields) => {
				if (err) {
					reject(err);
				} else {
					resolve({
						results,
						fields
					});
				}
			})
		});
	}));
}

export default {
	init,
	queryDB
};
