
/*
 * GET home page.
 */

exports.index = function(req, res){
  var action = req.body.action;
  console.log('action : ' + action);
  if(action == null) {
    res.render('index', { title: 'MyApp - Login' });
  } else {
    console.log('action is present');
  }
  res.end();
};
