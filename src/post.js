import md5 from 'md5';

//import mailer from './mailer.js';
import postConstants from './post-constants';
import db from './db';

const respondFailure = function(err, req, res) {
  console.log("bad post!  " + err);
  res.send('fail!!');
  // TODO: write to log file
  // TODO: repond with failure code
};

const verifyChecksum = function(body) {
  let salt = '';
  let paramStrings = [];
  postConstants.REQUIRED_PARAMS.forEach(e => {
    if (e != 'checksum') paramStrings.push(e + '=' + body[e]);
  });
  let checkMe = paramStrings.join('&');
  console.log('checkMe: ' + checkMe);
  let checksum = md5(salt + checkMe + salt).toUpperCase();
  console.log('computed: ' + checksum);
  return (checksum == body.checksum);
};

export default function(req, res) {
  // Check that all required params were provided
  var missingParams = postConstants.REQUIRED_PARAMS.filter(e => !req.body[e]);
  if (missingParams.length > 0) {
    return respondFailure("Missing required params: " + missingParams.join(", "), req, res);
  }

  // Verify checksum
  console.log('received checksum: ' + req.body.checksum);
  if (!verifyChecksum(req.body)) {
    return respondFailure("Bad checksum.", req, res);
  }

  // construct new data object as a filtered copy of req.body, copying only the params we care about
  let emailData = {};
  postConstants.REQUIRED_PARAMS.forEach(e => {
    emailData[e] = req.body[e];
  });
  postConstants.OPTIONAL_PARAMS.forEach(e => {
    if (req.body[e]) emailData[e] = req.body[e];
  }); // at this point, for security reasons don't ever use req.body directly again

  // Save to DB
  db.writeEmailToDatabase(emailData, postConstants)


  // TODO: check if trackingid is already in either the pending or sent tables

  // TODO: save to db

  // TODO: send

  // TODO: write tracking id to sent table, purge data from pending table
  res.send('success!!');
}
