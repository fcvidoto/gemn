'use strict'; // jshint node:true


var fs = require('fs');
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};

var http = require('http');
var https = require('https');

var express = require('express');
var app = express();

var mysql = require('mysql');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// var httpsServer = https.createServer(credentials, app);

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'fatr102030',
  database : 'acesso'
});


// ---------------------------------------
// ROOT PAGE
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});


// ---------------------------------------
// CONSULTA PAGE
// verifica se o user possui acesso
app.post('/consulta', function(req, res) {
	connection.connect();
	connection.query('select * from usuarios where Email="' + req.email + '"', function(error, results, fields) {
		if (error) throw error;
 		console.log('resultado:', results);
		res.send(results);
		// res.send('Sucesso').status(200);
	});
	connection.end();
});


// ---------------------------------------
// 404
app.get('*', function(req, res, next) {
	res.redirect('/');
});



// ***********************************
//LISTENING
app.listen(3443, function() {
	console.log("Ouvindo na porta: " + (3443));
});



