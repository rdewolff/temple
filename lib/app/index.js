var app = module.exports = require('derby').createApp('app', __filename)
.use("d-bootstrap");

// call component published as module
//app.component(require('derby-ui-boot'));
// TODO result : Error: No view name specified for component

// call component with it's view (manual call?)
app.component('dropdown', require('derby-ui-boot'));
app.component('tabs', require('derby-ui-boot'));
// TODO result : Derby can start, but when rendering :
// Error, seems like wrong usage?

app.loadViews(__dirname + '/../../views/app');
app.loadStyles(__dirname + '/../../styles/app');

app.get('/', function(page, model) {
  model.subscribe('examples.text', function(err) {
    page.render();
  });
});

app.get('/:name/:sub?', function(page, model, params, next) {
  var name = params.name;
  var sub = params.sub;
  var viewName = sub ? name + ':' + sub : name;

  page.render(viewName);
});