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
	res.render('admin/index');
});

router.get('/alunos', (req,res) => {
	sql.query("SELECT * FROM turma", (err, results, fields) => {
		res.render('admin/addAluno',{turmas: results});
	})
})

router.get('/alunos/ver', (req,res) => {
	sql.query("SELECT * FROM alunos INNER JOIN turma ON (alunos.turma = turma.id)", (err, results, fields) => {
		res.render('admin/listaAlunos',{data: results});
	})
})

router.get('/alunos/deletar/:id', (req,res) => {
	sql.query("DELETE FROM alunos WHERE matricula=?", [req.params.id]);
	res.render('admin');
})

router.get('/turmas', (req,res) => {
	sql.query("SELECT * FROM turma", (err, results, fields) => {
		res.render('admin/addTurma',{turmas: results});
	})
})

router.get('/users' , (req, res) => {
	sql.query("SELECT * from usuario", (err, results, fields) => {
		res.render('admin/select',{data: results});
	})
})

router.get('/users/deletar/:id', (req,res) => {
	sql.query("DELETE FROM usuario WHERE id=?", [req.params.id]);
	res.render('admin');
})

/* ======= POST =======*/

router.post('/alunos/add', urlencodeParser, (req, res) => {

	var erros = [];

	if(!req.body.nome || req.body.nome == null || typeof req.body.nome == undefined){
		erros.push({text: "Nome inválido!"})
	}

	if(req.body.nome.length < 2){
		erros.push({text: "Nome muito curto!"})
	}

	if(erros.length > 0){
		res.render("admin/addAluno", {erros: erros})
	}else{
		sql.query("INSERT INTO alunos VALUES (?,?,?)", [req.matricula, req.body.nome, req.body.turma]);
		res.render('index');
	}
})

router.post('/turmas/add', urlencodeParser, (req, res) => {

	var erros = [];

	if(!req.body.codigo || req.body.codigo == null || typeof req.body.codigo == undefined){
		erros.push({text: "Turma inválida!"})
	}

	if(req.body.codigo.length < 4){
		erros.push({text: "Nome muito curto!"})
	}

	if(erros.length > 0){
		res.render("admin/addTurma", {erros: erros})
	}else {
		sql.query("INSERT INTO turma VALUES (?,?)", [req.id, req.body.codigo]);
		res.render('index');
	}
})

module.exports = router;