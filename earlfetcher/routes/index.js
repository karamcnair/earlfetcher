var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	var urlToFetch = req.query['theUrl']
	console.log("req.query : ",  req.query);
	console.log('urlToFetch: ' + urlToFetch);

  	res.render('index', { title: 'earlfetcher', theUrl: urlToFetch });
});

// router.get('/getHTML', function(req, res, next) {
// 	var urlToFetch = req.query['theUrl']
// 	console.log("req.query : ",  req.query);
// 	console.log('urlToFetch: ' + urlToFetch);

// 	res.render('html', { title: 'no thanks, I already got one!', theUrl: urlToFetch});
// });

module.exports = router;
