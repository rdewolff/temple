var derby = require('derby');

var app = module.exports = derby.createApp('temple', __filename);

if (!derby.util.isProduction) global.app = app;

app.serverUse(module, 'derby-stylus');

app.use(require('d-bootstrap'));
// app.use(require('../../components/d-select2'));
app.component(require('d-connection-alert'));
app.component(require('d-before-unload'));
// app.component(require('derby-ui-select2')); // FIXME: update to Derby 0.6
app.component(require('l-upload')); // lever file-upload
//app.use(require('../../components/zetcom-derby-ui-forms'));
app.component(require('../../components/temple-panel'));

app.loadViews(__dirname + '/../../views/app');
app.loadStyles(__dirname + '/../../styles/app');

/**
 * HELP
 */
app.get('/p/help', function(page, model, params, next) {
  page.render('help');
});

/**
 * HOME
 */
app.get('/p', function(page) {
   page.redirect('/p/home');
 })

app.get('/p/home', function(page, model, params, next) {

  var artistCount = model.query('artist', {$count: true});
  var objectCount = model.query('collection', {$count: true});

  // get the most recent objects
  var collectionLatestQuery = model.query('collection', {$limit: 5 , $orderby: {"_m.ctime": -1}});
  var artistLatestQuery = model.query('artist', {$limit: 5 , $orderby: {"_m.ctime": -1}});

  model.subscribe(artistCount, objectCount, collectionLatestQuery, artistLatestQuery, function onCount(err, next) {
    if (err) return next(err);

    // livedb-mongo returns count queries as an `extraSegment`  https://github.com/share/livedb-mongo/blob/v0.3.2/mongo.js#L227
    // unlike the other supported metaOperators                 https://github.com/share/livedb-mongo/blob/v0.3.2/mongo.js#L7
    // and 0.6 now allows references to `extraSegments`         https://github.com/codeparty/racer/blob/v0.6.0-alpha3/lib/Model/Query.js#L494
    artistCount.refExtra('_page.artistCount');
    objectCount.refExtra('_page.objectCount');

    collectionLatestQuery.ref('_page.collection');
    artistLatestQuery.ref('_page.artist');

    // Async functions must always run a callback. Always.
    page.render('home');
  });
});

app.use(require('./artist'));

app.use(require('./collection'));

app.use(require('./admin'));

/**
 * Controller function
 */
app.use(require('../shared/shared.js'));

// that's where all the magic happens
// centralized and easily updateable
app.use(require('../temple'));

app.proto.create = function(model) {

  /**
   * Import scripts
   */
  // application wide jquery
  require('../../public/vendor/jquery-1.9.1.min'); // the JQuery version from Derby example todos WORKS
  // NOT WORKING : require('../../public/components/jquery/dist/jquery.min'); // the Bower JQuery version does NOT work

  require('../../public/components/bootstrap/dist/js/bootstrap.min');
  // use the corrected version - none minified
  require('../../public/components/sidr/jquery.sidr');
  require('../../public/components/Keypress/keypress-2.0.3.min');

  /**
   * Search using the left temple-panel
   */
  // TODO: is the set here necessary ? With -> model.setNull('_session.search', []); -> doesn't work.
  // TODO: can we call model.on() in a composant create methode or that would
  // register many times the same trigger?
  model.on('change', '_session.search', function() {

    // debug
    console.log("_session.search has changed! " + Date());

    var searchQuery = model.get("_session.search");

    // get the most recent objects
    var searchCollectionQuery = model.query(
      'collection',
        {
          $or:
            [
              {title: {$regex: searchQuery, $options: 'i'}},
              {description: {$regex: searchQuery, $options: 'i'}},
              {yearFrom: {$regex: searchQuery, $options: 'i'}},
              {yearTo: {$regex: searchQuery, $options: 'i'}}
            ], $limit: 5
          //
        }
    ); // ,$limit: 5 , $orderby: {"_m.ctime": -1}}); // $options 'i' = case insensitive

    var searchArtistQuery = model.query(
      'artist',
      {
          $or:
            [
              {lastname: {$regex: searchQuery, $options: 'i'}},
              {firstname: {$regex: searchQuery, $options: 'i'}},
              {notes: {$regex: searchQuery, $options: 'i'}},
              {biography: {$regex: searchQuery, $options: 'i'}},
              {awards: {$regex: searchQuery, $options: 'i'}}
            ], $limit: 5
          //
        }
    ); // ,$limit: 5 , $orderby: {"_m.ctime": -1}}); // $options 'i' = case insensitive

    model.subscribe(searchCollectionQuery, searchArtistQuery, function doSearch(err, next) {
      if (err) return next(err);

      searchCollectionQuery.ref('_page.searchCollection');
      searchArtistQuery.ref('_page.searchArtist');
      // TODO: understand what's better performance-wise, ref or set... ref is dynamic
      //model.set('_page.searchCollection', searchCollectionQuery.get());
      //model.set('_page.searchArtist', searchArtistQuery.get());

      // Debug
      console.log("Search result # : "+searchCollectionQuery.get().length);

    // app.history.push('/p/search');
    });
  });
}
