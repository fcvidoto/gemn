'use strict'; // jshint node:true


var fs = require('fs');
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};

var http = require('http');
var https = require('https');

var express = require('express');
var app = express();

var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');

var mysql = require('mysql');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cookieSession({
	name: 'session',
	secret: 'topsecret',
	maxAge: 0.2 * 60 * 60 * 1000, // 0.2 horas (12min)
	cookie: {
		secure: true,
		path: '/login'
	}
}));

// var httpsServer = https.createServer(credentials, app);
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'fatr102030',
  database : 'acesso'
});
connection.connect();
	

// ---------------------------------------
// ROOT PAGE
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});


// ---------------------------------------
// CONSULTA PAGE
// verifica se o user possui acesso
app.post('/consulta', function(req, res) {

	connection.query('select SenhaLogin from usuarios where Email="' + req.body.email + '"', function(error, results, fields) {
	  console.log(JSON.stringify(results[0].SenhaLogin));
	  if (error) throw error;
	  // console.log(typeof results[0] !== "undefined");
	  // verifica se achar o user
	  if (typeof results[0] === "undefined") {
	          res.send('Nao Cadastrado!').status(404);
	          console.log('nao cadastrado', results);
	  } else {
	          res.send('Cadastrado!').status(200);
	  }
		// console.log('resultado:', results);
	});

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



