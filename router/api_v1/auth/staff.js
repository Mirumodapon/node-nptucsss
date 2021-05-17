const express = require('express');
const Router = express.Router();

// ! base url /api/v1/auth/staff

const crypto = require('crypto');
const uuid = require('uuid');

Router.get('/', [], async (req, res) => {
    try {
        const sql = 'SELECT uuid,name,email from auth.staff;'
        const staffList = await req.mysql._query(sql);
        staffList.forEach(staff => {
            staff.mailHash = crypto.createHash('md5').update(staff.email).digest("hex");
            delete staff.email;
        });
        res.send(staffList);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Internal Server Error');
    }
});

Router.get('/:id', [], async (req, res) => {
    try {
        const { id } = req.params;
        if (!uuid.validate(id)) return res.status(400).send('Bad Request');
        const sql = `SELECT * FROM auth.staff_introd WHERE uuid='${id}';`;
        const [staff] = await req.mysql._query(sql);
        staff.mailHash = crypto.createHash('md5').update(staff.email).digest("hex");
        res.send(staff);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Internal Server Error');
    }
});

Router.post('/register', [], async (req, res) => {
    try {
        const { id } = req.body;
        if (!uuid.validate(id)) return res.status(400).send('Bad Request');
        const sql = `SELECT * from auth.user WHERE uuid='${id}';`
        const [user] = await req.mysql._query(sql);
        if (!user) {
            return res.status(404).json('User Not Found');
        }
        const value = [id, user.name, user.email, '', '', user.join, user.last_login, user.password, 4];
        await req.mysql._query('INSERT INTO auth.staff VALUES (?); ', [value]);
        await req.mysql._query(`DELETE FROM auth.user WHERE uuid='${id}'`);
        res.send('OK');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = Router;