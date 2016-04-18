import fs from 'fs';
import express from 'express';
import https from 'https';
import bodyParser from 'body-parser';
import ini from 'ini';

import postProcessor from './post';
import {init as initDB} from '../db/init';

const PRIVATE_CONFIG = ini.parse(fs.readFileSync('./config/private.ini', 'utf-8'));

// create connection pool
initDB(PRIVATE_CONFIG.database);

/*
let req = {
	body: PRIVATE_CONFIG.test_email,
	privateConfig: PRIVATE_CONFIG,
};

let res = {
	send: (s) => {
		console.log(s)
	}
};

postProcessor(req, res);
*/
var app = express();

var httpsOptions = {
  key: fs.readFileSync(PRIVATE_CONFIG.server.key_path),
  cert: fs.readFileSync(PRIVATE_CONFIG.server.cert_path)
};

https.createServer(httpsOptions, app).listen(443, function () {
  console.log('https listening on port 443!');
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/email', function(req, res) {
  postProcessor(req, res)
});

app.all('*', function(req, res) {
  console.log('https: ' + req.url);
  res.redirect('http://www.community-boating.org');
});

// redirect all unencrypted traffic to main website
var http = express();

http.all('*', function(req, res) {
  return res.redirect("http://www.community-boating.org");
});

http.listen(80, function () {
  console.log('http listening on port 80!');
});
