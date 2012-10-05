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
    response.render('home', {title: 'MyApp - Home', welcomemsg: 'Welcome ' + userFromCookie, 'comments':{}});
  } else {
    console.log('User not present in cookie');
    response.render('index', {'title':'My Application'});
  }
  response.end();
};

var logout = function(request, response) {
  response.clearCookie('user');
  response.render('index', {'title':'My Application'});
  response.end();
}

var handlePost = function(request, response) {
  console.log('handling post requests');
  var redirectUser = function(status, userName) {
    if(status) {
      console.log('authenticated. Setting cookie');
      response.cookie('user', userName, {maxAge: 86400, httpOnly: true});
      var comments = services.getComments();
      response.render('home', {title: 'MyApp - Home', welcomemsg: 'Welcome ' + userName, 'comments':comments});
    } else {
      console.log('fucked up!');
    }
    response.end();
  }
  //console.log(request.cookies.user);
  var action  = request.body.action;
  if(action != null) {
    if(! utils.isEmpty(action)) {
      if(action == 'login') {
        var userName = request.body.username;
	var password = request.body.password;
        var status = services.authenticate(userName, password, redirectUser);
      }
    }
  }

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

//exports.login = login;
exports.index = index;
exports.comment = comment;
exports.handlePost = handlePost;
exports.logout = logout;
