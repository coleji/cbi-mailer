import Express from 'express';

const app = new Express();

app.post('/email', function (req, res) {
  console.log("got a post request!")
  res.send('hello from yawl!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
