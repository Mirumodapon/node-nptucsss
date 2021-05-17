module.exports = function (auth) {
    return (req, res, next) => {
        if (auth === 'null') res.status(401).json('Authorization Denied');
        if (req.auth.authority <= auth) next();
        else res.status(401).json('Authorization Denied');
    }
}