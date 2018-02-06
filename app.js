const express = require('express');
const app = express();

//use: is a middleware, middleware give some respond
app.use((req, res, next) => {
    res.status(200).json({
        message: 'It works!'
    });
});

module.exports = app;