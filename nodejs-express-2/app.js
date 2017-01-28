var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


// Configure bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Configure DB
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  console.log('Connected to DB.');
});

mongoose.connect('mongodb://localhost/test');


// Models
var Book = require('./models/book');


// Configure server port
var port = process.env.PORT || 8800;

// Configure router
var router = require('./routes')(app, Book);


// Run server
var server = app.listen(port, function() {
  console.log('Express server is running on port ' + port);
});
