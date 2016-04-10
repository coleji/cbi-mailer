import db from './db-controller';

const writeEmailToDatabase = function(emailData, constants) {
  console.log('made it');
/*  db.queryDB('INSERT INTO emails_pending SET ?', emailData, (err, result) => {
    if (err) console.log(err);
  });*/
}

export default {
  writeEmailToDatabase
};
