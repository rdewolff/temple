var derby = require('derby');

var app = module.exports = derby.createApp('public', __filename);

if (!derby.util.isProduction) global.app = app;

app.serverUse(module, 'derby-stylus');

app.use(require('d-bootstrap'));

app.loadViews(__dirname + '/../../views/public');
app.loadStyles(__dirname + '/../../styles/public');

app.use(require('./home'));

app.use(require('./collection'));

app.use(require('./artist'));

app.use(require('./search'));

app.use(require('../shared/shared.js'));

app.proto.signIn = function(action, cancel) {
  if (action === 'Sign in')
    app.history.push('/p');
};

// get called on server and client
app.proto.init = function(model) {

    // Language
    model.set('_session.lang', 'EN');

    /**
     * Search
     */
    // trigger search of full text search
    model.on('change', '_page.fullTextSearch', function(inputText) {
      // debug
      // console.log('_page.fullTextSearch changed ' + Date(), inputText);
      updateSearch(inputText);
    });

    // trigger on advanced search
    model.on('change', '_page.object.*', function(inputText) {
      // console.log('_page.object.* changed ' + Date(), inputText);
      // console.log(model.get('_page.object'));
      updateSearch(model.get('_page.object'));
    });


    function updateSearch(inputText) {
      var collection, artist, collectionQuery, artistQuery, keyName;

      console.log(typeof inputText);
      if (typeof inputText === 'object') {
        console.log('advanced search');
        collectionQuery = { // init blank query
          $and: [{}],
          $or: [{}]
        };

        artistQuery = {};

        // add all the criteria filled in the form
        for (var key in inputText) {
          if (inputText.hasOwnProperty(key)) {
            if (inputText[key] && key != 'artist') {
              keyName = {};
              keyName[key] = {$regex: inputText[key], $options: 'i'};
              // debug :
              // console.log(key + " -> " + inputText[key]);
              collectionQuery['$and'].push(keyName);
            }
          }
        }

        // treat the linked object separately (object artist links)
        if (inputText.artist) {
          collectionQuery['$or'].shift();
          // find the object ID of this specfici artist
          var objectsIdQuery = model.query('collectionArtist', {artist_id: inputText.artist});
          model.fetch(objectsIdQuery, function(err, next){
            var objectsIdQueryResult = objectsIdQuery.get();
            console.log('lnk:', objectsIdQueryResult);
            for (var key in objectsIdQueryResult) {
              collectionQuery['$or'].push({_id: objectsIdQueryResult[key].collection_id});
            }
            runQuery(collectionQuery, artistQuery);
          });
        } else {
          runQuery(collectionQuery, artistQuery);
        }



      } else {
        console.log('fulltext search');
        collectionQuery = {
          $or: [
            {title: {$regex: inputText, $options: 'i'}},
            {domain: {$regex: inputText, $options: 'i'}},
            {materialTechnique: {$regex: inputText, $options: 'i'}},
            {description: {$regex: inputText, $options: 'i'}}
          ]
        };
        artistQuery = {
          $or: [
            {lastname: {$regex: inputText, $options: 'i'}},
            {firstname: {$regex: inputText, $options: 'i'}}
          ]
        };
        runQuery(collectionQuery, artistQuery);
      }

    }


    function runQuery(collectionQuery, artistQuery) {

      // debug
      console.log('collectionQuery', JSON.stringify(collectionQuery));
      console.log('artistQuery', JSON.stringify(artistQuery));

      // run queries
      var collection = model.query('collection', collectionQuery);
      var artist = model.query('artist', artistQuery);

      // subscribe to queries results
      model.subscribe(collection, artist, function(err, next) {
        if (err) {
          console.log(err);
          return next(err);
        }
        model.ref('_page.collection', collection);
        model.ref('_page.artist', artist);
      });
    }

}

app.proto.create = function(model) {

  // TODO: remove this only for debug
  global.MODEL = model

  /**
   * Import scripts
   */
  // application wide jquery
  require('../../public/vendor/jquery-1.9.1.min'); // the JQuery version from Derby example todos WORKS
  // NOT WORKING : require('../../public/components/jquery/dist/jquery.min'); // the Bower JQuery version does NOT work

  require('../../public/components/bootstrap/dist/js/bootstrap.min');


}
