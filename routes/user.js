var request = require('request');

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
		res.write(info.access_token);
		res.end();
	});

};
