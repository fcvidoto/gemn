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
	res.sendFile(__dirname + '/public/login.html');
});


// ---------------------------------------
// 404
app.get('*', function(req, res, next) {
	res.redirect('/');
});



// ***********************************
//LISTENING
app.listen(3000, function() {
	console.log("Ouvindo na porta: " + ( 3000));
});


http.createServer(function (req, res) {
	// res.writeHead(192, {'Content-Type': 'text/plain'});
	// res.end('Hello World\n');
	res.sendFile(__dirname + '/public/login.html');
}).listen(3000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');


