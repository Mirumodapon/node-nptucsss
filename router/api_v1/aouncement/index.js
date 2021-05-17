const express = require('express');
const Router = express.Router();

// ! base url /api/v1/announcement

const { body, validationResult } = require('express-validator');
const accept = require('../../middleware/acceptAuth');
const uuid = require('uuid');

Router.get('/', [], async (req, res) => {
    try {
        const sql = `SELECT * FROM announcement.announcement WHERE expire < '${new Date().toISOString()}';`;
        const anno = await req.mysql._query(sql);
        res.send(anno);
    } catch (erro) {
        console.log(erro);
        res.status(500).send('Internal Server Error');
    }
});

Router.get('/all', [], async (req, res) => {
    try {
        const sql = `SELECT * FROM announcement.announcement;`;
        const anno = await req.mysql._query(sql);
        res.send(anno);
    } catch (erro) {
        console.log(erro);
        res.status(500).send('Internal Server Error');
    }
});

Router.get('/:id', [], async (req, res) => {
    try {
        const { id } = req.params;
        if (!uuid.validate(id)) return res.status(400).send('Bad Request');
        const [anno] = await req.mysql._query(`SELECT * FROM announcement.announcement WHERE uuid='${id}';`);
        if (!anno) return res.status(404).send('Not Found');
        const history = await req.mysql._query(`SELECT * FROM announcement.edit_history WHERE uuid='${id}';`);
        anno.history = history;
        res.send(anno);
    } catch (erro) {
        console.log(erro);
        res.status(500).send('Internal Server Error');
    }
});

Router.post(
    '/',
    [
        accept(2),
        body('title').exists(),
        body('content').exists(),
        body('type').exists(),
        body('expire').exists()
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
            const { title, content, type, expire } = req.body;
            const sql = 'INSERT INTO announcement.announcement VALUES (?);';
            const data = [uuid.v4(), title, content, new Date, new Date, type, new Date(expire)];
            await req.mysql._query(sql, [data]);
            res.send('OK');
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Internal Server Error');
        }
    }
);

Router.delete('/:id', [accept(2)], async (req, res) => {
    try {
        const { id } = req.params;
        if (!uuid.validate(id)) return res.status(400).send('Bad Request');
        const [ann] = await req.mysql._query(`SELECT uuid FROM announcement.announcement WHERE uuid='${id}'`);
        if (!ann) return res.status(404).send('Not Found');
        const sql = `DELETE FROM announcement.announcement WHERE uuid='${id}';`;
        await req.mysql._query(sql);
        res.send('OK');
    } catch (erro) {
        console.log(erro);
        res.status(500).send('Internal Server Error');
    }
});

Router.put(
    '/:id',
    [
        accept(2),
        body('title').exists(),
        body('content').exists(),
        body('type').exists(),
        body('expire')
    ],
    async (req, res) => {
        try {
            const { id } = req.params;
            if (!uuid.validate(id)) return res.status(400).send('Bad Request');
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    msg: 'Bad Request',
                    errors: errors.array()
                });
            }
            const [ann] = await req.mysql._query(`SELECT uuid FROM announcement.announcement WHERE uuid='${id}'`);
            if (!ann) return res.status(404).send('Not Found');
            const { title, content, type, detail, expire } = req.body;
            await req.mysql._query(
                `UPDATE announcement.announcement SET title=?, content=?, type=?, update_time=?, expire=? WHERE uuid=\'${id}\';`,
                [title, content, type, new Date]
            );
            await req.mysql._query(`INSERT INTO announcement.edit_history value (?);`, [[id, new Date, detail, req.auth.uuid, new Date(expire)]]);
            res.send('OK');
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Internal Server Error');
        }
    }
);

Router.patch('/:id', [accept(2)], async (req, res) => {
    res.status(405);
});


module.exports = Router;