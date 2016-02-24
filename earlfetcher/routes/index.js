var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var htmlparser = require("htmlparser2");
var TagHash = require('../models/taghash');
var Tag = require('../models/tag');

var tagHash = new TagHash();

router.get('/', function(req, res, next) {

	var urlToFetch = req.query['theUrl']
	console.log("req.query : ",  req.query);
	console.log('urlToFetch: ' + urlToFetch);

	var retrievedHTML = "";

	if (urlToFetch != undefined) {
		request(urlToFetch, function (error, response, body) {
	 		if (!error && response.statusCode == 200) {

	 			var summaryTable = parseHTML(body);

   		 	  	res.render('index', { title: 'earlfetcher', theUrl: urlToFetch, summaryTable: summaryTable, retrievedHTML: body });
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

	var testText='<!DOCTYPE html><html><head><title>Express</title><link rel="stylesheet" href="/stylesheets/style.css"></head><body><h1>Express</h1><p>Welcome to Express</p><p>Welcome to Express</p><p>Welcome to Express</p><p>Welcome to Express</p></body></html>';
;
	var parsedText = "";

	var parser = new htmlparser.Parser({

	    onopentag: function(name, attribs){
	    	// will need to create a printAttributes thing
	    	var stringToPrint = "<div class=" + name + ">" + "&lt;" + name + " " + attribs + "&gt;</div>";
	    	console.log(stringToPrint);
	    	parsedText += stringToPrint;
	    	tagHash.addOpenTag(name);
	    },

	    onclosetag: function(name){
	   		var stringToPrint = "<div class=" + name + ">" + "&lt;/" + name  +"&gt;</div>";
	    	console.log(stringToPrint);
	    	parsedText += stringToPrint;
	    	tagHash.addCloseTag(name);
	    },

	    ontext: function(text) {
    	    parsedText += text;
	    },

	    oncdatastart: function(data) {
	    	parsedText += data;
	    },

	    oncdataend: function(data) {
	    	parsedText += data;
	    },

	    oncomment: function(data) {
	    	parsedText += data;
	    },

	    oncommentend: function(data) {
	    	parsedText += data;
	    },

	    onerror: function(data) {
	    	console.log(error);
	    },

	    onprocessinginstruction: function(instruction) {
		   	var stringToPrint = "&gt;!" + instruction + "" + "&lt;";
	    	parsedText+= instruction;
	    },

	    onreset: function() {

	    }
	 },
	{decodeEntities: true});

	parser.write(testText);
	parser.end();

	var summaryTable = tagHash.getTagHash();

	injectSpans(testText);
	return summaryTable;
};



// at the moment, this just walks the string & only logs tags. The string itself should be returned unchanged.
function injectSpans(string) {
	var testText='<!DOCTYPE html><html><head><title>Express</title><link rel="stylesheet" href="/stylesheets/style.css"></head><body><h1>Express</h1><p>Welcome to Express</p><p>Welcome to Express</p><p>Welcome to Express</p><p>Welcome to Express</p></body></html>';

	var outputText = "";
	var openTagRE = /</;
	var directiveOrCDataRE = /(<![\s\S]*?>)/;
	var commentRE =  /(<!--[\s\S]*?-->)/;
    var tagRE=/<[^>]*?(?:(?:('|")[^\1]*?\1)[^>]*?)*>/;

    var nextOpenBracket = openTagRE.exec(string);

    while (nextOpenBracket) { 
    	// if this is a comment, we want to grab the entire comment & just copy it over as-is.
    	var commentText = commentRE.exec(string[nextOpenBracket.index]);
    	if (commentText) {
    		// copy it over & skip along!
    		outputText+= commentText[0];
    		string = string.substring(commentText.index + string.length);
    	} 
    	else {
    		var directiveOrCDataText = directiveOrCDataRE.exec(string[nextOpenBracket.index]);
    		if (directiveOrCDataText) {
 			    // copy it over & skip along!
	    		outputText += directiveOrCDataText[0];
	    		string = string.substring(directiveOrCDataText.index + string.length);
	    	}
	    	else {
	    		// pretty sure we have a tag here
	    		    var thisTag = tagRE.exec(string);
				    // console.log(thisTag);

				    if(thisTag) {
				        stringy = thisTag[0];
				        console.log(stringy);
				        string =  string.substring(thisTag.index + stringy.length);
				        var tag = new Tag(thisTag[0]);
				        outputText += tag.encodedString();
    			}
	    	}
    	}
     nextOpenBracket = openTagRE.exec(string);
    }

    console.log(outputText);
    return outputText;
}

module.exports = router;
