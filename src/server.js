import Express from 'express';
import bodyParser from 'body-parser';
//import postProcessor from './post';
import mailer from './mailer.js';

mailer();


const app = new Express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
/*
app.post('/email', function (req, res) {
  postProcessor(req, res);
});
*/
app.listen(80, function () {
  console.log('Example app listening on port 80!');
});

// TODO: check for messages in our db leftover from some previous session
