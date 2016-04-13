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
  var promise = postVerify(req).then(() => {  // resolve vlaidations
    console.log("validation passed");
    db.writeEmailToDatabase(emailData, postConstants)
  }, (error) => { // reject validations
    respondFailure(err, req, res);
  }).then(() => { // resolve write to db
    res.send(0);
    // TODO: queue for sending
  }, () => { // reject write to db
    respondFailure(err, req, res);
  });



  // TODO: send

  // TODO: write tracking id to sent table, purge data from pending table
}
