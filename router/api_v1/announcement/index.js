const express = require('express');
const Router = express.Router();

// ! base url /api/v1/announcement

const { body } = require('express-validator');
const accept = require('../../middleware/acceptAuth');
const uuid = require('uuid');
const checkoutIdfromUrl = require('../../middleware/checkoutIdfromUrl');
const checkParamsValid = require('../../middleware/checkParamsValid');


Router.get('/', [], async (req, res) => {
    try {
        const anno = await req.mysql._query(
            `SELECT * FROM announcement.announcement WHERE expire < '${new Date().toISOString()}';`
        );
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

Router.get('/:id', [checkoutIdfromUrl], async (req, res) => {
    try {
        const { id } = req.params;
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
        body('expire').exists(),
        checkParamsValid
    ],
    async (req, res) => {
        try {
            const { title, content, type, expire } = req.body;
            const data = [uuid.v4(), title, content, new Date, new Date, type, new Date(expire)];
            await req.mysql._query('INSERT INTO announcement.announcement VALUES (?);', [data]);
            res.send('OK');
        } catch (erro) {
            console.log(erro);
            res.status(500).send('Internal Server Error');
        }
    }
);

Router.delete('/:id', [checkoutIdfromUrl, accept(2)], async (req, res) => {
    try {
        const { id } = req.params;
        const [ann] = await req.mysql._query(`SELECT uuid FROM announcement.announcement WHERE uuid='${id}'`);
        if (!ann) return res.status(404).send('Not Found');
        await req.mysql._query(`DELETE FROM announcement.announcement WHERE uuid='${id}';`);
        res.send('OK');
    } catch (erro) {
        console.log(erro);
        res.status(500).send('Internal Server Error');
    }
});

Router.put(
    '/:id',
    [
        checkoutIdfromUrl,
        accept(2),
        body('title').exists(),
        body('content').exists(),
        body('type').exists(),
        body('expire'),
        checkParamsValid
    ],
    async (req, res) => {
        try {
            const { id } = req.params;
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