var services = require('../biz/services');
var utils = require('../biz/utils');
/*
 * GET home page.
 */
var login = function(request, response) {

    var userName, password, status;
    if(! utils.isEmpty(request.query)) { /* Get method */
	// Authentication should be handled as post method
    } else if(! utils.isEmpty(request.body)) { /* Post method */
	console.log('body is not empty');
	userName = request.body.username;
	password = request.body.password;
	status = services.authenticate(userName, password);
	if(status) {
	    console.log('authenticated');
	    response.render('home', {title: 'MyApp - Home', welcomemsg: 'Welcome ' + userName});
	} else {
	    console.log('Intruder');
	    response.send('Oy Intruder!');
	}
    } else { /* Either Get/Post but with no param/body */
	console.log('Request is empty');
    }
    response.end();
}

var index = function(req, res){
  res.render('index', { useless: 'i am useless', title: 'Express' });
};

var comment = function(request, response) {
    var commentTitle = request.query.commentTitle;
    var commentBody = request.query.commentBody;
    services.addComment(commentTitle, commentBody);
    services.getComments();
    response.end();
}

exports.login = login;
exports.index = index;
exports.comment = comment;
