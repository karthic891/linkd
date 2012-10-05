var mongodb = require('mongodb');
var Db = mongodb.Db;
var connection = mongodb.Connection;
var MongoServer = mongodb.Server;
var BSON = mongodb.BSON;
var objectID = mongodb.objectID;

console.log(Db);
console.log(connection);
console.log(MongoServer);
console.log(BSON);
console.log(objectID);
console.log('Everything is set!');
db1 = new Db('node-monogo-blog', new MongoServer('localhost', 27017, {}, {}));
db1.open(function(){console.log('function for db open called');});
db1.close();

var authenticate = function(userName, password, redirectUser) {
  var server = new MongoServer('localhost', 27017, {auto_reconnect:true});
  var db = new Db('mydb', server);
  db.open(function(err, db) {
    if(! err) {
      console.log('db open successful');
      db.collection('userinfo', {safe:true}, function(err, collection) {
	if(! err) {
	  var cursor = collection.findOne({username:userName, password:password}, function(err, data){
	    console.log(data);
	    //db.close();
	    console.log('testing here!');
	    redirectUser(true, userName);
	  });
	} else {
	  console.log('error in collection');
	  redirectUser(false);
	}
      });
    } else {
      console.log('error in db opening');
      redirectUser(false);
    }
  });
}

var addComment = function(commentTitle, commentBody) {
    console.log('Adding a new comment');
    console.log(commentTitle);
    console.log(commentBody);
}

var getComments = function() {
    var com1 = {'title':'First Comment', 'body':'My first Comment for display'};
    var com2 = {'title':'second Comment', 'body':'My second Comment for display'};
    var com3 = {'title':'third Comment', 'body':'My third Comment for display'};
    var com4 = {'title':'Fourth Comment', 'body':'My fourth Comment for display'};
    var comments = [com1, com2, com3, com4 ]
    return comments;
}

exports.authenticate = authenticate;
exports.addComment = addComment;
exports.getComments = getComments;
