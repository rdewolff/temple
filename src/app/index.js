var derby = require('derby');

var app = module.exports = derby.createApp('temple', __filename);

if (!derby.util.isProduction) global.app = app;

app.serverUse(module, 'derby-stylus');

app.use(require('d-bootstrap'));
app.use(require('../../components/zetcom-derby-ui-forms'));

app.loadViews(__dirname + '/../../views/app');
app.loadStyles(__dirname + '/../../styles/app');


/**
 * HELP
 */
app.get('/help', function(page, model, params, next) {
  page.render('help');
});

/**
 * HOME
 */
app.get('/', function(page, model, params, next) {

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

app.use(require('./search'));

/**
 * Controller function
 */

// TODO: in progress. Check right methode to use
app.proto.enter = function(page, model, params, next) {



  console.log('app.proto.enter');
};

app.proto.create = function(model) {
  console.log('app.proto.create');

  require('../../public/components/jquery/dist/jquery.min');
}
