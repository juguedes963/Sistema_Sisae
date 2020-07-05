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
const {permissao} = require("../helpers/permissao")

/* ======= Definindo rotas via GET e POST =======*/



/* ======= GET =======*/


//Rota principal 
router.get('/', permissao, (req, res) => {
	res.render('admin/index');
});

router.get('/alunos', permissao, (req,res) => {
	sql.query("SELECT * FROM turma order by codigo", (err, results, fields) => {
		res.render('admin/addAluno',{turmas: results});
	})
})

router.get('/alunos/ver', permissao, (req,res) => {
	sql.query("SELECT * FROM alunos INNER JOIN turma ON (alunos.turma = turma.id)", (err, results, fields) => {
		res.render('admin/listaAlunos',{data: results});
	})
})

router.get('/alunos/deletar/:id', permissao, (req,res) => {
	sql.query("DELETE FROM alunos WHERE matricula=?", [req.params.id]);
	res.render('admin');
})

router.get('/turmas', permissao, (req,res) => {
	
		res.render('admin/addTurma');
	
})

router.get('/turmas/ver', permissao, (req,res) => {
	sql.query("SELECT * FROM turma order by codigo", (err, results, fields) => {
		res.render('admin/listaTurmas',{data: results});
	})
})

router.get('/users' , permissao, (req, res) => {
	sql.query("SELECT * from usuario", (err, results, fields) => {
		res.render('admin/select',{data: results});
	})
})

router.get('/users/deletar/:id', permissao, (req,res) => {
	sql.query("DELETE FROM usuario WHERE id=?", [req.params.id]);
	res.render('admin');
})

/* ======= POST =======*/

router.post('/alunos/add', urlencodeParser, (req, res) => {

	var erros = [];

	if(!req.body.nome || req.body.nome == null || typeof req.body.nome == undefined){
		erros.push({text: "Erro: Nome inválido!"})
	}

	if(!req.body.entrada || req.body.entrada == null || typeof req.body.entrada == undefined){
		erros.push({text: "Erro: Data inválida!"})
	}

	if(req.body.nome.length < 2){
		erros.push({text: "Erro: Nome muito curto!"})
	}

	if(erros.length > 0){
		res.render("admin/addAluno", {erros: erros})
	}else{
		sql.query("INSERT INTO alunos VALUES (?,?,?,?)", [req.matricula, req.body.nome, req.body.turma, req.body.entrada]);
		res.render('index');
	}
})

router.post('/turmas/add', urlencodeParser, (req, res) => {

	var erros = [];

	if(!req.body.codigo || req.body.codigo == null || typeof req.body.codigo == undefined){
		erros.push({text: "Erro: Turma inválida!"})
	}

	if(req.body.codigo.length < 4){
		erros.push({text: "Erro: Nome muito curto!"})
	}

	if(erros.length > 0){
		res.render("admin/addTurma", {erros: erros})
	}else {
		sql.query("INSERT INTO turma VALUES (?,?)", [req.id, req.body.codigo]);
		res.render('index');
	}
})

module.exports = router;