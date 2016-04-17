import fs from 'fs';
import express from 'express';
import ini from 'ini';

import db from '../db/init';
import getSpooler from './spooler';
import mailer from './mailer';

const PRIVATE_CONFIG = ini.parse(fs.readFileSync('./config/private.ini', 'utf-8'));

// create connection pool
db.init(PRIVATE_CONFIG.database);

console.log('start mailer init');
// init mailer
mailer.init(PRIVATE_CONFIG.DKIM);

var app = express();

var spooler = getSpooler();

app.get('/poke', (req, res) => {
  spooler.getMessageToSend().then((rowData) => {
    console.log('got db row, attempting to mail')
    return mailer.sendMail(rowData, PRIVATE_CONFIG.server.domain);
  }).then(() => {
    console.log('sending success message')
    res.status(200).send('Success');
  }, (err) => {
    console.log('something fucked: ' + err)
  });
});

app.listen(PRIVATE_CONFIG.spooler.port, function () {
  console.log('spooler server listening on port ' + PRIVATE_CONFIG.spooler.port);
});

// TODO: check for messages in our db leftover from some previous session
