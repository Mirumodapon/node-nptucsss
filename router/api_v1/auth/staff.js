const express = require('express');
const Router = express.Router();

// ! base url /api/v1/auth/staff

const crypto = require('crypto');
const uuid = require('uuid');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accept = require('../../middleware/acceptAuth');

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

Router.post('/register', [accept(1)], async (req, res) => {
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

Router.post(
    '/login',
    [
        body('email').isEmail(),
        body('password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    msg: 'Login failed'
                });
            }
            const { email, password } = req.body;
            const sql = `SELECT * FROM auth.staff WHERE email='${email}';`
            const [staff] = await req.mysql._query(sql);
            if (!staff) {
                return res.status(400).json({
                    msg: 'Login failed'
                });
            }
            const isMatch = await bcrypt.compare(password, staff.password);
            if (!isMatch) {
                return res.status(400).json({
                    msg: 'Login failed'
                });
            }
            await req.mysql._query(`UPDATE auth.staff SET last_login=? WHERE uuid='${staff.uuid}';`, [new Date]);
            const token_payload = {
                uuid: staff.uuid
            }
            jwt.sign(
                token_payload,
                process.env.jwt_secret,
                {},
                (erro, token) => {
                    if (erro) throw erro;
                    res.json({
                        msg: 'Login successed',
                        uuid: staff.uuid,
                        type: 'staff',
                        token
                    });
                }
            );
        } catch (erro) {
            console.error(erro);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = Router;