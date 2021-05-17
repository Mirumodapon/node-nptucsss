const express = require('express');
const Router = express.Router();

// ! base url /api/v1/auth/user

const uuid = require('uuid');
const { body, validationResult } = require('express-validator');

Router.get('/', [], async (req, res) => {
    try {
        const sql = 'SELECT uuid,name from auth.user;'
        const staffList = await req.mysql._query(sql);
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
        const sql = `SELECT * FROM auth.user_info WHERE uuid='${id}';`;
        const [staff] = await req.mysql._query(sql);
        res.send(staff);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Internal Server Error');
    }
});

Router.post(
    '/register',
    [
        body('email', 'The email is not valid.').isEmail(),
        body('name', 'Name is require.').exists(),
        body('password', 'Request password at least 8 characters').isLength({
            min: 8
        })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    msg: 'Bad Request',
                    errors: errors.array()
                });
            }
            const { name, email, password } = req.body;
            const id = uuid.v1();
            const value = [id, name, email, new Date(), new Date, password]
            await req.mysql._query('INSERT INTO auth.user VALUES (?); ', [value]);
            res.status(200).json({ uuid: id, name, email });
        } catch (erro) {
            console.error(erro);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = Router;