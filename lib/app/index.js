var app = module.exports = require('derby').createApp('app', __filename)
.use("derby-ui-boot");

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