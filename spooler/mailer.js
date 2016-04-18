import nodemailer from 'nodemailer';
import fs from 'fs';
import { signer } from 'nodemailer-dkim';

import {SMTP_CONFIG, DB_FIELDS_TO_IGNORE, DB_PARAM_TO_NODEMAILER_PARAM, ERRORS} from './mailer-constants';

var transporter;

export function init(dkimConfig) {
	return new Promise((resolve, reject) => {
		transporter = nodemailer.createTransport(SMTP_CONFIG);

		let dkimOptions = {
			domainName: dkimConfig.domainName,
			keySelector: dkimConfig.keySelector,
			privateKey: fs.readFileSync(dkimConfig.privateKeyFile, 'utf-8')
		};

	//	transporter.use('stream', signer(dkimOptions))

		transporter.verify(function(err, success) {
			if (err) {
				reject(err);
			} else {
				console.log("mailer ready to receive mails");
				resolve();
			}
		});
	});
}

export function sendMail(rowData, domain) {
	return new Promise((resolve, reject) => {
		let mailData = {
			envelope: {
				from: 'donotreply@' + domain,
				to: rowData.rcptTo
			}
		};
		for (let p in rowData) {
			if (!!DB_FIELDS_TO_IGNORE[p]) {
				continue;
			} else if (!!DB_PARAM_TO_NODEMAILER_PARAM[p]) {
				mailData[DB_PARAM_TO_NODEMAILER_PARAM[p]] = rowData[p];
			} else if (p == 'miscHeaders') {
				// add the headers
			} else {
				console.log('couldnt translate mail property ' + p);
				mailData[p] = rowData[p];
			}
		}

		transporter.sendMail(mailData, (err, info) => {
			if (err) {
				console.log('send fail')
				reject({
					code: ERRORS.FAILURE_TO_SEND,
					reason: err
				});
			} else {
				console.log('send success!')
				resolve(rowData.trackingId);
			}
		})
	});
};
