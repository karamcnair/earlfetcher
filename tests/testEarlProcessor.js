var assert = require('assert'),
    earlProcessor = require('../models/earlProcessor'), 
    fs = require('fs');;

describe('testing earlProcessor', function () {

    'use strict';
    it('is an empty Document', function testEmpty(done) {
    	var document = "";
        var processedBody = earlProcessor.parseHTML(document);
        var expected = "<pre></pre>";

        assert.equal(expected, processedBody.outputHTML);
        assert.deepEqual({}, processedBody.tagSummary);
        done();
    });

    it('is a relatively simple page', function testHome(done) {
        var document = fs.readFileSync('tests/sampleData/example.txt', 'utf8');
        var processedBody = earlProcessor.parseHTML(document);
        var expected = fs.readFileSync('tests/sampleData/exampleExpected.txt', 'utf8');
        assert.deepEqual(
            { html: { open: 1, close: 1 },
                head: { open: 1, close: 1 },
                title: { open: 1, close: 1 },
                meta: { open: 3 },
                style: { open: 1, close: 1 },
                body: { open: 1, close: 1 },
                div: { open: 1, close: 1 },
                h1: { open: 1, close: 1 },
                p: { open: 2, close: 2 },
                a: { open: 1, close: 1 } }, 
            processedBody.tagSummary);
        console.log(processedBody.tagSummary);
        done();
    });

    it('is a much more complex page', function testHome(done) {
        var document = fs.readFileSync('tests/sampleData/yahoo.txt', 'utf8');
        var processedBody = earlProcessor.parseHTML(document);
        var expected = fs.readFileSync('tests/sampleData/yahooExpected.txt', 'utf8');
        assert.deepEqual(
            { html: { open: 1, close: 1 },
            head: { open: 1, close: 1 },
            meta: { open: 14 },
            title: { open: 1, close: 1 },
            link: { open: 19 },
            style: { open: 14, close: 14 },
            body: { open: 1, close: 1 },
            strong: { open: 1, close: 1 },
            div: { open: 358, close: 358 },
            ul: { open: 61, close: 61 },
            li: { open: 280, close: 280 },
            a: { open: 241, close: 241 },
            i: { open: 94, close: 94 },
            b: { open: 91, close: 91 },
            br: { open: 2},
            btn: { open: 1, close: 1 },
            table: { open: 3, close: 3 },
            select: { open: 3, close: 3 },
            label: { open: 1, close: 1 },
            tr: { open: 6, close: 6 },
            td: { open: 17, close: 17 },
            form: { open: 5, close: 5 },
            tbody: { open: 2, close: 2 },
            thead: { open: 1, close: 1 },
            th: { open: 4, close: 4 },
            input: { open: 6 },
            option: { open: 24, close: 24 },
            u: { open: 2, close: 2 },
            img: { open: 102 },
            h3: { open: 36, close: 36 },
            p: { open: 77, close: 77 },
            span: { open: 87, close: 87 },
            button: { open: 16, close: 16 },
            h2: { open: 8, close: 8 },
            h1: { open: 1, close: 1 },
            h4: { open: 5, close: 5 },
            ol: { open: 2, close: 2 },
            noscript: { open: 7, close: 7 },
            script: { open: 12, close: 12 } }, 
        processedBody.tagSummary);
        done();
    });
   

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

