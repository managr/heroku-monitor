var request = require('request');
var Heroku = require('heroku-client');
/*
 * GET users listing.
 */

exports.list = function(req, res){

	var postdata = {
	    grant_type: "authorization_code",
	    code: req.query.code,
	    client_secret: process.env.HEROKU_OAUTH_SECRET
	};

	request.post('https://id.heroku.com/oauth/token', {form: postdata}, function (e, r, body) {
		var info = JSON.parse(body);
		
		heroku = new Heroku({ token: info.access_token });
		heroku.apps().list(function (err, apps) {
			// res.render('index', { token: info.access_token, apps: apps } )
		});

		heroku.post('/apps/boost-analytics/log-sessions', {"dyno":"web.1","lines":10,"source":"app","tail":true}, function (err, app) {
			res.render('index', { token: '', apps: [], log_url: app.logplex_url } )
			// console.log(app.logplex_url);
		});

	});

};
