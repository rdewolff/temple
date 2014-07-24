var express = require('express');

var router = express.Router();

// get the collection passed in param
router.get('/api/v1/:collection', function(req, res){
  
  var collection = req.params.collection
  var model = req.getModel();
  
  var artistQuery = model.query(collection, {});
	artistQuery.subscribe(function(err) {
  	if (err) return next(err);
  	res.json(artistQuery.get());
	});

});

module.exports = router;