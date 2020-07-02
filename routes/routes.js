//Definindo os módulos essenciais para trabalhar com rotas
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const urlencodeParser = bodyParser.urlencoded({extended:false});
const sql = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	port: '3306',
});
sql.query('use sisae');

/* ======= Definindo rotas via GET e POST =======*/



/* ======= GET =======*/

//Rota principal 
router.get('/', (req, res) => {
	res.render('index');
});

router.get('/create', (req, res) => {
	res.render('create');
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.get('/select', (req,res) => {
	sql.query("SELECT * FROM alunos INNER JOIN turma ON (alunos.turma = turma.id)", (err, results, fields) => {
		res.render('select', {data: results});
	});
})



/* ======= POST =======*/
router.post('/users/add', urlencodeParser, (req, res) => {

	var erros = [];


	if(!req.body.email || req.body.email == null || typeof req.body.email == undefined){
		erros.push({text: "Erro: E-mail inválido!"})
	}

	if(!req.body.user || req.body.user == null || typeof req.body.user == undefined){
		erros.push({text: "Erro: Nome de usuário inválido!"})
	}

	if(!req.body.senha || req.body.senha == null || typeof req.body.senha == undefined){
		erros.push({text: "Erro: Senha inválida!"})
	}

	if(req.body.senha.length < 5){
		erros.push({text: "Senha fraca!"});
	}

	if(erros.length > 0){
		res.render("index", {erros: erros});
	}else{
		sql.query("INSERT INTO usuario VALUES (?,?,?,?,?)", [req.id, req.body.email, req.body.user, req.body.senha, false]);
		res.render('index')
	}
})














module.exports = router;