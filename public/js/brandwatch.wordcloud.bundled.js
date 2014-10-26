(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function WordCloud(element) {
    'use strict';
    this.element    = element;
    this.data       = {};
}

WordCloud.prototype.parseData = function (dataset) {
    'use strict';
    this.data = JSON.parse(dataset);
    this.renderData();
    return this;
};

WordCloud.prototype.renderData = function () {
    'use strict';
    console.log(this);
    return this;
};

module.exports = WordCloud;

},{}],2:[function(require,module,exports){
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

},{"./brandwatch.wordcloud":1}]},{},[2])