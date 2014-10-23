/*
 *  Exceedingly simple server just to serve up
 *  files and to provide a json endpoint.
 */
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/json', function (request, response) {
    'use strict';
    response.json(200, {'farts': 'lol'});
});

app.listen(3000);
console.log('Listening on port 3000');
