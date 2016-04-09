import mailer from './mailer.js';

const REQUIRED_PARAMS = {
  trackingId,
  toAddr,
  fromAddr,
  replyToAddr,
  subject,
  plainBody
};

const OPTIONAL_PARAMS = {
  htmlBody,
  miscHeaders,
  ccAddr,
  bccAddr
}

const respondFailure = function() {
  // TODO: write to log file
  // TODO: repond with failure code
};

export default function(req, res) {
	/*
  for (var param in REQUIRED_PARAMS) {
    if (!String(req.body.param)) {

    }
  }
*/

  // TODO: check message digest

  // TODO: check if trackingid is already in either the pending or sent tables

  // TODO: save to db

  // TODO: send

  // TODO: write tracking id to sent table, purge data from pending table

}
