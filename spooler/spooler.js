import db from '../db/init';
// import mailer from './mailer';

var spooler;

function EmailSpooler() {
  console.log('constructing spooler');

  // true when doing stuff, false when waiting.  NOOP any poke that happens when active
  var active = false;

  this.REJECTION_REASONS = {
    NO_DATA : '0',
    DB_FAILURE : '1'
  }

  // Check db for any messages to send.
  // Return resovled promise with message data, rejected promise if no work to do (or db failure).
  this.getMessageToSend = function() {
    console.log('running getMessageToSend()')
    return new Promise((resolve, reject) => {
      console.log('inside promise')
      db.queryDB('SELECT * FROM emails_pending limit 1')
      .then((resultObject) => {
        // ✔ query executed successfully
        if (resultObject.results.length == 1) {
          console.log('found a row to process')
          console.log(resultObject.results[0])
          resolve(resultObject);
        } else {
          console.log('no data')
          reject(this.REJECTION_REASONS.NO_DATA);
        }
      }, () => {
        // ✘  DB failure
        console.log('db failure')
        reject(this.REJECTION_REASONS.DB_FAILURE);
      });
    });
  };

  const sendMessage = function(rowData) {

  }
};

// EmailSpooler is a singleton class
export default function() {
  if (undefined == spooler) {
    spooler = new EmailSpooler();
  }
  return spooler;
}
