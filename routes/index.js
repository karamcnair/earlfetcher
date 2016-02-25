var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');
var htmlparser = require("htmlparser2");
var TagHash = require('../models/taghash');
var Tag = require('../models/tag');
var Entities = require('html-entities').AllHtmlEntities;
var chalk = require('chalk');

var fs = require('fs');


var tagHash = new TagHash();
var entities = new Entities();

router.get('/', function(req, res, next) {

	var urlToFetch = req.query['theUrl']

	var retrievedHTML = "";

	if (urlToFetch != undefined) {
		request(urlToFetch, function (error, response, body) {
	 		if (!error && response.statusCode == 200) {

	 			var summaryTable = parseHTML(body);
	 			var outputText = injectSpans(body);

                // console.log(body);
fs.writeFile("/Users/mcnair/Projects/application-engineer/output/output.txt", body, function(err) {
    if(err) {
        return console.log(err);
    }
});

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
	    	tagHash.addOpenTag(name);
	    },

	    onclosetag: function(name){
	    	tagHash.addCloseTag(name);
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

	// var testString; = '<input id="UHSearchWeb" class="D(ib) Py(0) Zoom Va(t) uhBtn Ff(ss)! Fw(40) Bxz(bb) Td(n) D(ib) Zoom Va(m) Ta(c) Bgr(rx) Bdrs(3px) Bdw(1px) M(0)! C(#fff) uh-ignore-rapid Cur(p)" type="submit" value="Search Web" data-ylk="t3:srch;t5:srchweb;slk:srchweb;elm:btn;elmt:srch;itc=0;tar:;">';
	// string = testString;
	var outputText = "<pre>";
	var openTagBracket = '<';
	var openTagRE = /</;
	var directiveOrCDataRE = /(<![^>]*>)/i;
	var commentRE =  /(<!--.*-->)/;
	var scriptRE =  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    var tagRE=/<[^>]*?(?:(?:('|")[^\1]*?\1)[^>]*?)*>/;
    var strIndex = 0;

    var nextOpenBracket = string.indexOf(openTagBracket);

    while (nextOpenBracket != -1) { 
    	// if this is a comment, we want to grab the entire comment & just copy it over as-is.
    	// first, grab all the text up until that point & add it to output.
    	// but length won't work b/c I'm adding chars with the substitution/encoding of HTML entities.
    	outputText += entities.encode(string.substring(0, nextOpenBracket));

    	// skip ahead to where we found that first '<'
    	string = string.substring(nextOpenBracket);

    	// Regex will find the first match for each of the patterns, so we need to determine which 
    	// is 'first' (in preferential order for matching b/c tag will match directive, and
    	// directive will match comments)
    	var commentText = commentRE.exec(string);
    	var directiveOrCDataText = directiveOrCDataRE.exec(string);
        var scriptText = scriptRE.exec(string);
	    var tagText = tagRE.exec(string);
        var commentPosition =  -1;
        var directivePosition = -1;
        var tagPosition = -1;
        var scriptPosition = -1;

	    if (commentText) {
            commentPosition = commentText.index;
	    }

        if (directiveOrCDataText) {
            directivePosition = directiveOrCDataText.index;
        }

        if (scriptText) {
            scriptPosition = scriptText.index;
        }

        if (tagText) {
            tagPosition = tagText.index;
        }

        if ((commentPosition != -1) && (commentPosition <= directivePosition) && (tagPosition >= commentPosition)) {
            // comment is more specific than directive.
            outputText+= entities.encode(commentText[0]);
            string = string.substring(commentText[0].length);
        }
        else if ((directivePosition != -1) && (directivePosition <= tagPosition)) {
            // directive is more specific than tag
            outputText += entities.encode(directiveOrCDataText[0]);
            string = string.substring(directiveOrCDataText[0].length);
        }
        else if ((scriptPosition != -1) && (scriptPosition <= tagPosition))  {
            // we need to get everything in the script and encode it
            // console.log("string: ", string, "scriptPos:" , scriptPosition, "scriptText: ", scriptText);

            // the opening script tag may have attributes.
            var openScriptTag = tagRE.exec(scriptText[0]);
            var openScriptText = "<span class='script'>" + entities.encode(openScriptTag[0]) + "</span>";
            var closeScriptText = "<span class='script'>" + entities.encode("</script>") + "</span>";

            var textToAdd = openScriptText + 
              entities.encode(scriptText[0].substring(openScriptTag[0].length, scriptText[0].substring.length - "</script>".length)) +
               + closeScriptText;
            console.log("script: ", chalk.magenta(scriptText[0]));
            console.log("textToAdd: ", chalk.cyan(scriptText[0]));
            outputText += textToAdd;

            string = string.substring(scriptText[0].length);
            console.log("string = ", chalk.green(string));
        }
        else if (tagPosition != -1) {
            // we have a tag!
            var tag = new Tag(tagText[0]);
            outputText += tag.encodedString();
            string =  string.substring(tagText[0].length);

        } 
        else {
            // randomly matched "<" in the text? Seems unlikely, but encode & include it.
            outputText += entities.encode(string.charAt(nextOpenBracket));
            string =  string.substring(1);
    	}
     	nextOpenBracket = string.indexOf(openTagBracket);
    }

    outputText += "</pre>";
    return outputText;
}


module.exports = router;
