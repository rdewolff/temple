var derby = require('derby');

var app = module.exports = derby.createApp('app', __filename);

if (!derby.util.isProduction) global.app = app;

app.serverUse(module, 'derby-stylus');

app.use(require('d-bootstrap'));

app.loadViews(__dirname + '/../../views/app');
app.loadStyles(__dirname + '/../../styles/app');

app.get('/', function(page){
  page.render('home');
});

app.get('/p/artist', function(page) {
  page.render('artistEdit');
});
