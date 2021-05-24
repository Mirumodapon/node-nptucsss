module.exports = function(auth) {
	return (req, res, next) => {
		if (req.auth.authority === 'null')
			res.status(401).json('Authorization Denied');
		if (auth === 0) next();
		if (req.auth.authority & auth) next();
		else res.status(401).json('Authorization Denied');
	};
};
