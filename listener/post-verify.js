import md5 from 'md5';

//import mailer from './mailer.js';
import postConstants from './post-constants';
import db from './db';

const verifyChecksum = function(body, salt) {
	// construct a GET-style string of all the parameters and md5 it (with secret salt from ini), compare against provided checksum
	let paramStrings = [];
	postConstants.REQUIRED_PARAMS.forEach(e => {
		if (e != 'checksum') paramStrings.push(e + '=' + body[e]);
	});
	let checkMe = paramStrings.join('&');
	let checksum = md5(salt + checkMe + salt).toUpperCase();
	console.log('expected ' + checksum)
	return (checksum == body.checksum);
};

export default function(req) {
	return new Promise((validationResolve, validationReject) => {
		// List of all validations to check in the form of a promise.
		const VALIDATIONS = [
			// Check that all required params were provided
			new Promise((resolve, reject) => {
				var missingParams = postConstants.REQUIRED_PARAMS.filter(e => !req.body[e]);
				if (missingParams.length > 0) {
					reject({
						reason: "Missing required params: " + missingParams.join(", "),
						responseCode: postConstants.RESPONSES.GARBLED
					});
				} else {
					resolve();
				}
			}),

			// Verify checksum
			new Promise((resolve, reject) => {
				if (!verifyChecksum(req.body, req.privateConfig.hash.salt)) {
					reject({
						reason: "Bad checksum.",
						responseCode: postConstants.RESPONSES.GARBLED
					});
				} else {
					resolve();
				}
			}),

			// check trackingId against local db (returns a promise)
			db.checkDoesntExist(req.body.trackingId)
		];

		// Check all validation promises
		Promise.all(VALIDATIONS).then(() => {
			// ✔
			// construct new data object as a filtered copy of req.body, copying only the params we care about
			let emailData = {};
			postConstants.REQUIRED_PARAMS.forEach(e => {
				emailData[e] = req.body[e];
			});
			postConstants.OPTIONAL_PARAMS.forEach(e => {
				if (req.body[e]) emailData[e] = req.body[e];
			});

			// return all validations passed, hand off email data for storage and sending
			validationResolve(emailData);
		}, (rejectObject) => {
			// ✘
			validationReject(rejectObject);
		});

	});
}
