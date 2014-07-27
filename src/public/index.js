var derby = require('derby');

var app = module.exports = derby.createApp('public', __filename);

if (!derby.util.isProduction) global.app = app;

app.serverUse(module, 'derby-stylus');

app.use(require('d-bootstrap'));

app.loadViews(__dirname + '/../../views/public');
app.loadStyles(__dirname + '/../../styles/public');

/**
 * Home
 */
app.get('/', function(page, model, params, next) {
  page.render();
});


app.proto.create = function(model) {

  /**
   * Import scripts
   */
  // application wide jquery
  require('../../public/vendor/jquery-1.9.1.min'); // the JQuery version from Derby example todos WORKS
  // NOT WORKING : require('../../public/components/jquery/dist/jquery.min'); // the Bower JQuery version does NOT work

  require('../../public/components/bootstrap/dist/js/bootstrap.min');
  
}
