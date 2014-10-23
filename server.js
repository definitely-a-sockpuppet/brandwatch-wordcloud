/*
 *  Exceedingly simple server just to serve up
 *  files and to provide a json endpoint.
 */
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

/**
 * Literally just a json response dumping the provided
 * topics.json file.
 */
app.get('/json', function (request, response) {
    'use strict';
    response.status(200).json({'sample': 'data'});
});

app.listen(3000);
console.log('Listening on port 3000.');
