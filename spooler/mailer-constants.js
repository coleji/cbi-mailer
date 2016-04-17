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

const DB_FIELDS_TO_IGNORE = {
	'trackingId' : true,
	'checksum' : true,
	'rcptTo' : true
}

const SMTP_CONFIG = {
	host: 'localhost',
	port: 25,
	useTLS: false,
	ignoreTLS: true
};


export default {
  DB_PARAM_TO_NODEMAILER_PARAM,
  DB_FIELDS_TO_IGNORE,
  SMTP_CONFIG
}
