var express = require('express');
var router = express.Router();
var request = require('request');
var earlProcessor = require('../models/earlProcessor');

router.get('/', function (req, res) {
    "use strict";

    var urlToFetch = req.query.theUrl;

    if (urlToFetch !== undefined) {

        urlToFetch = earlProcessor.tidyUrl(urlToFetch);

        request(urlToFetch, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var processedBody = earlProcessor.parseHTML(body);
                var summaryTable = processedBody.tagSummary;
                var outputText = processedBody.outputHTML;

                // (clearly 'title' is not a terribly valuable parameter to pass into JADE)
                res.render('index', {title: 'earlfetcher', theUrl: urlToFetch, summaryTable: summaryTable, retrievedHTML: outputText});
            } else if (!error) {
                res.render('index', {title: 'earlfetcher', theUrl: urlToFetch, summaryTable: {}, retrievedHTML: "Could not fetch HTML. HTTP response code:" + response.statusCode + ". " + error + "."});
            } else {
                console.log(error);

                var errString = "";
                switch(error.code) {
                    case 'ENOTFOUND':
                        errString = "The host for URL '" + urlToFetch + "' could not be resolved. Please try it in your browser's address bar & make sure it's available.";
                        break;
                    default:
                        errString = "Our apologies, we were unable to retreive HTML for '" + urlToFetch + "'. The reply from the network was: " + error.toString();
                }
                console.log(errString);
                res.render('index', {title: 'earlfetcher', theUrl: urlToFetch, summaryTable: {}, retrievedHTML: errString});
            }
        });
    } else {
        res.render('index', {title: 'earlfetcher', theUrl: urlToFetch, retrievedHTML: ""});
    }
});

module.exports = router;
