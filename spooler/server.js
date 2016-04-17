import fs from 'fs';
import express from 'express';
import ini from 'ini';

import {init as dbInit} from '../db/init';
import getSpooler from './spooler';
import {init as mailerInit} from './mailer';

const PRIVATE_CONFIG = ini.parse(fs.readFileSync('./config/private.ini', 'utf-8'));

// create connection pool
dbInit(PRIVATE_CONFIG.database);

// init mailer
mailerInit(PRIVATE_CONFIG.DKIM);

var app = express();
var spooler = getSpooler();
// on startup, check for any messages in the db from last time
spooler.poke();

app.get('/poke', (req, res) => {
  console.log('received poke')
  spooler.poke();
  res.status(200).send('0');
});

app.listen(PRIVATE_CONFIG.spooler.port, function () {
  console.log('spooler server listening on port ' + PRIVATE_CONFIG.spooler.port);
});
