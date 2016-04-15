import fs from 'fs';
/*import express from 'express';
import https from 'https';
import bodyParser from 'body-parser';
*/
import ini from 'ini';

import postProcessor from './post';
import db from '../db/init';

const PRIVATE_CONFIG = ini.parse(fs.readFileSync('./config/private.ini', 'utf-8'));

// create connection pool
db.init(PRIVATE_CONFIG.database);

let req = {
	body : PRIVATE_CONFIG.test_email,
	privateConfig : PRIVATE_CONFIG,
};

let res = {
	send: (s) => {console.log(s)}
};

postProcessor(req, res);

//var app = express();
/*
var httpsOptions = {
  key: fs.readFileSync(''),
  cert: fs.readFileSync('')
};

https.createServer(httpsOptions, app).listen(443, function () {
  console.log('https listening on port 443!');
});

app.all('*', function(req, res) {
  console.log('https: ' + req.url);
  res.send('hello encrypted!!');
});
*/

/*
// redirect all unencrypted traffic to main website
var http = express();

http.use(bodyParser.json()); // support json encoded bodies
http.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

http.post('/email', (req, res) => {
	postProcessor(req, res);
});

http.all('*', function(req, res) {
  return res.redirect("http://www.community-boating.org");
});

http.listen(80, function () {
  console.log('http listening on port 80!');
});*/

// TODO: check for messages in our db leftover from some previous session
