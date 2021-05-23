const express = require('express');
const Router = express.Router();

// ! base url /api/v1/auth

Router.use('/staff', require('./staff'));
Router.use('/user', require('./user'));
Router.use('/login', require('./login'));

module.exports = Router;
