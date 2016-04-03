import Express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
//import postProcessor from './post';
import mailer from './mailer.js';


var httpsOptions = {
  key: fs.readFileSync(''),
  cert: fs.readFileSync('')
};

var https = express.createServer(httpsOptions);

var http = express.createServer();


http.all('*', function(req, res) {
  console.log("HTTP: " + req.url);
  return res.redirect("https://" + req.headers["host"] + req.url);
});

http.error(function(error, req, res, next) {
  return console.log("HTTP error " + error + ", " + req.url);
});

https.error(function(error, req, res, next) {
  return console.log("HTTPS error " + error + ", " + req.url);
});

https.all('*', function(req, res) {
  console.log("HTTPS: " + req.url);
  return res.send("Hello, World!");
});

http.listen(80, function () {
  console.log('http listening on port 80!');
});

https.listen(443, function () {
  console.log('https listening on port 443!');
});


/////////////////////////////////////////////////////////

/*



app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
*/
/*
app.post('/email', function (req, res) {
  postProcessor(req, res);
});
*/
// TODO: check for messages in our db leftover from some previous session
