import md5 from 'md5';

//import mailer from './mailer.js';
import postConstants from './post-constants';
import db from './db';

const verifyChecksum = function(body, salt) {
  let paramStrings = [];
  postConstants.REQUIRED_PARAMS.forEach(e => {
    if (e != 'checksum') paramStrings.push(e + '=' + body[e]);
  });
  let checkMe = paramStrings.join('&');
  let checksum = md5(salt + checkMe + salt).toUpperCase();
  return (checksum == body.checksum);
};

export default function(req) {
  // Check that all required params were provided
  var missingParams = postConstants.REQUIRED_PARAMS.filter(e => !req.body[e]);
  if (missingParams.length > 0) {
    return {'err': "Missing required params: " + missingParams.join(", "), 'emailData': null};
  }

  // Verify checksum
  if (!verifyChecksum(req.body, req.privateConfig.hash.salt)) {
    return {'err': "Bad checksum.", 'emailData': null };
  }


  // Check if trackingId exists anywhere in the local db
  let existCheckError;
  db.checkDoesntExist(req.body.trackingId).then(() => {
    // we're good
  }, (existCheckError) => {
    existCheckError = {'err': "Duplicate", 'emailData': null }
  })
  // FIXME: this doesn't work.  The async function has not finished and assigned an obj to this variable by the time this check is made
  if (existCheckError) return existCheckError;


  // construct new data object as a filtered copy of req.body, copying only the params we care about
  let emailData = {};
  postConstants.REQUIRED_PARAMS.forEach(e => {
    emailData[e] = req.body[e];
  });
  postConstants.OPTIONAL_PARAMS.forEach(e => {
    if (req.body[e]) emailData[e] = req.body[e];
  });

  return {'err': null, 'emailData': emailData}
}
