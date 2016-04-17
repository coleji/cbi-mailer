import nodemailer from 'nodemailer';
import fs from 'fs';
import {
	signer
} from 'nodemailer-dkim';

import mailerConstants from './mailer-constants';

var transporter;

const init = function(dkimConfig) {

	transporter = nodemailer.createTransport(mailerConstants.SMTP_CONFIG);

	let dkimOptions = {
		domainName: dkimConfig.domainName,
		keySelector: dkimConfig.keySelector,
		privateKey: fs.readFileSync(dkimConfig.privateKeyFile, 'utf-8')
	};

	transporter.use('stream', signer(dkimOptions))

	transporter.verify(function(err, success) {
		if (err) {
			console.log("mailer init failed: " + err)
		} else {
			console.log("mailer ready to receive mails");
		}
	});
};

const sendMail = function(rowData, domain) {
	return new Promise((resolve, reject) => {
		let mailData = {
			envelope: {
				from: 'donotreply@' + domain,
				to: rowData.rcptTo
			}
		};
		for (let p in rowData) {
			if (!!mailerConstants.DB_FIELDS_TO_IGNORE[p]) {
				continue;
			} else if (!!mailerConstants.DB_PARAM_TO_NODEMAILER_PARAM[p]) {
				mailData[mailerConstants.DB_PARAM_TO_NODEMAILER_PARAM[p]] = rowData[p];
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
				reject(err);
			} else {
				console.log('send success!')
				resolve();
			}
		})
	});
};

export default {
	init,
	sendMail
}
