var express = require('express');

var router = express.Router();

var multiparty = require('multiparty');

// get the collection passed in param and return the result in JSON
router.get('/api/v1/:collection', function(req, res){

  var collection = req.params.collection
  var model = req.getModel();

  var artistQuery = model.query(collection, {});
	artistQuery.subscribe(function(err) {
  	if (err) return next(err);
  	res.json(artistQuery.get());
	});

});

// file upload
router.post('/p/collection/upload', function(req, res, next) {

  var form, model;

  model = req.getModel();

  form = new multiparty.Form();
  form.on('part', function(part) {
    var cancel, companyId, data, esc, fileId, fileName;
    fileName = part.filename;
    console.log('part', fileName);
    if (!fileName) {
      console.log('field', part.name);
      data = '';
      part.on('data', function(chunk) {
        return data += chunk;
      });
      part.on('end', function() {
        return console.log('value', part.name, data);
      });
      return part.resume();
    }
    companyId = model.id();
    fileId = model.id();
    esc = util.esc(next, debug);
    await(storage.upload(part, companyId, fileId, fileName, esc(defer(file))));
    cancel = function(err) {
      console.log('cancel', err);
      storage.remove(file);
      return next(err);
    };
    esc = util.esc(cancel, debug);
    console.log('add file');
    await(model.add('files', file, esc(defer())));
    console.log('response');
    return res.json({
      fileId: fileId
    });
  });
  form.on('error', function(err) {
    return console.log('error', err);
  });
  form.on('close', function() {
    return console.log('completed');
  });
  return form.parse(req);
  });

module.exports = router;
