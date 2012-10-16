"use strict";

/* Constants */
const APP_TITLE = 'My Application';

/* Logging */
var winston = require('winston');
var logger = new (winston.Logger)({
    transports : [
	new (winston.transports.Console)(),
	new (winston.transports.File)({filename: './logs/logs.log', handleExceptions: false})
    ],
    exceptionHandlers: [
	new (winston.transports.File)({filename: './logs/exceptions.log', handleExceptions: true})
    ]
});

/* Utility Functions */
var isEmpty = function(obj) {
    var empty = true;
    for(key in obj) {
	if(obj.hasOwnProperty(key)) {
	    return false;
	}
    }
    return true;
}

exports.APP_TITLE = APP_TITLE;
exports.logger = logger;
exports.isEmpty = isEmpty;
