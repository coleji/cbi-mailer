import db from '../db/init';

const checkDoesntExist = function(trackingId) {
  // TODO: figure out how to do this correctly
  const checks = [
    new Promise((resolve, reject) => {
      console.log('about to check id uniqueness')
      db.queryDB('SELECT 1 FROM emails_pending WHERE trackingId = ? ', trackingId)
      .then((resultObject) => {
        if (resultObject.results.length == 0) {
          console.log("tracking id is good")
          resolve();
        } else {
          console.log("tracking id is dupe")
          reject();
        }
      });
    })
  ];
  return Promise.all(checks);
};

const writeEmailToDatabase = function(emailData, constants) {
  console.log('here we go');
  return db.queryDB('INSERT INTO emails_pending SET ?', emailData);
}

export default {
  checkDoesntExist,
  writeEmailToDatabase
};
