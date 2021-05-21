const mysql = require('mysql');

const mysql_config = {
	host: process.env.mysql_host,
	user: process.env.mysql_user,
	password: process.env.mysql_pass
};

const mysql_connect = mysql.createConnection(mysql_config);
mysql_connect.connect((erro) => {
	if (erro) console.log('mysql connected failed.');
	else console.log('mysql connected successed.');
});

const query = function (sql, values) {
	return new Promise((resolve, reject) => {
		mysql_connect.query(sql, values, (erro, rows) => {
			if (erro) reject(erro);
			else resolve(rows);
		});
	});
};

mysql_connect._query = query;

module.exports = mysql_connect;
