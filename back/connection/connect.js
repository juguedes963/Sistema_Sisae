const mysql = require('mysql');
const sql = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	port: '3306',
});
sql.query('use sisae');

const connection = sql.query('use sisae');

module.exports = {connection, sql};