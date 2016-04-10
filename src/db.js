import db from './db-controller';

const checkDoesntExist = function(trackingId) {
  // TODO: figure out how to do this correctly
  const checks = [
    () => {
      db.queryDB('SELECT 1 FROM emails_pending WHERE trackingId = ? ', trackingId, (error, results, fields) => {
        if (err) console.log(err);
        return (results.length > 1);
      });
    }
  ];
  var p = Promise.all(checks.map(e => new Promise((resolve, reject) => {
    if (e()) resolve();
    else reject();
  })));
  console.log(p)
};

const writeEmailToDatabase = function(emailData, constants) {
  db.queryDB('INSERT INTO emails_pending SET ?', emailData, (err, result) => {
    if (err) console.log(err);
  });
  console.log('made it');
}

export default {
  checkDoesntExist,
  writeEmailToDatabase
};
