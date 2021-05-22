const nodemailer = require('nodemailer');

const sendMail = async ({ from, to, subject, text, html }) => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.email_user,
				pass: process.env.pass
			}
		});
		const info = await transporter.sendMail({
			from,
			to,
			subject,
			text,
			html
		});
		return info;
	} catch (erro) {
		console.log(erro);
		return erro;
	}
};

module.exports = sendMail;
