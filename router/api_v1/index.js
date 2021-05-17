const express = require('express');
const Router = express.Router();

// ! base url /api/v1

// Router.get('/test', [], async (req, res) => {
//     const data = await req.mysql._query(req.query.sql);
//     res.json(data);
// });

Router.use('/auth', require('./auth'));



module.exports = Router;