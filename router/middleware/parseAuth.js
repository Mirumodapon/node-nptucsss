const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
    const token = req.header("x-auth-token");
    try {
        if (!token) {
            throw new Error('no token');
        }
        const decoded = jwt.verify(token, process.env.jwt_secret);

        const [user] = await req.mysql._query(`SELECT uuid FROM auth.user WHERE uuid='${decoded.uuid}';`);
        if (user) {
            req.auth = {
                type: 'user',
                authority: 5,
                uuid: decoded.uuid
            };
            return next();
        }
        const [staff] = await req.mysql._query(`SELECT uuid,authority FROM auth.staff WHERE uuid='${decoded.uuid}';`);
        if (staff) {
            req.auth = {
                type: 'staff',
                uuid: decoded.uuid,
                authority: staff.authority
            };
            return next();
        }
        req.auth = 'null';
        return next();
    } catch (err) {
        req.auth = 'null';
        return next();
    }
}