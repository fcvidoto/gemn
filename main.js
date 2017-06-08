'use strict'; // jshint node:true

var http = require('http');
var https = require('https');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


// ---------------------------------------
//ROOT PAGE
app.get('/', function(req, res) {
	// res.sendFile(__dirname + '/public/login.html');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');	
});


// ---------------------------------------
// 404
app.get('*', function(req, res, next) {
	res.redirect('/');
});



// ***********************************
//LISTENING
app.listen(process.env.PORT || 3000, function() {
	console.log("Ouvindo na porta: " + (process.env.PORT || 3000));
});


