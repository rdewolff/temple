var derby = require('derby');

var app = module.exports = derby.createApp('app', __filename);

if (!derby.util.isProduction) global.app = app;

app.serverUse(module, 'derby-stylus');

app.use(require('d-bootstrap'));
app.use(require('../../components/zetcom-derby-ui-forms'));

app.loadViews(__dirname + '/../../views/app');
app.loadStyles(__dirname + '/../../styles/app');

/**
 * HOME
 */
app.get('/', function(page){
  page.render('home');
});

app.use(require('./artist'));

app.use(require('./collection'));
