var request = require('request');

/*
 * GET users listing.
 */

exports.list = function(req, res){

	var postdata = {
	    grant_type: "authorization_code",
	    code: req.query.code,
	    client_secret: '6e24f40b-86f2-43ac-9a50-bb012d92f08a'
	};

	request.post('https://id.heroku.com/oauth/token', {form: postdata}, function (e, r, body) {
		var info = JSON.parse(body);
		res.write(info.access_token);
		res.end();
	});

};
