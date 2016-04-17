import db from '../db/init';
import mailer from './mailer';
import {
	ERRORS as mailerErrors
} from './mailer-constants';

var spooler;

function EmailSpooler() {
	console.log('constructing spooler');

	// true when doing stuff, false when waiting.  NOOP any poke that happens when active
	var active = false;

	// Check db for any messages to send.
	// Return resovled promise with message data, rejected promise if no work to do (or db failure).
	function getMessageToSend() {
		console.log('running getMessageToSend()')
		return new Promise((resolve, reject) => {
			console.log('inside promise')
			db.queryDB('SELECT * FROM emails_pending limit 1')
				.then((resultObject) => {
					// ✔ query executed successfully
					if (resultObject.results.length == 1) {
						console.log('found a row to process')
						console.log(resultObject.results[0])
						resolve(resultObject.results[0]);
					} else {
						console.log('no data')
						reject(mailerErrors.NO_WORK_TO_DO);
					}
				}, () => {
					// ✘  DB failure
					console.log('db failure')
					reject(mailerErrors.FAILURE_TO_RETRIEVE_WORK);
				});
		});
	};

	function purgeEmailFromDatabase(trackingId) {

	}

	function spool() {
		active = true;
		getMessageToSend().then((rowData) => {
			// ✔ found an email to send
			console.log('found an email to send')
			return mailer.sendMail(rowData);
		}).then((trackingId) => {
			// ✔ successfully sent
			console.log('successfully sent')
			return purgeEmailFromDatabase(trackingId);
		}).then(() => {
			// ✔ successfully purged from db
			console.log('successfully purged form db')
		}).catch(() => {
			// ✘ one of the above three failed
		});

		/*

		, (reason) => {
		  console.log('spool() didnt find any work to do')
		  // either no data, or db failure
		  if (reason == this.REJECTION_REASONS.DB_FAILURE) {
		    // log/alert admin/do something
		  }
		  active = false;
		}

		(err) => {
		  // ✘  send mail failure
		  console.log('mail send failure: ' + err);
		  // TODO: HACF, notify admin
		  return Promise.reject();
		}

		*/
	}

	this.poke = function() {
		console.log('poking')
			// if already doing stuff, NOOP
		if (!active) {
			console.log('spooler was inactive, spinning up')
			spool();
		}
	};
};

// EmailSpooler is a singleton class
export default function() {
	if (undefined == spooler) {
		spooler = new EmailSpooler();
	}
	return spooler;
}
