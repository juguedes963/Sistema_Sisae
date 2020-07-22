//Definindo os módulos essenciais para trabalhar com rotas
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const urlencodeParser = bodyParser.urlencoded({extended:true});
const sql = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	port: '3306',
});
sql.query('use sisae');
const passport = require("passport");

/* ======= Definindo rotas via GET e POST =======*/



/* ======= GET =======*/

//Rota principal 
router.get('/', (req, res) => {
	res.render('index');
});

router.get('/create', (req, res) => {
	res.render('general/create');
});


router.get('/login', (req, res) => {
	res.render('general/login');
});

router.get('/alunos', (req,res) => {
	sql.query("SELECT * FROM alunos INNER JOIN turma ON (alunos.turma = turma.id) order by nome", (err, results, fields) => {
		res.render('general/alunos', {data: results});
	});
})

router.get('/alunos/ver/:id', (req,res) => {
	sql.query("SELECT * FROM alunos INNER JOIN turma ON (alunos.turma = turma.id) WHERE matricula=?", [req.params.id], (err, results, fields) => {
		res.render('general/verAluno',{data: results});
	})
})

router.get('/logout', (req,res) => {
	req.logout();
	res.redirect('/')
})



/* ======= POST =======*/
router.post('/users/add', urlencodeParser, (req, res) => {

	var erros = [];
	var success = [];


	if(!req.body.email || req.body.email == null || typeof req.body.email == undefined){
		erros.push({text: "Erro: E-mail inválido!"})
	}

	if(!req.body.username || req.body.username == null || typeof req.body.username == undefined){
		erros.push({text: "Erro: Nome de usuário inválido!"})
	}

	if(!req.body.senha || req.body.senha == null || typeof req.body.senha == undefined){
		erros.push({text: "Erro: Senha inválida!"})
	}

	if(req.body.senha.length < 5){
		erros.push({text: "Senha fraca!"});
	}

	if(req.body.senha != req.body.confSenha){
		erros.push({text: "Erro: Senhas não coincidem!"});
	}

	if(erros.length > 0){
		res.render("index", {erros: erros});
	}else{
		success.push({text: "Usuário(a) cadastrado com êxito!"})
		sql.query("INSERT INTO usuario VALUES (?,?,?,?,?)", [req.id, req.body.email, req.body.username, req.body.senha, false]);
		res.render('index', {success: success})
	}
})

router.post('/login', (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "login",
		failureFlash: true
	})(req, res, next)
})


router.post('/alunos/buscar', urlencodeParser, (req,res) => {
	sql.query("SELECT * from alunos WHERE nome LIKE '%" + req.body.search + "%' order by nome ", (err, results, fields) => {
		res.render('general/busca', {data: results})
	})
})


module.exports = router;