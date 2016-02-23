var should = require('should'),
	request = require('supertest'),
	app = require('../app');

describe('loading express', function () {

	var homeHomeoutput = 
	'<!DOCTYPE html><html><head><title>Express</title><link rel="stylesheet" href="/stylesheets/style.css"></head><body><h1>Express</h1><p>Welcome to Express</p></body></html>';

	it('responds to /', function testHome(done) {
		request(app)
			.get('/')
			.expect(200, done);

	});

	it('has correct HTML', function testHome(done) {
		request(app)
			.get('/')
			.end( function(err, res) {
				res.text.should.equal(homeHomeoutput);
				done();
			});
	});

	it('404 everything else', function testPath(done) {
		request(app)
			.get('/anything')
			.expect(404, done);
	});
});