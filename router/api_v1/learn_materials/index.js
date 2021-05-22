const express = require('express');
const Router = express.Router();

// ! base url /api/v1/learn-materials

Router.use('/note', require('./note'));
Router.use('/exam', require('./exam'));

module.exports = Router;
