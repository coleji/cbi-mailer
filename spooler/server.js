import fs from 'fs';
import express from 'express';
import ini from 'ini';

import { init as dbInit } from '../db/init';
import getSpooler from './spooler';
import { init as mailerInit } from './mailer';

const PRIVATE_CONFIG = ini.parse(fs.readFileSync('./config/private.ini', 'utf-8'));

var spooler;

// create connection pool
dbInit(PRIVATE_CONFIG.database);

// init mailer
mailerInit(PRIVATE_CONFIG.DKIM).then(() => {
	spooler = getSpooler(PRIVATE_CONFIG.server.domain);
	// on startup, check for any messages in the db from last time
	spooler.poke();
}, (err) => {
	console.log('mailer failed to init: ' + err)
}).then(() => {
	var app = express();
	app.get('/poke', (req, res) => {
		console.log('received poke')
		res.status(200).send('0');
		spooler.poke();
	});

	app.listen(PRIVATE_CONFIG.spooler.port, function() {
		console.log('spooler server listening on port ' + PRIVATE_CONFIG.spooler.port);
	});
});
