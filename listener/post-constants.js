const REQUIRED_PARAMS = [
	'trackingId',
	'rcptTo',
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

const RESPONSES = {
	OK: '0',
	GARBLED: '1',
	DUPLICATE: '2',
	DB_FAILURE: '3',
	SEND_FAIL: '4',
	OTHER: '5'
};


export default {
	REQUIRED_PARAMS,
	OPTIONAL_PARAMS,
	RESPONSES
}
