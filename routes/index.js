var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var earlProcessor = require('../models/earlProcessor');

router.get('/', function(req, res, next) {

	var urlToFetch = req.query['theUrl'];

	if (urlToFetch != undefined) {

		urlToFetch = earlProcessor.tidyUrl(urlToFetch);

		request(urlToFetch, function (error, response, body) {
	 		if (!error && response.statusCode == 200) {

	 			var processedBody = earlProcessor.parseHTML(body);
	 			var summaryTable = processedBody.tagSummary;
	 			var outputText = processedBody.outputHTML;

	 			// (clearly 'title' is not a terribly valuable parameter to pass into JADE)
   		 	  	res.render('index', { title: 'earlfetcher', theUrl: urlToFetch, summaryTable: summaryTable, retrievedHTML: outputText });
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

module.exports = router;
