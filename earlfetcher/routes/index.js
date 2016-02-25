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
	var testText='<!DOCTYPE html><html><head><title>Express</title><link rel="stylesheet" href="/stylesheets/style.css"></head><body><h1>Express</h1><p>Welcome to Express</p><p>Welcome to Express</p><p>Welcome to Express</p><p>Welcome to Express</p></body></html>';

	if (urlToFetch != undefined) {
		request(urlToFetch, function (error, response, body) {
	 		if (!error && response.statusCode == 200) {

	 			var summaryTable = parseHTML(body);
	 			var outputText = injectSpans(body);
	 			console.log(body);

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

	var parsedText = "";

	var parser = new htmlparser.Parser({

	    onopentag: function(name, attribs){
	    	// will need to create a printAttributes thing
	    	var stringToPrint = "<div class=" + name + ">" + "&lt;" + name + " " + attribs + "&gt;</div>";
	    	// console.log(stringToPrint);
	    	parsedText += stringToPrint;
	    	tagHash.addOpenTag(name);
	    },

	    onclosetag: function(name){
	   		var stringToPrint = "<div class=" + name + ">" + "&lt;/" + name  +"&gt;</div>";
	    	// console.log(stringToPrint);
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

	parser.write(rawHTML);
	parser.end();

	var summaryTable = tagHash.getTagHash();
	return summaryTable;
};

// at the moment, this just walks the string & only logs tags. The string itself should be returned unchanged.
function injectSpans(string) {

	var outputText = "<pre>";
	var openTagRE = /</;
	var directiveOrCDataRE = /(<![\s\S]*?>)/;
	var commentRE =  /(<!--[\s\S]*?-->)/;
    var tagRE=/<[^>]*?(?:(?:('|")[^\1]*?\1)[^>]*?)*>/;


    var nextOpenBracket = openTagRE.exec(string);

    // I think I'm accidentally eating white space here. I need to concat the stuff that's NOT matched
    // by the regexes. And ideally, I don't let JADE do the pre transform for me. Although I need to preserve
    // the whitespace somehow.

    while (nextOpenBracket) { 
    	// if this is a comment, we want to grab the entire comment & just copy it over as-is.
    	// first, grab all the text up until that point & add it to output.
    	// but length won't work b/c I'm adding chars with the substitution/encoding of HTML entities.

    	outputText += string.substring(0, nextOpenBracket.index-1);
    	string = string.substring(nextOpenBracket.index);
    	console.log("outputText: ", outputText);
    	console.log("eating the string, currently at: ", string);

    	var commentText = commentRE.exec(string);

    	if (commentText) {
    		// copy it over & skip along!
    		// outputText+= encode(commentText[0]);
    		outputText+= encode(commentText[0]);
    		string = string.substring(commentText[0].length);
    	} 
    	else {
    		var directiveOrCDataText = directiveOrCDataRE.exec(string.substring(nextOpenBracket.index));
    		if (directiveOrCDataText) {
 			    // copy it over & skip along!
	    		// outputText += encode(directiveOrCDataText[0]);
	    		outputText += encode(directiveOrCDataText[0]);
	    		string = string.substring(directiveOrCDataText[0].length);
	    	}
	    	else {
	    		// pretty sure we have a tag here
    		    var thisTag = tagRE.exec(string);
			    console.log(thisTag);

			    if(thisTag) {
			        aTag = thisTag[0];
			        string =  string.substring(aTag[0].length);

			        var tag = new Tag(thisTag[0]);
			        outputText += tag.encodedString();
    			}
	    	}
    	}
     	nextOpenBracket = openTagRE.exec(string);
    }

    outputText += "</pre>";
    console.log("outputtext = ", outputText);
    return outputText;
}


function encode(string) {
	// whatever this is, all we have to do is replace its first char with &lt; and its last with &gt;
	var encodedString = "&lt;" + string.substring(1,string.length-1) + "&gt;";
	console.log("encodedString = ", encodedString);
	return (encodedString)
}

module.exports = router;
