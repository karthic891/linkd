"use strict";
/**
 * Module dependencies.
 */

var express = require('express'),
    router = require('./routes/router'),
    http = require('http'),
    path = require('path');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    console.log(__dirname);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    //console.log(express.methodOverride());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', router.index);
app.post('/', router.handlePost);
app.get('/comment', router.comment);
app.get('/urls', router.getURLs);
app.post('/urls', router.getURLs);
app.get('/logout', router.logout);
app.post('/logout', router.logout);
app.get('/testpage', router.testpage);
app.post('/addURL', router.addURL);
app.get('/boot', router.boot);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
