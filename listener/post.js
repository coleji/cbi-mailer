import md5 from 'md5';

//import mailer from './mailer.js';
import postConstants from './post-constants';
import db from './db';
import postVerify from './post-verify';

const RESPONSES = {
  OK : '0',
  GARBLED : '1',
  DUPLICATE : '2',
  DB_FAILURE : '3',
  SEND_FAIL : '4'
};

const respondFailure = function(err, req, res) {
  console.log('fail')
  res.send('fail!!');
  // TODO: write to log file
  // TODO: repond with failure code
};

export default function(req, res) {
  var promise = postVerify(req).then(() => {
    // resolve validations
    console.log("!validation passed");
    // After this line the promise immediate rejects. wtf
    var p = db.writeEmailToDatabase(emailData, postConstants);
    console.log(p instanceof Promise);
    return p;
  }).then(() => {
    console.log("db save resolved");
    // resolve write to db
    // TODO: queue for sending
  }, () => {
    console.log('db savee rejected');
    // reject write to db
    respondFailure("err", req, res); // either the error from the validations, or from the db save
  });



  // TODO: send

  // TODO: write tracking id to sent table, purge data from pending table
}
