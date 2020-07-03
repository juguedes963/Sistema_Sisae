const localStrategy = require("passport-local").Strategy;
const mysql = require('mysql');
const bcrypt = require("bcryptjs");
const sql = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	port: '3306',
});
sql.query('use sisae');


module.exports = function(passport){

	passport.use(new localStrategy({usernameField:'username', passwordField:'senha'}, (user, senha, done) => {

		sql.query("SELECT * FROM usuario WHERE username = '"+ user +"'", (err, rows) => {
			if(!user){
				return done(null, false, {message: 'Esta conta não existe!'})
			}

			bcrypt.compare(senha, user.senha, (err, batem) => {
				if(batem){
					return done(null, user)
				}else{
					return done(null, false, {message: "Senha incorreta!"})
				}
			})
		})
	}))

	passport.serializeUser((user, done) => {

		done(null, user.id)
	})

	passport.deserializeUser((id, done) => {
		sql.query("SELECT * FROM usuario WHERE username = '"+ user +"'", (err, user) => {
			done(err, user)
		})
	})
}