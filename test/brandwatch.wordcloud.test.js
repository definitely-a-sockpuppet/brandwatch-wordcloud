/* globals assert, describe, WordCloud */

describe('WordCloud', function () {
    'use strict';
    var element = document.createElement('div');
    element.id = 'word-cloud';

    var sampleData = JSON.stringify({
        'topics': [
            {
                'id': '1751295897__Berlin',
                'label': 'Berlin',
                'volume': 165,
                'type': 'topic',
                'sentiment': {
                    'negative': 3,
                    'neutral': 133,
                    'positive': 29
                },
                'sentimentScore': 65,
                'burst': 13,
                'days': [
                    {
                        'date': '2014-06-06T00:00:00.000+0000',
                        'volume': 22
                    },
                    {
                        'date': '2014-06-04T00:00:00.000+0000',
                        'volume': 43
                    },
                    {
                        'date': '2014-06-09T00:00:00.000+0000',
                        'volume': 0
                    },
                    {
                        'date': '2014-06-07T00:00:00.000+0000',
                        'volume': 12
                    },
                    {
                        'date': '2014-06-08T00:00:00.000+0000',
                        'volume': 11
                    },
                    {
                        'date': '2014-06-03T00:00:00.000+0000',
                        'volume': 39
                    },
                    {
                        'date': '2014-06-05T00:00:00.000+0000',
                        'volume': 38
                    }
                ],
                'pageType': {
                    'blog': 17,
                    'facebook': 56,
                    'forum': 22,
                    'general': 5,
                    'image': 0,
                    'news': 26,
                    'review': 1,
                    'twitter': 35,
                    'video': 3
                },
                'queries': [
                    {
                        'id': 1751295897,
                        'name': 'Berghain',
                        'volume': 165
                    }
                ]
            },
            {
                'id': '1751295897__DJ',
                'label': 'DJ',
                'volume': 48,
                'type': 'topic',
                'sentiment': {
                    'neutral': 46,
                    'positive': 2
                },
                'sentimentScore': 54,
                'burst': 29,
                'days': [
                    {
                        'date': '2014-06-06T00:00:00.000+0000',
                        'volume': 4
                    },
                    {
                        'date': '2014-06-04T00:00:00.000+0000',
                        'volume': 10
                    },
                    {
                        'date': '2014-06-09T00:00:00.000+0000',
                        'volume': 0
                    },
                    {
                        'date': '2014-06-07T00:00:00.000+0000',
                        'volume': 11
                    },
                    {
                        'date': '2014-06-08T00:00:00.000+0000',
                        'volume': 3
                    },
                    {
                        'date': '2014-06-03T00:00:00.000+0000',
                        'volume': 12
                    },
                    {
                        'date': '2014-06-05T00:00:00.000+0000',
                        'volume': 8
                    }
                ],
                'pageType': {
                    'blog': 4,
                    'facebook': 13,
                    'forum': 8,
                    'general': 1,
                    'image': 0,
                    'news': 7,
                    'review': 1,
                    'twitter': 13,
                    'video': 1
                },
                'queries': [
                    {
                        'id': 1751295897,
                        'name': 'Berghain',
                        'volume': 48
                    }
                ]
            },
        ]
    });

    describe('constructor', function () {
        var wc = new WordCloud(element);
        it ('instance should have default settings applied', function () {
            assert(typeof wc.element === 'object');
            assert(typeof wc.data === 'object');
            assert.equal(wc.chunkCount, 6);
            assert.equal(wc.chunkSize, null);
            assert.equal(wc.chunkStart, null);
        });
    });

    describe('#parseData()', function () {
        var wc = new WordCloud(element);
        it('should assign the data to the WordCloud instance and work out chunk sizes', function () {
            wc.parseData(sampleData);
            assert.equal(20, wc.chunkSize);
            assert.equal(48, wc.chunkStart);
        });
    });

    describe('#getSentimentClass()', function () {
        var wc = new WordCloud(element);
        it('should return the correct class based on sentiment provided.', function () {
            assert.equal('high-sentiment', wc.getSentimentClass(70));
            assert.equal('low-sentiment', wc.getSentimentClass(20));
            assert.equal('neutral-sentiment', wc.getSentimentClass(50));
        });
    });

    describe('#getSizeClass()', function () {
        var wc = new WordCloud(element);
        wc.parseData(sampleData);
        it('should return a numeric value dictating which chunk the size falls into from 1-6', function () {
            assert.equal('size-1', wc.getSizeClass(48));
            assert.equal('size-2', wc.getSizeClass(70));
            assert.equal('size-3', wc.getSizeClass(90));
            assert.equal('size-4', wc.getSizeClass(110));
            assert.equal('size-5', wc.getSizeClass(130));
            assert.equal('size-6', wc.getSizeClass(165));
            assert.throws(function () {
                wc.getSizeClass(5387);
            }, Error, 'Should throw exception if volume given is above maximum available.');
        });
    });

    describe('#createInfoPane()', function () {
        var dataSet = {
            label: 'Test Name',
            total: 30,
            positive: 10,
            negative: 0,
            neutral: 20
        };

        var wc = new WordCloud(element);
        var infoPane = wc.createInfoPane(dataSet);

        it('should have a title based on the dataSet label', function () {
            assert.equal(infoPane.querySelectorAll('h2')[0].innerHTML, dataSet.label);
        });

        it('should have a list populated with available data', function () {
            var listItems = infoPane.querySelectorAll('li')[0];
            // Skip the first as it's the label.
            for (var i = 1; i < listItems.length; i++) {
                assert.equal(listItems[i].innerHTML, Object.keys(dataSet)[i] + ' : ' + dataSet[i]);
            }
        });
    });

    describe('#render()', function () {
        var wc = new WordCloud(element);
        wc.parseData(sampleData);
        wc.render();

        var topics = wc.element.querySelectorAll('#word-cloud > ul > li');
        var topic = topics[0].querySelectorAll('.topic')[0];

        it('should have the correct label from the topics.json file', function () {
            for (var i = 0; i < topics.length; i++) {
                assert.equal(topics[i].querySelectorAll('.topic')[0].innerHTML, wc.data.topics[i].label);
            }
        });

        it('should have a class to indicate it\'s size', function () {
            assert.equal(topic.classList[1], 'size-6');
            assert.equal(topic.classList[2], 'high-sentiment');
        });

        it('should have a set of data set with positive, negative and neutral votes', function () {
            assert.equal(topic.dataSet.label, 'Berlin');
            assert.equal(topic.dataSet.total, 165);
            assert.equal(topic.dataSet.positive, 29);
            assert.equal(topic.dataSet.neutral, 133);
            assert.equal(topic.dataSet.negative, 3);
        });
    });

    describe('#handleClick()', function () {
        var wc = new WordCloud(element);
        wc.parseData(sampleData);
        wc.render();
        it('should have a click handler to display information pane', function () {
            var topics = document.querySelectorAll('a.topic');
            for (var i = 0; i < topics.length; i++) {
                assert.equals(typeof topics[i].click, 'function');
            }
        });
    });
});
