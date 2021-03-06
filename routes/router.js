"use strict";

var services = require('../biz/services');
var utils = require('../biz/utils');

/*
 * GET home page.
 */
/*
var login = function(request, response) {

    var userName, password, status;
    if(! utils.isEmpty(request.query)) { 
	// Authentication should be handled as post method
    } else if(! utils.isEmpty(request.body)) { 
	console.log('body is not empty');
	userName = request.body.username;
	password = request.body.password;
	status = services.authenticate(userName, password);
	console.log(status);
	if(status) {
	    console.log('authenticated');
	    response.render('home', {title: 'MyApp - Home', welcomemsg: 'Welcome ' + userName});
	} else {
	    console.log('Intruder');
	    response.send('Oy Intruder!');
	}
    } else { 
	console.log('Request is empty');
    }
    response.end();
}
*/

var index = function(request, response){
    var cookie = request.cookies;
    var userFromCookie = cookie.user;
    if(userFromCookie != null) {
	console.log('User present : ' + userFromCookie);
	utils.logger.info('User present : ' + userFromCookie);
	response.render('home', {title: utils.APP_TITLE + ' - Home', welcomemsg: 'Welcome ' + userFromCookie, 'comments':{}});
    } else {
	console.log('User not present in cookie');
	utils.logger.info('User not present in cookie');
	response.render('boot', {title:utils.APP_TITLE, errormsg:''});
    }
    response.end();
};

var logout = function(request, response) {
    var methodType = request.originalMethod;
    if(methodType == 'GET') {
	console.log('Logged out by using GET method');  
    }
    response.clearCookie('user');
    response.render('boot', {title:utils.APP_TITLE, errormsg:''});
    response.end();
}

var handlePost = function(request, response) {
    console.log('Handling post requests');
    /* Redirect the user based on authentication/registration status */
    var redirectUser = function(status, result) {
	if(status) {
	    utils.logger.info('User authenticated : ' + result.username + '. Setting cookie');
	    console.log('User authenticated : ' + result.username + '. Setting cookie');
	    response.cookie('user', result.username, {maxAge: 86400, httpOnly: false});
	    //var comments = services.getURLs(userName);
	    //response.send({title: utils.APP_TITLE, welcomemsg: 'Welcome ' + userName, error: false});
	    response.render('home', {title: utils.APP_TITLE, welcomemsg: 'Welcome ' + result.name, 'comments':{}});
	} else {
	    utils.logger.info('Authentication failed for user : ' +  result.username);
	    console.log('Authentication failed for user : ' +  result.username);
	    //response.send(401, {error: true});
	    response.render('boot', {title:utils.APP_TITLE, errormsg:'Invalid Username/Password'});
	}
	response.end();
    }

    var action  = request.body.action;
    console.log(action);
    if(action != null) {
	if(! utils.isEmpty(action)) {
	    if(action === 'login') {
		var userName = request.body.email;
		var password = request.body.password;
		console.log(userName + password);
		var status = services.authenticate(userName, password, redirectUser);
	    } else if(action === 'register') {
		var name = request.body.regName;
		var email = request.body.regEmail;
		var password = request.body.regPassword;
		var userDetail = {name: name, email: email, password: password};
		services.registerUser(userDetail, redirectUser);
	    } else {
		console.log('Action not defined properly.');
	    }
	}
    }

}

var getURLs = function(request, response) {
    var userName = request.body.userName;
    console.log(userName);
    services.getURLs(userName, function(err, data) {
	if(err) {
	    response.send(600, {error: err});
	}
	console.log('Response from back end : ' + data)
	response.send(200, {data: data});
    });
}

var comment = function(request, response) {
    //var commentTitle = request.query.commentTitle;
    //var commentBody = request.query.commentBody;
    //services.addComment(commentTitle, commentBody);
    var comments = services.getComments();
    console.log('the comments are : ' + comments);
    response.render('home', {title:'super', 'welcomemsg':'welcome test;','comments':comments});
    response.end();
}

var addURL = function(request, response) {
    console.log('addURL method called.');
    var callbackHandler = function(status, error) {
	console.log('callback handler called : ' + status);
	if(status) {
	    response.send(200, 'Success');      
	} else {
	    response.send(600, {error: error});
	}

    }
    
    if(! utils.isEmpty(request.body)) {
	var userName = request.body.userName;
	var urlDetail = request.body.urlDetail;
	var urlDetailObj = JSON.parse(urlDetail);
	services.addURL(urlDetailObj, userName, callbackHandler);
    }
    //response.end();
}

var testpage = function(request, response) {
    response.render('test', {title:'super'});
    response.end();
}

var boot = function(request, response) {
    response.render('boot', {});
    response.end();
}

//exports.login = login;
exports.index = index;
exports.testpage = testpage;
exports.comment = comment;
exports.handlePost = handlePost;
exports.getURLs = getURLs;
exports.logout = logout;
exports.addURL = addURL;
exports.boot = boot;
