var async = require('async');

console.log(async);
var arr = [];
for(var i=0; i<10; i++) {
  arr.push({val: i});
}

var callback = function(err) {
  console.log('---  ' + err);
}

var callback1 = function() {
  console.log('called evry time');
}

var func = function(item, callback1) {
  console.log(item.val);
  //callback1();
  return;
}

async.forEachSeries(arr, func, callback);
