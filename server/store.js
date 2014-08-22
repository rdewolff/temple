var liveDbMongo = require('livedb-mongo');
var coffeeify = require('coffeeify');

module.exports = store;

function store(derby) {

  derby.use(require('racer-bundle'));

  var opts = {db: liveDbMongo(process.env.MONGO_URL + '?auto_reconnect', {safe: true})};

  var store = derby.createStore(opts);

  store.on('bundle', function(browserify) {

    // These are the required elements by the component d-comp-palette
    browserify.add([
      './public/components/jquery/dist/jquery.js',
      './public/components/jquery-ui/jquery-ui.js',
      './public/components/bootstrap/dist/js/bootstrap.js',
      './public/components/select2/select2.js',
      './public/components/jquery.inputmask/dist/inputmask/jquery.inputmask.js',
      './public/components/jquery.inputmask/dist/inputmask/jquery.inputmask.date.extensions.js',
      './public/components/jquery.inputmask/dist/inputmask/jquery.inputmask.numeric.extensions.js',
      './public/components/rating/jquery.raty.js'
    ]);

//     browserify.transform({global: true}, coffeeify);

    var pack = browserify.pack;
    browserify.pack = function(opts) {
      var detectTransform = opts.globalTransform.shift();
      opts.globalTransform.push(detectTransform);
      return pack.apply(this, arguments);
    };
  });

  return store;
}
