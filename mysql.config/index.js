const mysql = require('mysql');
const fs = require('fs');

const host = '';
const user = '';
const password = '';
const scripts = ['./Init.sql', './staff.sql', './user.sql', './announcement.sql'];

const mysql_config = {
    host,
    user,
    password,
    multipleStatements: true
}

const mysql_connect = mysql.createConnection(mysql_config);

mysql_connect._query = function (sql, values) {
    return new Promise(
        (resolve, reject) => {
            mysql_connect.query(sql, values, (erro, rows) => {
                if (erro) reject(erro);
                else resolve(rows);
            })
        }
    );
}

const readfile = (path) => {
    return new Promise(
        (resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) reject(err);
                else resolve(data)
            });
        }
    )
}

var s = 0;
var f = 0;

mysql_connect.connect(
    async (erro) => {
        process.stdout.write(`Connecting ${user}@${host}...`);
        try {
            if (erro) throw erro;
            else process.stdout.write('OK\n');
            for (let i = 0; i < scripts.length; ++i) {
                process.stdout.write(`Execute ${scripts[i]}...`);
                const sql = await readfile(scripts[i]);
                await mysql_connect._query(sql.toString());
                ++s;
                process.stdout.write('OK\n');
            }
        } catch (err) {
            ++f;
            process.stdout.write('Failed\n');
        }
        console.log();
        console.log(`Totle ${s + f}, Successed ${s}, Failed ${f}.`);
        process.exit(0);
    }
);


