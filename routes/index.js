var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var htmlparser = require("htmlparser2");
var TagHash = require('../models/taghash');
var earlProcessor = require('../models/earlProcessor');
var Tag = require('../models/tag');
var Entities = require('html-entities').AllHtmlEntities;

var tagHash = new TagHash();
var entities = new Entities();

router.get('/', function(req, res, next) {

	var urlToFetch = req.query['theUrl'];

	if (urlToFetch != undefined) {

		urlToFetch = earlProcessor.tidyUrl(urlToFetch);

		request(urlToFetch, function (error, response, body) {
	 		if (!error && response.statusCode == 200) {

	 			tagHash = new TagHash();

	 			var outputText = earlProcessor.parseHTML(body, tagHash);
	 			var summaryTable = tagHash.getTagHash();
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
