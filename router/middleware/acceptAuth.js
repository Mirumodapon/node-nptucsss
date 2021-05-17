module.exports = function (auth) {
    return (req, res, next) => {
        if (req.auth.authority <= auth) next();
        else res.status(401).json('Authorization Denied');
    }
}