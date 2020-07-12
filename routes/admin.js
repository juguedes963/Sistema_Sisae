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

var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    var ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1)
    cb(null, file.fieldname + '-' + Date.now() + '.' + ext)
  }
})

var upload = multer({ storage: storage })

/* ======= Definindo rotas via GET e POST =======*/



/* ======= GET =======*/


//Rota principal 
router.get('/', permissao, (req, res) => {
	res.render('admin/index');
});

router.get('/alunos', permissao, (req,res) => {
	sql.query("SELECT * FROM turma order by codigo", (err, results, fields) => {
		res.render('admin/alunos/addAluno',{turmas: results});
	})
})

router.get('/alunos/ver', permissao, (req,res) => {
	sql.query("SELECT * FROM alunos INNER JOIN turma ON (alunos.turma = turma.id) order by nome", (err, results, fields) => {
		res.render('admin/alunos/listaAlunos',{data: results});
	})
})


router.get('/alunos/deletar/:id', permissao, (req,res) => {
	sql.query("DELETE FROM alunos WHERE matricula=?", [req.params.id]);
	res.render('admin');
})

router.get('/alunos/editar/:id', permissao ,(req,res) => {
	sql.query("SELECT * FROM alunos INNER JOIN turma WHERE matricula = ? order by codigo", [req.params.id],  (err, results, fields) => {
		res.render('admin/alunos/editAluno',{matricula: req.params.id, turmas: results, nome: results[0].nome, codigo: results[0].codigo, entrada: results[0].entrada});
	})	
	
})

router.get('/aluno/ver/:id', permissao, (req,res) => {
	sql.query("SELECT * FROM alunos INNER JOIN turma ON (alunos.turma = turma.id) WHERE matricula=?", [req.params.id], (err, results, fields) => {
		res.render('admin/alunos/verAluno',{data: results});
	})
})

router.get('/turmas', permissao, (req,res) => {
	
		res.render('admin/turmas/addTurma');
	
})

router.get('/turmas/ver', permissao, (req,res) => {
	sql.query("SELECT * FROM turma order by codigo", (err, results, fields) => {
		res.render('admin/turmas/listaTurmas',{data: results});
	})
})

router.get('/turma/ver/:id', permissao, (req,res) => {
	sql.query("SELECT * FROM turma INNER JOIN alunos ON (alunos.turma = turma.id) WHERE id=? order by nome", [req.params.id], (err, results, fields) => {
		if(results.length > 0){
			res.render('admin/turmas/verTurma',{data: results, codigo: results[0].codigo});
		}else {
			res.render('admin/turmas/verTurma',{data: results});
		}
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

router.post('/alunos/add', urlencodeParser, upload.single('foto'), (req, res, next) => {
	console.log(req.file.filename)
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
		sql.query("INSERT INTO alunos VALUES (?,?,?,?,?,?,?)", [req.body.matricula, req.body.nome, req.body.email, req.body.nascimento, req.body.turma, req.body.entrada,req.file.filename]);
		res.render('index');
	}
})

router.post('/alunos/edit', urlencodeParser, upload.single('foto'), (req, res, next) => {
	sql.query("UPDATE alunos set nome=?, turma=?, entrada=?, nascimento=?, foto=? WHERE matricula=?", [req.body.nome, req.body.turma, req.body.entrada,req.body.nascimento, req.file.filename, req.body.matricula]);
	res.render('index');
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