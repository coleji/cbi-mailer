import {queryDB} from '../db/init';
import postConstants from './post-constants';

const checkDoesntExist = function(trackingId) {
	return new Promise((resolve, reject) => {
		queryDB('SELECT 1 FROM emails_pending WHERE trackingId = ? ', trackingId)
		.then((resultObject) => {
			// ✔
			if (resultObject.results.length == 0) {
				return queryDB('SELECT 1 FROM emails_sent WHERE trackingId = ? ', trackingId);
			} else {
				reject({
					reason: "trackingid exists in emailsPending",
					responseCode: postConstants.RESPONSES.DUPLICATE
				});
			}
		}).then((resultObject) => {
			// ✔
			if (resultObject.results.length == 0) {
				resolve();
			} else {
				reject({
					reason: "trackingid exists in emailsSent",
					responseCode: postConstants.RESPONSES.DUPLICATE
				});
			}
		}).catch((err) => {
			// ✘
			reject({
				reason: "db internal error: " + err,
				responseCode: postConstants.RESPONSES.DB_FAILURE
			});
		});
	})
};

const writeEmailToDatabase = function(emailData) {
	return queryDB('INSERT INTO emails_pending SET ?', emailData)
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
