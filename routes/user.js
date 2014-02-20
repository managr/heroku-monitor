// post it back

// curl -X POST https://id.heroku.com/oauth/token \
// -d "grant_type=authorization_code&code=01234567-89ab-cdef-0123-456789abcdef&client_secret=01234567-89ab-cdef-0123-456789abcdef"


var http = require('http'),
    qs = require('qs');

/*
 * GET users listing.
 */

exports.list = function(req, res){
	var options = {
	  hostname: 'www.mysite.com',
	  port: 80,
	  path: '/auth',
	  method: 'POST'
	};
  var request = http.request(options, function(response) {
  	console.log("ala ma kota")
  });

	var postdata = qs.stringify({
	    username:"User",
	    password:"Password"
	});

	request.on('error', function(e) {
	  res.send("error " + e.message);
	});

  request.write(postdata);
  request.end();
  // res.send("respond " + req.query.code + " " +req.query.state);

};