
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , mypage = require('./routes/mypage')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  console.log(__dirname);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  //console.log(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  //console.log(express.methodOverride());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/login', mypage.login);
app.get('/login', routes.index);
app.get('/users', user.list);
app.get('/mypage', mypage.index);
app.get('/comment', mypage.comment);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
