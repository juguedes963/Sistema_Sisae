//Definindo os módulos necessários para trabalhar com o nodes
const express = require('express');
var rotas = require('./routes/routes');
var admin = require('./routes/admin');
const handlebars = require('express-handlebars');
const path = require("path");
const bodyParser = require('body-parser');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("./config/auth")(passport);
const moment = require('moment');
var multer  = require('multer');
var upload = multer( dest: {'uploads/'});

const app = express();



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
		res.locals.user = req.user || null;
		next();
	})

	//BodyParser
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	//Template engine
	app.engine("handlebars",handlebars({defaultLayout:'main',  helpers: {
      formatDate: (date) => {
           return moment(date).format('DD/MM/YYYY')
       }
     }}));
	app.set("view engine",'handlebars');

	//Public
	app.use(express.static(path.join(__dirname, "public")));



//Rotas
app.use('/', rotas);
app.use('/admin', admin);

app.listen(8081, (req,res) => {
	console.log("O servidor está rodando!")
})