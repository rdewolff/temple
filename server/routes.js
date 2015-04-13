var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');
// used to do some mongodb query like aggregate/group by
var db = require('mongoskin').db(process.env.MONGO_URL);
var sshTunnel = require('tunnel-ssh');
var pg = require('pg');
var fake = require('Faker');

router.get('/fakeArtist', function(req, res) {
  var model = req.getModel();
  for (var i = 0; i < 1000; i++) {
    model.add('artist', {
      "firstname" : fake.Name.firstName(),
      "lastname" : fake.Name.lastName(),
      "birthday" : fake.Date.past(150).substr(0, 10),
      "deathday" : fake.Date.past(80).substr(0, 10),
      "birthcountry" : fake.Address.ukCountry(),
      "deathcountry" : fake.Address.ukCountry(),
      "birthplace" : fake.Address.city(),
      "deathplace" : fake.Address.city(),
      "address" : fake.Address.streetName(),
      "domain" : "Red",
      "gender" : "Male"
      });
  }
  res.json({
    status :'done'
  });
});

router.get('/fakeObject', function(req, res) {

  function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for( var i=0; i < 3; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    text += '-'
    possible = "0123456789";
    for( var i=0; i < 4; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  var model = req.getModel();
  for (var i = 0; i < 1000; i++) {
    model.add('collection', {
      "accessionNr" : makeId(), // "ABC-1234",
      "domain" : "Purple",
      "publish" : "Public",
      "systematics" : "test",
      "title" : fake.Lorem.words().join(' '),
      "yearFrom" : fake.Date.past(150).substr(0, 4),
      "yearTo" : fake.Date.past(150).substr(0, 4),
      "period" : "AD",
      "description" : fake.Lorem.sentence(),
      "materialTechnique" : "Paper",
      "creditLine" : fake.Lorem.sentence(),
      "notes" : fake.Lorem.sentence(),
      "location" : fake.Address.usState() + ", USA",

      });
  }
  res.json({
    status :'done'
  });
});

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

    var totalInsert = 0;
    var data;
    // query the source database
    pg.connect(conString, function(err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }

      // get all the data from the sources
      for (table in queriesSql) {
        console.log('table1', table);
        function encapsulateQuery(table) {
          client.query(queriesSql[table], function(err, result) {

            done(); //call `done()` to release the client back to the pool
            if(err) {
              return console.error('error running query', err);
            }
            // query results
            // result is an object like this :
            // { fieldName: 'Value', fieldName2: 'Value2' }
            console.log('Number of result : ', result.rows.length);

            for (var i = result.rows.length - 1; i >= 0; i--) {
              data = {}; // reset the temp data holder
              // debug
              // console.log(i, result.rows[i], typeof result.rows[i]); // log all the data

              // normalize data as we cannot directly insert the object via result.rows[i] (TODO: understand why?)
              for (field in result.rows[i]) {
                data[field] = result.rows[i][field];
              }
              // debug
              // console.log(i, data); // log all the data
              console.log('table2', table);
              // insert into mongodb via Derby model
              console.log(i, table, data);
              model.add(table, data); // TODO ain't working?!?! Need to make the fix visibile underneaths after loop!
              console.log('table3', table);

              totalInsert++;

            };
          });
          return true; // end of encapsulateQuery()
        };
        encapsulateQuery(table);
      }

      // FIXME: bug after the loop the data do not get inserted as long as we don't do another model.add()
      //var id = model.add('artist2', {final: 'insert ' + Date()}); // THIS MAKE THE LOOP INSERT WORK!
      // model.del('artist2.'+id); // deleting after insert does NOT work to fix the bug
      //console.log('id', id);
      for (table in queriesSql) {
        model.add(table, {final: 'insert '+Date()});
        totalInsert++;
      }
      console.log('totalInsert', totalInsert);

      res.json(totalInsert);
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
