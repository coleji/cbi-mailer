import mailer from './mailer.js';
import md5 from 'md5';

const REQUIRED_PARAMS = [
  'trackingId',
  'toAddr',
  'fromAddr',
  'replyToAddr',
  'subject',
  'plainBody',
  'checksum'
];

const OPTIONAL_PARAMS = [
  'htmlBody',
  'miscHeaders',
  'ccAddr',
  'bccAddr'
]

const DB_PARAM_TO_NODEMAILER_PARAM = {
  'toAddr': 'to',
  'fromAddr': 'from',
  'subject': 'subject',
  'plainBody': 'text',
  'htmlBody': 'html',
  'ccAddr': 'cc',
  'bccAddr': 'bcc',
  'replyToAddr': 'replyTo'
};

const respondFailure = function(err, req, res) {
  console.log("bad post!  " + err);
  res.send('fail!!');
  // TODO: write to log file
  // TODO: repond with failure code
};

const verifyChecksum = function(body) {
  let salt = '';
  let paramStrings = [];
  REQUIRED_PARAMS.forEach(e => {
    if (e != 'checksum') paramStrings.push(e + '=' + body[e]);
  });
  let checkMe = paramStrings.join('&');
  console.log('checkMe: ' + checkMe);
  let checksum = md5(salt + checkMe + salt).toUpperCase();
  console.log('computed: ' + checksum);
  return (checksum == body.checksum);
};

export default function(req, res) {
  var missingParams = REQUIRED_PARAMS.filter(e => !req.body[e]);

  if (missingParams.length > 0) {
    return respondFailure("Missing required params: " + missingParams.join(", "), req, res);
  }

  console.log('received checksum: ' + req.body.checksum);
  if (!verifyChecksum(req.body)) {
    return respondFailure("Bad checksum.", req, res);
  }

  var mailData = {};
/*
  REQUIRED_PARAMS.forEach(e => {

  });*/

  // TODO: check if trackingid is already in either the pending or sent tables

  // TODO: save to db

  // TODO: send

  // TODO: write tracking id to sent table, purge data from pending table
  res.send('success!!');
}
