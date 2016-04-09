import express from 'express';
import https from 'https';
import fs from 'fs';
import bodyParser from 'body-parser';
import postProcessor from './post';
import mailer from './mailer.js';

mailer();

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
