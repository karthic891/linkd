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

/**
 * Authenticate the user
 * @param userName, password, callback
 * @return 
 * @author karthic891
 */
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
	  console.log('Error in collection : ' + err);
	  redirectUser(false, userName);
	}
      });
    } else {  //If DB open error
      console.log('Error in db opening : ' + err);
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

/**
 * Retrieves the URLs saved by the user
 * @param userName, callback
 * @return 
 * @author karthic891
 */
var getURLs = function(userName, callback) {
  var urlResult = [];

  var getURLById = function(urlCollectionErr, urlCollection, urlId) {
    console.log('getURLById called : ' + urlId);
    if(! urlCollectionErr) {
      console.log('is this part coming. : ' + urlCollection);
      urlCollection.findOne({_id: urlId}, function(err, data) {
	console.log('Data : ' + data._id);
      });
    } else {
      console.log('URL collection error : '  + urlCollectionErr);
    }
  }

  // var getUU = function(db, urlId, callback) {
  //   console.log('urlId here : ' + urlId);
  //   db.collection('url', {safe: true}, function(urlCollectionErr, urlCollection) {
  //     if(! urlCollectionErr) {
  // 	console.log('test : ' + urlId);
  // 	getURLById(urlCollectionErr, urlCollection, urlId, callback);
  // 	//callbackHandler();
  //     } else {
  // 	console.log('urlCollectionErr : ' + urlCollectionErr);
  //     }
  //   });
  // }
  
  var server = new MongoServer('localhost', 27017, {auto_reconnect:true});
  var db = new Db('mydb', server);
  console.log('getURLs method called!');
  db.open(function(dbOpenErr, db) {
    //db.close();
    if(! dbOpenErr) {  //DB open successful

      /* closure */
      var getURLCollection = function(urlCollection) {
	console.log('---' + urlCollection);
	return urlCollection;
      }
      var closure = (function() {
	var uuu;
	db.collection('url', {safe: true}, function(urlCollectionErr, urlCollection) {
	  if(! urlCollectionErr) {
	    urlCollection.findOne({url: 'google.com'}, function(err,data) {
	      console.log(data);
	    });
	    uuu =  urlCollection;
	  } else {
	    return 'err';
	  }
	});
	return function() { return uuu; };
      })();
      console.log(closure());
      /* closure ends */
      
      db.collection('url_metadata', {safe: true}, function(urlMetaCollectionErr, urlMetaCollection) {
	if(! urlMetaCollectionErr) {
	  var options = {
	    title: 1, desc: 1, url_id: 1
	  }
	  urlMetaCollection.find({owner: userName}, options).limit(5).toArray(function(err, data) {
	    for(var i=0; i<data.length; i++) {
	      var urlId = data[i].url_id;
	      console.log('url id : ' + urlId);
	      //getURLById(false, urlCollection, urlId);
	      // getUU(db, urlId, function(){
	      // 	console.log(urlResult.length);
	      // });
	      // db.collection('url', {safe: true}, function(urlCollectionErr, urlCollection) {
	      // 	if(! urlCollectionErr) {
	      // 	  getURLById(urlCollectionErr, urlCollection, urlId);		  
	      // 	} else {
	      // 	  console.log('urlCollectionErr : ' + urlCollectionErr);
	      // 	}
	      // });
	      //urlResult.push(data[i]._id);
	    }
	    callback();
	  });
	  // cursor.each(function(err, data) {
	  //   console.log(data.desc);
	  //   console.log(cursor.hasNext());
	  // });
	  // callbackHandler();
	} else { //for urlMetaCollectionErr
	  console.log('url_metadata collection error : ' + urlMetaCollectionErr);
	  callback(false);
	}
      });
    } else { //DB open failure
      console.log('DB open failure : ' + dbOpenErr);
      callback(false);
    }
  });
  //return 1;
}

/**
 * Saves the URL provided by the user in the DB. If the URL is already present, the saves count is incremented.
 * @param urlDetail, userName, callback
 * @return 
 * @author karthic891
 */
var addURL = function(urlDetail, userName, callbackHandler) {
 
  var server = new MongoServer('localhost', 27017, {auto_reconnect:true});
  var db = new Db('mydb', server);
  
  db.open(function(dbOpenErr, db) {
    if(! dbOpenErr) {
      console.log('db opened. No errors :) ');
      db.collection('url', {safe: true}, function(collectionErr, collection) {
	//db.close();
	if(! collectionErr) {
	  var cursor = collection.findOne({url: urlDetail}, function(cursorErr, data) {
	    if(! cursorErr) {
	      if(data !== null) {
		console.log('Data :: ' + data);
		collection.update({url: urlDetail}, {'$inc' : {saves: 1}}, function(collectionErr) {
		  if(! collectionErr) {
		    console.log('Updated');
		    callbackHandler(true);
		  } else {
		    console.log('Error in update : ' + err);
		    callbackHandler(false);
		  }
		});
	      } else {  //for data !== null
		console.log('Data was null');
		collection.insert({url: urlDetail, saves: 1}, function(insertErr, data) { 
		  if(! insertErr) {
		    var urlId = data[0]._id;
		    console.log('Inserted into url : ' + data[0]._id);
		    db.collection('url_metadata', {safe: false}, function(collectionErr, url_metadataCollection) {
		  //db.close();
		  if(! collectionErr) {
		    url_metadataCollection.insert({title: 'Google Home page', desc: 'URL for google homepage', public: true, url_id: urlId, owner: userName}, function(insertErr, data) {
		      if(! insertErr) {
			console.log('inserted into url_metadata collection ' + data[0]._id);			
		      } else {
			console.log('insert into url_metadata collection failed!');
		      }
		    });
		  } else {
		    console.log('url_metadataCollection error : ' + collectionErr);
		  }
		});
		    callbackHandler(true);
		  } else {
		    console.log('Error in insertion : ' + insertErr) ;
		    callbackHandler(false);
		  }
		});
	      }
	    } else {
	      console.log('FindOne Error : ' + cursorErr);
	      callbackHandler(false);
	    }
	  });
	} else {
	  console.log('Collection error : ' + collectionErr);
	  callbackHandler(false);
	}
      });
    } else {
      console.log('DB error : ' + dbOpenErr);
      callbackHandler(false);
    }
  });
}

/* Exports */
exports.authenticate = authenticate;
exports.addComment = addComment;
exports.getComments = getComments;
exports.getURLs = getURLs;
exports.addURL = addURL;
