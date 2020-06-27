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
	sql.query("SELECT * FROM alunos", (err, results, fields) => {
		res.render('select', {data: results});
	});
})



/* ======= POST =======*/
router.post('/cadastro', urlencodeParser, (req, res) => {
	sql.query("INSERT INTO usuario VALUES (?,?,?,?,?)", [req.id, req.body.email, req.body.user, req.body.senha, false]);
	res.render('index')
})














module.exports = router;