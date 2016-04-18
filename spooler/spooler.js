import {queryDB} from '../db/init';
import {sendMail} from './mailer';
import { ERRORS as mailerErrors } from './mailer-constants';

var spooler;

function EmailSpooler(domain) {
	console.log('constructing spooler');

	// true when doing stuff, false when waiting.  NOOP any poke that happens when active
	var active = false;
	// Set to true if the application needs to halt and not attempt to send any more emails
	var panicHalt = false;

	// Check db for any messages to send.
	// Return resovled promise with message data, rejected promise if no work to do (or db failure).
	function getMessageToSend() {
		console.log('running getMessageToSend()!')
		return new Promise((resolve, reject) => {
			queryDB('SELECT * FROM emails_pending limit 1')
			.then((resultObject) => {
				// ✔ query executed successfully
				if (resultObject.results.length == 1) {
					console.log('found a row to process')
					console.log(resultObject.results[0])
					resolve(resultObject.results[0]);
				} else {
					console.log('no data')
					reject({code: mailerErrors.NO_WORK_TO_DO});
				}
			}, (err) => {
				// ✘  DB failure
				console.log('db failure')
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
		console.log('purging from db: ' + trackingId)
		return new Promise((resolve, reject) => {
			queryDB('DELETE FROM emails_pending where trackingId = ?', trackingId)
			.then(() => {
				console.log('iPurged')
				resolve();
			}, (err) => {
				console.log('purge fail')
				reject({
					code: mailerErrors.FAILURE_TO_PURGE,
					reason: err
				});
			});
		});
	}

	// "main"
	// get an email to send, send it, purge its data from db
	// log/notify if anything goes wrong
	// continually recurse until all emails are sent, then wait to be poked by the listener thread
	function spool() {
		console.log('spool()')
		active = true;
		getMessageToSend().then((rowData) => {
			// ✔ found an email to send
			console.log('found an email to send')
			if (panicHalt) return Promise.reject({code: mailerErrors.RESPONDING_TO_HALT})

			return sendMail(rowData, domain);
		}).then((trackingId) => {
			// ✔ successfully sent
			console.log('successfully sent')
			return purgeEmailFromDatabase(trackingId);
		}).then(() => {
			// ✔ successfully purged from db
			console.log('successfully purged form db');
			// go fish for another one
			return spool();
		}).catch((rejectObject) => {
			console.log('spool() caught something')
			// ✘ one of the above three failed
			if (rejectObject.code) {
				switch (rejectObject.code) {
				case mailerErrors.FAILURE_TO_PURGE:
					// this one is extremely bad.  The entire application needs to stop everything right now,
					// or risk sending the same email over and over again
					console.log('panic halting');
					panicHalt = true;
					// don't break
				case mailerErrors.FAILURE_TO_RETRIEVE_WORK:
				case mailerErrors.FAILURE_TO_SEND:
					// TODO: some kind of log/notify
					console.log("SPOOL ERROR: " + rejectObject.code + ":   " + rejectObject.reason);
					// don't break
				case mailerErrors.NO_WORK_TO_DO:
				case mailerErrors.RESPONDING_TO_HALT:
					console.log('spooler spinning down')
					active = false;
					break;
				default:
					console.log('dunno what i just caught')
					active = false;
					// TODO: log/notify about an unknown error type
				}
			} else {
				console.log("Unknown error: " + rejectObject);
				panicHalt = true;
				active = false;
			}
		});
	}

	this.poke = function() {
		console.log('poking')
			// if already doing stuff, NOOP
		if (!active) {
			console.log('spooler was inactive, spinning up')
			spool();
		} else {
			console.log('spooler was already spinning, NOOPing')
		}
	};
};

// EmailSpooler is a singleton class
export default function(domain) {
	if (undefined == spooler) {
		spooler = new EmailSpooler(domain);
	}
	return spooler;
}
