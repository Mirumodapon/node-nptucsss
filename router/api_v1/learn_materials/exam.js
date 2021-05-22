const express = require('express');
const Router = express.Router();

// ! base url /api/v1/learn-materials/exam

const uuid = require('uuid');
const { body } = require('express-validator');
const checkParamsValid = require('../../middleware/checkParamsValid');
const checkoutIdfromUrl = require('../../middleware/checkoutIdfromUrl');
const accept = require('../../middleware/acceptAuth');

Router.get('/', [], (req, res) => {
	res.send('exam');
});

Router.get('/subject', [], async (req, res) => {
	const subject = await req.mysql._query(
		'SELECT DISTINCT department,subject FROM learn_materials.exam_record;'
	);
	res.send(subject);
});

Router.get('/subject/:department_subject', [], async (req, res) => {
	const [department, subject] = req.params.department_subject.split('-');
	const list = await req.mysql._query(
		`SELECT * FROM learn_materials.exam_record where department='${department}' and subject='${subject}';`
	);
	res.send(list);
});

Router.post(
	'/',
	[
		accept(3),
		body('department').exists(),
		body('semester').exists(),
		body('subject').exists(),
		body('professor').exists(),
		body('link').exists(),
		checkParamsValid
	],
	async (req, res) => {
		try {
			const { department, semester, subject, professor, link } = req.body;
			await req.mysql._query(
				'INSERT INTO learn_materials.exam_record VALUES (?);',
				[[uuid.v4(), department, semester, subject, professor, link]]
			);
			res.send('OK');
		} catch (erro) {
			console.log(erro);
			res.status(500).send('Internal Server Error');
		}
	}
);

Router.delete('/:id', [accept(3), checkoutIdfromUrl], async (req, res) => {
	try {
		const { id } = req.params;
		const [exam] = await req.mysql._query(
			`SELECT uuid FROM learn_materials.exam_record WHERE uuid='${id}';`
		);
		if (!exam) return res.status(404).send('Not Found');
		await req.mysql._query(
			`DELETE FROM learn_materials.exam_record WHERE uuid='${id}';`
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
		accept(3),
		checkoutIdfromUrl,
		body('department').exists(),
		body('semester').exists(),
		body('subject').exists(),
		body('professor').exists(),
		body('link').exists(),
		checkParamsValid
	],
	async (req, res) => {
		try {
			const { id } = req.params;
			const [exam] = await req.mysql._query(
				`SELECT uuid FROM learn_materials.exam_record WHERE uuid='${id}';`
			);
			if (!exam) return res.status(404).send('Not Found');
			await req.mysql._query(
				`UPDATE learn_materials.exam_record SET department=?, semester=?, subject=?, professor=?, link=? WHERE uuid=\'${id}\';`,
				[
					req.body.department,
					req.body.semester,
					req.body.subject,
					req.body.professor,
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
