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
var favicon = require('serve-favicon');


// variaveis globais do user
var userPerfil;
var userEmail;
var userBD;

// var validacaoEmail = require('./config/validacaoEmail')(User, app, bcrypt); // LOGIN 
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cookieSession({
	name: 'session',
	secret: 'topsecret',
	maxAge: 0.1 * 60 * 60 * 1000, // 0.2 horas (12min)
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

// TODAS AS ROTAS, +6 minutos de acesso
app.all('*', function(req, res, next) {
	if (req.session.email !== undefined) {
		// aumenta a vida do cookie em mais 6 minutos
		req.session.nowInMinutes = Date.now();
	}
	next();
});

// CLIENTE, USUARIO, EMPRESA PAGE
app.get('/', function(req, res, next) {
	if (req.session.login) {
		res.redirect('/' + req.session.perfil);
		return;
	}
	next();
}); 

// USER PAGE
// valida se o user estiver logado pode acessar a pagina
// app.get(['/usuario'], function(req, res, next) {
// 	if (req.session.username === undefined) {
// 		res.redirect('/usuario');
// 		return;
// 	}
// 	next();
// });


// ***************************************
// PAGINAS
// ***************************************

// ---------------------------------------
// ROOT PAGE
app.get('/', function(req, res) {
	res.render('login', {cookie: req.session, login: 'active' } );
});
// ---------------------------------------
// CADASTRO PAGE
// app.get('/cadastro', function(req, res, next) {
// 	res.render('cadastro', { pagina: "cadastro", cadastro: "active" });
// });
// ---------------------------------------
// LOGOUT PAGE
app.get('/logout', function(req, res, next) {
	req.session = null; // apaga o cookie
	res.redirect('http://gemn.com.br');
});


// ---------------------------------------
// ACESSO PAGE *TESTE
app.get('/acesso', function(req, res, next) {
	bcrypt.genSalt(8, function(err, salt) {
	  bcrypt.hash("teste", salt, function(err, hash) {
			res.render('acesso', {cookie: req.session, senha: hash} );
	  });
	});
});


// ---------------------------------------
// CLIENTE PAGE
// so entra na rota se o user estiver como perfil de cliente
app.get('/cliente', function(req, res, next) {
	if (req.session.perfil === 'cliente') {
		let cnCliente = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'fatr102030',
			database : 'nautica3'
		});
		cnCliente.connect();
		cnCliente.query('select * from clientefornecedor where Email="ronaldo.ramires@gmail.com"', function(error, results, fields) {
			console.log(results);
			res.render('cliente', { cookie: req.session, cliente: 'active', dadosCliente: results } );
		});
		cnCliente.end(); // fecha a conn
	} else {
		res.redirect('/');
	}
});


// ---------------------------------------
// USUARIO PAGE
// so entra na rota se o user estiver como perfil de usuario
app.get('/usuario', function(req, res, next) {
	if (req.session.perfil === 'usuario') {
		let cnUsuario = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'fatr102030',
			database : 'nautica3'
		});
		cnUsuario.connect();
		cnUsuario.query('select * from usuarios', function(error, results, fields) {
			console.log(results[0]);
			res.render('usuario', { cookie: req.session, usuario: 'active', dadosUsuario: results[0] } );
		});
		cnUsuario.end(); // fecha a conn
	} else {
		res.redirect('/');
	}
});


// ---------------------------------------
// EMPRESA PAGE
// so entra na rota se o user estiver como perfil de empresa
app.get('/empresa', function(req, res, next) {
	if (req.session.perfil === 'empresa') {
		let cnEmpresa = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'fatr102030',
			database : 'nautica2'
		});
		cnEmpresa.connect();
		cnEmpresa.query('select * from empresa', function(error, results, fields) {
			res.render('empresa', { cookie: req.session, empresa: 'active', dadosEmpresa: results[0] } );
			console.log(results);
		});
		cnEmpresa.end(); // fecha a conn
	} else {
		res.redirect('/');
	}
});

// ---------------------------------------
// verifica se o user possui acesso
app.post('/consulta', function(req, res) {

	connection.query('select SenhaLogin, Email, Perfil, BD from usuarios where Email="' + req.body.email + '"', function(error, results, fields) {
		if (error) throw error;
		// se não houver user
		if (typeof results[0] === "undefined") {
			res.status(404).send('Senha incorreta');
		
		// se o user estiver cadastrado
		} else {
			bcrypt.compare(req.body.password, results[0].SenhaLogin, function(err, resposta) {
				if (error) throw error;
				// cria a cookie session e redireciona para a rota correta
				if (resposta) {
					criarUser(req, req.body.email, results[0].Perfil, function() {
						userPerfil = results[0].Perfil;
						userEmail = results[0].Email;
						userBD = results[0].BD;
						res.json({url: results[0].Perfil}).status(200);
					});
				} else {
					res.status(401).send('Senha incorreta');
				}
			});
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
	console.log("Ouvindo na porta: " + 3443);
});


// ---------------------------------------
// cria a session
function criarUser(req, email, perfil, callback) {
	req.session.login = 'true'; 
	req.session.email = email;
	req.session.perfil = perfil.toLowerCase();
	// req.session.perfil = ;
	return callback();
}

