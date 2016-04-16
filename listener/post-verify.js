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
  return new Promise((validationResolve, validationReject) => {
    const VALIDATIONS = [

      // Check that all required params were provided
      new Promise((resolve, reject) => {
        console.log('checking required params')
        var missingParams = postConstants.REQUIRED_PARAMS.filter(e => !req.body[e]);
        if (missingParams.length > 0) {
          reject("Missing required params: " + missingParams.join(", "));
        } else {
          resolve();
        }
      }),

      // Verify checksum
      new Promise((resolve, reject) => {
        console.log('checking checksum')
        if (!verifyChecksum(req.body, req.privateConfig.hash.salt)) {
          reject("Bad checksum.");
        } else {
          resolve();
        }
      }),

      // check trackingId against local db
      db.checkDoesntExist(req.body.trackingId)
    ];

    let validation = Promise.all(VALIDATIONS).then(() => {
      console.log("validations look good")
      return;
    }, (err) => {
      console.log("validations not so good")
      return err;
    }).then((err) => {
      if (err) {
        console.log("no go: " + err);
        validationReject(err);
      } else {
        // construct new data object as a filtered copy of req.body, copying only the params we care about
        let emailData = {};
        postConstants.REQUIRED_PARAMS.forEach(e => {
          emailData[e] = req.body[e];
        });
        postConstants.OPTIONAL_PARAMS.forEach(e => {
          if (req.body[e]) emailData[e] = req.body[e];
        });
        validationResolve();
      }
    });
  });
}
