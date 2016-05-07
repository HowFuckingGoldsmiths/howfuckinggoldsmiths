var express = require('express');
var apiRouter = require('./api.js');

var app = express();

app.use('/v1', apiRouter);

app.listen(80);
