var assert = require('assert'),
    earlProcessor = require('../models/earlProcessor');

describe('testing earlProcessor', function () {

    'use strict';
    it('is an empty Document', function testEmpty(done) {
    	var emptyDocument = "";
        var processedBody = earlProcessor.parseHTML(emptyDocument);
        var expected = "<pre></pre>";

        assert.equal(expected, processedBody.outputHTML);
        assert.deepEqual({}, processedBody.tagSummary);
        done();
    });

    // it('is an opening tag without attributes', function testHome(done) {
    //     var tag = new Tag('html', 'open');
    //     assert.equal(tag.getName(), 'html');
    //     assert.equal(tag.getType(), 'open');
    //     assert.equal(tag.getAttributes(), '');
    //     done();
    // });

    // it('is a closing tag', function testHome(done) {
    //     var tag = new Tag('html', 'close');
    //     assert.equal(tag.getName(), 'html');
    //     assert.equal(tag.getType(), 'close');
    //     assert.equal(tag.getAttributes(), '');
    //     done();
    // });

    // it('is a void tag with attributes', function testHome(done) {
    //     var tag = new Tag('img', 'open', {src: 'http://www.google.com/img'});
    //     assert.equal(tag.getName(), 'img');
    //     assert.equal(tag.getType(), 'open');
    //     assert.equal(tag.getAttributes(), "src='http://www.google.com/img'");
    //     done();
    // });

    // it('can fix a URL without a protocol', function testHome(done) {
    //     var tag = new Tag('br', 'open');
    //     assert.equal(tag.getName(), 'br');
    //     assert.equal(tag.getType(), 'open');
    //     assert.equal(tag.getAttributes(), '');
    //     done();
    // });
});

