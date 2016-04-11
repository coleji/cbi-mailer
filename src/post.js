import md5 from 'md5';

//import mailer from './mailer.js';
import postConstants from './post-constants';
import db from './db';
import postVerify from './post-verify';

const respondFailure = function(err, req, res) {
  console.log("bad post!  " + err);
  res.send('fail!!');
  // TODO: write to log file
  // TODO: repond with failure code
};

export default function(req, res) {
  var promise = postVerify(req).then(() => {
    console.log("validation passed")
  }, (error) => {
    console.log("failed validation")
  });


  // Save to DB
//  db.writeEmailToDatabase(emailData, postConstants)

  // TODO: save to db

  // TODO: send

  // TODO: write tracking id to sent table, purge data from pending table
}
