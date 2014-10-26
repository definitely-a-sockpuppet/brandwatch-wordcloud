var WordCloud   = require('./brandwatch.wordcloud');
var wc          = new WordCloud(document.getElementById('word-cloud'));
var request     = new XMLHttpRequest();

request.open('GET', '/topics', true);
request.send();

request.onload = function () {
    'use strict';
    if (request.status === 200) {
        wc.parseData(JSON.parse(request.responseText));
    } else {
        throw new Error('Failed to retrieve topics.');
    }
};
