const mysql = require('mysql');

const mysql_config = {
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_pass
}

const mysql_connect = mysql.createConnection(mysql_config);
mysql_connect.connect(
    (erro) => {
        if (erro) console.log('mysql connected failed.');
        else console.log('mysql connected successed.');
    }
);

module.exports = mysql_connect;