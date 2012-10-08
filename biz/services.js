var mongodb = require('mongodb');
var Db = mongodb.Db;
var connection = mongodb.Connection;
var MongoServer = mongodb.Server;
var BSON = mongodb.BSON;
var objectID = mongodb.objectID;

//console.log(Db);
//console.log(connection);
//console.log(MongoServer);
//console.log(BSON);
//console.log(objectID);
//console.log('Everything is set!');
db1 = new Db('node-monogo-blog', new MongoServer('localhost', 27017, {}, {}));
db1.open(function(){console.log('function for db open called');});
db1.close();

var authenticate = function(userName, password, redirectUser) {
  var server = new MongoServer('localhost', 27017, {auto_reconnect:true});
  var db = new Db('mydb', server);
  db.open(function(err, db) {
    if(! err) {  // DB open successful
      console.log('db open successful');
      db.collection('userinfo', {safe:true}, function(err, collection) {
	if(! err) {
	  var cursor = collection.findOne({username:userName, password:password}, function(err, data) {
	    console.log('data :: ' + data);
	    if(data != null) {
	      console.log('data is not null : ');
	      redirectUser(true, userName);	      
	    } else {
	      console.log('data is null');
	      redirectUser(false, userName);
	    }
	  });
	} else {
	  console.log('error in collection');
	  redirectUser(false, userName);
	}
      });
    } else {  //If DB open error
      console.log('error in db opening');
      redirectUser(false, userName);
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

var getURLs = function(userName, callback) {
  var server = new MongoServer('localhost', 27017, {auto_reconnect:true});
  var db = new Db('mydb', server);
  db.open(function(err, db) {
    if(! err) {  //DB open successful
      db.collection('urls', {safe: true}, function(err, collection) {
	if(! err) {
	  var cursor = collection.find({owner: userName}).toArray(function(err, data) {
	    if(! err) {
	      if(data != null) {
		console.log(data);
		//callback();
	      } else {
		console.log('data is null');
	      }
	    } else {
	      console.log(err);
	    }
	  });
	}
      });
    } else { //DB open failure
    }
  });
  return 1;
}

var addURL = function(urlDetail, userName) {
  var server = new MongoServer('localhost', 27017, {auto_reconnect:true});
  var db = new Db('mydb', server);
  db.open(function(err, db) {
    if(! err) {
      //db.collection('
      console.log('db opened. No errors :) ');
    }
  });
}

exports.authenticate = authenticate;
exports.addComment = addComment;
exports.getComments = getComments;
exports.getURLs = getURLs;
exports.addURL = addURL;
