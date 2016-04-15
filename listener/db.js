import db from '../db/init';

const checkDoesntExist = function(trackingId) {
  // TODO: figure out how to do this correctly
  const checks = [
    () => {
      db.queryDB('SELECT 1 FROM emails_pending WHERE trackingId = ? ', trackingId, (err, results, fields) => {
        if (err) console.log(err);
        return (results.length > 1);
      });
    }
  ];
  var p = Promise.all(checks.map(e => new Promise((resolve, reject) => {
    if (e()) resolve();
    else reject();
  })));
  return p;
};

const writeEmailToDatabase = function(emailData, constants) {
  console.log('here we go');
  return new Promise((resolve, reject) => {
    db.queryDB('INSERT INTO emails_pending SET ?', emailData, (err, result) => {
      console.log('db callback')
      if (err){
        console.log(err);
        reject();
      } else {
        resolve();
      }
    });
    console.log('made it');
  });
}

export default {
  checkDoesntExist,
  writeEmailToDatabase
};
