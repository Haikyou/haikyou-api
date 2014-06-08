
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,UPDATE");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(allowCrossDomain);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Index
app.get('/', routes.index);

// Users
app.get('/user', routes.me);
app.get('/users/:id', routes.user);
app.get('/users', routes.users);
app.post('/users', routes.userCreate);
app.put('/users/:username', routes.userUpdate);

// Messages
app.get('/conversation', routes.messages);
app.get('/conversation/:id', routes.message);
app.post('/conversation', routes.messageCreate);
app.put('/conversation/:id', routes.messageUpdate);
app.delete('/conversation/:id', routes.messageDelete);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Haikyou listening on port ' + app.get('port'));
});
