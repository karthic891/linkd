var isEmpty = function(obj) {
    var empty = true;
    for(key in obj) {
	if(obj.hasOwnProperty(key)) {
	    return false;
	}
    }
    return true;
}

exports.isEmpty = isEmpty;
