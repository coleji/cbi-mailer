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

export default {
  REQUIRED_PARAMS,
  OPTIONAL_PARAMS,
  DB_PARAM_TO_NODEMAILER_PARAM
}
