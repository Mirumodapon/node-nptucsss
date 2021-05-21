const express = require('express');
const Router = express.Router();

// ! base url /api/v1/auth/user

const uuid = require('uuid');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accept = require('../../middleware/acceptAuth');
const checkoutIdfromUrl = require('../../middleware/checkoutIdfromUrl');
const checkParamsValid = require('../../middleware/checkParamsValid');

Router.get('/', [accept(2)], async (req, res) => {
	try {
		const staffList = await req.mysql._query(
			'SELECT uuid,name from auth.user;'
		);
		res.send(staffList);
	} catch (erro) {
		console.error(erro);
		res.status(500).send('Internal Server Error');
	}
});

Router.get('/me', [accept(5)], async (req, res) => {
	try {
		const [user] = await req.mysql._query(
			`SELECT * FROM auth.user_info WHERE uuid='${req.auth.uuid}';`
		);
		if (!user) res.status(404).send('Not Found');
		res.send(user);
	} catch (erro) {
		console.error(erro);
		res.status(500).send('Internal Server Error');
	}
});

Router.get('/:id', [accept(2), checkoutIdfromUrl], async (req, res) => {
	try {
		const { id } = req.params;
		const [user] = await req.mysql._query(
			`SELECT * FROM auth.user_info WHERE uuid='${id}';`
		);
		res.send(user);
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
		}),
		checkParamsValid
	],
	async (req, res) => {
		try {
			const { name, email } = req.body;
			const [user] = await req.mysql._query(
				`SELECT email FROM auth.user WHERE email='${email}';`
			);
			if (user)
				return res.status(406).json({
					msg: 'The email has been register'
				});
			const id = uuid.v1();
			const salt = await bcrypt.genSalt(10);
			const password = await bcrypt.hash(req.body.password, salt);
			const value = [id, name, email, new Date(), new Date(), password];
			await req.mysql._query('INSERT INTO auth.user VALUES (?); ', [
				value
			]);
			res.status(200).json({ uuid: id, name, email });
		} catch (erro) {
			console.error(erro);
			res.status(500).send('Internal Server Error');
		}
	}
);

Router.post(
	'/login',
	[body('email').isEmail(), body('password').exists()],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					msg: 'Login failed'
				});
			}
			const { email, password } = req.body;
			const [user] = await req.mysql._query(
				`SELECT * FROM auth.user WHERE email='${email}';`
			);
			if (!user) {
				return res.status(400).json({
					msg: 'Login failed'
				});
			}
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({
					msg: 'Login failed'
				});
			}
			await req.mysql._query(
				`UPDATE auth.user SET last_login=? WHERE uuid='${user.uuid}';`,
				[new Date()]
			);
			const token_payload = {
				uuid: user.uuid
			};
			jwt.sign(token_payload, process.env.jwt_secret, (erro, token) => {
				if (erro) throw erro;
				res.json({
					msg: 'Login successed',
					uuid: user.uuid,
					type: 'user',
					token
				});
			});
		} catch (erro) {
			console.error(erro);
			res.status(500).send('Internal Server Error');
		}
	}
);

Router.delete('/:id', [checkoutIdfromUrl, accept(1)], async (req, res) => {
	try {
		const { id } = req.params;
		const [user] = await req.mysql._query(
			`SELECT uuid FROM auth.user WHERE uuid='${id}'`
		);
		if (!user) return res.status(404).send('Not Found');
		await req.mysql._query(`DELETE FROM auth.user WHERE uuid='${id}';`);
		res.send('OK');
	} catch (erro) {
		console.log(erro);
		res.status(500).send('Internal Server Error');
	}
});

Router.patch(
	'/password',
	[accept(5), body('password').isLength({ min: 8 }), checkParamsValid],
	async (req, res) => {
		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(req.body.password, salt);
		await req.mysql._query(
			`UPDATE auth.user SET password=? WHERE uuid='${req.auth.uuid}';`,
			[password]
		);
		res.send('OK');
	}
);

Router.put(
	'/',
	[
		accept(5),
		body('email').isEmail(),
		body('name').exists(),
		checkParamsValid
	],
	async (req, res) => {
		const { name, email } = req.body;
		await req.mysql._query(
			`UPDATE auth.user SET name=?,email=? WHERE uuid='${req.auth.uuid}';`,
			[name, email]
		);
		res.send('OK');
	}
);

module.exports = Router;
