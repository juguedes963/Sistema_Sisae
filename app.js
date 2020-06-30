//Definindo os módulos necessários para trabalhar com o nodes
const express = require('express');
const handlebars = require('express-handlebars');
const path = require("path");


const app = express();

//Template engine
app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set("view engine",'handlebars');

//Rotas estáticas
app.use(express.static(path.join(__dirname, "public")));

//Middleware
app.use((req, res, next) => {
	console.log("Middleware!")
	next();
})



//Chamando as rotas dinâmicas
var rotas = require('./routes/routes');
app.use('/', rotas);

var rotas_adm = require('./routes/admin');
app.use('/admin', rotas_adm);

app.listen(8081, (req,res) => {
	console.log("O servidor está rodando!")
})