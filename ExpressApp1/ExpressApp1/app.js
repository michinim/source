
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var https = require('https');
var fs = require('fs');

var options = {key: fs.readFileSync('./key.pem'), cert: fs.readFileSync('./cert.pem')};

var port1 = 80;
var port2 = 443;

var app = express();

// all environments
app.set('port', process.env.PORT || port1);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

https.createServer(options, app).listen(port2, function(){
  console.log("Https server listening on port " + port2);
});

app.get('/login', function (req, res){
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h3>Login</h3>');
  res.write('<form method="POST" action="/login">');
  res.write('<label name="userId">UserId : </label>')
  res.write('<input type="text" name="userId"><br/>');
  res.write('<label name="password">Password : </label>')
  res.write('<input type="password" name="password"><br/>');
  res.write('<input type="submit" name="login" value="Login">');
  res.write('</form>');
  res.end();
});


app.post('/login', function (req, res){
  var userId = req.param("userId");
  var password = req.param("password")
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('Thank you, '+userId+', you are now logged in.');
  res.write('<p><a href="/"> back home</a>');
  res.end();
});
