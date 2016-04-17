import db from '../db/init';
import postConstants from './post-constants';

const checkDoesntExist = function(trackingId) {
	const checks = [
		// For now there's only one table to check.  Will be adding more
		new Promise((resolve, reject) => {
			db.queryDB('SELECT 1 FROM emails_pending WHERE trackingId = ? ', trackingId)
				.then((resultObject) => {
					// ✔
					if (resultObject.results.length == 0) {
						resolve();
					} else {
						reject({
							reason: "trackingid exists in emailsPending",
							responseCode: postConstants.RESPONSES.DUPLICATE
						});
					}
				}, (err) => {
					// ✘
					reject({
						reason: "db internal error: " + err,
						responseCode: postConstants.RESPONSES.DB_FAILURE
					});
				});
		})
	];
	return Promise.all(checks);
};

const writeEmailToDatabase = function(emailData) {
	return db.queryDB('INSERT INTO emails_pending SET ?', emailData)
		.catch((err) => {
			return Promise.reject({
				reason: err,
				responseCode: postConstants.RESPONSES.DB_FAILURE
			})
		});
}

export default {
	checkDoesntExist,
	writeEmailToDatabase
};
