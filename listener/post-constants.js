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

const RESPONSES = {
  OK : '0',
  GARBLED : '1',
  DUPLICATE : '2',
  DB_FAILURE : '3',
  SEND_FAIL : '4',
  OTHER : '5'
};


export default {
  REQUIRED_PARAMS,
  OPTIONAL_PARAMS,
  DB_PARAM_TO_NODEMAILER_PARAM,
  RESPONSES
}
