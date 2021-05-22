const express = require('express');
const Router = express.Router();

// ! base url /api/v1/learn-materials/note

Router.get('/', [], (req, res) => {
	res.send('note');
});

Router.get('/subject', [], async (req, res) => {
	const subject = await req.mysql._query(
		'SELECT DISTINCT subject FROM learn_materials.note_record;'
	);
	res.send(subject);
});

module.exports = Router;
