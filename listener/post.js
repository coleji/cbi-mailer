import md5 from 'md5';
import request from 'request';

//import mailer from './mailer.js';
import postConstants from './post-constants';
import db from './db';
import postVerify from './post-verify';
import {log} from '../log/log';

const respondFailure = function(rejectObject, req, res) {
	if (!!rejectObject.responseCode && !!rejectObject.reason) {
		res.send(rejectObject.responseCode + ": " + rejectObject.reason);
	} else {
		res.send(postConstants.RESPONSES.OTHER + ": " + rejectObject);
	}
	// TODO: write to log file
};

export default function(req, res) {
	var promise = postVerify(req).then((emailData) => {
		// ✔
		return db.writeEmailToDatabase(emailData);
	}).then(() => {
		// ✔
		res.send(postConstants.RESPONSES.OK);
		request('http://localhost:' + req.privateConfig.spooler.port + '/poke', function(error, response, body) {
			if (!error && response.statusCode == 200) {
				log.info('?' + body)
			} else {
				log.info('??' + error + "??" + response + '???' + body);
			}
		});
	}, (rejectObject) => {
		// ✘
		respondFailure(rejectObject, req, res); // either the error from the validations, or from the db save
	});
}
