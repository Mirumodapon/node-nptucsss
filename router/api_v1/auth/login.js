const express = require('express');
const Router = express.Router();

// ! base url /api/v1/auth/login

const crypto = require('crypto');
const uuid = require('uuid');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkoutIdfromUrl = require('../../middleware/checkoutIdfromUrl');
const checkoutIdfromBody = require('../../middleware/checkoutIdfromBody');
const checkParamsValid = require('../../middleware/checkParamsValid');

Router.post(
	'/',
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
			const [staff] = await req.mysql._query(
				`SELECT * FROM auth.staff WHERE email='${email}';`
			);
			const [user] = await req.mysql._query(
				`SELECT * FROM auth.user WHERE email='${email}';`
			);
			const auth = staff || user;
			if (!auth) return res.status(400).json({ msg: 'Login Failed' });
			const isMatch = await bcrypt.compare(password, auth.password);
			if (!isMatch) {
				return res.status(400).json({
					msg: 'Login failed'
				});
			}
			await req.mysql._query(
				`UPDATE auth.staff SET last_login=? WHERE uuid='${auth.uuid}';`,
				[new Date()]
			);
			await req.mysql._query(
				`UPDATE auth.user SET last_login=? WHERE uuid='${auth.uuid}';`,
				[new Date()]
			);
			const token_payload = {
				uuid: auth.uuid
			};
			jwt.sign(
				token_payload,
				process.env.jwt_secret,
				{},
				(erro, token) => {
					if (erro) throw erro;
					res.json({
						msg: 'Login successed',
						uuid: auth.uuid,
						type:
							auth.authority !== undefined
								? auth.authority
								: 'user',
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
