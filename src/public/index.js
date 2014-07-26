var derby = require('derby');

// var app = module.exports = derby.createApp('public', __filename);
var app = module.exports = derby.createApp();

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
