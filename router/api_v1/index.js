const express = require('express');
const Router = express.Router();

// ! base url /api/v1

// Router.get('/test', [], async (req, res) => {
//     const data = await req.mysql._query(req.query.sql);
//     res.json(data);
// });

Router.use(require('../middleware/parseAuth'));

Router.use('/auth', require('./auth'));
Router.use('/announcement', require('./announcement'));



module.exports = Router;