import http from 'http';
import md5 from 'md5';

import {queryDB} from '../db/init';
import {sendMail} from './mailer';
import { ERRORS as mailerErrors } from './mailer-constants';
import {log} from '../log/log';

var spooler;

function EmailSpooler(config) {
	console.log('constructing spooler');

	// true when doing stuff, false when waiting.  NOOP any poke that happens when active
	var active = false;
	// Set to true if the application needs to halt and not attempt to send any more emails
	var panicHalt = false;

	// Check db for any messages to send.
	// Return resovled promise with message data, rejected promise if no work to do (or db failure).
	function getMessageToSend() {
		log.info('running getMessageToSend()!')
		return new Promise((resolve, reject) => {
			queryDB('SELECT * FROM emails_pending limit 1')
			.then((resultObject) => {
				// ✔ query executed successfully
				if (resultObject.results.length == 1) {
					log.info('found a row to process')
					resolve(resultObject.results[0]);
				} else {
					log.info('no data')
					reject({code: mailerErrors.NO_WORK_TO_DO});
				}
			}, (err) => {
				// ✘  DB failure
				log.info('db failure')
				reject({
					code: mailerErrors.FAILURE_TO_RETRIEVE_WORK,
					reason: err
				});
			});
		});
	};

	// Return resolved promise if data was successfully purged,
	// rejected promise if unable to purge.  That is the worst possible failure type for this app
	function purgeEmailFromDatabase(trackingId) {
		log.info('purging from db: ' + trackingId)
		return new Promise((resolve, reject) => {
			queryDB('INSERT INTO emails_sent SET ?', {trackingId})
			.then(() => {
				log.info("wrote trackingId to emails_sent");
				return queryDB('DELETE FROM emails_pending where trackingId = ?', trackingId);
			}).then(() => {
				log.info('iPurged')
				resolve(trackingId);
			}, (err) => {
				log.info('purge fail')
				reject({
					code: mailerErrors.FAILURE_TO_PURGE,
					reason: err
				});
			});
		});
	}

	function notifyDBSent(trackingId) {
		log.info("notifying DB")
		return new Promise((resolve, reject) => {
			let salt = config.hash.salt;
			let url = config.server.respond_url + '?P_TRACKING_ID=' + trackingId + '&P_HASH=' + md5(salt + trackingId + salt).toUpperCase();
			log.info("about to GET " + url);
			http.get(url, (res) => {
				log.info('notify came back....')
				log.info(res.statusCode + ": " + res.statusMessage);
				switch (String(res.statusCode)) {
				case "200":
					resolve();
					break;
				case "404":
				default:
					reject({
						code: mailerErrors.FAILURE_TO_NOTIFY_DB,
						reason: res.statusCode + ': ' + res.statusMessage
					});
				}
			}).on('error', (e) => {
				log.info('notify fail')
				log.info(`Got error: ${e.message}`);
				reject({
					code: mailerErrors.FAILURE_TO_NOTIFY_DB,
					reason: e.message
				});
			});
		});
	}

	// "main"
	// get an email to send, send it, purge its data from db
	// log/notify if anything goes wrong
	// continually recurse until all emails are sent, then wait to be poked by the listener thread
	function spool() {
		log.info('spool()')
		active = true;
		getMessageToSend().then((rowData) => {
			// ✔ found an email to send
			log.info('*******   found an email to send: ' + rowData.trackingId)
			if (panicHalt) return Promise.reject({code: mailerErrors.RESPONDING_TO_HALT})

			return sendMail(rowData, config.server.domain);
		}).then((trackingId) => {
			// ✔ successfully sent
			log.info('successfully sent')
			return purgeEmailFromDatabase(trackingId);
		}).then((trackingId) => {
			// ✔ successfully purged from db
			log.info('successfully purged form db');
			return notifyDBSent(trackingId);
		}).then(() => {
			log.info("successfully notified DB; fishing for another email")
			// go fish for another one
			return spool();
		}).catch((rejectObject) => {
			log.info('spool() caught something')
			// ✘ one of the above three failed
			if (rejectObject.code) {
				switch (rejectObject.code) {
				case mailerErrors.FAILURE_TO_PURGE:
					// this one is extremely bad.  The entire application needs to stop everything right now,
					// or risk sending the same email over and over again
					log.info('panic halting');
					panicHalt = true;
					// don't break
				case mailerErrors.RESPONDING_TO_HALT:
					log.info('responding to halt')
				case mailerErrors.FAILURE_TO_RETRIEVE_WORK:
				case mailerErrors.FAILURE_TO_SEND:
				case mailerErrors.FAILURE_TO_NOTIFY_DB:
					// TODO: some kind of log/notify
					log.info("SPOOL ERROR: " + rejectObject.code + ":   " + rejectObject.reason);
					// don't break

				case mailerErrors.NO_WORK_TO_DO:
					log.info('spooler spinning down')
					active = false;
					break;
				default:
					log.info('dunno what i just caught')
					active = false;
					// TODO: log/notify about an unknown error type
				}
			} else {
				log.info("Unknown error: " + rejectObject);
				panicHalt = true;
				active = false;
			}
		});
	}

	this.poke = function() {
		log.info('poking')
			// if already doing stuff, NOOP
		if (!active) {
			log.info('spooler was inactive, spinning up')
			spool();
		} else {
			log.info('spooler was already spinning, NOOPing')
		}
	};
};

// EmailSpooler is a singleton class
export default function(config) {
	return new Promise((resolve, reject) => {
		if (undefined == spooler) {
			spooler = new EmailSpooler(config);
		}
		resolve(spooler);
	});

}
