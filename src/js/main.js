var WordCloud   = require('./brandwatch.wordcloud');
var wc          = new WordCloud(document.getElementById('word-cloud'));
var request     = new XMLHttpRequest();

/**
 * Simply grab the json from the /topics endpoint
 * and - if successful - allow the WordCloud plugin
 * to parse the data, and then render it.
 *
 * Throw an error if it fails to retrieve the topics.
 * The error handling is pretty minimal here, but it
 * at least checks if the server responded OK, if not,
 * try checking the server.js log.
 */
request.open('GET', '/topics', true);
request.send();

request.onload = function () {
    'use strict';
    if (request.status === 200) {
        wc.parseData(JSON.parse(request.responseText))
          .render();
    } else {
        throw new Error('Failed to retrieve topics.');
    }
};
