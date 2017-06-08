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



