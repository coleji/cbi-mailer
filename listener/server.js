import fs from 'fs';
import express from 'express';
import https from 'https';
import bodyParser from 'body-parser';
import ini from 'ini';

import postProcessor from './post';
import {init as initDB} from '../db/init';
import { init as logInit } from '../log/log';

const PRIVATE_CONFIG = ini.parse(fs.readFileSync('./config/private.ini', 'utf-8'));

// create connection pool
initDB(PRIVATE_CONFIG.database);
logInit(PRIVATE_CONFIG.log.listener_log);

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

app.use((req, res, next) => {
  req.privateConfig = PRIVATE_CONFIG;
  next();
})

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
