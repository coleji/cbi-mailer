import nodemailer from 'nodemailer';
import fs from 'fs';

import {SMTP_CONFIG, DB_FIELDS_TO_IGNORE, DB_PARAM_TO_NODEMAILER_PARAM, ERRORS} from './mailer-constants';
import {log} from '../log/log';

var transporter;

export function init() {
	return new Promise((resolve, reject) => {
		transporter = nodemailer.createTransport(SMTP_CONFIG);

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
			},
			headers: {
				'X-CBI-TrackingId' : rowData.trackingId,
				'X-CBI-Instance' : rowData.apexInstance
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
				log.info('couldnt translate mail property ' + p);
				mailData[p] = rowData[p];
			}
		}

		transporter.sendMail(mailData, (err, info) => {
			if (err) {
				log.info('send fail')
				reject({
					code: ERRORS.FAILURE_TO_SEND,
					reason: err
				});
			} else {
				log.info('send success!')
				resolve(rowData.trackingId);
			}
		})
	});
};
