import db from '../db/init';

const checkDoesntExist = function(trackingId) {
  const checks = [
    // For now there's only one table to check.  Will be adding more
    new Promise((resolve, reject) => {
      db.queryDB('SELECT 1 FROM emails_pending WHERE trackingId = ? ', trackingId)
      .then((resultObject) => {
        if (resultObject.results.length == 0) {
          resolve();
        } else {
          reject();
        }
      });
    })
  ];
  return Promise.all(checks);
};

const writeEmailToDatabase = function(emailData) {
  return db.queryDB('INSERT INTO emails_pending SET ?', emailData);
}

export default {
  checkDoesntExist,
  writeEmailToDatabase
};
