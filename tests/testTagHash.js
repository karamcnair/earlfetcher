var should = require('should'),
	request = require('supertest')
	assert = require('assert'),
	TagHash = require('../models/taghash');

describe('testing TagHash', function () {

	it('has no tags', function testHome(done) {
		var tagHash = new TagHash();
		assert.deepEqual({}, tagHash.getTagHash());
		// assert.equal(tag.getType(),"open");
		// assert.equal(tag.getAttributes(),"thing='this' otherthing='that'");
		done();
	});

	it('has a few open tags', function testHome(done) {
		var tagHash = new TagHash();
		tagHash.addOpenTag('html');
		tagHash.addOpenTag('img');
		tagHash.addOpenTag('img');
		tagHash.addOpenTag('body');
		assert.deepEqual( { html: { open: 1 }, img: { open: 2 }, body: { open: 1 } }, tagHash.getTagHash());
		done();
	});

	it('has a few closing tags', function testHome(done) {
		var tagHash = new TagHash();
		tagHash.addCloseTag('script');
		tagHash.addCloseTag('div');
		tagHash.addCloseTag('table');
		tagHash.addCloseTag('table');
		assert.deepEqual( { script: { close: 1 }, div: { close: 1 }, table: { close: 2 } }, tagHash.getTagHash());
		done();
	});

	it('has a mix of open and close tags', function testHome(done) {
		var tagHash = new TagHash();
		tagHash.addOpenTag('html');
		tagHash.addOpenTag('head');
		tagHash.addCloseTag('head');
		tagHash.addOpenTag('body');
		tagHash.addOpenTag('script');
		tagHash.addCloseTag('script');
		tagHash.addOpenTag('div');
		tagHash.addCloseTag('div');
		tagHash.addOpenTag('table');
		tagHash.addCloseTag('table');
		tagHash.addOpenTag('img');
		tagHash.addOpenTag('img');
		tagHash.addCloseTag('body');
		tagHash.addCloseTag('html');
		assert.deepEqual( 
			{ html: { open: 1, close: 1 },
  			  head: { open: 1, close: 1 },
  			  body: { open: 1, close: 1 },
  			  script: { open: 1, close: 1 }, 
  			  div: { open: 1, close: 1 }, 
  			  table: { open: 1, close: 1 }, 
  			  img: {open: 2}}, 
  			tagHash.getTagHash());
		done();
	});
});

