#!/usr/bin/env node

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , port = 8080
  , url  = 'http://localhost:' + port + '/';
/* We can access nodejitsu enviroment variables from process.env */
/* Note: the SUBDOMAIN variable will always be defined for a nodejitsu app */
if(process.env.SUBDOMAIN){
  url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(require('stylus').middleware(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
  console.log(url);
});

var io = require('socket.io').listen(server);

var phones = {};
io.sockets.on('connection', function (socket) {

  socket.on('geo', function(data){
    phones[data.phone] = data;
    socket.broadcast.emit('recive', phones);
  });

  socket.on('exit', function(data){
    delete phones[data.phone];
    socket.broadcast.emit('recive', phones);
  });

  socket.on('delete', function(){
    phones = {};
    socket.broadcast.emit('recive', phones);
  });

});