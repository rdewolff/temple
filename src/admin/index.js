var derby = require('derby');

var app = module.exports = derby.createApp('admin', __filename);

if (!derby.util.isProduction) global.app = app;

app.serverUse(module, 'derby-stylus');

app.use(require('d-bootstrap'));
app.component(require('d-connection-alert'));
app.component(require('d-before-unload'));

app.loadViews(__dirname + '/../../views/admin');
app.loadStyles(__dirname + '/../../styles/admin');

app.use(require('./properties'));

app.use(require('../shared/shared.js'));
