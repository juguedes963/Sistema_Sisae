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

		sql.query("SELECT 1 FROM usuario WHERE username=? and senha=?", [user,senha], (err, rows) => {
			if(rows.length > 0){
				return done(null, user)
			}else {
				return done(null, false, {message: "Dados não encontrados!"})
			}
		})

	}))

	passport.serializeUser((user, done) => {

		done(null, user)
	})

	passport.deserializeUser((id, done) => {
		sql.query("SELECT * FROM usuario WHERE id = '"+ id +"'", (err, user) => {
			done(err, user)
		})
	})
}