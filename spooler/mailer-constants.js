export const DB_PARAM_TO_NODEMAILER_PARAM = {
	'toAddr': 'to',
	'fromAddr': 'from',
	'subject': 'subject',
	'plainBody': 'text',
	'htmlBody': 'html',
	'ccAddr': 'cc',
	'bccAddr': 'bcc',
	'replyToAddr': 'replyTo'
};

export const DB_FIELDS_TO_IGNORE = {
	'trackingId': true,
	'checksum': true,
	'rcptTo': true
}

export const SMTP_CONFIG = {
	host: 'localhost',
	port: 25,
	useTLS: false,
	ignoreTLS: true
};

export const ERRORS = {
	'NO_WORK_TO_DO' : 'NO_WORK_TO_DO',
	'FAILURE_TO_RETRIEVE_WORK' : 'FAILURE_TO_RETRIEVE_WORK',
	'FAILURE_TO_SEND' : 'FAILURE_TO_SEND',
	'FAILURE_TO_PURGE' : 'FAILURE_TO_PURGE',
	'RESPONDING_TO_HALT' : 'RESPONDING_TO_HALT',
	'FAILURE_TO_NOTIFY_DB' : 'FAILURE_TO_NOTIFY_DB'
}
