const express = require('express');
const Router = express.Router();

// ! base url /api/v1/auth/staff

const crypto = require('crypto');
const uuid = require('uuid');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accept = require('../../middleware/acceptAuth');
const checkoutIdfromUrl = require('../../middleware/checkoutIdfromUrl');
const checkoutIdfromBody = require('../../middleware/checkoutIdfromBody');
const checkParamsValid = require('../../middleware/checkParamsValid');

Router.get('/', [], async (req, res) => {
	try {
		const staffList = await req.mysql._query(
			'SELECT uuid,name,email from auth.staff;'
		);
		staffList.forEach((staff) => {
			staff.mailHash = crypto
				.createHash('md5')
				.update(staff.email)
				.digest('hex');
			delete staff.email;
		});
		res.send(staffList);
	} catch (erro) {
		console.error(erro);
		res.status(500).send('Internal Server Error');
	}
});

Router.get('/me', [accept(1)], async (req, res) => {
	try {
		const [staff] = await req.mysql._query(
			`SELECT * FROM auth.staff_introd WHERE uuid='${req.auth.uuid}';`
		);
		staff.mailHash = crypto
			.createHash('md5')
			.update(staff.email)
			.digest('hex');
		res.send(staff);
	} catch (erro) {
		console.error(erro);
		res.status(500).send('Internal Server Error');
	}
});

Router.get('/:id', [checkoutIdfromUrl], async (req, res) => {
	try {
		const { id } = req.params;
		const [staff] = await req.mysql._query(
			`SELECT * FROM auth.staff_introd WHERE uuid='${id}';`
		);
		staff.mailHash = crypto
			.createHash('md5')
			.update(staff.email)
			.digest('hex');
		res.send(staff);
	} catch (erro) {
		console.error(erro);
		res.status(500).send('Internal Server Error');
	}
});

Router.post(
	'/register',
	[
		accept(4),
		body('authority').exists(),
		checkParamsValid,
		checkoutIdfromBody
	],
	async (req, res) => {
		try {
			const { id } = req.body;
			const [user] = await req.mysql._query(
				`SELECT * from auth.user WHERE uuid='${id}';`
			);
			if (!user) {
				return res.status(404).json('User Not Found');
			}
			const value = [
				id,
				user.name,
				user.email,
				'',
				'',
				'',
				user.join,
				user.last_login,
				user.password,
				req.body.authority
			];
			await req.mysql._query('INSERT INTO auth.staff VALUES (?); ', [
				value
			]);
			await req.mysql._query(`DELETE FROM auth.user WHERE uuid='${id}'`);
			res.send('OK');
		} catch (erro) {
			console.error(erro);
			res.status(500).send('Internal Server Error');
		}
	}
);

Router.delete('/:id', [accept(2), checkoutIdfromUrl], async (req, res) => {
	try {
		const { id } = req.params;
		const [staff] = await req.mysql._query(
			`SELECT uuid FROM auth.staff WHERE uuid='${id}'`
		);
		if (!staff) return res.status(404).send('Not Found');
		await req.mysql._query(`DELETE FROM auth.staff WHERE uuid='${id}';`);
		res.send('OK');
	} catch (erro) {
		console.log(erro);
		res.status(500).send('Internal Server Error');
	}
});

Router.patch(
	'/password',
	[accept(1), body('password').isLength({ min: 8 }), checkParamsValid],
	async (req, res) => {
		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.password, salt);
		await req.mysql._query(
			`UPDATE auth.staff SET password=? WHERE uuid='${req.auth.uuid}';`,
			[password]
		);
		res.send('OK');
	}
);

Router.patch(
	'/:id',
	[
		checkoutIdfromUrl,
		accept(4),
		body('authority').exists(),
		checkParamsValid
	],
	async (req, res) => {
		try {
			const { id } = req.params;
			const [staff] = await req.mysql._query(
				`SELECT uuid FROM auth.staff WHERE uuid='${id}'`
			);
			if (!staff) return res.status(404).send('Not Found');
			await req.mysql._query(
				`UPDATE auth.staff SET authority=? WHERE uuid='${id}';`,
				[req.body.authority]
			);
			res.send('OK');
		} catch (erro) {
			console.log(erro);
			res.status(500).send('Internal Server Error');
		}
	}
);

Router.put(
	'/',
	[
		accept(1),
		body('description').exists(),
		body('skill').exists(),
		body('name').exists(),
		body('email').exists(),
		body('tags').exists(),
		checkParamsValid
	],
	async (req, res) => {
		try {
			const { name, skill, email, description, tags } = req.body;
			const data = [name, skill, email, description, tags];
			await req.mysql._query(
				`UPDATE auth.staff SET name=?,skill=?,email=?,description=?,tags=? WHERE uuid='${req.auth.uuid}';`,
				data
			);
			res.send('OK');
		} catch (erro) {
			console.log(erro);
			res.status(500).send('Internal Server Error');
		}
	}
);

module.exports = Router;
