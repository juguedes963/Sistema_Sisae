//Definindo os módulos necessários para trabalhar com o nodes
const express = require('express');
const handlebars = require('express-handlebars');
const path = require("path");
const bodyParser = require('body-parser');
const urlencodeParser = bodyParser.urlencoded({extended:false});
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("./config/auth")(passport);

const app = express();

//Template engine
app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set("view engine",'handlebars');

//Rotas estáticas
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));


//Configurações

	//Sessões
	app.use(session({
		secret: "sisaesystem",
		resave: true,
		saveUnitialized: true
	}))

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(flash());

	app.use((req, res, next) => {
		res.locals.error = req.flash("error");
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