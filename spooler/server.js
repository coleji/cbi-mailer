import fs from 'fs';
import express from 'express';
import ini from 'ini';

import { init as dbInit } from '../db/init';
import getSpooler from './spooler';
import { init as mailerInit } from './mailer';
import { init as logInit } from '../log/log';

const PRIVATE_CONFIG = ini.parse(fs.readFileSync('./config/private.ini', 'utf-8'));

var spooler;

// create log stream
logInit(PRIVATE_CONFIG.log.spooler_log).then(() => {
	console.log('logger initialized, starting db')
	// create DB connections
	return dbInit(PRIVATE_CONFIG.database);
}).then(() => {
	console.log('db initialized, starting mailer')
	// create mail transporter
	return mailerInit()
}).then(() => {
	console.log('mailer initialized, creating spooler')
	// create spooler
	return getSpooler(PRIVATE_CONFIG);
}).then((spoolerObj) => {
	spooler = spoolerObj;
	console.log('spooler intialized, giving it a poke')
	// on startup, check for any messages in the db from last time
	spooler.poke();
}).then(() => {
	console.log('starting express server')
	var app = express();
	app.get('/poke', (req, res) => {
		res.status(200).send('0');
		spooler.poke();
	});

	app.listen(PRIVATE_CONFIG.spooler.port, function() {
		console.log('spooler server listening on port ' + PRIVATE_CONFIG.spooler.port);
	});
}).catch((err) => {
	console.log("error: " + err)
});
