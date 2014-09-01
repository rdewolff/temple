var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');
// used to do some mongodb query like aggregate/group by
var db = require('mongoskin').db(process.env.MONGO_URL);
var sshTunnel = require('tunnel-ssh');
var pg = require('pg');

// get the collection passed in param and return the result in JSON
router.get('/api/v1/:collection', function(req, res){

  var collection = req.params.collection
  var model = req.getModel();

  var query = model.query(collection, {});
	query.subscribe(function(err) {
  	if (err) return next(err);
  	res.json(query.get());
	});

});

// Get all distinct material technique values from the database
router.get('/api/v1/collection/materialTechnique', function(req, res, next) {
  // in mongo this works : db.collection.aggregate({$group: {_id: "$materialTechnique"}})
  db.collection('collection').aggregate({$group: {_id: "$materialTechnique"}}, function(err, result) {
    res.json(result);
  });
});

router.get('/api/v1/admin/views', function(req, res, next) {
  db.collection('adminViews').aggregate({$group: {_id: "$name"}}, function(err, result) {
    res.json(result);
  });
});

router.get('/api/v1/admin/fields', function(req, res, next) {
  db.collection('adminFields').aggregate({$group: {_id: "$internalName"}}, function(err, result) {
    res.json(result);
  });
});

// synchronizer
router.get('/api/v1/admin/sync', function(req, res, next) {

  console.log('*** sync start ***');
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('date & ip:', Date(), ip);
  
  // Query builder from the admin fields selection
  var model = req.getModel();
  var adminFields = model.query('adminFields', {});
  var tableFieldsSrc = [];
  var tableFieldsDest = [];
  var queriesSql = [];

  // Source DATABASE
  var conString = "postgres://rdewolff@localhost:5432/rdewolff";

  model.fetch(adminFields, function(err, next) {
    if (err) next(err);
    var adminFieldsData = adminFields.get();
    console.log('adminFieldsData', adminFieldsData);
    // create an array like where fields are groupped by table : 
    // [ table : ['field1', 'field2'], table2: ['fieldA', 'fieldB'] ]
    // example : 
    // [ dom_obj: [ 'obj_title1_s', 'obj_id' ], dom_artist: [ 'art_namedetail_s', 'art_id' ] ]    
    for (var i = adminFieldsData.length - 1; i >= 0; i--) {
      // sources
      if (tableFieldsSrc[adminFieldsData[i].sourceTable])
        tableFieldsSrc[adminFieldsData[i].sourceTable] = tableFieldsSrc[adminFieldsData[i].sourceTable].concat(adminFieldsData[i].sourceField);
      else
        tableFieldsSrc[adminFieldsData[i].sourceTable] = [adminFieldsData[i].sourceField];
      // destination 
      if (tableFieldsDest[adminFieldsData[i].destinationCollection])
        tableFieldsDest[adminFieldsData[i].destinationCollection] = tableFieldsDest[adminFieldsData[i].destinationCollection].concat(adminFieldsData[i].destinationField);
      else
        tableFieldsDest[adminFieldsData[i].destinationCollection] = [adminFieldsData[i].destinationField];
    };
    for (table in tableFieldsSrc) {
      // source queries
      queriesSql[table] = 'SELECT ' + tableFieldsSrc[table].join(', ') + ' FROM ' + table;
      console.log(queriesSql[table]);
    }
    // debug
    console.log('tableFieldsSrc', tableFieldsSrc);
    console.log('tableFieldsDest', tableFieldsDest);
    console.log(queriesSql);

    // query the source database
    pg.connect(conString, function(err, client, done) {
      if (err) { 
        return console.error('error fetching client from pool', err);
      }

      // get all the data from the sources
      for (query in queriesSql) {

        client.query(queriesSql[query], function(err, result) {
          done(); //call `done()` to release the client back to the pool
          if(err) {
            return console.error('error running query', err);
          }
          // query results
          // result is an object like this : 
          // { fieldName: 'Value', fieldName2: 'Value2' }
          console.log('Number of result : ', result.rows.length);
          for (field in result.rows[0]) {
            console.log(field);
          }
          console.log(result.rows[0]);
          console.log(result.rows[0]);
        });
      }      
    });

  }); 

  function getDestination(srcTable, srcField, adminFieldsDataResult) {

    return adminFieldsDataResult

  }


  // SSH TUNNEL
  /*
  var config = {
    remotePort: 5432, //localport
    localPort: 5432, //remoteport
    verbose: true, // dump information to stdout
    disabled: false, //set this to true to disable tunnel (useful to keep architecture for local connections)
    sshConfig: { //ssh2 configuration (https://github.com/mscdex/ssh2)
        host: 'emp-web-55.zetcom.ch',
        port: 22,
        username: 'emp-admin',
        password: 'RV4RRLmgsCq3zSLe'
        // privateKey: require('fs').readFileSync('<pathToKeyFile>'),
        // passphrase: 'verySecretString' // option see ssh2 config
    }
  };

  var tunnel = new sshTunnel(config);
  tunnel.connect(function (error) {
    console.log('error:', error);
    //or start your remote connection here ....
    //mongoose.connect(...);
    // TODO sync start here :)


    //close tunnel to exit script
    tunnel.close();
  });
  */

});

// file upload
router.post('/p/collection/upload', function(req, res, next) {
  var form, model, fileUploaded;
  model = req.getModel();
  form = new multiparty.Form();
  form.on('file', function(name, file) {
    // debug :
    /*console.log('name', name);
    console.log('file', file);*/
    fs.readFile(file.path, function (err, data) {
      var newPath = __dirname + '/../public/files/'+ file.fieldName;
      fs.writeFile(newPath, data, function (err) {
        if (err) {
          console.log('error file upload', err);
          return next(err);
        }
        fileUploaded = {
          id: file.fieldName.replace(/\.[^/.]+$/, ""),
          fileOriginalFilename: file.originalFilename,
          fileName: file.fieldName,
          fileSize: file.size
        };
        // save in model
        model.add('file', fileUploaded)
        // return result for processing
        return res.json(fileUploaded);
      });
    });
  });

  /*
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
    console.log('companyId='+companyId);
    console.log('fileId='+fileId);
    //esc = util.esc(next, debug);
    //await(storage.upload(part, companyId, fileId, fileName, esc(defer(file))));
    cancel = function(err) {
      console.log('cancel', err);
      // storage.remove(file);
      return next(err);
    };
    //esc = util.esc(cancel, debug);
    console.log('add file');
    await(model.add('files', file, esc(defer())));
    console.log('response');
    return res.json({
      fileId: fileId
    });
  });
  */

  form.on('error', function(err) {
    return console.log('error', err);
  });
  form.on('close', function() {
    return console.log('completed');
  });
  return form.parse(req);
  });

module.exports = router;
