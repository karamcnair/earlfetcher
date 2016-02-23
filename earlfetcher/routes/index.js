var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');

// var proxy = httpProxy.createProxyServer();

/* GET home page. */
router.get('/', function(req, res, next) {

	var urlToFetch = req.query['theUrl']
	console.log("req.query : ",  req.query);
	console.log('urlToFetch: ' + urlToFetch);

	var retrievedHTML = "";

	if (urlToFetch != undefined) {
		request(urlToFetch, function (error, response, body) {
	 		if (!error && response.statusCode == 200) {
	   		 	console.log(body); // Show the HTML for the Google homepage.	
   		 	  	res.render('index', { title: 'earlfetcher', theUrl: urlToFetch, retrievedHTML: body });
	  		} else if (!error) {
	  			res.render('index', { title: 'earlfetcher', theUrl: urlToFetch, retrievedHTML: "Could not fetch HTML: " + response.statusCode + " " + error + "." } );
	  		} else {
	  			console.log(error);
	  			res.render('index', { title: 'earlfetcher', theUrl: urlToFetch, retrievedHTML: error} );
	  		}
		});	
	} else {
  		res.render('index', { title: 'earlfetcher', theUrl: urlToFetch, retrievedHTML: "" });
  	};
});

// router.get('/getHTML', function(req, res, next) {
// 	var urlToFetch = req.query['theUrl']
// 	console.log("req.query : ",  req.query);
// 	console.log('urlToFetch: ' + urlToFetch);

// 	res.render('html', { title: 'no thanks, I already got one!', theUrl: urlToFetch});
// });

function getHTML(urlToFetch) {

	// returns array of [host, port, path]. Port value is not required.
	// I'm going to only support HTTP URLs at the moment.

	// var parsedUrl = parseUrl(urlToFetch);
	
	// if (parsdeUrl.length != 3) {
	// 	return "Sorry, we were unable to parse: " + urlToFetch;
	// }
	// else
	request('http://www.google.com', function (error, response, body) {
 		if (!error && response.statusCode == 200) {
   		 	console.log(body); // Show the HTML for the Google homepage.
   		 	return body;
  		};
	});
};

module.exports = router;
