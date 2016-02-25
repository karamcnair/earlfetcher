var htmlparser = require("htmlparser2");
var fs = require('fs');
var filename = "/Users/mcnair/Projects/application-engineer/earlfetcher/tests/www_yahoo_com.txt";
var Entities = require('html-entities').AllHtmlEntities;
var Tag = require('./models/tag.js');
 
entities = new Entities();

var retrievedHTML = fs.readFileSync(filename, 'utf8');
var chalk = require('chalk');

console.log(chalk.magenta("Dumping retrievedHTML"));
// console.log(retrievedHTML);

console.log("\n\n\n", chalk.cyan("Dumping injectSpans"));

var testText='<!DOCTYPE html><html><head><title>Express</title><!-- aaesthpoaietapiyas <><><> --><link rel="stylesheet" href="/stylesheets/style.css"></head><body><h1>Express</h1><p>Welcome to Express</p><p>Welcome to Express</p><p>Welcome to Express</p><p>Welcome to Express</p></body></html>';

var spanned = injectSpans(retrievedHTML);
// console.log(chalk.blue(spanned));

fs.writeFile("/Users/mcnair/Projects/application-engineer/earlfetcher/tests/output.txt", spanned, function(err) {
    if(err) {
        return console.log(err);
    }
});

function injectSpans(string) {

	// var testString; = '<input id="UHSearchWeb" class="D(ib) Py(0) Zoom Va(t) uhBtn Ff(ss)! Fw(40) Bxz(bb) Td(n) D(ib) Zoom Va(m) Ta(c) Bgr(rx) Bdrs(3px) Bdw(1px) M(0)! C(#fff) uh-ignore-rapid Cur(p)" type="submit" value="Search Web" data-ylk="t3:srch;t5:srchweb;slk:srchweb;elm:btn;elmt:srch;itc=0;tar:;">';
	// string = testString;
	var outputText = "<pre>";
	var openTagBracket = '<';
	var openTagRE = /</;
	var directiveOrCDataRE = /(<![^>]*>)/i;
	var commentRE =  /(<!--.*-->)/;
	var scriptRE =  /(<script>*?<\/script>)/;
    var tagRE=/<[^>]*?(?:(?:('|")[^\1]*?\1)[^>]*?)*>/;
    var strIndex = 0;

    var nextOpenBracket = string.indexOf(openTagBracket);
    // I think I'm accidentally eating white space here. I need to concat the stuff that's NOT matched
    // by the regexes. And ideally, I don't let JADE do the pre transform for me. Although I need to preserve
    // the whitespace somehow.

    while (nextOpenBracket != -1) { 
    // 	console.log("strIndex = ", strIndex);
    	// if this is a comment, we want to grab the entire comment & just copy it over as-is.
    	// first, grab all the text up until that point & add it to output.
    	// but length won't work b/c I'm adding chars with the substitution/encoding of HTML entities.
        // console.log("in nextOpenBracket");
    	outputText += entities.encode(string.substring(0, nextOpenBracket));

    	// skip ahead to where we found that first '<'
    	string = string.substring(nextOpenBracket);
    	// console.log("outputText=",chalk.yellow(outputText));
    	// console.log("string=",chalk.green(string));
		 // console.log("string: ",chalk.green(string));

    	// Regex will find the first match for each of these, so we need to determine which 
    	// is 'first' (in preferential order for matching b/c tag will match comments, and
    	// directive will match comments.
    	var commentText = commentRE.exec(string);
    	var directiveOrCDataText = directiveOrCDataRE.exec(string);
	    var tagText = tagRE.exec(string);
        var commentPosition =  -1;
        var directivePosition = -1;
        var tagPosition = -1;

	    if (commentText) {
            commentPosition = commentText.index;
            // console.log("have comment at ", commentText.index );
	    }

        if (directiveOrCDataText) {
            directivePosition = directiveOrCDataText.index;
            // console.log("have directive at ", directiveOrCDataText.index );
        }

        if (tagText) {
            tagPosition = tagText.index;
        }

        console.log("cp = ", commentPosition, "dp = ", directivePosition, "tp = ", tagPosition);

        if ((commentPosition != -1) && (commentPosition <= directivePosition) && (tagPosition >= commentPosition)) {
            // comment is more specific than directive.
            console.log("in comment: string = ", chalk.green(commentText[0]), "length = ", commentText[0].length);
            outputText+= entities.encode(commentText[0]);
            // console.log("string substring = ", chalk.cyan(string.substring(commentText[0].length)));

            string = string.substring(commentText[0].length);

            // console.log("string = ", chalk.magenta(string));
        }
        else if ((directivePosition != -1) && (directivePosition <= tagPosition)) {
            // directive is more specific than tag
            console.log("in directive:  ", chalk.magenta(directiveOrCDataText[0]));
            outputText += entities.encode(directiveOrCDataText[0]);


            string = string.substring(directiveOrCDataText[0].length);
            // console.log("string = ", chalk.grey(string));
        }
        else if (tagPosition != -1) {
            // we have a tag!
            string =  string.substring(tagText[0].length);
            var tag = new Tag(tagText[0]);
            outputText += tag.encodedString();
            console.log("in tag:", chalk.yellow(tagText[0]));

        } 
        else {
            // randomly matched "<" in the text? Seems unlikely, but we might as well include it.
            outputText += entities.encode(string.charAt(nextOpenBracket));
            string =  string.substring(1);
    	}
     	nextOpenBracket = string.indexOf(openTagBracket);
    }

    outputText += "</pre>";
    // console.log("outputtext = ", outputText);
    return outputText;
}
