var should = require('should'),
	request = require('supertest'),
	app = require('../app');

describe('loading express', function () {

	var homeHtml = '<!DOCTYPE html><html><head><title>earlfetcher</title><link rel="stylesheet" href="/stylesheets/style.css">' 
	  + '<script src="/javascripts/main.js"></script></head><body><h1><a id="linkHome" href="/">earlfetcher</a></h1>' 
	  + '<h3>Please enter the URL to retrieve and parse </h3><div class="requestedUrl">' 
	  + '<form id="theForm" name="requestedUrl" action="/" method="get"><input id="theTextField" type="text" name="theUrl" value=""></form>'
	  + '<p class="hint">(including the "http://" or "https://")</p></div></body></html>';
	it('responds to /', function testHome(done) {
		request(app)
			.get('/')
			.expect(200, done);

	});

	it('has correct HTML', function testHome(done) {
		request(app)
			.get('/')
			.end( function(err, res) {
				res.text.should.equal(homeHtml);
				done();
			});
	});

	it('404 everything else', function testPath(done) {
		request(app)
			.get('/anything')
			.expect(404, done);
	});
});

