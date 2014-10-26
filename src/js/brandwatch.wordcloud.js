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
