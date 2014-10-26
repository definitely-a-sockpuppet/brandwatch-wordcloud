(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * WordCloud
 *
 * @class
 * @param HTMLElement - The container to build the wordcloud in.
 */
function WordCloud(element) {
    'use strict';
    this.element        = element;  // HTMLElement to add the wordlist to
    this.data           = {};       // Dataset from topics.json
    this.chunkCount     = 6;        // Amount of chunks to break the volumes into
    this.chunkSize      = null;     // Size of each chunk
    this.chunkStart     = null;     // Minimum volume to offset chunk sizes
}


/**
 * parseData
 * Takes the data returned from the /topics endpoint. Nothing really
 * needs doing to it, barring a simple JSON.parse to make it into a
 * js object.
 *
 * Then it determins the minimum and maximum volumes available and
 * finds out the cutoff points for the 6 (or however many) chunks
 * which are used to determine which of the sizes the selected
 * tag would be in.
 *
 * @param   dataset     - Object returned by /topics endpoint, more specifically the provided topics.json.
 * @return  WordCloud   - Itself for method chaining.
 */
WordCloud.prototype.parseData = function (dataset) {
    'use strict';
    this.data = JSON.parse(dataset);

    var min = Number.POSITIVE_INFINITY;
    var max = Number.NEGATIVE_INFINITY;

    this.data.topics.forEach(function (topic) {
        if (topic.volume < min) {
            min = topic.volume;
        }
        if (topic.volume > max) {
            max = topic.volume;
        }
    });

    this.chunkSize = Math.ceil((max - min) / this.chunkCount);
    this.chunkStart = min;

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

    /**
     * Second iteration through the topics will actually build
     * the html.
     */
    var ul = document.createElement('ul');
    var _this = this;

    this.data.topics.forEach(function (topic) {
        var li  = document.createElement('li');
        var a   = document.createElement('a');

        a.innerHTML = topic.label;
        a.href = '#';

        a.classList.add('topic');
        a.classList.add(_this.getSizeClass(topic.volume));
        a.classList.add(_this.getSentimentClass(topic.sentimentScore));

        /*
         *  TODO: HTMLElement.dataSet unavailable for versions of
         *  IE < 11.
         */
        a.dataSet = {};
        a.dataSet.label = topic.label;
        a.dataSet.volume = topic.volume;
        a.dataSet.positive = topic.sentiment.positive || null;
        a.dataSet.neutral = topic.sentiment.neutral || null;
        a.dataSet.negative = topic.sentiment.negative || null;

        a.addEventListener('click', _this.handleClick, true);

        li.appendChild(a);
        li.appendChild(_this.createInfoPane(a.dataSet));
        ul.appendChild(li);
    });

    this.element.innerHTML = '';
    this.element.appendChild(ul);

    return this;
};


/**
 * handleClick
 * Click handler to display the popup for the clicked tag.
 *
 * @param event
 * @return {undefined}
 */
WordCloud.prototype.handleClick = function (event) {
    'use strict';
    event.preventDefault();
    var className = 'show-info';
    // Hides the previous shown panes.
    var panes = document.getElementsByClassName(className);
    for (var i = 0; i < panes.length; i++) {
        panes[i].classList.remove(className);
    }
    // And shows the new one.
    event.target.nextSibling.classList.toggle(className);
};


/**
 * createInfoPane
 * Creates an info pane for each of the topics which will be
 * shown and hidden based on clicks.
 *
 * @param   dataSet     - Object containing data to display
 * @return  HTMLElement - info pane
 */
WordCloud.prototype.createInfoPane = function (dataSet) {
    'use strict';
    var container = document.createElement('div');
    container.className = 'infopane-container';

    var ul = document.createElement('ul');

    for (var attribute in dataSet) {
        if (dataSet.hasOwnProperty(attribute)) {
            var li = document.createElement('li');
            if (dataSet[attribute] !== null) {
                if (attribute !== 'label') {
                    li.innerHTML = attribute + ' : ' + dataSet[attribute];
                } else {
                    li.innerHTML = '<h2>' + dataSet[attribute] + '</h2>';
                }
                ul.appendChild(li);
            }
        }
    }

    var closeLink = document.createElement('a');
    closeLink.innerHTML = 'x';
    closeLink.classList.add('close');
    closeLink.href = '#';
    closeLink.addEventListener('click', function () {
        closeLink.parentElement.classList.remove('show-info');
    });
    container.appendChild(closeLink);
    container.appendChild(ul);

    return container;
};


/**
 * getSentimentClass
 * Determines the sentimentScore if it's above or below the negative
 * or positive thresholds and returns the class name to be applied
 * to the link.
 *
 * @param   sentimentScore  - The sentimentScore of the given topic.
 * @return  String          - Class name based on the score.
 */
WordCloud.prototype.getSentimentClass = function (sentimentScore) {
    'use strict';
    if (sentimentScore > 60) {
        return 'high-sentiment';
    } else if (sentimentScore < 40) {
        return 'low-sentiment';
    } else {
        return 'neutral-sentiment';
    }
};


/**
 * getSizeClass
 * Returns the class used for size based on which chunk
 * the volume falls into. This is calculated when the data
 * is originally parsed.
 *
 * @param   volume - Integer of the current topic's volume.
 * @return  String - Class name determined by where the volume sits.
 */
WordCloud.prototype.getSizeClass = function (volume) {
    'use strict';

    for (var i = 1; i <= this.chunkCount; i++) {
        if (volume <= (this.chunkSize * i) + this.chunkStart) {
            return 'size-' + i;
        }
    }
    throw new Error('Failed to assign the topic a size. This would be caused by the parseData method failing to break the chunks up properly.', volume);
};

/**
 * Export the module for use in browserify.
 *
 * This also includes a short workaround for the module.exports
 * as it works fine in the build, but phantomjs will complain
 * as it doesn't exist.
 */
var module = module === undefined ? {} : module;
module.exports = WordCloud;

},{}],2:[function(require,module,exports){
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
 * try checking the server.js stdout.
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

},{"./brandwatch.wordcloud":1}]},{},[2])