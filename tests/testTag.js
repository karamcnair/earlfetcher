var should = require('should'),
	request = require('supertest')
	assert = require('assert'),
	Tag = require('../models/tag');

describe('testing Tag', function () {

console.log(tag.encodedString());

	it('is an opening tag with attributes', function testHome(done) {
		var tag = new Tag("<html thing='this' otherthing='that'>");
		assert.equal(tag.getName(), "html");
		assert.equal(tag.getType(),"open");
		assert.equal(tag.getAttributes(),"thing='this' otherthing='that'");
		done();
	});

	it('is an opening tag without attributes', function testHome(done) {
		var tag = new Tag("<html >");
		assert.equal(tag.getName(),"html");
		assert.equal(tag.getType(),"open");
		assert.equal(tag.getAttributes(),"");
		done();
	});

	it('is a closing tag', function testHome(done) {
		var tag = new Tag("</html>");
		assert.equal(tag.getName(),"html");
		assert.equal(tag.getType(), "close");
		assert.equal(tag.getAttributes(),"");
		done();
	});

	it('is a self-closing tag with attributes', function testHome(done) {
		var tag = new Tag("<img src='http://www.google.com/img'  />");
		assert.equal(tag.getName(),"img");
		assert.equal(tag.getType(), "selfclosing");
		assert.equal(tag.getAttributes(),"src='http://www.google.com/img'");
		done();
	});

	it('is a self-closing tag without attributes', function testHome(done) {
		var tag = new Tag("<br />");
		assert.equal(tag.getName(),"br");
		assert.equal(tag.getType(), "selfclosing");
		assert.equal(tag.getAttributes(),"");
		done();
	});
});

