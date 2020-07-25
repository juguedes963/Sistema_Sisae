//Definindo os módulos essenciais para trabalhar com rotas
const express = require('express');
const bodyParser = require('body-parser');
const converter = require("tc-roman-number")
const {permissao} = require("../helpers/permissao")
const connection = require("../connection/connect")
console.log(connection.urlencodeParser)

const router = express.Router();

var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../front/public/uploads')
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


//ARTIGOS
router.get('/artigos',permissao, (req, res) => {
	res.render('admin/ocorrencias/artigos/addArtigo')
})

router.get('/artigos/ver', permissao, (req,res) => {
	connection.sql.query("SELECT * FROM artigo order by numero", (err, results, fields) => {
		res.render('admin/ocorrencias/artigos/listaArtigos',{data: results});
	})
})

router.get('/artigo/ver/:id', permissao, (req,res) => {
	connection.sql.query("SELECT * FROM artigo INNER JOIN inciso ON (artigo.numero = inciso.id_artigo) WHERE numero=?", [req.params.id], (err, results, fields) => {
		if(results.length > 0){
			res.render('admin/ocorrencias/artigos/verArtigo',{data: results, numero: results[0].numero, texto: results[0].texto});
		}else {
			connection.sql.query("SELECT * from artigo WHERE numero=?", [req.params.id], (err, results, fields) => {
				res.render('admin/ocorrencias/artigos/verArtigo',{numero: results[0].numero, texto: results[0].texto});
			})
		}

	})
})

router.get('/artigo/deletar/:id', permissao, (req, res) => {
	var success = [];

	success.push({text:"Artigo deletado(a) com sucesso!"})
	connection.sql.query("DELETE FROM artigo WHERE numero=?", [req.params.id]);
	res.render('index',{success: success});
})

router.get('/artigo/editar/:id', permissao, (req, res) => {
	connection.sql.query("SELECT * from artigo WHERE numero=?", [req.params.id], (err, results, fields) => {
		res.render('admin/ocorrencias/artigos/editArtigo',{numero: req.params.id, texto: results[0].texto});
	})
})


//INCISOS

router.get('/incisos',permissao, (req, res) => {
	connection.sql.query("SELECT * FROM artigo order by numero", (err, results, fields) => {
		res.render('admin/ocorrencias/incisos/addInciso',{artigos: results});
	})
})

router.get('/inciso/ver/:id', permissao, (req, res) => {
	connection.sql.query("SELECT * FROM inciso WHERE id=?", [req.params.id], (err, results, fields) => {
		console.log(results[0].num_romano)
		res.render('admin/ocorrencias/incisos/verInciso', {data: results})
	})
})

router.get('/inciso/editar/:id', permissao, (req, res) => {
	connection.sql.query("SELECT * from inciso WHERE id=?", [req.params.id], (err, results, fields) => {
		res.render('admin/ocorrencias/incisos/editInciso',{id: req.params.id, num_inciso: results[0].num_inciso, texto_inciso: results[0].texto_inciso});
	})
})

router.get('/inciso/deletar/:id', permissao, (req, res) => {
	var success = [];

	success.push({text:"Inciso deletado(a) com sucesso!"})
	connection.sql.query("DELETE FROM inciso WHERE id=?", [req.params.id]);
	res.render('index',{success: success});
})




//ALUNOS
router.get('/alunos', permissao, (req,res) => {
	connection.sql.query("SELECT * FROM turma order by codigo", (err, results, fields) => {
		res.render('admin/alunos/addAluno',{turmas: results});
	})
})

router.get('/alunos/ver', permissao, (req,res) => {
	connection.sql.query("SELECT * FROM alunos INNER JOIN turma ON (alunos.turma = turma.id) order by nome", (err, results, fields) => {
		res.render('admin/alunos/listaAlunos',{data: results});
	})
})


router.get('/alunos/deletar/:id', permissao, (req,res) => {
	var success = [];

	success.push({text:"Estudante deletado(a) com sucesso!"})
	connection.sql.query("DELETE FROM alunos WHERE matricula=?", [req.params.id]);
	res.render('index',{success: success});
})

router.get('/alunos/editar/:id', permissao ,(req,res) => {
	connection.sql.query("SELECT * FROM alunos INNER JOIN turma WHERE matricula=? order by codigo", [req.params.id],  (err, results, fields) => {
		res.render('admin/alunos/editAluno',{matricula: req.params.id, turmas: results, nome: results[0].nome, codigo: results[0].codigo, foto: results[0].foto});
	})	
	
})

router.get('/aluno/ver/:id', permissao, (req,res) => {
	connection.sql.query("SELECT * FROM alunos INNER JOIN turma ON (alunos.turma = turma.id) WHERE matricula=?", [req.params.id], (err, results, fields) => {
		res.render('admin/alunos/verAluno',{data: results});
	})
})



//TURMAS
router.get('/turmas', permissao, (req,res) => {
	
		res.render('admin/turmas/addTurma');
	
})

router.get('/turmas/ver', permissao, (req,res) => {
	connection.sql.query("SELECT * FROM turma order by codigo", (err, results, fields) => {
		res.render('admin/turmas/listaTurmas',{data: results});
	})
})

router.get('/turma/ver/:id', permissao, (req,res) => {
	connection.sql.query("SELECT * FROM turma INNER JOIN alunos ON (alunos.turma = turma.id) WHERE id=? order by nome", [req.params.id], (err, results, fields) => {
		if(results.length > 0){
			res.render('admin/turmas/verTurma',{data: results, codigo: results[0].codigo});
		}else {
			res.render('admin/turmas/verTurma',{data: results});
		}
	})
})

router.get('/users' , permissao, (req, res) => {
	connection.sql.query("SELECT * from usuario", (err, results, fields) => {
		res.render('admin/select',{data: results});
	})
})

router.get('/users/deletar/:id', permissao, (req,res) => {
	connection.sql.query("DELETE FROM usuario WHERE id=?", [req.params.id]);
	res.render('admin');
})

/* ======= POST =======*/

router.post('/alunos/add', connection.urlencodeParser, upload.single('foto'), (req, res, next) => {
	var erros = [];
	var success = [];

	connection.sql.query("SELECT * FROM alunos WHERE matricula=?", [req.body.matricula], (err, results, fields) => {
		if(results != ""){
			erros.push({text: "Erro: Nº de matrícula já cadastrado!"})
			res.render("admin/alunos/addAluno", {erros: erros})
		}else{

			if(!req.body.nome || req.body.nome == null || typeof req.body.nome == undefined){
				erros.push({text: "Erro: Nome inválido!"})
			}

			if(req.body.nome.length < 2){
				erros.push({text: "Erro: Nome muito curto!"})
			}

			if(!req.file || req.file == null || typeof req.file == undefined){
				erros.push({text: "Erro: Insira uma foto válida!"})
			}

			
			if(erros.length > 0){
				res.render("admin/alunos/addAluno", {erros: erros})
			}else{
				success.push({text:"Estudante registrado(a) com sucesso!"})
				connection.sql.query("INSERT INTO alunos VALUES (?,?,?,?,?)", [req.body.matricula, req.body.nome, req.body.turma, new Date, req.file.filename]);
				res.render('index',{success: success});
			}
		}
	})

	
})

router.post('/alunos/edit', connection.urlencodeParser, upload.single('foto'), (req, res, next) => {
	var erros = [];
	var success = [];


	if(!req.body.nome || req.body.nome == null || typeof req.body.nome == undefined){
		erros.push({text: "Erro: Nome inválido!"})
	}

	if(req.body.nome.length < 2){
		erros.push({text: "Erro: Nome muito curto!"})
	}

	if(!req.file || req.file == null || typeof req.file == undefined){
		erros.push({text: "Erro: Insira uma foto válida!"})
	}

	if(erros.length > 0){
		res.render("admin/alunos/editAluno", {erros: erros})
	}else{
		success.push({text:"Dados alterados com sucesso!"})
		connection.sql.query("UPDATE alunos set nome=?, turma=?, foto=? WHERE matricula=?", [req.body.nome, req.body.turma, req.file.filename, req.body.matricula]);
		res.render('index',{success: success});
	}

})


router.post('/turmas/add', connection.urlencodeParser, (req, res) => {

	var erros = [];
	var success = [];

	if(!req.body.codigo || req.body.codigo == null || typeof req.body.codigo == undefined){
		erros.push({text: "Erro: Turma inválida!"})
	}

	if(req.body.codigo.length < 4){
		erros.push({text: "Erro: Nome muito curto!"})
	}

	if(erros.length > 0){
		res.render("admin/turmas/addTurma", {erros: erros})
	}else {
		success.push({text: "Turma cadastrada com sucesso!"})
		connection.sql.query("INSERT INTO turma VALUES (?,?)", [req.id, req.body.codigo]);
		res.render('index', {success: success});
	}
})

router.post('/artigos/add',connection.urlencodeParser, (req, res) => {

	var erros = [];
	var success = [];

	connection.sql.query("SELECT * FROM artigo WHERE numero=?", [req.body.numero], (err, results, fields) => {
		if(results != ""){
			erros.push({text: "Erro: Artigo já cadastrado!"})
			res.render("admin/ocorrencias/artigos/addArtigo", {erros: erros})
		}else{

			if(!req.body.numero || req.body.numero == null || typeof req.body.numero == undefined){
				erros.push({text: "Erro: Número inválido!"})
			}

			if(erros.length > 0){
				res.render("admin/ocorrencias/artigos/addArtigo", {erros: erros})
			}else{
				success.push({text: "Artigo cadastrado com sucesso!"})
				connection.sql.query("INSERT INTO artigo values (?,?)", [req.body.numero, req.body.texto])
				res.render('index', {success: success})	
			}
		}
	})

})

router.post('/artigos/edit',connection.urlencodeParser, (req, res) => {

	var erros = [];
	var success = [];

	if(!req.body.numero || req.body.numero == null || typeof req.body.numero == undefined){
		erros.push({text: "Erro: Número inválido!"})
	}

	if(erros.length > 0){
		res.render("admin/ocorrencias/artigos/editArtigo", {erros: erros})
	}else{
		success.push({text:"Artigo alterado com sucesso!"})
		connection.sql.query("UPDATE artigo set texto=? WHERE numero=?", [req.body.texto, req.body.numero]);
		res.render('index',{success: success});
	}

})

router.post('/incisos/add',connection.urlencodeParser, (req, res) => {

	var erros = [];
	var success = [];

	if(!req.body.num_inciso || req.body.num_inciso == null || typeof req.body.num_inciso == undefined){
		erros.push({text: "Erro: Número inválido!"})
	}

	if(!req.body.texto_inciso || req.body.texto_inciso == null || typeof req.body.texto_inciso == undefined){
		erros.push({text: "Erro: Texto inválido!"})
	}

	if(req.body.texto_inciso.length < 5){
		erros.push({text: "Erro: Texto muito curto!"})
	}

	var num = Number(req.body.num_inciso);

	converter.intToRoman(num)
	
	if(erros.length > 0){
		res.render("admin/ocorrencias/incisos/addInciso", {erros: erros})
	}else{
		
		success.push({text: "Inciso cadastrado com sucesso!"})
		connection.sql.query("INSERT INTO inciso values (?,?,?,?,?)", [req.id, req.body.num_inciso, converter.intToRoman(num), req.body.texto_inciso, req.body.id_artigo])
		res.render('index', {success: success})	
	}

})

router.post('/inciso/edit',connection.urlencodeParser, (req, res) => {

	var erros = [];
	var success = [];

	if(!req.body.num_inciso || req.body.num_inciso == null || typeof req.body.num_inciso == undefined){
		erros.push({text: "Erro: Número inválido!"})
	}

	if(!req.body.texto_inciso || req.body.texto_inciso == null || typeof req.body.texto_inciso == undefined){
		erros.push({text: "Erro: Texto inválido!"})
	}

	if(req.body.texto_inciso.length < 5){
		erros.push({text: "Erro: Texto muito curto!"})
	}

	if(erros.length > 0){
		res.render("admin/ocorrencias/incisos/editInciso", {erros: erros})
	}else{
		success.push({text: "Inciso alterado com sucesso!"})
		connection.sql.query("UPDATE inciso set num_inciso=?, texto_inciso=? WHERE id=?", [req.body.num_inciso, req.body.texto_inciso, req.body.id])
		res.render('index', {success: success})	
	}

})


module.exports = router;