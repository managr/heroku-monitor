// post it back

// curl -X POST https://id.heroku.com/oauth/token \
// -d "grant_type=authorization_code&code=01234567-89ab-cdef-0123-456789abcdef&client_secret=01234567-89ab-cdef-0123-456789abcdef"


var https = require('https'),
    qs = require('qs');

/*
 * GET users listing.
 */

exports.list = function(req, res){
	var postdata = qs.stringify({
	    grant_type: "authorization_code",
	    code: req.query.code,
	    client_secret: '6e24f40b-86f2-43ac-9a50-bb012d92f08a'
	});

	var options = {
	  hostname: 'id.heroku.com',
	  port: 443,
	  path: '/oauth/token',
	  method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postdata)
    }
	};
  
  var request = https.request(options, function(response) {
		response.on('data', function(chunk){
			res.write(postdata);
			res.write(chunk);
  	});
		response.on("end", function () {
			res.end();
		});
  }).on('error', function(e) {
	  res.send("error " + e.message);
	});

  console.log(postdata);
  request.write(postdata);
  request.end();
};