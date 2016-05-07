var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./api.js');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/api/v1', apiRouter);

app.get('/', function(req, res) {
  res.send('How fucking Goldsmiths?');
});

app.listen(3000);
