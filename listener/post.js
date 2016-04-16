import md5 from 'md5';

//import mailer from './mailer.js';
import postConstants from './post-constants';
import db from './db';
import postVerify from './post-verify';

const respondFailure = function(rejectObject, req, res) {
  if (!!rejectObject.responseCode && !!rejectObject.reason) {
    res.send(rejectObject.responseCode + ": " + rejectObject.reason);
  } else {
    res.send(postConstants.RESPONSES.OTHER + ": " + rejectObject);
  }
  // TODO: write to log file
};

export default function(req, res) {
  var promise = postVerify(req).then((emailData) => {
    // ✔
    return db.writeEmailToDatabase(emailData);
  }).then(() => {
    // ✔
    // TODO: queue for sending
    res.send(postConstants.RESPONSES.OK);
  }, (rejectObject) => {
    // ✘
    respondFailure(rejectObject, req, res); // either the error from the validations, or from the db save
  });
}
