var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var htmlparser = require("htmlparser2");
var TagHash = require('../models/taghash');
var Tag = require('../models/tag');
var Entities = require('html-entities').AllHtmlEntities;

var tagHash = new TagHash();
var entities = new Entities();

router.get('/', function(req, res, next) {

	var urlToFetch = req.query['theUrl']

	var retrievedHTML = "";

	if (urlToFetch != undefined) {
		request(urlToFetch, function (error, response, body) {
	 		if (!error && response.statusCode == 200) {

	 			tagHash = new TagHash();

	 			var outputText = parseHTML(body);
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


function parseHTML(rawHTML) {

    var outputHTML = "<pre>";

	var parser = new htmlparser.Parser({

	    onopentag: function(name, attribs){
            var tag = new Tag(name, 'open', attribs);
            outputHTML += tag.encodedString();
	    	tagHash.addOpenTag(name);
	    },

	    onclosetag: function(name){
            var tag = new Tag(name, 'close');

            if(tag.selfClosingVoidTags.indexOf(name) < 0) {
                outputHTML += tag.encodedString();

	            tagHash.addCloseTag(name);
            }
	    },

        ontext: function(text) {
            outputHTML += entities.encode(text);
        },
        onprocessinginstruction: function(name, data) {
            outputHTML += entities.encode("<" + data + ">");
        },
        oncomment: function(text) {
            outputHTML += entities.encode("<!--" + text +"-->");
        },
        onerror: function(error) {
            outputHTML += "<h3 color:'red'> Error in HTMLparser2: " + error + "</h3>";
        }
	 },
	{decodeEntities: true});

	parser.write(rawHTML);
	parser.end();

    outputHTML += "</pre>";

	return outputHTML;
};



module.exports = router;
