var request = require('request');
var Heroku = require('heroku-client');


exports.index = function(req, res){
	// need to extract and generate token
	res.redirect(process.env.HEROKU_AUTH_URL + '/oauth/authorize?client_id=' + process.env.HEROKU_OAUTH_ID + '&response_type=code&scope=read&state=ala_ma_kota');
};


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

		heroku.post('/apps/boost-analytics/log-sessions', {"tail":true}, function (err, app) {
			res.render('index', { token: '', apps: [], log_url: app.logplex_url } )
			// console.log(app.logplex_url);
		});
	});
};

exports.logs = function(req, res){
	heroku.post('/apps/boost-analytics/log-sessions', {"tail":true}, function (err, app) {
		res.render('index', { token: '', apps: [], log_url: app.logplex_url } )
		// console.log(app.logplex_url);
	});
};