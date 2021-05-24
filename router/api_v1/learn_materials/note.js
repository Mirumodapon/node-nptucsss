const express = require('express');
const Router = express.Router();

// ! base url /api/v1/learn-materials/note

const uuid = require('uuid');
const { body } = require('express-validator');
const checkParamsValid = require('../../middleware/checkParamsValid');
const checkoutIdfromUrl = require('../../middleware/checkoutIdfromUrl');
const accept = require('../../middleware/acceptAuth');

Router.get('/', [], (req, res) => {
	res.send('note');
});

Router.get('/subject', [], async (req, res) => {
	const subject = await req.mysql._query(
		'SELECT DISTINCT subject FROM learn_materials.note_record;'
	);
	res.send(subject);
});

Router.get('/subject/:department_subject', [], async (req, res) => {
	const [department, subject] = req.params.department_subject.split('-');
	const list = await req.mysql._query(
		`SELECT * FROM learn_materials.note_record where department='${department}' and subject='${subject}';`
	);
	res.send(list);
});

Router.post(
	'/',
	[
		accept(8),
		body('department').exists(),
		body('semester').exists(),
		body('subject').exists(),
		body('editor').exists(),
		body('link').exists(),
		checkParamsValid
	],
	async (req, res) => {
		try {
			const { department, semester, subject, editor, link } = req.body;
			await req.mysql._query(
				'INSERT INTO learn_materials.note_record VALUES (?);',
				[[uuid.v4(), department, semester, subject, editor, link]]
			);
			res.send('OK');
		} catch (erro) {
			console.log(erro);
			res.status(500).send('Internal Server Error');
		}
	}
);

Router.delete('/:id', [accept(8), checkoutIdfromUrl], async (req, res) => {
	try {
		const { id } = req.params;
		const [exam] = await req.mysql._query(
			`SELECT uuid FROM learn_materials.note_record WHERE uuid='${id}';`
		);
		if (!exam) return res.status(404).send('Not Found');
		await req.mysql._query(
			`DELETE FROM learn_materials.note_record WHERE uuid='${id}';`
		);
		res.send('OK');
	} catch (erro) {
		console.log(erro);
		res.status(500).send('Internal Server Error');
	}
});

Router.put(
	'/:id',
	[
		accept(8),
		checkoutIdfromUrl,
		body('department').exists(),
		body('semester').exists(),
		body('subject').exists(),
		body('editor').exists(),
		body('link').exists(),
		checkParamsValid
	],
	async (req, res) => {
		try {
			const { id } = req.params;
			const [exam] = await req.mysql._query(
				`SELECT uuid FROM learn_materials.note_record WHERE uuid='${id}';`
			);
			if (!exam) return res.status(404).send('Not Found');
			await req.mysql._query(
				`UPDATE learn_materials.note_record SET department=?, semester=?, subject=?, editor=?, link=? WHERE uuid=\'${id}\';`,
				[
					req.body.department,
					req.body.semester,
					req.body.subject,
					req.body.editor,
					req.body.link
				]
			);
			res.send('OK');
		} catch (erro) {
			console.log(erro);
			res.status(500).send('Internal Server Error');
		}
	}
);

module.exports = Router;
