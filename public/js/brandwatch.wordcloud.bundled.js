(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * WordCloud
 *
 * @class
 * @param HTMLElement - The container to build the wordcloud in.
 */
function WordCloud(element) {
    'use strict';
    this.element    = element;
    this.data       = {};
}


/**
 * parseData
 * Takes the data returned from the /topics endpoint. Nothing really
 * needs doing to it, barring a simple JSON.parse to make it into a
 * js object.
 *
 * @param   dataset     - Object returned by /topics endpoint, more specifically the provided topics.json.
 * @return  WordCloud   - Itself for method chaining.
 */
WordCloud.prototype.parseData = function (dataset) {
    'use strict';
    this.data = JSON.parse(dataset);
    this.render();
    return this;
};


/**
 * render
 * Takes the parsed dataset and iterates each topic, creating elements
 * as it goes and builds a complete list of each of the topics.
 *
 * It's worth noting that while I am going through and building each
 * part of the template piece by piece, using a templating engine
 * such as Mustache or Handlebars would be a better solution. But
 * the inclusion of a template rendering plugin would all 100kb to
 * the page load for, in essence, a single block of fairly simple html.
 *
 * If this plugin were to be tailored for something such as angular,
 * backbone, or whatever else, piggybacking whichever template
 * renderer is being used there would be a more elegant solution.
 *
 * TODO: Add secondary rendering methods which accommodate
 * Mustache / Handlebars templates.
 *
 * @return WordCloud - Itself for method chaining.
 */
WordCloud.prototype.render = function () {
    'use strict';
    if (this.data === null) {
        throw new Error('Dataset has not yet been set and is null. Please add data using the WordCloud.parseData method.');
    }

    var ul = document.createElement('ul');

    this.data.topics.forEach(function (topic) {
        var li  = document.createElement('li');
        var a   = document.createElement('a');

        a.innerHTML = topic.label;
        a.href = '#';

        /**
         * Quick and dirty colouring.
         *
         * @return {undefined}
         */
        if (topic.sentimentScore > 60) {
            a.style.color = '#0f0';
        } else if (topic.sentimentScore < 40) {
            a.style.color = '#f00';
        } else {
            a.style.color = '#777';
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    this.element.innerHTML = '';
    this.element.appendChild(ul);

    return this;
};


/**
 * Export the module for use in browserify.
 */
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