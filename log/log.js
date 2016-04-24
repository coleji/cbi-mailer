var fs = require('fs')
var Log = require('log');

var log;

export function init(filePath) {
	return new Promise((resolve, reject) => {
		let writeStreamOptions = {flags: 'a'}; // append to logfile rather than overwrite it everytime the thread starts
		log = new Log('info', fs.createWriteStream(filePath, writeStreamOptions));
		log.info('!!----------------------------------------------------------')
		log.info('Logger active')
		log.info('!!----------------------------------------------------------')
		resolve();
	});
}

export {log};
