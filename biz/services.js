var authenticate = function(userName, password) {
    if(userName === 'test' && password == 'test') {
	return true;
    } else {
	return false;
    }
}

var addComment = function(commentTitle, commentBody) {
    console.log('Adding a new comment');
    console.log(commentTitle);
    console.log(commentBody);
}

var getComments = function() {
    var comments = {};
    return comments;
}

exports.authenticate = authenticate;
exports.addComment = addComment;
exports.getComments = getComments;
