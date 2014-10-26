/*
 *  Exceedingly simple server just to serve up
 *  files and to provide a json endpoint.
 *
 */
var express     = require('express');
var app         = express();
var fs          = require('fs');
var compression = require('compression');

/**
 * Using compression middleware to bring down the size of
 * the json response.
 */
app.use(compression({ threshold: 512 }));
app.use(express.static(__dirname + '/public', { maxAge: 3600 }));

/**
 * Literally just a json response dumping the provided
 * topics.json file.
 */
app.get('/topics', function (request, response) {
    'use strict';
    // Just reading the json from the filesystem, little bit of a cheat.
    var topics = fs.readFileSync('src/json/topics.json', 'utf8');
    response.status(200).json(topics);
});

app.listen(3000);
console.log('Listening on port 3000.');
