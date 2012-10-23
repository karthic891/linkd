"use strict";
var mongodb = require('mongodb');
var async = require('async');
var Db = mongodb.Db;
var connection = mongodb.Connection;
var MongoServer = mongodb.Server;
var BSON = mongodb.BSON;
var objectID = mongodb.objectID;

//console.log(async);
//console.log(Db);
//console.log(connection);
//console.log(MongoServer);
//console.log(BSON);
//console.log('Everything is set!');
var db1 = new Db('node-monogo-blog', new MongoServer('localhost', 27017, {}, {}));
db1.open(function () {console.log('function for db open called'); });
db1.close();

/**
 * Authenticate the user
 * @param userName, password, callback
 * @return 
 * @author karthic891
 */
var authenticate = function (userName, password, redirectUser) {
    var server = new MongoServer('localhost', 27017, {auto_reconnect: true});
    var db = new Db('mydb', server);
    db.open(function (err, db) {
	if(! err) {  // DB open successful
	    console.log('db open successful');
	    db.collection('userinfo', {safe: true}, function (err, collection) {
		if(! err) {
		    var cursor = collection.findOne({username:userName, password:password}, function (err, data) {
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

var addComment = function (commentTitle, commentBody) {
    console.log('Adding a new comment');
    console.log(commentTitle);
    console.log(commentBody);
}

/**
 * Retrieves the URLs saved by the user
 * @param userName, callback
 * @return 
 * @author karthic891
 */
var getURLs = function (userName, callback) {
    var urlResult = [];
    var urlValues = [];
    var server = new MongoServer('localhost', 27017, {auto_reconnect:true});
    var db = new Db('mydb', server);

    // Callback for iterate function. Added cuz it needs it. Need not perform anything.
    var done = function (err) {
	console.log('done called')
	if(err) {
	    console.log('err in done method');
	    callback(err);
	}
    }

    //Iterator function. Iterates for every item in the array passed to async function.
    var itemIterator = function (item, done) {
	db.collection('url', function (urlCollectionErr, urlCollection) {
	    if(! urlCollectionErr) {
		urlCollection.findOne({_id: item.url_id}, function (err, data) {
		    item.url = data.url;
		    item.saves = data.saves;
		    delete item.url_id;
		    urlValues.push(item);
		    done(false);
		    return;
		});
	    } else {
		console.log('Url Collection error : ' + urlCollectionErr);
		done(urlCollectionErr);
		return;
	    }
	});
    }

    var finalCallback = function (err) {
	if(err) {
	    console.log('err in final callback method');
	    callback(err);
	}
	for(var i=0; i<urlValues.length; i++) {
	    console.log(urlValues[i].url_id + '-' + urlValues[i].url);
	}
	callback(false, urlValues);
    }

    var getURLById = function (urlResult, callback) {
	console.log('getURLById called : ' + urlResult.length);
	async.forEach(urlResult, itemIterator, finalCallback);
    }

    console.log('getURLs method called!');
    db.open(function (dbOpenErr, db) {
	if(! dbOpenErr) {  //DB open successful
	    db.close();
	    db.collection('url_metadata', {safe: true}, function (urlMetaCollectionErr, urlMetaCollection) {
		if(! urlMetaCollectionErr) {
		    var options = {
			title: 1,
			desc: 1,
			url_id: 1,
			ispublic: 1,
			owner: 1,
			tags: 1, 
			_id: 0
		    }
		    urlMetaCollection.find({owner: userName}, options).toArray(function (err, data) {
			for(var i=0; i<data.length; i++) {
			    var urlId = data[i].url_id;
			    urlResult.push({title: data[i].title,
					    desc: data[i].desc,
					    ispublic: data[i].ispublic,
					    owner: data[i].owner,
					    tags: data[i].tags,
					    url_id: data[i].url_id});
			}
			console.log(urlResult);
			getURLById(urlResult, callback);
		    });
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
}

/**
 * Saves the URL provided by the user in the DB. If the URL is already present, the saves count is incremented.
 * @param urlDetail, userName, callback
 * @return 
 * @author karthic891
 */
var addURL = function (urlDetail, userName, callbackHandler) {
    
    var server = new MongoServer('localhost', 27017, {auto_reconnect:true});
    var db = new Db('mydb', server);

    /**
     * Saves the url in the URL table calls 'callback' to save the url's metadata
     * @param urlDetail, userName, callback --> saveURLMetadata()
     * @return 
     * @author karthic891
     */
    var saveURL = function(urlDetail, userName, callback) {
	console.log('save URL called locally');
	db.collection('url', function(dbErr, collection) {
	    collection.insert({url: urlDetail.url, saves: 1}, function (insertErr, data) { 
		if(! insertErr) {
		    var urlId = data[0]._id;
		    console.log('Inserted into url : ' + data[0]._id);
		    urlDetail.url_id = urlId;
		    callback(urlDetail, userName, callbackHandler);
		} else {
		    console.log('Error in insertion : ' + insertErr) ;
		    callbackHandler(false);
		}
	    });
	});
    }

    /**
     * Saves the metadata of the URL i.e., title, desc, tags, etc
     * @param urlDetail, userName, callback --> calls back the router
     * @return 
     * @author karthic891
     */
    var saveURLMetadata = function(urlDetail, userName, callback) {
	console.log('save URL metadata called locally');
	db.collection('url_metadata', {safe: true}, function (collectionErr, url_metadataCollection) {
	    //db.close();
	    if(! collectionErr) {
		var data = {title: urlDetail.title, desc: urlDetail.desc, ispublic: true, url_id: urlDetail.url_id, owner: userName, tags: urlDetail.tags};
		console.log(data);
		url_metadataCollection.insert(data, function (insertErr, data) {
		    if(! insertErr) {
			console.log('inserted into url_metadata collection ' + data[0]._id);
			callback(true);
		    } else {
			console.log('insert into url_metadata collection failed!');
			callbackHandler(false, 'Insert failed');
		    }
		});
	    } else {
		console.log('url_metadataCollection error : ' + collectionErr);
		callbackHandler(false, 'Insert failed');
	    }
	});
    }

    /**
     * Check if the URL is already present in the DB for the user identified by userName. This prevents duplication of the URL for the same user
     * @param url_id, userName, callback --> calls an inline method with the status of the check 
     * @return status
     * @author karthic891
     */
    var checkIfURLAlreadySaved = function (url_id, userName, callback) {
	console.log('check url already saved method called : ' + userName);
	db.collection('url_metadata', {safe: true}, function (collectionErr, collection) {
	    if(! collectionErr) {
    		collection.findOne({url_id: url_id, owner: userName}, function (findOneErr, data) {
    		    if(! findOneErr) {
			if(data != null) {
    			    callback(true);	      
			} else { // user has not already saved this url
			    callback(false, 'User has already saved this link');
			}

    		    } else {
    			console.log('Fine One error : ' + findOneErr);
    			callbackHandler(false, 'Insert failed');
    		    }
    		});
	    } else {
    		console.log('Collection Err : ' + collectionErr);
    		callbackHandler(false,'Insert failed');
	    }
	});
    }
    
    
    db.open(function (dbOpenErr, db) {
	if(! dbOpenErr) {
	    console.log('db opened. No errors :) ');
	    db.collection('url', {safe: true}, function (collectionErr, collection) {
		db.close();
		if(! collectionErr) {
		    var cursor = collection.findOne({url: urlDetail.url}, function (cursorErr, data) {
			if(! cursorErr) {
			    if(data !== null) {
				var url_id = data._id;
				checkIfURLAlreadySaved(url_id, userName, function (alreadySaved) {
				    console.log('user saved status : ' + alreadySaved);
				    if(alreadySaved) {
					console.log('user already has saved this url.')
					callbackHandler(true);
				    } else {
					urlDetail.url_id = url_id;
					collection.update({_id: urlDetail.url_id}, {'$inc' : {saves: 1}}, function (collectionErr) {
					    if(! collectionErr) {
						console.log('Updated');
						saveURLMetadata(urlDetail, userName, callbackHandler);
					    } else {
						console.log('Error in update : ' + err);
						callbackHandler(false, 'Insert failed');
					    }
					});
				    }
				});
			    } else {  //for data !== null
				console.log('Data was null');
				saveURL(urlDetail, userName, saveURLMetadata);
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

var registerUser = function(userDetail, callbackHandler) {
    console.log('Register user called : ' + userDetail)
    db.open(function(dbOpenErr, db) {
	if(! dbOpenErr) {
	    db.collection('userinfo', {safe: true}, function(collectionErr, collection) {
		if(! collectionErr) {
		    var data = {name: userDetail.name, username: userDetail.userName, password: userDetail.password};
		    collection.insert(data, function(errc) {
			
		    })
		} else {
		    console.log('Collection Err : ' + collectionErr);
		    callbackHandler(false, 'Register error.');
		}
	    });
	} else {
	    console.log('dbOpen Error : ' + dbOpenErr);
	    callbackHandler(false, 'Register error.');
	}
    });
}

/* Exports */
exports.authenticate = authenticate;
exports.addComment = addComment;
exports.getURLs = getURLs;
exports.addURL = addURL;
