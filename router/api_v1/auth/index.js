const express = require('express');
const Router = express.Router();

// ! base url /api/v1/auth

Router.use(require('../../middleware/parseAuth'));

Router.use('/staff', require('./staff'));
Router.use('/user', require('./user'));

module.exports = Router;