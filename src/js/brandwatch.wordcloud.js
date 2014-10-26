/**
 * WordCloud
 *
 * @class
 * @param HTMLElement - The container to build the wordcloud in.
 */
function WordCloud(element) {
    'use strict';
    this.element        = element;
    this.data           = {};
    this.chunkCount     = 6;
    this.chunkSize      = null;
    this.chunkStart     = null;
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

        a.className = _this.getSentimentClass(topic.sentimentScore);
        a.className += ' ' + _this.getSizeClass(topic.volume);

        a.addEventListener('click', _this.handleClick, true);

        li.appendChild(a);
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
    var element = event.target;
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
        console.log(volume, (this.chunkSize * i) + this.chunkStart);
        if (volume <= (this.chunkSize * i) + this.chunkStart) {
            return 'size-' + i;
        }
    }
};

/**
 * Export the module for use in browserify.
 */
module.exports = WordCloud;