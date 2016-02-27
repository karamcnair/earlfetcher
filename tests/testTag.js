var assert = require('assert'),
    Tag = require('../models/tag');

describe('testing Tag', function () {

    'use strict';
    it('is an opening tag with attributes', function testHome(done) {
        var tag = new Tag('html', 'open', {thing: 'this', otherthing: 'that'});
        assert.equal(tag.getName(), 'html');
        assert.equal(tag.getType(), 'open');
        assert.equal(tag.getAttributes(), "thing='this' otherthing='that'");
        done();
    });

    it('is an opening tag without attributes', function testHome(done) {
        var tag = new Tag('html', 'open');
        assert.equal(tag.getName(), 'html');
        assert.equal(tag.getType(), 'open');
        assert.equal(tag.getAttributes(), '');
        done();
    });

    it('is a closing tag', function testHome(done) {
        var tag = new Tag('html', 'close');
        assert.equal(tag.getName(), 'html');
        assert.equal(tag.getType(), 'close');
        assert.equal(tag.getAttributes(), '');
        done();
    });

    it('is a void tag with attributes', function testHome(done) {
        var tag = new Tag('img', 'open', {src: 'http://www.google.com/img'});
        assert.equal(tag.getName(), 'img');
        assert.equal(tag.getType(), 'open');
        assert.equal(tag.getAttributes(), "src='http://www.google.com/img'");
        done();
    });

    it('is a void tag without attributes', function testHome(done) {
        var tag = new Tag('br', 'open');
        assert.equal(tag.getName(), 'br');
        assert.equal(tag.getType(), 'open');
        assert.equal(tag.getAttributes(), '');
        done();
    });
});

