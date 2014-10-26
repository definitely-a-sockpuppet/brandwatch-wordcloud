/*
 *  Exceedingly simple server just to serve up
 *  files and to provide a json endpoint.
 */
var express = require('express');
var app     = express();
var fs      = require('fs');

app.use(express.static(__dirname + '/public'));

/**
 * Literally just a json response dumping the provided
 * topics.json file.
 */
app.get('/topics', function (request, response) {
    'use strict';
    var topics = fs.readFileSync('src/json/topics.json', 'utf8');
    response.status(200).json(topics);
});

app.listen(3000);
console.log('Listening on port 3000.');
