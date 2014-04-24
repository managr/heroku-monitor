var express = require('express');
var http    = require('http');
var env     = require('node-env-file');
var fs      = require('fs');
var request = require('request');
var Heroku  = require('heroku-client');

fs.exists(__dirname + '/.env', function (exists) {
  if (exists) {
    env(__dirname + '/.env');
  }
});

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
    //  // res.render('index', { token: info.access_token, apps: apps } )
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


var app = express();

app.set('port', process.env.PORT || 3000);
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', exports.index);
app.get('/heroku/callback', exports.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {
  io.sockets.emit('status', { status: status }); // note the use of io.sockets to emit but socket.on to listen
  socket.on('reset', function (data) {
    status = "War is imminent!";
    io.sockets.emit('status', { status: status });
  });
});
