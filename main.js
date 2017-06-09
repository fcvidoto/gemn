'use strict'; // jshint node:true

// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');
var bcrypt = require('bcryptjs');

// var validacaoEmail = require('./config/validacaoEmail')(User, app, bcrypt); // LOGIN 


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

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// var httpsServer = https.createServer(credentials, app);
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'fatr102030',
	database : 'acesso'
});
connection.connect();
	

// ***************************************
// VALIDAÇÕES DE ACESSO
// ***************************************
app.get(['/acesso', '/cadastro'], function(req, res, next) {
	if (req.session.username !== undefined) {
		res.redirect('/');
		return;
	}
	next();
}); 

// USER PAGE
// valida se o user estiver logado pode acessar a pagina
app.get(['/usuario'], function(req, res, next) {
	if (req.session.username === undefined) {
		res.redirect('/usuario');
		return;
	}
	next();
});


// ***************************************
// PAGINAS
// ***************************************

// ---------------------------------------
// ROOT PAGE
app.get('/', function(req, res) {
	res.render('login', { pagina: "login", login: "active" });
});


// ---------------------------------------
// ACESSO PAGE
app.get('/acesso', function(req, res, next) {

	
	
	bcrypt.genSalt(8, function(err, salt) {
	  bcrypt.hash("teste", salt, function(err, hash) {
			res.render('acesso', {cookie: req.session, senha: hash} );
	  });
	});

	// o user precisa estar logado	
	// if (req.session.login) {
	// 	res.render('acesso', {cookie: req.session});
	// } else {
	// 	res.redirect('/');	
	// }
});

// ---------------------------------------
// CADASTRO PAGE
app.get('/cadastro', function(req, res, next) {
	res.render('cadastro', { pagina: "cadastro", cadastro: "active" });
});

// ---------------------------------------
// verifica se o user possui acesso
app.post('/consulta', function(req, res) {

	// console.log(typeof results[0] !== "undefined");
	// console.log('resultado:', results);
	// console.log(JSON.stringify(results[0]));
	connection.query('select SenhaLogin from usuarios where Email="' + req.body.email + '"', function(error, results, fields) {
		if (error) throw error;

		// se não houver user
		if (typeof results[0] === "undefined") {
			res.send('Nao Cadastrado!').status(404);
			console.log('nao cadastrado', results);
		
		// se o user estiver cadastrado
		} else {
			// criarUser(req, req.username, req.email, function() {
			// 	res.render('acesso', {cookie: req.session});
			// });
			// 
			res.send('Cadastrado!').status(200);
		}
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


// ---------------------------------------
// cria a session
function criarUser(req, username, email, callback) {
	req.session.login = 'true'; 
	req.session.username = username;
	req.session.email = email;
	return callback();
}

