import Express from 'express';
import bodyParser from 'body-parser';

const app = new Express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/email', function (req, res) {
  console.log("got a post request!")
  console.log("testParam is " + req.body.testParam);
  res.send('hello from yawl!  You send me ' + req.body.testParam);
});

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});
