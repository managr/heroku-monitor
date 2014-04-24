
/**
 * Module dependencies.
 */

var express = require('express');
// var routes = require('./routes');
var http = require('http');
var path = require('path');
var env = require('node-env-file');
var fs = require('fs');

var request = require('request');
var Heroku = require('heroku-client');

var app = express();

fs.exists(__dirname + '/.env', function (exists) {
  if (exists) {
		env(__dirname + '/.env');
	}
});

// all environments
app.set('port', process.env.PORT || 3000);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


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
		// we might list apps to pickup correct one
		// heroku.apps().list(function (err, apps) {
		// 	// res.render('index', { token: info.access_token, apps: apps } )
		// });

		heroku.post('/apps/' + process.env.APPLICATION_NAME + '/log-sessions', {"tail":true}, function (err, app) {

			stream = request(app.logplex_url);

			// stream.pipe(res);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			stream.on('data', function(chunk) {
				// add transfering that to the socket.io
      			console.log("Received body data:");
      			console.log(chunk.toString());
    			res.write(chunk.toString());
    		});

		});
	});
};



app.get('/', exports.index);
app.get('/heroku/callback', exports.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
