var request = require('request');
var Heroku = require('heroku-client');

exports.index = function(req, res){
	// need to extract and generate token
	res.redirect(process.env.HEROKU_AUTH_URL + '/oauth/authorize?client_id=' + process.env.HEROKU_OAUTH_ID + '&response_type=code&scope=read');
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

		heroku.post('/apps/' + process.env.APPLICATION_NAME + '/log-sessions', {"tail":true}, function (err, app) {
			log_handle_url = app.logplex_url

			stream = request(log_handle_url);
			stream.on('data', function(chunk) {
				// add transfering that to the socket.io
      			console.log("Received body data:");
      			console.log(chunk.toString());
    		});
			request(log_handle_url, function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			  }
			})
		});
	});
};
