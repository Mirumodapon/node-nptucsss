const express = require('express');
require('dotenv').config();
// create express app
const app = express();

// include mysql
const mysql = require('./mySQL');

// use middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, _, next) => {
    req.mysql = mysql;
    next();
});
// use Router
app.use('/api/v1', require('./router/api_v1'));
// start server
const server = app.listen(process.env.PORT || 5000, () =>
    console.log(`Served on port ${process.env.PORT || 5000}`)
);